# 🐝 Project Detail Screen 2025 - Complete Specifications

**📍 VERSION: MVP** | **🗓️ TIMELINE: Semaine 5-6 (Mois 2)** | **⭐️ PRIORITÉ: CRITIQUE**

**🎯 OBJECTIF**: Transformer l'intérêt en investissement grâce à une expérience émotionnelle et persuasive qui crée une connexion authentique entre l'utilisateur et le projet de biodiversité.

---

## 🧠 PSYCHOLOGY-DRIVEN DESIGN STRATEGY

### Conversion Psychology Framework

```typescript
interface ConversionPsychology {
  // 1. Immediate Emotional Connection
  emotionalHook: {
    heroContent: 'real_producer_video_message';
    personalizedGreeting: 'Hi [name], meet Marc your potential partner';
    visualImpact: 'before_after_environmental_transformation';
  };
  
  // 2. Trust Building Through Transparency  
  trustSignals: {
    producer: 'verified_credentials + personal_story';
    project: 'real_time_data + third_party_verification';
    community: 'authentic_user_reviews + social_proof';
  };
  
  // 3. Value Proposition Clarity
  valueClarity: {
    investment: 'clear_roi_visualization';
    impact: 'personalized_environmental_contribution';
    benefits: 'immediate_and_long_term_value';
  };
  
  // 4. Urgency Without Pressure
  motivationTriggers: {
    scarcity: 'limited_spots_remaining_with_waitlist';
    social: 'friends_and_similar_users_participating';
    impact: 'collective_goal_progress_visualization';
  };
}
```

---

## 🎨 MODERN SCREEN LAYOUT & INTERACTIONS

### **Enhanced Visual Structure**

```text
┌─────────────────────────┐
│ [←] 🐝 Marc's Beehives ★│ ← Dynamic header with producer name
│                         │
│ ┌───────────────────────┐ │ ← Hero video/image with overlay
│ │  🎥 Personal Message  │ │   "Hi! I'm Marc, and I'd love 
│ │  from Marc (30s)      │ │   to show you my beehives..."
│ │  ▶ Play Video         │ │   
│ └───────────────────────┘ │
│                         │
│ 🌟 Project Highlights   │ ← Quick impact metrics
│ ┌──────┬──────┬─────────┐│
│ │ 847  │ 2.3t │ 89%     ││
│ │Bees  │CO₂   │Success  ││  
│ │Saved │Saved │Rate     ││
│ └──────┴──────┴─────────┘│
│                         │
│ 💚 Your Impact Preview  │ ← Personalized impact visualization
│ ┌─────────────────────┐ │
│ │ If you invest 50€:  │ │
│ │ • 65 premium points │ │
│ │ • 12 bees protected │ │  
│ │ • Monthly updates   │ │
│ │ • Producer access   │ │
│ └─────────────────────┘ │
│                         │
│ 👨‍🌾 Meet Marc           │ ← Producer connection section
│ ┌─────────────────────┐ │
│ │[📸] Marc Dubois  ⭐⭐│ │
│ │"15 years protecting │ │
│ │Belgian bees..."     │ │
│ │[💬 Message Marc]    │ │
│ └─────────────────────┘ │
│                         │
│ 📊 Live Project Data    │ ← Real-time transparency
│ [Interactive metrics]  │
│                         │
│ 💬 Community (247 ♥)   │ ← Social proof section  
│ [Recent supporter msgs] │
│                         │
│ [🚀 JOIN 247 PEOPLE]   │ ← Smart CTA based on user level
│ [€50 → 65 points]      │
│                         │
└─────────────────────────┘
```

### **Micro-Interactions & Animations**

```typescript
interface ProjectDetailAnimations {
  // Entry animations
  screenEntry: {
    heroVideo: 'fade_in_with_scale_1000ms';
    metricsCards: 'staggered_slide_up_200ms_delay';
    producerSection: 'slide_in_from_right_800ms';
  };
  
  // Scroll-based animations
  scrollAnimations: {
    heroParallax: 'subtle_background_shift_0.3x';
    metricsCounter: 'animate_numbers_when_visible';
    progressBars: 'fill_animation_on_scroll_into_view';
  };
  
  // Interaction feedback
  interactionFeedback: {
    cardTap: 'subtle_scale_0.98_haptic_light';
    heartFavorite: 'bounce_scale_heart_haptic_success';
    ctaButton: 'breathing_pulse_every_3s';
    videoPlay: 'expand_with_sound_fade_in';
  };
  
  // State transitions
  stateTransitions: {
    loading: 'skeleton_shimmer_content_aware';
    success: 'green_checkmark_bounce';
    error: 'shake_with_color_change';
  };
}
```

---

## 🎭 ADAPTIVE USER EXPERIENCE BY LEVEL

### **Level-Based Content Adaptation**

```typescript
interface AdaptiveContent {
  // Explorateur (Free Tier) - Conversion Focus
  explorateur: {
    primaryMessage: "Discover what makes Marc's beehives special";
    ctaText: "Start Supporting (€50 → 65 points)";
    ctaColor: 'discovery_green';
    
    featuredSections: [
      'hero_video_introduction',
      'impact_preview_calculator',
      'community_social_proof',
      'risk_free_guarantee'
    ];
    
    conversionTriggers: {
      scrollDepth75: 'show_limited_time_bonus_offer';
      timeSpent180s: 'producer_personal_video_message';
      exitIntent: 'save_for_later_with_notification';
    };
  };
  
  // Protecteur (Investor) - Portfolio Growth
  protecteur: {
    primaryMessage: "Add Marc's beehives to your impact portfolio";
    ctaText: "Invest in This Project (€50)";
    ctaColor: 'growth_blue';
    
    featuredSections: [
      'portfolio_fit_analysis',
      'comparative_metrics_with_existing',
      'diversification_benefits',
      'points_optimization_tips'
    ];
    
    personalizedElements: {
      showSimilarProjects: 'from_existing_portfolio';
      displayAdvancedMetrics: 'roi_and_impact_projections';
      offerBundleDeals: 'multi_project_discounts';
    };
  };
  
  // Ambassadeur (Premium) - Exclusive Access
  ambassadeur: {
    primaryMessage: "Exclusive ambassador access to Marc's premium projects";
    ctaText: "Allocate Subscription Points";
    ctaColor: 'premium_gold';
    
    featuredSections: [
      'exclusive_ambassador_benefits',
      'flexible_allocation_options',
      'premium_producer_access',
      'advanced_impact_analytics'
    ];
    
    exclusiveFeatures: {
      directProducerChat: 'real_time_messaging_with_marc';
      behindScenes: 'exclusive_content_and_updates';
      earlyAccess: 'new_projects_24h_before_general';
    };
  };
}
```

---

## 📱 DETAILED COMPONENT SPECIFICATIONS

### **1. Hero Section with Personal Connection**

```typescript
interface HeroSectionProps {
  // Visual content
  media: {
    primaryVideo?: {
      url: string;
      thumbnail: string;
      duration: number; // 15-30s optimal
      captions: boolean;
      autoplay: boolean; // respect user preferences
    };
    fallbackImages: {
      hero: string;
      gallery: string[];
    };
  };
  
  // Producer introduction
  producer: {
    firstName: string;
    personalMessage?: string; // "Hi [userName], I'm Marc..."
    greetingVideo?: string; // Personalized if returning user
  };
  
  // Project basics
  project: {
    title: string;
    tagline: string; // "Protecting Belgian bees since 2008"
    location: {
      displayName: string;
      distance?: string; // "47km from you"
    };
  };
  
  // Interaction handlers
  onVideoPlay: () => void;
  onVideoComplete: () => void;
  onImageTap: (index: number) => void;
  onProducerTap: () => void;
}

// Hero section behavior
const heroSectionBehavior = {
  videoStrategy: {
    autoplay: 'respect_user_preference_and_network';
    fallback: 'attractive_static_image_with_play_button';
    optimization: 'adaptive_quality_based_on_connection';
  };
  
  personalizedContent: {
    returningUser: 'show_progress_since_last_visit';
    similarProjects: 'highlight_why_this_fits_their_interests';
    timeOfDay: 'contextual_greeting_morning_evening';
  };
};
```

### **2. Impact Preview Calculator**

```typescript
interface ImpactCalculatorProps {
  // Investment options
  investmentTiers: {
    amount: number; // 50, 80, 150
    points: number; // 65, 105, 210
    bonusPercentage: number; // 30%, 31%, 40%
    
    // Immediate impact visualization
    immediateImpact: {
      beesProtected: number;
      co2Compensated: number; // kg
      biodiversityScore: number;
    };
    
    // Long-term benefits
    longTermBenefits: {
      monthlyUpdates: boolean;
      producerAccess: boolean;
      premiumProducts: {
        availablePoints: number;
        productExamples: string[];
      };
    };
  }[];
  
  // Interactive elements
  selectedTier: number;
  onTierSelect: (tierIndex: number) => void;
  onCalculatorInteract: () => void;
}

// Calculator micro-interactions
const calculatorBehavior = {
  selectionFeedback: {
    visual: 'smooth_highlight_transition';
    haptic: 'light_selection_feedback';
    animation: 'scale_selected_card_1.05';
  };
  
  impactVisualization: {
    beeCounter: 'animated_counter_with_bee_icons';
    co2Meter: 'filling_progress_bar_with_tree_growth';
    pointsJar: 'coins_dropping_into_jar_animation';
  };
  
  comparison: {
    showRelativeBenefit: 'this_vs_average_donation';
    socialContext: 'what_other_users_typically_choose';
  };
};
```

### **3. Producer Connection Hub**

```typescript
interface ProducerConnectionProps {
  producer: {
    // Basic info
    id: string;
    firstName: string;
    lastName: string;
    avatar: string;
    
    // Credentials & trust signals
    experience: number; // years
    certifications: {
      name: string;
      badge: string;
      verifiedDate: Date;
    }[];
    
    // Social proof
    rating: number; // 4.8/5.0
    reviewCount: number;
    projectsCount: number;
    supportersCount: number;
    
    // Personal story
    personalStory: {
      short: string; // 2-3 sentences for card
      full: string; // detailed story for expanded view
      motivations: string[]; // why they do this work
      achievements: string[]; // key accomplishments
    };
    
    // Connection options
    contactMethods: {
      directMessage: boolean;
      videoCall: boolean; // premium feature
      email: boolean;
    };
  };
  
  // User interaction state
  userHasContacted: boolean;
  userHasFavorited: boolean;
  
  // Interaction handlers
  onMessageProducer: () => void;
  onViewFullProfile: () => void;
  onFavoriteProducer: () => void;
}

// Producer connection features
const producerConnectionFeatures = {
  trustBuilding: {
    verification: 'third_party_certification_badges';
    transparency: 'real_time_project_data_feed';
    authenticity: 'candid_behind_scenes_content';
  };
  
  socialProof: {
    recentActivity: 'other_users_just_supported_marc';
    testimonials: 'video_reviews_from_previous_supporters';
    achievements: 'impact_milestones_marc_has_reached';
  };
  
  personalConnection: {
    directCommunication: 'message_marc_directly_about_project';
    exclusiveContent: 'weekly_updates_from_marc_to_supporters';
    meetups: 'optional_farm_visits_for_local_supporters';
  };
};
```

### **4. Live Project Data Dashboard**

```typescript
interface LiveProjectDataProps {
  // Real-time metrics
  liveMetrics: {
    // Updated frequently (hourly/daily)
    beehivesActive: number;
    honeyProductionToday: number; // grams
    weatherConditions: {
      temperature: number;
      humidity: number;
      optimal: boolean;
    };
    
    // Updated periodically (weekly/monthly)  
    biodiversityIndex: number;
    co2CompensationMonth: number; // kg
    communityGoalProgress: {
      current: number;
      target: number;
      percentage: number;
    };
  };
  
  // Historical trends
  trends: {
    timeframe: '1W' | '1M' | '3M' | '1Y';
    metrics: {
      production: number[];
      biodiversity: number[];
      weather: number[];
    };
  };
  
  // Transparency features
  transparency: {
    lastUpdated: Date;
    dataSource: string;
    verificationMethod: string;
    thirdPartyAudit?: {
      organization: string;
      lastAuditDate: Date;
      status: 'verified' | 'pending' | 'issues';
    };
  };
}

// Live data visualization
const liveDataVisualization = {
  realTimeUpdates: {
    websocket: 'live_connection_when_screen_active';
    polling: 'background_updates_every_15_minutes';
    caching: 'smart_cache_with_freshness_indicators';
  };
  
  visualElements: {
    healthIndicators: 'green_yellow_red_status_dots';
    trendArrows: 'up_down_neutral_with_percentage_change';
    progressBars: 'animated_goal_completion_bars';
  };
  
  interactivity: {
    tapForDetails: 'expand_metric_for_detailed_explanation';
    timeframeSelection: 'swipe_between_different_time_periods';
    compareMode: 'overlay_this_project_vs_others';
  };
};
```

---

## 🚀 CONVERSION-OPTIMIZED CTA SECTION

### **Smart Call-to-Action System**

```typescript
interface SmartCTAProps {
  // User context
  userLevel: 'explorateur' | 'protecteur' | 'ambassadeur';
  userEngagement: {
    timeSpent: number; // seconds on this screen
    scrollDepth: number; // 0-100%
    videoWatched: boolean;
    sectionsViewed: string[];
  };
  
  // Project context
  projectStatus: {
    spotsRemaining: number;
    totalSpots: number;
    urgencyLevel: 'low' | 'medium' | 'high';
    communityMomentum: 'slow' | 'steady' | 'fast';
  };
  
  // CTA configuration
  ctaVariant: {
    // Primary action
    primary: {
      text: string;
      subtext?: string;
      color: string;
      animation: string;
      urgencyBadge?: string;
    };
    
    // Secondary actions  
    secondary?: {
      text: string;
      action: 'save_for_later' | 'share' | 'learn_more';
    };
    
    // Risk mitigation
    riskMitigation: {
      guarantee: string; // "30-day satisfaction guarantee"
      transparency: string; // "See exactly how your €50 is used"
      socialProof: string; // "247 people have supported Marc"
    };
  };
}

// Dynamic CTA optimization
const ctaOptimization = {
  // Behavioral triggers
  engagementTriggers: {
    highEngagement: {
      threshold: 'viewed_3_sections_AND_spent_120s';
      ctaVariant: 'primary_with_limited_time_bonus';
      urgency: 'soft_scarcity_messaging';
    };
    
    mediumEngagement: {
      threshold: 'viewed_2_sections_OR_spent_60s';
      ctaVariant: 'primary_with_social_proof';
      riskMitigation: 'prominent_guarantee_display';
    };
    
    lowEngagement: {
      threshold: 'quick_scroll_through';
      ctaVariant: 'learn_more_first_then_convert';
      strategy: 'value_clarification_focus';
    };
  };
  
  // Personalization
  personalizationRules: {
    returningUser: 'show_progress_since_last_visit';
    similarProjectSupporter: 'emphasize_portfolio_diversification';
    firstTimeUser: 'emphasize_risk_free_exploration';
    highValueUser: 'show_premium_project_options';
  };
  
  // A/B testing variants
  abTestVariants: {
    emotional: "Join Marc's mission to save Belgian bees",
    rational: "Invest €50, get €65 value + measurable impact",
    social: "247 people are already supporting this project",
    urgent: "Only 23 spots left to support Marc's beehives",
  };
};
```

---

## 📊 SUCCESS METRICS & ANALYTICS

### **Conversion Funnel Analysis**

```typescript
interface ConversionFunnelMetrics {
  // Screen engagement  
  screenMetrics: {
    // Basic engagement
    averageTimeSpent: number; // Target: 120+ seconds
    scrollDepthP90: number; // Target: 80%+ users scroll 80%
    videoPlayRate: number; // Target: 60%+ play hero video
    videoCompletionRate: number; // Target: 80% complete video
    
    // Section engagement
    sectionViewRates: {
      heroSection: number; // Should be 100%
      impactCalculator: number; // Target: 85%
      producerProfile: number; // Target: 70%
      liveData: number; // Target: 50%
      communityProof: number; // Target: 60%
    };
    
    // Interaction rates
    interactionRates: {
      calculatorUsage: number; // Target: 40% interact with calculator
      producerMessageTap: number; // Target: 15% want to contact producer
      imageGalleryOpen: number; // Target: 35% explore images
      favoriteProject: number; // Target: 25% favorite for later
    };
  };
  
  // Conversion metrics
  conversionMetrics: {
    // Primary conversion
    ctaClickRate: number; // Target: 12%+ click main CTA
    investmentFlowEntry: number; // Target: 10%+ enter investment flow
    investmentCompletion: number; // Target: 60%+ of those who enter
    
    // Secondary conversions
    projectFavorited: number; // Target: 25% save for later
    producerFollowed: number; // Target: 8% want producer updates
    projectShared: number; // Target: 5% share with friends
    
    // Level-specific conversions
    explorateurToProtecteur: number; // Target: 8% upgrade during session
    protecteurAdditionalInvestment: number; // Target: 15% invest in new project
    ambassadeurAllocation: number; // Target: 25% allocate subscription points
  };
  
  // Quality metrics
  qualityMetrics: {
    userSatisfaction: number; // Post-session survey NPS
    informationClarity: number; // "Did you understand the project?"
    trustLevel: number; // "Do you trust this producer/project?"
    valuePerception: number; // "Is €50 fair for what you get?"
  };
}
```

### **Optimization Opportunities**

```typescript
interface OptimizationFramework {
  // Content optimization
  contentOptimization: {
    heroVideo: {
      optimalLength: '15-30 seconds';
      personalizedGreeting: 'A/B test personalized vs generic';
      thumbnailTesting: 'Test different thumbnail images';
    };
    
    impactCalculator: {
      defaultSelection: 'Test different default amounts';
      visualizationStyle: 'Test numeric vs visual representations';
      comparisonFraming: 'Test individual vs collective impact';
    };
    
    socialProof: {
      displayFormat: 'Test recent activity vs testimonials';
      quantity: 'Test showing specific numbers vs ranges';
      credibility: 'Test verified vs anonymous reviews';
    };
  };
  
  // Interaction optimization
  interactionOptimization: {
    scrollBehavior: {
      stickyElements: 'Test CTA button sticky vs inline';
      parallaxEffects: 'Measure impact on load time vs engagement';
      lazyLoading: 'Optimize image loading priority';
    };
    
    animationTiming: {
      entryAnimations: 'Test faster vs slower animation speeds';
      feedbackDelay: 'Optimize haptic and visual feedback timing';
      stateTransitions: 'Test immediate vs smooth state changes';
    };
  };
  
  // Personalization optimization
  personalizationOptimization: {
    contentAdaptation: {
      userLevelMessaging: 'Refine messaging per user level';
      returnUserExperience: 'Optimize experience for return visits';
      contextualRecommendations: 'Improve project recommendation algorithm';
    };
    
    timingOptimization: {
      ctaTiming: 'Test when to show CTA based on engagement';
      urgencyMessaging: 'Test scarcity timing and intensity';
      followUpStrategy: 'Optimize post-visit engagement sequence';
    };
  };
}
```

---

## 🔧 TECHNICAL IMPLEMENTATION DETAILS

### **Performance Requirements**

```typescript
interface PerformanceSpecs {
  // Loading performance
  loadingPerformance: {
    initialScreenLoad: {
      target: '<2 seconds';
      measurement: 'time_to_interactive';
      optimization: 'critical_path_rendering + image_optimization';
    };
    
    videoLoading: {
      target: 'playable_in_3_seconds';
      fallback: 'high_quality_thumbnail_immediate';
      adaptiveQuality: 'based_on_connection_speed';
    };
    
    imageOptimization: {
      formats: ['webp', 'avif', 'jpg_fallback'];
      sizes: 'responsive_with_srcset';
      lazyLoading: 'intersection_observer_based';
    };
  };
  
  // Runtime performance
  runtimePerformance: {
    scrollingSmooth: '60fps_maintained_during_scroll';
    animationPerformance: 'gpu_accelerated_transforms_only';
    memoryUsage: 'efficient_image_cleanup_on_scroll';
  };
  
  // Network efficiency
  networkEfficiency: {
    dataUsage: 'progressive_enhancement_based_on_connection';
    caching: 'aggressive_caching_with_smart_invalidation';
    offline: 'cached_content_available_when_offline';
  };
}
```

### **Accessibility Implementation**

```typescript
interface AccessibilitySpecs {
  // Screen reader support
  screenReaderSupport: {
    semanticStructure: 'proper_heading_hierarchy_h1_to_h6';
    landmarkRoles: 'navigation_main_complementary_regions';
    dynamicContent: 'live_regions_for_data_updates';
    imageDescriptions: 'meaningful_alt_text_for_all_images';
  };
  
  // Motor accessibility
  motorAccessibility: {
    touchTargets: 'minimum_44x44_dp_for_all_interactive_elements';
    gestures: 'alternative_to_complex_gestures_like_pinch';
    timing: 'no_auto_advancing_content_without_controls';
  };
  
  // Cognitive accessibility
  cognitiveAccessibility: {
    simplicity: 'clear_language_and_structure';
    consistency: 'predictable_interaction_patterns';
    errorPrevention: 'clear_error_messages_with_solutions';
    focus: 'logical_tab_order_and_visible_focus_indicators';
  };
  
  // Sensory accessibility
  sensoryAccessibility: {
    colorIndependence: 'information_not_conveyed_by_color_alone';
    contrastRatios: 'wcag_aa_4.5_to_1_minimum';
    motionSensitivity: 'respect_prefers_reduced_motion';
    audioAlternatives: 'captions_for_all_video_content';
  };
}
```

---

## 🎯 NEXT STEPS & IMPLEMENTATION PRIORITY

### **Development Phases**

#### **Phase 1: Core Layout & Basic Interactions (Week 1)**
- [ ] Basic screen structure with scrollable content
- [ ] Hero section with image/video placeholder
- [ ] Impact calculator with basic interactivity  
- [ ] Producer profile card
- [ ] Basic CTA button

#### **Phase 2: Data Integration & Dynamics (Week 2)**
- [ ] API integration for project data
- [ ] Real-time metrics display
- [ ] User level detection and content adaptation
- [ ] Loading states and error handling

#### **Phase 3: Advanced UX & Conversion Optimization (Week 3)**
- [ ] Micro-interactions and animations
- [ ] Personalization engine integration
- [ ] A/B testing framework setup
- [ ] Analytics events implementation

#### **Phase 4: Polish & Performance (Week 4)**
- [ ] Performance optimization
- [ ] Accessibility compliance
- [ ] Cross-device testing
- [ ] User testing and iteration

### **Success Criteria**

```typescript
interface SuccessCriteria {
  // Performance benchmarks
  performance: {
    loadTime: 'under_2_seconds_on_4g';
    smoothScrolling: '60fps_maintained';
    accessibilityScore: 'lighthouse_95_plus';
  };
  
  // User experience benchmarks  
  userExperience: {
    conversionRate: 'baseline_8_percent_cta_click_rate';
    engagementTime: 'average_120_seconds_time_spent';
    userSatisfaction: 'post_session_nps_over_70';
  };
  
  // Business impact benchmarks
  businessImpact: {
    investmentFlowEntry: '10_percent_of_screen_views';
    investmentCompletion: '60_percent_of_flow_entries';
    returnUserRate: '40_percent_return_within_7_days';
  };
}
```

---

## 📝 CONCLUSION

Cette spécification du **Project Detail Screen** intègre les meilleures pratiques UX/UI 2025 avec une approche psychologiquement optimisée pour maximiser la conversion. L'écran sert de **point de bascule critique** entre la découverte gratuite et l'investissement, nécessitant une exécution parfaite.

**Points clés de réussite:**
1. **Connexion émotionnelle** immédiate avec le producteur
2. **Transparence totale** sur l'impact et l'utilisation des fonds
3. **Expérience adaptative** selon le niveau utilisateur
4. **Optimisation continue** basée sur les données comportementales

L'implémentation de cet écran selon ces spécifications devrait permettre d'atteindre l'objectif de **30% de conversion** Explorateur → Protecteur dans les 30 jours suivant l'onboarding.

---

*Document technique prêt pour implémentation | Version 1.0 | 25 août 2025*