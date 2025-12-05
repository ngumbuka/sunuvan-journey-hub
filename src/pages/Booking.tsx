import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Calendar, Clock, MapPin, Users, Briefcase, ArrowLeft, Heart,
  Snowflake, Wifi, Usb, Droplets, Check, ChevronRight
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Vehicle = Tables<"vehicles">;

const amenityIcons: Record<string, { icon: typeof Snowflake; label: string }> = {
  ac: { icon: Snowflake, label: "Climatisation" },
  wifi: { icon: Wifi, label: "WiFi" },
  usb: { icon: Usb, label: "Chargeur USB" },
  water: { icon: Droplets, label: "Eau fraîche" },
};

const serviceTypes = [
  { id: "transfer", label: "Transfert aéroport", description: "Aller simple vers/depuis l'aéroport" },
  { id: "daily", label: "Location journalière", description: "Avec chauffeur pour la journée" },
  { id: "tour", label: "Excursion", description: "Visite guidée avec chauffeur" },
  { id: "event", label: "Événement", description: "Mariage, conférence, etc." },
];

export default function Booking() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const vehicleId = searchParams.get("vehicle");

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const [formData, setFormData] = useState({
    service_type: "",
    pickup_date: "",
    pickup_time: "",
    return_date: "",
    pickup_location: "",
    dropoff_location: "",
    passengers: 1,
    special_requests: "",
  });

  useEffect(() => {
    if (vehicleId) {
      fetchVehicle();
      if (user) checkFavorite();
    }
  }, [vehicleId, user]);

  async function fetchVehicle() {
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("id", vehicleId)
      .maybeSingle();

    if (error || !data) {
      toast({ title: "Véhicule non trouvé", variant: "destructive" });
      navigate("/fleet");
      return;
    }
    setVehicle(data);
    setLoading(false);
  }

  async function checkFavorite() {
    if (!user || !vehicleId) return;
    const { data } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("vehicle_id", vehicleId)
      .maybeSingle();
    setIsFavorite(!!data);
  }

  async function toggleFavorite() {
    if (!user) {
      toast({ title: "Connectez-vous pour ajouter aux favoris" });
      navigate("/auth");
      return;
    }

    if (isFavorite) {
      await supabase.from("favorites").delete().eq("user_id", user.id).eq("vehicle_id", vehicleId!);
      setIsFavorite(false);
      toast({ title: "Retiré des favoris" });
    } else {
      await supabase.from("favorites").insert({ user_id: user.id, vehicle_id: vehicleId! });
      setIsFavorite(true);
      toast({ title: "Ajouté aux favoris" });
    }
  }

  function calculateTotal() {
    if (!vehicle || !formData.pickup_date) return 0;

    const startDate = new Date(formData.pickup_date);
    const endDate = formData.return_date ? new Date(formData.return_date) : startDate;
    const days = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1);

    return vehicle.daily_rate * days;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!user) {
      toast({ title: "Veuillez vous connecter", description: "Vous devez être connecté pour réserver" });
      navigate("/auth");
      return;
    }

    if (!formData.service_type || !formData.pickup_date || !formData.pickup_time || !formData.pickup_location) {
      toast({ title: "Informations manquantes", description: "Veuillez remplir tous les champs obligatoires", variant: "destructive" });
      return;
    }

    setSubmitting(true);

    const totalAmount = calculateTotal();
    const depositAmount = Math.round(totalAmount * 0.3);

    const { error } = await supabase.from("bookings").insert({
      user_id: user.id,
      vehicle_id: vehicleId,
      service_type: formData.service_type,
      pickup_date: formData.pickup_date,
      pickup_time: formData.pickup_time,
      return_date: formData.return_date || null,
      pickup_location: formData.pickup_location,
      dropoff_location: formData.dropoff_location || null,
      passengers: formData.passengers,
      special_requests: formData.special_requests || null,
      total_amount: totalAmount,
      deposit_amount: depositAmount,
      status: "pending" as const,
    } as any);

    setSubmitting(false);

    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Réservation créée!", description: "Votre demande a été envoyée avec succès" });
    navigate("/dashboard/bookings");
  }

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!vehicle) return null;

  const totalAmount = calculateTotal();
  const depositAmount = Math.round(totalAmount * 0.3);

  return (
    <Layout>
      {/* Header */}
      <section className="py-8 bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/fleet" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            Retour à la flotte
          </Link>

          {/* Progress Steps */}
          <div className="flex items-center gap-4 mt-6">
            {[
              { num: 1, label: "Service" },
              { num: 2, label: "Détails" },
              { num: 3, label: "Confirmation" },
            ].map((s, i) => (
              <div key={s.num} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= s.num ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                  {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                </div>
                <span className={`ml-2 text-sm hidden sm:inline ${step >= s.num ? "text-foreground" : "text-muted-foreground"}`}>
                  {s.label}
                </span>
                {i < 2 && <ChevronRight className="w-4 h-4 text-muted-foreground mx-2" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Step 1: Service Type */}
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-card rounded-2xl p-6 shadow-soft border border-border/50"
                  >
                    <h2 className="font-display text-xl font-semibold mb-6">Type de service</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {serviceTypes.map((service) => (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, service_type: service.id })}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${formData.service_type === service.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                            }`}
                        >
                          <h3 className="font-semibold mb-1">{service.label}</h3>
                          <p className="text-sm text-muted-foreground">{service.description}</p>
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-end mt-6">
                      <Button
                        type="button"
                        onClick={() => setStep(2)}
                        disabled={!formData.service_type}
                        variant="hero"
                      >
                        Continuer <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Trip Details */}
                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-card rounded-2xl p-6 shadow-soft border border-border/50"
                  >
                    <h2 className="font-display text-xl font-semibold mb-6">Détails du trajet</h2>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="pickup_date">Date de prise en charge *</Label>
                          <Input
                            id="pickup_date"
                            type="date"
                            value={formData.pickup_date}
                            onChange={(e) => setFormData({ ...formData, pickup_date: e.target.value })}
                            min={new Date().toISOString().split("T")[0]}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="pickup_time">Heure *</Label>
                          <Input
                            id="pickup_time"
                            type="time"
                            value={formData.pickup_time}
                            onChange={(e) => setFormData({ ...formData, pickup_time: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      {(formData.service_type === "daily" || formData.service_type === "tour") && (
                        <div>
                          <Label htmlFor="return_date">Date de retour</Label>
                          <Input
                            id="return_date"
                            type="date"
                            value={formData.return_date}
                            onChange={(e) => setFormData({ ...formData, return_date: e.target.value })}
                            min={formData.pickup_date || new Date().toISOString().split("T")[0]}
                          />
                        </div>
                      )}

                      <div>
                        <Label htmlFor="pickup_location">Lieu de prise en charge *</Label>
                        <Input
                          id="pickup_location"
                          value={formData.pickup_location}
                          onChange={(e) => setFormData({ ...formData, pickup_location: e.target.value })}
                          placeholder="Adresse, hôtel, aéroport..."
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="dropoff_location">Lieu de destination</Label>
                        <Input
                          id="dropoff_location"
                          value={formData.dropoff_location}
                          onChange={(e) => setFormData({ ...formData, dropoff_location: e.target.value })}
                          placeholder="Adresse, hôtel, aéroport..."
                        />
                      </div>

                      <div>
                        <Label htmlFor="passengers">Nombre de passagers</Label>
                        <Select
                          value={String(formData.passengers)}
                          onValueChange={(v) => setFormData({ ...formData, passengers: parseInt(v) })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: vehicle.passengers }, (_, i) => i + 1).map((num) => (
                              <SelectItem key={num} value={String(num)}>
                                {num} passager{num > 1 ? "s" : ""}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="special_requests">Demandes spéciales</Label>
                        <Textarea
                          id="special_requests"
                          value={formData.special_requests}
                          onChange={(e) => setFormData({ ...formData, special_requests: e.target.value })}
                          placeholder="Siège bébé, arrêts supplémentaires, etc."
                          rows={3}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between mt-6">
                      <Button type="button" variant="outline" onClick={() => setStep(1)}>
                        <ArrowLeft className="w-4 h-4 mr-1" /> Retour
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setStep(3)}
                        disabled={!formData.pickup_date || !formData.pickup_time || !formData.pickup_location}
                        variant="hero"
                      >
                        Continuer <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Confirmation */}
                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-card rounded-2xl p-6 shadow-soft border border-border/50"
                  >
                    <h2 className="font-display text-xl font-semibold mb-6">Récapitulatif</h2>

                    <div className="space-y-4">
                      <div className="flex justify-between py-3 border-b border-border">
                        <span className="text-muted-foreground">Service</span>
                        <span className="font-medium">{serviceTypes.find(s => s.id === formData.service_type)?.label}</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-border">
                        <span className="text-muted-foreground">Date</span>
                        <span className="font-medium">
                          {new Date(formData.pickup_date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
                          {formData.return_date && ` - ${new Date(formData.return_date).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}`}
                        </span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-border">
                        <span className="text-muted-foreground">Heure</span>
                        <span className="font-medium">{formData.pickup_time}</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-border">
                        <span className="text-muted-foreground">Lieu de prise en charge</span>
                        <span className="font-medium">{formData.pickup_location}</span>
                      </div>
                      {formData.dropoff_location && (
                        <div className="flex justify-between py-3 border-b border-border">
                          <span className="text-muted-foreground">Destination</span>
                          <span className="font-medium">{formData.dropoff_location}</span>
                        </div>
                      )}
                      <div className="flex justify-between py-3 border-b border-border">
                        <span className="text-muted-foreground">Passagers</span>
                        <span className="font-medium">{formData.passengers}</span>
                      </div>
                    </div>

                    {!user && (
                      <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                        <p className="text-yellow-700 dark:text-yellow-400 text-sm">
                          Vous devez vous <Link to="/auth" className="underline font-semibold">connecter</Link> pour finaliser votre réservation
                        </p>
                      </div>
                    )}

                    <div className="flex justify-between mt-6">
                      <Button type="button" variant="outline" onClick={() => setStep(2)}>
                        <ArrowLeft className="w-4 h-4 mr-1" /> Retour
                      </Button>
                      <Button type="submit" disabled={submitting || !user} variant="hero" size="lg">
                        {submitting ? "Envoi en cours..." : "Confirmer la réservation"}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </form>
            </div>

            {/* Vehicle Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl overflow-hidden shadow-soft border border-border/50 sticky top-24">
                <div className="aspect-video relative">
                  {vehicle.image_url ? (
                    <img src={vehicle.image_url} alt={vehicle.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground">Image non disponible</span>
                    </div>
                  )}
                  <button
                    onClick={toggleFavorite}
                    className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isFavorite ? "bg-red-500 text-white" : "bg-card/90 text-muted-foreground hover:text-red-500"
                      }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
                  </button>
                </div>

                <div className="p-6">
                  <span className="text-xs font-medium text-primary">{vehicle.type}</span>
                  <h3 className="font-display text-xl font-semibold mt-1 mb-2">{vehicle.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{vehicle.description}</p>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{vehicle.passengers} places</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Briefcase className="w-4 h-4" />
                      <span>{vehicle.luggage} bagages</span>
                    </div>
                  </div>

                  {vehicle.amenities && vehicle.amenities.length > 0 && (
                    <div className="flex items-center gap-2 mb-6">
                      {vehicle.amenities.map((amenity) => {
                        const AmenityIcon = amenityIcons[amenity]?.icon;
                        return AmenityIcon ? (
                          <div
                            key={amenity}
                            className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center"
                            title={amenityIcons[amenity].label}
                          >
                            <AmenityIcon className="w-4 h-4 text-muted-foreground" />
                          </div>
                        ) : null;
                      })}
                    </div>
                  )}

                  <div className="border-t border-border pt-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tarif journalier</span>
                      <span>{vehicle.daily_rate.toLocaleString()} FCFA</span>
                    </div>
                    {totalAmount > 0 && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Total estimé</span>
                          <span className="font-semibold">{totalAmount.toLocaleString()} FCFA</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Acompte (30%)</span>
                          <span className="text-primary font-semibold">{depositAmount.toLocaleString()} FCFA</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}