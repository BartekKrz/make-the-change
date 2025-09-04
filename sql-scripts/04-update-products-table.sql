-- =========================================
-- 04 - MISE À JOUR DE LA TABLE PRODUCTS
-- =========================================
-- Ce script ajoute la relation avec les catégories et met à jour la structure

-- Vérifier si la colonne category_id existe déjà dans products
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' 
                  AND table_name = 'products' 
                  AND column_name = 'category_id') THEN
        
        -- Ajouter la colonne category_id avec contrainte de clé étrangère
        ALTER TABLE public.products 
        ADD COLUMN category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL;
        
        RAISE NOTICE '✅ Colonne category_id ajoutée à la table products';
    ELSE
        RAISE NOTICE 'ℹ️ Colonne category_id existe déjà dans la table products';
    END IF;

    -- Ajouter secondary_category_id pour les produits qui appartiennent à plusieurs catégories
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' 
                  AND table_name = 'products' 
                  AND column_name = 'secondary_category_id') THEN
        
        ALTER TABLE public.products 
        ADD COLUMN secondary_category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL;
        
        RAISE NOTICE '✅ Colonne secondary_category_id ajoutée à la table products';
    END IF;

    -- Ajouter partner_source pour identifier le partenaire source
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' 
                  AND table_name = 'products' 
                  AND column_name = 'partner_source') THEN
        
        ALTER TABLE public.products 
        ADD COLUMN partner_source VARCHAR(50) CHECK (partner_source IN ('ilanga-nature', 'habeebee', 'internal'));
        
        RAISE NOTICE '✅ Colonne partner_source ajoutée à la table products';
    END IF;

    -- Ajouter origin_country pour traçabilité
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' 
                  AND table_name = 'products' 
                  AND column_name = 'origin_country') THEN
        
        ALTER TABLE public.products 
        ADD COLUMN origin_country VARCHAR(100);
        
        RAISE NOTICE '✅ Colonne origin_country ajoutée à la table products';
    END IF;

    -- Ajouter tags JSONB pour flexibilité de catégorisation
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' 
                  AND table_name = 'products' 
                  AND column_name = 'tags') THEN
        
        ALTER TABLE public.products 
        ADD COLUMN tags JSONB DEFAULT '[]';
        
        RAISE NOTICE '✅ Colonne tags ajoutée à la table products';
    END IF;

END $$;

-- Créer les index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_secondary_category_id ON public.products(secondary_category_id);
CREATE INDEX IF NOT EXISTS idx_products_partner_source ON public.products(partner_source);
CREATE INDEX IF NOT EXISTS idx_products_origin_country ON public.products(origin_country);
CREATE INDEX IF NOT EXISTS idx_products_tags ON public.products USING GIN(tags);

-- Créer une vue pour faciliter les requêtes avec catégories
CREATE OR REPLACE VIEW public.products_with_categories AS
SELECT 
    p.*,
    c.name as category_name,
    c.slug as category_slug,
    c.metadata as category_metadata,
    sc.name as secondary_category_name,
    sc.slug as secondary_category_slug,
    -- Catégorie parente principale
    parent_c.name as parent_category_name,
    parent_c.slug as parent_category_slug,
    -- Catégorie parente secondaire
    parent_sc.name as secondary_parent_category_name,
    parent_sc.slug as secondary_parent_category_slug
FROM public.products p
    LEFT JOIN public.categories c ON p.category_id = c.id
    LEFT JOIN public.categories sc ON p.secondary_category_id = sc.id
    LEFT JOIN public.categories parent_c ON c.parent_id = parent_c.id
    LEFT JOIN public.categories parent_sc ON sc.parent_id = parent_sc.id;

COMMENT ON VIEW public.products_with_categories IS 'Vue enrichie des produits avec informations complètes des catégories';

-- Créer une fonction helper pour assigner automatiquement des catégories basées sur des mots-clés
CREATE OR REPLACE FUNCTION assign_category_by_keywords(product_name TEXT, product_description TEXT DEFAULT '')
RETURNS UUID AS $$
DECLARE
    category_id UUID;
    combined_text TEXT;
BEGIN
    -- Combiner nom et description pour l'analyse
    combined_text := LOWER(COALESCE(product_name, '') || ' ' || COALESCE(product_description, ''));
    
    -- Logique d'assignation basée sur les mots-clés
    CASE 
        -- MIELS
        WHEN combined_text ~ '(miel|honey|litchi|eucalyptus|multifleur|tapia|propolis|gelée royale|pollen)' THEN
            SELECT id INTO category_id FROM public.categories WHERE slug = 'miels-produits-ruche';
        
        -- CONFITURES
        WHEN combined_text ~ '(confiture|gelée|jam|mangue|papaye|litchi|ananas|goyave|passion)' THEN
            SELECT id INTO category_id FROM public.categories WHERE slug = 'confitures-gelees';
        
        -- ÉPICES
        WHEN combined_text ~ '(épice|poivre|cannelle|girofle|curcuma|gingembre|cari|massala|piment)' THEN
            SELECT id INTO category_id FROM public.categories WHERE slug = 'epices-condiments';
        
        -- VANILLE
        WHEN combined_text ~ '(vanille|vanilla|gousse|extrait|poudre|sucre vanillé)' THEN
            SELECT id INTO category_id FROM public.categories WHERE slug = 'vanille-sucres';
        
        -- HUILES & BOISSONS
        WHEN combined_text ~ '(huile|olive|café|coffee|sucre|thé)' THEN
            SELECT id INTO category_id FROM public.categories WHERE slug = 'huiles-boissons';
        
        -- SOINS SOLIDES
        WHEN combined_text ~ '(savon|shampoing solide|déodorant solide|solid|soap)' THEN
            SELECT id INTO category_id FROM public.categories WHERE slug = 'soins-solides';
        
        -- SOINS LIQUIDES
        WHEN combined_text ~ '(gel douche|shampoing|lotion|tonique|démaquillant)' THEN
            SELECT id INTO category_id FROM public.categories WHERE slug = 'soins-liquides';
        
        -- SOINS CONCENTRÉS
        WHEN combined_text ~ '(baume|sérum|huile|crème|soin|oil|balm|serum)' THEN
            SELECT id INTO category_id FROM public.categories WHERE slug = 'soins-concentres';
        
        -- COFFRETS
        WHEN combined_text ~ '(coffret|box|cadeau|gift|découverte|premium)' THEN
            SELECT id INTO category_id FROM public.categories WHERE slug = 'coffrets-decouverte';
        
        -- ARTISANAT
        WHEN combined_text ~ '(panier|raphia|bois|cuillère|mortier|planche|ustensile|artisan)' THEN
            SELECT id INTO category_id FROM public.categories WHERE slug = 'artisanat-traditionnel';
        
        ELSE
            category_id := NULL;
    END CASE;
    
    RETURN category_id;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION assign_category_by_keywords IS 'Fonction helper pour assigner automatiquement des catégories basées sur les mots-clés du nom et description du produit';

-- Créer une fonction pour obtenir le chemin complet d'une catégorie
CREATE OR REPLACE FUNCTION get_category_path(cat_id UUID)
RETURNS TEXT AS $$
DECLARE
    result TEXT := '';
    current_cat RECORD;
BEGIN
    -- Remonter la hiérarchie des catégories
    WITH RECURSIVE category_path AS (
        -- Cas de base : catégorie actuelle
        SELECT id, name, parent_id, 0 as level
        FROM public.categories 
        WHERE id = cat_id
        
        UNION ALL
        
        -- Récursion : remonter vers les parents
        SELECT c.id, c.name, c.parent_id, cp.level + 1
        FROM public.categories c
        JOIN category_path cp ON c.id = cp.parent_id
    )
    SELECT string_agg(name, ' > ' ORDER BY level DESC) INTO result
    FROM category_path;
    
    RETURN COALESCE(result, '');
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_category_path IS 'Retourne le chemin hiérarchique complet d''une catégorie (ex: "Alimentation > Miels & Produits de la Ruche")';

-- Créer des fonctions d'aide pour les statistiques
CREATE OR REPLACE FUNCTION get_category_stats()
RETURNS TABLE (
    category_name TEXT,
    category_slug TEXT,
    product_count BIGINT,
    is_parent BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.name::TEXT,
        c.slug::TEXT,
        COUNT(p.id) as product_count,
        (c.parent_id IS NULL) as is_parent
    FROM public.categories c
    LEFT JOIN public.products p ON c.id = p.category_id OR c.id = p.secondary_category_id
    WHERE c.is_active = true
    GROUP BY c.id, c.name, c.slug, c.parent_id
    ORDER BY is_parent DESC, product_count DESC, c.sort_order;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_category_stats IS 'Retourne les statistiques de produits par catégorie';

-- Exemples d'utilisation des nouvelles fonctions
DO $$
DECLARE
    sample_category_id UUID;
BEGIN
    RAISE NOTICE '🔧 FONCTIONS CRÉÉES:';
    RAISE NOTICE '   ✅ assign_category_by_keywords() - Assignation automatique';
    RAISE NOTICE '   ✅ get_category_path() - Chemin hiérarchique';
    RAISE NOTICE '   ✅ get_category_stats() - Statistiques par catégorie';
    RAISE NOTICE '';
    
    -- Exemple d'usage de get_category_path
    SELECT id INTO sample_category_id FROM public.categories WHERE slug = 'miels-produits-ruche' LIMIT 1;
    IF sample_category_id IS NOT NULL THEN
        RAISE NOTICE '📍 Exemple chemin: %', get_category_path(sample_category_id);
    END IF;
    
    -- Exemple d'assignation automatique
    RAISE NOTICE '🏷️ Exemple assignation "Miel de Litchis": %', 
        COALESCE((SELECT slug FROM public.categories WHERE id = assign_category_by_keywords('Miel de Litchis')), 'non trouvé');
        
    RAISE NOTICE '';
    RAISE NOTICE '📊 Pour voir les statistiques, exécutez: SELECT * FROM get_category_stats();';
END $$;