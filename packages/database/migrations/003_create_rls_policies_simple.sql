-- Migration 003 (Simplifiée): Row Level Security Policies - Make the CHANGE
-- Version sans fonctions personnalisées pour éviter les erreurs de permissions
-- À appliquer en premier, puis 003_create_rls_policies.sql pour les fonctions avancées

-- =============================================
-- ACTIVATION RLS SUR LES TABLES SENSIBLES
-- =============================================

-- Tables utilisateurs (accès personnel seulement)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Tables transactionnelles (accès personnel seulement)
ALTER TABLE points_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_returns ENABLE ROW LEVEL SECURITY;

-- Tables de contenu (lecture publique, écriture admin)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE producers ENABLE ROW LEVEL SECURITY;
ALTER TABLE producer_metrics ENABLE ROW LEVEL SECURITY;

-- Tables de gestion (admin seulement)
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;

-- =============================================
-- POLITIQUES POUR LES TABLES UTILISATEURS
-- =============================================

-- USERS: Utilisateurs peuvent voir/modifier leurs propres données
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Service role can access all users" ON users
    FOR ALL USING (auth.role() = 'service_role');

-- USER_PROFILES: Utilisateurs peuvent voir/modifier leur propre profil
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can access all profiles" ON user_profiles
    FOR ALL USING (auth.role() = 'service_role');

-- USER_SESSIONS: Utilisateurs peuvent voir leurs propres sessions
CREATE POLICY "Users can view own sessions" ON user_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" ON user_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can access all sessions" ON user_sessions
    FOR ALL USING (auth.role() = 'service_role');

-- =============================================
-- POLITIQUES POUR LES TRANSACTIONS FINANCIÈRES
-- =============================================

-- POINTS_TRANSACTIONS: Utilisateurs peuvent voir leurs propres transactions
CREATE POLICY "Users can view own points transactions" ON points_transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can access all points transactions" ON points_transactions
    FOR ALL USING (auth.role() = 'service_role');

-- ORDERS: Utilisateurs peuvent voir/créer leurs propres commandes
CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders" ON orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders" ON orders
    FOR UPDATE USING (auth.uid() = user_id AND status IN ('pending', 'confirmed'));

CREATE POLICY "Service role can access all orders" ON orders
    FOR ALL USING (auth.role() = 'service_role');

-- ORDER_ITEMS: Accès via les commandes
CREATE POLICY "Users can view own order items" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND orders.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create own order items" ON order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND orders.user_id = auth.uid()
        )
    );

CREATE POLICY "Service role can access all order items" ON order_items
    FOR ALL USING (auth.role() = 'service_role');

-- SUBSCRIPTIONS: Utilisateurs peuvent voir leurs propres abonnements
CREATE POLICY "Users can view own subscriptions" ON subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can access all subscriptions" ON subscriptions
    FOR ALL USING (auth.role() = 'service_role');

-- MONTHLY_ALLOCATIONS: Utilisateurs peuvent voir leurs propres allocations
CREATE POLICY "Users can view own monthly allocations" ON monthly_allocations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can access all monthly allocations" ON monthly_allocations
    FOR ALL USING (auth.role() = 'service_role');

-- INVESTMENTS: Utilisateurs peuvent voir/créer leurs propres investissements
CREATE POLICY "Users can view own investments" ON investments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own investments" ON investments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can access all investments" ON investments
    FOR ALL USING (auth.role() = 'service_role');

-- INVESTMENT_RETURNS: Utilisateurs peuvent voir leurs propres retours
CREATE POLICY "Users can view own investment returns" ON investment_returns
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM investments 
            WHERE investments.id = investment_returns.investment_id 
            AND investments.user_id = auth.uid()
        )
    );

CREATE POLICY "Service role can access all investment returns" ON investment_returns
    FOR ALL USING (auth.role() = 'service_role');

-- =============================================
-- POLITIQUES POUR LE CONTENU PUBLIC
-- =============================================

-- PROJECTS: Lecture publique, écriture admin/producteur
CREATE POLICY "Anyone can view active projects" ON projects
    FOR SELECT USING (status IN ('active', 'funded'));

CREATE POLICY "Service role can access all projects" ON projects
    FOR ALL USING (auth.role() = 'service_role');

-- PROJECT_UPDATES: Lecture publique des updates publiées
CREATE POLICY "Anyone can view published project updates" ON project_updates
    FOR SELECT USING (published_at IS NOT NULL);

CREATE POLICY "Service role can access all project updates" ON project_updates
    FOR ALL USING (auth.role() = 'service_role');

-- PRODUCTS: Lecture publique des produits actifs
CREATE POLICY "Anyone can view active products" ON products
    FOR SELECT USING (is_active = true);

CREATE POLICY "Service role can access all products" ON products
    FOR ALL USING (auth.role() = 'service_role');

-- CATEGORIES: Lecture publique des catégories actives
CREATE POLICY "Anyone can view active categories" ON categories
    FOR SELECT USING (is_active = true);

CREATE POLICY "Service role can access all categories" ON categories
    FOR ALL USING (auth.role() = 'service_role');

-- PRODUCERS: Lecture publique des producteurs actifs
CREATE POLICY "Anyone can view active producers" ON producers
    FOR SELECT USING (status = 'active');

CREATE POLICY "Service role can access all producers" ON producers
    FOR ALL USING (auth.role() = 'service_role');

-- PRODUCER_METRICS: Lecture publique des métriques vérifiées
CREATE POLICY "Anyone can view verified producer metrics" ON producer_metrics
    FOR SELECT USING (verified = true);

CREATE POLICY "Service role can access all producer metrics" ON producer_metrics
    FOR ALL USING (auth.role() = 'service_role');

-- =============================================
-- POLITIQUES POUR LA GESTION INTERNE
-- =============================================

-- INVENTORY: Admin seulement
CREATE POLICY "Service role can access all inventory" ON inventory
    FOR ALL USING (auth.role() = 'service_role');

-- STOCK_MOVEMENTS: Admin seulement
CREATE POLICY "Service role can access all stock movements" ON stock_movements
    FOR ALL USING (auth.role() = 'service_role');
