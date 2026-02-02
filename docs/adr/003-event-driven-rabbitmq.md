## ADR – Architecture événementielle avec RabbitMQ

### Contexte

Les microservices doivent communiquer entre eux sans créer de dépendances fortes et permettre une meilleure résilience du système.

### Options considérées

- Appels synchrones HTTP : Simples mais fortement couplés et plus lent
- gRPC synchrone : Très performant mais toujours couplé temporellement
- Event-driven avec RabbitMQ : Communication asynchrone et découplée

### Décision

Choix d’une **architecture événementielle avec RabbitMQ** :

- Découplage fort entre producteurs et consommateurs
- Meilleure résilience face aux pannes
- Scalabilité facilitée via les files de messages
- Support dans l’écosystème .NET

### Conséquences

- Complexité accrue (gestion des messages, retry, ...)
- Débogage plus complexe qu’un flux synchrone
- Nécessite une surveillance
  `

### Diagramme de séquence – Publication et consommation d’événements

```mermaid
sequenceDiagram
    autonumber
    participant Catalog
    participant RabbitMQ
    participant Basket
    participant Ordering

    Catalog->>RabbitMQ: Publish ProductUpdatedEvent
    RabbitMQ-->>Basket: Consume ProductUpdatedEvent
    RabbitMQ-->>Ordering: Consume ProductUpdatedEvent

    Basket->>Basket: Update basket prices
    Ordering->>Ordering: Update order projections
```
