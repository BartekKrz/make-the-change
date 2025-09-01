import { createClient } from '@supabase/supabase-js';

// Configuration Supabase pour les tests
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const testSupabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Types pour la génération de données
export interface TestUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  user_level?: 'admin' | 'user';
}

export interface TestSubscription {
  id: string;
  user_id: string;
  plan_type: 'ambassador_standard' | 'ambassador_premium';
  billing_frequency: 'monthly' | 'annual';
  status: 'active' | 'cancelled' | 'suspended' | 'past_due';
  amount: number;
  currency: string;
  start_date: string;
  next_billing_date: string;
}

// Générateur de données de test
export class TestDataGenerator {
  static generateUser(overrides: Partial<TestUser> = {}): TestUser {
    const timestamp = Date.now();
    return {
      id: `test_user_${timestamp}_${Math.random().toString(36).substring(7)}`,
      email: `test.user.${timestamp}@example.com`,
      first_name: 'Test',
      last_name: `User${timestamp}`,
      user_level: 'user',
      ...overrides,
    };
  }

  static generateAdmin(overrides: Partial<TestUser> = {}): TestUser {
    return this.generateUser({
      user_level: 'admin',
      email: `admin.test.${Date.now()}@example.com`,
      first_name: 'Admin',
      last_name: 'Test',
      ...overrides,
    });
  }

  static generateSubscription(userId: string, overrides: Partial<TestSubscription> = {}): TestSubscription {
    const timestamp = Date.now();
    const startDate = new Date();
    const nextBillingDate = new Date();
    
    const planType = overrides.plan_type || 'ambassador_standard';
    const billingFrequency = overrides.billing_frequency || 'monthly';
    
    // Calcul des montants selon le plan
    const amounts = {
      ambassador_standard: { monthly: 18, annual: 180 },
      ambassador_premium: { monthly: 32, annual: 320 },
    };
    
    // Calcul de la prochaine facturation
    if (billingFrequency === 'annual') {
      nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
    } else {
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
    }

    return {
      id: `test_sub_${timestamp}_${Math.random().toString(36).substring(7)}`,
      user_id: userId,
      plan_type: planType,
      billing_frequency: billingFrequency,
      status: 'active',
      amount: amounts[planType][billingFrequency],
      currency: 'EUR',
      start_date: startDate.toISOString(),
      next_billing_date: nextBillingDate.toISOString(),
      ...overrides,
    };
  }

  // Générateur de datasets complets
  static async generateSubscriptionDataset() {
    const users: TestUser[] = [];
    const subscriptions: TestSubscription[] = [];

    // Créer un admin
    const admin = this.generateAdmin();
    users.push(admin);

    // Créer des utilisateurs avec différents types d'abonnements
    const scenarios = [
      { plan_type: 'ambassador_standard' as const, billing_frequency: 'monthly' as const, status: 'active' as const },
      { plan_type: 'ambassador_premium' as const, billing_frequency: 'annual' as const, status: 'active' as const },
      { plan_type: 'ambassador_standard' as const, billing_frequency: 'annual' as const, status: 'suspended' as const },
      { plan_type: 'ambassador_premium' as const, billing_frequency: 'monthly' as const, status: 'cancelled' as const },
      { plan_type: 'ambassador_standard' as const, billing_frequency: 'monthly' as const, status: 'past_due' as const },
    ];

    for (const scenario of scenarios) {
      const user = this.generateUser();
      const subscription = this.generateSubscription(user.id, scenario);
      
      users.push(user);
      subscriptions.push(subscription);
    }

    return { users, subscriptions, admin };
  }
}

// Helper pour nettoyer les données de test
export class TestDataCleaner {
  static async cleanupTestUsers() {
    const { error } = await testSupabase
      .from('user_profiles')
      .delete()
      .like('email', 'test.%@example.com');
    
    if (error) console.warn('Cleanup users error:', error);
  }

  static async cleanupTestSubscriptions() {
    const { error } = await testSupabase
      .from('subscriptions')
      .delete()
      .like('id', 'test_sub_%');
    
    if (error) console.warn('Cleanup subscriptions error:', error);
  }

  static async cleanupAll() {
    await this.cleanupTestSubscriptions();
    await this.cleanupTestUsers();
  }
}

// Helper pour insérer des données de test
export class TestDataSeeder {
  static async seedUser(user: TestUser) {
    // Créer l'utilisateur dans auth.users (simulé)
    const authUser = {
      id: user.id,
      email: user.email,
      email_confirmed_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Créer le profil utilisateur
    const { error: profileError } = await testSupabase
      .from('user_profiles')
      .insert({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        user_level: user.user_level || 'user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (profileError) {
      console.error('Error seeding user profile:', profileError);
      throw profileError;
    }

    return user;
  }

  static async seedSubscription(subscription: TestSubscription) {
    const { error } = await testSupabase
      .from('subscriptions')
      .insert({
        ...subscription,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error seeding subscription:', error);
      throw error;
    }

    return subscription;
  }

  static async seedDataset() {
    const { users, subscriptions, admin } = await TestDataGenerator.generateSubscriptionDataset();

    // Insérer les utilisateurs
    for (const user of users) {
      await this.seedUser(user);
    }

    // Insérer les abonnements
    for (const subscription of subscriptions) {
      await this.seedSubscription(subscription);
    }

    return { users, subscriptions, admin };
  }
}
