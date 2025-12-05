import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

export function Footer() {
  const { t } = useTranslation();

  const footerLinks = useMemo(() => ({
    company: [{
      href: "/about",
      label: t("footer.aboutUs")
    }, {
      href: "/fleet",
      label: t("footer.ourFleet")
    }, {
      href: "/services",
      label: t("nav.services")
    }, {
      href: "/blog",
      label: t("nav.blog")
    }],
    support: [{
      href: "/contact",
      label: t("footer.contact")
    }, {
      href: "/faq",
      label: t("nav.faq")
    }, {
      href: "/terms",
      label: t("footer.terms")
    }, {
      href: "/privacy",
      label: t("footer.privacy")
    }],
    services: [{
      href: "/services#transfers",
      label: t("footer.airportTransfers")
    }, {
      href: "/services#daily",
      label: t("footer.dailyRental")
    }, {
      href: "/services#tours",
      label: t("footer.toursExcursions")
    }, {
      href: "/services#events",
      label: t("footer.eventServices")
    }]
  }), [t]);

  const currentYear = new Date().getFullYear();

  return <footer className="bg-secondary text-secondary-foreground">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 bg-primary-foreground/5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
        {/* Brand */}
        <div className="lg:col-span-2 space-y-6">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Sunuvan" className="h-10 w-auto object-contain" />
          </Link>
          <p className="max-w-sm text-secondary-foreground/80 leading-relaxed">
            {t("footer.description")}
          </p>
          <div className="space-y-4">
            <a href="tel:+221XXXXXXXX" className="flex items-center gap-3 text-secondary-foreground/80 hover:text-primary transition-colors group">
              <span className="p-2 rounded-full bg-secondary-foreground/5 group-hover:bg-primary/10 transition-colors">
                <Phone className="w-4 h-4" />
              </span>
              <span>+221 XX XXX XX XX</span>
            </a>
            <a href="mailto:info@sunuvan.com" className="flex items-center gap-3 text-secondary-foreground/80 hover:text-primary transition-colors group">
              <span className="p-2 rounded-full bg-secondary-foreground/5 group-hover:bg-primary/10 transition-colors">
                <Mail className="w-4 h-4" />
              </span>
              <span>info@sunuvan.com</span>
            </a>
            <div className="flex items-center gap-3 text-secondary-foreground/80 group">
              <span className="p-2 rounded-full bg-secondary-foreground/5 group-hover:bg-primary/10 transition-colors">
                <MapPin className="w-4 h-4" />
              </span>
              <span>Dakar, Senegal</span>
            </div>
          </div>
        </div>

        {/* Company Links */}
        <div>
          <h4 className="font-display font-semibold text-lg mb-6 text-primary">{t("footer.company")}</h4>
          <ul className="space-y-3">
            {footerLinks.company.map(link => <li key={link.href}>
              <Link to={link.href} className="text-secondary-foreground/70 hover:text-primary transition-colors flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/20 group-hover:bg-primary transition-colors" />
                {link.label}
              </Link>
            </li>)}
          </ul>
        </div>

        {/* Services Links */}
        <div>
          <h4 className="font-display font-semibold text-lg mb-6 text-primary">{t("footer.services")}</h4>
          <ul className="space-y-3">
            {footerLinks.services.map(link => <li key={link.href}>
              <Link to={link.href} className="text-secondary-foreground/70 hover:text-primary transition-colors flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/20 group-hover:bg-primary transition-colors" />
                {link.label}
              </Link>
            </li>)}
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h4 className="font-display font-semibold text-lg mb-6 text-primary">{t("footer.support")}</h4>
          <ul className="space-y-3">
            {footerLinks.support.map(link => <li key={link.href}>
              <Link to={link.href} className="text-secondary-foreground/70 hover:text-primary transition-colors flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/20 group-hover:bg-primary transition-colors" />
                {link.label}
              </Link>
            </li>)}
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-16 pt-8 border-t border-secondary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <p className="text-secondary-foreground/50 text-sm font-light">
          {t("footer.copyright").replace("2024", currentYear.toString())}
        </p>
        <div className="flex items-center gap-4">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-secondary-foreground/5 flex items-center justify-center text-secondary-foreground/70 hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all duration-300"
            aria-label="Facebook">
            <Facebook className="w-5 h-5" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-secondary-foreground/5 flex items-center justify-center text-secondary-foreground/70 hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all duration-300"
            aria-label="Instagram">
            <Instagram className="w-5 h-5" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-secondary-foreground/5 flex items-center justify-center text-secondary-foreground/70 hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all duration-300"
            aria-label="LinkedIn">
            <Linkedin className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  </footer>;
}