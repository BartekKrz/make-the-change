-- =====================================================
-- FIX UNSPLASH IMAGES - Make the CHANGE (Version Corrigée)
-- Correction des URLs d'images Unsplash obsolètes
-- Compatible avec les arrays PostgreSQL text[]
-- =====================================================

-- =====================================================
-- 0. VÉRIFICATION DE LA STRUCTURE DE LA TABLE
-- =====================================================

-- Vérifier la structure de la table products
SELECT
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'products'
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- =====================================================
-- 1. IDENTIFICATION DES PRODUITS AVEC IMAGES PROBLÉMATIQUES
-- =====================================================

-- Requête pour identifier tous les produits contenant les URLs problématiques
SELECT
    id,
    name,
    images,
    -- Vérifier si le produit contient des URLs problématiques
    CASE
        WHEN array_to_string(images, ',') LIKE '%photo-1605635669924-7e18d69b1fe8%' THEN 'olive_olives'
        WHEN array_to_string(images, ',') LIKE '%photo-1474979266404-7e18d69b1fe8%' THEN 'huile_olive'
        WHEN array_to_string(images, ',') LIKE '%photo-1558642891-b77887b1ef67%' THEN 'miel_lavande'
        WHEN array_to_string(images, ',') LIKE '%photo-1587049352851-8d4e89133924%' THEN 'pack_miel'
        WHEN array_to_string(images, ',') LIKE '%photo-1571115018088-24c8a48dfe37%' THEN 'propolis'
        ELSE 'unknown'
    END as product_type,
    -- Compter le nombre d'URLs dans l'array
    CASE
        WHEN images IS NULL THEN 0
        ELSE array_length(images, 1)
    END as image_count
FROM products
WHERE
    -- Vérifier si l'une des URLs problématiques est présente dans l'array
    array_to_string(images, ',') LIKE '%photo-1605635669924-7e18d69b1fe8%' OR
    array_to_string(images, ',') LIKE '%photo-1474979266404-7e18d69b1fe8%' OR
    array_to_string(images, ',') LIKE '%photo-1558642891-b77887b1ef67%' OR
    array_to_string(images, ',') LIKE '%photo-1587049352851-8d4e89133924%' OR
    array_to_string(images, ',') LIKE '%photo-1571115018088-24c8a48dfe37%'
ORDER BY id;

-- =====================================================
-- 2. REQUÊTES DE CORRECTION INDIVIDUELLES
-- =====================================================

-- 2.1 Remplacement pour les Olives Kalamata (photo-1605635669924-7e18d69b1fe8)
-- URL problématique : https://images.unsplash.com/photo-1605635669924-7e18d69b1fe8?w=400
-- URL de remplacement : https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400
UPDATE products
SET images = ARRAY(
    SELECT
        CASE
            WHEN element LIKE '%photo-1605635669924-7e18d69b1fe8%'
            THEN 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'
            ELSE element
        END
    FROM unnest(images) AS element
)
WHERE array_to_string(images, ',') LIKE '%photo-1605635669924-7e18d69b1fe8%';

-- Vérification du remplacement olives
SELECT id, name, images
FROM products
WHERE name LIKE '%Kalamata%'
   OR array_to_string(images, ',') LIKE '%photo-1546069901-ba9599a7e63c%';

-- =====================================================

-- 2.2 Remplacement pour l'Huile d'Olive (photo-1474979266404-7e18d69b1fe8)
-- URL problématique : https://images.unsplash.com/photo-1474979266404-7e18d69b1fe8?w=400
-- URL de remplacement : https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400
UPDATE products
SET images = ARRAY(
    SELECT
        CASE
            WHEN element LIKE '%photo-1474979266404-7e18d69b1fe8%'
            THEN 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400'
            ELSE element
        END
    FROM unnest(images) AS element
)
WHERE array_to_string(images, ',') LIKE '%photo-1474979266404-7e18d69b1fe8%';

-- Vérification du remplacement huile d'olive
SELECT id, name, images
FROM products
WHERE name LIKE '%Huile%'
   OR array_to_string(images, ',') LIKE '%photo-1555939594-58d7cb561ad1%';

-- =====================================================

-- 2.3 Remplacement pour le Miel de Lavande (photo-1558642891-b77887b1ef67)
-- URL problématique : https://images.unsplash.com/photo-1558642891-b77887b1ef67?w=400
-- URL de remplacement : https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400
UPDATE products
SET images = ARRAY(
    SELECT
        CASE
            WHEN element LIKE '%photo-1558642891-b77887b1ef67%'
            THEN 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400'
            ELSE element
        END
    FROM unnest(images) AS element
)
WHERE array_to_string(images, ',') LIKE '%photo-1558642891-b77887b1ef67%';

-- Vérification du remplacement miel lavande
SELECT id, name, images
FROM products
WHERE name LIKE '%Lavande%'
   OR array_to_string(images, ',') LIKE '%photo-1567620905732-2d1ec7ab7445%';

-- =====================================================

-- 2.4 Remplacement pour le Pack Dégustation Miel (photo-1587049352851-8d4e89133924)
-- URL problématique : https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=400
-- URL de remplacement : https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400
UPDATE products
SET images = ARRAY(
    SELECT
        CASE
            WHEN element LIKE '%photo-1587049352851-8d4e89133924%'
            THEN 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400'
            ELSE element
        END
    FROM unnest(images) AS element
)
WHERE array_to_string(images, ',') LIKE '%photo-1587049352851-8d4e89133924%';

-- Vérification du remplacement pack miel
SELECT id, name, images
FROM products
WHERE name LIKE '%Pack%'
   OR array_to_string(images, ',') LIKE '%photo-1484723091739-30a097e8f929%';

-- =====================================================

-- 2.5 Remplacement pour la Propolis (photo-1571115018088-24c8a48dfe37)
-- URL problématique : https://images.unsplash.com/photo-1571115018088-24c8a48dfe37?w=400
-- URL de remplacement : https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400
UPDATE products
SET images = ARRAY(
    SELECT
        CASE
            WHEN element LIKE '%photo-1571115018088-24c8a48dfe37%'
            THEN 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400'
            ELSE element
        END
    FROM unnest(images) AS element
)
WHERE array_to_string(images, ',') LIKE '%photo-1571115018088-24c8a48dfe37%';

-- Vérification du remplacement propolis
SELECT id, name, images
FROM products
WHERE name LIKE '%Propolis%'
   OR array_to_string(images, ',') LIKE '%photo-1498837167922-ddd27525d352%';

-- =====================================================
-- 3. VÉRIFICATION FINALE DES CHANGEMENTS
-- =====================================================

-- 3.1 Vérifier qu'aucune URL problématique ne reste
SELECT
    id,
    name,
    images
FROM products
WHERE
    array_to_string(images, ',') LIKE '%photo-1605635669924-7e18d69b1fe8%' OR
    array_to_string(images, ',') LIKE '%photo-1474979266404-7e18d69b1fe8%' OR
    array_to_string(images, ',') LIKE '%photo-1558642891-b77887b1ef67%' OR
    array_to_string(images, ',') LIKE '%photo-1587049352851-8d4e89133924%' OR
    array_to_string(images, ',') LIKE '%photo-1571115018088-24c8a48dfe37%';

-- Si la requête ci-dessus retourne 0 résultats, c'est parfait !

-- =====================================================

-- 3.2 Vérifier que toutes les nouvelles URLs sont présentes
SELECT
    id,
    name,
    images,
    CASE
        WHEN array_to_string(images, ',') LIKE '%photo-1546069901-ba9599a7e63c%' THEN '✅ Olives corrigées'
        WHEN array_to_string(images, ',') LIKE '%photo-1555939594-58d7cb561ad1%' THEN '✅ Huile d''olive corrigée'
        WHEN array_to_string(images, ',') LIKE '%photo-1567620905732-2d1ec7ab7445%' THEN '✅ Miel lavande corrigé'
        WHEN array_to_string(images, ',') LIKE '%photo-1484723091739-30a097e8f929%' THEN '✅ Pack miel corrigé'
        WHEN array_to_string(images, ',') LIKE '%photo-1498837167922-ddd27525d352%' THEN '✅ Propolis corrigée'
        ELSE '❌ Non corrigé ou autre image'
    END as status
FROM products
WHERE
    array_to_string(images, ',') LIKE '%photo-1546069901-ba9599a7e63c%' OR
    array_to_string(images, ',') LIKE '%photo-1555939594-58d7cb561ad1%' OR
    array_to_string(images, ',') LIKE '%photo-1567620905732-2d1ec7ab7445%' OR
    array_to_string(images, ',') LIKE '%photo-1484723091739-30a097e8f929%' OR
    array_to_string(images, ',') LIKE '%photo-1498837167922-ddd27525d352%'
ORDER BY id;

-- =====================================================

-- 3.3 Rapport final : État de tous les produits
SELECT
    COUNT(*) as total_products,
    COUNT(CASE WHEN images IS NULL OR array_length(images, 1) IS NULL OR array_length(images, 1) = 0 THEN 1 END) as products_without_images,
    COUNT(CASE WHEN array_length(images, 1) > 0 THEN 1 END) as products_with_images,
    SUM(COALESCE(array_length(images, 1), 0)) as total_images_count
FROM products;

-- =====================================================

-- 3.4 Détail par produit
SELECT
    id,
    name,
    CASE
        WHEN images IS NULL THEN 0
        ELSE COALESCE(array_length(images, 1), 0)
    END as image_count,
    CASE
        WHEN images IS NULL OR array_length(images, 1) IS NULL OR array_length(images, 1) = 0 THEN '❌ Aucune image'
        WHEN array_length(images, 1) = 1 THEN '✅ 1 image'
        WHEN array_length(images, 1) > 1 THEN '✅ ' || array_length(images, 1)::text || ' images'
        ELSE '❓ État inconnu'
    END as image_status
FROM products
ORDER BY CASE
        WHEN images IS NULL THEN 0
        ELSE COALESCE(array_length(images, 1), 0)
    END DESC, name;

-- =====================================================
-- MIGRATION TERMINÉE
-- =====================================================

/*
INSTRUCTIONS D'EXÉCUTION (VERSION CORRIGÉE):

1. FAIRE UN BACKUP obligatoire :
   CREATE TABLE products_backup AS SELECT * FROM products;

2. Vérifier la structure (section 0)

3. Exécuter d'abord la requête d'identification (section 1)

4. Exécuter chaque UPDATE individuellement (section 2) :
   - 2.1 pour Olives Kalamata
   - 2.2 pour Huile d'Olive
   - 2.3 pour Miel Lavande
   - 2.4 pour Pack Miel
   - 2.5 pour Propolis

5. Vérifier chaque remplacement avec les SELECT de vérification

6. Exécuter les requêtes de vérification finale (section 3)

NOUVELLES FONCTIONS UTILISÉES :
- array_to_string(images, ',') : Convertit l'array en string pour LIKE
- unnest(images) : Extrait chaque élément de l'array
- ARRAY(...) : Reconstruit l'array avec les nouvelles valeurs

CONSEILS :
- Tester sur un produit avant de faire la migration complète
- Faire un backup de la table products avant la migration
- Vérifier que les nouvelles URLs fonctionnent bien dans l'application
*/

-- =====================================================
