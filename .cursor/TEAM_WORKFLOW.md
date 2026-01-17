# Workflow d'Équipe - Pluvio

## Vue d'Ensemble

Ce document décrit le workflow complet de l'équipe pour le développement de nouvelles fonctionnalités.

## Flux de Travail

```
┌─────────────────────────────────────────────────────────────┐
│  1. Product Manager                                         │
│     → Crée rules.mdc avec besoins et critères d'acceptation │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  2. Architecte                                              │
│     → Met à jour architecture.mdc                          │
│     → Valide la cohérence et l'évolutivité                  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  3. QA/Testeur                                              │
│     → Analyse rules.mdc                                     │
│     → Rédige tests E2E impératifs                           │
│     → Définit couverture minimale (≥80%)                    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  4. Développeur                                             │
│     → Implémente en TDD (Rouge-Vert-Refactor)              │
│     → Code motivé par les tests E2E                         │
│     → Respecte conventions et architecture                  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  5. Agent CI                                                │
│     → Exécute tous les tests                                │
│     → Vérifie couverture ≥80%                               │
│     → Corrige si échecs                                     │
│     → Génère rapports                                       │
└─────────────────────────────────────────────────────────────┘
```

## Étapes Détaillées

### 1. Product Manager

**Input** : Demande utilisateur ou besoin métier  
**Output** : Fichier `rules.mdc` dans `.cursor/team/product-manager/features/`

**Actions** :
- Analyser la demande
- Rédiger un fichier `rules.mdc` complet avec :
  - Description de la fonctionnalité
  - Objectifs métier
  - Cas d'usage détaillés
  - Contraintes
  - Critères d'acceptation
  - Métriques de succès
- Mettre à jour `team-log.md`

**Template** : `.cursor/team/product-manager/template-feature.mdc`

### 2. Architecte

**Input** : Fichier `rules.mdc` du Product Manager  
**Output** : Mise à jour de `architecture.mdc`

**Actions** :
- Analyser l'impact sur l'architecture
- Proposer des solutions architecturales
- Mettre à jour `architecture.mdc` si nécessaire
- Valider la cohérence et l'évolutivité
- Mettre à jour `team-log.md`

### 3. QA/Testeur

**Input** : Fichier `rules.mdc` du Product Manager  
**Output** : Fichier de tests E2E dans `.cursor/team/qa/tests/`

**Actions** :
- Analyser le `rules.mdc`
- Rédiger les tests E2E impératifs
- Définir les scénarios utilisateurs
- Créer les tests d'intégration
- Spécifier la couverture minimale (≥80%)
- Mettre à jour `team-log.md`

**Template** : `.cursor/team/qa/template-e2e-tests.md`

### 4. Développeur

**Input** : 
- Fichier `rules.mdc` du Product Manager
- Fichier de tests E2E du QA
- `architecture.mdc` de l'Architecte

**Output** : Code implémenté et tests passants

**Actions** :
- Lire les règles et tests
- Implémenter en TDD (Rouge-Vert-Refactor)
- Respecter l'architecture
- Respecter les conventions
- Documenter les décisions dans `implementations/`
- Mettre à jour `team-log.md`

### 5. Agent CI

**Input** : Code livré par le Développeur  
**Output** : Rapports de tests et de couverture

**Actions** :
- Exécuter tous les tests (unitaires, intégration, E2E)
- Vérifier que tous les tests passent
- Vérifier que la couverture ≥80%
- Si échec : identifier et corriger
- Générer les rapports dans `reports/`
- Mettre à jour `team-log.md`

## Conventions de Nommage

### Fichiers de Fonctionnalités
- Product Manager : `feature-[nom]-[date].mdc`
- QA : `e2e-[feature-name]-[date].md`
- Developer : `impl-[feature]-[date].md`
- CI : `test-report-[date].md`, `coverage-report-[date].md`

### Format des Dates
- Format : `YYYY-MM-DD` (ex: `2024-01-15`)

## Communication

### Journal d'Équipe (`team-log.md`)

Chaque agent doit mettre à jour le journal avec :
- Date et heure
- Agent concerné
- Sujet
- Contexte
- Décision/Action
- Impact
- Références

### Format Standard

```markdown
## [Date] - [Agent] - [Sujet]

**Contexte :**
[Description]

**Décision/Action :**
[Ce qui a été fait]

**Impact :**
[Impact sur le projet]

**Références :**
- [Lien vers fichier]
```

## Traçabilité

Tous les fichiers doivent être :
- **Horodatés** : Date de création et modifications
- **Référencés** : Liens vers les fichiers connexes
- **Versionnés** : Historique des changements

## Revues et Amélioration Continue

### Revues Régulières

- Analyser le `team-log.md` pour identifier les problèmes
- Ajuster les processus si nécessaire
- Améliorer les templates et conventions
- Partager les bonnes pratiques

### Métriques à Suivre

- Temps de cycle (de la demande à la livraison)
- Taux de réussite des tests
- Couverture de code
- Nombre de bugs détectés en production
- Satisfaction de l'équipe

## Outils et Ressources

### Fichiers de Référence

- `.cursor/rules/` : Règles générales du projet
- `.cursor/team/architect/architecture.mdc` : Architecture
- `.cursor/team/product-manager/template-feature.mdc` : Template de fonctionnalité
- `.cursor/team/qa/template-e2e-tests.md` : Template de tests
- `.cursor/team-log.md` : Journal d'équipe

### Documentation par Agent

- `.cursor/team/product-manager/README.md`
- `.cursor/team/architect/README.md`
- `.cursor/team/qa/README.md`
- `.cursor/team/developer/README.md`
- `.cursor/team/ci/README.md`
