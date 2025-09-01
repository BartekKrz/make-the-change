-- =====================================================
-- DONNÉES DE TEST ENRICHIES - PHASE 3: DONNÉES RÉALISTES
-- =====================================================
-- Création de données de test réalistes et complètes
--
-- À EXÉCUTER DANS SUPABASE SQL EDITOR
-- =====================================================

-- =====================================================
-- ÉTAPE 1: CRÉATION DE PRODUITS RÉALISTES
-- =====================================================

-- Nettoyer les données existantes
DELETE FROM public.order_items;
DELETE FROM public.orders;
DELETE FROM public.inventory;
DELETE FROM public.products;
DELETE FROM public.categories;

-- Créer des catégories
INSERT INTO public.categories (name, slug, description, is_active) VALUES
('Miels Bio', 'miels-bio', 'Miels biologiques français de haute qualité', true),
('Huiles d''Olive', 'huiles-olive', 'Huiles d''olive extra vierge biologiques', true),
('Vins Naturels', 'vins-naturels', 'Vins naturels sans sulfites ajoutés', true),
('Épicerie Fine', 'epicerie-fine', 'Produits d''épicerie fine bio', true);

-- Créer des produits réalistes
INSERT INTO public.products (
    name, slug, short_description, description, category_id,
    producer_id, price_points, price_eur_equivalent,
    fulfillment_method, is_hero_product, stock_quantity, stock_management,
    weight_grams, images, tags, certifications, origin_country, min_tier, featured, is_active
) VALUES
-- Miel de producteurs existants
(
    'Miel d''Acacia Bio - 500g',
    'miel-acacia-bio-500g',
    'Miel d''acacia pur et cristallin',
    'Ce miel d''acacia bio est récolté dans les forêts de Bourgogne. Son goût délicat et sa cristallisation fine en font un miel parfait pour les desserts et les boissons.',
    (SELECT id FROM categories WHERE slug = 'miels-bio'),
    (SELECT id FROM producers LIMIT 1),
    2500, 25.00,
    'dropship', true, 50, true,
    550, ARRAY['/images/miel-acacia-1.jpg', '/images/miel-acacia-2.jpg'],
    ARRAY['bio', 'bourogne', 'acacia'], ARRAY['bio', 'demeter'],
    'FR', 'explorateur', true, true
),
(
    'Miel de Lavande Bio - 250g',
    'miel-lavande-bio-250g',
    'Miel parfumé aux fleurs de lavande',
    'Récolté dans les champs de lavande du Luberon, ce miel bio offre un parfum unique et une saveur florale distinctive.',
    (SELECT id FROM categories WHERE slug = 'miels-bio'),
    (SELECT id FROM producers LIMIT 1 OFFSET 1),
    1800, 18.00,
    'dropship', false, 30, true,
    280, ARRAY['/images/miel-lavande-1.jpg'],
    ARRAY['bio', 'lavande', 'luberon'], ARRAY['bio'],
    'FR', 'explorateur', false, true
),
(
    'Huile d''Olive Extra Vierge Bio - 500ml',
    'huile-olive-extra-vierge-bio-500ml',
    'Huile d''olive fruitée du Sud de la France',
    'Huile d''olive extra vierge bio produite dans les oliveraies de Provence. Pressée à froid pour préserver tous ses arômes.',
    (SELECT id FROM categories WHERE slug = 'huiles-olive'),
    (SELECT id FROM producers LIMIT 1 OFFSET 2),
    3500, 35.00,
    'dropship', true, 25, true,
    600, ARRAY['/images/huile-olive-1.jpg', '/images/huile-olive-2.jpg'],
    ARRAY['bio', 'provence', 'extra-vierge'], ARRAY['bio', 'aop'],
    'FR', 'protecteur', true, true
),
(
    'Vin Rouge Nature - Côte du Rhône - 75cl',
    'vin-rouge-nature-cote-rhone-75cl',
    'Vin naturel sans sulfites du Rhône',
    'Vin rouge naturel élaboré selon les méthodes ancestrales, sans ajout de sulfites. Issu de vignes centenaires.',
    (SELECT id FROM categories WHERE slug = 'vins-naturels'),
    (SELECT id FROM producers LIMIT 1 OFFSET 2),
    4800, 48.00,
    'dropship', false, 15, true,
    1300, ARRAY['/images/vin-rhone-1.jpg'],
    ARRAY['nature', 'rhone', 'sans-sulfites'], ARRAY['bio'],
    'FR', 'ambassadeur', false, true
);

-- =====================================================
-- ÉTAPE 2: CRÉATION D'INVENTAIRE POUR PRODUITS HÉROS
-- =====================================================

INSERT INTO public.inventory (
    product_id, sku, quantity_available, reorder_threshold, reorder_quantity,
    cost_price_cents, supplier_reference, expiry_date, batch_number
) VALUES
(
    (SELECT id FROM products WHERE slug = 'miel-acacia-bio-500g'),
    'MIEL-ACA-500-001', 50, 10, 25, 1500, 'SUP-MIEL-001',
    '2025-12-31', 'LOT-ACA-2024-001'
),
(
    (SELECT id FROM products WHERE slug = 'huile-olive-extra-vierge-bio-500ml'),
    'HUILE-OLI-500-001', 25, 5, 15, 2000, 'SUP-HUILE-001',
    '2026-06-30', 'LOT-OLI-2024-001'
);

-- =====================================================
-- ÉTAPE 3: CRÉATION DE COMMANDES RÉALISTES
-- =====================================================

-- Commande 1: Utilisateur existant achète du miel
INSERT INTO public.orders (
    user_id, status, subtotal_points, shipping_cost_points, total_points,
    points_used, points_earned, payment_method, shipping_address
) VALUES (
    (SELECT id FROM users LIMIT 1),
    'confirmed', 2500, 200, 2700, 0, 250,
    'points', '{"street": "123 Rue de la Paix", "city": "Paris", "postal_code": "75001", "country": "FR"}'::jsonb
);

-- Items de la commande 1
INSERT INTO public.order_items (
    order_id, product_id, quantity, unit_price_points, total_price_points,
    product_snapshot
) VALUES (
    (SELECT id FROM orders ORDER BY created_at DESC LIMIT 1),
    (SELECT id FROM products WHERE slug = 'miel-acacia-bio-500g'),
    1, 2500, 2500,
    (SELECT row_to_json(p) FROM products p WHERE slug = 'miel-acacia-bio-500g')::jsonb
);

-- Commande 2: Utilisateur existant achète huile d'olive
INSERT INTO public.orders (
    user_id, status, subtotal_points, shipping_cost_points, total_points,
    points_used, points_earned, payment_method, shipping_address, billing_address
) VALUES (
    (SELECT id FROM users LIMIT 1 OFFSET 1),
    'processing', 3500, 300, 3800, 0, 350,
    'stripe_card', '{"street": "456 Avenue des Champs", "city": "Lyon", "postal_code": "69001", "country": "FR"}'::jsonb,
    '{"street": "456 Avenue des Champs", "city": "Lyon", "postal_code": "69001", "country": "FR"}'::jsonb
);

-- Items de la commande 2
INSERT INTO public.order_items (
    order_id, product_id, quantity, unit_price_points, total_price_points,
    product_snapshot
) VALUES (
    (SELECT id FROM orders ORDER BY created_at DESC LIMIT 1),
    (SELECT id FROM products WHERE slug = 'huile-olive-extra-vierge-bio-500ml'),
    1, 3500, 3500,
    (SELECT row_to_json(p) FROM products p WHERE slug = 'huile-olive-extra-vierge-bio-500ml')::jsonb
);

-- =====================================================
-- ÉTAPE 4: CRÉATION DE TRANSACTIONS DE POINTS DÉTAILLÉES
-- =====================================================

-- Transactions pour l'utilisateur 1
INSERT INTO public.points_transactions (
    user_id, type, amount, balance_after, reference_type, reference_id, description
) VALUES
(
    (SELECT id FROM users LIMIT 1),
    'earned_subscription',
    100,
    100,
    'subscription',
    (SELECT id FROM subscriptions WHERE user_id = (SELECT id FROM users LIMIT 1) LIMIT 1),
    'Allocation mensuelle abonnement Standard'
),
(
    (SELECT id FROM users LIMIT 1),
    'earned_purchase',
    250,
    350,
    'order',
    (SELECT id FROM orders WHERE user_id = (SELECT id FROM users LIMIT 1) LIMIT 1),
    'Points fidélité commande miel'
),
(
    (SELECT id FROM users LIMIT 1),
    'spent_order',
    -2500,
    -2150,
    'order',
    (SELECT id FROM orders WHERE user_id = (SELECT id FROM users LIMIT 1) LIMIT 1),
    'Achat miel d''acacia bio'
);

-- =====================================================
-- ÉTAPE 5: CRÉATION D'ALLOCATIONS MENSUELLES
-- =====================================================

INSERT INTO public.monthly_allocations (
    subscription_id, user_id, allocation_month, points_allocated
) VALUES
(
    (SELECT id FROM subscriptions LIMIT 1),
    (SELECT user_id FROM subscriptions LIMIT 1),
    TO_CHAR(CURRENT_DATE, 'YYYY-MM'),
    100
),
(
    (SELECT id FROM subscriptions LIMIT 1 OFFSET 1),
    (SELECT user_id FROM subscriptions LIMIT 1 OFFSET 1),
    TO_CHAR(CURRENT_DATE, 'YYYY-MM'),
    500
);

-- =====================================================
-- ÉTAPE 6: CRÉATION D'INVESTISSEMENTS RÉALISTES
-- =====================================================

-- Investissement dans un projet existant
INSERT INTO public.investments (
    user_id, project_id, amount_points, amount_eur_equivalent,
    expected_return_rate, maturity_date, investment_terms
) VALUES (
    (SELECT id FROM users LIMIT 1),
    (SELECT id FROM projects LIMIT 1),
    5000, 50.00,
    0.0500, -- 5% de retour annuel
    '2026-12-31',
    '{"risk_level": "medium", "impact_category": "biodiversity", "minimum_investment": 100}'::jsonb
);

-- =====================================================
-- ÉTAPE 7: CRÉATION DE MÉTRIQUES BUSINESS
-- =====================================================

-- Nettoyer les métriques existantes
DELETE FROM public.business_metrics;

INSERT INTO public.business_metrics (
    metric_date, metric_period, mrr, arr, net_revenue, total_subscribers,
    monthly_subscribers, annual_subscribers, new_subscribers, churned_subscribers,
    conversion_rate, total_points_allocated, total_points_used, points_utilization_rate
) VALUES
(
    CURRENT_DATE, 'daily',
    125.00, 1500.00, 1625.00, 5, 3, 2, 0, 0,
    40.00, 600, 2750, 22.92
),
(
    CURRENT_DATE - INTERVAL '1 day', 'daily',
    120.00, 1440.00, 1560.00, 5, 3, 2, 0, 0,
    40.00, 600, 2650, 22.08
);

-- =====================================================
-- ÉTAPE 8: CRÉATION DE DONNÉES GÉOGRAPHIQUES RÉALISTES
-- =====================================================

-- Mettre à jour les localisations avec des coordonnées réelles
UPDATE public.producers SET
    location = ST_GeomFromText('POINT(2.3522 48.8566)', 4326) -- Paris
WHERE name LIKE '%Paris%';

UPDATE public.producers SET
    location = ST_GeomFromText('4.8357 45.7640)', 4326) -- Lyon
WHERE name LIKE '%Lyon%';

UPDATE public.producers SET
    location = ST_GeomFromText('5.3698 43.2965)', 4326) -- Marseille
WHERE name LIKE '%Marseille%';

UPDATE public.projects SET
    location = ST_GeomFromText('2.3522 48.8566)', 4326) -- Paris
WHERE name LIKE '%Paris%';

UPDATE public.projects SET
    location = ST_GeomFromText('4.8357 45.7640)', 4326) -- Lyon
WHERE name LIKE '%Lyon%';

UPDATE public.projects SET
    location = ST_GeomFromText('5.3698 43.2965)', 4326) -- Marseille
WHERE name LIKE '%Marseille%';

-- =====================================================
-- ÉTAPE 9: CRÉATION DE MÉTRIQUES PRODUCTEUR
-- =====================================================

INSERT INTO public.producer_metrics (
    producer_id, metric_type, period, value, unit, measurement_date, verified
) VALUES
(
    (SELECT id FROM producers LIMIT 1),
    'honey_production', 'Q1-2024', 1500.00, 'kg', '2024-03-31', true
),
(
    (SELECT id FROM producers LIMIT 1 OFFSET 2),
    'olive_oil_production', 'annual-2023', 5000.00, 'liters', '2023-12-31', true
);

-- =====================================================
-- VÉRIFICATIONS ET STATISTIQUES
-- =====================================================

-- Vérifier les données créées
SELECT
    '📊 DONNÉES CRÉÉES:' as verification,
    (SELECT COUNT(*) FROM categories) as categories_count,
    (SELECT COUNT(*) FROM products) as products_count,
    (SELECT COUNT(*) FROM inventory) as inventory_count,
    (SELECT COUNT(*) FROM orders) as orders_count,
    (SELECT COUNT(*) FROM order_items) as order_items_count,
    (SELECT COUNT(*) FROM points_transactions) as transactions_count,
    (SELECT COUNT(*) FROM monthly_allocations) as allocations_count,
    (SELECT COUNT(*) FROM investments) as investments_count,
    (SELECT COUNT(*) FROM business_metrics) as metrics_count;

-- Aperçu des produits
SELECT
    '🛒 PRODUITS CRÉÉS:' as products_overview,
    name,
    price_points as points,
    price_eur_equivalent as euros,
    CASE WHEN is_hero_product THEN '⭐ HÉROS' ELSE '📦 NORMAL' END as type,
    stock_quantity as stock
FROM products
ORDER BY price_points DESC;

-- Aperçu des commandes
SELECT
    '🛍️ COMMANDES CRÉÉES:' as orders_overview,
    o.id,
    u.email,
    o.total_points as total,
    o.status,
    o.created_at::date as date
FROM orders o
JOIN users u ON o.user_id = u.id
ORDER BY o.created_at DESC;

-- Aperçu du dashboard business
SELECT
    '📈 MÉTRIQUES BUSINESS:' as business_metrics,
    metric_date,
    mrr,
    total_subscribers,
    conversion_rate,
    points_utilization_rate
FROM business_metrics
ORDER BY metric_date DESC;

-- =====================================================
-- RAPPORT FINAL DONNÉES
-- =====================================================

SELECT
    '==============================================' as separator,
    '🎉 DONNÉES DE TEST ENRICHIES CRÉÉES !' as celebration,
    '==============================================' as separator2,
    NOW() as execution_date,
    'Phase 3: Produits et catégories réalistes' as phase_1,
    'Phase 4: Commandes et transactions complètes' as phase_2,
    'Phase 5: Investissements et métriques business' as phase_3,
    'Phase 6: Données géographiques et métriques producteurs' as phase_4,
    '✅ DONNÉES RÉALISTES ET COMPLETES' as status_final;
