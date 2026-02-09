"use client";

import { StaticPage } from "@/components/static-page";
import { FileText } from "lucide-react";

export default function ConditionsUtilisationPage() {
  return (
    <StaticPage
      title="Conditions d'Utilisation"
      description="Les règles qui régissent l'utilisation de notre site."
      icon={FileText}
    >
      <div className="space-y-8 mt-8 text-muted-foreground">
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            1. Objet
          </h2>
          <p>
            Les présentes conditions générales d'utilisation ont pour objet de
            définir les modalités d'accès et d'utilisation du site TechShop.
            L'utilisation du site implique l'acceptation pleine et entière de ces
            conditions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            2. Accès au site
          </h2>
          <p>
            Le site est accessible gratuitement à tout utilisateur disposant d'un
            accès à internet. Tous les coûts liés à l'accès au site, que ce soit les
            frais matériels, logiciels ou d'accès à internet, sont exclusivement à
            la charge de l'utilisateur.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            3. Compte utilisateur
          </h2>
          <p>
            La création d'un compte est nécessaire pour effectuer des achats sur le
            site. L'utilisateur s'engage à fournir des informations exactes et à les
            maintenir à jour. Il est responsable de la confidentialité de ses
            identifiants de connexion.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            4. Commandes
          </h2>
          <p>
            En passant commande, l'utilisateur déclare avoir pris connaissance et
            accepté les présentes conditions ainsi que les conditions de vente.
            TechShop se réserve le droit de refuser toute commande pour des motifs
            légitimes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            5. Prix et paiement
          </h2>
          <p>
            Les prix affichés sur le site sont en euros, toutes taxes comprises.
            TechShop se réserve le droit de modifier ses prix à tout moment, étant
            entendu que le prix applicable est celui en vigueur au moment de la
            validation de la commande.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            6. Propriété intellectuelle
          </h2>
          <p>
            L'ensemble des éléments du site (textes, images, logos, etc.) sont
            protégés par le droit de la propriété intellectuelle. Toute
            reproduction, représentation ou exploitation, totale ou partielle, sans
            autorisation expresse est interdite.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            7. Responsabilité
          </h2>
          <p>
            TechShop s'efforce d'assurer l'exactitude des informations diffusées sur
            le site. Toutefois, TechShop ne saurait être tenu responsable des
            omissions, inexactitudes ou carences dans la mise à jour de ces
            informations.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            8. Liens hypertextes
          </h2>
          <p>
            Le site peut contenir des liens vers d'autres sites. TechShop n'exerce
            aucun contrôle sur ces sites et décline toute responsabilité quant à
            leur contenu.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            9. Droit applicable
          </h2>
          <p>
            Les présentes conditions sont régies par le droit français. En cas de
            litige, les tribunaux français seront seuls compétents.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            10. Modification des conditions
          </h2>
          <p>
            TechShop se réserve le droit de modifier les présentes conditions à tout
            moment. Les utilisateurs seront informés de toute modification par
            publication sur le site.
          </p>
        </section>

        <p className="text-sm">Dernière mise à jour : Janvier 2024</p>
      </div>
    </StaticPage>
  );
}
