-- 1. Create Role Enum
DO $$ BEGIN
    CREATE TYPE app_role AS ENUM ('admin', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  role app_role DEFAULT 'user'::app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, role)
);

-- 3. Enable Security
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'user_roles' AND policyname = 'Users can read own role') THEN
    CREATE POLICY "Users can read own role" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;

-- 5. Helper Function for Role Checks
CREATE OR REPLACE FUNCTION public.custom_has_role(_role public.app_role)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = _role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

----------------------------------------------------------------
-- 6. Table Definitions (Safe/Idempotent)

-- Vehicles
CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  category TEXT NOT NULL,
  daily_rate NUMERIC NOT NULL,
  passengers INTEGER DEFAULT 4,
  luggage INTEGER DEFAULT 2,
  description TEXT,
  image_url TEXT,
  status TEXT DEFAULT 'available',
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure columns exist (handling side cases if table existed before)
DO $$ BEGIN
  ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS image_url TEXT;
  ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS description TEXT;
  ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
END $$;

-- Drivers
CREATE TABLE IF NOT EXISTS public.drivers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  photo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  rating NUMERIC DEFAULT 5.0,
  total_trips INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Profiles (Users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  preferred_language TEXT DEFAULT 'fr',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Bookings
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_number TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  vehicle_id UUID REFERENCES public.vehicles(id),
  driver_id UUID REFERENCES public.drivers(id),
  pickup_location TEXT NOT NULL,
  dropoff_location TEXT,
  pickup_date DATE NOT NULL,
  pickup_time TIME NOT NULL,
  return_date DATE,
  status TEXT DEFAULT 'pending', 
  total_amount NUMERIC,
  deposit_amount NUMERIC,
  deposit_paid BOOLEAN DEFAULT false,
  service_type TEXT DEFAULT 'rental',
  passengers INTEGER,
  special_requests TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Contact Messages
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  service_interest TEXT,
  pickup_location TEXT,
  dropoff_location TEXT,
  travel_dates TEXT,
  passengers INTEGER,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

----------------------------------------------------------------
-- Policies

-- Vehicles Policies
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public view vehicles" ON public.vehicles;
CREATE POLICY "Public view vehicles" ON public.vehicles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins manage vehicles" ON public.vehicles;
CREATE POLICY "Admins manage vehicles" ON public.vehicles FOR ALL USING (public.custom_has_role('admin'));

-- Drivers Policies
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public view drivers" ON public.drivers;
CREATE POLICY "Public view drivers" ON public.drivers FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins manage drivers" ON public.drivers;
CREATE POLICY "Admins manage drivers" ON public.drivers FOR ALL USING (public.custom_has_role('admin'));

-- Bookings Policies
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users own bookings" ON public.bookings;
CREATE POLICY "Users own bookings" ON public.bookings FOR ALL USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins manage bookings" ON public.bookings;
CREATE POLICY "Admins manage bookings" ON public.bookings FOR ALL USING (public.custom_has_role('admin'));

-- Profiles Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users view own profile" ON public.profiles;
-- FIX: Profiles table uses 'id' as the user identifier (foreign key to auth.users), not 'user_id'
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Admins view all profiles" ON public.profiles;
CREATE POLICY "Admins view all profiles" ON public.profiles FOR SELECT USING (public.custom_has_role('admin'));

-- Messages Policies
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public insert messages" ON public.contact_messages;
CREATE POLICY "Public insert messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admins manage messages" ON public.contact_messages;
CREATE POLICY "Admins manage messages" ON public.contact_messages FOR ALL USING (public.custom_has_role('admin'));

----------------------------------------------------------------
-- Storage Buckets (REQUIRED for Image Upload)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('vehicle-images', 'vehicle-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'vehicle-images' );

DROP POLICY IF EXISTS "Admin Upload" ON storage.objects;
CREATE POLICY "Admin Upload" ON storage.objects FOR INSERT WITH CHECK ( 
  bucket_id = 'vehicle-images' AND public.custom_has_role('admin') 
);

DROP POLICY IF EXISTS "Admin Delete" ON storage.objects;
CREATE POLICY "Admin Delete" ON storage.objects FOR DELETE USING ( 
  bucket_id = 'vehicle-images' AND public.custom_has_role('admin') 
);
