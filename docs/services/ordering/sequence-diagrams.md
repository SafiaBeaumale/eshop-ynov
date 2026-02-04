# Ordering Service - Diagrammes de Sequence

## Vue d'Ensemble

Ce document presente les diagrammes de sequence pour les principales operations du service Ordering.

## Operations d'Ecriture

### POST /orders - Creation d'une Commande

```mermaid
sequenceDiagram
    autonumber
    participant Client
    participant Controller as OrdersController
    participant Mediator as MediatR
    participant Handler as CreateOrderCommandHandler
    participant DbContext as OrderingDbContext
    participant EventHandler as OrderCreatedEventHandler
    participant Messaging as MassTransit

    Client->>Controller: POST /orders (OrderDto)
    Controller->>Mediator: Send(CreateOrderCommand)

    alt Validation OK
        Mediator->>Handler: Handle(command)
        Handler->>Handler: Mapper: OrderDto → Order (domain)
        Handler->>DbContext: Add(order) + SaveChangesAsync()
        DbContext->>DbContext: Persist + dispatch OrderCreatedEvent
        DbContext->>EventHandler: Publish(OrderCreatedEvent)
        alt Feature "OrderFulfilment" activé
            EventHandler->>Messaging: Publish(IntegrationEvent)
        end
        EventHandler-->>Mediator: OK
        DbContext-->>Handler: OK
        Handler-->>Mediator: CreateOrderCommandResult(orderId)
        Mediator-->>Controller: Result
        Controller-->>Client: 200 OK { orderId }
    else Validation échouée
        Mediator-->>Controller: ValidationException
        Controller-->>Client: 400 Bad Request { errors }
    end
```

### PUT /orders/{orderId} - Changement du Statut d'une Commande

```mermaid
sequenceDiagram
    autonumber
    participant Client
    participant Controller as OrdersController
    participant Mediator as MediatR
    participant Handler as UpdateOrderStatusCommandHandler
    participant DbContext as OrderingDbContext

    Client->>Controller: PUT /orders/{orderId} (status)
    Controller->>Mediator: Send(UpdateOrderStatusCommand)

    Mediator->>Handler: Handle(command)
    Handler->>DbContext: FirstOrDefaultAsync(orderId)
    DbContext-->>Handler: Order (ou null)

    alt Commande trouvée
        Handler->>Handler: Order.UpdateStatus(newStatus)
        Handler->>DbContext: SaveChangesAsync()
        DbContext->>DbContext: Persist + dispatch OrderUpdatedEvent
        DbContext-->>Handler: OK
        Handler-->>Mediator: UpdateOrderStatusCommandResult
        Mediator-->>Controller: Result
        Controller-->>Client: 200 OK { success: true }
    else Commande non trouvée
        Handler-->>Mediator: OrderNotFoundException
        Mediator-->>Controller: Exception
        Controller-->>Client: 404 Not Found
    end
```

## Operations de Lecture

### GET /orders/{orderId} - Recuperation des Informations d'une Commande

```mermaid
sequenceDiagram
    autonumber
    participant Client
    participant Controller as OrdersController
    participant Mediator as MediatR
    participant Handler as GetOrdersByIdQueryHandler
    participant DbContext as OrderingDbContext

    Client->>Controller: GET /orders/{orderId}
    Controller->>Mediator: Send(GetOrdersByIdQuery)

    Mediator->>Handler: Handle(query)
    Handler->>DbContext: FirstOrDefaultAsync(id) + Include(OrderItems)
    DbContext-->>Handler: Order (ou null)

    alt Commande trouvée
        Handler->>Handler: Mapper: Order → OrderDto
        Handler-->>Mediator: GetOrdersByIdResponse(OrderDto)
        Mediator-->>Controller: Response
        Controller-->>Client: 200 OK (OrderDto)
    else Commande non trouvée
        Handler-->>Mediator: NotFoundException
        Mediator-->>Controller: Exception
        Controller-->>Client: 404 Not Found
    end
```

### GET /orders - Liste Paginee des Commandes

```mermaid
sequenceDiagram
    autonumber
    participant Client
    participant Controller as OrdersController
    participant Mediator as MediatR
    participant Handler as GetOrdersQueryHandler
    participant DbContext as OrderingDbContext

    Client->>Controller: GET /orders?pageNumber=1&pageSize=10
    Controller->>Mediator: Send(GetOrdersQuery)

    Mediator->>Handler: Handle(query)
    Handler->>DbContext: ToListAsync() + pagination (Skip/Take)
    DbContext-->>Handler: List&lt;Order&gt;
    Handler->>Handler: Mapper: Order → OrderDto (pour chaque)
    Handler-->>Mediator: GetOrdersResponse(OrderDto[])
    Mediator-->>Controller: Response
    Controller-->>Client: 200 OK { orders }
```

### GET /orders/customer/{customerId} - Commandes par Client

```mermaid
sequenceDiagram
    autonumber
    participant Client
    participant Controller as OrdersController
    participant Mediator as MediatR
    participant Handler as GetOrdersByCustomerIdQueryHandler
    participant DbContext as OrderingDbContext
    participant Mapper as OrderMapper
    participant DB as SQL Server

    Client->>Controller: GET /orders/customer/{customerId}
    Controller->>Controller: Create GetOrdersByCustomerIdQuery(customerId)
    Controller->>Mediator: Send(query)

    Mediator->>Handler: Handle(query)

    Handler->>Handler: CustomerId.Of(customerId) - Convert to Value Object

    Handler->>DbContext: Orders.Include(OrderItems).Where(CustomerId).AsNoTracking().ToListAsync()
    DbContext->>DB: SELECT o.*, oi.* FROM Orders o LEFT JOIN OrderItems oi ON o.Id = oi.OrderId WHERE o.CustomerId = @customerId
    DB-->>DbContext: Orders list
    DbContext-->>Handler: List<Order>

    loop Pour chaque Order
        Handler->>Mapper: ToDto(order)
        Mapper-->>Handler: OrderDto
    end

    Handler-->>Mediator: IEnumerable<OrderDto>
    Mediator-->>Controller: Response
    Controller-->>Client: 200 OK { orders: [...] }
```

## Operations de Suppression

### DELETE /orders/{orderId} - Suppression d'une Commande

```mermaid
sequenceDiagram
    autonumber
    participant Client
    participant Controller as OrdersController
    participant Mediator as MediatR
    participant Handler as DeleteOrderCommandHandler
    participant DbContext as OrderingDbContext

    Client->>Controller: DELETE /orders/{orderId}
    Controller->>Mediator: Send(DeleteOrderCommand)

    Mediator->>Handler: Handle(command)
    Handler->>DbContext: FirstOrDefaultAsync(orderId)
    DbContext-->>Handler: Order (ou null)

    alt Commande trouvée
        Handler->>DbContext: Remove(order) + SaveChangesAsync()
        DbContext->>DbContext: Delete + dispatch OrderDeletedEvent
        DbContext-->>Handler: OK
        Handler-->>Mediator: DeleteOrderCommandResult
        Mediator-->>Controller: Result
        Controller-->>Client: 200 OK { success: true }
    else Commande non trouvée
        Handler-->>Mediator: OrderNotFoundException
        Mediator-->>Controller: Exception
        Controller-->>Client: 404 Not Found
    end
```
