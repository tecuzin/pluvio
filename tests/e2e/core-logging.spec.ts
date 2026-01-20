import { test, expect } from '@playwright/test';

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

test.describe('Core Logging - Saisie et Visualisation', () => {
  
  test('E2E-001: should save a new rainfall entry and display it in table', async ({ page }) => {
    // Arrange
    const today = new Date().toISOString().split('T')[0];
    
    // Act
    await page.fill('#date', today);
    await page.fill('#amount', '12.5');
    await page.click('button[type="submit"]');
    
    // Assert - Donnée visible dans le tableau (attendre que le tableau se mette à jour)
    await expect(page.locator('.rainfall-table')).toContainText('12.5 mm', { timeout: 15000 });
    
    // Assert - Message de succès (peut avoir disparu, on vérifie juste que pas d'erreur)
    await expect(page.locator('.error-message')).not.toBeVisible();
  });

  test('E2E-002: should display all rainfall entries in table', async ({ page }) => {
    // Arrange - Ajouter plusieurs entrées
    const entries = [
      { date: '2026-01-15', amount: '5.2' },
      { date: '2026-01-16', amount: '8.0' },
      { date: '2026-01-17', amount: '12.5' },
    ];
    
    for (const entry of entries) {
      await page.fill('#date', entry.date);
      await page.fill('#amount', entry.amount);
      await page.click('button[type="submit"]');
      // Attendre que la donnée apparaisse dans le tableau
      await expect(page.locator('.rainfall-table')).toContainText(`${entry.amount} mm`, { timeout: 15000 });
    }
    
    // Assert - Toutes les entrées sont visibles
    const table = page.locator('.rainfall-table table');
    await expect(table).toBeVisible();
    
    for (const entry of entries) {
      await expect(page.locator('.rainfall-table')).toContainText(entry.amount);
    }
  });

  test('E2E-003: should display rainfall data on a chart', async ({ page }) => {
    // Arrange - Ajouter des données
    await page.fill('#date', '2026-01-15');
    await page.fill('#amount', '10');
    await page.click('button[type="submit"]');
    
    // Attendre que la donnée apparaisse dans le tableau
    await expect(page.locator('.rainfall-table')).toContainText('10', { timeout: 15000 });
    
    // Assert - Le graphique est visible avec un SVG
    const chart = page.locator('.rainfall-chart');
    await expect(chart).toBeVisible();
    await expect(chart.locator('svg')).toBeVisible();
  });

  test('E2E-004: should save rainfall entry for a past date', async ({ page }) => {
    // Arrange
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 3);
    const pastDateStr = pastDate.toISOString().split('T')[0];
    
    // Act
    await page.fill('#date', pastDateStr);
    await page.fill('#amount', '7.5');
    await page.click('button[type="submit"]');
    
    // Assert - Donnée visible dans le tableau
    await expect(page.locator('.rainfall-table')).toContainText('7.5 mm', { timeout: 15000 });
  });

  test('E2E-005: should save 0 mm rainfall entry', async ({ page }) => {
    // Arrange
    const today = new Date().toISOString().split('T')[0];
    
    // Act
    await page.fill('#date', today);
    await page.fill('#amount', '0');
    await page.click('button[type="submit"]');
    
    // Assert - Donnée visible dans le tableau
    await expect(page.locator('.rainfall-table')).toContainText('0.0 mm', { timeout: 15000 });
  });

  test('E2E-006: should reject negative rainfall amount via HTML5 validation', async ({ page }) => {
    // Arrange
    const today = new Date().toISOString().split('T')[0];
    
    // Act
    await page.fill('#date', today);
    await page.fill('#amount', '-5');
    
    // Le champ a min="0", donc le navigateur devrait empêcher la soumission
    // Vérifier que le champ est invalide
    const amountInput = page.locator('#amount');
    const isValid = await amountInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    
    // Assert - Le champ devrait être invalide
    expect(isValid).toBe(false);
  });

  test('E2E-008: should display empty state when no data exists', async ({ page }) => {
    // Assert - Message d'état vide visible
    await expect(page.locator('.rainfall-table')).toContainText('Aucune donnée');
  });

  test('should persist data after page reload', async ({ page }) => {
    // Arrange
    const today = new Date().toISOString().split('T')[0];
    
    // Act - Enregistrer une mesure
    await page.fill('#date', today);
    await page.fill('#amount', '15.3');
    await page.click('button[type="submit"]');
    
    // Attendre que la donnée apparaisse
    await expect(page.locator('.rainfall-table')).toContainText('15.3 mm', { timeout: 15000 });
    
    // Recharger la page
    await page.reload();
    await expect(page.locator('.rainfall-form')).toBeVisible({ timeout: 45000 });
    
    // Assert - La donnée est toujours là
    await expect(page.locator('.rainfall-table')).toContainText('15.3');
  });

  test('should display form with date defaulting to today', async ({ page }) => {
    // Assert
    const dateInput = page.locator('#date');
    const today = new Date().toISOString().split('T')[0];
    
    await expect(dateInput).toHaveValue(today);
  });

  test('should load the application successfully', async ({ page }) => {
    // On vérifie que l'app se charge correctement
    // Le formulaire et le tableau doivent être visibles
    await expect(page.locator('.rainfall-form')).toBeVisible();
    await expect(page.locator('.rainfall-table')).toBeVisible();
    await expect(page.locator('.rainfall-chart')).toBeVisible();
  });
});
