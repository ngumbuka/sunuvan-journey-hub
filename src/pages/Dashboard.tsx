import { useState, useEffect } from "react";
import { Link, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Home, Calendar, Heart, User, LogOut, Plus, ArrowRight, Clock, CheckCircle,
  XCircle, Car, MapPin, Settings as SettingsIcon, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/currency";
import type { Tables } from "@/integrations/supabase/types";

type Vehicle = Tables<"vehicles">;
type Booking = Tables<"bookings">;
type Profile = Tables<"profiles">;

// Dashboard Overview
function DashboardOverview() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState({ upcoming: 0, past: 0, favorites: 0 });

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  async function fetchData() {
    const [profileRes, bookingsRes, favoritesRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", user!.id).maybeSingle(),
      supabase.from("bookings").select("*").eq("user_id", user!.id),
      supabase.from("favorites").select("*", { count: "exact", head: true }).eq("user_id", user!.id),
    ]);

    setProfile(profileRes.data);

    const bookings = bookingsRes.data || [];
    const today = new Date().toISOString().split("T")[0];
    const upcoming = bookings.filter(b => b.pickup_date >= today && b.status !== "cancelled").length;
    const past = bookings.filter(b => b.pickup_date < today || b.status === "completed").length;

    setStats({ upcoming, past, favorites: favoritesRes.count || 0 });
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-8 text-primary-foreground">
        <h1 className="font-display text-3xl font-bold mb-2">
          {t("dashboard.welcome")}, {profile?.first_name || "Client"}!
        </h1>
        <p className="opacity-90">{t("dashboard.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: t("dashboard.upcomingTrips"), value: stats.upcoming, icon: Calendar },
          { label: t("dashboard.pastTrips"), value: stats.past, icon: CheckCircle },
          { label: t("dashboard.savedVehicles"), value: stats.favorites, icon: Heart },
        ].map((stat) => (
          <div key={stat.label} className="bg-card rounded-xl p-6 shadow-soft border border-border/50">
            <stat.icon className="w-8 h-8 text-primary mb-3" />
            <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            <p className="text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <Link to="/fleet">
          <Button variant="hero" size="lg"><Plus className="w-5 h-5 mr-2" /> {t("dashboard.newBooking")}</Button>
        </Link>
        <Link to="/dashboard/bookings">
          <Button variant="outline" size="lg"><Calendar className="w-5 h-5 mr-2" /> {t("dashboard.viewBookings")}</Button>
        </Link>
      </div>
    </div>
  );
}

// My Bookings
function MyBookings() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<(Booking & { vehicles: Vehicle | null })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchBookings();
  }, [user]);

  async function fetchBookings() {
    const { data } = await supabase
      .from("bookings")
      .select("*, vehicles(*)")
      .eq("user_id", user!.id)
      .order("pickup_date", { ascending: false });
    setBookings(data || []);
    setLoading(false);
  }

  async function cancelBooking(id: string) {
    if (confirm("Êtes-vous sûr de vouloir annuler cette réservation?")) {
      const { error } = await supabase.from("bookings").update({ status: "cancelled" }).eq("id", id);
      if (!error) {
        toast({ title: "Réservation annulée" });
        fetchBookings();
      }
    }
  }

  const statusLabels: Record<string, string> = {
    pending: "En attente",
    confirmed: "Confirmé",
    in_progress: "En cours",
    completed: "Terminé",
    cancelled: "Annulé",
  };

  const statusStyles: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    in_progress: "bg-purple-100 text-purple-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-display text-2xl font-bold">{t("dashboard.myBookings")}</h1>
        <Link to="/fleet"><Button variant="hero"><Plus className="w-4 h-4 mr-2" /> Nouvelle</Button></Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Chargement...</div>
      ) : bookings.length === 0 ? (
        <div className="bg-card rounded-xl p-12 text-center shadow-soft border border-border/50">
          <Calendar className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Aucune réservation</h3>
          <p className="text-muted-foreground mb-6">Commencez par réserver un véhicule pour votre prochain trajet</p>
          <Link to="/fleet"><Button variant="hero">Explorer la flotte</Button></Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-card rounded-xl p-6 shadow-soft border border-border/50">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Car className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{booking.vehicles?.name || "Véhicule"}</h3>
                      <span className={cn("px-2 py-0.5 rounded-full text-xs", statusStyles[booking.status])}>
                        {statusLabels[booking.status]}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {booking.booking_number} • {booking.service_type}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-primary" />
                        {booking.pickup_date} à {booking.pickup_time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-primary" />
                        {booking.pickup_location}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {booking.total_amount && (
                    <span className="font-semibold text-lg">{formatCurrency(booking.total_amount)}</span>
                  )}
                  {booking.status === "pending" && (
                    <Button variant="outline" size="sm" onClick={() => cancelBooking(booking.id)}>
                      <XCircle className="w-4 h-4 mr-1" /> Annuler
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Favorites
function Favorites() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<(Tables<"favorites"> & { vehicles: Vehicle | null })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchFavorites();
  }, [user]);

  async function fetchFavorites() {
    const { data } = await supabase
      .from("favorites")
      .select("*, vehicles(*)")
      .eq("user_id", user!.id);
    setFavorites(data || []);
    setLoading(false);
  }

  async function removeFavorite(id: string) {
    const { error } = await supabase.from("favorites").delete().eq("id", id);
    if (!error) {
      toast({ title: "Favori supprimé" });
      fetchFavorites();
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">{t("dashboard.favorites")}</h1>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Chargement...</div>
      ) : favorites.length === 0 ? (
        <div className="bg-card rounded-xl p-12 text-center shadow-soft border border-border/50">
          <Heart className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Aucun favori</h3>
          <p className="text-muted-foreground mb-6">Explorez notre flotte et ajoutez vos véhicules préférés</p>
          <Link to="/fleet"><Button variant="hero">Explorer la flotte</Button></Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((fav) => (
            <div key={fav.id} className="bg-card rounded-xl overflow-hidden shadow-soft border border-border/50">
              <div className="aspect-video bg-muted flex items-center justify-center">
                {fav.vehicles?.image_url ? (
                  <img src={fav.vehicles.image_url} alt={fav.vehicles.name} className="w-full h-full object-cover" />
                ) : (
                  <Car className="w-16 h-16 text-muted-foreground/30" />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-1">{fav.vehicles?.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {fav.vehicles?.passengers} places • {fav.vehicles?.luggage} bagages
                </p>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-primary">{formatCurrency(fav.vehicles?.daily_rate || 0)}/jour</span>
                  <Button variant="ghost" size="icon" onClick={() => removeFavorite(fav.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Profile
function ProfilePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ first_name: "", last_name: "", phone: "" });

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  async function fetchProfile() {
    const { data } = await supabase.from("profiles").select("*").eq("user_id", user!.id).maybeSingle();
    setProfile(data);
    if (data) {
      setFormData({ first_name: data.first_name || "", last_name: data.last_name || "", phone: data.phone || "" });
    }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update(formData)
      .eq("user_id", user!.id);

    setSaving(false);
    if (!error) {
      toast({ title: "Profil mis à jour" });
      fetchProfile();
    } else {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    }
  }

  if (loading) return <div className="text-center py-12">Chargement...</div>;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">{t("dashboard.profile")}</h1>

      <div className="bg-card rounded-xl p-6 shadow-soft border border-border/50 max-w-2xl">
        <h2 className="font-semibold mb-6">Informations personnelles</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Prénom</Label>
              <Input value={formData.first_name} onChange={e => setFormData({ ...formData, first_name: e.target.value })} />
            </div>
            <div>
              <Label>Nom</Label>
              <Input value={formData.last_name} onChange={e => setFormData({ ...formData, last_name: e.target.value })} />
            </div>
          </div>
          <div>
            <Label>Téléphone</Label>
            <Input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="+221 77 123 45 67" />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={user?.email || ""} disabled className="bg-muted" />
            <p className="text-xs text-muted-foreground mt-1">L'email ne peut pas être modifié</p>
          </div>
          <Button type="submit" disabled={saving}>{saving ? "Enregistrement..." : "Enregistrer"}</Button>
        </form>
      </div>
    </div>
  );
}

// Settings
function SettingsPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">{t("dashboard.settings")}</h1>
      <div className="bg-card rounded-xl p-6 shadow-soft border border-border/50 max-w-2xl">
        <h2 className="font-semibold mb-4">Langue</h2>
        <div className="flex items-center gap-4">
          <p className="text-muted-foreground">Choisissez votre langue préférée</p>
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
}

// Sidebar Link Item
const sidebarLinks = [
  { href: "/dashboard", icon: Home, label: "Aperçu" },
  { href: "/dashboard/bookings", icon: Calendar, label: "Mes Réservations" },
  { href: "/dashboard/favorites", icon: Heart, label: "Favoris" },
  { href: "/dashboard/profile", icon: User, label: "Profil" },
  { href: "/dashboard/settings", icon: SettingsIcon, label: "Paramètres" },
];

// Main Dashboard
export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, signOut, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border p-6 hidden lg:flex flex-col">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <img src="/logo.png" alt="Sunuvan" className="h-12 w-auto object-contain block" />
        </Link>

        <nav className="space-y-1 flex-1">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                location.pathname === link.href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="pt-4 border-t border-border">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            {t("nav.signOut")}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <Routes>
          <Route path="/" element={<DashboardOverview />} />
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
    </div>
  );
}
