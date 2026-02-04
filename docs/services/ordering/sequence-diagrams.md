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
    participant LogBehavior as LoggingBehavior
    participant ValBehavior as ValidationBehavior
    participant Handler as CreateOrderCommandHandler
    participant Mapper as CreateOrderCommandMapper
    participant Order as Order (Domain)
    participant DbContext as OrderingDbContext
    participant Interceptor as DispatchDomainEventsInterceptor
    participant EventHandler as OrderCreatedEventHandler
    participant FeatureFlag as FeatureManager
    participant MassTransit as MassTransit
    participant DB as SQL Server

    Client->>Controller: POST /orders (OrderDto)
    Controller->>Controller: Create CreateOrderCommand(orderDto)
    Controller->>Mediator: Send(command)

    Mediator->>LogBehavior: Handle(command)
    LogBehavior->>LogBehavior: Log "Handling CreateOrderCommand"
    LogBehavior->>LogBehavior: Start Stopwatch

    LogBehavior->>ValBehavior: next()
    ValBehavior->>ValBehavior: Validate OrderDto

    alt Validation OK
        ValBehavior->>Handler: next()

        Handler->>Mapper: CreateNewOrderFromDto(orderDto)
        Mapper->>Mapper: Create Address VO (Shipping)
        Mapper->>Mapper: Create Address VO (Billing)
        Mapper->>Mapper: Create Payment VO
        Mapper->>Order: Order.Create(customerId, name, addresses, payment)

        Order->>Order: Set OrderStatus = Pending
        Order->>Order: Add OrderCreatedEvent to events list

        loop Pour chaque OrderItem du DTO
            Mapper->>Order: AddOrderItem(productId, quantity, price)
            Order->>Order: Create OrderItem and add to list
        end

        Mapper-->>Handler: Order (avec domain events)

        Handler->>DbContext: Orders.Add(order)
        Handler->>DbContext: SaveChangesAsync()

        DbContext->>Interceptor: SavingChangesAsync()
        Interceptor->>Interceptor: Extract OrderCreatedEvent from aggregate
        Interceptor->>Interceptor: Clear events from aggregate

        Interceptor->>DB: INSERT INTO Orders, OrderItems
        DB-->>Interceptor: Success

        Interceptor->>Mediator: Publish(OrderCreatedEvent)
        Mediator->>EventHandler: Handle(OrderCreatedEvent)

        EventHandler->>EventHandler: Log "Domain Event Handled: OrderCreatedEvent"
        EventHandler->>FeatureFlag: IsEnabledAsync("OrderFulfilment")

        alt Feature Flag Active
            FeatureFlag-->>EventHandler: true
            EventHandler->>EventHandler: Convert Order to OrderDto
            EventHandler->>MassTransit: Publish(IntegrationEvent)
            MassTransit-->>EventHandler: OK
        else Feature Flag Inactive
            FeatureFlag-->>EventHandler: false
            EventHandler->>EventHandler: Skip integration event
        end

        EventHandler-->>Mediator: OK
        Interceptor-->>DbContext: OK
        DbContext-->>Handler: OK

        Handler-->>ValBehavior: CreateOrderCommandResult(orderId)
        ValBehavior-->>LogBehavior: Result
        LogBehavior->>LogBehavior: Stop Stopwatch
        LogBehavior->>LogBehavior: Log "Handled in {ms}ms"
        LogBehavior-->>Mediator: Result

        Mediator-->>Controller: CreateOrderCommandResult
        Controller-->>Client: 200 OK { orderId: Guid }

    else Validation Failed
        ValBehavior->>ValBehavior: Collect validation errors
        ValBehavior->>ValBehavior: throw ValidationException
        ValBehavior-->>Controller: ValidationException
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
    participant LogBehavior as LoggingBehavior
    participant Handler as UpdateOrderStatusCommandHandler
    participant DbContext as OrderingDbContext
    participant Order as Order (Domain)
    participant Interceptor as DispatchDomainEventsInterceptor
    participant EventHandler as OrderUpdatedEventHandler
    participant DB as SQL Server

    Client->>Controller: PUT /orders/{orderId} (UpdateOrderStatusRequest)
    Controller->>Controller: Create UpdateOrderStatusCommand(orderId, status)
    Controller->>Mediator: Send(command)

    Mediator->>LogBehavior: Handle(command)
    LogBehavior->>LogBehavior: Log "Handling UpdateOrderStatusCommand"

    LogBehavior->>Handler: next()

    Handler->>Handler: OrderId.Of(orderId) - Convert Guid to Value Object

    Handler->>DbContext: Orders.FirstOrDefaultAsync(o => o.Id == orderId)
    DbContext->>DB: SELECT * FROM Orders WHERE Id = @orderId
    DB-->>DbContext: Order data
    DbContext-->>Handler: Order entity (or null)

    alt Commande Trouvee
        Handler->>Order: UpdateStatus(newStatus)
        Order->>Order: Set OrderStatus = newStatus
        Order->>Order: Add OrderUpdatedEvent to events list

        Handler->>DbContext: SaveChangesAsync()

        DbContext->>Interceptor: SavingChangesAsync()
        Interceptor->>Interceptor: Extract OrderUpdatedEvent from aggregate
        Interceptor->>Interceptor: Clear events from aggregate

        Interceptor->>DB: UPDATE Orders SET Status = @status WHERE Id = @id
        DB-->>Interceptor: Success

        Interceptor->>Mediator: Publish(OrderUpdatedEvent)
        Mediator->>EventHandler: Handle(OrderUpdatedEvent)
        EventHandler->>EventHandler: Log "Domain Event Handled: OrderUpdatedEvent"
        EventHandler-->>Mediator: OK

        Interceptor-->>DbContext: OK
        DbContext-->>Handler: OK

        Handler-->>LogBehavior: UpdateOrderStatusCommandResult(true)
        LogBehavior->>LogBehavior: Log "Handled in {ms}ms"
        LogBehavior-->>Mediator: Result

        Mediator-->>Controller: UpdateOrderStatusCommandResult
        Controller-->>Client: 200 OK { success: true }

    else Commande Non Trouvee
        Handler->>Handler: throw OrderNotFoundException(orderId)
        Handler-->>Controller: OrderNotFoundException
        Controller-->>Client: 404 Not Found { message: "Order not found" }
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
    participant LogBehavior as LoggingBehavior
    participant Handler as GetOrdersByIdQueryHandler
    participant DbContext as OrderingDbContext
    participant Mapper as OrderMapper
    participant DB as SQL Server

    Client->>Controller: GET /orders/{orderId}
    Controller->>Controller: Create GetOrdersByIdQuery(orderId)
    Controller->>Mediator: Send(query)

    Mediator->>LogBehavior: Handle(query)
    LogBehavior->>LogBehavior: Log "Handling GetOrdersByIdQuery"

    LogBehavior->>Handler: next()

    Handler->>Handler: OrderId.Of(orderId) - Convert Guid to Value Object

    Handler->>DbContext: Orders.Include(OrderItems).AsNoTracking().FirstOrDefaultAsync(id)
    DbContext->>DB: SELECT o.*, oi.* FROM Orders o LEFT JOIN OrderItems oi ON o.Id = oi.OrderId WHERE o.Id = @orderId
    DB-->>DbContext: Order + OrderItems data
    DbContext-->>Handler: Order entity (or null)

    alt Commande Trouvee
        Handler->>Mapper: ToDto(order)

        Mapper->>Mapper: Map Order properties to OrderDto
        Mapper->>Mapper: Map ShippingAddress to AddressDto
        Mapper->>Mapper: Map BillingAddress to AddressDto
        Mapper->>Mapper: Map Payment to PaymentDto

        loop Pour chaque OrderItem
            Mapper->>Mapper: Map OrderItem to OrderItemDto
        end

        Mapper-->>Handler: OrderDto

        Handler-->>LogBehavior: GetOrdersByIdResponse(OrderDto)
        LogBehavior->>LogBehavior: Log "Handled in {ms}ms"
        LogBehavior-->>Mediator: Response

        Mediator-->>Controller: GetOrdersByIdResponse
        Controller-->>Client: 200 OK (OrderDto)

    else Commande Non Trouvee
        Handler->>Handler: throw NotFoundException("Order", orderId)
        Handler-->>Controller: NotFoundException
        Controller-->>Client: 404 Not Found { message: "Order not found" }
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
    participant Mapper as OrderMapper
    participant DB as SQL Server

    Client->>Controller: GET /orders?pageNumber=1&pageSize=10
    Controller->>Controller: Create GetOrdersQuery(pageNumber, pageSize)
    Controller->>Mediator: Send(query)

    Mediator->>Handler: Handle(query)

    Handler->>DbContext: Orders.Include(OrderItems).Skip().Take().AsNoTracking().ToListAsync()
    DbContext->>DB: SELECT o.*, oi.* FROM Orders o LEFT JOIN OrderItems oi ON o.Id = oi.OrderId ORDER BY o.Id OFFSET @skip ROWS FETCH NEXT @take ROWS ONLY
    DB-->>DbContext: Orders list
    DbContext-->>Handler: List<Order>

    loop Pour chaque Order
        Handler->>Mapper: ToDto(order)
        Mapper-->>Handler: OrderDto
    end

    Handler-->>Mediator: GetOrdersResponse(IEnumerable<OrderDto>)
    Mediator-->>Controller: Response
    Controller-->>Client: 200 OK { orders: [...] }
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
    participant Order as Order (Domain)
    participant Interceptor as DispatchDomainEventsInterceptor
    participant EventHandler as OrderDeletedEventHandler
    participant DB as SQL Server

    Client->>Controller: DELETE /orders/{orderId}
    Controller->>Controller: Create DeleteOrderCommand(orderId)
    Controller->>Mediator: Send(command)

    Mediator->>Handler: Handle(command)

    Handler->>Handler: OrderId.Of(orderId) - Convert to Value Object

    Handler->>DbContext: Orders.FirstOrDefaultAsync(id)
    DbContext->>DB: SELECT * FROM Orders WHERE Id = @orderId
    DB-->>DbContext: Order data
    DbContext-->>Handler: Order entity (or null)

    alt Commande Trouvee
        Handler->>Order: AddDomainEvent(new OrderDeletedEvent(order))
        Order->>Order: Add OrderDeletedEvent to events list

        Handler->>DbContext: Orders.Remove(order)
        Handler->>DbContext: SaveChangesAsync()

        DbContext->>Interceptor: SavingChangesAsync()
        Interceptor->>Interceptor: Extract OrderDeletedEvent from aggregate
        Interceptor->>Interceptor: Clear events from aggregate

        Interceptor->>DB: DELETE FROM OrderItems WHERE OrderId = @id; DELETE FROM Orders WHERE Id = @id
        DB-->>Interceptor: Success

        Interceptor->>Mediator: Publish(OrderDeletedEvent)
        Mediator->>EventHandler: Handle(OrderDeletedEvent)
        EventHandler->>EventHandler: Log "Domain Event Handled: OrderDeletedEvent"
        EventHandler-->>Mediator: OK

        Interceptor-->>DbContext: OK
        DbContext-->>Handler: OK

        Handler-->>Mediator: DeleteOrderCommandResult(true)
        Mediator-->>Controller: Result
        Controller-->>Client: 200 OK { success: true }

    else Commande Non Trouvee
        Handler->>Handler: throw OrderNotFoundException(orderId)
        Handler-->>Controller: OrderNotFoundException
        Controller-->>Client: 404 Not Found
    end
```

## Pipeline MediatR

```mermaid
sequenceDiagram
    autonumber
    participant Controller
    participant Mediator as MediatR
    participant Logging as LoggingBehavior
    participant Validation as ValidationBehavior
    participant Handler as Request Handler

    Controller->>Mediator: Send(request)

    Note over Mediator,Handler: Pipeline Execution

    Mediator->>Logging: Handle(request, next)
    Logging->>Logging: Log "Handling {RequestName}"
    Logging->>Logging: Start Stopwatch

    Logging->>Validation: next()
    Validation->>Validation: Get validators for request type
    Validation->>Validation: ValidateAsync(request)

    alt All validators pass
        Validation->>Handler: next()
        Handler->>Handler: Execute business logic
        Handler-->>Validation: Response
        Validation-->>Logging: Response
    else Validation fails
        Validation->>Validation: Collect errors
        Validation->>Validation: throw ValidationException
    end

    Logging->>Logging: Stop Stopwatch
    Logging->>Logging: Log "Handled {RequestName} in {ms}ms"
    Logging-->>Mediator: Response
    Mediator-->>Controller: Response
```

## Flux des Domain Events

```mermaid
sequenceDiagram
    autonumber
    participant Handler as Command Handler
    participant Aggregate as Order Aggregate
    participant DbContext as OrderingDbContext
    participant Interceptor as DispatchDomainEventsInterceptor
    participant Mediator as MediatR
    participant EventHandler as Domain Event Handler
    participant MassTransit as MassTransit (Integration)

    Handler->>Aggregate: Execute domain method
    Aggregate->>Aggregate: Business logic
    Aggregate->>Aggregate: AddDomainEvent(event)

    Handler->>DbContext: SaveChangesAsync()

    DbContext->>Interceptor: SavingChangesAsync()

    Note over Interceptor: Before DB Save

    Interceptor->>Interceptor: Get all tracked aggregates
    Interceptor->>Aggregate: GetDomainEvents()
    Aggregate-->>Interceptor: List<IDomainEvent>
    Interceptor->>Aggregate: ClearDomainEvents()

    Interceptor->>DbContext: base.SavingChangesAsync()
    Note over DbContext: DB Transaction

    Note over Interceptor: After DB Save

    loop Pour chaque Domain Event
        Interceptor->>Mediator: Publish(domainEvent)
        Mediator->>EventHandler: Handle(domainEvent)
        EventHandler->>EventHandler: Process event

        alt Integration Event Required
            EventHandler->>MassTransit: Publish(integrationEvent)
        end

        EventHandler-->>Mediator: OK
    end

    Interceptor-->>DbContext: OK
    DbContext-->>Handler: OK
```
