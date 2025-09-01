-- =====================================================
-- ÉTAPE 4: INDEX DE PERFORMANCE
-- =====================================================

-- Index pour table subscriptions
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_billing_frequency ON subscriptions(billing_frequency);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_type ON subscriptions(plan_type);
CREATE INDEX IF NOT EXISTS idx_subscriptions_next_billing ON subscriptions(next_billing_date) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_id ON subscriptions(stripe_subscription_id);

-- Index pour billing history
CREATE INDEX IF NOT EXISTS idx_billing_history_subscription ON subscription_billing_history(subscription_id);
CREATE INDEX IF NOT EXISTS idx_billing_history_user ON subscription_billing_history(user_id);
CREATE INDEX IF NOT EXISTS idx_billing_history_period ON subscription_billing_history(billing_period_start, billing_period_end);
CREATE INDEX IF NOT EXISTS idx_billing_history_amount ON subscription_billing_history(amount);
CREATE INDEX IF NOT EXISTS idx_billing_history_status ON subscription_billing_history(payment_status);

-- Index pour conversion events
CREATE INDEX IF NOT EXISTS idx_conversion_events_user ON conversion_events(user_id);
CREATE INDEX IF NOT EXISTS idx_conversion_events_subscription ON conversion_events(subscription_id);
CREATE INDEX IF NOT EXISTS idx_conversion_events_type ON conversion_events(event_type);
CREATE INDEX IF NOT EXISTS idx_conversion_events_date ON conversion_events(event_date);
CREATE INDEX IF NOT EXISTS idx_conversion_events_campaign ON conversion_events(campaign_id) WHERE campaign_id IS NOT NULL;

-- Index pour business metrics
CREATE INDEX IF NOT EXISTS idx_business_metrics_date ON business_metrics(metric_date);
CREATE INDEX IF NOT EXISTS idx_business_metrics_period ON business_metrics(metric_period);
CREATE INDEX IF NOT EXISTS idx_business_metrics_mrr ON business_metrics(mrr);

-- Index pour points expiry
CREATE INDEX IF NOT EXISTS idx_points_expiry_user ON points_expiry_schedule(user_id);
CREATE INDEX IF NOT EXISTS idx_points_expiry_date ON points_expiry_schedule(expiry_date);
CREATE INDEX IF NOT EXISTS idx_points_expiry_not_expired ON points_expiry_schedule(expiry_date)
    WHERE is_expired = FALSE;

-- Index pour cohorts
CREATE INDEX IF NOT EXISTS idx_cohorts_month ON subscription_cohorts(cohort_month);
CREATE INDEX IF NOT EXISTS idx_cohorts_period ON subscription_cohorts(period_number);

SELECT 'Index de performance créés avec succès' as status;
