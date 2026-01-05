# 🚚 LogistiMa - Smart Delivery Dispatch System

> Système de dispatching intelligent pour livraison express à Casablanca

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-336791)
![Redis](https://img.shields.io/badge/Redis-7+-red)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED)

## 📋 Table des Matières

- [Description](#-description)
- [Stack Technique](#-stack-technique)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Docker](#-docker)
- [API Endpoints](#-api-endpoints)
- [Tests](#-tests)
- [Déploiement](#-déploiement)

## 📖 Description

LogistiMa est un moteur de dispatching haute performance conçu pour gérer des milliers de colis lors des pics de commande (Ramadan, Black Friday). Le système implémente :

- **Smart Dispatcher** : Attribution intelligente des colis aux livreurs avec gestion de la concurrence
- **Job Queues** : Traitement asynchrone via BullMQ (calcul d'itinéraires, génération de reçus)
- **Caching Redis** : Mise en cache des zones géographiques avec invalidation automatique
- **Architecture résiliente** : Fonctionne même si le worker est hors ligne

## 🛠 Stack Technique

| Composant | Technologie |
|-----------|-------------|
| Runtime | Node.js + Express.js (TypeScript) |
| Database | PostgreSQL + Sequelize ORM |
| Cache & Broker | Redis + BullMQ |
| Conteneurisation | Docker & Docker Compose |
| Tests | Jest + Supertest |
| CI/CD | GitHub Actions |

## 🏗 Architecture

```
┌─────────────────┐     ┌─────────────────┐
│   Client API    │────▶│   Express API   │
└─────────────────┘     └────────┬────────┘
                                 │
                    ┌────────────┼────────────┐
                    ▼            ▼            ▼
             ┌──────────┐ ┌──────────┐ ┌──────────┐
             │ PostgreSQL│ │  Redis   │ │  Redis   │
             │    DB     │ │  Cache   │ │  Queue   │
             └──────────┘ └──────────┘ └────┬─────┘
                                            │
                                     ┌──────▼─────┐
                                     │   Worker   │
                                     │  (BullMQ)  │
                                     └────────────┘
```

## 🚀 Installation

### Prérequis

- Node.js 18+
- pnpm 8+
- Docker & Docker Compose
- Git

### Installation locale

```bash
# Cloner le repository
git clone https://github.com/your-username/logistima.git
cd logistima

# Installer les dépendances
pnpm install

# Copier le fichier d'environnement
cp .env.example .env

# Démarrer avec Docker
pnpm docker:up
```

## ⚙️ Configuration

Créez un fichier `.env` à la racine du projet :

```env
# Server
NODE_ENV=development
PORT=3000

# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=logistima
DB_USER=postgres
DB_PASSWORD=postgres

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
```

## 🐳 Docker

### Démarrer tous les services

```bash
# Build et démarrage
pnpm docker:up

# En arrière-plan
docker-compose up -d

# Voir les logs
pnpm docker:logs
```

### Services disponibles

| Service | Port | Description |
|---------|------|-------------|
| api | 3000 | API Express |
| postgres | 5432 | Base de données |
| redis | 6379 | Cache & Message Broker |
| worker | - | Processeur de jobs BullMQ |

## 📡 API Endpoints

### Colis

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/colis` | Créer un colis |
| GET | `/api/colis` | Lister les colis |
| GET | `/api/colis/:id` | Détails d'un colis |
| POST | `/api/colis/:id/dispatch` | Dispatcher un colis |

### Livreurs

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/livreurs` | Créer un livreur |
| GET | `/api/livreurs` | Lister les livreurs |
| PATCH | `/api/livreurs/:id/status` | Changer le statut |

### Zones

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/zones` | Lister les zones (cached) |
| POST | `/api/zones` | Créer une zone |

## 🧪 Tests

```bash
# Lancer tous les tests
pnpm test

# Avec couverture
pnpm test -- --coverage

# Mode watch
pnpm test -- --watch
```

### Test de Stress

```bash
# Envoyer 50 requêtes simultanées
for i in {1..50}; do
  curl -X POST http://localhost:3000/api/colis/1/dispatch &
done
```

## 🌐 Déploiement

L'API est déployée sur : `https://logistima.railway.app` (exemple)

### Plateformes supportées

- Railway
- Render
- Fly.io

## 📁 Structure du Projet

```
LogistiMa/
├── backend/
│   ├── src/
│   │   ├── config/         # Configuration DB & Redis
│   │   ├── models/         # Modèles Sequelize
│   │   ├── routes/         # Routes Express
│   │   ├── services/       # Logique métier
│   │   ├── queues/         # Jobs BullMQ
│   │   ├── workers/        # Processeurs de jobs
│   │   └── tests/          # Tests Jest
│   ├── Dockerfile
│   └── package.json
├── mobile/                 # React Native App
├── docs/
│   └── uml/               # Diagrammes UML
├── docker-compose.yml
└── README.md
```

## 👥 Équipe

- Développeur 1
- Développeur 2

## 📄 License

ISC
