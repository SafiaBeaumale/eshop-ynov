# Architecture Decision Records (ADR)

Ce dossier contient les Architecture Decision Records (ADR) du projet eShop. Les ADRs documentent les decisions architecturales importantes prises au cours du developpement du projet.

## Qu'est-ce qu'un ADR ?

Un ADR est un document court qui capture une decision architecturale importante ainsi que son contexte et ses consequences. Chaque ADR decrit une decision unique et son impact sur le systeme.

## Liste des ADRs

| ID                                          | Titre                                   | Statut  | Date |
| ------------------------------------------- | --------------------------------------- | ------- | ---- |
| [ADR-001](001-yarp-gateway.md)              | YARP comme API Gateway                  | Accepte | 2026 |
| [ADR-002](002-cqrs-mediatr.md)              | CQRS avec MediatR                       | Accepte | 2026 |
| [ADR-003](003-event-driven-rabbitmq.md)     | Architecture Event-Driven avec RabbitMQ | Accepte | 2026 |
| [ADR-004](004-database-per-service.md)      | Base de donnees par service             | Accepte | 2026 |
| [ADR-005](005-docker-containerization.md)   | Conteneurisation Docker                 | Accepte | 2026 |
| [ADR-006](006-microservice-monolithique.md) | Microservices vs Monolithique           | Accepte | 2026 |
| [ADR-007](007-closedxml-epplus.md)          | ClosedXML pour Excel                    | Accepte | 2026 |

## Resume des Decisions

### Infrastructure & Deployment

- **ADR-001** : Utilisation de YARP (Yet Another Reverse Proxy) comme API Gateway pour centraliser les appels clients
- **ADR-005** : Conteneurisation de tous les services avec Docker et orchestration via Docker Compose
- **ADR-006** : Architecture microservices choisie plutot qu'une approche monolithique

### Patterns Architecturaux

- **ADR-002** : Implementation du pattern CQRS (Command Query Responsibility Segregation) avec MediatR
- **ADR-003** : Communication asynchrone entre services via RabbitMQ (Event-Driven Architecture)
- **ADR-004** : Isolation des donnees avec une base de donnees par service

### Choix Techniques

- **ADR-007** : Utilisation de ClosedXML (open-source) au lieu d'EPPlus pour l'import/export Excel

## Structure d'un ADR

Chaque ADR suit le template suivant :

```markdown
## ADR - [Titre]

### Contexte

Description du probleme ou du besoin

### Options considerees

Liste des alternatives evaluees

### Decision

La decision prise et sa justification

### Consequences

Impact de la decision (positif et negatif)

### Diagrammes (optionnel)

Schemas Mermaid illustrant la decision
```

## Comment ajouter un nouvel ADR

1. Creer un nouveau fichier avec le format `XXX-titre-court.md`
2. Suivre le template ci-dessus
3. Mettre a jour ce README avec le nouvel ADR
