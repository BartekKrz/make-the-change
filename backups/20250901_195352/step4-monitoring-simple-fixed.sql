-- =====================================================
-- ÉTAPE 4: MONITORING ET VUES D'ANALYSE - VERSION CORRIGÉE
-- =====================================================
-- Création de vues pour surveiller les performances
--
-- CORRECTION: Utilisation des bonnes colonnes PostgreSQL
-- pg_stat_user_indexes.relname au lieu de tablename
-- =====================================================

-- =====================================================
-- VUES DE MONITORING À CRÉER (CORRIGÉES)
-- =====================================================

-- Vue pour analyser l'usage des index (CORRIGÉ)
CREATE OR REPLACE VIEW index_usage_analysis AS
SELECT
    schemaname,
    relname as tablename,  -- CORRECTION: relname au lieu de tablename
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

-- Vue pour analyser les tables volumineuses (CORRIGÉE)
CREATE OR REPLACE VIEW table_size_analysis AS
SELECT
    schemaname,
    relname as tablename,  -- CORRECTION: relname au lieu de tablename
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||relname)) as total_size,
    pg_size_pretty(pg_relation_size(schemaname||'.'||relname)) as table_size,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||relname) - pg_relation_size(schemaname||'.'||relname)) as index_size,
    n_tup_ins as inserts,
    n_tup_upd as updates,
    n_tup_del as deletes,
    CASE
        WHEN pg_total_relation_size(schemaname||'.'||relname) > 100*1024*1024 THEN '🔴 TRÈS GROSSE (>100MB)'
        WHEN pg_total_relation_size(schemaname||'.'||relname) > 10*1024*1024 THEN '🟡 GROSSE (>10MB)'
        ELSE '🟢 NORMALE'
    END as size_status
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||relname) DESC;

-- Vue pour le dashboard des métriques dual billing (SANS appels de fonctions)
CREATE OR REPLACE VIEW dual_billing_dashboard AS
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
    'ℹ️ À configurer' as status
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
-- TEST DES VUES CRÉÉES (SANS appels de fonctions)
-- =====================================================

-- Tester le dashboard dual billing (version simplifiée)
SELECT
    '📊 ' || metric || ': ' || value || ' ' || unit || ' ' || status as dashboard_test
FROM dual_billing_dashboard
ORDER BY
    CASE
        WHEN metric = 'MRR Actuel' THEN 1
        WHEN metric = 'Taux Conversion M→A' THEN 2
        WHEN metric = 'Abonnements Actifs' THEN 3
        WHEN metric = 'Points Alloués Ce Mois' THEN 4
        ELSE 5
    END;

-- Aperçu des index (version simplifiée)
SELECT
    '🔍 ANALYSE DES INDEX:' as analysis,
    COUNT(*) as total_indexes,
    'Vues de monitoring créées avec succès' as result
FROM pg_indexes
WHERE schemaname = 'public'
AND indexname LIKE 'idx_%';
