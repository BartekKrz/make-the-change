# Tunnel de Paiement Hybride

## 🎯 Objectif

Processus de paiement sécurisé et optimisé pour le modèle hybride :
- **Investissements** : Projets spécifiques (Ruches 50€, Oliviers 80€, Parcelles 150€)
- **Abonnements** : Tiers Ambassadeur (Standard 200€, Premium 350€)

Validation étape par étape et gestion des différents moyens de paiement adaptés au niveau utilisateur.

## 🎨 Design & Layout

### Structure Visuelle

```text
┌─────────────────────────┐
│ [←] Paiement       [X]│
│ ●●●○ Étape 3/4          │
│                         │
│ 🐝 Investissement Ruche │
│ Montant: €50            │
│                         │
│ 💳 Moyen de paiement    │
│ ┌───────────────────────┐ │
│ │ ● 💳 Carte bancaire   │ │
│ │   •••• •••• •••• 1234 │ │
│ │   [Modifier]          │ │
│ └───────────────────────┘ │
│ ┌───────────────────────┐ │
│ │ ○ 🏦 Virement SEPA    │ │
│ │   Délai: 1-2 jours    │ │
│ └───────────────────────┘ │
│ ┌───────────────────────┐ │
│ │ ○ 🍎 Apple Pay        │ │
│ │   Paiement instantané │ │
│ └───────────────────────┘ │
│                         │
│ 📄 Récapitulatif        │
│ ┌───────────────────────┐ │
│ │ Investissement    €50 │ │
│ │ Frais plateforme  €0  │ │
│ │ ────────────────────  │ │
│ │ Total            €50  │ │
│ └───────────────────────┘ │
│                         │
│ 🔒 Paiement sécurisé    │
│ 256-bit SSL • PCI DSS   │
│                         │
│ [CONFIRMER L'INVESTISSEMENT]│
└─────────────────────────┘
```

### Design System

- **Progress Indicator** : 4 étapes avec current state
- **Payment Methods** : Cards avec radio buttons
- **Security Badges** : SSL et certification icons
- **Summary Card** : Récapitulatif avec breakdown
- **CTA Button** : Couleur security (vert foncé)

## 📱 Composants UI

### Payment Flow Header

```typescript
interface PaymentHeaderProps {
  currentStep: number
  totalSteps: number
  transaction: {
    type: 'investment' | 'subscription'
    item_name: string
    amount: number
    currency: string
    points_generated?: number
  }
  onBack: () => void
  onClose: () => void
}
```

### Payment Method Selector

```typescript
interface PaymentMethodProps {
  methods: {
    id: string
    type: 'card' | 'sepa' | 'apple_pay' | 'google_pay' | 'paypal'
    label: string
    description: string
    icon: string
    available: boolean
    processingTime: string
    fees?: number
    lastUsed?: Date
    details?: {
      cardLast4?: string
      cardBrand?: string
      bankName?: string
      email?: string
    }
  }[]
  selectedMethod?: string
  onMethodSelect: (methodId: string) => void
  onAddMethod: () => void
}
```

### Payment Summary

```typescript
interface PaymentSummaryProps {
  breakdown: {
    subscription_fee: number
    platformFees: number
    paymentFees: number
    taxes: number
    total: number
    currency: string
  }
  paymentMethod: PaymentMethod
  transaction: TransactionSummary
  pointsGenerated?: number
  bonusPercentage?: number
}
```

### Security Indicators

```typescript
interface SecurityIndicatorsProps {
  certifications: {
    ssl: boolean
    pciDss: boolean
    gdpr: boolean
  }
  securityLevel: 'high' | 'medium' | 'low'
  lastSecurityCheck: Date
  onSecurityInfo: () => void
}
```

### Card Entry Form

```typescript
interface CardEntryProps {
  cardNumber: string
  expiryDate: string
  cvv: string
  cardholderName: string
  billingAddress: Address
  onCardNumberChange: (number: string) => void
  onExpiryChange: (expiry: string) => void
  onCvvChange: (cvv: string) => void
  onNameChange: (name: string) => void
  onBillingAddressChange: (address: Address) => void
  errors: { [field: string]: string }
  loading: boolean
}
```

## 🔄 États & Interactions

### Payment Flow States

```typescript
interface PaymentFlowState {
  currentStep: 'project_selection' | 'method' | 'details' | 'confirmation'
  selectedMethod?: PaymentMethodType
  processing: boolean
  validating: boolean
  error?: PaymentError
  canProceed: boolean
}
```

### Payment Method States

```typescript
interface PaymentMethodStates {
  card: {
    validating: boolean
    valid: boolean
    securityCheck: 'pending' | 'passed' | 'failed'
  }
  sepa: {
    validating: boolean
    valid: boolean
    mandateRequired: boolean
  }
  applePay: {
    available: boolean
    biometricEnabled: boolean
    deviceSupported: boolean
  }
}
```

### Validation States

#### Real-time Validation

```typescript
const cardValidation = {
  cardNumber: {
    pattern: /^[0-9]{13,19}$/,
    luhnCheck: true,
    supportedCards: ['visa', 'mastercard', 'amex'],
    realTime: true
  },
  expiry: {
    pattern: /^(0[1-9]|1[0-2])\/[0-9]{2}$/,
    futureDate: true,
    maxYears: 10
  },
  cvv: {
    pattern: /^[0-9]{3,4}$/,
    lengthByCard: {
      amex: 4,
      other: 3
    }
  }
}
```

#### Payment Security

```typescript
const securityChecks = {
  fraudDetection: {
    riskScore: number,
    checks: ['device', 'location', 'velocity', 'amount'],
    action: 'allow' | 'challenge' | 'deny'
  },
  compliance: {
    psd2: boolean,
    strongAuthentication: boolean,
    riskAssessment: 'low' | 'medium' | 'high'
  }
}
```

### Animation & Feedback

#### Payment Processing

```typescript
const paymentAnimations = {
  processing: {
    type: 'pulse',
    duration: 2000,
    infinite: true,
    color: 'green'
  },
  success: {
    type: 'checkmark',
    duration: 1000,
    haptic: 'notificationSuccess',
    confetti: true
  },
  error: {
    type: 'shake',
    duration: 400,
    haptic: 'notificationError'
  }
}
```

#### Security Feedback

```typescript
const securityFeedback = {
  sslConnection: {
    indicator: 'lock_icon',
    color: 'green',
    tooltip: 'Connexion sécurisée SSL'
  },
  cardValidation: {
    realTimeIcon: 'shield_check',
    validColor: 'green',
    invalidColor: 'red'
  }
}
```

## 📡 API & Données

### Payment Initialization

```typescript
POST /api/payments/initialize
{
  type: 'investment' | 'subscription'
  item_id: string // project_id ou subscription_tier_id
  tier?: 'explorateur' | 'protecteur' | 'ambassadeur'
  amount: number
  currency: string
  paymentMethod: string
  returnUrl?: string
}

interface PaymentInitResponse {
  paymentId: string
  clientSecret?: string
  redirectUrl?: string
  requiredFields: string[]
  fees: FeeBreakdown
  expiresAt: Date
}
```

### Payment Methods

```typescript
GET /api/payments/methods
Response: {
  methods: PaymentMethod[]
  defaultMethod?: string
  limits: {
    minAmount: number
    maxAmount: number
    dailyLimit: number
  }
}

POST /api/payments/methods
{
  type: PaymentMethodType
  details: PaymentMethodDetails
  setAsDefault?: boolean
}
```

### Payment Processing

```typescript
POST /api/payments/{paymentId}/process
{
  paymentMethodId: string
  paymentDetails: PaymentDetails
  billingAddress: Address
  savePaymentMethod?: boolean
}

interface PaymentProcessResponse {
  status: 'requires_action' | 'succeeded' | 'failed'
  nextAction?: {
    type: '3ds_redirect' | 'biometric_auth' | 'sms_verification'
    url?: string
    details?: any
  }
  transaction?: TransactionDetails
  subscription?: SubscriptionDetails
  investment?: InvestmentDetails
  error?: PaymentError
}
```

### Payment Status

```typescript
GET /api/payments/{paymentId}/status
Response: {
  status: PaymentStatus
  transaction?: TransactionDetails
  subscription?: SubscriptionDetails
  investment?: InvestmentDetails
  refund?: RefundDetails
  timeline: PaymentEvent[]
}
```

## ✅ Validations

### Payment Validation

```typescript
interface PaymentValidation {
  amount: {
    minimum: number
    maximum: number
    currency: string
  }
  paymentMethod: {
    supported: PaymentMethodType[]
    requirements: { [method: string]: string[] }
  }
  userVerification: {
    identityVerified: boolean
    addressVerified: boolean
    bankAccountLinked: boolean
  }
  compliance: {
    amlCheck: boolean
    sanctionsCheck: boolean
    fraudScore: number
  }
}
```

### Business Rules

#### Payment Limits

```typescript
const paymentLimits = {
  perTransaction: {
    investments: [50, 80, 150], // Ruche, Olivier, Parcelle
    subscriptions: [200, 350],  // Standard, Premium
    currency: 'EUR'
  },
  perUser: {
    daily: 5000,
    monthly: 15000,
    annual: 50000
  }
}
```

#### Fee Structure

```typescript
const feeStructure = {
  platform: {
    percentage: 0,
    fixed: 0,
    description: "Aucun frais plateforme"
  },
  payment: {
    card: { percentage: 0.29, fixed: 0.25 },
    sepa: { percentage: 0, fixed: 0 },
    applePay: { percentage: 0.29, fixed: 0.25 }
  },
  currency: {
    domestic: 0,
    international: 0.5
  }
}
```

## 🚨 Gestion d'Erreurs

### Payment Errors

```typescript
const paymentErrors = {
  cardDeclined: {
    code: 'CARD_DECLINED',
    message: "Votre carte a été refusée",
    actions: {
      tryDifferentCard: true,
      contactBank: true,
      useAlternativeMethod: true
    }
  },
  insufficientFunds: {
    code: 'INSUFFICIENT_FUNDS',
    message: "Fonds insuffisants",
    actions: {
      addFunds: true,
      lowerAmount: true,
      useSepa: true
    }
  },
  fraudSuspected: {
    code: 'FRAUD_SUSPECTED',
    message: "Transaction suspecte détectée",
    actions: {
      verifyIdentity: true,
      contactSupport: true
    }
  },
  technical: {
    code: 'TECHNICAL_ERROR',
    message: "Erreur technique temporaire",
    actions: {
      retry: true,
      useAlternativeMethod: true,
      contactSupport: true
    }
  }
}
```

### Network & Connectivity

```typescript
const networkErrorHandling = {
  connectionLost: {
    message: "Connexion perdue pendant le paiement",
    action: "check_payment_status",
    preventDuplicate: true
  },
  timeout: {
    message: "Le paiement prend plus de temps que prévu",
    action: "continue_waiting_or_retry",
    timeoutDuration: 30000
  },
  serverError: {
    message: "Erreur serveur temporaire",
    action: "retry_with_backoff",
    maxRetries: 3
  }
}
```

### Security Errors

```typescript
const securityErrors = {
  expiredSession: {
    message: "Session de paiement expirée",
    action: "restart_payment_flow"
  },
  invalidSignature: {
    message: "Erreur de sécurité détectée",
    action: "contact_support"
  },
  deviceNotTrusted: {
    message: "Appareil non reconnu",
    action: "additional_verification"
  }
}
```

## 🔗 Navigation

### Payment Flow Navigation

```typescript
const paymentFlowSteps = {
  'ItemSelection': {
    route: 'InvestmentOrSubscription',
    canGoBack: true,
    canSkip: false
  },
  'MethodSelection': {
    route: 'PaymentMethod',
    canGoBack: true,
    canSkip: false
  },
  'PaymentDetails': {
    route: 'PaymentDetails',
    canGoBack: true,
    canSkip: false
  },
  'Confirmation': {
    route: 'PaymentConfirmation',
    canGoBack: true,
    canSkip: false
  },
  'Processing': {
    route: 'PaymentProcessing',
    canGoBack: false,
    canSkip: false
  },
  'Success': {
    route: 'PaymentSuccess',
    canGoBack: false,
    canSkip: false
  }
}
```

### Error Recovery Navigation

```typescript
const errorRecoveryRoutes = {
  'RetryPayment': 'PaymentMethod',
  'ChangeMethod': 'PaymentMethod',
  'ContactSupport': 'SupportScreen',
  'CancelPayment': 'ProjectDetail',
  'SaveForLater': 'Dashboard'
}
```

### External Redirects

```typescript
const externalRedirects = {
  '3dsAuthentication': {
    type: 'external_browser',
    returnUrl: 'makethechange://payment/3ds-return',
    timeout: 300000 // 5 minutes
  },
  'bankRedirect': {
    type: 'external_app',
    fallbackUrl: 'browser',
    timeout: 600000 // 10 minutes
  }
}
```

## 📝 Tests Utilisateur

### Payment Flow Tests

#### User Journey Testing

1. **Method Selection** : User chooses appropriate payment method
2. **Information Entry** : User completes payment details accurately
3. **Security Confidence** : User trusts the security measures
4. **Error Recovery** : User handles payment errors effectively

#### Conversion Testing

1. **Method Preferences** : Which payment methods are preferred
2. **Abandonment Points** : Where users leave the flow
3. **Security Concerns** : What security features matter most
4. **Processing Anxiety** : How users react to processing time

### A/B Tests

#### Security Display

- **Variant A** : Minimal security indicators
- **Variant B** : Prominent security badges
- **Variant C** : Detailed security information
- **Métrique** : Completion rate and user confidence

#### Payment Method Order

- **Variant A** : Cards first
- **Variant B** : Fastest methods first
- **Variant C** : User's previous method first
- **Métrique** : Method selection and success rate

### Performance Metrics

```typescript
interface PaymentMetrics {
  flowCompletionRate: number       // Target: >95%
  averageFlowTime: number          // Target: <3 minutes
  firstAttemptSuccessRate: number  // Target: >90%
  securityConfidenceScore: number  // Target: >4.5/5
  errorRecoveryRate: number        // Target: >80%
}
```

## 💾 Stockage Local

### Payment Flow State

```typescript
interface PaymentFlowCache {
  currentSession: {
    paymentId: string
    step: PaymentFlowStep
    selectedMethod?: string
    formData: { [field: string]: any }
    timestamp: number
  }
  savedMethods: {
    methods: SavedPaymentMethod[]
    lastUsed?: string
    preferences: PaymentPreferences
  }
  securityState: {
    deviceFingerprint: string
    trustLevel: 'high' | 'medium' | 'low'
    lastSecurityCheck: number
  }
}
```

### Offline Capabilities

```typescript
interface OfflinePaymentCapabilities {
  savePaymentMethod: boolean      // Local storage only
  resumeFlowWhenOnline: boolean   // Continue from last step
  processPayment: false           // Requires connection
  validateCardFormat: boolean     // Client-side validation
  showSavedMethods: boolean      // From local storage
}
```

### Analytics Events

```typescript
const paymentEvents = {
  'payment_flow_started': {
    type: 'investment' | 'subscription',
    tier?: string,
    project_type?: 'ruche' | 'olivier' | 'parcelle_familiale',
    amount: number,
    source: 'project_detail' | 'quick_invest' | 'subscription_upgrade',
    timestamp: number
  },
  'payment_method_selected': {
    method_type: string,
    is_saved_method: boolean,
    timestamp: number
  },
  'payment_details_entered': {
    method_type: string,
    validation_errors: number,
    time_spent: number,
    timestamp: number
  },
  'payment_submitted': {
    amount: number,
    method_type: string,
    timestamp: number
  },
  'payment_completed': {
    amount: number,
    method_type: string,
    processing_time: number,
    success: boolean,
    error_code?: string,
    timestamp: number
  },
  'payment_abandoned': {
    step: string,
    reason?: string,
    time_spent: number,
    timestamp: number
  }
}
```

## 🔧 Sécurité & Compliance

### Data Protection

```typescript
interface SecurityMeasures {
  encryption: {
    inTransit: 'TLS 1.3',
    atRest: 'AES-256',
    keyManagement: 'HSM'
  },
  tokenization: {
    cardData: boolean,
    pciScope: 'reduced',
    tokenProvider: 'Stripe'
  },
  compliance: {
    pciDss: 'Level 1',
    gdpr: boolean,
    psd2: boolean,
    strongAuth: boolean
  }
}
```

### Fraud Prevention

```typescript
interface FraudPrevention {
  riskScoring: {
    deviceFingerprinting: boolean,
    behavioralAnalysis: boolean,
    velocityChecks: boolean,
    geoLocation: boolean
  },
  challengeFlow: {
    triggers: ['high_risk', 'new_device', 'large_amount'],
    methods: ['3ds', 'sms', 'biometric'],
    fallback: '3ds_mandatory'
  }
}
```