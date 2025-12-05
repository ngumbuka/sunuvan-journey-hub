import { motion } from "framer-motion";
import { Heart, CheckCircle, Shield, Star, Users, Award, Quote } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { useTranslation } from "react-i18next";
import aboutHero from "@/assets/about-hero.png";

export default function About() {
  const { t } = useTranslation();

  const values = [{
    icon: Heart,
    title: t("about.values.items.teranga.title"),
    subtitle: t("about.values.items.teranga.subtitle"),
    description: t("about.values.items.teranga.description"),
    color: "text-accent"
  }, {
    icon: CheckCircle,
    title: t("about.values.items.reliability.title"),
    subtitle: t("about.values.items.reliability.subtitle"),
    description: t("about.values.items.reliability.description"),
    color: "text-primary"
  }, {
    icon: Shield,
    title: t("about.values.items.safety.title"),
    subtitle: t("about.values.items.safety.subtitle"),
    description: t("about.values.items.safety.description"),
    color: "text-secondary"
  }, {
    icon: Star,
    title: t("about.values.items.excellence.title"),
    subtitle: t("about.values.items.excellence.subtitle"),
    description: t("about.values.items.excellence.description"),
    color: "text-primary"
  }];

  const differentiators = [{
    title: t("about.differentiators.items.formal.title"),
    description: t("about.differentiators.items.formal.description")
  }, {
    title: t("about.differentiators.items.ambassadors.title"),
    description: t("about.differentiators.items.ambassadors.description")
  }, {
    title: t("about.differentiators.items.turnkey.title"),
    description: t("about.differentiators.items.turnkey.description")
  }, {
    title: t("about.differentiators.items.bridge.title"),
    description: t("about.differentiators.items.bridge.description")
  }];

  return <Layout>

    {/* Hero Section */}
    <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src={aboutHero} alt="Scenic Senegal road" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1 initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6
          }} className="font-display text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            {t("about.hero.title")}
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
          }} className="text-xl md:text-2xl text-white/90 font-light drop-shadow-md">
            {t("about.hero.subtitle")}
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
              {t("about.story.title")}
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                {t("about.story.p1")}
              </p>
              <p dangerouslySetInnerHTML={{ __html: t("about.story.p2") }} />
            </div>
            <div className="mt-8 p-6 bg-primary/5 rounded-2xl border-l-4 border-primary">
              <Quote className="w-8 h-8 text-primary mb-3" />
              <p className="text-foreground italic font-medium">
                {t("about.story.quote")}
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
                  <p className="font-semibold text-foreground">{t("about.story.est")}</p>
                  <p className="text-sm text-muted-foreground">{t("about.story.location")}</p>
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
              {t("about.mission.title")}
            </h3>
            <p className="text-muted-foreground">
              {t("about.mission.description")}
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
              {t("about.vision.title")}
            </h3>
            <p className="text-secondary-foreground/80">
              {t("about.vision.description")}
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
            {t("about.values.title")}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("about.values.subtitle")}
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
            {t("about.differentiators.title")}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("about.differentiators.subtitle")}
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
          {t("about.cta.title")}
        </h2>
        <p className="text-lg text-secondary-foreground/80 mb-8 max-w-2xl mx-auto">
          {t("about.cta.description")}
        </p>
        <button className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold text-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25">
          {t("about.cta.button")}
        </button>
      </div>
    </section>
  </Layout>;
}