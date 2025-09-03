-- =====================================================
-- ÉTAPE 2 - FONCTIONS UTILITAIRES POUR LE SYSTÈME BLUR
-- Make the CHANGE - Fonctions optimisées pour performance
-- =====================================================
-- 
-- À exécuter dans : Supabase SQL Editor
-- Ordre : 2ème script à exécuter (après 01_create_blur_system.sql)
-- Durée estimée : ~5 secondes
--
-- =====================================================

-- 1. Fonction pour récupérer un blur hash (O(1) grâce à l'index)
CREATE OR REPLACE FUNCTION get_image_blur_hash(p_image_url TEXT)
RETURNS TEXT AS $$
DECLARE
    blur_result TEXT;
BEGIN
    SELECT blur_hash INTO blur_result
    FROM image_blur_hashes
    WHERE image_url = p_image_url;
    
    RETURN blur_result;
END;
$$ LANGUAGE plpgsql STABLE;

-- 2. Fonction pour insérer/mettre à jour un blur hash
CREATE OR REPLACE FUNCTION upsert_image_blur_hash(
    p_image_url TEXT,
    p_blur_hash TEXT,
    p_entity_type TEXT,
    p_entity_id TEXT,
    p_width INTEGER DEFAULT NULL,
    p_height INTEGER DEFAULT NULL,
    p_file_size INTEGER DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
    INSERT INTO image_blur_hashes (
        image_url, blur_hash, entity_type, entity_id, 
        width, height, file_size
    )
    VALUES (
        p_image_url, p_blur_hash, p_entity_type, p_entity_id,
        p_width, p_height, p_file_size
    )
    ON CONFLICT (image_url) 
    DO UPDATE SET 
        blur_hash = EXCLUDED.blur_hash,
        entity_type = EXCLUDED.entity_type,
        entity_id = EXCLUDED.entity_id,
        width = EXCLUDED.width,
        height = EXCLUDED.height,
        file_size = EXCLUDED.file_size,
        updated_at = NOW();
        
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        -- Log l'erreur et retourner false
        RAISE WARNING 'Erreur lors de l''upsert blur hash pour %: %', p_image_url, SQLERRM;
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- 3. Fonction pour récupérer tous les blur hashes d'une entité
CREATE OR REPLACE FUNCTION get_entity_blur_hashes(
    p_entity_type TEXT,
    p_entity_id TEXT
)
RETURNS TABLE (
    image_url TEXT,
    blur_hash TEXT,
    width INTEGER,
    height INTEGER,
    file_size INTEGER,
    generated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ibh.image_url,
        ibh.blur_hash,
        ibh.width,
        ibh.height,
        ibh.file_size,
        ibh.generated_at
    FROM image_blur_hashes ibh
    WHERE ibh.entity_type = p_entity_type 
    AND ibh.entity_id = p_entity_id
    ORDER BY ibh.generated_at ASC;
END;
$$ LANGUAGE plpgsql STABLE;

-- 4. Fonction de nettoyage des blur hashes orphelins
CREATE OR REPLACE FUNCTION cleanup_orphaned_blur_hashes(p_entity_type TEXT DEFAULT NULL)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Supprimer les blur hashes pour les produits qui n'existent plus
    DELETE FROM image_blur_hashes ibh
    WHERE (p_entity_type IS NULL OR ibh.entity_type = p_entity_type)
    AND (
        (ibh.entity_type = 'product' AND NOT EXISTS (
            SELECT 1 FROM products p WHERE p.id::text = ibh.entity_id
        ))
        OR
        (ibh.entity_type = 'producer' AND NOT EXISTS (
            SELECT 1 FROM producers pr WHERE pr.id::text = ibh.entity_id  
        ))
        OR
        (ibh.entity_type = 'project' AND NOT EXISTS (
            SELECT 1 FROM projects pj WHERE pj.id::text = ibh.entity_id
        ))
    );
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    RAISE NOTICE 'Nettoyage terminé : % blur hashes orphelins supprimés', deleted_count;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TESTS DES FONCTIONS
-- =====================================================

-- Test de la fonction upsert
DO $$
DECLARE
    test_result BOOLEAN;
BEGIN
    -- Tester l'insertion
    SELECT upsert_image_blur_hash(
        'https://test.example.com/test-image.jpg',
        'LEHV6nWB2yk8pyo0adR*.7kCMdnj',
        'product',
        'test-product-123',
        800,
        600,
        150000
    ) INTO test_result;
    
    IF test_result THEN
        RAISE NOTICE '✅ Test upsert fonction : SUCCÈS';
    ELSE
        RAISE WARNING '❌ Test upsert fonction : ÉCHEC';
    END IF;
END $$;

-- Test de la fonction get
DO $$
DECLARE
    test_blur TEXT;
BEGIN
    SELECT get_image_blur_hash('https://test.example.com/test-image.jpg') INTO test_blur;
    
    IF test_blur IS NOT NULL THEN
        RAISE NOTICE '✅ Test get fonction : SUCCÈS - blur trouvé: %', LEFT(test_blur, 20) || '...';
    ELSE
        RAISE WARNING '❌ Test get fonction : ÉCHEC - blur non trouvé';
    END IF;
END $$;

-- Nettoyer le test
DELETE FROM image_blur_hashes WHERE image_url = 'https://test.example.com/test-image.jpg';

-- =====================================================
-- STATISTIQUES ET VÉRIFICATION
-- =====================================================

-- Vérifier que toutes les fonctions ont été créées
SELECT 
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE '%blur%'
ORDER BY routine_name;

-- =====================================================
-- PROCHAINE ÉTAPE
-- =====================================================
/*
✅ SCRIPT 2 TERMINÉ

PROCHAINE ÉTAPE : Exécuter le script 03_create_views.sql
*/