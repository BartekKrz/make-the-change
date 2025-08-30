-- Migration 001: Core Tables - Users, Profiles, Projects, Producers
-- Make the CHANGE - Database Schema Implementation
-- Based on docs/03-technical/database-schema.md

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =============================================
-- USERS & AUTHENTICATION
-- =============================================

-- Table utilisateurs principale (liée à auth.users)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR UNIQUE NOT NULL,
    profile JSONB DEFAULT '{}',
    points_balance INTEGER DEFAULT 0,
    user_level VARCHAR(20) DEFAULT 'explorateur' CHECK (user_level IN ('explorateur', 'protecteur', 'ambassadeur')),
    kyc_status VARCHAR(20) DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'light', 'complete')),
    kyc_level INTEGER DEFAULT 0 CHECK (kyc_level IN (0, 1, 2)),
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
    session_token VARCHAR UNIQUE NOT NULL,
    device_info JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- PRODUCERS & PARTNERS
-- =============================================

-- Producteurs et partenaires
CREATE TABLE producers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    slug VARCHAR UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('beekeeper', 'olive_grower', 'winery', 'cooperative')),
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
    partnership_type VARCHAR(20) DEFAULT 'standard' CHECK (partnership_type IN ('standard', 'premium', 'exclusive')),
    commission_rate DECIMAL(5,4) DEFAULT 0.1500, -- 15% commission
    payment_terms INTEGER DEFAULT 30, -- jours
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    images TEXT[] DEFAULT '{}',
    documents TEXT[] DEFAULT '{}', -- contrats, certifs scannés
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- PROJECTS & ASSETS
-- =============================================

-- Projets de biodiversité soutenus par les membres
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(50) NOT NULL CHECK (type IN ('beehive', 'olive_tree', 'vineyard', 'reforestation', 'ocean_cleanup')),
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
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'funded', 'closed', 'suspended')),
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
    type VARCHAR(50) NOT NULL CHECK (type IN ('production', 'maintenance', 'harvest', 'impact')),
    title VARCHAR NOT NULL,
    content TEXT,
    metrics JSONB DEFAULT '{}', -- données de production
    images TEXT[] DEFAULT '{}',
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
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

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_level ON users(user_level);
CREATE INDEX idx_users_kyc_status ON users(kyc_status);
CREATE INDEX idx_users_points ON users(points_balance);

-- User profiles indexes
CREATE INDEX idx_user_profiles_name ON user_profiles(first_name, last_name);

-- Producers indexes
CREATE INDEX idx_producers_slug ON producers(slug);
CREATE INDEX idx_producers_type ON producers(type);
CREATE INDEX idx_producers_status ON producers(status);
CREATE INDEX idx_producers_location ON producers USING GIST(location);

-- Projects indexes
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_type ON projects(type);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_producer ON projects(producer_id);
CREATE INDEX idx_projects_location ON projects USING GIST(location);
CREATE INDEX idx_projects_featured ON projects(featured) WHERE featured = true;

-- Project updates indexes
CREATE INDEX idx_project_updates_project ON project_updates(project_id);
CREATE INDEX idx_project_updates_type ON project_updates(type);
CREATE INDEX idx_project_updates_published ON project_updates(published_at) WHERE published_at IS NOT NULL;

-- Producer metrics indexes
CREATE INDEX idx_producer_metrics_producer ON producer_metrics(producer_id);
CREATE INDEX idx_producer_metrics_type ON producer_metrics(metric_type);
CREATE INDEX idx_producer_metrics_period ON producer_metrics(period);

-- =============================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================

-- Function pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_producers_updated_at BEFORE UPDATE ON producers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
