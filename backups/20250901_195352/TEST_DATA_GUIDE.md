# 🧪 **GUIDE CRÉATION DONNÉES DE TEST**

## **🎯 Script Prêt : `test_subscriptions_data.sql`**

### **📊 Ce que le script va créer :**

#### **4 Abonnements de Test Variés :**

| **#** | **Type** | **Fréquence** | **Statut** | **Prix** | **Utilisateur** |
|-------|----------|---------------|------------|----------|-----------------|
| **1** | Standard | Mensuel | ✅ **Actif** | €18/mois | User 1 |
| **2** | Premium | Annuel | ✅ **Actif** | €320/an | User 2 |
| **3** | Standard | Mensuel | ⚠️ **Past Due** | €18/mois | User 3 |
| **4** | Premium | Mensuel | ❌ **Annulé** | €32/mois | User 4 |
| **5** | Premium | Mensuel | 💳 **Unpaid** | €32/mois | User 1 |

#### **🔒 Statuts Valides (Contrainte PostgreSQL)**
- ✅ `active` - Abonnement actif et payé
- ⚠️ `past_due` - En retard de paiement
- ❌ `cancelled` - Annulé par l'utilisateur
- 💳 `unpaid` - Non payé (remplace suspended)

### **💰 Répartition des Prix :**
- **€18** - Standard mensuel (100 points/mois)
- **€32** - Premium mensuel (200 points/mois)
- **€180** - Standard annuel (300 points/an)
- **€320** - Premium annuel (500 points/an)

---

## 🛠️ **COMMENT EXÉCUTER**

### **Étape 1 : Ouvrir Supabase SQL Editor**
1. Aller sur https://supabase.com/dashboard
2. Sélectionner votre projet
3. Aller dans **"SQL Editor"**

### **Étape 2 : Copier le Script**
```bash
# Copier TOUT le contenu de test_subscriptions_data.sql
# Le script fait tout automatiquement !
```

### **Étape 3 : Exécuter**
```sql
-- Cliquer sur "Run" ou "Execute"
-- Le script va :
✅ Récupérer les user_id existants
✅ Créer 5 abonnements variés
✅ Afficher les vérifications
✅ Calculer les statistiques
```

---

## 📈 **RÉSULTATS ATTENDUS**

### **Après exécution réussie :**

#### **1. Abonnements Créés**
```sql
-- Vous verrez :
🎯 ABONNEMENTS CRÉÉS: 5 | Abonnements de test créés avec succès
```

#### **2. Détail des Abonnements**
```sql
📊 DÉTAIL DES ABONNEMENTS:
- user1@test.com | monthly_standard | monthly | active | €18
- user2@test.com | annual_premium | annual | active | €320
- user3@test.com | monthly_standard | monthly | suspended | €18
- user4@test.com | monthly_premium | monthly | cancelled | €32
- user1@test.com | annual_standard | annual | past_due | €180
```

#### **3. Statistiques Business**
```sql
💰 STATISTIQUES PAR FRÉQUENCE:
- monthly: 3 abonnements | €67 total | €22.33 moyenne
- annual: 2 abonnements | €500 total | €250 moyenne

💵 CALCUL MRR: €78.33/mois | 800 points/mois
```

---

## 🎯 **DONNÉES VARIÉES POUR LE DÉVELOPPEMENT**

### **✅ États à Tester :**
- **Active** → Affichage normal, calculs MRR ✅
- **Past Due** → Alertes, relances de paiement ⚠️
- **Cancelled** → Historique, pas dans MRR ❌
- **Unpaid** → Tentatives de paiement, blocage 💳

### **✅ Types de Plans :**
- **Monthly Standard** → €18/mois, 100 points
- **Monthly Premium** → €32/mois, 200 points
- **Annual Standard** → €180/an, 300 points/an
- **Annual Premium** → €320/an, 500 points/an

### **✅ Fréquences :**
- **Monthly** → Facturation mensuelle
- **Annual** → Facturation annuelle, économies

---

## 🔍 **UTILISATIONS POUR LE DÉVELOPPEMENT**

### **1. Déboguer tRPC**
```typescript
// Maintenant vous avez des vraies données !
const subscriptions = await api.subscriptions.list.query()
// Retournera 5 abonnements variés
```

### **2. Tester les Filtres**
```sql
-- Filtres par statut
SELECT * FROM subscriptions WHERE status = 'active';     -- 2 résultats
SELECT * FROM subscriptions WHERE status = 'past_due';   -- 1 résultat
SELECT * FROM subscriptions WHERE status = 'cancelled';  -- 1 résultat
SELECT * FROM subscriptions WHERE status = 'unpaid';     -- 1 résultat

-- Filtres par fréquence
SELECT * FROM subscriptions WHERE billing_frequency = 'monthly'; -- 3 résultats
SELECT * FROM subscriptions WHERE billing_frequency = 'annual';   -- 1 résultat
```

### **3. Tester les Actions**
```typescript
// Suspendre un abonnement
await api.subscriptions.suspend.mutate({ id: suspendedSubscriptionId })

// Réactiver un abonnement
await api.subscriptions.reactivate.mutate({ id: suspendedSubscriptionId })

// Annuler un abonnement
await api.subscriptions.cancel.mutate({ id: activeSubscriptionId })
```

### **4. Calculs Business**
```sql
-- MRR (Monthly Recurring Revenue)
SELECT SUM(
  CASE
    WHEN billing_frequency = 'monthly' THEN monthly_price_eur
    WHEN billing_frequency = 'annual' THEN monthly_price_eur / 12
  END
) as mrr FROM subscriptions WHERE status = 'active';
-- Résultat: ~€78/mois
```

---

## 📋 **COMMANDES UTILES APRÈS CRÉATION**

### **Voir tous les abonnements :**
```sql
SELECT s.*, u.email
FROM subscriptions s
JOIN users u ON s.user_id = u.id
ORDER BY s.created_at DESC;
```

### **Calculs business :**
```sql
-- Revenus par statut
SELECT status, COUNT(*), SUM(monthly_price_eur) as revenue
FROM subscriptions
GROUP BY status;

-- Points alloués par mois
SELECT SUM(monthly_points_allocation) as total_points
FROM subscriptions
WHERE status = 'active';
```

### **Nettoyer si besoin :**
```sql
-- Supprimer tous les abonnements de test
DELETE FROM subscriptions
WHERE metadata->>'test' = 'true';

-- Ou supprimer seulement certains
DELETE FROM subscriptions
WHERE status = 'suspended' AND metadata->>'test' = 'true';
```

---

## 🎉 **APRÈS CRÉATION DES DONNÉES**

**Vous pourrez immédiatement :**

✅ **Débugger l'erreur tRPC** avec des vraies données
✅ **Voir l'interface** avec 5 abonnements variés
✅ **Tester tous les filtres** (actif, suspendu, annulé)
✅ **Développer les actions** (suspendre, réactiver, annuler)
✅ **Calculer les métriques** business (MRR, points)
✅ **Tester les conversions** mensuel ↔ annuel

---

## 🚨 **POINTS IMPORTANTS**

### **⚠️ Données de Test**
- Toutes marquées avec `metadata.test = true`
- Faciles à identifier et supprimer si besoin
- N'interfèrent pas avec les vraies données

### **🔄 RLS et Permissions**
- Le script respecte les politiques RLS
- Les données sont créées avec les bonnes permissions
- Fonctionne avec l'utilisateur actuel

### **📊 Variété des Cas**
- Tous les statuts représentés
- Tous les types de plans
- Mélange mensuel/annuel
- Différentes dates pour tester les calculs

---

**🎯 Prêt à créer les données de test ?**

**Exécutez `test_subscriptions_data.sql` dans Supabase SQL Editor !** 🚀

Une fois fait, vous aurez **5 abonnements variés** pour débugger et développer efficacement ! 🎉
