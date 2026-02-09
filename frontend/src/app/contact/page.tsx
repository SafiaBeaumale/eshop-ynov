"use client";

import { StaticPage } from "@/components/static-page";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Message envoyé avec succès !");
    setIsSubmitting(false);
  };

  return (
    <StaticPage
      title="Contactez-nous"
      description="Une question ? N'hésitez pas à nous contacter."
      icon={Mail}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div>
          <h2 className="text-2xl font-semibold mb-6">Envoyez-nous un message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input id="firstName" placeholder="Jean" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input id="lastName" placeholder="Dupont" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="jean.dupont@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Sujet</Label>
              <Input id="subject" placeholder="Votre sujet" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Votre message..."
                rows={5}
                required
              />
            </div>
            <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
              <Send className="h-4 w-4" />
              {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
            </Button>
          </form>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6">Nos coordonnées</h2>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5 text-primary" />
                Adresse
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>123 Avenue de la Tech</p>
              <p>75001 Paris, France</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Phone className="h-5 w-5 text-primary" />
                Téléphone
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>01 23 45 67 89</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Mail className="h-5 w-5 text-primary" />
                Email
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>contact@techshop.fr</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-primary" />
                Horaires
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>Lundi - Vendredi : 9h - 18h</p>
              <p>Samedi : 10h - 17h</p>
              <p>Dimanche : Fermé</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </StaticPage>
  );
}
