-- ===========================
-- PHASE 6: NETTOYAGE DONNÉES ORPHELINES
-- ===========================
-- Description: Nettoyage des données orphelines et références cassées
-- Risque: MOYEN à ÉLEVÉ - Vérifiez chaque requête avant exécution

-- IMPORTANT: Exécutez d'abord les SELECT pour vérifier les données avant les DELETE

-- ===========================
-- A. NETTOYAGE BLUR HASHES ORPHELINS
-- ===========================

BEGIN;

-- 1. Identifier les blur hashes sans entité correspondante
SELECT 
  'image_blur_hashes orphelins' as type,
  count(*) as count
FROM image_blur_hashes ibh
WHERE ibh.entity_type = 'product' 
AND ibh.entity_id NOT IN (SELECT id FROM products);

-- 2. Identifier les blur hashes avec des URLs invalides
SELECT 
  'URLs invalides' as type,
  count(*) as count,
  string_agg(DISTINCT substring(image_url from 1 for 50), ', ') as sample_urls
FROM image_blur_hashes
WHERE image_url LIKE 'blob:http://localhost%' 
   OR image_url LIKE 'https://images.unsplash.com%'
   OR image_url NOT LIKE 'https://%.supabase.co/%';

-- 3. DÉCOMMENTEZ POUR SUPPRIMER (après vérification)
-- DELETE FROM image_blur_hashes 
-- WHERE entity_type = 'product' 
-- AND entity_id NOT IN (SELECT id FROM products);

-- 4. DÉCOMMENTEZ POUR NETTOYER LES URLs INVALIDES (après vérification)  
-- DELETE FROM image_blur_hashes
-- WHERE image_url LIKE 'blob:http://localhost%' 
--    OR image_url LIKE 'https://images.unsplash.com%';

COMMIT;

-- ===========================
-- B. NETTOYAGE IMAGES PRODUITS ORPHELINES
-- ===========================

BEGIN;

-- 1. Identifier les produits avec des images invalides dans leur array
SELECT 
  p.id,
  p.name,
  p.images,
  array_length(p.images, 1) as image_count
FROM products p
WHERE p.images IS NOT NULL 
AND EXISTS (
  SELECT 1 
  FROM unnest(p.images) as img(url)
  WHERE img.url LIKE 'blob:http://localhost%' 
     OR img.url LIKE 'https://images.unsplash.com%'
);

-- 2. DÉCOMMENTEZ POUR NETTOYER (après vérification manuelle)
-- UPDATE products 
-- SET images = array(
--   SELECT img.url 
--   FROM unnest(images) as img(url)
--   WHERE img.url NOT LIKE 'blob:http://localhost%' 
--     AND img.url NOT LIKE 'https://images.unsplash.com%'
--     AND img.url LIKE 'https://%.supabase.co/%'
-- )
-- WHERE images IS NOT NULL 
-- AND EXISTS (
--   SELECT 1 
--   FROM unnest(images) as img(url)
--   WHERE img.url LIKE 'blob:http://localhost%' 
--      OR img.url LIKE 'https://images.unsplash.com%'
-- );

COMMIT;

-- ===========================  
-- C. VÉRIFICATION RELATIONS FOREIGN KEY
-- ===========================

BEGIN;

-- 1. Vérifier les produits avec producer_id inexistant
SELECT 
  'products avec producer_id orphelin' as type,
  count(*) as count
FROM products p
WHERE p.producer_id IS NOT NULL 
AND p.producer_id NOT IN (SELECT id FROM producers);

-- 2. Vérifier les produits avec category_id inexistant  
SELECT 
  'products avec category_id orphelin' as type,
  count(*) as count
FROM products p  
WHERE p.category_id IS NOT NULL
AND p.category_id NOT IN (SELECT id FROM categories);

-- 3. Vérifier les order_items avec product_id inexistant
SELECT 
  'order_items avec product_id orphelin' as type,
  count(*) as count
FROM order_items oi
WHERE oi.product_id NOT IN (SELECT id FROM products);

COMMIT;

-- ===========================
-- D. STATISTIQUES POST-NETTOYAGE
-- ===========================

-- Statistiques finales
SELECT 
  'image_blur_hashes' as table_name,
  count(*) as row_count,
  pg_size_pretty(pg_total_relation_size('image_blur_hashes')) as size
FROM image_blur_hashes
UNION ALL
SELECT 
  'products',
  count(*),
  pg_size_pretty(pg_total_relation_size('products'))
FROM products
UNION ALL
SELECT 
  'Total blur system',
  count(*),
  pg_size_pretty(
    pg_total_relation_size('image_blur_hashes') +
    pg_total_relation_size('products_with_blur_hashes') + 
    pg_total_relation_size('products_cover_blur') +
    pg_total_relation_size('products_missing_blur')
  )
FROM image_blur_hashes;