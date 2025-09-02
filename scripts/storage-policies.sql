-- =====================================================
-- POLITIQUES RLS SUPABASE STORAGE
-- Make the CHANGE - À utiliser avec Supabase CLI
-- =====================================================

-- =====================================================
-- ⚠️  IMPORTANT: À EXÉCUTER VIA SUPABASE CLI UNIQUEMENT
-- =====================================================

-- Commandes à exécuter:
-- 1. supabase db reset (si nécessaire)
-- 2. supabase db push
-- 3. Ou exécuter manuellement dans le SQL Editor après création des buckets

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
-- VÉRIFICATION DES POLITIQUES
-- =====================================================

-- Lister toutes les politiques créées
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
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND policyname LIKE '%projects%' OR
  policyname LIKE '%products%' OR
  policyname LIKE '%producers%' OR
  policyname LIKE '%users%' OR
  policyname LIKE '%categories%'
ORDER BY policyname;
