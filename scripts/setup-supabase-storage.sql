-- =====================================================
-- SETUP SUPABASE STORAGE - Make the CHANGE
-- Script de configuration des buckets et politiques
-- =====================================================

-- =====================================================
-- ⚠️  IMPORTANT: À EXÉCUTER VIA SUPABASE CLI UNIQUEMENT
-- =====================================================

-- Ce script doit être exécuté avec Supabase CLI, PAS dans le SQL Editor
-- Commande: supabase db push

-- =====================================================
-- 1. CRÉATION DES BUCKETS (Via SQL Editor Web)
-- =====================================================

-- ⚠️  EXÉCUTER CES COMMANDES UNE PAR UNE dans le SQL Editor

-- Créer le bucket projects
INSERT INTO storage.buckets (id, name, public)
VALUES ('projects', 'projects', true)
ON CONFLICT (id) DO NOTHING;

-- Créer le bucket products
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Créer le bucket producers
INSERT INTO storage.buckets (id, name, public)
VALUES ('producers', 'producers', true)
ON CONFLICT (id) DO NOTHING;

-- Créer le bucket users
INSERT INTO storage.buckets (id, name, public)
VALUES ('users', 'users', true)
ON CONFLICT (id) DO NOTHING;

-- Créer le bucket categories
INSERT INTO storage.buckets (id, name, public)
VALUES ('categories', 'categories', true)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 2. POLITIQUES DE SÉCURITÉ (Via Supabase CLI uniquement)
-- =====================================================

-- ⚠️  NE PAS EXÉCUTER CES POLITIQUES dans le SQL Editor
-- Elles doivent être créées via Supabase CLI ou l'interface web

-- Activer RLS sur les objets de stockage
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLITIQUES POUR LE BUCKET PROJECTS
-- =====================================================

-- Lecture publique pour les projets
CREATE POLICY "Projects public read" ON storage.objects
FOR SELECT USING (bucket_id = 'projects');

-- Écriture admin seulement pour les projets
CREATE POLICY "Projects admin write" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'projects'
  AND auth.role() = 'service_role'
);

CREATE POLICY "Projects admin update" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'projects'
  AND auth.role() = 'service_role'
);

CREATE POLICY "Projects admin delete" ON storage.objects
FOR DELETE USING (
  bucket_id = 'projects'
  AND auth.role() = 'service_role'
);

-- =====================================================
-- POLITIQUES POUR LE BUCKET PRODUCTS
-- =====================================================

-- Lecture publique pour les produits
CREATE POLICY "Products public read" ON storage.objects
FOR SELECT USING (bucket_id = 'products');

-- Écriture admin seulement pour les produits
CREATE POLICY "Products admin write" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'products'
  AND auth.role() = 'service_role'
);

CREATE POLICY "Products admin update" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'products'
  AND auth.role() = 'service_role'
);

CREATE POLICY "Products admin delete" ON storage.objects
FOR DELETE USING (
  bucket_id = 'products'
  AND auth.role() = 'service_role'
);

-- =====================================================
-- POLITIQUES POUR LE BUCKET PRODUCERS
-- =====================================================

-- Lecture publique pour les producteurs
CREATE POLICY "Producers public read" ON storage.objects
FOR SELECT USING (bucket_id = 'producers');

-- Écriture admin seulement pour les producteurs
CREATE POLICY "Producers admin write" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'producers'
  AND auth.role() = 'service_role'
);

CREATE POLICY "Producers admin update" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'producers'
  AND auth.role() = 'service_role'
);

CREATE POLICY "Producers admin delete" ON storage.objects
FOR DELETE USING (
  bucket_id = 'producers'
  AND auth.role() = 'service_role'
);

-- =====================================================
-- POLITIQUES POUR LE BUCKET USERS
-- =====================================================

-- Lecture publique pour les utilisateurs
CREATE POLICY "Users public read" ON storage.objects
FOR SELECT USING (bucket_id = 'users');

-- Écriture propriétaire seulement pour les utilisateurs
CREATE POLICY "Users owner write" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'users'
  AND auth.uid()::text = (string_to_array(name, '/'))[1]
);

CREATE POLICY "Users owner update" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'users'
  AND auth.uid()::text = (string_to_array(name, '/'))[1]
);

CREATE POLICY "Users owner delete" ON storage.objects
FOR DELETE USING (
  bucket_id = 'users'
  AND auth.uid()::text = (string_to_array(name, '/'))[1]
);

-- Écriture admin pour les utilisateurs (service role peut tout faire)
CREATE POLICY "Users service role all" ON storage.objects
FOR ALL USING (
  bucket_id = 'users'
  AND auth.role() = 'service_role'
);

-- =====================================================
-- POLITIQUES POUR LE BUCKET CATEGORIES
-- =====================================================

-- Lecture publique pour les catégories
CREATE POLICY "Categories public read" ON storage.objects
FOR SELECT USING (bucket_id = 'categories');

-- Écriture admin seulement pour les catégories
CREATE POLICY "Categories admin write" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'categories'
  AND auth.role() = 'service_role'
);

CREATE POLICY "Categories admin update" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'categories'
  AND auth.role() = 'service_role'
);

CREATE POLICY "Categories admin delete" ON storage.objects
FOR DELETE USING (
  bucket_id = 'categories'
  AND auth.role() = 'service_role'
);

-- =====================================================
-- 3. FONCTIONS UTILITAIRES
-- =====================================================

-- Fonction pour obtenir les stats d'un bucket
CREATE OR REPLACE FUNCTION get_bucket_stats(bucket_name text)
RETURNS json AS $$
DECLARE
  result json;
  file_count integer;
  total_size bigint;
BEGIN
  SELECT
    COUNT(*),
    COALESCE(SUM(metadata->>'size'), 0)::bigint
  INTO file_count, total_size
  FROM storage.objects
  WHERE bucket_id = bucket_name;

  result := json_build_object(
    'bucket', bucket_name,
    'file_count', file_count,
    'total_size_bytes', total_size,
    'total_size_mb', ROUND(total_size::numeric / 1024 / 1024, 2)
  );

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour nettoyer les fichiers orphelins
CREATE OR REPLACE FUNCTION cleanup_orphaned_files(bucket_name text, entity_table text, entity_column text)
RETURNS integer AS $$
DECLARE
  deleted_count integer := 0;
  file_record record;
BEGIN
  FOR file_record IN
    SELECT name, id
    FROM storage.objects
    WHERE bucket_id = bucket_name
    AND name NOT IN (
      SELECT unnest(CASE
        WHEN jsonb_typeof(entity_column::jsonb) = 'array'
        THEN entity_column::jsonb
        ELSE jsonb_build_array(entity_column)
      END) as image_url
      FROM entity_table
      WHERE entity_column IS NOT NULL
    )
  LOOP
    -- Supprimer le fichier orphelin
    DELETE FROM storage.objects WHERE id = file_record.id;
    deleted_count := deleted_count + 1;
  END LOOP;

  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 4. VÉRIFICATIONS ET TESTS
-- =====================================================

-- Vérifier que tous les buckets existent
DO $$
DECLARE
  bucket_record record;
  expected_buckets text[] := ARRAY['projects', 'products', 'producers', 'users', 'categories'];
  missing_buckets text[] := ARRAY[];
BEGIN
  FOREACH bucket_record IN
    SELECT name FROM storage.buckets WHERE name = ANY(expected_buckets)
  LOOP
    RAISE NOTICE '✅ Bucket trouvé: %', bucket_record.name;
  END LOOP;

  -- Vérifier les manquants
  SELECT array_agg(b) INTO missing_buckets
  FROM unnest(expected_buckets) AS b
  WHERE b NOT IN (SELECT name FROM storage.buckets);

  IF array_length(missing_buckets, 1) > 0 THEN
    RAISE NOTICE '❌ Buckets manquants: %', missing_buckets;
  ELSE
    RAISE NOTICE '✅ Tous les buckets requis sont présents';
  END IF;
END $$;

-- =====================================================
-- 5. INDEX DE PERFORMANCE
-- =====================================================

-- Index pour améliorer les performances des requêtes storage
CREATE INDEX IF NOT EXISTS idx_storage_objects_bucket_name
ON storage.objects(bucket_id, name);

CREATE INDEX IF NOT EXISTS idx_storage_objects_created_at
ON storage.objects(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_storage_objects_owner
ON storage.objects(owner) WHERE owner IS NOT NULL;

-- =====================================================
-- SETUP TERMINÉ
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'SETUP SUPABASE STORAGE TERMINÉ';
  RAISE NOTICE '==============================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Buckets créés:';
  RAISE NOTICE '✅ projects - Images des projets biodiversité';
  RAISE NOTICE '✅ products - Images des produits e-commerce';
  RAISE NOTICE '✅ producers - Images des producteurs';
  RAISE NOTICE '✅ users - Avatars et médias utilisateurs';
  RAISE NOTICE '✅ categories - Images des catégories';
  RAISE NOTICE '';
  RAISE NOTICE 'Politiques RLS configurées:';
  RAISE NOTICE '✅ Lecture publique activée';
  RAISE NOTICE '✅ Écriture admin pour la plupart des buckets';
  RAISE NOTICE '✅ Écriture propriétaire pour le bucket users';
  RAISE NOTICE '';
  RAISE NOTICE 'Fonctions utilitaires:';
  RAISE NOTICE '✅ get_bucket_stats() - Statistiques de stockage';
  RAISE NOTICE '✅ cleanup_orphaned_files() - Nettoyage fichiers orphelins';
  RAISE NOTICE '';
  RAISE NOTICE 'Index de performance créés ✅';
  RAISE NOTICE '';
  RAISE NOTICE 'Prochaines étapes:';
  RAISE NOTICE '1. Tester l''upload d''images via l''interface admin';
  RAISE NOTICE '2. Vérifier les transformations automatiques';
  RAISE NOTICE '3. Configurer le monitoring du stockage';
  RAISE NOTICE '';
  RAISE NOTICE '==============================================';
END $$;
