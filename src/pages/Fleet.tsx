import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Users, 
  Briefcase, 
  Snowflake, 
  Wifi, 
  Usb, 
  Droplets,
  ArrowRight,
  Filter,
  Check
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const vehicles = [
  {
    id: 1,
    name: "Mercedes V-Class",
    type: "Premium Van",
    category: "premium",
    capacity: 8,
    luggage: 6,
    description: "Luxury travel for discerning clients. Premium comfort and sophisticated design.",
    price: "75,000 FCFA",
    priceUnit: "day",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    amenities: ["ac", "wifi", "usb", "water"],
  },
  {
    id: 2,
    name: "Toyota Hiace",
    type: "Standard Van",
    category: "standard",
    capacity: 12,
    luggage: 8,
    description: "Reliable and spacious for group travel. Perfect for tours and transfers.",
    price: "55,000 FCFA",
    priceUnit: "day",
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80",
    amenities: ["ac", "usb", "water"],
  },
  {
    id: 3,
    name: "Ford Transit",
    type: "Minibus",
    category: "minibus",
    capacity: 16,
    luggage: 12,
    description: "Ideal for larger groups and corporate events. Comfortable seating for everyone.",
    price: "85,000 FCFA",
    priceUnit: "day",
    image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&q=80",
    amenities: ["ac", "wifi", "usb", "water"],
  },
  {
    id: 4,
    name: "Mercedes Sprinter",
    type: "Executive Van",
    category: "premium",
    capacity: 10,
    luggage: 8,
    description: "Executive comfort for business delegations. Premium amenities throughout.",
    price: "95,000 FCFA",
    priceUnit: "day",
    image: "https://images.unsplash.com/photo-1609520505218-7421df70b093?w=800&q=80",
    amenities: ["ac", "wifi", "usb", "water"],
  },
  {
    id: 5,
    name: "Renault Trafic",
    type: "Standard Van",
    category: "standard",
    capacity: 9,
    luggage: 5,
    description: "Compact and efficient. Great for smaller groups and city transfers.",
    price: "45,000 FCFA",
    priceUnit: "day",
    image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80",
    amenities: ["ac", "usb", "water"],
  },
  {
    id: 6,
    name: "Iveco Daily",
    type: "Minibus",
    category: "minibus",
    capacity: 20,
    luggage: 15,
    description: "Maximum capacity for large groups. Ideal for events and seminars.",
    price: "110,000 FCFA",
    priceUnit: "day",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80",
    amenities: ["ac", "wifi", "usb", "water"],
  },
];

const categories = [
  { id: "all", label: "All Vehicles" },
  { id: "standard", label: "Standard" },
  { id: "premium", label: "Premium" },
  { id: "minibus", label: "Minibus" },
];

const amenityIcons: Record<string, { icon: typeof Snowflake; label: string }> = {
  ac: { icon: Snowflake, label: "Air Conditioning" },
  wifi: { icon: Wifi, label: "WiFi" },
  usb: { icon: Usb, label: "USB Charging" },
  water: { icon: Droplets, label: "Fresh Water" },
};

export default function Fleet() {
  const [activeCategory, setActiveCategory] = useState("all");

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
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-card/90 backdrop-blur-sm text-xs font-medium text-foreground">
                      {vehicle.type}
                    </span>
                  </div>
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
                      <span>{vehicle.capacity} seats</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Briefcase className="w-4 h-4" />
                      <span>{vehicle.luggage} bags</span>
                    </div>
                  </div>

                  {/* Amenities */}
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

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <span className="text-sm text-muted-foreground">From</span>
                      <p className="font-semibold text-foreground">{vehicle.price}/{vehicle.priceUnit}</p>
                    </div>
                    <Link to={`/book?vehicle=${vehicle.id}`}>
                      <Button variant="default" size="sm">
                        Book Now
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Included Services */}
      <section className="section-padding bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              Included in Every Rental
            </h2>
            <p className="text-muted-foreground">
              All our prices are all-inclusive. No hidden fees, no surprises.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              "Professional Driver",
              "Fuel",
              "Tolls",
              "Insurance",
              "Parking",
              "Fresh Water",
            ].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card rounded-xl p-4 text-center shadow-soft"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Check className="w-5 h-5 text-primary" />
                </div>
                <p className="text-sm font-medium text-foreground">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
