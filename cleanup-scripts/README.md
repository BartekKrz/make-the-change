# 🧹 Scripts de Nettoyage Base de Données Supabase

## 📊 Vue d'Ensemble

Ces scripts permettent de nettoyer votre base de données Supabase en supprimant les tables vides, fonctions obsolètes, index inutilisés et données orphelines, tout en **préservant intégralement les fonctionnalités produits**.

**Gain estimé :** ~1.5MB d'espace + amélioration significative des performances

---

## 🔒 Sécurité & Pré-requis

### ⚠️ IMPORTANT - À LIRE AVANT EXÉCUTION

1. **Backup complet** obligatoire avant toute opération
2. **Tester en développement** avant la production  
3. **Exécuter les phases dans l'ordre** (1 → 6)
4. **Vérifier chaque SELECT** avant les DELETE/DROP

### 🎯 Analyse Focalisée sur les Produits

Cette analyse s'est concentrée sur les fonctionnalités des **pages produits** (liste + détail), garantissant que tout le nécessaire pour ces features soit préservé.

---

## 📋 Ordre d'Exécution

### **Phase 1 : Tables Vides** ✅ TRÈS SÛRE
```bash
# Risque: TRÈS FAIBLE
# Gain: ~300KB + suppression index associés
```
- **Script :** `01-safe-empty-tables-cleanup.sql`
- **Action :** Supprime 10 tables complètement vides (0 rows)
- **Impact :** Aucun sur les fonctionnalités

### **Phase 2 : Table Backup** ⚠️ ATTENTION
```bash  
# Risque: FAIBLE (après sauvegarde)
# Gain: ~16KB
```
- **Script :** `02-backup-table-cleanup.sql`  
- **Action :** Supprime `products_backup` après sauvegarde
- **Pré-requis :** Exporter les 5 produits de backup

### **Phase 3 : Fonctions Obsolètes** ✅ SÛRE
```bash
# Risque: FAIBLE  
# Gain: Nettoyage namespace + performance
```
- **Script :** `03-unused-functions-cleanup.sql`
- **Action :** Supprime 15+ fonctions non utilisées
- **Conserve :** Toutes les fonctions utilisées par les produits

### **Phase 4 : Views Non Utilisées** ⚠️ OPTIONNELLE
```bash
# Risque: MOYEN
# Gain: Nettoyage views système
```
- **Script :** `04-unused-views-cleanup.sql`  
- **Action :** Supprime views potentiellement inutiles
- **Status :** Commentées par sécurité

### **Phase 5 : Index Inutilisés** ⚠️ ATTENTION
```bash
# Risque: MOYEN
# Gain: ~800KB-1.2MB
```
- **Script :** `05-unused-indexes-cleanup.sql`
- **Action :** Supprime 75+ index jamais utilisés
- **Pré-requis :** Tester les performances

### **Phase 6 : Données Orphelines** ⚠️ ÉLEVÉ
```bash
# Risque: MOYEN à ÉLEVÉ
# Gain: Cohérence données
```
- **Script :** `06-orphaned-data-cleanup.sql`
- **Action :** Nettoie images invalides et relations cassées
- **Pré-requis :** Vérification manuelle obligatoire

---

## 🛡️ Tables & Fonctions Préservées

### ✅ **Tables Critiques Conservées**
- `products` - Table principale
- `categories` - Catégories produits
- `producers` - Partenaires (HABEEBEE, ILANGA, PROMIEL)
- `image_blur_hashes` - Système blur hash
- `products_with_blur_hashes` - View enrichie
- `products_cover_blur` - View couvertures  
- `products_missing_blur` - View maintenance
- `blur_system_stats` - Métriques système

### ✅ **Fonctions Critiques Conservées**  
- `get_image_blur_hash()` - Récupération blur hash
- `upsert_image_blur_hash_v2()` - Insertion/maj blur hash
- `generate_blurhash_for_image()` - Génération DB
- `calculate_mrr()` - Métriques business (44.67€)
- `expire_old_points()` - Maintenance points
- Toutes les fonctions **PostGIS** (ST_*) - Géolocalisation

---

## 🚀 Guide d'Exécution

### 1. Préparation

```bash
# Backup complet
pg_dump --clean --no-owner --host=db.xxx.supabase.co --username=postgres your_db > backup_pre_cleanup.sql
```

```sql
-- ÉTAPE OBLIGATOIRE: Exécuter d'abord la vérification complète
-- Dans Supabase SQL Editor: 
-- Copier/coller le contenu de 00-verification-pre-cleanup.sql
```

### 2. Exécution Phase par Phase

#### Phase 1 (SÛRE)
```bash
# Dans Supabase SQL Editor
-- Copier/coller le contenu de 01-safe-empty-tables-cleanup.sql
```

#### Phase 2 (Après sauvegarde)
```bash  
# Sauvegarder d'abord products_backup
-- Puis exécuter 02-backup-table-cleanup.sql
```

#### Phase 3-6 (Une par une)
```bash
# Exécuter chaque script individuellement
# Vérifier les performances après chaque phase
```

### 3. Vérification Post-Nettoyage
```sql
-- Vérifier que les pages produits fonctionnent
-- Tester la liste produits
-- Tester le détail produit
-- Vérifier les blur hashes
-- Contrôler les performances
```

---

## 📊 Impact Attendu

### Espace Récupéré
- **Tables vides :** 300KB
- **Index inutilisés :** 800KB-1.2MB  
- **Backup temporaire :** 16KB
- **Total estimé :** ~1.5MB

### Performance
- ✅ Queries plus rapides (moins d'index à considérer)
- ✅ Cache PostgreSQL optimisé
- ✅ Stats système plus précises
- ✅ Namespace plus propre

### Maintenance
- ✅ Backup/restore plus rapides
- ✅ Monitoring simplifié  
- ✅ Moins de confusion sur les tables

---

## 🆘 Rollback & Support

### En cas de problème
1. **Restaurer depuis backup**
2. **Identifier la phase problématique**  
3. **Ré-exécuter seulement les phases antérieures**

### Support
- Les scripts incluent des commandes de vérification
- Chaque phase est documentée avec les risques
- Les tables critiques sont identifiées et préservées

---

## ✅ Checklist Finale

- [ ] Backup complet effectué
- [ ] Tests sur environnement de développement
- [ ] Phase 1 exécutée et vérifiée
- [ ] Phase 2 exécutée avec sauvegarde préalable
- [ ] Phase 3 exécutée et fonctions vérifiées
- [ ] Phases 4-6 exécutées avec précaution
- [ ] Pages produits testées et fonctionnelles
- [ ] Performances vérifiées et améliorées

**🎉 Félicitations ! Votre base de données est maintenant optimisée.**