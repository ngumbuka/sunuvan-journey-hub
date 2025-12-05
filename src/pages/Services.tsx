import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Plane, Clock, Map, PartyPopper, Building2, CheckCircle, AlertCircle, CreditCard, RefreshCw, User, Shield, ArrowRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/currency";

export default function Services() {
  const { t } = useTranslation();

  // Helper to format ranges
  const formatRange = (min: number, max: number) => {
    return `${formatCurrency(min)} - ${formatCurrency(max)}`;
  };

  const services = [{
    id: "transfers",
    icon: Plane,
    title: t("services.items.transfers.title"),
    description: t("services.items.transfers.description"),
    pricing: [{
      route: t("services.items.transfers.p1"),
      price: formatRange(35000, 45000)
    }, {
      route: t("services.items.transfers.p2"),
      price: formatRange(45000, 55000)
    }, {
      route: t("services.items.transfers.p3"),
      price: formatRange(40000, 50000)
    }]
  }, {
    id: "daily",
    icon: Clock,
    title: t("services.items.daily.title"),
    description: t("services.items.daily.description"),
    pricing: [{
      route: t("services.items.daily.p1"),
      price: formatRange(55000, 95000)
    }, {
      route: t("services.items.daily.p2"),
      price: `${formatCurrency(5000)}/hour`
    }, {
      route: t("services.items.daily.p3"),
      price: `${formatCurrency(300)}/km`
    }]
  }, {
    id: "tours",
    icon: Map,
    title: t("services.items.tours.title"),
    description: t("services.items.tours.description"),
    pricing: [{
      route: t("services.items.tours.p1"),
      price: formatCurrency(75000)
    }, {
      route: t("services.items.tours.p2"),
      price: formatCurrency(65000)
    }, {
      route: t("services.items.tours.p3"),
      price: t("services.fromPrice", { price: formatCurrency(150000) }) + "/day"
    }]
  }, {
    id: "events",
    icon: PartyPopper,
    title: t("services.items.events.title"),
    description: t("services.items.events.description"),
    pricing: [{
      route: t("services.items.events.p1"),
      price: formatRange(80000, 120000)
    }, {
      route: t("services.items.events.p2"),
      price: formatRange(55000, 85000)
    }, {
      route: t("services.items.events.p3"),
      price: t("services.customQuote")
    }]
  }, {
    id: "corporate",
    icon: Building2,
    title: t("services.items.corporate.title"),
    description: t("services.items.corporate.description"),
    pricing: [{
      route: t("services.items.corporate.p1"),
      price: t("services.customQuote")
    }, {
      route: t("services.items.corporate.p2"),
      price: t("services.fromPrice", { price: formatCurrency(65000) }) + "/day"
    }, {
      route: t("services.items.corporate.p3"),
      price: t("services.contactUsPrice")
    }]
  }];

  const pricingPhilosophy = [{
    icon: AlertCircle,
    title: t("services.philosophy.surprises.title"),
    description: t("services.philosophy.surprises.description")
  }, {
    icon: CheckCircle,
    title: t("services.philosophy.hidden.title"),
    description: t("services.philosophy.hidden.description")
  }, {
    icon: CreditCard,
    title: t("services.philosophy.flexible.title"),
    description: t("services.philosophy.flexible.description")
  }, {
    icon: RefreshCw,
    title: t("services.philosophy.options.title"),
    description: t("services.philosophy.options.description")
  }];

  const terms = {
    reservation: [
      t("services.terms.reservation.l1"),
      t("services.terms.reservation.l2"),
      t("services.terms.reservation.l3")
    ],
    cancellation: [
      t("services.terms.cancellation.l1"),
      t("services.terms.cancellation.l2"),
      t("services.terms.cancellation.l3"),
      t("services.terms.cancellation.l4")
    ],
    client: [
      t("services.terms.client.l1"),
      t("services.terms.client.l2"),
      t("services.terms.client.l3")
    ],
    commitment: [
      t("services.terms.commitment.l1"),
      t("services.terms.commitment.l2"),
      t("services.terms.commitment.l3"),
      t("services.terms.commitment.l4")
    ]
  };

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
            {t("services.title")}
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
            {t("services.subtitle")}
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
                  {t("services.indicativePricing")}
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
                      {t("services.cta")}
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
            {t("services.terms.title")}
          </h2>
          <p className="text-muted-foreground">
            {t("services.terms.subtitle")}
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
                {t("services.terms.reservation.title")}
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
            duration: 0.5
            , delay: 0.1
          }} viewport={{
            once: true
          }} className="bg-card rounded-2xl p-6 shadow-soft">
            <div className="flex items-center gap-3 mb-4">
              <RefreshCw className="w-6 h-6 text-primary" />
              <h3 className="font-display text-lg font-semibold text-foreground">
                {t("services.terms.cancellation.title")}
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
                {t("services.terms.client.title")}
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
          }} className="text-secondary-foreground rounded-2xl p-6 bg-accent">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-primary" />
              <h3 className="font-display text-lg font-semibold">
                {t("services.terms.commitment.title")}
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
          {t("contact.heroTitle")}
        </h2>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          {t("contact.subtitle")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/contact">
            <Button variant="hero" size="xl">
              {t("services.cta")}
            </Button>
          </Link>
          <Link to="/fleet">
            <Button variant="outline" size="xl">
              {t("nav.fleet")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  </Layout>;
}