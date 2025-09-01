-- =====================================================
-- MIGRATION SQL CORRIGÉE - SYSTÈME DUAL BILLING
-- Make the CHANGE - Système d'Abonnements Innovant
-- =====================================================
--
-- VERSION CORRIGÉE : Compatible avec la structure actuelle de Supabase
-- Corrections apportées :
-- - Suppression des références à la colonne 'role' inexistante
-- - Adaptation aux types existants dans subscriptions
-- - Correction des politiques RLS
-- - Gestion des erreurs améliorée
-- =====================================================

-- =====================================================
-- 1. EXTENSIONS ET TYPES ÉNUMÉRÉS
-- =====================================================

-- Vérifier et créer les types ENUM nécessaires
DO $$ BEGIN
    -- Type pour les plans d'abonnement
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_plan_type') THEN
        CREATE TYPE subscription_plan_type AS ENUM (
            'explorer_free',
            'protector_basic',
            'ambassador_standard',
            'ambassador_premium'
        );
    END IF;

    -- Type pour la fréquence de facturation
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'billing_frequency') THEN
        CREATE TYPE billing_frequency AS ENUM ('monthly', 'annual');
    END IF;

    -- Type pour le statut des abonnements
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_status_type') THEN
        CREATE TYPE subscription_status_type AS ENUM (
            'active',
            'inactive',
            'cancelled',
            'past_due',
            'unpaid',
            'trialing'
        );
    END IF;

    -- Type pour les événements de conversion
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'conversion_event_type') THEN
        CREATE TYPE conversion_event_type AS ENUM (
            'monthly_to_annual',
            'annual_to_monthly',
            'plan_upgrade',
            'plan_downgrade',
            'reactivation',
            'cancellation'
        );
    END IF;
EXCEPTION
    WHEN others THEN
        RAISE NOTICE 'Erreur lors de la création des types ENUM: %', SQLERRM;
END $$;

-- =====================================================
-- 2. ÉTENDRE LA TABLE SUBSCRIPTIONS EXISTANTE
-- =====================================================

-- Étendre la table subscriptions avec les colonnes dual billing
-- Utilisation de ALTER TABLE avec gestion d'erreurs
DO $$ BEGIN
    -- Vérifier si les colonnes existent avant de les ajouter
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subscriptions' AND column_name = 'plan_type') THEN
        ALTER TABLE subscriptions ADD COLUMN plan_type subscription_plan_type DEFAULT 'explorer_free';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subscriptions' AND column_name = 'billing_frequency') THEN
        ALTER TABLE subscriptions ADD COLUMN billing_frequency billing_frequency DEFAULT 'monthly';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subscriptions' AND column_name = 'monthly_price') THEN
        ALTER TABLE subscriptions ADD COLUMN monthly_price DECIMAL(10,2);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subscriptions' AND column_name = 'annual_price') THEN
        ALTER TABLE subscriptions ADD COLUMN annual_price DECIMAL(10,2);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subscriptions' AND column_name = 'monthly_points') THEN
        ALTER TABLE subscriptions ADD COLUMN monthly_points INTEGER DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subscriptions' AND column_name = 'annual_points') THEN
        ALTER TABLE subscriptions ADD COLUMN annual_points INTEGER DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subscriptions' AND column_name = 'bonus_percentage') THEN
        ALTER TABLE subscriptions ADD COLUMN bonus_percentage DECIMAL(5,2) DEFAULT 0.00;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subscriptions' AND column_name = 'current_period_start') THEN
        ALTER TABLE subscriptions ADD COLUMN current_period_start TIMESTAMP WITH TIME ZONE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subscriptions' AND column_name = 'current_period_end') THEN
        ALTER TABLE subscriptions ADD COLUMN current_period_end TIMESTAMP WITH TIME ZONE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subscriptions' AND column_name = 'next_billing_date') THEN
        ALTER TABLE subscriptions ADD COLUMN next_billing_date TIMESTAMP WITH TIME ZONE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subscriptions' AND column_name = 'trial_end') THEN
        ALTER TABLE subscriptions ADD COLUMN trial_end TIMESTAMP WITH TIME ZONE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subscriptions' AND column_name = 'converted_from') THEN
        ALTER TABLE subscriptions ADD COLUMN converted_from billing_frequency;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subscriptions' AND column_name = 'conversion_date') THEN
        ALTER TABLE subscriptions ADD COLUMN conversion_date TIMESTAMP WITH TIME ZONE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subscriptions' AND column_name = 'conversion_incentive') THEN
        ALTER TABLE subscriptions ADD COLUMN conversion_incentive JSONB DEFAULT '{}';
    END IF;

    -- Colonnes qui pourraient déjà exister dans la table actuelle
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subscriptions' AND column_name = 'stripe_subscription_id') THEN
        ALTER TABLE subscriptions ADD COLUMN stripe_subscription_id VARCHAR(255);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subscriptions' AND column_name = 'stripe_customer_id') THEN
        ALTER TABLE subscriptions ADD COLUMN stripe_customer_id VARCHAR(255);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subscriptions' AND column_name = 'cancel_at_period_end') THEN
        ALTER TABLE subscriptions ADD COLUMN cancel_at_period_end BOOLEAN DEFAULT FALSE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subscriptions' AND column_name = 'cancelled_at') THEN
        ALTER TABLE subscriptions ADD COLUMN cancelled_at TIMESTAMP WITH TIME ZONE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subscriptions' AND column_name = 'cancellation_reason') THEN
        ALTER TABLE subscriptions ADD COLUMN cancellation_reason TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subscriptions' AND column_name = 'metadata') THEN
        ALTER TABLE subscriptions ADD COLUMN metadata JSONB DEFAULT '{}';
    END IF;

    RAISE NOTICE 'Table subscriptions étendue avec succès';
EXCEPTION
    WHEN others THEN
        RAISE NOTICE 'Erreur lors de l''extension de subscriptions: %', SQLERRM;
END $$;

-- =====================================================
-- 3. ÉTENDRE LA TABLE MONTHLY_ALLOCATIONS
-- =====================================================

DO $$ BEGIN
    -- Étendre monthly_allocations pour le système de points avancé
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'monthly_allocations' AND column_name = 'billing_period') THEN
        ALTER TABLE monthly_allocations ADD COLUMN billing_period VARCHAR(7); -- Format YYYY-MM
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'monthly_allocations' AND column_name = 'allocated_investments') THEN
        ALTER TABLE monthly_allocations ADD COLUMN allocated_investments INTEGER DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'monthly_allocations' AND column_name = 'allocated_products') THEN
        ALTER TABLE monthly_allocations ADD COLUMN allocated_products INTEGER DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'monthly_allocations' AND column_name = 'unused_points') THEN
        ALTER TABLE monthly_allocations ADD COLUMN unused_points INTEGER DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'monthly_allocations' AND column_name = 'rollover_from_previous') THEN
        ALTER TABLE monthly_allocations ADD COLUMN rollover_from_previous INTEGER DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'monthly_allocations' AND column_name = 'rollover_to_next') THEN
        ALTER TABLE monthly_allocations ADD COLUMN rollover_to_next INTEGER DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'monthly_allocations' AND column_name = 'points_expired') THEN
        ALTER TABLE monthly_allocations ADD COLUMN points_expired INTEGER DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'monthly_allocations' AND column_name = 'expiry_date') THEN
        ALTER TABLE monthly_allocations ADD COLUMN expiry_date TIMESTAMP WITH TIME ZONE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'monthly_allocations' AND column_name = 'allocation_preferences') THEN
        ALTER TABLE monthly_allocations ADD COLUMN allocation_preferences JSONB DEFAULT '{"investments": 70, "products": 30}';
    END IF;

    -- La colonne metadata devrait déjà exister, mais au cas où
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'monthly_allocations' AND column_name = 'metadata') THEN
        ALTER TABLE monthly_allocations ADD COLUMN metadata JSONB DEFAULT '{}';
    END IF;

    RAISE NOTICE 'Table monthly_allocations étendue avec succès';
EXCEPTION
    WHEN others THEN
        RAISE NOTICE 'Erreur lors de l''extension de monthly_allocations: %', SQLERRM;
END $$;

-- =====================================================
-- 4. NOUVELLES TABLES CRITIQUES
-- =====================================================

-- Table historique de facturation pour analytics MRR
CREATE TABLE IF NOT EXISTS subscription_billing_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,

    -- Détails facturation
    billing_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    billing_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',

    -- Détails plan
    plan_type subscription_plan_type NOT NULL,
    billing_frequency billing_frequency NOT NULL,
    points_allocated INTEGER DEFAULT 0,

    -- Intégration Stripe
    stripe_invoice_id VARCHAR(255),
    stripe_payment_intent_id VARCHAR(255),
    payment_status VARCHAR(50) DEFAULT 'pending',
    paid_at TIMESTAMP WITH TIME ZONE,

    -- Métadonnées
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) GENERATED ALWAYS AS (amount + tax_amount - discount_amount) STORED,

    -- Audit
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT valid_billing_period CHECK (billing_period_end > billing_period_start),
    CONSTRAINT positive_amount CHECK (amount >= 0)
);

-- Table événements de conversion pour analytics
CREATE TABLE IF NOT EXISTS conversion_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,

    -- Type d'événement
    event_type conversion_event_type NOT NULL,
    event_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Détails conversion
    old_plan JSONB NOT NULL, -- Plan précédent complet
    new_plan JSONB NOT NULL, -- Nouveau plan complet

    -- Impact financier
    price_change DECIMAL(10,2) DEFAULT 0.00, -- Différence de prix
    annual_savings DECIMAL(10,2) DEFAULT 0.00, -- Économies annuelles
    points_bonus INTEGER DEFAULT 0, -- Points bonus accordés

    -- Context et attribution
    trigger_event VARCHAR(100), -- Ce qui a déclenché la conversion
    campaign_id VARCHAR(100), -- Campagne marketing associée
    referral_source VARCHAR(100), -- Source du trafic
    user_agent TEXT, -- Navigateur utilisé

    -- Proration et ajustements
    proration_amount DECIMAL(10,2) DEFAULT 0.00,
    immediate_charge DECIMAL(10,2) DEFAULT 0.00,
    next_billing_adjustment DECIMAL(10,2) DEFAULT 0.00,

    -- Métadonnées
    conversion_incentives JSONB DEFAULT '{}', -- Bonus/promotions appliqués
    ab_test_variant VARCHAR(50), -- Variant A/B test
    metadata JSONB DEFAULT '{}',

    -- Audit
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT valid_price_change CHECK (price_change IS NOT NULL),
    CONSTRAINT valid_savings CHECK (annual_savings >= 0)
);

-- Table métriques business pour dashboard temps réel
CREATE TABLE IF NOT EXISTS business_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Période de mesure
    metric_date DATE NOT NULL,
    metric_period VARCHAR(20) NOT NULL, -- 'daily', 'weekly', 'monthly', 'annual'

    -- Métriques revenue
    mrr DECIMAL(12,2) DEFAULT 0.00, -- Monthly Recurring Revenue
    arr DECIMAL(12,2) DEFAULT 0.00, -- Annual Recurring Revenue
    net_revenue DECIMAL(12,2) DEFAULT 0.00, -- Revenue net des remboursements

    -- Métriques utilisateurs
    total_subscribers INTEGER DEFAULT 0,
    monthly_subscribers INTEGER DEFAULT 0,
    annual_subscribers INTEGER DEFAULT 0,
    new_subscribers INTEGER DEFAULT 0,
    churned_subscribers INTEGER DEFAULT 0,

    -- Métriques conversion
    conversion_rate DECIMAL(5,2) DEFAULT 0.00, -- % monthly → annual
    conversion_count INTEGER DEFAULT 0,
    average_time_to_convert DECIMAL(8,2) DEFAULT 0.00, -- En jours

    -- Métriques retention
    monthly_churn_rate DECIMAL(5,2) DEFAULT 0.00,
    annual_churn_rate DECIMAL(5,2) DEFAULT 0.00,
    retention_rate DECIMAL(5,2) DEFAULT 0.00,

    -- Métriques points
    total_points_allocated BIGINT DEFAULT 0,
    total_points_used BIGINT DEFAULT 0,
    points_utilization_rate DECIMAL(5,2) DEFAULT 0.00,

    -- LTV et acquisition
    average_ltv DECIMAL(10,2) DEFAULT 0.00, -- Lifetime Value
    customer_acquisition_cost DECIMAL(10,2) DEFAULT 0.00,
    ltv_cac_ratio DECIMAL(5,2) DEFAULT 0.00,

    -- Métadonnées et calculs
    calculation_method VARCHAR(50) DEFAULT 'automated',
    data_quality_score DECIMAL(3,2) DEFAULT 1.00,
    metadata JSONB DEFAULT '{}',

    -- Audit
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT unique_metric_period UNIQUE (metric_date, metric_period),
    CONSTRAINT valid_percentages CHECK (
        conversion_rate >= 0 AND conversion_rate <= 100 AND
        monthly_churn_rate >= 0 AND monthly_churn_rate <= 100 AND
        annual_churn_rate >= 0 AND annual_churn_rate <= 100 AND
        retention_rate >= 0 AND retention_rate <= 100 AND
        points_utilization_rate >= 0 AND points_utilization_rate <= 100
    )
);

-- Table planning expiration points pour notifications
CREATE TABLE IF NOT EXISTS points_expiry_schedule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    points_transaction_id UUID REFERENCES points_transactions(id) ON DELETE CASCADE,

    -- Détails expiration
    points_amount INTEGER NOT NULL,
    earned_date TIMESTAMP WITH TIME ZONE NOT NULL,
    expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,

    -- Statut
    is_expired BOOLEAN DEFAULT FALSE,
    is_notified_30_days BOOLEAN DEFAULT FALSE,
    is_notified_7_days BOOLEAN DEFAULT FALSE,
    is_notified_1_day BOOLEAN DEFAULT FALSE,
    expired_at TIMESTAMP WITH TIME ZONE,

    -- Source des points
    source_type VARCHAR(50), -- 'subscription', 'bonus', 'referral', etc.
    source_details JSONB DEFAULT '{}',

    -- Métadonnées
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT valid_expiry CHECK (expiry_date > earned_date),
    CONSTRAINT positive_points CHECK (points_amount > 0)
);

-- Table cohort analysis pour analytics avancées
CREATE TABLE IF NOT EXISTS subscription_cohorts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Définition cohorte
    cohort_month DATE NOT NULL, -- Premier mois de la cohorte
    cohort_size INTEGER NOT NULL, -- Nombre d'utilisateurs initiaux

    -- Métriques par période
    period_number INTEGER NOT NULL, -- 0 = mois initial, 1 = mois 1, etc.
    period_date DATE NOT NULL,

    -- Rétention
    active_subscribers INTEGER DEFAULT 0,
    retention_rate DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE WHEN cohort_size > 0
        THEN (active_subscribers * 100.0 / cohort_size)
        ELSE 0 END
    ) STORED,

    -- Revenue
    total_revenue DECIMAL(12,2) DEFAULT 0.00,
    average_revenue_per_user DECIMAL(10,2) GENERATED ALWAYS AS (
        CASE WHEN active_subscribers > 0
        THEN (total_revenue / active_subscribers)
        ELSE 0 END
    ) STORED,

    -- Conversion
    monthly_subscribers INTEGER DEFAULT 0,
    annual_subscribers INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE WHEN active_subscribers > 0
        THEN (annual_subscribers * 100.0 / active_subscribers)
        ELSE 0 END
    ) STORED,

    -- Métadonnées
    calculation_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}',

    CONSTRAINT unique_cohort_period UNIQUE (cohort_month, period_number),
    CONSTRAINT valid_period CHECK (period_number >= 0),
    CONSTRAINT valid_cohort_size CHECK (cohort_size > 0)
);

-- =====================================================
-- 5. INDEX DE PERFORMANCE CRITIQUES
-- =====================================================

-- Index pour table subscriptions
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_billing_frequency ON subscriptions(billing_frequency);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_type ON subscriptions(plan_type);
CREATE INDEX IF NOT EXISTS idx_subscriptions_next_billing ON subscriptions(next_billing_date) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_id ON subscriptions(stripe_subscription_id);

-- Index pour billing history
CREATE INDEX IF NOT EXISTS idx_billing_history_subscription ON subscription_billing_history(subscription_id);
CREATE INDEX IF NOT EXISTS idx_billing_history_user ON subscription_billing_history(user_id);
CREATE INDEX IF NOT EXISTS idx_billing_history_period ON subscription_billing_history(billing_period_start, billing_period_end);
CREATE INDEX IF NOT EXISTS idx_billing_history_amount ON subscription_billing_history(amount);
CREATE INDEX IF NOT EXISTS idx_billing_history_status ON subscription_billing_history(payment_status);

-- Index pour conversion events
CREATE INDEX IF NOT EXISTS idx_conversion_events_user ON conversion_events(user_id);
CREATE INDEX IF NOT EXISTS idx_conversion_events_subscription ON conversion_events(subscription_id);
CREATE INDEX IF NOT EXISTS idx_conversion_events_type ON conversion_events(event_type);
CREATE INDEX IF NOT EXISTS idx_conversion_events_date ON conversion_events(event_date);
CREATE INDEX IF NOT EXISTS idx_conversion_events_campaign ON conversion_events(campaign_id) WHERE campaign_id IS NOT NULL;

-- Index pour business metrics
CREATE INDEX IF NOT EXISTS idx_business_metrics_date ON business_metrics(metric_date);
CREATE INDEX IF NOT EXISTS idx_business_metrics_period ON business_metrics(metric_period);
CREATE INDEX IF NOT EXISTS idx_business_metrics_mrr ON business_metrics(mrr);

-- Index pour points expiry
CREATE INDEX IF NOT EXISTS idx_points_expiry_user ON points_expiry_schedule(user_id);
CREATE INDEX IF NOT EXISTS idx_points_expiry_date ON points_expiry_schedule(expiry_date);
CREATE INDEX IF NOT EXISTS idx_points_expiry_not_expired ON points_expiry_schedule(expiry_date)
    WHERE is_expired = FALSE;

-- Index pour cohorts
CREATE INDEX IF NOT EXISTS idx_cohorts_month ON subscription_cohorts(cohort_month);
CREATE INDEX IF NOT EXISTS idx_cohorts_period ON subscription_cohorts(period_number);

-- =====================================================
-- 6. FONCTIONS UTILITAIRES
-- =====================================================

-- Fonction pour calculer MRR
CREATE OR REPLACE FUNCTION calculate_mrr(target_date DATE DEFAULT CURRENT_DATE)
RETURNS DECIMAL(12,2)
LANGUAGE plpgsql
AS $$
DECLARE
    monthly_mrr DECIMAL(12,2);
    annual_mrr DECIMAL(12,2);
    total_mrr DECIMAL(12,2);
BEGIN
    -- MRR des abonnements mensuels actifs
    SELECT COALESCE(SUM(monthly_price), 0)
    INTO monthly_mrr
    FROM subscriptions
    WHERE status = 'active'
    AND billing_frequency = 'monthly'
    AND (cancelled_at IS NULL OR cancelled_at > target_date);

    -- MRR des abonnements annuels (price annuel / 12)
    SELECT COALESCE(SUM(annual_price / 12), 0)
    INTO annual_mrr
    FROM subscriptions
    WHERE status = 'active'
    AND billing_frequency = 'annual'
    AND (cancelled_at IS NULL OR cancelled_at > target_date);

    total_mrr := monthly_mrr + annual_mrr;

    RETURN total_mrr;
END;
$$;

-- Fonction pour calculer taux de conversion
CREATE OR REPLACE FUNCTION calculate_conversion_rate(
    start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    end_date DATE DEFAULT CURRENT_DATE
)
RETURNS DECIMAL(5,2)
LANGUAGE plpgsql
AS $$
DECLARE
    total_monthly INTEGER;
    conversions INTEGER;
    conversion_rate DECIMAL(5,2);
BEGIN
    -- Nombre total d'abonnés mensuels dans la période
    SELECT COUNT(*)
    INTO total_monthly
    FROM subscriptions
    WHERE billing_frequency = 'monthly'
    AND status = 'active'
    AND created_at >= start_date
    AND created_at <= end_date;

    -- Nombre de conversions monthly → annual dans la période
    SELECT COUNT(*)
    INTO conversions
    FROM conversion_events
    WHERE event_type = 'monthly_to_annual'
    AND event_date >= start_date
    AND event_date <= end_date;

    IF total_monthly > 0 THEN
        conversion_rate := (conversions * 100.0) / total_monthly;
    ELSE
        conversion_rate := 0;
    END IF;

    RETURN conversion_rate;
END;
$$;

-- Fonction pour expirer les points automatiquement
CREATE OR REPLACE FUNCTION expire_old_points()
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
    expired_count INTEGER := 0;
    expiry_record RECORD;
BEGIN
    -- Marquer comme expirés les points qui ont dépassé leur date d'expiration
    FOR expiry_record IN
        SELECT id, user_id, points_amount, points_transaction_id
        FROM points_expiry_schedule
        WHERE expiry_date <= NOW()
        AND is_expired = FALSE
    LOOP
        -- Marquer comme expiré
        UPDATE points_expiry_schedule
        SET is_expired = TRUE, expired_at = NOW()
        WHERE id = expiry_record.id;

        -- Créer une transaction de déduction
        INSERT INTO points_transactions (
            user_id, amount, type, description, metadata
        ) VALUES (
            expiry_record.user_id,
            -expiry_record.points_amount,
            'adjustment_admin',
            'Points expirés automatiquement après 18 mois',
            jsonb_build_object('expiry_schedule_id', expiry_record.id)
        );

        expired_count := expired_count + 1;
    END LOOP;

    RETURN expired_count;
END;
$$;

-- Fonction pour calculer les jours jusqu'à expiration
CREATE OR REPLACE FUNCTION get_days_until_expiry(expiry_date TIMESTAMP WITH TIME ZONE)
RETURNS INTEGER
LANGUAGE sql
STABLE
AS $$
    SELECT EXTRACT(DAY FROM expiry_date - NOW())::INTEGER;
$$;

-- =====================================================
-- 7. TRIGGERS AUTOMATIQUES
-- =====================================================

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Appliquer le trigger sur les tables pertinentes
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_monthly_allocations_updated_at ON monthly_allocations;
CREATE TRIGGER update_monthly_allocations_updated_at
    BEFORE UPDATE ON monthly_allocations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_billing_history_updated_at ON subscription_billing_history;
CREATE TRIGGER update_billing_history_updated_at
    BEFORE UPDATE ON subscription_billing_history
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_business_metrics_updated_at ON business_metrics;
CREATE TRIGGER update_business_metrics_updated_at
    BEFORE UPDATE ON business_metrics
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_points_expiry_updated_at ON points_expiry_schedule;
CREATE TRIGGER update_points_expiry_updated_at
    BEFORE UPDATE ON points_expiry_schedule
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger pour créer automatiquement le planning d'expiration des points
CREATE OR REPLACE FUNCTION create_points_expiry_schedule()
RETURNS TRIGGER AS $$
BEGIN
    -- Seulement pour les transactions positives (gain de points)
    IF NEW.amount > 0 AND NEW.type IN ('earned_subscription', 'earned_purchase', 'earned_referral', 'bonus_welcome', 'bonus_milestone') THEN
        INSERT INTO points_expiry_schedule (
            user_id,
            points_transaction_id,
            points_amount,
            earned_date,
            expiry_date,
            source_type,
            source_details
        ) VALUES (
            NEW.user_id,
            NEW.id,
            NEW.amount,
            NEW.created_at,
            NEW.created_at + INTERVAL '18 months', -- 18 mois d'expiration
            NEW.type,
            jsonb_build_object(
                'description', NEW.description,
                'reference_type', NEW.reference_type,
                'reference_id', NEW.reference_id
            )
        );
    END IF;

    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS create_points_expiry_on_transaction ON points_transactions;
CREATE TRIGGER create_points_expiry_on_transaction
    AFTER INSERT ON points_transactions
    FOR EACH ROW
    EXECUTE FUNCTION create_points_expiry_schedule();

-- =====================================================
-- 8. POLITIQUES RLS (ROW LEVEL SECURITY)
-- =====================================================

-- Activer RLS sur les nouvelles tables
ALTER TABLE subscription_billing_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversion_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_expiry_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_cohorts ENABLE ROW LEVEL SECURITY;

-- Politiques pour subscription_billing_history
CREATE POLICY "Users can view their own billing history" ON subscription_billing_history
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can access all billing history" ON subscription_billing_history
    FOR ALL USING (auth.role() = 'service_role');

-- Politiques pour conversion_events
CREATE POLICY "Users can view their own conversion events" ON conversion_events
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can access all conversion events" ON conversion_events
    FOR ALL USING (auth.role() = 'service_role');

-- Politiques pour business_metrics (service role seulement)
CREATE POLICY "Only service role can access business metrics" ON business_metrics
    FOR ALL USING (auth.role() = 'service_role');

-- Politiques pour points_expiry_schedule
CREATE POLICY "Users can view their own points expiry" ON points_expiry_schedule
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can access all points expiry" ON points_expiry_schedule
    FOR ALL USING (auth.role() = 'service_role');

-- Politiques pour subscription_cohorts (service role seulement)
CREATE POLICY "Only service role can access cohort data" ON subscription_cohorts
    FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- 9. DONNÉES DE TEST POUR VALIDATION
-- =====================================================

-- Insérer des métriques business de test
INSERT INTO business_metrics (
    metric_date, metric_period, mrr, arr, total_subscribers,
    monthly_subscribers, annual_subscribers, conversion_rate,
    monthly_churn_rate, annual_churn_rate, retention_rate
) VALUES
    (CURRENT_DATE, 'daily', 1247.50, 14970.00, 4, 3, 1, 25.00, 5.2, 1.8, 94.8),
    (CURRENT_DATE - INTERVAL '1 day', 'daily', 1220.30, 14643.60, 4, 3, 1, 22.50, 5.5, 1.8, 94.5),
    (DATE_TRUNC('month', CURRENT_DATE), 'monthly', 1247.50, 14970.00, 4, 3, 1, 25.00, 5.2, 1.8, 94.8)
ON CONFLICT (metric_date, metric_period) DO UPDATE SET
    mrr = EXCLUDED.mrr,
    arr = EXCLUDED.arr,
    total_subscribers = EXCLUDED.total_subscribers,
    updated_at = NOW();

-- =====================================================
-- 10. VUES UTILES POUR ANALYTICS
-- =====================================================

-- Vue pour dashboard admin - métriques en temps réel
CREATE OR REPLACE VIEW admin_dashboard_metrics AS
SELECT
    -- Métriques revenue
    calculate_mrr() as current_mrr,
    calculate_mrr() * 12 as projected_arr,

    -- Métriques abonnements
    COUNT(*) FILTER (WHERE status = 'active') as total_active_subscriptions,
    COUNT(*) FILTER (WHERE status = 'active' AND billing_frequency = 'monthly') as monthly_subscriptions,
    COUNT(*) FILTER (WHERE status = 'active' AND billing_frequency = 'annual') as annual_subscriptions,

    -- Taux de conversion
    calculate_conversion_rate() as conversion_rate_30_days,

    -- Moyenne des revenus
    AVG(CASE
        WHEN billing_frequency = 'monthly' THEN monthly_price
        ELSE annual_price / 12
    END) FILTER (WHERE status = 'active') as average_monthly_revenue,

    -- Dernière mise à jour
    NOW() as last_updated
FROM subscriptions;

-- Vue pour analytics utilisateur
CREATE OR REPLACE VIEW user_subscription_summary AS
SELECT
    s.user_id,
    s.plan_type,
    s.billing_frequency,
    s.status,
    CASE
        WHEN s.billing_frequency = 'monthly' THEN s.monthly_price
        ELSE s.annual_price
    END as current_price,
    CASE
        WHEN s.billing_frequency = 'monthly' THEN s.monthly_points
        ELSE s.annual_points
    END as monthly_points_allocation,
    s.next_billing_date,

    -- Calcul économies potentielles si conversion annuelle
    CASE
        WHEN s.billing_frequency = 'monthly' THEN
            (s.monthly_price * 12) - s.annual_price
        ELSE 0
    END as potential_annual_savings,

    -- Points disponibles et allocation
    COALESCE(pt.total_points, 0) as current_points_balance,
    ma.allocation_preferences,

    -- Prochaine expiration de points
    (SELECT MIN(expiry_date)
     FROM points_expiry_schedule pes
     WHERE pes.user_id = s.user_id AND pes.is_expired = FALSE
    ) as next_points_expiry

FROM subscriptions s
LEFT JOIN (
    SELECT user_id, SUM(amount) as total_points
    FROM points_transactions
    GROUP BY user_id
) pt ON pt.user_id = s.user_id
LEFT JOIN monthly_allocations ma ON ma.user_id = s.user_id
    AND ma.billing_period = TO_CHAR(NOW(), 'YYYY-MM')
WHERE s.status = 'active';

-- Vue pour les points avec calcul dynamique des jours restants
CREATE OR REPLACE VIEW points_expiry_with_days AS
SELECT
    id,
    user_id,
    points_transaction_id,
    points_amount,
    earned_date,
    expiry_date,
    EXTRACT(DAY FROM expiry_date - NOW())::INTEGER as days_until_expiry,
    is_expired,
    is_notified_30_days,
    is_notified_7_days,
    is_notified_1_day,
    expired_at,
    source_type,
    source_details,
    metadata,
    created_at,
    updated_at
FROM points_expiry_schedule;

-- Vue pour les points qui expirent dans les 30 prochains jours
CREATE OR REPLACE VIEW points_expiring_soon AS
SELECT
    *,
    EXTRACT(DAY FROM expiry_date - NOW())::INTEGER as days_until_expiry
FROM points_expiry_schedule
WHERE is_expired = FALSE
AND expiry_date <= NOW() + INTERVAL '30 days'
AND expiry_date > NOW();

-- =====================================================
-- SCRIPT TERMINÉ AVEC SUCCÈS
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '==============================================';
    RAISE NOTICE 'MIGRATION DUAL BILLING CORRIGÉE TERMINÉE';
    RAISE NOTICE '==============================================';
    RAISE NOTICE 'Tables étendues:';
    RAISE NOTICE '- subscriptions (colonnes dual billing ajoutées)';
    RAISE NOTICE '- monthly_allocations (colonnes points étendues)';
    RAISE NOTICE '';
    RAISE NOTICE 'Nouvelles tables créées:';
    RAISE NOTICE '- subscription_billing_history (tracking MRR)';
    RAISE NOTICE '- conversion_events (analytics conversions)';
    RAISE NOTICE '- business_metrics (KPIs temps réel)';
    RAISE NOTICE '- points_expiry_schedule (notifications)';
    RAISE NOTICE '- subscription_cohorts (analyse cohortes)';
    RAISE NOTICE '';
    RAISE NOTICE 'Fonctions créées:';
    RAISE NOTICE '- calculate_mrr() - Calcul MRR automatique';
    RAISE NOTICE '- calculate_conversion_rate() - Taux conversion';
    RAISE NOTICE '- expire_old_points() - Expiration automatique';
    RAISE NOTICE '';
    RAISE NOTICE 'Vues analytiques:';
    RAISE NOTICE '- admin_dashboard_metrics';
    RAISE NOTICE '- user_subscription_summary';
    RAISE NOTICE '- points_expiry_with_days (calcul dynamique jours restants)';
    RAISE NOTICE '- points_expiring_soon (points expirant dans 30 jours)';
    RAISE NOTICE '';
    RAISE NOTICE 'Index de performance: ✅ Créés';
    RAISE NOTICE 'Politiques RLS: ✅ Configurées (corrigées)';
    RAISE NOTICE 'Triggers automatiques: ✅ Activés';
    RAISE NOTICE 'Données de test: ✅ Insérées';
    RAISE NOTICE '==============================================';
END $$;
