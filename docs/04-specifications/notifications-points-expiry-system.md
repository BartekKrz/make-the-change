# 🔔 Document Maître - Système de Notifications d'Expiration des Points

**📍 PRIORITÉ: ⭐️⭐️ CRITIQUE** | **🎯 CONFORMITÉ & RÉTENTION** | **SOURCE DE VÉRITÉ**

## 🎯 Objectif

Ce document est la **source de vérité unique** pour la logique métier, l'architecture technique et la stratégie du système de notifications d'expiration des points. Il sert de référence centrale pour les règles qui gouvernent ce processus critique.

L'implémentation visuelle et fonctionnelle de ce système est détaillée dans des documents spécifiques à chaque plateforme :

- **🖥️ Interface Admin :** [`./admin-dashboard/v1/automation/notification-management.md`](./admin-dashboard/v1/automation/notification-management.md)
- **📱 Interface App Mobile :** [`./mobile-app/mvp/components/in-app-messaging.md`](./mobile-app/mvp/components/in-app-messaging.md)

---

## 📋 Vue d'Ensemble - Architecture Notifications

### Modèle d'Alertes Légales
```yaml
Legal_Alert_Schedule:
  60_Days_Before:
    - Channel: Email + Push notification
    - Urgency: Low
    - Purpose: Information préventive
    - Action: Encourager exploration catalogue
    
  30_Days_Before:
    - Channel: Email + Push + In-app banner
    - Urgency: Medium  
    - Purpose: Incitation à l'action
    - Action: Recommandations produits personnalisées
    
  7_Days_Before:
    - Channel: Email + Push + SMS + In-app persistant
    - Urgency: High
    - Purpose: Alerte critique
    - Action: Checkout express + support client
    
  24_Hours_Before:
    - Channel: Tous canaux disponibles
    - Urgency: Critical
    - Purpose: Dernière chance
    - Action: One-click purchase + contact prioritaire
```

## 🖼️ Système de Notifications

### 1. Notification 60 Jours Avant Expiration
```typescript
interface SixtyDaysExpiryNotification {
  // Contenu de la notification
  notificationContent: {
    title: "Vos points expirent dans 2 mois"
    message: "Vous avez {pointsAmount} points qui expirent le {expiryDate}. Découvrez notre catalogue pour les utiliser."
    tone: 'informative'
    urgencyLevel: 'low'
  }
  
  // Données contextuelles
  contextData: {
    pointsExpiring: PointsExpiryInfo[]
    totalPointsAffected: number
    euroEquivalent: number
    timeUntilExpiry: string
    nextAlertDate: Date
  }
  
  // Canaux de diffusion
  deliveryChannels: {
    email: EmailNotificationConfig
    push: PushNotificationConfig
    inApp: false // Pas trop intrusif à 60 jours
  }
  
  // Actions suggérées
  suggestedActions: {
    browseCatalog: {
      text: "Explorer le catalogue"
      deepLink: "/products"
      trackingParameter: "expiry_60d_browse"
    }
    
    viewRecommendations: {
      text: "Voir nos recommandations"
      deepLink: "/products/recommended"
      trackingParameter: "expiry_60d_reco"
    }
    
    pointsBalance: {
      text: "Voir mes points"
      deepLink: "/account/points"
      trackingParameter: "expiry_60d_balance"
    }
  }
  
  // Préférences utilisateur
  userPreferences: {
    canBeDismissed: true
    frequencyCap: "1 per week max"
    optOutOption: true
    snoozeOptions: ['1 week', '2 weeks']
  }
}
```

### 2. Notification 30 Jours Avant Expiration
```typescript
interface ThirtyDaysExpiryNotification {
  // Contenu de la notification
  notificationContent: {
    title: "⚠️ Points expirant dans 30 jours"
    message: "{pointsAmount} points expirent bientôt. Utilisez-les avant le {expiryDate} !"
    tone: 'encouraging'
    urgencyLevel: 'medium'
  }
  
  // Personnalisation avancée
  personalization: {
    productRecommendations: PersonalizedRecommendation[]
    usagePatterns: UsagePatternAnalysis
    categoryPreferences: CategoryPreference[]
    priceRangeSuggestions: PriceRangeSuggestion[]
  }
  
  // Canaux de diffusion
  deliveryChannels: {
    email: EnhancedEmailConfig
    push: PriorityPushConfig
    inApp: InAppBannerConfig
    sms: false // Pas encore critique
  }
  
  // Actions recommandées
  recommendedActions: {
    quickShop: {
      text: "Acheter maintenant"
      products: QuickShopProduct[]
      oneClickPurchase: boolean
    }
    
    saveForLater: {
      text: "Ajouter au panier"
      functionality: WishlistFunctionality
    }
    
    contactSupport: {
      text: "Besoin d'aide ?"
      contactMethod: ['chat', 'email']
    }
  }
  
  // Gamification
  motivationElements: {
    urgencyIndicator: UrgencyIndicator
    savingsCalculator: SavingsCalculator
    socialProof: SocialProofElement[]
  }
}

interface PersonalizedRecommendation {
  productId: string
  productName: string
  pointsPrice: number
  relevanceScore: number
  reason: 'purchase_history' | 'category_interest' | 'trending' | 'price_match'
  thumbnailUrl: string
}
```

### 3. Notification 7 Jours Avant Expiration (Critique)
```typescript
interface SevenDaysExpiryNotification {
  // Contenu de la notification
  notificationContent: {
    title: "🚨 URGENT: Points expirent dans 7 jours"
    message: "Attention ! {pointsAmount} points expirent le {expiryDate}. Agissez maintenant."
    tone: 'urgent'
    urgencyLevel: 'high'
  }
  
  // Canaux de diffusion (tous)
  deliveryChannels: {
    email: CriticalEmailConfig
    push: HighPriorityPushConfig
    inApp: PersistentBannerConfig
    sms: SMSAlertConfig
  }
  
  // Actions immédiates
  immediateActions: {
    expressCheckout: {
      enabled: true
      preSelectedProducts: ExpressProduct[]
      oneClickPurchase: true
      skipConfirmation: false
    }
    
    emergencySupport: {
      priorityChat: boolean
      callbackRequest: boolean
      dedicatedPhoneLine?: string
    }
    
    extendPoints?: {
      available: false // Non disponible dans le modèle
      alternative: "Investissement nouveau projet"
    }
  }
  
  // Interface persistante
  persistent_ui: {
    countdown_timer: CountdownTimer
    sticky_notification: StickyNotificationConfig
    modal_reminders: ModalReminderConfig
    navigation_badges: NavigationBadgeConfig
  }
  
  // Escalation automatique
  auto_escalation: {
    support_notification: boolean
    account_manager_alert: boolean
    retention_campaign_trigger: boolean
  }
}

interface ExpressProduct {
  product_id: string
  product_name: string
  points_price: number
  thumbnail: string
  estimated_delivery: string
  stock_status: 'available' | 'limited' | 'last_items'
}
```

### 4. Notification 24h Avant Expiration (Dernière Chance)
```typescript
interface FinalExpiryNotification {
  // Contenu de la notification
  notification_content: {
    title: "⏰ DERNIÈRE CHANCE - Expiration dans 24h"
    message: "Il vous reste moins de 24h pour utiliser {points_amount} points"
    tone: 'critical'
    urgency_level: 'critical'
  }
  
  // Diffusion maximale
  delivery_channels: {
    email: ImmediateEmailConfig
    push: CriticalPushConfig
    in_app: FullScreenModalConfig
    sms: UrgentSMSConfig
    phone_call?: EmergencyCallConfig // Si montant élevé
  }
  
  // Actions d'urgence
  emergency_actions: {
    instant_purchase: {
      curated_selection: InstantPurchaseProduct[]
      auto_checkout: boolean
      payment_preauthorized: boolean
    }
    
    priority_support: {
      immediate_chat: boolean
      phone_callback_30s: boolean
      dedicated_advisor: boolean
    }
    
    points_transfer?: {
      to_family_member: boolean // Fonctionnalité future
      temporary_extension: boolean // Non disponible
    }
  }
  
  // Interface d'urgence
  emergency_ui: {
    full_screen_takeover: boolean
    countdown_seconds: boolean
    pulsing_animations: boolean
    exit_prevention: ExitPreventionConfig
  }
}
```

## 🔧 Infrastructure Technique

### 1. Système de Scheduling
```typescript
interface NotificationSchedulingSystem {
  // Calcul des dates d'envoi
  scheduling_engine: {
    calculateExpiryDates: (points_transactions: PointsTransaction[]) => ExpirySchedule[]
    scheduleNotifications: (expiry_schedule: ExpirySchedule[]) => ScheduledNotification[]
    updateSchedules: (user_id: string, schedule_changes: ScheduleChange[]) => Promise<void>
  }
  
  // Gestion des fuseaux horaires
  timezone_management: {
    user_timezone_detection: boolean
    optimal_delivery_times: OptimalDeliveryTime[]
    timezone_conversion: TimezoneConversionConfig
  }
  
  // Queue de traitement
  processing_queue: {
    batch_processing: BatchProcessingConfig
    priority_queue: PriorityQueueConfig
    retry_mechanism: RetryMechanismConfig
    failure_handling: FailureHandlingConfig
  }
  
  // Monitoring et logging
  monitoring: {
    delivery_tracking: DeliveryTrackingConfig
    performance_metrics: PerformanceMetricsConfig
    error_logging: ErrorLoggingConfig
    audit_trail: AuditTrailConfig
  }
}

interface ExpirySchedule {
  user_id: string
  points_batch: PointsBatch
  expiry_date: Date
  notification_dates: {
    sixty_days: Date
    thirty_days: Date
    seven_days: Date
    twenty_four_hours: Date
  }
  user_preferences: NotificationPreferences
}
```

### 2. Moteur de Personnalisation
```typescript
interface PersonalizationEngine {
  // Analyse comportementale
  behavioral_analysis: {
    purchase_history: PurchaseHistoryAnalysis
    browsing_patterns: BrowsingPatternAnalysis
    engagement_metrics: EngagementMetricsAnalysis
    response_patterns: ResponsePatternAnalysis
  }
  
  // Recommandations produits
  product_recommendations: {
    collaborative_filtering: CollaborativeFilteringConfig
    content_based_filtering: ContentBasedFilteringConfig
    hybrid_approach: HybridRecommendationConfig
    real_time_updates: boolean
  }
  
  // Optimisation timing
  timing_optimization: {
    optimal_send_times: OptimalSendTimeAnalysis
    frequency_optimization: FrequencyOptimizationConfig
    channel_preference_learning: ChannelPreferenceLearning
  }
  
  // A/B Testing
  ab_testing: {
    message_variants: MessageVariant[]
    timing_tests: TimingTest[]
    channel_tests: ChannelTest[]
    personalization_tests: PersonalizationTest[]
  }
}
```

### 3. Multi-Channel Delivery
```typescript
interface MultiChannelDeliverySystem {
  // Configuration des canaux
  channel_configs: {
    email: {
      provider: 'SendGrid' | 'Mailgun' | 'SES'
      templates: EmailTemplateConfig[]
      personalization: EmailPersonalizationConfig
      deliverability: DeliverabilityConfig
    }
    
    push: {
      provider: 'Firebase' | 'OneSignal' | 'Pusher'
      platforms: ['iOS', 'Android']
      rich_notifications: RichNotificationConfig
      silent_updates: SilentUpdateConfig
    }
    
    sms: {
      provider: 'Twilio' | 'Vonage' | 'AWS SNS'
      international_support: boolean
      character_optimization: CharacterOptimizationConfig
      delivery_reports: DeliveryReportConfig
    }
    
    in_app: {
      banner_system: BannerSystemConfig
      modal_system: ModalSystemConfig
      badge_system: BadgeSystemConfig
      toast_system: ToastSystemConfig
    }
  }
  
  // Orchestration des envois
  delivery_orchestration: {
    channel_prioritization: ChannelPrioritizationConfig
    fallback_mechanisms: FallbackMechanismConfig
    rate_limiting: RateLimitingConfig
    batch_optimization: BatchOptimizationConfig
  }
  
  // Tracking et analytics
  delivery_analytics: {
    delivery_rates: DeliveryRateTracking
    open_rates: OpenRateTracking
    click_through_rates: ClickThroughRateTracking
    conversion_tracking: ConversionTrackingConfig
  }
}
```

## 📊 Analytics et Optimisation

### Métriques de Performance
```typescript
interface NotificationAnalytics {
  // Métriques de livraison
  delivery_metrics: {
    sent_count: number
    delivered_count: number
    failed_count: number
    delivery_rate: number
    delivery_time_avg: number
  }
  
  // Métriques d'engagement
  engagement_metrics: {
    open_rate: number
    click_rate: number
    conversion_rate: number
    action_completion_rate: number
    time_to_action: number
  }
  
  // Métriques d'efficacité
  effectiveness_metrics: {
    points_saved_from_expiry: number
    revenue_generated: number
    user_satisfaction_score: number
    complaint_rate: number
    opt_out_rate: number
  }
  
  // Segmentation des résultats
  segment_performance: {
    by_user_level: Map<UserLevel, PerformanceMetrics>
    by_notification_type: Map<NotificationType, PerformanceMetrics>
    by_channel: Map<DeliveryChannel, PerformanceMetrics>
    by_timing: Map<SendTime, PerformanceMetrics>
  }
}
```

## ✅ Critères de Validation

### Tests d'Acceptation
```yaml
Fonctionnalités Core:
  ✓ Calcul automatique dates expiration précis
  ✓ Scheduling notifications 60/30/7 jours exact
  ✓ Livraison multi-canal simultanée fonctionnelle
  ✓ Personnalisation contenu par utilisateur
  ✓ Tracking complet delivery et engagement

Performance & Fiabilité:
  ✓ Traitement batch >10,000 notifications/heure
  ✓ Delivery rate >95% sur tous canaux
  ✓ Latence envoi <30s après trigger
  ✓ Retry automatique sur échecs
  ✓ Monitoring temps réel opérationnel

Compliance & UX:
  ✓ Respecte préférences utilisateur opt-out
  ✓ Fréquence limitée selon urgence
  ✓ Messages clairs avec CTA évidents
  ✓ Support multi-langue si requis
  ✓ Accessibilité notifications respectée

Business Impact:
  ✓ Réduction expiration points >40%
  ✓ Conversion notification→achat >15%
  ✓ Satisfaction utilisateur maintenue >4/5
  ✓ Coût acquisition réduit vs réinvestissement
  ✓ ROI système notifications positif
```

## 🔗 Intégrations Système

### APIs de Notification
```typescript
interface NotificationSystemAPIs {
  // Gestion du scheduling
  schedulePointsExpiryNotifications: (userId: string, pointsData: PointsData[]) => Promise<ScheduleResult>
  updateNotificationSchedule: (userId: string, scheduleUpdates: ScheduleUpdate[]) => Promise<UpdateResult>
  cancelScheduledNotifications: (notificationIds: string[]) => Promise<CancelResult>
  
  // Envoi immédiat
  sendImmediateNotification: (notification: ImmediateNotification) => Promise<SendResult>
  sendBulkNotifications: (notifications: BulkNotification[]) => Promise<BulkSendResult>
  
  // Gestion des préférences
  getUserNotificationPreferences: (userId: string) => Promise<NotificationPreferences>
  updateNotificationPreferences: (userId: string, preferences: NotificationPreferences) => Promise<UpdateResult>
  
  // Analytics et reporting
  getNotificationAnalytics: (timeframe: DateRange, filters?: AnalyticsFilters) => Promise<NotificationAnalytics>
  getDeliveryReport: (notificationId: string) => Promise<DeliveryReport>
  getUserEngagementReport: (userId: string) => Promise<EngagementReport>
  
  // Système de templates
  createNotificationTemplate: (template: NotificationTemplate) => Promise<TemplateResult>
  updateNotificationTemplate: (templateId: string, updates: TemplateUpdate) => Promise<UpdateResult>
  personalizeNotificationContent: (templateId: string, userData: UserData) => Promise<PersonalizedContent>
}
```

---

**🎯 RÉSULTAT ATTENDU**: Système complet de notifications multi-canal garantissant information utilisateurs sur expiration points, optimisant utilisation avant expiration, respectant préférences utilisateur, et maximisant rétention/conversion via personnalisation avancée.
