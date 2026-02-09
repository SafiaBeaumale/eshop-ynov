"use client";

import { StaticPage } from "@/components/static-page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Clock, MapPin, Package, Truck } from "lucide-react";

export default function LivraisonPage() {
  return (
    <StaticPage
      title="Livraison"
      description="Découvrez nos options de livraison rapides et fiables."
      icon={Truck}
    >
      <div className="space-y-8 mt-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Nos options de livraison</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Package className="h-5 w-5 text-primary" />
                  Standard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-primary mb-2">4,99 €</p>
                <p className="text-muted-foreground">Livraison en 3-5 jours ouvrés</p>
                <p className="text-sm text-green-600 mt-2">Gratuite dès 50€ d'achat</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Truck className="h-5 w-5 text-primary" />
                  Express
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-primary mb-2">9,99 €</p>
                <p className="text-muted-foreground">Livraison en 24-48h</p>
                <p className="text-sm text-muted-foreground mt-2">Commande avant 14h</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="h-5 w-5 text-primary" />
                  Point Relais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-primary mb-2">3,99 €</p>
                <p className="text-muted-foreground">Livraison en 3-5 jours ouvrés</p>
                <p className="text-sm text-green-600 mt-2">Gratuite dès 30€ d'achat</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Zones de livraison</h2>
          <div className="bg-muted/50 rounded-lg p-6">
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                <span>France métropolitaine</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                <span>Belgique</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                <span>Luxembourg</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                <span>Suisse</span>
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Suivi de commande</h2>
          <div className="flex items-start gap-4 bg-muted/50 rounded-lg p-6">
            <Clock className="h-6 w-6 text-primary mt-1" />
            <div>
              <p className="font-medium">Suivi en temps réel</p>
              <p className="text-muted-foreground">
                Recevez des notifications à chaque étape de la livraison. Un email
                avec le numéro de suivi vous est envoyé dès l'expédition de votre colis.
              </p>
            </div>
          </div>
        </section>
      </div>
    </StaticPage>
  );
}
