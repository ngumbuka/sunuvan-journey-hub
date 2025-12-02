import { Link, Routes, Route, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutDashboard, Car, Calendar, Users, UserCog, Settings, LogOut, Plus, Search, MoreHorizontal, TrendingUp, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/vehicles", icon: Car, label: "Vehicles" },
  { href: "/admin/bookings", icon: Calendar, label: "Bookings" },
  { href: "/admin/users", icon: Users, label: "Users" },
  { href: "/admin/drivers", icon: UserCog, label: "Drivers" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

const mockVehicles = [
  { id: 1, name: "Mercedes V-Class", type: "Premium", status: "available", bookings: 12 },
  { id: 2, name: "Toyota Hiace", type: "Standard", status: "on-trip", bookings: 28 },
  { id: 3, name: "Ford Transit", type: "Minibus", status: "maintenance", bookings: 8 },
];

const mockBookings = [
  { id: "SV-001", client: "John Doe", vehicle: "Mercedes V-Class", date: "Dec 15", status: "confirmed", amount: "75,000 FCFA" },
  { id: "SV-002", client: "Marie Dupont", vehicle: "Toyota Hiace", date: "Dec 16", status: "pending", amount: "55,000 FCFA" },
  { id: "SV-003", client: "Ahmed Diallo", vehicle: "Ford Transit", date: "Dec 18", status: "confirmed", amount: "85,000 FCFA" },
];

function AdminOverview() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="font-display text-2xl font-bold">Admin Dashboard</h1>
        <Button variant="hero"><Plus className="w-4 h-4" /> New Booking</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Bookings", value: "156", change: "+12%", icon: Calendar },
          { label: "Active Vehicles", value: "12", change: "+2", icon: Car },
          { label: "Revenue (Month)", value: "4.2M FCFA", change: "+18%", icon: DollarSign },
          { label: "New Clients", value: "24", change: "+8%", icon: Users },
        ].map((stat) => (
          <div key={stat.label} className="bg-card rounded-xl p-6 shadow-soft">
            <div className="flex justify-between items-start mb-4">
              <stat.icon className="w-6 h-6 text-primary" />
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">{stat.change}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl shadow-soft">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <h2 className="font-semibold">Recent Bookings</h2>
            <Link to="/admin/bookings"><Button variant="ghost" size="sm">View All</Button></Link>
          </div>
          <div className="divide-y divide-border">
            {mockBookings.map((b) => (
              <div key={b.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{b.client}</p>
                  <p className="text-sm text-muted-foreground">{b.vehicle} • {b.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{b.amount}</p>
                  <span className={cn("text-xs px-2 py-0.5 rounded-full", b.status === "confirmed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700")}>{b.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl shadow-soft">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <h2 className="font-semibold">Fleet Status</h2>
            <Link to="/admin/vehicles"><Button variant="ghost" size="sm">View All</Button></Link>
          </div>
          <div className="divide-y divide-border">
            {mockVehicles.map((v) => (
              <div key={v.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{v.name}</p>
                  <p className="text-sm text-muted-foreground">{v.type} • {v.bookings} bookings</p>
                </div>
                <span className={cn("text-xs px-2 py-1 rounded-full capitalize", 
                  v.status === "available" && "bg-green-100 text-green-700",
                  v.status === "on-trip" && "bg-blue-100 text-blue-700",
                  v.status === "maintenance" && "bg-red-100 text-red-700"
                )}>{v.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function VehicleManagement() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-display text-2xl font-bold">Vehicle Management</h1>
        <Button variant="hero"><Plus className="w-4 h-4" /> Add Vehicle</Button>
      </div>
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search vehicles..." className="pl-10" />
        </div>
      </div>
      <div className="bg-card rounded-xl shadow-soft overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-medium">Vehicle</th>
              <th className="text-left p-4 font-medium">Type</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="text-left p-4 font-medium">Bookings</th>
              <th className="text-right p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {mockVehicles.map((v) => (
              <tr key={v.id} className="hover:bg-muted/30">
                <td className="p-4 font-medium">{v.name}</td>
                <td className="p-4 text-muted-foreground">{v.type}</td>
                <td className="p-4">
                  <span className={cn("text-xs px-2 py-1 rounded-full capitalize",
                    v.status === "available" && "bg-green-100 text-green-700",
                    v.status === "on-trip" && "bg-blue-100 text-blue-700",
                    v.status === "maintenance" && "bg-red-100 text-red-700"
                  )}>{v.status}</span>
                </td>
                <td className="p-4">{v.bookings}</td>
                <td className="p-4 text-right">
                  <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <aside className="w-64 bg-secondary text-secondary-foreground p-6 hidden lg:flex flex-col">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-display font-bold text-xl">S</span>
          </div>
          <span className="font-display text-xl font-semibold">Admin</span>
        </Link>

        <nav className="space-y-1 flex-1">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                location.pathname === link.href
                  ? "bg-primary/20 text-primary"
                  : "text-secondary-foreground/70 hover:bg-secondary-foreground/10 hover:text-secondary-foreground"
              )}
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </Link>
          ))}
        </nav>

        <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-secondary-foreground/70 hover:bg-secondary-foreground/10 transition-colors">
          <LogOut className="w-5 h-5" />
          Exit Admin
        </Link>
      </aside>

      <main className="flex-1 p-8 overflow-auto">
        <Routes>
          <Route path="/" element={<AdminOverview />} />
          <Route path="/vehicles" element={<VehicleManagement />} />
          <Route path="/bookings" element={<div className="text-center py-20 text-muted-foreground">Booking management coming soon</div>} />
          <Route path="/users" element={<div className="text-center py-20 text-muted-foreground">User management coming soon</div>} />
          <Route path="/drivers" element={<div className="text-center py-20 text-muted-foreground">Driver management coming soon</div>} />
          <Route path="/settings" element={<div className="text-center py-20 text-muted-foreground">Settings coming soon</div>} />
        </Routes>
      </main>
    </div>
  );
}
