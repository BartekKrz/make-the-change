const { chromium } = require('@playwright/test');

async function debugTanStackForm() {
  console.log('🚀 Starting TanStack Form debug session...');

  const browser = await chromium.launch({
    headless: false, // Voir ce qui se passe
    slowMo: 1000 // Ralentir pour mieux observer
  });

  const context = await browser.newContext();
  const page = await context.newPage();

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

  try {
    // Naviguer vers la page produit
    console.log('📍 Navigating to product page...');
    await page.goto('http://localhost:3001/fr/admin/products/953f55f8-5b9b-4d56-a61d-51df85930fb9');

    // Attendre que la page se charge
    console.log('⏳ Waiting for page to load...');
    await page.waitForSelector('input[type="text"]', { timeout: 10000 });

    // Trouver le champ nom du produit
    console.log('🔍 Looking for product name field...');
    const nameField = await page.locator('input[type="text"]').first();

    // Vérifier que le champ existe
    const fieldExists = await nameField.count() > 0;
    console.log(`📝 Name field found: ${fieldExists}`);

    if (fieldExists) {
      // Obtenir la valeur actuelle
      const currentValue = await nameField.inputValue();
      console.log(`📝 Current value: "${currentValue}"`);

      // Modifier le nom du produit
      console.log('✏️ Modifying product name...');
      await nameField.fill(currentValue + ' - MODIFIÉ');

      // Attendre un peu pour voir l'auto-save
      console.log('⏳ Waiting for auto-save (3 seconds)...');
      await page.waitForTimeout(3000);

      // Obtenir l'état du formulaire depuis la console
      console.log('📊 Checking form state...');
      const formState = await page.evaluate(() => {
        // Essayer d'accéder aux variables globales de debug
        return {
          timestamp: new Date().toISOString(),
          url: window.location.href
        };
      });

      console.log('📊 Form State:', formState);
    }

  } catch (error) {
    console.error('❌ Error during test:', error);
  }

  console.log('⏸️ Keeping browser open for manual inspection...');
  console.log('Press Ctrl+C to close');

  // Garder le navigateur ouvert pour inspection manuelle
  await new Promise(() => {}); // Infinite wait
}

// Exécuter le debug
debugTanStackForm().catch(console.error);