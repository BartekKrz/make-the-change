# 🛒 E-commerce Site MVP - Spécifications

**📍 VERSION: MVP** | **🗓️ TIMELINE: Mois 4** | **⭐️ PRIORITÉ: Complémentaire**

## 🎯 Scope MVP (Phase 1)

Le site e-commerce MVP complète l'écosystème Make the CHANGE en offrant une **vitrine web professionnelle** et une **alternative desktop** à l'app mobile pour les utilisateurs préférant le web.

### ✅ **Fonctionnalités MVP**
- **Vitrine publique** : Homepage, présentation concept, découverte produits
- **E-commerce basique** : Catalogue, fiches produit, panier avec points
- **Espace utilisateur web** : Dashboard, investissements, commandes
- **Parcours d'investissement web** : Découverte projets + souscription investissement Stripe
- **NOUVEAU: Dual billing web** : Choix mensuel/annuel + gestion abonnements Stripe Portal

### 🎯 **Positionnement Stratégique**
- **Complément mobile** : Pas de concurrence, mais complémentarité
- **Acquisition web** : SEO, réseaux sociaux, partnerships
- **Conversion desktop** : Utilisateurs préférant les écrans larges
- **Professionnalisation** : Crédibilité marque, partenaires B2B

## 📁 Structure des Spécifications

### 🏠 Vitrine Publique (`/public/`)
**Mois 4 - Semaines 13-14**
- [`home.md`](./public/home.md) 🚧 **À développer** - Homepage + proposition valeur
- [`catalog.md`](./public/catalog.md) 🚧 **À développer** - Catalogue produits public
- [`product-detail.md`](./public/product-detail.md) 🚧 **À développer** - Fiches produit détaillées
- [`projects.md`](./public/projects.md) 🚧 **À développer** - Découverte projets web
- [`how-it-works.md`](./public/how-it-works.md) 🚧 **À développer** - Explication concept
- [`contact.md`](./public/contact.md) 🚧 **À développer** - Contact & FAQ

### 🛒 Parcours d'Achat (`/checkout/`)
**Mois 4 - Semaine 15**
- [`cart.md`](./checkout/cart.md) 🚧 **À développer** - Panier avec points
- [`checkout.md`](./checkout/checkout.md) 🚧 **À développer** - Tunnel achat points
- [`order-confirmation.md`](./checkout/order-confirmation.md) 🚧 **À développer** - Confirmation commande

### 👤 Espace Utilisateur (`/account/`)
**Mois 4 - Semaine 16**
- [`dashboard.md`](./account/dashboard.md) 🚧 **À développer** - Dashboard web utilisateur
- [`my-investments.md`](./account/my-investments.md) 🚧 **À développer** - Portfolio des projets soutenus
- **NOUVEAU: Subscription management** : Stripe Customer Portal integration, changement plan mensuel/annuel

## 🎯 Objectifs MVP Site

### 📈 **Métriques Business**
- **SEO Ranking** : Top 3 "soutien biodiversité" en 6 mois
- **Organic traffic** : 1000+ visiteurs/mois après 3 mois
- **Conversion web** : 15% visiteurs → inscription (vs 25% mobile)
- **Desktop conversion** : 30% conversions via web

### 🖥️ **Métriques Techniques**
- **Core Web Vitals** : All green (LCP <2.5s, FID <100ms, CLS <0.1)
- **Lighthouse Score** : >90 (Performance, Accessibility, SEO)
- **Page Load Time** : <3s pour toutes pages
- **Mobile Responsive** : Perfect sur tous devices

### 🎨 **Métriques UX**
- **Homepage bounce rate** : <40%
- **Catalog engagement** : >60% viewers browse >3 produits
- **Subscription funnel** : >70% project detail → subscription form

## 🚀 Plan d'Implémentation Site MVP

### **Semaine 13 : Foundation & Public Pages**
```yaml
Setup: Next.js 15.5 (App Router) sur Vercel + shadcn/ui + Tailwind
Homepage: Hero section + value proposition + CTA
Catalog: Grid produits + search basique + filters
SEO: Meta tags + structured data + sitemap
```

### **Semaine 14 : Product & Project Discovery**
```yaml
Product Detail: Fiches riches + related products + CTA achat
Project Discovery: Grid projets + detail + subscription CTA
Navigation: Header/footer + breadcrumbs + menu mobile
Performance: Image optimization + lazy loading
```

### **Semaine 15 : E-commerce Flow**
```yaml
Shopping Cart: Add/remove + points calculation + checkout CTA
Checkout: Address form + payment points + confirmation
Integration: Sync avec admin orders + inventory
Testing: E2E purchase flow + edge cases
```

### **Semaine 16 : User Account & Polish**
```yaml
User Dashboard: Login/register + investissements + points balance
My Subscriptions: Portfolio view + performance + projections
Final Polish: Responsive design + accessibility + performance
Launch Prep: Analytics + monitoring + error tracking
```

## 🌟 Features Distinctives Web

### 🏠 **Homepage Optimisée Conversion**
```typescript
interface HomepageLayout {
  hero: {
    headline: "Soutenez la nature. Récoltez les fruits."
    subheading: "Devenez membre, soutenez des projets de biodiversité concrets et recevez des récompenses exclusives"
    primaryCTA: "Découvrir les projets"
    secondaryCTA: "Comment ça marche ?"
    backgroundImage: "hero-nature-landscape.webp"
  }
  featuredProducts: {
    title: "Nos récompenses les plus populaires"
    products: FeaturedProduct[6]  // Top sellers
    viewAllCTA: "Voir tous les produits"
  }
  howItWorks: {
    steps: [
      { icon: "🌱", title: "Devenez Membre", description: "Choisissez votre projet à soutenir" },
      { icon: "📈", title: "Gagnez des Points", description: "Recevez une valeur garantie de +20% à +30% en points" },
      { icon: "🎁", title: "Profitez", description: "Échangez vos points contre des produits premium" }
    ]
  }
  socialProof: {
    stats: ["150+ projets soutenus", "10K+ utilisateurs", "50K+ points échangés"]
    testimonials: CustomerTestimonial[3]
  }
}
```

### 🛒 **E-commerce Desktop Optimisé**
```typescript
interface DesktopEcommerce {
  catalogView: {
    layout: 'grid' | 'list'  // Toggle view
    itemsPerPage: 20         // Plus que mobile
    sidebar: {
      filters: CategoryFilter[]
      priceRange: PointsRange
      producers: ProducerFilter[]
      quickActions: ['wishlist', 'compare']
    }
    sorting: ['popularity', 'points_asc', 'points_desc', 'newest']
  }
  productDetail: {
    layout: 'two_column'     // Images left, info right
    imageGallery: {
      mainImage: 'large_view'
      thumbnails: 'sidebar'
      zoom: 'hover_magnify'
    }
    productInfo: {
      pricing: 'prominent_points_display'
      description: 'full_rich_text'
      specifications: 'expandable_tabs'
      reviews: 'integrated_display'
    }
    relatedProducts: 'below_fold_carousel'
  }
}
```

### 💰 **Subscription Flow Web - DUAL BILLING**
```typescript
interface WebSubscriptionFlow {
  projectDiscovery: {
    heroSection: ProjectHero
    detailedInfo: {
      producer: ProducerProfile
      location: InteractiveMap
      timeline: ProductionTimeline
      impact: ImpactMetrics
    }
    subscriptionWidget: {
      position: 'sticky_sidebar'
      tiers: SubscriptionTier[]
      // NOUVEAU: Dual Billing Choice
      billingToggle: {
        monthly: { ambassadeur: '18€/mois', premium: '32€/mois' }
        annual: { ambassadeur: '180€/an', premium: '320€/an', savings: '17%' }
      }
      calculator: PointsPreview
      cta: StripeCheckout
    }
  }
  checkoutExperience: {
    stripeModal: true  // No redirect, modal overlay
    billingConfirmation: 'selected_frequency_display'  // NOUVEAU
    confirmation: 'inline_success_message'
    followUp: 'dashboard_redirect'
  }
  // NOUVEAU: Subscription Management
  subscriptionManagement: {
    customerPortal: 'stripe_customer_portal_integration'
    planChanges: 'monthly_to_annual_upgrade_prompts'
    billingHistory: 'stripe_invoice_integration'
  }
}
```

## 🎨 Design System Web

### 🎯 **Brand Positioning**
- **Tone** : Professional yet approachable, nature-focused
- **Colors** : Primary green palette + honey accents
- **Typography** : Clean, readable (Inter font family)
- **Imagery** : High-quality nature photography, authentic producers

### 📱 **Responsive Strategy**
```css
/* Mobile First Approach */
.mobile-first {
  /* 320px+ : Mobile portrait */
  /* 480px+ : Mobile landscape */  
  /* 768px+ : Tablet portrait */
  /* 1024px+ : Desktop small */
  /* 1200px+ : Desktop large */
}

/* Key breakpoints */
- Mobile: Single column, touch-optimized
- Tablet: Two columns, hybrid interaction
- Desktop: Multi-column, mouse-optimized, sidebar navigation
```

## 🔗 Intégrations & Références

### **APIs Partagées**
- **Projects API** : Même source que mobile app
- **Products API** : Sync admin dashboard → web
- **Users API** : Single sign-on mobile ↔ web
- **Orders API** : Unified order management

### **SEO & Marketing**
```typescript
interface SEOStrategy {
  technicalSEO: {
    sitemap: 'auto_generated'
    robotsTxt: 'optimized_crawling'
    structuredData: 'product_schema + organization_schema'
    metaTags: 'dynamic_per_page'
  }
  contentSEO: {
    blogSection: 'future_v1'  // Pas MVP
    productDescriptions: 'rich_unique_content'
    categoryPages: 'seo_optimized_content'
    projectPages: 'detailed_impact_stories'
  }
  performanceSEO: {
    coreWebVitals: 'all_green'
    imageOptimization: 'webp_lazy_loading'
    codeOptimization: 'tree_shaking + minification'
  }
}
```

### **Analytics & Tracking**
```typescript
const webAnalytics = {
  googleAnalytics4: {
    ecommerce: 'enhanced_ecommerce_tracking'
    goals: ['newsletter_signup', 'product_view', 'subscription_conversion']
    audiences: ['repeat_visitors', 'high_value_users', 'mobile_vs_desktop']
  }
  heatmaps: 'hotjar_integration',  // V1 feature
  userTesting: 'monthly_usability_sessions'
}
```

## 🎯 Success Metrics MVP

### 🏆 **Launch Criteria (End Month 4)**
- [ ] All public pages functional & responsive
- [ ] E-commerce flow 100% tested
- [ ] User accounts & subscription flow working
- [ ] Core Web Vitals all green
- [ ] SEO basics implemented

### 📊 **3-Month Post-Launch Goals**
- **Organic Traffic** : 1000+ monthly visitors
- **Subscription Conversion** : 15%+ project detail → subscription
- **E-commerce Conversion** : 60%+ product view → add to cart
- **User Satisfaction** : 4.5+ stars user feedback

---

**🌐 VISION :** Le site web devient la **porte d'entrée professionnelle** de Make the CHANGE, crédibilisant la marque et diversifiant les canaux d'acquisition utilisateur.
