import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, CheckCircle } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import contactHero from "@/assets/contact-hero.png";

export default function Contact() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", service: "", travelDate: "", passengers: "", pickup: "", dropoff: "", message: "",
  });

  const contactMethods = [
    { icon: Phone, title: t("contact.methods.phone.title"), value: "+221 77 123 45 67", subtext: t("contact.methods.phone.subtext"), href: "tel:+221771234567" },
    { icon: Mail, title: t("contact.methods.email.title"), value: "info@sunuvan.com", subtext: t("contact.methods.email.subtext"), href: "mailto:info@sunuvan.com" },
    { icon: MessageCircle, title: t("contact.methods.whatsapp.title"), value: "+221 77 123 45 67", subtext: t("contact.methods.whatsapp.subtext"), href: "https://wa.me/221771234567" },
    { icon: MapPin, title: t("contact.methods.coverage.title"), value: t("contact.methods.coverage.value"), subtext: t("contact.methods.coverage.subtext"), href: null },
  ];

  const serviceOptions = [
    { value: "airport", label: t("contact.services.airport") },
    { value: "daily", label: t("contact.services.daily") },
    { value: "tour", label: t("contact.services.tour") },
    { value: "wedding", label: t("contact.services.wedding") },
    { value: "corporate", label: t("contact.services.corporate") },
    { value: "other", label: t("contact.services.other") },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save to database
      const { error: dbError } = await supabase.from("contact_messages").insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        service_interest: formData.service || null,
        travel_dates: formData.travelDate || null,
        pickup_location: formData.pickup || null,
        dropoff_location: formData.dropoff || null,
        passengers: formData.passengers ? parseInt(formData.passengers) : null,
        message: formData.message,
      });

      if (dbError) throw dbError;

      // Send emails via edge function
      const { error: emailError } = await supabase.functions.invoke("send-contact-email", {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          service: formData.service,
          pickup: formData.pickup,
          dropoff: formData.dropoff,
          passengers: formData.passengers ? parseInt(formData.passengers) : undefined,
          dates: formData.travelDate,
          message: formData.message,
        },
      });

      if (emailError) console.error("Email error:", emailError);

      toast({
        title: t("contact.form.successTitle"),
        description: t("contact.form.successDesc"),
      });

      setFormData({ name: "", email: "", phone: "", service: "", travelDate: "", passengers: "", pickup: "", dropoff: "", message: "" });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: t("contact.form.errorTitle"),
        description: t("contact.form.errorDesc"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Layout>

      {/* Hero */}
      <section className="relative h-[40vh] min-h-[350px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={contactHero} alt="Customer support" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
              {t("contact.title")}
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-lg text-white/90">
              {t("contact.subtitle")}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-12 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => (
              <motion.div key={method.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                {method.href ? (
                  <a href={method.href} target={method.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="block bg-card rounded-xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 border border-border/50">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <method.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{method.title}</h3>
                    <p className="text-foreground font-medium">{method.value}</p>
                    <p className="text-sm text-muted-foreground">{method.subtext}</p>
                  </a>
                ) : (
                  <div className="bg-card rounded-xl p-6 shadow-soft border border-border/50">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <method.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{method.title}</h3>
                    <p className="text-foreground font-medium">{method.value}</p>
                    <p className="text-sm text-muted-foreground">{method.subtext}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="section-padding">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">{t("contact.heroTitle")}</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t("contact.form.name")}</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleChange} required placeholder={t("contact.form.placeholders.name")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t("contact.form.email")}</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder={t("contact.form.placeholders.email")} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t("contact.form.phone")}</Label>
                    <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required placeholder={t("contact.form.placeholders.phone")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="service">{t("contact.form.service")}</Label>
                    <Select value={formData.service} onValueChange={(value) => setFormData({ ...formData, service: value })}>
                      <SelectTrigger><SelectValue placeholder={t("contact.form.placeholders.selectService")} /></SelectTrigger>
                      <SelectContent>
                        {serviceOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="travelDate">{t("contact.form.travelDate")}</Label>
                    <Input id="travelDate" name="travelDate" type="date" value={formData.travelDate} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passengers">{t("contact.form.passengers")}</Label>
                    <Input id="passengers" name="passengers" type="number" min="1" max="50" value={formData.passengers} onChange={handleChange} placeholder={t("contact.form.placeholders.passengers")} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pickup">{t("contact.form.pickup")}</Label>
                    <Input id="pickup" name="pickup" value={formData.pickup} onChange={handleChange} placeholder={t("contact.form.placeholders.pickup")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dropoff">{t("contact.form.dropoff")}</Label>
                    <Input id="dropoff" name="dropoff" value={formData.dropoff} onChange={handleChange} placeholder={t("contact.form.placeholders.dropoff")} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">{t("contact.form.message")}</Label>
                  <Textarea id="message" name="message" value={formData.message} onChange={handleChange} rows={4} placeholder={t("contact.form.placeholders.message")} required />
                </div>

                <Button type="submit" variant="hero" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? t("contact.form.submitting") : <><Send className="w-4 h-4 mr-2" /> {t("contact.form.submit")}</>}
                </Button>
              </form>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-8">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d247186.45776082385!2d-17.54736454531249!3d14.716677!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xec10d0bdeba9797%3A0x295a407f3f21c95!2sDakar%2C%20Senegal!5e0!3m2!1sfr!2sfr" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" title="Carte Sunuvan" />
              </div>

              <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                  <h3 className="font-display text-lg font-semibold text-foreground">{t("contact.info.hours.title")}</h3>
                </div>
                <div className="space-y-2 text-muted-foreground">
                  <div className="flex justify-between"><span>{t("contact.info.hours.week")}</span><span className="font-medium text-foreground">8h00 - 20h00</span></div>
                  <div className="flex justify-between"><span>{t("contact.info.hours.whatsapp")}</span><span className="font-medium text-foreground">24h/24</span></div>
                </div>
              </div>

              <div className="bg-primary text-primary-foreground rounded-2xl p-6">
                <h3 className="font-display text-lg font-semibold mb-3">{t("contact.info.commitment.title")}</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-accent" /><span>{t("contact.info.commitment.quote")}</span></li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-accent" /><span>{t("contact.info.commitment.email")}</span></li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-accent" /><span>{t("contact.info.commitment.emergency")}</span></li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
