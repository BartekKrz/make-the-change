-- =====================================================
-- SAUVEGARDE DES DONNÉES CRITIQUES
-- Projet: Make the Change
-- Date: 2025-09-01
-- =====================================================

-- Cette sauvegarde contient les données importantes avant migration dual billing

-- =====================================================
-- 1. SAUVEGARDE TABLE USERS
-- =====================================================

-- Compter les utilisateurs
SELECT 'Nombre total d''utilisateurs: ' || COUNT(*) as info FROM users;

-- Sauvegarder les données essentielles des utilisateurs
CREATE TEMP TABLE users_backup AS
SELECT
    id,
    email,
    profile,
    points_balance,
    user_level,
    kyc_status,
    kyc_level,
    preferences,
    last_login_at,
    email_verified_at,
    created_at,
    updated_at
FROM users;

-- =====================================================
-- 2. SAUVEGARDE TABLE SUBSCRIPTIONS
-- =====================================================

-- Compter les abonnements
SELECT 'Nombre total d''abonnements: ' || COUNT(*) as info FROM subscriptions;

-- Sauvegarder les données des abonnements
CREATE TEMP TABLE subscriptions_backup AS
SELECT * FROM subscriptions;

-- =====================================================
-- 3. SAUVEGARDE TABLE PRODUCTS
-- =====================================================

-- Compter les produits
SELECT 'Nombre total de produits: ' || COUNT(*) as info FROM products;

-- Sauvegarder les données des produits
CREATE TEMP TABLE products_backup AS
SELECT * FROM products;

-- =====================================================
-- 4. SAUVEGARDE TABLE ORDERS
-- =====================================================

-- Compter les commandes
SELECT 'Nombre total de commandes: ' || COUNT(*) as info FROM orders;

-- Sauvegarder les données des commandes
CREATE TEMP TABLE orders_backup AS
SELECT * FROM orders;

-- =====================================================
-- 5. SAUVEGARDE TABLE POINTS_TRANSACTIONS
-- =====================================================

-- Compter les transactions de points
SELECT 'Nombre total de transactions points: ' || COUNT(*) as info FROM points_transactions;

-- Sauvegarder les données des transactions de points
CREATE TEMP TABLE points_transactions_backup AS
SELECT * FROM points_transactions;

-- =====================================================
-- 6. SAUVEGARDE TABLE MONTHLY_ALLOCATIONS
-- =====================================================

-- Compter les allocations mensuelles
SELECT 'Nombre total d''allocations mensuelles: ' || COUNT(*) as info FROM monthly_allocations;

-- Sauvegarder les données des allocations mensuelles
CREATE TEMP TABLE monthly_allocations_backup AS
SELECT * FROM monthly_allocations;

-- =====================================================
-- 7. SAUVEGARDE TABLE INVESTMENTS
-- =====================================================

-- Compter les investissements
SELECT 'Nombre total d''investissements: ' || COUNT(*) as info FROM investments;

-- Sauvegarder les données des investissements
CREATE TEMP TABLE investments_backup AS
SELECT * FROM investments;

-- =====================================================
-- 8. RÉSUMÉ DE LA SAUVEGARDE
-- =====================================================

SELECT 'SAUVEGARDE TERMINÉE AVEC SUCCÈS - ' || NOW() as status;

-- Afficher le résumé
SELECT
    'Utilisateurs' as table_name, COUNT(*) as record_count FROM users_backup
UNION ALL
SELECT 'Abonnements', COUNT(*) FROM subscriptions_backup
UNION ALL
SELECT 'Produits', COUNT(*) FROM products_backup
UNION ALL
SELECT 'Commandes', COUNT(*) FROM orders_backup
UNION ALL
SELECT 'Transactions Points', COUNT(*) FROM points_transactions_backup
UNION ALL
SELECT 'Allocations Mensuelles', COUNT(*) FROM monthly_allocations_backup
UNION ALL
SELECT 'Investissements', COUNT(*) FROM investments_backup
ORDER BY table_name;
