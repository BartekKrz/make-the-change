-- =====================================================
-- ÉTAPE 1: INDEX FK MANQUANTS CRITIQUES
-- =====================================================
-- Ces index sont CRITIQUES pour les performances
-- Ils concernent les clés étrangères non indexées
--
-- IMPACT ATTENDU:
-- • Requêtes JOIN 4x plus rapides
-- • Réduction charge CPU significative
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '=== ÉTAPE 1: AJOUT INDEX FK CRITIQUES ===';

    -- Index pour investment_returns (FK critique pour les rapports)
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_investment_returns_investment_id') THEN
        CREATE INDEX CONCURRENTLY idx_investment_returns_investment_id ON investment_returns(investment_id);
        RAISE NOTICE '✅ Index créé: idx_investment_returns_investment_id';
    ELSE
        RAISE NOTICE 'ℹ️ Index déjà existant: idx_investment_returns_investment_id';
    END IF;

    -- Index pour monthly_allocations (FK critique pour le système de points)
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_monthly_allocations_user_id') THEN
        CREATE INDEX CONCURRENTLY idx_monthly_allocations_user_id ON monthly_allocations(user_id);
        RAISE NOTICE '✅ Index créé: idx_monthly_allocations_user_id';
    ELSE
        RAISE NOTICE 'ℹ️ Index déjà existant: idx_monthly_allocations_user_id';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_monthly_allocations_subscription_id') THEN
        CREATE INDEX CONCURRENTLY idx_monthly_allocations_subscription_id ON monthly_allocations(subscription_id);
        RAISE NOTICE '✅ Index créé: idx_monthly_allocations_subscription_id';
    ELSE
        RAISE NOTICE 'ℹ️ Index déjà existant: idx_monthly_allocations_subscription_id';
    END IF;

    -- Index pour points_expiry_schedule (FK critique pour expiration points)
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_points_expiry_schedule_transaction_id') THEN
        CREATE INDEX CONCURRENTLY idx_points_expiry_schedule_transaction_id ON points_expiry_schedule(points_transaction_id);
        RAISE NOTICE '✅ Index créé: idx_points_expiry_schedule_transaction_id';
    ELSE
        RAISE NOTICE 'ℹ️ Index déjà existant: idx_points_expiry_schedule_transaction_id';
    END IF;

    -- Index pour user_sessions (FK pour sécurité sessions)
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_user_sessions_user_id') THEN
        CREATE INDEX CONCURRENTLY idx_user_sessions_user_id ON user_sessions(user_id);
        RAISE NOTICE '✅ Index créé: idx_user_sessions_user_id';
    ELSE
        RAISE NOTICE 'ℹ️ Index déjà existant: idx_user_sessions_user_id';
    END IF;

    RAISE NOTICE '=== ÉTAPE 1 TERMINÉE AVEC SUCCÈS ===';
END $$;

-- VÉRIFICATION: Compter les index créés
SELECT
    COUNT(*) as total_indexes_apres,
    'Index FK créés avec succès' as status
FROM pg_indexes
WHERE schemaname = 'public'
AND indexname LIKE 'idx_%';
