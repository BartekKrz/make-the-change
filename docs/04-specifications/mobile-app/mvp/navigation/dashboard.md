# Dashboard (Accueil)

## 🎯 Objectif

Vue d'ensemble personnalisée et **adaptative selon le niveau utilisateur** (Explorateur/Protecteur/Ambassadeur), offrant un aperçu contextualisé du statut et encourageant la progression naturelle dans le modèle hybride.

## 🎨 Design & Layout

### Structure Adaptative par Niveau

#### **EXPLORATEUR (Gratuit) - Focus Découverte**
```text
┌─────────────────────────┐
│ 🔓 Bonjour Prénom!   ⚙️ │
│ Mode découverte gratuite │
│                         │
│ ┌─────────────────────┐ │
│ │ 🌱 Commencez votre  │ │
│ │    aventure         │ │
│ │ Explorez gratuitement │ │
│ │ [Découvrir projets] │ │
│ └─────────────────────┘ │
│                         │
│ Projets Populaires      │
│ ┌────┐ ┌────┐ ┌────┐   │
│ │🐝  │ │🌳  │ │🍀  │   │
│ │Marc│ │Oli │ │Bio │   │
│ └────┘ └────┘ └────┘   │
│                         │
│ ┌─────────────────────┐ │
│ │ 🚀 Prêt à investir? │ │
│ │ 50€ → 65 points     │ │
│ │ [Voir comment ça    │ │
│ │  marche]            │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

#### **PROTECTEUR (Investisseur) - Focus Points & Projets**
```text
┌─────────────────────────┐
│ 🐝 Bonjour Prénom!   ⚙️ │
│ Niveau: Protecteur       │
│                         │
│ ┌─────────────────────┐ │
│ │   Vos Points  ⏰65j │ │
│ │      1,250          │ │
│ │   [Utiliser points] │ │
│ └─────────────────────┘ │
│                         │
│ Vos Projets Soutenus    │
│ ┌────┐ ┌────┐ ┌────┐   │
│ │🐝✅│ │🌳📊│ │🍯📸│   │
│ │Marc│ │Oli │ │Miel│   │
│ └────┘ └────┘ └────┘   │
│ [Voir mes updates]      │
│                         │
│ ┌─────────────────────┐ │
│ │ 🎁 Nouveaux produits│ │
│ │ Miel d'acacia - 25pts│ │
│ │ [Voir catalogue]    │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

#### **AMBASSADEUR (Premium) - Focus Portfolio & Analytics**
```text
┌─────────────────────────┐
│ 👑 Bonjour Prénom!   ⚙️ │
│ Ambassadeur Premium      │
│                         │
│ ┌─────────────────────┐ │
│ │ Portfolio Performance│ │
│ │   +12% ce mois 📈   │ │
│ │ 525 pts │ 8 projets │ │
│ │ [Voir analytics]    │ │
│ └─────────────────────┘ │
│                         │
│ Allocation Flexible     │
│ ┌────┐ ┌────┐ ┌────┐   │
│ │🐝60%││🌳30%││🍀10%│   │
│ │150p│ │75p │ │25p │   │
│ └────┘ └────┘ └────┘   │
│ [Optimiser allocation]  │
│                         │
│ ┌─────────────────────┐ │
│ │ ⭐ Accès Exclusif    │ │
│ │ Nouveau producteur  │ │
│ │ [Voir opportunité]  │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

### Design System

- **Background** : Gradient subtle primary-50 → white
- **Header** : Safe area + padding 16px
- **Cards** : Border-radius 12px, shadow-sm, white background
- **Points display** : Typography-display-lg, color-primary-700
- **Project cards** : Square 80x80px, border-radius 8px
- **CTA Card** : Full width, primary background

## 📱 Composants UI

### Header Component Adaptatif

```typescript
interface DashboardHeaderProps {
  user: {
    firstName: string
    level: 'explorateur' | 'protecteur' | 'ambassadeur'
    avatar?: string
  }
  notificationCount?: number
  onNotificationPress: () => void
  onSettingsPress: () => void
  levelBadgeConfig: LevelBadgeConfig
}

interface LevelBadgeConfig {
  explorateur: {
    icon: '🔓'
    text: 'Mode découverte gratuite'
    color: 'blue-500'
    ctaButton: { text: 'Investir', action: 'show_investment_options' }
  }
  protecteur: {
    icon: '🐝'
    text: 'Niveau: Protecteur'
    color: 'green-600'
    badge: 'verified'
  }
  ambassadeur: {
    icon: '👑'
    text: 'Ambassadeur Premium'
    color: 'yellow-500'
    premium: true
  }
}
```

### Points Widget (Protecteur/Ambassadeur seulement)

```typescript
interface PointsWidgetProps {
  currentBalance: number
  expiryInfo?: {
    nextExpiryDate: Date
    expiringAmount: number
    daysRemaining: number
  }
  lastEarned?: {
    amount: number
    source: string
    date: Date
  }
  onViewHistory: () => void
  onQuickShop: () => void
  loading?: boolean
  urgentAction?: boolean  // Si expiration proche
}
```

### Widgets Adaptatifs par Niveau

#### **Widget Explorateur - Discovery CTA**
```typescript
interface ExplorateurDiscoveryWidgetProps {
  featuredProjects: Project[]
  socialProof: {
    totalInvestors: number
    recentActivity: string[]
  }
  onDiscoverProjects: () => void
  onLearnMore: () => void
}

const ExplorateurDiscoveryWidget = ({
  featuredProjects,
  socialProof,
  onDiscoverProjects,
  onLearnMore
}) => (
  <View style={styles.discoveryWidget}>
    <Text style={styles.welcomeTitle}>🌱 Commencez votre aventure</Text>
    <Text style={styles.welcomeSubtitle}>
      Explorez {featuredProjects.length} projets gratuitement
    </Text>
    <Text style={styles.socialProof}>
      {socialProof.totalInvestors} personnes ont déjà investi
    </Text>
    <View style={styles.ctaButtons}>
      <Button variant="primary" onPress={onDiscoverProjects}>
        Découvrir projets
      </Button>
      <Button variant="outline" onPress={onLearnMore}>
        Comment ça marche ?
      </Button>
    </View>
    <View style={styles.valueProposition}>
      <Text style={styles.valueText}>
        🚀 Investissez quand vous êtes prêt: 50€ → 65 points
      </Text>
    </View>
  </View>
)
```

#### **Widget Ambassadeur - Portfolio Analytics**
```typescript
interface AmbassadeurAnalyticsWidgetProps {
  portfolio: {
    totalValue: number
    monthlyGrowth: number
    projectCount: number
    efficiency: number
  }
  allocation: {
    [projectType: string]: {
      percentage: number
      points: number
    }
  }
  onViewAnalytics: () => void
  onOptimizeAllocation: () => void
}
```

### Project Cards Carousel

```typescript
interface ProjectCardProps {
  project: {
    id: string
    name: string
    image: string
    status: 'active' | 'completed' | 'harvesting'
    investedAmount: number
    estimatedReturn: number
  }
  onPress: (projectId: string) => void
}

interface ProjectCarouselProps {
  projects: ProjectCardProps['project'][]
  onSeeAll: () => void
  loading?: boolean
}
```

### CTA Banner

```typescript
interface CTABannerProps {
  title: string
  subtitle?: string
  buttonText: string
  onPress: () => void
  variant: 'primary' | 'secondary' | 'seasonal'
}

/*
État Alternatif : Si l'utilisateur a investi dans tous les projets disponibles, 
le CTA change pour "Découvrir les dernières récompenses" et redirige vers le catalogue.
*/
```

## 🔄 États & Interactions

### États de Chargement

#### Initial Load (First Visit)

```typescript
interface DashboardLoadingState {
  userProfile: 'loading' | 'loaded' | 'error'
  pointsBalance: 'loading' | 'loaded' | 'error'
  projects: 'loading' | 'loaded' | 'empty' | 'error'
  recommendations: 'loading' | 'loaded' | 'error'
}
```

#### Skeleton Loading

- **Points Widget** : Shimmer effect sur le nombre
- **Project Cards** : 3 cards skeleton avec shimmer
- **CTA Banner** : Gradient loading animation

#### Pull-to-Refresh

```typescript
const refreshBehavior = {
  trigger: 'pull_down',
  refreshData: ['points', 'projects', 'notifications'],
  animation: 'spinner',
  hapticFeedback: true,
  timeout: 5000
}
```

### États des Données

#### Empty States

1. **No Projects** : Illustration + CTA vers découverte
2. **No Points** : Message encourageant premier investissement
3. **Network Error** : Retry button + offline indicator

#### Error States

1. **Data Loading Failed** : Toast + retry automatique
2. **Partial Load** : Affichage des données disponibles
3. **Authentication Error** : Redirect vers login

### Interactions Avancées

#### Haptic Feedback

- **Card tap** : Light impact
- **Points earned** : Success notification
- **Pull refresh** : Medium impact au déclenchement

#### Animations

```typescript
const animations = {
  pointsUpdate: {
    type: 'spring',
    duration: 800,
    countUp: true
  },
  cardEntry: {
    type: 'slideInUp',
    stagger: 100,
    duration: 400
  },
  projectStatus: {
    type: 'pulse',
    repeat: true,
    condition: 'status === "harvesting"'
  }
}
```

## 📡 API & Données

### Dashboard Data Endpoint

```typescript
GET /api/dashboard
Authorization: Bearer {accessToken}

interface DashboardResponse {
  user: {
    id: string
    firstName: string
    lastName: string
    avatar?: string
  }
  points: {
    current: number
    pending: number
    lifetime: number
    lastEarned?: {
      amount: number
      source: string
      date: string
    }
  }
  projects: {
    active: ProjectSummary[]
    completed: ProjectSummary[]
    totalInvested: number
    totalReturned: number
  }
  notifications: {
    unread: number
    latest: NotificationSummary[]
  }
  recommendations: {
    newProjects: ProjectSummary[]
    seasonalOffers: SpecialOffer[]
  }
}
```

### Real-time Updates

```typescript
// WebSocket pour updates temps réel
interface RTUpdate {
  type: 'points_earned' | 'project_status' | 'notification'
  data: {
    pointsEarned?: number
    projectId?: string
    newStatus?: string
    message?: string
  }
  timestamp: string
}
```

### Caching Strategy

```typescript
const cacheConfig = {
  userProfile: { ttl: 24 * 60 * 60 * 1000 }, // 24h
  pointsBalance: { ttl: 5 * 60 * 1000 },      // 5min
  projects: { ttl: 15 * 60 * 1000 },          // 15min
  recommendations: { ttl: 60 * 60 * 1000 }    // 1h
}
```

## ✅ Validations

### Data Validation

```typescript
interface DashboardValidation {
  pointsBalance: {
    type: 'number'
    minimum: 0
    maximum: 1000000
  }
  projectsCount: {
    type: 'number'
    minimum: 0
    maximum: 50
  }
  notificationCount: {
    type: 'number'
    minimum: 0
    maximum: 999
  }
}
```

### Business Rules

#### Points Display

- **Arrondi** : Pas de décimales pour < 1000 points
- **Format** : 1,250 pts (virgule séparateur milliers)
- **Couleurs** : Vert si gain récent, neutral sinon

#### Project Status

```typescript
const statusRules = {
  active: { color: 'blue', icon: '🔄' },
  harvesting: { color: 'orange', icon: '🌾', pulse: true },
  completed: { color: 'green', icon: '✅' },
  expired: { color: 'gray', icon: '⏰' }
}
```

## 🚨 Gestion d'Erreurs

### Erreurs de Chargement

#### Network Errors

```typescript
const networkErrorHandling = {
  timeout: {
    duration: 10000,
    message: "Chargement trop lent",
    action: "retry"
  },
  offline: {
    message: "Mode hors ligne",
    showCachedData: true,
    action: "refresh_when_online"
  },
  serverError: {
    message: "Erreur temporaire",
    action: "retry_with_backoff"
  }
}
```

#### Data Errors

1. **Invalid Points Balance** : Fallback vers cache
2. **Missing Projects** : Affichage état vide
3. **Corrupted User Data** : Re-fetch profile

### Graceful Degradation

```typescript
const fallbackBehavior = {
  noInternet: {
    showCachedData: true,
    disableInteractions: false,
    showOfflineIndicator: true
  },
  partialData: {
    hideFailedSections: false,
    showErrorMessages: true,
    allowRetry: true
  }
}
```

## 🔗 Navigation

### Navigation Interne

#### Tab Navigation

- **Current Tab** : Dashboard (highlighted)
- **Accessible Tabs** : Projects, Rewards, Profile
- **Badge** : Notification count sur Profile tab

#### Screen Navigation

```typescript
const navigationRoutes = {
  'PointsHistory': 'modal',
  'ProjectDetail': 'push',
  'ProjectsDiscovery': 'tab_switch',
  'NotificationsList': 'modal',
  'Settings': 'modal'
}
```

### Deep Links

```typescript
const dashboardDeepLinks = {
  'makethechange://dashboard': 'DashboardScreen',
  'makethechange://points': 'DashboardScreen + PointsModal',
  'makethechange://my-projects': 'DashboardScreen + ProjectsList'
}
```

### State Management

```typescript
// Navigation state persistance
interface DashboardNavState {
  lastVisitedTab: string
  scrollPosition: number
  expandedSections: string[]
  cachedData: DashboardData
}
```

## 📝 Tests Utilisateur

### User Journey Tests

#### First-Time User

1. **Onboarding completion** → Dashboard first view
2. **Empty state understanding** : User knows next steps
3. **CTA effectiveness** : User navigates to projects

#### Returning User

1. **Data recognition** : User sees their progress
2. **New content discovery** : Notifications/recommendations
3. **Quick navigation** : Efficient access to key features

### Performance Tests

```typescript
interface PerformanceMetrics {
  timeToInteractive: number    // Target: <2s
  firstContentfulPaint: number // Target: <1s
  largestContentfulPaint: number // Target: <2.5s
  cumulativeLayoutShift: number  // Target: <0.1
}
```

### A/B Tests

#### Points Widget Variants

- **Variant A** : Numerical display only
- **Variant B** : Progress bar + number
- **Variant C** : Gamified level system
- **Métrique** : Engagement rate

#### CTA Banner Tests

- **Variant A** : "Découvrir projets"
- **Variant B** : "Investir maintenant"
- **Variant C** : "Faire la différence"
- **Métrique** : Click-through rate

### Accessibility Tests

- **VoiceOver** : Lecture logique widgets → projets → CTA
- **Dynamic Type** : Adaptation tailles de police
- **Reduced Motion** : Animations réduites si préférence
- **High Contrast** : Lisibilité optimale

## 💾 Stockage Local

### Cache Management

```typescript
interface DashboardCache {
  userProfile: UserProfile
  pointsBalance: PointsData
  recentProjects: ProjectSummary[]
  lastRefresh: number
  version: string
}
```

### Offline Support

```typescript
interface OfflineCapabilities {
  viewCachedData: boolean
  readNotifications: boolean
  browseProjects: boolean     // Cached list only
  makeInvestments: false      // Requires connection
  earnPoints: false           // Requires connection
}
```

### Analytics Events

```typescript
const dashboardEvents = {
  'dashboard_viewed': {
    timestamp: number,
    source: 'tab_switch' | 'deep_link' | 'launch',
    cached_data: boolean
  },
  'points_widget_tapped': {
    current_balance: number,
    timestamp: number
  },
  'project_card_tapped': {
    project_id: string,
    project_status: string,
    card_position: number
  },
  'cta_banner_tapped': {
    banner_type: string,
    timestamp: number
  },
  'refresh_triggered': {
    method: 'pull_to_refresh' | 'button' | 'automatic',
    timestamp: number
  }
}
```

## 🔧 Optimisations Techniques

### Performance

- **Image optimization** : WebP, lazy loading, caching
- **List virtualization** : Si > 10 projects
- **Memory management** : Cleanup sur navigation away
- **Network optimization** : Request batching, compression

### Monitoring

```typescript
const monitoring = {
  crashReporting: 'Sentry',
  analytics: 'Mixpanel',
  performance: 'Firebase Performance',
  featureFlags: 'LaunchDarkly'
}
```
