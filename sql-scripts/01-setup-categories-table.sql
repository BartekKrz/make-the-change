-- =========================================
-- 01 - SETUP CATEGORIES TABLE
-- =========================================
-- Ce script configure la table categories avec tous les champs nécessaires
-- Basé sur l'analyse des partenaires Ilanga Nature et Habeebee

-- Vérifier si la table categories existe déjà
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'categories') THEN

        -- Créer la table categories avec structure hiérarchique
        CREATE TABLE public.categories (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(255) NOT NULL,
            slug VARCHAR(255) UNIQUE NOT NULL,
            description TEXT,
            parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
            sort_order INTEGER DEFAULT 0,
            image_url TEXT,
            is_active BOOLEAN DEFAULT true,
            seo_title VARCHAR(255),
            seo_description TEXT,
            metadata JSONB DEFAULT '{}',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

    ELSE
        -- Si la table existe, ajouter les colonnes manquantes
        
        -- Ajouter seo_title si elle n'existe pas
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_schema = 'public' 
                      AND table_name = 'categories' 
                      AND column_name = 'seo_title') THEN
            ALTER TABLE public.categories ADD COLUMN seo_title VARCHAR(255);
        END IF;

        -- Ajouter seo_description si elle n'existe pas
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_schema = 'public' 
                      AND table_name = 'categories' 
                      AND column_name = 'seo_description') THEN
            ALTER TABLE public.categories ADD COLUMN seo_description TEXT;
        END IF;

        -- Ajouter metadata si elle n'existe pas
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_schema = 'public' 
                      AND table_name = 'categories' 
                      AND column_name = 'metadata') THEN
            ALTER TABLE public.categories ADD COLUMN metadata JSONB DEFAULT '{}';
        END IF;

    END IF;
END $$;

-- Créer les index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON public.categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON public.categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON public.categories(sort_order);
CREATE INDEX IF NOT EXISTS idx_categories_metadata ON public.categories USING GIN(metadata);

-- Créer une fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Créer le trigger pour updated_at
DROP TRIGGER IF EXISTS update_categories_updated_at ON public.categories;
CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON public.categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Activer Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture publique des catégories actives
CREATE POLICY "Categories are viewable by everyone" 
    ON public.categories FOR SELECT 
    USING (is_active = true);

-- Politique pour permettre à tous les utilisateurs authentifiés de gérer les catégories
CREATE POLICY "Categories are manageable by authenticated users" 
    ON public.categories FOR ALL 
    USING (auth.role() = 'authenticated');

COMMENT ON TABLE public.categories IS 'Table des catégories hiérarchiques pour les produits';
COMMENT ON COLUMN public.categories.parent_id IS 'Référence vers la catégorie parente (NULL pour les catégories racines)';
COMMENT ON COLUMN public.categories.metadata IS 'Données JSON pour informations supplémentaires (partner_sources, icon, etc.)';