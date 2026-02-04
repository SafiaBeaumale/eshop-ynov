# Basket Service - Diagrammes de Sequence

## Vue d'Ensemble

Ce document presente les diagrammes de sequence pour les operations du service Basket, mettant en evidence le pattern Decorator pour le cache Redis et l'integration gRPC avec le service Discount.

## Operations de Lecture

### GET /baskets/{userName} - Avec Cache Hit

```mermaid
sequenceDiagram
    autonumber
    participant Client
    participant Controller as BasketsController
    participant Mediator as MediatR
    participant Handler as GetBasketHandler
    participant CachedRepo as CachedBasketRepository
    participant Redis as Redis Cache

    Client->>Controller: GET /baskets/john_doe
    Controller->>Controller: Create GetBasketByUserNameQuery
    Controller->>Mediator: Send(query)

    Mediator->>Handler: Handle(query)
    Handler->>CachedRepo: GetBasket("john_doe")

    CachedRepo->>Redis: GET basket:john_doe
    Redis-->>CachedRepo: JSON string (cache hit)

    CachedRepo->>CachedRepo: Deserialize ShoppingCart
    CachedRepo-->>Handler: ShoppingCart

    Handler-->>Mediator: GetBasketResult
    Mediator-->>Controller: Result
    Controller-->>Client: 200 OK { userName, items, total }
```

### GET /baskets/{userName} - Avec Cache Miss

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
    participant Marten as DocumentSession
    participant DB as PostgreSQL

    Client->>Controller: GET /baskets/john_doe
    Controller->>Controller: Create GetBasketByUserNameQuery
    Controller->>Mediator: Send(query)

    Mediator->>Handler: Handle(query)
    Handler->>CachedRepo: GetBasket("john_doe")

    CachedRepo->>Redis: GET basket:john_doe
    Redis-->>CachedRepo: null (cache miss)

    CachedRepo->>BaseRepo: GetBasket("john_doe")
    BaseRepo->>Marten: LoadAsync<ShoppingCart>("john_doe")
    Marten->>DB: SELECT * FROM mt_doc_shoppingcart WHERE id = 'john_doe'
    DB-->>Marten: ShoppingCart data
    Marten-->>BaseRepo: ShoppingCart
    BaseRepo-->>CachedRepo: ShoppingCart

    CachedRepo->>CachedRepo: Serialize ShoppingCart
    CachedRepo->>Redis: SET basket:john_doe {json}
    Redis-->>CachedRepo: OK

    CachedRepo-->>Handler: ShoppingCart
    Handler-->>Mediator: GetBasketResult
    Mediator-->>Controller: Result
    Controller-->>Client: 200 OK { userName, items, total }
```

## Operations d'Ecriture

### POST /baskets/{userName} - Creation/Mise a jour

```mermaid
sequenceDiagram
    autonumber
    participant Client
    participant Controller as BasketsController
    participant Mediator as MediatR
    participant ValBehavior as ValidationBehavior
    participant Handler as CreateBasketHandler
    participant CachedRepo as CachedBasketRepository
    participant BaseRepo as BasketRepository
    participant Marten as DocumentSession
    participant DB as PostgreSQL
    participant Redis as Redis Cache

    Client->>Controller: POST /baskets/john_doe { items: [...] }
    Controller->>Controller: Create CreateBasketCommand
    Controller->>Mediator: Send(command)

    Mediator->>ValBehavior: Handle(command)
    ValBehavior->>ValBehavior: Validate command

    alt Validation OK
        ValBehavior->>Handler: next()
        Handler->>Handler: Build ShoppingCart from command
        Handler->>CachedRepo: StoreBasket(cart)

        CachedRepo->>BaseRepo: StoreBasket(cart)
        BaseRepo->>Marten: Store(cart)
        BaseRepo->>Marten: SaveChangesAsync()
        Marten->>DB: UPSERT mt_doc_shoppingcart
        DB-->>Marten: Success
        Marten-->>BaseRepo: Saved
        BaseRepo-->>CachedRepo: ShoppingCart

        CachedRepo->>CachedRepo: Serialize ShoppingCart
        CachedRepo->>Redis: SET basket:john_doe {json}
        Redis-->>CachedRepo: OK

        CachedRepo-->>Handler: ShoppingCart
        Handler-->>Mediator: CreateBasketResult
        Mediator-->>Controller: Result
        Controller-->>Client: 201 Created { userName, items, total }

    else Validation Failed
        ValBehavior-->>Controller: ValidationException
        Controller-->>Client: 400 Bad Request { errors }
    end
```

### DELETE /baskets/{userName} - Suppression

```mermaid
sequenceDiagram
    autonumber
    participant Client
    participant Controller as BasketsController
    participant Mediator as MediatR
    participant Handler as DeleteBasketHandler
    participant CachedRepo as CachedBasketRepository
    participant BaseRepo as BasketRepository
    participant Marten as DocumentSession
    participant DB as PostgreSQL
    participant Redis as Redis Cache

    Client->>Controller: DELETE /baskets/john_doe
    Controller->>Controller: Create DeleteBasketCommand
    Controller->>Mediator: Send(command)

    Mediator->>Handler: Handle(command)
    Handler->>CachedRepo: DeleteBasket("john_doe")

    CachedRepo->>BaseRepo: DeleteBasket("john_doe")
    BaseRepo->>Marten: Delete<ShoppingCart>("john_doe")
    BaseRepo->>Marten: SaveChangesAsync()
    Marten->>DB: DELETE FROM mt_doc_shoppingcart WHERE id = 'john_doe'
    DB-->>Marten: Success
    Marten-->>BaseRepo: Deleted
    BaseRepo-->>CachedRepo: true

    CachedRepo->>Redis: DEL basket:john_doe
    Redis-->>CachedRepo: OK

    CachedRepo-->>Handler: true
    Handler-->>Mediator: DeleteBasketResult
    Mediator-->>Controller: Result
    Controller-->>Client: 204 No Content
```

## Integration avec Discount Service (gRPC)

### POST /baskets/{userName}/items - Ajout d'article avec remise

```mermaid
sequenceDiagram
    autonumber
    participant Client
    participant Controller as BasketsController
    participant Mediator as MediatR
    participant Handler as AddItemCommandHandler
    participant gRPCClient as DiscountProtoService.Client
    participant Discount as Discount.Grpc
    participant DiscountDB as SQLite
    participant CachedRepo as CachedBasketRepository
    participant BaseRepo as BasketRepository
    participant Marten as DocumentSession
    participant DB as PostgreSQL
    participant Redis as Redis Cache

    Client->>Controller: POST /baskets/john_doe/items { productName, price, quantity }
    Controller->>Controller: Create AddItemCommand
    Controller->>Mediator: Send(command)

    Mediator->>Handler: Handle(command)

    Note over Handler,DiscountDB: Appel gRPC pour recuperer la remise

    Handler->>gRPCClient: GetDiscount(productName)
    gRPCClient->>Discount: gRPC GetDiscount(GetDiscountRequest)
    Discount->>DiscountDB: SELECT * FROM Coupon WHERE ProductName = ?
    DiscountDB-->>Discount: Coupon data
    Discount-->>gRPCClient: CouponModel { amount }
    gRPCClient-->>Handler: CouponModel

    Handler->>Handler: item.Price -= coupon.Amount

    Note over Handler,Redis: Persistance du panier avec prix remise

    Handler->>CachedRepo: StoreBasket(cart)
    CachedRepo->>BaseRepo: StoreBasket(cart)
    BaseRepo->>Marten: Store(cart)
    BaseRepo->>Marten: SaveChangesAsync()
    Marten->>DB: UPSERT mt_doc_shoppingcart
    DB-->>Marten: Success
    Marten-->>BaseRepo: Saved
    BaseRepo-->>CachedRepo: ShoppingCart

    CachedRepo->>Redis: SET basket:john_doe {json}
    Redis-->>CachedRepo: OK

    CachedRepo-->>Handler: ShoppingCart
    Handler-->>Mediator: Result
    Mediator-->>Controller: Result
    Controller-->>Client: 200 OK { userName, items (with discount), total }
```

### PUT /baskets/{userName}/items - Modification de quantite

```mermaid
sequenceDiagram
    autonumber
    participant Client
    participant Controller as BasketsController
    participant Mediator as MediatR
    participant Handler as UpdateItemQuantityHandler
    participant CachedRepo as CachedBasketRepository
    participant BaseRepo as BasketRepository
    participant DB as PostgreSQL
    participant Redis as Redis Cache

    Client->>Controller: PUT /baskets/john_doe/items { productId, quantity }
    Controller->>Controller: Create UpdateItemQuantityCommand
    Controller->>Mediator: Send(command)

    Mediator->>Handler: Handle(command)
    Handler->>CachedRepo: GetBasket("john_doe")
    CachedRepo-->>Handler: ShoppingCart

    Handler->>Handler: Find item by productId
    Handler->>Handler: Update item.Quantity

    Handler->>CachedRepo: StoreBasket(cart)
    CachedRepo->>BaseRepo: StoreBasket(cart)
    BaseRepo->>DB: UPSERT
    DB-->>BaseRepo: Success
    BaseRepo-->>CachedRepo: ShoppingCart
    CachedRepo->>Redis: SET basket:john_doe {json}
    CachedRepo-->>Handler: ShoppingCart

    Handler-->>Mediator: Result
    Mediator-->>Controller: Result
    Controller-->>Client: 200 OK { updated cart }
```

### DELETE /baskets/{userName}/items/{productId} - Suppression d'article

```mermaid
sequenceDiagram
    autonumber
    participant Client
    participant Controller as BasketsController
    participant Mediator as MediatR
    participant Handler as DeleteBasketItemHandler
    participant CachedRepo as CachedBasketRepository
    participant BaseRepo as BasketRepository
    participant DB as PostgreSQL
    participant Redis as Redis Cache

    Client->>Controller: DELETE /baskets/john_doe/items/{productId}
    Controller->>Controller: Create DeleteBasketItemCommand
    Controller->>Mediator: Send(command)

    Mediator->>Handler: Handle(command)
    Handler->>CachedRepo: GetBasket("john_doe")
    CachedRepo-->>Handler: ShoppingCart

    Handler->>Handler: Remove item by productId

    Handler->>CachedRepo: StoreBasket(cart)
    CachedRepo->>BaseRepo: StoreBasket(cart)
    BaseRepo->>DB: UPSERT
    DB-->>BaseRepo: Success
    BaseRepo-->>CachedRepo: ShoppingCart
    CachedRepo->>Redis: SET basket:john_doe {json}
    CachedRepo-->>Handler: ShoppingCart

    Handler-->>Mediator: Result
    Mediator-->>Controller: Result
    Controller-->>Client: 200 OK { updated cart }
```

## Pattern Decorator en Detail

```mermaid
sequenceDiagram
    autonumber
    participant Client as Handler
    participant Interface as IBasketRepository
    participant Decorator as CachedBasketRepository
    participant Cache as Redis
    participant Concrete as BasketRepository
    participant DB as PostgreSQL

    Note over Client,DB: Injection de Dependance avec Scrutor

    Client->>Interface: GetBasket("user")
    Note right of Interface: Resolution vers CachedBasketRepository

    Interface->>Decorator: GetBasket("user")

    Decorator->>Cache: TryGet("user")

    alt Cache Hit
        Cache-->>Decorator: Data found
        Decorator-->>Interface: ShoppingCart
        Interface-->>Client: ShoppingCart
    else Cache Miss
        Cache-->>Decorator: null
        Decorator->>Concrete: GetBasket("user")
        Concrete->>DB: SELECT ...
        DB-->>Concrete: Data
        Concrete-->>Decorator: ShoppingCart

        Decorator->>Cache: Set("user", data)
        Cache-->>Decorator: OK

        Decorator-->>Interface: ShoppingCart
        Interface-->>Client: ShoppingCart
    end
```

## Flux Evenementiel (Planifie)

### Reception OrderCreated Event

```mermaid
sequenceDiagram
    autonumber
    participant Ordering as Ordering.API
    participant RabbitMQ as RabbitMQ
    participant Consumer as Basket Event Consumer
    participant Handler as ClearBasketHandler
    participant Repository as IBasketRepository
    participant Redis as Redis
    participant DB as PostgreSQL

    Ordering->>RabbitMQ: Publish OrderCreatedEvent

    RabbitMQ-->>Consumer: Consume OrderCreatedEvent
    Consumer->>Consumer: Extract userName from event

    Consumer->>Handler: Handle ClearBasket command
    Handler->>Repository: DeleteBasket(userName)

    Repository->>DB: DELETE basket
    DB-->>Repository: Success

    Repository->>Redis: DEL basket:userName
    Redis-->>Repository: OK

    Repository-->>Handler: Deleted
    Handler-->>Consumer: Success

    Consumer-->>RabbitMQ: Acknowledge message
```

## Health Check

### GET /health

```mermaid
sequenceDiagram
    autonumber
    participant Client
    participant HealthEndpoint as /health
    participant NpgSqlCheck as PostgreSQL Check
    participant RedisCheck as Redis Check
    participant DB as PostgreSQL
    participant Redis as Redis

    Client->>HealthEndpoint: GET /health

    par PostgreSQL Health Check
        HealthEndpoint->>NpgSqlCheck: Check
        NpgSqlCheck->>DB: SELECT 1
        DB-->>NpgSqlCheck: OK
        NpgSqlCheck-->>HealthEndpoint: Healthy
    and Redis Health Check
        HealthEndpoint->>RedisCheck: Check
        RedisCheck->>Redis: PING
        Redis-->>RedisCheck: PONG
        RedisCheck-->>HealthEndpoint: Healthy
    end

    HealthEndpoint-->>Client: 200 OK { status: "Healthy", entries: {...} }
```
