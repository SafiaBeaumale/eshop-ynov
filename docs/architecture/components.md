# Diagrammes de Composants - eShop

## Vue d'Ensemble des Services

```mermaid
flowchart TB
    subgraph clients["Clients"]
        WebApp["Web Application"]
        Mobile["Mobile App"]
        Postman["Postman/API Client"]
    end

    subgraph gateway["API Gateway Layer"]
        YARP["YARP Gateway<br/>Port: 5000"]
    end

    subgraph services["Microservices Layer"]
        subgraph catalog_service["Catalog Service"]
            CatalogAPI["Catalog.API<br/>Port: 6060"]
            CatalogDB[("PostgreSQL<br/>CatalogDb")]
        end

        subgraph basket_service["Basket Service"]
            BasketAPI["Basket.API<br/>Port: 6061"]
            BasketDB[("PostgreSQL<br/>BasketDb")]
            RedisCache[("Redis<br/>Cache")]
        end

        subgraph discount_service["Discount Service"]
            DiscountAPI["Discount.API"]
            DiscountDB[("PostgreSQL<br/>DiscountDb")]
        end

        subgraph ordering_service["Ordering Service"]
            OrderingAPI["Ordering.API"]
            OrderingDB[("SQL Server<br/>OrderingDb")]
        end
    end

    subgraph messaging["Messaging Layer"]
        RabbitMQ[("RabbitMQ<br/>Message Broker")]
    end

    clients --> YARP
    YARP --> CatalogAPI
    YARP --> BasketAPI
    YARP --> OrderingAPI

    CatalogAPI --> CatalogDB
    BasketAPI --> BasketDB
    BasketAPI --> RedisCache
    BasketAPI -.->|gRPC| DiscountAPI
    DiscountAPI --> DiscountDB
    OrderingAPI --> OrderingDB

    CatalogAPI -.->|Events| RabbitMQ
    BasketAPI -.->|Events| RabbitMQ
    OrderingAPI -.->|Events| RabbitMQ
```

## Architecture du Catalog Service

```mermaid
flowchart TB
    subgraph catalog_api["Catalog.API"]
        Controller["ProductsController"]

        subgraph cqrs["CQRS Layer"]
            subgraph commands["Commands"]
                CreateProduct["CreateProductCommand"]
                UpdateProduct["UpdateProductCommand"]
                DeleteProduct["DeleteProductCommand"]
                ImportProducts["ImportProductsCommand"]
            end

            subgraph queries["Queries"]
                GetProducts["GetProductsQuery"]
                GetProductById["GetProductByIdQuery"]
                GetByCategory["GetProductsByCategoryQuery"]
                ExportProducts["ExportProductsQuery"]
            end
        end

        subgraph handlers["Handlers"]
            CommandHandlers["Command Handlers"]
            QueryHandlers["Query Handlers"]
        end

        Mediator["MediatR"]
        Validation["FluentValidation"]
    end

    subgraph data["Data Layer"]
        Marten["Marten Document Store"]
        PostgreSQL[("PostgreSQL")]
    end

    Controller --> Mediator
    Mediator --> commands
    Mediator --> queries
    commands --> CommandHandlers
    queries --> QueryHandlers
    CommandHandlers --> Validation
    CommandHandlers --> Marten
    QueryHandlers --> Marten
    Marten --> PostgreSQL
```

## Architecture du Basket Service

```mermaid
flowchart TB
    subgraph basket_api["Basket.API"]
        Controller["BasketsController"]

        subgraph cqrs["CQRS Layer"]
            subgraph commands["Commands"]
                CreateBasket["CreateBasketCommand"]
                DeleteBasket["DeleteBasketCommand"]
            end

            subgraph queries["Queries"]
                GetBasket["GetBasketByUserNameQuery"]
            end
        end

        subgraph handlers["Handlers"]
            CommandHandlers["Command Handlers"]
            QueryHandlers["Query Handlers"]
        end

        Mediator["MediatR"]

        subgraph repository["Repository Layer"]
            IBasketRepo["IBasketRepository"]
            BasketRepo["BasketRepository"]
            CachedRepo["CachedBasketRepository<br/>(Decorator)"]
        end
    end

    subgraph external["External Services"]
        DiscountGrpc["Discount.gRPC Client"]
    end

    subgraph data["Data Layer"]
        Marten["Marten Document Store"]
        PostgreSQL[("PostgreSQL")]
        Redis[("Redis Cache")]
    end

    Controller --> Mediator
    Mediator --> commands
    Mediator --> queries
    commands --> CommandHandlers
    queries --> QueryHandlers
    CommandHandlers --> CachedRepo
    QueryHandlers --> CachedRepo
    CachedRepo --> BasketRepo
    CachedRepo --> Redis
    BasketRepo --> Marten
    Marten --> PostgreSQL
    CommandHandlers -.-> DiscountGrpc
```

## Pattern CQRS avec MediatR

```mermaid
flowchart LR
    subgraph client["Client Request"]
        HTTP["HTTP Request"]
    end

    subgraph api["API Layer"]
        Controller["Controller"]
    end

    subgraph mediator["MediatR Pipeline"]
        M["Mediator"]

        subgraph behaviors["Behaviors"]
            Logging["LoggingBehavior"]
            Validation["ValidationBehavior"]
        end
    end

    subgraph handlers["Handlers"]
        subgraph write["Write Side"]
            CmdHandler["CommandHandler"]
            WriteDB[("Write DB")]
        end

        subgraph read["Read Side"]
            QryHandler["QueryHandler"]
            ReadDB[("Read Model")]
        end
    end

    HTTP --> Controller
    Controller --> M
    M --> Logging
    Logging --> Validation
    Validation --> CmdHandler
    Validation --> QryHandler
    CmdHandler --> WriteDB
    QryHandler --> ReadDB
```

## Pattern Decorator - Cache Redis (Basket)

```mermaid
flowchart TB
    subgraph client["Client"]
        Handler["Command/Query Handler"]
    end

    subgraph decorator["Decorator Pattern"]
        ICached["IBasketRepository"]
        Cached["CachedBasketRepository"]
        Base["BasketRepository"]
    end

    subgraph storage["Storage"]
        Redis[("Redis Cache")]
        Marten["Marten"]
        PostgreSQL[("PostgreSQL")]
    end

    Handler --> ICached
    ICached --> Cached
    Cached -->|Cache Hit| Redis
    Cached -->|Cache Miss| Base
    Base --> Marten
    Marten --> PostgreSQL

    Cached -.->|Update Cache| Redis
```

## Communication Inter-Services

```mermaid
flowchart TB
    subgraph sync["Communication Synchrone"]
        direction LR
        Client1["Client"] -->|HTTP/REST| Gateway["API Gateway"]
        Gateway --> Service1["Service A"]
        Service1 -->|gRPC| Service2["Service B"]
    end

    subgraph async["Communication Asynchrone"]
        direction LR
        Producer["Service Producer"]
        RabbitMQ[("RabbitMQ")]
        Consumer1["Consumer 1"]
        Consumer2["Consumer 2"]

        Producer -->|Publish Event| RabbitMQ
        RabbitMQ -->|Subscribe| Consumer1
        RabbitMQ -->|Subscribe| Consumer2
    end
```

## BuildingBlocks - Composants Partages

```mermaid
flowchart TB
    subgraph buildingblocks["BuildingBlocks Library"]
        subgraph cqrs["CQRS"]
            ICommand["ICommand<TResponse>"]
            IQuery["IQuery<TResponse>"]
            ICommandHandler["ICommandHandler"]
            IQueryHandler["IQueryHandler"]
        end

        subgraph behaviors["Behaviors"]
            LoggingBehavior["LoggingBehavior"]
            ValidationBehavior["ValidationBehavior"]
        end

        subgraph exceptions["Exceptions"]
            BaseException["BusinessException"]
            NotFound["NotFoundException"]
            BadRequest["BadRequestException"]
            AlreadyExists["AlreadyExistsException"]
        end

        subgraph pagination["Pagination"]
            PaginatedResult["PaginatedResult<T>"]
            PaginationRequest["PaginationRequest"]
        end

        subgraph middleware["Middleware"]
            ExceptionHandler["ExceptionHandlerMiddleware"]
        end
    end

    subgraph services["Services"]
        Catalog["Catalog.API"]
        Basket["Basket.API"]
    end

    Catalog --> buildingblocks
    Basket --> buildingblocks
```
