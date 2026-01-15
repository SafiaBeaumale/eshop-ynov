# Catalog Service - Diagrammes de Sequence

## Vue d'Ensemble

Ce document presente les diagrammes de sequence pour les principales operations du service Catalog.

## Operations de Lecture

### GET /products - Liste Paginee

```mermaid
sequenceDiagram
    autonumber
    participant Client
    participant Controller as ProductsController
    participant Mediator as MediatR
    participant LogBehavior as LoggingBehavior
    participant Handler as GetProductsHandler
    participant Marten as DocumentSession
    participant DB as PostgreSQL

    Client->>Controller: GET /products?pageNumber=1&pageSize=10
    Controller->>Controller: Create GetProductsQuery
    Controller->>Mediator: Send(query)

    Mediator->>LogBehavior: Handle(query)
    LogBehavior->>LogBehavior: Log "Handling GetProductsQuery"

    LogBehavior->>Handler: Handle(query)
    Handler->>Marten: Query<Product>()
    Marten->>DB: SELECT * FROM mt_doc_product LIMIT 10 OFFSET 0
    DB-->>Marten: Product rows
    Marten-->>Handler: IQueryable<Product>

    Handler->>Handler: Map to ProductDto
    Handler->>Handler: Create PaginatedResult

    Handler-->>LogBehavior: PaginatedResult<ProductDto>
    LogBehavior->>LogBehavior: Log "Handled GetProductsQuery"
    LogBehavior-->>Mediator: Result

    Mediator-->>Controller: PaginatedResult<ProductDto>
    Controller-->>Client: 200 OK { data, pageNumber, pageSize, totalCount }
```

### GET /products/{id} - Produit par ID

```mermaid
sequenceDiagram
    autonumber
    participant Client
    participant Controller as ProductsController
    participant Mediator as MediatR
    participant Handler as GetProductByIdHandler
    participant Marten as DocumentSession
    participant DB as PostgreSQL

    Client->>Controller: GET /products/abc123
    Controller->>Controller: Create GetProductByIdQuery(id)
    Controller->>Mediator: Send(query)

    Mediator->>Handler: Handle(query)
    Handler->>Marten: LoadAsync<Product>(id)
    Marten->>DB: SELECT * FROM mt_doc_product WHERE id = 'abc123'

    alt Produit trouve
        DB-->>Marten: Product data
        Marten-->>Handler: Product
        Handler->>Handler: Map to ProductDto
        Handler-->>Mediator: GetProductByIdResult
        Mediator-->>Controller: Result
        Controller-->>Client: 200 OK { product }
    else Produit non trouve
        DB-->>Marten: null
        Marten-->>Handler: null
        Handler->>Handler: throw NotFoundException
        Handler-->>Controller: NotFoundException
        Controller-->>Client: 404 Not Found
    end
```

### GET /products/category/{category} - Par Categorie

```mermaid
sequenceDiagram
    autonumber
    participant Client
    participant Controller as ProductsController
    participant Mediator as MediatR
    participant Handler as GetProductsByCategoryHandler
    participant Marten as DocumentSession
    participant DB as PostgreSQL

    Client->>Controller: GET /products/category/Electronics
    Controller->>Controller: Create GetProductsByCategoryQuery(category)
    Controller->>Mediator: Send(query)

    Mediator->>Handler: Handle(query)
    Handler->>Marten: Query<Product>().Where(p => p.Categories.Contains(category))
    Marten->>DB: SELECT * FROM mt_doc_product WHERE categories @> '["Electronics"]'
    DB-->>Marten: Product rows
    Marten-->>Handler: List<Product>

    alt Produits trouves
        Handler->>Handler: Map to ProductDto list
        Handler-->>Mediator: GetProductsByCategoryResult
        Mediator-->>Controller: Result
        Controller-->>Client: 200 OK { products }
    else Aucun produit
        Handler->>Handler: throw ProductsByCategoryNotFoundException
        Handler-->>Controller: Exception
        Controller-->>Client: 404 Not Found
    end
```

## Operations d'Ecriture

### POST /products - Creation

```mermaid
sequenceDiagram
    autonumber
    participant Client
    participant Controller as ProductsController
    participant Mediator as MediatR
    participant LogBehavior as LoggingBehavior
    participant ValBehavior as ValidationBehavior
    participant Validator as CreateProductValidator
    participant Handler as CreateProductHandler
    participant Marten as DocumentSession
    participant DB as PostgreSQL

    Client->>Controller: POST /products { name, price, ... }
    Controller->>Controller: Create CreateProductCommand
    Controller->>Mediator: Send(command)

    Mediator->>LogBehavior: Handle(command)
    LogBehavior->>LogBehavior: Log "Handling CreateProductCommand"

    LogBehavior->>ValBehavior: next()
    ValBehavior->>Validator: ValidateAsync(command)

    alt Validation OK
        Validator-->>ValBehavior: ValidationResult (success)
        ValBehavior->>Handler: next()

        Handler->>Handler: Map command to Product
        Handler->>Handler: Generate new Guid
        Handler->>Marten: Store(product)
        Handler->>Marten: SaveChangesAsync()
        Marten->>DB: INSERT INTO mt_doc_product
        DB-->>Marten: Success
        Marten-->>Handler: Saved

        Handler-->>ValBehavior: CreateProductResult { Id }
        ValBehavior-->>LogBehavior: Result
        LogBehavior->>LogBehavior: Log "Handled CreateProductCommand"
        LogBehavior-->>Mediator: Result
        Mediator-->>Controller: CreateProductResult
        Controller-->>Client: 201 Created { id }

    else Validation Failed
        Validator-->>ValBehavior: ValidationResult (errors)
        ValBehavior->>ValBehavior: throw ValidationException
        ValBehavior-->>Controller: ValidationException
        Controller-->>Client: 400 Bad Request { errors }
    end
```

### PUT /products/{id} - Modification

```mermaid
sequenceDiagram
    autonumber
    participant Client
    participant Controller as ProductsController
    participant Mediator as MediatR
    participant ValBehavior as ValidationBehavior
    participant Handler as UpdateProductHandler
    participant Marten as DocumentSession
    participant DB as PostgreSQL

    Client->>Controller: PUT /products/abc123 { name, price, ... }
    Controller->>Controller: Create UpdateProductCommand(id, data)
    Controller->>Mediator: Send(command)

    Mediator->>ValBehavior: Handle(command)
    ValBehavior->>ValBehavior: Validate command

    alt Validation OK
        ValBehavior->>Handler: next()
        Handler->>Marten: LoadAsync<Product>(id)
        Marten->>DB: SELECT * FROM mt_doc_product WHERE id = ?
        DB-->>Marten: Product data

        alt Produit existe
            Marten-->>Handler: Product
            Handler->>Handler: Update product properties
            Handler->>Marten: Store(product)
            Handler->>Marten: SaveChangesAsync()
            Marten->>DB: UPDATE mt_doc_product SET ...
            DB-->>Marten: Success

            Handler-->>Mediator: UpdateProductResult
            Mediator-->>Controller: Result
            Controller-->>Client: 200 OK

        else Produit non trouve
            Marten-->>Handler: null
            Handler->>Handler: throw NotFoundException
            Handler-->>Controller: NotFoundException
            Controller-->>Client: 404 Not Found
        end
    else Validation Failed
        ValBehavior-->>Controller: ValidationException
        Controller-->>Client: 400 Bad Request
    end
```

### DELETE /products/{id} - Suppression

```mermaid
sequenceDiagram
    autonumber
    participant Client
    participant Controller as ProductsController
    participant Mediator as MediatR
    participant Handler as DeleteProductHandler
    participant Marten as DocumentSession
    participant DB as PostgreSQL

    Client->>Controller: DELETE /products/abc123
    Controller->>Controller: Create DeleteProductCommand(id)
    Controller->>Mediator: Send(command)

    Mediator->>Handler: Handle(command)
    Handler->>Marten: LoadAsync<Product>(id)
    Marten->>DB: SELECT * FROM mt_doc_product WHERE id = ?
    DB-->>Marten: Product data

    alt Produit existe
        Marten-->>Handler: Product
        Handler->>Marten: Delete<Product>(id)
        Handler->>Marten: SaveChangesAsync()
        Marten->>DB: DELETE FROM mt_doc_product WHERE id = ?
        DB-->>Marten: Success

        Handler-->>Mediator: DeleteProductResult
        Mediator-->>Controller: Result
        Controller-->>Client: 204 No Content

    else Produit non trouve
        Marten-->>Handler: null
        Handler->>Handler: throw NotFoundException
        Handler-->>Controller: NotFoundException
        Controller-->>Client: 404 Not Found
    end
```

## Operations Import/Export

### POST /products/import - Import Excel

```mermaid
sequenceDiagram
    autonumber
    participant Client
    participant Controller as ProductsController
    participant Mediator as MediatR
    participant Handler as ImportProductsHandler
    participant ClosedXML as XLWorkbook
    participant Marten as DocumentSession
    participant DB as PostgreSQL

    Client->>Controller: POST /products/import (file.xlsx)
    Controller->>Controller: Create ImportProductsCommand(file)
    Controller->>Mediator: Send(command)

    Mediator->>Handler: Handle(command)
    Handler->>ClosedXML: new XLWorkbook(stream)
    ClosedXML-->>Handler: Workbook

    Handler->>ClosedXML: GetWorksheet(1)
    ClosedXML-->>Handler: Worksheet

    Handler->>Handler: Get row count

    loop For each row (2 to lastRow)
        Handler->>ClosedXML: Read cell values (A-F)
        ClosedXML-->>Handler: Cell data

        Handler->>Handler: Parse Id (or generate)
        Handler->>Handler: Parse Name
        Handler->>Handler: Parse Description
        Handler->>Handler: Parse Price
        Handler->>Handler: Parse ImageFile
        Handler->>Handler: Parse Categories (split by comma)

        alt Row valid (Name not empty)
            Handler->>Handler: Create Product
            Handler->>Marten: Store(product)
        else Row invalid
            Handler->>Handler: Skip row
        end
    end

    Handler->>Marten: SaveChangesAsync()
    Marten->>DB: INSERT batch
    DB-->>Marten: Success

    Handler-->>Mediator: ImportProductsResult { importedCount }
    Mediator-->>Controller: Result
    Controller-->>Client: 200 OK { importedCount: N }
```

### GET /products/export - Export Excel

```mermaid
sequenceDiagram
    autonumber
    participant Client
    participant Controller as ProductsController
    participant Mediator as MediatR
    participant Handler as ExportProductsHandler
    participant Marten as DocumentSession
    participant DB as PostgreSQL
    participant ClosedXML as XLWorkbook

    Client->>Controller: GET /products/export
    Controller->>Controller: Create ExportProductsQuery
    Controller->>Mediator: Send(query)

    Mediator->>Handler: Handle(query)

    Handler->>Marten: Query<Product>().ToListAsync()
    Marten->>DB: SELECT * FROM mt_doc_product
    DB-->>Marten: All products
    Marten-->>Handler: List<Product>

    Handler->>ClosedXML: new XLWorkbook()
    Handler->>ClosedXML: AddWorksheet("Products")

    Handler->>ClosedXML: Add header row (Id, Name, Description, Price, ImageFile, Categories)

    loop For each product
        Handler->>ClosedXML: Add row with product data
    end

    Handler->>ClosedXML: SaveAs(memoryStream)
    ClosedXML-->>Handler: byte[]

    Handler-->>Mediator: ExportProductsResult { fileContent }
    Mediator-->>Controller: Result
    Controller-->>Client: 200 OK (file download: products.xlsx)
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
