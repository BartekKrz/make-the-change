-- Script pour mettre à jour les images Unsplash obsolètes
-- Remplace les URLs qui retournent 404 par de nouvelles images

-- 1. Voir les produits avec images actuelles
SELECT id, name, images
FROM products
WHERE images IS NOT NULL
    AND jsonb_array_length(images) > 0;

-- 2. Nouvelles URLs Unsplash qui marchent (testées)
UPDATE products 
SET images = '["https://images.unsplash.com/photo-1587049352851-8d4e89133924"]'
::jsonb
WHERE id = '427a0f0d-e73c-42ca-91f8-1baa0596f373' -- Olives Kalamata Bio
AND images @> '["https://images.unsplash.com/photo-1605635669924-7e18d69b1fe8?w=400"]'::jsonb;

-- 3. Autres mises à jour si nécessaire
UPDATE products 
SET images = '["https://images.unsplash.com/photo-1558642891-b77887b1ef67"]'
::jsonb
WHERE images @> '["https://images.unsplash.com/photo-1558642891-b77887b1ef67?w=400"]'::jsonb;

UPDATE products 
SET images = '["https://images.unsplash.com/photo-1474979266404-7e18d69b1fe8"]'
::jsonb
WHERE images @> '["https://images.unsplash.com/photo-1474979266404-7e18d69b1fe8?w=400"]'::jsonb;

-- 4. Vérification finale
SELECT id, name, images
FROM products
WHERE images IS NOT NULL
    AND jsonb_array_length(images) > 0;
