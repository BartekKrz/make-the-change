-- =====================================================
-- ÉTAPE 4: MONITORING ET VUES D'ANALYSE
-- =====================================================
-- Création de vues pour surveiller les performances
-- et analyser l'usage des index
--
-- IMPACT ATTENDU:
-- • Visibilité complète sur les performances
-- • Détection proactive des problèmes
-- • Optimisations futures facilitées
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '=== ÉTAPE 4: MONITORING ET ANALYSE ===';

    -- Vue pour analyser l'usage des index (remplacement de pg_stat_user_indexes)
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
            WHEN idx_tup_read < 1000 THEN '🟢 MODÉRÉMENT UTILISÉ'
            ELSE '🟢 FORTEMENT UTILISÉ'
        END as usage_status,
        CASE
            WHEN idx_tup_read = 0 AND idx_tup_fetch = 0 THEN 1 -- Priorité haute pour suppression
            ELSE 0
        END as cleanup_priority
    FROM pg_stat_user_indexes s
    JOIN pg_index i ON s.indexrelid = i.indexrelid
    WHERE schemaname = 'public'
    ORDER BY idx_tup_read DESC, pg_relation_size(i.indexrelid) DESC;

    RAISE NOTICE '✅ Vue index_usage_analysis créée pour monitoring';

    -- Vue pour les requêtes lentes (si pg_stat_statements est disponible)
    IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_stat_statements') THEN
        CREATE OR REPLACE VIEW slow_queries AS
        SELECT
            query,
            calls,
            total_time / 1000 as total_time_sec,
            mean_time / 1000 as mean_time_ms,
            max_time / 1000 as max_time_ms,
            CASE
                WHEN mean_time > 1000 THEN '🔴 TRÈS LENTE (>1s)'
                WHEN mean_time > 100 THEN '🟡 LENTE (>100ms)'
                ELSE '🟢 RAPIDE'
            END as performance_status
        FROM pg_stat_statements
        WHERE calls > 10
        AND mean_time > 50 -- Plus de 50ms en moyenne
        ORDER BY mean_time DESC
        LIMIT 20;

        RAISE NOTICE '✅ Vue slow_queries créée pour monitoring performance';
    ELSE
        RAISE NOTICE '⚠️ Extension pg_stat_statements non disponible pour slow_queries';
        RAISE NOTICE '💡 Pour activer: CREATE EXTENSION pg_stat_statements;';
    END IF;

    -- Vue pour analyser les tables volumineuses
    CREATE OR REPLACE VIEW table_size_analysis AS
    SELECT
        schemaname,
        tablename,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as total_size,
        pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as table_size,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) as index_size,
        n_tup_ins as inserts,
        n_tup_upd as updates,
        n_tup_del as deletes,
        CASE
            WHEN pg_total_relation_size(schemaname||'.'||tablename) > 100*1024*1024 THEN '🔴 TRÈS GROSSE (>100MB)'
            WHEN pg_total_relation_size(schemaname||'.'||tablename) > 10*1024*1024 THEN '🟡 GROSSE (>10MB)'
            ELSE '🟢 NORMALE'
        END as size_status
    FROM pg_stat_user_tables
    WHERE schemaname = 'public'
    ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

    RAISE NOTICE '✅ Vue table_size_analysis créée';

    -- Vue pour le dashboard des métriques dual billing
    CREATE OR REPLACE VIEW dual_billing_dashboard AS
    SELECT
        'MRR Actuel' as metric,
        calculate_mrr() as value,
        '€' as unit,
        CASE
            WHEN calculate_mrr() > 1000 THEN '🟢 EXCELLENT'
            WHEN calculate_mrr() > 500 THEN '🟡 BON'
            ELSE '🔴 À AMÉLIORER'
        END as status
    UNION ALL
    SELECT
        'Taux Conversion M→A' as metric,
        calculate_conversion_rate() as value,
        '%' as unit,
        CASE
            WHEN calculate_conversion_rate() > 25 THEN '🟢 EXCELLENT'
            WHEN calculate_conversion_rate() > 15 THEN '🟡 BON'
            ELSE '🔴 À AMÉLIORER'
        END as status
    UNION ALL
    SELECT
        'Abonnements Actifs' as metric,
        COUNT(*)::numeric as value,
        'total' as unit,
        CASE
            WHEN COUNT(*) > 10 THEN '🟢 EXCELLENT'
            WHEN COUNT(*) > 5 THEN '🟡 BON'
            ELSE '🔴 À AMÉLIORER'
        END as status
    FROM subscriptions
    WHERE status = 'active'
    UNION ALL
    SELECT
        'Points Alloués Ce Mois' as metric,
        COALESCE(SUM(points_allocated), 0)::numeric as value,
        'points' as unit,
        'ℹ️ INFO' as status
    FROM monthly_allocations
    WHERE allocation_month >= TO_CHAR(CURRENT_DATE, 'YYYY-MM');

    RAISE NOTICE '✅ Vue dual_billing_dashboard créée';

    RAISE NOTICE '=== ÉTAPE 4 TERMINÉE AVEC SUCCÈS ===';
END $$;

-- VÉRIFICATION: Tester les vues créées
DO $$
DECLARE
    view_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO view_count
    FROM information_schema.views
    WHERE table_schema = 'public'
    AND table_name IN ('index_usage_analysis', 'slow_queries', 'table_size_analysis', 'dual_billing_dashboard');

    RAISE NOTICE '=== RAPPORT VUES CRÉÉES ===';
    RAISE NOTICE 'Nombre de vues créées: %/4', view_count;

    IF view_count >= 3 THEN
        RAISE NOTICE '✅ Monitoring opérationnel';
    ELSE
        RAISE NOTICE '⚠️ Certaines vues n''ont pas été créées';
    END IF;
END $$;

-- TEST: Afficher le dashboard dual billing
SELECT * FROM dual_billing_dashboard;
