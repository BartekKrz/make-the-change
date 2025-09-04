-- =========================================
-- 02 - INSERTION DES CATÉGORIES PRINCIPALES
-- =========================================
-- Ce script insère les catégories principales basées sur l'analyse des partenaires

-- Vider la table des catégories existantes si besoin (optionnel)
-- TRUNCATE TABLE public.categories RESTART IDENTITY CASCADE;

-- Insertion des catégories principales (niveau 1)
INSERT INTO public.categories (name, slug, description, sort_order, is_active, seo_title, seo_description, metadata) VALUES

-- 🍯 ALIMENTATION - Produits alimentaires principalement d'Ilanga Nature
(
    'Alimentation', 
    'alimentation', 
    'Produits alimentaires naturels et authentiques de nos partenaires producteurs', 
    1, 
    true,
    'Produits Alimentaires Naturels | Make the CHANGE',
    'Découvrez notre sélection de produits alimentaires naturels : miels de Madagascar, confitures tropicales, épices authentiques et plus encore.',
    '{
        "icon": "🍯",
        "partner_sources": ["ilanga-nature"],
        "color_theme": "amber",
        "featured": true,
        "estimated_products": 250
    }'::jsonb
),

-- 🧴 COSMÉTIQUES - Produits cosmétiques principalement de Habeebee
(
    'Cosmétiques', 
    'cosmetiques', 
    'Soins naturels et cosmétiques à base de miel et produits de la ruche', 
    2, 
    true,
    'Cosmétiques Naturels au Miel | Make the CHANGE',
    'Soins naturels et cosmétiques artisanaux à base de miel, cire d''abeille et propolis. Gammes solides et liquides pour tous les types de peau.',
    '{
        "icon": "🧴",
        "partner_sources": ["habeebee"],
        "color_theme": "emerald",
        "featured": true,
        "estimated_products": 100
    }'::jsonb
),

-- 🎁 COFFRETS & CADEAUX - Assemblages des deux partenaires
(
    'Coffrets & Cadeaux', 
    'coffrets-cadeaux', 
    'Coffrets cadeaux thématiques et assemblages découverte de nos partenaires', 
    3, 
    true,
    'Coffrets Cadeaux Naturels | Make the CHANGE',
    'Offrez nos coffrets cadeaux composés de produits naturels soigneusement sélectionnés. Découverte, gourmandise ou bien-être.',
    '{
        "icon": "🎁",
        "partner_sources": ["ilanga-nature", "habeebee"],
        "color_theme": "rose",
        "featured": true,
        "seasonal": true,
        "estimated_products": 30
    }'::jsonb
),

-- 🏺 ARTISANAT & ACCESSOIRES - Principalement d'Ilanga Nature
(
    'Artisanat & Accessoires', 
    'artisanat-accessoires', 
    'Artisanat traditionnel, ustensiles et accessoires pour une consommation responsable', 
    4, 
    true,
    'Artisanat Traditionnel & Accessoires | Make the CHANGE',
    'Découvrez notre collection d''objets artisanaux traditionnels, ustensiles en bois et accessoires éco-responsables.',
    '{
        "icon": "🏺",
        "partner_sources": ["ilanga-nature", "habeebee"],
        "color_theme": "stone",
        "featured": false,
        "sustainable_focus": true,
        "estimated_products": 50
    }'::jsonb
);

-- Vérifier que les insertions ont réussi
DO $$
DECLARE
    category_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO category_count FROM public.categories WHERE parent_id IS NULL;
    RAISE NOTICE 'Nombre de catégories principales créées: %', category_count;
    
    IF category_count = 4 THEN
        RAISE NOTICE '✅ Toutes les catégories principales ont été créées avec succès';
    ELSE
        RAISE WARNING '⚠️ Nombre inattendu de catégories principales: % (attendu: 4)', category_count;
    END IF;
END $$;