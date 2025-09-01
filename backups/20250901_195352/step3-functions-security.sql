-- =====================================================
-- ÉTAPE 3: SÉCURISATION DES FONCTIONS
-- =====================================================
-- Correction des fonctions avec search_path sécurisé
-- et optimisation des fonctions dual billing
--
-- IMPACT ATTENDU:
-- • Sécurité renforcée (pas d'injection SQL)
-- • Fonctions dual billing optimisées
-- • Performance accrue des calculs
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '=== ÉTAPE 3: SÉCURISATION FONCTIONS ===';

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

    RAISE NOTICE '✅ Fonction update_updated_at_column sécurisée';

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

    RAISE NOTICE '✅ Fonction calculate_mrr optimisée';

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

    RAISE NOTICE '✅ Fonction calculate_conversion_rate créée';

    -- Fonction expire_old_points (si elle existe déjà)
    IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid
               WHERE n.nspname = 'public' AND p.proname = 'expire_old_points') THEN

        -- Recréer avec search_path sécurisé
        CREATE OR REPLACE FUNCTION expire_old_points()
        RETURNS INTEGER
        SECURITY DEFINER
        SET search_path = public
        LANGUAGE plpgsql
        AS $$
        DECLARE
            expired_count INTEGER := 0;
        BEGIN
            -- Marquer les points expirés
            UPDATE points_expiry_schedule
            SET is_expired = TRUE, expired_at = NOW()
            WHERE expiry_date < NOW()
            AND is_expired = FALSE;

            GET DIAGNOSTICS expired_count = ROW_COUNT;

            -- Créer des transactions d'ajustement pour les points expirés
            INSERT INTO points_transactions (
                user_id, type, amount, balance_after, reference_type, reference_id, description
            )
            SELECT
                pes.user_id,
                'adjustment_admin'::character varying,
                -pes.points_amount,
                COALESCE(pt.balance_after, 0) - pes.points_amount,
                'points_expiry'::character varying,
                pes.id,
                'Points expirés automatiquement'
            FROM points_expiry_schedule pes
            LEFT JOIN LATERAL (
                SELECT balance_after
                FROM points_transactions pt
                WHERE pt.user_id = pes.user_id
                ORDER BY pt.created_at DESC
                LIMIT 1
            ) pt ON TRUE
            WHERE pes.is_expired = TRUE
            AND pes.expired_at >= NOW() - INTERVAL '1 hour'; -- Uniquement les nouveaux expirés

            RETURN expired_count;
        END;
        $$;

        RAISE NOTICE '✅ Fonction expire_old_points sécurisée';
    ELSE
        RAISE NOTICE 'ℹ️ Fonction expire_old_points n''existe pas encore';
    END IF;

    RAISE NOTICE '=== ÉTAPE 3 TERMINÉE AVEC SUCCÈS ===';
END $$;

-- VÉRIFICATION: Tester les fonctions
SELECT
    'Fonction update_updated_at_column: ' || CASE WHEN pg_get_function_identity_arguments(p.oid) LIKE '%update_updated_at_column%' THEN 'OK' ELSE 'ERREUR' END as update_function,
    'Fonction calculate_mrr: ' || CASE WHEN EXISTS (SELECT 1 FROM pg_proc p2 JOIN pg_namespace n ON p2.pronamespace = n.oid WHERE n.nspname = 'public' AND p2.proname = 'calculate_mrr') THEN 'OK' ELSE 'ERREUR' END as mrr_function,
    'Fonction calculate_conversion_rate: ' || CASE WHEN EXISTS (SELECT 1 FROM pg_proc p3 JOIN pg_namespace n ON p3.pronamespace = n.oid WHERE n.nspname = 'public' AND p3.proname = 'calculate_conversion_rate') THEN 'OK' ELSE 'ERREUR' END as conversion_function
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND p.proname = 'update_updated_at_column'
LIMIT 1;
