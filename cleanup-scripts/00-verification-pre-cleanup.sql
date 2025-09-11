-- ===========================
-- SCRIPT DE VÉRIFICATION PRÉ-NETTOYAGE
-- ===========================
-- Description: Vérifications complètes avant d'exécuter le nettoyage
-- Usage: Exécuter ce script AVANT les phases de nettoyage

-- ===========================
-- A. VÉRIFICATION TABLES VIDES
-- ===========================
SELECT 'VÉRIFICATION TABLES VIDES' as section;

SELECT 
  t.table_name,
  COALESCE(s.n_tup_ins, 0) as rows_inserted,
  COALESCE(s.n_tup_upd, 0) as rows_updated, 
  COALESCE(s.n_tup_del, 0) as rows_deleted,
  COALESCE(s.n_live_tup, 0) as current_rows,
  pg_size_pretty(pg_total_relation_size('public.' || t.table_name)) as table_size
FROM information_schema.tables t
LEFT JOIN pg_stat_user_tables s ON s.relname = t.table_name
WHERE t.table_schema = 'public'
AND t.table_name IN (
  'subscription_billing_history', 'conversion_events', 'inventory',
  'points_expiry_schedule', 'subscription_cohorts', 'producer_metrics', 
  'monthly_allocations', 'user_sessions', 'investment_returns', 'stock_movements',
  'products_backup'
)
ORDER BY current_rows DESC;

-- ===========================
-- B. VÉRIFICATION VIEWS EXISTANTES  
-- ===========================
SELECT 'VÉRIFICATION VIEWS' as section;

SELECT 
  table_name as view_name, 
  'VIEW' as type,
  'EXISTS' as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'VIEW'
AND table_name IN (
  'products_with_blur_hashes',     -- ✅ UTILISÉE - À CONSERVER
  'products_cover_blur',           -- ✅ UTILISÉE - À CONSERVER  
  'products_missing_blur',         -- ✅ UTILISÉE - À CONSERVER
  'blur_system_stats',             -- ✅ UTILISÉE - À CONSERVER
  'admin_dashboard_metrics',       -- ❓ Potentiellement inutile
  'dual_billing_dashboard',        -- ❓ Potentiellement inutile
  'user_subscription_summary',     -- ❓ Potentiellement inutile
  'points_expiring_soon',          -- ❓ Potentiellement inutile
  'points_expiry_with_days'        -- ❓ Potentiellement inutile
)
ORDER BY table_name;

-- ===========================
-- C. VÉRIFICATION FONCTIONS CUSTOM
-- ===========================
SELECT 'VÉRIFICATION FONCTIONS' as section;

SELECT 
  routine_name as function_name,
  routine_type,
  CASE 
    WHEN routine_name IN ('get_image_blur_hash', 'upsert_image_blur_hash_v2', 'generate_blurhash_for_image', 'calculate_mrr', 'expire_old_points') 
    THEN '✅ UTILISÉE - À CONSERVER'
    WHEN routine_name IN ('migrate_producers_structure', 'migrate_products_blurhash', 'migrate_projects_structure', 'assign_category_by_keywords')
    THEN '🗑️ MIGRATION - À SUPPRIMER'  
    WHEN routine_name IN ('cleanup_orphaned_blur_hashes', 'maintenance_blur_system')
    THEN '🐛 BUG SQL - À SUPPRIMER'
    WHEN routine_name IN ('set_product_images', 'update_product_images', 'get_category_path', 'get_category_stats', 'get_entity_blur_hashes')
    THEN '❌ NON UTILISÉE - À SUPPRIMER'
    ELSE '❓ À ANALYSER'
  END as status
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_type = 'FUNCTION'
AND routine_name NOT LIKE 'st_%'  -- Exclure PostGIS
ORDER BY 
  CASE 
    WHEN routine_name IN ('get_image_blur_hash', 'upsert_image_blur_hash_v2', 'generate_blurhash_for_image', 'calculate_mrr', 'expire_old_points') THEN 1
    ELSE 2 
  END,
  routine_name;

-- ===========================
-- D. VÉRIFICATION INDEX USAGE (Top 20 jamais utilisés)
-- ===========================
SELECT 'INDEX JAMAIS UTILISÉS (Top 20)' as section;

SELECT 
  schemaname,
  relname as tablename,
  indexrelname as indexname,
  idx_scan as times_used,
  pg_size_pretty(pg_relation_size('public.' || indexrelname)) as index_size,
  CASE 
    WHEN relname IN ('products', 'categories', 'image_blur_hashes') THEN '⚠️ TABLE CRITIQUE'
    ELSE '✅ SUPPRESSION SÛRE'
  END as safety_level
FROM pg_stat_user_indexes 
WHERE schemaname = 'public'
AND idx_scan = 0  -- Jamais utilisé
ORDER BY pg_relation_size('public.' || indexrelname) DESC
LIMIT 20;

-- ===========================
-- E. STATISTIQUES ESPACE DISQUE ACTUEL
-- ===========================
SELECT 'STATISTIQUES ESPACE DISQUE' as section;

SELECT 
  'Tables' as object_type,
  count(*) as count,
  pg_size_pretty(sum(pg_total_relation_size('public.' || tablename))) as total_size
FROM pg_tables 
WHERE schemaname = 'public'
UNION ALL
SELECT 
  'Index',
  count(*),
  pg_size_pretty(sum(pg_relation_size('public.' || indexrelname)))
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
UNION ALL
SELECT 
  'Views', 
  count(*),
  'N/A'
FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'VIEW';

-- ===========================
-- F. VÉRIFICATION DONNÉES PRODUITS (Sécurité)
-- ===========================
SELECT 'VÉRIFICATION DONNÉES PRODUITS' as section;

SELECT 
  'Nombre total de produits' as metric,
  count(*)::text as value
FROM products
UNION ALL
SELECT 
  'Produits actifs',
  count(*)::text
FROM products 
WHERE is_active = true
UNION ALL
SELECT 
  'Produits avec images',
  count(*)::text  
FROM products
WHERE images IS NOT NULL AND array_length(images, 1) > 0
UNION ALL
SELECT
  'Blur hashes enregistrés',
  count(*)::text
FROM image_blur_hashes
UNION ALL
SELECT
  'Producers actifs', 
  count(*)::text
FROM producers
WHERE status = 'active';

SELECT 'VÉRIFICATION TERMINÉE - PRÊT POUR LE NETTOYAGE ✅' as final_status;