# Monitoring et Observabilite - eShop

## Vue d'Ensemble

L'application eShop implemente plusieurs mecanismes d'observabilite pour surveiller la sante et les performances des services.

## Health Checks

### Endpoints de Sante

| Service     | Endpoint      | Description                   |
| ----------- | ------------- | ----------------------------- |
| Catalog.API | `GET /health` | Verification de sante globale |
| Basket.API  | `GET /health` | Verification de sante globale |

### Implementation

Les health checks sont implementes avec les packages ASP.NET Core Health Checks :

- `AspNetCore.HealthChecks.NpgSql` - Verification PostgreSQL
- `AspNetCore.HealthChecks.Redis` - Verification Redis
- `AspNetCore.HealthChecks.UI.Client` - Interface utilisateur

### Configuration Catalog.API

```csharp
builder.Services.AddHealthChecks()
    .AddNpgSql(connectionString, name: "catalog-db");

app.MapHealthChecks("/health", new HealthCheckOptions
{
    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
});
```

### Configuration Basket.API

```csharp
builder.Services.AddHealthChecks()
    .AddNpgSql(connectionString, name: "basket-db")
    .AddRedis(redisConnection, name: "basket-redis");

app.MapHealthChecks("/health", new HealthCheckOptions
{
    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
});
```

### Reponse Health Check

```json
{
  "status": "Healthy",
  "totalDuration": "00:00:00.0234567",
  "entries": {
    "catalog-db": {
      "status": "Healthy",
      "duration": "00:00:00.0123456"
    }
  }
}
```

## Logging

### Configuration par Defaut

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.EntityFrameworkCore": "Warning"
    }
  }
}
```

### LoggingBehavior (MediatR Pipeline)

Le `LoggingBehavior` dans BuildingBlocks enregistre automatiquement :

- Le debut de chaque requete
- Le temps d'execution
- Les erreurs eventuelles

```csharp
public class LoggingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
{
    public async Task<TResponse> Handle(TRequest request, ...)
    {
        _logger.LogInformation("Handling {RequestName}", typeof(TRequest).Name);
        var response = await next();
        _logger.LogInformation("Handled {RequestName}", typeof(TRequest).Name);
        return response;
    }
}
```

### Niveaux de Log

| Niveau      | Usage                               |
| ----------- | ----------------------------------- |
| Trace       | Details tres fins (debug intensif)  |
| Debug       | Informations de debug               |
| Information | Flux normal de l'application        |
| Warning     | Situations anormales non bloquantes |
| Error       | Erreurs recuperables                |
| Critical    | Erreurs fatales                     |

## Monitoring Docker

### Commandes Utiles

```bash
# Statistiques des conteneurs
docker stats

# Logs en temps reel
docker-compose logs -f

# Logs d'un service specifique
docker-compose logs -f catalog.api

# Inspection d'un conteneur
docker inspect catalog_api
```

### Surveillance des Ressources

```bash
# CPU et Memoire
docker stats --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"

# Espace disque des volumes
docker system df -v
```

## Test des Health Checks

### Via cURL

```bash
# Catalog
curl -s http://localhost:6060/health | jq

# Basket
curl -s http://localhost:6061/health | jq
```

### Via PowerShell

```powershell
# Catalog
Invoke-RestMethod -Uri http://localhost:6060/health | ConvertTo-Json

# Basket
Invoke-RestMethod -Uri http://localhost:6061/health | ConvertTo-Json
```
