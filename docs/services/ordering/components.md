# Ordering Service - Architecture des Composants

## Vue d'Ensemble

Le Ordering Service est responsable de la gestion des commandes. Il est construit sur une architecture **Clean Architecture** avec le pattern **CQRS** (MediatR) et les principes du **Domain-Driven Design (DDD)**. Il utilise Entity Framework Core avec SQL Server.

## Architecture Globale

```mermaid
flowchart TB
    subgraph external["External"]
        Client["HTTP Client"]
        Gateway["API Gateway"]
        MessageBroker["RabbitMQ"]
    end

    subgraph ordering_api["Ordering.API"]
        Controller["OrdersController"]
    end

    subgraph ordering_app["Ordering.Application"]
        subgraph cqrs["CQRS Layer"]
            subgraph commands["Commands"]
                CreateCmd["CreateOrderCommand"]
                UpdateCmd["UpdateOrderCommand"]
                UpdateStatusCmd["UpdateOrderStatusCommand"]
                DeleteCmd["DeleteOrderCommand"]
            end

            subgraph queries["Queries"]
                GetAllQry["GetOrdersQuery"]
                GetByIdQry["GetOrdersByIdQuery"]
                GetByCustQry["GetOrdersByCustomerIdQuery"]
            end
        end

        subgraph handlers["Handlers"]
            CmdHandlers["Command Handlers"]
            QryHandlers["Query Handlers"]
            EvtHandlers["Event Handlers"]
        end

        subgraph services["Services"]
            Mediator["MediatR"]
            Validation["FluentValidation"]
            FeatureMgmt["FeatureManagement"]
        end
    end

    subgraph ordering_domain["Ordering.Domain"]
        Order["Order (Aggregate)"]
        OrderItem["OrderItem"]
        ValueObjects["Value Objects"]
        DomainEvents["Domain Events"]
    end

    subgraph ordering_infra["Ordering.Infrastructure"]
        DbContext["OrderingDbContext"]
        Interceptor["DomainEventsInterceptor"]
        Configs["EF Configurations"]
    end

    subgraph database["Database"]
        SQLServer[("SQL Server<br/>OrderingDb")]
    end

    Client --> Gateway
    Gateway --> Controller
    Controller --> Mediator
    Mediator --> commands
    Mediator --> queries
    commands --> CmdHandlers
    queries --> QryHandlers
    CmdHandlers --> Validation
    CmdHandlers --> DbContext
    QryHandlers --> DbContext
    DbContext --> Interceptor
    Interceptor --> DomainEvents
    DomainEvents --> EvtHandlers
    EvtHandlers --> MessageBroker
    DbContext --> SQLServer
    CmdHandlers --> Order
    Order --> OrderItem
    Order --> ValueObjects
```

## Structure des Dossiers

```
Ordering/
├── Ordering.API/
│   ├── Controllers/
│   │   └── OrdersController.cs
│   ├── Program.cs
│   └── Dockerfile
├── Ordering.Application/
│   ├── Features/
│   │   └── Orders/
│   │       ├── Commands/
│   │       │   ├── CreateOrder/
│   │       │   ├── UpdateOrder/
│   │       │   ├── UpdateOrderStatus/
│   │       │   └── DeleteOrder/
│   │       ├── Queries/
│   │       │   ├── GetOrders/
│   │       │   ├── GetOrdersById/
│   │       │   └── GetOrdersByCustomerId/
│   │       ├── EventHandlers/
│   │       │   └── Domain/
│   │       ├── Dtos/
│   │       └── Mappers/
│   └── Extensions/
├── Ordering.Domain/
│   ├── Models/
│   │   ├── Order.cs
│   │   └── OrderItem.cs
│   ├── ValueObjects/
│   │   ├── Address.cs
│   │   └── Payment.cs
│   ├── Enums/
│   │   └── OrderStatus.cs
│   └── Events/
└── Ordering.Infrastructure/
    ├── Data/
    │   ├── OrderingDbContext.cs
    │   └── Interceptors/
    └── Configurations/
```

## Composants Principaux

### OrdersController

Point d'entree HTTP pour toutes les operations sur les commandes.

```csharp
[ApiController]
[Route("[controller]")]
public class OrdersController(ISender sender) : ControllerBase
{
    // GET /orders
    // GET /orders/{orderId}
    // GET /orders/customer/{customerId}
    // POST /orders
    // PUT /orders
    // PUT /orders/{orderId}  (update status)
    // DELETE /orders/{orderId}
}
```

### Modele Order (Aggregate Root)

```csharp
public class Order : Aggregate<OrderId>
{
    public CustomerId CustomerId { get; private set; }
    public OrderName OrderName { get; private set; }
    public Address ShippingAddress { get; private set; }
    public Address BillingAddress { get; private set; }
    public Payment Payment { get; private set; }
    public OrderStatus OrderStatus { get; private set; }

    private readonly List<OrderItem> _orderItems = [];
    public IReadOnlyList<OrderItem> OrderItems => _orderItems.AsReadOnly();

    public decimal TotalPrice => OrderItems.Sum(x => x.Price * x.Quantity);

    // Factory method
    public static Order Create(CustomerId customerId, OrderName orderName,
        Address shippingAddress, Address billingAddress, Payment payment)

    // Domain methods
    public void AddOrderItem(ProductId productId, int quantity, decimal price)
    public void RemoveOrderItem(ProductId productId)
    public void Update(OrderName name, Address shipping, Address billing, Payment payment, OrderStatus status)
    public void UpdateStatus(OrderStatus status)
}
```

### Modele OrderItem

```csharp
public class OrderItem : Entity<OrderItemId>
{
    public OrderId OrderId { get; private set; }
    public ProductId ProductId { get; private set; }
    public int Quantity { get; private set; }
    public decimal Price { get; private set; }
}
```

### Value Objects

#### Address

```csharp
public record Address
{
    public string FirstName { get; }
    public string LastName { get; }
    public string EmailAddress { get; }
    public string AddressLine { get; }
    public string Country { get; }
    public string State { get; }
    public string ZipCode { get; }

    public static Address Of(string firstName, string lastName, string email,
        string addressLine, string country, string state, string zipCode)
}
```

#### Payment

```csharp
public record Payment
{
    public string CardName { get; }
    public string CardNumber { get; }
    public string Expiration { get; }
    public string CVV { get; }        // Valide: 3 chiffres
    public int PaymentMethod { get; }

    public static Payment Of(string cardName, string cardNumber,
        string expiration, string cvv, int paymentMethod)
}
```

### OrderStatus (Enum)

```csharp
public enum OrderStatus
{
    Draft = 1,
    Pending,
    Submitted,
    Cancelled,
    Confirmed,
    Completed,
    Shipped,
    Delivered
}
```

## Commands et Handlers

### CreateOrderCommand

```mermaid
flowchart LR
    subgraph request["Request"]
        Cmd["CreateOrderCommand"]
    end

    subgraph pipeline["MediatR Pipeline"]
        Val["ValidationBehavior"]
        Log["LoggingBehavior"]
    end

    subgraph handler["Handler"]
        H["CreateOrderHandler"]
    end

    subgraph domain["Domain"]
        Order["Order.Create()"]
        Event["OrderCreatedEvent"]
    end

    subgraph result["Result"]
        R["CreateOrderResult"]
    end

    Cmd --> Log --> Val --> H --> Order --> Event --> R
```

| Propriete       | Type           | Requis | Validation          |
| --------------- | -------------- | ------ | ------------------- |
| CustomerId      | Guid           | Oui    | Non vide            |
| OrderName       | string         | Oui    | Non vide            |
| ShippingAddress | AddressDto     | Oui    | Adresse valide      |
| BillingAddress  | AddressDto     | Oui    | Adresse valide      |
| Payment         | PaymentDto     | Oui    | CVV 3 chiffres      |
| OrderItems      | List<ItemDto>  | Oui    | Au moins 1 item     |

### UpdateOrderCommand

| Propriete       | Type           | Requis | Validation          |
| --------------- | -------------- | ------ | ------------------- |
| Id              | Guid           | Oui    | Commande existante  |
| CustomerId      | Guid           | Oui    | Non vide            |
| OrderName       | string         | Oui    | Non vide            |
| ShippingAddress | AddressDto     | Oui    | Adresse valide      |
| BillingAddress  | AddressDto     | Oui    | Adresse valide      |
| Payment         | PaymentDto     | Oui    | CVV 3 chiffres      |
| OrderStatus     | OrderStatus    | Oui    | Statut valide       |
| OrderItems      | List<ItemDto>  | Oui    | Au moins 1 item     |

### UpdateOrderStatusCommand

| Propriete | Type        | Requis | Validation         |
| --------- | ----------- | ------ | ------------------ |
| OrderId   | Guid        | Oui    | Commande existante |
| Status    | OrderStatus | Oui    | Statut valide      |

### DeleteOrderCommand

| Propriete | Type | Requis | Validation         |
| --------- | ---- | ------ | ------------------ |
| OrderId   | Guid | Oui    | Commande existante |

## Queries et Handlers

### GetOrdersQuery

| Propriete  | Type | Defaut |
| ---------- | ---- | ------ |
| PageNumber | int  | 1      |
| PageSize   | int  | 10     |

**Resultat** : `GetOrdersResponse` avec `IEnumerable<OrderDto>`

### GetOrdersByIdQuery

| Propriete | Type | Requis |
| --------- | ---- | ------ |
| OrderId   | Guid | Oui    |

**Resultat** : `GetOrdersByIdResponse` avec `OrderDto` ou `NotFoundException`

### GetOrdersByCustomerIdQuery

| Propriete  | Type | Requis |
| ---------- | ---- | ------ |
| CustomerId | Guid | Oui    |

**Resultat** : `IEnumerable<OrderDto>`

## Domain Events

```mermaid
flowchart TB
    subgraph aggregate["Order Aggregate"]
        Order["Order"]
        Events["Domain Events List"]
    end

    subgraph interceptor["SaveChanges Interceptor"]
        Extract["Extract Events"]
        Clear["Clear Events"]
        Save["Save to DB"]
    end

    subgraph mediator["MediatR"]
        Publish["Publish Events"]
    end

    subgraph handlers["Event Handlers"]
        Created["OrderCreatedEventHandler"]
        Updated["OrderUpdatedEventHandler"]
        Deleted["OrderDeletedEventHandler"]
    end

    subgraph integration["Integration"]
        FeatureFlag["Check FeatureFlag"]
        MassTransit["MassTransit Publish"]
    end

    Order --> Events
    Events --> Extract
    Extract --> Clear
    Clear --> Save
    Save --> Publish
    Publish --> Created
    Publish --> Updated
    Publish --> Deleted
    Created --> FeatureFlag
    FeatureFlag -->|OrderFulfilment ON| MassTransit
```

| Event              | Declencheur                        | Handler                    |
| ------------------ | ---------------------------------- | -------------------------- |
| OrderCreatedEvent  | `Order.Create()`                   | OrderCreatedEventHandler   |
| OrderUpdatedEvent  | `Order.Update()`, `UpdateStatus()` | OrderUpdatedEventHandler   |
| OrderDeletedEvent  | `DeleteOrderCommand`               | OrderDeletedEventHandler   |

## Integration avec Entity Framework Core

```mermaid
flowchart TB
    subgraph app["Application Layer"]
        Handler["Handler"]
    end

    subgraph infra["Infrastructure Layer"]
        DbContext["OrderingDbContext"]
        Interceptor["DispatchDomainEventsInterceptor"]
    end

    subgraph config["Configurations"]
        OrderConfig["OrderConfiguration"]
        ItemConfig["OrderItemConfiguration"]
    end

    subgraph db["SQL Server"]
        Orders["dbo.Orders"]
        Items["dbo.OrderItems"]
    end

    Handler -->|CRUD| DbContext
    DbContext -->|SaveChanges| Interceptor
    Interceptor -->|Dispatch Events| Handler
    DbContext --> OrderConfig
    DbContext --> ItemConfig
    OrderConfig --> Orders
    ItemConfig --> Items
```

### Operations EF Core

| Operation | Methode                              | Description                |
| --------- | ------------------------------------ | -------------------------- |
| Create    | `context.Orders.Add(order)`          | Ajoute une commande        |
| Read      | `context.Orders.FirstOrDefaultAsync` | Charge par ID              |
| Query     | `context.Orders.Include().Where()`   | Requete avec includes      |
| Update    | Modification de l'entite trackee     | Detecte les changements    |
| Delete    | `context.Orders.Remove(order)`       | Supprime la commande       |
| Save      | `context.SaveChangesAsync()`         | Commit + dispatch events   |

## Dependances

```mermaid
flowchart TB
    subgraph ordering["Ordering Service"]
        API["Ordering.API"]
        App["Ordering.Application"]
        Domain["Ordering.Domain"]
        Infra["Ordering.Infrastructure"]
    end

    subgraph deps["Dependencies"]
        BB["BuildingBlocks"]
        EFCore["EF Core 9.0"]
        MediatR["MediatR"]
        FluentVal["FluentValidation"]
        MassTransit["MassTransit"]
        FeatureMgmt["FeatureManagement"]
    end

    API --> App
    API --> Infra
    App --> Domain
    Infra --> Domain

    API --> BB
    App --> BB
    App --> MediatR
    App --> FluentVal
    App --> MassTransit
    App --> FeatureMgmt
    Infra --> EFCore
```

## Configuration

### appsettings.json

```json
{
  "ConnectionStrings": {
    "OrderingConnection": "Server=...;Database=OrderingDb;..."
  },
  "FeatureManagement": {
    "OrderFulfilment": true
  }
}
```

### Program.cs (Services)

```csharp
// Application Services
builder.Services.AddApplicationServices(configuration);

// Infrastructure Services
builder.Services.AddInfrastructureServices(configuration);

// MediatR avec Behaviors
services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssembly(assembly);
    cfg.AddOpenBehavior(typeof(ValidationBehavior<,>));
    cfg.AddOpenBehavior(typeof(LoggingBehavior<,>));
});

// Feature Management
services.AddFeatureManagement();

// Message Broker (MassTransit + RabbitMQ)
services.AddMessageBroker(configuration, assembly);
```
