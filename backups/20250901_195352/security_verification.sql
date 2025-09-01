-- =====================================================
-- VÉRIFICATION RAPIDE FIXES SÉCURITÉ
-- =====================================================
-- Script de validation après exécution des fixes
--
-- À EXÉCUTER DANS SUPABASE SQL EDITOR
-- =====================================================

-- =====================================================
-- VÉRIFICATION 1: VUES DANGEREUSES SUPPRIMÉES
-- =====================================================

SELECT
    '🔍 VÉRIFICATION VUES DANGEREUSES:' as section,
    CASE WHEN NOT EXISTS (
        SELECT 1 FROM information_schema.views
        WHERE table_schema = 'public'
        AND table_name IN (
            'dual_billing_dashboard',
            'index_usage_analysis',
            'table_size_analysis',
            'points_expiring_soon',
            'user_subscription_summary',
            'admin_dashboard_metrics',
            'points_expiry_with_days'
        )
    ) THEN '✅ TOUTES SUPPRIMÉES'
    ELSE '❌ ENCORE PRÉSENTES - VÉRIFIER'
    END as status_vues_dangereuses;

-- Lister les vues dangereuses restantes (si elles existent)
SELECT
    '📋 VUES DANGEREUSES RESTANTES:' as alert,
    table_name as vue_dangereuse,
    'À SUPPRIMER MANUELLEMENT' as action
FROM information_schema.views
WHERE table_schema = 'public'
AND table_name IN (
    'dual_billing_dashboard',
    'index_usage_analysis',
    'table_size_analysis',
    'points_expiring_soon',
    'user_subscription_summary',
    'admin_dashboard_metrics',
    'points_expiry_with_days'
);

-- =====================================================
-- VÉRIFICATION 2: VUES SÉCURISÉES CRÉÉES
-- =====================================================

SELECT
    '🔍 VÉRIFICATION VUES SÉCURISÉES:' as section,
    CASE WHEN (
        SELECT COUNT(*) FROM information_schema.views
        WHERE table_schema = 'public'
        AND table_name IN (
            'dual_billing_dashboard_secure',
            'index_usage_analysis_secure',
            'table_size_analysis_secure'
        )
    ) = 3 THEN '✅ TOUTES CRÉÉES'
    ELSE '❌ MANQUANTES - VÉRIFIER'
    END as status_vues_secure;

-- Lister les vues sécurisées créées
SELECT
    '📋 VUES SÉCURISÉES DISPONIBLES:' as info,
    table_name as vue_secure,
    'FONCTIONNELLE' as status
FROM information_schema.views
WHERE table_schema = 'public'
AND table_name LIKE '%_secure';

-- =====================================================
-- VÉRIFICATION 3: RLS SUR SPATIAL_REF_SYS
-- =====================================================

SELECT
    '🔍 VÉRIFICATION RLS SPATIAL_REF_SYS:' as section,
    CASE WHEN EXISTS (
        SELECT 1 FROM pg_class c
        JOIN pg_namespace n ON c.relnamespace = n.oid
        WHERE n.nspname = 'public'
        AND c.relname = 'spatial_ref_sys'
        AND c.relrowsecurity = true
    ) THEN '✅ RLS ACTIVÉ'
    ELSE '❌ RLS NON ACTIVÉ - À CORRIGER'
    END as status_rls;

-- Vérifier les politiques RLS sur spatial_ref_sys
SELECT
    '📋 POLITIQUES RLS SPATIAL_REF_SYS:' as info,
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    'PROTÉGÉ' as status
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'spatial_ref_sys';

-- =====================================================
-- VÉRIFICATION 4: FONCTIONS AVEC SEARCH_PATH SÉCURISÉ
-- =====================================================

SELECT
    '🔍 VÉRIFICATION SEARCH_PATH FONCTIONS:' as section,
    CASE WHEN (
        SELECT COUNT(*) FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public'
        AND p.proname IN ('calculate_mrr', 'calculate_conversion_rate', 'update_updated_at_column')
        AND p.prosecdef = true
        AND p.proconfig IS NOT NULL
        AND array_to_string(p.proconfig, ',') LIKE '%search_path%'
    ) = 3 THEN '✅ TOUTES SÉCURISÉES'
    ELSE '❌ PROBLÈMES - VÉRIFIER'
    END as status_search_path;

-- Détails des fonctions sécurisées
SELECT
    '📋 FONCTIONS AVEC SEARCH_PATH:' as info,
    p.proname as fonction,
    CASE WHEN p.prosecdef THEN '✅ SECURITY DEFINER' ELSE '❌ PAS SECURE' END as security_definer,
    CASE WHEN p.proconfig IS NOT NULL AND array_to_string(p.proconfig, ',') LIKE '%search_path%'
         THEN '✅ SEARCH_PATH FIXÉ'
         ELSE '❌ SEARCH_PATH VARIABLE' END as search_path_status
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND p.proname IN ('calculate_mrr', 'calculate_conversion_rate', 'update_updated_at_column');

-- =====================================================
-- VÉRIFICATION 5: POLITIQUES RLS DES VUES SÉCURISÉES
-- =====================================================

SELECT
    '🔍 VÉRIFICATION POLITIQUES RLS VUES:' as section,
    CASE WHEN (
        SELECT COUNT(*) FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename LIKE '%_secure'
    ) >= 3 THEN '✅ POLITIQUES CRÉÉES'
    ELSE '❌ POLITIQUES MANQUANTES'
    END as status_politiques;

-- Détails des politiques RLS
SELECT
    '📋 POLITIQUES RLS VUES SÉCURISÉES:' as info,
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    'CONTRÔLÉ' as status
FROM pg_policies
WHERE schemaname = 'public'
AND tablename LIKE '%_secure';

-- =====================================================
-- RAPPORT FINAL DE SÉCURITÉ
-- =====================================================

SELECT
    '🎯 RAPPORT FINAL SÉCURITÉ:' as celebration,
    NOW() as verification_date,

    -- Score sécurité calculé
    CASE
        WHEN (
            -- Vues dangereuses supprimées
            NOT EXISTS (SELECT 1 FROM information_schema.views WHERE table_schema = 'public' AND table_name IN ('dual_billing_dashboard', 'index_usage_analysis', 'table_size_analysis', 'points_expiring_soon', 'user_subscription_summary', 'admin_dashboard_metrics', 'points_expiry_with_days'))
            AND
            -- Vues sécurisées créées
            (SELECT COUNT(*) FROM information_schema.views WHERE table_schema = 'public' AND table_name LIKE '%_secure') = 3
            AND
            -- RLS activé sur spatial_ref_sys
            EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace = n.oid WHERE n.nspname = 'public' AND c.relname = 'spatial_ref_sys' AND c.relrowsecurity = true)
            AND
            -- Fonctions sécurisées
            (SELECT COUNT(*) FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname IN ('calculate_mrr', 'calculate_conversion_rate', 'update_updated_at_column') AND p.prosecdef = true AND p.proconfig IS NOT NULL AND array_to_string(p.proconfig, ',') LIKE '%search_path%') = 3
        ) THEN '🎉 SÉCURITÉ PARFAITE - SCORE 10/10'
        WHEN (
            -- Vues dangereuses supprimées
            NOT EXISTS (SELECT 1 FROM information_schema.views WHERE table_schema = 'public' AND table_name IN ('dual_billing_dashboard', 'index_usage_analysis', 'table_size_analysis'))
        ) THEN '✅ BONNE SÉCURITÉ - SCORE 8/10'
        WHEN (
            -- Au moins les vues dangereuses supprimées
            (SELECT COUNT(*) FROM information_schema.views WHERE table_schema = 'public' AND table_name IN ('dual_billing_dashboard', 'index_usage_analysis', 'table_size_analysis', 'points_expiring_soon', 'user_subscription_summary', 'admin_dashboard_metrics', 'points_expiry_with_days')) < 7
        ) THEN '⚠️ SÉCURITÉ AMÉLIORÉE - SCORE 6/10'
        ELSE '❌ SÉCURITÉ À AMÉLIORER - SCORE 4/10'
    END as security_score,

    -- Résumé des actions
    CASE WHEN NOT EXISTS (SELECT 1 FROM information_schema.views WHERE table_schema = 'public' AND table_name IN ('dual_billing_dashboard', 'index_usage_analysis', 'table_size_analysis', 'points_expiring_soon', 'user_subscription_summary', 'admin_dashboard_metrics', 'points_expiry_with_days'))
         THEN '✅ 7 vues SECURITY DEFINER supprimées'
         ELSE '❌ Vues dangereuses encore présentes'
    END as vues_status,

    CASE WHEN (SELECT COUNT(*) FROM information_schema.views WHERE table_schema = 'public' AND table_name LIKE '%_secure') >= 3
         THEN '✅ 3 vues sécurisées créées'
         ELSE '❌ Vues sécurisées manquantes'
    END as vues_secure_status,

    CASE WHEN EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace = n.oid WHERE n.nspname = 'public' AND c.relname = 'spatial_ref_sys' AND c.relrowsecurity = true)
         THEN '✅ RLS activé sur spatial_ref_sys'
         ELSE '❌ RLS manquant sur spatial_ref_sys'
    END as rls_status,

    CASE WHEN (SELECT COUNT(*) FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname IN ('calculate_mrr', 'calculate_conversion_rate', 'update_updated_at_column') AND p.prosecdef = true AND p.proconfig IS NOT NULL AND array_to_string(p.proconfig, ',') LIKE '%search_path%') >= 3
         THEN '✅ Fonctions avec search_path sécurisé'
         ELSE '❌ Fonctions à sécuriser'
    END as fonctions_status;

-- =====================================================
-- ACTIONS RECOMMANDÉES SI PROBLÈMES
-- =====================================================

SELECT
    '🛠️ ACTIONS RECOMMANDÉES:' as recommendations,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.views WHERE table_schema = 'public' AND table_name IN ('dual_billing_dashboard', 'index_usage_analysis', 'table_size_analysis'))
         THEN '1. Supprimer manuellement les vues restantes'
         ELSE '1. ✅ Vues dangereuses supprimées'
    END as action_1,

    CASE WHEN (SELECT COUNT(*) FROM information_schema.views WHERE table_schema = 'public' AND table_name LIKE '%_secure') < 3
         THEN '2. Recréer les vues sécurisées manquantes'
         ELSE '2. ✅ Vues sécurisées créées'
    END as action_2,

    CASE WHEN NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace = n.oid WHERE n.nspname = 'public' AND c.relname = 'spatial_ref_sys' AND c.relrowsecurity = true)
         THEN '3. Activer RLS sur spatial_ref_sys'
         ELSE '3. ✅ RLS activé'
    END as action_3,

    CASE WHEN (SELECT COUNT(*) FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname IN ('calculate_mrr', 'calculate_conversion_rate', 'update_updated_at_column') AND p.prosecdef = true AND p.proconfig IS NOT NULL AND array_to_string(p.proconfig, ',') LIKE '%search_path%') < 3
         THEN '4. Corriger search_path des fonctions'
         ELSE '4. ✅ Fonctions sécurisées'
    END as action_4,

    '5. Procéder à la Phase 2 (Performance)' as next_phase;
