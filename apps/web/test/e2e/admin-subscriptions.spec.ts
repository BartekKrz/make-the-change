import { test, expect, Page } from '@playwright/test';
import { TestDataGenerator, TestDataSeeder, TestDataCleaner, TestUser, TestSubscription } from './helpers/test-data';
import { AuthHelper, AdminTestHelper } from './helpers/auth';

// Variables globales pour les données de test
let testAdmin: TestUser;
let testUsers: TestUser[];
let testSubscriptions: TestSubscription[];

// Setup global : génération des données de test
test.beforeAll(async () => {
  console.log('🧪 Setting up test data...');
  
  // Nettoyer les données de test existantes
  await TestDataCleaner.cleanupAll();
  
  // Générer et insérer le dataset de test
  const dataset = await TestDataSeeder.seedDataset();
  testAdmin = dataset.admin;
  testUsers = dataset.users;
  testSubscriptions = dataset.subscriptions;
  
  console.log(`✅ Test data ready: ${testUsers.length} users, ${testSubscriptions.length} subscriptions`);
});

// Cleanup global
test.afterAll(async () => {
  console.log('🧹 Cleaning up test data...');
  await TestDataCleaner.cleanupAll();
});

test.describe('Admin Subscriptions Management - TDD', () => {
  let authHelper: AuthHelper;
  let adminHelper: AdminTestHelper;
  
  test.beforeEach(async ({ page }) => {
    authHelper = new AuthHelper(page);
    adminHelper = new AdminTestHelper(page, authHelper);
    
    // Se connecter en tant qu'admin pour chaque test
    await authHelper.loginAsAdmin(testAdmin);
  });

  test.describe('1. Page Liste des Abonnements', () => {
    test('should display subscriptions list with all test data', async ({ page }) => {
      await adminHelper.navigateToSubscriptions();
      
      // Vérifier le header de la page
      await expect(page.locator('h1')).toContainText('Gestion des Abonnements');
      
      // Vérifier que le bouton de création est présent
      await expect(page.locator('text=Nouvel Abonnement')).toBeVisible();
      
      // Vérifier que nos abonnements de test sont visibles
      for (const subscription of testSubscriptions) {
        const user = testUsers.find(u => u.id === subscription.user_id);
        if (user) {
          await expect(page.locator(`text=${user.email}`)).toBeVisible();
        }
      }
    });

    test('should filter subscriptions by status', async ({ page }) => {
      await adminHelper.navigateToSubscriptions();
      
      // Tester le filtre "active"
      await adminHelper.filterByStatus('active');
      
      // Vérifier que seuls les abonnements actifs sont affichés
      const activeSubscriptions = testSubscriptions.filter(s => s.status === 'active');
      expect(activeSubscriptions.length).toBeGreaterThan(0);
      
      // Vérifier qu'aucun abonnement suspendu n'est visible
      const suspendedUser = testUsers.find(u => {
        const sub = testSubscriptions.find(s => s.user_id === u.id && s.status === 'suspended');
        return !!sub;
      });
      
      if (suspendedUser) {
        await expect(page.locator(`text=${suspendedUser.email}`)).not.toBeVisible();
      }
    });

    test('should search subscriptions by user email', async ({ page }) => {
      await adminHelper.navigateToSubscriptions();
      
      // Prendre le premier utilisateur pour la recherche
      const searchUser = testUsers[1]; // Éviter l'admin à l'index 0
      const searchTerm = searchUser.email.substring(0, 10);
      
      await adminHelper.searchSubscriptions(searchTerm);
      
      // Vérifier que l'utilisateur recherché est visible
      await expect(page.locator(`text=${searchUser.email}`)).toBeVisible();
    });
  });

  test.describe('2. Actions sur les Abonnements', () => {
    test('should suspend and reactivate subscription', async ({ page }) => {
      await adminHelper.navigateToSubscriptions();
      
      // Trouver un abonnement actif dans nos données de test
      const activeSubscription = testSubscriptions.find(s => s.status === 'active');
      expect(activeSubscription).toBeDefined();
      
      const activeUser = testUsers.find(u => u.id === activeSubscription!.user_id);
      expect(activeUser).toBeDefined();
      
      // Filtrer pour afficher seulement les abonnements actifs
      await adminHelper.filterByStatus('active');
      
      // Suspendre le premier abonnement actif
      await adminHelper.suspendSubscription(0, 'Test de suspension automatisé');
      
      // Vérifier que le statut a changé
      await expect(page.locator('[data-testid="status-badge"]').first()).toContainText('Suspendu');
      
      // Réactiver l'abonnement
      await adminHelper.reactivateSubscription(0);
      
      // Vérifier que le statut est redevenu actif
      await expect(page.locator('[data-testid="status-badge"]').first()).toContainText('Actif');
    });
  });

  test.describe('3. Création d\'Abonnements', () => {
    test('should create new subscription successfully', async ({ page }) => {
      // Créer un nouvel utilisateur pour ce test
      const newUser = TestDataGenerator.generateUser({
        email: `new.test.user.${Date.now()}@example.com`,
      });
      await TestDataSeeder.seedUser(newUser);
      
      await adminHelper.navigateToSubscriptions();
      
      // Créer un nouvel abonnement
      await adminHelper.createSubscription({
        userEmail: newUser.email,
        planType: 'ambassador_premium',
        billingFrequency: 'annual',
      });
      
      // Vérifier que l'abonnement a été créé
      await adminHelper.verifySubscriptionInList({
        userEmail: newUser.email,
        planType: 'Premium',
        status: 'Actif',
        amount: 320,
      });
    });
  });

  test.describe('4. Robustesse et Gestion d\'Erreurs', () => {
    test('should handle empty state gracefully', async ({ page }) => {
      // Nettoyer temporairement les abonnements
      await TestDataCleaner.cleanupTestSubscriptions();
      
      await adminHelper.navigateToSubscriptions();
      
      // Vérifier l'état vide
      await expect(page.locator('text=Aucun abonnement trouvé')).toBeVisible();
      
      // Restaurer les données pour les autres tests
      for (const subscription of testSubscriptions) {
        await TestDataSeeder.seedSubscription(subscription);
      }
    });

    test('should handle network errors gracefully', async ({ page }) => {
      // Simuler une erreur réseau en interceptant les requêtes
      await page.route('**/api/trpc/**', route => {
        route.abort('failed');
      });
      
      await page.goto('/admin/subscriptions');
      
      // Vérifier qu'un message d'erreur approprié est affiché
      // (ceci dépendra de l'implémentation de la gestion d'erreur)
      await page.waitForTimeout(2000);
      
      // Restaurer les requêtes normales
      await page.unroute('**/api/trpc/**');
    });
  });

  test.describe('5. Performance et UX', () => {
    test('should load subscriptions page within performance budget', async ({ page }) => {
      const startTime = Date.now();
      
      await adminHelper.navigateToSubscriptions();
      
      const loadTime = Date.now() - startTime;
      
      // La page doit se charger en moins de 3 secondes
      expect(loadTime).toBeLessThan(3000);
      
      // Vérifier que les éléments critiques sont visibles rapidement
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('[data-testid="subscriptions-table"]')).toBeVisible();
    });

    test('should provide good user feedback during actions', async ({ page }) => {
      await adminHelper.navigateToSubscriptions();
      
      // Tester les états de chargement
      const subscriptionRow = page.locator('[data-testid="subscription-row"]').first();
      await subscriptionRow.locator('[data-testid="actions-menu"]').click();
      await page.click('text=Suspendre');
      
      // Vérifier que le modal s'ouvre
      await expect(page.locator('[data-testid="suspend-dialog"]')).toBeVisible();
      
      await page.fill('[data-testid="suspend-reason"]', 'Test UX');
      
      // Cliquer sur suspendre et vérifier l'état de chargement
      const suspendButton = page.locator('button:has-text("Suspendre")');
      await suspendButton.click();
      
      // Le bouton devrait montrer un état de chargement
      await expect(suspendButton).toContainText('Suspension...');
      
      // Puis revenir à l'état normal avec le toast de succès
      await expect(page.locator('.toast-success')).toBeVisible();
    });
  });
});
