"use client";

import { StaticPage } from "@/components/static-page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeftRight,
  Box,
  CheckCircle,
  Clock,
  CreditCard,
  Package,
} from "lucide-react";

export default function RetoursPage() {
  return (
    <StaticPage
      title="Retours & Remboursements"
      description="Retournez facilement vos produits sous 30 jours."
      icon={ArrowLeftRight}
    >
      <div className="space-y-8 mt-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Notre politique de retour</h2>
          <div className="bg-primary/10 rounded-lg p-6">
            <p className="text-lg">
              Vous disposez de <strong>30 jours</strong> après réception de votre
              commande pour retourner un produit, sans avoir à justifier de motif.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Comment retourner un produit ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground mb-2">
                  1
                </div>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Demande de retour
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Connectez-vous à votre espace client et sélectionnez les articles à
                retourner.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground mb-2">
                  2
                </div>
                <CardTitle className="flex items-center gap-2">
                  <Box className="h-5 w-5" />
                  Préparation
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Emballez soigneusement le produit dans son emballage d'origine et
                collez l'étiquette de retour.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground mb-2">
                  3
                </div>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Remboursement
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Le remboursement est effectué sous 14 jours après réception du colis.
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Conditions de retour</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <p>Le produit doit être dans son état d'origine, non utilisé</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <p>L'emballage d'origine doit être conservé</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <p>Tous les accessoires doivent être inclus</p>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
              <p>La demande doit être effectuée dans les 30 jours</p>
            </div>
          </div>
        </section>
      </div>
    </StaticPage>
  );
}
