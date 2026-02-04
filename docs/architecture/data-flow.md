# Flux de Donnees - eShop

## Vue d'Ensemble des Flux

Ce document decrit les principaux flux de donnees entre les services de l'application eShop.

## Flux Principal - Parcours Client

```mermaid
sequenceDiagram
    autonumber
    participant Client
    participant Gateway as API Gateway
    participant Catalog as Catalog.API
    participant Basket as Basket.API
    participant Discount as Discount.API
    participant Ordering as Ordering.API
    participant RabbitMQ as Message Broker

    Note over Client,RabbitMQ: 1. Consultation du Catalogue
    Client->>Gateway: GET /catalog/products
    Gateway->>Catalog: Forward request
    Catalog-->>Gateway: Products list
    Gateway-->>Client: Products JSON

    Note over Client,RabbitMQ: 2. Ajout au Panier
    Client->>Gateway: POST /basket/{userName}
    Gateway->>Basket: Forward request
    Basket->>Discount: gRPC GetDiscount
    Discount-->>Basket: Discount info
    Basket-->>Gateway: Basket with discounts
    Gateway-->>Client: Updated basket

    Note over Client,RabbitMQ: 3. Passage de Commande
    Client->>Gateway: POST /ordering/checkout
    Gateway->>Ordering: Create order
    Ordering->>RabbitMQ: Publish OrderCreatedEvent
    Ordering-->>Gateway: Order confirmation
    Gateway-->>Client: Order ID

    Note over Client,RabbitMQ: 4. Mise a jour des Services
    RabbitMQ-->>Basket: OrderCreatedEvent
    Basket->>Basket: Clear user basket
    RabbitMQ-->>Catalog: OrderCreatedEvent
    Catalog->>Catalog: Update stock (optionnel)
```

## Flux CRUD - Catalog Service

### Creation d'un Produit

```mermaid
sequenceDiagram
    autonumber
    participant Admin as Admin Client
    participant Controller as ProductsController
    participant Mediator as MediatR
    participant Validator as FluentValidation
    participant Handler as CreateProductHandler
    participant Marten as Marten Session
    participant DB as PostgreSQL

    Admin->>Controller: POST /products
    Controller->>Mediator: Send(CreateProductCommand)
    Mediator->>Validator: Validate command
    Validator-->>Mediator: Validation OK

    Mediator->>Handler: Handle(command)
    Handler->>Handler: Map to Product entity
    Handler->>Marten: Store(product)
    Marten->>DB: INSERT product
    DB-->>Marten: Success
    Marten-->>Handler: Product stored

    Handler-->>Mediator: CreateProductResult
    Mediator-->>Controller: Result
    Controller-->>Admin: 201 Created {productId}
```

### Lecture des Produits (avec Pagination)

```mermaid
sequenceDiagram
    autonumber
    participant Client
    participant Controller as ProductsController
    participant Mediator as MediatR
    participant Handler as GetProductsHandler
    participant Marten as Marten Session
    participant DB as PostgreSQL

    Client->>Controller: GET /products?pageNumber=1&pageSize=10
    Controller->>Mediator: Send(GetProductsQuery)
    Mediator->>Handler: Handle(query)

    Handler->>Marten: Query products
    Marten->>DB: SELECT with LIMIT/OFFSET
    DB-->>Marten: Products rows
    Marten-->>Handler: IReadOnlyList<Product>

    Handler->>Handler: Map to DTOs
    Handler->>Handler: Create PaginatedResult
    Handler-->>Mediator: PaginatedResult<ProductDto>
    Mediator-->>Controller: Result
    Controller-->>Client: 200 OK {products, pagination}
```

### Import Excel

```mermaid
sequenceDiagram
    autonumber
    participant Admin as Admin Client
    participant Controller as ProductsController
    participant Mediator as MediatR
    participant Handler as ImportProductsHandler
    participant ClosedXML as ClosedXML Workbook
    participant Marten as Marten Session
    participant DB as PostgreSQL

    Admin->>Controller: POST /products/import (file.xlsx)
    Controller->>Mediator: Send(ImportProductsCommand)
    Mediator->>Handler: Handle(command)

    Handler->>ClosedXML: Open file stream
    Handler->>ClosedXML: Load worksheet
    ClosedXML-->>Handler: Worksheet data

    loop For each row
        Handler->>Handler: Parse row data
        Handler->>Handler: Validate product
        Handler->>Marten: Store(product)
    end

    Handler->>Marten: SaveChangesAsync()
    Marten->>DB: INSERT batch
    DB-->>Marten: Success
    Marten-->>Handler: Saved

    Handler-->>Mediator: ImportResult {count}
    Mediator-->>Controller: Result
    Controller-->>Admin: 200 OK {importedCount}
```

## Flux CRUD - Basket Service

### Creation/Mise a jour du Panier

```mermaid
sequenceDiagram
    autonumber
    participant Client
    participant Controller as BasketsController
    participant Mediator as MediatR
    participant Handler as CreateBasketHandler
    participant CachedRepo as CachedBasketRepository
    participant Redis as Redis Cache
    participant BaseRepo as BasketRepository
    participant Marten as Marten Session
    participant DB as PostgreSQL

    Client->>Controller: POST /baskets/{userName}
    Controller->>Mediator: Send(CreateBasketCommand)
    Mediator->>Handler: Handle(command)

    Handler->>CachedRepo: StoreBasket(cart)
    CachedRepo->>BaseRepo: StoreBasket(cart)
    BaseRepo->>Marten: Store(cart)
    Marten->>DB: UPSERT basket
    DB-->>Marten: Success
    Marten-->>BaseRepo: Stored
    BaseRepo-->>CachedRepo: ShoppingCart

    CachedRepo->>Redis: SET basket:{userName}
    Redis-->>CachedRepo: OK

    CachedRepo-->>Handler: ShoppingCart
    Handler-->>Mediator: CreateBasketResult
    Mediator-->>Controller: Result
    Controller-->>Client: 201 Created {basket}
```

### Lecture du Panier (avec Cache)

```mermaid
sequenceDiagram
    autonumber
    participant Client
    participant Controller as BasketsController
    participant Mediator as MediatR
    participant Handler as GetBasketHandler
    participant CachedRepo as CachedBasketRepository
    participant Redis as Redis Cache
    participant BaseRepo as BasketRepository
    participant Marten as Marten Session
    participant DB as PostgreSQL

    Client->>Controller: GET /baskets/{userName}
    Controller->>Mediator: Send(GetBasketQuery)
    Mediator->>Handler: Handle(query)
    Handler->>CachedRepo: GetBasket(userName)

    CachedRepo->>Redis: GET basket:{userName}

    alt Cache Hit
        Redis-->>CachedRepo: Cached basket
        CachedRepo-->>Handler: ShoppingCart
    else Cache Miss
        Redis-->>CachedRepo: null
        CachedRepo->>BaseRepo: GetBasket(userName)
        BaseRepo->>Marten: Query basket
        Marten->>DB: SELECT basket
        DB-->>Marten: Basket data
        Marten-->>BaseRepo: ShoppingCart
        BaseRepo-->>CachedRepo: ShoppingCart

        CachedRepo->>Redis: SET basket:{userName}
        Redis-->>CachedRepo: OK
        CachedRepo-->>Handler: ShoppingCart
    end

    Handler-->>Mediator: GetBasketResult
    Mediator-->>Controller: Result
    Controller-->>Client: 200 OK {basket}
```

## Flux Event-Driven (Planifie)

### Publication d'Evenements

```mermaid
sequenceDiagram
    autonumber
    participant Catalog as Catalog.API
    participant RabbitMQ as RabbitMQ
    participant Basket as Basket.API
    participant Ordering as Ordering.API

    Note over Catalog,Ordering: Scenario: Mise a jour du prix d'un produit

    Catalog->>Catalog: Update product price
    Catalog->>RabbitMQ: Publish ProductPriceChangedEvent

    par Parallel consumption
        RabbitMQ-->>Basket: ProductPriceChangedEvent
        Basket->>Basket: Update basket item prices
    and
        RabbitMQ-->>Ordering: ProductPriceChangedEvent
        Ordering->>Ordering: Update pending orders
    end
```

### Integration Discount via gRPC

```mermaid
sequenceDiagram
    autonumber
    participant Basket as Basket.API
    participant gRPC as gRPC Client
    participant Discount as Discount.API
    participant DiscountDB as Discount DB

    Basket->>gRPC: GetDiscount(productName)
    gRPC->>Discount: gRPC GetDiscount request
    Discount->>DiscountDB: Query discount
    DiscountDB-->>Discount: Discount data
    Discount-->>gRPC: DiscountResponse
    gRPC-->>Basket: Discount amount

    Basket->>Basket: Apply discount to item
```

## Flux de Donnees par Base de Donnees

```mermaid
flowchart TB
    subgraph catalog_flow["Catalog Data Flow"]
        CatalogAPI["Catalog.API"]
        CatalogMarten["Marten Session"]
        CatalogDB[("PostgreSQL<br/>CatalogDb")]

        CatalogAPI -->|CRUD| CatalogMarten
        CatalogMarten -->|Document Store| CatalogDB
    end

    subgraph basket_flow["Basket Data Flow"]
        BasketAPI["Basket.API"]
        BasketCache["Redis Cache"]
        BasketMarten["Marten Session"]
        BasketDB[("PostgreSQL<br/>BasketDb")]

        BasketAPI -->|Read/Write| BasketCache
        BasketAPI -->|Persistence| BasketMarten
        BasketMarten -->|Document Store| BasketDB
    end

    subgraph event_flow["Event Flow (Planifié)"]
        Producer["Any Service"]
        RabbitMQ[("RabbitMQ")]
        Consumers["Subscribed Services"]

        Producer -->|Publish| RabbitMQ
        RabbitMQ -->|Subscribe| Consumers
    end

    catalog_flow ~~~ basket_flow
    basket_flow ~~~ event_flow

```
