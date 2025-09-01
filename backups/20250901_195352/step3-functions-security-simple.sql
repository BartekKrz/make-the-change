-- =====================================================
-- ÉTAPE 3: SÉCURISATION DES FONCTIONS - VERSION SIMPLE
-- =====================================================
-- Copiez-collez CHAQUE commande individuellement
--
-- INSTRUCTIONS:
-- 1. Les fonctions seront recréées automatiquement avec sécurité renforcée
-- 2. Copiez-collez toutes les commandes CREATE OR REPLACE
-- =====================================================

-- =====================================================
-- FONCTIONS À RECRÉER AVEC SÉCURITÉ RENFORCÉE
-- =====================================================

-- Fonction update_updated_at_column avec search_path sécurisé
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Fonction calculate_mrr optimisée pour dual billing
CREATE OR REPLACE FUNCTION calculate_mrr()
RETURNS DECIMAL(12,2)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    total_mrr DECIMAL(12,2) := 0;
BEGIN
    SELECT COALESCE(SUM(
        CASE
            WHEN billing_frequency = 'monthly' THEN monthly_price
            WHEN billing_frequency = 'annual' THEN annual_price / 12
            ELSE 0
        END
    ), 0)
    INTO total_mrr
    FROM subscriptions
    WHERE status = 'active';

    RETURN total_mrr;
END;
$$;

-- Fonction calculate_conversion_rate pour analytics
CREATE OR REPLACE FUNCTION calculate_conversion_rate()
RETURNS DECIMAL(5,2)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    monthly_count INTEGER := 0;
    annual_count INTEGER := 0;
    conversion_rate DECIMAL(5,2) := 0;
BEGIN
    SELECT COUNT(*) INTO monthly_count
    FROM subscriptions
    WHERE status = 'active' AND billing_frequency = 'monthly';

    SELECT COUNT(*) INTO annual_count
    FROM subscriptions
    WHERE status = 'active' AND billing_frequency = 'annual';

    IF monthly_count + annual_count > 0 THEN
        conversion_rate := (annual_count * 100.0) / (monthly_count + annual_count);
    END IF;

    RETURN conversion_rate;
END;
$$;

-- =====================================================
-- VÉRIFICATION DES FONCTIONS CRÉÉES
-- =====================================================

SELECT
    'VÉRIFICATION FONCTIONS SÉCURISÉES:' as status,
    CASE WHEN EXISTS (
        SELECT 1 FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public' AND p.proname = 'update_updated_at_column'
    ) THEN '✅ update_updated_at_column créée' ELSE '❌ update_updated_at_column manquante' END as update_function,
    CASE WHEN EXISTS (
        SELECT 1 FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public' AND p.proname = 'calculate_mrr'
    ) THEN '✅ calculate_mrr créée' ELSE '❌ calculate_mrr manquante' END as mrr_function,
    CASE WHEN EXISTS (
        SELECT 1 FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public' AND p.proname = 'calculate_conversion_rate'
    ) THEN '✅ calculate_conversion_rate créée' ELSE '❌ calculate_conversion_rate manquante' END as conversion_function;

-- =====================================================
-- TEST DES FONCTIONS
-- =====================================================

-- Tester les fonctions recréées
SELECT
    '🧪 Test calculate_mrr(): ' ||
    CASE
        WHEN calculate_mrr() >= 0 THEN '✅ OK (' || calculate_mrr() || ' €)'
        ELSE '❌ ERREUR'
    END as test_mrr,
    '🧪 Test calculate_conversion_rate(): ' ||
    CASE
        WHEN calculate_conversion_rate() >= 0 THEN '✅ OK (' || calculate_conversion_rate() || ' %)'
        ELSE '❌ ERREUR'
    END as test_conversion;
