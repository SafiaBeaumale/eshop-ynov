# Discount Service - Diagrammes de Sequence

## Vue d'Ensemble

Ce document presente les diagrammes de sequence pour les operations du service Discount, illustrant le flux gRPC depuis le client (Basket.API) jusqu'a la base de donnees SQLite.

## Operations de Lecture

### GetDiscount - Recuperation d'une remise

```mermaid
sequenceDiagram
    autonumber
    participant Basket as Basket.API
    participant Client as DiscountProtoService.Client
    participant Server as DiscountServiceServer
    participant Mapster as Mapster
    participant Context as DiscountContext
    participant DB as SQLite

    Basket->>Client: GetDiscount(productName)
    Client->>Server: gRPC GetDiscount(GetDiscountRequest)

    Server->>Context: Coupons.FirstOrDefaultAsync(x => x.ProductName == productName)
    Context->>DB: SELECT * FROM Coupon WHERE ProductName = ?
    DB-->>Context: Coupon row

    alt Coupon trouve
        Context-->>Server: Coupon entity
        Server->>Mapster: coupon.Adapt<CouponModel>()
        Mapster-->>Server: CouponModel (Protobuf)
        Server-->>Client: CouponModel { id, productName, description, amount }
        Client-->>Basket: CouponModel
    else Coupon non trouve
        Context-->>Server: null
        Server-->>Client: RpcException(NOT_FOUND)
        Client-->>Basket: RpcException
    end
```

## Operations d'Ecriture

### CreateDiscount - Creation d'un coupon

```mermaid
sequenceDiagram
    autonumber
    participant Caller as Service Appelant
    participant Client as DiscountProtoService.Client
    participant Server as DiscountServiceServer
    participant Mapster as Mapster
    participant Context as DiscountContext
    participant DB as SQLite

    Caller->>Client: CreateDiscount(coupon)
    Client->>Server: gRPC CreateDiscount(CreateDiscountRequest)

    alt Coupon is null
        Server-->>Client: RpcException(INVALID_ARGUMENT)
        Client-->>Caller: RpcException
    else Coupon valide
        Server->>Mapster: request.Coupon.Adapt<Coupon>()
        Mapster-->>Server: Coupon entity

        Server->>Context: Coupons.AddAsync(coupon)
        Server->>Context: SaveChangesAsync()
        Context->>DB: INSERT INTO Coupon (ProductName, Description, Amount) VALUES (?, ?, ?)
        DB-->>Context: Success (Id generated)
        Context-->>Server: Saved

        Server->>Mapster: coupon.Adapt<CouponModel>()
        Mapster-->>Server: CouponModel
        Server-->>Client: CouponModel { id, productName, description, amount }
        Client-->>Caller: CouponModel
    end
```

### UpdateDiscount - Modification d'un coupon

```mermaid
sequenceDiagram
    autonumber
    participant Caller as Service Appelant
    participant Client as DiscountProtoService.Client
    participant Server as DiscountServiceServer
    participant Mapster as Mapster
    participant Context as DiscountContext
    participant DB as SQLite

    Caller->>Client: UpdateDiscount(coupon)
    Client->>Server: gRPC UpdateDiscount(UpdateDiscountRequest)

    alt Coupon is null
        Server-->>Client: RpcException(INVALID_ARGUMENT)
    else Coupon valide
        Server->>Context: FirstOrDefaultAsync(x => x.ProductName == name || x.Id == id)
        Context->>DB: SELECT * FROM Coupon WHERE ProductName = ? OR Id = ?
        DB-->>Context: Result

        alt Coupon non trouve
            Context-->>Server: null
            Server-->>Client: RpcException(NOT_FOUND)
        else Coupon trouve
            Context-->>Server: Coupon entity
            Server->>Mapster: request.Coupon.Adapt(coupon)
            Mapster-->>Server: Updated Coupon

            Server->>Context: Coupons.Update(coupon)
            Server->>Context: SaveChangesAsync()
            Context->>DB: UPDATE Coupon SET ... WHERE Id = ?
            DB-->>Context: Success
            Context-->>Server: Saved

            Server->>Mapster: coupon.Adapt<CouponModel>()
            Mapster-->>Server: CouponModel
            Server-->>Client: CouponModel
            Client-->>Caller: CouponModel
        end
    end
```

### DeleteDiscount - Suppression d'un coupon

```mermaid
sequenceDiagram
    autonumber
    participant Caller as Service Appelant
    participant Client as DiscountProtoService.Client
    participant Server as DiscountServiceServer
    participant Context as DiscountContext
    participant DB as SQLite

    Caller->>Client: DeleteDiscount(coupon)
    Client->>Server: gRPC DeleteDiscount(DeleteDiscountRequest)

    alt Coupon is null
        Server-->>Client: RpcException(INVALID_ARGUMENT)
    else Coupon valide
        Server->>Context: FirstOrDefaultAsync(x => x.ProductName == name || x.Id == id)
        Context->>DB: SELECT * FROM Coupon WHERE ProductName = ? OR Id = ?
        DB-->>Context: Result

        alt Coupon non trouve
            Context-->>Server: null
            Server-->>Client: RpcException(NOT_FOUND)
        else Coupon trouve
            Context-->>Server: Coupon entity
            Server->>Context: Coupons.Remove(coupon)
            Server->>Context: SaveChangesAsync()
            Context->>DB: DELETE FROM Coupon WHERE Id = ?
            DB-->>Context: Success
            Context-->>Server: Deleted

            Server-->>Client: DeleteDiscountResponse { success: true }
            Client-->>Caller: DeleteDiscountResponse
        end
    end
```

## Integration Basket - Discount

### Application de remise lors de l'ajout au panier

```mermaid
sequenceDiagram
    autonumber
    participant Client
    participant Controller as BasketsController
    participant Mediator as MediatR
    participant Handler as AddItemHandler
    participant gRPCClient as DiscountProtoService.Client
    participant Discount as Discount.Grpc
    participant DB as SQLite
    participant Repo as IBasketRepository

    Client->>Controller: POST /baskets/{userName}/items
    Controller->>Mediator: Send(AddItemCommand)
    Mediator->>Handler: Handle(command)

    Handler->>gRPCClient: GetDiscount(productName)
    gRPCClient->>Discount: gRPC GetDiscount
    Discount->>DB: Query coupon
    DB-->>Discount: Coupon data
    Discount-->>gRPCClient: CouponModel { amount }
    gRPCClient-->>Handler: CouponModel

    Handler->>Handler: item.Price -= coupon.Amount

    Handler->>Repo: StoreBasket(cart)
    Repo-->>Handler: Updated cart

    Handler-->>Mediator: Result
    Mediator-->>Controller: Result
    Controller-->>Client: 200 OK { cart with discounted prices }
```

## Demarrage du Service

### Migration automatique au demarrage

```mermaid
sequenceDiagram
    autonumber
    participant App as Program.cs
    participant Migration as MigrationExtension
    participant Context as DiscountContext
    participant DB as SQLite

    App->>App: Build WebApplication
    App->>Migration: UseCustomMigration()

    Migration->>Context: Create scope
    Migration->>Context: Database.MigrateAsync()
    Context->>DB: Apply pending migrations
    DB-->>Context: Schema created

    Note over Context,DB: Seed data applied:<br/>IPhone X (150.0)<br/>Samsung 10 (100.0)

    Context-->>Migration: Migration complete
    Migration-->>App: Ready

    App->>App: MapGrpcService<DiscountServiceServer>()
    App->>App: Run()
```
