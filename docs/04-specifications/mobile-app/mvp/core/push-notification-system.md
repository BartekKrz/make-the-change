# 🔔 Push Notification System - Modèle Hybride

**📍 VERSION: MVP** | **🗓️ TIMELINE: Mois 2-4** | **⭐️ PRIORITÉ: CRITIQUE**

## 🎯 Objectif

Implémenter un système de notifications push intelligent qui soutient le modèle hybride en maximisant l'engagement, la conversion et la rétention à chaque niveau utilisateur (Explorateur/Protecteur/Ambassadeur). Les notifications sont cruciales pour la conversion et l'utilisation des points avant expiration.

---

## 🏗️ Architecture du Système de Notifications

### **Stratégie de Notification par Niveau Utilisateur**

```typescript
interface NotificationStrategy {
  explorateur: {
    goal: 'conversion_to_first_investment';
    frequency: 'moderate_non_intrusive';
    triggers: ['engagement_patterns', 'time_based', 'social_proof'];
    opt_out_rate_target: '<10%';
  };
  
  protecteur: {
    goal: 'points_utilization_and_retention';
    frequency: 'contextual_value_driven';
    triggers: ['points_expiry', 'project_updates', 'new_products'];
    opt_out_rate_target: '<5%';
  };
  
  ambassadeur: {
    goal: 'portfolio_optimization_engagement';
    frequency: 'high_value_insights';
    triggers: ['performance_updates', 'exclusive_opportunities'];
    opt_out_rate_target: '<3%';
  };
}
```

---

## 📱 **Notifications pour EXPLORATEURS (Gratuit)**

### **Objectif : Conversion vers Premier Investissement**

#### **1. Welcome & Onboarding Series**
```typescript
interface ExplorateurWelcomeSeries {
  welcome_immediate: {
    timing: 'immediately_after_signup';
    title: "Bienvenue dans Make the CHANGE ! 🌱";
    body: "Explorez gratuitement nos projets de biodiversité";
    action: 'open_app';
    icon: 'welcome_leaf';
  };
  
  discovery_reminder_24h: {
    timing: '24h_after_signup';
    condition: 'if_no_project_viewed';
    title: "Découvrez votre premier projet 🐝";
    body: "150 apiculteurs vous attendent en Belgique";
    action: 'open_projects_tab';
    image: 'beehive_preview';
  };
  
  engagement_nudge_72h: {
    timing: '72h_after_signup';
    condition: 'if_low_engagement';
    title: "Marc vous invite dans ses ruches 🍯";
    body: "Voir comment 50€ deviennent 65 points";
    action: 'open_featured_project';
    deep_link: '/projects/marc-beehive-ardennes';
  };
}
```

#### **2. Social Proof & Urgency**
```typescript
interface ExplorateurSocialProof {
  weekly_stats: {
    timing: 'every_tuesday_6pm';
    condition: 'if_active_but_no_investment';
    title: "127 personnes ont investi cette semaine 📈";
    body: "Rejoignez la communauté des protecteurs";
    action: 'show_popular_projects';
    social_proof_data: 'real_weekly_investments';
  };
  
  scarcity_alerts: {
    timing: 'when_project_spots_low';
    condition: 'user_viewed_project_recently';
    title: "Plus que 3 places pour les ruches de Marc 🐝";
    body: "50€ → 65 points, places limitées";
    action: 'quick_invest_flow';
    urgency_level: 'high';
  };
  
  seasonal_opportunities: {
    timing: 'harvest_seasons';
    title: "Saison des miels en cours ! 🍯";
    body: "Adoptez une ruche avant la récolte d'été";
    action: 'seasonal_projects';
    image: 'honey_harvest_scene';
  };
}
```

#### **3. Re-engagement pour Inactifs**
```typescript
interface ExplorateurReEngagement {
  dormant_7d: {
    timing: '7_days_after_last_session';
    title: "Votre projet vous attend 🌱";
    body: "Reprenez là où vous vous étiez arrêté";
    action: 'return_to_last_viewed_project';
    incentive: 'none'; // MVP simple
  };
  
  dormant_14d: {
    timing: '14_days_after_last_session';
    title: "Nouveaux projets cette semaine ! 🆕";
    body: "3 nouveaux apiculteurs ont rejoint la plateforme";
    action: 'show_new_projects';
    incentive: 'first_week_highlight';
  };
  
  dormant_30d: {
    timing: '30_days_after_last_session';
    title: "On vous a gardé votre place 🤝";
    body: "Vos projets favoris sont toujours disponibles";
    action: 'show_favorites';
    last_chance_tone: true;
  };
}
```

---

## 🐝 **Notifications pour PROTECTEURS (Investisseurs)**

### **Objectif : Maximiser l'Utilisation Points & Fidélisation**

#### **1. Points Management (CRITIQUE)**
```typescript
interface ProtecteurPointsAlerts {
  points_expiry_60d: {
    timing: '60_days_before_expiry';
    condition: 'points_balance > 20';
    title: "Vos points expirent dans 2 mois ⏰";
    body: "{points_count} points · Découvrez nos produits";
    action: 'open_rewards_catalog';
    urgency_level: 'medium';
    icon: 'hourglass';
  };
  
  points_expiry_30d: {
    timing: '30_days_before_expiry';
    condition: 'points_balance > 20';
    title: "⚠️ {points_count} points expirent bientôt";
    body: "Utilisez-les avant le {expiry_date}";
    action: 'quick_shop_flow';
    urgency_level: 'high';
    priority: 'high';
  };
  
  points_expiry_7d: {
    timing: '7_days_before_expiry';
    condition: 'points_balance > 10';
    title: "🚨 DERNIÈRE SEMAINE pour vos points !";
    body: "{points_count} points expirent le {expiry_date}";
    action: 'emergency_shopping_flow';
    urgency_level: 'critical';
    priority: 'max';
    rich_content: 'suggested_products_carousel';
  };
  
  points_earned: {
    timing: 'immediately_after_investment';
    title: "🎉 65 points ajoutés à votre compte !";
    body: "Découvrez ce que vous pouvez acheter";
    action: 'celebrate_then_shop';
    celebration_animation: 'points_confetti';
  };
}
```

#### **2. Project Updates Personnalisées**
```typescript
interface ProtecteurProjectUpdates {
  honey_harvest_notification: {
    timing: 'when_beekeeper_reports_harvest';
    condition: 'user_invested_in_specific_hive';
    title: "🍯 Vos ruches ont produit du miel !";
    body: "Marc a récolté 12kg de miel d'acacia de vos ruches";
    action: 'view_my_project_updates';
    rich_content: {
      image: 'harvest_photo_from_marc';
      data: 'honey_quantity_and_type';
    };
  };
  
  beekeeper_personal_message: {
    timing: 'when_producer_sends_update';
    title: "💌 Message de votre apiculteur";
    body: "Marc : 'Merci pour votre soutien, les abeilles se portent à merveille !'";
    action: 'view_producer_message';
    personal_touch: 'high';
    engagement_driver: 'emotional_connection';
  };
  
  project_milestone: {
    timing: 'project_achievement_triggers';
    title: "🎯 Objectif atteint pour vos ruches !";
    body: "100% financé · Production peut commencer";
    action: 'view_milestone_details';
    achievement_badge: 'milestone_supporter';
  };
}
```

#### **3. Shopping & New Products**
```typescript
interface ProtecteurShopping {
  new_product_from_producer: {
    timing: 'when_invested_producer_adds_product';
    title: "🆕 Nouveau miel de Marc disponible !";
    body: "Miel de tilleul · 25 points · Récolte fraîche";
    action: 'view_new_product';
    personalized: true;
    image: 'new_product_photo';
  };
  
  seasonal_availability: {
    timing: 'seasonal_product_launches';
    title: "🍂 Miels d'automne disponibles";
    body: "Châtaignier et bruyère · Édition limitée";
    action: 'seasonal_collection';
    scarcity: 'limited_time_offer';
  };
  
  recommendation_based: {
    timing: 'weekly_smart_recommendations';
    title: "Recommandé pour vous 🎯";
    body: "Miel d'acacia · Basé sur vos investissements";
    action: 'view_recommendations';
    personalization_level: 'high';
  };
}
```

#### **4. Upgrade Suggestions (Protecteur → Ambassadeur)**
```typescript
interface ProtecteurUpgradeNudges {
  high_investment_trigger: {
    timing: 'when_total_investment_reaches_200';
    title: "Passez Ambassadeur pour plus de flexibilité 👑";
    body: "200€/mois · Allocation libre · Produits exclusifs";
    action: 'learn_about_ambassador';
    frequency_limit: 'once_per_month';
  };
  
  frequent_user_trigger: {
    timing: 'when_high_engagement_detected';
    title: "Vous utilisez beaucoup l'app ! 📱";
    body: "Ambassadeur : fonctionnalités avancées pour 200€/mois";
    action: 'ambassador_features_preview';
    condition: 'sessions_per_month > 15';
  };
}
```

---

## 👑 **Notifications pour AMBASSADEURS (Abonnements)**

### **Objectif : Optimisation Portfolio & Engagement Premium**

#### **1. Portfolio Performance**
```typescript
interface AmbassadeurPerformance {
  monthly_report: {
    timing: 'first_tuesday_each_month';
    title: "📊 Rapport mensuel de votre portfolio";
    body: "+12% performance ce mois · 3 nouveaux projets";
    action: 'view_detailed_report';
    rich_content: 'performance_charts_summary';
  };
  
  allocation_optimization: {
    timing: 'bi_weekly_analysis';
    title: "💡 Optimisation suggérée";
    body: "Réallouer 50 points vers l'olivier ILANGA NATURE";
    action: 'view_optimization_suggestions';
    ai_driven: true;
  };
  
  milestone_achievements: {
    timing: 'when_portfolio_milestone_reached';
    title: "🎯 1000 points générés ! Félicitations";
    body: "Votre impact : 15 projets soutenus, 5kg CO2 économisés";
    action: 'view_impact_summary';
    celebration: 'achievement_badge';
  };
}
```

#### **2. Exclusive Opportunities**
```typescript
interface AmbassadeurExclusives {
  new_exclusive_producer: {
    timing: 'when_new_premium_partner_joins';
    title: "🌟 Accès exclusif : Nouveau producteur";
    body: "Oliveraie premium Madagascar · Ambassadeurs seulement";
    action: 'view_exclusive_opportunity';
    exclusivity_badge: 'ambassador_only';
  };
  
  limited_edition_products: {
    timing: 'exclusive_product_launches';
    title: "🎁 Édition limitée pour Ambassadeurs";
    body: "Coffret miel & huile d'olive · 20 exemplaires";
    action: 'shop_exclusive_products';
    scarcity: 'very_limited';
  };
  
  early_access: {
    timing: 'before_general_availability';
    title: "⏰ Accès anticipé : Nouveau projet";
    body: "48h avant ouverture publique · Ruches premium";
    action: 'early_access_investment';
    privilege: 'first_access';
  };
}
```

#### **3. Engagement Premium**
```typescript
interface AmbassadeurEngagement {
  producer_direct_access: {
    timing: 'monthly_producer_calls';
    title: "📞 Appel avec Marc ce vendredi 14h";
    body: "Discussion exclusive Ambassadeurs · Q&A apiculture";
    action: 'join_producer_call';
    calendar_integration: 'add_to_calendar';
  };
  
  community_insights: {
    timing: 'weekly_community_highlights';
    title: "👥 Insights communauté Ambassadeurs";
    body: "Tendances allocation · Nouveaux favoris · Top performers";
    action: 'view_community_insights';
    data_driven: 'anonymized_community_data';
  };
}
```

---

## 🎯 **Smart Notification Engine**

### **Intelligence & Personnalisation**

```typescript
class SmartNotificationEngine {
  // Système de scoring pour optimiser le timing
  calculateOptimalTiming(user: User, notificationType: NotificationType): Date {
    const userBehavior = this.getUserBehaviorProfile(user);
    const baseSchedule = NOTIFICATION_SCHEDULES[notificationType];
    
    // Optimisation selon les habitudes utilisateur
    const optimalHours = userBehavior.mostActiveHours; // Ex: [18, 19, 20]
    const dayOfWeek = this.getBestDayForUser(user, notificationType);
    
    // Éviter la saturation
    const recentNotifications = this.getRecentNotifications(user.id);
    const cooldownPeriod = this.calculateCooldown(recentNotifications);
    
    return this.scheduleWithOptimization(baseSchedule, {
      preferredHours: optimalHours,
      preferredDay: dayOfWeek,
      cooldown: cooldownPeriod,
      userTimezone: user.timezone
    });
  }
  
  // Personnalisation du contenu
  personalizeContent(template: NotificationTemplate, user: User): PersonalizedNotification {
    const context = {
      firstName: user.firstName,
      pointsBalance: user.pointsBalance,
      investmentCount: user.investments.length,
      favoriteProducer: user.getMostEngagedProducer(),
      upcomingExpiry: user.getNextPointsExpiry(),
      recentActivity: user.getRecentActivity()
    };
    
    return {
      title: this.interpolateTemplate(template.title, context),
      body: this.interpolateTemplate(template.body, context),
      action: template.action,
      richContent: this.generateRichContent(template, context),
      deepLink: this.generateDeepLink(template, context, user)
    };
  }
  
  // Système de fréquence intelligente
  shouldSendNotification(user: User, notification: NotificationTemplate): boolean {
    // Vérifier les préférences utilisateur
    if (!user.notificationPreferences[notification.category]) {
      return false;
    }
    
    // Vérifier la fatigue notification
    const recentCount = this.getNotificationCount(user.id, '24h');
    if (recentCount >= this.getMaxDailyNotifications(user.level)) {
      return false;
    }
    
    // Vérifier la pertinence contextuelle
    const relevanceScore = this.calculateRelevance(notification, user);
    return relevanceScore >= MINIMUM_RELEVANCE_THRESHOLD;
  }
}
```

### **Frequency Management par Niveau**

```typescript
interface NotificationFrequencyLimits {
  explorateur: {
    max_per_day: 2;
    max_per_week: 10;
    cooldown_between_similar: 48; // heures
    priority_types: ['welcome', 'social_proof', 'conversion'];
  };
  
  protecteur: {
    max_per_day: 3;
    max_per_week: 15;
    cooldown_between_similar: 24; // heures
    priority_types: ['points_expiry', 'project_updates', 'shopping'];
    critical_override: ['points_expiry_7d']; // Peut dépasser les limites
  };
  
  ambassadeur: {
    max_per_day: 5;
    max_per_week: 25;
    cooldown_between_similar: 12; // heures
    priority_types: ['performance', 'exclusives', 'optimization'];
    premium_experience: true;
  };
}
```

---

## 📊 **Analytics & Optimization**

### **Performance Tracking**

```typescript
interface NotificationAnalytics {
  delivery_metrics: {
    send_success_rate: 'target_99_percent';
    device_availability_rate: 'track_per_platform';
    opt_in_rate_by_level: {
      explorateur: 'target_85_percent';
      protecteur: 'target_95_percent';
      ambassadeur: 'target_98_percent';
    };
  };
  
  engagement_metrics: {
    open_rates_by_type: {
      points_expiry: 'target_80_percent';
      project_updates: 'target_65_percent';
      shopping_recommendations: 'target_45_percent';
      social_proof: 'target_35_percent';
    };
    action_completion_rates: {
      app_opens: 'target_60_percent';
      specific_actions: 'target_25_percent';
      purchases_from_notifications: 'target_15_percent';
    };
  };
  
  business_impact: {
    conversion_attribution: 'notifications_leading_to_investments';
    points_utilization_boost: 'before_vs_after_expiry_notifications';
    retention_impact: 'notification_engaged_vs_non_engaged_users';
  };
}
```

### **A/B Testing Framework**

```typescript
interface NotificationABTests {
  timing_optimization: {
    variants: ['morning_8am', 'lunch_12pm', 'evening_6pm', 'intelligent_timing'];
    success_metric: 'open_rate_and_action_completion';
  };
  
  content_personalization: {
    variants: ['generic_content', 'name_personalized', 'behavior_personalized', 'ai_generated'];
    success_metric: 'engagement_rate_and_conversion';
  };
  
  urgency_messaging: {
    variants: ['no_urgency', 'soft_urgency', 'strong_urgency', 'countdown_urgency'];
    success_metric: 'points_utilization_rate';
  };
  
  rich_content: {
    variants: ['text_only', 'with_images', 'with_animations', 'interactive_content'];
    success_metric: 'user_satisfaction_and_retention';
  };
}
```

---

## 🔧 **Technical Implementation**

### **Architecture Technique**

```typescript
// Service de notifications avec priorités
class NotificationService {
  private queues = {
    critical: new PriorityQueue(),    // Points expiry, system alerts
    high: new PriorityQueue(),        // Project updates, promotions
    medium: new PriorityQueue(),      // Shopping recommendations
    low: new PriorityQueue()          // Community updates
  };
  
  async scheduleNotification(
    userId: string,
    template: NotificationTemplate,
    scheduledFor: Date,
    priority: NotificationPriority = 'medium'
  ): Promise<string> {
    const notification = await this.buildNotification(userId, template);
    const notificationId = generateId();
    
    // Ajouter à la queue appropriée
    this.queues[priority].enqueue({
      id: notificationId,
      userId,
      notification,
      scheduledFor,
      retryCount: 0
    });
    
    // Persister en base pour tracking
    await this.persistNotification(notificationId, notification);
    
    return notificationId;
  }
  
  private async processQueues(): Promise<void> {
    // Process par ordre de priorité
    for (const priority of ['critical', 'high', 'medium', 'low']) {
      const queue = this.queues[priority];
      
      while (!queue.isEmpty() && this.canSendMore()) {
        const item = queue.dequeue();
        
        if (this.isTimeToSend(item.scheduledFor)) {
          await this.sendNotification(item);
        } else {
          // Remettre dans la queue pour plus tard
          queue.enqueue(item);
          break;
        }
      }
    }
  }
}

// Integration avec Expo Notifications
interface ExpoNotificationConfig {
  sound: 'default' | 'custom_bee_sound';
  badge: number;
  categoryId: string; // Pour actions rapides
  data: {
    screen: string;
    params: any;
    tracking: {
      notificationId: string;
      userId: string;
      type: string;
    };
  };
}
```

### **Database Schema**

```sql
-- Table des notifications planifiées
CREATE TABLE scheduled_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  type VARCHAR(100) NOT NULL,
  priority notification_priority DEFAULT 'medium',
  scheduled_for TIMESTAMP NOT NULL,
  sent_at TIMESTAMP,
  opened_at TIMESTAMP,
  action_taken_at TIMESTAMP,
  status notification_status DEFAULT 'pending',
  content JSONB NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table des préférences de notification par utilisateur
CREATE TABLE user_notification_preferences (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  points_expiry BOOLEAN DEFAULT TRUE,
  project_updates BOOLEAN DEFAULT TRUE,
  shopping_recommendations BOOLEAN DEFAULT TRUE,
  social_proof BOOLEAN DEFAULT TRUE,
  promotional BOOLEAN DEFAULT TRUE,
  quiet_hours_start TIME DEFAULT '22:00',
  quiet_hours_end TIME DEFAULT '08:00',
  timezone VARCHAR(50) DEFAULT 'UTC',
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index pour les requêtes fréquentes
CREATE INDEX idx_scheduled_notifications_pending ON scheduled_notifications(scheduled_for) WHERE status = 'pending';
CREATE INDEX idx_notifications_user_type ON scheduled_notifications(user_id, type);
CREATE INDEX idx_notifications_analytics ON scheduled_notifications(sent_at, opened_at, action_taken_at) WHERE sent_at IS NOT NULL;
```

---

## 🎯 **Success Metrics & KPIs**

### **Objectifs Critiques MVP**

```typescript
interface NotificationSystemKPIs {
  engagement_targets: {
    points_expiry_notifications: {
      open_rate: 75;              // 75% ouvrent l'alerte expiration
      action_rate: 60;            // 60% utilisent leurs points
      prevention_rate: 85;        // 85% évitent l'expiration
    };
    
    conversion_support: {
      explorateur_notifications: {
        app_return_rate: 40;      // 40% rouvrent l'app
        investment_attribution: 25; // 25% des investissements via notifications
      };
    };
  };
  
  business_impact: {
    points_waste_reduction: {
      target: 80;                 // 80% réduction des points expirés
      measurement: 'monthly_expired_points_percentage';
    };
    
    user_retention_boost: {
      target: 15;                 // +15% rétention avec notifications
      measurement: '30d_retention_with_vs_without_notifications';
    };
  };
}
```

---

**Ce système de notifications push constitue le moteur d'engagement du modèle hybride, maximisant la conversion gratuit → payant et l'utilisation optimale des points avant expiration.**