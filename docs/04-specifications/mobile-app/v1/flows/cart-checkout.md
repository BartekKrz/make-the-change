# Panier & Checkout

## 🎯 Objectif

Permettre à l'utilisateur de finaliser ses achats en points avec un processus de checkout simplifié, sécurisé et optimisé pour les récompenses.

## 🎨 Design & Layout

### Structure Visuelle (Cart)

```text
┌─────────────────────────┐
│ [←] Panier (3)       🗑️ │
│                         │
│ ┌─────────────────────────┐│
│ │ 💡 Vos points expirent  ││
│ │    dans 7 jours: 50 pts ││
│ │    [UTILISER MAINTENANT]││
│ └─────────────────────────┘│
│                         │
│ ┌─────────────────────────┐│
│ │ [🍯] Miel d'Acacia  ✕   ││
│ │ Marie Lavande           ││
│ │ 500g • 150 pts          ││
│ │ Qté: [-] 2 [+]          ││
│ └─────────────────────────┘│
│                         │
│ ┌─────────────────────────┐│
│ │ [🫒] Huile d'Olive  ✕   ││
│ │ Domaine du Sud          ││
│ │ 750ml • 200 pts         ││
│ │ Qté: [-] 1 [+]          ││
│ └─────────────────────────┘│
│                         │
│ 💰 Récapitulatif        │
│ ┌─────────────────────────┐│
│ │ Sous-total: 500 pts     ││
│ │ Livraison: GRATUITE     ││
│ │ ─────────────────────── ││
│ │ Total: 500 pts          ││
│ │                         ││
│ │ Vos points: 750 pts     ││
│ │ Restant: 250 pts        ││
│ └─────────────────────────┘│
│                         │
│ 🚚 Livraison           │
│ ┌─────────────────────────┐│
│ │ 📍 Adresse de livraison ││
│ │ Jean Dupont             ││
│ │ 123 rue de la Paix      ││
│ │ [MODIFIER]              ││
│ └─────────────────────────┘│
│                         │
│ [PROCÉDER AU CHECKOUT]  │
│                         │
│ ••••• Navigation ••••• │
└─────────────────────────┘
```

### Structure Visuelle (Checkout)

```text
┌─────────────────────────┐
│ [←] Commande         🔒 │
│                         │
│ ┌─────────────────────────┐│
│ │ 📦 Récapitulatif        ││
│ │ 3 articles • 500 pts    ││
│ │ [VOIR DÉTAILS]          ││
│ └─────────────────────────┘│
│                         │
│ ✅ 1. Adresse           │
│ ┌─────────────────────────┐│
│ │ 📍 Jean Dupont          ││
│ │ 123 rue de la Paix      ││
│ │ 75001 Paris             ││
│ │ [MODIFIER]              ││
│ └─────────────────────────┘│
│                         │
│ ⚪ 2. Livraison          │
│ ┌─────────────────────────┐│
│ │ 📦 Standard (gratuit)   ││
│ │ 📅 3-5 jours ouvrés     ││
│ │ ◯ Express (+50 pts)     ││
│ │ 📅 24-48h               ││
│ └─────────────────────────┘│
│                         │
│ ⚪ 3. Points            │
│ ┌─────────────────────────┐│
│ │ 💰 Utiliser 500 pts     ││
│ │ Vos points: 750 pts     ││
│ │ Points expirantes (7j): ││
│ │ [✓] Utiliser en priorité││
│ └─────────────────────────┘│
│                         │
│ ⚪ 4. Confirmation       │
│ ┌─────────────────────────┐│
│ │ 🛡️ Commande sécurisée   ││
│ │ ✓ Conditions acceptées  ││
│ │ ✓ Données protégées     ││
│ └─────────────────────────┘│
│                         │
│ [VALIDER LA COMMANDE]   │
│                         │
│ ••••• Navigation ••••• │
└─────────────────────────┘
```

## 📱 Composants UI

### Cart Item Component

```typescript
interface CartItemProps {
  item: {
    id: string
    productId: string
    name: string
    producer: string
    image: string
    pointsPrice: number
    originalPrice?: number
    weight: string
    quantity: number
    maxQuantity: number
    stockStatus: 'in_stock' | 'low_stock' | 'last_items'
    category: string
  }
  onQuantityChange: (itemId: string, quantity: number) => void
  onRemove: (itemId: string) => void
  onViewProduct: (productId: string) => void
  isUpdating: boolean
}
```

### Cart Summary

```typescript
interface CartSummaryProps {
  summary: {
    subtotal: number
    shipping: number
    total: number
    itemsCount: number
    savings?: number
  }
  userPoints: {
    current: number
    pending: number
    expiring: {
      amount: number
      expiryDate: Date
    }[]
  }
  canAfford: boolean
  recommendations?: {
    useExpiringPoints: boolean
    addMoreItems?: {
      needed: number
      suggestion: string
    }
  }
}
```

### Expiring Points Alert

```typescript
interface ExpiringPointsAlertProps {
  expiringPoints: {
    amount: number
    expiryDate: Date
    daysLeft: number
  }
  suggestions: {
    useInCurrentCart: boolean
    recommendedProducts?: ProductSummary[]
    totalNeeded: number
  }
  onUsePoints: () => void
  onViewRecommendations: () => void
  onDismiss: () => void
}
```

### Shipping Address

```typescript
interface ShippingAddressProps {
  selectedAddress?: {
    id: string
    fullName: string
    streetLine1: string
    streetLine2?: string
    city: string
    postalCode: string
    country: string
    isDefault: boolean
  }
  availableAddresses: Address[]
  onSelectAddress: (addressId: string) => void
  onEditAddress: (addressId: string) => void
  onAddNewAddress: () => void
  deliveryRestrictions?: {
    message: string
    restrictedProducts: string[]
  }
}
```

### Shipping Options

```typescript
interface ShippingOptionsProps {
  options: {
    id: string
    name: string
    description: string
    pointsCost: number
    originalPrice?: number
    estimatedDays: number
    guaranteed: boolean
    trackingIncluded: boolean
    requiresSignature: boolean
    restrictions?: string[]
  }[]
  selectedOptionId: string
  onSelectOption: (optionId: string) => void
  specialHandlingRequired?: {
    fragileItems: boolean
    refrigeratedItems: boolean
    largeItems: boolean
  }
}
```

### Points Payment Section

```typescript
interface PointsPaymentProps {
  order: {
    total: number
    items: CartItem[]
  }
  userPoints: {
    available: number
    pending: number
    expiring: ExpiringPoints[]
  }
  paymentPlan: {
    pointsToUse: number
    prioritizeExpiring: boolean
    remainingAfterPayment: number
  }
  onUpdatePaymentPlan: (plan: Partial<PointsPaymentPlan>) => void
  onOptimizePoints: () => void
}
```

### Order Confirmation

```typescript
interface OrderConfirmationProps {
  order: {
    id: string
    items: CartItem[]
    total: number
    shippingAddress: Address
    shippingOption: ShippingOption
    estimatedDelivery: Date
  }
  pointsUsed: {
    total: number
    byExpiry: { amount: number; expiryDate: Date }[]
  }
  legalConsents: {
    termsAccepted: boolean
    privacyAccepted: boolean
    marketingOptIn: boolean
  }
  onToggleConsent: (type: string, value: boolean) => void
  onPlaceOrder: () => void
  isProcessing: boolean
}
```

## 🔄 États & Interactions

### Cart State Management

```typescript
interface CartState {
  items: CartItem[]
  isLoading: boolean
  isUpdating: boolean
  lastUpdate: Date
  errors: {
    [itemId: string]: string
  }
  summary: CartSummary
  recommendations: RecommendedProducts
}

interface CartActions {
  addItem: (productId: string, quantity: number) => void
  updateQuantity: (itemId: string, quantity: number) => void
  removeItem: (itemId: string) => void
  clearCart: () => void
  refreshPrices: () => void
  validateAvailability: () => void
}
```

### Checkout State

```typescript
interface CheckoutState {
  currentStep: 'address' | 'shipping' | 'payment' | 'confirmation'
  completedSteps: string[]
  canProceedToNext: boolean
  
  addressStep: {
    selectedAddress?: Address
    isValid: boolean
    deliveryAvailable: boolean
  }
  
  shippingStep: {
    selectedOption?: ShippingOption
    totalCost: number
    estimatedDelivery: Date
  }
  
  paymentStep: {
    pointsToUse: number
    sufficientPoints: boolean
    useExpiringFirst: boolean
  }
  
  confirmationStep: {
    termsAccepted: boolean
    privacyAccepted: boolean
    readyToSubmit: boolean
  }
}
```

### Real-time Updates

```typescript
const cartBehavior = {
  quantityUpdate: {
    debounce: 500, // ms
    showLoading: true,
    optimisticUpdate: true,
    rollbackOnError: true
  },
  stockChecking: {
    interval: 30000, // 30 seconds
    onStockChange: 'notify_user',
    onOutOfStock: 'remove_or_adjust'
  },
  pointsUpdates: {
    realTimeTracking: true,
    expiryWarnings: true,
    balanceRefresh: 'on_app_focus'
  }
}
```

### Validation Flow

```typescript
const checkoutValidation = {
  addressValidation: {
    required: ['fullName', 'streetLine1', 'city', 'postalCode'],
    deliveryAreaCheck: true,
    restrictedItemsCheck: true
  },
  pointsValidation: {
    sufficientBalance: true,
    expiryOptimization: true,
    futureEarningsConsideration: false
  },
  orderValidation: {
    itemAvailability: true,
    priceChanges: true,
    shippingCompatibility: true
  }
}
```

## 📡 API & Données

### Cart Management

```typescript
GET /api/cart
Authorization: Bearer {accessToken}

interface CartResponse {
  items: CartItem[]
  summary: {
    subtotal: number
    shipping: number
    total: number
    itemsCount: number
    weight: number
  }
  pointsRequired: number
  recommendations: {
    expireWarning?: ExpiringPointsAlert
    addMoreSuggestions?: ProductSuggestion[]
  }
}

POST /api/cart/items
{
  productId: string
  quantity: number
}

PUT /api/cart/items/{itemId}
{
  quantity: number
}

DELETE /api/cart/items/{itemId}
```

### Checkout Process

```typescript
POST /api/checkout/validate
{
  cartId: string
  shippingAddressId: string
  shippingOptionId: string
}

interface CheckoutValidationResponse {
  valid: boolean
  errors?: ValidationError[]
  pricing: {
    subtotal: number
    shipping: number
    total: number
  }
  availability: {
    allItemsAvailable: boolean
    unavailableItems?: string[]
    stockWarnings?: StockWarning[]
  }
  pointsCheck: {
    sufficient: boolean
    required: number
    available: number
    optimizedUsage?: PointsOptimization
  }
}
```

### Order Placement

```typescript
POST /api/orders
{
  cartId: string
  shippingAddress: AddressInput
  shippingOption: string
  pointsPayment: {
    amount: number
    useExpiringFirst: boolean
  }
  consents: {
    terms: boolean
    privacy: boolean
    marketing?: boolean
  }
}

interface OrderResponse {
  orderId: string
  status: 'processing' | 'confirmed' | 'failed'
  confirmationNumber: string
  estimatedDelivery: Date
  pointsUsed: number
  pointsRemaining: number
  paymentReceipt: PaymentReceipt
}
```

### Address Management

```typescript
GET /api/user/addresses
POST /api/user/addresses
PUT /api/user/addresses/{addressId}
DELETE /api/user/addresses/{addressId}

POST /api/addresses/validate
{
  address: AddressInput
  deliveryServiceId?: string
}

interface AddressValidationResponse {
  valid: boolean
  standardized?: Address
  deliveryAvailable: boolean
  restrictions?: DeliveryRestriction[]
  suggestedCorrections?: AddressCorrection[]
}
```

### Shipping Options

```typescript
GET /api/shipping/options
Query: {
  cartId: string
  addressId: string
}

interface ShippingOptionsResponse {
  options: ShippingOption[]
  recommendations: {
    fastest: string
    cheapest: string
    bestValue: string
  }
  restrictions: {
    fragileItems: boolean
    oversizedItems: boolean
    coldChainRequired: boolean
  }
}
```

## ✅ Validations

### Cart Validation Rules

```typescript
interface CartValidation {
  itemLimits: {
    maxItems: 50
    maxQuantityPerItem: 10
    maxTotalWeight: 30 // kg
  }
  
  pointsValidation: {
    minOrderValue: 50 // points
    maxPointsPerOrder: 5000
    requireSufficientBalance: true
  }
  
  stockValidation: {
    realTimeCheck: true
    reservationDuration: 15 // minutes
    autoRemoveUnavailable: false
  }
  
  shippingValidation: {
    deliveryAreaCheck: true
    itemCompatibilityCheck: true
    weightLimitCheck: true
  }
}
```

### Address Validation

```typescript
const addressValidation = {
  required: {
    fullName: { minLength: 2, maxLength: 100 },
    streetLine1: { minLength: 5, maxLength: 200 },
    city: { minLength: 2, maxLength: 50 },
    postalCode: { pattern: /^\d{5}$/ },
    country: { enum: ['FR', 'BE', 'CH', 'LU'] }
  },
  
  delivery: {
    restrictedAreas: string[]
    minimumOrderValue?: number
    surchargeAreas?: { postalCodes: string[], surcharge: number }[]
  }
}
```

### Checkout Business Rules

```typescript
const checkoutRules = {
  order: {
    minimumValue: 50, // points
    maximumValue: 5000, // points
    maxItemsPerOrder: 20
  },
  
  points: {
    useExpiringFirst: true
    allowPartialPointsPayment: false
    roundingRule: 'round_up'
  },
  
  shipping: {
    freeShippingThreshold: 200, // points
    maxDeliveryAttempts: 3
    signatureRequired: false
  }
}
```

## 🚨 Gestion d'Erreurs

### Cart Errors

```typescript
const cartErrors = {
  stockIssues: {
    itemOutOfStock: {
      code: 'ITEM_OUT_OF_STOCK',
      message: "Produit non disponible",
      actions: {
        removeFromCart: true,
        suggestAlternatives: true,
        notifyWhenAvailable: true
      }
    },
    insufficientStock: {
      code: 'INSUFFICIENT_STOCK',
      message: "Stock insuffisant",
      actions: {
        adjustQuantity: true,
        showAvailableQuantity: true
      }
    },
    stockReservationExpired: {
      code: 'RESERVATION_EXPIRED',
      message: "Réservation expirée",
      actions: {
        refreshCart: true,
        checkNewAvailability: true
      }
    }
  },
  
  priceChanges: {
    priceIncrease: {
      code: 'PRICE_INCREASED',
      message: "Le prix a augmenté",
      actions: {
        showNewPrice: true,
        allowUserChoice: true,
        updateCart: true
      }
    },
    itemDiscontinued: {
      code: 'ITEM_DISCONTINUED',
      message: "Produit arrêté",
      actions: {
        removeFromCart: true,
        suggestReplacements: true
      }
    }
  }
}
```

### Checkout Errors

```typescript
const checkoutErrors = {
  addressErrors: {
    invalidAddress: {
      code: 'INVALID_ADDRESS',
      message: "Adresse non valide",
      actions: {
        showCorrections: true,
        allowManualEntry: true
      }
    },
    deliveryNotAvailable: {
      code: 'DELIVERY_NOT_AVAILABLE',
      message: "Livraison non disponible",
      actions: {
        suggestNearbyAddresses: true,
        showPickupOptions: false
      }
    }
  },
  
  pointsErrors: {
    insufficientPoints: {
      code: 'INSUFFICIENT_POINTS',
      message: "Points insuffisants",
      actions: {
        showPointsNeeded: true,
        suggestEarnMore: true,
        removeItemsOption: true
      }
    },
    pointsExpired: {
      code: 'POINTS_EXPIRED',
      message: "Des points ont expiré",
      actions: {
        refreshBalance: true,
        recalculateOrder: true
      }
    }
  },
  
  orderErrors: {
    orderProcessingFailed: {
      code: 'ORDER_PROCESSING_FAILED',
      message: "Erreur lors de la commande",
      actions: {
        retryOrder: true,
        contactSupport: true,
        saveCartForLater: true
      }
    }
  }
}
```

### Error Recovery

```typescript
const errorRecovery = {
  autoRetry: {
    maxAttempts: 3,
    backoffStrategy: 'exponential',
    retryableErrors: [
      'NETWORK_ERROR',
      'SERVER_TEMPORARY_ERROR',
      'RATE_LIMIT_EXCEEDED'
    ]
  },
  
  gracefulDegradation: {
    fallbackToCache: true,
    offlineMode: {
      saveCartLocally: true,
      syncWhenOnline: true
    },
    partialFunctionality: {
      viewCartOnly: true,
      disableCheckout: true
    }
  }
}
```

## 🔗 Navigation

### Cart Navigation

```typescript
const cartNavigation = {
  'ViewProduct': {
    route: 'ProductDetail',
    params: { productId: string },
    animation: 'slideInRight'
  },
  'ProceedToCheckout': {
    route: 'Checkout',
    params: { cartId: string },
    animation: 'slideInRight',
    gestureEnabled: false
  },
  'ContinueShopping': {
    route: 'ProductCatalog',
    animation: 'slideInLeft'
  },
  'AddMoreItems': {
    route: 'RecommendedProducts',
    params: { context: 'cart_upsell' },
    animation: 'slideInUp'
  }
}
```

### Checkout Navigation

```typescript
const checkoutNavigation = {
  steps: {
    'AddressStep': {
      next: 'ShippingStep',
      previous: 'Cart'
    },
    'ShippingStep': {
      next: 'PaymentStep',
      previous: 'AddressStep'
    },
    'PaymentStep': {
      next: 'ConfirmationStep',
      previous: 'ShippingStep'
    },
    'ConfirmationStep': {
      next: 'OrderSuccess',
      previous: 'PaymentStep'
    }
  },
  
  actions: {
    'EditAddress': {
      route: 'AddressForm',
      presentation: 'modal',
      params: { addressId?: string, returnTo: 'Checkout' }
    },
    'OrderSuccess': {
      route: 'OrderConfirmation',
      params: { orderId: string },
      resetStack: true
    }
  }
}
```

### Deep Links

```typescript
const cartCheckoutDeepLinks = {
  'makethechange://cart': 'CartScreen',
  'makethechange://checkout': 'CheckoutScreen',
  'makethechange://checkout/address': 'CheckoutScreen + AddressStep',
  'makethechange://order/:orderId': 'OrderConfirmationScreen'
}
```

## 📝 Tests Utilisateur

### Cart Usability Tests

#### Cart Management

1. **Add/Remove Items** : User efficiently manages cart contents
2. **Quantity Adjustment** : User easily changes item quantities
3. **Points Calculation** : User understands total cost in points
4. **Stock Warnings** : User reacts appropriately to stock alerts

#### Expiring Points

1. **Awareness** : User notices expiring points alerts
2. **Usage** : User chooses to use expiring points
3. **Optimization** : User understands points optimization suggestions

### Checkout Flow Tests

#### Step Completion

1. **Address Step** : User provides valid delivery address
2. **Shipping Step** : User chooses appropriate shipping option
3. **Payment Step** : User understands points usage
4. **Confirmation** : User reviews and confirms order

#### Error Handling

1. **Stock Issues** : User handles out-of-stock scenarios
2. **Address Problems** : User corrects invalid addresses
3. **Insufficient Points** : User resolves points shortage
4. **Technical Errors** : User recovers from system errors

### A/B Tests

#### Checkout Flow

- **Variant A** : Multi-step process (current)
- **Variant B** : Single-page checkout
- **Variant C** : Progressive disclosure
- **Métrique** : Checkout completion rate

#### Points Display

- **Variant A** : Points only
- **Variant B** : Points + € equivalent
- **Variant C** : Savings highlight
- **Métrique** : Order value and completion

### Success Metrics

```typescript
interface CheckoutMetrics {
  cartAbandonmentRate: number        // Target: <30%
  checkoutCompletionRate: number     // Target: >80%
  averageCheckoutTime: number        // Target: <3 minutes
  errorRecoveryRate: number          // Target: >70%
  expiringPointsUsageRate: number    // Target: >60%
}
```

## 💾 Stockage Local

### Cart Persistence

```typescript
interface CartLocalStorage {
  cartItems: {
    items: CartItem[]
    lastUpdate: number
    syncRequired: boolean
  }
  
  checkoutDraft: {
    selectedAddress?: string
    selectedShipping?: string
    pointsPaymentPlan?: PointsPaymentPlan
    step: string
    timestamp: number
  }
  
  addressBook: {
    addresses: Address[]
    defaultAddressId?: string
    lastUsedAddressId?: string
  }
  
  orderHistory: {
    recentOrders: OrderSummary[]
    reorderSuggestions: string[]
  }
}
```

### Offline Capabilities

```typescript
interface OfflineCheckoutCapabilities {
  viewCart: boolean              // Full functionality
  modifyCart: boolean           // Sync when online
  browseAddresses: boolean      // Cached data
  continueCheckout: boolean     // Limited to saved data
  placeOrder: false            // Requires connection
  trackOrder: false            // Requires connection
}
```

### Analytics Events

```typescript
const cartCheckoutEvents = {
  'cart_viewed': {
    cart_id: string,
    items_count: number,
    total_points: number,
    timestamp: number
  },
  'item_removed_from_cart': {
    cart_id: string,
    product_id: string,
    quantity: number,
    reason: 'user_action' | 'out_of_stock' | 'price_change',
    timestamp: number
  },
  'checkout_started': {
    cart_id: string,
    items_count: number,
    total_points: number,
    user_points: number,
    timestamp: number
  },
  'checkout_step_completed': {
    cart_id: string,
    step: string,
    step_number: number,
    time_spent: number,
    timestamp: number
  },
  'order_placed': {
    order_id: string,
    cart_id: string,
    total_points: number,
    items_count: number,
    checkout_duration: number,
    timestamp: number
  },
  'expiring_points_used': {
    cart_id: string,
    points_amount: number,
    days_until_expiry: number,
    timestamp: number
  }
}
```

## 🔧 Fonctionnalités Avancées

### Smart Cart Features

```typescript
interface SmartCartFeatures {
  autoOptimization: {
    useExpiringPointsFirst: boolean
    suggestBundleDeals: boolean
    removeLowStockItems: boolean
  }
  
  priceTracking: {
    notifyPriceDrops: boolean
    trackWishlistPrices: boolean
    suggestBestTiming: boolean
  }
  
  personalizedRecommendations: {
    frequentlyBoughtTogether: boolean
    seasonalSuggestions: boolean
    restockReminders: boolean
  }
}
```

### Checkout Optimization

```typescript
interface CheckoutOptimization {
  addressPrediction: {
    useLocationServices: boolean
    suggestNearbyAddresses: boolean
    autoFillFromProfile: boolean
  }
  
  smartDefaults: {
    rememberShippingPreference: boolean
    optimizePointsUsage: boolean
    suggestFastestDelivery: boolean
  }
  
  oneClickCheckout: {
    enabled: boolean
    requiresConfirmation: boolean
    maxOrderValue: number
  }
}
```
