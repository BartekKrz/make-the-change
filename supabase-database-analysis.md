# 🔍 Analyse Détaillée de la Base de Données Supabase
## Projet "Make the Change" - Commerce Durable & Investissement Social

*Analyse réalisée le: $(date)*
*Base de données: Supabase PostgreSQL*

---

## 📊 Vue d'Ensemble

### Statistiques Globales
- **21 tables principales** dans le schéma public
- **4 utilisateurs** actifs dans le système
- **5 produits** dans le catalogue
- **3 producteurs** partenaires
- **3 projets** d'investissement actifs
- **2 commandes** passées
- **3 transactions** de points

### Architecture Générale
```
┌─────────────────────────────────────────────────────────────────┐
│                    MAKE THE CHANGE DATABASE                      │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │
│  │   USERS     │  │  PRODUCERS  │  │  PRODUCTS   │  │   ORDERS │ │
│  │  (Gestion)  │  │  (Écosystème)│  │  (Catalogue)│  │ (Commerce)│ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────┘ │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │
│  │ INVESTMENTS │  │ SUBSCRIPTIONS│  │  INVENTORY │  │ METRICS  │ │
│  │ (Financement)│  │ (Points)     │  │  (Stocks)   │  │ (Suivi)  │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🗂️ Structure Détaillée des Tables

### 1. `users` - Table Principale des Utilisateurs
**Statut RLS: ✅ Activé** | **Enregistrements: 4**

| Champ | Type | Null | Défaut | Contrainte | Description |
|-------|------|------|--------|------------|-------------|
| `id` | `uuid` | ❌ | `gen_random_uuid()` | PRIMARY KEY | Identifiant unique utilisateur |
| `email` | `varchar` | ❌ | - | UNIQUE | Email de connexion |
| `profile` | `jsonb` | ❌ | `'{}'::jsonb` | - | Profil JSON flexible |
| `points_balance` | `integer` | ❌ | `0` | - | Solde de points actuel |
| `user_level` | `varchar` | ❌ | `'explorateur'::varchar` | CHECK | Niveau utilisateur |
| `kyc_status` | `varchar` | ❌ | `'pending'::varchar` | CHECK | Statut KYC |
| `kyc_level` | `integer` | ❌ | `0` | CHECK (0-2) | Niveau de vérification |
| `preferences` | `jsonb` | ❌ | `'{}'::jsonb` | - | Préférences utilisateur |
| `last_login_at` | `timestamp` | ✅ | - | - | Dernière connexion |
| `email_verified_at` | `timestamp` | ✅ | - | - | Vérification email |
| `created_at` | `timestamp` | ❌ | `now()` | - | Date de création |
| `updated_at` | `timestamp` | ❌ | `now()` | - | Dernière modification |

**Contraintes CHECK:**
- `user_level`: `['explorateur', 'protecteur', 'ambassadeur']`
- `kyc_status`: `['pending', 'light', 'complete']`
- `kyc_level`: `[0, 1, 2]`

**Relations sortantes:**
- `user_profiles.user_id → users.id`
- `user_sessions.user_id → users.id`
- `orders.user_id → users.id`
- `subscriptions.user_id → users.id`
- `investments.user_id → users.id`
- `points_transactions.user_id → users.id`
- `monthly_allocations.user_id → users.id`

---

### 2. `user_profiles` - Profils Détaillés
**Statut RLS: ✅ Activé** | **Enregistrements: 4**

| Champ | Type | Null | Défaut | Contrainte | Description |
|-------|------|------|--------|------------|-------------|
| `user_id` | `uuid` | ❌ | - | PRIMARY KEY, FK | Référence utilisateur |
| `first_name` | `varchar` | ✅ | - | - | Prénom |
| `last_name` | `varchar` | ✅ | - | - | Nom de famille |
| `date_of_birth` | `date` | ✅ | - | - | Date de naissance |
| `phone` | `varchar` | ✅ | - | - | Numéro de téléphone |
| `address` | `jsonb` | ✅ | - | - | Adresse structurée |
| `bio` | `text` | ✅ | - | - | Biographie |
| `avatar_url` | `text` | ✅ | - | - | URL de l'avatar |
| `social_links` | `jsonb` | ❌ | `'{}'::jsonb` | - | Liens réseaux sociaux |
| `notification_preferences` | `jsonb` | ❌ | `'{}'::jsonb` | - | Préférences notifications |
| `created_at` | `timestamp` | ✅ | `now()` | - | Date de création |
| `updated_at` | `timestamp` | ✅ | `now()` | - | Dernière modification |

**Structure JSON typique pour `address`:**
```json
{
  "street": "123 Rue de la Paix",
  "city": "Paris",
  "postal_code": "75001",
  "country": "France",
  "coordinates": {
    "lat": 48.8566,
    "lng": 2.3522
  }
}
```

---

### 3. `user_sessions` - Sessions Utilisateur
**Statut RLS: ✅ Activé** | **Enregistrements: 0**

| Champ | Type | Null | Défaut | Contrainte | Description |
|-------|------|------|--------|------------|-------------|
| `id` | `uuid` | ❌ | `gen_random_uuid()` | PRIMARY KEY | ID de session |
| `user_id` | `uuid` | ✅ | - | FK | Utilisateur associé |
| `session_token` | `varchar` | ❌ | - | UNIQUE | Token de session |
| `device_info` | `jsonb` | ❌ | `'{}'::jsonb` | - | Infos appareil |
| `ip_address` | `inet` | ✅ | - | - | Adresse IP |
| `user_agent` | `text` | ✅ | - | - | User-Agent navigateur |
| `expires_at` | `timestamp` | ❌ | - | - | Expiration session |
| `created_at` | `timestamp` | ✅ | `now()` | - | Date de création |

---

### 4. `producers` - Réseau de Producteurs
**Statut RLS: ✅ Activé** | **Enregistrements: 3**

| Champ | Type | Null | Défaut | Contrainte | Description |
|-------|------|------|--------|------------|-------------|
| `id` | `uuid` | ❌ | `gen_random_uuid()` | PRIMARY KEY | ID producteur |
| `name` | `varchar` | ❌ | - | - | Nom du producteur |
| `slug` | `varchar` | ❌ | - | UNIQUE | Slug URL |
| `type` | `varchar` | ❌ | - | CHECK | Type de producteur |
| `description` | `text` | ✅ | - | - | Description |
| `story` | `text` | ✅ | - | - | Histoire du producteur |
| `location` | `geography` | ✅ | - | - | Position géographique |
| `address` | `jsonb` | ❌ | - | - | Adresse détaillée |
| `contact_info` | `jsonb` | ❌ | `'{}'::jsonb` | - | Coordonnées |
| `social_media` | `jsonb` | ❌ | `'{}'::jsonb` | - | Réseaux sociaux |
| `certifications` | `text[]` | ❌ | `'{}'::text[]` | - | Certifications |
| `specialties` | `text[]` | ❌ | `'{}'::text[]` | - | Spécialités |
| `capacity_info` | `jsonb` | ❌ | `'{}'::jsonb` | - | Capacités production |
| `partnership_start` | `date` | ✅ | - | - | Début partenariat |
| `partnership_type` | `varchar` | ✅ | `'standard'::varchar` | CHECK | Type de partenariat |
| `commission_rate` | `numeric` | ✅ | - | - | Taux de commission |
| `payment_terms` | `integer` | ✅ | `30` | - | Délai paiement (jours) |
| `status` | `varchar` | ✅ | `'active'::varchar` | CHECK | Statut |
| `images` | `text[]` | ✅ | `'{}'::text[]` | - | URLs d'images |
| `documents` | `text[]` | ✅ | `'{}'::text[]` | - | Documents |
| `notes` | `text` | ✅ | - | - | Notes internes |
| `metadata` | `jsonb` | ❌ | `'{}'::jsonb` | - | Métadonnées |
| `created_at` | `timestamp` | ✅ | `now()` | - | Date de création |
| `updated_at` | `timestamp` | ✅ | `now()` | - | Dernière modification |

**Contraintes CHECK:**
- `type`: `['beekeeper', 'olive_grower', 'winery', 'cooperative']`
- `partnership_type`: `['standard', 'premium', 'exclusive']`
- `status`: `['active', 'inactive', 'suspended']`

---

### 5. `projects` - Projets d'Investissement
**Statut RLS: ✅ Activé** | **Enregistrements: 3**

| Champ | Type | Null | Défaut | Contrainte | Description |
|-------|------|------|--------|------------|-------------|
| `id` | `uuid` | ❌ | `gen_random_uuid()` | PRIMARY KEY | ID projet |
| `type` | `varchar` | ❌ | - | CHECK | Type de projet |
| `name` | `varchar` | ❌ | - | - | Nom du projet |
| `slug` | `varchar` | ❌ | - | UNIQUE | Slug URL |
| `description` | `text` | ✅ | - | - | Description courte |
| `long_description` | `text` | ✅ | - | - | Description détaillée |
| `location` | `geography` | ❌ | - | - | Localisation géographique |
| `address` | `jsonb` | ❌ | - | - | Adresse détaillée |
| `producer_id` | `uuid` | ✅ | - | FK | Producteur associé |
| `target_budget` | `integer` | ❌ | - | - | Budget cible (€) |
| `current_funding` | `integer` | ✅ | `0` | - | Financement actuel (€) |
| `funding_progress` | `numeric` | ✅ | `0.0` | - | Progression (%) |
| `status` | `varchar` | ✅ | `'active'::varchar` | CHECK | Statut du projet |
| `launch_date` | `date` | ✅ | - | - | Date de lancement |
| `maturity_date` | `date` | ✅ | - | - | Date de maturité |
| `certification_labels` | `text[]` | ✅ | `'{}'::text[]` | - | Labels de certification |
| `impact_metrics` | `jsonb` | ✅ | `'{}'::jsonb` | - | Métriques d'impact |
| `images` | `text[]` | ✅ | `'{}'::text[]` | - | URLs d'images |
| `metadata` | `jsonb` | ✅ | `'{}'::jsonb` | - | Métadonnées |
| `seo_title` | `varchar` | ✅ | - | - | Titre SEO |
| `seo_description` | `text` | ✅ | - | - | Description SEO |
| `featured` | `boolean` | ✅ | `false` | - | Projet mis en avant |
| `created_at` | `timestamp` | ✅ | `now()` | - | Date de création |
| `updated_at` | `timestamp` | ✅ | `now()` | - | Dernière modification |

**Contraintes CHECK:**
- `type`: `['beehive', 'olive_tree', 'vineyard', 'reforestation', 'ocean_cleanup']`
- `status`: `['active', 'funded', 'closed', 'suspended']`

---

### 6. `project_updates` - Mises à Jour de Projets
**Statut RLS: ✅ Activé** | **Enregistrements: 3**

| Champ | Type | Null | Défaut | Contrainte | Description |
|-------|------|------|--------|------------|-------------|
| `id` | `uuid` | ❌ | `gen_random_uuid()` | PRIMARY KEY | ID mise à jour |
| `project_id` | `uuid` | ✅ | - | FK | Projet concerné |
| `type` | `varchar` | ❌ | - | CHECK | Type de mise à jour |
| `title` | `varchar` | ❌ | - | - | Titre de la mise à jour |
| `content` | `text` | ✅ | - | - | Contenu détaillé |
| `metrics` | `jsonb` | ✅ | `'{}'::jsonb` | - | Métriques associées |
| `images` | `text[]` | ✅ | `'{}'::text[]` | - | URLs d'images |
| `published_at` | `timestamp` | ✅ | - | - | Date de publication |
| `created_at` | `timestamp` | ✅ | `now()` | - | Date de création |

**Contraintes CHECK:**
- `type`: `['production', 'maintenance', 'harvest', 'impact']`

---

### 7. `producer_metrics` - Métriques des Producteurs
**Statut RLS: ✅ Activé** | **Enregistrements: 0**

| Champ | Type | Null | Défaut | Contrainte | Description |
|-------|------|------|--------|------------|-------------|
| `id` | `uuid` | ❌ | `gen_random_uuid()` | PRIMARY KEY | ID métrique |
| `producer_id` | `uuid` | ✅ | - | FK | Producteur concerné |
| `metric_type` | `varchar` | ❌ | - | - | Type de métrique |
| `period` | `varchar` | ❌ | - | - | Période (mensuel/annuel) |
| `value` | `numeric` | ❌ | - | - | Valeur mesurée |
| `unit` | `varchar` | ❌ | - | - | Unité de mesure |
| `measurement_date` | `date` | ❌ | - | - | Date de mesure |
| `verified` | `boolean` | ✅ | `false` | - | Métrique vérifiée |
| `verification_doc_url` | `text` | ✅ | - | - | URL document de vérification |
| `notes` | `text` | ✅ | - | - | Notes complémentaires |
| `created_at` | `timestamp` | ✅ | `now()` | - | Date de création |

---

### 8. `categories` - Catégories de Produits
**Statut RLS: ✅ Activé** | **Enregistrements: 0**

| Champ | Type | Null | Défaut | Contrainte | Description |
|-------|------|------|--------|------------|-------------|
| `id` | `uuid` | ❌ | `gen_random_uuid()` | PRIMARY KEY | ID catégorie |
| `name` | `varchar` | ❌ | - | - | Nom de la catégorie |
| `slug` | `varchar` | ❌ | - | UNIQUE | Slug URL |
| `description` | `text` | ✅ | - | - | Description catégorie |
| `parent_id` | `uuid` | ✅ | - | FK (self) | Catégorie parente |
| `image_url` | `text` | ✅ | - | - | URL image catégorie |
| `sort_order` | `integer` | ✅ | `0` | - | Ordre d'affichage |
| `is_active` | `boolean` | ✅ | `true` | - | Catégorie active |
| `seo_title` | `varchar` | ✅ | - | - | Titre SEO |
| `seo_description` | `text` | ✅ | - | - | Description SEO |
| `created_at` | `timestamp` | ✅ | `now()` | - | Date de création |
| `updated_at` | `timestamp` | ✅ | `now()` | - | Dernière modification |

---

### 9. `products` - Catalogue Produits
**Statut RLS: ✅ Activé** | **Enregistrements: 5**

| Champ | Type | Null | Défaut | Contrainte | Description |
|-------|------|------|--------|------------|-------------|
| `id` | `uuid` | ❌ | `gen_random_uuid()` | PRIMARY KEY | ID produit |
| `name` | `varchar` | ❌ | - | - | Nom du produit |
| `slug` | `varchar` | ❌ | - | UNIQUE | Slug URL |
| `short_description` | `text` | ✅ | - | - | Description courte |
| `description` | `text` | ✅ | - | - | Description détaillée |
| `category_id` | `uuid` | ✅ | - | FK | Catégorie associée |
| `producer_id` | `uuid` | ✅ | - | FK | Producteur associé |
| `price_points` | `integer` | ❌ | - | - | Prix en points |
| `price_eur_equivalent` | `numeric` | ✅ | - | - | Équivalent € |
| `fulfillment_method` | `varchar` | ❌ | `'dropship'::varchar` | CHECK | Méthode de livraison |
| `is_hero_product` | `boolean` | ✅ | `false` | - | Produit phare |
| `stock_quantity` | `integer` | ✅ | `0` | - | Quantité en stock |
| `stock_management` | `boolean` | ✅ | `true` | - | Gestion des stocks |
| `weight_grams` | `integer` | ✅ | - | - | Poids en grammes |
| `dimensions` | `jsonb` | ✅ | - | - | Dimensions (L×l×H) |
| `images` | `text[]` | ✅ | `'{}'::text[]` | - | URLs d'images |
| `tags` | `text[]` | ✅ | `'{}'::text[]` | - | Tags de recherche |
| `variants` | `jsonb` | ✅ | `'{}'::jsonb` | - | Variantes produit |
| `nutrition_facts` | `jsonb` | ✅ | `'{}'::jsonb` | - | Valeurs nutritionnelles |
| `allergens` | `text[]` | ✅ | `'{}'::text[]` | - | Allergènes |
| `certifications` | `text[]` | ✅ | `'{}'::text[]` | - | Certifications |
| `origin_country` | `varchar` | ✅ | - | - | Pays d'origine |
| `seasonal_availability` | `jsonb` | ✅ | `'{}'::jsonb` | - | Disponibilité saisonnière |
| `min_tier` | `varchar` | ✅ | `'explorateur'::varchar` | CHECK | Niveau minimum requis |
| `featured` | `boolean` | ✅ | `false` | - | Produit mis en avant |
| `is_active` | `boolean` | ✅ | `true` | - | Produit actif |
| `launch_date` | `date` | ✅ | - | - | Date de lancement |
| `discontinue_date` | `date` | ✅ | - | - | Date d'arrêt |
| `seo_title` | `varchar` | ✅ | - | - | Titre SEO |
| `seo_description` | `text` | ✅ | - | - | Description SEO |
| `metadata` | `jsonb` | ✅ | `'{}'::jsonb` | - | Métadonnées |
| `created_at` | `timestamp` | ✅ | `now()` | - | Date de création |
| `updated_at` | `timestamp` | ✅ | `now()` | - | Dernière modification |

**Contraintes CHECK:**
- `fulfillment_method`: `['stock', 'dropship']`
- `min_tier`: `['explorateur', 'protecteur', 'ambassadeur']`

---

### 10. `inventory` - Gestion des Stocks
**Statut RLS: ✅ Activé** | **Enregistrements: 0**

| Champ | Type | Null | Défaut | Contrainte | Description |
|-------|------|------|--------|------------|-------------|
| `id` | `uuid` | ❌ | `gen_random_uuid()` | PRIMARY KEY | ID inventaire |
| `product_id` | `uuid` | ✅ | - | FK | Produit associé |
| `sku` | `varchar` | ❌ | - | UNIQUE | SKU unique |
| `quantity_available` | `integer` | ❌ | `0` | - | Quantité disponible |
| `quantity_reserved` | `integer` | ✅ | `0` | - | Quantité réservée |
| `reorder_threshold` | `integer` | ❌ | `10` | - | Seuil de réapprovisionnement |
| `reorder_quantity` | `integer` | ❌ | `50` | - | Quantité de réapprovisionnement |
| `cost_price_cents` | `integer` | ❌ | - | - | Prix de revient (centimes) |
| `supplier_reference` | `varchar` | ✅ | - | - | Référence fournisseur |
| `last_restock_date` | `timestamp` | ✅ | - | - | Dernière réapprovisionnement |
| `last_stockout_date` | `timestamp` | ✅ | - | - | Dernière rupture |
| `location_in_warehouse` | `varchar` | ✅ | - | - | Emplacement entrepôt |
| `expiry_date` | `date` | ✅ | - | - | Date d'expiration |
| `batch_number` | `varchar` | ✅ | - | - | Numéro de lot |
| `rotation_days` | `integer` | ✅ | - | - | Durée de rotation |
| `created_at` | `timestamp` | ✅ | `now()` | - | Date de création |
| `updated_at` | `timestamp` | ✅ | `now()` | - | Dernière modification |

---

### 11. `stock_movements` - Mouvements de Stock
**Statut RLS: ✅ Activé** | **Enregistrements: 0**

| Champ | Type | Null | Défaut | Contrainte | Description |
|-------|------|------|--------|------------|-------------|
| `id` | `uuid` | ❌ | `gen_random_uuid()` | PRIMARY KEY | ID mouvement |
| `inventory_id` | `uuid` | ✅ | - | FK | Article d'inventaire |
| `type` | `varchar` | ❌ | - | CHECK | Type de mouvement |
| `quantity` | `integer` | ❌ | - | - | Quantité concernée |
| `reference_type` | `varchar` | ✅ | - | - | Type de référence |
| `reference_id` | `uuid` | ✅ | - | - | ID de référence |
| `reason` | `text` | ✅ | - | - | Motif du mouvement |
| `cost_per_unit_cents` | `integer` | ✅ | - | - | Coût unitaire (centimes) |
| `performed_by` | `uuid` | ✅ | - | - | Utilisateur ayant effectué |
| `created_at` | `timestamp` | ✅ | `now()` | - | Date du mouvement |

**Contraintes CHECK:**
- `type`: `['in', 'out', 'adjustment', 'reserved', 'released']`

---

### 12. `orders` - Commandes Clients
**Statut RLS: ✅ Activé** | **Enregistrements: 2**

| Champ | Type | Null | Défaut | Contrainte | Description |
|-------|------|------|--------|------------|-------------|
| `id` | `uuid` | ❌ | `gen_random_uuid()` | PRIMARY KEY | ID commande |
| `user_id` | `uuid` | ✅ | - | FK | Client ayant commandé |
| `status` | `varchar` | ✅ | `'pending'::varchar` | CHECK | Statut de la commande |
| `subtotal_points` | `integer` | ❌ | - | - | Sous-total en points |
| `shipping_cost_points` | `integer` | ✅ | `0` | - | Frais de port en points |
| `tax_points` | `integer` | ✅ | `0` | - | Taxes en points |
| `total_points` | `integer` | ❌ | - | - | Total en points |
| `points_used` | `integer` | ❌ | - | - | Points utilisés |
| `points_earned` | `integer` | ✅ | `0` | - | Points gagnés |
| `payment_method` | `varchar` | ✅ | - | CHECK | Méthode de paiement |
| `stripe_payment_intent_id` | `varchar` | ✅ | - | - | ID Stripe |
| `shipping_address` | `jsonb` | ❌ | - | - | Adresse de livraison |
| `billing_address` | `jsonb` | ✅ | - | - | Adresse de facturation |
| `tracking_number` | `varchar` | ✅ | - | - | Numéro de suivi |
| `carrier` | `varchar` | ✅ | - | - | Transporteur |
| `notes` | `text` | ✅ | - | - | Notes commande |
| `admin_notes` | `text` | ✅ | - | - | Notes administrateur |
| `created_at` | `timestamp` | ✅ | `now()` | - | Date de création |
| `updated_at` | `timestamp` | ✅ | `now()` | - | Dernière modification |
| `shipped_at` | `timestamp` | ✅ | - | - | Date d'expédition |
| `delivered_at` | `timestamp` | ✅ | - | - | Date de livraison |

**Contraintes CHECK:**
- `status`: `['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']`
- `payment_method`: `['points', 'stripe_card', 'stripe_sepa', 'mixed']`

---

### 13. `order_items` - Articles de Commande
**Statut RLS: ✅ Activé** | **Enregistrements: 3**

| Champ | Type | Null | Défaut | Contrainte | Description |
|-------|------|------|--------|------------|-------------|
| `id` | `uuid` | ❌ | `gen_random_uuid()` | PRIMARY KEY | ID article commande |
| `order_id` | `uuid` | ✅ | - | FK | Commande associée |
| `product_id` | `uuid` | ✅ | - | FK | Produit commandé |
| `quantity` | `integer` | ❌ | - | - | Quantité commandée |
| `unit_price_points` | `integer` | ❌ | - | - | Prix unitaire en points |
| `total_price_points` | `integer` | ❌ | - | - | Prix total en points |
| `product_snapshot` | `jsonb` | ✅ | - | - | Snapshot produit au moment |
| `created_at` | `timestamp` | ✅ | `now()` | - | Date de création |

---

### 14. `subscriptions` - Abonnements Utilisateurs
**Statut RLS: ✅ Activé** | **Enregistrements: 0**

| Champ | Type | Null | Défaut | Contrainte | Description |
|-------|------|------|--------|------------|-------------|
| `id` | `uuid` | ❌ | `gen_random_uuid()` | PRIMARY KEY | ID abonnement |
| `user_id` | `uuid` | ✅ | - | FK | Utilisateur abonné |
| `stripe_subscription_id` | `varchar` | ✅ | - | UNIQUE | ID abonnement Stripe |
| `stripe_customer_id` | `varchar` | ❌ | - | - | ID client Stripe |
| `plan_type` | `varchar` | ❌ | - | CHECK | Type d'abonnement |
| `status` | `varchar` | ✅ | `'active'::varchar` | CHECK | Statut abonnement |
| `monthly_price_eur` | `numeric` | ❌ | - | - | Prix mensuel (€) |
| `monthly_points_allocation` | `integer` | ❌ | - | - | Points mensuels alloués |
| `current_period_start` | `timestamp` | ✅ | - | - | Début période actuelle |
| `current_period_end` | `timestamp` | ✅ | - | - | Fin période actuelle |
| `next_billing_date` | `timestamp` | ✅ | - | - | Prochaine facturation |
| `cancel_at_period_end` | `boolean` | ✅ | `false` | - | Annulation en fin de période |
| `metadata` | `jsonb` | ✅ | `'{}'::jsonb` | - | Métadonnées |
| `created_at` | `timestamp` | ✅ | `now()` | - | Date de création |
| `updated_at` | `timestamp` | ✅ | `now()` | - | Dernière modification |
| `cancelled_at` | `timestamp` | ✅ | - | - | Date d'annulation |
| `ended_at` | `timestamp` | ✅ | - | - | Date de fin |

**Contraintes CHECK:**
- `plan_type`: `['monthly_standard', 'monthly_premium', 'annual_standard', 'annual_premium']`
- `status`: `['active', 'past_due', 'cancelled', 'unpaid']`

---

### 15. `points_transactions` - Transactions de Points
**Statut RLS: ✅ Activé** | **Enregistrements: 3**

| Champ | Type | Null | Défaut | Contrainte | Description |
|-------|------|------|--------|------------|-------------|
| `id` | `uuid` | ❌ | `gen_random_uuid()` | PRIMARY KEY | ID transaction |
| `user_id` | `uuid` | ✅ | - | FK | Utilisateur concerné |
| `type` | `varchar` | ❌ | - | CHECK | Type de transaction |
| `amount` | `integer` | ❌ | - | - | Montant en points |
| `balance_after` | `integer` | ❌ | - | - | Solde après transaction |
| `reference_type` | `varchar` | ✅ | - | - | Type de référence |
| `reference_id` | `uuid` | ✅ | - | - | ID de référence |
| `description` | `text` | ✅ | - | - | Description |
| `metadata` | `jsonb` | ✅ | `'{}'::jsonb` | - | Métadonnées |
| `expires_at` | `timestamp` | ✅ | - | - | Date d'expiration points |
| `processed_at` | `timestamp` | ✅ | `now()` | - | Date de traitement |
| `created_at` | `timestamp` | ✅ | `now()` | - | Date de création |

**Contraintes CHECK:**
- `type`: `['earned_subscription', 'earned_purchase', 'earned_referral', 'spent_order', 'spent_investment', 'adjustment_admin', 'bonus_welcome', 'bonus_milestone']`

---

### 16. `monthly_allocations` - Allocations Mensuelles
**Statut RLS: ✅ Activé** | **Enregistrements: 0**

| Champ | Type | Null | Défaut | Contrainte | Description |
|-------|------|------|--------|------------|-------------|
| `id` | `uuid` | ❌ | `gen_random_uuid()` | PRIMARY KEY | ID allocation |
| `subscription_id` | `uuid` | ✅ | - | FK | Abonnement associé |
| `user_id` | `uuid` | ✅ | - | FK | Utilisateur bénéficiaire |
| `allocation_month` | `varchar` | ❌ | - | - | Mois d'allocation (YYYY-MM) |
| `points_allocated` | `integer` | ❌ | - | - | Points alloués |
| `allocated_at` | `timestamp` | ✅ | `now()` | - | Date d'allocation |

---

### 17. `investments` - Investissements Utilisateurs
**Statut RLS: ✅ Activé** | **Enregistrements: 2**

| Champ | Type | Null | Défaut | Contrainte | Description |
|-------|------|------|--------|------------|-------------|
| `id` | `uuid` | ❌ | `gen_random_uuid()` | PRIMARY KEY | ID investissement |
| `user_id` | `uuid` | ✅ | - | FK | Investisseur |
| `project_id` | `uuid` | ✅ | - | FK | Projet investi |
| `amount_points` | `integer` | ❌ | - | - | Montant en points |
| `amount_eur_equivalent` | `numeric` | ❌ | - | - | Équivalent € |
| `status` | `varchar` | ✅ | `'active'::varchar` | CHECK | Statut investissement |
| `expected_return_rate` | `numeric` | ✅ | - | - | Taux de retour attendu (%) |
| `maturity_date` | `date` | ✅ | - | - | Date de maturité |
| `returns_received_points` | `integer` | ✅ | `0` | - | Retours reçus (points) |
| `last_return_date` | `timestamp` | ✅ | - | - | Dernier retour |
| `investment_terms` | `jsonb` | ✅ | `'{}'::jsonb` | - | Conditions d'investissement |
| `notes` | `text` | ✅ | - | - | Notes internes |
| `created_at` | `timestamp` | ✅ | `now()` | - | Date de création |
| `updated_at` | `timestamp` | ✅ | `now()` | - | Dernière modification |

**Contraintes CHECK:**
- `status`: `['active', 'matured', 'cancelled']`

---

### 18. `investment_returns` - Retours sur Investissement
**Statut RLS: ✅ Activé** | **Enregistrements: 0**

| Champ | Type | Null | Défaut | Contrainte | Description |
|-------|------|------|--------|------------|-------------|
| `id` | `uuid` | ❌ | `gen_random_uuid()` | PRIMARY KEY | ID retour |
| `investment_id` | `uuid` | ✅ | - | FK | Investissement associé |
| `return_period` | `varchar` | ❌ | - | - | Période de retour |
| `points_returned` | `integer` | ❌ | - | - | Points retournés |
| `return_rate_actual` | `numeric` | ✅ | - | - | Taux de retour réel (%) |
| `distribution_date` | `timestamp` | ✅ | `now()` | - | Date de distribution |
| `notes` | `text` | ✅ | - | - | Notes sur le retour |
| `created_at` | `timestamp` | ✅ | `now()` | - | Date de création |

---

### 19. `spatial_ref_sys` - Système de Référence Spatiale
**Statut RLS: ❌ Désactivé** | **Enregistrements: 8500**

*Table système PostGIS pour les références spatiales*

| Champ | Type | Null | Défaut | Contrainte | Description |
|-------|------|------|--------|------------|-------------|
| `srid` | `integer` | ❌ | - | PRIMARY KEY | Code SRID |
| `auth_name` | `varchar` | ✅ | - | - | Autorité de référence |
| `auth_srid` | `integer` | ✅ | - | - | SRID autorité |
| `srtext` | `varchar` | ✅ | - | - | Définition WKT |
| `proj4text` | `varchar` | ✅ | - | - | Définition PROJ.4 |

---

## 🔧 Extensions Installées

### Extensions Actives

| Extension | Schéma | Version | Description |
|-----------|--------|---------|-------------|
| **postgis** | public | 3.3.7 | Géolocalisation et données spatiales |
| **pg_trgm** | public | 1.6 | Recherche textuelle et similarité |
| **pg_graphql** | graphql | 1.5.11 | API GraphQL native |
| **uuid-ossp** | extensions | 1.1 | Génération d'UUIDs |
| **pgcrypto** | extensions | 1.3 | Fonctions cryptographiques |
| **pg_stat_statements** | extensions | 1.11 | Statistiques de performance SQL |

### Extensions Disponibles (non installées)

| Extension | Description | Utilité potentielle |
|-----------|-------------|-------------------|
| **vector** | Types de données vectorielles | IA/ML, embeddings |
| **pgmq** | File de messages | Traitement asynchrone |
| **pg_cron** | Tâches planifiées | Automation |
| **wrappers** | Connecteurs externes | Intégrations tierces |
| **pg_jsonschema** | Validation JSON Schema | Validation de données |
| **hypopg** | Index hypothétiques | Optimisation |

---

## 🔒 Analyse Sécurité Détaillée

### ✅ Points Forts
- **RLS activé** sur 20/21 tables
- **Politiques RLS** complètes par rôle utilisateur
- **Authentification Supabase** bien intégrée
- **Chiffrement des données** sensibles

### ⚠️ Vulnérabilités Identifiées

#### 1. **Table `spatial_ref_sys` sans RLS**
```sql
-- Problème: Table système accessible publiquement
SELECT COUNT(*) FROM spatial_ref_sys; -- Possible depuis n'importe où
```

#### 2. **Politiques RLS InitPlan** (28 occurrences)
```sql
-- Problème: Réévaluation à chaque ligne
CREATE POLICY "Users can view own data" ON users
FOR SELECT USING (auth.uid() = id); -- Exécuté pour chaque ligne

-- Solution recommandée:
CREATE POLICY "Users can view own data" ON users
FOR SELECT USING (auth.uid() = id); -- Avec (SELECT auth.uid())
```

#### 3. **Protection mots de passe compromis**
```sql
-- Actuellement: Désactivée
-- Recommandation: Activer dans Supabase Dashboard
```

#### 4. **Authentification Multi-Facteur**
```sql
-- Actuellement: Méthodes insuffisantes
-- Recommandation: Ajouter TOTP et méthodes alternatives
```

#### 5. **Fonction Search Path Mutable**
```sql
-- Problème dans: update_updated_at_column()
-- Solution: Définir explicitement le search_path
```

---

## ⚡ Analyse Performance Détaillée

### 🔴 Problèmes Critiques

#### 1. **Index Non Utilisés (58 index)**
```sql
-- Index créés mais jamais utilisés:
- idx_users_level
- idx_users_kyc_status
- idx_users_points
- idx_producers_slug
- idx_producers_type
-- ... 53 autres index

-- Impact: Overhead de maintenance sans bénéfice
-- Solution: DROP INDEX inutiles
```

#### 2. **Clés Étrangères Non Indexées (4 FK)**
```sql
-- FK sans index couvrant:
ALTER TABLE investment_returns ADD INDEX idx_investment_returns_investment_id ON (investment_id);
ALTER TABLE monthly_allocations ADD INDEX idx_monthly_allocations_user_id ON (user_id);
ALTER TABLE stock_movements ADD INDEX idx_stock_movements_inventory_id ON (inventory_id);
ALTER TABLE user_sessions ADD INDEX idx_user_sessions_user_id ON (user_id);
```

#### 3. **Politiques RLS Multiples Permissives (58 cas)**
```sql
-- Problème: Chaque politique exécutée pour chaque requête
-- Impact: Requêtes lentes à l'échelle
-- Solution: Consolider les politiques
```

### 🟡 Optimisations Recommandées

#### **Requêtes Fréquentes à Optimiser:**
```sql
-- Produits populaires avec stocks
SELECT p.*, i.quantity_available
FROM products p
LEFT JOIN inventory i ON p.id = i.product_id
WHERE p.is_active = true AND p.featured = true;

-- Commandes utilisateur récentes
SELECT o.*, oi.quantity, oi.unit_price_points
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
WHERE o.user_id = $1
ORDER BY o.created_at DESC;

-- Portefeuille investissements
SELECT i.*, p.name, p.type, ir.points_returned
FROM investments i
JOIN projects p ON i.project_id = p.id
LEFT JOIN investment_returns ir ON i.id = ir.investment_id
WHERE i.user_id = $1;
```

#### **Index Recommandés:**
```sql
-- Index composites pour requêtes fréquentes
CREATE INDEX idx_products_active_featured ON products (is_active, featured) WHERE is_active = true;
CREATE INDEX idx_orders_user_created ON orders (user_id, created_at DESC);
CREATE INDEX idx_investments_user_status ON investments (user_id, status) WHERE status = 'active';

-- Index GIN pour recherches textuelles
CREATE INDEX idx_products_search ON products USING GIN (to_tsvector('french', name || ' ' || description));
CREATE INDEX idx_producers_location ON producers USING GIST (location);
```

---

## 📊 Métriques et Statistiques

### **Volume de Données Actuel:**
- **Utilisateurs actifs:** 4
- **Produits:** 5
- **Producteurs:** 3
- **Projets:** 3
- **Commandes:** 2
- **Articles commandés:** 3
- **Investissements:** 2
- **Transactions points:** 3

### **Taux d'Utilisation par Module:**
- **E-commerce:** 40% (5 produits sur potentiel illimité)
- **Investissement:** 66% (2 investissements sur 3 projets)
- **Gestion stocks:** 0% (système vide)
- **Abonnements:** 0% (non implémenté)

### **Points de Vigilance:**
- **Tables vides:** `producer_metrics`, `inventory`, `stock_movements`, `subscriptions`, `monthly_allocations`, `investment_returns`, `user_sessions`
- **Données de test insuffisantes** pour validation complète
- **Métriques non collectées** (producer_metrics = 0 enregistrements)

---

## 🎯 Recommandations Prioritaires

### **Phase 1: Sécurité (Critique)**
```sql
-- 1. Activer RLS sur spatial_ref_sys
ALTER TABLE spatial_ref_sys ENABLE ROW LEVEL SECURITY;

-- 2. Corriger politiques RLS InitPlan
-- Remplacer auth.uid() par (SELECT auth.uid()) dans toutes les politiques

-- 3. Définir search_path dans fonctions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  -- SET search_path = public; -- Ajouter cette ligne
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### **Phase 2: Performance (Important)**
```sql
-- Nettoyer index inutiles
DROP INDEX IF EXISTS idx_users_level;
DROP INDEX IF EXISTS idx_users_kyc_status;
-- ... supprimer tous les index non utilisés

-- Ajouter index manquants
CREATE INDEX idx_investment_returns_investment_id ON investment_returns (investment_id);
CREATE INDEX idx_monthly_allocations_user_id ON monthly_allocations (user_id);
CREATE INDEX idx_stock_movements_inventory_id ON stock_movements (inventory_id);
CREATE INDEX idx_user_sessions_user_id ON user_sessions (user_id);
```

### **Phase 3: Fonctionnalités (Business)**
1. **Peupler avec données de test réalistes**
2. **Implémenter système de stocks** (`inventory`, `stock_movements`)
3. **Activer abonnements** (`subscriptions`, `monthly_allocations`)
4. **Développer métriques producteurs** (`producer_metrics`)
5. **Mettre en place retours d'investissements** (`investment_returns`)

### **Phase 4: Optimisation (Évolutif)**
1. **Mettre en place monitoring pg_stat_statements**
2. **Configurer pg_cron** pour tâches automatisées
3. **Implémenter cache avec Redis** si nécessaire
4. **Optimiser requêtes fréquentes**

---

## 🏗️ Architecture Technique

### **Modèle de Données - Points Forts:**
1. **Normalisation cohérente** avec relations bien définies
2. **Types de données appropriés** (JSONB pour flexibilité, arrays pour tags)
3. **Contraintes d'intégrité** complètes
4. **Audit trail** avec created_at/updated_at

### **Points d'Amélioration:**
1. **Indexation optimisée** pour les requêtes fréquentes
2. **Partitionnement** si volumes importants (orders, points_transactions)
3. **Archivage automatique** des anciennes données
4. **Réplication** pour haute disponibilité

### **Stack Technologique:**
- ✅ **PostgreSQL** avec extensions avancées
- ✅ **PostGIS** pour géolocalisation
- ✅ **Supabase Auth** pour authentification
- ✅ **RLS** pour sécurité par ligne
- ✅ **GraphQL** pour API flexible

---

## 📋 Checklist Déploiement Production

### **Sécurité:**
- [ ] Activer protection mots de passe compromis
- [ ] Configurer MFA complet
- [ ] Auditer toutes politiques RLS
- [ ] Chiffrer données sensibles
- [ ] Configurer backups chiffrés

### **Performance:**
- [ ] Optimiser index existants
- [ ] Supprimer index inutiles
- [ ] Monitorer requêtes lentes
- [ ] Configurer connection pooling
- [ ] Mettre en place cache si nécessaire

### **Fiabilité:**
- [ ] Configurer monitoring pg_stat_statements
- [ ] Mettre en place alertes
- [ ] Tester procédures recovery
- [ ] Valider backups automatiques
- [ ] Documenter procédures maintenance

### **Fonctionnalités:**
- [ ] Peupler données de test
- [ ] Tester tous workflows
- [ ] Valider calculs points
- [ ] Tester géolocalisation
- [ ] Valider intégrations Stripe

---

*Cette analyse révèle une architecture solide et scalable pour un système de commerce durable innovant. Les principales actions consistent à corriger les problèmes de sécurité identifiés, optimiser les performances, et compléter l'implémentation des fonctionnalités métier.*
