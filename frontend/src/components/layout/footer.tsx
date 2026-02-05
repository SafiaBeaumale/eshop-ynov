"use client";

import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { Cpu, Github, Linkedin, Mail, Twitter } from "lucide-react";
import Link from "next/link";

const footerLinks = {
  shop: [{ href: "/products", label: "Tous les produits" }],
  support: [
    { href: "/support", label: "Support" },
    { href: "/faq", label: "FAQ" },
    { href: "/livraison", label: "Livraison" },
    { href: "/retours", label: "Retours" },
    { href: "/contact", label: "Contact" },
  ],
  company: [
    { href: "/a-propos", label: "À propos" },
    { href: "/carrieres", label: "Carrières" },
    { href: "/blog", label: "Blog" },
    { href: "/presse", label: "Presse" },
  ],
};

const socialLinks = [
  { href: "#", icon: Twitter, label: "Twitter" },
  { href: "#", icon: Github, label: "GitHub" },
  { href: "#", icon: Linkedin, label: "LinkedIn" },
  { href: "#", icon: Mail, label: "Email" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function Footer() {
  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="bg-muted/30 border-t"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Cpu className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold bg-linear-to-r from-primary to-orange-600 bg-clip-text text-transparent">
                TechShop
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs mb-4">
              Votre destination pour les dernières innovations technologiques.
              Qualité, innovation et service client d&apos;exception.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="h-10 w-10 flex items-center justify-center rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Shop Links */}
          <motion.div variants={itemVariants}>
            <h3 className="font-semibold mb-4">Boutique</h3>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div variants={itemVariants}>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company Links */}
          <motion.div variants={itemVariants}>
            <h3 className="font-semibold mb-4">Entreprise</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <Separator className="my-8" />

        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground"
        >
          <p>
            &copy; {new Date().getFullYear()} TechShop. Tous droits réservés.
          </p>
          <div className="flex gap-4">
            <Link
              href="/politique-confidentialite"
              className="hover:text-primary transition-colors"
            >
              Politique de confidentialité
            </Link>
            <Link
              href="/conditions-utilisation"
              className="hover:text-primary transition-colors"
            >
              Conditions d&apos;utilisation
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}
