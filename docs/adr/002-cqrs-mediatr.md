## ADR – CQRS pour Catalog

### Contexte

Le service Catalog gère un grand nombre de produits avec des opérations en lecture fréquentes et des opérations en écriture moins fréquentes.

### Options considérées

- CRUD classique sans CQRS : Pas de séparation lecture et écriture
- CQRS (Command Query Responsibility Segregation) : Séparation des commandes (Write) et des requêtes (Read), Permet d’optimiser la lecture indépendamment de l’écriture

### Décision

Choix CQRS pour le service Catalog :

- Séparation claire entre lecture et écriture
- Facilite l’ajout de validations et règles métiers spécifiques aux commandes
- Permet d’utiliser différents modèles de lecture/écriture si besoin (ex : cache)

### Conséquences

- Plus de code et de concepts à comprendre pour les développeurs
- Besoin d’implémenter des patterns comme Mediator, Handlers
- Gain en flexibilité et évolutivité pour le service Catalog

### Diagramme de séquence – Flux CQRS (Write & Read séparés)

```mermaid
sequenceDiagram
    autonumber
    participant Client
    participant Controller as CatalogController
    participant Mediator
    participant CommandHandler
    participant QueryHandler
    participant WriteDB as Catalog Write DB
    participant ReadDB as Catalog Read Model / Cache

    Client->>Controller: POST /products (CreateProductCommand)
    Controller->>Mediator: Send(Command)
    Mediator->>CommandHandler: Handle(CreateProductCommand)
    CommandHandler->>WriteDB: Save Product
    CommandHandler-->>Mediator: CommandResult
    Mediator-->>Controller: Result
    Controller-->>Client: 201 Created

    Client->>Controller: GET /products
    Controller->>Mediator: Send(GetProductsQuery)
    Mediator->>QueryHandler: Handle(GetProductsQuery)
    QueryHandler->>ReadDB: Read Products
    QueryHandler-->>Mediator: Products DTOs
    Mediator-->>Controller: Products
    Controller-->>Client: 200 OK
```

### Diagramme de composants – Séparation Read / Write

```mermaid
graph TD
    Client --> CatalogAPIMediatR

    CatalogAPIMediatR --> Commands[Command Side]
    CatalogAPIMediatR --> Queries[Query Side]

    Commands --> WriteHandlers[Command Handlers]
    Queries --> ReadHandlers[Query Handlers]

    WriteHandlers --> WriteDB[(Write Database)]
    ReadHandlers --> ReadDB[(Read Model / Cache)]
```
