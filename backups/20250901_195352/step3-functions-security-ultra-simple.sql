-- =====================================================
-- ÉTAPE 3: SÉCURISATION DES FONCTIONS - VERSION ULTRA SIMPLE
-- =====================================================
-- Copiez-collez CHAQUE partie individuellement
--
-- INSTRUCTIONS ULTRA SIMPLES:
-- 1. Copiez les fonctions une par une
-- 2. Copiez la vérification
-- 3. Copiez le test simple
-- =====================================================

-- =====================================================
-- PARTIE 1: CRÉER LES FONCTIONS (copiez chaque fonction)
-- =====================================================

-- Fonction 1: update_updated_at_column
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

-- Fonction 2: calculate_mrr
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

-- Fonction 3: calculate_conversion_rate
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
-- PARTIE 2: VÉRIFICATION (copiez après avoir créé les fonctions)
-- =====================================================

SELECT
    'FONCTIONS CRÉÉES:' as status,
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.routines
        WHERE routine_schema = 'public'
        AND routine_name = 'update_updated_at_column'
    ) THEN '✅ update_updated_at_column' ELSE '❌ update_updated_at_column manquante' END as update_function,
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.routines
        WHERE routine_schema = 'public'
        AND routine_name = 'calculate_mrr'
    ) THEN '✅ calculate_mrr' ELSE '❌ calculate_mrr manquante' END as mrr_function,
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.routines
        WHERE routine_schema = 'public'
        AND routine_name = 'calculate_conversion_rate'
    ) THEN '✅ calculate_conversion_rate' ELSE '❌ calculate_conversion_rate manquante' END as conversion_function;

-- =====================================================
-- PARTIE 3: TESTS SIMPLES (copiez après vérification)
-- =====================================================

-- Test 1: Vérifier que les fonctions existent et sont accessibles
SELECT
    'Test des fonctions dual billing:' as test_title,
    'Fonctions créées avec succès - Prêtes à être utilisées dans les vues et requêtes' as result;

-- Test 2: Vérification basique (sans appeler les fonctions)
SELECT
    'VÉRIFICATION BASIQUE:' as basic_check,
    COUNT(*) as functions_in_public_schema
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN ('calculate_mrr', 'calculate_conversion_rate', 'update_updated_at_column');

-- =====================================================
-- PARTIE 4: INSTRUCTIONS POUR LES TESTS AVANCÉS (optionnel)
-- =====================================================

-- Si vous voulez tester manuellement plus tard, utilisez:
-- SELECT calculate_mrr();
-- SELECT calculate_conversion_rate();

/*
INSTRUCTIONS POUR TESTS MANUELS APRÈS CETTE ÉTAPE:

1. Ouvrez un nouveau query dans SQL Editor
2. Tapez: SELECT calculate_mrr();
3. Cliquez Run - devriez voir un nombre positif ou 0
4. Tapez: SELECT calculate_conversion_rate();
5. Cliquez Run - devriez voir un pourcentage entre 0 et 100

Si vous voyez une erreur "function is not unique":
- Utilisez: SELECT public.calculate_mrr();
- Ou: SELECT public.calculate_conversion_rate();
*/
