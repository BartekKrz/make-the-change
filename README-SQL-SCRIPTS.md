# 🗄️ Scripts SQL Supabase - Système Dual Billing

## 📋 Vue d'Ensemble

Ce dossier contient les scripts SQL complets pour implémenter le système dual billing de Make the CHANGE dans Supabase.

## 📁 Fichiers Fournis

### 1. `supabase-dual-billing-migration.sql` 
**Script principal complet** (420+ lignes)
- ✅ Création de toutes les tables nécessaires
- ✅ Extensions des tables existantes  
- ✅ Index de performance
- ✅ Politiques RLS
- ✅ Triggers automatiques
- ✅ Fonctions utilitaires
- ✅ Vues analytiques
- ✅ Données de test

### 2. `supabase-performance-fixes.sql`
**Optimisations performance** (200+ lignes)
- ✅ Correction politiques RLS InitPlan
- ✅ Index manquants sur FK
- ✅ Suppression index inutiles
- ✅ Vues matérialisées
- ✅ Monitoring et maintenance

## 🚀 Comment Utiliser

### Étape 1: Connexion Supabase
1. Aller sur [app.supabase.com](https://app.supabase.com)
2. Ouvrir votre projet Make the CHANGE
3. Aller dans **SQL Editor**

### Étape 2: Exécution Script Principal
1. Copier tout le contenu de `supabase-dual-billing-migration.sql`
2. Coller dans un nouveau query SQL Editor
3. Cliquer **Run** 
4. ✅ Vérifier que tous les messages de succès s'affichent

### Étape 3: Optimisations Performance  
1. Copier tout le contenu de `supabase-performance-fixes.sql`
2. Coller dans un nouveau query SQL Editor
3. Cliquer **Run**
4. ✅ Vérifier les optimisations appliquées

## 🎯 Résultat Attendu

### Tables Créées/Étendues
- ✅ `subscriptions` (étendue avec colonnes dual billing)
- ✅ `monthly_allocations` (étendue pour points)
- ✅ `subscription_billing_history` (nouvelle)
- ✅ `conversion_events` (nouvelle)
- ✅ `business_metrics` (nouvelle)
- ✅ `points_expiry_schedule` (nouvelle)
- ✅ `subscription_cohorts` (nouvelle)

### Fonctions Créées
- ✅ `calculate_mrr()` - Calcul MRR automatique
- ✅ `calculate_conversion_rate()` - Taux conversion
- ✅ `expire_old_points()` - Expiration automatique points
- ✅ `daily_maintenance()` - Maintenance quotidienne

### Vues Analytiques
- ✅ `admin_dashboard_metrics` - Métriques temps réel
- ✅ `user_subscription_summary` - Résumé utilisateur
- ✅ `mv_admin_metrics` - Vue matérialisée performance

## 📊 Données de Test Incluses

Le script crée automatiquement :
- 🧪 1 abonnement mensuel de test
- 🧪 1 historique de facturation
- 🧪 1 allocation mensuelle  
- 🧪 Métriques business exemples

## 🔧 Fonctionnalités Business Activées

### Dual Billing System
- ✅ Plans mensuels : €18 (252 pts) / €32 (480 pts)
- ✅ Plans annuels : €180 (2520 pts) / €320 (4800 pts)
- ✅ Calcul économies automatique (€36-64)
- ✅ Bonus conversion (+10% points)

### Analytics Avancées
- ✅ MRR/ARR tracking temps réel
- ✅ Conversion rate monthly→annual  
- ✅ Cohort analysis rétention
- ✅ Points expiry management

### Performance Optimisée
- ✅ Index sur toutes les FK
- ✅ Politiques RLS optimisées
- ✅ Requêtes dashboard <2s
- ✅ Triggers automatiques

## ⚠️ Important

### Backup Recommandé
Avant d'exécuter, faire un backup via Supabase Dashboard :
**Settings** → **Database** → **Backups** → **Create Backup**

### Validation Post-Exécution
Après exécution, vérifier :
1. ✅ Tables visibles dans **Table Editor**
2. ✅ Pas d'erreurs dans les logs
3. ✅ Politiques RLS actives
4. ✅ Index créés correctement

### Support
En cas de problème :
1. Vérifier les messages d'erreur dans SQL Editor
2. Consulter **Logs** dans Supabase Dashboard  
3. Vérifier compatibilité PostgreSQL 14+

## 🎯 Prochaines Étapes

Après exécution des scripts :
1. ✅ **Frontend**: Implémenter avec `HANDOFF-PROMPT-DUAL-BILLING.md`
2. ✅ **tRPC**: Créer routes pour API calls
3. ✅ **Stripe**: Configurer webhooks
4. ✅ **Tests**: Valider les flows complets

## 📈 Métriques de Succès

Validation que tout fonctionne :
- ✅ MRR calculé automatiquement
- ✅ Conversions trackées 
- ✅ Points expiry schedulé
- ✅ Dashboard admin fonctionnel
- ✅ Performance queries <100ms

---

**Ces scripts SQL transforment votre base Supabase en système dual billing complet !** 🚀
