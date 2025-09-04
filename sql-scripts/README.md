# Scripts SQL pour la Gestion des Catégories

## Vue d'ensemble

Cette collection de scripts SQL configure le système complet de gestion des catégories pour la plateforme Make the CHANGE, basée sur l'analyse approfondie des partenaires **Ilanga Nature** (Madagascar) et **Habeebee** (Belgique).

## Architecture des Données

### Structure Hiérarchique
```
CATÉGORIES PRINCIPALES (4)
├── 🍯 Alimentation (5 sous-catégories)
├── 🧴 Cosmétiques (4 sous-catégories)  
├── 🎁 Coffrets & Cadeaux (3 sous-catégories)
└── 🏺 Artisanat & Accessoires (3 sous-catégories)

TOTAL: 20 catégories (4 principales + 16 sous-catégories)
```

## Scripts à Exécuter - Ordre Recommandé

### 📋 Exécution Étape par Étape

#### 1. Configuration de Base
```bash
# Script 01 - Configuration de la table categories
psql -f 01-setup-categories-table.sql
```
**Durée estimée:** 30 secondes  
**Actions:** Crée/met à jour la table, index, triggers, RLS

#### 2. Catégories Principales  
```bash
# Script 02 - Insertion des 4 catégories principales
psql -f 02-insert-main-categories.sql
```
**Durée estimée:** 10 secondes  
**Actions:** Insère Alimentation, Cosmétiques, Coffrets & Cadeaux, Artisanat

#### 3. Sous-catégories
```bash
# Script 03 - Insertion des 16 sous-catégories
psql -f 03-insert-subcategories.sql
```
**Durée estimée:** 15 secondes  
**Actions:** Insère toutes les sous-catégories avec relations hiérarchiques

#### 4. Mise à Jour Produits
```bash
# Script 04 - Extension de la table products
psql -f 04-update-products-table.sql
```
**Durée estimée:** 45 secondes  
**Actions:** Ajoute colonnes, index, vues et fonctions helper

#### 5. Données d'Exemple (Optionnel)
```bash
# Script 05 - Produits d'exemple pour tests
psql -f 05-sample-products-data.sql
```
**Durée estimée:** 20 secondes  
**Actions:** Insère ~20 produits d'exemple avec assignation automatique

### 🚀 Exécution Complète
```bash
# Exécuter tous les scripts d'un coup
for script in 01-setup-categories-table.sql 02-insert-main-categories.sql 03-insert-subcategories.sql 04-update-products-table.sql 05-sample-products-data.sql; do
    echo "Exécution de $script..."
    psql -f "$script"
    echo "✅ $script terminé"
    echo ""
done
```

## Détail des Scripts

### 01-setup-categories-table.sql
**Objectif:** Configuration complète de la table categories

**Fonctionnalités:**
- ✅ Création table avec structure hiérarchique (parent_id)
- ✅ Champs SEO (seo_title, seo_description)
- ✅ Métadonnées JSONB flexibles
- ✅ Index optimisés pour performance
- ✅ Trigger auto-update pour updated_at
- ✅ Row Level Security (RLS)
- ✅ Gestion des migrations (colonnes manquantes)

### 02-insert-main-categories.sql  
**Objectif:** Insertion des 4 catégories principales

**Catégories créées:**
- 🍯 **Alimentation** - Produits Ilanga Nature
- 🧴 **Cosmétiques** - Produits Habeebee  
- 🎁 **Coffrets & Cadeaux** - Mixte partenaires
- 🏺 **Artisanat & Accessoires** - Principalement Ilanga

### 03-insert-subcategories.sql
**Objectif:** Insertion des 16 sous-catégories organisées

**Organisation:**
```
Alimentation (5)
├── Miels & Produits de la Ruche
├── Confitures & Gelées  
├── Épices & Condiments
├── Vanille & Sucres
└── Huiles & Boissons

Cosmétiques (4)
├── Soins Solides
├── Soins Liquides
├── Soins Concentrés  
└── Soins Spéciaux

Coffrets & Cadeaux (3)
├── Coffrets Découverte
├── Coffrets Premium
└── Coffrets Thématiques

Artisanat & Accessoires (3)
├── Artisanat Traditionnel
├── Accessoires Cosmétiques
└── Ustensiles Cuisine
```

### 04-update-products-table.sql
**Objectif:** Extension de la table products avec catégorisation

**Nouvelles colonnes:**
- `category_id` - Catégorie principale (FK)
- `secondary_category_id` - Catégorie secondaire (FK)  
- `partner_source` - Source partenaire ('ilanga-nature' | 'habeebee' | 'internal')
- `origin_country` - Pays d'origine
- `tags` - Tags JSONB pour flexibilité

**Vues et fonctions créées:**
- `products_with_categories` - Vue enrichie avec infos catégories
- `assign_category_by_keywords()` - Assignation automatique
- `get_category_path()` - Chemin hiérarchique  
- `get_category_stats()` - Statistiques par catégorie

### 05-sample-products-data.sql
**Objectif:** Données d'exemple pour tests et démonstration

**Produits d'exemple:**
- **Ilanga Nature:** 10 produits (miels, confitures, épices, vanille)
- **Habeebee:** 8 produits (savons, shampoings, baumes, sérums)
- **Coffrets:** 2 exemples mixtes

## Vérification Post-Exécution

### Requêtes de Contrôle

```sql
-- 1. Vérifier la structure des catégories
SELECT name, slug, parent_id IS NULL as is_main_category 
FROM categories ORDER BY parent_id NULLS FIRST, sort_order;

-- 2. Statistiques par catégorie
SELECT * FROM get_category_stats();

-- 3. Vérifier les produits avec catégories
SELECT name, category_name, partner_source, origin_country 
FROM products_with_categories 
WHERE category_id IS NOT NULL 
ORDER BY partner_source, category_name;

-- 4. Test de la fonction d'assignation automatique
SELECT assign_category_by_keywords('Miel de Litchis Bio', 'miel bio madagascar litchi');

-- 5. Exemple de chemin hiérarchique
SELECT get_category_path(id) as full_path, name 
FROM categories 
WHERE parent_id IS NOT NULL 
LIMIT 5;
```

### Résultats Attendus

✅ **4 catégories principales** créées  
✅ **16 sous-catégories** avec relations correctes  
✅ **Tous les index** créés pour performance  
✅ **RLS activé** pour sécurité  
✅ **Fonctions helper** opérationnelles  
✅ **~20 produits d'exemple** avec assignation automatique

## Utilisation des Fonctions Helper

### Assignation Automatique de Catégories
```sql
-- Assigner automatiquement une catégorie basée sur le nom du produit
UPDATE products 
SET category_id = assign_category_by_keywords(name, description)
WHERE category_id IS NULL;
```

### Obtenir le Chemin Complet d'une Catégorie
```sql
-- Afficher le chemin hiérarchique complet
SELECT name, get_category_path(id) as chemin_complet
FROM categories 
WHERE parent_id IS NOT NULL;
```

### Statistiques et Rapports
```sql
-- Rapport complet des catégories avec comptage de produits
SELECT 
    category_name,
    product_count,
    CASE WHEN is_parent THEN '📁 Catégorie Principale' ELSE '📄 Sous-catégorie' END as type
FROM get_category_stats()
ORDER BY is_parent DESC, product_count DESC;
```

## Rollback et Nettoyage

### En cas de problème - Scripts de rollback
```sql
-- Supprimer toutes les données créées (ATTENTION - DESTRUCTIF)
DROP VIEW IF EXISTS products_with_categories;
DROP FUNCTION IF EXISTS assign_category_by_keywords(TEXT, TEXT);
DROP FUNCTION IF EXISTS get_category_path(UUID);
DROP FUNCTION IF EXISTS get_category_stats();
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Supprimer les colonnes ajoutées à products (si nécessaire)
ALTER TABLE products DROP COLUMN IF EXISTS category_id;
ALTER TABLE products DROP COLUMN IF EXISTS secondary_category_id;
ALTER TABLE products DROP COLUMN IF EXISTS partner_source;
ALTER TABLE products DROP COLUMN IF EXISTS origin_country;
ALTER TABLE products DROP COLUMN IF EXISTS tags;

-- Supprimer toutes les catégories
TRUNCATE TABLE categories CASCADE;

-- Supprimer la table categories complètement (si nécessaire)
DROP TABLE IF EXISTS categories;
```

## Support et Maintenance

### Requêtes de Maintenance Courantes

```sql
-- Réorganiser l'ordre des catégories
UPDATE categories SET sort_order = 1 WHERE slug = 'alimentation';
UPDATE categories SET sort_order = 2 WHERE slug = 'cosmetiques';

-- Activer/Désactiver une catégorie
UPDATE categories SET is_active = false WHERE slug = 'category-to-disable';

-- Mettre à jour les métadonnées
UPDATE categories 
SET metadata = metadata || '{"featured": true}'::jsonb 
WHERE slug IN ('miels-produits-ruche', 'soins-solides');

-- Compter les produits sans catégorie
SELECT COUNT(*) as produits_sans_categorie 
FROM products 
WHERE category_id IS NULL;
```

## Next Steps - Après Exécution

1. **Tester l'interface admin** avec les nouvelles catégories
2. **Configurer les filtres** dans l'UI basés sur ces catégories  
3. **Importer les vrais produits** des partenaires avec assignation automatique
4. **Optimiser les requêtes** selon les patterns d'usage
5. **Configurer les URLs** SEO-friendly basées sur les slugs

---

**💡 Conseil:** Exécutez d'abord sur un environnement de développement pour valider avant la production !

**📧 Support:** En cas de problème, vérifiez les logs PostgreSQL et les messages NOTICE de chaque script.