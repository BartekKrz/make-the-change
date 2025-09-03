-- =====================================================
-- ÉTAPE 4 - TRIGGERS POUR MAINTIEN AUTOMATIQUE DES DONNÉES
-- Make the CHANGE - Synchronisation automatique des blur hashes
-- =====================================================
-- 
-- À exécuter dans : Supabase SQL Editor
-- Ordre : 4ème script à exécuter (après 03_create_views.sql)
-- Durée estimée : ~5 secondes
--
-- =====================================================

-- 1. Fonction trigger pour nettoyage automatique lors de modification/suppression
CREATE OR REPLACE FUNCTION handle_product_image_changes()
RETURNS TRIGGER AS $$
BEGIN
    -- Si un produit est supprimé
    IF TG_OP = 'DELETE' THEN
        -- Supprimer tous les blur hashes associés
        DELETE FROM image_blur_hashes 
        WHERE entity_type = 'product' 
        AND entity_id = OLD.id::text;
        
        RAISE NOTICE 'Blur hashes supprimés pour produit supprimé: %', OLD.name;
        RETURN OLD;
    END IF;
    
    -- Si les images d'un produit sont modifiées
    IF TG_OP = 'UPDATE' AND (OLD.images IS DISTINCT FROM NEW.images) THEN
        -- Supprimer les blur hashes pour les images qui ne sont plus dans le produit
        DELETE FROM image_blur_hashes 
        WHERE entity_type = 'product' 
        AND entity_id = NEW.id::text
        AND NOT (image_url = ANY(NEW.images));
        
        -- Log des changements
        RAISE NOTICE 'Blur hashes nettoyés pour produit modifié: % (% images)', NEW.name, COALESCE(ARRAY_LENGTH(NEW.images, 1), 0);
        
        RETURN NEW;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Créer le trigger sur la table products
DROP TRIGGER IF EXISTS trigger_handle_product_image_changes ON products;
CREATE TRIGGER trigger_handle_product_image_changes
    AFTER UPDATE OR DELETE ON products
    FOR EACH ROW 
    EXECUTE FUNCTION handle_product_image_changes();

-- 3. Fonction trigger pour logging des changements de blur hashes
CREATE OR REPLACE FUNCTION log_blur_hash_changes()
RETURNS TRIGGER AS $$
BEGIN
    -- Log lors d'insertion
    IF TG_OP = 'INSERT' THEN
        RAISE NOTICE 'Nouveau blur hash créé: % pour entité %:%', 
            LEFT(NEW.blur_hash, 20) || '...', NEW.entity_type, NEW.entity_id;
        RETURN NEW;
    END IF;
    
    -- Log lors de modification
    IF TG_OP = 'UPDATE' THEN
        RAISE NOTICE 'Blur hash modifié: % pour entité %:%', 
            LEFT(NEW.blur_hash, 20) || '...', NEW.entity_type, NEW.entity_id;
        RETURN NEW;
    END IF;
    
    -- Log lors de suppression
    IF TG_OP = 'DELETE' THEN
        RAISE NOTICE 'Blur hash supprimé: % pour entité %:%', 
            LEFT(OLD.blur_hash, 20) || '...', OLD.entity_type, OLD.entity_id;
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 4. Créer le trigger de logging (optionnel - peut être désactivé en production)
DROP TRIGGER IF EXISTS trigger_log_blur_hash_changes ON image_blur_hashes;
CREATE TRIGGER trigger_log_blur_hash_changes
    AFTER INSERT OR UPDATE OR DELETE ON image_blur_hashes
    FOR EACH ROW 
    EXECUTE FUNCTION log_blur_hash_changes();

-- 5. Fonction trigger pour validation des données
CREATE OR REPLACE FUNCTION validate_blur_hash_data()
RETURNS TRIGGER AS $$
BEGIN
    -- Validation de l'URL
    IF NEW.image_url IS NULL OR NEW.image_url = '' THEN
        RAISE EXCEPTION 'image_url ne peut pas être vide';
    END IF;
    
    -- Validation du blur hash
    IF NEW.blur_hash IS NULL OR NEW.blur_hash = '' THEN
        RAISE EXCEPTION 'blur_hash ne peut pas être vide';
    END IF;
    
    -- Validation des dimensions (si fournies)
    IF NEW.width IS NOT NULL AND NEW.width <= 0 THEN
        RAISE EXCEPTION 'width doit être positif';
    END IF;
    
    IF NEW.height IS NOT NULL AND NEW.height <= 0 THEN
        RAISE EXCEPTION 'height doit être positif';
    END IF;
    
    -- Validation de la taille de fichier (si fournie)
    IF NEW.file_size IS NOT NULL AND NEW.file_size <= 0 THEN
        RAISE EXCEPTION 'file_size doit être positif';
    END IF;
    
    -- Normalisation de l'URL (retirer les espaces)
    NEW.image_url = TRIM(NEW.image_url);
    NEW.blur_hash = TRIM(NEW.blur_hash);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Créer le trigger de validation
DROP TRIGGER IF EXISTS trigger_validate_blur_hash_data ON image_blur_hashes;
CREATE TRIGGER trigger_validate_blur_hash_data
    BEFORE INSERT OR UPDATE ON image_blur_hashes
    FOR EACH ROW 
    EXECUTE FUNCTION validate_blur_hash_data();

-- =====================================================
-- FONCTION DE MAINTENANCE AUTOMATIQUE
-- =====================================================

-- Fonction pour nettoyer automatiquement les données anciennes/orphelines
CREATE OR REPLACE FUNCTION maintenance_blur_system()
RETURNS TEXT AS $$
DECLARE
    deleted_orphans INTEGER;
    deleted_old INTEGER;
    result_text TEXT;
BEGIN
    -- 1. Nettoyer les blur hashes orphelins
    SELECT cleanup_orphaned_blur_hashes() INTO deleted_orphans;
    
    -- 2. Supprimer les blur hashes très anciens (plus de 1 an) si l'image n'existe plus
    DELETE FROM image_blur_hashes
    WHERE generated_at < NOW() - INTERVAL '1 year'
    AND NOT EXISTS (
        SELECT 1 FROM products p 
        WHERE image_url = ANY(p.images)
        UNION
        SELECT 1 FROM producers pr 
        WHERE image_url IN (pr.logo_url, pr.cover_image) OR image_url = ANY(pr.gallery_images)
        UNION  
        SELECT 1 FROM projects pj
        WHERE image_url = pj.hero_image OR image_url = ANY(pj.gallery_images)
    );
    
    GET DIAGNOSTICS deleted_old = ROW_COUNT;
    
    -- 3. Créer le rapport
    result_text := FORMAT(
        'Maintenance terminée: %s blur hashes orphelins supprimés, %s anciens blur hashes supprimés',
        deleted_orphans, deleted_old
    );
    
    RAISE NOTICE '%', result_text;
    RETURN result_text;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TESTS DES TRIGGERS
-- =====================================================

-- Test avec données factices
DO $$
DECLARE
    test_product_id UUID;
    test_images TEXT[];
BEGIN
    -- Créer un produit de test
    INSERT INTO products (name, slug, price_points, category_id, producer_id, images)
    VALUES (
        'Test Product Trigger',
        'test-product-trigger-' || EXTRACT(EPOCH FROM NOW())::TEXT,
        100,
        (SELECT id FROM categories LIMIT 1),
        (SELECT id FROM producers LIMIT 1),
        ARRAY['https://test1.jpg', 'https://test2.jpg']
    ) RETURNING id INTO test_product_id;
    
    -- Ajouter des blur hashes pour ce produit
    PERFORM upsert_image_blur_hash(
        'https://test1.jpg', 
        'LEHV6nWB2yk8pyo0adR*.7kCMdnj', 
        'product', 
        test_product_id::text,
        800, 600, 50000
    );
    
    PERFORM upsert_image_blur_hash(
        'https://test2.jpg', 
        'UEG*_N00-;t7~qofRjRj_3RjRj', 
        'product', 
        test_product_id::text,
        600, 400, 30000
    );
    
    RAISE NOTICE '✅ Test création blur hashes: SUCCÈS';
    
    -- Modifier les images du produit (supprimer test2.jpg)
    UPDATE products 
    SET images = ARRAY['https://test1.jpg'] 
    WHERE id = test_product_id;
    
    -- Vérifier que le blur hash de test2.jpg a été supprimé
    IF NOT EXISTS (
        SELECT 1 FROM image_blur_hashes 
        WHERE image_url = 'https://test2.jpg' 
        AND entity_id = test_product_id::text
    ) THEN
        RAISE NOTICE '✅ Test nettoyage automatique: SUCCÈS';
    ELSE
        RAISE WARNING '❌ Test nettoyage automatique: ÉCHEC';
    END IF;
    
    -- Supprimer le produit de test
    DELETE FROM products WHERE id = test_product_id;
    
    -- Vérifier que tous les blur hashes ont été supprimés
    IF NOT EXISTS (
        SELECT 1 FROM image_blur_hashes 
        WHERE entity_id = test_product_id::text
    ) THEN
        RAISE NOTICE '✅ Test suppression cascade: SUCCÈS';
    ELSE
        RAISE WARNING '❌ Test suppression cascade: ÉCHEC';
    END IF;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING '❌ Test triggers échoué: %', SQLERRM;
        -- Nettoyer si besoin
        DELETE FROM products WHERE name = 'Test Product Trigger';
END $$;

-- =====================================================
-- VÉRIFICATION FINALE
-- =====================================================

-- Vérifier que tous les triggers ont été créés
SELECT 
    trigger_name,
    event_object_table,
    action_timing,
    event_manipulation
FROM information_schema.triggers 
WHERE trigger_schema = 'public' 
AND (trigger_name LIKE '%blur%' OR trigger_name LIKE '%product_image%')
ORDER BY trigger_name;

-- Vérifier les fonctions
SELECT 
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND (routine_name LIKE '%blur%' OR routine_name LIKE '%product_image%')
ORDER BY routine_name;

-- =====================================================
-- PROCHAINE ÉTAPE
-- =====================================================
/*
✅ SCRIPT 4 TERMINÉ

PROCHAINE ÉTAPE : Exécuter le script 05_migrate_existing_data.sql (si vous avez des données existantes à migrer)
OU
PASSER DIRECTEMENT AU : 06_final_verification.sql pour vérifier que tout fonctionne
*/