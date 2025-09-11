-- ===========================
-- PHASE 3: NETTOYAGE FONCTIONS NON UTILISÉES
-- ===========================
-- Description: Suppression des fonctions PostgreSQL obsolètes et non utilisées
-- Risque: FAIBLE à MOYEN - Ces fonctions ne sont pas utilisées dans le code des pages produits

BEGIN;

-- ===========================
-- A. FONCTIONS DE MIGRATION (Usage unique terminé)
-- ===========================
-- Ces fonctions étaient pour des migrations one-shot déjà terminées

DROP FUNCTION IF EXISTS migrate_producers_structure() CASCADE;
DROP FUNCTION IF EXISTS migrate_products_blurhash() CASCADE; 
DROP FUNCTION IF EXISTS migrate_projects_structure() CASCADE;
DROP FUNCTION IF EXISTS assign_category_by_keywords() CASCADE;

-- ===========================  
-- B. FONCTIONS AVEC BUGS SQL IDENTIFIÉS
-- ===========================
-- Ces fonctions ont des erreurs SQL (cast text = uuid) et ne fonctionnent pas

DROP FUNCTION IF EXISTS cleanup_orphaned_blur_hashes() CASCADE;
DROP FUNCTION IF EXISTS maintenance_blur_system() CASCADE;

-- ===========================
-- C. FONCTIONS IMAGES OBSOLÈTES  
-- ===========================
-- Ces fonctions pour la gestion d'images ont été remplacées par l'API REST

DROP FUNCTION IF EXISTS set_product_images() CASCADE;
DROP FUNCTION IF EXISTS set_product_images_json() CASCADE;
DROP FUNCTION IF EXISTS update_product_images() CASCADE;
DROP FUNCTION IF EXISTS update_product_images_json() CASCADE;

-- ===========================
-- D. FONCTIONS ANALYTICS NON UTILISÉES
-- ===========================
-- Ces fonctions ne sont pas appelées dans le code des pages produits

DROP FUNCTION IF EXISTS get_category_path() CASCADE;
DROP FUNCTION IF EXISTS get_category_stats() CASCADE; 
DROP FUNCTION IF EXISTS get_entity_blur_hashes() CASCADE;

-- ===========================
-- E. FONCTIONS POINTS OBSOLÈTES
-- ===========================
-- Fonction introuvable/non utilisée dans les pages produits

DROP FUNCTION IF EXISTS get_days_until_expiry(uuid) CASCADE;
DROP FUNCTION IF EXISTS get_days_until_expiry(text) CASCADE;
DROP FUNCTION IF EXISTS get_days_until_expiry() CASCADE;

COMMIT;

-- ===========================
-- FONCTIONS CONSERVÉES (UTILISÉES)
-- ===========================
-- Ces fonctions sont utilisées et doivent être CONSERVÉES:
-- 
-- ✅ get_image_blur_hash(text) - Utilisée pour récupérer blur hash
-- ✅ upsert_image_blur_hash_v2() - Utilisée par Edge Function  
-- ✅ generate_blurhash_for_image() - Génération côté DB
-- ✅ calculate_mrr() - Métriques business (44.67€ actuellement)
-- ✅ calculate_conversion_rate() - Analytics business
-- ✅ expire_old_points() - Maintenance automatique des points
-- ✅ Toutes les fonctions PostGIS (ST_*) - Géolocalisation des projets

-- Vérification post-suppression (lister les fonctions restantes)
-- SELECT routine_name, routine_type 
-- FROM information_schema.routines 
-- WHERE routine_schema = 'public' 
-- AND routine_type = 'FUNCTION'
-- AND routine_name NOT LIKE 'st_%'  -- Exclure PostGIS
-- ORDER BY routine_name;