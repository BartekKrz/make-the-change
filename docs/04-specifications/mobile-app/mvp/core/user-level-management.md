# 👑 User Level Management System - Modèle Hybride

**📍 VERSION: MVP** | **🗓️ TIMELINE: Mois 1-4** | **⭐️ PRIORITÉ: CRITIQUE**

## 🎯 Objectif

Implémenter le système de gestion des 3 niveaux utilisateur (Explorateur/Protecteur/Ambassadeur) qui est le **cœur du modèle économique hybride** Make the CHANGE. Ce système gère les transitions automatiques, les permissions et l'UI adaptative.

---

## 🏗️ Architecture du Système de Niveaux

### **Les 3 Niveaux Utilisateur**

#### **🔓 NIVEAU 1 - EXPLORATEUR (Gratuit)**
```typescript
interface ExplorateurLevel {
  key: 'explorateur';
  requirements: {
    payment: false;
    emailVerified: true;
  };
  permissions: {
    projectDiscovery: true;           // Voir tous les projets
    projectDetailView: true;          // Détails complets
    producerProfiles: true;           // Profils producteurs
    catalogBrowsing: true;            // Parcourir catalogue
    communityContent: true;           // Articles, blogs
    accountCreation: true;            // Créer compte
    dataExport: false;               // Pas d'export données
    investmentAccess: false;         // Boutons CTA seulement
    pointsSystem: false;             // Pas de points
    checkoutAccess: false;           // Pas d'achat
  };
  uiElements: {
    navigationTabs: ['Découvrir', 'Producteurs', 'Profil'];
    ctaBehavior: 'redirect_to_investment_flow';
    badgeDisplay: 'none';
    pointsWidget: 'hidden';
    rewardsAccess: 'preview_only';
  };
  conversionTriggers: {
    projectViewsThreshold: 5;
    timeSpentThreshold: 900000;      // 15 minutes
    favoriteProjectsCount: 2;
    modalFrequency: 'every_3rd_session';
  };
}
```

#### **🐝 NIVEAU 2 - PROTECTEUR (Investissements)**
```typescript
interface ProtecteurLevel {
  key: 'protecteur';
  requirements: {
    minTotalInvestment: 50;          // €50 minimum
    completedInvestments: 1;         // Au moins 1 investissement
    kycStatus: 'verified';           // Vérification identité
  };
  permissions: {
    allExplorateurPermissions: true;
    investmentTracking: true;         // Suivi projets personnels
    pointsEarning: true;             // Génération points
    pointsSpending: true;            // Achat produits
    personalizedUpdates: true;        // Updates projets spécifiques
    catalogPurchasing: true;         // Achat complet
    dataExport: true;                // Export données perso
    communityPosting: true;          // Partage expériences
  };
  pointsSystem: {
    earningRates: {
      beehive50: { investment: 50, points: 65, bonus: 30 };
      oliveTree80: { investment: 80, points: 105, bonus: 31 };
      familyPlot150: { investment: 150, points: 210, bonus: 40 };
    };
    expiryPolicy: {
      duration: 18;                  // 18 mois
      warningPeriod: 60;            // 60 jours avant
      extensionRules: 'new_investment_resets_expiry';
    };
  };
  uiElements: {
    navigationTabs: ['Dashboard', 'Mes Projets', 'Récompenses', 'Profil'];
    badgeDisplay: 'protecteur_green';
    pointsWidget: 'prominent_header';
    myInvestmentsTab: 'active';
    personalizedDashboard: true;
  };
  upgradePrompts: {
    toAmbassadeur: {
      triggers: ['total_investment_200', 'frequent_purchases', 'high_engagement'];
      message: "Passez Ambassadeur pour plus de flexibilité";
      benefits: ['allocation_flexible', 'access_exclusif', 'support_prioritaire'];
    };
  };
}
```

#### **👑 NIVEAU 3 - AMBASSADEUR (Abonnements)**
```typescript
interface AmbassadeurLevel {
  key: 'ambassadeur';
  requirements: {
    subscriptionTier: 'standard' | 'premium';
    monthlyPayment: 200 | 350;       // €200 ou €350 /mois
    activeSubscription: true;
  };
  permissions: {
    allProtecteurPermissions: true;
    flexibleProjectAllocation: true; // Alloue points librement
    exclusiveProducts: true;         // Produits premium
    prioritySupport: true;           // Support client prioritaire
    advancedAnalytics: true;         // Métriques avancées
    bulkOperations: true;            // Actions en masse
    privateProducerAccess: true;     // Accès producteurs exclusifs
    customReports: true;             // Rapports personnalisés
  };
  subscriptionTiers: {
    standard: {
      monthlyFee: 200;
      pointsGenerated: 280;          // 40% bonus
      maxProjectAllocations: 10;
      exclusiveProducts: 'tier_1';
    };
    premium: {
      monthlyFee: 350;
      pointsGenerated: 525;          // 50% bonus
      maxProjectAllocations: 'unlimited';
      exclusiveProducts: 'tier_1_and_2';
      personalizedConsultation: true;
    };
  };
  uiElements: {
    navigationTabs: ['Dashboard Pro', 'Portfolio', 'Allocation', 'Exclusivités', 'Analytics'];
    badgeDisplay: 'ambassadeur_gold';
    pointsWidget: 'advanced_with_allocation';
    flexibleAllocation: 'drag_drop_interface';
    premiumDesign: 'elevated_ui_theme';
  };
}
```

---

## 🔄 Système de Transitions Automatiques

### **Upgrade Logic Engine**

```typescript
class UserLevelManager {
  // Vérification automatique des conditions d'upgrade
  async checkUpgradeEligibility(userId: string): Promise<UpgradeOpportunity | null> {
    const user = await this.getUserWithStats(userId);
    const currentLevel = user.level;
    
    // Explorateur → Protecteur
    if (currentLevel === 'explorateur') {
      const firstInvestment = await this.getFirstCompletedInvestment(userId);
      if (firstInvestment && firstInvestment.amount >= 50) {
        return {
          from: 'explorateur',
          to: 'protecteur',
          trigger: 'first_investment_completed',
          autoUpgrade: true,
          celebration: 'congratulations_modal_with_points',
          newPermissions: ['points_earning', 'personalized_tracking']
        };
      }
    }
    
    // Protecteur → Ambassadeur (suggestion seulement)
    if (currentLevel === 'protecteur') {
      const stats = await this.getInvestmentStats(userId);
      if (stats.totalInvested >= 200 || stats.monthlyActivity >= 15) {
        return {
          from: 'protecteur',
          to: 'ambassadeur',
          trigger: 'high_engagement_pattern',
          autoUpgrade: false,           // Suggestion seulement
          suggestionModal: 'upgrade_benefits_comparison',
          incentive: 'first_month_50_percent_discount'
        };
      }
    }
    
    return null;
  }
  
  // Exécution automatique des upgrades
  async executeUpgrade(userId: string, opportunity: UpgradeOpportunity): Promise<void> {
    await this.updateUserLevel(userId, opportunity.to);
    await this.grantNewPermissions(userId, opportunity.newPermissions);
    await this.triggerCelebrationFlow(userId, opportunity);
    await this.scheduleOnboardingNewLevel(userId, opportunity.to);
    
    // Analytics tracking
    this.analytics.track('user_level_upgraded', {
      userId,
      fromLevel: opportunity.from,
      toLevel: opportunity.to,
      trigger: opportunity.trigger,
      timestamp: Date.now()
    });
  }
}
```

### **Real-time Permission Engine**

```typescript
class PermissionEngine {
  // Vérification en temps réel des permissions
  hasPermission(user: User, permission: Permission): boolean {
    const levelPermissions = this.getLevelPermissions(user.level);
    
    // Cas spéciaux pour transitions
    if (user.levelTransition?.inProgress) {
      return this.getTransitionPermissions(user, permission);
    }
    
    return levelPermissions.includes(permission);
  }
  
  // UI adaptative basée sur permissions
  getUIConfiguration(user: User): UIConfig {
    const baseConfig = UI_CONFIGS[user.level];
    
    // Personnalisation selon l'historique utilisateur
    if (user.level === 'protecteur' && user.stats.highEngagement) {
      baseConfig.upgradePrompts.ambassadeur.frequency = 'weekly';
    }
    
    // Adaptations temporaires (promotions, etc.)
    if (this.hasActivePromotion(user)) {
      baseConfig.promotionalBanners = this.getActivePromotions(user);
    }
    
    return baseConfig;
  }
}
```

---

## 🎨 UI Adaptative par Niveau

### **Navigation Dynamique**

```typescript
interface AdaptiveNavigation {
  explorateur: {
    mainTabs: [
      { key: 'discover', label: 'Découvrir', icon: 'compass' },
      { key: 'producers', label: 'Producteurs', icon: 'users' },
      { key: 'profile', label: 'Profil', icon: 'user' }
    ];
    hiddenTabs: ['points', 'investments', 'rewards'];
    ctaOverlay: {
      show: true;
      message: "Investissez pour débloquer cette fonctionnalité";
      action: 'redirect_to_investment';
    };
  };
  
  protecteur: {
    mainTabs: [
      { key: 'dashboard', label: 'Dashboard', icon: 'home' },
      { key: 'projects', label: 'Mes Projets', icon: 'leaf', badge: 'investment_count' },
      { key: 'rewards', label: 'Récompenses', icon: 'gift', badge: 'points_balance' },
      { key: 'profile', label: 'Profil', icon: 'user' }
    ];
    headerWidget: {
      component: 'PointsBalance';
      prominent: true;
      showExpiry: true;
    };
    upgradePrompt: {
      trigger: 'after_3rd_investment';
      placement: 'dashboard_hero';
      message: "Ambassadeur : plus de flexibilité pour 200€/mois";
    };
  };
  
  ambassadeur: {
    mainTabs: [
      { key: 'dashboard', label: 'Dashboard Pro', icon: 'monitor' },
      { key: 'portfolio', label: 'Portfolio', icon: 'briefcase' },
      { key: 'allocation', label: 'Allocation', icon: 'sliders' },
      { key: 'exclusives', label: 'Exclusivités', icon: 'star' },
      { key: 'analytics', label: 'Analytics', icon: 'bar-chart' }
    ];
    premiumTheme: {
      primaryColor: '#D4AF37';        // Gold
      accentColor: '#1D4ED8';
      elevation: 'enhanced_shadows';
      animations: 'premium_transitions';
    };
    allocationInterface: {
      component: 'DragDropProjectAllocation';
      realTimeUpdates: true;
      projectionCalculator: true;
    };
  };
}
```

### **Dashboard Adaptatif**

```typescript
interface LevelSpecificDashboard {
  explorateur: {
    hero: {
      title: "Découvrez des projets qui changent le monde";
      subtitle: "Explorez gratuitement nos projets de biodiversité";
      cta: "Voir tous les projets";
    };
    sections: [
      'featured_projects',
      'how_it_works',
      'producer_spotlight',
      'recent_success_stories'
    ];
    conversionElements: {
      socialProof: "2,847 personnes ont déjà investi";
      urgency: "Plus que 12 ruches disponibles";
      valueProposition: "50€ → 65 points (30% bonus garanti)";
    };
  };
  
  protecteur: {
    hero: {
      greeting: "Bonjour {firstName} 👋";
      pointsBalance: "prominent_display";
      expiryWarning: "conditional_display";
    };
    sections: [
      'my_investments_summary',
      'points_activity',
      'recommended_products',
      'project_updates',
      'conversion_to_ambassadeur'
    ];
    personalizedContent: {
      myProjects: "grid_with_progress_bars";
      recentUpdates: "timeline_format";
      suggestedProducts: "based_on_investment_history";
    };
  };
  
  ambassadeur: {
    hero: {
      greeting: "Tableau de bord Ambassadeur {level}";
      allocationOverview: "portfolio_pie_chart";
      monthlyProjections: "revenue_forecast";
    };
    sections: [
      'portfolio_performance',
      'flexible_allocation_manager',
      'exclusive_opportunities',
      'advanced_analytics',
      'priority_support_access'
    ];
    advancedFeatures: {
      bulkActions: "multi_select_operations";
      customReports: "generate_pdf_analytics";
      privateAccess: "exclusive_producer_calls";
    };
  };
}
```

---

## 🔔 Notifications & Triggers

### **Notifications par Niveau**

```typescript
interface LevelNotifications {
  explorateur: {
    welcome: {
      timing: 'immediate';
      content: "Bienvenue ! Explorez nos projets gratuitement";
    };
    engagementReminders: {
      after48h: "Découvrez le projet qui vous correspond";
      after7days: "Des centaines de personnes investissent chaque semaine";
      after14days: "Investissez 50€, recevez 65 points (30% bonus)";
    };
    socialProof: {
      frequency: 'weekly';
      content: "127 nouveaux investisseurs cette semaine";
    };
  };
  
  protecteur: {
    pointsExpiry: {
      timing: [60, 30, 7, 1];        // Jours avant expiration
      content: "{points_count} points expirent bientôt - Utilisez-les !";
    };
    projectUpdates: {
      frequency: 'on_milestone';
      content: "Vos ruches HABEEBEE ont produit {honey_amount}kg de miel";
    };
    purchaseRecommendations: {
      frequency: 'monthly';
      content: "Nouveaux produits disponibles avec vos {points_balance} points";
    };
    upgradeNudges: {
      triggers: ['total_investment_200', 'frequent_usage'];
      content: "Ambassadeur : allocation flexible pour 200€/mois";
    };
  };
  
  ambassadeur: {
    portfolioAlerts: {
      frequency: 'weekly';
      content: "Résumé performance: {growth}% ce mois";
    };
    exclusiveOffers: {
      frequency: 'bi_weekly';
      content: "Nouveau producteur exclusif disponible";
    };
    allocationReminders: {
      timing: 'monthly';
      content: "Optimisez votre allocation: {suggestions_count} suggestions";
    };
  };
}
```

---

## 📊 Analytics & Tracking

### **Métriques par Niveau**

```typescript
interface LevelAnalytics {
  conversionMetrics: {
    explorateurToProtecteur: {
      target: 30;                    // 30% conversion
      triggers: ['project_views', 'time_spent', 'social_proof'];
      optimizationPoints: ['value_prop_clarity', 'cta_placement', 'social_proof_strength'];
    };
    protecteurToAmbassadeur: {
      target: 15;                    // 15% conversion  
      triggers: ['total_invested', 'engagement_frequency', 'feature_usage'];
      optimizationPoints: ['flexible_allocation_demo', 'exclusive_preview', 'roi_calculator'];
    };
  };
  
  engagementMetrics: {
    explorateur: {
      sessionDuration: 'target_15_minutes';
      projectsViewed: 'target_5_per_session';
      returnRate7d: 'target_40_percent';
    };
    protecteur: {
      pointsUtilization: 'target_80_percent_before_expiry';
      projectEngagement: 'target_weekly_checkins';
      purchaseFrequency: 'target_monthly';
    };
    ambassadeur: {
      allocationOptimization: 'target_bi_weekly_adjustments';
      exclusiveEngagement: 'target_monthly_exclusive_purchases';
      portfolioGrowth: 'target_15_percent_annually';
    };
  };
}
```

---

## 🛠️ Implémentation Technique

### **Base de Données Schema**

```sql
-- Extension de la table users
ALTER TABLE users ADD COLUMN level user_level_enum DEFAULT 'explorateur';
ALTER TABLE users ADD COLUMN level_upgraded_at TIMESTAMP;
ALTER TABLE users ADD COLUMN upgrade_conditions_met JSONB DEFAULT '{}';

-- Table des transitions de niveau
CREATE TABLE user_level_transitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  from_level user_level_enum NOT NULL,
  to_level user_level_enum NOT NULL,
  trigger_event VARCHAR(100) NOT NULL,
  triggered_at TIMESTAMP NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP,
  celebration_shown BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}'
);

-- Table des permissions par niveau
CREATE TABLE level_permissions (
  level user_level_enum NOT NULL,
  permission VARCHAR(100) NOT NULL,
  granted BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (level, permission)
);

-- Index pour les requêtes fréquentes
CREATE INDEX idx_user_level ON users(level);
CREATE INDEX idx_level_transitions_user ON user_level_transitions(user_id);
CREATE INDEX idx_level_transitions_date ON user_level_transitions(triggered_at);
```

### **API Endpoints**

```typescript
// Endpoints spécifiques au système de niveaux
GET /api/user/level-info
Response: {
  currentLevel: UserLevel;
  permissions: Permission[];
  upgradeOpportunity?: UpgradeOpportunity;
  levelBenefits: LevelBenefits;
  uiConfig: UIConfig;
}

POST /api/user/check-upgrade
Body: { userId: string }
Response: {
  eligible: boolean;
  upgradeOpportunity?: UpgradeOpportunity;
  requirements?: UpgradeRequirement[];
}

POST /api/user/execute-upgrade
Body: { 
  userId: string; 
  targetLevel: UserLevel;
  paymentMethodId?: string; // Pour upgrade vers Ambassadeur
}
Response: {
  success: boolean;
  newLevel: UserLevel;
  celebrationFlow: CelebrationConfig;
  newPermissions: Permission[];
}

GET /api/user/ui-config
Response: {
  navigation: NavigationConfig;
  dashboard: DashboardConfig;
  theme: ThemeConfig;
  features: FeatureFlags;
}
```

---

## 🎯 Success Metrics & KPIs

### **Métriques de Conversion**

```typescript
interface LevelSystemKPIs {
  conversionRates: {
    explorateurToProtecteur: {
      target: 30;                    // 30% dans 30 jours
      current: 'tracked_daily';
      optimizationTarget: 35;
    };
    protecteurToAmbassadeur: {
      target: 15;                    // 15% dans 90 jours
      current: 'tracked_weekly';
      optimizationTarget: 20;
    };
  };
  
  retentionRates: {
    explorateur30d: 'target_60_percent';
    protecteur90d: 'target_80_percent';
    ambassadeur12m: 'target_90_percent';
  };
  
  engagementQuality: {
    averageSessionsByLevel: {
      explorateur: 'target_8_sessions_per_month';
      protecteur: 'target_15_sessions_per_month';
      ambassadeur: 'target_25_sessions_per_month';
    };
    featureAdoptionRates: {
      pointsUtilization: 'target_85_percent';
      allocationOptimization: 'target_70_percent';
      exclusiveAccess: 'target_90_percent';
    };
  };
}
```

---

**Cette spécification User Level Management System constitue la fondation critique du modèle hybride Make the CHANGE. Elle assure une progression naturelle gratuit → payant et une expérience utilisateur adaptée à chaque niveau.**