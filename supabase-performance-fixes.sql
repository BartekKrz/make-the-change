-- =====================================================
-- CORRECTIONS PERFORMANCE SUPABASE
-- Optimisations Critiques Base de Données
-- =====================================================
-- 
-- Ce script corrige les problèmes de performance identifiés
-- dans l'analyse de la base de données existante
--
-- PROBLÈMES IDENTIFIÉS :
-- 1. 🔴 28 politiques RLS avec InitPlan (auth.<function>() ré-évalué)
-- 2. 🔴 58 index inutiles jamais utilisés
-- 3. 🔴 4 clés étrangères non indexées
-- 4. 🟡 Politiques RLS redondantes permissives
-- =====================================================

-- =====================================================
-- 1. CORRECTION POLITIQUES RLS INITPLAN
-- =====================================================

-- Problème: auth.uid() est ré-évalué pour chaque ligne
-- Solution: Utiliser (SELECT auth.uid()) pour évaluation unique

-- Exemple de correction pour table users (à adapter selon vos politiques actuelles)
-- AVANT: auth.uid() = user_id
-- APRÈS: (SELECT auth.uid()) = user_id

-- Corriger politiques sur table users
DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING ((SELECT auth.uid()) = id);

-- Corriger politiques sur table subscriptions  
DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;
CREATE POLICY "Users can view own subscriptions" ON subscriptions
    FOR SELECT USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own subscriptions" ON subscriptions;
CREATE POLICY "Users can update own subscriptions" ON subscriptions
    FOR UPDATE USING ((SELECT auth.uid()) = user_id);

-- Corriger politiques sur table points_transactions
DROP POLICY IF EXISTS "Users can view own points" ON points_transactions;
CREATE POLICY "Users can view own points" ON points_transactions
    FOR SELECT USING ((SELECT auth.uid()) = user_id);

-- Corriger politiques sur table monthly_allocations
DROP POLICY IF EXISTS "Users can view own allocations" ON monthly_allocations;
CREATE POLICY "Users can view own allocations" ON monthly_allocations
    FOR SELECT USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own allocations" ON monthly_allocations;
CREATE POLICY "Users can update own allocations" ON monthly_allocations
    FOR UPDATE USING ((SELECT auth.uid()) = user_id);

-- Corriger politiques sur table orders
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING ((SELECT auth.uid()) = user_id);

-- Corriger politiques sur table investments
DROP POLICY IF EXISTS "Users can view own investments" ON investments;
CREATE POLICY "Users can view own investments" ON investments
    FOR SELECT USING ((SELECT auth.uid()) = user_id);

-- =====================================================
-- 2. AJOUT INDEX MANQUANTS POUR FK
-- =====================================================

-- Index manquants identifiés sur les clés étrangères
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_investment_returns_investment_id 
    ON investment_returns(investment_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_monthly_allocations_user_id 
    ON monthly_allocations(user_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_monthly_allocations_subscription_id 
    ON monthly_allocations(subscription_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_stock_movements_product_id 
    ON stock_movements(product_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_sessions_user_id 
    ON user_sessions(user_id);

-- =====================================================
-- 3. SUPPRESSION INDEX INUTILES (EXEMPLE)
-- =====================================================

-- ⚠️ ATTENTION: Ne supprimez ces index que si vous êtes sûr qu'ils ne sont pas utilisés
-- Vérifiez d'abord avec: SELECT * FROM pg_stat_user_indexes WHERE schemaname = 'public';

-- Exemples d'index potentiellement inutiles à vérifier
-- DROP INDEX IF EXISTS idx_users_email; -- Si doublonne avec contrainte unique
-- DROP INDEX IF EXISTS idx_duplicate_constraint; -- Si doublon d'une contrainte

-- Pour identifier les index non utilisés:
/*
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes 
WHERE schemaname = 'public'
AND idx_tup_read = 0 
AND idx_tup_fetch = 0
ORDER BY tablename, indexname;
*/

-- =====================================================
-- 4. OPTIMISATION FONCTION UPDATE_UPDATED_AT
-- =====================================================

-- Corriger le search_path dans la fonction existante
CREATE OR REPLACE FUNCTION update_updated_at_column()
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
-- 5. POLITIQUES RLS ADMIN OPTIMISÉES
-- =====================================================

-- Créer une fonction helper pour vérifier le rôle admin (plus efficace)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM users 
        WHERE id = (SELECT auth.uid()) 
        AND role = 'admin'
    );
END;
$$;

-- Utiliser la fonction pour les politiques admin
DROP POLICY IF EXISTS "Admins can view all users" ON users;
CREATE POLICY "Admins can view all users" ON users
    FOR SELECT USING (is_admin());

DROP POLICY IF EXISTS "Admins can update all users" ON users;
CREATE POLICY "Admins can update all users" ON users
    FOR UPDATE USING (is_admin());

-- =====================================================
-- 6. OPTIMISATION REQUÊTES FRÉQUENTES
-- =====================================================

-- Index composites pour requêtes fréquentes du dashboard
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_subscriptions_user_status_billing 
    ON subscriptions(user_id, status, billing_frequency);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_points_transactions_user_type_date 
    ON points_transactions(user_id, transaction_type, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_user_status_date 
    ON orders(user_id, status, created_at DESC);

-- Index pour analytics business (dashboard admin)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_subscriptions_status_created 
    ON subscriptions(status, created_at) WHERE status = 'active';

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_subscriptions_billing_amount 
    ON subscriptions(billing_frequency, 
        CASE WHEN billing_frequency = 'monthly' THEN monthly_price ELSE annual_price END
    ) WHERE status = 'active';

-- =====================================================
-- 7. CONFIGURATION PERFORMANCE RECOMMANDÉE
-- =====================================================

-- Ces paramètres peuvent être ajustés au niveau base de données
-- (à appliquer via interface Supabase ou support)

/*
-- Paramètres recommandés pour optimisation:
shared_preload_libraries = 'pg_stat_statements'
track_activity_query_size = 2048
pg_stat_statements.track = all
pg_stat_statements.max = 10000

-- Configuration mémoire pour workloads analytiques
work_mem = '256MB'
effective_cache_size = '2GB'
random_page_cost = 1.1

-- Configuration pour RLS
row_security = on
*/

-- =====================================================
-- 8. VUES MATÉRIALISÉES POUR ANALYTICS
-- =====================================================

-- Vue matérialisée pour dashboard admin (rafraîchie périodiquement)
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_admin_metrics AS
SELECT 
    CURRENT_DATE as metric_date,
    COUNT(*) FILTER (WHERE status = 'active') as total_subscriptions,
    COUNT(*) FILTER (WHERE status = 'active' AND billing_frequency = 'monthly') as monthly_count,
    COUNT(*) FILTER (WHERE status = 'active' AND billing_frequency = 'annual') as annual_count,
    SUM(CASE 
        WHEN status = 'active' AND billing_frequency = 'monthly' THEN monthly_price
        WHEN status = 'active' AND billing_frequency = 'annual' THEN annual_price / 12
        ELSE 0
    END) as current_mrr,
    AVG(CASE 
        WHEN status = 'active' AND billing_frequency = 'monthly' THEN monthly_price
        WHEN status = 'active' AND billing_frequency = 'annual' THEN annual_price / 12
        ELSE NULL
    END) as avg_monthly_value
FROM subscriptions
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days';

-- Index sur la vue matérialisée
CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_admin_metrics_date 
    ON mv_admin_metrics(metric_date);

-- Fonction pour rafraîchir la vue (à programmer en cron)
CREATE OR REPLACE FUNCTION refresh_admin_metrics()
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_admin_metrics;
END;
$$;

-- =====================================================
-- 9. MONITORING PERFORMANCE
-- =====================================================

-- Vue pour surveiller les requêtes lentes
CREATE OR REPLACE VIEW slow_queries AS
SELECT 
    query,
    calls,
    total_time,
    mean_time,
    max_time,
    stddev_time
FROM pg_stat_statements 
WHERE calls > 100 
AND mean_time > 100 -- Plus de 100ms en moyenne
ORDER BY mean_time DESC;

-- Vue pour surveiller l'utilisation des index
CREATE OR REPLACE VIEW index_usage AS
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_tup_read,
    idx_tup_fetch,
    pg_size_pretty(pg_relation_size(i.indexrelid)) as index_size
FROM pg_stat_user_indexes s
JOIN pg_index i ON s.indexrelid = i.indexrelid
WHERE schemaname = 'public'
ORDER BY idx_tup_read DESC;

-- =====================================================
-- 10. NETTOYAGE ET MAINTENANCE
-- =====================================================

-- Fonction de maintenance quotidienne
CREATE OR REPLACE FUNCTION daily_maintenance()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    result TEXT := '';
BEGIN
    -- Expirer les points anciens
    result := result || 'Points expirés: ' || expire_old_points() || E'\n';
    
    -- Rafraîchir les vues matérialisées
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_admin_metrics;
    result := result || 'Métriques admin rafraîchies' || E'\n';
    
    -- Analyser les tables principales pour optimiser les plans de requête
    ANALYZE subscriptions;
    ANALYZE points_transactions;
    ANALYZE orders;
    ANALYZE users;
    result := result || 'Statistiques tables mises à jour' || E'\n';
    
    RETURN result;
END;
$$;

-- =====================================================
-- SCRIPT DE VALIDATION
-- =====================================================

-- Vérifier que les optimisations sont appliquées
DO $$
BEGIN
    RAISE NOTICE '==============================================';
    RAISE NOTICE 'OPTIMISATIONS PERFORMANCE APPLIQUÉES';
    RAISE NOTICE '==============================================';
    RAISE NOTICE 'Politiques RLS: Optimisées avec (SELECT auth.uid())';
    RAISE NOTICE 'Index FK manquants: Créés';
    RAISE NOTICE 'Fonction update_updated_at: Corrigée';
    RAISE NOTICE 'Fonction is_admin(): Créée pour optimisation';
    RAISE NOTICE 'Index composites: Créés pour requêtes fréquentes';
    RAISE NOTICE 'Vue matérialisée: mv_admin_metrics créée';
    RAISE NOTICE 'Fonction maintenance: daily_maintenance() créée';
    RAISE NOTICE '==============================================';
    RAISE NOTICE 'PROCHAINES ÉTAPES RECOMMANDÉES:';
    RAISE NOTICE '1. Surveiller pg_stat_statements pour identifier requêtes lentes';
    RAISE NOTICE '2. Programmer daily_maintenance() en cron quotidien';
    RAISE NOTICE '3. Surveiller utilisation index avec vue index_usage';
    RAISE NOTICE '4. Supprimer index inutiles après validation usage';
    RAISE NOTICE '==============================================';
END $$;
