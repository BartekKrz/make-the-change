# 🔒 Guide de Test des Politiques RLS - Make the CHANGE

## 📋 Vue d'Ensemble

Les politiques RLS (Row Level Security) garantissent que :
- Les utilisateurs ne voient que leurs propres données
- Le contenu public est accessible à tous
- Les admins ont un accès complet
- Les restrictions KYC sont appliquées

## 🧪 Tests à Effectuer

### 1. **Test des Politiques Utilisateur**

#### Via SQL Editor (avec JWT utilisateur)
```sql
-- Simuler un utilisateur connecté
SELECT auth.uid(); -- Doit retourner l'ID utilisateur

-- Test: Voir ses propres données
SELECT * FROM users WHERE id = auth.uid();
SELECT * FROM user_profiles WHERE user_id = auth.uid();
SELECT * FROM points_transactions WHERE user_id = auth.uid();

-- Test: Ne PAS voir les données d'autres utilisateurs
SELECT * FROM users; -- Doit retourner seulement l'utilisateur actuel
```

### 2. **Test des Politiques Publiques**

#### Sans authentification
```sql
-- Test: Voir le contenu public
SELECT * FROM projects WHERE status IN ('active', 'funded');
SELECT * FROM products WHERE is_active = true;
SELECT * FROM categories WHERE is_active = true;
SELECT * FROM producers WHERE status = 'active';

-- Test: Ne PAS voir le contenu privé
SELECT * FROM projects WHERE status = 'draft'; -- Doit être vide
SELECT * FROM project_updates WHERE published_at IS NULL; -- Doit être vide
```

### 3. **Test des Restrictions KYC**

#### Avec utilisateur niveau 1 (Protecteur)
```sql
-- Test: Investissement autorisé (≤ 100€)
INSERT INTO investments (user_id, project_id, amount_points, amount_eur_equivalent)
VALUES (auth.uid(), 'project-uuid', 5000, 50.00); -- Doit réussir

-- Test: Investissement refusé (> 100€)
INSERT INTO investments (user_id, project_id, amount_points, amount_eur_equivalent)
VALUES (auth.uid(), 'project-uuid', 15000, 150.00); -- Doit échouer
```

### 4. **Test des Politiques Admin**

#### Avec service role
```sql
-- Test: Accès complet aux données
SELECT * FROM users; -- Doit retourner tous les utilisateurs
SELECT * FROM orders; -- Doit retourner toutes les commandes
SELECT * FROM inventory; -- Doit retourner tout l'inventaire
```

## 🔍 Commandes de Vérification

### Vérifier que RLS est activé
```sql
SELECT 
    schemaname, 
    tablename, 
    rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
    AND rowsecurity = true;
```

### Lister toutes les politiques RLS
```sql
SELECT 
    schemaname,
    tablename, 
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### Vérifier les fonctions utilitaires
```sql
-- Test des fonctions RLS
SELECT auth.is_admin();
SELECT auth.has_kyc_level(1);
SELECT auth.has_kyc_level(2);
```

## 🚨 Tests de Sécurité Critiques

### 1. **Isolation des Données Utilisateur**
```sql
-- Créer 2 utilisateurs de test
-- User A ne doit PAS voir les données de User B
```

### 2. **Bypass Attempts**
```sql
-- Tenter d'accéder aux données via des jointures
SELECT u.* FROM users u 
JOIN user_profiles p ON u.id = p.user_id;
-- Doit respecter les politiques RLS
```

### 3. **Élévation de Privilèges**
```sql
-- Tenter de modifier le rôle via SQL
UPDATE auth.users SET raw_user_meta_data = '{"role": "admin"}';
-- Doit échouer ou ne pas affecter les politiques
```

## 📊 Résultats Attendus

### ✅ **Succès**
- Utilisateurs voient uniquement leurs données
- Contenu public accessible sans auth
- Admins accèdent à tout
- Restrictions KYC appliquées
- Pas de fuite de données

### ❌ **Échecs à Investiguer**
- Données d'autres utilisateurs visibles
- Contenu privé accessible publiquement
- Restrictions KYC contournables
- Erreurs de politique mal configurées

## 🛠️ Debugging

### Logs de Politique
```sql
-- Activer les logs RLS (développement seulement)
SET log_statement = 'all';
SET log_min_messages = 'debug1';
```

### Test avec Différents Contextes
```sql
-- Tester avec différents auth.uid()
SET request.jwt.claim.sub = 'user-id-1';
SET request.jwt.claim.sub = 'user-id-2';
```

## 🔧 Correction des Problèmes

### Si RLS ne fonctionne pas :
1. Vérifier que RLS est activé : `ALTER TABLE table ENABLE ROW LEVEL SECURITY;`
2. Vérifier les politiques : `\dp table_name` dans psql
3. Tester les fonctions utilitaires : `SELECT auth.uid();`
4. Vérifier les rôles JWT : `SELECT auth.role();`

### Si les politiques sont trop restrictives :
1. Ajouter des politiques pour les cas manqués
2. Vérifier les conditions WITH CHECK
3. Tester avec différents niveaux d'utilisateur

## 🎯 Checklist Final

- [ ] RLS activé sur toutes les tables sensibles
- [ ] Politiques utilisateur testées (isolation)
- [ ] Politiques publiques testées (accessibilité)
- [ ] Politiques admin testées (accès complet)
- [ ] Restrictions KYC testées (limites)
- [ ] Pas de fuite de données détectée
- [ ] Performance acceptable avec RLS
- [ ] Logs de sécurité configurés
