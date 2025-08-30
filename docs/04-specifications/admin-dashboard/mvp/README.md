# 💼 Admin Dashboard MVP - Spécifications

**📍 VERSION: MVP** | **🗓️ TIMELINE: 5 Mois (20 Semaines)** | **⭐️ PRIORITÉ: Critique**

## 🎯 Scope MVP (Phase 1)

Le dashboard admin MVP implémente la **stratégie "Admin-First"** : l'équipe peut créer et gérer du contenu **avant** que les fonctionnalités de consommation mobile soient prêtes. Cette approche élimine les blocages de développement et permet des tests avec données réelles.

### ✅ **Fonctionnalités Critiques**
- **Authentification admin** : Connexion sécurisée, gestion sessions
- **CRUD Projets complets** : Création, édition, gestion des projets de biodiversité
- **Gestion utilisateurs** : Supervision, métriques, support
- **NOUVEAU: Dual billing management** : Gestion abonnements mensuel/annuel, Stripe integration
- **CRUD Produits** : Catalogue e-commerce, stock, pricing en points
- **Gestion commandes** : Suivi, fulfillment, états livraison

### ⚡ **Workflow Admin-First**
```
Semaines 5-8  : Admin crée projets → Mobile découvre et investit (Semaines 9-12)
Semaines 13-14: Admin crée produits → Mobile achète avec points (Semaines 13-16)
```

## 📁 Structure des Spécifications

### 🔐 Authentication Admin (`/auth/`)
**Semaines 1-4**
- [`auth.md`](./auth/auth.md) 🚧 **À développer** - Connexion admin sécurisée

### 🏗️ Gestion Projets (`/projects/`)
**Semaines 5-8 - PRIORITÉ MAXIMALE**
- [`projects.md`](./projects/projects.md) 🚧 **À développer** - CRUD projets complet
- [`dashboard.md`](./projects/dashboard.md) 🚧 **À développer** - Vue d'ensemble projets
- [`partners.md`](./projects/partners.md) 🚧 **À développer** - Gestion producteurs/partenaires

### 👥 Gestion Utilisateurs (`/users/`)
**Semaines 9-12**
- [`users.md`](./users/users.md) 🚧 **À développer** - Gestion utilisateurs + métriques
- [`points.md`](./users/points.md) 🚧 **À développer** - Gestion système points
- **NOUVEAU: Subscriptions management** : Panel admin gestion abonnements dual billing

### 🛒 Gestion Produits (`/products/`)
**Semaines 13-14 - PRIORITÉ MAXIMALE**
- [`products.md`](./products/products.md) 🚧 **À développer** - CRUD produits e-commerce

### 📦 Gestion Commandes (`/orders/`)
**Semaines 15-16**
- [`orders.md`](./orders/orders.md) 🚧 **À développer** - Fulfillment commandes

## 🎯 Objectifs MVP Admin

### 📊 **Métriques Opérationnelles**
- **Time to create project** : <10min
- **Bulk operations** : >50 items par action
- **Admin task efficiency** : <3 clics pour tâches courantes
- **Data export speed** : <30s pour 1000 records

### 🎮 **Métriques Utilisabilité**
- **Admin onboarding** : <30min pour première utilisation
- **Error rate** : <2% sur opérations critiques
- **Search performance** : <2s pour recherche complexe
- **Mobile responsiveness** : Utilisable sur tablette

## 🚀 Plan d'Implémentation Admin MVP (20 Semaines)

### **Semaines 1-4 : Setup & Auth Foundation**
```yaml
Semaines 1-2: Setup Next.js 15.5 + tRPC + Supabase Auth
Semaines 3-4: Interface admin de base + connexion sécurisée + dashboard
```

### **Semaines 5-8 : Projects Management (PRIORITÉ MAXIMALE)**
```yaml
Semaine 5-6: CRUD projets complet (création, édition, images, géolocation)
Semaine 7: Tableau de bord projets (métriques, financement, producteurs)
Semaine 8: API projets pour mobile + intégrations partenaires
```

### **Semaines 9-12 : Users & Analytics**
```yaml
Semaine 9-10: Interface utilisateurs (profils, niveaux, métriques business)
Semaine 11: Système points (gestion, historique, ajustements, expiration)
Semaine 12: Analytics basiques (KPIs, exports, support client)
```

### **Semaines 13-16 : E-commerce Admin (PRIORITÉ MAXIMALE)**
```yaml
Semaine 13: CRUD produits (création, catégories, pricing points)
Semaine 14: Intégrations partenaires (HABEEBEE API, commissions, tracking)
Semaine 15-16: Gestion commandes (fulfillment, statuts, rapports ventes)
```

## 💼 Fonctionnalités Phares MVP

### 🏗️ **Project Management Avancé**
```typescript
interface ProjectAdmin {
  basicInfo: {
    name: string
    type: 'beehive' | 'olive_tree' | 'vineyard'
    description: string
    images: string[]
  }
  funding: {
    targetBudget: number
    currentFunding: number
    supportersCount: number
  }
  location: {
    coordinates: [number, number]
    address: string
    producer: ProducerId
    certifications: string[]
  }
  production: {
    expectedYield: number
    season: ProductionSeason
    qualityMetrics: QualityConfig
  }
}
```

### 👥 **User Management Dashboard - DUAL BILLING**
```typescript
interface UserAdminView {
  profile: UserProfile
  metrics: {
    totalContributed: number
    pointsBalance: number
    pointsGenerated: number
    pointsSpent: number
    joinDate: Date
    lastActivity: Date
  }
  // NOUVEAU: Dual Billing Management
  subscriptions: {
    current: SubscriptionSummary[]
    billing: {
      frequency: 'monthly' | 'annual'
      nextBillingDate: Date
      stripeSubscriptionId?: string  // pour monthly
      stripePaymentIntentId?: string // pour annual
      billingHistory: BillingHistoryItem[]
    }
    mrr: {
      monthlyValue: number  // MRR equivalent
      annualValue: number   // Annual contract value
    }
  }
  orders: OrderSummary[]
  support: {
    tickets: SupportTicket[]
    notes: AdminNote[]
  }
  actions: {
    adjustPoints: (amount: number, reason: string) => void
    sendMessage: (message: string) => void
    updateKYC: (status: KYCStatus) => void
    // NOUVEAU: Dual Billing Actions
    changeSubscriptionFrequency: (frequency: 'monthly' | 'annual') => void
    openStripeCustomerPortal: () => void
    processRefund: (amount: number, reason: string) => void
  }
}
```

### 🛒 **Product & Inventory Management**
```typescript
interface ProductAdmin {
  basicInfo: {
    name: string
    description: string
    category: CategoryId
    producer: ProducerId
    images: string[]
  }
  pricing: {
    pointsPrice: number
    costBasis: number  // Coût interne
    margin: number     // Marge calculée
  }
  inventory: {
    currentStock: number
    reservedStock: number
    lowStockThreshold: number
    nextRestock: Date
  }
  performance: {
    totalSales: number
    conversionRate: number
    averageRating: number
    returnRate: number
  }
}
```

## 🔗 Références et Liens

### **Spécifications à Développer (PRIORITÉ)**
1. **URGENT - Semaine 5** : [Projects CRUD](./projects/projects.md) - Création projets
2. **URGENT - Semaine 13** : [Products CRUD](./products/products.md) - Création produits
3. **IMPORTANT - Semaine 9** : [Users Management](./users/users.md) - Gestion utilisateurs

### **Alignement Mobile/Web**
- Toute création admin → immédiatement disponible mobile
- [../mobile-app/mvp/flows/project-detail.md](../mobile-app/mvp/flows/project-detail.md) consomme projets admin
- [../mobile-app/v1/navigation/rewards.md](../mobile-app/v1/navigation/rewards.md) consomme produits admin

### **Architecture Technique**
- [../../../03-technical/architecture-overview.md](../../../03-technical/architecture-overview.md) - Stack Next.js (App Router) sur Vercel
- [../../../07-project-management/sprint-planning.md](../../../07-project-management/sprint-planning.md) - Planning détaillé

---

**⚡ ADMIN-FIRST SUCCESS :** L'admin peut créer du contenu et l'équipe peut tester avec des données réelles dès la semaine 6, **avant** que l'app mobile soit 100% terminée.
