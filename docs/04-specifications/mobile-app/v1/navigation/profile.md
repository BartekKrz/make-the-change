# Profil Utilisateur

> **💡 RÉFÉRENCE** : Voir [../../mobile-conventions/03-conventions-patterns.md](../../mobile-conventions/03-conventions-patterns.md) pour les patterns complets d'utilisation des composants Screen et les conventions de hooks.

## 🎯 Objectif

Interface de gestion du profil utilisateur permettant de consulter ses informations personnelles, historiques d'activité, paramètres de compte et fonctionnalités avancées.

## 🎨 Design & Layout

### Structure Visuelle

```text
┌─────────────────────────┐
│ [Photo] Jean Dupont  ⚙️ │
│ jean@email.com          │
│ 🏅 Niveau {user.userLevel}          │
│                         │
│ ┌─────┬─────┬─────┬─────┐│
│ │ 15  │1,250│ 8   │ 95% ││
│ │Proj │Pts  │Ach  │Sat  ││
│ └─────┴─────┴─────┴─────┘│
│                         │
│ 📊 Mon Activité         │
│ ┌───────────────────────┐ │
│ │ 📈 Investissements    │ │
│ │ 🎁 Commandes          │ │
│ │ ⭐ Avis & Notes       │ │
│ │ 📜 Historique Points  │ │
│ └───────────────────────┘ │
│                         │
│ 🏆 Gamification         │
│ ┌───────────────────────┐ │
│ │ 🏅 Mes Badges         │ │
│ │ 🎯 Défis en cours     │ │
│ │ 🤝 Parrainage         │ │
│ │ 🌍 Classement Impact  │ │
│ └───────────────────────┘ │
│                         │
│ ⚙️ Paramètres           │
│ ┌───────────────────────┐ │
│ │ 👤 Informations       │ │
│ │ 🔔 Notifications      │ │
│ │ 🔒 Sécurité           │ │
│ │ 💳 Moyens de paiement │ │
│ │ 💰 Gestion abonnement │ │
│ │ 📍 Adresses           │ │
│ │ 🎯 Préférences        │ │
│ └───────────────────────┘ │
│                         │
│ ••••• Navigation ••••• │
└─────────────────────────┘
```

### Design System

- **Header** : Photo profile + nom + niveau gamification
- **Stats Cards** : Grid 4 colonnes avec métriques clés
- **Activity Section** : Liste des activités récentes
- **Settings Menu** : Liste des options de configuration
- **Achievement Badges** : Système de récompenses visuelles

## 📱 Composants UI

### Profile Header

```typescript
interface ProfileHeaderProps {
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
    avatar?: string
    userLevel: 'explorateur' | 'protecteur' | 'ambassadeur'
    memberSince: Date
  }
  onEditProfile: () => void
  onSettingsPress: () => void
}
```

### Stats Dashboard

```typescript
interface StatsCardProps {
  stats: {
    projectsInvested: number
    currentPoints: number
    achievementsUnlocked: number
    satisfactionRate: number
    totalInvested: number
    totalEarned: number
  }
  onStatPress: (statType: string) => void
}
```

### Activity Feed

```typescript
interface ActivityFeedProps {
  activities: {
    id: string
    type: 'investment' | 'points_earned' | 'order' | 'review' | 'achievement'
    title: string
    description: string
    timestamp: Date
    metadata: {
      amount?: number
      points?: number
      projectName?: string
      orderNumber?: string
    }
    icon: string
    color: string
  }[]
  onViewAll: () => void
  loading: boolean
}
```

### Settings Menu

```typescript
interface SettingsMenuProps {
  sections: {
    id: string
    title: string
    items: {
      id: string
      label: string
      icon: string
      rightComponent?: 'arrow' | 'switch' | 'badge'
      rightValue?: string | boolean | number
      onPress: () => void
    }[]
  }[]
}
```

### Achievement System

```typescript
interface AchievementProps {
  achievements: {
    id: string
    title: string
    description: string
    icon: string
    rarity: 'common' | 'rare' | 'epic' | 'legendary'
    unlockedAt?: Date
    progress?: {
      current: number
      target: number
    }
  }[]
  onViewAllAchievements: () => void
}
```

## 🔄 États & Interactions

### États de Chargement

#### Profile Data Loading

```typescript
interface ProfileLoadingState {
  userInfo: 'loading' | 'loaded' | 'error'
  stats: 'loading' | 'loaded' | 'error'
  activities: 'loading' | 'loaded' | 'empty' | 'error'
  achievements: 'loading' | 'loaded' | 'error'
  settings: 'loading' | 'loaded' | 'error'
}
```

#### Avatar Upload

```typescript
interface AvatarUploadState {
  uploading: boolean
  progress: number
  error?: string
  preview?: string
}
```

### Interactions Avancées

#### Profile Picture Management

```typescript
const avatarActions = {
  takePhoto: {
    permission: 'camera',
    quality: 0.8,
    allowsEditing: true,
    aspect: [1, 1]
  },
  chooseFromLibrary: {
    permission: 'photos',
    mediaTypes: 'Images',
    allowsEditing: true,
    quality: 0.8
  },
  removePhoto: {
    confirmation: true,
    fallback: 'default_avatar'
  }
}
```

#### Stats Interaction

```typescript
// Tap sur les stats cards
const statsInteractions = {
  projectsInvested: () => navigation.navigate('MyInvestments'),
  currentPoints: () => navigation.navigate('PointsHistory'),
  achievements: () => navigation.navigate('Achievements'),
  satisfaction: () => navigation.navigate('ReviewsHistory')
}
```

#### Pull-to-Refresh

```typescript
const refreshBehavior = {
  trigger: 'pull_down',
  refreshData: ['profile', 'stats', 'activities'],
  animation: 'spinner',
  hapticFeedback: true
}
```

### Gamification Elements

#### Level System

```typescript
interface UserLevelSystem {
  currentUserLevel: 'explorateur' | 'protecteur' | 'ambassadeur'
  // Les bénéfices et la progression sont gérés par le backend et les règles métier
}
```

#### Achievement Unlocking

```typescript
const achievementUnlock = {
  animation: {
    type: 'celebration',
    duration: 3000,
    confetti: true,
    haptic: 'notificationSuccess'
  },
  notification: {
    title: "Nouveau succès débloqué !",
    body: achievement.title,
    sound: 'achievement_unlock.mp3'
  }
}
```

## 📡 API & Données

### Profile Data Endpoint

```typescript
GET /api/user/profile
Authorization: Bearer {accessToken}

interface ProfileResponse {
  user: UserProfile
  stats: UserStats
  tier: UserTier
  achievements: Achievement[]
  recentActivities: Activity[]
  preferences: UserPreferences
}
```

### Profile Update

```typescript
PUT /api/user/profile
{
  firstName?: string
  lastName?: string
  email?: string
  phoneNumber?: string
  preferences?: UserPreferences
}

// Avatar upload
POST /api/user/avatar
Content-Type: multipart/form-data
{
  avatar: File
}
```

### Activity History

```typescript
GET /api/user/activities
Query Parameters:
- page: number
- limit: number
- type?: 'investment' | 'points' | 'orders' | 'reviews' | 'achievement'
- dateFrom?: string
- dateTo?: string

interface ActivitiesResponse {
  activities: Activity[]
  pagination: PaginationInfo
  summary: {
    totalCount: number
    typeBreakdown: { [type: string]: number }
  }
}
```

### Settings Management

```typescript
GET /api/user/settings
PUT /api/user/settings
{
  notifications: NotificationPreferences
  privacy: PrivacySettings
  communications: CommunicationPreferences
  theme: 'light' | 'dark' | 'auto'
  language: string
}
```

## ✅ Validations

### Profile Validation

```typescript
interface ProfileValidation {
  email: {
    required: true
    format: RegExp
    unique: true
  }
  phoneNumber: {
    format: RegExp
    required: false
  }
  firstName: {
    minLength: 2
    maxLength: 50
    required: true
  }
  lastName: {
    minLength: 2
    maxLength: 50
    required: true
  }
}
```

### Data Consistency

#### Profile Completeness

```typescript
const profileCompleteness = {
  basic: ['firstName', 'lastName', 'email'], // 30%
  contact: ['phoneNumber', 'address'],       // 20%
  preferences: ['categories', 'notifications'], // 20%
  verification: ['emailVerified', 'phoneVerified'], // 20%
  avatar: ['profilePicture']                 // 10%
}
```

#### Security Validations

```typescript
const securityChecks = {
  passwordStrength: {
    minLength: 8,
    requireUppercase: true,
    requireNumbers: true,
    requireSpecialChars: true
  },
  twoFactorAuth: {
    methods: ['sms', 'authenticator', 'email'],
    required: false,
    recommended: true
  },
  sessionManagement: {
    maxActiveSessions: 5,
    sessionTimeout: 30 * 24 * 60 * 60 * 1000 // 30 jours
  }
}
```

## 🚨 Gestion d'Erreurs

### Profile Update Errors

```typescript
const profileErrors = {
  emailAlreadyExists: {
    code: 'EMAIL_EXISTS',
    message: "Cette adresse email est déjà utilisée",
    action: {
      suggestLogin: true,
      allowEmailEdit: true
    }
  },
  invalidPhoneNumber: {
    code: 'INVALID_PHONE',
    message: "Numéro de téléphone invalide",
    action: {
      showFormatExample: true,
      allowCountrySelection: true
    }
  },
  avatarUploadFailed: {
    code: 'AVATAR_UPLOAD_FAILED',
    message: "Impossible de télécharger la photo",
    action: {
      retryUpload: true,
      keepPreviousAvatar: true
    }
  }
}
```

### Data Loading Errors

```typescript
const dataErrors = {
  profileLoadFailed: {
    message: "Impossible de charger le profil",
    fallback: "show_cached_profile",
    action: "retry_load"
  },
  statsUnavailable: {
    message: "Statistiques temporairement indisponibles",
    fallback: "hide_stats_section",
    action: "retry_later"
  },
  activitiesError: {
    message: "Erreur lors du chargement de l'activité",
    fallback: "show_empty_state",
    action: "retry_activities"
  }
}
```

## 🔗 Navigation

### Profile Navigation

#### From Profile Screen

```typescript
const navigationRoutes = {
  'EditProfile': {
    route: 'EditProfile',
    presentation: 'modal',
    animation: 'slideInUp'
  },
  'Settings': {
    route: 'Settings',
    animation: 'slideInRight'
  },
  'MyInvestments': {
    route: 'MyInvestments',
    animation: 'slideInRight'
  },
  'PointsHistory': {
    route: 'PointsHistory',
    presentation: 'modal'
  },
  'Achievements': {
    route: 'Achievements',
    animation: 'slideInRight'
  }
}
```

#### Settings Submenu - DUAL BILLING INTEGRATION

```typescript
const settingsNavigation = {
  'PersonalInfo': 'PersonalInfoScreen',
  'Notifications': 'NotificationSettingsScreen',
  'Security': 'SecuritySettingsScreen',
  'PaymentMethods': 'PaymentMethodsScreen',
  'SubscriptionManagement': 'SubscriptionManagementScreen', // NOUVEAU
  'Addresses': 'AddressesScreen',
  'Preferences': 'PreferencesScreen',
  'Privacy': 'PrivacySettingsScreen',
  'Support': 'SupportScreen',
  'About': 'AboutScreen'
}
```

#### NOUVEAU: Subscription Management Screen

```typescript
interface SubscriptionManagementProps {
  currentSubscription?: {
    tier: 'ambassadeur_standard' | 'ambassadeur_premium'
    billingFrequency: 'monthly' | 'annual'
    nextBillingDate: Date
    amount: number
    stripeSubscriptionId?: string
    stripeCustomerId: string
  }
  
  billingPreferences: {
    // Préférences billing frequency pour futures actions
    preferredFrequency: 'monthly' | 'annual'
    autoUpgradeToAnnual: boolean // Après X mois
    upgradeThreshold: number // Mois avant suggestion annual
  }
  
  availableActions: {
    changeBillingFrequency: boolean
    upgradeToAnnual: boolean
    downgradeToMonthly: boolean
    cancelSubscription: boolean
    pauseSubscription: boolean
  }
  
  onChangeFrequency: (newFrequency: 'monthly' | 'annual') => void
  onOpenStripePortal: () => void
  onContactSupport: () => void
}
```

### Deep Links - DUAL BILLING

```typescript
const profileDeepLinks = {
  'makethechange://profile': 'ProfileScreen',
  'makethechange://profile/edit': 'EditProfileScreen',
  'makethechange://profile/settings': 'SettingsScreen',
  'makethechange://profile/subscription': 'SubscriptionManagementScreen', // NOUVEAU
  'makethechange://profile/billing': 'SubscriptionManagementScreen', // NOUVEAU
  'makethechange://profile/investments': 'MyInvestmentsScreen',
  'makethechange://profile/points': 'PointsHistoryScreen',
  'makethechange://profile/achievements': 'AchievementsScreen'
}
```

## 📝 Tests Utilisateur

### Profile Management Tests

#### Profile Completion

1. **First Visit** : User understands profile completeness
2. **Information Update** : User can edit personal information
3. **Avatar Upload** : User can add/change profile picture
4. **Settings Navigation** : User finds and accesses settings

#### Activity Understanding

1. **Stats Interpretation** : User understands their metrics
2. **Activity Timeline** : User can follow their journey
3. **Achievement Recognition** : User values achievement system

### A/B Tests

#### Stats Display

- **Variant A** : Numbers only
- **Variant B** : Numbers with progress bars
- **Variant C** : Gamified level display
- **Métrique** : Engagement with stats

#### Navigation Style

- **Variant A** : List style menu
- **Variant B** : Card-based layout
- **Variant C** : Icon grid layout
- **Métrique** : Settings usage rate

### Usability Tests

```typescript
interface ProfileUsabilityMetrics {
  profileCompletionRate: number    // Target: >80%
  settingsAccessRate: number       // Target: >60%
  avatarUploadSuccess: number      // Target: >90%
  informationUpdateSuccess: number // Target: >95%
}
```

## 💾 Stockage Local

### Profile Cache

```typescript
interface ProfileCache {
  userProfile: {
    data: UserProfile
    lastUpdate: number
    ttl: number // 1 hour
  }
  userStats: {
    data: UserStats
    lastUpdate: number
    ttl: number // 15 minutes
  }
  activities: {
    data: Activity[]
    lastUpdate: number
    ttl: number // 5 minutes
  }
  settings: {
    data: UserSettings
    lastUpdate: number
    ttl: number // 24 hours
  }
}
```

### Offline Capabilities

```typescript
interface OfflineProfileCapabilities {
  viewProfile: boolean           // Cached data
  editBasicInfo: boolean        // Sync when online
  viewStats: boolean            // Cached data
  viewActivities: boolean       // Cached data
  changeSettings: boolean       // Local storage, sync later
  uploadAvatar: false          // Requires connection
}
```

### Analytics Events

```typescript
const profileEvents = {
  'profile_viewed': {
    timestamp: number,
    source: 'tab_switch' | 'deep_link'
  },
  'profile_edited': {
    fields_changed: string[],
    completion_before: number,
    completion_after: number,
    timestamp: number
  },
  'avatar_uploaded': {
    method: 'camera' | 'library',
    file_size: number,
    upload_duration: number,
    timestamp: number
  },
  'settings_accessed': {
    setting_type: string,
    timestamp: number
  },
  'achievement_viewed': {
    achievement_id: string,
    unlocked: boolean,
    timestamp: number
  },
  'stats_interacted': {
    stat_type: string,
    value: number,
    timestamp: number
  }
}
```

## 🔧 Fonctionnalités Avancées

### Privacy & Security

```typescript
interface PrivacyFeatures {
  dataExport: {
    formats: ['json', 'csv', 'pdf']
    includeActivities: boolean
    includePreferences: boolean
  }
  dataManagement: {
    downloadData: () => Promise<void>
    deleteAccount: () => Promise<void>
    anonymizeData: () => Promise<void>
  }
  privacyControls: {
    profileVisibility: 'public' | 'friends' | 'private'
    activitySharing: boolean
    marketingOptIn: boolean
  }
}
```

### Accessibility Features

```typescript
interface AccessibilityFeatures {
  voiceOver: {
    profileDescription: string
    statsAnnouncement: string
    navigationGuide: string
  }
  dynamicType: {
    supportedSizes: string[]
    scaleImages: boolean
  }
  highContrast: {
    colorTheme: 'light' | 'dark' | 'auto'
    boldText: boolean
  }
  motorAccessibility: {
    largerTouchTargets: boolean
    simplifiedGestures: boolean
  }
}
```

### Notification Management - DUAL BILLING EXTENSION

```typescript
interface NotificationManagement {
  categories: {
    investments: {
      projectUpdates: boolean
      harvestNotifications: boolean
      paymentReminders: boolean
    }
    rewards: {
      newProducts: boolean
      pointsExpiry: boolean
      orderUpdates: boolean
    }
    account: {
      securityAlerts: boolean
      profileUpdates: boolean
      loginNotifications: boolean
    }
    // NOUVEAU: Billing & Subscription notifications
    billing: {
      upcomingRenewal: boolean // 7 jours avant renouvellement
      paymentSuccess: boolean
      paymentFailed: boolean
      annualUpgradePrompts: boolean // Pour monthly subscribers
      billingFrequencyChanges: boolean
      stripePortalAccess: boolean
    }
    marketing: {
      newsletters: boolean
      promotions: boolean
      surveys: boolean
      annualDiscountOffers: boolean // NOUVEAU: Promotions annual billing
    }
  }
  delivery: {
    push: boolean
    email: boolean
    sms: boolean
  }
  schedule: {
    quietHours: {
      enabled: boolean
      start: string // "22:00"
      end: string   // "08:00"
    }
    weekendNotifications: boolean
  }
}
```