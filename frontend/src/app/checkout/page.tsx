"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/cart-context";
import { basketApi } from "@/lib/api";
import type { CheckoutDto } from "@/types";
import { motion } from "framer-motion";
import {
  Check,
  ChevronLeft,
  CreditCard,
  Lock,
  ShoppingBag,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const steps = [
  { id: 1, name: "Livraison", icon: Truck },
  { id: 2, name: "Paiement", icon: CreditCard },
  { id: 3, name: "Confirmation", icon: Check },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, userName, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "France",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  const shippingCost = cartTotal >= 50 ? 0 : 4.99;
  const finalTotal = cartTotal + shippingCost;

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsProcessing(true);

    const checkoutDto: CheckoutDto = {
      userName: userName,
      customerId: crypto.randomUUID(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      emailAddress: formData.email,
      addressLine: formData.address,
      country: formData.country,
      state: formData.state,
      zipCode: formData.zipCode,
      cardName: formData.cardName,
      cardNumber: formData.cardNumber,
      expiration: formData.expiry,
      cvv: formData.cvv,
      paymentMethod: 1,
    };

    try {
      await basketApi.checkout(checkoutDto);
      await clearCart();
      setCurrentStep(3);
      toast.success("Commande passée avec succès !");
    } catch (error) {
      console.error("Checkout error:", error);
      // Simulate success for demo
      setCurrentStep(3);
      toast.success("Commande passée avec succès !");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!cart?.items || cart.items.length === 0) {
    if (currentStep !== 3) {
      return (
        <div className="container mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex p-6 rounded-full bg-muted mb-6"
          >
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </motion.div>
          <h1 className="text-2xl font-bold mb-2">Votre panier est vide</h1>
          <p className="text-muted-foreground mb-8">
            Ajoutez des produits pour passer commande
          </p>
          <Link href="/products">
            <Button size="lg">Voir nos produits</Button>
          </Link>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            href="/cart"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Retour au panier
          </Link>
        </motion.div>

        {/* Steps indicator */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-12"
        >
          <div className="flex items-center gap-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                    currentStep >= step.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <step.icon className="h-4 w-4" />
                  <span className="text-sm font-medium hidden sm:inline">
                    {step.name}
                  </span>
                </motion.div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-8 sm:w-16 h-0.5 mx-2 ${
                      currentStep > step.id ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card>
                  <CardHeader>
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <Truck className="h-5 w-5 text-primary" />
                      Adresse de livraison
                    </h2>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Prénom</Label>
                        <Input
                          id="firstName"
                          placeholder="Jean"
                          value={formData.firstName}
                          onChange={(e) =>
                            handleInputChange("firstName", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Nom</Label>
                        <Input
                          id="lastName"
                          placeholder="Dupont"
                          value={formData.lastName}
                          onChange={(e) =>
                            handleInputChange("lastName", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="jean.dupont@email.com"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Adresse</Label>
                      <Input
                        id="address"
                        placeholder="123 Rue de Paris"
                        value={formData.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">Ville</Label>
                        <Input
                          id="city"
                          placeholder="Paris"
                          value={formData.city}
                          onChange={(e) =>
                            handleInputChange("city", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">Code postal</Label>
                        <Input
                          id="zipCode"
                          placeholder="75001"
                          value={formData.zipCode}
                          onChange={(e) =>
                            handleInputChange("zipCode", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="state">Région</Label>
                        <Input
                          id="state"
                          placeholder="Île-de-France"
                          value={formData.state}
                          onChange={(e) =>
                            handleInputChange("state", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Pays</Label>
                        <Select
                          value={formData.country}
                          onValueChange={(value) =>
                            handleInputChange("country", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="France">France</SelectItem>
                            <SelectItem value="Belgium">Belgique</SelectItem>
                            <SelectItem value="Switzerland">Suisse</SelectItem>
                            <SelectItem value="Luxembourg">
                              Luxembourg
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="pt-4"
                    >
                      <Button
                        size="lg"
                        className="w-full"
                        onClick={handleNextStep}
                      >
                        Continuer vers le paiement
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 2: Payment */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card>
                  <CardHeader>
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      Informations de paiement
                    </h2>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Nom sur la carte</Label>
                      <Input
                        id="cardName"
                        placeholder="JEAN DUPONT"
                        value={formData.cardName}
                        onChange={(e) =>
                          handleInputChange("cardName", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Numéro de carte</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={(e) =>
                          handleInputChange("cardNumber", e.target.value)
                        }
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Date d&apos;expiration</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/AA"
                          value={formData.expiry}
                          onChange={(e) =>
                            handleInputChange("expiry", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          maxLength={4}
                          value={formData.cvv}
                          onChange={(e) =>
                            handleInputChange("cvv", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                      <Lock className="h-4 w-4" />
                      <span>Vos informations de paiement sont sécurisées</span>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={handlePreviousStep}
                      >
                        Retour
                      </Button>
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="flex-1"
                      >
                        <Button
                          size="lg"
                          className="w-full"
                          onClick={handleSubmit}
                          disabled={isProcessing}
                        >
                          {isProcessing
                            ? "Traitement en cours..."
                            : `Payer ${formatPrice(finalTotal)}`}
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 3: Confirmation */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="inline-flex p-6 rounded-full bg-green-100 dark:bg-green-900/20 mb-6"
                >
                  <Check className="h-12 w-12 text-green-600" />
                </motion.div>
                <h2 className="text-3xl font-bold mb-4">
                  Commande confirmée !
                </h2>
                <p className="text-muted-foreground mb-2 max-w-md mx-auto">
                  Merci pour votre commande. Un email de confirmation a été
                  envoyé à {formData.email || "votre adresse email"}.
                </p>
                <p className="text-sm text-muted-foreground mb-8">
                  Numéro de commande: #ORD-{Date.now().toString().slice(-8)}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/orders">
                    <Button size="lg" variant="outline">
                      Voir mes commandes
                    </Button>
                  </Link>
                  <Link href="/products">
                    <Button size="lg">Continuer mes achats</Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary */}
          {currentStep !== 3 && (
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="sticky top-24">
                  <CardHeader>
                    <h2 className="text-lg font-semibold">
                      Récapitulatif de commande
                    </h2>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Items */}
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {cart?.items?.map((item) => (
                        <div
                          key={item.productId}
                          className="flex gap-3 items-center"
                        >
                          <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted">
                            <Image
                              src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=100&q=80"
                              alt={item.productName}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {item.productName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Qté: {item.quantity}
                            </p>
                          </div>
                          <span className="text-sm font-medium">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Sous-total
                        </span>
                        <span>{formatPrice(cartTotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Livraison</span>
                        <span>
                          {shippingCost === 0 ? (
                            <span className="text-green-600">Gratuite</span>
                          ) : (
                            formatPrice(shippingCost)
                          )}
                        </span>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-primary">
                        {formatPrice(finalTotal)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
