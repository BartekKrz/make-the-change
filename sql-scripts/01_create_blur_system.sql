-- =====================================================
-- ÉTAPE 1 - CRÉATION DU SYSTÈME BLUR SCALABLE
-- Make the CHANGE - Architecture optimisée pour le scale
-- =====================================================
-- 
-- À exécuter dans : Supabase SQL Editor
-- Ordre : 1er script à exécuter
-- Durée estimée : ~10 secondes
--
-- =====================================================

-- 1. Créer la table principale pour les blur hashes
CREATE TABLE IF NOT EXISTS image_blur_hashes (
  id SERIAL PRIMARY KEY,
  image_url TEXT NOT NULL,
  blur_hash TEXT NOT NULL,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('product', 'producer', 'project', 'category', 'user')),
  entity_id TEXT NOT NULL,
  
  -- Métadonnées d'optimisation
  width INTEGER,
  height INTEGER,
  file_size INTEGER,
  
  -- Timestamps
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Contraintes
  CONSTRAINT image_blur_hashes_url_key UNIQUE (image_url)
);

-- 2. Index optimisés pour performance
CREATE INDEX IF NOT EXISTS idx_image_blur_hashes_url ON image_blur_hashes (image_url);
CREATE INDEX IF NOT EXISTS idx_image_blur_hashes_entity ON image_blur_hashes (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_image_blur_hashes_generated ON image_blur_hashes (generated_at DESC);

-- 3. Trigger pour updated_at automatique
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_image_blur_hashes_updated_at 
    BEFORE UPDATE ON image_blur_hashes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 4. RLS (Row Level Security) pour sécurité
ALTER TABLE image_blur_hashes ENABLE ROW LEVEL SECURITY;

-- Politique de lecture publique (pour affichage des produits)
CREATE POLICY "Public read access" ON image_blur_hashes
    FOR SELECT USING (true);

-- Politique d'écriture pour utilisateurs authentifiés
CREATE POLICY "Authenticated write access" ON image_blur_hashes
    FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- VÉRIFICATION
-- =====================================================

-- Vérifier que la table a été créée correctement
SELECT 
    'Table créée avec succès' as status,
    COUNT(*) as initial_count,
    NOW() as created_at
FROM image_blur_hashes;

-- Vérifier les index
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'image_blur_hashes'
ORDER BY indexname;

-- =====================================================
-- PROCHAINE ÉTAPE
-- =====================================================
/*
✅ SCRIPT 1 TERMINÉ

PROCHAINE ÉTAPE : Exécuter le script 02_create_functions.sql
*/