import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    ArrowLeft, Calendar, MapPin, Clock, FileText, CheckCircle,
    XCircle, User, MessageSquare, Car, CreditCard, Mail, Phone, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";
import type { Tables } from "@/integrations/supabase/types";

type BookingWithDetails = Tables<"bookings"> & {
    vehicles: Tables<"vehicles"> | null;
    profiles: Tables<"profiles"> | null;
};

export default function BookingDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { toast } = useToast();
    const { user, isAdmin } = useAuth();
    const location = useLocation();
    const isAdminView = isAdmin && location.pathname.includes("/admin");
    const [booking, setBooking] = useState<BookingWithDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [updatingParams, setUpdatingStatus] = useState(false);

    useEffect(() => {
        if (id) fetchBooking();
    }, [id]);

    async function fetchBooking() {
        const { data: bookingData, error } = await supabase
            .from("bookings")
            .select("*, vehicles(*)")
            .eq("id", id)
            .maybeSingle();

        if (error || !bookingData) {
            navigate(isAdminView ? "/admin/bookings" : "/dashboard/bookings");
            return;
        }

        let profileData = null;
        if (bookingData.user_id) {
            const { data } = await supabase.from("profiles").select("*").eq("id", bookingData.user_id).maybeSingle();
            profileData = data;
        }

        setBooking({ ...bookingData, profiles: profileData } as BookingWithDetails);
        setLoading(false);
    }

    async function updateStatus(newStatus: string) {
        setUpdatingStatus(true);
        const { error } = await supabase
            .from("bookings")
            .update({ status: newStatus as any })
            .eq("id", id);

        if (!error) {
            toast({ title: "Statut mis à jour" });
            fetchBooking();
        } else {
            toast({ title: "Erreur", description: error.message, variant: "destructive" });
        }
        setUpdatingStatus(false);
    }

    if (loading) return <div className="p-8 text-center text-muted-foreground">Chargement...</div>;
    if (!booking) return null;

    const statusStyles: Record<string, string> = {
        pending: "bg-yellow-100 text-yellow-700",
        confirmed: "bg-blue-100 text-blue-700",
        in_progress: "bg-purple-100 text-purple-700",
        completed: "bg-green-100 text-green-700",
        cancelled: "bg-red-100 text-red-700",
    };

    const statusLabels: Record<string, string> = {
        pending: "En attente",
        confirmed: "Confirmé",
        in_progress: "En cours",
        completed: "Terminé",
        cancelled: "Annulé",
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(isAdminView ? "/admin/bookings" : "/dashboard/bookings")}
                >
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="font-display text-2xl font-bold flex items-center gap-3">
                        Réservation {booking.booking_number}
                        {isAdminView ? (
                            <Select
                                value={booking.status}
                                onValueChange={updateStatus}
                                disabled={updatingParams}
                            >
                                <SelectTrigger className="w-[180px] h-8">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">En attente</SelectItem>
                                    <SelectItem value="confirmed">Confirmé</SelectItem>
                                    <SelectItem value="in_progress">En cours</SelectItem>
                                    <SelectItem value="completed">Terminé</SelectItem>
                                    <SelectItem value="cancelled">Annulé</SelectItem>
                                </SelectContent>
                            </Select>
                        ) : (
                            <span className={cn("px-3 py-1 rounded-full text-sm font-medium", statusStyles[booking.status])}>
                                {statusLabels[booking.status]}
                            </span>
                        )}
                    </h1>
                    <p className="text-muted-foreground">
                        {new Date(booking.created_at).toLocaleDateString("fr-FR", {
                            day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
                        })}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Details */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Journey Details */}
                    <div className="bg-card rounded-xl p-6 shadow-soft border border-border/50">
                        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-primary" /> Détails du trajet
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label>Départ</Label>
                                <p className="font-medium mt-1">{booking.pickup_location}</p>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                    <Calendar className="w-4 h-4" /> {booking.pickup_date}
                                    <Clock className="w-4 h-4 ml-2" /> {booking.pickup_time}
                                </div>
                            </div>
                            {booking.dropoff_location && (
                                <div>
                                    <Label>Arrivée</Label>
                                    <p className="font-medium mt-1">{booking.dropoff_location}</p>
                                    {booking.return_date && (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                            <Calendar className="w-4 h-4" /> {booking.return_date}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="mt-6 pt-6 border-t border-border grid grid-cols-2 gap-4">
                            <div>
                                <Label>Type de service</Label>
                                <p className="capitalize">{booking.service_type}</p>
                            </div>
                            <div>
                                <Label>Passagers</Label>
                                <p>{booking.passengers} personnes</p>
                            </div>
                        </div>

                        {booking.special_requests && (
                            <div className="mt-6 pt-6 border-t border-border">
                                <Label>Demandes spéciales</Label>
                                <p className="text-sm mt-1">{booking.special_requests}</p>
                            </div>
                        )}
                    </div>

                    {/* User Details (Admin Only) */}
                    {isAdminView && booking.profiles && (
                        <div className="bg-card rounded-xl p-6 shadow-soft border border-border/50">
                            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                <User className="w-5 h-5 text-primary" /> Informations Client
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Nom complet</Label>
                                    <p className="font-medium">{booking.profiles.first_name} {booking.profiles.last_name}</p>
                                </div>
                                <div>
                                    <Label>Contact</Label>
                                    <div className="space-y-1 mt-1">
                                        {(booking.phone || booking.profiles.phone) && (
                                            <p className="text-sm flex items-center gap-2"><Phone className="w-3 h-3" /> {booking.phone || booking.profiles.phone}</p>
                                        )}
                                        <p className="text-sm flex items-center gap-2"><Mail className="w-3 h-3" /> {booking.profiles.email || "Non renseigné"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">

                    {/* Vehicle Card */}
                    {booking.vehicles && (
                        <div className="bg-card rounded-xl overflow-hidden shadow-soft border border-border/50">
                            <div className="aspect-video bg-muted relative">
                                {booking.vehicles.image_url ? (
                                    <img src={booking.vehicles.image_url} alt={booking.vehicles.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-muted-foreground">No Image</div>
                                )}
                                <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                                    {booking.vehicles.category}
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-lg">{booking.vehicles.name}</h3>
                                <p className="text-sm text-muted-foreground mb-4">{booking.vehicles.type}</p>
                                <div className="flex items-center gap-2 text-primary font-medium">
                                    <Car className="w-4 h-4" />
                                    {formatCurrency(booking.vehicles.daily_rate)} / jour
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Payment Info */}
                    <div className="bg-card rounded-xl p-6 shadow-soft border border-border/50">
                        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-primary" /> Paiement
                        </h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Total</span>
                                <span className="font-semibold font-display text-lg">{formatCurrency(booking.total_amount || 0)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Acompte (30%)</span>
                                <span>{formatCurrency(booking.deposit_amount || 0)}</span>
                            </div>
                            <div className="pt-3 border-t border-border flex justify-between items-center">
                                <span className="text-sm font-medium">Statut Acompte</span>
                                <span className={cn("px-2 py-1 rounded-full text-xs font-medium", booking.deposit_paid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
                                    {booking.deposit_paid ? "Payé" : "Non payé"}
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

function Label({ children }: { children: React.ReactNode }) {
    return <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">{children}</p>;
}
