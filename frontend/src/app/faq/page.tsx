"use client";

import { StaticPage } from "@/components/static-page";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "Quels sont les délais de livraison ?",
    answer:
      "Les délais de livraison varient entre 2 et 5 jours ouvrés selon votre localisation. La livraison express est disponible en 24h pour les commandes passées avant 14h.",
  },
  {
    question: "Comment suivre ma commande ?",
    answer:
      "Une fois votre commande expédiée, vous recevrez un email avec un numéro de suivi. Vous pouvez également consulter l'état de votre commande dans votre espace client.",
  },
  {
    question: "Puis-je modifier ou annuler ma commande ?",
    answer:
      "Vous pouvez modifier ou annuler votre commande dans les 2 heures suivant sa validation. Passé ce délai, contactez notre service client.",
  },
  {
    question: "Quels moyens de paiement acceptez-vous ?",
    answer:
      "Nous acceptons les cartes bancaires (Visa, Mastercard, American Express), PayPal, et le paiement en 3x sans frais pour les commandes supérieures à 100€.",
  },
  {
    question: "Comment retourner un produit ?",
    answer:
      "Vous disposez de 30 jours pour retourner un produit. Connectez-vous à votre espace client, sélectionnez la commande concernée et suivez les instructions de retour.",
  },
  {
    question: "Les produits sont-ils garantis ?",
    answer:
      "Tous nos produits bénéficient de la garantie légale de conformité de 2 ans. Certains produits disposent également d'une garantie constructeur étendue.",
  },
  {
    question: "Proposez-vous des réductions pour les professionnels ?",
    answer:
      "Oui, nous proposons des tarifs préférentiels pour les professionnels. Contactez notre équipe commerciale pour obtenir un devis personnalisé.",
  },
  {
    question: "Comment contacter le service client ?",
    answer:
      "Notre service client est disponible par téléphone au 01 23 45 67 89 (du lundi au vendredi, 9h-18h), par email à support@techshop.fr, ou via le chat en ligne 24/7.",
  },
];

export default function FAQPage() {
  return (
    <StaticPage
      title="Foire Aux Questions"
      description="Trouvez rapidement les réponses à vos questions les plus fréquentes."
      icon={HelpCircle}
    >
      <Accordion type="single" collapsible className="w-full mt-8">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </StaticPage>
  );
}
