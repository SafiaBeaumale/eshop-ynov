"use client";

import { StaticPage } from "@/components/static-page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Headphones, Mail, MessageCircle, Phone } from "lucide-react";

export default function SupportPage() {
  return (
    <StaticPage
      title="Support Client"
      description="Notre équipe est là pour vous aider. Contactez-nous par le canal de votre choix."
      icon={Headphones}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              Téléphone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Appelez-nous du lundi au vendredi de 9h à 18h
            </p>
            <p className="font-semibold mt-2">01 23 45 67 89</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Email
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Réponse sous 24h ouvrées
            </p>
            <p className="font-semibold mt-2">support@techshop.fr</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              Chat en ligne
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Discutez en direct avec un conseiller
            </p>
            <p className="font-semibold mt-2">Disponible 24/7</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Headphones className="h-5 w-5 text-primary" />
              Centre d'aide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Consultez notre base de connaissances
            </p>
            <p className="font-semibold mt-2">Articles et tutoriels</p>
          </CardContent>
        </Card>
      </div>
    </StaticPage>
  );
}
