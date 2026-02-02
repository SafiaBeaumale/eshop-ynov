# Catalog Service - Architecture des Composants

## Vue d'Ensemble

Le Catalog Service est responsable de la gestion du catalogue de produits. Il est construit sur une architecture CQRS avec MediatR et utilise Marten comme document store sur PostgreSQL.

## Architecture Globale

```mermaid
flowchart TB
    subgraph external["External"]
        Client["HTTP Client"]
        Gateway["API Gateway"]
    end

    subgraph catalog_api["Catalog.API"]
        Controller["ProductsController"]

        subgraph cqrs["CQRS Layer"]
            subgraph commands["Commands"]
                CreateCmd["CreateProductCommand"]
                UpdateCmd["UpdateProductCommand"]
                DeleteCmd["DeleteProductCommand"]
                ImportCmd["ImportProductsCommand"]
            end

            subgraph queries["Queries"]
                GetAllQry["GetProductsQuery"]
                GetByIdQry["GetProductByIdQuery"]
                GetByCatQry["GetProductsByCategoryQuery"]
                ExportQry["ExportProductsQuery"]
            end
        end

        subgraph handlers["Handlers"]
            CmdHandlers["Command Handlers"]
            QryHandlers["Query Handlers"]
        end

        subgraph services["Services"]
            Mediator["MediatR"]
            Validation["FluentValidation"]
            Mapping["Mapster"]
            Excel["ClosedXML"]
        end

        subgraph data["Data Access"]
            Marten["Marten DocumentSession"]
        end
    end

    subgraph database["Database"]
        PostgreSQL[("PostgreSQL<br/>CatalogDb")]
    end

    Client --> Gateway
    Gateway --> Controller
    Controller --> Mediator
    Mediator --> commands
    Mediator --> queries
    commands --> CmdHandlers
    queries --> QryHandlers
    CmdHandlers --> Validation
    CmdHandlers --> Marten
    QryHandlers --> Marten
    Marten --> PostgreSQL
    CmdHandlers --> Mapping
    QryHandlers --> Mapping
    CmdHandlers --> Excel
    QryHandlers --> Excel
```

## Structure des Dossiers

```
Catalog.API/
├── Controllers/
│   └── ProductsController.cs
├── Features/
│   └── Products/
│       ├── Commands/
│       │   ├── CreateProduct/
│       │   │   ├── CreateProductCommand.cs
│       │   │   ├── CreateProductHandler.cs
│       │   │   └── CreateProductValidator.cs
│       │   ├── UpdateProduct/
│       │   ├── DeleteProduct/
│       │   └── ImportProducts/
│       └── Queries/
│           ├── GetProducts/
│           ├── GetProductById/
│           ├── GetProductsByCategory/
│           └── ExportProducts/
├── Models/
│   └── Product.cs
├── Data/
│   └── CatalogInitialData.cs
├── Extensions/
│   └── ServiceCollectionExtensions.cs
├── Program.cs
├── Dockerfile
└── appsettings.json
```

## Composants Principaux

### ProductsController

Point d'entree HTTP pour toutes les operations sur les produits.

```csharp
[ApiController]
[Route("[controller]")]
public class ProductsController : ControllerBase
{
    private readonly ISender _sender;

    // GET /products
    // GET /products/{id}
    // GET /products/category/{category}
    // POST /products
    // PUT /products/{id}
    // DELETE /products/{id}
    // POST /products/import
    // GET /products/export
}
```

### Modele Product

```csharp
public class Product
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string ImageFile { get; set; } = string.Empty;
    public List<string> Categories { get; set; } = [];
}
```

## Commands et Handlers

### CreateProductCommand

```mermaid
flowchart LR
    subgraph request["Request"]
        Cmd["CreateProductCommand"]
    end

    subgraph pipeline["MediatR Pipeline"]
        Val["ValidationBehavior"]
        Log["LoggingBehavior"]
    end

    subgraph handler["Handler"]
        H["CreateProductHandler"]
    end

    subgraph result["Result"]
        R["CreateProductResult"]
    end

    Cmd --> Log --> Val --> H --> R
```

| Propriete   | Type         | Requis | Validation |
| ----------- | ------------ | ------ | ---------- |
| Name        | string       | Oui    | Non vide   |
| Description | string       | Non    | -          |
| Price       | decimal      | Oui    | > 0        |
| ImageFile   | string       | Non    | -          |
| Categories  | List<string> | Non    | -          |

### UpdateProductCommand

| Propriete   | Type         | Requis | Validation       |
| ----------- | ------------ | ------ | ---------------- |
| Id          | Guid         | Oui    | Produit existant |
| Name        | string       | Oui    | Non vide         |
| Description | string       | Non    | -                |
| Price       | decimal      | Oui    | > 0              |
| ImageFile   | string       | Non    | -                |
| Categories  | List<string> | Non    | -                |

### DeleteProductCommand

| Propriete | Type | Requis | Validation       |
| --------- | ---- | ------ | ---------------- |
| Id        | Guid | Oui    | Produit existant |

### ImportProductsCommand

| Propriete | Type      | Requis | Validation   |
| --------- | --------- | ------ | ------------ |
| File      | IFormFile | Oui    | .xlsx valide |

## Queries et Handlers

### GetProductsQuery

| Propriete  | Type | Defaut |
| ---------- | ---- | ------ |
| PageNumber | int  | 1      |
| PageSize   | int  | 10     |

**Resultat** : `PaginatedResult<ProductDto>`

### GetProductByIdQuery

| Propriete | Type | Requis |
| --------- | ---- | ------ |
| Id        | Guid | Oui    |

**Resultat** : `ProductDto` ou `NotFoundException`

### GetProductsByCategoryQuery

| Propriete | Type   | Requis |
| --------- | ------ | ------ |
| Category  | string | Oui    |

**Resultat** : `IEnumerable<ProductDto>`

### ExportProductsQuery

Aucun parametre requis.

**Resultat** : `byte[]` (fichier Excel)

## Integration avec Marten

```mermaid
flowchart TB
    subgraph api["Catalog.API"]
        Handler["Handler"]
    end

    subgraph marten["Marten"]
        Session["IDocumentSession"]
        Store["DocumentStore"]
    end

    subgraph postgres["PostgreSQL"]
        Table["mt_doc_product"]
    end

    Handler -->|Store/Load| Session
    Session -->|Query/Save| Store
    Store -->|SQL| Table
```

### Operations Marten

| Operation | Methode                          | Description         |
| --------- | -------------------------------- | ------------------- |
| Create    | `session.Store(product)`         | Insere un document  |
| Read      | `session.LoadAsync<Product>(id)` | Charge par ID       |
| Query     | `session.Query<Product>()`       | Requete LINQ        |
| Update    | `session.Store(product)`         | Met a jour (upsert) |
| Delete    | `session.Delete<Product>(id)`    | Supprime            |
| Save      | `session.SaveChangesAsync()`     | Commit transaction  |

## Dependances

```mermaid
flowchart TB
    subgraph catalog["Catalog.API"]
        API["Catalog.API"]
    end

    subgraph deps["Dependencies"]
        BB["BuildingBlocks"]
        Marten["Marten"]
        MediatR["MediatR"]
        FluentVal["FluentValidation"]
        Mapster["Mapster"]
        ClosedXML["ClosedXML"]
        HealthChecks["HealthChecks.NpgSql"]
    end

    API --> BB
    API --> Marten
    API --> MediatR
    API --> FluentVal
    API --> Mapster
    API --> ClosedXML
    API --> HealthChecks
```

## Configuration

### appsettings.json

```json
{
  "ConnectionStrings": {
    "CatalogConnection": "Server=...;Database=CatalogDb;..."
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information"
    }
  }
}
```

### Program.cs (Services)

```csharp
// Marten
builder.Services.AddMarten(options =>
{
    options.Connection(connectionString);
}).UseLightweightSessions();

// MediatR + Behaviors
builder.Services.AddMediatR(cfg =>
    cfg.RegisterServicesFromAssembly(typeof(Program).Assembly));

// FluentValidation
builder.Services.AddValidatorsFromAssembly(typeof(Program).Assembly);

// Health Checks
builder.Services.AddHealthChecks()
    .AddNpgSql(connectionString);
```
