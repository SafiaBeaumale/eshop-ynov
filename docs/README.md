# 📚 Documentation eShop - Architecture & UML

Bienvenue dans la documentation complète de la solution eShop. Cette documentation couvre tous les aspects architecturaux, les diagrammes UML et les décisions techniques.

## 🎯 Vue d'Ensemble

La solution eShop est une architecture microservices moderne construite avec .NET 9, démontrant les patterns CQRS, DDD et Event-Driven Architecture.

## 📋 Table des Matières

### 🏗️ Architecture

- [📖 Vue d'Ensemble](architecture/overview.md)
- [🧩 Diagrammes de Composants](architecture/components.md)
- [🔄 Flux de Données](architecture/data-flow.md)
- [📊 Matrice de Dépendances](architecture/dependencies.md)

### 🚀 Services

#### 🗂️ Catalog Service

- [📋 Cas d'Usage](services/catalog/use-cases.md)
- [🔄 Diagrammes de Séquence](services/catalog/sequence-diagrams.md)
- [🧩 Architecture de Composants](services/catalog/components.md)

#### 🛒 Basket Service

- [📋 Cas d'Usage](services/basket/use-cases.md)
- [🔄 Diagrammes de Séquence](services/basket/sequence-diagrams.md)
- [🧩 Architecture de Composants](services/basket/components.md)

#### 📦 Ordering Service

- [📋 Cas d'Usage](services/ordering/use-cases.md)
- [🔄 Diagrammes de Séquence](services/ordering/sequence-diagrams.md)
- [🧩 Architecture de Composants](services/ordering/components.md)

#### 💰 Discount Service

- [📋 Cas d'Usage](services/discount/use-cases.md)
- [🔄 Diagrammes de Séquence](services/discount/sequence-diagrams.md)
- [🧩 Architecture de Composants](services/discount/components.md)

#### 🚪 API Gateway

- [📋 Cas d'Usage](services/gateway/use-cases.md)
- [🔄 Diagrammes de Séquence](services/gateway/sequence-diagrams.md)
- [🧩 Architecture de Composants](services/gateway/components.md)

### 📋 Architecture Decision Records (ADRs)

- [📑 Index des ADRs](adr/README.md)
- [ADR-001: Choix de YARP comme API Gateway](adr/001-yarp-gateway.md)
- [ADR-002: CQRS avec MediatR](adr/002-cqrs-mediatr.md)
- [ADR-003: Event-Driven Architecture avec RabbitMQ](adr/003-event-driven-rabbitmq.md)
- [ADR-004: Stratégie Database per Service](adr/004-database-per-service.md)
- [ADR-005: Containerisation avec Docker](adr/005-docker-containerization.md)

### 🚀 Déploiement

- [🐳 Configuration Docker Compose](deployment/docker-compose.md)
- [⚙️ Configuration Environnement](deployment/environment-setup.md)
- [📊 Monitoring et Observabilité](deployment/monitoring.md)

## 🎯 Comment Utiliser Cette Documentation

1. **Débutants** : Commencez par la [Vue d'Ensemble](architecture/overview.md)
2. **Développeurs** : Consultez les diagrammes de séquence de chaque service
3. **Architectes** : Explorez les ADRs pour comprendre les décisions techniques
4. **DevOps** : Référez-vous aux guides de déploiement

## 🤝 Contribution

Pour contribuer à cette documentation :

1. Fork le repository
2. Créez une branche pour vos modifications
3. Respectez le format Mermaid pour les diagrammes
4. Ajoutez des exemples concrets
5. Soumettez une Pull Request

## 📊 Diagrammes

Tous les diagrammes sont créés avec [Mermaid](https://mermaid.js.org/) pour faciliter :

- La maintenance
- L'intégration Git
- Le rendu dans GitHub/GitLab
- L'export vers d'autres formats

## 📞 Support

Pour toute question sur cette documentation :

- Ouvrez une [Issue](https://github.com/SafiaBeaumale/eshop-ynov/issues)
- Consultez les [Discussions](https://github.com/SafiaBeaumale/eshop-ynov/discussions)
- Contactez l'équipe architecture

---

**📝 Dernière mise à jour** : 2025-09-18
**📋 Version** : 1.0  
**👥 Mainteneurs** : Équipe Architecture eShop
