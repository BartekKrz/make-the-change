import { test, expect } from '@playwright/test';

test('Debug TanStack Form Auto-save', async ({ page }) => {
  console.log('🚀 Starting TanStack Form debug session...');

  // Capturer tous les logs de la console
  page.on('console', (msg) => {
    const type = msg.type();
    const text = msg.text();

    if (text.includes('[Auto-save]') ||
        text.includes('[useProductForm]') ||
        text.includes('[TextField]') ||
        text.includes('DETAILED ERRORS')) {
      console.log(`📋 [${type.toUpperCase()}] ${text}`);
    }
  });

  // Capturer les erreurs
  page.on('pageerror', (error) => {
    console.error('❌ Page Error:', error.message);
  });

  // Naviguer vers la page produit
  console.log('📍 Navigating to product page...');
  await page.goto('http://localhost:3001/fr/admin/products/953f55f8-5b9b-4d56-a61d-51df85930fb9');

  // Attendre que la page se charge
  console.log('⏳ Waiting for page to load...');
  await page.waitForSelector('input[type="text"]', { timeout: 15000 });

  // Attendre un peu plus pour que le formulaire se charge complètement
  await page.waitForTimeout(2000);

  // Trouver le champ nom du produit (premier input text)
  console.log('🔍 Looking for product name field...');
  const nameField = page.locator('input[type="text"]').first();

  // Vérifier que le champ existe
  await expect(nameField).toBeVisible();

  // Obtenir la valeur actuelle
  const currentValue = await nameField.inputValue();
  console.log(`📝 Current value: "${currentValue}"`);

  // Modifier le nom du produit
  console.log('✏️ Modifying product name...');
  const newValue = currentValue + ' - MODIFIÉ PAR PLAYWRIGHT';
  await nameField.fill(newValue);

  // Attendre l'auto-save (debounce de 500ms + temps de traitement)
  console.log('⏳ Waiting for auto-save (3 seconds)...');
  await page.waitForTimeout(3000);

  console.log('✅ Test completed! Check the console logs above for auto-save behavior.');
});