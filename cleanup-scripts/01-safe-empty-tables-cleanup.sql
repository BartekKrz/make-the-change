-- ===========================
-- PHASE 1: NETTOYAGE SÉCURISÉ DES TABLES VIDES
-- ===========================
-- Description: Suppression des tables complètement vides qui n'ont jamais été utilisées
-- Risque: TRÈS FAIBLE - Ces tables sont vides et non utilisées dans le code

-- Vérification avant suppression (optionnel - pour debug)
-- SELECT 'subscription_billing_history' as table_name, count(*) as row_count FROM subscription_billing_history
-- UNION ALL
-- SELECT 'conversion_events', count(*) FROM conversion_events  
-- UNION ALL
-- SELECT 'inventory', count(*) FROM inventory
-- UNION ALL
-- SELECT 'points_expiry_schedule', count(*) FROM points_expiry_schedule
-- UNION ALL
-- SELECT 'subscription_cohorts', count(*) FROM subscription_cohorts
-- UNION ALL
-- SELECT 'producer_metrics', count(*) FROM producer_metrics
-- UNION ALL
-- SELECT 'monthly_allocations', count(*) FROM monthly_allocations
-- UNION ALL
-- SELECT 'user_sessions', count(*) FROM user_sessions
-- UNION ALL
-- SELECT 'investment_returns', count(*) FROM investment_returns
-- UNION ALL
-- SELECT 'stock_movements', count(*) FROM stock_movements;

BEGIN;

-- Suppression des tables complètement vides (0 rows)
-- Ces tables ne sont PAS utilisées dans le code pour les fonctionnalités produits

DROP TABLE IF EXISTS subscription_billing_history CASCADE;  -- 0 rows, 56KB
DROP TABLE IF EXISTS conversion_events CASCADE;             -- 0 rows, 56KB  
DROP TABLE IF EXISTS inventory CASCADE;                     -- 0 rows, 48KB
DROP TABLE IF EXISTS points_expiry_schedule CASCADE;        -- 0 rows, 40KB
DROP TABLE IF EXISTS subscription_cohorts CASCADE;          -- 0 rows, 40KB
DROP TABLE IF EXISTS producer_metrics CASCADE;              -- 0 rows, 40KB
DROP TABLE IF EXISTS monthly_allocations CASCADE;           -- 0 rows, 24KB
DROP TABLE IF EXISTS user_sessions CASCADE;                 -- 0 rows, 24KB
DROP TABLE IF EXISTS investment_returns CASCADE;            -- 0 rows, 16KB
DROP TABLE IF EXISTS stock_movements CASCADE;               -- 0 rows, 16KB

COMMIT;

-- Vérification post-suppression
-- SELECT count(*) as "Tables supprimées" 
-- FROM information_schema.tables 
-- WHERE table_name IN (
--   'subscription_billing_history', 'conversion_events', 'inventory',
--   'points_expiry_schedule', 'subscription_cohorts', 'producer_metrics', 
--   'monthly_allocations', 'user_sessions', 'investment_returns', 'stock_movements'
-- ) AND table_schema = 'public';

-- Espace récupéré estimé: ~300KB + suppression de tous les index associés