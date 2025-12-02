import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HelpCircle, ArrowRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqCategories = [
  {
    title: "Booking Process",
    questions: [
      {
        q: "How do I book a van?",
        a: "You can book through our website by filling out the contact form, or reach us directly via phone or WhatsApp. We'll provide a detailed quote within 2 hours during business hours.",
      },
      {
        q: "What information do you need for a quote?",
        a: "We need your travel dates, number of passengers, pickup and drop-off locations, and any special requirements. The more details you provide, the more accurate your quote will be.",
      },
      {
        q: "How far in advance should I book?",
        a: "We recommend booking at least 48 hours in advance for standard transfers, and 1-2 weeks ahead for tours or events during peak season (November-April). However, we always try to accommodate last-minute requests.",
      },
      {
        q: "Can I modify my booking after confirmation?",
        a: "Yes, modifications are free subject to availability. Please inform us as soon as possible about any changes to your itinerary.",
      },
    ],
  },
  {
    title: "Pricing & Payment",
    questions: [
      {
        q: "What's included in your prices?",
        a: "All our prices include: professional driver, fuel, tolls, insurance, parking fees, and fresh water. There are no hidden fees or surprises.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept cash (FCFA, EUR), Mobile Money (Orange Money, Wave), and bank transfers. A 30% deposit confirms your booking, with the balance due at the end of service.",
      },
      {
        q: "Do you offer discounts for long-term rentals?",
        a: "Yes, we offer special rates for weekly and monthly rentals, as well as corporate contracts. Contact us for a personalized quote.",
      },
      {
        q: "Are tips expected for drivers?",
        a: "Tips are not included in our prices and are entirely at your discretion. Our drivers appreciate recognition for excellent service, but it's never expected.",
      },
    ],
  },
  {
    title: "Services",
    questions: [
      {
        q: "What areas do you cover?",
        a: "We cover the entire Senegalese territory, from short airport transfers (AIBD, Dakar) to multi-day tours across the country including Saint-Louis, Casamance, Sine-Saloum, and more.",
      },
      {
        q: "Can I modify my itinerary during the trip?",
        a: "Absolutely! Flexibility is one of our core values. You can add stops, change routes, or adjust timing (except for flight pickups). Just communicate with your driver.",
      },
      {
        q: "Do you provide child seats?",
        a: "Yes, we can provide child seats and booster seats upon request. Please specify the ages of children when booking so we can prepare the appropriate equipment.",
      },
      {
        q: "Can you arrange airport pickups for late-night flights?",
        a: "Yes, we operate 24/7 for airport transfers. We monitor flight arrivals and adjust pickup times accordingly at no extra charge for delays.",
      },
    ],
  },
  {
    title: "Vehicles & Drivers",
    questions: [
      {
        q: "What types of vehicles do you have?",
        a: "Our fleet includes standard vans (8-12 seats), premium vans (Mercedes V-Class, 8 seats), and minibuses (16-20 seats). All vehicles are air-conditioned, well-maintained, and fully insured.",
      },
      {
        q: "Are your drivers licensed and insured?",
        a: "Absolutely. All our drivers are professionally licensed, insured, and trained in hospitality. They undergo background checks and regular training.",
      },
      {
        q: "Can the driver speak English/French?",
        a: "All our drivers speak fluent French. Many also speak English, and some speak additional languages. Let us know your preference when booking.",
      },
      {
        q: "Are vehicles equipped with WiFi?",
        a: "Premium vans include WiFi. For other vehicles, WiFi can be arranged upon request. All vehicles have USB charging ports.",
      },
    ],
  },
  {
    title: "Terms & Conditions",
    questions: [
      {
        q: "What is your cancellation policy?",
        a: "Cancellation more than 48 hours before: full deposit refund. Cancellation 24-48 hours: 50% refund. Cancellation less than 24 hours: deposit non-refundable. We understand plans change and always try to be flexible.",
      },
      {
        q: "What happens if my flight is delayed?",
        a: "We monitor all flight arrivals. For delays, we adjust pickup time at no extra charge. For significant delays (over 2 hours), we'll communicate via WhatsApp to confirm the new time.",
      },
      {
        q: "Is there a waiting time included?",
        a: "For airport pickups, 60 minutes of waiting time is included (from flight landing). For other pickups, 15 minutes is included. Additional waiting is charged at a reasonable hourly rate.",
      },
      {
        q: "What if there's a vehicle breakdown?",
        a: "While rare due to our rigorous maintenance, if a breakdown occurs, we immediately dispatch a replacement vehicle and compensate for any inconvenience caused.",
      },
    ],
  },
];

export default function FAQ() {
  return (
    <Layout>
      {/* Hero */}
      <section className="section-padding bg-gradient-hero">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6"
            >
              <HelpCircle className="w-8 h-8 text-primary" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6"
            >
              Frequently Asked Questions
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-muted-foreground"
            >
              Find answers to common questions about our services, booking process, 
              and policies.
            </motion.p>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="section-padding">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-12">
            {faqCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                viewport={{ once: true }}
              >
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                  {category.title}
                </h2>
                <Accordion type="single" collapsible className="space-y-3">
                  {category.questions.map((item, index) => (
                    <AccordionItem
                      key={index}
                      value={`${category.title}-${index}`}
                      className="bg-card rounded-xl shadow-soft border-none px-6"
                    >
                      <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary hover:no-underline py-5">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-5">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="section-padding bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              Still Have Questions?
            </h2>
            <p className="text-muted-foreground mb-8">
              Can't find the answer you're looking for? Our team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button variant="hero" size="lg">
                  Contact Us
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <a href="https://wa.me/221XXXXXXXX" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg">
                  WhatsApp Us
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
