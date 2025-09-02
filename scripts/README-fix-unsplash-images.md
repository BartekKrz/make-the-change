# 🔧 Fix Unsplash Images - Guide d'utilisation

## Contexte du problème

Certaines URLs d'images Unsplash dans la table `products` retournent des erreurs 404 car :
- Les images ont été supprimées de Unsplash
- Les URLs ont changé
- Le paramètre `?w=400` peut poser des problèmes

## 📋 URLs à corriger

| Produit | URL Problématique | Nouvelle URL | Type |
|---------|-------------------|--------------|------|
| Olives Kalamata | `photo-1605635669924-7e18d69b1fe8` | `photo-1546069901-ba9599a7e63c` | Burger/Food |
| Huile d'Olive | `photo-1474979266404-7e18d69b1fe8` | `photo-1555939594-58d7cb561ad1` | Plat cuisine |
| Miel Lavande | `photo-1558642891-b77887b1ef67` | `photo-1567620905732-2d1ec7ab7445` | Nourriture |
| Pack Miel | `photo-1587049352851-8d4e89133924` | `photo-1484723091739-30a097e8f929` | Légumes |
| Propolis | `photo-1571115018088-24c8a48dfe37` | `photo-1498837167922-ddd27525d352` | Salade |

## 🚀 Instructions d'exécution

### ⚠️ Prérequis
```sql
-- 1. FAIRE UN BACKUP de la table products
CREATE TABLE products_backup AS SELECT * FROM products;

-- 2. Vérifier le nombre de produits affectés
SELECT COUNT(*) as affected_products
FROM products
WHERE images::text LIKE '%photo-1605635669924-7e18d69b1fe8%'
   OR images::text LIKE '%photo-1474979266404-7e18d69b1fe8%'
   OR images::text LIKE '%photo-1558642891-b77887b1ef67%'
   OR images::text LIKE '%photo-1587049352851-8d4e89133924%'
   OR images::text LIKE '%photo-1571115018088-24c8a48dfe37%';
```

### 📝 Procédure étape par étape

#### Étape 1 : Identification
```sql
-- Copier et exécuter la section 1 du script
-- Cela montre tous les produits affectés
```

#### Étape 2 : Corrections individuelles
```sql
-- Exécuter chaque UPDATE individuellement :
-- 2.1 pour Olives Kalamata
-- 2.2 pour Huile d'Olive
-- 2.3 pour Miel Lavande
-- 2.4 pour Pack Miel
-- 2.5 pour Propolis
```

#### Étape 3 : Vérifications
```sql
-- Après chaque UPDATE, exécuter la requête de vérification correspondante
-- Exemple pour les olives :
SELECT id, name, images
FROM products
WHERE name LIKE '%Kalamata%'
   OR images::text LIKE '%photo-1546069901-ba9599a7e63c%';
```

#### Étape 4 : Vérification finale
```sql
-- Section 3 : Vérifications finales
-- Doit retourner 0 résultats pour les URLs problématiques
```

## 🔍 Détail technique

### Syntaxe JSONB utilisée

```sql
-- Pour remplacer un élément dans un array JSONB :
UPDATE products
SET images = (
    SELECT jsonb_agg(
        CASE
            WHEN value::text LIKE '%ancienne-url%'
            THEN '"nouvelle-url"'::jsonb
            ELSE value
        END
    )
    FROM jsonb_array_elements(images) as value
)
WHERE images::text LIKE '%ancienne-url%';
```

### Fonctions PostgreSQL utilisées
- `jsonb_array_elements(images)` : Extrait chaque élément de l'array
- `jsonb_agg()` : Regroupe les éléments en array JSONB
- `::text` : Conversion pour les comparaisons LIKE

## 📊 Résultats attendus

Après exécution complète :

### ✅ Avant migration
```sql
-- Nombre de produits affectés : ~5
-- URLs retournant 404 : 5
```

### ✅ Après migration
```sql
-- Produits affectés : 0
-- Toutes les URLs fonctionnelles : ✅
-- Structure JSONB préservée : ✅
```

## 🔄 Rollback si nécessaire

```sql
-- Restaurer depuis le backup
DROP TABLE products;
ALTER TABLE products_backup RENAME TO products;

-- Recréer les index et contraintes si nécessaire
-- (Vérifier la structure originale)
```

## 🧪 Tests recommandés

### 1. Test des URLs
```javascript
// Tester chaque nouvelle URL dans le navigateur
const urls = [
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400',
  'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400',
  'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400'
];
```

### 2. Test dans l'application
- Vérifier l'affichage des images dans les pages produits
- Tester le chargement des images dans la liste des produits
- Vérifier les miniatures/thumbnails

### 3. Test des performances
- Vérifier le temps de chargement des images
- Tester avec différentes tailles d'écran
- Vérifier la compression et l'optimisation

## 📞 Support

Si vous rencontrez des problèmes :

1. **Vérifiez les logs** de Supabase pour les erreurs SQL
2. **Testez les URLs** individuellement dans votre navigateur
3. **Vérifiez la syntaxe JSONB** si vous modifiez les requêtes
4. **Contactez l'équipe** si les nouvelles URLs ne fonctionnent pas

---

## 🎯 Checklist de validation

- [ ] Backup de la table `products` effectué
- [ ] Script exécuté dans Supabase SQL Editor
- [ ] Chaque UPDATE testé individuellement
- [ ] Vérifications intermédiaires effectuées
- [ ] Vérification finale : 0 URLs problématiques restantes
- [ ] Test dans l'application frontend
- [ ] Images s'affichent correctement
- [ ] Performance satisfaisante

**✅ Migration réussie !**
