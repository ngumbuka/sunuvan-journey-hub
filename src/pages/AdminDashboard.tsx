import { useState, useEffect } from "react";
import { Link, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { 
  LayoutDashboard, Car, Calendar, Users, UserCog, Settings, LogOut, Plus, Search, 
  MoreHorizontal, TrendingUp, DollarSign, Eye, Pencil, Trash2, X, Mail, BarChart3,
  MessageSquare, CheckCircle, Clock, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

type Vehicle = Tables<"vehicles">;
type Booking = Tables<"bookings">;
type Driver = Tables<"drivers">;
type Profile = Tables<"profiles">;
type ContactMessage = Tables<"contact_messages">;

const sidebarLinks = [
  { href: "/admin", icon: LayoutDashboard, label: "Tableau de bord" },
  { href: "/admin/vehicles", icon: Car, label: "Véhicules" },
  { href: "/admin/bookings", icon: Calendar, label: "Réservations" },
  { href: "/admin/users", icon: Users, label: "Utilisateurs" },
  { href: "/admin/drivers", icon: UserCog, label: "Chauffeurs" },
  { href: "/admin/messages", icon: MessageSquare, label: "Messages" },
  { href: "/admin/analytics", icon: BarChart3, label: "Analytiques" },
  { href: "/admin/settings", icon: Settings, label: "Paramètres" },
];

// Admin Overview Component
function AdminOverview() {
  const { t } = useTranslation();
  const [stats, setStats] = useState({ bookings: 0, vehicles: 0, users: 0, messages: 0 });
  const [recentBookings, setRecentBookings] = useState<(Booking & { vehicles: Vehicle | null })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [bookingsRes, vehiclesRes, usersRes, messagesRes, recentRes] = await Promise.all([
        supabase.from("bookings").select("*", { count: "exact", head: true }),
        supabase.from("vehicles").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("is_read", false),
        supabase.from("bookings").select("*, vehicles(*)").order("created_at", { ascending: false }).limit(5),
      ]);

      setStats({
        bookings: bookingsRes.count || 0,
        vehicles: vehiclesRes.count || 0,
        users: usersRes.count || 0,
        messages: messagesRes.count || 0,
      });
      setRecentBookings(recentRes.data || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  const statCards = [
    { label: "Total Réservations", value: stats.bookings, icon: Calendar, color: "text-primary" },
    { label: "Véhicules", value: stats.vehicles, icon: Car, color: "text-secondary" },
    { label: "Utilisateurs", value: stats.users, icon: Users, color: "text-accent" },
    { label: "Messages non lus", value: stats.messages, icon: Mail, color: "text-destructive" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="font-display text-2xl font-bold">{t("admin.dashboard")}</h1>
        <Link to="/admin/bookings">
          <Button variant="hero"><Plus className="w-4 h-4 mr-2" /> Nouvelle Réservation</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-card rounded-xl p-6 shadow-soft border border-border/50">
            <div className="flex justify-between items-start mb-4">
              <stat.icon className={cn("w-8 h-8", stat.color)} />
            </div>
            <p className="text-3xl font-bold text-foreground">{loading ? "..." : stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl shadow-soft border border-border/50">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h2 className="font-semibold text-lg">Réservations Récentes</h2>
          <Link to="/admin/bookings"><Button variant="ghost" size="sm">Voir tout</Button></Link>
        </div>
        <div className="divide-y divide-border">
          {recentBookings.map((b) => (
            <div key={b.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{b.booking_number}</p>
                <p className="text-sm text-muted-foreground">{b.vehicles?.name} • {b.pickup_date}</p>
              </div>
              <StatusBadge status={b.status} />
            </div>
          ))}
          {recentBookings.length === 0 && !loading && (
            <p className="p-6 text-center text-muted-foreground">Aucune réservation</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Vehicle Management Component
function VehicleManagement() {
  const { toast } = useToast();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState<TablesInsert<"vehicles">>({
    name: "", type: "", category: "standard", daily_rate: 0, passengers: 8, luggage: 4, description: ""
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  async function fetchVehicles() {
    const { data } = await supabase.from("vehicles").select("*").order("created_at", { ascending: false });
    setVehicles(data || []);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingVehicle) {
      const { error } = await supabase.from("vehicles").update(formData as TablesUpdate<"vehicles">).eq("id", editingVehicle.id);
      if (!error) {
        toast({ title: "Véhicule mis à jour" });
        fetchVehicles();
        setIsDialogOpen(false);
        resetForm();
      }
    } else {
      const { error } = await supabase.from("vehicles").insert(formData);
      if (!error) {
        toast({ title: "Véhicule ajouté" });
        fetchVehicles();
        setIsDialogOpen(false);
        resetForm();
      }
    }
  }

  async function handleDelete(id: string) {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce véhicule?")) {
      const { error } = await supabase.from("vehicles").delete().eq("id", id);
      if (!error) {
        toast({ title: "Véhicule supprimé" });
        fetchVehicles();
      }
    }
  }

  function resetForm() {
    setFormData({ name: "", type: "", category: "standard", daily_rate: 0, passengers: 8, luggage: 4, description: "" });
    setEditingVehicle(null);
  }

  function openEdit(v: Vehicle) {
    setEditingVehicle(v);
    setFormData({ name: v.name, type: v.type, category: v.category, daily_rate: v.daily_rate, passengers: v.passengers, luggage: v.luggage, description: v.description || "" });
    setIsDialogOpen(true);
  }

  const filtered = vehicles.filter(v => v.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-display text-2xl font-bold">Gestion des Véhicules</h1>
        <Dialog open={isDialogOpen} onOpenChange={(o) => { setIsDialogOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button variant="hero"><Plus className="w-4 h-4 mr-2" /> Ajouter</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingVehicle ? "Modifier le véhicule" : "Ajouter un véhicule"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Nom</Label><Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required /></div>
                <div><Label>Type</Label><Input value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} required /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Catégorie</Label>
                  <Select value={formData.category} onValueChange={v => setFormData({...formData, category: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="economy">Économique</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="luxury">Luxe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Tarif journalier (FCFA)</Label><Input type="number" value={formData.daily_rate} onChange={e => setFormData({...formData, daily_rate: Number(e.target.value)})} required /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Passagers</Label><Input type="number" value={formData.passengers} onChange={e => setFormData({...formData, passengers: Number(e.target.value)})} /></div>
                <div><Label>Bagages</Label><Input type="number" value={formData.luggage} onChange={e => setFormData({...formData, luggage: Number(e.target.value)})} /></div>
              </div>
              <div><Label>Description</Label><Textarea value={formData.description || ""} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
              <Button type="submit" className="w-full">{editingVehicle ? "Mettre à jour" : "Ajouter"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Rechercher..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="bg-card rounded-xl shadow-soft overflow-hidden border border-border/50">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-medium">Véhicule</th>
              <th className="text-left p-4 font-medium">Type</th>
              <th className="text-left p-4 font-medium">Catégorie</th>
              <th className="text-left p-4 font-medium">Tarif/jour</th>
              <th className="text-left p-4 font-medium">Statut</th>
              <th className="text-right p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((v) => (
              <tr key={v.id} className="hover:bg-muted/30">
                <td className="p-4 font-medium">{v.name}</td>
                <td className="p-4 text-muted-foreground">{v.type}</td>
                <td className="p-4"><span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs capitalize">{v.category}</span></td>
                <td className="p-4">{v.daily_rate.toLocaleString()} FCFA</td>
                <td className="p-4"><VehicleStatusBadge status={v.status} /></td>
                <td className="p-4 text-right space-x-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(v)}><Pencil className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(v.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="p-8 text-center text-muted-foreground">Aucun véhicule trouvé</p>}
      </div>
    </div>
  );
}

// Booking Management Component
function BookingManagement() {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<(Booking & { vehicles: Vehicle | null })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    const { data } = await supabase.from("bookings").select("*, vehicles(*)").order("created_at", { ascending: false });
    setBookings(data || []);
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase.from("bookings").update({ status: status as any }).eq("id", id);
    if (!error) {
      toast({ title: "Statut mis à jour" });
      fetchBookings();
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">Gestion des Réservations</h1>
      
      <div className="bg-card rounded-xl shadow-soft overflow-hidden border border-border/50">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-medium">N° Réservation</th>
              <th className="text-left p-4 font-medium">Véhicule</th>
              <th className="text-left p-4 font-medium">Date</th>
              <th className="text-left p-4 font-medium">Lieu</th>
              <th className="text-left p-4 font-medium">Statut</th>
              <th className="text-right p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {bookings.map((b) => (
              <tr key={b.id} className="hover:bg-muted/30">
                <td className="p-4 font-medium">{b.booking_number}</td>
                <td className="p-4">{b.vehicles?.name || "N/A"}</td>
                <td className="p-4">{b.pickup_date} {b.pickup_time}</td>
                <td className="p-4 text-sm">{b.pickup_location}</td>
                <td className="p-4">
                  <Select value={b.status} onValueChange={(v) => updateStatus(b.id, v)}>
                    <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="confirmed">Confirmé</SelectItem>
                      <SelectItem value="in_progress">En cours</SelectItem>
                      <SelectItem value="completed">Terminé</SelectItem>
                      <SelectItem value="cancelled">Annulé</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-4 text-right">
                  <Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {bookings.length === 0 && !loading && <p className="p-8 text-center text-muted-foreground">Aucune réservation</p>}
      </div>
    </div>
  );
}

// Driver Management Component
function DriverManagement() {
  const { toast } = useToast();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [formData, setFormData] = useState<TablesInsert<"drivers">>({ first_name: "", last_name: "", phone: "", email: "" });

  useEffect(() => { fetchDrivers(); }, []);

  async function fetchDrivers() {
    const { data } = await supabase.from("drivers").select("*").order("created_at", { ascending: false });
    setDrivers(data || []);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingDriver) {
      const { error } = await supabase.from("drivers").update(formData as TablesUpdate<"drivers">).eq("id", editingDriver.id);
      if (!error) { toast({ title: "Chauffeur mis à jour" }); fetchDrivers(); setIsDialogOpen(false); resetForm(); }
    } else {
      const { error } = await supabase.from("drivers").insert(formData);
      if (!error) { toast({ title: "Chauffeur ajouté" }); fetchDrivers(); setIsDialogOpen(false); resetForm(); }
    }
  }

  async function handleDelete(id: string) {
    if (confirm("Supprimer ce chauffeur?")) {
      const { error } = await supabase.from("drivers").delete().eq("id", id);
      if (!error) { toast({ title: "Chauffeur supprimé" }); fetchDrivers(); }
    }
  }

  function resetForm() { setFormData({ first_name: "", last_name: "", phone: "", email: "" }); setEditingDriver(null); }

  function openEdit(d: Driver) {
    setEditingDriver(d);
    setFormData({ first_name: d.first_name, last_name: d.last_name, phone: d.phone, email: d.email || "" });
    setIsDialogOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-display text-2xl font-bold">Gestion des Chauffeurs</h1>
        <Dialog open={isDialogOpen} onOpenChange={(o) => { setIsDialogOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild><Button variant="hero"><Plus className="w-4 h-4 mr-2" /> Ajouter</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editingDriver ? "Modifier" : "Ajouter"} un chauffeur</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Prénom</Label><Input value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} required /></div>
                <div><Label>Nom</Label><Input value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} required /></div>
              </div>
              <div><Label>Téléphone</Label><Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required /></div>
              <div><Label>Email</Label><Input type="email" value={formData.email || ""} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
              <Button type="submit" className="w-full">{editingDriver ? "Mettre à jour" : "Ajouter"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-xl shadow-soft overflow-hidden border border-border/50">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-medium">Nom</th>
              <th className="text-left p-4 font-medium">Téléphone</th>
              <th className="text-left p-4 font-medium">Email</th>
              <th className="text-left p-4 font-medium">Note</th>
              <th className="text-left p-4 font-medium">Statut</th>
              <th className="text-right p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {drivers.map((d) => (
              <tr key={d.id} className="hover:bg-muted/30">
                <td className="p-4 font-medium">{d.first_name} {d.last_name}</td>
                <td className="p-4">{d.phone}</td>
                <td className="p-4 text-muted-foreground">{d.email || "-"}</td>
                <td className="p-4">⭐ {d.rating}</td>
                <td className="p-4"><span className={cn("px-2 py-1 rounded-full text-xs", d.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>{d.is_active ? "Actif" : "Inactif"}</span></td>
                <td className="p-4 text-right space-x-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(d)}><Pencil className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(d.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {drivers.length === 0 && !loading && <p className="p-8 text-center text-muted-foreground">Aucun chauffeur</p>}
      </div>
    </div>
  );
}

// User Management Component
function UserManagement() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      setUsers(data || []);
      setLoading(false);
    }
    fetchUsers();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">Gestion des Utilisateurs</h1>
      <div className="bg-card rounded-xl shadow-soft overflow-hidden border border-border/50">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-medium">Nom</th>
              <th className="text-left p-4 font-medium">Téléphone</th>
              <th className="text-left p-4 font-medium">Langue</th>
              <th className="text-left p-4 font-medium">Inscrit le</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-muted/30">
                <td className="p-4 font-medium">{u.first_name} {u.last_name}</td>
                <td className="p-4">{u.phone || "-"}</td>
                <td className="p-4">{u.preferred_language?.toUpperCase()}</td>
                <td className="p-4 text-muted-foreground">{new Date(u.created_at).toLocaleDateString("fr-FR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && !loading && <p className="p-8 text-center text-muted-foreground">Aucun utilisateur</p>}
      </div>
    </div>
  );
}

// Messages Component
function MessagesManagement() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchMessages(); }, []);

  async function fetchMessages() {
    const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
    setMessages(data || []);
    setLoading(false);
  }

  async function markAsRead(id: string) {
    await supabase.from("contact_messages").update({ is_read: true }).eq("id", id);
    toast({ title: "Marqué comme lu" });
    fetchMessages();
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">Messages de Contact</h1>
      <div className="space-y-4">
        {messages.map((m) => (
          <div key={m.id} className={cn("bg-card rounded-xl p-6 shadow-soft border", m.is_read ? "border-border/50" : "border-accent")}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold">{m.name}</h3>
                <p className="text-sm text-muted-foreground">{m.email} • {m.phone}</p>
              </div>
              <div className="flex items-center gap-2">
                {!m.is_read && <span className="px-2 py-1 bg-accent text-accent-foreground text-xs rounded-full">Nouveau</span>}
                <span className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleDateString("fr-FR")}</span>
              </div>
            </div>
            {m.service_interest && <p className="text-sm mb-2"><strong>Service:</strong> {m.service_interest}</p>}
            {m.pickup_location && <p className="text-sm mb-2"><strong>Trajet:</strong> {m.pickup_location} → {m.dropoff_location}</p>}
            <p className="text-foreground mb-4">{m.message}</p>
            {!m.is_read && <Button size="sm" onClick={() => markAsRead(m.id)}>Marquer comme lu</Button>}
          </div>
        ))}
        {messages.length === 0 && !loading && <p className="text-center text-muted-foreground py-8">Aucun message</p>}
      </div>
    </div>
  );
}

// Analytics Component
function AnalyticsDashboard() {
  const [stats, setStats] = useState({ pending: 0, confirmed: 0, completed: 0, cancelled: 0 });

  useEffect(() => {
    async function fetchStats() {
      const { data } = await supabase.from("bookings").select("status");
      if (data) {
        const counts = data.reduce((acc, b) => { acc[b.status] = (acc[b.status] || 0) + 1; return acc; }, {} as any);
        setStats({ pending: counts.pending || 0, confirmed: counts.confirmed || 0, completed: counts.completed || 0, cancelled: counts.cancelled || 0 });
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">Analytiques</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard icon={Clock} label="En attente" value={stats.pending} color="text-yellow-600" bg="bg-yellow-100" />
        <StatCard icon={CheckCircle} label="Confirmés" value={stats.confirmed} color="text-blue-600" bg="bg-blue-100" />
        <StatCard icon={TrendingUp} label="Terminés" value={stats.completed} color="text-green-600" bg="bg-green-100" />
        <StatCard icon={AlertCircle} label="Annulés" value={stats.cancelled} color="text-red-600" bg="bg-red-100" />
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, bg }: any) {
  return (
    <div className="bg-card rounded-xl p-6 shadow-soft border border-border/50">
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", bg)}>
        <Icon className={cn("w-6 h-6", color)} />
      </div>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

// Settings Component
function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">Paramètres</h1>
      <div className="bg-card rounded-xl p-6 shadow-soft border border-border/50">
        <h2 className="font-semibold mb-4">Configuration du système</h2>
        <p className="text-muted-foreground">Les paramètres avancés seront disponibles prochainement.</p>
      </div>
    </div>
  );
}

// Helper Components
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    in_progress: "bg-purple-100 text-purple-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };
  const labels: Record<string, string> = {
    pending: "En attente",
    confirmed: "Confirmé",
    in_progress: "En cours",
    completed: "Terminé",
    cancelled: "Annulé",
  };
  return <span className={cn("px-2 py-1 rounded-full text-xs", styles[status])}>{labels[status]}</span>;
}

function VehicleStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    available: "bg-green-100 text-green-700",
    on_trip: "bg-blue-100 text-blue-700",
    maintenance: "bg-orange-100 text-orange-700",
    unavailable: "bg-red-100 text-red-700",
  };
  const labels: Record<string, string> = { available: "Disponible", on_trip: "En course", maintenance: "Maintenance", unavailable: "Indisponible" };
  return <span className={cn("px-2 py-1 rounded-full text-xs", styles[status])}>{labels[status]}</span>;
}

// Main Admin Dashboard
export default function AdminDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/auth");
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <aside className="w-64 bg-primary text-primary-foreground p-6 hidden lg:flex flex-col">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
            <span className="text-accent-foreground font-display font-bold text-xl">S</span>
          </div>
          <span className="font-display text-xl font-semibold">Admin</span>
        </Link>

        <nav className="space-y-1 flex-1">
          {sidebarLinks.map((link) => (
            <Link key={link.href} to={link.href} className={cn("flex items-center gap-3 px-4 py-3 rounded-lg transition-colors", location.pathname === link.href ? "bg-accent text-accent-foreground" : "text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground")}>
              <link.icon className="w-5 h-5" />{link.label}
            </Link>
          ))}
        </nav>

        <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-primary-foreground/70 hover:bg-primary-foreground/10 transition-colors">
          <LogOut className="w-5 h-5" />Quitter
        </Link>
      </aside>

      <main className="flex-1 p-8 overflow-auto">
        <Routes>
          <Route path="/" element={<AdminOverview />} />
          <Route path="/vehicles" element={<VehicleManagement />} />
          <Route path="/bookings" element={<BookingManagement />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/drivers" element={<DriverManagement />} />
          <Route path="/messages" element={<MessagesManagement />} />
          <Route path="/analytics" element={<AnalyticsDashboard />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
    </div>
  );
}
