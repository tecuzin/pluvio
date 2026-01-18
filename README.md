# Pluvio - Suivi de Pluviométrie

Application de logging quotidien de la pluviométrie permettant de suivre et analyser les précipitations.

## Fonctionnalités

- ✅ Saisie quotidienne de pluviométrie (date + quantité en mm)
- ✅ Stockage dans SQLite (via sql.js dans le navigateur)
- ✅ Affichage en tableau des enregistrements
- ✅ Graphique d'évolution de la pluviométrie
- ✅ Validation des données (dates, quantités)

## Technologies

- **Frontend** : React 18 + TypeScript
- **Base de données** : SQLite (sql.js pour le navigateur)
- **Graphiques** : Recharts
- **Build** : Vite
- **Tests** : Jest + React Testing Library + Playwright

## Installation

⚠️ **Ce projet est conçu pour fonctionner dans des containers Docker. Aucune installation sur le système hôte n'est nécessaire (sauf Docker/HyperKit/VirtualBox et Minikube).**

> 💡 **Problème avec Docker ?** Consultez [README-INSTALL.md](README-INSTALL.md) pour les options d'installation.

### Option 1 : Minikube (Recommandé)

```bash
# Configuration et déploiement en production
make minikube-setup

# Ou en mode développement
make minikube-dev
```

Voir [README-DOCKER.md](README-DOCKER.md) pour plus de détails.

### Option 2 : Docker Compose

```bash
# Lancer en mode développement
make docker-compose-up
```

### Option 3 : Docker seul

```bash
# Construire les images
make docker-build

# Lancer en production
make docker-run
```

### Développement local (sans Docker)

Si vous voulez développer localement (non recommandé pour ce projet) :

```bash
# Installer les dépendances
npm install

# Lancer l'application en mode développement
npm run dev

# Lancer les tests unitaires
npm test

# Lancer les tests avec couverture
npm run test:coverage

# Lancer les tests E2E
npm run test:e2e

# Build pour la production
npm run build
```

## Architecture

L'application suit les principes de **Clean Architecture** :

```
src/
├── domain/              # Couche Domain (entités, règles métier)
│   ├── entities/
│   ├── repositories/
│   └── validators/
├── application/         # Couche Application (use cases)
│   └── use-cases/
├── infrastructure/       # Couche Infrastructure (implémentations)
│   ├── repositories/
│   └── services/
└── presentation/        # Couche Presentation (UI)
    └── components/
```

## Structure de la Base de Données

```sql
CREATE TABLE rainfall_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL UNIQUE,
    amount REAL NOT NULL CHECK(amount >= 0),
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

Les données sont stockées dans le `localStorage` du navigateur (base SQLite sérialisée).

## Développement

### Workflow TDD

L'application est développée en suivant le Test Driven Development (TDD) :

1. 🔴 **RED** : Écrire un test qui échoue
2. 🟢 **GREEN** : Écrire le code minimal pour faire passer le test
3. 🔵 **REFACTOR** : Améliorer le code tout en gardant les tests verts

### Tests

- **Tests unitaires** : `tests/unit/`
- **Tests d'intégration** : `tests/integration/`
- **Tests E2E** : `tests/e2e/`

### Couverture de Code

Objectif : ≥80% de couverture

```bash
npm run test:coverage
```

## Licence

MIT
