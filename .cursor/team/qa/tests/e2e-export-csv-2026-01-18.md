# Tests E2E : Export CSV

**Date de création** : 2026-01-18  
**Fonctionnalité** : `.cursor/team/product-manager/features/feature-export-csv-2026-01-18.mdc`  
**Couverture minimale attendue** : ≥80%

## Scénarios Utilisateurs

### Scénario 1 : Export avec données existantes

**Description** : L'utilisateur exporte les données de pluviométrie au format CSV

**Préconditions** :
- L'application est chargée
- Des enregistrements de pluviométrie existent (au moins 2)

**Étapes** :
1. Naviguer vers la page principale
2. Vérifier que le bouton "Exporter CSV" est visible
3. Cliquer sur le bouton "Exporter CSV"
4. Vérifier que le fichier est téléchargé

**Résultat attendu** :
- Un fichier CSV est téléchargé
- Le nom du fichier contient `pluvio-export-` et la date du jour
- Le fichier contient les en-têtes et les données

**Critères d'acceptation** :
- [ ] Le bouton "Exporter CSV" est visible
- [ ] Le clic déclenche un téléchargement
- [ ] Le fichier contient les données attendues

**Test automatisé** :
```typescript
test('should export rainfall data to CSV', async ({ page }) => {
  // Arrange - Ajouter des données de test
  await page.fill('input[type="date"]', '2026-01-15');
  await page.fill('input[type="number"]', '5.5');
  await page.click('button[type="submit"]');
  
  // Act - Cliquer sur export
  const downloadPromise = page.waitForEvent('download');
  await page.click('button:has-text("Exporter CSV")');
  const download = await downloadPromise;
  
  // Assert
  expect(download.suggestedFilename()).toMatch(/pluvio-export-\d{4}-\d{2}-\d{2}\.csv/);
});
```

### Scénario 2 : Export sans données

**Description** : L'utilisateur exporte quand aucune donnée n'existe

**Préconditions** :
- L'application est chargée
- Aucun enregistrement n'existe

**Étapes** :
1. Naviguer vers la page principale (sans données)
2. Cliquer sur le bouton "Exporter CSV"
3. Vérifier que le fichier est téléchargé

**Résultat attendu** :
- Un fichier CSV est téléchargé
- Le fichier contient uniquement les en-têtes

**Critères d'acceptation** :
- [ ] Le bouton fonctionne même sans données
- [ ] Le fichier contient les en-têtes

**Test automatisé** :
```typescript
test('should export empty CSV with headers only', async ({ page }) => {
  // Arrange - S'assurer qu'il n'y a pas de données
  // (application fraîchement chargée)
  
  // Act
  const downloadPromise = page.waitForEvent('download');
  await page.click('button:has-text("Exporter CSV")');
  const download = await downloadPromise;
  
  // Assert
  const content = await download.path().then(p => fs.readFileSync(p, 'utf-8'));
  expect(content).toContain('Date;Quantité (mm);Localisation;Notes');
});
```

### Scénario 3 : Vérification du format CSV

**Description** : Vérifier que le format du fichier CSV est correct

**Préconditions** :
- Des données existent dans l'application

**Étapes** :
1. Ajouter une entrée avec tous les champs remplis
2. Exporter en CSV
3. Vérifier le contenu du fichier

**Résultat attendu** :
- Séparateur : point-virgule (;)
- Encodage : UTF-8 avec BOM
- Colonnes : Date, Quantité (mm), Localisation, Notes

**Test automatisé** :
```typescript
test('should generate CSV with correct format', async ({ page }) => {
  // Arrange
  await page.fill('input[type="date"]', '2026-01-18');
  await page.fill('input[type="number"]', '12.5');
  await page.fill('input[placeholder*="localisation"]', 'Paris');
  await page.click('button[type="submit"]');
  
  // Act
  const downloadPromise = page.waitForEvent('download');
  await page.click('button:has-text("Exporter CSV")');
  const download = await downloadPromise;
  
  // Assert
  const content = await download.path().then(p => fs.readFileSync(p, 'utf-8'));
  expect(content.charCodeAt(0)).toBe(0xFEFF); // BOM UTF-8
  expect(content).toContain('Date;Quantité (mm);Localisation;Notes');
  expect(content).toContain('2026-01-18;12.5;Paris;');
});
```

## Tests d'Intégration

### Test d'Intégration 1 : ExportRainfallToCsvUseCase

**Description** : Vérifier que le use case génère correctement le CSV

**Composants impliqués** :
- `ExportRainfallToCsvUseCase`
- `GetRainfallEntriesUseCase`
- `IRainfallRepository`

**Test** :
```typescript
describe('ExportRainfallToCsvUseCase', () => {
  it('should generate CSV content from entries', async () => {
    // Arrange
    const mockRepository = {
      findAll: jest.fn().mockResolvedValue([
        { id: '1', date: '2026-01-15', amount: 5.5, location: 'Paris', notes: 'Test' }
      ])
    };
    const useCase = new ExportRainfallToCsvUseCase(mockRepository);
    
    // Act
    const csv = await useCase.execute();
    
    // Assert
    expect(csv).toContain('\uFEFF'); // BOM
    expect(csv).toContain('Date;Quantité (mm);Localisation;Notes');
    expect(csv).toContain('2026-01-15;5.5;Paris;Test');
  });
});
```

**Résultat attendu** : Le CSV est correctement formaté avec BOM et séparateurs

## Tests de Validation

### Validation 1 : Format du nom de fichier

**Règle métier** : Le nom du fichier doit être `pluvio-export-YYYY-MM-DD.csv`

**Cas de test** :
- [ ] Cas valide : Le nom contient la date du jour au format ISO
- [ ] Cas valide : L'extension est `.csv`

**Test** :
```typescript
test('filename should follow naming convention', () => {
  const filename = generateExportFilename();
  expect(filename).toMatch(/^pluvio-export-\d{4}-\d{2}-\d{2}\.csv$/);
});
```

### Validation 2 : Encodage UTF-8 avec BOM

**Règle métier** : Le fichier doit commencer par le BOM UTF-8 pour compatibilité Excel

**Cas de test** :
- [ ] Cas valide : Le fichier commence par `\uFEFF`

**Test** :
```typescript
test('CSV should start with UTF-8 BOM', () => {
  const csv = generateCsvContent([]);
  expect(csv.charCodeAt(0)).toBe(0xFEFF);
});
```

## Tests de Cas Limites

### Cas limite 1 : Données avec caractères spéciaux

**Description** : Les notes peuvent contenir des caractères spéciaux (accents, guillemets)

**Test** :
```typescript
test('should handle special characters in notes', async () => {
  const entries = [
    { id: '1', date: '2026-01-18', amount: 5, notes: 'Pluie "forte" avec éclairs' }
  ];
  const csv = generateCsvContent(entries);
  expect(csv).toContain('"Pluie ""forte"" avec éclairs"');
});
```

**Résultat attendu** : Les guillemets sont échappés et les accents préservés

### Cas limite 2 : Données avec points-virgules

**Description** : Les champs contenant des points-virgules doivent être entre guillemets

**Test** :
```typescript
test('should escape semicolons in fields', async () => {
  const entries = [
    { id: '1', date: '2026-01-18', amount: 5, location: 'Paris; France' }
  ];
  const csv = generateCsvContent(entries);
  expect(csv).toContain('"Paris; France"');
});
```

**Résultat attendu** : Le champ est encadré par des guillemets

## Couverture de Code

### Zones à Couvrir

- [ ] `ExportRainfallToCsvUseCase.execute()` - Priorité : high
- [ ] Fonction de génération du nom de fichier - Priorité : medium
- [ ] Fonction d'échappement CSV - Priorité : high
- [ ] Composant bouton d'export - Priorité : high

### Objectif de Couverture

- **Minimum** : 80%
- **Cible** : 90%
- **Zones critiques** : 100% (génération CSV, échappement)

## Plan de Test

| Test ID | Description | Type | Priorité | Statut |
|---------|-------------|------|----------|--------|
| E2E-001 | Export avec données | E2E | High | [ ] |
| E2E-002 | Export sans données | E2E | Medium | [ ] |
| E2E-003 | Vérification format CSV | E2E | High | [ ] |
| INT-001 | ExportRainfallToCsvUseCase | Intégration | High | [ ] |
| VAL-001 | Format nom de fichier | Validation | Medium | [ ] |
| VAL-002 | Encodage UTF-8 BOM | Validation | High | [ ] |
| LIM-001 | Caractères spéciaux | Cas limite | Medium | [ ] |
| LIM-002 | Points-virgules dans champs | Cas limite | Medium | [ ] |

## Notes

- Les tests E2E nécessitent Playwright pour intercepter les téléchargements
- L'échappement CSV suit la RFC 4180 avec adaptation pour séparateur point-virgule
- Le BOM UTF-8 est essentiel pour la compatibilité Excel sur Windows
