-- Migration 002: E-commerce Tables - Products, Orders, Categories, Points
-- Make the CHANGE - Database Schema Implementation
-- Based on docs/03-technical/database-schema.md

-- =============================================
-- E-COMMERCE STRUCTURE
-- =============================================

-- Catégories de produits
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    slug VARCHAR UNIQUE NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES categories(id),
    image_url TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    seo_title VARCHAR(255),
    seo_description TEXT,
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
    fulfillment_method VARCHAR(20) NOT NULL DEFAULT 'dropship' CHECK (fulfillment_method IN ('stock', 'dropship')),
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
    min_tier VARCHAR(20) DEFAULT 'explorateur' CHECK (min_tier IN ('explorateur', 'protecteur', 'ambassadeur')),
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

-- Mouvements stock détaillés
CREATE TABLE stock_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inventory_id UUID REFERENCES inventory(id),
    type VARCHAR(20) NOT NULL CHECK (type IN ('in', 'out', 'adjustment', 'reserved', 'released')),
    quantity INTEGER NOT NULL,
    reference_type VARCHAR(20), -- 'order', 'restock', 'adjustment'
    reference_id UUID, -- ID de la commande, du réassort, etc.
    reason TEXT,
    cost_per_unit_cents INTEGER,
    performed_by UUID, -- admin user
    created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- ORDERS & TRANSACTIONS
-- =============================================

-- Commandes
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
    
    -- Montants
    subtotal_points INTEGER NOT NULL,
    shipping_cost_points INTEGER DEFAULT 0,
    tax_points INTEGER DEFAULT 0,
    total_points INTEGER NOT NULL,
    
    -- Points utilisés/gagnés
    points_used INTEGER NOT NULL,
    points_earned INTEGER DEFAULT 0,
    
    -- Paiement
    payment_method VARCHAR(20) CHECK (payment_method IN ('points', 'stripe_card', 'stripe_sepa', 'mixed')),
    stripe_payment_intent_id VARCHAR,
    
    -- Adresses
    shipping_address JSONB NOT NULL,
    billing_address JSONB,
    
    -- Tracking
    tracking_number VARCHAR,
    carrier VARCHAR(50),
    
    -- Métadonnées
    notes TEXT,
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    shipped_at TIMESTAMP,
    delivered_at TIMESTAMP
);

-- Items de commande
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price_points INTEGER NOT NULL,
    total_price_points INTEGER NOT NULL,
    product_snapshot JSONB, -- snapshot du produit au moment de la commande
    created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- SUBSCRIPTIONS & POINTS SYSTEM
-- =============================================

-- Abonnements des membres (Niveau Ambassadeur) - DUAL BILLING
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    stripe_subscription_id VARCHAR UNIQUE,
    stripe_customer_id VARCHAR NOT NULL,
    
    -- Détails abonnement
    plan_type VARCHAR(20) NOT NULL CHECK (plan_type IN ('monthly_standard', 'monthly_premium', 'annual_standard', 'annual_premium')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'cancelled', 'unpaid')),
    
    -- Pricing
    monthly_price_eur DECIMAL(10,2) NOT NULL,
    monthly_points_allocation INTEGER NOT NULL, -- points alloués par mois
    
    -- Billing
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    next_billing_date TIMESTAMP,
    cancel_at_period_end BOOLEAN DEFAULT false,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    cancelled_at TIMESTAMP,
    ended_at TIMESTAMP
);

-- Transactions de points détaillées
CREATE TABLE points_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    type VARCHAR(30) NOT NULL CHECK (type IN ('earned_subscription', 'earned_purchase', 'earned_referral', 'spent_order', 'spent_investment', 'adjustment_admin', 'bonus_welcome', 'bonus_milestone')),
    amount INTEGER NOT NULL, -- positif pour gain, négatif pour dépense
    balance_after INTEGER NOT NULL, -- solde après transaction
    
    -- Références
    reference_type VARCHAR(20), -- 'order', 'subscription', 'referral', 'investment'
    reference_id UUID,
    
    -- Metadata
    description TEXT,
    metadata JSONB DEFAULT '{}',
    expires_at TIMESTAMP, -- pour points avec expiration
    processed_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Historique des allocations mensuelles (pour audit)
CREATE TABLE monthly_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID REFERENCES subscriptions(id),
    user_id UUID REFERENCES users(id),
    allocation_month VARCHAR(7) NOT NULL, -- 'YYYY-MM'
    points_allocated INTEGER NOT NULL,
    allocated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(subscription_id, allocation_month)
);

-- =============================================
-- INVESTMENTS SYSTEM
-- =============================================

-- Investissements utilisateurs dans les projets
CREATE TABLE investments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    project_id UUID REFERENCES projects(id),
    amount_points INTEGER NOT NULL,
    amount_eur_equivalent DECIMAL(10,2) NOT NULL, -- équivalent euro au moment de l'investissement
    
    -- Statut et retours
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'matured', 'cancelled')),
    expected_return_rate DECIMAL(5,4), -- taux de retour attendu (ex: 0.0500 pour 5%)
    maturity_date DATE,
    
    -- Tracking des retours
    returns_received_points INTEGER DEFAULT 0,
    last_return_date TIMESTAMP,
    
    -- Métadonnées
    investment_terms JSONB DEFAULT '{}',
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Retours d'investissement
CREATE TABLE investment_returns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    investment_id UUID REFERENCES investments(id),
    return_period VARCHAR(7) NOT NULL, -- 'YYYY-MM' ou 'YYYY-Q1'
    points_returned INTEGER NOT NULL,
    return_rate_actual DECIMAL(5,4), -- taux réel pour cette période
    distribution_date TIMESTAMP DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Categories indexes
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_active ON categories(is_active) WHERE is_active = true;

-- Products indexes
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_producer ON products(producer_id);
CREATE INDEX idx_products_active ON products(is_active) WHERE is_active = true;
CREATE INDEX idx_products_featured ON products(featured) WHERE featured = true;
CREATE INDEX idx_products_tier ON products(min_tier);
CREATE INDEX idx_products_price ON products(price_points);

-- Inventory indexes
CREATE INDEX idx_inventory_product ON inventory(product_id);
CREATE INDEX idx_inventory_sku ON inventory(sku);
CREATE INDEX idx_inventory_low_stock ON inventory(quantity_available) WHERE quantity_available <= reorder_threshold;

-- Orders indexes
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at);
CREATE INDEX idx_orders_stripe_payment ON orders(stripe_payment_intent_id);

-- Order items indexes
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- Subscriptions indexes
CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_sub ON subscriptions(stripe_subscription_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_next_billing ON subscriptions(next_billing_date) WHERE status = 'active';

-- Points transactions indexes
CREATE INDEX idx_points_transactions_user ON points_transactions(user_id);
CREATE INDEX idx_points_transactions_type ON points_transactions(type);
CREATE INDEX idx_points_transactions_created ON points_transactions(created_at);
CREATE INDEX idx_points_transactions_reference ON points_transactions(reference_type, reference_id);

-- Investments indexes
CREATE INDEX idx_investments_user ON investments(user_id);
CREATE INDEX idx_investments_project ON investments(project_id);
CREATE INDEX idx_investments_status ON investments(status);
CREATE INDEX idx_investments_maturity ON investments(maturity_date) WHERE status = 'active';

-- =============================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON inventory FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_investments_updated_at BEFORE UPDATE ON investments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
