# Response Models & Pagination – Make the CHANGE

Scope: Standardized DTOs for API outputs, unified error object, and common pagination shape for tRPC routers. These models are documentation contracts used by both web and mobile frontends.

## Conventions
- All list endpoints return `Paginated<T>`.
- Errors follow `ErrorObject` (same shape across routers). In tRPC, this is included in the TRPCError `data` for consistent client mapping.
- Dates are ISO 8601 strings in JSON responses unless specified.

## Common Types
```ts
// Pagination envelope (used by list/history endpoints)
export interface Paginated<T> {
  items: T[]
  page: number
  limit: number
  total: number
  hasMore: boolean
}

// Unified error contract (attach to TRPCError data)
export interface ErrorObject {
  code:
    | 'VALIDATION_ERROR'
    | 'AUTH_REQUIRED'
    | 'INVALID_CREDENTIALS'
    | 'EMAIL_ALREADY_EXISTS'
    | 'RATE_LIMITED'
    | 'NOT_FOUND'
    | 'CONFLICT'
    | 'FORBIDDEN'
    | 'OUT_OF_STOCK'
    | 'INSUFFICIENT_POINTS'
    | 'PAYMENT_FAILED'
    | 'WEBHOOK_INVALID'
    | 'EXPORT_TOO_LARGE'
    | 'SERVER_ERROR'
  message: string
  field?: string
  retryAfterSeconds?: number
  details?: Record<string, unknown>
}

// Standard success envelope (optional; tRPC commonly returns raw data)
export interface ApiSuccess<T> {
  data: T
  meta?: Record<string, unknown>
}
```

## Core Entities (DTOs)
```ts
// Minimal public user projection
export interface UserSummaryDTO {
  id: string
  email: string
  firstName: string
  lastName: string
  userLevel: 'explorateur' | 'protecteur' | 'ambassadeur'
  pointsBalance: number
  emailVerified: boolean
}

export interface AddressDTO {
  id?: string
  label?: string
  firstName: string
  lastName: string
  street: string
  city: string
  postalCode: string
  country: string
  phone?: string
  isDefault?: boolean
}

// Projects
export interface ProjectSummaryDTO {
  id: string
  slug: string
  name: string
  type: 'beehive' | 'olive_tree' | 'vineyard'
  featured: boolean
  images: string[]
  fundingProgress: number // 0-100
  producerName?: string
}

export interface ProjectDetailDTO extends ProjectSummaryDTO {
  shortDescription?: string
  longDescription?: string
  location: { lat: number; lng: number }
  certifications: string[]
  impactMetrics?: Record<string, number | string>
  updatesCount: number
}

// Products
export interface ProductSummaryDTO {
  id: string
  slug: string
  name: string
  pricePoints: number
  images: string[]
  inStock: boolean
  fulfillment: 'stock' | 'dropship'
  isHero: boolean
  minTier: 'explorateur' | 'protecteur' | 'ambassadeur'
}

export interface ProductDetailDTO extends ProductSummaryDTO {
  description?: string
  tags?: string[]
  weightGrams?: number
  dimensions?: { length: number; width: number; height: number }
  producer?: { id: string; name: string; slug: string }
}

// Cart
export interface CartItemDTO {
  id: string
  productId: string
  name: string
  pricePoints: number
  quantity: number
  totalPoints: number
  image?: string
  fulfillment: 'stock' | 'dropship'
}

export interface CartDTO {
  id: string
  items: CartItemDTO[]
  itemCount: number
  subtotalPoints: number
  shippingCostPoints: number // 0 for MVP
  totalPoints: number
  updatedAt: string
}

// Orders
export interface ShipmentDTO {
  id: string
  type: 'stock' | 'dropship'
  carrier?: string
  trackingNumber?: string
  status: 'pending' | 'picked' | 'shipped' | 'in_transit' | 'delivered' | 'exception'
}

export interface OrderItemDTO {
  id: string
  productId: string
  name: string
  pricePoints: number
  quantity: number
  totalPoints: number
}

export interface OrderSummaryDTO {
  id: string
  orderNumber: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  itemCount: number
  totalPoints: number
  createdAt: string
}

export interface OrderDetailDTO extends OrderSummaryDTO {
  shippingAddress: AddressDTO
  shipments: ShipmentDTO[]
  items: OrderItemDTO[]
}

// Subscriptions
export interface SubscriptionDTO {
  id: string
  tier: 'ambassadeur_standard' | 'ambassadeur_premium'
  billingFrequency: 'monthly' | 'annual'
  amount: number // EUR
  pointsGenerated: number // monthly or annual total depending on frequency
  status: 'active' | 'pending' | 'cancelled' | 'paused'
  nextBillingDate?: string
}

// Points
export interface PointsBalanceDTO {
  balance: number
  active: number
  expiringSoon: number
}

export interface PointsTransactionDTO {
  id: string
  type: 'earned' | 'spent' | 'expired' | 'bonus' | 'adjustment'
  amount: number
  balanceAfter: number
  sourceType?: string
  sourceId?: string
  description?: string
  createdAt: string
  expiresAt?: string
}
```

## Users & Security
```ts
export interface UserMeDTO extends UserSummaryDTO {
  profile?: {
    phone?: string
    avatarUrl?: string
  }
  kycStatus: 'pending' | 'light' | 'complete'
  hasActiveSubscription: boolean
  billingFrequency?: 'monthly' | 'annual'
  lastLoginAt?: string
}

export interface PreferencesDTO {
  locale?: 'fr' | 'en'
  marketingConsent?: boolean
  notificationPreferences?: NotificationPreferencesDTO
}

export interface NotificationPreferencesDTO {
  email: boolean
  push: boolean
  sms: boolean
}

export interface SessionDTO {
  id: string
  createdAt: string
  expiresAt: string
  ipAddress?: string
  deviceInfo?: { platform?: 'ios'|'android'|'web'; deviceName?: string }
  current?: boolean
}

export interface DeviceDTO {
  id: string
  platform: 'ios' | 'android' | 'web'
  deviceName?: string
  lastSeenAt?: string
}

export interface KycStatusDTO {
  status: 'pending' | 'light' | 'complete'
  sessionId?: string
  lastUpdatedAt?: string
}
```

## Partners (Partner App)
```ts
export interface PartnerUserDTO {
  id: string
  partnerId: string
  email: string
  firstName?: string
  lastName?: string
  role: 'owner' | 'staff'
  isActive: boolean
  lastLoginAt?: string
}

export interface PartnerLoginResponseDTO {
  success: boolean
  user?: PartnerUserDTO
  session?: { accessToken: string; refreshToken: string; expiresAt: string; sessionId: string }
  error?: ErrorObject
}

export interface PartnerProjectDTO {
  projectId: string
  name: string
  status: 'active' | 'funded' | 'closed' | 'suspended'
}

export interface MediaUploadDTO {
  id: string
  url: string
  type: string
  size: number
  thumbnailUrl?: string
}

export interface PartnerUpdateDTO {
  id: string
  projectId: string
  authorId: string
  title: string
  description?: string
  updateType: 'milestone' | 'routine' | 'event'
  status: 'draft' | 'pending' | 'published' | 'rejected'
  media: string[]
  publishedAt?: string
  createdAt: string
}

export interface PartnerUserAdminDTO extends PartnerUserDTO {
  partnerName?: string
}
```

## Notifications
```ts
export interface PushSendResultDTO { id: string; success: boolean }
export interface EmailSendResultDTO { id: string; success: boolean }
export interface BulkSendResultDTO { jobId: string; success: boolean }
```

## Example Pagination Response
```json
{
  "items": [
    { "id": "...", "slug": "honey-haven", "name": "Honey Haven", "type": "beehive", "featured": true, "images": [], "fundingProgress": 62 }
  ],
  "page": 1,
  "limit": 20,
  "total": 87,
  "hasMore": true
}
```

## Error Mapping (Client)
- The frontend should map `ErrorObject.code` to user-friendly i18n messages.
- `retryAfterSeconds` is used for rate-limited scenarios to display countdowns.

## References
- See `api/*-endpoints.md` for per-router outputs referencing these DTOs.
- See `schemas/zod-schemas.md` for validation patterns.
