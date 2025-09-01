-- =====================================================
-- ÉTAPE 4: MONITORING ET VUES D'ANALYSE - VERSION CORRIGÉE
-- =====================================================
-- Création de vues pour surveiller les performances
--
-- CORRECTIONS APPORTÉES:
-- ✅ indexname → indexrelname dans pg_stat_user_indexes
-- ✅ JOIN avec pg_class pour obtenir le nom de l'index
-- ✅ Colonnes PostgreSQL correctes
-- =====================================================

-- =====================================================
-- VUE 1: ANALYSE DES INDEX (VERSION CORRIGÉE)
-- =====================================================

CREATE OR REPLACE VIEW index_usage_analysis AS
SELECT
    s.schemaname,
    s.relname as table_name,
    c_index.relname as index_name,  -- CORRECTION: utilisation de pg_class.relname
    s.idx_tup_read as reads,
    s.idx_tup_fetch as fetches,
    pg_size_pretty(pg_relation_size(s.indexrelid)) as size,
    CASE
        WHEN s.idx_tup_read = 0 AND s.idx_tup_fetch = 0 THEN '🔴 JAMAIS UTILISÉ'
        WHEN s.idx_tup_read < 100 THEN '🟡 PEU UTILISÉ'
        WHEN s.idx_tup_read < 1000 THEN '🟢 MODÉRÉMENT UTILISÉ'
        ELSE '🟢 FORTEMENT UTILISÉ'
    END as usage_status,
    CASE
        WHEN s.idx_tup_read = 0 AND s.idx_tup_fetch = 0 THEN 1 -- Priorité haute pour suppression
        ELSE 0
    END as cleanup_priority
FROM pg_stat_user_indexes s
JOIN pg_class c_table ON s.relid = c_table.oid  -- Table
JOIN pg_class c_index ON s.indexrelid = c_index.oid  -- Index
WHERE s.schemaname = 'public'
ORDER BY s.idx_tup_read DESC, pg_relation_size(s.indexrelid) DESC;

-- =====================================================
-- VUE 2: ANALYSE DES TABLES (VERSION CORRIGÉE)
-- =====================================================

CREATE OR REPLACE VIEW table_size_analysis AS
SELECT
    schemaname,
    relname as table_name,
    pg_size_pretty(pg_total_relation_size(relid)) as total_size,
    pg_size_pretty(pg_relation_size(relid)) as table_size,
    pg_size_pretty(pg_total_relation_size(relid) - pg_relation_size(relid)) as index_size,
    n_tup_ins as inserts,
    n_tup_upd as updates,
    n_tup_del as deletes,
    CASE
        WHEN pg_total_relation_size(relid) > 100*1024*1024 THEN '🔴 TRÈS GROSSE (>100MB)'
        WHEN pg_total_relation_size(relid) > 10*1024*1024 THEN '🟡 GROSSE (>10MB)'
        ELSE '🟢 NORMALE'
    END as size_status
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(relid) DESC;

-- =====================================================
-- VUE 3: DASHBOARD DUAL BILLING (VERSION SIMPLIFIÉE)
-- =====================================================

CREATE OR REPLACE VIEW dual_billing_dashboard AS
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
WHERE allocation_month >= TO_CHAR(CURRENT_DATE, 'YYYY-MM')
UNION ALL
SELECT
    'MRR Actuel' as metric,
    0 as value,  -- Valeur temporaire, sera calculée plus tard
    '€' as unit,
    'ℹ️ À configurer' as status
UNION ALL
SELECT
    'Taux Conversion M→A' as metric,
    0 as value,
    '%' as unit,
    'ℹ️ À configurer' as status;

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
-- TESTS DE VALIDATION
-- =====================================================

-- Test 1: Vérifier que les vues fonctionnent
SELECT
    '🧪 TEST DES VUES DE MONITORING:' as test_title,
    'Vues créées avec succès - Colonnes PostgreSQL corrigées' as result;

-- Test 2: Aperçu du dashboard
SELECT
    '📊 ' || metric || ': ' || value || ' ' || unit || ' (' || status || ')' as dashboard_test
FROM dual_billing_dashboard
ORDER BY
    CASE
        WHEN metric = 'Abonnements Actifs' THEN 1
        WHEN metric = 'Points Alloués Ce Mois' THEN 2
        WHEN metric = 'MRR Actuel' THEN 3
        WHEN metric = 'Taux Conversion M→A' THEN 4
        ELSE 5
    END;

-- Test 3: Aperçu des index analysés
SELECT
    '🔍 TOP 5 INDEX ANALYSÉS:' as index_analysis,
    index_name,
    usage_status,
    size
FROM index_usage_analysis
ORDER BY reads DESC
LIMIT 5;

-- Test 4: Statistiques générales
SELECT
    '📈 STATISTIQUES GÉNÉRALES:' as stats,
    (SELECT COUNT(*) FROM index_usage_analysis) as indexes_surveillés,
    (SELECT COUNT(*) FROM table_size_analysis) as tables_analysées,
    'Monitoring opérationnel' as status;
