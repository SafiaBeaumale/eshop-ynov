"use client";

import { StaticPage } from "@/components/static-page";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Heart, Shield, Users, Zap } from "lucide-react";

export default function AProposPage() {
  return (
    <StaticPage
      title="À propos de TechShop"
      description="Votre partenaire technologique de confiance depuis 2020."
      icon={Users}
    >
      <div className="space-y-12 mt-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Notre histoire</h2>
          <p className="text-muted-foreground leading-relaxed">
            Fondée en 2020, TechShop est née d'une passion commune pour la
            technologie et d'une volonté de rendre les meilleurs produits tech
            accessibles à tous. Notre équipe de passionnés sélectionne
            rigoureusement chaque produit pour vous garantir qualité et innovation.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Nos valeurs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Qualité garantie</h3>
                    <p className="text-muted-foreground text-sm">
                      Nous ne proposons que des produits testés et approuvés par
                      notre équipe d'experts.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Service client</h3>
                    <p className="text-muted-foreground text-sm">
                      Une équipe dédiée à votre satisfaction, disponible 7j/7
                      pour répondre à vos questions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Innovation</h3>
                    <p className="text-muted-foreground text-sm">
                      Toujours à l'affût des dernières tendances pour vous
                      proposer les produits les plus innovants.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Expertise</h3>
                    <p className="text-muted-foreground text-sm">
                      Notre équipe de passionnés vous conseille et vous guide
                      dans vos choix technologiques.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Quelques chiffres</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">50k+</p>
              <p className="text-muted-foreground">Clients satisfaits</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">1000+</p>
              <p className="text-muted-foreground">Produits</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">4.8/5</p>
              <p className="text-muted-foreground">Note moyenne</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">24h</p>
              <p className="text-muted-foreground">Livraison express</p>
            </div>
          </div>
        </section>
      </div>
    </StaticPage>
  );
}
