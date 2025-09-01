-- =====================================================
-- ÉTAPE 2: EXTENSION DES TABLES EXISTANTES
-- =====================================================

-- Étendre la table subscriptions avec les colonnes dual billing
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

    -- Colonnes qui pourraient déjà exister
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

-- Étendre monthly_allocations pour le système de points avancé
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'monthly_allocations' AND column_name = 'billing_period') THEN
        ALTER TABLE monthly_allocations ADD COLUMN billing_period VARCHAR(7);
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

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'monthly_allocations' AND column_name = 'metadata') THEN
        ALTER TABLE monthly_allocations ADD COLUMN metadata JSONB DEFAULT '{}';
    END IF;

    RAISE NOTICE 'Table monthly_allocations étendue avec succès';
EXCEPTION
    WHEN others THEN
        RAISE NOTICE 'Erreur lors de l''extension de monthly_allocations: %', SQLERRM;
END $$;

SELECT 'Extension des tables terminée avec succès' as status;
