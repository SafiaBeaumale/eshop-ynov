"use client";

import { Button } from "@/components/ui/button";
import { discountApi } from "@/lib/api";
import type { Discount } from "@/types";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Percent, Shield, Truck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const staticFeatures = [
  {
    icon: Truck,
    title: "Livraison gratuite",
    description: "Pour toute commande supérieure à 50€",
    color: "from-blue-500 to-cyan-600",
  },
  {
    icon: Shield,
    title: "Garantie étendue",
    description: "2 ans de garantie sur tous nos produits",
    color: "from-emerald-500 to-green-600",
  },
  {
    icon: Clock,
    title: "Support 24/7",
    description: "Notre équipe est là pour vous aider",
    color: "from-amber-500 to-orange-600",
  },
];

export function PromoSection() {
  const [globalDiscounts, setGlobalDiscounts] = useState<Discount[]>([]);

  useEffect(() => {
    discountApi.getGlobalDiscounts().then(setGlobalDiscounts);
  }, []);

  const promoItems = [
    ...globalDiscounts.map((d) => ({
      icon: Percent,
      title: d.description,
      description:
        d.type === 0
          ? `${d.amount}% de réduction sur votre panier`
          : `${d.amount}€ de réduction sur votre panier`,
      color: "from-rose-500 to-pink-600",
    })),
    ...staticFeatures,
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {promoItems.map((promo, index) => (
            <motion.div
              key={promo.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="relative group"
            >
              <div className="p-6 rounded-2xl border bg-card hover:shadow-lg transition-all">
                <motion.div
                  whileHover={{ rotate: 12, scale: 1.1 }}
                  className={`inline-flex p-3 rounded-xl bg-linear-to-br ${promo.color} text-white mb-4`}
                >
                  <promo.icon className="h-6 w-6" />
                </motion.div>
                <h3 className="font-semibold text-lg mb-2">{promo.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {promo.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary via-yellow-600 to-orange-600 p-8 md:p-12"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 50,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute -top-1/2 -right-1/2 w-full h-full bg-white/5 rounded-full"
            />
            <motion.div
              animate={{
                rotate: [360, 0],
              }}
              transition={{
                duration: 40,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-white/5 rounded-full"
            />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left text-white">
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-medium mb-4"
              >
                {globalDiscounts.length > 0
                  ? `${globalDiscounts.length} offre${globalDiscounts.length > 1 ? "s" : ""} en cours`
                  : "Découvrez nos produits"}
              </motion.span>
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                {globalDiscounts.length > 0
                  ? "Promotions en cours"
                  : "Notre sélection"}
              </h2>
              <p className="text-white/80 text-lg max-w-md">
                {globalDiscounts.length > 0
                  ? "Profitez de nos réductions en cours sur toute notre gamme de produits !"
                  : "Découvrez notre gamme de produits tech de qualité."}
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/products">
                <Button
                  size="lg"
                  variant="secondary"
                  className="gap-2 text-base font-semibold"
                >
                  Voir les produits
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
