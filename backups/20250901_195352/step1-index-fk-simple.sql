-- =====================================================
-- ÉTAPE 1: INDEX FK MANQUANTS - VERSION ULTRA SIMPLE
-- =====================================================
-- Copiez-collez CHAQUE commande individuellement
--
-- INSTRUCTIONS:
-- 1. Exécutez d'abord la vérification
-- 2. Copiez-collez seulement les CREATE INDEX nécessaires
-- 3. Vérifiez à la fin
-- =====================================================

-- =====================================================
-- ÉTAPE A: VÉRIFICATION (exécutez d'abord)
-- =====================================================

SELECT
    'VÉRIFICATION DES INDEX EXISTANTS:' as status,
    CASE WHEN EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_investment_returns_investment_id')
         THEN '✅ idx_investment_returns_investment_id DÉJÀ CRÉÉ'
         ELSE '❌ idx_investment_returns_investment_id À CRÉER' END as investment_returns,
    CASE WHEN EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_monthly_allocations_user_id')
         THEN '✅ idx_monthly_allocations_user_id DÉJÀ CRÉÉ'
         ELSE '❌ idx_monthly_allocations_user_id À CRÉER' END as monthly_allocations_user,
    CASE WHEN EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_monthly_allocations_subscription_id')
         THEN '✅ idx_monthly_allocations_subscription_id DÉJÀ CRÉÉ'
         ELSE '❌ idx_monthly_allocations_subscription_id À CRÉER' END as monthly_allocations_subscription,
    CASE WHEN EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_points_expiry_schedule_transaction_id')
         THEN '✅ idx_points_expiry_schedule_transaction_id DÉJÀ CRÉÉ'
         ELSE '❌ idx_points_expiry_schedule_transaction_id À CRÉER' END as points_expiry,
    CASE WHEN EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_user_sessions_user_id')
         THEN '✅ idx_user_sessions_user_id DÉJÀ CRÉÉ'
         ELSE '❌ idx_user_sessions_user_id À CRÉER' END as user_sessions;

-- =====================================================
-- ÉTAPE B: CRÉATION DES INDEX (exécutez seulement ceux marqués ❌)
-- =====================================================

-- ⚠️ COPIEZ-COLLEZ SEULEMENT LES COMMANDES CI-DESSOUS SI L'INDEX N'EXISTE PAS

-- 1. Index pour investment_returns (seulement si marqué ❌ ci-dessus)
-- CREATE INDEX idx_investment_returns_investment_id ON investment_returns(investment_id);

-- 2. Index pour monthly_allocations user_id (seulement si marqué ❌ ci-dessus)
-- CREATE INDEX idx_monthly_allocations_user_id ON monthly_allocations(user_id);

-- 3. Index pour monthly_allocations subscription_id (seulement si marqué ❌ ci-dessus)
-- CREATE INDEX idx_monthly_allocations_subscription_id ON monthly_allocations(subscription_id);

-- 4. Index pour points_expiry_schedule (seulement si marqué ❌ ci-dessus)
-- CREATE INDEX idx_points_expiry_schedule_transaction_id ON points_expiry_schedule(points_transaction_id);

-- 5. Index pour user_sessions (seulement si marqué ❌ ci-dessus)
-- CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);

-- =====================================================
-- ÉTAPE C: VÉRIFICATION FINALE (exécutez après création)
-- =====================================================

-- Vérifier le résultat final
SELECT
    'RÉSULTAT FINAL:' as status,
    COUNT(*) as total_index_crees,
    'Index FK créés avec succès !' as message
FROM pg_indexes
WHERE schemaname = 'public'
AND indexname LIKE 'idx_%';

-- Détail des index créés
SELECT
    indexname as nom_index,
    tablename as table_concernee,
    '✅ CRÉÉ' as status
FROM pg_indexes
WHERE schemaname = 'public'
AND indexname IN (
    'idx_investment_returns_investment_id',
    'idx_monthly_allocations_user_id',
    'idx_monthly_allocations_subscription_id',
    'idx_points_expiry_schedule_transaction_id',
    'idx_user_sessions_user_id'
);
