import { Link, Routes, Route, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Calendar, Heart, User, LogOut, Plus, ArrowRight, Clock, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { href: "/dashboard", icon: Home, label: "Overview" },
  { href: "/dashboard/bookings", icon: Calendar, label: "My Bookings" },
  { href: "/dashboard/favorites", icon: Heart, label: "Favorites" },
  { href: "/dashboard/profile", icon: User, label: "Profile" },
];

const mockBookings = [
  { id: "SV-001", vehicle: "Mercedes V-Class", date: "Dec 15, 2025", status: "confirmed", route: "AIBD → Dakar" },
  { id: "SV-002", vehicle: "Toyota Hiace", date: "Dec 20, 2025", status: "pending", route: "Dakar → Saly" },
  { id: "SV-003", vehicle: "Ford Transit", date: "Nov 28, 2025", status: "completed", route: "Saint-Louis Tour" },
];

function DashboardOverview() {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-gold rounded-2xl p-8 text-primary-foreground">
        <h1 className="font-display text-3xl font-bold mb-2">Welcome back, John!</h1>
        <p className="opacity-90">Manage your bookings and plan your next journey with Sunuvan.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Upcoming Trips", value: "2", icon: Calendar },
          { label: "Past Trips", value: "5", icon: CheckCircle },
          { label: "Saved Vehicles", value: "3", icon: Heart },
        ].map((stat) => (
          <div key={stat.label} className="bg-card rounded-xl p-6 shadow-soft">
            <stat.icon className="w-8 h-8 text-primary mb-3" />
            <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            <p className="text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl shadow-soft">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h2 className="font-display text-xl font-semibold">Recent Bookings</h2>
          <Link to="/dashboard/bookings">
            <Button variant="ghost" size="sm">View All <ArrowRight className="w-4 h-4" /></Button>
          </Link>
        </div>
        <div className="divide-y divide-border">
          {mockBookings.slice(0, 3).map((booking) => (
            <div key={booking.id} className="p-6 flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{booking.vehicle}</p>
                <p className="text-sm text-muted-foreground">{booking.route} • {booking.date}</p>
              </div>
              <span className={cn(
                "px-3 py-1 rounded-full text-xs font-medium",
                booking.status === "confirmed" && "bg-green-100 text-green-700",
                booking.status === "pending" && "bg-yellow-100 text-yellow-700",
                booking.status === "completed" && "bg-muted text-muted-foreground"
              )}>
                {booking.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Link to="/fleet">
        <Button variant="hero" size="lg"><Plus className="w-5 h-5" /> New Booking</Button>
      </Link>
    </div>
  );
}

function MyBookings() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">My Bookings</h1>
      <div className="bg-card rounded-xl shadow-soft divide-y divide-border">
        {mockBookings.map((booking) => (
          <div key={booking.id} className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">{booking.vehicle}</p>
                <p className="text-sm text-muted-foreground">{booking.id} • {booking.route}</p>
                <p className="text-sm text-muted-foreground">{booking.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={cn(
                "px-3 py-1 rounded-full text-xs font-medium capitalize",
                booking.status === "confirmed" && "bg-green-100 text-green-700",
                booking.status === "pending" && "bg-yellow-100 text-yellow-700",
                booking.status === "completed" && "bg-muted text-muted-foreground"
              )}>
                {booking.status}
              </span>
              <Button variant="outline" size="sm">View Details</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border p-6 hidden lg:block">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center">
            <span className="text-primary-foreground font-display font-bold text-xl">S</span>
          </div>
          <span className="font-display text-xl font-semibold">Sunuvan</span>
        </Link>

        <nav className="space-y-1">
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

        <div className="mt-auto pt-8 border-t border-border">
          <Link to="/auth" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <LogOut className="w-5 h-5" />
            Sign Out
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <Routes>
          <Route path="/" element={<DashboardOverview />} />
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/favorites" element={<div className="text-center py-20 text-muted-foreground">Favorites coming soon</div>} />
          <Route path="/profile" element={<div className="text-center py-20 text-muted-foreground">Profile settings coming soon</div>} />
        </Routes>
      </main>
    </div>
  );
}
