import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Search, HelpCircle, Calendar, CreditCard, Shield } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function FAQ() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const faqCategories = [
    {
      id: "booking",
      title: t("faq.categories.booking.title"),
      icon: Calendar,
      questions: [
        { id: "b1", q: t("faq.categories.booking.q1"), a: t("faq.categories.booking.a1") },
        { id: "b2", q: t("faq.categories.booking.q2"), a: t("faq.categories.booking.a2") },
        { id: "b3", q: t("faq.categories.booking.q3"), a: t("faq.categories.booking.a3") },
        { id: "b4", q: t("faq.categories.booking.q4"), a: t("faq.categories.booking.a4") }
      ]
    },
    {
      id: "services",
      title: t("faq.categories.services.title"),
      icon: Shield,
      questions: [
        { id: "s1", q: t("faq.categories.services.q1"), a: t("faq.categories.services.a1") },
        { id: "s2", q: t("faq.categories.services.q2"), a: t("faq.categories.services.a2") },
        { id: "s3", q: t("faq.categories.services.q3"), a: t("faq.categories.services.a3") },
        { id: "s4", q: t("faq.categories.services.q4"), a: t("faq.categories.services.a4") }
      ]
    },
    {
      id: "pricing",
      title: t("faq.categories.pricing.title"),
      icon: CreditCard,
      questions: [
        { id: "p1", q: t("faq.categories.pricing.q1"), a: t("faq.categories.pricing.a1") },
        { id: "p2", q: t("faq.categories.pricing.q2"), a: t("faq.categories.pricing.a2") },
        { id: "p3", q: t("faq.categories.pricing.q3"), a: t("faq.categories.pricing.a3") },
        { id: "p4", q: t("faq.categories.pricing.q4"), a: t("faq.categories.pricing.a4") }
      ]
    }
  ];

  const filteredFAQs = faqCategories.map(cat => ({
    ...cat,
    questions: cat.questions.filter(q =>
      (activeCategory === "all" || activeCategory === cat.id) &&
      (q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.a.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })).filter(cat => cat.questions.length > 0);

  return (
    <Layout>
      {/* Hero */}
      <section className="section-padding bg-gradient-hero">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6"
            >
              <HelpCircle className="w-8 h-8 text-primary" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6"
            >
              {t("faq.hero.title")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground mb-8"
            >
              {t("faq.hero.description")}
            </motion.p>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative max-w-xl mx-auto"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t("faq.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-6 text-lg rounded-full shadow-soft focus-visible:ring-primary"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 border-b border-border sticky top-16 md:top-20 bg-background/95 backdrop-blur-sm z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 overflow-x-auto pb-2 justify-center">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${activeCategory === "all" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
            >
              {t("faq.categories.all")}
            </button>
            {faqCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 ${activeCategory === cat.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
              >
                <cat.icon className="w-4 h-4" />
                {cat.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Questions */}
      <section className="section-padding">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="space-y-12">
            {filteredFAQs.map((category) => (
              <div key={category.id}>
                <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <category.icon className="w-5 h-5 text-primary" />
                  </div>
                  {category.title}
                </h2>
                <div className="space-y-4">
                  {category.questions.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={false}
                      className="bg-card rounded-2xl overflow-hidden border border-border/50 shadow-sm hover:shadow-soft transition-shadow"
                    >
                      <button
                        onClick={() => toggleItem(item.id)}
                        className="w-full px-6 py-4 flex items-center justify-between text-left gap-4"
                      >
                        <span className="font-semibold text-lg text-foreground">{item.q}</span>
                        <div className={`shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center transition-transform duration-300 ${openItems.includes(item.id) ? "rotate-90 bg-primary text-primary-foreground" : ""
                          }`}>
                          {openItems.includes(item.id) ? (
                            <Minus className="w-4 h-4" />
                          ) : (
                            <Plus className="w-4 h-4" />
                          )}
                        </div>
                      </button>
                      <AnimatePresence>
                        {openItems.includes(item.id) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="px-6 pb-6 pt-2 text-muted-foreground leading-relaxed border-t border-border/50">
                              {item.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}

            {filteredFAQs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">{t("faq.noResults")}</p>
                <button
                  onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}
                  className="mt-4 text-primary font-medium hover:underline"
                >
                  {t("faq.clearFilters")}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-2xl font-bold mb-4">{t("faq.cta.title")}</h2>
          <p className="text-muted-foreground mb-8">
            {t("faq.cta.description")}
          </p>
          <Link to="/contact">
            <Button variant="default" size="lg">
              {t("faq.cta.contact")}
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
