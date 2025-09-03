-- =====================================================
-- ÉTAPE 5 - MIGRATION DES DONNÉES EXISTANTES (OPTIONNEL)
-- Make the CHANGE - Migration des blur_hashes existants
-- =====================================================
-- 
-- À exécuter dans : Supabase SQL Editor
-- Ordre : 5ème script à exécuter (après 04_create_triggers.sql)
-- Durée estimée : ~10-30 secondes (selon le nombre de produits)
--
-- ⚠️  IMPORTANT : Ce script est OPTIONNEL
--     Exécuter seulement si vous avez des données dans products.blur_hashes
--
-- =====================================================

-- Vérifier d'abord s'il y a des données à migrer
DO $$
DECLARE
    products_with_blur_count INTEGER;
    total_blur_entries INTEGER;
BEGIN
    -- Compter les produits qui ont des blur_hashes
    SELECT COUNT(*) INTO products_with_blur_count
    FROM products 
    WHERE blur_hashes IS NOT NULL 
    AND ARRAY_LENGTH(blur_hashes, 1) > 0;
    
    -- Compter le total d'entrées blur
    SELECT SUM(ARRAY_LENGTH(blur_hashes, 1)) INTO total_blur_entries
    FROM products 
    WHERE blur_hashes IS NOT NULL;
    
    RAISE NOTICE '📊 ANALYSE PRE-MIGRATION:';
    RAISE NOTICE '   Produits avec blur_hashes: %', products_with_blur_count;
    RAISE NOTICE '   Total entrées blur à migrer: %', COALESCE(total_blur_entries, 0);
    
    IF products_with_blur_count = 0 THEN
        RAISE NOTICE '✅ Aucune donnée à migrer - vous pouvez passer au script suivant';
    ELSE
        RAISE NOTICE '⚠️  Données détectées - migration nécessaire';
    END IF;
END $$;

-- =====================================================
-- MIGRATION AUTOMATIQUE
-- =====================================================

-- Fonction pour migrer les blur_hashes depuis products vers image_blur_hashes
CREATE OR REPLACE FUNCTION migrate_product_blur_hashes()
RETURNS TABLE (
    product_id UUID,
    product_name TEXT,
    migrated_count INTEGER,
    errors TEXT[]
) AS $$
DECLARE
    product_record RECORD;
    blur_entry TEXT;
    blur_json JSONB;
    migrated_count INTEGER;
    error_messages TEXT[];
    total_migrated INTEGER := 0;
BEGIN
    -- Parcourir tous les produits avec blur_hashes
    FOR product_record IN 
        SELECT p.id, p.name, p.blur_hashes
        FROM products p 
        WHERE p.blur_hashes IS NOT NULL 
        AND ARRAY_LENGTH(p.blur_hashes, 1) > 0
    LOOP
        migrated_count := 0;
        error_messages := ARRAY[]::TEXT[];
        
        -- Parcourir chaque blur_hash du produit
        FOREACH blur_entry IN ARRAY product_record.blur_hashes
        LOOP
            BEGIN
                -- Parser le JSON
                blur_json := blur_entry::JSONB;
                
                -- Insérer dans la nouvelle table
                INSERT INTO image_blur_hashes (
                    image_url,
                    blur_hash,
                    entity_type,
                    entity_id,
                    generated_at
                ) VALUES (
                    blur_json->>'url',
                    blur_json->>'blurhash',
                    'product',
                    product_record.id::TEXT,
                    NOW()
                ) ON CONFLICT (image_url) DO NOTHING; -- Ignorer si déjà existant
                
                migrated_count := migrated_count + 1;
                
            EXCEPTION 
                WHEN OTHERS THEN
                    error_messages := error_messages || ARRAY[
                        FORMAT('Erreur blur entry "%s": %s', 
                               LEFT(blur_entry, 50) || '...', 
                               SQLERRM)
                    ];
            END;
        END LOOP;
        
        total_migrated := total_migrated + migrated_count;
        
        -- Retourner les résultats pour ce produit
        RETURN QUERY SELECT 
            product_record.id,
            product_record.name,
            migrated_count,
            error_messages;
    END LOOP;
    
    RAISE NOTICE '📈 MIGRATION TERMINÉE: % blur hashes migrés au total', total_migrated;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- EXÉCUTION DE LA MIGRATION
-- =====================================================

-- Lancer la migration et afficher les résultats
DO $$
DECLARE
    migration_result RECORD;
    total_products INTEGER := 0;
    total_migrated INTEGER := 0;
    total_errors INTEGER := 0;
BEGIN
    RAISE NOTICE '🚀 DÉBUT DE LA MIGRATION...';
    
    FOR migration_result IN 
        SELECT * FROM migrate_product_blur_hashes()
    LOOP
        total_products := total_products + 1;
        total_migrated := total_migrated + migration_result.migrated_count;
        
        IF ARRAY_LENGTH(migration_result.errors, 1) > 0 THEN
            total_errors := total_errors + ARRAY_LENGTH(migration_result.errors, 1);
            RAISE WARNING '⚠️  Produit % (%): % migrés, % erreurs',
                migration_result.product_name,
                migration_result.product_id,
                migration_result.migrated_count,
                ARRAY_LENGTH(migration_result.errors, 1);
        ELSE
            RAISE NOTICE '✅ Produit % (%): % blur hashes migrés',
                migration_result.product_name,
                migration_result.product_id,
                migration_result.migrated_count;
        END IF;
    END LOOP;
    
    RAISE NOTICE '📊 RÉSUMÉ MIGRATION:';
    RAISE NOTICE '   Produits traités: %', total_products;
    RAISE NOTICE '   Blur hashes migrés: %', total_migrated;
    RAISE NOTICE '   Erreurs: %', total_errors;
    
    IF total_errors = 0 THEN
        RAISE NOTICE '🎉 Migration réussie sans erreur !';
    ELSE
        RAISE WARNING '⚠️  Migration terminée avec % erreurs', total_errors;
    END IF;
END $$;

-- =====================================================
-- VÉRIFICATION POST-MIGRATION
-- =====================================================

-- Comparer les données avant/après migration
DO $$
DECLARE
    old_system_count INTEGER;
    new_system_count INTEGER;
    coverage_percent NUMERIC;
BEGIN
    -- Compter dans l'ancien système
    SELECT SUM(ARRAY_LENGTH(blur_hashes, 1)) INTO old_system_count
    FROM products 
    WHERE blur_hashes IS NOT NULL;
    
    -- Compter dans le nouveau système
    SELECT COUNT(*) INTO new_system_count
    FROM image_blur_hashes
    WHERE entity_type = 'product';
    
    -- Calculer le pourcentage de couverture
    IF old_system_count > 0 THEN
        coverage_percent := ROUND((new_system_count::NUMERIC / old_system_count) * 100, 1);
    ELSE
        coverage_percent := 100;
    END IF;
    
    RAISE NOTICE '📊 VÉRIFICATION POST-MIGRATION:';
    RAISE NOTICE '   Ancien système: % blur hashes', COALESCE(old_system_count, 0);
    RAISE NOTICE '   Nouveau système: % blur hashes', new_system_count;
    RAISE NOTICE '   Couverture: %% ', coverage_percent;
    
    IF coverage_percent >= 95 THEN
        RAISE NOTICE '✅ Migration excellente (>= 95%% de couverture)';
    ELSIF coverage_percent >= 80 THEN
        RAISE NOTICE '⚠️  Migration correcte (>= 80%% de couverture)';
    ELSE
        RAISE WARNING '❌ Migration incomplète (< 80%% de couverture)';
    END IF;
END $$;

-- =====================================================
-- NETTOYAGE (OPTIONNEL - À FAIRE PLUS TARD)
-- =====================================================

-- ⚠️ NE PAS EXÉCUTER MAINTENANT - SEULEMENT APRÈS VÉRIFICATION COMPLÈTE
-- 
-- Quand vous êtes sûr que tout fonctionne, vous pouvez supprimer l'ancienne colonne:
-- 
-- -- Supprimer l'ancienne colonne blur_hashes (ATTENTION: irréversible!)
-- -- ALTER TABLE products DROP COLUMN blur_hashes;
-- 
-- -- Supprimer la fonction de migration (cleanup)
-- -- DROP FUNCTION IF EXISTS migrate_product_blur_hashes();

-- =====================================================
-- EXEMPLES DE TEST POST-MIGRATION  
-- =====================================================

-- Test 1: Voir les produits avec leurs nouveaux blur hashes
SELECT 
    p.name,
    ARRAY_LENGTH(p.images, 1) as total_images,
    COUNT(ibh.id) as blur_count,
    ROUND(
        (COUNT(ibh.id)::DECIMAL / GREATEST(ARRAY_LENGTH(p.images, 1), 1)) * 100, 
        0
    ) as coverage_percent
FROM products p
LEFT JOIN image_blur_hashes ibh ON (
    ibh.entity_type = 'product' 
    AND ibh.entity_id = p.id::text
)
WHERE ARRAY_LENGTH(p.images, 1) > 0
GROUP BY p.id, p.name
ORDER BY coverage_percent DESC
LIMIT 10;

-- Test 2: Statistiques de migration
SELECT * FROM blur_system_stats WHERE entity_type IN ('product', 'TOTAL');

-- =====================================================
-- PROCHAINE ÉTAPE
-- =====================================================
/*
✅ SCRIPT 5 TERMINÉ (optionnel)

PROCHAINE ÉTAPE : Exécuter le script 06_final_verification.sql
*/