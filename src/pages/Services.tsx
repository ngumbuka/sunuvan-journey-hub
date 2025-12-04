import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Plane, Clock, Map, PartyPopper, Building2, CheckCircle, AlertCircle, CreditCard, RefreshCw, User, Shield, ArrowRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
const services = [{
  id: "transfers",
  icon: Plane,
  title: "Standard Transfers",
  description: "Door-to-door transfer service for airport pickups, hotel transfers, and point-to-point journeys.",
  pricing: [{
    route: "AIBD Airport ↔ Dakar",
    price: "35,000 - 45,000 FCFA"
  }, {
    route: "AIBD Airport ↔ Saly",
    price: "45,000 - 55,000 FCFA"
  }, {
    route: "AIBD Airport ↔ Lac Rose",
    price: "40,000 - 50,000 FCFA"
  }]
}, {
  id: "daily",
  icon: Clock,
  title: "Daily Rental",
  description: "Full-day rental with professional driver. Perfect for sightseeing, business meetings, or family outings.",
  pricing: [{
    route: "Base Package (8h / 200km)",
    price: "55,000 - 95,000 FCFA"
  }, {
    route: "Overtime",
    price: "5,000 FCFA/hour"
  }, {
    route: "Extra kilometers",
    price: "300 FCFA/km"
  }]
}, {
  id: "tours",
  icon: Map,
  title: "Tours & Excursions",
  description: "Discover Senegal's treasures with our guided tour packages. Customizable itineraries available.",
  pricing: [{
    route: "Gorée Island + Dakar Tour",
    price: "75,000 FCFA"
  }, {
    route: "Lac Rose Discovery",
    price: "65,000 FCFA"
  }, {
    route: "Multi-day Circuits",
    price: "From 150,000 FCFA/day"
  }]
}, {
  id: "events",
  icon: PartyPopper,
  title: "Event Services",
  description: "Special transportation for weddings, baptisms, family reunions, and celebrations.",
  pricing: [{
    route: "Wedding Package (4h)",
    price: "80,000 - 120,000 FCFA"
  }, {
    route: "Baptism / Family Events",
    price: "55,000 - 85,000 FCFA"
  }, {
    route: "Full-day Event",
    price: "Custom Quote"
  }]
}, {
  id: "corporate",
  icon: Building2,
  title: "Corporate Services",
  description: "Professional transportation solutions for businesses. Delegation transfers, seminars, and monthly contracts.",
  pricing: [{
    route: "Delegation Transfer",
    price: "Custom Quote"
  }, {
    route: "Seminar Shuttles",
    price: "From 65,000 FCFA/day"
  }, {
    route: "Monthly Rental",
    price: "Contact Us"
  }]
}];
const pricingPhilosophy = [{
  icon: AlertCircle,
  title: "No Surprises",
  description: "Detailed, firm quote before any reservation"
}, {
  icon: CheckCircle,
  title: "No Hidden Fees",
  description: "Everything included in the announced price"
}, {
  icon: CreditCard,
  title: "Flexible Payment",
  description: "30% deposit, balance at end of service"
}, {
  icon: RefreshCw,
  title: "Payment Options",
  description: "Cash, Mobile Money (Orange, Wave), Bank Transfer"
}];
const terms = {
  reservation: ["Deposit: 30% to confirm the service", "Balance: Payment at end of service to driver", "Methods: Cash, Mobile Money, Bank Transfer"],
  cancellation: ["Cancellation > 48h: Full deposit refund", "Cancellation 24-48h: 50% deposit refund", "Cancellation < 24h: Deposit non-refundable", "Modification: Free, subject to availability"],
  client: ["Respect agreed itinerary", "Advance notice for stops", "Vehicle respect (damages will be charged)"],
  commitment: ["Punctuality: Vehicle present at agreed time/place", "Cleanliness & Comfort: Clean vehicle, optimal fuel/AC", "Safety: Professional driver, perfect vehicle condition", "Flexibility: Adapt to reasonable unforeseen events"]
};
export default function Services() {
  return <Layout>
      {/* Hero */}
      <section className="section-padding bg-gradient-hero">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6
          }} className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Services & Pricing
            </motion.h1>
            <motion.p initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: 0.1
          }} className="text-lg text-muted-foreground">
              Transparent, all-inclusive pricing for every journey. A fair price 
              for excellent service.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Pricing Philosophy */}
      <section className="py-12 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingPhilosophy.map((item, index) => <motion.div key={item.title} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: index * 0.1
          }} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-primary-foreground/80">{item.description}</p>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section-padding">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {services.map((service, index) => <motion.div key={service.id} id={service.id} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5
          }} viewport={{
            once: true
          }} className="bg-card rounded-2xl shadow-soft overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-3">
                  <div className="p-8 lg:col-span-1 bg-muted/30">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <service.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h2 className="font-display text-2xl font-bold text-foreground mb-3">
                      {service.title}
                    </h2>
                    <p className="text-muted-foreground">{service.description}</p>
                  </div>

                  <div className="p-8 lg:col-span-2">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
                      Indicative Pricing
                    </h3>
                    <div className="space-y-3">
                      {service.pricing.map(item => <div key={item.route} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                          <span className="text-foreground">{item.route}</span>
                          <span className="font-semibold text-primary">{item.price}</span>
                        </div>)}
                    </div>
                    <div className="mt-6">
                      <Link to="/contact">
                        <Button variant="default">
                          Get a Quote
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Terms & Conditions */}
      <section className="section-padding bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              Clear & Fair Conditions
            </h2>
            <p className="text-muted-foreground">
              We believe in transparency. Here are our terms clearly laid out.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5
          }} viewport={{
            once: true
          }} className="bg-card rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="w-6 h-6 text-primary" />
                <h3 className="font-display text-lg font-semibold text-foreground">
                  Reservation & Payment
                </h3>
              </div>
              <ul className="space-y-2">
                {terms.reservation.map(item => <li key={item} className="flex items-start gap-2 text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-primary mt-1 shrink-0" />
                    <span>{item}</span>
                  </li>)}
              </ul>
            </motion.div>

            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: 0.1
          }} viewport={{
            once: true
          }} className="bg-card rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-4">
                <RefreshCw className="w-6 h-6 text-primary" />
                <h3 className="font-display text-lg font-semibold text-foreground">
                  Cancellation & Modification
                </h3>
              </div>
              <ul className="space-y-2">
                {terms.cancellation.map(item => <li key={item} className="flex items-start gap-2 text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-primary mt-1 shrink-0" />
                    <span>{item}</span>
                  </li>)}
              </ul>
            </motion.div>

            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: 0.2
          }} viewport={{
            once: true
          }} className="bg-card rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-4">
                <User className="w-6 h-6 text-primary" />
                <h3 className="font-display text-lg font-semibold text-foreground">
                  Client Responsibilities
                </h3>
              </div>
              <ul className="space-y-2">
                {terms.client.map(item => <li key={item} className="flex items-start gap-2 text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-primary mt-1 shrink-0" />
                    <span>{item}</span>
                  </li>)}
              </ul>
            </motion.div>

            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: 0.3
          }} viewport={{
            once: true
          }} className="bg-secondary text-secondary-foreground rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-primary" />
                <h3 className="font-display text-lg font-semibold">
                  Sunuvan Commitment
                </h3>
              </div>
              <ul className="space-y-2">
                {terms.commitment.map(item => <li key={item} className="flex items-start gap-2 text-secondary-foreground/80">
                    <CheckCircle className="w-4 h-4 text-primary mt-1 shrink-0" />
                    <span>{item}</span>
                  </li>)}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-accent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl font-bold text-foreground mb-4">
            Ready to Book?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Contact us for a personalized quote tailored to your specific needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button variant="hero" size="xl">
                Get a Quote
              </Button>
            </Link>
            <Link to="/fleet">
              <Button variant="outline" size="xl">
                View Our Fleet
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>;
}