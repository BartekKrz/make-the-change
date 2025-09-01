-- Migration 004: Analytics & Admin Tables
-- Make the CHANGE - Admin Dashboard Implementation
-- Phase 1: Analytics Foundation

-- =============================================
-- ADMIN ANALYTICS TRACKING
-- =============================================

-- Analytics d'usage admin pour audit et optimisation
CREATE TABLE admin_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user_id UUID REFERENCES users(id),
    action_type VARCHAR(50) NOT NULL, -- 'view_page', 'export_data', 'bulk_action', 'filter_applied'
    resource_type VARCHAR(50) NOT NULL, -- 'orders', 'users', 'products', 'projects', 'analytics'
    resource_id UUID,
    metadata JSONB DEFAULT '{}', -- détails spécifiques à l'action
    ip_address INET,
    user_agent TEXT,
    session_duration INTEGER, -- durée en secondes
    created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- BUSINESS METRICS POUR DASHBOARD
-- =============================================

-- Métriques business calculées pour charts et KPIs
CREATE TABLE business_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_type VARCHAR(50) NOT NULL, -- 'mrr', 'churn_rate', 'conversion', 'ltv', 'cac'
    period_type VARCHAR(20) NOT NULL, -- 'daily', 'weekly', 'monthly', 'quarterly'
    period_value VARCHAR(20) NOT NULL, -- '2025-01', '2025-W01', '2025-01-01', '2025-Q1'
    value DECIMAL(15,4) NOT NULL,
    previous_value DECIMAL(15,4), -- valeur période précédente pour % change
    change_percentage DECIMAL(8,4), -- % de changement vs période précédente
    metadata JSONB DEFAULT '{}', -- breakdown détaillé, segments, etc.
    calculated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(metric_type, period_type, period_value)
);

-- =============================================
-- EXPORT JOBS POUR RAPPORTS
-- =============================================

-- Jobs d'export de données pour les admins
CREATE TABLE export_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user_id UUID REFERENCES users(id),
    export_type VARCHAR(50) NOT NULL, -- 'users', 'orders', 'analytics', 'products', 'subscriptions'
    format VARCHAR(10) NOT NULL, -- 'csv', 'excel', 'pdf'
    filters JSONB DEFAULT '{}', -- filtres appliqués
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    file_url TEXT, -- URL du fichier généré
    file_size INTEGER, -- taille du fichier en bytes
    error_message TEXT,
    total_records INTEGER,
    processed_records INTEGER DEFAULT 0,
    progress_percentage DECIMAL(5,2) DEFAULT 0,
    estimated_completion TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    started_at TIMESTAMP,
    completed_at TIMESTAMP
);

-- =============================================
-- DASHBOARD PREFERENCES
-- =============================================

-- Préférences personnalisées des dashboards admin
CREATE TABLE admin_dashboard_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user_id UUID REFERENCES users(id),
    dashboard_type VARCHAR(50) NOT NULL, -- 'main', 'analytics', 'orders', 'users'
    widget_layout JSONB NOT NULL, -- configuration des widgets et positions
    filters_default JSONB DEFAULT '{}', -- filtres par défaut
    refresh_interval INTEGER DEFAULT 300, -- intervalle de refresh en secondes
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(admin_user_id, dashboard_type)
);

-- =============================================
-- SYSTÈME D'ALERTES
-- =============================================

-- Alertes business pour monitoring
CREATE TABLE business_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_type VARCHAR(50) NOT NULL, -- 'stock_low', 'high_churn', 'payment_failed', 'goal_reached'
    severity VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'acknowledged', 'resolved', 'dismissed'
    acknowledged_by UUID REFERENCES users(id),
    acknowledged_at TIMESTAMP,
    resolved_at TIMESTAMP,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Admin analytics indexes
CREATE INDEX idx_admin_analytics_user ON admin_analytics(admin_user_id);
CREATE INDEX idx_admin_analytics_action ON admin_analytics(action_type);
CREATE INDEX idx_admin_analytics_resource ON admin_analytics(resource_type, resource_id);
CREATE INDEX idx_admin_analytics_created ON admin_analytics(created_at);
CREATE INDEX idx_admin_analytics_session ON admin_analytics(admin_user_id, created_at); -- pour analytics de session

-- Business metrics indexes
CREATE INDEX idx_business_metrics_type ON business_metrics(metric_type);
CREATE INDEX idx_business_metrics_period ON business_metrics(period_type, period_value);
CREATE INDEX idx_business_metrics_type_period ON business_metrics(metric_type, period_type, period_value);
CREATE INDEX idx_business_metrics_calculated ON business_metrics(calculated_at);

-- Export jobs indexes
CREATE INDEX idx_export_jobs_user ON export_jobs(admin_user_id);
CREATE INDEX idx_export_jobs_status ON export_jobs(status);
CREATE INDEX idx_export_jobs_type ON export_jobs(export_type);
CREATE INDEX idx_export_jobs_created ON export_jobs(created_at);
CREATE INDEX idx_export_jobs_pending ON export_jobs(status, created_at) WHERE status IN ('pending', 'processing');

-- Dashboard configs indexes
CREATE INDEX idx_dashboard_configs_user ON admin_dashboard_configs(admin_user_id);
CREATE INDEX idx_dashboard_configs_type ON admin_dashboard_configs(dashboard_type);

-- Business alerts indexes  
CREATE INDEX idx_business_alerts_type ON business_alerts(alert_type);
CREATE INDEX idx_business_alerts_severity ON business_alerts(severity);
CREATE INDEX idx_business_alerts_status ON business_alerts(status);
CREATE INDEX idx_business_alerts_created ON business_alerts(created_at);
CREATE INDEX idx_business_alerts_active ON business_alerts(status, severity, created_at) WHERE status = 'active';

-- =============================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================

CREATE TRIGGER update_admin_dashboard_configs_updated_at 
    BEFORE UPDATE ON admin_dashboard_configs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- FONCTIONS HELPER POUR ANALYTICS
-- =============================================

-- Fonction pour calculer les métriques MRR
CREATE OR REPLACE FUNCTION calculate_mrr_for_period(period_month VARCHAR(7))
RETURNS DECIMAL(10,2) AS $$
DECLARE
    total_mrr DECIMAL(10,2) := 0;
BEGIN
    SELECT COALESCE(SUM(monthly_price_eur), 0) INTO total_mrr
    FROM subscriptions 
    WHERE status = 'active' 
    AND DATE_TRUNC('month', current_period_start) <= (period_month || '-01')::DATE
    AND (cancelled_at IS NULL OR cancelled_at > (period_month || '-01')::DATE + INTERVAL '1 month');
    
    RETURN total_mrr;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour insérer les analytics d'actions admin
CREATE OR REPLACE FUNCTION track_admin_action(
    user_id UUID,
    action_type VARCHAR(50),
    resource_type VARCHAR(50),
    resource_id UUID DEFAULT NULL,
    metadata JSONB DEFAULT '{}'
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO admin_analytics (
        admin_user_id,
        action_type,
        resource_type,
        resource_id,
        metadata
    ) VALUES (
        user_id,
        action_type,
        resource_type,
        resource_id,
        metadata
    );
END;
$$ LANGUAGE plpgsql;