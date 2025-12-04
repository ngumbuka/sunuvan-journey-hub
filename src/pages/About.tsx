import { motion } from "framer-motion";
import { Heart, CheckCircle, Shield, Star, Users, Award, Quote } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
const values = [{
  icon: Heart,
  title: "Teranga",
  subtitle: "Cardinal Value",
  description: "Senegalese hospitality is not a slogan, it's our way of welcoming each client as an honored guest. We go beyond simple service.",
  color: "text-accent"
}, {
  icon: CheckCircle,
  title: "Reliability",
  subtitle: "Our Promise",
  description: "We keep our commitments. A vehicle on time, in perfect condition, and a professional driver are our minimum promise.",
  color: "text-primary"
}, {
  icon: Shield,
  title: "Safety",
  subtitle: "Non-Negotiable",
  description: "Our drivers are rigorously selected and trained, and our vehicles are maintained with the greatest rigor.",
  color: "text-secondary"
}, {
  icon: Star,
  title: "Excellence",
  subtitle: "Our Standard",
  description: "We always aim to exceed expectations, whether through a small gesture, last-minute flexibility, or informed advice.",
  color: "text-primary"
}];
const differentiators = [{
  title: "Professionalization of the Informal Sector",
  description: "Unlike \"clandos\" and unstructured actors, Sunuvan is a registered company with insurance, contracts, and transparent accounting. Our clients have peace of mind."
}, {
  title: "Our Drivers, True Ambassadors",
  description: "Not just drivers. They are professionals trained in hospitality, discreet, punctual, and with deep knowledge of the terrain. They are the face of our Teranga."
}, {
  title: "Turnkey & Customizable Service",
  description: "We don't sell an A-to-B trip, we sell a solution. We build the itinerary with you, suggest stops, and adapt to your unforeseen events."
}, {
  title: "The Bridge Between Worlds",
  description: "We understand both international tourist expectations (comfort, punctuality) and local client realities (family needs, events). We speak both languages, literally and figuratively."
}];
export default function About() {
  return <Layout>
      {/* Hero Section */}
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
              Our Story: More Than Just Transport
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
              Discover the journey that brought Sunuvan to life and the values 
              that drive us every day.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="section-padding">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{
            opacity: 0,
            x: -20
          }} whileInView={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.6
          }} viewport={{
            once: true
          }}>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                Born from a Vision
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Sunuvan was born from a frustration. Seeing tourist friends struggle 
                  with local transport for their tours, and Senegalese families struggling 
                  to find reliable and comfortable transport for their events, we realized 
                  there was a lack of structured offering.
                </p>
                <p>
                  Launched in 2025, Sunuvan bets on service quality and reliability. 
                  The name itself is a contraction of <strong className="text-foreground">"Sunu"</strong> which 
                  means <strong className="text-foreground">"Our"</strong> in Wolof, 
                  and <strong className="text-foreground">"Van"</strong>. Literally "Our Van", 
                  a brand that evokes a sense of collective ownership, trust, and close service.
                </p>
              </div>
              <div className="mt-8 p-6 bg-primary/5 rounded-2xl border-l-4 border-primary">
                <Quote className="w-8 h-8 text-primary mb-3" />
                <p className="text-foreground italic font-medium">
                  "At Sunuvan, we don't just drive you from point A to point B. We accompany 
                  you so your journey in Senegal becomes an unforgettable experience, from 
                  the first kilometer."
                </p>
              </div>
            </motion.div>

            <motion.div initial={{
            opacity: 0,
            x: 20
          }} whileInView={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.6
          }} viewport={{
            once: true
          }} className="relative">
              <img src="https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=800&q=80" alt="Senegalese landscape" className="rounded-2xl shadow-medium" />
              <div className="absolute -bottom-6 -left-6 bg-card rounded-xl p-4 shadow-medium">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Est. 2025</p>
                    <p className="text-sm text-muted-foreground">Dakar, Senegal</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
          }} className="bg-card rounded-2xl p-8 shadow-soft">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-4">
                Our Mission
              </h3>
              <p className="text-muted-foreground">
                Offer our clients, whether international or local, a serene, secure, 
                and comfortable transport experience, allowing them to discover Senegal 
                or travel for business without the slightest stress.
              </p>
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
          }} className="bg-secondary text-secondary-foreground rounded-2xl p-8">
              <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mb-6">
                <Star className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-4">
                Our Vision
              </h3>
              <p className="text-secondary-foreground/80">
                Become the reference for van rental with driver in Senegal, recognized 
                for our professionalism, integrity, and positive contribution to the 
                country's tourist image.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-padding">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-muted-foreground">
              The principles that guide every journey we take with you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, index) => <motion.div key={value.title} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: index * 0.1
          }} viewport={{
            once: true
          }} className="bg-card rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center shrink-0">
                    <value.icon className={`w-7 h-7 ${value.color}`} />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      {value.title}
                    </h3>
                    <p className="text-sm text-primary font-medium mb-2">{value.subtitle}</p>
                    <p className="text-muted-foreground">{value.description}</p>
                  </div>
                </div>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* What Sets Us Apart */}
      <section className="section-padding bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Makes Sunuvan Different?
            </h2>
            <p className="text-lg text-muted-foreground">
              We're not just another transport company. Here's what sets us apart.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {differentiators.map((item, index) => <motion.div key={item.title} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: index * 0.1
          }} viewport={{
            once: true
          }} className="bg-card p-6 shadow-soft border-l-4 border-primary rounded-sm">
                <h3 className="font-display text-lg font-semibold text-foreground mb-3">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Ready to Experience Teranga on Wheels?
          </h2>
          <p className="text-lg text-secondary-foreground/80 mb-8 max-w-2xl mx-auto">
            Book your journey today and discover what makes Sunuvan the trusted 
            choice for transportation in Senegal.
          </p>
          <Link to="/book">
            <Button variant="hero" size="xl">
              Book Your Journey
            </Button>
          </Link>
        </div>
      </section>
    </Layout>;
}