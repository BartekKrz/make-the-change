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
        text.includes('DETAILED ERRORS') ||
        text.includes('Error') ||
        text.includes('error')) {
      console.log(`📋 [${type.toUpperCase()}] ${text}`);
    }
  });

  // Capturer les erreurs
  page.on('pageerror', (error) => {
    console.error('❌ Page Error:', error.message);
  });

  // Naviguer vers la page de login d'abord
  console.log('📍 Navigating to login page...');
  await page.goto('http://localhost:3001/fr/admin/login');

  // Vérifier si on est déjà connecté ou si on a besoin de se connecter
  const currentUrl = page.url();
  console.log(`🔍 Current URL: ${currentUrl}`);

  // Si on voit un formulaire de login, se connecter
  if (await page.locator('input[type="email"]').isVisible({ timeout: 3000 })) {
    console.log('🔐 Login form detected, logging in...');
    await page.fill('input[type="email"]', 'krynskibartosz08@gmail.com');
    await page.fill('input[type="password"]', 'BartoszDevReact8');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin/**', { timeout: 10000 });
    console.log('✅ Logged in successfully');
  }

  // Maintenant naviguer vers la page produit
  console.log('📍 Navigating to product page...');
  await page.goto('http://localhost:3001/fr/admin/products/953f55f8-5b9b-4d56-a61d-51df85930fb9');

  // Attendre que la page se charge - essayer plusieurs sélecteurs
  console.log('⏳ Waiting for page to load...');
  try {
    await page.waitForSelector('input[type="text"]', { timeout: 10000 });
  } catch (e) {
    console.log('🔍 No text inputs found, checking for other form elements...');
    // Capturer le HTML de la page pour debug
    const bodyText = await page.locator('body').textContent();
    console.log(`📄 Page contains: ${bodyText?.substring(0, 200)}...`);

    // Essayer d'autres sélecteurs
    await page.waitForSelector('input, textarea, select', { timeout: 5000 });
  }

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