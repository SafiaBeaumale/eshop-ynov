"use client";

import { StaticPage } from "@/components/static-page";
import { Shield } from "lucide-react";

export default function PolitiqueConfidentialitePage() {
  return (
    <StaticPage
      title="Politique de Confidentialité"
      description="Comment nous protégeons vos données personnelles."
      icon={Shield}
    >
      <div className="space-y-8 mt-8 text-muted-foreground">
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            1. Collecte des données
          </h2>
          <p>
            Nous collectons les informations que vous nous fournissez directement
            lors de la création de votre compte, de vos commandes ou de vos
            interactions avec notre service client. Ces données incluent :
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Nom et prénom</li>
            <li>Adresse email</li>
            <li>Adresse de livraison</li>
            <li>Numéro de téléphone</li>
            <li>Informations de paiement (traitées de manière sécurisée)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            2. Utilisation des données
          </h2>
          <p>Vos données sont utilisées pour :</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Traiter et livrer vos commandes</li>
            <li>Gérer votre compte client</li>
            <li>Vous envoyer des communications relatives à vos commandes</li>
            <li>Améliorer nos services et votre expérience utilisateur</li>
            <li>Vous informer de nos offres (avec votre consentement)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            3. Protection des données
          </h2>
          <p>
            Nous mettons en œuvre des mesures de sécurité appropriées pour protéger
            vos données contre tout accès, modification, divulgation ou destruction
            non autorisés. Cela inclut le cryptage SSL pour toutes les transactions
            et le stockage sécurisé de vos informations.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            4. Partage des données
          </h2>
          <p>
            Nous ne vendons jamais vos données personnelles. Nous pouvons partager
            vos informations avec :
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Nos partenaires de livraison pour acheminer vos commandes</li>
            <li>Nos prestataires de paiement pour traiter vos transactions</li>
            <li>Les autorités compétentes si la loi l'exige</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            5. Cookies
          </h2>
          <p>
            Nous utilisons des cookies pour améliorer votre expérience de navigation,
            analyser le trafic de notre site et personnaliser le contenu. Vous pouvez
            gérer vos préférences de cookies dans les paramètres de votre navigateur.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            6. Vos droits
          </h2>
          <p>
            Conformément au RGPD, vous disposez des droits suivants concernant vos
            données personnelles :
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Droit d'accès à vos données</li>
            <li>Droit de rectification</li>
            <li>Droit à l'effacement</li>
            <li>Droit à la portabilité</li>
            <li>Droit d'opposition au traitement</li>
          </ul>
          <p className="mt-4">
            Pour exercer ces droits, contactez-nous à privacy@techshop.fr
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            7. Contact
          </h2>
          <p>
            Pour toute question concernant cette politique de confidentialité,
            vous pouvez nous contacter à l'adresse : privacy@techshop.fr
          </p>
        </section>

        <p className="text-sm">Dernière mise à jour : Janvier 2024</p>
      </div>
    </StaticPage>
  );
}
