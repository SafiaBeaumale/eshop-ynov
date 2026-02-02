# Configuration de l'Environnement - eShop

## Prerequis

### Logiciels Requis

| Logiciel       | Version Minimale | Usage                    |
| -------------- | ---------------- | ------------------------ |
| .NET SDK       | 9.0              | Compilation et execution |
| Docker Desktop | 4.x              | Conteneurisation         |
| Docker Compose | 2.x              | Orchestration            |
| Git            | 2.x              | Gestion de version       |
| IDE            | Rider            | Developpement            |

## Structure des Fichiers de Configuration

```
src/
├── .env                      # Variables d'environnement
├── compose.yaml              # Configuration Docker base
├── compose.override.yaml     # Overrides developpement
└── eshop.services/
    ├── catalog/
    │   └── Catalog.API/
    │       └── appsettings.json
    └── basket/
        └── Basket.API/
            └── appsettings.json
```

## Variables d'Environnement

### Fichier .env

```env
# PostgreSQL Configuration - Catalog
CATALOG_POSTGRES_PORT=5432
CATALOG_POSTGRES_DB=CatalogDb
CATALOG_POSTGRES_USER=CatalogAdmin
CATALOG_POSTGRES_PASSWORD=xxx
CATALOG_API_PORT=6060

# PostgreSQL Configuration - Basket
BASKET_POSTGRES_PORT=5433
BASKET_POSTGRES_DB=BasketDb
BASKET_POSTGRES_USER=BasketAdmin
BASKET_POSTGRES_PASSWORD=xxx
BASKET_API_PORT=6061
BASKET_REDIS_PORT=6379
```

### Description des Variables

| Variable                  | Description             | Valeur par defaut |
| ------------------------- | ----------------------- | ----------------- |
| CATALOG_POSTGRES_PORT     | Port PostgreSQL Catalog | 5432              |
| CATALOG_POSTGRES_DB       | Nom de la base Catalog  | CatalogDb         |
| CATALOG_POSTGRES_USER     | Utilisateur PostgreSQL  | CatalogAdmin      |
| CATALOG_POSTGRES_PASSWORD | Mot de passe PostgreSQL | xxx               |
| CATALOG_API_PORT          | Port de l'API Catalog   | 6060              |
| BASKET_POSTGRES_PORT      | Port PostgreSQL Basket  | 5433              |
| BASKET_POSTGRES_DB        | Nom de la base Basket   | BasketDb          |
| BASKET_POSTGRES_USER      | Utilisateur PostgreSQL  | BasketAdmin       |
| BASKET_POSTGRES_PASSWORD  | Mot de passe PostgreSQL | xxx               |
| BASKET_API_PORT           | Port de l'API Basket    | 6061              |
| BASKET_REDIS_PORT         | Port Redis              | 6379              |

## Installation

### 1. Cloner le Repository

```bash
git clone <repository-url>
cd eshop-ynov
```

### 2. Configurer les Variables d'Environnement

```bash
cd src
# Verifier que le fichier .env existe
cat .env
```

### 3. Demarrer les Services

```bash
# Construire et demarrer tous les services
docker-compose up -d --build

# Verifier le statut
docker-compose ps
```

### 4. Verifier les Health Checks

```bash
# Catalog API
curl http://localhost:6060/health

# Basket API
curl http://localhost:6061/health
```

## Configuration des Services

### Catalog.API - appsettings.json

```json
{
  "ConnectionStrings": {
    "CatalogConnection": "Server=catalog.database;Port=5432;Database=CatalogDb;Username=CatalogAdmin;Password=Pass1234!"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  }
}
```

### Basket.API - appsettings.json

```json
{
  "ConnectionStrings": {
    "BasketConnection": "Server=basket.database;Port=5432;Database=BasketDb;Username=BasketAdmin;Password=Pass5678!",
    "RedisConnection": "basket.redis:6379"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  }
}
```

## Chaines de Connexion

### PostgreSQL (Marten)

```
Server=<host>;Port=<port>;Database=<db>;Username=<user>;Password=<password>
```

| Parametre | Description                       |
| --------- | --------------------------------- |
| Server    | Nom d'hote ou adresse IP          |
| Port      | Port PostgreSQL (5432 par defaut) |
| Database  | Nom de la base de donnees         |
| Username  | Nom d'utilisateur                 |
| Password  | Mot de passe                      |

### Redis

```
<host>:<port>
```

| Parametre | Description                  |
| --------- | ---------------------------- |
| host      | Nom d'hote Redis             |
| port      | Port Redis (6379 par defaut) |

## Ports Utilises

| Service          | Port Local | Port Conteneur | Protocol   |
| ---------------- | ---------- | -------------- | ---------- |
| Catalog.API      | 6060       | 6060           | HTTP       |
| Catalog.Database | 5432       | 5432           | PostgreSQL |
| Basket.API       | 6061       | 6061           | HTTP       |
| Basket.Database  | 5433       | 5432           | PostgreSQL |
| Basket.Redis     | 6379       | 6379           | Redis      |

## Developpement Local (Sans Docker)

### 1. Installer les Dependances

```bash
cd src
dotnet restore eshop.solution.sln
```

### 2. Demarrer PostgreSQL et Redis Manuellement

```bash
# PostgreSQL Catalog
docker run -d --name catalog_db \
  -e POSTGRES_USER=CatalogAdmin \
  -e POSTGRES_PASSWORD=Pass1234! \
  -e POSTGRES_DB=CatalogDb \
  -p 5432:5432 \
  postgres:latest

# PostgreSQL Basket
docker run -d --name basket_db \
  -e POSTGRES_USER=BasketAdmin \
  -e POSTGRES_PASSWORD=Pass5678! \
  -e POSTGRES_DB=BasketDb \
  -p 5433:5432 \
  postgres:latest

# Redis
docker run -d --name basket_redis \
  -p 6379:6379 \
  redis:latest
```

### 3. Lancer les APIs

```bash
# Catalog API
cd src/eshop.services/catalog/Catalog.API
dotnet run

# Basket API (nouveau terminal)
cd src/eshop.services/basket/Basket.API
dotnet run
```

## Troubleshooting

### Probleme de Connexion PostgreSQL

```bash
# Verifier que le conteneur est en cours d'execution
docker ps | grep postgres

# Verifier les logs
docker logs catalog_database

# Tester la connexion
docker exec -it catalog_database psql -U CatalogAdmin -d CatalogDb
```

### Probleme de Connexion Redis

```bash
# Verifier le conteneur
docker ps | grep redis

# Tester la connexion
docker exec -it basket_redis redis-cli ping
```

### Reset Complet

```bash
# Arreter et supprimer tout
docker-compose down -v

# Supprimer les images
docker-compose down --rmi all

# Redemarrer proprement
docker-compose up -d --build
```
