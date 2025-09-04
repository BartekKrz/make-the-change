-- =========================================
-- 03 - INSERTION DES SOUS-CATÉGORIES
-- =========================================
-- Ce script insère les sous-catégories basées sur l'analyse des partenaires

-- Sous-catégories ALIMENTATION
INSERT INTO public.categories (name, slug, description, parent_id, sort_order, is_active, seo_title, seo_description, metadata) VALUES

-- 🍯 Miels & Produits de la Ruche (parent: Alimentation)
(
    'Miels & Produits de la Ruche',
    'miels-produits-ruche',
    'Miels authentiques et produits dérivés de la ruche de nos apiculteurs partenaires',
    (SELECT id FROM public.categories WHERE slug = 'alimentation'),
    1,
    true,
    'Miels Authentiques & Produits de la Ruche | Make the CHANGE',
    'Découvrez nos miels de Madagascar et de Belgique : litchis, eucalyptus, multifleurs, plus propolis et gelée royale.',
    '{
        "partner_sources": ["ilanga-nature", "habeebee"],
        "main_products": ["miel-litchis", "miel-eucalyptus", "miel-multifleurs", "propolis", "gelee-royale"],
        "origin_countries": ["Madagascar", "Belgique"],
        "estimated_products": 50
    }'::jsonb
),

-- 🫙 Confitures & Gelées (parent: Alimentation)
(
    'Confitures & Gelées',
    'confitures-gelees',
    'Confitures artisanales aux fruits tropicaux et gelées traditionnelles',
    (SELECT id FROM public.categories WHERE slug = 'alimentation'),
    2,
    true,
    'Confitures Tropicales Artisanales | Make the CHANGE',
    'Confitures aux fruits exotiques de Madagascar : litchis, mangue, papaye, fruits de la passion et plus encore.',
    '{
        "partner_sources": ["ilanga-nature"],
        "main_products": ["confiture-litchis", "confiture-mangue", "confiture-papaye", "gelee-goyave"],
        "origin_countries": ["Madagascar"],
        "fruit_types": ["tropicaux", "exotiques"],
        "estimated_products": 25
    }'::jsonb
),

-- 🌶️ Épices & Condiments (parent: Alimentation)
(
    'Épices & Condiments',
    'epices-condiments',
    'Épices tropicales authentiques et mélanges traditionnels malgaches',
    (SELECT id FROM public.categories WHERE slug = 'alimentation'),
    3,
    true,
    'Épices Tropicales Authentiques | Make the CHANGE',
    'Épices de Madagascar : poivres, cannelle, girofle, curcuma, gingembre et mélanges traditionnels malgaches.',
    '{
        "partner_sources": ["ilanga-nature"],
        "main_products": ["poivre-noir", "poivre-rose", "cannelle", "girofle", "melange-cari"],
        "origin_countries": ["Madagascar"],
        "spice_types": ["chaudes", "aromatiques", "melanges"],
        "estimated_products": 45
    }'::jsonb
),

-- 🌿 Vanille & Sucres (parent: Alimentation)
(
    'Vanille & Sucres',
    'vanille-sucres',
    'Vanille Bourbon de Madagascar et sucres spécialisés artisanaux',
    (SELECT id FROM public.categories WHERE slug = 'alimentation'),
    4,
    true,
    'Vanille Bourbon de Madagascar | Make the CHANGE',
    'Vanille Bourbon authentique de Madagascar : gousses, extraits, poudres et sucres vanillés artisanaux.',
    '{
        "partner_sources": ["ilanga-nature"],
        "main_products": ["gousses-vanille", "extrait-vanille", "poudre-vanille", "sucre-vanille"],
        "origin_countries": ["Madagascar"],
        "premium_product": true,
        "estimated_products": 15
    }'::jsonb
),

-- 🫒 Huiles & Boissons (parent: Alimentation)
(
    'Huiles & Boissons',
    'huiles-boissons',
    'Huiles d''olive vierges et boissons traditionnelles',
    (SELECT id FROM public.categories WHERE slug = 'alimentation'),
    5,
    true,
    'Huiles d''Olive & Boissons Traditionnelles | Make the CHANGE',
    'Huiles d''olive vierges extra et cafés malgaches torréfiés artisanalement.',
    '{
        "partner_sources": ["ilanga-nature"],
        "main_products": ["huile-olive-vierge", "cafe-malgache", "sucre-roux"],
        "origin_countries": ["Madagascar"],
        "estimated_products": 15
    }'::jsonb
);

-- Sous-catégories COSMÉTIQUES
INSERT INTO public.categories (name, slug, description, parent_id, sort_order, is_active, seo_title, seo_description, metadata) VALUES

-- 🧼 Soins Solides (parent: Cosmétiques)
(
    'Soins Solides',
    'soins-solides',
    'Cosmétiques solides zéro déchet à base de miel et cire d''abeille',
    (SELECT id FROM public.categories WHERE slug = 'cosmetiques'),
    1,
    true,
    'Cosmétiques Solides Zéro Déchet | Make the CHANGE',
    'Savons, shampoings et déodorants solides naturels au miel, cire d''abeille et propolis. Approche zéro déchet.',
    '{
        "partner_sources": ["habeebee"],
        "main_products": ["savon-miel", "shampoing-solide", "deodorant-solide"],
        "zero_waste": true,
        "bee_ingredients": ["miel", "cire-abeille", "propolis"],
        "estimated_products": 30
    }'::jsonb
),

-- 🧴 Soins Liquides (parent: Cosmétiques)
(
    'Soins Liquides',
    'soins-liquides',
    'Soins liquides premium à base de produits de la ruche',
    (SELECT id FROM public.categories WHERE slug = 'cosmetiques'),
    2,
    true,
    'Soins Liquides Premium au Miel | Make the CHANGE',
    'Gels douche, shampoings et lotions liquides enrichis au miel, propolis et gelée royale.',
    '{
        "partner_sources": ["habeebee"],
        "main_products": ["gel-douche-miel", "shampoing-reparateur", "lotion-demaquillante"],
        "premium_range": true,
        "bee_ingredients": ["miel", "propolis", "gelee-royale"],
        "estimated_products": 25
    }'::jsonb
),

-- 🧈 Soins Concentrés (parent: Cosmétiques)
(
    'Soins Concentrés',
    'soins-concentres',
    'Baumes, sérums et huiles de soins concentrés aux actifs naturels',
    (SELECT id FROM public.categories WHERE slug = 'cosmetiques'),
    3,
    true,
    'Soins Concentrés & Sérums Naturels | Make the CHANGE',
    'Baumes réparateurs, sérums anti-âge et huiles de soins concentrés avec miel, propolis et huiles végétales.',
    '{
        "partner_sources": ["habeebee"],
        "main_products": ["baume-propolis", "serum-anti-age", "huile-regenerante"],
        "concentrated_care": true,
        "bee_ingredients": ["miel", "propolis", "gelee-royale"],
        "estimated_products": 40
    }'::jsonb
),

-- 👁️ Soins Spéciaux (parent: Cosmétiques)
(
    'Soins Spéciaux',
    'soins-speciaux',
    'Soins ciblés pour zones délicates : contour des yeux, lèvres, mains',
    (SELECT id FROM public.categories WHERE slug = 'cosmetiques'),
    4,
    true,
    'Soins Spécialisés Zones Délicates | Make the CHANGE',
    'Soins ciblés pour le contour des yeux, baume à lèvres et crèmes mains à base de cire d''abeille.',
    '{
        "partner_sources": ["habeebee"],
        "main_products": ["contour-yeux", "baume-levres", "creme-mains"],
        "targeted_care": true,
        "bee_ingredients": ["cire-abeille", "miel"],
        "estimated_products": 15
    }'::jsonb
);

-- Sous-catégories COFFRETS & CADEAUX
INSERT INTO public.categories (name, slug, description, parent_id, sort_order, is_active, seo_title, seo_description, metadata) VALUES

-- 🎁 Coffrets Découverte (parent: Coffrets & Cadeaux)
(
    'Coffrets Découverte',
    'coffrets-decouverte',
    'Coffrets d''initiation pour découvrir nos gammes de produits',
    (SELECT id FROM public.categories WHERE slug = 'coffrets-cadeaux'),
    1,
    true,
    'Coffrets Découverte Produits Naturels | Make the CHANGE',
    'Coffrets découverte pour s''initier à nos produits : saveurs de Madagascar, cosmétiques naturels et plus.',
    '{
        "partner_sources": ["ilanga-nature", "habeebee"],
        "gift_type": "discovery",
        "price_range": "30-50",
        "estimated_products": 10
    }'::jsonb
),

-- 🏆 Coffrets Premium (parent: Coffrets & Cadeaux)
(
    'Coffrets Premium',
    'coffrets-premium',
    'Coffrets haut de gamme avec sélection premium de nos partenaires',
    (SELECT id FROM public.categories WHERE slug = 'coffrets-cadeaux'),
    2,
    true,
    'Coffrets Premium Luxe Naturel | Make the CHANGE',
    'Coffrets premium avec notre sélection la plus raffinée de produits naturels d''exception.',
    '{
        "partner_sources": ["ilanga-nature", "habeebee"],
        "gift_type": "premium",
        "price_range": "60-100",
        "luxury_focus": true,
        "estimated_products": 8
    }'::jsonb
),

-- 🎯 Coffrets Thématiques (parent: Coffrets & Cadeaux)
(
    'Coffrets Thématiques',
    'coffrets-thematiques',
    'Coffrets organisés par thème : bien-être, gourmandise, découverte...',
    (SELECT id FROM public.categories WHERE slug = 'coffrets-cadeaux'),
    3,
    true,
    'Coffrets Thématiques Naturels | Make the CHANGE',
    'Coffrets thématiques : bien-être, gourmandise, homme, femme, famille. Pour tous les goûts et occasions.',
    '{
        "partner_sources": ["ilanga-nature", "habeebee"],
        "gift_type": "thematic",
        "themes": ["bien-etre", "gourmandise", "homme", "femme", "famille"],
        "estimated_products": 12
    }'::jsonb
);

-- Sous-catégories ARTISANAT & ACCESSOIRES
INSERT INTO public.categories (name, slug, description, parent_id, sort_order, is_active, seo_title, seo_description, metadata) VALUES

-- 🏺 Artisanat Traditionnel (parent: Artisanat & Accessoires)
(
    'Artisanat Traditionnel',
    'artisanat-traditionnel',
    'Objets artisanaux traditionnels malgaches en matériaux naturels',
    (SELECT id FROM public.categories WHERE slug = 'artisanat-accessoires'),
    1,
    true,
    'Artisanat Traditionnel Malgache | Make the CHANGE',
    'Paniers raphia, objets en bois sculpté et textiles traditionnels malgaches faits main.',
    '{
        "partner_sources": ["ilanga-nature"],
        "materials": ["raphia", "bois", "textile"],
        "origin_countries": ["Madagascar"],
        "handmade": true,
        "estimated_products": 20
    }'::jsonb
),

-- 🧴 Accessoires Cosmétiques (parent: Artisanat & Accessoires)
(
    'Accessoires Cosmétiques',
    'accessoires-cosmetiques',
    'Accessoires pour l''utilisation et le transport des cosmétiques',
    (SELECT id FROM public.categories WHERE slug = 'artisanat-accessoires'),
    2,
    true,
    'Accessoires Cosmétiques Écologiques | Make the CHANGE',
    'Porte-savons en bois, pochettes de voyage et accessoires éco-responsables pour vos cosmétiques.',
    '{
        "partner_sources": ["habeebee"],
        "accessory_types": ["porte-savon", "pochette", "gant-exfoliant"],
        "eco_friendly": true,
        "estimated_products": 15
    }'::jsonb
),

-- 🍴 Ustensiles Cuisine (parent: Artisanat & Accessoires)
(
    'Ustensiles Cuisine',
    'ustensiles-cuisine',
    'Ustensiles en bois pour la cuisine et la dégustation',
    (SELECT id FROM public.categories WHERE slug = 'artisanat-accessoires'),
    3,
    true,
    'Ustensiles Cuisine Bois Naturel | Make the CHANGE',
    'Cuillères à miel, mortiers, planches à découper en bois naturel pour une cuisine authentique.',
    '{
        "partner_sources": ["ilanga-nature"],
        "materials": ["bois-olive", "bois-local"],
        "kitchen_focus": true,
        "handmade": true,
        "estimated_products": 10
    }'::jsonb
);

-- Vérifier les insertions
DO $$
DECLARE
    total_subcategories INTEGER;
    alimentation_subs INTEGER;
    cosmetiques_subs INTEGER;
    coffrets_subs INTEGER;
    artisanat_subs INTEGER;
BEGIN
    -- Compter toutes les sous-catégories
    SELECT COUNT(*) INTO total_subcategories FROM public.categories WHERE parent_id IS NOT NULL;
    
    -- Compter par catégorie principale
    SELECT COUNT(*) INTO alimentation_subs FROM public.categories 
    WHERE parent_id = (SELECT id FROM public.categories WHERE slug = 'alimentation');
    
    SELECT COUNT(*) INTO cosmetiques_subs FROM public.categories 
    WHERE parent_id = (SELECT id FROM public.categories WHERE slug = 'cosmetiques');
    
    SELECT COUNT(*) INTO coffrets_subs FROM public.categories 
    WHERE parent_id = (SELECT id FROM public.categories WHERE slug = 'coffrets-cadeaux');
    
    SELECT COUNT(*) INTO artisanat_subs FROM public.categories 
    WHERE parent_id = (SELECT id FROM public.categories WHERE slug = 'artisanat-accessoires');
    
    RAISE NOTICE '📊 RÉSUMÉ DES SOUS-CATÉGORIES CRÉÉES:';
    RAISE NOTICE '   🍯 Alimentation: % sous-catégories', alimentation_subs;
    RAISE NOTICE '   🧴 Cosmétiques: % sous-catégories', cosmetiques_subs;
    RAISE NOTICE '   🎁 Coffrets & Cadeaux: % sous-catégories', coffrets_subs;
    RAISE NOTICE '   🏺 Artisanat & Accessoires: % sous-catégories', artisanat_subs;
    RAISE NOTICE '   📦 TOTAL: % sous-catégories', total_subcategories;
    
    IF total_subcategories = 16 THEN
        RAISE NOTICE '✅ Toutes les sous-catégories ont été créées avec succès';
    ELSE
        RAISE WARNING '⚠️ Nombre inattendu de sous-catégories: % (attendu: 16)', total_subcategories;
    END IF;
END $$;