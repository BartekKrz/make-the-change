# Détail du Produit (Récompenses)

## 🎯 Objectif

Présenter de manière détaillée un produit récompense (miel, huile d'olive, cosmétiques) avec toutes les informations nécessaires pour un achat éclairé via points.

## 🎨 Design & Layout

### Structure Visuelle

```text
┌─────────────────────────┐
│ [←] 🍯 Miel Bio      ⭐♡ │
│                         │
│ ┌───────────────────────┐ │
│ │     [Image Hero]      │ │
│ │   📸 📸 📸 📸 📸    │ │
│ └───────────────────────┘ │
│                         │
│ Miel d'Acacia Bio       │
│ 150 pts • ⭐⭐⭐⭐⭐ (4.9) │
│ 📍 Provence • 500g      │
│                         │
│ ┌─────┬─────┬─────┬─────┐ │
│ │🌿Bio│📦500│🍯Pur│⭐4.9│ │
│ │Cert │ g   │100%│Note │ │
│ └─────┴─────┴─────┴─────┘ │
│                         │
│ 📄 Description          │
│ Ce miel d'acacia...     │
│                         │
│ 🧑‍🌾 Producteur           │
│ ┌─────────────────────────┐│
│ │ [Photo] Marie Lavande ⭐││
│ │ Apicultrice depuis 15ans││
│ │ 🏅 Médaille d'or 2024  ││
│ └─────────────────────────┘│
│                         │
│ 📊 Informations         │
│ • Origine: Provence     │
│ • Récolte: Été 2024     │
│ • Conservation: 2 ans   │
│ • Allergènes: Aucun     │
│                         │
│ 💬 Avis (89)            │
│ [Liste des avis]        │
│                         │
│ 📦 Livraison gratuite   │
│ Sous 3-5 jours ouvrés  │
│                         │
│ [AJOUTER AU PANIER]     │
│ 150 pts disponibles     │
│                         │
│ ••••• Navigation ••••• │
└─────────────────────────┘
```

### Design System

- **Hero Gallery** : Carousel d'images produit haute qualité
- **Key Features** : Grid de caractéristiques importantes
- **Producer Profile** : Card avec credentials et awards
- **Product Info** : Expandable sections avec détails
- **Reviews** : Section avec rating et commentaires
- **Points Display** : Prominent avec disponibilité

## 📱 Composants UI

### Product Header

```typescript
interface ProductHeaderProps {
  product: {
    id: string
    name: string
    pointsPrice: number
    originalPrice?: number
    rating: number
    reviewCount: number
    location: string
    weight: string
    category: string
    inStock: boolean
    stockLevel: 'high' | 'medium' | 'low'
  }
  onBack: () => void
  onShare: () => void
  onFavorite: () => void
  isFavorite: boolean
}
```

### Product Image Gallery

```typescript
interface ProductGalleryProps {
  images: {
    id: string
    url: string
    caption?: string
    type: 'hero' | 'detail' | 'packaging' | 'ingredient' | 'certificate'
  }[]
  onImagePress: (imageIndex: number) => void
  onZoomRequest: () => void
}
```

### Product Features Grid

```typescript
interface FeaturesGridProps {
  features: {
    organic: boolean
    pureHoney: boolean
    localProduction: boolean
    awardWinning: boolean
    rawHoney: boolean
    sustainable: boolean
  }
  certifications: {
    name: string
    issuer: string
    imageUrl: string
    validUntil?: Date
  }[]
}
```

### Producer Profile

```typescript
interface ProducerProfileProps {
  producer: {
    id: string
    firstName: string
    lastName: string
    avatar?: string
    experience: number
    location: string
    specialties: string[]
    awards: {
      name: string
      year: number
      issuer: string
    }[]
    rating: number
    productsCount: number
    bio: string
    verified: boolean
  }
  onViewProfile: (producerId: string) => void
  onContactProducer: (producerId: string) => void
}
```

### Product Information

```typescript
interface ProductInfoProps {
  nutritionalInfo?: {
    calories: number
    sugars: number
    proteins: number
    fats: number
    perServing: string
  }
  allergens: string[]
  ingredients: string[]
  origin: {
    region: string
    harvestDate: Date
    batchNumber: string
  }
  storage: {
    temperature: string
    humidity: string
    shelfLife: string
    instructions: string[]
  }
  shipping: {
    weight: number
    dimensions: string
    fragile: boolean
    specialHandling?: string
  }
}
```

### Reviews Section

```typescript
interface ProductReviewsProps {
  reviews: {
    id: string
    user: {
      firstName: string
      avatar?: string
      verified: boolean
    }
    rating: number
    title?: string
    comment: string
    date: Date
    verified: boolean
    helpful: number
    images?: string[]
    productVariant?: string
  }[]
  summary: {
    averageRating: number
    totalReviews: number
    ratingDistribution: { [stars: number]: number }
    verifiedPurchases: number
  }
  onViewAllReviews: () => void
  onReviewHelpful: (reviewId: string) => void
}
```

### Add to Cart Section

```typescript
interface AddToCartProps {
  product: ProductSummary
  userPoints: {
    current: number
    pending: number
    expiringPoints?: {
      amount: number
      expiryDate: Date
    }
  }
  quantity: number
  onQuantityChange: (quantity: number) => void
  onAddToCart: () => void
  onBuyNow: () => void
  canAfford: boolean
  isInCart: boolean
  maxQuantity: number
}
```

## 🔄 États & Interactions

### Product Data States

```typescript
interface ProductLoadingState {
  productDetails: 'loading' | 'loaded' | 'error'
  producerProfile: 'loading' | 'loaded' | 'error'
  reviews: 'loading' | 'loaded' | 'empty' | 'error'
  relatedProducts: 'loading' | 'loaded' | 'error'
  stockLevel: 'checking' | 'in_stock' | 'low_stock' | 'out_of_stock'
}
```

### Cart Interaction States

```typescript
interface CartInteractionState {
  addingToCart: boolean
  quantity: number
  showQuantitySelector: boolean
  cartAnimation: 'idle' | 'adding' | 'success' | 'error'
}
```

### Image Gallery Interactions

```typescript
const galleryBehavior = {
  tap: {
    action: 'open_fullscreen',
    animation: 'zoomIn',
    allowPinchZoom: true
  },
  swipe: {
    horizontal: 'change_image',
    vertical: 'close_gallery'
  },
  longPress: {
    action: 'share_image',
    haptic: 'medium'
  }
}
```

### Quantity Selection

```typescript
const quantityBehavior = {
  controls: {
    stepper: true,
    textInput: false,
    maxQuantity: 10
  },
  validation: {
    minimum: 1,
    stockLimit: true,
    pointsLimit: true
  },
  feedback: {
    priceUpdate: 'realtime',
    stockWarning: true,
    pointsWarning: true
  }
}
```

### Smart Recommendations

```typescript
interface RecommendationEngine {
  basedOnViewing: ProductSummary[]
  basedOnCart: ProductSummary[]
  basedOnReviews: ProductSummary[]
  frequentlyBoughtTogether: ProductSummary[]
  fromSameProducer: ProductSummary[]
  seasonal: ProductSummary[]
}
```

## 📡 API & Données

### Product Detail Endpoint

```typescript
GET /api/products/{productId}
Authorization: Bearer {accessToken}

interface ProductDetailResponse {
  product: {
    id: string
    name: string
    description: string
    pointsPrice: number
    originalPrice?: number
    category: string
    subcategory: string
    tags: string[]
    images: ProductImage[]
    features: ProductFeatures
    specifications: ProductSpecifications
    nutritionalInfo?: NutritionalInfo
    stockLevel: number
    availability: 'in_stock' | 'low_stock' | 'out_of_stock'
    shippingInfo: ShippingInfo
  }
  producer: ProducerProfile
  reviews: {
    items: Review[]
    summary: ReviewSummary
    pagination: PaginationInfo
  }
  recommendations: {
    similar: ProductSummary[]
    bundled: ProductSummary[]
    trending: ProductSummary[]
  }
  userContext: {
    canAfford: boolean
    inWishlist: boolean
    previouslyPurchased: boolean
    reviewEligible: boolean
  }
}
```

### Stock & Availability

```typescript
GET /api/products/{productId}/availability
Response: {
  inStock: boolean
  quantity: number
  stockLevel: 'high' | 'medium' | 'low'
  restockDate?: Date
  maxOrderQuantity: number
  reservationExpiry?: Date
}

POST /api/products/{productId}/reserve
{
  quantity: number
  duration: number // minutes
}
```

### Add to Cart

```typescript
POST /api/cart/items
{
  productId: string
  quantity: number
  replaceIfExists?: boolean
}

interface AddToCartResponse {
  success: boolean
  cartItem?: CartItem
  cart: {
    items: CartItem[]
    totalPoints: number
    totalItems: number
  }
  error?: {
    code: string
    message: string
    canRetry: boolean
  }
}
```

### Product Reviews

```typescript
GET /api/products/{productId}/reviews
Query Parameters:
- page: number
- limit: number
- sort: 'newest' | 'oldest' | 'highest_rated' | 'most_helpful'
- verified_only?: boolean
- rating_filter?: number

POST /api/products/{productId}/reviews
{
  rating: number
  title?: string
  comment: string
  images?: File[]
  recommend: boolean
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
    expiring?: ExpiringPoints
  }
  productAvailability: {
    inStock: boolean
    quantity: number
    maxPerOrder: number
  }
  shippingEligibility: {
    deliveryAvailable: boolean
    shippingAddress: boolean
    restrictedItems: boolean
  }
  userEligibility: {
    accountVerified: boolean
    ageRestriction?: number
    locationRestriction?: boolean
  }
}
```

### Business Rules

#### Stock Management

```typescript
const stockRules = {
  reservation: {
    duration: 15, // minutes
    maxQuantity: 5,
    releaseOnExpiry: true
  },
  lowStock: {
    threshold: 10,
    showWarning: true,
    limitQuantity: true
  },
  outOfStock: {
    hideAddToCart: true,
    showNotifyWhenAvailable: true,
    suggestAlternatives: true
  }
}
```

#### Points Economy

```typescript
const pointsRules = {
  pricing: {
    baseConversion: 1, // 1€ = 1 point
    discountTiers: {
      premium: 0.9,  // 10% discount
      gold: 0.85,    // 15% discount
      platinum: 0.8  // 20% discount
    }
  },
  expiry: {
    warningDays: 30,
    urgentDays: 7,
    prioritizeExpiring: true
  }
}
```

## 🚨 Gestion d'Erreurs

### Product Availability Errors

```typescript
const availabilityErrors = {
  outOfStock: {
    code: 'OUT_OF_STOCK',
    message: "Ce produit n'est plus en stock",
    actions: {
      notifyWhenAvailable: true,
      suggestAlternatives: true,
      removeFromCart: true
    }
  },
  insufficientStock: {
    code: 'INSUFFICIENT_STOCK',
    message: "Stock insuffisant pour cette quantité",
    actions: {
      adjustQuantity: true,
      showAvailableQuantity: true
    }
  },
  reservationExpired: {
    code: 'RESERVATION_EXPIRED',
    message: "Votre réservation a expiré",
    actions: {
      tryReserveAgain: true,
      checkNewPrice: true
    }
  }
}
```

### Points & Payment Errors

```typescript
const pointsErrors = {
  insufficientPoints: {
    code: 'INSUFFICIENT_POINTS',
    message: "Points insuffisants pour cet achat",
    actions: {
      showPointsNeeded: true,
      suggestEarnMore: true,
      adjustQuantity: true
    }
  },
  pointsExpired: {
    code: 'POINTS_EXPIRED',
    message: "Certains points ont expiré",
    actions: {
      refreshBalance: true,
      recalculateCart: true
    }
  }
}
```

### Data Loading Errors

```typescript
const dataErrors = {
  productLoadFailed: {
    message: "Impossible de charger les détails du produit",
    fallback: "show_basic_info",
    action: "retry_load"
  },
  imagesLoadFailed: {
    message: "Erreur lors du chargement des images",
    fallback: "show_placeholder",
    action: "retry_images"
  },
  reviewsLoadFailed: {
    message: "Impossible de charger les avis",
    fallback: "hide_reviews_section",
    action: "retry_reviews"
  }
}
```

## 🔗 Navigation

### Product Detail Navigation

#### From Product Detail

```typescript
const navigationRoutes = {
  'AddToCart': {
    action: 'add_to_cart',
    feedback: 'haptic_and_animation',
    redirect: false
  },
  'ViewCart': {
    route: 'Cart',
    presentation: 'modal',
    animation: 'slideInUp'
  },
  'QuickBuy': {
    route: 'Checkout',
    params: { productId: string, quantity: number },
    presentation: 'modal'
  },
  'ProducerProfile': {
    route: 'ProducerProfile',
    params: { producerId: string },
    animation: 'slideInRight'
  },
  'ReviewsAll': {
    route: 'ProductReviews',
    params: { productId: string },
    animation: 'slideInRight'
  },
  'ImageGallery': {
    route: 'ImageGallery',
    params: { images: ProductImage[], initialIndex: number },
    presentation: 'fullScreenModal'
  }
}
```

#### Related Products

```typescript
const relatedProductsNav = {
  'SimilarProducts': 'ProductList + SimilarFilter',
  'SameProducer': 'ProducerProducts',
  'FrequentlyBought': 'BundleView',
  'AlternativeProducts': 'AlternativesList'
}
```

### Deep Links

```typescript
const productDetailDeepLinks = {
  'makethechange://product/:id': 'ProductDetailScreen',
  'makethechange://product/:id/reviews': 'ProductDetailScreen + ReviewsModal',
  'makethechange://product/:id/producer': 'ProducerProfileScreen',
  'makethechange://product/:id/add-to-cart': 'ProductDetailScreen + AddToCartAction'
}
```

## 📝 Tests Utilisateur

### Product Discovery Tests

#### Information Comprehension

1. **Product Understanding** : User grasps product characteristics
2. **Value Perception** : User understands points value proposition
3. **Quality Assessment** : User evaluates product quality
4. **Producer Trust** : User trusts the producer credentials

#### Purchase Decision

1. **Points Calculation** : User understands points cost
2. **Quantity Selection** : User chooses appropriate quantity
3. **Shipping Understanding** : User knows delivery expectations
4. **Stock Awareness** : User reacts to stock levels

### A/B Tests

#### Product Layout

- **Variant A** : Traditional e-commerce layout
- **Variant B** : Points-focused layout
- **Variant C** : Story-driven layout (producer focus)
- **Métrique** : Add-to-cart rate

#### Points Display

- **Variant A** : Points only
- **Variant B** : Points + € equivalent
- **Variant C** : Points + savings highlight
- **Métrique** : Purchase conversion

### Conversion Metrics

```typescript
interface ProductConversionMetrics {
  viewToAddToCart: number         // Target: >15%
  addToCartToPurchase: number     // Target: >70%
  reviewReadRate: number          // Target: >40%
  imageEngagementRate: number     // Target: >60%
  producerProfileViewRate: number // Target: >25%
}
```

## 💾 Stockage Local

### Product Details Cache

```typescript
interface ProductDetailsCache {
  productData: {
    [productId: string]: {
      data: ProductDetail
      lastFetch: number
      ttl: number // 30 minutes
    }
  }
  productImages: {
    [imageUrl: string]: {
      localPath: string
      downloadDate: number
      highQuality: boolean
    }
  }
  reviewsCache: {
    [productId: string]: {
      reviews: Review[]
      summary: ReviewSummary
      lastFetch: number
    }
  }
  userInteractions: {
    viewHistory: ProductView[]
    wishlist: string[]
    cartItems: CartItem[]
  }
}
```

### Offline Capabilities

```typescript
interface OfflineProductCapabilities {
  viewProductDetails: boolean     // Cached data only
  viewImages: boolean            // Cached images only
  readReviews: boolean           // Cached reviews only
  addToWishlist: boolean         // Sync when online
  addToCart: boolean             // Local cart, sync later
  purchaseProduct: false         // Requires connection
}
```

### Analytics Events

```typescript
const productDetailEvents = {
  'product_viewed': {
    product_id: string,
    category: string,
    points_price: number,
    source: 'catalog' | 'search' | 'recommendation',
    timestamp: number
  },
  'image_gallery_opened': {
    product_id: string,
    image_index: number,
    total_images: number,
    timestamp: number
  },
  'producer_profile_viewed': {
    product_id: string,
    producer_id: string,
    timestamp: number
  },
  'add_to_cart_clicked': {
    product_id: string,
    quantity: number,
    points_cost: number,
    user_points_before: number,
    timestamp: number
  },
  'review_section_viewed': {
    product_id: string,
    average_rating: number,
    total_reviews: number,
    timestamp: number
  },
  'stock_warning_shown': {
    product_id: string,
    stock_level: string,
    quantity_available: number,
    timestamp: number
  }
}
```

## 🔧 Fonctionnalités Avancées

### Product Recommendations

```typescript
interface RecommendationAlgorithm {
  collaborativeFiltering: {
    userBasedSimilarity: number
    itemBasedSimilarity: number
    minSimilarUsers: number
  }
  contentBasedFiltering: {
    categoryWeights: { [category: string]: number }
    producerWeights: number
    priceRangeWeights: number
  }
  trending: {
    timeWindow: number // days
    viewWeights: number
    purchaseWeights: number
  }
}
```

### Quality Assurance

```typescript
interface QualityFeatures {
  productVerification: {
    imageAuthenticity: boolean
    descriptionAccuracy: boolean
    producerVerification: boolean
  }
  reviewValidation: {
    purchaseVerification: boolean
    spamDetection: boolean
    sentimentAnalysis: boolean
  }
  returnPolicy: {
    returnWindow: number // days
    returnConditions: string[]
    refundMethod: 'points' | 'original_payment'
  }
}
```
