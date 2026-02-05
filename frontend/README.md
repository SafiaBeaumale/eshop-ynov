# TechShop - Frontend E-commerce

Frontend moderne pour l'application e-commerce TechShop, construit avec Next.js 16, shadcn/ui et Framer Motion.

## Technologies

- **Next.js 16** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS v4** - Styling utilitaire
- **shadcn/ui** - Composants UI modernes
- **Framer Motion** - Animations fluides
- **Lucide React** - Icones

## Structure du projet

```
frontend/
├── src/
│   ├── app/                    # Pages (App Router)
│   │   ├── page.tsx           # Page d'accueil
│   │   ├── products/          # Catalogue produits
│   │   │   ├── page.tsx       # Liste des produits
│   │   │   └── [id]/page.tsx  # Detail produit
│   │   ├── cart/              # Panier
│   │   ├── checkout/          # Paiement
│   │   └── orders/            # Historique commandes
│   ├── components/            # Composants reutilisables
│   │   ├── layout/            # Header, Footer
│   │   ├── ui/                # Composants shadcn/ui
│   │   └── ...                # Autres composants
│   ├── context/               # Contextes React (Cart)
│   ├── lib/                   # Utilitaires, API
│   └── types/                 # Types TypeScript
└── public/                    # Assets statiques
```

## Installation

```bash
# Installer les dependances
npm install

# Lancer en developpement
npm run dev

# Build production
npm run build

# Lancer en production
npm start
```

## Configuration

Le fichier `.env.local` contient les URLs des micro-services :

```env
NEXT_PUBLIC_CATALOG_API_URL=http://localhost:6060
NEXT_PUBLIC_BASKET_API_URL=http://localhost:6061
NEXT_PUBLIC_ORDERING_API_URL=http://localhost:6063
```

## Pages

| Route            | Description                                               |
| ---------------- | --------------------------------------------------------- |
| `/`              | Page d'accueil avec hero, categories et produits vedettes |
| `/products`      | Catalogue avec filtres par categorie et tri               |
| `/products/[id]` | Detail d'un produit                                       |
| `/cart`          | Panier d'achat                                            |
| `/checkout`      | Processus de paiement en 3 etapes                         |
| `/orders`        | Historique des commandes                                  |

## Integration API

Le frontend se connecte aux micro-services suivants :

- **Catalog API** (port 6060) - Gestion des produits
- **Basket API** (port 6061) - Gestion du panier
- **Ordering API** (port 6063) - Gestion des commandes

## Fonctionnalites

- Affichage des produits avec pagination
- Filtrage par categorie
- Tri par prix/nom
- Ajout au panier avec notifications
- Gestion des quantites
- Processus de checkout complet
- Historique des commandes
- Animations fluides avec Framer Motion
- Design responsive (mobile-first)
