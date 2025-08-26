# Navigation Bar Component

## 🎯 Objectif

Composant de navigation principale qui permet aux utilisateurs de naviguer entre les sections principales de l'application via une barre d'onglets en bas d'écran.

## 🎨 Design & Layout

### Structure Visuelle

```text
┌─────────────────────────┐
│                         │
│    CONTENT AREA         │
│                         │
│                         │
│                         │
└─────────────────────────┘
┌─────────────────────────┐
│ [🏠] [🔍] [🎁] [👤]    │
│ Home Proj. Rewa Profile │
└─────────────────────────┘
```

### Design System

- **Height** : 80px (avec safe area)
- **Background** : White avec border-top subtle
- **Active tab** : Primary color + icon filled
- **Inactive tabs** : Neutral-400 + icon outline
- **Badge** : Red dot pour notifications

## 📱 Composants UI

### Tab Bar Container

```typescript
interface TabBarProps {
  state: TabNavigationState
  descriptors: TabDescriptorMap
  navigation: TabNavigationHelpers
  safeAreaInsets: EdgeInsets
}
```

### Individual Tab

```typescript
interface TabProps {
  route: Route
  focused: boolean
  onPress: () => void
  onLongPress: () => void
  label: string
  icon: {
    focused: React.ComponentType
    unfocused: React.ComponentType
  }
  badge?: {
    count: number
    maxCount: number
  }
}
```

### Tab Configuration

```typescript
const tabConfig = {
  dashboard: {
    label: "Accueil",
    icon: {
      focused: "home",
      unfocused: "home-outline"
    },
    testID: "tab-dashboard"
  },
  projects: {
    label: "Projets", 
    icon: {
      focused: "search",
      unfocused: "search-outline"
    },
    testID: "tab-projects"
  },
  rewards: {
    label: "Récompenses",
    icon: {
      focused: "gift",
      unfocused: "gift-outline"
    },
    badge: true,
    testID: "tab-rewards"
  },
  profile: {
    label: "Profil",
    icon: {
      focused: "person",
      unfocused: "person-outline"
    },
    badge: true,
    testID: "tab-profile"
  }
}
```

## 🔄 États & Interactions

### États Visuels

#### Tab Active

- **Icon** : Version filled, couleur primary-600
- **Label** : Typography-caption-bold, primary-600
- **Background** : Subtle highlight (primary-50)
- **Animation** : Scale 1.1 + bounce

#### Tab Inactive

- **Icon** : Version outline, couleur neutral-400
- **Label** : Typography-caption, neutral-500
- **Background** : Transparent
- **Animation** : Scale 1.0

#### Tab avec Badge

```typescript
interface TabBadge {
  visible: boolean
  count: number
  maxDisplayCount: 99
  position: 'top-right'
  color: 'error' | 'warning' | 'info'
}
```

### Interactions

#### Tab Press

```typescript
const handleTabPress = (routeName: string) => {
  // Haptic feedback
  HapticFeedback.impactAsync(HapticFeedback.ImpactFeedbackStyle.Light)
  
  // Analytics
  analytics.track('tab_pressed', { tab: routeName })
  
  // Navigation
  if (currentRoute === routeName) {
    // Reset stack si même tab
    navigation.popToTop()
  } else {
    navigation.navigate(routeName)
  }
}
```

#### Tab Long Press

```typescript
const handleTabLongPress = (routeName: string) => {
  // Haptic feedback stronger
  HapticFeedback.impactAsync(HapticFeedback.ImpactFeedbackStyle.Medium)
  
  // Show quick actions contextual menu
  showQuickActions(routeName)
}
```

### Quick Actions Menu

```typescript
interface QuickAction {
  label: string
  icon: string
  action: () => void
}

const quickActions = {
  dashboard: [
    { label: "Voir historique points", icon: "clock", action: () => {} },
    { label: "Mes investissements", icon: "trending-up", action: () => {} }
  ],
  projects: [
    { label: "Filtres", icon: "funnel", action: () => {} },
    { label: "Favoris", icon: "heart", action: () => {} }
  ],
  rewards: [
    { label: "Mon panier", icon: "cart", action: () => {} },
    { label: "Historique achats", icon: "receipt", action: () => {} }
  ],
  profile: [
    { label: "Paramètres", icon: "settings", action: () => {} },
    { label: "Support", icon: "help-circle", action: () => {} }
  ]
}
```

## 📡 API & Données

### Badge Data

```typescript
interface TabBadgeData {
  notifications: number      // Profile tab
  newRewards: number         // Rewards tab
  projectUpdates: number     // Projects tab
  pointsEarned: boolean      // Dashboard tab
}

// Real-time updates via WebSocket
const updateBadges = (data: TabBadgeData) => {
  setBadges(prev => ({
    ...prev,
    ...data
  }))
}
```

### Navigation State Persistence

```typescript
interface NavigationState {
  currentTab: string
  tabHistory: string[]
  stackState: {
    [tabName: string]: StackState
  }
}
```

## ✅ Validations

### Accessibility

#### VoiceOver Support

```typescript
const accessibilityProps = {
  accessible: true,
  accessibilityRole: "tab",
  accessibilityState: { selected: focused },
  accessibilityLabel: `${label}${badge ? `, ${badge} notifications` : ""}`,
  accessibilityHint: focused ? "Actuellement sélectionné" : `Naviguer vers ${label}`
}
```

#### Dynamic Type

- **Label sizing** : Adaptation automatique
- **Icon scaling** : Proportionnel au texte
- **Touch targets** : Minimum 44x44px

#### High Contrast

- **Colors** : Contrast ratio > 4.5:1
- **Focus indicators** : Border visible
- **Badge contrast** : White text sur background coloré

## 🚨 Gestion d'Erreurs

### Navigation Errors

```typescript
const errorHandling = {
  invalidRoute: {
    fallback: 'dashboard',
    logError: true,
    showToast: false
  },
  networkError: {
    allowOfflineNavigation: true,
    disableBadgeUpdates: true,
    showOfflineIndicator: true
  },
  deepLinkError: {
    parseError: 'fallback_to_dashboard',
    invalidParams: 'ignore_params',
    authRequired: 'redirect_to_login'
  }
}
```

### Performance Fallbacks

- **Badge loading failed** : Hide badge, continue navigation
- **Icon loading failed** : Fallback to text label
- **Animation performance** : Reduce motion on low-end devices

## 🔗 Navigation Behavior

### Tab Stack Management

```typescript
interface TabStackBehavior {
  resetOnTabSwitch: boolean    // false - preserve stacks
  maxStackDepth: number        // 10 screens max
  preloadAdjacent: boolean     // true - preload neighbor tabs
}
```

### Deep Link Handling

```typescript
const deepLinkRouting = {
  'makethechange://dashboard': { tab: 'dashboard', screen: 'Home' },
  'makethechange://projects': { tab: 'projects', screen: 'Discovery' },
  'makethechange://project/:id': { tab: 'projects', screen: 'Detail' },
  'makethechange://rewards': { tab: 'rewards', screen: 'Catalog' },
  'makethechange://product/:id': { tab: 'rewards', screen: 'ProductDetail' },
  'makethechange://profile': { tab: 'profile', screen: 'Profile' },
  'makethechange://settings': { tab: 'profile', screen: 'Settings' }
}
```

### Navigation Guards

```typescript
const navigationGuards = {
  requiresAuth: ['projects', 'rewards', 'profile'],
  requiresVerification: ['rewards'],
  offlineAvailable: ['dashboard', 'profile'],
  comingSoon: [] // Pour features désactivées
}
```

## 📝 Tests

### Interaction Tests

```typescript
const interactionTests = [
  {
    name: "Tab switching",
    steps: [
      "Tap dashboard tab",
      "Verify dashboard screen loads",
      "Tap projects tab", 
      "Verify projects screen loads"
    ]
  },
  {
    name: "Badge updates",
    steps: [
      "Receive notification",
      "Verify badge appears on profile tab",
      "Tap profile tab",
      "Verify badge disappears"
    ]
  },
  {
    name: "Long press actions",
    steps: [
      "Long press on projects tab",
      "Verify quick actions menu appears",
      "Tap outside menu",
      "Verify menu disappears"
    ]
  }
]
```

### Accessibility Tests

- **VoiceOver navigation** : Tab order logique
- **Voice Control** : Commands "Tap Dashboard", etc.
- **Switch Control** : Navigation séquentielle
- **Keyboard navigation** : Support clavier externe

### Performance Tests

```typescript
interface PerformanceMetrics {
  tabSwitchTime: number        // Target: <100ms
  badgeUpdateTime: number      // Target: <50ms
  memoryUsage: number          // Target: <50MB
  animationFrameRate: number   // Target: 60fps
}
```

## 💾 Stockage & State

### Tab State Management

```typescript
interface TabState {
  activeTab: string
  badges: TabBadgeData
  quickActionsVisible: boolean
  lastInteraction: number
}

// Persisted state
interface PersistedTabState {
  preferredStartTab: string
  tabOrder: string[]
  badgePreferences: {
    [tabName: string]: boolean
  }
}
```

### Analytics Events

```typescript
const tabAnalytics = {
  'tab_switched': {
    from_tab: string,
    to_tab: string,
    method: 'tap' | 'swipe' | 'deep_link',
    timestamp: number
  },
  'tab_long_pressed': {
    tab: string,
    quick_action_used?: string,
    timestamp: number
  },
  'tab_badge_interaction': {
    tab: string,
    badge_count: number,
    action: 'viewed' | 'cleared',
    timestamp: number
  }
}
```

## 🔧 Configuration

### Customization Options

```typescript
interface TabBarCustomization {
  showLabels: boolean          // true
  animateOnSwitch: boolean     // true
  hapticFeedback: boolean      // true
  badgeAnimation: boolean      // true
  quickActions: boolean        // true
}
```

### Platform Differences

#### iOS

- **Safe Area** : Respect home indicator
- **Haptic** : Use UIImpactFeedbackGenerator
- **Accessibility** : UIAccessibility traits

#### Android

- **Material Design** : Ripple effects
- **System Navigation** : Respect gesture navigation
- **Accessibility** : TalkBack support
