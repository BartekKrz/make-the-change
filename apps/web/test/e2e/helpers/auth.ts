import { Page, expect } from '@playwright/test';
import { TestUser } from './test-data';

export class AuthHelper {
  constructor(private page: Page) {}

  async loginAsAdmin(admin: TestUser) {
    // Simuler une connexion admin
    // Pour les tests, on peut injecter directement la session dans le localStorage
    await this.page.goto('/');
    
    // Injecter la session admin dans le localStorage/sessionStorage
    await this.page.evaluate((adminData) => {
      const mockSession = {
        access_token: 'mock_admin_token',
        refresh_token: 'mock_refresh_token',
        user: {
          id: adminData.id,
          email: adminData.email,
          email_confirmed_at: new Date().toISOString(),
          user_metadata: {
            first_name: adminData.first_name,
            last_name: adminData.last_name,
          },
        },
      };
      
      localStorage.setItem('supabase.auth.token', JSON.stringify(mockSession));
    }, admin);

    // Recharger la page pour que la session prenne effet
    await this.page.reload();
    
    // Vérifier que l'utilisateur est bien connecté
    await this.page.waitForTimeout(1000); // Attendre que l'auth se charge
  }

  async loginAsUser(user: TestUser) {
    await this.page.goto('/');
    
    await this.page.evaluate((userData) => {
      const mockSession = {
        access_token: 'mock_user_token',
        refresh_token: 'mock_refresh_token',
        user: {
          id: userData.id,
          email: userData.email,
          email_confirmed_at: new Date().toISOString(),
          user_metadata: {
            first_name: userData.first_name,
            last_name: userData.last_name,
          },
        },
      };
      
      localStorage.setItem('supabase.auth.token', JSON.stringify(mockSession));
    }, user);

    await this.page.reload();
    await this.page.waitForTimeout(1000);
  }

  async logout() {
    await this.page.evaluate(() => {
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.clear();
    });
    
    await this.page.reload();
  }

  async ensureAdminAccess() {
    // Vérifier qu'on est sur une page admin
    await expect(this.page).toHaveURL(/\/admin/);
  }
}

// Helper pour les actions courantes dans les tests
export class AdminTestHelper {
  constructor(private page: Page, private auth: AuthHelper) {}

  async navigateToSubscriptions() {
    await this.page.goto('/admin/subscriptions');
    await this.page.waitForLoadState('networkidle');
  }

  async searchSubscriptions(query: string) {
    await this.page.fill('[placeholder="Rechercher par email ou nom..."]', query);
    await this.page.click('text=Rechercher');
    await this.page.waitForLoadState('networkidle');
  }

  async filterByStatus(status: string) {
    await this.page.selectOption('[data-testid="status-filter"]', status);
    await this.page.click('text=Rechercher');
    await this.page.waitForLoadState('networkidle');
  }

  async suspendSubscription(subscriptionRowIndex: number, reason: string) {
    const subscriptionRow = this.page.locator('[data-testid="subscription-row"]').nth(subscriptionRowIndex);
    await subscriptionRow.locator('[data-testid="actions-menu"]').click();
    await this.page.click('text=Suspendre');
    await this.page.fill('[data-testid="suspend-reason"]', reason);
    await this.page.click('button:has-text("Suspendre")');
    
    // Attendre le toast de succès
    await expect(this.page.locator('.toast-success')).toBeVisible();
  }

  async reactivateSubscription(subscriptionRowIndex: number) {
    const subscriptionRow = this.page.locator('[data-testid="subscription-row"]').nth(subscriptionRowIndex);
    await subscriptionRow.locator('[data-testid="actions-menu"]').click();
    await this.page.click('text=Réactiver');
    
    // Attendre le toast de succès
    await expect(this.page.locator('.toast-success')).toBeVisible();
  }

  async createSubscription(userData: {
    userEmail: string;
    planType: 'ambassador_standard' | 'ambassador_premium';
    billingFrequency: 'monthly' | 'annual';
  }) {
    await this.page.click('text=Nouvel Abonnement');
    await expect(this.page).toHaveURL('/admin/subscriptions/new');

    // Sélectionner l'utilisateur (on peut utiliser l'email pour identifier)
    await this.page.selectOption('[data-testid="user-select"]', { label: userData.userEmail });
    await this.page.selectOption('[data-testid="plan-select"]', userData.planType);
    await this.page.selectOption('[data-testid="billing-select"]', userData.billingFrequency);

    await this.page.click('text=Créer l\'abonnement');
    
    // Vérifier la redirection vers le détail
    await expect(this.page).toHaveURL(/\/admin\/subscriptions\/[^\/]+$/);
    await expect(this.page.locator('.toast-success')).toBeVisible();
  }

  async verifySubscriptionInList(subscription: {
    userEmail: string;
    planType: string;
    status: string;
    amount: number;
  }) {
    await this.navigateToSubscriptions();
    
    // Vérifier que l'abonnement apparaît dans la liste
    const subscriptionRow = this.page.locator(`text=${subscription.userEmail}`).locator('..').locator('..');
    await expect(subscriptionRow).toBeVisible();
    await expect(subscriptionRow.locator(`text=${subscription.planType}`)).toBeVisible();
    await expect(subscriptionRow.locator(`text=${subscription.status}`)).toBeVisible();
    await expect(subscriptionRow.locator(`text=€${subscription.amount}`)).toBeVisible();
  }
}
