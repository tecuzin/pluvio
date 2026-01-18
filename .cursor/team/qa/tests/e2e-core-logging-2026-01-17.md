# Tests E2E : Saisie Quotidienne et Visualisation de Pluviométrie

**Date de création** : 2026-01-17  
**Fonctionnalité** : `feature-core-logging-2026-01-17.mdc`  
**Couverture minimale attendue** : ≥80%

## Scénarios Utilisateurs

### Scénario 1 : Saisir une nouvelle mesure de pluie

**Description** : L'utilisateur peut saisir une date et une quantité de pluie, et voir la mesure apparaître dans le tableau et le graphique.

**Préconditions** :
- L'application est lancée
- La base de données est accessible (créée si nécessaire)
- Aucune donnée existante (état initial)

**Étapes** :
1. L'utilisateur ouvre l'application
2. L'utilisateur voit le formulaire de saisie
3. L'utilisateur sélectionne une date (par défaut : date du jour)
4. L'utilisateur saisit "12.5" dans le champ quantité
5. L'utilisateur clique sur le bouton "Enregistrer" ou "Valider"
6. Un message de confirmation s'affiche
7. Le tableau se met à jour avec la nouvelle mesure
8. Le graphique se met à jour avec le nouveau point

**Résultat attendu** :
- La mesure est enregistrée en base SQLite
- Le tableau affiche une ligne avec la date et "12.5 mm"
- Le graphique affiche un point à la date correspondante avec valeur 12.5
- Un message de succès s'affiche

**Critères d'acceptation** :
- [ ] Le formulaire est visible et fonctionnel
- [ ] La date par défaut est la date du jour
- [ ] La saisie de 12.5 mm est acceptée
- [ ] Le bouton de validation fonctionne
- [ ] La donnée est persistée en base SQLite
- [ ] Le tableau se met à jour automatiquement
- [ ] Le graphique se met à jour automatiquement
- [ ] Un message de confirmation s'affiche

**Test automatisé** :
```typescript
import { test, expect } from '@playwright/test';

test('should save a new rainfall entry and display it in table and chart', async ({ page }) => {
  // Arrange
  await page.goto('/');
  
  // Act
  const dateInput = page.getByLabel('Date');
  const amountInput = page.getByLabel(/quantité|amount/i);
  const submitButton = page.getByRole('button', { name: /enregistrer|valider|save/i });
  
  const today = new Date().toISOString().split('T')[0];
  await dateInput.fill(today);
  await amountInput.fill('12.5');
  await submitButton.click();
  
  // Assert
  await expect(page.getByText(/enregistré|succès|success/i)).toBeVisible();
  await expect(page.getByText('12.5')).toBeVisible();
  await expect(page.getByText(today)).toBeVisible();
  
  // Vérifier que la donnée est en base (via API ou vérification directe)
  // Vérifier que le graphique contient le point
});
```

### Scénario 2 : Consulter l'historique des mesures

**Description** : L'utilisateur peut voir toutes les mesures enregistrées dans un tableau trié par date.

**Préconditions** :
- L'application est lancée
- Au moins 3 mesures sont enregistrées avec des dates différentes

**Étapes** :
1. L'utilisateur ouvre l'application
2. L'utilisateur consulte le tableau des saisies
3. Le tableau affiche toutes les mesures

**Résultat attendu** :
- Le tableau affiche toutes les mesures
- Les mesures sont triées par date décroissante (plus récentes en premier)
- Chaque ligne affiche la date et la quantité en mm
- Les dates sont formatées de manière lisible

**Critères d'acceptation** :
- [ ] Le tableau est visible
- [ ] Toutes les mesures sont affichées
- [ ] Le tri est par date décroissante
- [ ] Les dates sont formatées correctement
- [ ] Les quantités sont affichées avec l'unité (mm)

**Test automatisé** :
```typescript
test('should display all rainfall entries sorted by date descending', async ({ page }) => {
  // Arrange - créer des données de test
  // (via API ou directement en base)
  const entries = [
    { date: '2026-01-15', amount: 5.2 },
    { date: '2026-01-17', amount: 12.5 },
    { date: '2026-01-16', amount: 8.0 },
  ];
  
  // Act
  await page.goto('/');
  const table = page.locator('table, [role="table"]');
  
  // Assert
  await expect(table).toBeVisible();
  const rows = table.locator('tbody tr, [role="row"]');
  await expect(rows).toHaveCount(3);
  
  // Vérifier l'ordre (plus récent en premier)
  const firstRow = rows.first();
  await expect(firstRow).toContainText('2026-01-17');
  await expect(firstRow).toContainText('12.5');
});
```

### Scénario 3 : Visualiser les données sur un graphique

**Description** : L'utilisateur peut voir l'évolution de la pluviométrie sur un graphique.

**Préconditions** :
- L'application est lancée
- Au moins 5 mesures sont enregistrées avec des dates différentes

**Étapes** :
1. L'utilisateur ouvre l'application
2. L'utilisateur consulte la section graphique
3. Le graphique affiche l'évolution de la pluviométrie

**Résultat attendu** :
- Le graphique est visible
- L'axe X représente les dates
- L'axe Y représente les quantités en mm
- Tous les points sont visibles
- Les axes sont clairement labellés

**Critères d'acceptation** :
- [ ] Le graphique est visible
- [ ] L'axe X est labellé (dates)
- [ ] L'axe Y est labellé (mm ou millimètres)
- [ ] Tous les points de données sont affichés
- [ ] Le graphique est lisible

**Test automatisé** :
```typescript
test('should display rainfall data on a chart with labeled axes', async ({ page }) => {
  // Arrange - créer des données de test
  const entries = [
    { date: '2026-01-13', amount: 3.0 },
    { date: '2026-01-14', amount: 5.5 },
    { date: '2026-01-15', amount: 8.2 },
    { date: '2026-01-16', amount: 0 },
    { date: '2026-01-17', amount: 12.5 },
  ];
  
  // Act
  await page.goto('/');
  const chart = page.locator('[data-testid="rainfall-chart"], canvas, svg');
  
  // Assert
  await expect(chart).toBeVisible();
  await expect(page.getByText(/date/i)).toBeVisible(); // Label axe X
  await expect(page.getByText(/mm|millimètre/i)).toBeVisible(); // Label axe Y
});
```

### Scénario 4 : Saisir une mesure pour une date passée

**Description** : L'utilisateur peut enregistrer une mesure pour une date antérieure.

**Préconditions** :
- L'application est lancée

**Étapes** :
1. L'utilisateur ouvre le formulaire
2. L'utilisateur modifie la date pour sélectionner une date passée (ex: il y a 3 jours)
3. L'utilisateur saisit une quantité (ex: 7.5 mm)
4. L'utilisateur valide

**Résultat attendu** :
- La mesure est enregistrée avec la date sélectionnée
- Le tableau se met à jour
- La mesure apparaît à la bonne position chronologique dans le tableau
- Le graphique se met à jour

**Critères d'acceptation** :
- [ ] La date peut être modifiée dans le formulaire
- [ ] Une date passée est acceptée
- [ ] La mesure est enregistrée avec la date correcte
- [ ] Le tableau affiche la mesure à la bonne position

**Test automatisé** :
```typescript
test('should save rainfall entry for a past date', async ({ page }) => {
  // Arrange
  await page.goto('/');
  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - 3);
  const pastDateStr = pastDate.toISOString().split('T')[0];
  
  // Act
  const dateInput = page.getByLabel('Date');
  await dateInput.fill(pastDateStr);
  await page.getByLabel(/quantité/i).fill('7.5');
  await page.getByRole('button', { name: /enregistrer|valider/i }).click();
  
  // Assert
  await expect(page.getByText(/enregistré|succès/i)).toBeVisible();
  await expect(page.getByText(pastDateStr)).toBeVisible();
  await expect(page.getByText('7.5')).toBeVisible();
});
```

### Scénario 5 : Saisir 0 mm de pluie (jour sans pluie)

**Description** : L'utilisateur peut enregistrer 0 mm pour indiquer un jour sans pluie.

**Préconditions** :
- L'application est lancée

**Étapes** :
1. L'utilisateur ouvre le formulaire
2. L'utilisateur saisit une date
3. L'utilisateur saisit "0" dans le champ quantité (ou laisse 0 par défaut)
4. L'utilisateur valide

**Résultat attendu** :
- La mesure 0 mm est enregistrée
- Elle apparaît dans le tableau
- Elle apparaît sur le graphique (point à 0)

**Critères d'acceptation** :
- [ ] La valeur 0 est acceptée
- [ ] La mesure 0 mm est enregistrée
- [ ] Elle apparaît dans le tableau
- [ ] Elle apparaît sur le graphique

**Test automatisé** :
```typescript
test('should save 0 mm rainfall entry', async ({ page }) => {
  // Arrange
  await page.goto('/');
  const today = new Date().toISOString().split('T')[0];
  
  // Act
  await page.getByLabel('Date').fill(today);
  await page.getByLabel(/quantité/i).fill('0');
  await page.getByRole('button', { name: /enregistrer|valider/i }).click();
  
  // Assert
  await expect(page.getByText(/enregistré|succès/i)).toBeVisible();
  await expect(page.getByText('0')).toBeVisible();
  await expect(page.getByText('0 mm')).toBeVisible();
});
```

### Scénario 6 : Validation - Quantité négative rejetée

**Description** : Le système rejette les quantités négatives.

**Préconditions** :
- L'application est lancée

**Étapes** :
1. L'utilisateur ouvre le formulaire
2. L'utilisateur saisit une date
3. L'utilisateur saisit "-5" dans le champ quantité
4. L'utilisateur tente de valider

**Résultat attendu** :
- La validation échoue
- Un message d'erreur s'affiche
- La mesure n'est pas enregistrée

**Critères d'acceptation** :
- [ ] La valeur négative est rejetée
- [ ] Un message d'erreur clair s'affiche
- [ ] La mesure n'est pas enregistrée
- [ ] Le formulaire reste rempli (sauf la quantité)

**Test automatisé** :
```typescript
test('should reject negative rainfall amount', async ({ page }) => {
  // Arrange
  await page.goto('/');
  const today = new Date().toISOString().split('T')[0];
  
  // Act
  await page.getByLabel('Date').fill(today);
  await page.getByLabel(/quantité/i).fill('-5');
  await page.getByRole('button', { name: /enregistrer|valider/i }).click();
  
  // Assert
  await expect(page.getByText(/négatif|positif|>= 0|erreur/i)).toBeVisible();
  // Vérifier que rien n'a été enregistré
});
```

### Scénario 7 : Validation - Date invalide rejetée

**Description** : Le système rejette les dates invalides.

**Préconditions** :
- L'application est lancée

**Étapes** :
1. L'utilisateur ouvre le formulaire
2. L'utilisateur saisit une date invalide (ex: "2026-13-45")
3. L'utilisateur saisit une quantité
4. L'utilisateur tente de valider

**Résultat attendu** :
- La validation échoue
- Un message d'erreur s'affiche
- La mesure n'est pas enregistrée

**Critères d'acceptation** :
- [ ] La date invalide est rejetée
- [ ] Un message d'erreur clair s'affiche
- [ ] La mesure n'est pas enregistrée

**Test automatisé** :
```typescript
test('should reject invalid date', async ({ page }) => {
  // Arrange
  await page.goto('/');
  
  // Act
  await page.getByLabel('Date').fill('2026-13-45');
  await page.getByLabel(/quantité/i).fill('10');
  await page.getByRole('button', { name: /enregistrer|valider/i }).click();
  
  // Assert
  await expect(page.getByText(/date invalide|date valide|erreur/i)).toBeVisible();
});
```

### Scénario 8 : Affichage quand aucune donnée

**Description** : L'application affiche un message approprié quand aucune mesure n'existe.

**Préconditions** :
- L'application est lancée
- Aucune mesure n'est enregistrée (base vide)

**Étapes** :
1. L'utilisateur ouvre l'application
2. L'utilisateur consulte le tableau
3. L'utilisateur consulte le graphique

**Résultat attendu** :
- Le tableau affiche un message "Aucune donnée" ou similaire
- Le graphique affiche un message "Aucune donnée" ou reste vide avec un message

**Critères d'acceptation** :
- [ ] Un message informatif s'affiche dans le tableau
- [ ] Un message informatif s'affiche pour le graphique
- [ ] L'interface reste utilisable

**Test automatisé** :
```typescript
test('should display empty state when no data exists', async ({ page }) => {
  // Arrange - s'assurer que la base est vide
  await page.goto('/');
  
  // Assert
  await expect(page.getByText(/aucune donnée|no data|vide/i)).toBeVisible();
});
```

## Tests d'Intégration

### Test d'Intégration 1 : Persistance des données

**Description** : Vérifier que les données sont bien persistées en base SQLite et récupérées après rechargement.

**Composants impliqués** :
- SQLiteRainfallRepository
- LogRainfallUseCase
- GetRainfallEntriesUseCase

**Test** :
```typescript
test('should persist data in SQLite and retrieve after reload', async ({ page }) => {
  // Arrange
  await page.goto('/');
  const today = new Date().toISOString().split('T')[0];
  
  // Act - Enregistrer une mesure
  await page.getByLabel('Date').fill(today);
  await page.getByLabel(/quantité/i).fill('15.3');
  await page.getByRole('button', { name: /enregistrer/i }).click();
  
  // Recharger la page
  await page.reload();
  
  // Assert - Vérifier que la donnée est toujours là
  await expect(page.getByText('15.3')).toBeVisible();
  await expect(page.getByText(today)).toBeVisible();
});
```

## Tests de Validation

### Validation 1 : Règles métier pour les quantités

**Règle métier** : La quantité doit être >= 0 et < 1000 mm

**Cas de test** :
- [ ] Cas valide : 0 mm → Accepté
- [ ] Cas valide : 12.5 mm → Accepté
- [ ] Cas valide : 999.9 mm → Accepté
- [ ] Cas invalide : -1 mm → Rejeté avec message d'erreur
- [ ] Cas invalide : 1001 mm → Rejeté avec message d'erreur (valeur suspecte)

**Test** :
```typescript
test.each([
  { amount: 0, shouldPass: true },
  { amount: 12.5, shouldPass: true },
  { amount: 999.9, shouldPass: true },
  { amount: -1, shouldPass: false },
  { amount: 1001, shouldPass: false },
])('should validate amount $amount', async ({ page, amount, shouldPass }) => {
  await page.goto('/');
  const today = new Date().toISOString().split('T')[0];
  
  await page.getByLabel('Date').fill(today);
  await page.getByLabel(/quantité/i).fill(amount.toString());
  await page.getByRole('button', { name: /enregistrer/i }).click();
  
  if (shouldPass) {
    await expect(page.getByText(/enregistré|succès/i)).toBeVisible();
  } else {
    await expect(page.getByText(/erreur|invalide/i)).toBeVisible();
  }
});
```

### Validation 2 : Règles métier pour les dates

**Règle métier** : La date doit être valide et pas trop dans le futur

**Cas de test** :
- [ ] Cas valide : Date passée → Accepté
- [ ] Cas valide : Date aujourd'hui → Accepté
- [ ] Cas valide : Date demain → Accepté (tolérance)
- [ ] Cas invalide : Date invalide (2026-13-45) → Rejeté
- [ ] Cas invalide : Date trop dans le futur (> 1 jour) → Rejeté

## Tests de Performance

### Performance 1 : Temps de chargement

**Métrique** : Temps de chargement de la page avec 100 enregistrements
**Objectif** : < 2 secondes
**Test** :
```typescript
test('should load page with 100 entries in less than 2 seconds', async ({ page }) => {
  // Arrange - créer 100 enregistrements
  // ...
  
  const startTime = Date.now();
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  const loadTime = Date.now() - startTime;
  
  expect(loadTime).toBeLessThan(2000);
});
```

## Tests de Cas Limites

### Cas limite 1 : Doublon de date

**Description** : Que se passe-t-il si on essaie d'enregistrer deux mesures pour la même date ?

**Test** :
```typescript
test('should handle duplicate date entry', async ({ page }) => {
  // Arrange - enregistrer une première mesure
  const today = new Date().toISOString().split('T')[0];
  await page.goto('/');
  await page.getByLabel('Date').fill(today);
  await page.getByLabel(/quantité/i).fill('10');
  await page.getByRole('button', { name: /enregistrer/i }).click();
  
  // Act - essayer d'enregistrer une deuxième mesure pour la même date
  await page.getByLabel('Date').fill(today);
  await page.getByLabel(/quantité/i).fill('15');
  await page.getByRole('button', { name: /enregistrer/i }).click();
  
  // Assert - selon la règle métier (remplacer ou rejeter)
  // Option 1 : Remplacer
  // Option 2 : Rejeter avec message
});
```

## Couverture de Code

### Zones à Couvrir

- [ ] `RainfallEntry` entity - Priorité : high
- [ ] `RainfallValidator` - Priorité : high
- [ ] `IRainfallRepository` interface - Priorité : high
- [ ] `SQLiteRainfallRepository` - Priorité : high
- [ ] `LogRainfallUseCase` - Priorité : high
- [ ] `GetRainfallEntriesUseCase` - Priorité : high
- [ ] `RainfallForm` component - Priorité : high
- [ ] `RainfallTable` component - Priorité : medium
- [ ] `RainfallChart` component - Priorité : medium
- [ ] Initialisation de la base SQLite - Priorité : high

### Objectif de Couverture

- **Minimum** : 80%
- **Cible** : 90%
- **Zones critiques** : 100% (validation, entités, use cases)

## Plan de Test

| Test ID | Description | Type | Priorité | Statut |
|---------|-------------|------|----------|--------|
| E2E-001 | Saisir une nouvelle mesure | E2E | High | [ ] |
| E2E-002 | Consulter l'historique | E2E | High | [ ] |
| E2E-003 | Visualiser le graphique | E2E | High | [ ] |
| E2E-004 | Saisir pour date passée | E2E | Medium | [ ] |
| E2E-005 | Saisir 0 mm | E2E | Medium | [ ] |
| E2E-006 | Rejeter quantité négative | E2E | High | [ ] |
| E2E-007 | Rejeter date invalide | E2E | High | [ ] |
| E2E-008 | Affichage état vide | E2E | Medium | [ ] |
| INT-001 | Persistance des données | Intégration | High | [ ] |
| VAL-001 | Validation quantités | Validation | High | [ ] |
| VAL-002 | Validation dates | Validation | High | [ ] |
| PERF-001 | Performance chargement | Performance | Medium | [ ] |
| LIMIT-001 | Gestion doublons | Cas limite | Medium | [ ] |

## Notes

- Les tests E2E utilisent Playwright
- Les tests d'intégration peuvent utiliser Jest avec mocks de SQLite
- La base de données de test doit être isolée (fichier séparé ou en mémoire)
- Les tests doivent être indépendants (nettoyer la base avant chaque test)
