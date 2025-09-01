const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase pour les tests
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const testSupabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Générateur de données de test simple
function generateTestUser(overrides = {}) {
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

function generateTestSubscription(userId, overrides = {}) {
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
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  };
}

// Fonction de nettoyage
async function cleanupTestData() {
  console.log('🧹 Cleaning up test data...');
  
  try {
    // Nettoyer les abonnements de test
    const { error: subError } = await testSupabase
      .from('subscriptions')
      .delete()
      .like('id', 'test_sub_%');
    
    if (subError) console.warn('Warning cleaning subscriptions:', subError.message);
    
    // Nettoyer les profils utilisateurs de test
    const { error: profileError } = await testSupabase
      .from('user_profiles')
      .delete()
      .like('email', 'test.%@example.com');
    
    if (profileError) console.warn('Warning cleaning user profiles:', profileError.message);
    
    console.log('✅ Test data cleaned');
  } catch (error) {
    console.error('❌ Error during cleanup:', error.message);
  }
}

// Fonction de génération des données
async function seedTestData() {
  console.log('🌱 Seeding test data...');
  
  try {
    const users = [];
    const subscriptions = [];

    // Créer un admin
    const admin = generateTestUser({
      email: `admin.test.${Date.now()}@example.com`,
      first_name: 'Admin',
      last_name: 'Test',
      user_level: 'admin',
    });
    users.push(admin);

    // Créer des utilisateurs avec différents types d'abonnements
    const scenarios = [
      { plan_type: 'ambassador_standard', billing_frequency: 'monthly', status: 'active' },
      { plan_type: 'ambassador_premium', billing_frequency: 'annual', status: 'active' },
      { plan_type: 'ambassador_standard', billing_frequency: 'annual', status: 'suspended' },
      { plan_type: 'ambassador_premium', billing_frequency: 'monthly', status: 'cancelled' },
      { plan_type: 'ambassador_standard', billing_frequency: 'monthly', status: 'past_due' },
    ];

    for (const scenario of scenarios) {
      const user = generateTestUser();
      const subscription = generateTestSubscription(user.id, scenario);
      
      users.push(user);
      subscriptions.push(subscription);
    }

    // Insérer les utilisateurs
    for (const user of users) {
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
        console.error(`❌ Error seeding user ${user.email}:`, profileError.message);
        continue;
      }
    }

    // Insérer les abonnements
    for (const subscription of subscriptions) {
      const { error } = await testSupabase
        .from('subscriptions')
        .insert(subscription);

      if (error) {
        console.error(`❌ Error seeding subscription ${subscription.id}:`, error.message);
        continue;
      }
    }

    console.log(`✅ Test data seeded: ${users.length} users, ${subscriptions.length} subscriptions`);
    console.log(`📧 Admin email: ${admin.email}`);
    
    return { users, subscriptions, admin };
  } catch (error) {
    console.error('❌ Error during seeding:', error.message);
    throw error;
  }
}

// CLI
const command = process.argv[2];

async function main() {
  switch (command) {
    case 'clean':
      await cleanupTestData();
      break;
    case 'seed':
      await seedTestData();
      break;
    case 'reset':
      await cleanupTestData();
      await seedTestData();
      break;
    default:
      console.log('Usage: node seed-test-data.js {clean|seed|reset}');
      process.exit(1);
  }
}

main().catch(console.error);
