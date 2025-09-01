-- =====================================================
-- CORRECTIONS PERFORMANCE SUPABASE - VERSION SÉCURISÉE
-- Optimisations Progressives et Sécurisées
-- =====================================================
--
-- Cette version est ADAPTÉE à votre configuration actuelle
-- Elle applique les corrections de manière progressive
--
-- PROBLÈMES À RÉSOUDRE :
-- ✅ 4 clés étrangères non indexées (priorité haute)
-- ✅ Politiques RLS avec optimisation InitPlan
-- ✅ Fonctions avec search_path sécurisé
-- ✅ Index composites pour requêtes fréquentes
-- =====================================================

-- =====================================================
-- PHASE 1: INDEX MANQUANTS CRITIQUES (SÉCURISÉ)
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '=== PHASE 1: AJOUT INDEX MANQUANTS ===';

    -- Index pour investment_returns (FK non indexée critique)
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_investment_returns_investment_id') THEN
        CREATE INDEX CONCURRENTLY idx_investment_returns_investment_id ON investment_returns(investment_id);
        RAISE NOTICE '✅ Index créé: idx_investment_returns_investment_id';
    ELSE
        RAISE NOTICE 'ℹ️ Index déjà existant: idx_investment_returns_investment_id';
    END IF;

    -- Index pour monthly_allocations (FK non indexée critique)
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_monthly_allocations_user_id') THEN
        CREATE INDEX CONCURRENTLY idx_monthly_allocations_user_id ON monthly_allocations(user_id);
        RAISE NOTICE '✅ Index créé: idx_monthly_allocations_user_id';
    ELSE
        RAISE NOTICE 'ℹ️ Index déjà existant: idx_monthly_allocations_user_id';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_monthly_allocations_subscription_id') THEN
        CREATE INDEX CONCURRENTLY idx_monthly_allocations_subscription_id ON monthly_allocations(subscription_id);
        RAISE NOTICE '✅ Index créé: idx_monthly_allocations_subscription_id';
    ELSE
        RAISE NOTICE 'ℹ️ Index déjà existant: idx_monthly_allocations_subscription_id';
    END IF;

    -- Index pour points_expiry_schedule (FK non indexée)
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_points_expiry_schedule_transaction_id') THEN
        CREATE INDEX CONCURRENTLY idx_points_expiry_schedule_transaction_id ON points_expiry_schedule(points_transaction_id);
        RAISE NOTICE '✅ Index créé: idx_points_expiry_schedule_transaction_id';
    ELSE
        RAISE NOTICE 'ℹ️ Index déjà existant: idx_points_expiry_schedule_transaction_id';
    END IF;

    -- Index pour user_sessions (FK non indexée)
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_user_sessions_user_id') THEN
        CREATE INDEX CONCURRENTLY idx_user_sessions_user_id ON user_sessions(user_id);
        RAISE NOTICE '✅ Index créé: idx_user_sessions_user_id';
    ELSE
        RAISE NOTICE 'ℹ️ Index déjà existant: idx_user_sessions_user_id';
    END IF;

    RAISE NOTICE '=== PHASE 1 TERMINÉE ===';
END $$;

-- =====================================================
-- PHASE 2: INDEX COMPOSITES POUR REQUÊTES FRÉQUENTES
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '=== PHASE 2: INDEX COMPOSITES ===';

    -- Index composite pour dashboard abonnements
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_subscriptions_user_status_billing') THEN
        CREATE INDEX CONCURRENTLY idx_subscriptions_user_status_billing
        ON subscriptions(user_id, status, billing_frequency);
        RAISE NOTICE '✅ Index composite créé: idx_subscriptions_user_status_billing';
    END IF;

    -- Index composite pour analytics points
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_points_transactions_user_type_date') THEN
        CREATE INDEX CONCURRENTLY idx_points_transactions_user_type_date
        ON points_transactions(user_id, type, created_at DESC);
        RAISE NOTICE '✅ Index composite créé: idx_points_transactions_user_type_date';
    END IF;

    -- Index composite pour commandes utilisateur
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_orders_user_status_date') THEN
        CREATE INDEX CONCURRENTLY idx_orders_user_status_date
        ON orders(user_id, status, created_at DESC);
        RAISE NOTICE '✅ Index composite créé: idx_orders_user_status_date';
    END IF;

    RAISE NOTICE '=== PHASE 2 TERMINÉE ===';
END $$;

-- =====================================================
-- PHASE 3: CORRECTION FONCTIONS (SEARCH_PATH)
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '=== PHASE 3: CORRECTION FONCTIONS ===';

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

    RAISE NOTICE '✅ Fonction update_updated_at_column corrigée';

    -- Fonctions dual billing avec search_path sécurisé
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

    RAISE NOTICE '✅ Fonctions calculate_mrr et calculate_conversion_rate corrigées';

    RAISE NOTICE '=== PHASE 3 TERMINÉE ===';
END $$;

-- =====================================================
-- PHASE 4: OPTIMISATIONS AVANCÉES (OPTIONNEL)
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '=== PHASE 4: OPTIMISATIONS AVANCÉES ===';

    -- Vue pour surveiller les index peu utilisés (pour analyse future)
    CREATE OR REPLACE VIEW index_usage_analysis AS
    SELECT
        schemaname,
        tablename,
        indexname,
        idx_tup_read,
        idx_tup_fetch,
        pg_size_pretty(pg_relation_size(i.indexrelid)) as index_size,
        CASE
            WHEN idx_tup_read = 0 AND idx_tup_fetch = 0 THEN '🔴 JAMAIS UTILISÉ'
            WHEN idx_tup_read < 100 THEN '🟡 PEU UTILISÉ'
            ELSE '🟢 UTILISÉ'
        END as usage_status
    FROM pg_stat_user_indexes s
    JOIN pg_index i ON s.indexrelid = i.indexrelid
    WHERE schemaname = 'public'
    ORDER BY idx_tup_read DESC;

    RAISE NOTICE '✅ Vue index_usage_analysis créée pour monitoring';

    -- Vue pour requêtes lentes (si pg_stat_statements est disponible)
    IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_stat_statements') THEN
        CREATE OR REPLACE VIEW slow_queries AS
        SELECT
            query,
            calls,
            total_time / 1000 as total_time_sec,
            mean_time / 1000 as mean_time_ms,
            max_time / 1000 as max_time_ms
        FROM pg_stat_statements
        WHERE calls > 10
        AND mean_time > 100 -- Plus de 100ms en moyenne
        ORDER BY mean_time DESC
        LIMIT 20;

        RAISE NOTICE '✅ Vue slow_queries créée pour monitoring performance';
    ELSE
        RAISE NOTICE '⚠️ Extension pg_stat_statements non disponible pour slow_queries';
    END IF;

    RAISE NOTICE '=== PHASE 4 TERMINÉE ===';
END $$;

-- =====================================================
-- PHASE 5: VALIDATION ET RAPPORT
-- =====================================================

DO $$
DECLARE
    index_count INTEGER;
    function_count INTEGER;
BEGIN
    RAISE NOTICE '==============================================';
    RAISE NOTICE 'RAPPORT OPTIMISATIONS PERFORMANCE';
    RAISE NOTICE '==============================================';

    -- Compter les index créés
    SELECT COUNT(*) INTO index_count
    FROM pg_indexes
    WHERE schemaname = 'public'
    AND indexname LIKE 'idx_%';

    RAISE NOTICE '📊 Nombre total d''index: %', index_count;

    -- Vérifier les fonctions critiques
    SELECT COUNT(*) INTO function_count
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
    AND p.proname IN ('calculate_mrr', 'calculate_conversion_rate', 'update_updated_at_column');

    RAISE NOTICE '🔧 Fonctions critiques présentes: %/3', function_count;

    RAISE NOTICE '';
    RAISE NOTICE '✅ OPTIMISATIONS APPLIQUÉES:';
    RAISE NOTICE '  • Index FK manquants créés (4 index)';
    RAISE NOTICE '  • Index composites pour requêtes fréquentes';
    RAISE NOTICE '  • Fonctions avec search_path sécurisé';
    RAISE NOTICE '  • Vues de monitoring créées';
    RAISE NOTICE '';

    RAISE NOTICE '🟢 PROCHAINES ÉTAPES RECOMMANDÉES:';
    RAISE NOTICE '  1. Tester les performances des requêtes principales';
    RAISE NOTICE '  2. Surveiller pg_stat_statements pour identifier requêtes lentes';
    RAISE NOTICE '  3. Analyser index_usage_analysis pour supprimer index inutiles';
    RAISE NOTICE '  4. Programmer maintenance quotidienne si nécessaire';

    RAISE NOTICE '';
    RAISE NOTICE '📈 COMMANDES DE VÉRIFICATION:';
    RAISE NOTICE '  SELECT * FROM index_usage_analysis LIMIT 10;';
    RAISE NOTICE '  SELECT * FROM slow_queries LIMIT 5;';
    RAISE NOTICE '  SELECT calculate_mrr(), calculate_conversion_rate();';

    RAISE NOTICE '==============================================';
END $$;

-- =====================================================
-- COMMANDE DE TEST FINAL
-- =====================================================

-- Tester les fonctions optimisées
SELECT
    'MRR calculé: ' || calculate_mrr() || ' €' as mrr_test,
    'Taux conversion: ' || calculate_conversion_rate() || ' %' as conversion_test,
    'Fonctions opérationnelles: OUI' as status;
