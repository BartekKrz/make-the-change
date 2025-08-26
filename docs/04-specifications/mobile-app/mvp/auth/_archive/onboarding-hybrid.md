# 🌱 Onboarding Hybride - Progressive Disclosure

**📍 VERSION: MVP** | **🗓️ TIMELINE: Mois 1-2** | **⭐️ PRIORITÉ: CRITIQUE**

## 🎯 Objectif

Créer un onboarding qui guide naturellement les utilisateurs vers le modèle hybride : **découverte gratuite → attachement émotionnel → premier investissement → fidélisation points**. L'onboarding doit maximiser la conversion Explorateur → Protecteur tout en restant non-intrusif.

---

## 🧭 Stratégie Progressive Disclosure

### **Philosophie : "Découvrez d'abord, investissez quand vous êtes prêt"**

```typescript
interface OnboardingStrategy {
  phase1_discovery: {
    duration: 'unlimited';
    goal: 'emotional_attachment_to_projects';
    barriers: 'none';
    value_delivered: 'full_content_access';
  };
  phase2_consideration: {
    triggers: ['project_favorites', 'time_spent', 'producer_interest'];
    goal: 'investment_education';
    barriers: 'soft_nudges_only';
    value_delivered: 'investment_preview';
  };
  phase3_conversion: {
    triggers: ['strong_engagement_signals'];
    goal: 'first_investment';
    barriers: 'clear_value_proposition';
    value_delivered: 'immediate_points_gratification';
  };
}
```

---

## 🎨 Flow d'Onboarding Complet

### **ÉTAPE 1 : Accueil & Value Proposition (30 secondes)**

#### **Écran 1 - Hero Welcome**
```typescript
interface WelcomeScreen {
  background: {
    type: 'video_loop';
    content: 'bees_working_in_hive.mp4';
    fallback: 'hero_nature_image.webp';
  };
  content: {
    headline: "Soutenez la nature.\nRécoltez les fruits.";
    subheadline: "Découvrez gratuitement des projets de biodiversité concrets";
    valueProps: [
      "🌱 Explorez gratuitement tous nos projets",
      "🐝 Rencontrez nos producteurs passionnés", 
      "🎁 Investissez quand vous êtes prêt (dès 50€)"
    ];
  };
  cta: {
    primary: "Découvrir gratuitement";
    secondary: "Comment ça marche ?";
  };
  skipOption: {
    show: true;
    text: "Passer l'introduction";
    action: 'go_to_projects_discovery';
  };
}
```

#### **Écran 2 - Comment ça marche (Modèle Hybride)**
```typescript
interface HowItWorksScreen {
  steps: [
    {
      icon: "🔓";
      title: "1. Explorez gratuitement";
      description: "Découvrez tous nos projets et producteurs sans engagement";
      visual: "projects_grid_animation.lottie";
    },
    {
      icon: "❤️";
      title: "2. Trouvez votre coup de cœur";
      description: "Attachez-vous à un projet qui vous inspire";
      visual: "heart_project_animation.lottie";
    },
    {
      icon: "🚀";
      title: "3. Investissez quand vous voulez";
      description: "50€ → 65 points (30% bonus garanti)";
      visual: "investment_flow_animation.lottie";
      highlight: true;
    },
    {
      icon: "🎁";
      title: "4. Profitez de vos récompenses";
      description: "Échangez vos points contre des produits premium";
      visual: "rewards_showcase.lottie";
    }
  ];
  navigation: {
    showProgress: true;
    allowSkip: true;
    autoAdvance: false;
  };
}
```

### **ÉTAPE 2 : Personnalisation Soft (60 secondes)**

#### **Écran 3 - Centres d'Intérêt (Optionnel)**
```typescript
interface InterestsScreen {
  title: "Qu'est-ce qui vous passionne ?";
  subtitle: "Aidez-nous à vous recommander des projets qui vous correspondent";
  skipEnabled: true;
  
  interests: [
    { id: 'bees', label: 'Apiculture & Abeilles', icon: '🐝' },
    { id: 'trees', label: 'Arbres & Forêts', icon: '🌳' },
    { id: 'agriculture', label: 'Agriculture Bio', icon: '🌾' },
    { id: 'marine', label: 'Protection Marine', icon: '🌊' },
    { id: 'climate', label: 'Action Climat', icon: '🌍' },
    { id: 'local', label: 'Production Locale', icon: '🏘️' },
  ];
  
  selectionLogic: {
    minSelection: 0;
    maxSelection: 3;
    impactOnRecommendations: 'high';
    storageLocation: 'user_preferences';
  };
  
  cta: {
    primary: "Voir mes projets recommandés";
    secondary: "Voir tous les projets";
  };
}
```

#### **Écran 4 - Localisation Approximative (Optionnel)**
```typescript
interface LocationScreen {
  title: "Trouvons des projets près de chez vous";
  subtitle: "Votre localisation reste privée et vous aide à découvrir des projets locaux";
  
  options: [
    {
      type: 'precise_location';
      label: 'Utiliser ma position';
      permission: 'location_when_in_use';
      icon: 'map-pin';
    },
    {
      type: 'region_selection';
      label: 'Choisir ma région';
      options: ['Île-de-France', 'Nouvelle-Aquitaine', 'Occitanie', 'PACA', 'Autre'];
      icon: 'map';
    },
    {
      type: 'skip';
      label: 'Découvrir tous les projets';
      icon: 'globe';
    }
  ];
  
  benefits: [
    "🚚 Produits avec moins de transport",
    "🤝 Rencontrez des producteurs locaux",
    "🌱 Impact environnemental optimisé"
  ];
}
```

### **ÉTAPE 3 : First Project Discovery (2-3 minutes)**

#### **Écran 5 - Projet Recommandé Personnalisé**
```typescript
interface FeaturedProjectScreen {
  selectionLogic: {
    criteria: ['user_interests', 'location_proximity', 'high_conversion_rate'];
    fallback: 'most_popular_project';
  };
  
  layout: {
    heroImage: 'full_screen_background';
    content: 'overlay_bottom_sheet';
    interactions: ['swipe_up_for_details', 'tap_cta_invest'];
  };
  
  content: {
    badge: "Recommandé pour vous";
    title: "{project_name}";  // ex: "Ruches de Marc - Apiculture Bio"
    location: "{location_with_distance}";  // "Ardennes, Belgique • À 47km"
    producer: {
      name: "{producer_name}";
      photo: "{producer_avatar}";
      verification: "verified_badge";
    };
    highlights: [
      "🐝 {bees_count} ruches productives",
      "🍯 {honey_production}kg de miel par an", 
      "🌱 {environmental_impact} CO2 économisé"
    ];
  };
  
  investmentPreview: {
    pricing: {
      amount: "50€";
      points: "65 points";
      bonus: "30% bonus";
      highlight: "value_proposition_clear";
    };
    benefits: [
      "Suivi personnalisé de vos ruches",
      "Updates photo mensuelles",
      "65 points pour produits premium",
      "Support direct du producteur"
    ];
  };
  
  cta: {
    primary: "Investir 50€ → 65 points";
    secondary: "En savoir plus";
    tertiary: "Voir d'autres projets";
  };
}
```

#### **Écran 6 - Social Proof & Urgence Subtile**
```typescript
interface SocialProofScreen {
  trigger: 'after_project_interest_shown';
  
  content: {
    headline: "Rejoignez {supporters_count} personnes qui soutiennent déjà ce projet";
    recentActivity: [
      "Marie a investi il y a 2h",
      "Thomas a investi il y a 5h", 
      "Sophie a investi hier"
    ];
    projectProgress: {
      funded: "{current_funding}€";
      target: "{target_funding}€";
      percentage: "{completion_percentage}%";
      remaining: "Plus que {remaining_spots} places";
    };
  };
  
  testimonials: [
    {
      user: "Claire, 28 ans";
      text: "J'ai reçu mes premiers pots de miel, c'est magique !";
      avatar: "user_avatar_1.webp";
      verification: "verified_investor";
    }
  ];
  
  cta: {
    primary: "Rejoindre ce projet (50€)";
    urgency: "subtle_scarcity_indicator";
  };
}
```

---

## 🎭 Gestion des Objections & Réassurance

### **Objection Handling Framework**

```typescript
interface ObjectionHandling {
  common_objections: {
    price_concern: {
      trigger: 'user_hesitation_on_payment_screen';
      response: {
        headline: "50€ c'est sûr, mais regardez ce que vous recevez";
        breakdown: [
          "✅ 65 points (valeur 65€ de produits)",
          "✅ Suivi personnalisé de VOS ruches",
          "✅ Impact environnemental mesurable",
          "✅ Support direct d'un producteur local"
        ];
        guarantee: "Satisfait ou remboursé 30 jours";
      };
    };
    
    trust_concern: {
      trigger: 'multiple_back_navigation';
      response: {
        headline: "Nous comprenons vos questions";
        trustSignals: [
          "🛡️ Paiement sécurisé par Stripe",
          "📋 Transparence totale sur l'utilisation",
          "👥 {total_users} utilisateurs font confiance",
          "⭐ 4.8/5 étoiles sur les stores"
        ];
        socialProof: "real_user_reviews_carousel";
      };
    };
    
    timing_concern: {
      trigger: 'app_backgrounded_during_investment_flow';
      response: {
        method: 'push_notification_24h_later';
        message: "Le projet {project_name} vous attend toujours 🐝";
        incentive: "Premiers investisseurs : +5 points bonus";
      };
    };
  };
}
```

### **Progressive Commitment Strategy**

```typescript
interface ProgressiveCommitment {
  step1_favorites: {
    action: "favorite_project";
    commitment_level: "minimal";
    psychology: "foot_in_door_technique";
    follow_up: "personalized_updates_about_project";
  };
  
  step2_newsletter: {
    trigger: "after_3_project_views";
    action: "subscribe_project_updates";
    commitment_level: "low";
    value_exchange: "exclusive_behind_scenes_content";
  };
  
  step3_investment_preview: {
    trigger: "high_engagement_signals";
    action: "preview_investment_benefits";
    commitment_level: "medium";
    psychology: "preview_ownership_experience";
  };
  
  step4_investment: {
    trigger: "strong_conversion_signals";
    action: "complete_first_investment";
    commitment_level: "high";
    psychology: "loss_aversion_plus_immediate_gratification";
  };
}
```

---

## 🔍 Smart Triggers & Behavioral Detection

### **Engagement Signal Detection**

```typescript
class OnboardingIntelligence {
  // Détection des signaux d'engagement fort
  detectConversionReadiness(user: User, sessionData: SessionData): ConversionSignal {
    const signals = {
      timeSpent: sessionData.totalTime > 600000,        // 10+ minutes
      projectViews: sessionData.projectsViewed >= 3,
      producerInterest: sessionData.producerProfileViews > 0,
      returnVisits: user.sessionCount >= 2,
      socialEngagement: sessionData.shareActions > 0,
      locationMatch: user.locationInterests && sessionData.localProjectsViewed > 0
    };
    
    const score = Object.values(signals).filter(Boolean).length;
    
    if (score >= 4) {
      return {
        readiness: 'high',
        recommendedAction: 'show_investment_offer',
        personalizedMessage: this.getPersonalizedPitch(user, sessionData),
        incentive: 'limited_time_bonus'
      };
    }
    
    if (score >= 2) {
      return {
        readiness: 'medium', 
        recommendedAction: 'nurture_with_content',
        personalizedMessage: this.getEngagementContent(user),
        incentive: 'social_proof_emphasis'
      };
    }
    
    return {
      readiness: 'low',
      recommendedAction: 'continue_discovery',
      personalizedMessage: 'explore_more_projects',
      incentive: 'gamified_exploration'
    };
  }
  
  // Personnalisation dynamique du message
  getPersonalizedPitch(user: User, session: SessionData): string {
    const mostViewedProject = session.mostEngagedProject;
    const userInterests = user.selectedInterests;
    
    if (mostViewedProject.type === 'beehive' && userInterests.includes('bees')) {
      return `Vous semblez passionné par l'apiculture ! Adoptez une ruche chez ${mostViewedProject.producer} pour 50€ et recevez 65 points.`;
    }
    
    if (session.localProjectsViewed > session.totalProjectsViewed * 0.7) {
      return `Nous avons remarqué votre intérêt pour les projets locaux. Soutenez ${mostViewedProject.producer} près de chez vous !`;
    }
    
    return `Le projet ${mostViewedProject.name} semble vous intéresser. Investissez 50€ et recevez 65 points pour des produits premium !`;
  }
}
```

### **Adaptive Onboarding Flow**

```typescript
interface AdaptiveOnboardingConfig {
  user_segments: {
    young_urban: {
      age_range: [25, 35];
      location_type: 'urban';
      adaptations: {
        emphasis: 'convenience_and_impact';
        messaging: 'Soutenez la nature depuis votre appartement';
        project_types: ['urban_beekeeping', 'peri_urban_farms'];
        incentives: 'fast_delivery_products';
      };
    };
    
    family_suburban: {
      age_range: [30, 45];
      location_type: 'suburban';
      household_indicators: 'family';
      adaptations: {
        emphasis: 'education_and_values';
        messaging: 'Enseignez la nature à vos enfants';
        project_types: ['educational_farms', 'family_friendly_producers'];
        incentives: 'family_sized_products';
      };
    };
    
    eco_conscious_senior: {
      age_range: [45, 65];
      engagement_signals: 'environmental_focus';
      adaptations: {
        emphasis: 'impact_and_legacy';
        messaging: 'Votre contribution qui compte pour demain';
        project_types: ['reforestation', 'biodiversity_conservation'];
        incentives: 'impact_reports_and_transparency';
      };
    };
  };
}
```

---

## 🎉 Onboarding Success & Célébration

### **First Investment Celebration**

```typescript
interface FirstInvestmentCelebration {
  trigger: 'investment_completed_successfully';
  
  celebrationFlow: [
    {
      screen: 'success_animation';
      content: {
        animation: 'confetti_with_bees.lottie';
        headline: "Félicitations ! 🎉";
        message: "Vous venez de soutenir {project_name}";
        stats: {
          impact: "Vous avez sauvé {bee_count} abeilles";
          points: "65 points ont été ajoutés à votre compte";
          community: "Vous rejoignez {community_size} protecteurs";
        };
      };
    },
    {
      screen: 'level_upgrade_notification';
      content: {
        badge: 'protecteur_green_badge';
        headline: "Vous êtes maintenant Protecteur !";
        newFeatures: [
          "🏠 Dashboard personnalisé",
          "📊 Suivi de vos projets en temps réel", 
          "🎁 Accès au catalogue de récompenses",
          "📸 Mises à jour photo de VOS ruches"
        ];
      };
    },
    {
      screen: 'whats_next';
      content: {
        headline: "Et maintenant ?";
        nextSteps: [
          {
            action: "visit_dashboard";
            title: "Voir votre nouveau dashboard";
            description: "Découvrez votre espace personnalisé";
          },
          {
            action: "browse_rewards";
            title: "Explorer les récompenses";
            description: "65 points vous attendent !";
          },
          {
            action: "share_achievement";
            title: "Partager votre engagement";
            description: "Invitez vos amis à découvrir";
          }
        ];
      };
    }
  ];
  
  followUpActions: {
    email_sequence: 'new_protector_welcome_series';
    push_notifications: 'project_updates_enabled';
    dashboard_tour: 'schedule_in_24h';
  };
}
```

---

## 📱 Technical Implementation

### **Onboarding State Management**

```typescript
interface OnboardingState {
  current_step: OnboardingStep;
  user_progress: {
    screens_completed: string[];
    interests_selected: Interest[];
    location_provided: boolean;
    projects_viewed: string[];
    favorites_added: string[];
  };
  personalization_data: {
    recommended_projects: Project[];
    user_segment: UserSegment;
    conversion_readiness: ConversionSignal;
  };
  completion_status: {
    onboarding_completed: boolean;
    first_investment_made: boolean;
    celebration_shown: boolean;
  };
}

class OnboardingManager {
  async progressToNextStep(step: OnboardingStep, userData: UserData): Promise<NextStepConfig> {
    // Logique adaptative selon les données utilisateur
    const nextStep = await this.getAdaptiveNextStep(step, userData);
    
    // Tracking analytics
    this.analytics.track('onboarding_step_completed', {
      step,
      user_segment: userData.segment,
      time_spent: userData.stepDuration,
      actions_taken: userData.interactions
    });
    
    return nextStep;
  }
  
  async handleSkipRequest(currentStep: OnboardingStep, user: User): Promise<SkipConfig> {
    // Permet skip intelligent avec alternative value
    if (currentStep === 'interests_selection') {
      return {
        allowed: true,
        alternative: 'show_most_popular_projects',
        tracking: 'skipped_interests_selection'
      };
    }
    
    // Conversion-critical steps ne peuvent pas être skip
    if (currentStep === 'value_proposition') {
      return {
        allowed: false,
        alternative: 'shortened_version',
        reasoning: 'critical_for_understanding'
      };
    }
    
    return { allowed: true, alternative: 'direct_to_dashboard' };
  }
}
```

---

## 📊 Success Metrics & Optimization

### **Onboarding KPIs Critiques**

```typescript
interface OnboardingKPIs {
  completion_rates: {
    onboarding_finished: {
      target: 75;                    // 75% terminent l'onboarding
      current: 'tracked_daily';
    };
    first_investment_30d: {
      target: 30;                    // 30% investissent dans les 30 jours
      current: 'tracked_weekly';
      critical: true;
    };
  };
  
  engagement_quality: {
    time_to_first_project_view: {
      target: 120;                   // <2 minutes
      current: 'tracked_session';
    };
    projects_viewed_before_investment: {
      target: 5;                     // 5 projets vus en moyenne
      current: 'tracked_per_user';
    };
  };
  
  conversion_optimization: {
    step_drop_off_rates: {
      max_acceptable: 15;            // <15% par étape
      critical_steps: ['value_proposition', 'first_project_detail'];
      optimization_priority: 'highest';
    };
  };
}
```

### **A/B Testing Framework**

```typescript
interface OnboardingABTests {
  value_proposition_messaging: {
    variant_a: "Découvrez gratuitement, investissez quand vous voulez";
    variant_b: "Commencez gratuit, gagnez des points dès 50€";
    variant_c: "Explorez sans engagement, soutenez quand ça vous inspire";
    success_metric: 'time_to_first_investment';
  };
  
  project_recommendation_strategy: {
    variant_a: 'most_popular_projects';
    variant_b: 'location_based_matching';
    variant_c: 'interest_based_algorithm';
    success_metric: 'project_detail_engagement_rate';
  };
  
  investment_cta_presentation: {
    variant_a: 'emphasis_on_points_value';
    variant_b: 'emphasis_on_environmental_impact';
    variant_c: 'emphasis_on_producer_support';
    success_metric: 'conversion_rate_to_investment';
  };
}
```

---

**Cet onboarding hybride maximise la découverte gratuite tout en guidant naturellement vers le premier investissement, fondation du modèle économique Make the CHANGE.**