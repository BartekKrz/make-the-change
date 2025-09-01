-- =====================================================
-- ÉTAPE 4: MONITORING ET VUES D'ANALYSE - VERSION SIMPLE
-- =====================================================
-- Création de vues pour surveiller les performances
--
-- INSTRUCTIONS:
-- 1. Copiez-collez chaque CREATE VIEW individuellement
-- 2. Vérifiez à la fin que les vues ont été créées
-- =====================================================

-- =====================================================
-- VUES DE MONITORING À CRÉER
-- =====================================================

-- Vue pour analyser l'usage des index
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

-- =====================================================
-- VÉRIFICATION DES VUES CRÉÉES
-- =====================================================

SELECT
    'VÉRIFICATION VUES DE MONITORING:' as status,
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.views
        WHERE table_schema = 'public' AND table_name = 'index_usage_analysis'
    ) THEN '✅ index_usage_analysis créée' ELSE '❌ index_usage_analysis manquante' END as index_analysis,
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.views
        WHERE table_schema = 'public' AND table_name = 'table_size_analysis'
    ) THEN '✅ table_size_analysis créée' ELSE '❌ table_size_analysis manquante' END as table_analysis,
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.views
        WHERE table_schema = 'public' AND table_name = 'dual_billing_dashboard'
    ) THEN '✅ dual_billing_dashboard créée' ELSE '❌ dual_billing_dashboard manquante' END as dashboard;

-- =====================================================
-- TEST DES VUES CRÉÉES
-- =====================================================

-- Tester le dashboard dual billing
SELECT
    '📊 ' || metric || ': ' ||
    CASE
        WHEN unit = '€' THEN value || ' ' || unit
        WHEN unit = '%' THEN ROUND(value, 1) || ' ' || unit
        ELSE ROUND(value, 0) || ' ' || unit
    END || ' ' || status as dashboard_test
FROM dual_billing_dashboard
ORDER BY
    CASE
        WHEN metric = 'MRR Actuel' THEN 1
        WHEN metric = 'Taux Conversion M→A' THEN 2
        WHEN metric = 'Abonnements Actifs' THEN 3
        WHEN metric = 'Points Alloués Ce Mois' THEN 4
        ELSE 5
    END;

-- Aperçu des index les plus utilisés
SELECT
    '🔍 TOP 5 INDEX LES PLUS UTILISÉS:' as analysis,
    indexname,
    usage_status,
    index_size
FROM index_usage_analysis
WHERE usage_status LIKE '🟢%'
ORDER BY idx_tup_read DESC
LIMIT 5;
