# 🚀 Guide d'Exécution Manuelle de la Migration Dual Billing

## 📋 Instructions Simples pour Supabase SQL Editor

---

## 🎯 **Méthode Recommandée : Copier/Coller dans SQL Editor**

### **Étape 1 : Ouvrir SQL Editor**
1. Allez sur votre projet Supabase : `https://ebmjxinsyyjwshnynwwu.supabase.co`
2. Cliquez sur **"SQL Editor"** dans le menu latéral
3. Cliquez sur **"New Query"**

### **Étape 2 : Exécuter Étape par Étape**

---

## 📄 **ÉTAPE 1 : Création des Types ENUM**

**Copiez-collez ce code dans SQL Editor et cliquez "Run" :**

```sql
-- =====================================================
-- ÉTAPE 1: CRÉATION DES TYPES ENUM
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

-- Vérification
SELECT 'Types ENUM créés avec succès' as status;
```

**Résultat attendu :** `"Types ENUM créés avec succès"`

---

## 📄 **ÉTAPE 2 : Extension des Tables Existantes**

**Copiez-collez ce code dans SQL Editor et cliquez "Run" :**

```sql
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

    -- La colonne metadata devrait déjà exister, mais au cas où
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'monthly_allocations' AND column_name = 'metadata') THEN
        ALTER TABLE monthly_allocations ADD COLUMN metadata JSONB DEFAULT '{}';
    END IF;

    RAISE NOTICE 'Table monthly_allocations étendue avec succès';
EXCEPTION
    WHEN others THEN
        RAISE NOTICE 'Erreur lors de l''extension de monthly_allocations: %', SQLERRM;
END $$;

SELECT 'Extension des tables terminée avec succès' as status;
```

**Résultat attendu :** `"Extension des tables terminée avec succès"`

---

## 📄 **ÉTAPE 3 : Création des Nouvelles Tables**

**Copiez-collez ce code dans SQL Editor et cliquez "Run" :**

```sql
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
```

**Résultat attendu :** `"Nouvelles tables créées avec succès"`

---

## 📄 **ÉTAPE 4 : Index de Performance**

**Copiez-collez ce code dans SQL Editor et cliquez "Run" :**

```sql
-- =====================================================
-- ÉTAPE 4: INDEX DE PERFORMANCE CRITIQUES
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

SELECT 'Index de performance créés avec succès' as status;
```

**Résultat attendu :** `"Index de performance créés avec succès"`

---

## 📄 **ÉTAPE 5 : Fonctions, Triggers, Politiques RLS**

**⚠️ Attention :** Cette étape contient beaucoup de code. Copiez-collez **tout le contenu** du fichier `step5_remaining.sql` dans le SQL Editor.

**Résultat attendu :** `"Migration complète terminée avec succès"`

---

## 📄 **ÉTAPE 6 : Données de Test (Optionnel)**

```sql
-- =====================================================
-- DONNÉES DE TEST
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

SELECT 'Données de test insérées avec succès' as status;
```

---

## ✅ **Vérifications Post-Migration**

Après chaque étape, vérifiez que tout fonctionne :

### **Vérifier les Types ENUM :**
```sql
SELECT n.nspname AS schema_name,
       t.typname AS type_name,
       string_agg(e.enumlabel, ', ') AS enum_values
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
JOIN pg_namespace n ON t.typnamespace = n.oid
WHERE t.typname IN ('subscription_plan_type', 'billing_frequency', 'subscription_status_type', 'conversion_event_type')
GROUP BY n.nspname, t.typname;
```

### **Vérifier les Nouvelles Tables :**
```sql
SELECT schemaname, tablename, tableowner
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('subscription_billing_history', 'conversion_events', 'business_metrics', 'points_expiry_schedule', 'subscription_cohorts');
```

### **Vérifier les Colonnes Ajoutées :**
```sql
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'subscriptions'
AND column_name IN ('plan_type', 'billing_frequency', 'monthly_price', 'annual_price')
ORDER BY table_name, ordinal_position;
```

### **Tester les Fonctions :**
```sql
-- Tester calculate_mrr
SELECT calculate_mrr() as current_mrr;

-- Tester calculate_conversion_rate
SELECT calculate_conversion_rate() as conversion_rate;
```

---

## 🎯 **Résumé de l'Exécution**

| Étape | Description | Durée estimée | Status |
|-------|-------------|----------------|---------|
| 1 | Types ENUM | 5 sec | ✅ Prêt |
| 2 | Extension tables | 10 sec | ✅ Prêt |
| 3 | Nouvelles tables | 15 sec | ✅ Prêt |
| 4 | Index | 10 sec | ✅ Prêt |
| 5 | Fonctions/Triggers/RLS | 20 sec | ✅ Prêt |
| 6 | Données test | 5 sec | ✅ Optionnel |

**Temps total estimé : 5-10 minutes**

---

## 🚨 **En Cas de Problème**

### **Erreur "relation already exists"**
- **Cause :** Objet déjà créé
- **Solution :** Continuer, c'est normal

### **Erreur "permission denied"**
- **Cause :** Permissions insuffisantes
- **Solution :** Vérifier votre rôle dans Supabase

### **Erreur "column does not exist"**
- **Cause :** Structure différente
- **Solution :** Vérifier la structure des tables existantes

### **Timeout**
- **Cause :** Requête trop longue
- **Solution :** Exécuter en étapes plus petites

---

## 🎉 **Félicitations !**

Une fois toutes les étapes terminées, votre système dual billing sera opérationnel avec :

- ✅ **Abonnements mensuels et annuels** avec économies automatiques
- ✅ **Système de points avancé** avec expiration intelligente
- ✅ **Analytics temps réel** pour le suivi des performances
- ✅ **Cohortes et conversions** pour l'analyse marketing
- ✅ **Notifications automatiques** d'expiration des points

**🚀 Prêt à accueillir vos premiers abonnements !**
