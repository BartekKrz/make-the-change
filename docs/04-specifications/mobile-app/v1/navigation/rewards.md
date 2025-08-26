# Récompenses (Catalogue E-commerce)

## 🎯 Objectif

Permettre aux utilisateurs d'échanger leurs points contre des produits premium (miel, huile d'olive, cosmétiques naturels) avec une expérience e-commerce optimisée et gamifiée.

## 🎨 Design & Layout

### Structure Visuelle

```text
┌─────────────────────────┐
│ 1,250 pts 🛒 [3] 🔔 ⚙️ │
│                         │
│ 🎁 Vos points expirent  │
│    dans 45 jours        │
│                         │
│ 🔥 Tendances            │
│ ┌─────┐ ┌─────┐ ┌─────┐ │
│ │🍯   │ │🌿   │ │🧴   │ │
│ │Miel │ │Oliv │ │Cosm │ │
│ └─────┘ └─────┘ └─────┘ │
│                         │
│ 💎 Nouveautés           │
│ ┌───────────────────────┐ │
│ │ 🍯 Miel d'Acacia     │ │
│ │ 150 pts • ⭐⭐⭐⭐⭐   │ │
│ │ [Ajouter au panier]   │ │
│ └───────────────────────┘ │
│ ┌───────────────────────┐ │
│ │ 🌿 Huile Extra Vierge │ │
│ │ 300 pts • ⭐⭐⭐⭐⭐   │ │
│ │ [Ajouter au panier]   │ │
│ └───────────────────────┘ │
│                         │
│ ••••• Navigation ••••• │
└─────────────────────────┘
```

### Design System

- **Header** : Points balance + panier + notifications
- **Expiry Alert** : Warning banner si points < 30 jours expiration
- **Category Chips** : Horizontal scroll (Miel, Huiles, Cosmétiques, Coffrets)
- **Product Cards** : Grid 2 colonnes sur mobile, full width en liste
- **Points Display** : Couleur verte, icône pts visible

## 📱 Composants UI

### Points Header

```typescript
interface PointsHeaderProps {
  currentPoints: number
  expiringPoints?: {
    amount: number
    expiryDate: Date
  }
  cartItemCount: number
  onCartPress: () => void
  onNotificationPress: () => void
}
```

### Product Card

```typescript
interface ProductCardProps {
  product: {
    id: string
    name: string
    description: string
    image: string
    pointsPrice: number
    originalPrice?: number // €
    rating: number
    reviewCount: number
    category: string
    tags: string[]
    availability: 'in_stock' | 'low_stock' | 'out_of_stock'
    featured: boolean
    isNew: boolean
  }
  onAddToCart: (productId: string) => void
  onPress: (productId: string) => void
  layout: 'grid' | 'list'
}
```

### Category Filter

```typescript
interface CategoryFilterProps {
  categories: {
    id: string
    label: string
    icon: string
    productCount: number
    featured: boolean
  }[]
  selectedCategory?: string
  onCategorySelect: (categoryId: string) => void
}
```

### Cart Summary

```typescript
interface CartSummaryProps {
  items: CartItem[]
  totalPoints: number
  availablePoints: number
  onViewCart: () => void
  onCheckout: () => void
  canAfford: boolean
}
```

### Points Expiry Banner

```typescript
interface ExpiryBannerProps {
  expiringPoints: {
    amount: number
    expiryDate: Date
    daysLeft: number
  }
  onViewDetails: () => void
  onDismiss: () => void
  severity: 'info' | 'warning' | 'urgent'
}
```

## 🔄 États & Interactions

### États de Chargement

#### Initial Load

```typescript
interface RewardsLoadingState {
  products: 'loading' | 'loaded' | 'empty' | 'error'
  categories: 'loading' | 'loaded' | 'error'
  pointsBalance: 'loading' | 'loaded' | 'error'
  cart: 'loading' | 'loaded' | 'syncing' | 'error'
}
```

#### Product Actions

```typescript
interface ProductActionStates {
  addingToCart: Set<string>    // Product IDs being added
  loadingDetails: Set<string>  // Product IDs loading details
  outOfStock: Set<string>      // Product IDs out of stock
}
```

### Interactions Gamifiées

#### Add to Cart Animation

```typescript
const addToCartAnimation = {
  productCard: {
    type: 'scale',
    scale: 0.95,
    duration: 100,
    haptic: 'light'
  },
  pointsCounter: {
    type: 'bounce',
    duration: 400,
    haptic: 'success'
  },
  cartIcon: {
    type: 'pulse',
    duration: 300,
    badgeUpdate: true
  }
}
```

#### Points Celebration

```typescript
// Quand utilisateur gagne points
const pointsCelebration = {
  trigger: 'points_earned',
  animation: {
    confetti: true,
    duration: 2000,
    colors: ['#4CAF50', '#FFD700', '#FF6B6B']
  },
  haptic: 'notificationSuccess',
  sound: 'points_earned.mp3'
}
```

### Smart Recommendations

```typescript
interface RecommendationEngine {
  basedOnPurchases: ProductSummary[]
  basedOnBrowsing: ProductSummary[]
  trending: ProductSummary[]
  aboutToExpire: ProductSummary[]  // Si points expirent bientôt
  newArrivals: ProductSummary[]
}
```

## 📡 API & Données

### Products Catalog Endpoint

```typescript
GET /api/rewards/catalog
Query Parameters:
- category?: string
- page: number
- limit: number
- sortBy?: 'points_asc' | 'points_desc' | 'rating' | 'newest'
- inStock?: boolean

interface CatalogResponse {
  products: ProductSummary[]
  categories: Category[]
  pagination: PaginationInfo
  userContext: {
    availablePoints: number
    expiringPoints?: ExpiryInfo
    recommendedProducts: string[]
  }
}
```

### Cart Management

```typescript
// Add to cart
POST /api/rewards/cart/items
{
  productId: string
  quantity: number
}

// Get cart
GET /api/rewards/cart
Response: {
  items: CartItem[]
  totalPoints: number
  validUntil: Date
  canAfford: boolean
}

// Update cart item
PUT /api/rewards/cart/items/{itemId}
{
  quantity: number
}

// Remove from cart
DELETE /api/rewards/cart/items/{itemId}
```

### Points Balance & Expiry

```typescript
GET /api/points/balance
Response: {
  current: number
  pending: number
  lifetime: number
  expiring: {
    amount: number
    expiryDate: Date
    daysLeft: number
  }[]
  history: PointsTransaction[]
}
```

### Product Recommendations

```typescript
GET /api/rewards/recommendations
Query Parameters:
- type?: 'purchases' | 'browsing' | 'trending' | 'expiring'
- limit?: number

Response: {
  recommendations: ProductSummary[]
  reason: string
  confidence: number
}
```

## ✅ Validations

### Purchase Validation

```typescript
interface PurchaseValidation {
  pointsBalance: {
    sufficient: boolean
    required: number
    available: number
  }
  productAvailability: {
    inStock: boolean
    quantity: number
  }
  userEligibility: {
    accountVerified: boolean
    addressComplete: boolean
    termsAccepted: boolean
  }
}
```

### Business Rules

#### Points Expiry

```typescript
const expiryRules = {
  warningThresholds: [30, 14, 7, 3, 1], // jours
  warningMessages: {
    30: "Vos points expirent dans 30 jours",
    14: "⚠️ Vos points expirent bientôt !",
    7: "🚨 Dernière semaine pour utiliser vos points",
    3: "🔥 3 jours pour utiliser vos points !",
    1: "⏰ Vos points expirent demain !"
  },
  colors: {
    30: 'blue',
    14: 'orange', 
    7: 'red',
    3: 'red',
    1: 'red'
  }
}
```

#### Stock Management

```typescript
const stockRules = {
  lowStock: {
    threshold: 5,
    message: "Plus que {count} en stock !",
    urgency: 'medium'
  },
  outOfStock: {
    message: "Temporairement indisponible",
    action: 'notify_when_available'
  },
  preOrder: {
    message: "Précommande - Livraison {date}",
    action: 'allow_preorder'
  }
}
```

## 🚨 Gestion d'Erreurs

### Purchase Errors

```typescript
const purchaseErrors = {
  insufficientPoints: {
    code: 'INSUFFICIENT_POINTS',
    message: "Points insuffisants pour cet achat",
    action: {
      showPointsNeeded: true,
      suggestSimilarProducts: true,
      linkToEarnPoints: true
    }
  },
  productUnavailable: {
    code: 'PRODUCT_UNAVAILABLE',
    message: "Produit temporairement indisponible", 
    action: {
      removeFromCart: true,
      suggestAlternatives: true,
      notifyWhenAvailable: true
    }
  },
  cartExpired: {
    code: 'CART_EXPIRED',
    message: "Votre panier a expiré",
    action: {
      clearCart: true,
      redirectToCatalog: true,
      saveForLater: true
    }
  }
}
```

### Network Errors

```typescript
const networkErrorHandling = {
  catalogLoadFailed: {
    message: "Impossible de charger le catalogue",
    fallback: "show_cached_products",
    action: "retry_loading"
  },
  cartSyncFailed: {
    message: "Synchronisation du panier échouée",
    fallback: "show_local_cart",
    action: "retry_sync_cart"
  },
  pointsUpdateFailed: {
    message: "Impossible de mettre à jour les points",
    fallback: "show_cached_balance",
    action: "retry_points_sync"
  }
}
```

## 🔗 Navigation

### Internal Navigation

#### From Rewards Catalog

```typescript
const navigationRoutes = {
  'ProductDetail': {
    route: 'ProductDetail',
    params: { productId: string },
    animation: 'slideInRight'
  },
  'Cart': {
    route: 'Cart',
    presentation: 'modal',
    animation: 'slideInUp'
  },
  'Checkout': {
    route: 'Checkout',
    presentation: 'modal',
    animation: 'slideInRight'
  },
  'PointsHistory': {
    route: 'PointsHistory',
    presentation: 'modal'
  }
}
```

#### Cart Flow

```typescript
const cartFlow = {
  'AddToCart': 'RewardsCatalog',
  'ViewCart': 'CartScreen',
  'Checkout': 'CheckoutScreen',
  'OrderConfirmation': 'OrderConfirmationScreen',
  'OrderTracking': 'OrderTrackingScreen'
}
```

### Deep Links

```typescript
const rewardsDeepLinks = {
  'makethechange://rewards': 'RewardsScreen',
  'makethechange://rewards/category/honey': 'RewardsScreen + CategoryFilter',
  'makethechange://rewards/product/:id': 'ProductDetailScreen',
  'makethechange://rewards/cart': 'CartScreen',
  'makethechange://rewards/checkout': 'CheckoutScreen'
}
```

## 📝 Tests Utilisateur

### Shopping Journey Tests

#### Discovery to Purchase

1. **Catalog Browsing** : User finds desired products
2. **Product Comparison** : User compares options
3. **Cart Management** : User adds/removes items
4. **Checkout Process** : User completes purchase

#### Points Management

1. **Balance Awareness** : User understands available points
2. **Expiry Understanding** : User reacts to expiry warnings
3. **Earning Motivation** : User seeks ways to earn more points

### A/B Tests

#### Product Layout

- **Variant A** : Grid layout (2 colonnes)
- **Variant B** : List layout (full width)
- **Variant C** : Mixed layout (featured + grid)
- **Métrique** : Product view rate et add-to-cart rate

#### Points Display

- **Variant A** : Points only
- **Variant B** : Points + € equivalent
- **Variant C** : Gamified level system
- **Métrique** : Purchase completion rate

### Conversion Optimization

```typescript
interface ConversionMetrics {
  catalogViewToPDP: number        // Target: >25%
  pdpToAddToCart: number         // Target: >15%  
  cartToCheckout: number         // Target: >70%
  checkoutToComplete: number     // Target: >85%
  pointsUtilizationRate: number  // Target: >60%
}
```

## 💾 Stockage Local

### Shopping Data

```typescript
interface RewardsCache {
  products: {
    catalog: ProductSummary[]
    details: { [productId: string]: ProductDetail }
    lastFetch: number
    ttl: number // 30 minutes
  }
  cart: {
    items: CartItem[]
    lastSync: number
    localChanges: boolean
  }
  pointsBalance: {
    current: number
    expiring: ExpiryInfo[]
    lastUpdate: number
  }
  userPreferences: {
    favoriteCategories: string[]
    viewHistory: string[]
    wishlist: string[]
  }
}
```

### Offline Capabilities

```typescript
interface OfflineShoppingCapabilities {
  browseCatalog: boolean         // Cached products only
  viewProductDetails: boolean    // If cached
  addToWishlist: boolean        // Sync when online
  addToCart: boolean            // Local cart, sync later
  completeCheckout: false       // Requires connection
  viewOrderHistory: boolean     // If cached
}
```

### Analytics Events

```typescript
const rewardsEvents = {
  'catalog_viewed': {
    timestamp: number,
    category?: string,
    source: 'tab_switch' | 'deep_link'
  },
  'product_viewed': {
    product_id: string,
    category: string,
    position_in_list?: number,
    timestamp: number
  },
  'add_to_cart': {
    product_id: string,
    points_price: number,
    cart_value_before: number,
    cart_value_after: number,
    timestamp: number
  },
  'cart_viewed': {
    items_count: number,
    total_points: number,
    can_afford: boolean,
    timestamp: number
  },
  'points_expiry_warning_shown': {
    expiring_amount: number,
    days_left: number,
    warning_type: 'banner' | 'notification',
    timestamp: number
  }
}
```

## 🔧 Gamification & Engagement

### Loyalty Features

```typescript
interface LoyaltyFeatures {
  tierSystem: {
    bronze: { threshold: 0, benefits: ['standard_shipping'] }
    silver: { threshold: 1000, benefits: ['priority_support', 'exclusive_products'] }
    gold: { threshold: 5000, benefits: ['free_shipping', 'early_access', 'bonus_points'] }
  }
  achievements: {
    firstPurchase: { points: 50, badge: 'first_buyer' }
    loyalCustomer: { points: 100, badge: 'loyal_customer' }
    reviewWriter: { points: 25, badge: 'reviewer' }
  }
  referralProgram: {
    referrerBonus: 200,
    refereeBonus: 100,
    maxReferrals: 10
  }
}
```

### Personalization

```typescript
interface PersonalizationEngine {
  productRecommendations: {
    collaborative: ProductSummary[]  // Based on similar users
    contentBased: ProductSummary[]   // Based on user preferences
    trending: ProductSummary[]       // Popular products
  }
  customizedExperience: {
    preferredCategories: string[]
    priceRange: { min: number; max: number }
    brandPreferences: string[]
    seasonalInterests: string[]
  }
}
```
