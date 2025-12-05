import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { 
  Users, 
  Briefcase, 
  Snowflake, 
  Wifi, 
  Usb, 
  Droplets,
  ArrowRight,
  Filter,
  Check,
  Heart
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

type Vehicle = Tables<"vehicles">;

const categories = [
  { id: "all", label: "Tous" },
  { id: "standard", label: "Standard" },
  { id: "premium", label: "Premium" },
  { id: "minibus", label: "Minibus" },
];

const amenityIcons: Record<string, { icon: typeof Snowflake; label: string }> = {
  ac: { icon: Snowflake, label: "Climatisation" },
  wifi: { icon: Wifi, label: "WiFi" },
  usb: { icon: Usb, label: "Chargeur USB" },
  water: { icon: Droplets, label: "Eau fraîche" },
};

export default function Fleet() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState("all");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicles();
    if (user) fetchFavorites();
  }, [user]);

  async function fetchVehicles() {
    const { data } = await supabase
      .from("vehicles")
      .select("*")
      .eq("status", "available")
      .order("is_featured", { ascending: false });
    setVehicles(data || []);
    setLoading(false);
  }

  async function fetchFavorites() {
    if (!user) return;
    const { data } = await supabase
      .from("favorites")
      .select("vehicle_id")
      .eq("user_id", user.id);
    setFavorites(data?.map(f => f.vehicle_id) || []);
  }

  async function toggleFavorite(vehicleId: string) {
    if (!user) {
      toast({ title: "Connectez-vous pour ajouter aux favoris" });
      return;
    }

    const isFav = favorites.includes(vehicleId);
    if (isFav) {
      await supabase.from("favorites").delete().eq("user_id", user.id).eq("vehicle_id", vehicleId);
      setFavorites(favorites.filter(id => id !== vehicleId));
      toast({ title: "Retiré des favoris" });
    } else {
      await supabase.from("favorites").insert({ user_id: user.id, vehicle_id: vehicleId });
      setFavorites([...favorites, vehicleId]);
      toast({ title: "Ajouté aux favoris" });
    }
  }

  const filteredVehicles = activeCategory === "all" 
    ? vehicles 
    : vehicles.filter(v => v.category === activeCategory);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="section-padding bg-gradient-hero">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6"
            >
              Our Premium Fleet
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg text-muted-foreground"
            >
              Modern, well-maintained vehicles for every need. From intimate transfers 
              to large group adventures.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-border sticky top-16 md:top-20 bg-background/95 backdrop-blur-sm z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            <span className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
              <Filter className="w-4 h-4" />
              Filter:
            </span>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                  activeCategory === cat.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Vehicle Grid */}
      <section className="section-padding">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="col-span-3 text-center py-12">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Chargement de la flotte...</p>
            </div>
          ) : vehicles.length === 0 ? (
            <div className="col-span-3 text-center py-12">
              <p className="text-muted-foreground">Aucun véhicule disponible pour le moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredVehicles.map((vehicle, index) => (
                <motion.div
                  key={vehicle.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 group"
                >
                  <div className="aspect-[16/10] overflow-hidden relative">
                    {vehicle.image_url ? (
                      <img
                        src={vehicle.image_url}
                        alt={vehicle.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground">Image non disponible</span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-card/90 backdrop-blur-sm text-xs font-medium text-foreground">
                        {vehicle.type}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleFavorite(vehicle.id)}
                      className={cn(
                        "absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-colors",
                        favorites.includes(vehicle.id)
                          ? "bg-red-500 text-white"
                          : "bg-card/90 text-muted-foreground hover:text-red-500"
                      )}
                    >
                      <Heart className={cn("w-4 h-4", favorites.includes(vehicle.id) && "fill-current")} />
                    </button>
                  </div>

                  <div className="p-6">
                    <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                      {vehicle.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">{vehicle.description}</p>

                    {/* Specs */}
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

                    {/* Amenities */}
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

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div>
                        <span className="text-sm text-muted-foreground">À partir de</span>
                        <p className="font-semibold text-foreground">{vehicle.daily_rate.toLocaleString()} FCFA/jour</p>
                      </div>
                      <Link to={`/book?vehicle=${vehicle.id}`}>
                        <Button variant="default" size="sm">
                          Réserver
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
