-- ===========================
-- PHASE 2: NETTOYAGE TABLE DE BACKUP TEMPORAIRE  
-- ===========================
-- Description: Suppression de products_backup après sauvegarde des données
-- Risque: FAIBLE - Table de backup temporaire avec seulement 5 produits

-- IMPORTANT: Exécuter SEULEMENT après avoir sauvegardé les données importantes

-- 1. Vérification du contenu de la table backup
SELECT 
  'products_backup' as table_name,
  count(*) as row_count,
  min(created_at) as oldest_record,
  max(updated_at) as newest_record
FROM products_backup;

-- 2. Sauvegarde finale (OPTIONNEL - si les données sont importantes)
-- CREATE TABLE products_backup_final AS 
-- SELECT * FROM products_backup;

-- 3. Export manuel recommandé avant suppression:
-- pg_dump --table=products_backup --data-only > products_backup_export.sql

BEGIN;

-- Vérification que les produits existent toujours dans la table principale
SELECT pb.id, pb.name, p.id as exists_in_main
FROM products_backup pb
LEFT JOIN products p ON pb.id = p.id;

-- Si tous les produits existent dans la table principale, procéder à la suppression
DROP TABLE IF EXISTS products_backup CASCADE;

COMMIT;

-- Vérification post-suppression
-- SELECT count(*) as "Table supprimée" 
-- FROM information_schema.tables 
-- WHERE table_name = 'products_backup' AND table_schema = 'public';

-- Espace récupéré estimé: ~16KB