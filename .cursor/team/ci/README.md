# Agent d'Intégration/CI

## Responsabilités

1. **Exécuter les tests** : Lancer automatiquement tous les tests après chaque livraison
2. **Vérifier la couverture** : S'assurer que la couverture reste ≥80%
3. **Corriger les échecs** : Identifier et corriger les problèmes de tests ou de couverture
4. **Générer les rapports** : Créer et conserver les rapports de test et de couverture

## Workflow

### Après Chaque Livraison de Code

1. **Exécuter les tests** :
   - Tests unitaires
   - Tests d'intégration
   - Tests E2E

2. **Vérifier les résultats** :
   - Tous les tests doivent passer
   - Aucun test ne doit échouer

3. **Vérifier la couverture** :
   - Couverture globale ≥80%
   - Couverture des zones critiques ≥90%

4. **Générer les rapports** :
   - Rapport de tests dans `reports/test-report-[date].md`
   - Rapport de couverture dans `reports/coverage-report-[date].md`

5. **Si échec** :
   - Identifier la cause
   - Corriger le code ou les tests
   - Réexécuter jusqu'à ce que tout passe

## Types de Tests à Exécuter

### Tests Unitaires
```bash
# Commande à exécuter
npm run test:unit
# ou
yarn test:unit
```

### Tests d'Intégration
```bash
npm run test:integration
```

### Tests E2E
```bash
npm run test:e2e
```

### Tous les Tests
```bash
npm run test
```

## Vérification de Couverture

### Commande
```bash
npm run test:coverage
```

### Objectifs
- **Minimum** : 80% de couverture globale
- **Cible** : 90% de couverture globale
- **Critique** : 100% pour les zones critiques (validation, règles métier)

### Rapport de Couverture

Le rapport doit inclure :
- Couverture globale (%)
- Couverture par fichier
- Lignes non couvertes
- Branches non couvertes
- Fonctions non couvertes

## Format des Rapports

### Rapport de Tests

```markdown
# Rapport de Tests - [Date]

## Résumé
- Tests exécutés : [nombre]
- Tests réussis : [nombre]
- Tests échoués : [nombre]
- Durée : [temps]

## Détails des Échecs
[Si applicable]

## Actions Correctives
[Si applicable]
```

### Rapport de Couverture

```markdown
# Rapport de Couverture - [Date]

## Résumé
- Couverture globale : [%]
- Objectif : ≥80%
- Statut : [✅ Atteint | ❌ Non atteint]

## Détails par Fichier
[Tableau ou liste]

## Zones à Améliorer
[Liste des fichiers avec faible couverture]
```

## Actions Correctives

### Si Tests Échouent

1. **Identifier la cause** :
   - Test mal écrit ?
   - Bug dans le code ?
   - Problème de configuration ?

2. **Corriger** :
   - Si bug : Corriger le code
   - Si test : Corriger le test
   - Si config : Ajuster la configuration

3. **Réexécuter** : Vérifier que tout passe

### Si Couverture Insuffisante

1. **Identifier les zones non couvertes**
2. **Ajouter des tests** pour ces zones
3. **Vérifier** que la couverture augmente

## Automatisation

### CI/CD Pipeline (à configurer)

```yaml
# Exemple de configuration CI
steps:
  - name: Run Tests
    run: npm run test
  
  - name: Check Coverage
    run: npm run test:coverage
  
  - name: Generate Reports
    run: npm run generate-reports
```

## Communication

- Consulter `team-log.md` pour l'historique
- Consulter `../qa/tests/` pour comprendre les tests
- Informer l'équipe via `team-log.md` des résultats
- Alerter en cas de problème récurrent

## Checklist

- [ ] Tous les tests passent
- [ ] Couverture ≥80%
- [ ] Rapports générés
- [ ] Problèmes identifiés et corrigés
- [ ] Team-log mis à jour
