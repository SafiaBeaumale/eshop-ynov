"use client";

import { AdminGuard } from "@/components/admin-guard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { orderingApi } from "@/lib/api";
import type { Order, OrderStatus } from "@/types";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  CreditCard,
  Edit2,
  Loader2,
  Mail,
  MapPin,
  Package,
  Truck,
  User,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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

const statusSteps = [
  { status: 1, label: "En attente" },
  { status: 2, label: "Soumise" },
  { status: 3, label: "Confirmée" },
  { status: 4, label: "Expédiée" },
  { status: 5, label: "Livrée" },
];

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrder() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await orderingApi.getOrderById(orderId);
        setOrder(data);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Commande non trouvée");
      } finally {
        setIsLoading(false);
      }
    }

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const handleStatusChange = async (newStatus: string) => {
    if (!order) return;

    const statusNumber = parseInt(newStatus, 10);
    if (statusNumber === order.orderStatus) return;

    setIsUpdating(true);
    try {
      await orderingApi.updateOrderStatus(orderId, statusNumber);
      setOrder({ ...order, orderStatus: statusNumber as OrderStatus });
      toast.success("Statut mis à jour avec succès");
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Erreur lors de la mise à jour du statut");
    } finally {
      setIsUpdating(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(price);
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
          <Skeleton className="h-8 w-32 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-64 w-full rounded-xl" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-48 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </AdminGuard>
    );
  }

  if (error || !order) {
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
              <XCircle className="h-12 w-12 text-muted-foreground" />
            </motion.div>
            <h1 className="text-2xl font-bold mb-2">Commande non trouvée</h1>
            <p className="text-muted-foreground mb-8">
              La commande que vous recherchez n&apos;existe pas ou a été
              supprimée.
            </p>
            <Link href="/orders">
              <Button className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Retour aux commandes
              </Button>
            </Link>
          </motion.div>
        </div>
      </AdminGuard>
    );
  }

  const status = statusConfig[order.orderStatus];
  const StatusIcon = status?.icon || Clock;
  const currentStatusIndex = statusSteps.findIndex(
    (s) => s.status === order.orderStatus,
  );
  const isCancelled = order.orderStatus === 6;

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
            <Link href="/orders">
              <Button variant="ghost" className="gap-2 mb-4">
                <ArrowLeft className="h-4 w-4" />
                Retour aux commandes
              </Button>
            </Link>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{order.orderName}</h1>
                <p className="text-muted-foreground">ID: {order.id}</p>
              </div>
              <Badge
                className={`${status?.color} text-white gap-2 text-base px-4 py-2`}
              >
                <StatusIcon className="h-4 w-4" />
                {status?.label}
              </Badge>
            </div>
          </motion.div>

          {/* Status Timeline */}
          {!isCancelled && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    {statusSteps.map((step, index) => {
                      const isCompleted = index <= currentStatusIndex;
                      const isCurrent = index === currentStatusIndex;

                      return (
                        <div
                          key={step.status}
                          className="flex flex-col items-center flex-1"
                        >
                          <div className="flex items-center w-full">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                                isCompleted
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-muted-foreground"
                              } ${isCurrent ? "ring-4 ring-primary/30" : ""}`}
                            >
                              {isCompleted ? (
                                <CheckCircle className="h-4 w-4" />
                              ) : (
                                index + 1
                              )}
                            </div>
                            {index < statusSteps.length - 1 && (
                              <div
                                className={`flex-1 h-1 mx-2 ${
                                  index < currentStatusIndex
                                    ? "bg-primary"
                                    : "bg-muted"
                                }`}
                              />
                            )}
                          </div>
                          <span
                            className={`mt-2 text-xs text-center ${
                              isCompleted
                                ? "text-primary font-medium"
                                : "text-muted-foreground"
                            }`}
                          >
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Items */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Articles commandés
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.orderItems.map((item, index) => (
                      <motion.div
                        key={item.productId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                            <Package className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <div>
                            <h4 className="font-medium">{item.productName}</h4>
                            <p className="text-sm text-muted-foreground">
                              Quantité: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatPrice(item.price)} / unité
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-2">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Sous-total</span>
                      <span>{formatPrice(calculateTotal(order))}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Livraison</span>
                      <span>Gratuite</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">
                        {formatPrice(calculateTotal(order))}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status Management */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Edit2 className="h-4 w-4" />
                      Modifier le statut
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select
                      value={order.orderStatus.toString()}
                      onValueChange={handleStatusChange}
                      disabled={isUpdating}
                    >
                      <SelectTrigger className="w-full">
                        {isUpdating ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Mise à jour...</span>
                          </div>
                        ) : (
                          <SelectValue />
                        )}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-yellow-500" />
                            En attente
                          </div>
                        </SelectItem>
                        <SelectItem value="2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                            Soumise
                          </div>
                        </SelectItem>
                        <SelectItem value="3">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-indigo-500" />
                            Confirmée
                          </div>
                        </SelectItem>
                        <SelectItem value="4">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-purple-500" />
                            Expédiée
                          </div>
                        </SelectItem>
                        <SelectItem value="5">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            Livrée
                          </div>
                        </SelectItem>
                        <SelectItem value="6">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                            Annulée
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Shipping Address */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <MapPin className="h-4 w-4" />
                      Adresse de livraison
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {order.shippingAddress.firstName}{" "}
                        {order.shippingAddress.lastName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{order.shippingAddress.emailAddress}</span>
                    </div>
                    <Separator className="my-2" />
                    <p>{order.shippingAddress.addressLine}</p>
                    <p>
                      {order.shippingAddress.zipCode}{" "}
                      {order.shippingAddress.state}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Payment Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <CreditCard className="h-4 w-4" />
                      Paiement
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Carte</span>
                      <span>{order.payment.cardNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Titulaire</span>
                      <span>{order.payment.cardName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Expiration</span>
                      <span>{order.payment.expiration}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
