/**
 * Intelligent Data Seeding Strategy for Make the CHANGE
 * Leverages existing mock data and tRPC server calls for realistic database population
 */

import { createClient } from '@supabase/supabase-js'
import { randomUUID } from 'crypto'

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const adminEmail = process.env.ADMIN_EMAIL_ALLOWLIST || 'krynskibartosz08@gmail.com'

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing required environment variables: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
}

// Initialize Supabase client with service role
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

// =============================================
// REALISTIC SEED DATA (Based on business model)
// =============================================

const seedUsers = [
  {
    id: randomUUID(),
    email: adminEmail,
    user_level: 'explorateur',
    kyc_status: 'complete',
    kyc_level: 2,
    points_balance: 2500,
    profile: { firstName: 'Admin', lastName: 'User', role: 'admin' },
    preferences: { marketing_emails: true, notifications: true }
  },
  {
    id: randomUUID(),
    email: 'alice.dubois@make-the-change.com',
    user_level: 'ambassadeur',
    kyc_status: 'complete',
    kyc_level: 2,
    points_balance: 1250,
    profile: { firstName: 'Alice', lastName: 'Dubois', role: 'ambassador' },
    preferences: { marketing_emails: true, newsletter: true }
  },
  {
    id: randomUUID(),
    email: 'bob.martin@company.fr',
    user_level: 'protecteur',
    kyc_status: 'complete',
    kyc_level: 1,
    points_balance: 850,
    profile: { firstName: 'Bob', lastName: 'Martin', role: 'protector' },
    preferences: { marketing_emails: false, notifications: true }
  },
  {
    id: randomUUID(),
    email: 'charlie.explorer@test.com',
    user_level: 'explorateur',
    kyc_status: 'pending',
    kyc_level: 0,
    points_balance: 120,
    profile: { firstName: 'Charlie', lastName: 'Explorer', role: 'user' },
    preferences: { marketing_emails: true, notifications: false }
  }
]

const seedProducers = [
  {
    id: randomUUID(),
    name: 'HABEEBEE - Apiculteurs Belges',
    slug: 'habeebee-belgium',
    type: 'beekeeper',
    description: 'Producteur artisanal de miel en Belgique, partenaire historique de Make the CHANGE',
    story: 'Depuis 3 générations, la famille Van Der Berg produit un miel d\'exception dans les campagnes belges.',
    address: { street: 'Rue des Abeilles 42', city: 'Gand', country: 'Belgique', postal_code: '9000' },
    contact_info: { email: 'contact@habeebee.be', phone: '+32 9 123 45 67', website: 'https://habeebee.be' },
    certifications: ['bio', 'demeter'],
    specialties: ['miel_acacia', 'miel_lavande', 'miel_chataignier'],
    capacity_info: { ruches: 150, production_annuelle_kg: 3000 },
    partnership_start: new Date('2023-01-15'),
    partnership_type: 'premium',
    commission_rate: 0.12, // 12% pour partenaire premium
    status: 'active'
  },
  {
    id: randomUUID(),
    name: 'ILANGA NATURE - Oliviers de Madagascar',
    slug: 'ilanga-nature-madagascar',
    type: 'olive_grower',
    description: 'Producteur d\'huile d\'olive extra vierge à Madagascar, agriculture biologique',
    story: 'Projet social et environnemental soutenant les communautés locales malgaches.',
    address: { street: 'Village d\'Ilanga', city: 'Antananarivo', country: 'Madagascar', postal_code: '101' },
    contact_info: { email: 'contact@ilanga-nature.com', phone: '+261 32 123 456', website: 'https://www.ilanga-nature.com' },
    certifications: ['bio', 'fair_trade'],
    specialties: ['huile_olive_extra_vierge', 'olives_kalamata'],
    capacity_info: { arbres: 500, hectares: 12, production_annuelle_litres: 1200 },
    partnership_start: new Date('2023-06-20'),
    partnership_type: 'standard',
    commission_rate: 0.15,
    status: 'active'
  },
  {
    id: randomUUID(),
    name: 'PROMIEL - Coopérative Luxembourg',
    slug: 'promiel-luxembourg',
    type: 'cooperative',
    description: 'Coopérative de producteurs de miel et produits de la ruche au Luxembourg',
    story: 'Regroupement de 25 apiculteurs luxembourgeois pour une production éthique et durable.',
    address: { street: 'Avenue de la Coopération 15', city: 'Luxembourg', country: 'Luxembourg', postal_code: '1234' },
    contact_info: { email: 'coop@promiel.lu', phone: '+352 123 456', website: 'https://promiel.lu' },
    certifications: ['bio'],
    specialties: ['miel_fleurs', 'propolis', 'gelee_royale'],
    capacity_info: { cooperatives: 25, ruches_total: 800, production_annuelle_kg: 12000 },
    partnership_start: new Date('2024-02-10'),
    partnership_type: 'standard',
    commission_rate: 0.15,
    status: 'active'
  }
]

const seedProjects = [
  {
    id: randomUUID(),
    type: 'beehive',
    name: 'Ruches Urbaines Gand - Protection Abeilles Belges',
    slug: 'ruches-urbaines-gand-belgique',
    description: 'Installation de ruches en milieu urbain pour soutenir la biodiversité locale à Gand',
    long_description: 'Ce projet innovant vise à installer 50 nouvelles ruches dans les espaces verts de Gand...',
    location: 'POINT(3.7303 51.0543)', // Gand, Belgique
    address: { city: 'Gand', region: 'Flandre-Orientale', country: 'Belgique' },
    target_budget: 5000, // 50€ par ruche, 100 ruches = 5000€
    current_funding: 3250, // 65% financé
    funding_progress: 65.0,
    status: 'active',
    launch_date: new Date('2024-01-15'),
    maturity_date: new Date('2025-06-15'),
    certification_labels: ['bio', 'urban_agriculture'],
    impact_metrics: { co2_offset_kg_per_year: 500, biodiversity_score: 85 },
    featured: true,
    producer_id: seedProducers[0].id
  },
  {
    id: randomUUID(),
    type: 'olive_tree',
    name: 'Oliveraie Communautaire Madagascar - ILANGA',
    slug: 'oliveraie-communautaire-madagascar',
    description: 'Plantation d\'oliviers pour soutenir les communautés rurales malgaches',
    long_description: 'Développement d\'une oliveraie de 5 hectares avec formation des agriculteurs locaux...',
    location: 'POINT(47.5316 -18.8792)', // Antananarivo, Madagascar
    address: { city: 'Antananarivo', region: 'Analamanga', country: 'Madagascar' },
    target_budget: 8000, // 80€ par arbre, 100 arbres = 8000€
    current_funding: 4800, // 60% financé
    funding_progress: 60.0,
    status: 'active',
    launch_date: new Date('2024-03-01'),
    maturity_date: new Date('2026-03-01'),
    certification_labels: ['bio', 'fair_trade', 'social_impact'],
    impact_metrics: { co2_offset_kg_per_year: 1200, local_jobs_created: 15 },
    featured: true,
    producer_id: seedProducers[1].id
  },
  {
    id: randomUUID(),
    type: 'beehive',
    name: 'Parcelles Familiales Luxembourg - PROMIEL',
    slug: 'parcelles-familiales-luxembourg',
    description: 'Adoption de parcelles familiales dans les campagnes luxembourgeoises',
    long_description: 'Chaque parcelle familiale regroupe 3 ruches avec suivi personnalisé...',
    location: 'POINT(5.9806 49.4958)', // Esch-sur-Alzette, Luxembourg
    address: { city: 'Esch-sur-Alzette', region: 'Canton', country: 'Luxembourg' },
    target_budget: 15000, // 150€ par parcelle, 100 parcelles = 15000€
    current_funding: 7500, // 50% financé
    funding_progress: 50.0,
    status: 'active',
    launch_date: new Date('2024-05-01'),
    maturity_date: new Date('2025-10-01'),
    certification_labels: ['bio'],
    impact_metrics: { co2_offset_kg_per_year: 800, educational_visits: 200 },
    featured: false,
    producer_id: seedProducers[2].id
  }
]

const seedProducts = [
  {
    id: randomUUID(),
    name: 'Miel de Lavande Bio - HABEEBEE',
    slug: 'miel-lavande-bio-habeebee',
    price_points: 450, // 4.50€
    short_description: 'Miel artisanal de lavande sauvage des champs belges',
    description: 'Ce miel exceptionnel provient des champs de lavande sauvage...',
    stock_quantity: 25,
    is_active: true,
    featured: true,
    fulfillment_method: 'stock',
    min_tier: 'explorateur',
    images: ['https://images.unsplash.com/photo-1558642891-b77887b1ef67?w=400'],
    producer_id: seedProducers[0].id
  },
  {
    id: randomUUID(),
    name: 'Huile d\'Olive Extra Vierge - ILANGA',
    slug: 'huile-olive-extra-vierge-ilanga',
    price_points: 680, // 6.80€
    short_description: 'Huile d\'olive première pression à froid de Madagascar',
    description: 'Huile d\'olive extra vierge produite de manière équitable...',
    stock_quantity: 15,
    is_active: true,
    featured: true,
    fulfillment_method: 'dropship',
    min_tier: 'explorateur',
    images: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400'],
    producer_id: seedProducers[1].id
  },
  {
    id: randomUUID(),
    name: 'Pack Dégustation Miel - PROMIEL',
    slug: 'pack-degustation-miel-promiel',
    price_points: 1200, // 12.00€
    short_description: 'Assortiment de 3 miels artisanaux luxembourgeois',
    description: 'Découvrez la richesse des miels du Luxembourg...',
    stock_quantity: 8,
    is_active: true,
    featured: false,
    fulfillment_method: 'stock',
    min_tier: 'protecteur',
    images: ['https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=400'],
    producer_id: seedProducers[2].id
  },
  {
    id: randomUUID(),
    name: 'Olives Kalamata Bio - ILANGA',
    slug: 'olives-kalamata-bio-ilanga',
    price_points: 520, // 5.20€
    short_description: 'Olives Kalamata biologiques en saumure naturelle',
    description: 'Olives Kalamata récoltées à la main et conservées selon...',
    stock_quantity: 12,
    is_active: true,
    featured: false,
    fulfillment_method: 'dropship',
    min_tier: 'explorateur',
    images: ['https://images.unsplash.com/photo-1605635669924-7e18d69b1fe8?w=400'],
    producer_id: seedProducers[1].id
  },
  {
    id: randomUUID(),
    name: 'Propolis Pure - PROMIEL',
    slug: 'propolis-pure-promiel',
    price_points: 890, // 8.90€
    short_description: 'Propolis pure récoltée dans les ruches luxembourgeoises',
    description: 'Propolis de haute qualité aux propriétés antibactériennes...',
    stock_quantity: 6,
    is_active: false, // Produit en rupture temporaire
    featured: false,
    fulfillment_method: 'stock',
    min_tier: 'ambassadeur', // Produit premium
    images: ['https://images.unsplash.com/photo-1571115018088-24c8a48dfe37?w=400'],
    producer_id: seedProducers[2].id
  }
]

// =============================================
// SEEDING FUNCTIONS
// =============================================

async function clearDatabase() {
  console.log('🧹 Clearing existing data...')
  
  // Clear in reverse dependency order to avoid foreign key constraints
  await supabase.from('order_items').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('orders').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('points_transactions').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('investments').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('project_updates').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('projects').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('producer_metrics').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('producers').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('user_profiles').delete().neq('user_id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('user_sessions').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  
  console.log('✅ Database cleared')
}

async function seedCoreData() {
  console.log('🌱 Seeding core data...')
  
  // 1. Insert Users
  console.log('👥 Seeding users...')
  const { error: usersError } = await supabase.from('users').insert(seedUsers)
  if (usersError) throw new Error(`Failed to seed users: ${usersError.message}`)
  
  // 2. Insert User Profiles
  console.log('👤 Seeding user profiles...')
  const userProfiles = seedUsers.map((user, index) => ({
    user_id: user.id,
    first_name: user.profile.firstName,
    last_name: user.profile.lastName,
    bio: index === 0 ? 'Administrateur de la plateforme Make the CHANGE' :
         index === 1 ? 'Ambassadrice passionnée de biodiversité' :
         index === 2 ? 'Protecteur engagé pour l\'environnement' :
         'Explorateur curieux du monde durable',
    notification_preferences: user.preferences
  }))
  
  const { error: profilesError } = await supabase.from('user_profiles').insert(userProfiles)
  if (profilesError) throw new Error(`Failed to seed user profiles: ${profilesError.message}`)
  
  // 3. Insert Producers
  console.log('🏭 Seeding producers...')
  const { error: producersError } = await supabase.from('producers').insert(seedProducers)
  if (producersError) throw new Error(`Failed to seed producers: ${producersError.message}`)
  
  // 4. Insert Projects
  console.log('🌿 Seeding projects...')
  const { error: projectsError } = await supabase.from('projects').insert(seedProjects)
  if (projectsError) throw new Error(`Failed to seed projects: ${projectsError.message}`)
  
  // 5. Insert Products
  console.log('🛍️ Seeding products...')
  const { error: productsError } = await supabase.from('products').insert(seedProducts)
  if (productsError) throw new Error(`Failed to seed products: ${productsError.message}`)
  
  console.log('✅ Core data seeded successfully')
}

async function seedTransactionalData() {
  console.log('💰 Seeding transactional data...')
  
  // Create some points transactions for users
  const pointsTransactions = [
    {
      id: randomUUID(),
      user_id: seedUsers[0].id, // Admin
      type: 'bonus_welcome',
      amount: 100,
      balance_after: 100,
      reference_type: 'system',
      description: 'Bonus de bienvenue'
    },
    {
      id: randomUUID(),
      user_id: seedUsers[1].id, // Alice
      type: 'earned_purchase',
      amount: 650, // Investment beehive 50€ + 30% bonus
      balance_after: 750,
      reference_type: 'investment',
      description: 'Adoption ruche HABEEBEE - Bonus 30%'
    },
    {
      id: randomUUID(),
      user_id: seedUsers[1].id, // Alice
      type: 'spent_order',
      amount: -450,
      balance_after: 300,
      reference_type: 'order',
      description: 'Achat Miel de Lavande Bio'
    }
  ]
  
  const { error: transactionsError } = await supabase.from('points_transactions').insert(pointsTransactions)
  if (transactionsError) throw new Error(`Failed to seed points transactions: ${transactionsError.message}`)
  
  // Create some sample investments
  const investments = [
    {
      id: randomUUID(),
      user_id: seedUsers[1].id, // Alice
      project_id: seedProjects[0].id, // Ruches Gand
      amount_points: 650,
      amount_eur_equivalent: 50,
      status: 'active',
      investment_terms: {
        type: 'beehive',
        partner: 'habeebee',
        bonus_percentage: 30,
        expected_duration_months: 18
      }
    },
    {
      id: randomUUID(),
      user_id: seedUsers[2].id, // Bob
      project_id: seedProjects[1].id, // Oliviers Madagascar
      amount_points: 1040,
      amount_eur_equivalent: 80,
      status: 'active',
      investment_terms: {
        type: 'olive_tree',
        partner: 'ilanga',
        bonus_percentage: 40,
        expected_duration_months: 24
      }
    }
  ]
  
  const { error: investmentsError } = await supabase.from('investments').insert(investments)
  if (investmentsError) throw new Error(`Failed to seed investments: ${investmentsError.message}`)
  
  // Create sample orders
  const orders = [
    {
      id: randomUUID(),
      user_id: seedUsers[1].id, // Alice
      status: 'confirmed',
      subtotal_points: 450,
      shipping_cost_points: 0,
      tax_points: 0,
      total_points: 450,
      points_used: 450,
      payment_method: 'points',
      shipping_address: {
        firstName: 'Alice',
        lastName: 'Dubois',
        street: '123 Rue de la Paix',
        city: 'Paris',
        postalCode: '75001',
        country: 'France'
      },
      billing_address: {
        firstName: 'Alice',
        lastName: 'Dubois',
        street: '123 Rue de la Paix',
        city: 'Paris',
        postalCode: '75001',
        country: 'France'
      }
    },
    {
      id: randomUUID(),
      user_id: seedUsers[2].id, // Bob
      status: 'processing',
      subtotal_points: 1880,
      shipping_cost_points: 0,
      tax_points: 0,
      total_points: 1880,
      points_used: 1880,
      payment_method: 'points',
      shipping_address: {
        firstName: 'Bob',
        lastName: 'Martin',
        street: '456 Avenue des Champs',
        city: 'Lyon',
        postalCode: '69000',
        country: 'France'
      },
      billing_address: {
        firstName: 'Bob',
        lastName: 'Martin',
        street: '456 Avenue des Champs',
        city: 'Lyon',
        postalCode: '69000',
        country: 'France'
      }
    }
  ]
  
  const { data: insertedOrders, error: ordersError } = await supabase.from('orders').insert(orders).select()
  if (ordersError) throw new Error(`Failed to seed orders: ${ordersError.message}`)
  
  // Create order items
  const orderItems = [
    {
      id: randomUUID(),
      order_id: insertedOrders[0].id,
      product_id: seedProducts[0].id, // Miel Lavande
      quantity: 1,
      unit_price_points: 450,
      total_price_points: 450
    },
    {
      id: randomUUID(),
      order_id: insertedOrders[1].id,
      product_id: seedProducts[0].id, // Miel Lavande x2
      quantity: 2,
      unit_price_points: 450,
      total_price_points: 900
    },
    {
      id: randomUUID(),
      order_id: insertedOrders[1].id,
      product_id: seedProducts[1].id, // Huile Olive x1
      quantity: 1,
      unit_price_points: 680,
      total_price_points: 680
    }
  ]
  
  const { error: orderItemsError } = await supabase.from('order_items').insert(orderItems)
  if (orderItemsError) throw new Error(`Failed to seed order items: ${orderItemsError.message}`)
  
  console.log('✅ Transactional data seeded successfully')
}

async function seedProjectUpdates() {
  console.log('📰 Seeding project updates...')
  
  const projectUpdates = [
    {
      id: randomUUID(),
      project_id: seedProjects[0].id, // Ruches Gand
      type: 'production',
      title: 'Première récolte de miel - Septembre 2024',
      content: 'Excellente première récolte avec 125kg de miel de qualité exceptionnelle...',
      metrics: {
        honey_harvested_kg: 125,
        hives_productive: 12,
        quality_grade: 'A+'
      },
      published_at: new Date('2024-09-15')
    },
    {
      id: randomUUID(),
      project_id: seedProjects[1].id, // Oliviers Madagascar
      type: 'maintenance',
      title: 'Formation des agriculteurs locaux',
      content: 'Session de formation intensive sur les techniques de culture biologique...',
      metrics: {
        farmers_trained: 15,
        training_hours: 40,
        satisfaction_rate: 0.95
      },
      published_at: new Date('2024-08-20')
    },
    {
      id: randomUUID(),
      project_id: seedProjects[0].id, // Ruches Gand
      type: 'impact',
      title: 'Bilan CO2 et biodiversité - Q3 2024',
      content: 'Impact environnemental positif mesuré sur le trimestre...',
      metrics: {
        co2_offset_kg: 425,
        bee_population_increase: 0.15,
        flower_diversity_index: 8.2
      },
      published_at: new Date('2024-10-01')
    }
  ]
  
  const { error } = await supabase.from('project_updates').insert(projectUpdates)
  if (error) throw new Error(`Failed to seed project updates: ${error.message}`)
  
  console.log('✅ Project updates seeded successfully')
}

async function validateData() {
  console.log('🔍 Validating seeded data...')
  
  const tables = [
    'users', 'user_profiles', 'producers', 'projects', 'products',
    'points_transactions', 'investments', 'orders', 'order_items', 'project_updates'
  ]
  
  for (const table of tables) {
    const { count } = await supabase.from(table).select('*', { count: 'exact', head: true })
    console.log(`  📊 ${table}: ${count} records`)
  }
  
  console.log('✅ Data validation complete')
}

// =============================================
// MAIN EXECUTION
// =============================================

export async function seedDatabase(options: { clear?: boolean } = {}) {
  try {
    console.log('🚀 Starting intelligent database seeding...')
    
    if (options.clear) {
      await clearDatabase()
    }
    
    await seedCoreData()
    await seedTransactionalData()
    await seedProjectUpdates()
    await validateData()
    
    console.log('🎉 Database seeding completed successfully!')
    console.log('\n📋 Summary:')
    console.log('  👥 4 users (including admin)')
    console.log('  🏭 3 producers (HABEEBEE, ILANGA, PROMIEL)')
    console.log('  🌿 3 projects (ruches, oliviers, parcelles)')
    console.log('  🛍️ 5 products with realistic pricing')
    console.log('  💰 Multiple points transactions')
    console.log('  📦 2 sample orders with items')
    console.log('  📰 3 project updates')
    console.log('\n✅ Ready for manual testing and E2E automation!')
    
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    throw error
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const shouldClear = process.argv.includes('--clear')
  seedDatabase({ clear: shouldClear })
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}