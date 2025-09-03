-- =====================================================
-- DIAGNOSTIC SAUVEGARDE PRODUITS - Make the CHANGE
-- Investigation du problème de sauvegarde des images
-- =====================================================

-- =====================================================
-- 1. VÉRIFICATION DE LA STRUCTURE DE LA TABLE PRODUCTS
-- =====================================================

-- Vérifier la structure complète de la table products
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'products'
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- =====================================================
-- 2. VÉRIFICATION DES DONNÉES ACTUELLES
-- =====================================================

-- Vérifier les produits avec images (notamment l'ID mentionné)
SELECT
    id,
    name,
    images,
    CASE
        WHEN images IS NULL THEN 0
        ELSE array_length(images, 1)
    END as image_count,
    array_to_string(images, ', ') as images_string
FROM products
WHERE id IN (
    '427a0f0d-e73c-42ca-91f8-1baa0596f373',  -- Olives Kalamata
    '479a6dd7-fb03-494e-93f8-7451bc1b3843',  -- Propolis
    'b18884e5-2157-4421-b48f-7eab41d19cd1',  -- Miel Lavande
    '02a48063-3166-4121-9704-6b4d9d9630e9'   -- Pack Miel
)
ORDER BY name;

-- =====================================================
-- 3. TEST DE MISE À JOUR SIMULÉE
-- =====================================================

-- Test 1: Mise à jour simple d'un champ texte
UPDATE products
SET name = name || ' (test)'
WHERE id = '427a0f0d-e73c-42ca-91f8-1baa0596f373';

-- Vérifier que la mise à jour a fonctionné
SELECT id, name FROM products WHERE id = '427a0f0d-e73c-42ca-91f8-1baa0596f373';

-- Remettre le nom original
UPDATE products
SET name = 'Olives Kalamata Bio - ILANGA'
WHERE id = '427a0f0d-e73c-42ca-91f8-1baa0596f373';

-- =====================================================

-- Test 2: Mise à jour du champ images avec une URL valide
UPDATE products
SET images = ARRAY[
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
    'https://ebmjxinsyyjwshnynwwu.supabase.co/storage/v1/object/public/products/427a0f0d-e73c-42ca-91f8-1baa0596f373/gallery/1756768701380-Sora_Task_01_Image_0__2_.webp'
]
WHERE id = '427a0f0d-e73c-42ca-91f8-1baa0596f373';

-- Vérifier que la mise à jour des images a fonctionné
SELECT
    id,
    name,
    images,
    array_length(images, 1) as image_count,
    array_to_string(images, ', ') as images_string
FROM products
WHERE id = '427a0f0d-e73c-42ca-91f8-1baa0596f373';

-- =====================================================

-- Test 3: Simulation de ce que fait l'endpoint backend
-- Créer une sauvegarde du produit avant test
CREATE TEMP TABLE product_backup AS
SELECT * FROM products WHERE id = '427a0f0d-e73c-42ca-91f8-1baa0596f373';

-- Simuler la mise à jour avec un patch (comme fait par l'endpoint)
UPDATE products
SET
    name = COALESCE(NULL, name),  -- Pas de changement
    images = COALESCE(ARRAY[
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
        'https://ebmjxinsyyjwshnynwwu.supabase.co/storage/v1/object/public/products/427a0f0d-e73c-42ca-91f8-1baa0596f373/gallery/1756768701380-Sora_Task_01_Image_0__2_.webp',
        'https://example.com/new-image.jpg'  -- Nouvelle image simulée
    ], images)
WHERE id = '427a0f0d-e73c-42ca-91f8-1baa0596f373';

-- Vérifier le résultat
SELECT
    id,
    name,
    images,
    array_length(images, 1) as image_count
FROM products
WHERE id = '427a0f0d-e73c-42ca-91f8-1baa0596f373';

-- =====================================================

-- Test 4: Test avec JSONB (si le champ était en JSONB au lieu de text[])
-- Note: Cette section est commentée car le champ est en text[]

/*
-- Conversion temporaire en JSONB pour test
ALTER TABLE products ADD COLUMN images_jsonb JSONB;
UPDATE products SET images_jsonb = to_jsonb(images) WHERE id = '427a0f0d-e73c-42ca-91f8-1baa0596f373';

-- Test de mise à jour JSONB
UPDATE products
SET images_jsonb = '[
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
    "https://ebmjxinsyyjwshnynwwu.supabase.co/storage/v1/object/public/products/427a0f0d-e73c-42ca-91f8-1baa0596f373/gallery/1756768701380-Sora_Task_01_Image_0__2_.webp"
]'::jsonb
WHERE id = '427a0f0d-e73c-42ca-91f8-1baa0596f373';

-- Vérifier
SELECT id, images_jsonb FROM products WHERE id = '427a0f0d-e73c-42ca-91f8-1baa0596f373';

-- Nettoyer
ALTER TABLE products DROP COLUMN images_jsonb;
*/

-- =====================================================
-- 4. VÉRIFICATION DES POLITIQUES RLS
-- =====================================================

-- Vérifier les politiques RLS sur la table products
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
    AND tablename = 'products'
ORDER BY policyname;

-- =====================================================
-- 5. TESTS DE VALIDATION DES DONNÉES
-- =====================================================

-- Test de validation des URLs dans le champ images
SELECT
    id,
    name,
    images,
    -- Vérifier si toutes les URLs sont valides
    CASE
        WHEN images IS NULL THEN 'NULL'
        WHEN array_length(images, 1) = 0 THEN 'EMPTY'
        WHEN array_length(images, 1) > 0 THEN 'HAS_IMAGES'
        ELSE 'UNKNOWN'
    END as status,
    -- Compter les URLs qui ressemblent à des URLs Supabase
    array_length(
        ARRAY(
            SELECT unnest
            FROM unnest(images) AS url
            WHERE url LIKE '%supabase.co%'
        ),
        1
    ) as supabase_urls_count,
    -- Compter les URLs Unsplash
    array_length(
        ARRAY(
            SELECT unnest
            FROM unnest(images) AS url
            WHERE url LIKE '%unsplash.com%'
        ),
        1
    ) as unsplash_urls_count
FROM products
WHERE id IN (
    '427a0f0d-e73c-42ca-91f8-1baa0596f373',
    '479a6dd7-fb03-494e-93f8-7451bc1b3843',
    'b18884e5-2157-4421-b48f-7eab41d19cd1',
    '02a48063-3166-4121-9704-6b4d9d9630e9'
);

-- =====================================================
-- 6. LOGS ET MONITORING
-- =====================================================

-- Créer une fonction de logging pour déboguer les mises à jour
CREATE OR REPLACE FUNCTION log_product_update()
RETURNS TRIGGER AS $$
BEGIN
    -- Log des changements dans une table temporaire
    INSERT INTO product_update_logs (
        product_id,
        old_data,
        new_data,
        changed_fields,
        updated_at
    ) VALUES (
        NEW.id,
        row_to_json(OLD),
        row_to_json(NEW),
        array(
            SELECT field
            FROM (
                SELECT 'name' as field WHERE OLD.name IS DISTINCT FROM NEW.name
                UNION ALL
                SELECT 'images' WHERE OLD.images IS DISTINCT FROM NEW.images
                UNION ALL
                SELECT 'price_points' WHERE OLD.price_points IS DISTINCT FROM NEW.price_points
                UNION ALL
                SELECT 'description' WHERE OLD.description IS DISTINCT FROM NEW.description
            ) changes
        ),
        NOW()
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer la table de logs (si elle n'existe pas)
CREATE TABLE IF NOT EXISTS product_update_logs (
    id SERIAL PRIMARY KEY,
    product_id UUID REFERENCES products(id),
    old_data JSONB,
    new_data JSONB,
    changed_fields TEXT[],
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Activer le trigger de logging (temporairement pour débogage)
DROP TRIGGER IF EXISTS product_update_trigger ON products;
CREATE TRIGGER product_update_trigger
    AFTER UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION log_product_update();

-- =====================================================
-- 7. NETTOYAGE ET RECOMMANDATIONS
-- =====================================================

/*
RÉSULTATS ATTENDUS APRÈS LES TESTS :

✅ Les mises à jour SQL directes fonctionnent
✅ Le champ images accepte les arrays text[]
✅ Les URLs Supabase sont valides
✅ Les politiques RLS sont configurées

SI LES TESTS RÉUSSISSENT :

1. Le problème est côté frontend (TanStack Query)
2. Vérifier la configuration du client tRPC
3. Vérifier les variables d'environnement
4. Vérifier les permissions de l'utilisateur admin

RECOMMANDATIONS :

1. Ajouter plus de logs côté frontend
2. Vérifier la configuration tRPC client
3. Tester avec un utilisateur admin valide
4. Vérifier les permissions RLS pour l'utilisateur

POUR NETTOYER APRÈS LES TESTS :

-- Supprimer le trigger de logging
DROP TRIGGER IF EXISTS product_update_trigger ON products;
DROP TABLE IF EXISTS product_update_logs;

-- Restaurer les données de test si nécessaire
-- (Utiliser la table product_backup créée plus tôt)
*/

-- =====================================================


