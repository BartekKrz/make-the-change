-- ===========================
-- PHASE 5: NETTOYAGE INDEX JAMAIS UTILISÉS
-- ===========================
-- Description: Suppression des index qui n'ont jamais été utilisés (0 reads)
-- Risque: MOYEN - Testez sur une copie avant d'exécuter en production

-- IMPORTANT: Exécutez ce script par petits blocs et surveillez les performances

BEGIN;

-- ===========================
-- A. INDEX CATEGORIES (5 index inutiles)
-- ===========================
-- Ces index sur la table categories n'ont jamais été utilisés

DROP INDEX IF EXISTS idx_categories_metadata;        -- 24KB, 0 reads
DROP INDEX IF EXISTS categories_slug_key;            -- 16KB, 0 reads  
DROP INDEX IF EXISTS idx_categories_parent;          -- 16KB, 0 reads
DROP INDEX IF EXISTS idx_categories_active;          -- 16KB, 0 reads
DROP INDEX IF EXISTS idx_categories_is_active;       -- 16KB, 0 reads

-- ===========================
-- B. INDEX USERS (4 index inutiles) 
-- ===========================
-- Ces index sur users ne sont pas utilisés par les requêtes produits

DROP INDEX IF EXISTS users_email_key;                -- 16KB, 0 reads
DROP INDEX IF EXISTS idx_users_level;                -- 16KB, 0 reads
DROP INDEX IF EXISTS idx_users_kyc_status;           -- 16KB, 0 reads  
DROP INDEX IF EXISTS idx_users_points;               -- 16KB, 0 reads

COMMIT;

-- ===========================
-- PAUSE - VÉRIFIEZ LES PERFORMANCES AVANT DE CONTINUER
-- ===========================

BEGIN;

-- ===========================
-- C. INDEX PRODUCTS (4 index inutiles)
-- ===========================
-- Ces index sur products ne semblent pas utilisés (vérifiez d'abord)

-- ATTENTION: Décommentez seulement après avoir vérifié que vos requêtes produits fonctionnent
-- DROP INDEX IF EXISTS products_slug_key;              -- 16KB, 0 reads
-- DROP INDEX IF EXISTS idx_products_category;          -- 16KB, 0 reads  
-- DROP INDEX IF EXISTS idx_products_featured;          -- 16KB, 0 reads

COMMIT;

BEGIN;

-- ===========================  
-- D. INDEX PROJECTS (6 index inutiles)
-- ===========================
-- Ces index sur projects ne sont pas utilisés par les pages produits

DROP INDEX IF EXISTS projects_slug_key;              -- 16KB, 0 reads
DROP INDEX IF EXISTS idx_projects_slug;              -- 16KB, 0 reads
DROP INDEX IF EXISTS idx_projects_type;              -- 16KB, 0 reads  
DROP INDEX IF EXISTS idx_projects_status;            -- 16KB, 0 reads
DROP INDEX IF EXISTS idx_projects_featured;          -- 16KB, 0 reads
DROP INDEX IF EXISTS idx_projects_location;          -- 8KB, 0 reads

-- ===========================
-- E. INDEX SUBSCRIPTIONS (7 index inutiles) 
-- ===========================  
-- Ces index sur subscriptions ne sont pas utilisés par les pages produits

DROP INDEX IF EXISTS subscriptions_stripe_subscription_id_key; -- 16KB, 0 reads
DROP INDEX IF EXISTS idx_subscriptions_user_id;                -- 16KB, 0 reads
DROP INDEX IF EXISTS idx_subscriptions_user;                   -- 16KB, 0 reads  
DROP INDEX IF EXISTS idx_subscriptions_stripe_sub;             -- 16KB, 0 reads
DROP INDEX IF EXISTS idx_subscriptions_plan_type;              -- 16KB, 0 reads
DROP INDEX IF EXISTS idx_subscriptions_stripe_id;              -- 16KB, 0 reads

COMMIT;

-- ===========================
-- F. INDEX BLUR HASHES (À traiter avec précaution)
-- ===========================
-- Il y a beaucoup de doublon d'index sur image_blur_hashes
-- Exécutez seulement si vous êtes sûr qu'ils ne sont pas nécessaires

-- BEGIN;
-- 
-- DROP INDEX IF EXISTS uq_image_blur_hashes_entity_image;       -- 16KB, 0 reads
-- DROP INDEX IF EXISTS image_blur_hashes_image_url_key;         -- 16KB, 0 reads  
-- DROP INDEX IF EXISTS image_blur_hashes_entity_idx;           -- 16KB, 0 reads
-- DROP INDEX IF EXISTS image_blur_hashes_url_key;              -- 16KB, 0 reads
-- DROP INDEX IF EXISTS idx_image_blur_hashes_generated;        -- 16KB, 0 reads
-- 
-- COMMIT;

-- ===========================
-- VÉRIFICATION POST-SUPPRESSION
-- ===========================
-- SELECT indexname, tablename, schemaname 
-- FROM pg_indexes 
-- WHERE schemaname = 'public' 
-- AND tablename IN ('categories', 'users', 'projects', 'subscriptions')
-- ORDER BY tablename, indexname;

-- Espace récupéré estimé: ~800KB-1.2MB d'index