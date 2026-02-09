"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/context/cart-context";
import type { Product } from "@/types";
import { motion } from "framer-motion";
import { Eye, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
  index?: number;
}

// Check if string is a valid URL
const isValidUrl = (str: string): boolean => {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
};

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart, isLoading } = useCart();

  // Use placeholder if imageFile is not a valid URL
  const imageUrl =
    product.imageFile && isValidUrl(product.imageFile)
      ? product.imageFile
      : "/placeholder.svg";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  // Format price to EUR
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link href={`/products/${product.id}`}>
        <Card className="group relative overflow-hidden h-full border-0 shadow-md hover:shadow-xl transition-all duration-300">
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-linear-to-br from-muted/50 to-muted">
            {/* Product Image */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </motion.div>

            {/* Category Badges */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-1">
              {product.categories?.slice(0, 2).map((category) => (
                <Badge
                  key={category}
                  variant="secondary"
                  className="text-xs bg-background/80 backdrop-blur-sm"
                >
                  {category}
                </Badge>
              ))}
            </div>

            {/* Hover Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileHover={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-10 w-10 rounded-full"
                  onClick={handleAddToCart}
                  disabled={isLoading}
                >
                  <ShoppingCart className="h-5 w-5" />
                </Button>
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                whileHover={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15 }}
              >
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-10 w-10 rounded-full"
                >
                  <Eye className="h-5 w-5" />
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Content */}
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1 h-10">
              {product.description}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xl font-bold text-primary">
                {formatPrice(product.price)}
              </span>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="sm"
                  onClick={handleAddToCart}
                  disabled={isLoading}
                  className="gap-1"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span className="hidden sm:inline">Ajouter</span>
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
