-- =====================================================
-- DONNÉES DE TEST - ABONNEMENTS SUBSCRIPTIONS
-- =====================================================
-- Script pour créer 4 abonnements de test variés
-- Tous les statuts autorisés par la contrainte : active, past_due, cancelled, unpaid
-- À exécuter dans Supabase SQL Editor
-- =====================================================

-- =====================================================
-- ÉTAPE 1: RÉCUPÉRER LES USER_ID EXISTANTS
-- =====================================================

SELECT
    '🔍 UTILISATEURS EXISTANTS:' as info,
    id as user_id,
    email,
    user_level,
    kyc_status,
    points_balance,
    created_at::date as created_date
FROM public.users
ORDER BY created_at;

-- =====================================================
-- ÉTAPE 2: CRÉER LES ABONNEMENTS DE TEST
-- =====================================================

-- Récupérer les 4 premiers user_id pour les tests
WITH user_ids AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as row_num
    FROM public.users
    LIMIT 4
)
INSERT INTO public.subscriptions (
    user_id,
    plan_type,
    billing_frequency,
    status,
    monthly_price_eur,
    monthly_points_allocation,
    current_period_start,
    current_period_end,
    next_billing_date,
    stripe_customer_id,
    stripe_subscription_id,
    monthly_price,
    annual_price,
    monthly_points,
    annual_points,
    bonus_percentage,
    metadata,
    created_at,
    updated_at
) VALUES
    -- Abonnement 1: Standard mensuel actif (€18/mois)
    (
        (SELECT id FROM public.users ORDER BY created_at LIMIT 1 OFFSET 0),
        'monthly_standard',
        'monthly'::public.billing_frequency,
        'active',
        18.00,
        100,
        '2024-01-01'::timestamp,
        '2025-02-01'::timestamp,
        '2025-02-01'::timestamp,
        'cus_test_1234567890',
        'sub_test_monthly_standard_123',
        18.00,
        180.00,
        100,
        1200,
        0.00,
        '{"test": true, "source": "manual_insert"}'::jsonb,
        NOW(),
        NOW()
    ),

    -- Abonnement 2: Premium annuel actif (€320/an)
    (
        (SELECT id FROM public.users ORDER BY created_at LIMIT 1 OFFSET 1),
        'annual_premium',
        'annual'::public.billing_frequency,
        'active',
        320.00,
        500,
        '2024-01-01'::timestamp,
        '2025-01-01'::timestamp,
        '2025-01-01'::timestamp,
        'cus_test_0987654321',
        'sub_test_annual_premium_456',
        320.00,
        320.00,
        500,
        6000,
        15.00,
        '{"test": true, "source": "manual_insert", "annual_savings": 160}'::jsonb,
        NOW() - INTERVAL '30 days',
        NOW()
    ),

    -- Abonnement 3: Standard mensuel past_due (en retard de paiement)
    (
        (SELECT id FROM public.users ORDER BY created_at LIMIT 1 OFFSET 2),
        'monthly_standard',
        'monthly'::public.billing_frequency,
        'past_due',
        18.00,
        100,
        '2024-06-01'::timestamp,
        '2024-07-01'::timestamp,
        '2024-07-01'::timestamp,
        'cus_test_past_due_789',
        'sub_test_past_due_789',
        18.00,
        180.00,
        100,
        1200,
        0.00,
        '{"test": true, "source": "manual_insert", "past_due_reason": "payment_failed", "overdue_days": 30}'::jsonb,
        NOW() - INTERVAL '60 days',
        NOW()
    ),

    -- Abonnement 4: Premium mensuel annulé
    (
        (SELECT id FROM public.users ORDER BY created_at LIMIT 1 OFFSET 3),
        'monthly_premium',
        'monthly'::public.billing_frequency,
        'cancelled',
        32.00,
        200,
        '2024-03-01'::timestamp,
        '2024-04-01'::timestamp,
        NULL,
        'cus_test_cancelled_321',
        'sub_test_cancelled_321',
        32.00,
        320.00,
        200,
        2400,
        5.00,
        '{"test": true, "source": "manual_insert", "cancellation_reason": "user_request"}'::jsonb,
        NOW() - INTERVAL '90 days',
        NOW()
    ),

    -- Abonnement 4: Premium mensuel avec cancelled (supprimé le 5ème doublon)
    -- Utilisons plutôt unpaid pour varier les statuts
    (
        (SELECT id FROM public.users ORDER BY created_at LIMIT 1 OFFSET 0),
        'monthly_premium',
        'monthly'::public.billing_frequency,
        'unpaid',
        32.00,
        200,
        '2024-08-01'::timestamp,
        '2024-09-01'::timestamp,
        '2024-09-01'::timestamp,
        'cus_test_unpaid_654',
        'sub_test_unpaid_654',
        32.00,
        320.00,
        200,
        2400,
        5.00,
        '{"test": true, "source": "manual_insert", "unpaid_reason": "card_declined"}'::jsonb,
        NOW() - INTERVAL '45 days',
        NOW()
    );

-- =====================================================
-- ÉTAPE 3: VÉRIFICATION DES DONNÉES INSÉRÉES
-- =====================================================

SELECT
    '🎯 ABONNEMENTS CRÉÉS:' as verification,
    COUNT(*) as total_subscriptions,
    'Abonnements de test créés avec succès' as status
FROM public.subscriptions;

-- Afficher le détail des abonnements créés
SELECT
    '📊 DÉTAIL DES ABONNEMENTS:' as detail,
    s.id,
    u.email as user_email,
    s.plan_type,
    s.billing_frequency,
    s.status,
    s.monthly_price_eur as price_eur,
    s.monthly_points_allocation as points_month,
    s.current_period_start::date as start_date,
    s.next_billing_date::date as next_billing,
    s.created_at::date as created_date
FROM public.subscriptions s
JOIN public.users u ON s.user_id = u.id
ORDER BY s.created_at DESC;

-- =====================================================
-- ÉTAPE 4: STATISTIQUES PAR STATUT
-- =====================================================

SELECT
    '📈 STATISTIQUES PAR STATUT:' as stats,
    status,
    COUNT(*) as count,
    STRING_AGG(plan_type, ', ') as plan_types
FROM public.subscriptions
GROUP BY status
ORDER BY status;

-- =====================================================
-- ÉTAPE 5: STATISTIQUES PAR FRÉQUENCE DE FACTURATION
-- =====================================================

SELECT
    '💰 STATISTIQUES PAR FRÉQUENCE:' as billing_stats,
    billing_frequency,
    COUNT(*) as count,
    SUM(monthly_price_eur) as total_revenue,
    AVG(monthly_price_eur) as avg_price,
    SUM(monthly_points_allocation) as total_points_allocated
FROM public.subscriptions
GROUP BY billing_frequency
ORDER BY billing_frequency;

-- =====================================================
-- ÉTAPE 6: VÉRIFICATION MRR (Monthly Recurring Revenue)
-- =====================================================

SELECT
    '💵 CALCUL MRR (REVENUS MENSUELS RÉCURRENTS):' as mrr_calc,
    COALESCE(SUM(
        CASE
            WHEN billing_frequency = 'monthly' THEN monthly_price_eur
            WHEN billing_frequency = 'annual' THEN monthly_price_eur / 12
            ELSE 0
        END
    ), 0) as total_mrr_eur,
    COALESCE(SUM(monthly_points_allocation), 0) as total_points_monthly,
    'MRR calculé à partir des abonnements actifs' as note
FROM public.subscriptions
WHERE status = 'active';

-- =====================================================
-- ÉTAPE 7: TEST DES POLITIQUES RLS
-- =====================================================

-- Vérifier que RLS fonctionne (devrait retourner des données si l'utilisateur est authentifié)
SELECT
    '🔒 TEST RLS (devrait fonctionner si authentifié):' as rls_test,
    COUNT(*) as visible_subscriptions,
    'Si 0 résultat, problème de RLS' as note
FROM public.subscriptions
WHERE status = 'active'
LIMIT 5;

-- =====================================================
-- RÉSUMÉ FINAL
-- =====================================================

SELECT
    '🎉 DONNÉES DE TEST CRÉÉES AVEC SUCCÈS !' as celebration,
    NOW() as execution_date,
    (SELECT COUNT(*) FROM public.subscriptions) as total_subscriptions_created,
    (SELECT COUNT(*) FROM public.subscriptions WHERE status = 'active') as active_subscriptions,
    (SELECT COUNT(*) FROM public.subscriptions WHERE billing_frequency = 'monthly') as monthly_subscriptions,
    (SELECT COUNT(*) FROM public.subscriptions WHERE billing_frequency = 'annual') as annual_subscriptions,
    'Prêt pour le développement et debugging' as next_step;

-- =====================================================
-- COMMANDES UTILES POUR LE DÉVELOPPEMENT
-- =====================================================

/*
-- Requêtes utiles pour le développement :

-- Voir tous les abonnements avec détails utilisateur
SELECT s.*, u.email, u.user_level
FROM public.subscriptions s
JOIN public.users u ON s.user_id = u.id;

-- Tester les filtres par statut
SELECT * FROM public.subscriptions WHERE status = 'active';
SELECT * FROM public.subscriptions WHERE status = 'suspended';
SELECT * FROM public.subscriptions WHERE status = 'cancelled';

-- Tester les filtres par fréquence
SELECT * FROM public.subscriptions WHERE billing_frequency = 'monthly';
SELECT * FROM public.subscriptions WHERE billing_frequency = 'annual';

-- Calculs business
SELECT
    SUM(CASE WHEN billing_frequency = 'monthly' THEN monthly_price_eur ELSE monthly_price_eur/12 END) as mrr,
    SUM(monthly_points_allocation) as total_points_allocated
FROM public.subscriptions
WHERE status = 'active';
*/
