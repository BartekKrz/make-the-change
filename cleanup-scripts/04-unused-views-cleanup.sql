-- ===========================
-- PHASE 4: NETTOYAGE VIEWS NON UTILISÉES (OPTIONNEL)
-- ===========================  
-- Description: Suppression des views qui ne semblent pas utilisées dans les pages produits
-- Risque: MOYEN - À exécuter seulement si vous êtes sûr que ces views ne sont pas utilisées ailleurs

-- ATTENTION: Ces views pourraient être utilisées dans d'autres parties non analysées
-- Vérifiez manuellement avant d'exécuter cette phase

-- ===========================
-- VIEWS À CONSERVER ABSOLUMENT (Utilisées dans les pages produits)
-- ===========================
-- ✅ products_with_blur_hashes - Utilisée dans admin.products.detail_enriched
-- ✅ products_missing_blur - Utilisée dans admin.products.blur.missing  
-- ✅ products_cover_blur - Utilisée dans admin.products.list (enrichissement cover)
-- ✅ blur_system_stats - Utilisée pour monitoring/analytics

-- ===========================  
-- VIEWS POTENTIELLEMENT NON UTILISÉES
-- ===========================
-- Ces views ne sont pas référencées dans le code des pages produits analysées

BEGIN;

-- Vérification des views existantes avant suppression
SELECT 'Checking existing views...' as status;

-- Lister toutes les views actuellement présentes
SELECT table_name as view_name, 'EXISTS' as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'VIEW'
AND table_name IN (
  'admin_dashboard_metrics',
  'dual_billing_dashboard', 
  'user_subscription_summary',
  'points_expiring_soon',
  'points_expiry_with_days'
)
ORDER BY table_name;

-- DÉCOMMENTEZ SEULEMENT SI VOUS ÊTES SÛR QUE CES VIEWS NE SONT PAS UTILISÉES AILLEURS
-- DROP VIEW IF EXISTS admin_dashboard_metrics CASCADE;
-- DROP VIEW IF EXISTS dual_billing_dashboard CASCADE;  
-- DROP VIEW IF EXISTS user_subscription_summary CASCADE;
-- DROP VIEW IF EXISTS points_expiring_soon CASCADE;
-- DROP VIEW IF EXISTS points_expiry_with_days CASCADE;

-- Pour l'instant, on garde ces views par sécurité
-- Vous pouvez les supprimer manuellement après vérification complète

COMMIT;

-- ===========================
-- COMMANDE POUR IDENTIFIER TOUTES LES VIEWS
-- ===========================
-- SELECT table_name, table_type 
-- FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- AND table_type = 'VIEW'
-- ORDER BY table_name;