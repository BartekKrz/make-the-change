-- =====================================================
-- ÉTAPE 2: INDEX COMPOSITES POUR REQUÊTES FRÉQUENTES
-- =====================================================
-- Ces index optimisent les requêtes les plus fréquentes
-- du dashboard et des analytics
--
-- IMPACT ATTENDU:
-- • Dashboard abonnements 3x plus rapide
-- • Analytics points 2x plus rapide
-- • Requêtes commandes utilisateur optimisées
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '=== ÉTAPE 2: INDEX COMPOSITES ===';

    -- Index composite pour dashboard abonnements (requête très fréquente)
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_subscriptions_user_status_billing') THEN
        CREATE INDEX CONCURRENTLY idx_subscriptions_user_status_billing
        ON subscriptions(user_id, status, billing_frequency);
        RAISE NOTICE '✅ Index composite dashboard: idx_subscriptions_user_status_billing';
    ELSE
        RAISE NOTICE 'ℹ️ Index composite déjà existant: idx_subscriptions_user_status_billing';
    END IF;

    -- Index composite pour analytics points (tri par date décroissante)
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_points_transactions_user_type_date') THEN
        CREATE INDEX CONCURRENTLY idx_points_transactions_user_type_date
        ON points_transactions(user_id, type, created_at DESC);
        RAISE NOTICE '✅ Index composite analytics: idx_points_transactions_user_type_date';
    ELSE
        RAISE NOTICE 'ℹ️ Index composite déjà existant: idx_points_transactions_user_type_date';
    END IF;

    -- Index composite pour commandes utilisateur (tri par date)
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_orders_user_status_date') THEN
        CREATE INDEX CONCURRENTLY idx_orders_user_status_date
        ON orders(user_id, status, created_at DESC);
        RAISE NOTICE '✅ Index composite commandes: idx_orders_user_status_date';
    ELSE
        RAISE NOTICE 'ℹ️ Index composite déjà existant: idx_orders_user_status_date';
    END IF;

    RAISE NOTICE '=== ÉTAPE 2 TERMINÉE AVEC SUCCÈS ===';
END $$;

-- VÉRIFICATION: Lister les nouveaux index composites
SELECT
    indexname,
    'Index composite créé' as status
FROM pg_indexes
WHERE schemaname = 'public'
AND indexname IN (
    'idx_subscriptions_user_status_billing',
    'idx_points_transactions_user_type_date',
    'idx_orders_user_status_date'
);
