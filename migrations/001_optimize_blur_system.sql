-- =====================================================
-- MIGRATION: Optimisation du système BlurHash Production
-- Make the CHANGE - Migration vers système blur côté serveur
-- =====================================================

-- 1. Créer une table dédiée pour les blur hashes (meilleure performance)
CREATE TABLE IF NOT EXISTS image_blur_hashes (
  id SERIAL PRIMARY KEY,
  image_url TEXT NOT NULL UNIQUE,
  blur_hash TEXT NOT NULL,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  entity_type TEXT NOT NULL, -- 'product', 'producer', 'project'
  entity_id TEXT NOT NULL,
  width INTEGER,
  height INTEGER,
  file_size INTEGER,
  
  -- Index pour performance
  CONSTRAINT image_blur_hashes_url_key UNIQUE (image_url)
);

-- Index optimisés pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_image_blur_hashes_entity ON image_blur_hashes (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_image_blur_hashes_url ON image_blur_hashes (image_url);
CREATE INDEX IF NOT EXISTS idx_image_blur_hashes_generated ON image_blur_hashes (generated_at DESC);

-- 2. Fonction pour obtenir le blur hash d'une image
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

-- 3. Fonction pour insérer/updater un blur hash
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
    generated_at = NOW(),
    entity_type = EXCLUDED.entity_type,
    entity_id = EXCLUDED.entity_id,
    width = EXCLUDED.width,
    height = EXCLUDED.height,
    file_size = EXCLUDED.file_size;
    
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- 4. Vue pour obtenir les produits avec leurs blur hashes
CREATE OR REPLACE VIEW products_with_blur_hashes AS
SELECT 
  p.*,
  COALESCE(
    ARRAY_AGG(
      json_build_object(
        'url', ibh.image_url,
        'blurHash', ibh.blur_hash,
        'width', ibh.width,
        'height', ibh.height
      ) ORDER BY 
        CASE 
          WHEN ibh.image_url = ANY(p.images) 
          THEN array_position(p.images, ibh.image_url) 
          ELSE 999 
        END
    ) FILTER (WHERE ibh.image_url IS NOT NULL),
    ARRAY[]::json[]
  ) as computed_blur_hashes
FROM products p
LEFT JOIN image_blur_hashes ibh ON (
  ibh.entity_type = 'product' 
  AND ibh.entity_id = p.id::text 
  AND ibh.image_url = ANY(p.images)
)
GROUP BY p.id;

-- 5. RLS (Row Level Security) pour sécurité
ALTER TABLE image_blur_hashes ENABLE ROW LEVEL SECURITY;

-- Politique: Lecture publique (pour affichage public des produits)
CREATE POLICY "Public read access for blur hashes" ON image_blur_hashes
  FOR SELECT USING (true);

-- Politique: Écriture pour les utilisateurs authentifiés seulement
CREATE POLICY "Authenticated write access for blur hashes" ON image_blur_hashes
  FOR ALL USING (auth.role() = 'authenticated');

-- 6. Trigger pour nettoyer les blur hashes orphelins
CREATE OR REPLACE FUNCTION cleanup_orphaned_blur_hashes()
RETURNS TRIGGER AS $$
BEGIN
  -- Si un produit est supprimé, supprimer ses blur hashes
  IF TG_OP = 'DELETE' THEN
    DELETE FROM image_blur_hashes 
    WHERE entity_type = 'product' AND entity_id = OLD.id::text;
    RETURN OLD;
  END IF;
  
  -- Si les images d'un produit changent, nettoyer les blur hashes obsolètes
  IF TG_OP = 'UPDATE' AND OLD.images IS DISTINCT FROM NEW.images THEN
    DELETE FROM image_blur_hashes 
    WHERE entity_type = 'product' 
    AND entity_id = NEW.id::text
    AND NOT (image_url = ANY(NEW.images));
    RETURN NEW;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger sur la table products
DROP TRIGGER IF EXISTS trigger_cleanup_blur_hashes ON products;
CREATE TRIGGER trigger_cleanup_blur_hashes
  AFTER UPDATE OR DELETE ON products
  FOR EACH ROW EXECUTE FUNCTION cleanup_orphaned_blur_hashes();

-- 7. Statistiques utiles
CREATE OR REPLACE VIEW blur_hash_stats AS
SELECT 
  entity_type,
  COUNT(*) as total_blur_hashes,
  COUNT(DISTINCT entity_id) as unique_entities,
  AVG(file_size) as avg_file_size,
  MIN(generated_at) as first_generated,
  MAX(generated_at) as last_generated
FROM image_blur_hashes
GROUP BY entity_type;

-- =====================================================
-- COMMENTAIRES ET INSTRUCTIONS
-- =====================================================

/*
UTILISATION DE CETTE MIGRATION :

1. CÔTÉ API - Lors de l'upload d'image :
   SELECT upsert_image_blur_hash(
     'https://example.com/image.jpg',
     'LEHV6nWB2yk8pyo0adR*.7kCMdnj',
     'product',
     '123',
     800,
     600,
     150000
   );

2. CÔTÉ FRONTEND - Récupération des produits avec blur :
   SELECT * FROM products_with_blur_hashes WHERE id = '123';

3. FONCTION UTILITAIRE - Obtenir un blur hash :
   SELECT get_image_blur_hash('https://example.com/image.jpg');

4. STATISTIQUES :
   SELECT * FROM blur_hash_stats;

PROCHAINES ÉTAPES :
- Créer une Edge Function Supabase pour générer les vrais blur hashes
- Modifier l'API d'upload pour appeler cette fonction
- Adapter le frontend pour utiliser computed_blur_hashes
*/