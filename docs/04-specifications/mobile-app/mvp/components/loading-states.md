# États de Chargement & Transitions

> **💡 RÉFÉRENCE** : Voir [../mobile-conventions/03-conventions-patterns.md](../mobile-conventions/03-conventions-patterns.md) pour les patterns complets d'utilisation du composant Screen.Loading et les conventions de hooks.

## 🎯 Objectif

Fournir des états de chargement cohérents et des animations fluides pour améliorer l'expérience utilisateur lors des transitions et des opérations asynchrones.

## 🎨 Design & Layout

### États de Chargement Principaux

```text
┌─────────────────────────┐
│ ⚡ SKELETON LOADING      │
│                         │
│ ┌─────────────────────────┐│
│ │ ████████████████████    ││
│ │ ██████████████          ││
│ │ ████████                ││
│ └─────────────────────────┘│
│                         │
│ ┌─────────────────────────┐│
│ │ ████ ██████████████     ││
│ │ ████ ████████           ││
│ │ ████ ██████             ││
│ └─────────────────────────┘│
│                         │
│ ┌─────────────────────────┐│
│ │ ████████████████████    ││
│ │ ██████████              ││
│ └─────────────────────────┘│
└─────────────────────────┘

┌─────────────────────────┐
│ 🔄 SPINNER LOADING      │
│                         │
│         ⚡ ⚡ ⚡         │
│       Chargement...     │
│                         │
│ [Animation circulaire]  │
└─────────────────────────┘

┌─────────────────────────┐
│ 📊 PROGRESS LOADING     │
│                         │
│ Mise à jour du panier   │
│ ████████████░░░░░░░░    │
│ 65% terminé             │
│                         │
│ Étape 2 sur 3           │
└─────────────────────────┘

┌─────────────────────────┐
│ 🎭 CONTEXTUAL LOADING   │
│                         │
│ 🍯 Ajout au panier...   │
│                         │
│ [Produit en animation]  │
│                         │
│ ✓ Ajouté avec succès !  │
└─────────────────────────┘
```

### États de Transition

```text
┌─────────────────────────┐
│ 🔄 FADE TRANSITION      │
│                         │
│ [Contenu sortant]       │
│ Opacity: 1 → 0.3 → 0    │
│                         │
│ [Contenu entrant]       │
│ Opacity: 0 → 0.3 → 1    │
└─────────────────────────┘

┌─────────────────────────┐
│ ➡️ SLIDE TRANSITION     │
│                         │
│ [Écran A] → [Écran B]   │
│ X: 0 → -100% | 100% → 0 │
│                         │
│ Durée: 300ms            │
│ Easing: ease-out        │
└─────────────────────────┘

┌─────────────────────────┐
│ 📈 SCALE TRANSITION     │
│                         │
│ [Élément]               │
│ Scale: 0.8 → 1.0        │
│ Opacity: 0 → 1          │
│                         │
│ Effet "pop-in"          │
└─────────────────────────┘
```

## 📱 Composants UI

### Skeleton Loader

```typescript
interface SkeletonLoaderProps {
  variant: 'text' | 'rectangular' | 'circular' | 'rounded'
  width?: number | string
  height?: number | string
  animation?: 'pulse' | 'wave' | 'none'
  borderRadius?: number
  count?: number
  spacing?: number
  backgroundColor?: string
  highlightColor?: string
}

interface SkeletonCardProps {
  type: 'product' | 'article' | 'producer' | 'review' | 'project'
  showImage?: boolean
  showText?: boolean
  showButtons?: boolean
  customLayout?: SkeletonElement[]
}

interface SkeletonElement {
  type: 'image' | 'text' | 'button' | 'badge'
  width: string
  height: string
  position: { x: number; y: number }
  borderRadius?: number
}
```

### Loading Spinner

```typescript
interface LoadingSpinnerProps {
  size: 'small' | 'medium' | 'large' | 'xlarge'
  color?: string
  speed?: 'slow' | 'normal' | 'fast'
  type: 'circular' | 'dots' | 'bars' | 'pulse'
  overlay?: boolean
  text?: string
  position?: 'center' | 'top' | 'bottom'
}

interface DotsSpinnerProps extends LoadingSpinnerProps {
  dotCount: number
  dotSize: number
  spacing: number
  animationDelay: number
}

interface BarsSpinnerProps extends LoadingSpinnerProps {
  barCount: number
  barWidth: number
  barHeight: number
  animationOffset: number
}
```

### Progress Indicator

```typescript
interface ProgressIndicatorProps {
  value: number // 0-100
  max?: number
  showPercentage?: boolean
  showLabel?: boolean
  label?: string
  color?: string
  backgroundColor?: string
  height?: number
  borderRadius?: number
  animated?: boolean
  indeterminate?: boolean
}

interface StepProgressProps {
  steps: {
    id: string
    label: string
    completed: boolean
    active: boolean
    disabled?: boolean
  }[]
  currentStep: number
  orientation: 'horizontal' | 'vertical'
  showLabels?: boolean
  connector?: 'line' | 'arrow' | 'dots'
}

interface CircularProgressProps {
  value: number
  size: number
  strokeWidth: number
  color?: string
  backgroundColor?: string
  showValue?: boolean
  animated?: boolean
  gradient?: boolean
}
```

### Loading Overlay

```typescript
interface LoadingOverlayProps {
  visible: boolean
  transparent?: boolean
  backgroundColor?: string
  opacity?: number
  blurBackground?: boolean
  spinner?: LoadingSpinnerProps
  message?: string
  cancelable?: boolean
  onCancel?: () => void
  zIndex?: number
}

interface ContextualLoadingProps {
  type: 'add_to_cart' | 'checkout' | 'refresh' | 'upload' | 'download'
  product?: ProductSummary
  message?: string
  progress?: number
  animated?: boolean
  onComplete?: () => void
  onError?: (error: Error) => void
}
```

### Transition Components

```typescript
interface FadeTransitionProps {
  children: React.ReactNode
  visible: boolean
  duration?: number
  easing?: string
  onComplete?: () => void
}

interface SlideTransitionProps {
  children: React.ReactNode
  direction: 'left' | 'right' | 'up' | 'down'
  distance?: number
  duration?: number
  easing?: string
  delay?: number
}

interface ScaleTransitionProps {
  children: React.ReactNode
  fromScale?: number
  toScale?: number
  duration?: number
  easing?: string
  transformOrigin?: string
}

interface StaggeredAnimationProps {
  children: React.ReactNode[]
  staggerDelay: number
  animationType: 'fade' | 'slide' | 'scale'
  direction?: 'up' | 'down' | 'left' | 'right'
}
```

## 🔄 États & Interactions

### Loading State Management

```typescript
interface LoadingState {
  isLoading: boolean
  loadingType: 'initial' | 'refresh' | 'more' | 'action'
  progress?: number
  message?: string
  cancellable: boolean
  error?: Error
}

interface LoadingActions {
  startLoading: (type: LoadingType, options?: LoadingOptions) => void
  updateProgress: (progress: number, message?: string) => void
  completeLoading: (success: boolean, result?: any) => void
  cancelLoading: () => void
}

interface LoadingOptions {
  showSpinner?: boolean
  showProgress?: boolean
  showOverlay?: boolean
  cancellable?: boolean
  timeout?: number
  message?: string
}
```

### Animation State

```typescript
interface AnimationState {
  activeAnimations: Set<string>
  animationQueue: Animation[]
  defaultDuration: number
  defaultEasing: string
  reducedMotion: boolean
}

interface Animation {
  id: string
  type: 'fade' | 'slide' | 'scale' | 'rotate' | 'custom'
  element: string
  properties: AnimationProperties
  duration: number
  delay?: number
  onComplete?: () => void
}

interface AnimationProperties {
  from: { [key: string]: any }
  to: { [key: string]: any }
  easing?: string
}
```

### Performance Optimizations

```typescript
const loadingOptimizations = {
  skeleton: {
    renderOnDemand: true,
    maxConcurrentSkeletons: 20,
    recycleComponents: true
  },
  
  animations: {
    useNativeDriver: true,
    enableGPUAcceleration: true,
    reducedMotionRespect: true,
    performanceMonitoring: true
  },
  
  transitions: {
    preloadNextScreen: true,
    cacheAnimations: true,
    interruptibleAnimations: true
  }
}
```

### Gesture Interactions

```typescript
const gestureHandling = {
  swipeToRefresh: {
    threshold: 100, // px
    resistance: 0.5,
    triggerAnimation: 'elastic',
    hapticFeedback: true
  },
  
  pullToLoad: {
    triggerDistance: 80,
    maxPullDistance: 150,
    releaseAnimation: 'spring',
    loadingIndicator: 'custom'
  },
  
  parallaxScrolling: {
    enabled: true,
    factor: 0.5,
    boundaries: { min: 0, max: 200 }
  }
}
```

## 📡 API & Données

### Loading States Tracking

```typescript
GET /api/loading-states
Response: {
  defaultTimeouts: {
    initial: 5000,
    refresh: 3000,
    action: 10000
  },
  
  progressiveLoading: {
    enabled: boolean
    chunkSize: number
    maxConcurrentRequests: number
  },
  
  fallbacks: {
    skeletonTimeout: 2000
    errorFallbackDelay: 1000
    retryAttempts: 3
  }
}
```

### Performance Metrics

```typescript
interface LoadingPerformanceMetrics {
  screenLoadTimes: {
    [screenName: string]: {
      average: number
      p95: number
      p99: number
    }
  }
  
  animationPerformance: {
    droppedFrames: number
    averageFPS: number
    jankyAnimations: string[]
  }
  
  userExperience: {
    perceivedPerformance: number
    loadingFrustration: number
    completionRates: { [action: string]: number }
  }
}

POST /api/performance/loading-metrics
{
  screenName: string
  loadingType: string
  duration: number
  successful: boolean
  userAgent: string
  connectionType: string
}
```

### Offline Loading

```typescript
interface OfflineLoadingBehavior {
  cachedContent: {
    showImmediately: boolean
    markAsStale: boolean
    syncWhenOnline: boolean
  }
  
  fallbackContent: {
    skeletonFallback: boolean
    staticFallback: boolean
    errorMessage: string
  }
  
  syncIndicators: {
    showSyncStatus: boolean
    syncProgressBar: boolean
    lastSyncTime: boolean
  }
}
```

## ✅ Validations

### Performance Standards

```typescript
interface LoadingPerformanceStandards {
  timeouts: {
    firstContentfulPaint: 1500, // ms
    largestContentfulPaint: 2500, // ms
    interactionToNext: 100, // ms
    skeletonTimeout: 3000 // ms
  }
  
  animation: {
    targetFPS: 60
    maxDroppedFrames: 5
    maxAnimationDuration: 500 // ms
  }
  
  userExperience: {
    maxLoadingSteps: 3
    maxWaitTime: 10000, // ms
    progressIndicatorThreshold: 2000 // ms
  }
}
```

### Accessibility Standards

```typescript
const accessibilityRequirements = {
  reducedMotion: {
    respectSystemSetting: true,
    provideFallbacks: true,
    essentialMotionOnly: true
  },
  
  loadingAnnouncements: {
    screenReaderAnnouncements: true,
    progressAnnouncements: true,
    completionAnnouncements: true
  },
  
  visualIndicators: {
    highContrastSupport: true,
    colorBlindnessSupport: true,
    minimumContrastRatio: 4.5
  }
}
```

### Loading UX Rules

```typescript
const loadingUXRules = {
  immediate: {
    showInstantFeedback: true, // < 100ms
    useOptimisticUpdates: true,
    provideCancelOption: false
  },
  
  short: {
    duration: '100ms - 1s',
    showSpinner: true,
    blockInteraction: false,
    provideCancelOption: false
  },
  
  medium: {
    duration: '1s - 10s',
    showProgress: true,
    blockInteraction: true,
    provideCancelOption: true
  },
  
  long: {
    duration: '> 10s',
    showDetailedProgress: true,
    provideEstimatedTime: true,
    provideCancelOption: true,
    allowBackgroundProcessing: true
  }
}
```

## 🚨 Gestion d'Erreurs

### Loading Error States

```typescript
const loadingErrors = {
  timeout: {
    code: 'LOADING_TIMEOUT',
    message: "Le chargement prend plus de temps que prévu",
    actions: {
      retry: true,
      showProgress: true,
      provideFallback: true
    }
  },
  
  networkError: {
    code: 'NETWORK_ERROR',
    message: "Problème de connexion",
    actions: {
      retryAutomatically: true,
      showOfflineMode: true,
      cacheFallback: true
    }
  },
  
  serverError: {
    code: 'SERVER_ERROR',
    message: "Erreur du serveur",
    actions: {
      retryWithBackoff: true,
      showErrorDetails: false,
      fallbackToCache: true
    }
  }
}
```

### Animation Error Handling

```typescript
const animationErrorHandling = {
  performanceIssues: {
    lowFPS: {
      threshold: 30,
      action: 'reduce_animation_complexity',
      fallback: 'static_transitions'
    },
    
    memoryPressure: {
      threshold: '80%',
      action: 'pause_non_essential_animations',
      fallback: 'css_animations_only'
    }
  },
  
  unsupportedFeatures: {
    fallbackStrategies: {
      'advanced_transitions': 'simple_fade',
      'gpu_animations': 'cpu_animations',
      'complex_transforms': 'opacity_only'
    }
  }
}
```

### Recovery Mechanisms

```typescript
const recoveryMechanisms = {
  automaticRetry: {
    maxAttempts: 3,
    backoffStrategy: 'exponential',
    backoffBase: 1000, // ms
    jitterEnabled: true
  },
  
  gracefulDegradation: {
    disableAnimations: true,
    showStaticContent: true,
    reduceComplexity: true
  },
  
  userInitiatedRecovery: {
    manualRetry: true,
    refreshOption: true,
    resetState: true
  }
}
```

## 🔗 Navigation

### Loading-Aware Navigation

```typescript
const loadingNavigation = {
  preventNavigationDuringLoading: {
    criticalOperations: ['checkout', 'payment', 'data_sync'],
    showWarningDialog: true,
    allowForcedNavigation: true
  },
  
  loadingStatePreservation: {
    maintainAcrossNavigation: false,
    resetOnScreenChange: true,
    transferToNextScreen: false
  },
  
  navigationOptimizations: {
    preloadNextScreen: true,
    cacheCommonAssets: true,
    prioritizeVisible: true
  }
}
```

### Transition Coordination

```typescript
const transitionCoordination = {
  screenTransitions: {
    waitForDataLoad: true,
    showSkeletonDuringTransition: true,
    coordinateWithLoadingStates: true
  },
  
  overlayManagement: {
    stackOverlays: false,
    prioritizeNewest: true,
    autoCloseOnNavigation: true
  }
}
```

## 📝 Tests Utilisateur

### Loading Experience Tests

#### Perception Tests

1. **Perceived Speed** : User feels the app is fast
2. **Loading Clarity** : User understands what's happening
3. **Progress Awareness** : User knows how much is left
4. **Error Understanding** : User knows what went wrong

#### Interaction Tests

1. **Loading Cancellation** : User can cancel long operations
2. **Background Loading** : User can continue using app
3. **Retry Mechanisms** : User can recover from errors
4. **Offline Graceful** : User understands offline limitations

### A/B Tests

#### Loading Indicators

- **Variant A** : Skeleton loaders
- **Variant B** : Spinner with text
- **Variant C** : Progress bars
- **Métrique** : Perceived performance rating

#### Animation Complexity

- **Variant A** : Rich animations
- **Variant B** : Simple transitions
- **Variant C** : Minimal animations
- **Métrique** : Performance + satisfaction

### Performance Metrics

```typescript
interface LoadingPerformanceKPIs {
  technicalMetrics: {
    firstContentfulPaint: number    // Target: <1.5s
    largestContentfulPaint: number  // Target: <2.5s
    timeToInteractive: number       // Target: <3.5s
    cumulativeLayoutShift: number   // Target: <0.1
  }
  
  userExperienceMetrics: {
    perceivedPerformance: number    // Target: >4.0/5
    taskCompletionRate: number      // Target: >95%
    errorRecoveryRate: number       // Target: >80%
    userSatisfaction: number        // Target: >4.2/5
  }
}
```

## 💾 Stockage Local

### Loading State Persistence

```typescript
interface LoadingLocalStorage {
  userPreferences: {
    animationsEnabled: boolean
    reducedMotion: boolean
    preferredLoadingStyle: 'skeleton' | 'spinner' | 'progress'
    autoRetryEnabled: boolean
  }
  
  performanceProfile: {
    deviceCapabilities: DeviceCapabilities
    networkProfile: NetworkProfile
    previousPerformance: PerformanceHistory
  }
  
  loadingCache: {
    skeletonLayouts: { [screenName: string]: SkeletonLayout }
    animationStates: { [animationId: string]: AnimationState }
    errorRecoveryStates: ErrorRecoveryState[]
  }
}
```

### Offline Handling

```typescript
interface OfflineLoadingCapabilities {
  cachedSkeletons: boolean         // Show cached layout
  staticFallbacks: boolean         // Show static content
  offlineIndicators: boolean       // Show offline status
  queuedActions: boolean          // Queue loading actions
  syncIndicators: boolean         // Show sync status
}
```

### Analytics Events

```typescript
const loadingAnalyticsEvents = {
  'loading_started': {
    screen_name: string,
    loading_type: string,
    user_initiated: boolean,
    timestamp: number
  },
  'loading_completed': {
    screen_name: string,
    loading_type: string,
    duration: number,
    successful: boolean,
    timestamp: number
  },
  'animation_performance': {
    animation_type: string,
    duration: number,
    fps: number,
    dropped_frames: number,
    timestamp: number
  },
  'loading_error': {
    screen_name: string,
    error_type: string,
    retry_attempted: boolean,
    recovery_method: string,
    timestamp: number
  },
  'user_loading_interaction': {
    action: 'cancel' | 'retry' | 'skip',
    loading_duration_when_acted: number,
    timestamp: number
  }
}
```

## 🔧 Fonctionnalités Avancées

### Adaptive Loading

```typescript
interface AdaptiveLoadingFeatures {
  deviceAdaptation: {
    lowEndDevices: {
      simplifiedAnimations: boolean
      reducedSkeletonComplexity: boolean
      fasterTimeouts: boolean
    }
    
    highEndDevices: {
      richAnimations: boolean
      detailedSkeletons: boolean
      preemptiveLoading: boolean
    }
  }
  
  networkAdaptation: {
    slowConnections: {
      prioritizeContent: boolean
      reduceAnimations: boolean
      optimisticUpdates: boolean
    }
    
    fastConnections: {
      preloadContent: boolean
      richInteractions: boolean
      backgroundSync: boolean
    }
  }
}
```

### Smart Loading Patterns

```typescript
interface SmartLoadingPatterns {
  predictiveLoading: {
    userBehaviorAnalysis: boolean
    commonPathsPreloading: boolean
    timeBasedPreloading: boolean
  }
  
  progressiveLoading: {
    criticalContentFirst: boolean
    aboveTheFoldPriority: boolean
    lazyLoadingBelow: boolean
  }
  
  contextualLoading: {
    taskBasedOptimization: boolean
    userRoleAdaptation: boolean
    timeOfDayOptimization: boolean
  }
}
```
