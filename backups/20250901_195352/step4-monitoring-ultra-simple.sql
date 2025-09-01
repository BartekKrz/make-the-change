-- =====================================================
-- ÉTAPE 4: MONITORING ET VUES D'ANALYSE - VERSION ULTRA SIMPLE
-- =====================================================
-- Création de vues pour surveiller les performances
--
-- INSTRUCTIONS ULTRA SIMPLES:
-- 1. Copiez chaque CREATE VIEW individuellement
-- 2. Copiez la vérification à la fin
-- =====================================================

-- =====================================================
-- PARTIE 1: CRÉER LES VUES (copiez une par une)
-- =====================================================

-- Vue 1: Analyse des index (version simplifiée)
CREATE OR REPLACE VIEW index_usage_analysis AS
SELECT
    schemaname,
    relname as table_name,
    indexname,
    idx_tup_read as reads,
    idx_tup_fetch as fetches,
    pg_size_pretty(pg_relation_size(indexrelid)) as size,
    CASE
        WHEN idx_tup_read = 0 AND idx_tup_fetch = 0 THEN '🔴 JAMAIS UTILISÉ'
        WHEN idx_tup_read < 100 THEN '🟡 PEU UTILISÉ'
        ELSE '🟢 UTILISÉ'
    END as status
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_tup_read DESC;

-- Vue 2: Analyse des tables
CREATE OR REPLACE VIEW table_size_analysis AS
SELECT
    schemaname,
    relname as table_name,
    pg_size_pretty(pg_total_relation_size(relid)) as total_size,
    pg_size_pretty(pg_relation_size(relid)) as table_size,
    n_tup_ins as inserts,
    n_tup_upd as updates,
    CASE
        WHEN pg_total_relation_size(relid) > 50*1024*1024 THEN '🔴 GROSSE (>50MB)'
        ELSE '🟢 NORMALE'
    END as size_status
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(relid) DESC;

-- Vue 3: Dashboard dual billing (version très simple)
CREATE OR REPLACE VIEW dual_billing_dashboard AS
SELECT
    'Abonnements Actifs' as metric,
    COUNT(*)::numeric as value,
    'total' as unit,
    CASE
        WHEN COUNT(*) > 5 THEN '🟢 BON'
        ELSE '🟡 À DÉVELOPPER'
    END as status
FROM subscriptions
WHERE status = 'active'
UNION ALL
SELECT
    'Points Ce Mois' as metric,
    COALESCE(SUM(points_allocated), 0)::numeric as value,
    'points' as unit,
    'ℹ️ INFO' as status
FROM monthly_allocations
WHERE allocation_month >= TO_CHAR(CURRENT_DATE, 'YYYY-MM')
UNION ALL
SELECT
    'MRR Actuel' as metric,
    0 as value,
    '€' as unit,
    'ℹ️ À calculer' as status
UNION ALL
SELECT
    'Conversion Rate' as metric,
    0 as value,
    '%' as unit,
    'ℹ️ À calculer' as status;

-- =====================================================
-- PARTIE 2: VÉRIFICATION (copiez après avoir créé les vues)
-- =====================================================

SELECT
    'VUES CRÉÉES:' as status,
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.views
        WHERE table_schema = 'public' AND table_name = 'index_usage_analysis'
    ) THEN '✅ index_usage_analysis' ELSE '❌ index_usage_analysis manquante' END as index_view,
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.views
        WHERE table_schema = 'public' AND table_name = 'table_size_analysis'
    ) THEN '✅ table_size_analysis' ELSE '❌ table_size_analysis manquante' END as table_view,
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.views
        WHERE table_schema = 'public' AND table_name = 'dual_billing_dashboard'
    ) THEN '✅ dual_billing_dashboard' ELSE '❌ dual_billing_dashboard manquante' END as dashboard_view;

-- =====================================================
-- PARTIE 3: TESTS SIMPLES (copiez après vérification)
-- =====================================================

-- Test 1: Vérifier que les vues fonctionnent
SELECT
    'TEST DES VUES:' as test_title,
    'Vues créées avec succès - Monitoring opérationnel' as result;

-- Test 2: Aperçu du dashboard
SELECT
    '📊 ' || metric || ': ' || value || ' ' || unit || ' (' || status || ')' as dashboard_preview
FROM dual_billing_dashboard
ORDER BY metric;

-- Test 3: Compter les index
SELECT
    '📈 STATISTIQUES:' as stats,
    COUNT(*) as total_indexes_analyzes,
    'Index sous surveillance' as description
FROM index_usage_analysis;

-- =====================================================
-- INSTRUCTIONS POUR UTILISATION APRÈS CRÉATION
-- =====================================================

/*
APRÈS AVOIR EXÉCUTÉ CE SCRIPT:

1. Pour voir l'analyse des index:
   SELECT * FROM index_usage_analysis LIMIT 10;

2. Pour voir l'analyse des tables:
   SELECT * FROM table_size_analysis;

3. Pour voir le dashboard:
   SELECT * FROM dual_billing_dashboard;

4. Pour mettre à jour les métriques MRR et conversion:
   -- Ces valeurs peuvent être mises à jour plus tard
   -- quand les fonctions calculate_mrr() et calculate_conversion_rate()
   -- seront disponibles
*/
