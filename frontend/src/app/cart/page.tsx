"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/context/cart-context";
import { AnimatePresence, motion } from "framer-motion";
import { discountApi } from "@/lib/api";
import type { Discount } from "@/types";
import {
  ArrowRight,
  Minus,
  Plus,
  Shield,
  ShoppingBag,
  ShoppingCart,
  Tag,
  Trash2,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartPage() {
  const {
    cart,
    isLoading,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    cartItemCount,
  } = useCart();

  const [globalDiscounts, setGlobalDiscounts] = useState<Discount[]>([]);
  const [productDiscounts, setProductDiscounts] = useState<
    Record<string, Discount[]>
  >({});

  useEffect(() => {
    discountApi.getGlobalDiscounts().then(setGlobalDiscounts);
  }, []);

  useEffect(() => {
    if (!cart?.items) return;
    const fetchProductDiscounts = async () => {
      const results: Record<string, Discount[]> = {};
      await Promise.all(
        cart.items.map(async (item) => {
          const discounts = await discountApi.getProductDiscounts(
            item.productName,
          );
          if (discounts.length > 0) {
            results[item.productId] = discounts;
          }
        }),
      );
      setProductDiscounts(results);
    };
    fetchProductDiscounts();
  }, [cart?.items]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  // Helper: calculate the saving amount of a single discount on a price
  const discountSaving = (price: number, d: Discount) =>
    d.type === 0 ? price * (d.amount / 100) : d.amount;

  // Helper: apply a list of discounts to a price
  const applyDiscounts = (price: number, discounts: Discount[]) => {
    let result = price;
    for (const d of discounts) {
      result -= discountSaving(price, d);
    }
    return Math.max(0, result);
  };

  // Product-level discount savings (per item)
  const productDiscountSavings =
    cart?.items?.reduce((total, item) => {
      const discounts = productDiscounts[item.productId];
      if (!discounts) return total;
      return (
        total +
        (item.price - applyDiscounts(item.price, discounts)) * item.quantity
      );
    }, 0) ?? 0;

  // Build product discount lines grouped by product for the recap
  const productDiscountGroups =
    cart?.items
      ?.filter((item) => productDiscounts[item.productId]?.length > 0)
      .map((item) => ({
        productName: item.productName,
        productId: item.productId,
        lines: productDiscounts[item.productId].map((d) => ({
          id: `${item.productId}-${d.id}`,
          description: d.description,
          type: d.type,
          amount: d.amount,
          saving: discountSaving(item.price, d) * item.quantity,
        })),
      })) ?? [];

  // Global discounts apply on subtotal AFTER product discounts
  const subtotalAfterProducts = cartTotal - productDiscountSavings;
  const globalDiscountSavings = globalDiscounts.reduce(
    (total, d) => total + discountSaving(subtotalAfterProducts, d),
    0,
  );
  const subtotalAfterDiscounts = Math.max(
    0,
    subtotalAfterProducts - globalDiscountSavings,
  );

  const shippingCost = subtotalAfterDiscounts >= 50 ? 0 : 4.99;
  const finalTotal = subtotalAfterDiscounts + shippingCost;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-80 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="inline-flex p-6 rounded-full bg-muted mb-6"
          >
            <ShoppingCart className="h-12 w-12 text-muted-foreground" />
          </motion.div>
          <h1 className="text-2xl font-bold mb-2">Votre panier est vide</h1>
          <p className="text-muted-foreground mb-8">
            Découvrez nos produits et ajoutez-les à votre panier
          </p>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link href="/products">
              <Button size="lg" className="gap-2">
                <ShoppingBag className="h-5 w-5" />
                Voir nos produits
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold">Votre panier</h1>
            <p className="text-muted-foreground">
              {cartItemCount} article{cartItemCount > 1 ? "s" : ""}
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="ghost"
              className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-2"
              onClick={clearCart}
            >
              <Trash2 className="h-4 w-4" />
              Vider le panier
            </Button>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="popLayout">
              {cart.items.map((item, index) => (
                <motion.div
                  key={item.productId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                >
                  <Card className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {/* Image */}
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="relative h-24 w-24 shrink-0 rounded-lg overflow-hidden bg-muted"
                        >
                          <Image
                            src={item.imageFile}
                            alt={item.productName}
                            fill
                            className="object-cover"
                          />
                        </motion.div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/products/${item.productId}`}
                            className="font-semibold hover:text-primary transition-colors line-clamp-1"
                          >
                            {item.productName}
                          </Link>
                          {item.color && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Couleur: {item.color}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <p className="font-bold text-primary">
                              {productDiscounts[item.productId]
                                ? formatPrice(
                                    applyDiscounts(
                                      item.price,
                                      productDiscounts[item.productId],
                                    ),
                                  )
                                : formatPrice(item.price)}
                            </p>
                            {productDiscounts[item.productId] && (
                              <>
                                <span className="text-sm text-muted-foreground line-through">
                                  {formatPrice(item.price)}
                                </span>
                                {productDiscounts[item.productId].map((d) => (
                                  <span
                                    key={d.id}
                                    className="text-xs text-green-600 font-medium"
                                  >
                                    {d.type === 0
                                      ? `-${d.amount}%`
                                      : `-${d.amount}€`}
                                  </span>
                                ))}
                              </>
                            )}
                          </div>
                        </div>

                        {/* Quantity & Delete */}
                        <div className="flex flex-col items-end justify-between">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeFromCart(item.productId)}
                            className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </motion.button>

                          <div className="flex items-center gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity - 1,
                                )
                              }
                              className="h-8 w-8 rounded-full border flex items-center justify-center hover:bg-muted transition-colors"
                            >
                              <Minus className="h-3 w-3" />
                            </motion.button>
                            <span className="w-8 text-center font-medium">
                              {item.quantity}
                            </span>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity + 1,
                                )
                              }
                              className="h-8 w-8 rounded-full border flex items-center justify-center hover:bg-muted transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="sticky top-24">
                <CardHeader>
                  <h2 className="text-xl font-semibold">Récapitulatif</h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sous-total</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>

                  {/* Product discounts */}
                  {productDiscountGroups.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        Réductions produits
                      </span>
                      {productDiscountGroups.map((group) => (
                        <div key={group.productId} className="space-y-1">
                          <span className="text-xs font-medium text-muted-foreground">
                            Reduction {group.productName}
                          </span>
                          {group.lines.map((line) => (
                            <div
                              key={line.id}
                              className="flex justify-between text-green-600 text-sm"
                            >
                              <span className="flex items-center gap-1">
                                <Tag className="h-3 w-3" />
                                {line.description} (
                                {line.type === 0
                                  ? `-${line.amount}%`
                                  : `-${line.amount}€`}
                                )
                              </span>
                              <span>-{formatPrice(line.saving)}</span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Global / cart discounts */}
                  {globalDiscounts.length > 0 && globalDiscountSavings > 0 && (
                    <div className="space-y-1">
                      <span className="text-sm font-medium text-muted-foreground">
                        Réductions panier
                      </span>
                      {globalDiscounts.map((discount) => (
                        <div
                          key={discount.id}
                          className="flex justify-between text-green-600 text-sm"
                        >
                          <span className="flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            {discount.description} (
                            {discount.type === 0
                              ? `-${discount.amount}%`
                              : `-${discount.amount}€`}
                            )
                          </span>
                          <span>
                            -
                            {formatPrice(
                              discountSaving(subtotalAfterProducts, discount),
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Livraison</span>
                    <span>
                      {shippingCost === 0 ? (
                        <span className="text-green-600 font-medium">
                          Gratuite
                        </span>
                      ) : (
                        formatPrice(shippingCost)
                      )}
                    </span>
                  </div>
                  {shippingCost > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Plus que{" "}
                      {formatPrice(50 - subtotalAfterDiscounts)} pour la
                      livraison gratuite !
                    </p>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">
                      {formatPrice(finalTotal)}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="flex-col gap-3">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full"
                  >
                    <Link href="/checkout" className="w-full">
                      <Button size="lg" className="w-full gap-2">
                        Commander
                        <ArrowRight className="h-5 w-5" />
                      </Button>
                    </Link>
                  </motion.div>
                  <Link
                    href="/products"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Continuer mes achats
                  </Link>
                </CardFooter>

                {/* Trust badges */}
                <div className="px-6 pb-6 space-y-3">
                  <Separator />
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Truck className="h-4 w-4" />
                    <span>Livraison gratuite dès 50€</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span>Paiement 100% sécurisé</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
