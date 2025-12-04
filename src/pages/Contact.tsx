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

const contactMethods = [
  { icon: Phone, title: "Téléphone", value: "+221 77 123 45 67", subtext: "Disponible 7j/7, 8h - 20h", href: "tel:+221771234567" },
  { icon: Mail, title: "Email", value: "info@sunuvan.com", subtext: "Réponse sous 24h", href: "mailto:info@sunuvan.com" },
  { icon: MessageCircle, title: "WhatsApp", value: "+221 77 123 45 67", subtext: "Réponses rapides", href: "https://wa.me/221771234567" },
  { icon: MapPin, title: "Couverture", value: "Tout le Sénégal", subtext: "Basé à Dakar", href: null },
];

const serviceOptions = [
  { value: "airport", label: "Transfert Aéroport" },
  { value: "daily", label: "Location Journalière" },
  { value: "tour", label: "Excursion / Tour" },
  { value: "wedding", label: "Mariage / Événement" },
  { value: "corporate", label: "Service Entreprise" },
  { value: "other", label: "Autre" },
];

export default function Contact() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", service: "", travelDate: "", passengers: "", pickup: "", dropoff: "", message: "",
  });

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
        title: "Message envoyé !",
        description: "Nous vous répondrons dans les plus brefs délais.",
      });

      setFormData({ name: "", email: "", phone: "", service: "", travelDate: "", passengers: "", pickup: "", dropoff: "", message: "" });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
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
      <section className="section-padding bg-gradient-to-br from-primary to-primary/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              {t("contact.title")}
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-lg text-primary-foreground/80">
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
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">Demander un Devis</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet *</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="Votre nom" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="votre@email.com" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone *</Label>
                    <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required placeholder="+221 77 XXX XX XX" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="service">Service souhaité</Label>
                    <Select value={formData.service} onValueChange={(value) => setFormData({ ...formData, service: value })}>
                      <SelectTrigger><SelectValue placeholder="Sélectionner un service" /></SelectTrigger>
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
                    <Label htmlFor="travelDate">Date de voyage</Label>
                    <Input id="travelDate" name="travelDate" type="date" value={formData.travelDate} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passengers">Nombre de passagers</Label>
                    <Input id="passengers" name="passengers" type="number" min="1" max="50" value={formData.passengers} onChange={handleChange} placeholder="Ex: 4" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pickup">Lieu de prise en charge</Label>
                    <Input id="pickup" name="pickup" value={formData.pickup} onChange={handleChange} placeholder="Ex: Aéroport AIBD" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dropoff">Destination</Label>
                    <Input id="dropoff" name="dropoff" value={formData.dropoff} onChange={handleChange} placeholder="Ex: Hôtel Terrou-Bi, Dakar" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message / Demandes spéciales</Label>
                  <Textarea id="message" name="message" value={formData.message} onChange={handleChange} rows={4} placeholder="Dites-nous en plus sur votre voyage..." required />
                </div>

                <Button type="submit" variant="hero" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? "Envoi en cours..." : <><Send className="w-4 h-4 mr-2" /> Envoyer le message</>}
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
                  <h3 className="font-display text-lg font-semibold text-foreground">Horaires d'ouverture</h3>
                </div>
                <div className="space-y-2 text-muted-foreground">
                  <div className="flex justify-between"><span>Lundi - Dimanche</span><span className="font-medium text-foreground">8h00 - 20h00</span></div>
                  <div className="flex justify-between"><span>Support WhatsApp</span><span className="font-medium text-foreground">24h/24</span></div>
                </div>
              </div>

              <div className="bg-primary text-primary-foreground rounded-2xl p-6">
                <h3 className="font-display text-lg font-semibold mb-3">Notre engagement</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-accent" /><span>Devis sous 2h en heures ouvrées</span></li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-accent" /><span>Réponse email sous 24h</span></li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-accent" /><span>WhatsApp pour les urgences</span></li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
