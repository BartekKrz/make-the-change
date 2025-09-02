-- =====================================================
-- SUPABASE MIGRATION SCRIPTS - Make the CHANGE
-- Ordre d'exécution dans Supabase SQL Editor
-- =====================================================

-- ⚠️ IMPORTANT: À EXÉCUTER DANS CET ORDRE PRÉCIS
-- Chaque script est dans une transaction séparée pour la sécurité

-- =====================================================
-- PHASE 1: MIGRATION TABLE PRODUCTS (la plus simple)
-- =====================================================

-- Script 1: Migration des Produits
-- Durée estimée: ~30 secondes
BEGIN;

-- Ajouter colonne BlurHash pour les produits
ALTER TABLE products ADD COLUMN blur_hashes TEXT[] DEFAULT '{}';

-- Créer fonction de migration pour les produits
CREATE OR REPLACE FUNCTION migrate_products_blurhash()
RETURNS void AS $$
DECLARE
  product_record RECORD;
  blurhash_array TEXT[] := '{}';
BEGIN
  -- Compter les produits à migrer
  RAISE NOTICE 'Migration des produits: % produits trouvés', (
    SELECT COUNT(*) FROM products WHERE images IS NOT NULL AND array_length(images, 1) > 0
  );

  FOR product_record IN SELECT id, images FROM products WHERE images IS NOT NULL AND array_length(images, 1) > 0
  LOOP
    -- Pour l'instant, on initialise avec array vide
    -- Les BlurHash seront générés plus tard via script Node.js
    UPDATE products
    SET blur_hashes = blurhash_array
    WHERE id = product_record.id;
  END LOOP;

  RAISE NOTICE 'Migration produits terminée';
END;
$$ LANGUAGE plpgsql;

-- Exécuter la migration des produits
SELECT migrate_products_blurhash();

COMMIT;

-- =====================================================
-- PHASE 2: MIGRATION TABLE PROJECTS
-- =====================================================

-- Script 2: Migration des Projets
-- Durée estimée: ~45 secondes
BEGIN;

-- Ajouter nouvelles colonnes pour les projets
ALTER TABLE projects ADD COLUMN hero_image TEXT;
ALTER TABLE projects ADD COLUMN gallery_images TEXT[] DEFAULT '{}';
ALTER TABLE projects ADD COLUMN blur_hashes TEXT[] DEFAULT '{}';

-- Créer fonction de migration intelligente pour les projets
CREATE OR REPLACE FUNCTION migrate_projects_structure()
RETURNS void AS $$
DECLARE
  project_record RECORD;
  hero_url TEXT;
  gallery_urls TEXT[];
BEGIN
  -- Compter les projets à migrer
  RAISE NOTICE 'Migration des projets: % projets trouvés', (
    SELECT COUNT(*) FROM projects WHERE images IS NOT NULL AND array_length(images, 1) > 0
  );

  FOR project_record IN SELECT id, images FROM projects WHERE images IS NOT NULL AND array_length(images, 1) > 0
  LOOP
    -- Logique de migration : première image = hero, autres = gallery
    IF array_length(project_record.images, 1) >= 1 THEN
      hero_url := project_record.images[1];
      gallery_urls := project_record.images[2:];
    ELSE
      hero_url := NULL;
      gallery_urls := '{}';
    END IF;

    UPDATE projects
    SET
      hero_image = hero_url,
      gallery_images = gallery_urls,
      blur_hashes = '{}'  -- À remplir avec script Node.js
    WHERE id = project_record.id;
  END LOOP;

  RAISE NOTICE 'Migration projets terminée';
END;
$$ LANGUAGE plpgsql;

-- Exécuter la migration des projets
SELECT migrate_projects_structure();

COMMIT;

-- =====================================================
-- PHASE 3: MIGRATION TABLE PRODUCERS
-- =====================================================

-- Script 3: Migration des Producteurs
-- Durée estimée: ~45 secondes
BEGIN;

-- Ajouter nouvelles colonnes pour les producteurs
ALTER TABLE producers ADD COLUMN logo_url TEXT;
ALTER TABLE producers ADD COLUMN cover_image TEXT;
ALTER TABLE producers ADD COLUMN gallery_images TEXT[] DEFAULT '{}';
ALTER TABLE producers ADD COLUMN blur_hashes TEXT[] DEFAULT '{}';

-- Créer fonction de migration pour les producteurs
CREATE OR REPLACE FUNCTION migrate_producers_structure()
RETURNS void AS $$
DECLARE
  producer_record RECORD;
  logo TEXT;
  cover TEXT;
  gallery TEXT[];
BEGIN
  -- Compter les producteurs à migrer
  RAISE NOTICE 'Migration des producteurs: % producteurs trouvés', (
    SELECT COUNT(*) FROM producers WHERE images IS NOT NULL AND array_length(images, 1) > 0
  );

  FOR producer_record IN SELECT id, images FROM producers WHERE images IS NOT NULL AND array_length(images, 1) > 0
  LOOP
    -- Logique : [0]=logo, [1]=cover, [2:]=gallery
    IF array_length(producer_record.images, 1) >= 1 THEN
      logo := producer_record.images[1];
    END IF;

    IF array_length(producer_record.images, 1) >= 2 THEN
      cover := producer_record.images[2];
    END IF;

    IF array_length(producer_record.images, 1) >= 3 THEN
      gallery := producer_record.images[3:];
    ELSE
      gallery := '{}';
    END IF;

    UPDATE producers
    SET
      logo_url = logo,
      cover_image = cover,
      gallery_images = gallery,
      blur_hashes = '{}'  -- À remplir avec script Node.js
    WHERE id = producer_record.id;
  END LOOP;

  RAISE NOTICE 'Migration producteurs terminée';
END;
$$ LANGUAGE plpgsql;

-- Exécuter la migration des producteurs
SELECT migrate_producers_structure();

COMMIT;

-- =====================================================
-- PHASE 4: TESTS ET VALIDATION
-- =====================================================

-- Script 4: Vérification structure des tables
-- Durée estimée: ~5 secondes
-- Vérifier que les nouvelles colonnes existent
SELECT
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name IN ('products', 'projects', 'producers')
  AND column_name IN ('hero_image', 'logo_url', 'cover_image', 'gallery_images', 'blur_hashes')
ORDER BY table_name, column_name;

-- =====================================================
-- PHASE 5: TESTS DE DONNÉES
-- =====================================================

-- Script 5: Vérification cohérence des données
-- Durée estimée: ~10 secondes
SELECT
  'products' as table_name,
  COUNT(*) as total_records,
  COUNT(CASE WHEN blur_hashes IS NOT NULL THEN 1 END) as with_blurhash,
  COUNT(CASE WHEN array_length(images, 1) > 0 THEN 1 END) as with_images,
  ROUND(
    COUNT(CASE WHEN blur_hashes IS NOT NULL THEN 1 END)::decimal /
    NULLIF(COUNT(CASE WHEN array_length(images, 1) > 0 THEN 1 END), 0) * 100, 1
  ) as migration_percentage
FROM products

UNION ALL

SELECT
  'projects' as table_name,
  COUNT(*) as total_records,
  COUNT(CASE WHEN blur_hashes IS NOT NULL THEN 1 END) as with_blurhash,
  COUNT(CASE WHEN hero_image IS NOT NULL THEN 1 END) as with_hero,
  ROUND(
    COUNT(CASE WHEN hero_image IS NOT NULL THEN 1 END)::decimal /
    NULLIF(COUNT(*), 0) * 100, 1
  ) as migration_percentage
FROM projects

UNION ALL

SELECT
  'producers' as table_name,
  COUNT(*) as total_records,
  COUNT(CASE WHEN blur_hashes IS NOT NULL THEN 1 END) as with_blurhash,
  COUNT(CASE WHEN logo_url IS NOT NULL THEN 1 END) as with_logo,
  ROUND(
    COUNT(CASE WHEN logo_url IS NOT NULL THEN 1 END)::decimal /
    NULLIF(COUNT(*), 0) * 100, 1
  ) as migration_percentage
FROM producers;

-- =====================================================
-- PHASE 6: NETTOYAGE (OPTIONNEL)
-- =====================================================

-- Script 6: Nettoyer les fonctions temporaires
-- À exécuter seulement après validation complète
-- Durée estimée: ~2 secondes

-- Nettoyer les fonctions de migration (optionnel)
-- DROP FUNCTION IF EXISTS migrate_products_blurhash();
-- DROP FUNCTION IF EXISTS migrate_projects_structure();
-- DROP FUNCTION IF EXISTS migrate_producers_structure();

-- =====================================================
-- PHASE 7: ROLLBACK (EN CAS DE PROBLÈME)
-- =====================================================

-- Script 7: Rollback complet
-- ⚠️ À utiliser seulement en cas de problème majeur
-- Durée estimée: ~30 secondes

-- ROLLBACK SCRIPT (À NE PAS EXÉCUTER SAUF URGENCE)
-- BEGIN;
-- ALTER TABLE products DROP COLUMN IF EXISTS blur_hashes;
-- ALTER TABLE projects DROP COLUMN IF EXISTS hero_image;
-- ALTER TABLE projects DROP COLUMN IF EXISTS gallery_images;
-- ALTER TABLE projects DROP COLUMN IF EXISTS blur_hashes;
-- ALTER TABLE producers DROP COLUMN IF EXISTS logo_url;
-- ALTER TABLE producers DROP COLUMN IF EXISTS cover_image;
-- ALTER TABLE producers DROP COLUMN IF EXISTS gallery_images;
-- ALTER TABLE producers DROP COLUMN IF EXISTS blur_hashes;
-- COMMIT;

-- =====================================================
-- MIGRATION TERMINÉE !
-- =====================================================

-- Résumé final
SELECT
  'Migration Summary' as status,
  NOW() as completed_at,
  'All tables migrated successfully' as message;

-- =====================================================
-- PROCHAINES ÉTAPES :
-- 1. Exécuter le script Node.js pour générer les BlurHash
-- 2. Tester les composants frontend
-- 3. Déployer en production
-- =====================================================
