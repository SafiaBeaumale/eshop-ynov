## ADR – Conteneurisation avec Docker

### Contexte

Le projet doit être facilement déployable, reproductible sur différentes machines et compatible avec des environnements CI/CD.

### Options considérées

- Déploiement manuel sur serveur
- Machines virtuelles
- Conteneurisation Docker

### Décision

Choix de la **conteneurisation avec Docker** :

- Environnement identique entre développement et production
- Démarrage rapide des services
- Intégration naturelle avec Docker Compose et Kubernetes
- Facilite le scaling horizontal

### Conséquences

- Courbe d’apprentissage Docker
- Nécessite une gestion réseau entre conteneurs
- Problèmes possibles liés au DNS ou au réseau

```mermaid
graph LR
    Client --> Gateway[YARP Gateway Container]

    Gateway --> Catalog[Catalog.API Container]
    Gateway --> Basket[Basket.API Container]
    Gateway --> Discount[Discount.API Container]
    Gateway --> Ordering

    Catalog --> CatalogDB[(PostgreSQL Catalog)]
    Basket --> BasketDB[(PostgreSQL Basket)]
    Discount --> DiscountDB[(PostgreSQL Discount)]

    Catalog -. Events .-> RabbitMQ[(RabbitMQ Container)]
    Basket -. Events .-> RabbitMQ
    Ordering -. Events .-> RabbitMQ
```
