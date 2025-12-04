import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Shield, UserCheck, RefreshCw, Sparkles, Globe2, MapPin, ArrowRight, CheckCircle, Star, Phone } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-senegal.jpg";

const differentiators = [
  { icon: Shield, title: "Sérénité Tout-Inclus", subtitle: "Nous gérons tout, vous profitez de tout", description: "Tarification transparente incluant chauffeur, carburant, péages, assurance, parking et eau. Pas de surprises." },
  { icon: UserCheck, title: "Expertise Chauffeur-Ambassadeur", subtitle: "Votre premier contact avec la Teranga sénégalaise", description: "Chauffeurs professionnellement formés, discrets, ponctuels et experts du terrain." },
  { icon: RefreshCw, title: "Flexibilité Absolue", subtitle: "Votre itinéraire, vos règles", description: "Pas d'horaires fixes (sauf vols). Modifiez les arrêts, changez de route à votre guise." },
  { icon: Sparkles, title: "Confort & Sécurité", subtitle: "Un sanctuaire roulant après chaque aventure", description: "Vans spacieux, climatisés et rigoureusement entretenus. Conduite calme et parfaite connaissance des routes." },
  { icon: Globe2, title: "Pont Entre les Mondes", subtitle: "Comprendre les attentes internationales", description: "Professionnalisme et confort pour touristes combinés à l'authenticité et la compréhension des réalités locales." },
];

const coverageAreas = [
  { title: "Dakar & Région", locations: ["Aéroport Blaise Diagne (AIBD)", "Tous les quartiers de Dakar", "Saly, Lac Rose et environs"] },
  { title: "Circuits Touristiques", locations: ["Saint-Louis", "Petite Côte (Saly, Somone, Ngaparou)", "Sine-Saloum (Toubacouta, Ndangane)", "Cap Skirring"] },
  { title: "Destinations Aventure", locations: ["Pays Bassari", "Casamance profonde", "Destinations reculées de l'intérieur"] },
];

const featuredVehicles = [
  { id: 1, name: "Mercedes V-Class", type: "Van Premium", capacity: "8 passagers", price: "À partir de 75 000 FCFA/jour", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80" },
  { id: 2, name: "Toyota Hiace", type: "Van Standard", capacity: "12 passagers", price: "À partir de 55 000 FCFA/jour", image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80" },
  { id: 3, name: "Ford Transit", type: "Minibus", capacity: "16 passagers", price: "À partir de 85 000 FCFA/jour", image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&q=80" },
];

export default function Index() {
  const { t } = useTranslation();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Route panoramique au Sénégal" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent-foreground text-sm font-medium mb-6 border border-accent/30">
                <Star className="w-4 h-4 fill-accent text-accent" />
                Location de van premium au Sénégal
              </span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Voyagez en Sérénité,{" "}
              <span className="text-primary">Vivez le Sénégal</span> en Liberté
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-lg md:text-xl text-muted-foreground mb-8">
              Location de van premium avec chauffeur. Voyages sans stress à travers le Sénégal pour touristes, familles et entreprises. Découvrez la chaleur de la Teranga sénégalaise.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="flex flex-col sm:flex-row gap-4">
              <Link to="/fleet">
                <Button variant="hero" size="xl">
                  Découvrir la Flotte
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="hero-outline" size="xl">
                  Services & Tarifs
                </Button>
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.5 }} className="mt-10 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-primary" />Tarifs tout inclus</div>
              <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-primary" />Chauffeurs professionnels</div>
              <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-primary" />Support 24/7</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Differentiators Section */}
      <section className="section-padding bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">Pourquoi Choisir Sunuvan ?</h2>
            <p className="text-lg text-muted-foreground">Découvrez la différence d'un transport premium et professionnel qui privilégie votre confort et votre tranquillité d'esprit.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {differentiators.map((item, index) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }} className="bg-card rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 border border-border/50">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-1">{item.title}</h3>
                <p className="text-sm text-primary font-medium mb-2">{item.subtitle}</p>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage Section */}
      <section className="section-padding">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">Nous Couvrons Tout le Sénégal</h2>
            <p className="text-lg text-muted-foreground">Des transferts aéroport aux aventures de plusieurs jours, nous vous emmenons partout au Sénégal avec confort et fiabilité.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {coverageAreas.map((area, index) => (
              <motion.div key={area.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }} className="bg-primary text-primary-foreground rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-6 h-6 text-accent" />
                  <h3 className="font-display text-xl font-semibold">{area.title}</h3>
                </div>
                <ul className="space-y-2">
                  {area.locations.map((location) => (
                    <li key={location} className="flex items-start gap-2 text-primary-foreground/80">
                      <CheckCircle className="w-4 h-4 text-accent mt-1 shrink-0" />
                      <span>{location}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-muted-foreground">
            <strong className="text-foreground">Sans limite de distance :</strong> Des transferts de 30km aux circuits de 1500km sur 10 jours
          </p>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="section-padding bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">Notre Flotte Premium</h2>
              <p className="text-lg text-muted-foreground max-w-xl">Véhicules modernes et bien entretenus pour tous les besoins et toutes les tailles de groupe.</p>
            </div>
            <Link to="/fleet">
              <Button variant="outline" size="lg">Voir Tous les Véhicules<ArrowRight className="w-4 h-4 ml-2" /></Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredVehicles.map((vehicle, index) => (
              <motion.div key={vehicle.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }} className="bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 group border border-border/50">
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <span className="text-xs font-medium text-primary uppercase tracking-wide">{vehicle.type}</span>
                  <h3 className="font-display text-xl font-semibold text-foreground mt-1 mb-2">{vehicle.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{vehicle.capacity}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">{vehicle.price}</span>
                    <Link to="/fleet"><Button variant="ghost" size="sm">Voir Détails<ArrowRight className="w-4 h-4 ml-1" /></Button></Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Prêt pour un Voyage Sans Stress ?</h2>
            <p className="text-lg text-primary-foreground/80 mb-8">Contactez-nous pour un devis personnalisé. Découvrez le confort et la fiabilité de Sunuvan pour votre prochain voyage au Sénégal.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button variant="secondary" size="xl">Obtenir un Devis<ArrowRight className="w-5 h-5 ml-2" /></Button>
              </Link>
              <a href="tel:+221771234567">
                <Button variant="outline" size="xl" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  <Phone className="w-5 h-5 mr-2" />Appelez-nous
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
