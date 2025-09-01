-- =====================================================
-- ÉTAPE 3: CRÉATION DES NOUVELLES TABLES
-- =====================================================

-- Table historique de facturation pour analytics MRR
CREATE TABLE IF NOT EXISTS subscription_billing_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    billing_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    billing_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    plan_type subscription_plan_type NOT NULL,
    billing_frequency billing_frequency NOT NULL,
    points_allocated INTEGER DEFAULT 0,
    stripe_invoice_id VARCHAR(255),
    stripe_payment_intent_id VARCHAR(255),
    payment_status VARCHAR(50) DEFAULT 'pending',
    paid_at TIMESTAMP WITH TIME ZONE,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) GENERATED ALWAYS AS (amount + tax_amount - discount_amount) STORED,
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
    event_type conversion_event_type NOT NULL,
    event_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    old_plan JSONB NOT NULL,
    new_plan JSONB NOT NULL,
    price_change DECIMAL(10,2) DEFAULT 0.00,
    annual_savings DECIMAL(10,2) DEFAULT 0.00,
    points_bonus INTEGER DEFAULT 0,
    trigger_event VARCHAR(100),
    campaign_id VARCHAR(100),
    referral_source VARCHAR(100),
    user_agent TEXT,
    proration_amount DECIMAL(10,2) DEFAULT 0.00,
    immediate_charge DECIMAL(10,2) DEFAULT 0.00,
    next_billing_adjustment DECIMAL(10,2) DEFAULT 0.00,
    conversion_incentives JSONB DEFAULT '{}',
    ab_test_variant VARCHAR(50),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_price_change CHECK (price_change IS NOT NULL),
    CONSTRAINT valid_savings CHECK (annual_savings >= 0)
);

-- Table métriques business pour dashboard temps réel
CREATE TABLE IF NOT EXISTS business_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_date DATE NOT NULL,
    metric_period VARCHAR(20) NOT NULL,
    mrr DECIMAL(12,2) DEFAULT 0.00,
    arr DECIMAL(12,2) DEFAULT 0.00,
    net_revenue DECIMAL(12,2) DEFAULT 0.00,
    total_subscribers INTEGER DEFAULT 0,
    monthly_subscribers INTEGER DEFAULT 0,
    annual_subscribers INTEGER DEFAULT 0,
    new_subscribers INTEGER DEFAULT 0,
    churned_subscribers INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0.00,
    conversion_count INTEGER DEFAULT 0,
    average_time_to_convert DECIMAL(8,2) DEFAULT 0.00,
    monthly_churn_rate DECIMAL(5,2) DEFAULT 0.00,
    annual_churn_rate DECIMAL(5,2) DEFAULT 0.00,
    retention_rate DECIMAL(5,2) DEFAULT 0.00,
    total_points_allocated BIGINT DEFAULT 0,
    total_points_used BIGINT DEFAULT 0,
    points_utilization_rate DECIMAL(5,2) DEFAULT 0.00,
    average_ltv DECIMAL(10,2) DEFAULT 0.00,
    customer_acquisition_cost DECIMAL(10,2) DEFAULT 0.00,
    ltv_cac_ratio DECIMAL(5,2) DEFAULT 0.00,
    calculation_method VARCHAR(50) DEFAULT 'automated',
    data_quality_score DECIMAL(3,2) DEFAULT 1.00,
    metadata JSONB DEFAULT '{}',
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
    points_amount INTEGER NOT NULL,
    earned_date TIMESTAMP WITH TIME ZONE NOT NULL,
    expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
    is_expired BOOLEAN DEFAULT FALSE,
    is_notified_30_days BOOLEAN DEFAULT FALSE,
    is_notified_7_days BOOLEAN DEFAULT FALSE,
    is_notified_1_day BOOLEAN DEFAULT FALSE,
    expired_at TIMESTAMP WITH TIME ZONE,
    source_type VARCHAR(50),
    source_details JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_expiry CHECK (expiry_date > earned_date),
    CONSTRAINT positive_points CHECK (points_amount > 0)
);

-- Table cohort analysis pour analytics avancées
CREATE TABLE IF NOT EXISTS subscription_cohorts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cohort_month DATE NOT NULL,
    cohort_size INTEGER NOT NULL,
    period_number INTEGER NOT NULL,
    period_date DATE NOT NULL,
    active_subscribers INTEGER DEFAULT 0,
    retention_rate DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE WHEN cohort_size > 0
        THEN (active_subscribers * 100.0 / cohort_size)
        ELSE 0 END
    ) STORED,
    total_revenue DECIMAL(12,2) DEFAULT 0.00,
    average_revenue_per_user DECIMAL(10,2) GENERATED ALWAYS AS (
        CASE WHEN active_subscribers > 0
        THEN (total_revenue / active_subscribers)
        ELSE 0 END
    ) STORED,
    monthly_subscribers INTEGER DEFAULT 0,
    annual_subscribers INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE WHEN active_subscribers > 0
        THEN (annual_subscribers * 100.0 / active_subscribers)
        ELSE 0 END
    ) STORED,
    calculation_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}',
    CONSTRAINT unique_cohort_period UNIQUE (cohort_month, period_number),
    CONSTRAINT valid_period CHECK (period_number >= 0),
    CONSTRAINT valid_cohort_size CHECK (cohort_size > 0)
);

SELECT 'Nouvelles tables créées avec succès' as status;
