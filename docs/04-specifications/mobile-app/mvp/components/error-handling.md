# Gestion d'Erreurs & Messages

## 🎯 Objectif

Fournir une gestion d'erreurs cohérente, des messages utilisateur clairs et des mécanismes de récupération efficaces pour maintenir une expérience utilisateur fluide.

## 🎨 Design & Layout

### Types d'Erreurs & Messages

```text
┌─────────────────────────┐
│ ❌ ERREUR CRITIQUE      │
│                         │
│ ┌─────────────────────────┐│
│ │ 🚨 Erreur de connexion  ││
│ │                         ││
│ │ Impossible de se        ││
│ │ connecter au serveur.   ││
│ │                         ││
│ │ [RÉESSAYER] [AIDE]     ││
│ └─────────────────────────┘│
└─────────────────────────┘

┌─────────────────────────┐
│ ⚠️ AVERTISSEMENT        │
│                         │
│ ┌─────────────────────────┐│
│ │ ⚡ Points expirés       ││
│ │                         ││
│ │ 50 points ont expiré    ││
│ │ hier. Gagnez plus de    ││
│ │ points pour continuer.  ││
│ │                         ││
│ │ [COMPRENDRE] [OK]       ││
│ └─────────────────────────┘│
└─────────────────────────┘

┌─────────────────────────┐
│ ℹ️ INFORMATION          │
│                         │
│ ┌─────────────────────────┐│
│ │ ✅ Commande confirmée   ││
│ │                         ││
│ │ Votre commande #12345   ││
│ │ sera livrée sous 3-5    ││
│ │ jours ouvrés.           ││
│ │                         ││
│ │ [SUIVRE] [FERMER]       ││
│ └─────────────────────────┘│
└─────────────────────────┘

┌─────────────────────────┐
│ 🔄 ERREUR RÉCUPÉRABLE   │
│                         │
│ ┌─────────────────────────┐│
│ │ 📱 Connexion instable   ││
│ │                         ││
│ │ Tentative de            ││
│ │ reconnexion...          ││
│ │ ████████░░░░ 67%        ││
│ │                         ││
│ │ [ANNULER]              ││
│ └─────────────────────────┘│
└─────────────────────────┘
```

### Toast & Snackbar

```text
┌─────────────────────────┐
│                         │
│         ÉCRAN           │
│                         │
│                         │
│ ┌─────────────────────────┐│
│ │ ✅ Ajouté au panier     ││ ← Toast Success
│ └─────────────────────────┘│
│                         │
│ ••••• Navigation ••••• │
└─────────────────────────┘

┌─────────────────────────┐
│                         │
│         ÉCRAN           │
│                         │
│ ┌─────────────────────────┐│
│ │ ⚠️ Connexion perdue     ││ ← Snackbar Warning
│ │         [RÉESSAYER]     ││
│ └─────────────────────────┘│
│                         │
│ ••••• Navigation ••••• │
└─────────────────────────┘
```

### Messages Contextuels

```text
┌─────────────────────────┐
│ [←] Panier           🗑️ │
│                         │
│ ┌─────────────────────────┐│
│ │ 🛒 Votre panier est     ││
│ │    vide                 ││
│ │                         ││
│ │ Découvrez nos produits  ││
│ │ locaux et récompenses.  ││
│ │                         ││
│ │ [EXPLORER]              ││
│ └─────────────────────────┘│
│                         │
│ ••••• Navigation ••••• │
└─────────────────────────┘

┌─────────────────────────┐
│ [←] Recherche        🔍 │
│                         │
│ [Barre de recherche]    │
│                         │
│ ┌─────────────────────────┐│
│ │ 🔍 Aucun résultat       ││
│ │                         ││
│ │ Essayez avec d'autres   ││
│ │ mots-clés ou parcourez  ││
│ │ nos catégories.         ││
│ │                         ││
│ │ [CATÉGORIES] [EFFACER]  ││
│ └─────────────────────────┘│
│                         │
│ ••••• Navigation ••••• │
└─────────────────────────┘
```

## 📱 Composants UI

### Error Alert Dialog

```typescript
interface ErrorAlertProps {
  visible: boolean
  type: 'error' | 'warning' | 'info' | 'success'
  title: string
  message: string
  icon?: string
  iconColor?: string
  primaryAction?: {
    label: string
    onPress: () => void
    style?: 'primary' | 'destructive' | 'default'
  }
  secondaryAction?: {
    label: string
    onPress: () => void
  }
  dismissible?: boolean
  onDismiss?: () => void
  autoHideDuration?: number
}
```

### Toast Notification

```typescript
interface ToastProps {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  icon?: string
  duration?: number
  position?: 'top' | 'bottom' | 'center'
  actionButton?: {
    label: string
    onPress: () => void
  }
  onDismiss?: () => void
  swipeToDismiss?: boolean
  hapticFeedback?: boolean
}

interface ToastManagerProps {
  maxToasts: number
  defaultDuration: number
  stackBehavior: 'stack' | 'replace' | 'queue'
  animations: {
    enter: 'slideIn' | 'fadeIn' | 'scaleIn'
    exit: 'slideOut' | 'fadeOut' | 'scaleOut'
  }
}
```

### Snackbar Component

```typescript
interface SnackbarProps {
  visible: boolean
  message: string
  type?: 'default' | 'error' | 'warning' | 'success'
  duration?: number | 'indefinite'
  action?: {
    label: string
    onPress: () => void
    color?: string
  }
  onDismiss?: () => void
  position?: 'bottom' | 'top'
  wrapperStyle?: ViewStyle
  textStyle?: TextStyle
}
```

### Empty State Component

```typescript
interface EmptyStateProps {
  illustration?: string | React.ComponentType
  title: string
  description?: string
  primaryAction?: {
    label: string
    onPress: () => void
    icon?: string
  }
  secondaryAction?: {
    label: string
    onPress: () => void
  }
  customContent?: React.ReactNode
  animateEntrance?: boolean
}

interface EmptyStateVariants {
  'empty_cart': {
    illustration: 'shopping_cart_empty'
    title: 'Votre panier est vide'
    description: 'Découvrez nos produits locaux'
    primaryAction: 'Explorer les produits'
  }
  'no_search_results': {
    illustration: 'search_empty'
    title: 'Aucun résultat'
    description: 'Essayez avec d\'autres mots-clés'
    primaryAction: 'Voir les catégories'
  }
  'network_error': {
    illustration: 'network_error'
    title: 'Connexion perdue'
    description: 'Vérifiez votre connexion internet'
    primaryAction: 'Réessayer'
  }
}
```

### Error Boundary Component

```typescript
interface ErrorBoundaryProps {
  fallback?: React.ComponentType<ErrorFallbackProps>
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  resetKeys?: string[]
  resetOnPropsChange?: boolean
  children: React.ReactNode
}

interface ErrorFallbackProps {
  error: Error
  resetError: () => void
  componentStack?: string
}

interface CustomErrorFallback {
  'network_error': NetworkErrorFallback
  'data_error': DataErrorFallback
  'permission_error': PermissionErrorFallback
  'generic_error': GenericErrorFallback
}
```

### Validation Error Display

```typescript
interface ValidationErrorProps {
  errors: {
    [fieldName: string]: string[]
  }
  showSummary?: boolean
  inline?: boolean
  maxErrors?: number
  onErrorPress?: (fieldName: string) => void
}

interface FieldErrorProps {
  fieldName: string
  error?: string
  visible: boolean
  icon?: string
  animateEntrance?: boolean
}

interface FormErrorSummary {
  errors: ValidationError[]
  scrollToFirstError?: boolean
  groupByField?: boolean
  showFieldNames?: boolean
}
```

## 🔄 États & Interactions

### Error State Management

```typescript
interface ErrorState {
  globalErrors: GlobalError[]
  fieldErrors: { [fieldName: string]: string[] }
  toasts: Toast[]
  networkStatus: 'online' | 'offline' | 'unstable'
  lastError?: Error
  errorHistory: ErrorLogEntry[]
}

interface GlobalError {
  id: string
  type: 'critical' | 'warning' | 'info'
  code: string
  message: string
  timestamp: Date
  context?: ErrorContext
  resolved: boolean
  retryable: boolean
}

interface ErrorActions {
  addError: (error: ErrorInput) => void
  removeError: (errorId: string) => void
  clearErrors: (type?: ErrorType) => void
  markResolved: (errorId: string) => void
  retryLastAction: () => void
  showToast: (toast: ToastInput) => void
}
```

### Error Recovery Mechanisms

```typescript
interface ErrorRecoveryState {
  autoRetryEnabled: boolean
  retryAttempts: { [actionId: string]: number }
  maxRetries: number
  backoffStrategy: 'linear' | 'exponential' | 'fixed'
  recoveryStrategies: RecoveryStrategy[]
}

interface RecoveryStrategy {
  errorPattern: string | RegExp
  strategy: 'retry' | 'fallback' | 'redirect' | 'ignore'
  maxAttempts?: number
  delay?: number
  fallbackAction?: () => void
}

interface RetryBehavior {
  immediate: boolean
  withBackoff: boolean
  userConfirmation: boolean
  maxAutoRetries: number
  retryableErrorCodes: string[]
}
```

### User Interaction Handling

```typescript
const errorInteractionBehavior = {
  dismissal: {
    tapToDismiss: true,
    swipeToDismiss: true,
    autoDismissAfterAction: true,
    confirmDestructiveActions: true
  },
  
  feedback: {
    hapticOnError: true,
    soundOnCriticalError: false,
    visualFeedbackDuration: 300,
    animateErrorAppearance: true
  },
  
  accessibility: {
    announceErrors: true,
    focusOnErrorMessage: true,
    provideAlternativeActions: true
  }
}
```

## 📡 API & Données

### Error Logging & Reporting

```typescript
POST /api/errors/report
{
  errorId: string
  type: 'javascript' | 'network' | 'business' | 'validation'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  stackTrace?: string
  context: {
    userId?: string
    screenName: string
    action: string
    timestamp: number
    device: DeviceInfo
    appVersion: string
  }
  breadcrumbs: BreadcrumbEntry[]
  userAgent: string
}

interface ErrorReportResponse {
  errorId: string
  trackingId: string
  recommendedAction?: 'retry' | 'update_app' | 'contact_support'
  knownIssue: boolean
  estimatedResolution?: Date
}
```

### Error Recovery Data

```typescript
GET /api/errors/recovery-strategies
Response: {
  strategies: {
    [errorCode: string]: {
      autoRetry: boolean
      maxRetries: number
      userMessage: string
      actions: RecoveryAction[]
    }
  }
  
  fallbackEndpoints: {
    [service: string]: string[]
  }
  
  maintenance: {
    inMaintenance: boolean
    estimatedCompletion?: Date
    alternativeActions?: string[]
  }
}
```

### Health Check & Status

```typescript
GET /api/health
Response: {
  status: 'healthy' | 'degraded' | 'down'
  services: {
    [serviceName: string]: {
      status: 'up' | 'down' | 'slow'
      responseTime: number
      lastCheck: Date
    }
  }
  incidents: ActiveIncident[]
}

interface ActiveIncident {
  id: string
  title: string
  severity: 'minor' | 'major' | 'critical'
  affectedServices: string[]
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved'
  estimatedResolution?: Date
  userMessage?: string
}
```

## ✅ Validations

### Error Message Guidelines

```typescript
interface ErrorMessageStandards {
  clarity: {
    useSimpleLanguage: boolean
    avoidTechnicalJargon: boolean
    provideContext: boolean
    suggestSolutions: boolean
  }
  
  tone: {
    apologetic: boolean
    helpful: boolean
    reassuring: boolean
    professional: boolean
  }
  
  actionability: {
    alwaysProvideNextSteps: boolean
    offerAlternatives: boolean
    includeContactOption: boolean
    estimateResolutionTime: boolean
  }
}
```

### Error Categorization Rules

```typescript
const errorCategories = {
  critical: {
    criteria: [
      'prevents_core_functionality',
      'data_loss_risk',
      'security_breach',
      'payment_failure'
    ],
    userExperience: {
      blockUI: true,
      requireAcknowledgment: true,
      logToAnalytics: true,
      notifySupport: true
    }
  },
  
  warning: {
    criteria: [
      'degrades_experience',
      'temporary_issue',
      'optional_feature_unavailable'
    ],
    userExperience: {
      showNonBlocking: true,
      autoDismiss: true,
      logToAnalytics: true
    }
  },
  
  info: {
    criteria: [
      'status_update',
      'helpful_tip',
      'completion_notification'
    ],
    userExperience: {
      subtlePresentation: true,
      autoDismiss: true,
      logToAnalytics: false
    }
  }
}
```

### Validation & Business Rules

```typescript
const errorValidationRules = {
  errorFrequency: {
    maxErrorsPerMinute: 5,
    maxCriticalErrorsPerHour: 2,
    coolingPeriod: 60000, // ms
  },
  
  userErrorLimits: {
    maxToastsVisible: 3,
    maxDialogsQueued: 2,
    duplicateSuppressionTime: 5000, // ms
  },
  
  errorPersistence: {
    criticalErrorsRetainUntilResolved: true,
    warningsAutoExpire: true,
    infoMessagesImmediateCleanup: true
  }
}
```

## 🚨 Gestion d'Erreurs Meta

### Error Handling Errors

```typescript
const metaErrorHandling = {
  errorHandlerFailure: {
    fallbackToConsoleLog: true,
    preventInfiniteLoops: true,
    simpleFallbackMessage: "Une erreur inattendue s'est produite"
  },
  
  circularErrorPrevention: {
    maxRecursionDepth: 3,
    trackErrorChains: true,
    breakCircularReferences: true
  },
  
  performanceProtection: {
    maxErrorsInTimeWindow: 10,
    timeWindow: 1000, // ms
    throttleErrorReporting: true
  }
}
```

### Recovery Failure Handling

```typescript
const recoveryFailureHandling = {
  retryExhaustion: {
    showManualOptions: true,
    escalateToSupport: true,
    provideOfflineAlternatives: true
  },
  
  fallbackFailure: {
    degradedModeActivation: true,
    essentialFeaturesOnly: true,
    userNotificationRequired: true
  }
}
```

## 🔗 Navigation

### Error-Aware Navigation

```typescript
const errorNavigationBehavior = {
  criticalErrors: {
    blockNavigation: true,
    requireResolution: true,
    showModal: true
  },
  
  nonCriticalErrors: {
    allowNavigation: true,
    preserveErrorState: false,
    clearOnNavigation: true
  },
  
  recoveryNavigation: {
    returnToPreviousScreen: true,
    resetToSafeState: true,
    deepLinkToResolution: true
  }
}
```

### Error State Preservation

```typescript
const errorStatePreservation = {
  acrossNavigation: {
    criticalErrors: 'preserve',
    warnings: 'transfer_if_relevant',
    info: 'discard'
  },
  
  acrossAppStates: {
    backgrounding: 'preserve_critical_only',
    termination: 'log_and_discard',
    restart: 'check_for_persistent_issues'
  }
}
```

## 📝 Tests Utilisateur

### Error Experience Tests

#### Error Recognition

1. **Error Visibility** : User notices error messages
2. **Severity Understanding** : User distinguishes error types
3. **Message Clarity** : User understands error descriptions
4. **Action Recognition** : User identifies possible actions

#### Recovery Effectiveness

1. **Retry Success** : User successfully retries failed actions
2. **Alternative Paths** : User finds workarounds
3. **Help Seeking** : User knows how to get help
4. **Progress Preservation** : User doesn't lose work

### A/B Tests

#### Error Message Formats

- **Variant A** : Technical error codes + descriptions
- **Variant B** : User-friendly messages only
- **Variant C** : Progressive disclosure (simple → detailed)
- **Métrique** : Error resolution rate

#### Recovery Options

- **Variant A** : Auto-retry with notification
- **Variant B** : User-initiated retry
- **Variant C** : Multiple recovery options
- **Métrique** : User recovery success rate

### Error Experience Metrics

```typescript
interface ErrorExperienceMetrics {
  errorDiscovery: {
    errorNoticeRate: number           // Target: >90%
    messageReadRate: number           // Target: >80%
    actionTakeRate: number            // Target: >70%
  }
  
  errorResolution: {
    selfRecoveryRate: number          // Target: >75%
    retrySuccessRate: number          // Target: >60%
    escalationRate: number            // Target: <15%
    abandonnmentRate: number          // Target: <10%
  }
  
  userSatisfaction: {
    errorExperienceRating: number     // Target: >3.5/5
    frustractionLevel: number         // Target: <2.5/5
    helpfulnessRating: number         // Target: >4.0/5
  }
}
```

## 💾 Stockage Local

### Error State Persistence

```typescript
interface ErrorLocalStorage {
  errorHistory: {
    recentErrors: ErrorLogEntry[]
    criticalErrorsQueue: CriticalError[]
    maxHistoryEntries: number
    retentionPeriod: number // days
  }
  
  userPreferences: {
    errorDisplayPreferences: {
      showDetailsExpanded: boolean
      enableHapticFeedback: boolean
      autoRetryEnabled: boolean
    }
    
    notificationSettings: {
      showToasts: boolean
      soundEnabled: boolean
      persistentCriticalErrors: boolean
    }
  }
  
  recoveryContext: {
    lastSuccessfulAction: string
    recoverySuggestions: string[]
    userRecoveryPatterns: RecoveryPattern[]
  }
}
```

### Offline Error Handling

```typescript
interface OfflineErrorCapabilities {
  errorQueuing: boolean              // Queue errors for sync
  offlineRecovery: boolean          // Local recovery options
  cachedErrorMessages: boolean      // Show cached messages
  localValidation: boolean          // Validate without server
  degradedModeActivation: boolean   // Enable offline mode
}
```

### Analytics Events

```typescript
const errorAnalyticsEvents = {
  'error_occurred': {
    error_type: string,
    error_code: string,
    severity: string,
    screen_name: string,
    user_action: string,
    timestamp: number
  },
  'error_resolved': {
    error_id: string,
    resolution_method: 'auto_retry' | 'user_retry' | 'workaround' | 'support',
    resolution_time: number,
    attempts_made: number,
    timestamp: number
  },
  'error_dismissed': {
    error_id: string,
    dismissal_method: 'tap' | 'swipe' | 'auto' | 'navigation',
    time_visible: number,
    timestamp: number
  },
  'recovery_action_taken': {
    error_type: string,
    action: string,
    successful: boolean,
    timestamp: number
  }
}
```

## 🔧 Fonctionnalités Avancées

### Intelligent Error Handling

```typescript
interface IntelligentErrorFeatures {
  errorPrediction: {
    patternRecognition: boolean
    proactiveWarnings: boolean
    contextualSuggestions: boolean
  }
  
  adaptiveRecovery: {
    learningFromSuccess: boolean
    personalizedSuggestions: boolean
    contextAwareActions: boolean
  }
  
  smartNotifications: {
    errorGrouping: boolean
    priorityBasedDisplay: boolean
    timingOptimization: boolean
  }
}
```

### Advanced Recovery Systems

```typescript
interface AdvancedRecoveryFeatures {
  automaticRecovery: {
    selfHealingCapabilities: boolean
    backgroundRetrying: boolean
    fallbackServiceSelection: boolean
  }
  
  userGuidedRecovery: {
    stepByStepGuides: boolean
    interactiveHelp: boolean
    videoTutorials: boolean
  }
  
  proactiveSupport: {
    automaticTicketCreation: boolean
    contextSharingWithSupport: boolean
    realTimeAssistance: boolean
  }
}
```
