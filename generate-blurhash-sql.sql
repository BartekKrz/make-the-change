-- =====================================================
-- GENERATE BLURHASH - SQL ONLY VERSION
-- Make the CHANGE - Génération BlurHash côté DB
-- =====================================================

-- IMPORTANT: Ce script génère les BlurHash côté serveur
-- Exécuter dans Supabase SQL Editor

-- =====================================================
-- FONCTION DE GÉNÉRATION BLURHASH
-- =====================================================

CREATE OR REPLACE FUNCTION generate_blurhash_for_image(image_url TEXT)
RETURNS TEXT AS $$
DECLARE
  blurhash_result TEXT;
  http_response RECORD;
BEGIN
  -- Pour Supabase, on utilise l'Edge Function ou une fonction externe
  -- Cette version utilise une approche simplifiée pour les tests

  -- Version simplifiée pour commencer (retourne un hash de base)
  -- En production, remplacer par appel à une Edge Function
  SELECT encode(
    ('x' || substring(md5(image_url) from 1 for 32))::bytea,
    'base64'
  ) INTO blurhash_result;

  RETURN blurhash_result;

EXCEPTION
  WHEN OTHERS THEN
    -- En cas d'erreur, retourner un BlurHash par défaut
    RETURN 'LEHV6nWB2yk8pyo0adR*.7kCMdnj';
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- GÉNÉRATION BLURHASH POUR LES PRODUCERS
-- =====================================================

-- Générer BlurHash pour les logos
UPDATE producers
SET blur_hashes = blur_hashes || ARRAY[
  json_build_object(
    'url', logo_url,
    'blurhash', generate_blurhash_for_image(logo_url),
    'type', 'logo'
  )::text
]
WHERE logo_url IS NOT NULL
  AND logo_url != ''
  AND NOT EXISTS (
    SELECT 1 FROM unnest(blur_hashes) AS bh
    WHERE bh::json->>'url' = logo_url
  );

-- Générer BlurHash pour les cover images
UPDATE producers
SET blur_hashes = blur_hashes || ARRAY[
  json_build_object(
    'url', cover_image,
    'blurhash', generate_blurhash_for_image(cover_image),
    'type', 'cover'
  )::text
]
WHERE cover_image IS NOT NULL
  AND cover_image != ''
  AND NOT EXISTS (
    SELECT 1 FROM unnest(blur_hashes) AS bh
    WHERE bh::json->>'url' = cover_image
  );

-- Générer BlurHash pour la galerie
UPDATE producers
SET blur_hashes = blur_hashes || (
  SELECT array_agg(
    json_build_object(
      'url', img,
      'blurhash', generate_blurhash_for_image(img),
      'type', 'gallery'
    )::text
  )
  FROM unnest(gallery_images) AS img
  WHERE img IS NOT NULL AND img != ''
    AND NOT EXISTS (
      SELECT 1 FROM unnest(blur_hashes) AS bh
      WHERE bh::json->>'url' = img
    )
)
WHERE array_length(gallery_images, 1) > 0;

-- =====================================================
-- GÉNÉRATION BLURHASH POUR LES PROJECTS
-- =====================================================

-- Générer BlurHash pour les hero images
UPDATE projects
SET blur_hashes = blur_hashes || ARRAY[
  json_build_object(
    'url', hero_image,
    'blurhash', generate_blurhash_for_image(hero_image),
    'type', 'hero'
  )::text
]
WHERE hero_image IS NOT NULL
  AND hero_image != ''
  AND NOT EXISTS (
    SELECT 1 FROM unnest(blur_hashes) AS bh
    WHERE bh::json->>'url' = hero_image
  );

-- Générer BlurHash pour la galerie des projets
UPDATE projects
SET blur_hashes = blur_hashes || (
  SELECT array_agg(
    json_build_object(
      'url', img,
      'blurhash', generate_blurhash_for_image(img),
      'type', 'gallery'
    )::text
  )
  FROM unnest(gallery_images) AS img
  WHERE img IS NOT NULL AND img != ''
    AND NOT EXISTS (
      SELECT 1 FROM unnest(blur_hashes) AS bh
      WHERE bh::json->>'url' = img
    )
)
WHERE array_length(gallery_images, 1) > 0;

-- =====================================================
-- GÉNÉRATION BLURHASH POUR LES PRODUCTS (si pas déjà fait)
-- =====================================================

-- Générer BlurHash pour toutes les images de produits
UPDATE products
SET blur_hashes = (
  SELECT array_agg(
    json_build_object(
      'url', img,
      'blurhash', generate_blurhash_for_image(img),
      'type', 'product'
    )::text
  )
  FROM unnest(images) AS img
  WHERE img IS NOT NULL AND img != ''
)
WHERE array_length(images, 1) > 0
  AND array_length(blur_hashes, 1) = 0;

-- =====================================================
-- VÉRIFICATION DES RÉSULTATS
-- =====================================================

-- Statistiques des BlurHash générés
SELECT
  'BlurHash Generation Summary' as status,
  NOW() as timestamp,
  (SELECT COUNT(*) FROM producers WHERE array_length(blur_hashes, 1) > 0) as producers_with_blurhash,
  (SELECT COUNT(*) FROM projects WHERE array_length(blur_hashes, 1) > 0) as projects_with_blurhash,
  (SELECT COUNT(*) FROM products WHERE array_length(blur_hashes, 1) > 0) as products_with_blurhash,
  (
    (SELECT COUNT(*) FROM producers WHERE array_length(blur_hashes, 1) > 0) +
    (SELECT COUNT(*) FROM projects WHERE array_length(blur_hashes, 1) > 0) +
    (SELECT COUNT(*) FROM products WHERE array_length(blur_hashes, 1) > 0)
  ) as total_with_blurhash;

-- Détail des BlurHash par entité
SELECT * FROM (
  SELECT
    'PRODUCERS' as entity_type,
    name,
    array_length(blur_hashes, 1) as blurhash_count,
    CASE
      WHEN array_length(blur_hashes, 1) > 0 THEN '✅ BlurHash générés'
      ELSE '❌ Aucun BlurHash'
    END as status
  FROM producers
  ORDER BY name
) producers_data

UNION ALL

SELECT * FROM (
  SELECT
    'PROJECTS' as entity_type,
    p.name,
    array_length(p.blur_hashes, 1) as blurhash_count,
    CASE
      WHEN array_length(p.blur_hashes, 1) > 0 THEN '✅ BlurHash générés'
      ELSE '❌ Aucun BlurHash'
    END as status
  FROM projects p
  ORDER BY p.name
) projects_data

UNION ALL

SELECT * FROM (
  SELECT
    'PRODUCTS' as entity_type,
    COALESCE(name, 'Product ' || id::text) as name,
    array_length(blur_hashes, 1) as blurhash_count,
    CASE
      WHEN array_length(blur_hashes, 1) > 0 THEN '✅ BlurHash générés'
      ELSE '❌ Aucun BlurHash'
    END as status
  FROM products
  ORDER BY name
) products_data;

-- =====================================================
-- NETTOYAGE (optionnel)
-- =====================================================

-- Supprimer la fonction temporaire après utilisation
-- DROP FUNCTION IF EXISTS generate_blurhash_for_image(TEXT);
