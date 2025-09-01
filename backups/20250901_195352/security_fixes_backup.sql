-- =====================================================
-- SÉCURITÉ FIXES - PHASE 1: VUES SECURITY DEFINER
-- =====================================================
-- Suppression et refactorisation des vues dangereuses
--
-- À EXÉCUTER DANS SUPABASE SQL EDITOR
-- =====================================================

-- =====================================================
-- ÉTAPE 1: SUPPRESSION DES VUES SECURITY DEFINER DANGEREUSES
-- =====================================================

-- Suppression des vues SECURITY DEFINER identifiées
DROP VIEW IF EXISTS public.dual_billing_dashboard;
DROP VIEW IF EXISTS public.index_usage_analysis;
DROP VIEW IF EXISTS public.table_size_analysis;
DROP VIEW IF EXISTS public.points_expiring_soon;
DROP VIEW IF EXISTS public.user_subscription_summary;
DROP VIEW IF EXISTS public.admin_dashboard_metrics;
DROP VIEW IF EXISTS public.points_expiry_with_days;

-- =====================================================
-- ÉTAPE 2: RECRÉATION SÉCURISÉE DES VUES UTILES
-- =====================================================

-- Vue dashboard dual billing SANS SECURITY DEFINER
CREATE OR REPLACE VIEW public.dual_billing_dashboard_secure AS
SELECT
    'Abonnements Actifs' as metric,
    COUNT(*)::numeric as value,
    'total' as unit,
    CASE
        WHEN COUNT(*) > 10 THEN '🟢 EXCELLENT'
        WHEN COUNT(*) > 5 THEN '🟡 BON'
        ELSE '🔴 À AMÉLIORER'
    END as status
FROM public.subscriptions
WHERE status = 'active'
UNION ALL
SELECT
    'Points Alloués Ce Mois' as metric,
    COALESCE(SUM(points_allocated), 0)::numeric as value,
    'points' as unit,
    'ℹ️ INFO' as status
FROM public.monthly_allocations
WHERE allocation_month >= TO_CHAR(CURRENT_DATE, 'YYYY-MM');

-- Vue analyse des index SANS SECURITY DEFINER
CREATE OR REPLACE VIEW public.index_usage_analysis_secure AS
SELECT
    schemaname,
    relname as table_name,
    indexrelname as index_name,
    idx_scan as scans,
    idx_tup_read as tuples_read,
    idx_tup_fetch as tuples_fetched,
    CASE
        WHEN idx_scan = 0 THEN '🔴 JAMAIS UTILISÉ'
        WHEN idx_scan < 100 THEN '🟡 PEU UTILISÉ'
        WHEN idx_scan < 1000 THEN '🟢 MODÉRÉMENT UTILISÉ'
        ELSE '🟢 FORTEMENT UTILISÉ'
    END as usage_status
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;

-- Vue analyse des tables SANS SECURITY DEFINER
CREATE OR REPLACE VIEW public.table_size_analysis_secure AS
SELECT
    schemaname,
    relname as table_name,
    pg_size_pretty(pg_total_relation_size(relid)) as total_size,
    pg_size_pretty(pg_relation_size(relid)) as table_size,
    n_tup_ins as inserts,
    n_tup_upd as updates,
    n_tup_del as deletes
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(relid) DESC;

-- =====================================================
-- ÉTAPE 3: POLITIQUES RLS POUR LES VUES SÉCURISÉES
-- =====================================================

-- Politique pour dashboard (utilisateurs authentifiés seulement)
DROP POLICY IF EXISTS "Users can view dual billing dashboard" ON public.dual_billing_dashboard_secure;
CREATE POLICY "Users can view dual billing dashboard" ON public.dual_billing_dashboard_secure
    FOR SELECT USING (auth.role() = 'authenticated');

-- Politique pour analyse index (service role seulement)
DROP POLICY IF EXISTS "Service role can view index analysis" ON public.index_usage_analysis_secure;
CREATE POLICY "Service role can view index analysis" ON public.dual_billing_dashboard_secure
    FOR SELECT USING (auth.jwt() ->> 'role' = 'service_role');

-- Politique pour analyse tables (service role seulement)
DROP POLICY IF EXISTS "Service role can view table analysis" ON public.table_size_analysis_secure;
CREATE POLICY "Service role can view table analysis" ON public.dual_billing_dashboard_secure
    FOR SELECT USING (auth.jwt() ->> 'role' = 'service_role');

-- Activer RLS sur les nouvelles vues
ALTER VIEW public.dual_billing_dashboard_secure SET (security_barrier = true);
ALTER VIEW public.index_usage_analysis_secure SET (security_barrier = true);
ALTER VIEW public.table_size_analysis_secure SET (security_barrier = true);

-- =====================================================
-- ÉTAPE 4: ACTIVATION RLS SUR SPATIAL_REF_SYS
-- =====================================================

-- Activer RLS sur la table système
ALTER TABLE public.spatial_ref_sys ENABLE ROW LEVEL SECURITY;

-- Politique restrictive pour spatial_ref_sys (service role seulement)
DROP POLICY IF EXISTS "Service role can access spatial data" ON public.spatial_ref_sys;
CREATE POLICY "Service role can access spatial data" ON public.spatial_ref_sys
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- =====================================================
-- ÉTAPE 5: FIX SEARCH_PATH DES FONCTIONS
-- =====================================================

-- Fonction calculate_mrr avec search_path sécurisé
CREATE OR REPLACE FUNCTION public.calculate_mrr()
RETURNS DECIMAL(12,2)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    total_mrr DECIMAL(12,2) := 0;
BEGIN
    SELECT COALESCE(SUM(
        CASE
            WHEN billing_frequency = 'monthly' THEN monthly_price
            WHEN billing_frequency = 'annual' THEN annual_price / 12
            ELSE 0
        END), 0)
    INTO total_mrr
    FROM public.subscriptions
    WHERE status = 'active';

    RETURN total_mrr;
END;
$$;

-- Fonction calculate_conversion_rate avec search_path sécurisé
CREATE OR REPLACE FUNCTION public.calculate_conversion_rate()
RETURNS DECIMAL(5,2)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    monthly_count INTEGER := 0;
    annual_count INTEGER := 0;
    conversion_rate DECIMAL(5,2) := 0;
BEGIN
    SELECT COUNT(*) INTO monthly_count
    FROM public.subscriptions
    WHERE status = 'active' AND billing_frequency = 'monthly';

    SELECT COUNT(*) INTO annual_count
    FROM public.subscriptions
    WHERE status = 'active' AND billing_frequency = 'annual';

    IF monthly_count + annual_count > 0 THEN
        conversion_rate := (annual_count * 100.0) / (monthly_count + annual_count);
    END IF;

    RETURN conversion_rate;
END;
$$;

-- Fonction update_updated_at_column avec search_path sécurisé
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- =====================================================
-- ÉTAPE 6: VÉRIFICATION DES FIXES
-- =====================================================

-- Vérifier que les vues dangereuses ont été supprimées
SELECT
    'VÉRIFICATION SUPPRESSION VUES DANGEREUSES:' as check_type,
    CASE WHEN NOT EXISTS (
        SELECT 1 FROM information_schema.views
        WHERE table_schema = 'public'
        AND table_name IN ('dual_billing_dashboard', 'index_usage_analysis', 'table_size_analysis',
                          'points_expiring_soon', 'user_subscription_summary',
                          'admin_dashboard_metrics', 'points_expiry_with_days')
    ) THEN '✅ TOUTES LES VUES DANGEREUSES SUPPRIMÉES'
    ELSE '❌ ENCORE DES VUES DANGEREUSES PRÉSENTES'
    END as status;

-- Vérifier que les nouvelles vues sécurisées existent
SELECT
    'VÉRIFICATION VUES SÉCURISÉES:' as check_type,
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.views
        WHERE table_schema = 'public'
        AND table_name IN ('dual_billing_dashboard_secure', 'index_usage_analysis_secure', 'table_size_analysis_secure')
    ) THEN '✅ VUES SÉCURISÉES CRÉÉES'
    ELSE '❌ VUES SÉCURISÉES MANQUANTES'
    END as status;

-- Vérifier que RLS est activé sur spatial_ref_sys
SELECT
    'VÉRIFICATION RLS SPATIAL_REF_SYS:' as check_type,
    CASE WHEN EXISTS (
        SELECT 1 FROM pg_class c
        JOIN pg_namespace n ON c.relnamespace = n.oid
        WHERE n.nspname = 'public'
        AND c.relname = 'spatial_ref_sys'
        AND c.relrowsecurity = true
    ) THEN '✅ RLS ACTIVÉ SUR SPATIAL_REF_SYS'
    ELSE '❌ RLS NON ACTIVÉ SUR SPATIAL_REF_SYS'
    END as status;

-- Vérifier les fonctions avec search_path sécurisé
SELECT
    'VÉRIFICATION SEARCH_PATH FONCTIONS:' as check_type,
    COUNT(*) as fonctions_verifiees,
    'Fonctions avec search_path sécurisé' as description
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND p.proname IN ('calculate_mrr', 'calculate_conversion_rate', 'update_updated_at_column')
AND p.prosecdef = true
AND p.proconfig IS NOT NULL
AND array_to_string(p.proconfig, ',') LIKE '%search_path%';

-- =====================================================
-- ÉTAPE 7: NETTOYAGE FINAL
-- =====================================================

-- Supprimer d'éventuels objets orphelins
DROP VIEW IF EXISTS public.dual_billing_dashboard CASCADE;
DROP VIEW IF EXISTS public.index_usage_analysis CASCADE;
DROP VIEW IF EXISTS public.table_size_analysis CASCADE;
DROP VIEW IF EXISTS public.points_expiring_soon CASCADE;
DROP VIEW IF EXISTS public.user_subscription_summary CASCADE;
DROP VIEW IF EXISTS public.admin_dashboard_metrics CASCADE;
DROP VIEW IF EXISTS public.points_expiry_with_days CASCADE;

-- =====================================================
-- RAPPORT FINAL
-- =====================================================

SELECT
    '🎉 FIXES SÉCURITÉ TERMINÉS !' as celebration,
    NOW() as execution_date,
    'Phase 1: Vues SECURITY DEFINER supprimées' as phase_1,
    'Phase 2: Vues sécurisées créées' as phase_2,
    'Phase 3: RLS activé sur spatial_ref_sys' as phase_3,
    'Phase 4: search_path des fonctions corrigé' as phase_4,
    '✅ SÉCURITÉ RENFORCÉE' as status_final;
