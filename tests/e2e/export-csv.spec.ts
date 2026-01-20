import { test, expect } from '@playwright/test';
import * as fs from 'fs';

// Nettoyer localStorage avant chaque test pour isoler les tests
test.beforeEach(async ({ page }) => {
  // Aller sur la page pour avoir accès au localStorage
  await page.goto('/');
  
  // Nettoyer la base de données SQLite stockée dans localStorage
  await page.evaluate(() => {
    localStorage.removeItem('pluvio_db');
  });
  
  // Recharger pour réinitialiser l'application avec une base vide
  await page.reload();
  
  // Attendre que l'application soit chargée (le formulaire est visible)
  // sql.js peut prendre du temps à charger depuis le CDN
  await expect(page.locator('.rainfall-form')).toBeVisible({ timeout: 45000 });
});

test.describe('Export CSV', () => {
  
  test('E2E-CSV-001: should export rainfall data to CSV with correct filename', async ({ page }) => {
    // Arrange - Ajouter des données de test
    await page.fill('#date', '2026-01-15');
    await page.fill('#amount', '5.5');
    await page.click('button[type="submit"]');
    
    // Attendre que la donnée apparaisse dans le tableau
    await expect(page.locator('.rainfall-table')).toContainText('5.5 mm', { timeout: 15000 });
    
    // Act - Cliquer sur export
    const downloadPromise = page.waitForEvent('download');
    await page.click('button.export-button');
    const download = await downloadPromise;
    
    // Assert - Vérifier le nom du fichier
    const filename = download.suggestedFilename();
    expect(filename).toMatch(/^pluvio-export-\d{4}-\d{2}-\d{2}\.csv$/);
  });

  test('E2E-CSV-001b: should export CSV containing the data', async ({ page }) => {
    // Arrange - Ajouter des données de test
    await page.fill('#date', '2026-01-18');
    await page.fill('#amount', '12.5');
    await page.click('button[type="submit"]');
    
    // Attendre que la donnée apparaisse dans le tableau
    await expect(page.locator('.rainfall-table')).toContainText('12.5 mm', { timeout: 15000 });
    
    // Act - Cliquer sur export
    const downloadPromise = page.waitForEvent('download');
    await page.click('button.export-button');
    const download = await downloadPromise;
    
    // Assert - Vérifier le contenu du fichier
    const filePath = await download.path();
    if (filePath) {
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toContain('Date;Quantité (mm);Localisation;Notes');
      expect(content).toContain('2026-01-18;12.5');
    }
  });

  test('E2E-CSV-002: should export empty CSV with headers only when no data', async ({ page }) => {
    // Act - Cliquer sur export sans données
    const downloadPromise = page.waitForEvent('download');
    await page.click('button.export-button');
    const download = await downloadPromise;
    
    // Assert - Vérifier le contenu du fichier
    const filePath = await download.path();
    if (filePath) {
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toContain('Date;Quantité (mm);Localisation;Notes');
      
      // Vérifier qu'il n'y a que les en-têtes (après le BOM)
      const lines = content.split('\n').filter(line => line.trim() !== '');
      expect(lines.length).toBe(1); // Seulement les en-têtes
    }
  });

  test('E2E-CSV-003: should generate CSV with UTF-8 BOM for Excel compatibility', async ({ page }) => {
    // Arrange - Ajouter des données
    await page.fill('#date', '2026-01-18');
    await page.fill('#amount', '10');
    await page.click('button[type="submit"]');
    
    // Attendre que la donnée apparaisse dans le tableau
    await expect(page.locator('.rainfall-table')).toContainText('10', { timeout: 15000 });
    
    // Act
    const downloadPromise = page.waitForEvent('download');
    await page.click('button.export-button');
    const download = await downloadPromise;
    
    // Assert - Vérifier le BOM UTF-8
    const filePath = await download.path();
    if (filePath) {
      const content = fs.readFileSync(filePath, 'utf-8');
      // Le BOM UTF-8 est \uFEFF (caractère invisible au début)
      expect(content.charCodeAt(0)).toBe(0xFEFF);
    }
  });

  test('should display export button', async ({ page }) => {
    // Assert
    const exportButton = page.locator('button.export-button');
    await expect(exportButton).toBeVisible();
    await expect(exportButton).toContainText('Exporter CSV');
  });

  test('should have export button enabled', async ({ page }) => {
    // Assert
    const exportButton = page.locator('button.export-button');
    await expect(exportButton).toBeEnabled();
  });

  test('should export multiple entries correctly', async ({ page }) => {
    // Arrange - Ajouter plusieurs entrées
    const entries = [
      { date: '2026-01-15', amount: '5.5' },
      { date: '2026-01-16', amount: '0' },
      { date: '2026-01-17', amount: '12.3' },
    ];
    
    for (const entry of entries) {
      await page.fill('#date', entry.date);
      await page.fill('#amount', entry.amount);
      await page.click('button[type="submit"]');
      // Attendre que la donnée apparaisse
      const expectedAmount = entry.amount === '0' ? '0.0' : entry.amount;
      await expect(page.locator('.rainfall-table')).toContainText(`${expectedAmount} mm`, { timeout: 15000 });
    }
    
    // Act
    const downloadPromise = page.waitForEvent('download');
    await page.click('button.export-button');
    const download = await downloadPromise;
    
    // Assert
    const filePath = await download.path();
    if (filePath) {
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Vérifier que toutes les entrées sont présentes
      for (const entry of entries) {
        expect(content).toContain(entry.date);
      }
      
      // Vérifier le nombre de lignes (en-têtes + 3 entrées)
      const lines = content.split('\n').filter(line => line.trim() !== '');
      expect(lines.length).toBe(4);
    }
  });
});
