# 💼 Admin Dashboard MVP - Spécifications

**📍 VERSION: MVP** | **🗓️ TIMELINE: Mois 1-4** | **⭐️ PRIORITÉ: Critique**

## 🎯 Scope MVP (Phase 1)

Le dashboard admin MVP implémente la **stratégie "Admin-First"** : l'équipe peut créer et gérer du contenu **avant** que les fonctionnalités de consommation mobile soient prêtes. Cette approche élimine les blocages de développement et permet des tests avec données réelles.

### ✅ **Fonctionnalités Critiques**
- **Authentification admin** : Connexion sécurisée, gestion sessions
- **CRUD Projets complets** : Création, édition, gestion des projets de biodiversité
- **Gestion utilisateurs** : Supervision, métriques, support
- **CRUD Produits** : Catalogue e-commerce, stock, pricing en points
- **Gestion commandes** : Suivi, fulfillment, états livraison

### ⚡ **Workflow Admin-First**
```
Semaine 5-6  : Admin crée projets → Mobile découvre et s'abonne
Semaine 13-14: Admin crée produits → Mobile achète avec points
```

## 📁 Structure des Spécifications

### 🔐 Authentication Admin (`/auth/`)
**Mois 1 - Semaine 3**
- [`auth.md`](./auth/auth.md) 🚧 **À développer** - Connexion admin sécurisée

### 🏗️ Gestion Projets (`/projects/`)
**Mois 2 - Semaines 5-6 - PRIORITÉ MAXIMALE**
- [`projects.md`](./projects/projects.md) 🚧 **À développer** - CRUD projets complet
- [`dashboard.md`](./projects/dashboard.md) 🚧 **À développer** - Vue d'ensemble projets
- [`partners.md`](./projects/partners.md) 🚧 **À développer** - Gestion producteurs/partenaires

### 👥 Gestion Utilisateurs (`/users/`)
**Mois 3 - Semaines 9-10**
- [`users.md`](./users/users.md) 🚧 **À développer** - Gestion utilisateurs + métriques
- [`points.md`](./users/points.md) 🚧 **À développer** - Gestion système points

### 🛒 Gestion Produits (`/products/`)
**Mois 4 - Semaine 13 - PRIORITÉ MAXIMALE**
- [`products.md`](./products/products.md) 🚧 **À développer** - CRUD produits e-commerce

### 📦 Gestion Commandes (`/orders/`)
**Mois 4 - Semaines 15-16**
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

## 🚀 Plan d'Implémentation Admin MVP

### **Mois 1 : Setup & Auth (Semaines 1-4)**
```yaml
Semaine 1-2: Setup Vercel Edge Functions + Auth système
Semaine 3-4: Interface admin de base + connexion sécurisée
```

### **Mois 2 : Projects Management (Semaines 5-8)**
```yaml
Semaine 5: CRUD projets complet (création, édition, suppression)
Semaine 6: Interface projets avancée (images, géolocation, producteurs)
Semaine 7: Tableau de bord projets (métriques, investissements)
Semaine 8: Intégration mobile (API projets disponible)
```

### **Mois 3 : Users & Analytics (Semaines 9-12)**
```yaml
Semaine 9: Interface utilisateurs (liste, profils, métriques)
Semaine 10: Système points (gestion, historique, ajustements)
Semaine 11: Analytics basiques (KPIs, exports, rapports)
Semaine 12: Tools support client (messages, assistance)
```

### **Mois 4 : E-commerce Admin (Semaines 13-16)**
```yaml
Semaine 13: CRUD produits (création, catégories, pricing points)
Semaine 14: Gestion stock (inventaire, alerts, réassort)
Semaine 15: Gestion commandes (statuts, fulfillment, tracking)
Semaine 16: Rapports e-commerce (ventes, conversion, rentabilité)
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

### 👥 **User Management Dashboard**
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
  subscriptions: SubscriptionSummary[]
  orders: OrderSummary[]
  support: {
    tickets: SupportTicket[]
    notes: AdminNote[]
  }
  actions: {
    adjustPoints: (amount: number, reason: string) => void
    sendMessage: (message: string) => void
    updateKYC: (status: KYCStatus) => void
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
- [../../../03-technical/architecture-overview.md](../../../03-technical/architecture-overview.md) - Stack Vercel Edge Functions
- [../../../07-project-management/sprint-planning.md](../../../07-project-management/sprint-planning.md) - Planning détaillé

---

**⚡ ADMIN-FIRST SUCCESS :** L'admin peut créer du contenu et l'équipe peut tester avec des données réelles dès la semaine 6, **avant** que l'app mobile soit 100% terminée.