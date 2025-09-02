-- =====================================================
-- CRÉATION DES BUCKETS SUPABASE STORAGE
-- Make the CHANGE - Script simple pour SQL Editor
-- =====================================================

-- À exécuter UNE PAR UNE dans le SQL Editor de Supabase

-- Créer le bucket projects
INSERT INTO storage.buckets (id, name, public)
VALUES ('projects', 'projects', true)
ON CONFLICT (id) DO NOTHING;

-- Vérifier la création
SELECT * FROM storage.buckets WHERE name = 'projects';

-- =====================================================

-- Créer le bucket products
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Vérifier la création
SELECT * FROM storage.buckets WHERE name = 'products';

-- =====================================================

-- Créer le bucket producers
INSERT INTO storage.buckets (id, name, public)
VALUES ('producers', 'producers', true)
ON CONFLICT (id) DO NOTHING;

-- Vérifier la création
SELECT * FROM storage.buckets WHERE name = 'producers';

-- =====================================================

-- Créer le bucket users
INSERT INTO storage.buckets (id, name, public)
VALUES ('users', 'users', true)
ON CONFLICT (id) DO NOTHING;

-- Vérifier la création
SELECT * FROM storage.buckets WHERE name = 'users';

-- =====================================================

-- Créer le bucket categories
INSERT INTO storage.buckets (id, name, public)
VALUES ('categories', 'categories', true)
ON CONFLICT (id) DO NOTHING;

-- Vérifier la création
SELECT * FROM storage.buckets WHERE name = 'categories';

-- =====================================================

-- VÉRIFICATION FINALE
-- Lister tous les buckets créés
SELECT id, name, public, created_at
FROM storage.buckets
WHERE name IN ('projects', 'products', 'producers', 'users', 'categories')
ORDER BY created_at DESC;
