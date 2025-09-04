-- =========================================
-- 05 - DONNÉES D'EXEMPLE POUR LES PRODUITS
-- =========================================
-- Ce script insère quelques produits d'exemple basés sur l'analyse des partenaires
-- Utilise les fonctions d'assignation automatique créées précédemment

-- Exemples de produits ILANGA NATURE (Madagascar - Alimentation)
INSERT INTO public.products (
    name, 
    description, 
    price_points,
    partner_source,
    origin_country,
    tags,
    is_active,
    category_id
) VALUES 

-- MIELS
(
    'Miel de Litchis 250g',
    'Miel authentique de Madagascar récolté dans les vergers de litchis. Goût floral délicat et texture crémeuse.',
    850,
    'ilanga-nature',
    'Madagascar',
    '["miel", "litchi", "floral", "artisanal", "madagascar"]'::jsonb,
    true,
    assign_category_by_keywords('Miel de Litchis', 'miel authentique litchi madagascar')
),

(
    'Miel d''Eucalyptus 500g',
    'Miel d''eucalyptus aux propriétés apaisantes. Idéal pour les maux de gorge et les infusions.',
    1350,
    'ilanga-nature',
    'Madagascar',
    '["miel", "eucalyptus", "apaisant", "infusion", "madagascar"]'::jsonb,
    true,
    assign_category_by_keywords('Miel d''Eucalyptus', 'miel eucalyptus propriétés apaisantes')
),

(
    'Miel Multifleurs Bio 1kg',
    'Miel multifleurs certifié biologique. Production respectueuse de l''environnement et des abeilles.',
    2300,
    'ilanga-nature',
    'Madagascar',
    '["miel", "multifleurs", "bio", "certifié", "environnement"]'::jsonb,
    true,
    assign_category_by_keywords('Miel Multifleurs Bio', 'miel multifleurs biologique certifié')
),

-- CONFITURES
(
    'Confiture de Mangue 250g',
    'Confiture artisanale aux mangues de Madagascar. Texture onctueuse et goût tropical authentique.',
    600,
    'ilanga-nature',
    'Madagascar',
    '["confiture", "mangue", "tropical", "artisanal", "madagascar"]'::jsonb,
    true,
    assign_category_by_keywords('Confiture de Mangue', 'confiture artisanale mangue madagascar')
),

(
    'Gelée de Goyave 200g',
    'Gelée transparente à la goyave, fruit emblématique de Madagascar. Parfaite pour les tartines.',
    750,
    'ilanga-nature',
    'Madagascar',
    '["gelée", "goyave", "fruit", "tartine", "madagascar"]'::jsonb,
    true,
    assign_category_by_keywords('Gelée de Goyave', 'gelée goyave fruit madagascar')
),

-- ÉPICES
(
    'Poivre Noir en Grains 100g',
    'Poivre noir de Madagascar en grains entiers. Arôme intense et saveur piquante authentique.',
    1200,
    'ilanga-nature',
    'Madagascar',
    '["épice", "poivre", "noir", "grains", "intense", "madagascar"]'::jsonb,
    true,
    assign_category_by_keywords('Poivre Noir en Grains', 'épice poivre noir madagascar')
),

(
    'Cannelle Bâton 50g',
    'Cannelle de Ceylan en bâtons. Épice douce et aromatique pour vos desserts et boissons chaudes.',
    1000,
    'ilanga-nature',
    'Madagascar',
    '["épice", "cannelle", "bâton", "douce", "aromatique", "dessert"]'::jsonb,
    true,
    assign_category_by_keywords('Cannelle Bâton', 'épice cannelle bâton aromatique')
),

-- VANILLE
(
    'Gousses de Vanille Bourbon 5 pièces',
    'Gousses de vanille Bourbon de Madagascar, variété premium. Parfum intense et qualité exceptionnelle.',
    2800,
    'ilanga-nature',
    'Madagascar',
    '["vanille", "bourbon", "gousse", "premium", "intense", "madagascar"]'::jsonb,
    true,
    assign_category_by_keywords('Gousses de Vanille Bourbon', 'vanille bourbon gousse premium madagascar')
),

(
    'Extrait de Vanille 100ml',
    'Extrait liquide de vanille pure. Idéal pour la pâtisserie et les desserts maison.',
    2800,
    'ilanga-nature',
    'Madagascar',
    '["vanille", "extrait", "liquide", "pâtisserie", "dessert", "madagascar"]'::jsonb,
    true,
    assign_category_by_keywords('Extrait de Vanille', 'vanille extrait liquide pâtisserie')
);

-- Exemples de produits HABEEBEE (Belgique - Cosmétiques)
INSERT INTO public.products (
    name, 
    description, 
    price_points,
    partner_source,
    origin_country,
    tags,
    is_active,
    category_id
) VALUES 

-- SOINS SOLIDES
(
    'Savon Doux au Miel 100g',
    'Savon solide enrichi au miel pour tous types de peau. Formule douce et hydratante, zéro déchet.',
    850,
    'habeebee',
    'Belgique',
    '["savon", "solide", "miel", "doux", "hydratant", "zéro-déchet"]'::jsonb,
    true,
    assign_category_by_keywords('Savon Doux au Miel', 'savon solide miel doux hydratant')
),

(
    'Shampoing Solide Cheveux Normaux 75g',
    'Shampoing solide naturel pour cheveux normaux. Enrichi aux produits de la ruche, format voyage.',
    1200,
    'habeebee',
    'Belgique',
    '["shampoing", "solide", "cheveux", "naturel", "ruche", "voyage"]'::jsonb,
    true,
    assign_category_by_keywords('Shampoing Solide Cheveux Normaux', 'shampoing solide naturel cheveux')
),

(
    'Déodorant Solide Naturel 50g',
    'Déodorant solide sans aluminium, enrichi à la propolis. Protection naturelle longue durée.',
    1100,
    'habeebee',
    'Belgique',
    '["déodorant", "solide", "naturel", "propolis", "sans-aluminium", "protection"]'::jsonb,
    true,
    assign_category_by_keywords('Déodorant Solide Naturel', 'déodorant solide naturel propolis')
),

-- SOINS LIQUIDES
(
    'Gel Douche Doux au Miel 250ml',
    'Gel douche onctueux enrichi au miel. Nettoie en douceur et laisse la peau douce et parfumée.',
    1200,
    'habeebee',
    'Belgique',
    '["gel-douche", "doux", "miel", "onctueux", "peau", "parfumé"]'::jsonb,
    true,
    assign_category_by_keywords('Gel Douche Doux au Miel', 'gel douche doux miel onctueux')
),

(
    'Shampoing Réparateur Miel & Karité 250ml',
    'Shampoing réparateur pour cheveux abîmés. Formule au miel et beurre de karité nourrissant.',
    1500,
    'habeebee',
    'Belgique',
    '["shampoing", "réparateur", "miel", "karité", "cheveux", "nourrissant"]'::jsonb,
    true,
    assign_category_by_keywords('Shampoing Réparateur Miel & Karité', 'shampoing réparateur miel karité')
),

-- SOINS CONCENTRÉS
(
    'Baume Cicatrisant Propolis 30ml',
    'Baume concentré à la propolis pour apaiser et réparer les petites irritations cutanées.',
    1600,
    'habeebee',
    'Belgique',
    '["baume", "cicatrisant", "propolis", "apaisant", "réparateur", "irritation"]'::jsonb,
    true,
    assign_category_by_keywords('Baume Cicatrisant Propolis', 'baume cicatrisant propolis apaisant')
),

(
    'Sérum Anti-Âge Gelée Royale 30ml',
    'Sérum premium anti-âge à la gelée royale. Formule concentrée pour une peau ferme et éclatante.',
    3500,
    'habeebee',
    'Belgique',
    '["sérum", "anti-âge", "gelée-royale", "premium", "ferme", "éclatante"]'::jsonb,
    true,
    assign_category_by_keywords('Sérum Anti-Âge Gelée Royale', 'sérum anti-âge gelée royale premium')
),

(
    'Baume à Lèvres Cire d''Abeille 15ml',
    'Baume à lèvres nourrissant à la cire d''abeille pure. Protection et hydratation longue durée.',
    650,
    'habeebee',
    'Belgique',
    '["baume", "lèvres", "cire-abeille", "nourrissant", "protection", "hydratation"]'::jsonb,
    true,
    assign_category_by_keywords('Baume à Lèvres Cire d''Abeille', 'baume lèvres cire abeille nourrissant')
);

-- Exemples de COFFRETS (mixtes)
INSERT INTO public.products (
    name, 
    description, 
    price_points,
    partner_source,
    origin_country,
    tags,
    is_active,
    category_id
) VALUES 

(
    'Coffret Saveurs de Madagascar',
    'Coffret découverte avec 3 miels différents et 2 confitures artisanales de Madagascar.',
    3500,
    'ilanga-nature',
    'Madagascar',
    '["coffret", "découverte", "miel", "confiture", "madagascar", "cadeau"]'::jsonb,
    true,
    assign_category_by_keywords('Coffret Saveurs de Madagascar', 'coffret découverte miel confiture')
),

(
    'Coffret Essentiels Solides',
    'Coffret découverte cosmétiques solides : 3 savons et 1 shampoing solide. Parfait pour débuter.',
    3200,
    'habeebee',
    'Belgique',
    '["coffret", "essentiels", "solide", "savon", "shampoing", "découverte"]'::jsonb,
    true,
    assign_category_by_keywords('Coffret Essentiels Solides', 'coffret découverte savon shampoing solide')
);

-- Mise à jour des champs origin_country pour les produits existants sans cette information
UPDATE public.products 
SET origin_country = CASE 
    WHEN partner_source = 'ilanga-nature' THEN 'Madagascar'
    WHEN partner_source = 'habeebee' THEN 'Belgique'
    ELSE origin_country
END
WHERE origin_country IS NULL AND partner_source IS NOT NULL;

-- Affichage des statistiques après insertion
DO $$
DECLARE
    total_products INTEGER;
    ilanga_products INTEGER;
    habeebee_products INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_products FROM public.products;
    SELECT COUNT(*) INTO ilanga_products FROM public.products WHERE partner_source = 'ilanga-nature';
    SELECT COUNT(*) INTO habeebee_products FROM public.products WHERE partner_source = 'habeebee';
    
    RAISE NOTICE '📊 STATISTIQUES DES PRODUITS D''EXEMPLE:';
    RAISE NOTICE '   🍯 Ilanga Nature (Madagascar): % produits', ilanga_products;
    RAISE NOTICE '   🧴 Habeebee (Belgique): % produits', habeebee_products;
    RAISE NOTICE '   📦 TOTAL: % produits', total_products;
    RAISE NOTICE '';
    RAISE NOTICE '🏷️ Assignation automatique des catégories effectuée';
    RAISE NOTICE '📋 Pour voir les statistiques par catégorie: SELECT * FROM get_category_stats();';
END $$;