-- =====================================================
-- ÉTAPE 3 - VUES OPTIMISÉES POUR LE FRONTEND
-- Make the CHANGE - Vues performantes avec blur hashes
-- =====================================================
-- 
-- À exécuter dans : Supabase SQL Editor
-- Ordre : 3ème script à exécuter (après 02_create_functions.sql)
-- Durée estimée : ~5 secondes
--
-- =====================================================

-- 1. Vue principale : Produits avec leurs blur hashes optimisés
CREATE OR REPLACE VIEW products_with_blur_hashes AS
SELECT
    p.*,
    -- Générer un array JSON optimisé des blur hashes
    COALESCE(
        ARRAY_AGG(
            json_build_object(
                'url', ibh.image_url,
                'blurHash', ibh.blur_hash,
                'width', ibh.width,
                'height', ibh.height,
                'fileSize', ibh.file_size
            ) ORDER BY 
                -- Maintenir l'ordre des images du produit
                CASE 
                    WHEN ibh.image_url = ANY(p.images) 
                    THEN array_position(p.images, ibh.image_url)
ELSE 999
END
        ) FILTER
(WHERE ibh.image_url IS NOT NULL),
        ARRAY[]::json[]
    ) as computed_blur_hashes,
    
    -- Statistiques utiles
    COALESCE
(COUNT
(ibh.id) FILTER
(WHERE ibh.image_url IS NOT NULL), 0) as blur_count,
    COALESCE
(ARRAY_LENGTH
(p.images, 1), 0) as total_images,
    
    -- Pourcentage de coverage blur
    CASE 
        WHEN COALESCE
(ARRAY_LENGTH
(p.images, 1), 0) = 0 THEN 100
        ELSE ROUND
(
            (COALESCE
(COUNT
(ibh.id) FILTER
(WHERE ibh.image_url IS NOT NULL), 0)::DECIMAL / 
             COALESCE
(ARRAY_LENGTH
(p.images, 1), 1)) * 100, 
            0
        )
END as blur_coverage_percent

FROM products p
LEFT JOIN image_blur_hashes ibh ON
(
    ibh.entity_type = 'product' 
    AND ibh.entity_id = p.id::text 
    AND ibh.image_url = ANY
(p.images)
)
GROUP BY p.id;

-- 2. Vue pour statistiques globales
CREATE OR REPLACE VIEW blur_system_stats AS
SELECT
    -- Statistiques par type d'entité
    entity_type,
    COUNT(*) as total_blur_hashes,
    COUNT(DISTINCT entity_id) as unique_entities,

    -- Statistiques de taille
    AVG(file_size)
::INTEGER as avg_file_size_bytes,
    MIN
(file_size) as min_file_size_bytes,
    MAX
(file_size) as max_file_size_bytes,
    
    -- Statistiques de dimensions
    AVG
(width)::INTEGER as avg_width,
    AVG
(height)::INTEGER as avg_height,
    
    -- Statistiques temporelles
    MIN
(generated_at) as first_generated,
    MAX
(generated_at) as last_generated,
    
    -- Statistiques de performance
    COUNT
(*) FILTER
(WHERE generated_at > NOW
() - INTERVAL '24 hours') as generated_last_24h,
    COUNT
(*) FILTER
(WHERE generated_at > NOW
() - INTERVAL '7 days') as generated_last_7d

FROM image_blur_hashes
GROUP BY entity_type

UNION ALL

SELECT
    'TOTAL' as entity_type,
    COUNT(*) as total_blur_hashes,
    COUNT(DISTINCT CONCAT(entity_type, ':', entity_id)) as unique_entities,
    AVG(file_size)
::INTEGER as avg_file_size_bytes,
    MIN
(file_size) as min_file_size_bytes,
    MAX
(file_size) as max_file_size_bytes,
    AVG
(width)::INTEGER as avg_width,
    AVG
(height)::INTEGER as avg_height,
    MIN
(generated_at) as first_generated,
    MAX
(generated_at) as last_generated,
    COUNT
(*) FILTER
(WHERE generated_at > NOW
() - INTERVAL '24 hours') as generated_last_24h,
    COUNT
(*) FILTER
(WHERE generated_at > NOW
() - INTERVAL '7 days') as generated_last_7d
FROM image_blur_hashes

ORDER BY entity_type;

-- 3. Vue pour diagnostic des images sans blur
CREATE OR REPLACE VIEW products_missing_blur AS
SELECT
    p.id,
    p.name,
    p.slug,
    p.is_active,
    COALESCE(ARRAY_LENGTH(p.images, 1), 0) as total_images,
    COALESCE(blur_stats.blur_count, 0) as existing_blur_count,

    -- Images qui n'ont pas de blur hash
    ARRAY(
SELECT img
FROM unnest(p.images) AS img
WHERE NOT EXISTS (
            SELECT 1
FROM image_blur_hashes ibh
WHERE ibh.image_url = img
    AND ibh.entity_type = 'product'
    AND ibh.entity_id = p.id::text
        )
) as missing_blur_images,
    
    -- Pourcentage manquant
    CASE 
        WHEN COALESCE
(ARRAY_LENGTH
(p.images, 1), 0) = 0 THEN 0
        ELSE ROUND
(
            ((COALESCE
(ARRAY_LENGTH
(p.images, 1), 0) - COALESCE
(blur_stats.blur_count, 0))::DECIMAL / 
             COALESCE
(ARRAY_LENGTH
(p.images, 1), 1)) * 100, 
            0
        )
END as missing_blur_percent

FROM products p
LEFT JOIN
(
    SELECT
    entity_id,
    COUNT(*) as blur_count
FROM image_blur_hashes
WHERE entity_type = 'product'
GROUP BY entity_id
)
blur_stats ON blur_stats.entity_id = p.id::text

WHERE 
    COALESCE
(ARRAY_LENGTH
(p.images, 1), 0) > 0  -- Produits avec images
    AND
(
        blur_stats.blur_count IS NULL OR  -- Aucun blur
        blur_stats.blur_count < COALESCE
(ARRAY_LENGTH
(p.images, 1), 0)  -- Blur incomplet
    )
ORDER BY missing_blur_percent DESC, p.name;

-- =====================================================
-- TESTS ET VÉRIFICATION
-- =====================================================

-- Test vue products_with_blur_hashes
SELECT
    'Vue products_with_blur_hashes créée' as status,
    COUNT(*) as total_products
FROM products_with_blur_hashes;

-- Test vue statistiques
SELECT
    'Vue blur_system_stats créée' as status,
    COUNT(*) as total_entity_types
FROM blur_system_stats;

-- Test vue diagnostic
SELECT
    'Vue products_missing_blur créée' as status,
    COUNT(*) as products_needing_blur
FROM products_missing_blur;

-- =====================================================
-- EXEMPLES D'UTILISATION
-- =====================================================

-- Exemple 1: Récupérer un produit avec ses blur hashes
/*
SELECT 
    id, name, images, computed_blur_hashes, blur_coverage_percent
FROM products_with_blur_hashes 
WHERE id = 'votre-product-id'
LIMIT 1;
*/

-- Exemple 2: Voir les statistiques globales
/*
SELECT * FROM blur_system_stats;
*/

-- Exemple 3: Voir les produits qui ont besoin de blur
/*
SELECT 
    name, total_images, missing_blur_percent, missing_blur_images
FROM products_missing_blur 
LIMIT 10;
*/

-- =====================================================
-- PROCHAINE ÉTAPE
-- =====================================================
/*
✅ SCRIPT 3 TERMINÉ

PROCHAINE ÉTAPE : Exécuter le script 04_create_triggers.sql
*/