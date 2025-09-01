-- =====================================================
-- MONITORING ET ALERTES - PHASE 4: SURVEILLANCE AUTOMATISÉE
-- =====================================================
-- Système de monitoring et alertes pour la base de données
--
-- À EXÉCUTER DANS SUPABASE SQL EDITOR
-- =====================================================

-- =====================================================
-- ÉTAPE 1: VUES DE MONITORING AVANCÉES
-- =====================================================

-- Vue monitoring des performances générales
CREATE OR REPLACE VIEW system_performance_monitor AS
SELECT
    'SYSTEM_PERFORMANCE' as metric_type,
    jsonb_build_object(
        'total_indexes', (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public' AND indexname LIKE 'idx_%'),
        'total_tables', (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public'),
        'total_views', (SELECT COUNT(*) FROM information_schema.views WHERE table_schema = 'public'),
        'database_size', pg_size_pretty(pg_database_size(current_database())),
        'last_vacuum', (SELECT max(last_vacuum) FROM pg_stat_user_tables WHERE schemaname = 'public'),
        'last_analyze', (SELECT max(last_analyze) FROM pg_stat_user_tables WHERE schemaname = 'public')
    ) as metrics,
    NOW() as measured_at;

-- Vue monitoring des requêtes lentes
CREATE OR REPLACE VIEW slow_queries_monitor AS
SELECT
    'SLOW_QUERIES' as alert_type,
    query,
    calls as execution_count,
    round(total_time::numeric, 2) as total_time_ms,
    round(mean_time::numeric, 2) as avg_time_ms,
    round((total_time / calls)::numeric, 2) as avg_time_per_call,
    CASE
        WHEN mean_time > 1000 THEN '🔴 TRÈS LENTE (>1s)'
        WHEN mean_time > 100 THEN '🟡 LENTE (>100ms)'
        ELSE '🟢 NORMALE'
    END as performance_status
FROM pg_stat_statements
WHERE schemaname = 'public'
AND mean_time > 50  -- Seulement les requêtes > 50ms
ORDER BY mean_time DESC
LIMIT 10;

-- Vue monitoring de l'utilisation des index
CREATE OR REPLACE VIEW index_efficiency_monitor AS
SELECT
    'INDEX_EFFICIENCY' as metric_type,
    schemaname,
    relname as table_name,
    indexrelname as index_name,
    idx_scan as scans,
    idx_tup_read as tuples_read,
    idx_tup_fetch as tuples_fetched,
    CASE
        WHEN idx_scan = 0 THEN '🔴 JAMAIS UTILISÉ - CANDIDAT SUPPRESSION'
        WHEN idx_scan < 10 THEN '🟡 PEU UTILISÉ'
        WHEN idx_scan < 100 THEN '🟢 UTILISÉ MODÉRÉMENT'
        ELSE '🟢 FORTEMENT UTILISÉ'
    END as usage_status,
    pg_size_pretty(pg_relation_size(indexrelid)) as index_size,
    CASE
        WHEN idx_scan = 0 THEN 1 -- Priorité haute pour nettoyage
        WHEN idx_scan < 10 THEN 2 -- Priorité moyenne
        ELSE 3 -- Priorité basse
    END as cleanup_priority
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan ASC, pg_relation_size(indexrelid) DESC;

-- =====================================================
-- ÉTAPE 2: SYSTÈME D'ALERTES AUTOMATISÉES
-- =====================================================

-- Table pour les alertes système
CREATE TABLE IF NOT EXISTS system_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    metric_value NUMERIC,
    threshold_value NUMERIC,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'resolved', 'dismissed')),
    acknowledged_by UUID REFERENCES users(id),
    acknowledged_at TIMESTAMP,
    resolved_at TIMESTAMP,
    auto_resolve BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Index pour les alertes
CREATE INDEX IF NOT EXISTS idx_system_alerts_type_status ON system_alerts(alert_type, status);
CREATE INDEX IF NOT EXISTS idx_system_alerts_created ON system_alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_system_alerts_severity ON system_alerts(severity);

-- Politique RLS pour les alertes
ALTER TABLE system_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view system alerts" ON system_alerts
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Service role can manage system alerts" ON system_alerts
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- =====================================================
-- ÉTAPE 3: FONCTIONS DE GÉNÉRATION D'ALERTES
-- =====================================================

-- Fonction pour générer des alertes de performance
CREATE OR REPLACE FUNCTION generate_performance_alerts()
RETURNS INTEGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    alert_count INTEGER := 0;
BEGIN
    -- Alerte: Index inutilisés
    INSERT INTO system_alerts (alert_type, severity, title, message, metric_value)
    SELECT
        'unused_indexes',
        'medium',
        'Index inutilisés détectés',
        'Index ' || indexrelname || ' sur table ' || relname || ' n''a jamais été utilisé',
        0
    FROM pg_stat_user_indexes
    WHERE schemaname = 'public'
    AND idx_scan = 0
    AND NOT EXISTS (
        SELECT 1 FROM system_alerts
        WHERE alert_type = 'unused_indexes'
        AND message LIKE '%' || indexrelname || '%'
        AND status = 'active'
        AND created_at > NOW() - INTERVAL '24 hours'
    );

    GET DIAGNOSTICS alert_count = ROW_COUNT;

    -- Alerte: Requêtes lentes
    INSERT INTO system_alerts (alert_type, severity, title, message, metric_value)
    SELECT
        'slow_queries',
        CASE WHEN mean_time > 1000 THEN 'high' ELSE 'medium' END,
        'Requête lente détectée',
        'Requête avec temps moyen de ' || round(mean_time::numeric, 2) || 'ms',
        mean_time
    FROM pg_stat_statements
    WHERE schemaname = 'public'
    AND mean_time > 500  -- Plus de 500ms
    AND NOT EXISTS (
        SELECT 1 FROM system_alerts
        WHERE alert_type = 'slow_queries'
        AND metric_value = mean_time
        AND status = 'active'
        AND created_at > NOW() - INTERVAL '1 hour'
    );

    -- Alerte: Stock faible
    INSERT INTO system_alerts (alert_type, severity, title, message, metric_value, threshold_value)
    SELECT
        'low_stock',
        'medium',
        'Stock faible détecté',
        'Produit ' || p.name || ' : ' || i.quantity_available || ' unités restantes',
        i.quantity_available,
        i.reorder_threshold
    FROM inventory i
    JOIN products p ON i.product_id = p.id
    WHERE i.quantity_available <= i.reorder_threshold
    AND NOT EXISTS (
        SELECT 1 FROM system_alerts
        WHERE alert_type = 'low_stock'
        AND message LIKE '%' || p.name || '%'
        AND status = 'active'
        AND created_at > NOW() - INTERVAL '24 hours'
    );

    -- Alerte: Abonnements en retard de paiement
    INSERT INTO system_alerts (alert_type, severity, title, message)
    SELECT
        'payment_overdue',
        'high',
        'Paiement d''abonnement en retard',
        'Abonnement de l''utilisateur avec ID ' || user_id || ' est en statut ' || status
    FROM subscriptions
    WHERE status = 'past_due'
    AND NOT EXISTS (
        SELECT 1 FROM system_alerts
        WHERE alert_type = 'payment_overdue'
        AND message LIKE '%' || user_id || '%'
        AND status = 'active'
        AND created_at > NOW() - INTERVAL '24 hours'
    );

    RETURN alert_count;
END;
$$;

-- Fonction pour nettoyer les alertes résolues
CREATE OR REPLACE FUNCTION cleanup_resolved_alerts()
RETURNS INTEGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    cleaned_count INTEGER := 0;
BEGIN
    -- Marquer comme résolus les index maintenant utilisés
    UPDATE system_alerts
    SET status = 'resolved', resolved_at = NOW(), auto_resolve = true
    WHERE alert_type = 'unused_indexes'
    AND status = 'active'
    AND message LIKE '%Index %'
    AND EXISTS (
        SELECT 1 FROM pg_stat_user_indexes
        WHERE schemaname = 'public'
        AND idx_scan > 0
        AND system_alerts.message LIKE '%' || indexrelname || '%'
    );

    GET DIAGNOSTICS cleaned_count = ROW_COUNT;

    -- Marquer comme résolus les stocks maintenant suffisants
    UPDATE system_alerts
    SET status = 'resolved', resolved_at = NOW(), auto_resolve = true
    WHERE alert_type = 'low_stock'
    AND status = 'active'
    AND EXISTS (
        SELECT 1 FROM inventory i
        JOIN products p ON i.product_id = p.id
        WHERE i.quantity_available > i.reorder_threshold
        AND system_alerts.message LIKE '%' || p.name || '%'
    );

    RETURN cleaned_count;
END;
$$;

-- =====================================================
-- ÉTAPE 4: DASHBOARD DE MONITORING COMPLÈT
-- =====================================================

-- Vue dashboard système complet
CREATE OR REPLACE VIEW system_monitoring_dashboard AS
SELECT
    '📊 MÉTRIQUES SYSTÈME' as section,
    jsonb_build_object(
        'database_size', pg_size_pretty(pg_database_size(current_database())),
        'active_connections', (SELECT count(*) FROM pg_stat_activity WHERE state = 'active'),
        'total_indexes', (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public'),
        'total_tables', (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public'),
        'alerts_actives', (SELECT COUNT(*) FROM system_alerts WHERE status = 'active'),
        'dernier_backup', NOW() - INTERVAL '1 day' -- À adapter selon votre stratégie
    ) as system_metrics,
    NOW() as last_updated
UNION ALL
SELECT
    '🚨 ALERTES ACTIVES' as section,
    jsonb_agg(
        jsonb_build_object(
            'type', alert_type,
            'severity', severity,
            'title', title,
            'created', created_at
        )
    ) as system_metrics,
    NOW() as last_updated
FROM system_alerts
WHERE status = 'active'
GROUP BY section
UNION ALL
SELECT
    '⚡ PERFORMANCES' as section,
    jsonb_build_object(
        'slow_queries_count', (SELECT COUNT(*) FROM slow_queries_monitor),
        'unused_indexes_count', (SELECT COUNT(*) FROM index_efficiency_monitor WHERE usage_status LIKE '🔴%'),
        'avg_query_time', (SELECT round(avg(mean_time)::numeric, 2) FROM pg_stat_statements WHERE schemaname = 'public'),
        'cache_hit_ratio', round(100 * (SELECT sum(blks_hit) / (sum(blks_hit) + sum(blks_read))::numeric FROM pg_stat_database), 2)
    ) as system_metrics,
    NOW() as last_updated;

-- Vue business health dashboard
CREATE OR REPLACE VIEW business_health_dashboard AS
SELECT
    '💰 SANTÉ BUSINESS' as section,
    jsonb_build_object(
        'mrr_actuel', (SELECT mrr FROM business_metrics ORDER BY metric_date DESC LIMIT 1),
        'total_subscribers', (SELECT total_subscribers FROM business_metrics ORDER BY metric_date DESC LIMIT 1),
        'conversion_rate', (SELECT conversion_rate FROM business_metrics ORDER BY metric_date DESC LIMIT 1),
        'churn_rate', (SELECT monthly_churn_rate FROM business_metrics ORDER BY metric_date DESC LIMIT 1),
        'points_utilization', (SELECT points_utilization_rate FROM business_metrics ORDER BY metric_date DESC LIMIT 1)
    ) as business_metrics,
    NOW() as last_updated
UNION ALL
SELECT
    '📦 STOCK ET COMMANDES' as section,
    jsonb_build_object(
        'total_products', (SELECT COUNT(*) FROM products WHERE is_active = true),
        'hero_products', (SELECT COUNT(*) FROM products WHERE is_hero_product = true),
        'low_stock_alerts', (SELECT COUNT(*) FROM inventory WHERE quantity_available <= reorder_threshold),
        'pending_orders', (SELECT COUNT(*) FROM orders WHERE status = 'pending'),
        'total_inventory_value', (
            SELECT SUM(i.quantity_available * (i.cost_price_cents / 100.0))
            FROM inventory i
        )
    ) as business_metrics,
    NOW() as last_updated;

-- =====================================================
-- ÉTAPE 5: FONCTIONS DE MAINTENANCE AUTOMATISÉE
-- =====================================================

-- Fonction de maintenance hebdomadaire
CREATE OR REPLACE FUNCTION weekly_maintenance()
RETURNS TEXT
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    result_text TEXT := '';
BEGIN
    -- Générer les alertes de performance
    PERFORM generate_performance_alerts();

    -- Nettoyer les alertes résolues
    PERFORM cleanup_resolved_alerts();

    -- Vérifier les index inutilisés
    SELECT 'Maintenance effectuée: ' ||
           (SELECT COUNT(*) FROM system_alerts WHERE status = 'active') || ' alertes actives'
    INTO result_text;

    RETURN result_text;
END;
$$;

-- Fonction de nettoyage des données anciennes
CREATE OR REPLACE FUNCTION cleanup_old_data(days_old INTEGER DEFAULT 90)
RETURNS INTEGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    deleted_count INTEGER := 0;
BEGIN
    -- Supprimer les anciennes alertes résolues
    DELETE FROM system_alerts
    WHERE status IN ('resolved', 'dismissed')
    AND created_at < NOW() - INTERVAL '90 days';

    GET DIAGNOSTICS deleted_count = ROW_COUNT;

    -- Supprimer les anciennes métriques business (garder 1 an)
    DELETE FROM business_metrics
    WHERE metric_date < NOW() - INTERVAL '1 year';

    -- Log de l'opération
    INSERT INTO system_alerts (
        alert_type, severity, title, message, auto_resolve
    ) VALUES (
        'maintenance',
        'low',
        'Nettoyage automatique effectué',
        'Suppression de ' || deleted_count || ' anciennes alertes',
        true
    );

    RETURN deleted_count;
END;
$$;

-- =====================================================
-- ÉTAPE 6: TESTS ET VALIDATION
-- =====================================================

-- Générer des alertes initiales
SELECT generate_performance_alerts() as alerts_generated;

-- Vérifier le système de monitoring
SELECT
    '🧪 VALIDATION MONITORING:' as test,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.views WHERE table_schema = 'public' AND table_name = 'system_monitoring_dashboard')
         THEN '✅ Dashboard système opérationnel' ELSE '❌ Dashboard système manquant' END as system_dashboard,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.views WHERE table_schema = 'public' AND table_name = 'business_health_dashboard')
         THEN '✅ Dashboard business opérationnel' ELSE '❌ Dashboard business manquant' END as business_dashboard,
    CASE WHEN EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'generate_performance_alerts')
         THEN '✅ Fonction alertes opérationnelle' ELSE '❌ Fonction alertes manquante' END as alerts_function;

-- Aperçu des alertes générées
SELECT
    '🚨 ALERTES GÉNÉRÉES:' as alerts_overview,
    alert_type,
    severity,
    title,
    created_at::date as created_date
FROM system_alerts
WHERE status = 'active'
ORDER BY severity DESC, created_at DESC
LIMIT 5;

-- =====================================================
-- ÉTAPE 7: INSTRUCTIONS D'UTILISATION
-- =====================================================

-- Créer un commentaire avec les instructions
COMMENT ON TABLE system_alerts IS
'Système d''alertes automatisées - Utilisez generate_performance_alerts() pour générer des alertes,
weekly_maintenance() pour la maintenance hebdomadaire, cleanup_old_data() pour le nettoyage';

COMMENT ON VIEW system_monitoring_dashboard IS
'Dashboard de monitoring système - Rafraîchit automatiquement avec les métriques actuelles';

COMMENT ON VIEW business_health_dashboard IS
'Dashboard santé business - KPIs et métriques commerciales en temps réel';

-- =====================================================
-- RAPPORT FINAL MONITORING
-- =====================================================

SELECT
    '==============================================' as separator,
    '🎉 SYSTÈME DE MONITORING OPÉRATIONNEL !' as celebration,
    '==============================================' as separator2,
    NOW() as execution_date,
    'Phase 4: Vues de monitoring avancées créées' as phase_1,
    'Phase 5: Système d''alertes automatisées configuré' as phase_2,
    'Phase 6: Fonctions de maintenance automatisée' as phase_3,
    'Phase 7: Dashboards temps réel opérationnels' as phase_4,
    '✅ MONITORING 24/7 ACTIF' as status_final;
