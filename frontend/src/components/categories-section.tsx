"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { catalogApi } from "@/lib/api";
import type { Product } from "@/types";
import { motion } from "framer-motion";
import {
  Camera,
  Gamepad2,
  Headphones,
  Laptop,
  Smartphone,
  Tablet,
  Tag,
  Watch,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface CategoryConfig {
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

const categoryIcons: Record<string, CategoryConfig> = {
  Smartphones: {
    icon: Smartphone,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
  },
  Laptops: {
    icon: Laptop,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-500/10",
  },
  Audio: {
    icon: Headphones,
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-500/10",
  },
  Watches: {
    icon: Watch,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-500/10",
  },
  Cameras: {
    icon: Camera,
    color: "from-yellow-500 to-orange-500",
    bgColor: "bg-yellow-500/10",
  },
  Gaming: {
    icon: Gamepad2,
    color: "from-indigo-500 to-purple-500",
    bgColor: "bg-indigo-500/10",
  },
  Tablets: {
    icon: Tablet,
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-500/10",
  },
};

const defaultConfig: CategoryConfig = {
  icon: Tag,
  color: "from-gray-500 to-slate-500",
  bgColor: "bg-gray-500/10",
};

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

export function CategoriesSection() {
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setIsLoading(true);
        const products = await catalogApi.getProducts(1, 100);
        const allCategories = products.flatMap(
          (product: Product) => product.categories || [],
        );
        const uniqueCategories = [...new Set(allCategories)].filter(
          (cat) =>
            cat &&
            ![
              "Apple",
              "Samsung",
              "Sony",
              "Dell",
              "Canon",
              "Nintendo",
              "Bose",
            ].includes(cat),
        );
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Explorez nos catégories
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Trouvez exactement ce que vous cherchez parmi notre large sélection
            de produits technologiques.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {categories.map((categoryName) => {
            const config = categoryIcons[categoryName] || defaultConfig;
            const IconComponent = config.icon;

            return (
              <motion.div key={categoryName} variants={itemVariants}>
                <Link
                  href={`/products?category=${encodeURIComponent(categoryName)}`}
                >
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative p-6 rounded-2xl ${config.bgColor} border border-transparent hover:border-primary/20 transition-all cursor-pointer overflow-hidden`}
                  >
                    <motion.div
                      whileHover={{ rotate: 12 }}
                      className={`inline-flex p-3 rounded-xl bg-linear-to-br ${config.color} text-white mb-4`}
                    >
                      <IconComponent className="h-6 w-6" />
                    </motion.div>

                    <h3 className="font-semibold text-lg relative z-10">
                      {categoryName}
                    </h3>

                    <div
                      className={`absolute inset-0 rounded-2xl bg-linear-to-br ${config.color} opacity-0 hover:opacity-10 transition-opacity pointer-events-none`}
                    />
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
