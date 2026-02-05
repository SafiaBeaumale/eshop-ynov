"use client";

import { StaticPage } from "@/components/static-page";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, ExternalLink, Mail, Newspaper } from "lucide-react";

const pressReleases = [
  {
    title: "TechShop lève 10 millions d'euros pour accélérer son développement",
    date: "15 Janvier 2024",
    excerpt:
      "Une levée de fonds qui permettra d'étendre notre présence en Europe.",
  },
  {
    title: "Lancement de notre nouvelle application mobile",
    date: "1er Décembre 2023",
    excerpt:
      "Une expérience shopping repensée pour plus de fluidité et de personnalisation.",
  },
  {
    title: "TechShop atteint les 50 000 clients",
    date: "15 Octobre 2023",
    excerpt:
      "Un cap symbolique qui témoigne de la confiance de nos clients.",
  },
  {
    title: "Partenariat stratégique avec les plus grandes marques tech",
    date: "1er Septembre 2023",
    excerpt:
      "Des accords exclusifs pour vous proposer les meilleurs prix.",
  },
];

export default function PressePage() {
  return (
    <StaticPage
      title="Espace Presse"
      description="Retrouvez toutes nos actualités et ressources média."
      icon={Newspaper}
    >
      <div className="space-y-12 mt-8">
        <section>
          <h2 className="text-2xl font-semibold mb-6">Communiqués de presse</h2>
          <div className="space-y-4">
            {pressReleases.map((release, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {release.date}
                      </p>
                      <CardTitle className="text-lg">{release.title}</CardTitle>
                      <p className="text-muted-foreground mt-2">
                        {release.excerpt}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2 shrink-0">
                      <ExternalLink className="h-4 w-4" />
                      Lire
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Kit média</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Kit presse TechShop</h3>
                  <p className="text-muted-foreground">
                    Logos, photos, chiffres clés et présentation de l'entreprise.
                  </p>
                </div>
                <Button className="gap-2">
                  <Download className="h-4 w-4" />
                  Télécharger le kit
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="bg-muted/50 rounded-lg p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Contact Presse</h2>
              <p className="text-muted-foreground">
                Pour toute demande d'interview ou d'information, contactez notre
                équipe communication.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              <span className="font-medium">presse@techshop.fr</span>
            </div>
          </div>
        </section>
      </div>
    </StaticPage>
  );
}
