# Database Setup - Make the CHANGE

## 🚀 Quick Start

### Via Supabase Dashboard (Recommandé)

1. Allez sur [supabase.com/dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet **Make the CHANGE**
3. Allez dans **SQL Editor**
4. Copiez-collez le contenu des migrations dans l'ordre :
   - `001_create_core_tables.sql`
   - `002_create_ecommerce_tables.sql`
   - `003_create_rls_policies.sql` (à venir)

### Via CLI Supabase (Alternative)

```bash
# Installation CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref krnlmdlyymwdrjxbstxe

# Apply migrations
supabase db push
```

## 📊 Schéma de Base de Données

### Tables Créées

#### Core Tables (Migration 001)
- ✅ `users` - Utilisateurs principaux
- ✅ `user_profiles` - Profils étendus
- ✅ `user_sessions` - Sessions d'authentification
- ✅ `producers` - Producteurs et partenaires
- ✅ `projects` - Projets de biodiversité
- ✅ `project_updates` - Mises à jour des projets
- ✅ `producer_metrics` - Métriques de production

#### E-commerce Tables (Migration 002)
- ✅ `categories` - Catégories de produits
- ✅ `products` - Catalogue produits
- ✅ `inventory` - Gestion stock micro-hub
- ✅ `stock_movements` - Mouvements de stock
- ✅ `orders` - Commandes clients
- ✅ `order_items` - Articles de commande
- ✅ `subscriptions` - Abonnements (dual billing)
- ✅ `points_transactions` - Transactions de points
- ✅ `monthly_allocations` - Allocations mensuelles
- ✅ `investments` - Investissements utilisateurs
- ✅ `investment_returns` - Retours d'investissement

### Extensions Requises
- `uuid-ossp` - Génération UUID
- `postgis` - Données géographiques
- `pg_trgm` - Recherche textuelle

### Indexes Optimisés
- Index sur les colonnes fréquemment requêtées
- Index géographiques pour la localisation
- Index partiels pour les statuts actifs

## 🔒 Sécurité

### Row Level Security (RLS)
Les politiques RLS seront appliquées via `003_create_rls_policies.sql` :
- Utilisateurs peuvent voir/modifier leurs propres données
- Admins ont accès complet
- Données publiques (projets, produits) visibles par tous

### Authentification
- Intégration avec `auth.users` de Supabase
- Sessions trackées dans `user_sessions`
- KYC levels pour limitations par montant

## 📈 Performance

### Triggers
- `updated_at` automatiquement mis à jour
- Calculs de solde de points en temps réel
- Validation des contraintes métier

### Vues Matérialisées (À venir)
- Résumés d'abonnements par utilisateur
- Métriques de performance des projets
- Analytics e-commerce

## 🛠️ Maintenance

### Backup
- Point-in-time recovery via Supabase
- Exports réguliers des données critiques

### Monitoring
- Requêtes lentes via `pg_stat_statements`
- Usage des index
- Saturation du pool de connexions
