# 🎯 Mobile App Hybride - Spécifications

**📍 VERSION: Hybride** | **🗓️ TIMELINE: Mois 1-4** | **⭐️ PRIORITÉ: Core**

## 🎯 Modèle Hybride à 3 Niveaux

Cette application révolutionnaire propose **3 niveaux d'engagement progressifs** pour maximiser l'accessibilité et l'engagement utilisateur avec la biodiversité.

### 🎯 **Architecture à 3 Niveaux**
- **Niveau 1 - Explorateur** : Accès gratuit, découverte libre des projets et producteurs
- **Niveau 2 - Protecteur** : Investissements unitaires dans projets spécifiques (50€-150€)
- **Niveau 3 - Ambassadeur** : Abonnements premium avec allocation flexible (200€-350€)

### ✅ **Fonctionnalités Core Hybrides**
- **Exploration gratuite** : App complète accessible sans barrière financière
- **Investissements unitaires** : Adoption de ruches, oliviers spécifiques avec suivi personnalisé
- **Dashboard adaptatif** : Interface qui s'adapte au niveau d'engagement utilisateur
- **E-commerce différencié** : Catalogue avec accès progressif selon niveau
- **Gamification naturelle** : Badges projets, suivi impact personnalisé

### 📋 **Prérequis**
- ✅ Modèle économique hybride validé
- ✅ Partenaires confirmés (HABEEBEE, ILANGA NATURE, PROMIEL)
- ✅ Database schema adapté aux investissements unitaires
- ✅ System de points hybride (investment + subscription)

## 📁 Structure des Spécifications Hybrides

### 🆓 **Niveau Explorateur** (`/flows/exploration/`)
**Mois 1-2 - Accès gratuit et découverte**
- [`onboarding-gratuit.md`](./flows/onboarding-gratuit.md) 🚧 **À développer** - Première ouverture sans friction
- [`projets-decouverte.md`](./navigation/projects.md) 🚧 **À développer** - Navigation projets libre
- [`catalogue-consultation.md`](./flows/catalogue-consultation.md) 🚧 **À créer** - Catalogue en lecture seule

### 🐝 **Niveau Protecteur** (`/flows/investments/`)
**Mois 2-3 - Investissements unitaires**
- [`investment-flow.md`](./flows/investment-flow.md) 🚧 **À créer** - Processus d'adoption ruche/olivier
- [`projet-suivi.md`](./flows/projet-suivi.md) 🚧 **À créer** - Dashboard projets personnalisés
- [`points-utilisation.md`](./flows/points-utilisation.md) 🚧 **À créer** - Achat avec points négociés

### 👑 **Niveau Ambassadeur** (`/flows/premium/`)
**Mois 3-4 - Abonnements premium**
- [`subscription-flow.md`](./flows/subscription-flow.md) 🚧 **À créer** - Abonnement ambassadeur
- [`allocation-flexible.md`](./flows/allocation-flexible.md) 🚧 **À créer** - Gestion allocation projets
- [`services-premium.md`](./flows/services-premium.md) 🚧 **À créer** - Concierge et événements

### 🔄 **Fonctionnalités Transversales** (`/shared/`)
- [`dashboard-adaptatif.md`](./shared/dashboard-adaptatif.md) 🚧 **À créer** - Interface selon niveau utilisateur
- [`conversion-flows.md`](./shared/conversion-flows.md) 🚧 **À créer** - Parcours d'upgrade
- [`navigation-globale.md`](./shared/navigation-globale.md) 🚧 **À créer** - Architecture navigation

## 🎯 Objectifs de Performance Modèle Hybride

### 📈 **Métriques Business par Niveau**

#### **Explorateur (Gratuit)**
- **Installations** : 1,000+ dans les 6 premiers mois
- **Exploration active** : 70% des installations explorent >5 projets
- **Time to first investment** : <7 jours après installation
- **Conversion rate** : 30% Explorateur → Protecteur

#### **Protecteur (Investissements)**
- **First investment** : 300 investissements dans l'année 1
- **Investment moyen** : 80€ per utilisateur
- **Renouvellement** : 85% après première expérience
- **Upgrade rate** : 15% Protecteur → Ambassadeur

#### **Ambassadeur (Abonnements)**
- **Subscriptions premium** : 50 abonnements dans l'année 1
- **Subscription moyenne** : 250€ per utilisateur
- **Retention** : 90% renouvellement annuel
- **Advocacy** : Partage actif de l'impact sur les réseaux
- **Points redemption rate** : >60%
- **Social engagement** : >30% users sharing
- **Average session time** : >8min (vs 5min MVP)

### 🎮 **Métriques Gamification**
- **Badge completion** : >40% users earn first badge
- **Level progression** : >50% users reach level 2
- **Challenge participation** : >25% users participate

### 🛒 **Métriques E-commerce**
- **Product browse rate** : >70% users explore catalog
- **Add to cart rate** : >40%
- **Checkout completion** : >80%
- **Repeat purchase** : >30%

## 🚀 Plan d'Implémentation V1

### **Mois 5 : E-commerce Foundation**
1. **Admin produits MVP** : Admin peut créer/gérer produits
2. **Catalog mobile** : Parcours découverte produits
3. **Product detail** : Fiches produit avec points pricing
4. **Basic cart** : Ajout/retrait produits

### **Mois 6 : Purchase Flow**
1. **Checkout flow** : Tunnel achat avec points
2. **Order management** : Historique commandes
3. **Inventory integration** : Gestion stock temps réel
4. **Shipping integration** : Suivi livraisons

### **Mois 7 : Social & Personalization**
1. **Review system** : Avis produits/projets
2. **Sharing features** : Partage social
3. **Recommendations** : Produits/projets personnalisés
4. **Wishlist** : Sauvegarde favoris

### **Mois 8 : Gamification & Polish**
1. **Badge system** : Badges investissement/engagement
2. **Progress tracking** : Niveaux utilisateur
3. **Push notifications** : Alertes intelligentes
4. **Performance optimization** : Polish final

## 💡 Nouvelles Features Phares

### 🏆 **Système de Badges**
```typescript
interface Badge {
  id: string
  name: string
  description: string
  criteria: BadgeCriteria
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  points_bonus: number
}

// Exemples badges
- "Premier Investisseur" : Premier investissement
- "Protecteur des Abeilles" : 3 ruches soutenues
- "Ambassadeur" : Premier abonnement Ambassadeur souscrit
- "Collectionneur" : 10 produits achetés
```

### 🎯 **Challenges Mensuels**
```typescript
interface Challenge {
  id: string
  title: string
  description: string
  duration: 'weekly' | 'monthly'
  reward: {
    points: number
    badge?: string
    exclusive_product?: string
  }
}

// Exemples challenges
- "Défi Biodiversité" : Investir dans 3 types de projets différents
- "Défi Gourmand" : Acheter 5 produits différents
- "Défi Partage" : Partager 3 projets sur social media
```

### 🔔 **Notifications Intelligentes**
```typescript
interface SmartNotification {
  type: 'points_earned' | 'harvest_ready' | 'product_available' | 'challenge_expiring'
  personalization: UserSegment
  timing: 'immediate' | 'optimal_time' | 'scheduled'
  content: PersonalizedContent
}

// Exemples notifications
- "🍯 Vos ruches ont produit 50 points !"
- "🌟 Nouveau défi disponible : +100 points bonus"
- "📦 Le miel que vous adoriez est de retour !"
```

## 🔗 Liens et Références

### **Migration depuis MVP**
Ces spécifications étaient dans l'ancienne structure :
- `../old/navigation/projects.md` → [`./navigation/projects.md`](./navigation/projects.md)
- `../old/navigation/rewards.md` → [`./navigation/rewards.md`](./navigation/rewards.md)
- `../old/flows/product-detail.md` → [`./flows/product-detail.md`](./flows/product-detail.md)

### **Spécifications Connexes**
- [../mvp/README.md](../mvp/README.md) - Prérequis MVP
- [../../admin-dashboard/v1/README.md](../../admin-dashboard/v1/README.md) - Features admin V1
- [../../ecommerce-site/v1/README.md](../../ecommerce-site/v1/README.md) - Site web V1

### **Documentation Technique**
- [../../../02-product/user-journeys.md](../../../02-product/user-journeys.md) - Parcours utilisateur V1
- [../../../01-strategy/kpis-metrics.md](../../../01-strategy/kpis-metrics.md) - Métriques de succès

---

**🎯 FOCUS :** V1 transforme l'app d'un outil d'investissement en une **plateforme d'engagement complète** qui fidélise les utilisateurs à long terme.