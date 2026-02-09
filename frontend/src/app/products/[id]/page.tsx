"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/context/cart-context";
import { catalogApi } from "@/lib/api";
import type { Product } from "@/types";
import { motion } from "framer-motion";
import {
  Check,
  ChevronLeft,
  Heart,
  Minus,
  Plus,
  RotateCcw,
  Share2,
  Shield,
  ShoppingCart,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const features = [
  { icon: Truck, text: "Livraison gratuite", desc: "Dès 50€ d'achat" },
  { icon: Shield, text: "Garantie 2 ans", desc: "Satisfait ou remboursé" },
  { icon: RotateCcw, text: "Retour gratuit", desc: "Sous 30 jours" },
];

// Check if string is a valid URL
const isValidUrl = (str: string): boolean => {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
};

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;

  const { addToCart, isLoading: cartLoading } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setIsLoading(true);
        const data = await catalogApi.getProductById(productId);
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Produit non trouvé</h1>
        <Link href="/products">
          <Button>Retour aux produits</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Retour aux produits
          </Link>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="sticky top-24">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative aspect-square rounded-3xl overflow-hidden bg-linear-to-br from-muted/50 to-muted"
              >
                <Image
                  src={
                    product.imageFile && isValidUrl(product.imageFile)
                      ? product.imageFile
                      : "/placeholder.svg"
                  }
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col"
          >
            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-4">
              {product.categories?.map((category) => (
                <Link key={category} href={`/products?category=${category}`}>
                  <Badge variant="secondary" className="cursor-pointer">
                    {category}
                  </Badge>
                </Link>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-primary">
                {formatPrice(product.price)}
              </span>
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(product.price * 1.2)}
              </span>
              <Badge variant="destructive" className="text-sm">
                -20%
              </Badge>
            </div>

            {/* Description */}
            <p className="text-muted-foreground mb-8 leading-relaxed">
              {product.description}
            </p>

            <Separator className="my-6" />

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6">
              <span className="font-medium">Quantité:</span>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-10 w-10 rounded-full border flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </motion.button>
                <span className="w-12 text-center font-semibold text-lg">
                  {quantity}
                </span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-10 w-10 rounded-full border flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </motion.button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex gap-3 mb-8">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1"
              >
                <Button
                  size="lg"
                  className="w-full gap-2 h-14 text-base"
                  onClick={handleAddToCart}
                  disabled={cartLoading}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Ajouter au panier
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" variant="outline" className="h-14 w-14 p-0">
                  <Share2 className="h-5 w-5" />
                </Button>
              </motion.div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2 text-green-600 mb-8">
              <Check className="h-5 w-5" />
              <span className="font-medium">
                En stock - Expédition sous 24h
              </span>
            </div>

            <Separator className="my-6" />

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.text}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-start gap-3 p-4 rounded-xl bg-muted/50"
                >
                  <feature.icon className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">{feature.text}</p>
                    <p className="text-xs text-muted-foreground">
                      {feature.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
