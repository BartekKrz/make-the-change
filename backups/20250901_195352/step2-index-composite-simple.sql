-- =====================================================
-- ÉTAPE 2: INDEX COMPOSITES - VERSION ULTRA SIMPLE
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
    'VÉRIFICATION DES INDEX COMPOSITES:' as status,
    CASE WHEN EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_subscriptions_user_status_billing')
         THEN '✅ idx_subscriptions_user_status_billing DÉJÀ CRÉÉ'
         ELSE '❌ idx_subscriptions_user_status_billing À CRÉER' END as subscriptions_composite,
    CASE WHEN EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_points_transactions_user_type_date')
         THEN '✅ idx_points_transactions_user_type_date DÉJÀ CRÉÉ'
         ELSE '❌ idx_points_transactions_user_type_date À CRÉER' END as points_composite,
    CASE WHEN EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_orders_user_status_date')
         THEN '✅ idx_orders_user_status_date DÉJÀ CRÉÉ'
         ELSE '❌ idx_orders_user_status_date À CRÉER' END as orders_composite;

-- =====================================================
-- ÉTAPE B: CRÉATION DES INDEX COMPOSITES (exécutez seulement ceux marqués ❌)
-- =====================================================

-- ⚠️ COPIEZ-COLLEZ SEULEMENT LES COMMANDES CI-DESSOUS SI L'INDEX N'EXISTE PAS

-- 1. Index composite pour dashboard abonnements (seulement si marqué ❌ ci-dessus)
-- CREATE INDEX idx_subscriptions_user_status_billing
-- ON subscriptions(user_id, status, billing_frequency);

-- 2. Index composite pour analytics points (seulement si marqué ❌ ci-dessus)
-- CREATE INDEX idx_points_transactions_user_type_date
-- ON points_transactions(user_id, type, created_at DESC);

-- 3. Index composite pour commandes utilisateur (seulement si marqué ❌ ci-dessus)
-- CREATE INDEX idx_orders_user_status_date
-- ON orders(user_id, status, created_at DESC);

-- =====================================================
-- ÉTAPE C: VÉRIFICATION FINALE (exécutez après création)
-- =====================================================

-- Vérifier le résultat final
SELECT
    'RÉSULTAT INDEX COMPOSITES:' as status,
    COUNT(*) as total_composite_crees,
    'Index composites créés avec succès !' as message
FROM pg_indexes
WHERE schemaname = 'public'
AND indexname IN (
    'idx_subscriptions_user_status_billing',
    'idx_points_transactions_user_type_date',
    'idx_orders_user_status_date'
);

-- Détail des index composites créés
SELECT
    indexname as nom_index_composite,
    tablename as table_concernee,
    '✅ CRÉÉ - Optimizé pour requêtes fréquentes' as status
FROM pg_indexes
WHERE schemaname = 'public'
AND indexname IN (
    'idx_subscriptions_user_status_billing',
    'idx_points_transactions_user_type_date',
    'idx_orders_user_status_date'
);
