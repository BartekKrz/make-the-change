# Database Schema - Make the CHANGE

**Schéma PostgreSQL 15 optimisé pour la plateforme "Community-Supported Biodiversity" avec un système de points à valeur garantie.**

## 🗄️ Vue d'Ensemble

### Architecture Base de Données
```yaml
Database: PostgreSQL 15 (Supabase)
Extensions: uuid-ossp, postgis, pg_trgm
Cache Strategy: Materialized views (native PostgreSQL)
Backup: Point-in-time recovery (PITR) Supabase
Performance: Indexes optimisés + query monitoring
```

## 📊 Schéma Complet

### Core Tables

#### Users & Authentication
```sql
-- Table utilisateurs principale
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR UNIQUE NOT NULL,
    encrypted_password VARCHAR NOT NULL,
    profile JSONB DEFAULT '{}',
    points_balance INTEGER DEFAULT 0,
    user_level VARCHAR(20) DEFAULT 'explorateur', -- explorateur, protecteur, ambassadeur
    kyc_status VARCHAR(20) DEFAULT 'pending', -- pending, light, complete
    kyc_level INTEGER DEFAULT 0, -- 0: email, 1: light (€100), 2: complete (€1000+)
    preferences JSONB DEFAULT '{}',
    last_login_at TIMESTAMP,
    email_verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Profils utilisateurs étendus
CREATE TABLE user_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    date_of_birth DATE,
    phone VARCHAR(20),
    address JSONB, -- {street, city, postal_code, country}
    bio TEXT,
    avatar_url TEXT,
    social_links JSONB DEFAULT '{}',
    notification_preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Sessions et authentification
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR NOT NULL,
    device_info JSONB DEFAULT '{}',
    ip_address INET,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Investissements individuels dans des projets spécifiques  
CREATE TABLE investments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id),
    investment_type VARCHAR(50) NOT NULL, -- 'ruche', 'olivier', 'parcelle_familiale'
    amount_eur INTEGER NOT NULL, -- Montant en euros (50, 80, 150, etc.)
    points_generated INTEGER NOT NULL, -- Points accordés (avec bonus)
    bonus_percentage DECIMAL(5,2) NOT NULL, -- Pourcentage bonus (30%, 31%, 40%, etc.)
    investment_date TIMESTAMP DEFAULT NOW(),
    points_expiry_date TIMESTAMP NOT NULL, -- 18 mois après investment_date
    status VARCHAR(20) DEFAULT 'active', -- active, expired, cancelled
    specific_tracking_id VARCHAR, -- ID spécifique ruche/olivier pour suivi personnalisé
    notes TEXT, -- Notes personnalisées du protecteur
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Index pour les requêtes courantes
CREATE INDEX idx_investments_user_id ON investments(user_id);
CREATE INDEX idx_investments_project_id ON investments(project_id);
CREATE INDEX idx_investments_status ON investments(status);
CREATE INDEX idx_investments_expiry ON investments(points_expiry_date);
```

#### Projects & Assets
```sql
-- Projets de biodiversité soutenus par les membres
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(50) NOT NULL, -- 'beehive', 'olive_tree', 'vineyard'
    name VARCHAR NOT NULL,
    slug VARCHAR UNIQUE NOT NULL, -- URL-friendly name
    description TEXT,
    long_description TEXT,
    location GEOGRAPHY(POINT, 4326) NOT NULL,
    address JSONB NOT NULL, -- {street, city, region, country}
    producer_id UUID REFERENCES producers(id),
    -- Le financement des projets est désormais un objectif global et non plus une somme d'investissements individuels
    target_budget INTEGER NOT NULL, -- Budget nécessaire pour le projet en centimes
    current_funding INTEGER DEFAULT 0, -- Financement actuel reçu via les investissements et abonnements
    funding_progress DECIMAL(5,2) DEFAULT 0.0, -- pourcentage financé
    status VARCHAR(20) DEFAULT 'active', -- active, funded, closed, suspended
    launch_date DATE,
    maturity_date DATE,
    certification_labels TEXT[] DEFAULT '{}', -- bio, demeter, etc.
    impact_metrics JSONB DEFAULT '{}', -- CO2, biodiversité, etc.
    images TEXT[] DEFAULT '{}',
    metadata JSONB DEFAULT '{}', -- données spécifiques par type
    seo_title VARCHAR(255),
    seo_description TEXT,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Mises à jour de production des projets
CREATE TABLE project_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'production', 'maintenance', 'harvest', 'impact'
    title VARCHAR NOT NULL,
    content TEXT,
    metrics JSONB DEFAULT '{}', -- données de production
    images TEXT[] DEFAULT '{}',
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### Subscriptions & Points
```sql
-- Abonnements des membres (Niveau Ambassadeur)
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    subscription_type VARCHAR(30) NOT NULL, -- 'ambassadeur_standard', 'ambassadeur_premium'
    amount_eur INTEGER NOT NULL, -- montant en euros (200, 350)
    points_total INTEGER NOT NULL, -- total points générés par l'abonnement (280, 525)
    bonus_percentage DECIMAL(5,2) NOT NULL, -- Pourcentage bonus (40%, 50%)
    project_allocation JSONB DEFAULT '{}', -- Allocation flexible projets soutenus
    payment_intent_id VARCHAR, -- Stripe payment intent
    payment_status VARCHAR(20) DEFAULT 'pending', -- pending, completed, failed
    start_date TIMESTAMP DEFAULT NOW(),
    end_date TIMESTAMP NOT NULL, -- start_date + 1 an
    points_expiry_date TIMESTAMP NOT NULL, -- 18 mois après start_date
    status VARCHAR(20) DEFAULT 'active', -- active, expired, cancelled
    auto_renew BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Transactions de points
CREATE TABLE points_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    type VARCHAR(20) NOT NULL, -- 'earned', 'spent', 'expired', 'bonus', 'adjustment'
    amount INTEGER NOT NULL, -- positif pour gain, négatif pour dépense
    balance_after INTEGER NOT NULL, -- solde après transaction
    source_type VARCHAR(50), -- 'investment', 'subscription', 'purchase', 'bonus', 'manual'
    source_id UUID, -- ID de la source (subscription_id, order_id, etc.)
    reference_id VARCHAR, -- référence externe si nécessaire
    multiplier DECIMAL(3,2) DEFAULT 1.0, -- bonus saisonnier/timing
    expires_at TIMESTAMP, -- 18 mois après génération
    expiry_warning_sent BOOLEAN DEFAULT false,
    description TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Points en attente d'expiration (optimisation queries)
CREATE TABLE points_expiry_schedule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    transaction_id UUID REFERENCES points_transactions(id),
    points_amount INTEGER NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    warning_60d_sent BOOLEAN DEFAULT false,
    warning_30d_sent BOOLEAN DEFAULT false,
    warning_7d_sent BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'active', -- active, expired, used
    created_at TIMESTAMP DEFAULT NOW()
);

-- Statistiques points par utilisateur (materialized view)
CREATE MATERIALIZED VIEW user_points_summary AS
SELECT 
    user_id,
    SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) as total_earned,
    SUM(CASE WHEN amount < 0 THEN ABS(amount) ELSE 0 END) as total_spent,
    SUM(amount) as current_balance,
    COUNT(CASE WHEN type = 'earned' THEN 1 END) as earnings_count,
    COUNT(CASE WHEN type = 'spent' THEN 1 END) as purchases_count,
    MAX(created_at) as last_activity,
    SUM(CASE WHEN expires_at > NOW() AND amount > 0 THEN amount ELSE 0 END) as active_points,
    SUM(CASE WHEN expires_at BETWEEN NOW() AND NOW() + INTERVAL '60 days' AND amount > 0 THEN amount ELSE 0 END) as expiring_soon
FROM points_transactions 
WHERE type IN ('earned', 'spent', 'bonus')
GROUP BY user_id;
```

#### E-commerce System
```sql
-- Catégories de produits
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    slug VARCHAR UNIQUE NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES categories(id),
    sort_order INTEGER DEFAULT 0,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    seo_title VARCHAR(255),
    seo_description TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Produits e-commerce (MODIFIÉ - Modèle Hybride)
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    slug VARCHAR UNIQUE NOT NULL,
    short_description TEXT,
    description TEXT,
    category_id UUID REFERENCES categories(id),
    producer_id UUID REFERENCES producers(id),
    price_points INTEGER NOT NULL, -- prix en points
    price_eur_equivalent DECIMAL(10,2), -- prix équivalent euros (info, 1 point = 1€)
    
    -- NOUVEAU: Modèle fulfillment hybride
    fulfillment_method VARCHAR(20) NOT NULL DEFAULT 'dropship', -- 'stock', 'dropship'
    is_hero_product BOOLEAN DEFAULT FALSE, -- héros produits en micro-stock
    stock_quantity INTEGER DEFAULT 0, -- pour produits en stock uniquement
    stock_management BOOLEAN DEFAULT true,
    weight_grams INTEGER, -- pour calculs shipping
    dimensions JSONB, -- {length, width, height} en cm
    images TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    variants JSONB DEFAULT '{}', -- variations (taille, couleur, etc.)
    nutrition_facts JSONB DEFAULT '{}',
    allergens TEXT[] DEFAULT '{}',
    certifications TEXT[] DEFAULT '{}', -- bio, fair-trade, etc.
    origin_country VARCHAR(2), -- code ISO pays
    seasonal_availability JSONB DEFAULT '{}',
    min_tier VARCHAR(20) DEFAULT 'explorateur', -- niveau minimum requis (explorateur, protecteur, ambassadeur)
    featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    launch_date DATE,
    discontinue_date DATE,
    seo_title VARCHAR(255),
    seo_description TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Stock tracking et mouvements
CREATE TABLE stock_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id),
    type VARCHAR(20) NOT NULL, -- 'in', 'out', 'adjustment', 'reserved', 'released'
    quantity INTEGER NOT NULL,
    reason VARCHAR(50), -- 'purchase', 'restock', 'correction', 'damage'
    reference_id UUID, -- order_id ou autre référence
    notes TEXT,
    previous_stock INTEGER,
    new_stock INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### Orders & Fulfillment
```sql
-- Commandes
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR UNIQUE NOT NULL, -- format: MTC-2025-001234
    user_id UUID REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, processing, shipped, delivered, cancelled
    total_points INTEGER NOT NULL,
    total_eur_equivalent DECIMAL(10,2), -- valeur euros équivalente
    item_count INTEGER NOT NULL,
    weight_total_grams INTEGER DEFAULT 0,
    
    -- Adresses
    shipping_address JSONB NOT NULL,
    billing_address JSONB,
    
    -- Livraison
    shipping_method VARCHAR(50), -- 'standard', 'express', 'pickup'
    shipping_cost_points INTEGER DEFAULT 0,
    estimated_delivery DATE,
    tracking_number VARCHAR,
    carrier VARCHAR(50),
    
    -- Statuts et dates
    confirmed_at TIMESTAMP,
    shipped_at TIMESTAMP,
    delivered_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    cancellation_reason TEXT,
    
    -- Métadonnées
    notes TEXT,
    special_instructions TEXT,
    gift_message TEXT,
    payment_reference VARCHAR, -- référence transaction points
    source VARCHAR(20) DEFAULT 'web', -- web, mobile, admin
    metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Articles de commande
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    product_name VARCHAR NOT NULL, -- snapshot du nom
    product_slug VARCHAR NOT NULL, -- snapshot du slug
    price_points INTEGER NOT NULL, -- prix au moment de l'achat
    quantity INTEGER NOT NULL,
    total_points INTEGER NOT NULL, -- price_points × quantity
    weight_grams INTEGER DEFAULT 0,
    variant_info JSONB DEFAULT '{}', -- variante choisie
    product_snapshot JSONB DEFAULT '{}', -- snapshot produit complet
    created_at TIMESTAMP DEFAULT NOW()
);

-- Historique des statuts de commande
CREATE TABLE order_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL,
    notes TEXT,
    created_by UUID REFERENCES users(id), -- admin qui a changé le statut
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### Partners & Partner App (NOUVEAU - Modèle Hybride)
```sql
-- Comptes utilisateurs app partenaires (NOUVEAU)
CREATE TABLE partner_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID REFERENCES producers(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(20) CHECK (role IN ('owner', 'staff')) NOT NULL,
    permissions JSONB DEFAULT '{}', -- permissions granulaires par projet
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP,
    device_tokens TEXT[] DEFAULT '{}', -- pour push notifications
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Sessions app partenaires
CREATE TABLE partner_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_user_id UUID REFERENCES partner_users(id) ON DELETE CASCADE,
    token_hash VARCHAR NOT NULL,
    device_info JSONB DEFAULT '{}',
    ip_address INET,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Updates partenaires avec modération (NOUVEAU)
CREATE TABLE project_updates_v2 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    author_id UUID REFERENCES partner_users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    update_type VARCHAR(50) NOT NULL, -- 'milestone', 'routine', 'event'
    status VARCHAR(20) CHECK (status IN ('draft', 'pending', 'published', 'rejected')) DEFAULT 'draft',
    media_urls TEXT[] DEFAULT '{}', -- URLs S3/R2 des médias uploadés
    media_metadata JSONB DEFAULT '{}', -- tailles, formats, thumbnails
    location GEOGRAPHY(POINT, 4326), -- géotag optionnel
    moderation_notes TEXT, -- notes admin si rejeté/approuvé
    moderated_by UUID, -- admin qui a modéré
    moderated_at TIMESTAMP,
    published_at TIMESTAMP,
    priority VARCHAR(10) DEFAULT 'medium', -- high, medium, low
    engagement_metrics JSONB DEFAULT '{}', -- vues, likes futurs
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Gestion micro-stock héros (NOUVEAU)
CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    sku VARCHAR(100) NOT NULL UNIQUE,
    quantity_available INTEGER NOT NULL DEFAULT 0,
    quantity_reserved INTEGER DEFAULT 0, -- réservé pour commandes
    reorder_threshold INTEGER NOT NULL DEFAULT 10, -- seuil réassort
    reorder_quantity INTEGER NOT NULL DEFAULT 50, -- quantité réassort
    cost_price_cents INTEGER NOT NULL, -- prix d'achat grossiste
    supplier_reference VARCHAR(255), -- référence fournisseur
    last_restock_date TIMESTAMP,
    last_stockout_date TIMESTAMP,
    location_in_warehouse VARCHAR(100), -- emplacement micro-hub
    expiry_date DATE, -- DDM si applicable
    batch_number VARCHAR(100), -- numéro de lot
    rotation_days INTEGER, -- rotation moyenne en jours
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Mouvements stock détaillés (NOUVEAU)
CREATE TABLE inventory_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inventory_id UUID REFERENCES inventory(id),
    movement_type VARCHAR(20) NOT NULL, -- 'in', 'out', 'reserved', 'released', 'adjustment'
    quantity INTEGER NOT NULL, -- positif = entrée, négatif = sortie
    reference_type VARCHAR(50), -- 'order', 'restock', 'adjustment', 'damage', 'return'
    reference_id UUID, -- order_id, shipment_id, etc.
    cost_price_cents INTEGER, -- pour entrées de stock
    previous_quantity INTEGER NOT NULL,
    new_quantity INTEGER NOT NULL,
    notes TEXT,
    created_by UUID, -- user_id ou partner_user_id
    created_at TIMESTAMP DEFAULT NOW()
);

-- Expéditions hybrides - stock MTC + dropshipping (NOUVEAU)
CREATE TABLE shipments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id),
    shipment_type VARCHAR(20) NOT NULL, -- 'stock' (MTC), 'dropship' (partenaire)
    fulfillment_source VARCHAR(50), -- 'mtc_micro_hub', 'habeebee', 'ilanga_nature'
    partner_id UUID REFERENCES producers(id), -- si dropshipping
    
    -- Tracking
    tracking_number VARCHAR(255),
    carrier VARCHAR(100),
    service_level VARCHAR(50), -- 'standard', 'express', 'next_day'
    
    -- Statuts et dates
    status VARCHAR(20) DEFAULT 'pending', -- pending, picked, shipped, in_transit, delivered, exception
    picked_at TIMESTAMP, -- préparation commande
    shipped_at TIMESTAMP, -- expédié
    estimated_delivery TIMESTAMP,
    delivered_at TIMESTAMP,
    exception_reason TEXT,
    
    -- Détails colis
    weight_grams INTEGER,
    dimensions JSONB, -- {length, width, height}
    packaging_type VARCHAR(50), -- 'box', 'envelope', 'tube'
    
    -- Coûts
    shipping_cost_cents INTEGER, -- coût réel expédition
    insurance_cents INTEGER DEFAULT 0,
    
    -- Qualité & satisfaction
    delivery_rating INTEGER, -- 1-5 stars
    delivery_feedback TEXT,
    photo_proof_url TEXT, -- photo remise colis si disponible
    
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Alertes stock et réassort (NOUVEAU)
CREATE TABLE inventory_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inventory_id UUID REFERENCES inventory(id),
    alert_type VARCHAR(30) NOT NULL, -- 'low_stock', 'out_of_stock', 'expiry_warning', 'slow_rotation'
    severity VARCHAR(10) NOT NULL, -- 'low', 'medium', 'high', 'critical'
    message TEXT NOT NULL,
    threshold_value INTEGER, -- seuil déclenché
    current_value INTEGER, -- valeur actuelle
    resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP,
    resolved_by UUID,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### Producers & Partners
```sql
-- Producteurs et partenaires
CREATE TABLE producers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    slug VARCHAR UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'beekeeper', 'olive_grower', 'winery', 'cooperative'
    description TEXT,
    story TEXT, -- histoire du producteur
    location GEOGRAPHY(POINT, 4326),
    address JSONB NOT NULL,
    contact_info JSONB DEFAULT '{}', -- email, phone, website
    social_media JSONB DEFAULT '{}', -- Instagram, Facebook, etc.
    certifications TEXT[] DEFAULT '{}', -- bio, demeter, fair-trade
    specialties TEXT[] DEFAULT '{}', -- miel d'acacia, huile extra vierge
    capacity_info JSONB DEFAULT '{}', -- nb ruches, hectares, etc.
    partnership_start DATE,
    partnership_type VARCHAR(20) DEFAULT 'standard', -- standard, premium, exclusive
    commission_rate DECIMAL(5,4) DEFAULT 0.1500, -- 15% commission
    payment_terms INTEGER DEFAULT 30, -- jours
    status VARCHAR(20) DEFAULT 'active', -- active, inactive, suspended
    images TEXT[] DEFAULT '{}',
    documents TEXT[] DEFAULT '{}', -- contrats, certifs scannés
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Métriques de production des partenaires
CREATE TABLE producer_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    producer_id UUID REFERENCES producers(id),
    metric_type VARCHAR(50) NOT NULL, -- 'honey_production', 'olive_harvest', 'co2_offset'
    period VARCHAR(20) NOT NULL, -- 'Q1-2025', 'annual-2024'
    value DECIMAL(12,4) NOT NULL,
    unit VARCHAR(20) NOT NULL, -- 'kg', 'liters', 'tons_co2'
    measurement_date DATE NOT NULL,
    verified BOOLEAN DEFAULT false,
    verification_doc_url TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## 🚀 Performance Optimizations

### Indexes Critiques
```sql
-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_level_status ON users(user_level, kyc_status);
CREATE INDEX idx_users_points_balance ON users(points_balance DESC);

-- Projects
CREATE INDEX idx_projects_location ON projects USING GIST(location);
CREATE INDEX idx_projects_type_status ON projects(type, status);
CREATE INDEX idx_projects_featured ON projects(featured, status) WHERE featured = true;
CREATE INDEX idx_projects_funding ON projects(funding_progress, status);

-- Subscriptions
CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status_end_date ON subscriptions(status, end_date);
CREATE INDEX idx_subscriptions_type ON subscriptions(subscription_type);

-- Points
CREATE INDEX idx_points_user_type ON points_transactions(user_id, type);
CREATE INDEX idx_points_expiry ON points_transactions(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX idx_points_source ON points_transactions(source_type, source_id);
CREATE INDEX idx_points_balance ON points_transactions(user_id, created_at DESC);

-- Products & Orders (MODIFIÉ - Hybride)
CREATE INDEX idx_products_category ON products(category_id, is_active);
CREATE INDEX idx_products_points ON products(price_points, is_active);
CREATE INDEX idx_products_featured ON products(featured, is_active) WHERE featured = true;
CREATE INDEX idx_products_fulfillment ON products(fulfillment_method, is_active);
CREATE INDEX idx_products_hero ON products(is_hero_product, is_active) WHERE is_hero_product = true;
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
CREATE INDEX idx_orders_status_date ON orders(status, created_at DESC);

-- NOUVEAUX Index pour tables hybrides
CREATE INDEX idx_partner_users_partner ON partner_users(partner_id, is_active);
CREATE INDEX idx_partner_users_email ON partner_users(email);
CREATE INDEX idx_partner_sessions_user ON partner_sessions(partner_user_id);

CREATE INDEX idx_project_updates_v2_status ON project_updates_v2(status, created_at DESC);
CREATE INDEX idx_project_updates_v2_project ON project_updates_v2(project_id, status);
CREATE INDEX idx_project_updates_v2_author ON project_updates_v2(author_id, created_at DESC);
CREATE INDEX idx_project_updates_v2_moderation ON project_updates_v2(status, moderated_at) WHERE status IN ('pending', 'published');

CREATE INDEX idx_inventory_product ON inventory(product_id);
CREATE INDEX idx_inventory_reorder ON inventory(reorder_threshold, quantity_available) WHERE quantity_available <= reorder_threshold;
CREATE INDEX idx_inventory_expiry ON inventory(expiry_date) WHERE expiry_date IS NOT NULL;

CREATE INDEX idx_inventory_movements_inventory ON inventory_movements(inventory_id, created_at DESC);
CREATE INDEX idx_inventory_movements_reference ON inventory_movements(reference_type, reference_id);

CREATE INDEX idx_shipments_order ON shipments(order_id);
CREATE INDEX idx_shipments_type_status ON shipments(shipment_type, status);
CREATE INDEX idx_shipments_partner ON shipments(partner_id) WHERE partner_id IS NOT NULL;

CREATE INDEX idx_inventory_alerts_inventory ON inventory_alerts(inventory_id, resolved);
CREATE INDEX idx_inventory_alerts_severity ON inventory_alerts(severity, created_at DESC) WHERE resolved = false;
```

### Materialized Views pour Cache
```sql
-- Vue des abonnements (Ambassadeurs) par utilisateur
CREATE MATERIALIZED VIEW user_subscription_summary AS
SELECT 
    user_id,
    COUNT(*) as total_subscriptions,
    SUM(amount_eur) as total_spent_eur,
    SUM(points_total) as total_points_earned,
    MIN(start_date) as first_subscription_date,
    MAX(end_date) as last_subscription_end_date,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_subscriptions
FROM subscriptions 
GROUP BY user_id;

CREATE UNIQUE INDEX idx_user_subscription_summary_user ON user_subscription_summary(user_id);

-- Vue des projets populaires
CREATE MATERIALIZED VIEW popular_projects AS
SELECT 
    p.*,
    COUNT(s.id) as subscriber_count,
    SUM(s.amount_eur) as total_raised_cents,
    MAX(s.start_date) as last_subscription_date
FROM projects p
-- Jointure à affiner : les Ambassadeurs ont une allocation flexible, les Protecteurs un lien direct via la table 'investments'
-- LEFT JOIN subscriptions s ON p.id = s.project_id AND s.status = 'active'
WHERE p.status = 'active'
GROUP BY p.id
ORDER BY subscriber_count DESC, total_raised_cents DESC;

CREATE UNIQUE INDEX idx_popular_projects_id ON popular_projects(id);

-- Vue métriques hybrides stock + dropshipping (NOUVEAU)
CREATE MATERIALIZED VIEW hybrid_performance_metrics AS
SELECT 
    'stock' as fulfillment_type,
    COUNT(DISTINCT p.id) as product_count,
    COUNT(DISTINCT oi.order_id) as order_count,
    SUM(oi.total_points) as total_points_revenue,
    AVG(oi.price_points) as avg_points_per_item,
    SUM(i.cost_price_cents * oi.quantity) / 100.0 as total_cost_eur,
    (SUM(oi.total_points) - SUM(i.cost_price_cents * oi.quantity) / 100.0) / SUM(oi.total_points) * 100 as margin_percentage
FROM products p
JOIN inventory i ON p.id = i.product_id
JOIN order_items oi ON p.id = oi.product_id
JOIN orders o ON oi.order_id = o.id
WHERE p.fulfillment_method = 'stock' 
  AND o.status NOT IN ('cancelled')
  AND o.created_at >= NOW() - INTERVAL '30 days'
UNION ALL
SELECT 
    'dropship' as fulfillment_type,
    COUNT(DISTINCT p.id) as product_count,
    COUNT(DISTINCT oi.order_id) as order_count,
    SUM(oi.total_points) as total_points_revenue,
    AVG(oi.price_points) as avg_points_per_item,
    SUM(oi.total_points * 0.22) as total_commission_eur, -- 22% commission moyenne
    (1.0 - 0.22) * 100 as margin_percentage -- 78% margin après commission
FROM products p
JOIN order_items oi ON p.id = oi.product_id
JOIN orders o ON oi.order_id = o.id
WHERE p.fulfillment_method = 'dropship' 
  AND o.status NOT IN ('cancelled')
  AND o.created_at >= NOW() - INTERVAL '30 days';

-- Vue alertes stock (NOUVEAU)
CREATE MATERIALIZED VIEW inventory_status_overview AS
SELECT 
    i.id,
    p.name as product_name,
    p.is_hero_product,
    i.quantity_available,
    i.reorder_threshold,
    CASE 
        WHEN i.quantity_available <= 0 THEN 'out_of_stock'
        WHEN i.quantity_available <= i.reorder_threshold THEN 'low_stock'
        ELSE 'ok'
    END as stock_status,
    i.rotation_days,
    CASE 
        WHEN i.rotation_days > 90 THEN 'slow_rotation'
        WHEN i.rotation_days > 60 THEN 'medium_rotation'
        ELSE 'fast_rotation'
    END as rotation_status,
    i.last_restock_date,
    i.expiry_date,
    CASE 
        WHEN i.expiry_date IS NOT NULL AND i.expiry_date <= NOW() + INTERVAL '30 days' THEN true
        ELSE false
    END as expiry_warning
FROM inventory i
JOIN products p ON i.product_id = p.id
WHERE p.is_active = true;

-- Refresh automatique via cron jobs
-- SELECT cron.schedule('refresh-user-summary', '0 2 * * *', 'REFRESH MATERIALIZED VIEW CONCURRENTLY user_subscription_summary;');
-- SELECT cron.schedule('refresh-popular-projects', '0 3 * * *', 'REFRESH MATERIALIZED VIEW CONCURRENTLY popular_projects;');
-- SELECT cron.schedule('refresh-hybrid-metrics', '0 4 * * *', 'REFRESH MATERIALIZED VIEW CONCURRENTLY hybrid_performance_metrics;');
-- SELECT cron.schedule('refresh-inventory-status', '0 */6 * * *', 'REFRESH MATERIALIZED VIEW CONCURRENTLY inventory_status_overview;');
```

### Fonctions Utilitaires
```sql
-- Fonction vérification expiry points
CREATE OR REPLACE FUNCTION get_expiring_points(user_id_param UUID, days_ahead INTEGER DEFAULT 60)
RETURNS TABLE(transaction_id UUID, points_amount INTEGER, expires_at TIMESTAMP) AS $
BEGIN
    RETURN QUERY
    SELECT pt.id, pt.amount, pt.expires_at
    FROM points_transactions pt
    WHERE pt.user_id = user_id_param
      AND pt.amount > 0
      AND pt.expires_at BETWEEN NOW() AND NOW() + (days_ahead || ' days')::INTERVAL
      AND pt.type = 'earned'
    ORDER BY pt.expires_at ASC;
END;
$ LANGUAGE plpgsql;

-- Trigger mise à jour balance points
CREATE OR REPLACE FUNCTION update_user_points_balance()
RETURNS TRIGGER AS $
BEGIN
    UPDATE users 
    SET points_balance = (
        SELECT COALESCE(SUM(amount), 0)
        FROM points_transactions 
        WHERE user_id = NEW.user_id
          AND (expires_at IS NULL OR expires_at > NOW())
    )
    WHERE id = NEW.user_id;
    
    RETURN NEW;
END;
$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_points_balance
    AFTER INSERT OR UPDATE ON points_transactions
    FOR EACH ROW EXECUTE FUNCTION update_user_points_balance();
```

## 🔒 Sécurité & Permissions

### Row Level Security (RLS)
```sql
-- Activer RLS sur tables sensibles
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour users
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Politiques RLS pour subscriptions
CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all subscriptions" ON subscriptions FOR ALL USING (auth.has_role('admin'));

-- Politiques RLS pour points_transactions
CREATE POLICY "Users can view own points" ON points_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert points" ON points_transactions FOR INSERT WITH CHECK (true);
```

### Audit Trail
```sql
-- Table d'audit pour actions sensibles
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL, -- INSERT, UPDATE, DELETE
    old_values JSONB,
    new_values JSONB,
    user_id UUID,
    user_role VARCHAR(50),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_log_table_record ON audit_log(table_name, record_id);
CREATE INDEX idx_audit_log_user ON audit_log(user_id, created_at DESC);
```

## 📊 Monitoring & Analytics

### Vues Analytics
```sql
-- Vue analytics business
CREATE VIEW business_metrics AS
SELECT 
    'daily' as period,
    DATE(created_at) as date,
    COUNT(DISTINCT user_id) as new_ambassadors,
    COUNT(*) as new_subscriptions,
    SUM(amount_eur) as subscription_revenue_eur,
    AVG(amount_eur) as avg_subscription_eur
FROM subscriptions 
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
UNION ALL
SELECT 
    'monthly' as period,
    DATE_TRUNC('month', created_at)::DATE as date,
    COUNT(DISTINCT user_id) as new_ambassadors,
    COUNT(*) as new_subscriptions,
    SUM(amount_eur) as subscription_revenue_eur,
    AVG(amount_eur) as avg_subscription_eur
FROM subscriptions 
WHERE created_at >= NOW() - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', created_at);
```

---

*Schéma optimisé pour le nouveau modèle, performances, scalabilité et intégrité des données.*