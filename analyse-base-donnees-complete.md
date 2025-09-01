# Analyse Complète de la Base de Données - Make the CHANGE

## Vue d'ensemble

Cette analyse présente la structure complète de la base de données du projet **Make the CHANGE**, un système e-commerce de produits agricoles avec système de points et abonnements.

## Architecture Générale

- **Base de données**: PostgreSQL avec extensions Supabase
- **Paradigme**: Modèle hybride (e-commerce + points + abonnements)
- **Sécurité**: Row Level Security (RLS) activé sur toutes les tables sensibles
- **Extensions**: PostGIS (géospatial), pg_trgm (recherche textuelle), uuid-ossp

---

## Tables Principales

### 1. **USERS & AUTHENTICATION**

#### Table: `users`
**Description**: Utilisateurs principaux liés à Supabase Auth
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
email VARCHAR UNIQUE NOT NULL
profile JSONB DEFAULT '{}'
points_balance INTEGER DEFAULT 0
user_level VARCHAR(20) DEFAULT 'explorateur'
  CHECK (user_level IN ('explorateur', 'protecteur', 'ambassadeur'))
kyc_status VARCHAR(20) DEFAULT 'pending'
  CHECK (kyc_status IN ('pending', 'light', 'complete'))
kyc_level INTEGER DEFAULT 0 CHECK (kyc_level IN (0, 1, 2))
preferences JSONB DEFAULT '{}'
last_login_at TIMESTAMP
email_verified_at TIMESTAMP
created_at TIMESTAMP DEFAULT NOW()
updated_at TIMESTAMP DEFAULT NOW()
```

#### Table: `user_profiles`
**Description**: Profils utilisateurs étendus
```sql
user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE
first_name VARCHAR(100)
last_name VARCHAR(100)
date_of_birth DATE
phone VARCHAR(20)
address JSONB -- {street, city, postal_code, country}
bio TEXT
avatar_url TEXT
social_links JSONB DEFAULT '{}'
notification_preferences JSONB DEFAULT '{}'
created_at TIMESTAMP DEFAULT NOW()
updated_at TIMESTAMP DEFAULT NOW()
```

#### Table: `user_sessions`
**Description**: Gestion des sessions utilisateur
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id UUID REFERENCES users(id) ON DELETE CASCADE
session_token VARCHAR UNIQUE NOT NULL
device_info JSONB DEFAULT '{}'
ip_address INET
user_agent TEXT
expires_at TIMESTAMP NOT NULL
created_at TIMESTAMP DEFAULT NOW()
```

### 2. **PRODUCERS & PARTNERS**

#### Table: `producers`
**Description**: Producteurs et partenaires agricoles
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
name VARCHAR NOT NULL
slug VARCHAR UNIQUE NOT NULL
type VARCHAR(50) NOT NULL
  CHECK (type IN ('beekeeper', 'olive_grower', 'winery', 'cooperative'))
description TEXT
story TEXT -- histoire du producteur
location GEOGRAPHY(POINT, 4326)
address JSONB NOT NULL
contact_info JSONB DEFAULT '{}' -- email, phone, website
social_media JSONB DEFAULT '{}' -- Instagram, Facebook, etc.
certifications TEXT[] DEFAULT '{}' -- bio, demeter, fair-trade
specialties TEXT[] DEFAULT '{}' -- miel d'acacia, huile extra vierge
capacity_info JSONB DEFAULT '{}' -- nb ruches, hectares, etc.
partnership_start DATE
partnership_type VARCHAR(20) DEFAULT 'standard'
  CHECK (partnership_type IN ('standard', 'premium', 'exclusive'))
commission_rate DECIMAL(5,4) DEFAULT 0.1500 -- 15% commission
payment_terms INTEGER DEFAULT 30 -- jours
status VARCHAR(20) DEFAULT 'active'
  CHECK (status IN ('active', 'inactive', 'suspended'))
images TEXT[] DEFAULT '{}'
documents TEXT[] DEFAULT '{}' -- contrats, certifs scannés
notes TEXT
metadata JSONB DEFAULT '{}'
created_at TIMESTAMP DEFAULT NOW()
updated_at TIMESTAMP DEFAULT NOW()
```

#### Table: `producer_metrics`
**Description**: Métriques de production des partenaires
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
producer_id UUID REFERENCES producers(id)
metric_type VARCHAR(50) NOT NULL -- 'honey_production', 'olive_harvest', 'co2_offset'
period VARCHAR(20) NOT NULL -- 'Q1-2025', 'annual-2024'
value DECIMAL(12,4) NOT NULL
unit VARCHAR(20) NOT NULL -- 'kg', 'liters', 'tons_co2'
measurement_date DATE NOT NULL
verified BOOLEAN DEFAULT false
verification_doc_url TEXT
notes TEXT
created_at TIMESTAMP DEFAULT NOW()
```

### 3. **PROJECTS & ASSETS**

#### Table: `projects`
**Description**: Projets de biodiversité soutenus par les membres
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
type VARCHAR(50) NOT NULL
  CHECK (type IN ('beehive', 'olive_tree', 'vineyard', 'reforestation', 'ocean_cleanup'))
name VARCHAR NOT NULL
slug VARCHAR UNIQUE NOT NULL
description TEXT
long_description TEXT
location GEOGRAPHY(POINT, 4326) NOT NULL
address JSONB NOT NULL -- {street, city, region, country}
producer_id UUID REFERENCES producers(id)
target_budget INTEGER NOT NULL -- Budget nécessaire en centimes
current_funding INTEGER DEFAULT 0 -- Financement actuel
funding_progress DECIMAL(5,2) DEFAULT 0.0 -- pourcentage financé
status VARCHAR(20) DEFAULT 'active'
  CHECK (status IN ('active', 'funded', 'closed', 'suspended'))
launch_date DATE
maturity_date DATE
certification_labels TEXT[] DEFAULT '{}' -- bio, demeter, etc.
impact_metrics JSONB DEFAULT '{}' -- CO2, biodiversité, etc.
images TEXT[] DEFAULT '{}'
metadata JSONB DEFAULT '{}' -- données spécifiques par type
seo_title VARCHAR(255)
seo_description TEXT
featured BOOLEAN DEFAULT false
created_at TIMESTAMP DEFAULT NOW()
updated_at TIMESTAMP DEFAULT NOW()
```

#### Table: `project_updates`
**Description**: Mises à jour de production des projets
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
project_id UUID REFERENCES projects(id) ON DELETE CASCADE
type VARCHAR(50) NOT NULL
  CHECK (type IN ('production', 'maintenance', 'harvest', 'impact'))
title VARCHAR NOT NULL
content TEXT
metrics JSONB DEFAULT '{}' -- données de production
images TEXT[] DEFAULT '{}'
published_at TIMESTAMP
created_at TIMESTAMP DEFAULT NOW()
```

### 4. **E-COMMERCE STRUCTURE**

#### Table: `categories`
**Description**: Catégories de produits
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
name VARCHAR NOT NULL
slug VARCHAR UNIQUE NOT NULL
description TEXT
parent_id UUID REFERENCES categories(id)
image_url TEXT
sort_order INTEGER DEFAULT 0
is_active BOOLEAN DEFAULT true
seo_title VARCHAR(255)
seo_description TEXT
created_at TIMESTAMP DEFAULT NOW()
updated_at TIMESTAMP DEFAULT NOW()
```

#### Table: `products`
**Description**: Produits e-commerce (modèle hybride stock/dropship)
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
name VARCHAR NOT NULL
slug VARCHAR UNIQUE NOT NULL
short_description TEXT
description TEXT
category_id UUID REFERENCES categories(id)
producer_id UUID REFERENCES producers(id)
price_points INTEGER NOT NULL -- prix en points
price_eur_equivalent DECIMAL(10,2) -- prix équivalent euros
fulfillment_method VARCHAR(20) NOT NULL DEFAULT 'dropship'
  CHECK (fulfillment_method IN ('stock', 'dropship'))
is_hero_product BOOLEAN DEFAULT FALSE -- héros produits en micro-stock
stock_quantity INTEGER DEFAULT 0 -- pour produits en stock uniquement
stock_management BOOLEAN DEFAULT true
weight_grams INTEGER -- pour calculs shipping
dimensions JSONB -- {length, width, height} en cm
images TEXT[] DEFAULT '{}'
tags TEXT[] DEFAULT '{}'
variants JSONB DEFAULT '{}' -- variations (taille, couleur, etc.)
nutrition_facts JSONB DEFAULT '{}'
allergens TEXT[] DEFAULT '{}'
certifications TEXT[] DEFAULT '{}' -- bio, fair-trade, etc.
origin_country VARCHAR(2) -- code ISO pays
seasonal_availability JSONB DEFAULT '{}'
min_tier VARCHAR(20) DEFAULT 'explorateur'
  CHECK (min_tier IN ('explorateur', 'protecteur', 'ambassadeur'))
featured BOOLEAN DEFAULT false
is_active BOOLEAN DEFAULT true
launch_date DATE
discontinue_date DATE
seo_title VARCHAR(255)
seo_description TEXT
metadata JSONB DEFAULT '{}'
created_at TIMESTAMP DEFAULT NOW()
updated_at TIMESTAMP DEFAULT NOW()
```

#### Table: `inventory`
**Description**: Gestion micro-stock héros
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
product_id UUID REFERENCES products(id) ON DELETE CASCADE
sku VARCHAR(100) NOT NULL UNIQUE
quantity_available INTEGER NOT NULL DEFAULT 0
quantity_reserved INTEGER DEFAULT 0 -- réservé pour commandes
reorder_threshold INTEGER NOT NULL DEFAULT 10 -- seuil réassort
reorder_quantity INTEGER NOT NULL DEFAULT 50 -- quantité réassort
cost_price_cents INTEGER NOT NULL -- prix d'achat grossiste
supplier_reference VARCHAR(255) -- référence fournisseur
last_restock_date TIMESTAMP
last_stockout_date TIMESTAMP
location_in_warehouse VARCHAR(100) -- emplacement micro-hub
expiry_date DATE -- DDM si applicable
batch_number VARCHAR(100) -- numéro de lot
rotation_days INTEGER -- rotation moyenne en jours
created_at TIMESTAMP DEFAULT NOW()
updated_at TIMESTAMP DEFAULT NOW()
```

#### Table: `stock_movements`
**Description**: Mouvements stock détaillés
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
inventory_id UUID REFERENCES inventory(id)
type VARCHAR(20) NOT NULL
  CHECK (type IN ('in', 'out', 'adjustment', 'reserved', 'released'))
quantity INTEGER NOT NULL
reference_type VARCHAR(20) -- 'order', 'restock', 'adjustment'
reference_id UUID -- ID de la commande, du réassort, etc.
reason TEXT
cost_per_unit_cents INTEGER
performed_by UUID -- admin user
created_at TIMESTAMP DEFAULT NOW()
```

### 5. **ORDERS & TRANSACTIONS**

#### Table: `orders`
**Description**: Commandes utilisateurs
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id UUID REFERENCES users(id)
status VARCHAR(20) DEFAULT 'pending'
  CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'))

-- Montants
subtotal_points INTEGER NOT NULL
shipping_cost_points INTEGER DEFAULT 0
tax_points INTEGER DEFAULT 0
total_points INTEGER NOT NULL

-- Points utilisés/gagnés
points_used INTEGER NOT NULL
points_earned INTEGER DEFAULT 0

-- Paiement
payment_method VARCHAR(20)
  CHECK (payment_method IN ('points', 'stripe_card', 'stripe_sepa', 'mixed'))
stripe_payment_intent_id VARCHAR

-- Adresses
shipping_address JSONB NOT NULL
billing_address JSONB

-- Tracking
tracking_number VARCHAR
carrier VARCHAR(50)

-- Métadonnées
notes TEXT
admin_notes TEXT
created_at TIMESTAMP DEFAULT NOW()
updated_at TIMESTAMP DEFAULT NOW()
shipped_at TIMESTAMP
delivered_at TIMESTAMP
```

#### Table: `order_items`
**Description**: Items de commande
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
order_id UUID REFERENCES orders(id) ON DELETE CASCADE
product_id UUID REFERENCES products(id)
quantity INTEGER NOT NULL
unit_price_points INTEGER NOT NULL
total_price_points INTEGER NOT NULL
product_snapshot JSONB -- snapshot du produit au moment de la commande
created_at TIMESTAMP DEFAULT NOW()
```

### 6. **SUBSCRIPTIONS & POINTS SYSTEM**

#### Table: `subscriptions`
**Description**: Abonnements des membres (système dual billing)
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id UUID REFERENCES users(id)
stripe_subscription_id VARCHAR UNIQUE
stripe_customer_id VARCHAR NOT NULL

-- Détails abonnement
plan_type subscription_plan_type DEFAULT 'explorer_free'
status subscription_status_type DEFAULT 'active'
billing_frequency billing_frequency DEFAULT 'monthly'

-- Pricing
monthly_price DECIMAL(10,2) NOT NULL
annual_price DECIMAL(10,2)
monthly_points_allocation INTEGER NOT NULL
annual_points INTEGER DEFAULT 0
bonus_percentage DECIMAL(5,2) DEFAULT 0.00

-- Billing
current_period_start TIMESTAMP
current_period_end TIMESTAMP
next_billing_date TIMESTAMP
cancel_at_period_end BOOLEAN DEFAULT false
trial_end TIMESTAMP

-- Métadonnées
metadata JSONB DEFAULT '{}'
created_at TIMESTAMP DEFAULT NOW()
updated_at TIMESTAMP DEFAULT NOW()
cancelled_at TIMESTAMP
ended_at TIMESTAMP
```

#### Table: `points_transactions`
**Description**: Transactions de points détaillées
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id UUID REFERENCES users(id)
type VARCHAR(30) NOT NULL
  CHECK (type IN ('earned_subscription', 'earned_purchase', 'earned_referral', 'spent_order', 'spent_investment', 'adjustment_admin', 'bonus_welcome', 'bonus_milestone'))
amount INTEGER NOT NULL -- positif pour gain, négatif pour dépense
balance_after INTEGER NOT NULL -- solde après transaction
reference_type VARCHAR(20) -- 'order', 'subscription', 'referral', 'investment'
reference_id UUID
description TEXT
metadata JSONB DEFAULT '{}'
expires_at TIMESTAMP -- pour points avec expiration
processed_at TIMESTAMP DEFAULT NOW()
created_at TIMESTAMP DEFAULT NOW()
```

#### Table: `monthly_allocations`
**Description**: Historique des allocations mensuelles
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
subscription_id UUID REFERENCES subscriptions(id)
user_id UUID REFERENCES users(id)
allocation_month VARCHAR(7) NOT NULL -- 'YYYY-MM'
points_allocated INTEGER NOT NULL
allocated_at TIMESTAMP DEFAULT NOW()

-- Colonnes dual billing
billing_period VARCHAR(7) -- Format YYYY-MM
allocated_investments INTEGER DEFAULT 0
allocated_products INTEGER DEFAULT 0
unused_points INTEGER DEFAULT 0
rollover_from_previous INTEGER DEFAULT 0
rollover_to_next INTEGER DEFAULT 0
points_expired INTEGER DEFAULT 0
expiry_date TIMESTAMP
allocation_preferences JSONB DEFAULT '{"investments": 70, "products": 30}'

UNIQUE(subscription_id, allocation_month)
```

### 7. **INVESTMENTS SYSTEM**

#### Table: `investments`
**Description**: Investissements utilisateurs dans les projets
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id UUID REFERENCES users(id)
project_id UUID REFERENCES projects(id)
amount_points INTEGER NOT NULL
amount_eur_equivalent DECIMAL(10,2) NOT NULL -- équivalent euro au moment de l'investissement

-- Statut et retours
status VARCHAR(20) DEFAULT 'active'
  CHECK (status IN ('active', 'matured', 'cancelled'))
expected_return_rate DECIMAL(5,4) -- taux de retour attendu (ex: 0.0500 pour 5%)
maturity_date DATE

-- Tracking des retours
returns_received_points INTEGER DEFAULT 0
last_return_date TIMESTAMP

-- Métadonnées
investment_terms JSONB DEFAULT '{}'
notes TEXT
created_at TIMESTAMP DEFAULT NOW()
updated_at TIMESTAMP DEFAULT NOW()
```

#### Table: `investment_returns`
**Description**: Retours d'investissement
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
investment_id UUID REFERENCES investments(id)
return_period VARCHAR(7) NOT NULL -- 'YYYY-MM' ou 'YYYY-Q1'
points_returned INTEGER NOT NULL
return_rate_actual DECIMAL(5,4) -- taux réel pour cette période
distribution_date TIMESTAMP DEFAULT NOW()
notes TEXT
created_at TIMESTAMP DEFAULT NOW()
```

### 8. **ANALYTICS & ADMIN TABLES**

#### Table: `admin_analytics`
**Description**: Analytics d'usage admin
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
admin_user_id UUID REFERENCES users(id)
action_type VARCHAR(50) NOT NULL -- 'view_page', 'export_data', 'bulk_action', 'filter_applied'
resource_type VARCHAR(50) NOT NULL -- 'orders', 'users', 'products', 'projects', 'analytics'
resource_id UUID
metadata JSONB DEFAULT '{}' -- détails spécifiques à l'action
ip_address INET
user_agent TEXT
session_duration INTEGER -- durée en secondes
created_at TIMESTAMP DEFAULT NOW()
```

#### Table: `business_metrics`
**Description**: Métriques business calculées
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
metric_type VARCHAR(50) NOT NULL -- 'mrr', 'churn_rate', 'conversion', 'ltv', 'cac'
period_type VARCHAR(20) NOT NULL -- 'daily', 'weekly', 'monthly', 'quarterly'
period_value VARCHAR(20) NOT NULL -- '2025-01', '2025-W01', '2025-01-01', '2025-Q1'
value DECIMAL(15,4) NOT NULL
previous_value DECIMAL(15,4) -- valeur période précédente pour % change
change_percentage DECIMAL(8,4) -- % de changement vs période précédente
metadata JSONB DEFAULT '{}' -- breakdown détaillé, segments, etc.
calculated_at TIMESTAMP DEFAULT NOW()

UNIQUE(metric_type, period_type, period_value)
```

#### Table: `export_jobs`
**Description**: Jobs d'export de données
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
admin_user_id UUID REFERENCES users(id)
export_type VARCHAR(50) NOT NULL -- 'users', 'orders', 'analytics', 'products', 'subscriptions'
format VARCHAR(10) NOT NULL -- 'csv', 'excel', 'pdf'
filters JSONB DEFAULT '{}'
status VARCHAR(20) DEFAULT 'pending'
file_url TEXT
file_size INTEGER
error_message TEXT
total_records INTEGER
processed_records INTEGER DEFAULT 0
progress_percentage DECIMAL(5,2) DEFAULT 0
estimated_completion TIMESTAMP
created_at TIMESTAMP DEFAULT NOW()
started_at TIMESTAMP
completed_at TIMESTAMP
```

#### Table: `admin_dashboard_configs`
**Description**: Préférences personnalisées des dashboards admin
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
admin_user_id UUID REFERENCES users(id)
dashboard_type VARCHAR(50) NOT NULL -- 'main', 'analytics', 'orders', 'users'
widget_layout JSONB NOT NULL -- configuration des widgets et positions
filters_default JSONB DEFAULT '{}'
refresh_interval INTEGER DEFAULT 300 -- intervalle de refresh en secondes
is_default BOOLEAN DEFAULT false
created_at TIMESTAMP DEFAULT NOW()
updated_at TIMESTAMP DEFAULT NOW()

UNIQUE(admin_user_id, dashboard_type)
```

#### Table: `business_alerts`
**Description**: Alertes business pour monitoring
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
alert_type VARCHAR(50) NOT NULL -- 'stock_low', 'high_churn', 'payment_failed', 'goal_reached'
severity VARCHAR(20) DEFAULT 'medium' -- 'low', 'medium', 'high', 'critical'
title VARCHAR(255) NOT NULL
message TEXT NOT NULL
metadata JSONB DEFAULT '{}'
status VARCHAR(20) DEFAULT 'active' -- 'active', 'acknowledged', 'resolved', 'dismissed'
acknowledged_by UUID REFERENCES users(id)
acknowledged_at TIMESTAMP
resolved_at TIMESTAMP
expires_at TIMESTAMP
created_at TIMESTAMP DEFAULT NOW()
```

### 9. **DUAL BILLING EXTENSIONS**

#### Table: `subscription_billing_history`
**Description**: Historique de facturation pour analytics MRR
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE
user_id UUID REFERENCES users(id) ON DELETE CASCADE

-- Détails facturation
billing_period_start TIMESTAMP NOT NULL
billing_period_end TIMESTAMP NOT NULL
amount DECIMAL(10,2) NOT NULL
currency VARCHAR(3) DEFAULT 'EUR'

-- Détails plan
plan_type subscription_plan_type NOT NULL
billing_frequency billing_frequency NOT NULL
points_allocated INTEGER DEFAULT 0

-- Intégration Stripe
stripe_invoice_id VARCHAR(255)
stripe_payment_intent_id VARCHAR(255)
payment_status VARCHAR(50) DEFAULT 'pending'
paid_at TIMESTAMP

-- Métadonnées
discount_amount DECIMAL(10,2) DEFAULT 0.00
tax_amount DECIMAL(10,2) DEFAULT 0.00
total_amount DECIMAL(10,2) GENERATED ALWAYS AS (amount + tax_amount - discount_amount) STORED

-- Audit
created_at TIMESTAMP DEFAULT NOW()
updated_at TIMESTAMP DEFAULT NOW()

CONSTRAINT valid_billing_period CHECK (billing_period_end > billing_period_start)
CONSTRAINT positive_amount CHECK (amount >= 0)
```

#### Table: `conversion_events`
**Description**: Événements de conversion pour analytics
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id UUID REFERENCES users(id) ON DELETE CASCADE
subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE

-- Type d'événement
event_type conversion_event_type NOT NULL
event_date TIMESTAMP DEFAULT NOW()

-- Détails conversion
old_plan JSONB NOT NULL -- Plan précédent complet
new_plan JSONB NOT NULL -- Nouveau plan complet

-- Impact financier
price_change DECIMAL(10,2) DEFAULT 0.00 -- Différence de prix
annual_savings DECIMAL(10,2) DEFAULT 0.00 -- Économies annuelles
points_bonus INTEGER DEFAULT 0 -- Points bonus accordés

-- Context et attribution
trigger_event VARCHAR(100) -- Ce qui a déclenché la conversion
campaign_id VARCHAR(100) -- Campagne marketing associée
referral_source VARCHAR(100) -- Source du trafic
user_agent TEXT -- Navigateur utilisé

-- Proration et ajustements
proration_amount DECIMAL(10,2) DEFAULT 0.00
immediate_charge DECIMAL(10,2) DEFAULT 0.00
next_billing_adjustment DECIMAL(10,2) DEFAULT 0.00

-- Métadonnées
conversion_incentives JSONB DEFAULT '{}' -- Bonus/promotions appliqués
ab_test_variant VARCHAR(50) -- Variant A/B test
metadata JSONB DEFAULT '{}'

-- Audit
created_at TIMESTAMP DEFAULT NOW()

CONSTRAINT valid_price_change CHECK (price_change IS NOT NULL)
CONSTRAINT valid_savings CHECK (annual_savings >= 0)
```

#### Table: `points_expiry_schedule`
**Description**: Planning expiration points pour notifications
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id UUID REFERENCES users(id) ON DELETE CASCADE
points_transaction_id UUID REFERENCES points_transactions(id) ON DELETE CASCADE

-- Détails expiration
points_amount INTEGER NOT NULL
earned_date TIMESTAMP NOT NULL
expiry_date TIMESTAMP NOT NULL

-- Statut
is_expired BOOLEAN DEFAULT FALSE
is_notified_30_days BOOLEAN DEFAULT FALSE
is_notified_7_days BOOLEAN DEFAULT FALSE
is_notified_1_day BOOLEAN DEFAULT FALSE
expired_at TIMESTAMP

-- Source des points
source_type VARCHAR(50) -- 'subscription', 'bonus', 'referral', etc.
source_details JSONB DEFAULT '{}'

-- Métadonnées
metadata JSONB DEFAULT '{}'
created_at TIMESTAMP DEFAULT NOW()
updated_at TIMESTAMP DEFAULT NOW()

CONSTRAINT valid_expiry CHECK (expiry_date > earned_date)
CONSTRAINT positive_points CHECK (points_amount > 0)
```

#### Table: `subscription_cohorts`
**Description**: Analyse cohort pour analytics avancées
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()

-- Définition cohorte
cohort_month DATE NOT NULL -- Premier mois de la cohorte
cohort_size INTEGER NOT NULL -- Nombre d'utilisateurs initiaux

-- Métriques par période
period_number INTEGER NOT NULL -- 0 = mois initial, 1 = mois 1, etc.
period_date DATE NOT NULL

-- Rétention
active_subscribers INTEGER DEFAULT 0
retention_rate DECIMAL(5,2) GENERATED ALWAYS AS (
    CASE WHEN cohort_size > 0
    THEN (active_subscribers * 100.0 / cohort_size)
    ELSE 0 END
) STORED

-- Revenue
total_revenue DECIMAL(12,2) DEFAULT 0.00
average_revenue_per_user DECIMAL(10,2) GENERATED ALWAYS AS (
    CASE WHEN active_subscribers > 0
    THEN (total_revenue / active_subscribers)
    ELSE 0 END
) STORED

-- Conversion
monthly_subscribers INTEGER DEFAULT 0
annual_subscribers INTEGER DEFAULT 0
conversion_rate DECIMAL(5,2) GENERATED ALWAYS AS (
    CASE WHEN active_subscribers > 0
    THEN (annual_subscribers * 100.0 / active_subscribers)
    ELSE 0 END
) STORED

-- Métadonnées
calculation_date TIMESTAMP DEFAULT NOW()
metadata JSONB DEFAULT '{}'

CONSTRAINT unique_cohort_period UNIQUE (cohort_month, period_number)
CONSTRAINT valid_period CHECK (period_number >= 0)
CONSTRAINT valid_cohort_size CHECK (cohort_size > 0)
```

---

## Types Énumérés (ENUM)

### `subscription_plan_type`
- `explorer_free`
- `protector_basic`
- `ambassador_standard`
- `ambassador_premium`

### `billing_frequency`
- `monthly`
- `annual`

### `subscription_status_type`
- `active`
- `inactive`
- `cancelled`
- `past_due`
- `unpaid`
- `trialing`

### `conversion_event_type`
- `monthly_to_annual`
- `annual_to_monthly`
- `plan_upgrade`
- `plan_downgrade`
- `reactivation`
- `cancellation`

---

## Fonctions Utiles

### Analytics & Métriques
- `calculate_mrr(target_date)` → Calcul du Monthly Recurring Revenue
- `calculate_conversion_rate(start_date, end_date)` → Taux de conversion monthly→annual
- `track_admin_action(user_id, action_type, resource_type, resource_id, metadata)` → Tracking actions admin

### Gestion Points
- `expire_old_points()` → Expiration automatique des points
- `get_days_until_expiry(expiry_date)` → Calcul jours jusqu'à expiration
- `has_kyc_level(required_level)` → Vérification niveau KYC

### Utilitaires
- `update_updated_at_column()` → Trigger pour updated_at

---

## Vues Analytiques

### `admin_dashboard_metrics`
Métriques temps réel pour dashboard admin:
- MRR actuel et ARR projeté
- Nombre d'abonnements actifs (mensuels/ annuels)
- Taux de conversion 30 jours
- Revenu moyen mensuel par utilisateur

### `user_subscription_summary`
Résumé abonnements utilisateurs:
- Plan et fréquence actuels
- Prix et allocation points
- Économies potentielles si conversion annuelle
- Solde points et allocation préférences
- Prochaine expiration points

### `points_expiry_with_days`
Points avec calcul dynamique des jours restants

### `points_expiring_soon`
Points expirant dans les 30 prochains jours

---

## Politiques RLS (Row Level Security)

### Utilisateurs
- ✅ Lecture/écriture de leurs propres données
- 🔒 Service role peut accéder à tout

### Transactions Financières
- ✅ Utilisateurs voient leurs propres transactions
- 🔒 Service role peut accéder à tout

### Contenu Public
- ✅ Lecture publique des projets/produits actifs
- 🔒 Service role peut accéder à tout

### Gestion Interne
- 🔒 Service role seulement (inventory, stock_movements)

### KYC Restrictions
- 🔒 Investissements limités selon niveau KYC:
  - Explorateur (0): pas d'investissement
  - Protecteur (1): ≤ 100€
  - Ambassadeur (2): illimité

---

## Index de Performance

### Index FK Critiques
- `idx_investment_returns_investment_id`
- `idx_monthly_allocations_user_id`
- `idx_monthly_allocations_subscription_id`
- `idx_points_expiry_schedule_transaction_id`
- `idx_user_sessions_user_id`

### Index Composites et Partiels
- `idx_business_metrics_date_period` sur métriques
- `idx_orders_active` sur commandes actives
- `idx_projects_featured` sur projets featured
- `idx_products_active_featured` sur produits actifs et featured

### Index Géospatiaux
- `idx_producers_location` GIST sur localisation producteurs
- `idx_projects_location` GIST sur localisation projets

---

## Relations et Clés Étrangères

### Relations Principales
```
users
├── user_profiles (1:1)
├── user_sessions (1:N)
├── orders (1:N)
├── subscriptions (1:N)
├── points_transactions (1:N)
├── investments (1:N)
└── monthly_allocations (1:N)

producers
├── projects (1:N)
├── products (1:N)
└── producer_metrics (1:N)

projects
├── project_updates (1:N)
└── investments (1:N)

products
├── inventory (1:N)
├── order_items (1:N)
└── stock_movements (1:N via inventory)

orders
└── order_items (1:N)

subscriptions
├── subscription_billing_history (1:N)
├── conversion_events (1:N)
└── monthly_allocations (1:N)

investments
└── investment_returns (1:N)

points_transactions
└── points_expiry_schedule (1:N)
```

---

## Extensions et Dépendances

### Extensions PostgreSQL
- `uuid-ossp` → Génération UUIDs
- `postgis` → Support géospatial (localisation producteurs/projets)
- `pg_trgm` → Recherche textuelle floue

### Extensions Supabase
- Auth intégré
- Row Level Security
- Real-time subscriptions

---

## Recommandations d'Optimisation

### Performance
1. **Partitionnement**: Tables volumineuses (points_transactions, admin_analytics)
2. **Archivage**: Anciennes données transactions (> 2 ans)
3. **Cache**: Métriques business fréquemment consultées
4. **Index composites**: Requêtes complexes analytics

### Sécurité
1. **Audit logs**: Tables sensibles (orders, investments)
2. **Encryption**: Données sensibles (paiements, PII)
3. **Rate limiting**: Actions admin critiques

### Maintenance
1. **Monitoring**: Performance queries lentes
2. **Backups**: Stratégie RPO/RTO définie
3. **Migrations**: Tests en staging avant production

---

*Document généré le: $(date)*
*Base de données: PostgreSQL/Supabase*
*Projet: Make the CHANGE*
*Version: v2.0 (avec dual billing)*
