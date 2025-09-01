-- =====================================================
-- ÉTAPES 5-9: FONCTIONS, TRIGGERS, POLITIQUES, DONNÉES, VUES
-- =====================================================

-- =====================================================
-- FONCTIONS UTILITAIRES
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

-- =====================================================
-- TRIGGERS AUTOMATIQUES
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

-- =====================================================
-- POLITIQUES RLS (ROW LEVEL SECURITY)
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

-- =====================================================
-- VUES UTILES POUR ANALYTICS
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

SELECT 'Migration complète terminée avec succès' as status;
