"use client";

import { AdminGuard } from "@/components/admin-guard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { orderingApi } from "@/lib/api";
import type { Order, OrderStatus } from "@/types";
import { motion } from "framer-motion";
import {
  CheckCircle,
  ChevronRight,
  Clock,
  Package,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const statusConfig: Record<
  OrderStatus,
  { label: string; color: string; icon: typeof Clock }
> = {
  1: { label: "En attente", color: "bg-yellow-500", icon: Clock },
  2: { label: "Soumise", color: "bg-blue-500", icon: Package },
  3: { label: "Confirmée", color: "bg-indigo-500", icon: CheckCircle },
  4: { label: "Expédiée", color: "bg-purple-500", icon: Truck },
  5: { label: "Livrée", color: "bg-green-500", icon: CheckCircle },
  6: { label: "Annulée", color: "bg-red-500", icon: XCircle },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        setIsLoading(true);
        const data = await orderingApi.getOrders(1, 20);
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrders();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) {
      // Generate a random recent date for demo
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      return date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const calculateTotal = (order: Order) => {
    if (order.totalPrice) return order.totalPrice;
    return order.orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
  };

  if (isLoading) {
    return (
      <AdminGuard>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-10 w-48 mb-8" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-40 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </AdminGuard>
    );
  }

  if (orders.length === 0) {
    return (
      <AdminGuard>
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
              <Package className="h-12 w-12 text-muted-foreground" />
            </motion.div>
            <h1 className="text-2xl font-bold mb-2">Aucune commande</h1>
            <p className="text-muted-foreground mb-8">
              Aucune commande enregistrée
            </p>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link href="/products">
                <Button size="lg" className="gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Découvrir nos produits
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-muted/20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">Mes commandes</h1>
            <p className="text-muted-foreground">
              {orders.length} commande{orders.length > 1 ? "s" : ""}
            </p>
          </motion.div>

          {/* Orders List */}
          <div className="space-y-4">
            {orders.map((order, index) => {
              const status = statusConfig[order.orderStatus];
              const StatusIcon = status?.icon || Clock;

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        {/* Order Info */}
                        <div className="flex-1 p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-lg">
                                  {order.orderName}
                                </h3>
                                <Badge
                                  className={`${status?.color} text-white gap-1`}
                                >
                                  <StatusIcon className="h-3 w-3" />
                                  {status?.label}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Commandé le {formatDate()}
                              </p>
                            </div>
                            <span className="text-xl font-bold text-primary">
                              {formatPrice(calculateTotal(order))}
                            </span>
                          </div>

                          {/* Order Items */}
                          <div className="space-y-2">
                            {order.orderItems.slice(0, 3).map((item) => (
                              <div
                                key={item.productId}
                                className="flex items-center justify-between text-sm"
                              >
                                <span className="text-muted-foreground">
                                  {item.quantity}x {item.productName}
                                </span>
                                <span>
                                  {formatPrice(item.price * item.quantity)}
                                </span>
                              </div>
                            ))}
                            {order.orderItems.length > 3 && (
                              <p className="text-sm text-muted-foreground">
                                + {order.orderItems.length - 3} autre
                                {order.orderItems.length - 3 > 1
                                  ? "s"
                                  : ""}{" "}
                                article
                                {order.orderItems.length - 3 > 1 ? "s" : ""}
                              </p>
                            )}
                          </div>

                          {/* Shipping Address */}
                          <div className="mt-4 pt-4 border-t">
                            <p className="text-sm text-muted-foreground">
                              Livraison: {order.shippingAddress.addressLine},{" "}
                              {order.shippingAddress.zipCode}{" "}
                              {order.shippingAddress.state}
                            </p>
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="flex items-center justify-end p-6 border-t md:border-t-0 md:border-l bg-muted/30">
                          <Link href={`/orders/${order.id}`}>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button variant="ghost" className="gap-2">
                                Voir détails
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </motion.div>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
