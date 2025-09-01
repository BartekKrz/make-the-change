# 🚀 Guide de Migration - Système Dual Billing
## Make the Change - Système d'Abonnements Innovant

*Date: 2025-09-01*
*Dossier: `/backups/20250901_195352/`*

---

## 📋 Vue d'Ensemble

Une **sauvegarde complète** des données a été créée et un **script de migration corrigé** est prêt à être exécuté.

### ✅ Ce qui a été préparé :
- **Sauvegarde des données** critiques avant migration
- **Script de migration corrigé** compatible avec Supabase
- **Scripts d'exécution** automatisés
- **Guide complet** d'utilisation

### 🔧 Problèmes corrigés :
- ✅ Références à la colonne `role` inexistante supprimées
- ✅ Gestion des types ENUM améliorée
- ✅ Politiques RLS corrigées
- ✅ Vérifications d'existence des colonnes
- ✅ Gestion d'erreurs améliorée

---

## 🎯 Méthodes d'Exécution

### **Méthode 1 : Recommandée - Via Supabase Dashboard**

#### Étape 1 : Accéder au SQL Editor
1. Allez sur votre projet Supabase :
   ```
   https://ebmjxinsyyjwshnynwwu.supabase.co
   ```
2. Cliquez sur **"SQL Editor"** dans le menu latéral
3. Cliquez sur **"New Query"**

#### Étape 2 : Exécuter la migration
1. Ouvrez le fichier `migration_script.sql` dans ce dossier
2. **Copiez tout le contenu** (871 lignes)
3. **Collez-le** dans le SQL Editor
4. Cliquez sur **"Run"**

#### Étape 3 : Vérification
```sql
-- Vérifiez que les nouvelles tables existent
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('subscription_billing_history', 'conversion_events', 'business_metrics');

-- Testez les nouvelles fonctions
SELECT calculate_mrr();
SELECT calculate_conversion_rate();
```

---

### **Méthode 2 : Via Script Automatique**

#### Prérequis :
```bash
# Installer Supabase CLI si nécessaire
npm install supabase --save-dev

# Se connecter à votre projet
npx supabase login
npx supabase link --project-ref ebmjxinsyyjwshnynwwu
```

#### Exécution :
```bash
cd /Users/bartoszkrynski/Documents/maison/make-the-change/backups/20250901_195352
./run_simple_migration.sh
```

---

### **Méthode 3 : Exécution Étape par Étape**

Si vous préférez contrôler chaque étape :

```bash
cd /Users/bartoszkrynski/Documents/maison/make-the-change/backups/20250901_195352

# Étape 1 : Types ENUM
supabase db push --file step1_types.sql

# Étape 2 : Extension des tables
supabase db push --file step2_extend_tables.sql

# Étape 3 : Nouvelles tables
supabase db push --file step3_new_tables.sql

# Étape 4 : Index
supabase db push --file step4_indexes.sql

# Étape 5 : Tout le reste
supabase db push --file step5_remaining.sql
```

---

## 📁 Structure des Fichiers

```
backups/20250901_195352/
├── 📄 migration_script.sql          # Script complet corrigé (871 lignes)
├── 📄 run_simple_migration.sh       # Script d'exécution automatique
├── 📄 run_migration.sh              # Script détaillé (optionnel)
├── 📄 backup_data.sql               # Script de sauvegarde des données
├── 📄 step1_types.sql               # Types ENUM
├── 📄 step2_extend_tables.sql       # Extension des tables existantes
├── 📄 step3_new_tables.sql          # Nouvelles tables
├── 📄 step4_indexes.sql             # Index de performance
├── 📄 step5_remaining.sql           # Fonctions, triggers, vues
├── 📄 backup_log.txt                # Log de la sauvegarde
└── 📄 MIGRATION_GUIDE.md            # Ce guide
```

---

## 🔍 Nouvelles Fonctionnalités Installées

### **Tables Étendues :**
- `subscriptions` : Colonnes dual billing ajoutées
- `monthly_allocations` : Système de points avancé

### **Nouvelles Tables :**
- `subscription_billing_history` - Historique de facturation pour MRR
- `conversion_events` - Analytics des conversions mensuel ↔ annuel
- `business_metrics` - KPIs temps réel pour dashboard
- `points_expiry_schedule` - Notifications d'expiration des points
- `subscription_cohorts` - Analyse de cohortes avancée

### **Nouveaux Types ENUM :**
- `subscription_plan_type` - Plans d'abonnement
- `billing_frequency` - Mensuel/Annuel
- `subscription_status_type` - Statuts d'abonnement
- `conversion_event_type` - Types d'événements de conversion

### **Fonctions Utilitaires :**
- `calculate_mrr()` - Calcul du Monthly Recurring Revenue
- `calculate_conversion_rate()` - Taux de conversion mensuel→annuel

### **Vues Analytiques :**
- `admin_dashboard_metrics` - Métriques temps réel pour admin
- `user_subscription_summary` - Résumé par utilisateur
- `points_expiry_with_days` - Points avec calcul des jours restants
- `points_expiring_soon` - Points expirant dans 30 jours

---

## ⚠️ Points d'Attention

### **Avant l'Exécution :**
1. **Sauvegarde** : Les données ont déjà été sauvegardées
2. **Environnement** : Testez d'abord sur un environnement de développement
3. **Permissions** : Assurez-vous d'avoir les droits nécessaires

### **Pendant l'Exécution :**
- L'exécution peut prendre **plusieurs minutes**
- Ne fermez pas la fenêtre pendant l'exécution
- En cas d'erreur, notez le message complet

### **Après l'Exécution :**
- Vérifiez les nouvelles tables dans le **Database Explorer**
- Testez les fonctions dans le **SQL Editor**
- Vérifiez les politiques RLS

---

## 🔧 Dépannage

### **Erreur "relation already exists"**
```sql
-- Solution : Les objets existent déjà, c'est normal
-- Le script utilise "IF NOT EXISTS" pour éviter les conflits
```

### **Erreur "permission denied"**
```sql
-- Solution : Vérifiez vos permissions Supabase
-- Utilisez le SQL Editor depuis le dashboard
```

### **Erreur "column does not exist"**
```sql
-- Solution : La structure des tables peut différer
-- Vérifiez la structure actuelle dans Database Explorer
```

### **Timeout de la requête**
```sql
-- Solution : Exécutez en plusieurs parties
-- Utilisez les fichiers step1.sql, step2.sql, etc.
```

---

## 📊 Vérifications Post-Migration

### **Vérifier les Types ENUM :**
```sql
SELECT n.nspname AS schema_name,
       t.typname AS type_name,
       string_agg(e.enumlabel, ', ') AS enum_values
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
JOIN pg_namespace n ON t.typnamespace = n.oid
WHERE t.typname IN ('subscription_plan_type', 'billing_frequency', 'subscription_status_type', 'conversion_event_type')
GROUP BY n.nspname, t.typname;
```

### **Vérifier les Nouvelles Tables :**
```sql
SELECT schemaname, tablename, tableowner
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('subscription_billing_history', 'conversion_events', 'business_metrics', 'points_expiry_schedule', 'subscription_cohorts');
```

### **Vérifier les Colonnes Ajoutées :**
```sql
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'subscriptions'
AND column_name IN ('plan_type', 'billing_frequency', 'monthly_price', 'annual_price')
ORDER BY table_name, ordinal_position;
```

### **Tester les Fonctions :**
```sql
-- Tester calculate_mrr
SELECT calculate_mrr() as current_mrr;

-- Tester calculate_conversion_rate
SELECT calculate_conversion_rate() as conversion_rate;

-- Tester les vues
SELECT * FROM admin_dashboard_metrics LIMIT 1;
```

---

## 🎉 Félicitations !

Une fois la migration terminée, votre système dual billing sera opérationnel avec :

- ✅ **Abonnements mensuels et annuels** avec économies automatiques
- ✅ **Système de points avancé** avec expiration intelligente
- ✅ **Analytics temps réel** pour le suivi des performances
- ✅ **Cohortes et conversions** pour l'analyse marketing
- ✅ **Notifications automatiques** d'expiration des points

Le système est maintenant prêt à accueillir vos premiers abonnements ! 🚀
