# Gamification Service - Make the CHANGE

**🎮 Service:** `GamificationService` | **📍 Priority:** ⭐️⭐️ HIGH (V1) | **🗓️ Week:** 5-6

## Overview

Core gamification engine handling badges, challenges, leaderboards, and learn & earn mechanics. Designed to drive user engagement, retention, and viral growth through meaningful rewards and social recognition.

## 🎯 Service Architecture

### Core Components
```typescript
interface GamificationService {
  badges: BadgeEngine
  challenges: ChallengeEngine  
  leaderboard: LeaderboardEngine
  rewards: RewardEngine
  analytics: GamificationAnalytics
}

interface BadgeEngine {
  checkEligibility(userId: string): Promise<EligibleBadge[]>
  awardBadge(userId: string, badgeId: string): Promise<BadgeAward>
  calculateProgress(userId: string, badgeId: string): Promise<BadgeProgress>
  getBadgeDefinitions(): BadgeDefinition[]
}

interface ChallengeEngine {
  generateWeeklyChallenges(): Promise<Challenge[]>
  generateMonthlyChallenges(): Promise<Challenge[]>
  validateChallengeCompletion(userId: string, challengeId: string, evidence: Evidence): Promise<boolean>
  calculateChallengeProgress(userId: string, challengeId: string): Promise<ChallengeProgress>
  expireChallenges(): Promise<ExpiryResult>
}

interface LeaderboardEngine {
  calculateImpactScores(period: TimePeriod, filters: LeaderboardFilters): Promise<LeaderboardEntry[]>
  getUserRanking(userId: string, period: TimePeriod): Promise<UserRanking>
  updateLeaderboardCache(): Promise<void>
  getHistoricalRankings(userId: string): Promise<RankingHistory[]>
}

interface RewardEngine {
  awardPointsForActivity(userId: string, activity: ActivityType, evidence: Evidence): Promise<PointsReward>
  calculateStreakBonus(userId: string, activityType: ActivityType): Promise<number>
  validateDailyLimits(userId: string, activityType: ActivityType): Promise<boolean>
  processRewardQueue(): Promise<QueueResult>
}
```

## 🏆 Badge Engine Implementation

### Badge Categories and Definitions
```typescript
export class BadgeEngine {
  private readonly BADGE_CATEGORIES = {
    INVESTMENT: 'investment',
    ENGAGEMENT: 'engagement', 
    SOCIAL: 'social',
    MILESTONE: 'milestone'
  } as const

  private readonly INVESTMENT_BADGES: BadgeDefinition[] = [
    {
      id: 'first_investment',
      name: 'Premier Pas',
      description: 'Votre premier investissement dans un projet',
      category: 'investment',
      icon: 'seedling',
      rarity: 'common',
      criteria: { type: 'investment_count', threshold: 1 },
      pointsReward: 50,
      autoAward: true,
      celebrationConfig: {
        showModal: true,
        animationType: 'bounce',
        soundEffect: 'achievement_unlock',
      }
    },
    {
      id: 'bee_protector',
      name: 'Protecteur des Abeilles', 
      description: 'Soutenir 5 ruches différentes',
      category: 'investment',
      icon: 'bee',
      rarity: 'rare',
      criteria: { type: 'ruche_investments', threshold: 5 },
      pointsReward: 200,
      autoAward: true,
    },
    {
      id: 'olive_guardian',
      name: 'Gardien des Oliviers',
      description: 'Soutenir 3 oliviers différents', 
      category: 'investment',
      icon: 'olive-branch',
      rarity: 'rare',
      criteria: { type: 'olivier_investments', threshold: 3 },
      pointsReward: 150,
      autoAward: true,
    },
    {
      id: 'biodiversity_champion',
      name: 'Champion Biodiversité',
      description: 'Investir dans 10 projets différents',
      category: 'investment', 
      icon: 'crown',
      rarity: 'epic',
      criteria: { type: 'unique_projects', threshold: 10 },
      pointsReward: 500,
      autoAward: true,
    },
    {
      id: 'ecosystem_guardian',
      name: 'Gardien des Écosystèmes',
      description: 'Investir dans les 3 types de projets (ruche, olivier, vignoble)',
      category: 'investment',
      icon: 'globe',
      rarity: 'legendary',
      criteria: { type: 'project_type_diversity', threshold: 3 },
      pointsReward: 1000,
      autoAward: true,
    }
  ]

  private readonly SOCIAL_BADGES: BadgeDefinition[] = [
    {
      id: 'first_review',
      name: 'Premier Avis',
      description: 'Écrire votre premier avis produit',
      category: 'social',
      icon: 'star',
      rarity: 'common',
      criteria: { type: 'review_count', threshold: 1 },
      pointsReward: 25,
      autoAward: true,
    },
    {
      id: 'quality_reviewer',
      name: 'Critique de Qualité',
      description: 'Écrire 10 avis de qualité avec photos',
      category: 'social',
      icon: 'award',
      rarity: 'rare', 
      criteria: { type: 'quality_reviews', threshold: 10 },
      pointsReward: 150,
      autoAward: true,
    },
    {
      id: 'community_builder',
      name: 'Bâtisseur de Communauté',
      description: 'Parrainer 5 nouveaux membres convertis',
      category: 'social',
      icon: 'users',
      rarity: 'epic',
      criteria: { type: 'successful_referrals', threshold: 5 },
      pointsReward: 500,
      autoAward: true,
    }
  ]

  async checkEligibility(userId: string): Promise<EligibleBadge[]> {
    const userStats = await this.getUserAchievementStats(userId)
    const earnedBadges = await this.getEarnedBadges(userId)
    
    const eligibleBadges: EligibleBadge[] = []
    
    for (const badge of [...this.INVESTMENT_BADGES, ...this.SOCIAL_BADGES]) {
      const alreadyEarned = earnedBadges.some(earned => earned.badgeId === badge.id)
      if (alreadyEarned) continue
      
      const isEligible = await this.checkBadgeCriteria(badge, userStats)
      if (isEligible) {
        eligibleBadges.push({
          badgeId: badge.id,
          name: badge.name,
          pointsReward: badge.pointsReward,
          autoAward: badge.autoAward,
        })
      }
    }
    
    return eligibleBadges
  }

  private async checkBadgeCriteria(badge: BadgeDefinition, stats: UserAchievementStats): Promise<boolean> {
    switch (badge.criteria.type) {
      case 'investment_count':
        return stats.totalInvestments >= badge.criteria.threshold
        
      case 'ruche_investments':
        return stats.investmentsByType.ruche >= badge.criteria.threshold
        
      case 'olivier_investments': 
        return stats.investmentsByType.olivier >= badge.criteria.threshold
        
      case 'unique_projects':
        return stats.uniqueProjectsSupported >= badge.criteria.threshold
        
      case 'project_type_diversity':
        return Object.keys(stats.investmentsByType).length >= badge.criteria.threshold
        
      case 'review_count':
        return stats.totalReviews >= badge.criteria.threshold
        
      case 'quality_reviews':
        return stats.qualityReviews >= badge.criteria.threshold
        
      case 'successful_referrals':
        return stats.convertedReferrals >= badge.criteria.threshold
        
      default:
        return false
    }
  }
}
```

## 🎯 Challenge Engine Implementation

### Challenge Generation System
```typescript
export class ChallengeEngine {
  private readonly WEEKLY_CHALLENGE_TEMPLATES = [
    {
      id: 'discovery_week',
      title: 'Explorateur de la Semaine',
      description: 'Soutenir 2 nouveaux projets cette semaine',
      category: 'discovery',
      difficulty: 'easy',
      requirements: [
        { type: 'new_projects_investment', target: 2, description: 'Investir dans 2 projets non soutenus' }
      ],
      rewards: { points: 50, badge: null },
      duration: 7, // days
    },
    {
      id: 'engagement_week',
      title: 'Critique Engagé',
      description: 'Écrire 3 avis de qualité cette semaine',
      category: 'engagement',
      difficulty: 'medium',
      requirements: [
        { type: 'quality_reviews', target: 3, description: 'Avis avec photo et 50+ mots' }
      ],
      rewards: { points: 75, badge: null },
      duration: 7,
    },
    {
      id: 'community_week',
      title: 'Ambassadeur Social',
      description: 'Parrainer un nouvel utilisateur cette semaine',
      category: 'community',
      difficulty: 'hard',
      requirements: [
        { type: 'referral_conversion', target: 1, description: 'Nouveau membre qui investit' }
      ],
      rewards: { points: 150, badge: 'community_starter' },
      duration: 7,
    }
  ]

  private readonly MONTHLY_CHALLENGE_TEMPLATES = [
    {
      id: 'biodiversity_month',
      title: 'Champion Biodiversité Mensuel',
      description: 'Soutenir 5 projets différents ce mois-ci',
      category: 'discovery',
      difficulty: 'medium',
      requirements: [
        { type: 'unique_projects', target: 5, description: 'Projets dans différentes catégories' }
      ],
      rewards: { points: 200, badge: 'monthly_explorer' },
      duration: 30,
    },
    {
      id: 'engagement_month',
      title: 'Expert Communauté',
      description: 'Écrire 10 avis et parrainer 2 membres',
      category: 'engagement',
      difficulty: 'hard',
      requirements: [
        { type: 'reviews', target: 10, description: 'Avis produits' },
        { type: 'referrals', target: 2, description: 'Nouveaux membres' }
      ],
      rewards: { points: 400, badge: 'community_expert' },
      duration: 30,
    }
  ]

  async generateWeeklyChallenges(): Promise<Challenge[]> {
    const activeWeeklyChallenges = await this.getActiveChallenges('weekly')
    
    // Generate new challenges if none active
    if (activeWeeklyChallenges.length === 0) {
      const selectedTemplates = this.selectRandomTemplates(this.WEEKLY_CHALLENGE_TEMPLATES, 3)
      
      const challenges = await Promise.all(
        selectedTemplates.map(template => this.createChallengeFromTemplate(template, 'weekly'))
      )
      
      return challenges
    }
    
    return activeWeeklyChallenges
  }

  async validateChallengeCompletion(
    userId: string, 
    challengeId: string, 
    evidence: Evidence
  ): Promise<boolean> {
    const challenge = await this.getChallengeById(challengeId)
    const userProgress = await this.getUserChallengeProgress(userId, challengeId)
    
    // Validate evidence based on requirement type
    for (const requirement of challenge.requirements) {
      const isValid = await this.validateRequirementEvidence(requirement, evidence, userId)
      if (!isValid) return false
    }
    
    return true
  }

  private async validateRequirementEvidence(
    requirement: ChallengeRequirement,
    evidence: Evidence,
    userId: string
  ): Promise<boolean> {
    switch (requirement.type) {
      case 'new_projects_investment':
        // Check if user invested in new projects
        const newInvestments = await this.getRecentInvestments(userId, 7) // last 7 days
        const uniqueProjects = new Set(newInvestments.map(inv => inv.projectId))
        return uniqueProjects.size >= requirement.target
        
      case 'quality_reviews':
        const recentReviews = await this.getRecentQualityReviews(userId, 7)
        return recentReviews.length >= requirement.target
        
      case 'referral_conversion':
        const recentReferrals = await this.getRecentConvertedReferrals(userId, 7)
        return recentReferrals.length >= requirement.target
        
      default:
        return false
    }
  }
}
```

## 🏅 Leaderboard Engine Implementation

### Impact Score Calculation
```typescript
export class LeaderboardEngine {
  private readonly IMPACT_WEIGHTS = {
    INVESTMENT: {
      ruche: 100,
      olivier: 150,
      parcelle_familiale: 300,
    },
    SUBSCRIPTION: {
      ambassadeur_standard_monthly: 20,
      ambassadeur_premium_monthly: 35,
      ambassadeur_standard_annual: 252,
      ambassadeur_premium_annual: 480,
    },
    ENGAGEMENT: {
      review: 10,
      quality_review: 20,
      quiz_completion: 5,
      project_check_in: 2,
    },
    COMMUNITY: {
      successful_referral: 50,
      share_with_conversion: 25,
      helpful_review_vote: 1,
    }
  } as const

  async calculateImpactScores(
    period: TimePeriod,
    filters: LeaderboardFilters = {}
  ): Promise<LeaderboardEntry[]> {
    const dateRange = this.calculatePeriodRange(period)
    
    // Get all users with activities in period
    const users = await this.db.user.findMany({
      where: {
        userLevel: filters.userLevel ? { equals: filters.userLevel } : { not: 'admin' },
        OR: [
          { investments: { some: { createdAt: { gte: dateRange.start, lte: dateRange.end } } } },
          { subscriptions: { some: { createdAt: { gte: dateRange.start, lte: dateRange.end } } } },
          { reviews: { some: { createdAt: { gte: dateRange.start, lte: dateRange.end } } } },
          { referrals: { some: { convertedAt: { gte: dateRange.start, lte: dateRange.end } } } },
        ]
      },
      include: {
        investments: { where: { createdAt: { gte: dateRange.start, lte: dateRange.end } } },
        subscriptions: { where: { status: 'active' } },
        reviews: { where: { createdAt: { gte: dateRange.start, lte: dateRange.end } } },
        referrals: { where: { convertedAt: { gte: dateRange.start, lte: dateRange.end } } },
        badges: { include: { badge: true } },
      }
    })
    
    // Calculate impact scores
    const leaderboardEntries = users.map(user => {
      const impactScore = this.calculateUserImpactScore(user, dateRange)
      
      return {
        userId: user.id,
        displayName: `${user.firstName} ${user.lastName[0]}.`,
        avatar: user.avatarUrl,
        userLevel: user.userLevel,
        impactScore: impactScore.total,
        impactBreakdown: impactScore.breakdown,
        badges: user.badges.map(ub => ({
          id: ub.badge.id,
          name: ub.badge.name,
          icon: ub.badge.icon,
          rarity: ub.badge.rarity,
        })),
        achievements: {
          projectsSupported: user.investments.length,
          totalInvested: user.investments.reduce((sum, inv) => sum + inv.amountEur, 0),
          reviewsWritten: user.reviews.length,
          referralsConverted: user.referrals.filter(ref => ref.status === 'converted').length,
        }
      }
    })
    
    // Sort by impact score and add ranks
    return leaderboardEntries
      .sort((a, b) => b.impactScore - a.impactScore)
      .map((entry, index) => ({ ...entry, rank: index + 1 }))
      .slice(0, filters.limit || 50)
  }

  private calculateUserImpactScore(user: UserWithIncludes, dateRange: DateRange): ImpactScoreResult {
    // Investment impact
    const investmentImpact = user.investments.reduce((sum, investment) => {
      return sum + (this.IMPACT_WEIGHTS.INVESTMENT[investment.investmentType] || 0)
    }, 0)
    
    // Subscription impact (monthly contribution)
    const subscriptionImpact = user.subscriptions.reduce((sum, subscription) => {
      const key = `${subscription.subscriptionTier}_${subscription.billingFrequency}` as keyof typeof this.IMPACT_WEIGHTS.SUBSCRIPTION
      return sum + (this.IMPACT_WEIGHTS.SUBSCRIPTION[key] || 0)
    }, 0)
    
    // Engagement impact
    const engagementImpact = user.reviews.reduce((sum, review) => {
      return sum + (review.isQualityReview ? 
        this.IMPACT_WEIGHTS.ENGAGEMENT.quality_review : 
        this.IMPACT_WEIGHTS.ENGAGEMENT.review)
    }, 0)
    
    // Community impact
    const communityImpact = user.referrals
      .filter(ref => ref.status === 'converted')
      .length * this.IMPACT_WEIGHTS.COMMUNITY.successful_referral
    
    return {
      total: investmentImpact + subscriptionImpact + engagementImpact + communityImpact,
      breakdown: {
        investmentPoints: investmentImpact,
        subscriptionPoints: subscriptionImpact,
        engagementPoints: engagementImpact,
        communityPoints: communityImpact,
      }
    }
  }
}
```

## 🎮 Challenge Engine Implementation

### Dynamic Challenge Generation
```typescript
export class ChallengeEngine {
  async generatePersonalizedChallenges(userId: string): Promise<Challenge[]> {
    const userProfile = await this.getUserProfile(userId)
    const userHistory = await this.getUserActivityHistory(userId, 30) // last 30 days
    
    const personalizedChallenges = []
    
    // Generate challenges based on user behavior
    if (userProfile.userLevel === 'explorateur' && userHistory.investments.length === 0) {
      personalizedChallenges.push(this.createFirstInvestmentChallenge())
    }
    
    if (userHistory.reviews.length < 3) {
      personalizedChallenges.push(this.createReviewChallenge())
    }
    
    if (userProfile.userLevel === 'ambassadeur' && !userHistory.hasUsedAllocation) {
      personalizedChallenges.push(this.createAllocationChallenge())
    }
    
    return personalizedChallenges
  }

  private createFirstInvestmentChallenge(): Challenge {
    return {
      id: generateUUID(),
      title: 'Premier Pas vers l\'Impact',
      description: 'Réalisez votre premier investissement dans un projet de biodiversité',
      type: 'personalized',
      category: 'discovery',
      difficulty: 'easy',
      startDate: new Date(),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
      requirements: [
        { 
          type: 'first_investment',
          target: 1,
          description: 'Investir dans n\'importe quel projet (ruche, olivier, ou vignoble)'
        }
      ],
      rewards: {
        points: 100,
        badge: 'first_investment',
        title: 'Nouveau Protecteur de la Biodiversité'
      },
      isActive: true,
    }
  }

  async processScheduledChallenges(): Promise<void> {
    // Generate weekly challenges every Monday
    if (this.isMonday()) {
      await this.generateWeeklyChallenges()
    }
    
    // Generate monthly challenges on 1st of month
    if (this.isFirstOfMonth()) {
      await this.generateMonthlyChallenges()
    }
    
    // Expire old challenges
    await this.expireOldChallenges()
    
    // Check for challenge completions
    await this.checkPendingCompletions()
  }
}
```

## 🎁 Reward Engine Implementation

### Learn & Earn System
```typescript
export class RewardEngine {
  private readonly ACTIVITY_REWARDS = {
    quiz_completion: { points: 5, dailyLimit: 3 },
    quality_review: { points: 15, dailyLimit: 5 },
    standard_review: { points: 5, dailyLimit: 5 },
    project_check_in: { points: 2, dailyLimit: 1 },
    content_engagement: { points: 1, dailyLimit: 10 },
  } as const

  async awardPointsForActivity(
    userId: string,
    activity: ActivityType,
    evidence: Evidence
  ): Promise<PointsReward> {
    // Check daily limits
    const dailyCount = await this.getDailyActivityCount(userId, activity)
    const limit = this.ACTIVITY_REWARDS[activity]?.dailyLimit || 0
    
    if (dailyCount >= limit) {
      throw new Error('DAILY_LIMIT_EXCEEDED')
    }
    
    // Validate evidence
    const isValidEvidence = await this.validateActivityEvidence(activity, evidence)
    if (!isValidEvidence) {
      throw new Error('INSUFFICIENT_EVIDENCE')
    }
    
    // Calculate points with potential streak bonus
    const basePoints = this.ACTIVITY_REWARDS[activity].points
    const streakBonus = await this.calculateStreakBonus(userId, activity)
    const totalPoints = basePoints + streakBonus
    
    // Award points
    const transaction = await this.db.pointsTransaction.create({
      data: {
        userId,
        type: 'earned',
        subtype: `activity_${activity}`,
        amount: totalPoints,
        description: this.getActivityDescription(activity, evidence),
        referenceId: evidence.referenceId,
        expiresAt: new Date(Date.now() + 18 * 30 * 24 * 60 * 60 * 1000), // 18 months
      }
    })
    
    // Check for achievement unlocks
    const achievementUnlocked = await this.checkActivityAchievements(userId, activity)
    
    return {
      pointsEarned: totalPoints,
      basePoints,
      streakBonus,
      transaction,
      achievementUnlocked,
    }
  }

  async calculateStreakBonus(userId: string, activityType: ActivityType): Promise<number> {
    const streak = await this.getCurrentActivityStreak(userId, activityType)
    
    // Bonus points based on streak
    if (streak >= 7) return 10 // Weekly streak
    if (streak >= 3) return 5  // 3-day streak
    return 0
  }

  private async validateActivityEvidence(activity: ActivityType, evidence: Evidence): Promise<boolean> {
    switch (activity) {
      case 'quiz_completion':
        return evidence.quizScore >= 80 // Minimum 80% to earn points
        
      case 'quality_review':
        return evidence.reviewText.length >= 50 && evidence.photoUploaded === true
        
      case 'project_check_in':
        return evidence.engagementTime >= 30 // Minimum 30 seconds engagement
        
      default:
        return true
    }
  }
}
```

## 📊 Analytics & Monitoring

### Gamification Analytics
```typescript
export class GamificationAnalytics {
  async getEngagementMetrics(period: TimePeriod): Promise<EngagementMetrics> {
    return {
      badges: {
        totalBadgesEarned: await this.countBadgesEarned(period),
        badgeEarnRate: await this.calculateBadgeEarnRate(period),
        topBadgesByCategory: await this.getTopBadgesByCategory(period),
        averageTimeToEarn: await this.calculateAverageTimeToEarn(period),
      },
      challenges: {
        activeChallenges: await this.countActiveChallenges(),
        completionRate: await this.calculateChallengeCompletionRate(period),
        averageCompletionTime: await this.calculateAverageCompletionTime(period),
        topChallengeCategories: await this.getTopChallengeCategories(period),
      },
      leaderboard: {
        activeParticipants: await this.countActiveParticipants(period),
        averageImpactScore: await this.calculateAverageImpactScore(period),
        impactScoreDistribution: await this.getImpactScoreDistribution(period),
        engagementByLevel: await this.getEngagementByLevel(period),
      },
      learningRewards: {
        quizCompletions: await this.countQuizCompletions(period),
        averageQuizScore: await this.calculateAverageQuizScore(period),
        qualityReviewsCount: await this.countQualityReviews(period),
        totalPointsFromLearning: await this.sumLearningPoints(period),
      }
    }
  }

  async trackUserEngagement(userId: string, action: EngagementAction): Promise<void> {
    await this.db.userEngagement.create({
      data: {
        userId,
        action,
        timestamp: new Date(),
        metadata: action.metadata || {},
      }
    })
    
    // Update user engagement score
    await this.updateUserEngagementScore(userId)
  }
}
```

## 🔄 Background Jobs & Scheduling

### Automated Processes
```typescript
export class GamificationScheduler {
  async runDailyTasks(): Promise<void> {
    // Reset daily activity limits
    await this.resetDailyActivityLimits()
    
    // Check badge eligibility for all users
    await this.processBadgeEligibilityChecks()
    
    // Generate personalized challenges
    await this.generatePersonalizedChallenges()
    
    // Update leaderboard cache
    await this.updateLeaderboardCache()
  }

  async runWeeklyTasks(): Promise<void> {
    // Generate new weekly challenges
    await this.challengeEngine.generateWeeklyChallenges()
    
    // Process weekly leaderboard rewards
    await this.processWeeklyLeaderboardRewards()
    
    // Clean up expired share cards
    await this.cleanupExpiredShareCards()
  }

  async runMonthlyTasks(): Promise<void> {
    // Generate monthly challenges
    await this.challengeEngine.generateMonthlyChallenges()
    
    // Calculate monthly impact reports
    await this.generateMonthlyImpactReports()
    
    // Process referral tree planting actions
    await this.processPlanetActions()
  }
}
```

## 🚨 Error Handling & Recovery

### Resilience Strategies
```typescript
export class GamificationErrorHandler {
  async handleBadgeAwardFailure(userId: string, badgeId: string, error: Error): Promise<void> {
    // Log error for manual review
    await this.logger.error('Badge award failed', {
      userId,
      badgeId,
      error: error.message,
      timestamp: new Date(),
    })
    
    // Queue for retry
    await this.retryQueue.add('award_badge', {
      userId,
      badgeId,
      attempt: 1,
      maxAttempts: 3,
    })
  }

  async handleChallengeGenerationFailure(challengeType: string, error: Error): Promise<void> {
    // Fall back to default challenges
    const defaultChallenges = await this.getDefaultChallenges(challengeType)
    await this.activateDefaultChallenges(defaultChallenges)
    
    // Alert admin team
    await this.notificationService.sendAdminAlert({
      type: 'challenge_generation_failed',
      message: `Failed to generate ${challengeType} challenges: ${error.message}`,
      severity: 'medium',
    })
  }

  async handleLeaderboardCalculationFailure(period: TimePeriod, error: Error): Promise<void> {
    // Use cached leaderboard data
    const cachedLeaderboard = await this.getCachedLeaderboard(period)
    if (cachedLeaderboard) {
      await this.extendCacheExpiry(period, 1) // Extend by 1 hour
      return
    }
    
    // Disable leaderboard temporarily
    await this.disableLeaderboard(period, error.message)
  }
}
```

## 📊 Performance Optimization

### Caching Strategy
```typescript
export class GamificationCache {
  private readonly CACHE_KEYS = {
    USER_BADGES: (userId: string) => `badges:user:${userId}`,
    LEADERBOARD: (period: string, category: string) => `leaderboard:${period}:${category}`,
    CHALLENGE_PROGRESS: (userId: string, challengeId: string) => `challenge:${userId}:${challengeId}`,
    BADGE_ELIGIBILITY: (userId: string) => `badge_eligibility:${userId}`,
  } as const

  private readonly CACHE_TTL = {
    USER_BADGES: 300, // 5 minutes
    LEADERBOARD: 1800, // 30 minutes
    CHALLENGE_PROGRESS: 60, // 1 minute
    BADGE_ELIGIBILITY: 180, // 3 minutes
  } as const

  async getCachedUserBadges(userId: string): Promise<UserBadge[] | null> {
    const key = this.CACHE_KEYS.USER_BADGES(userId)
    const cached = await this.redis.get(key)
    return cached ? JSON.parse(cached) : null
  }

  async setCachedUserBadges(userId: string, badges: UserBadge[]): Promise<void> {
    const key = this.CACHE_KEYS.USER_BADGES(userId)
    const ttl = this.CACHE_TTL.USER_BADGES
    await this.redis.setex(key, ttl, JSON.stringify(badges))
  }

  async invalidateUserCache(userId: string): Promise<void> {
    const patterns = [
      this.CACHE_KEYS.USER_BADGES(userId),
      this.CACHE_KEYS.BADGE_ELIGIBILITY(userId),
      `challenge:${userId}:*`,
    ]
    
    await Promise.all(patterns.map(pattern => this.redis.del(pattern)))
  }
}
```

## 🔗 Integration Points

### Points Service Integration
```typescript
interface PointsServiceIntegration {
  // Award points for gamification activities
  awardGamificationPoints(
    userId: string,
    source: 'badge' | 'challenge' | 'activity',
    amount: number,
    description: string,
    referenceId?: string
  ): Promise<PointsTransaction>
  
  // Check points balance for reward validation
  checkSufficientBalance(userId: string, amount: number): Promise<boolean>
  
  // Get points earning history for badge calculations
  getPointsEarningHistory(userId: string, period: TimePeriod): Promise<PointsTransaction[]>
}
```

### Notification Service Integration
```typescript
interface NotificationServiceIntegration {
  // Badge award notifications
  sendBadgeAwardNotification(userId: string, badge: Badge): Promise<void>
  
  // Challenge completion notifications
  sendChallengeCompletionNotification(userId: string, challenge: Challenge, rewards: Rewards): Promise<void>
  
  // Leaderboard position notifications
  sendLeaderboardUpdateNotification(userId: string, newRank: number, oldRank: number): Promise<void>
  
  // Weekly challenge notifications
  sendWeeklyChallengeNotification(userId: string, challenges: Challenge[]): Promise<void>
}
```

## 🎯 Success Metrics

### Key Performance Indicators
```typescript
interface GamificationKPIs {
  engagement: {
    dailyActiveUsers: number
    weeklyActiveUsers: number
    averageSessionTime: number
    featureAdoptionRate: number
  }
  
  badges: {
    badgeEarnRate: number // badges per user per month
    badgeEngagementRate: number // users checking badge progress
    celebrationCompletionRate: number // users completing badge celebrations
  }
  
  challenges: {
    challengeParticipationRate: number
    challengeCompletionRate: number
    personalizedChallengeEffectiveness: number
  }
  
  social: {
    reviewSubmissionRate: number
    qualityReviewPercentage: number
    shareCardGenerationRate: number
    referralConversionRate: number
  }
  
  retention: {
    d1Retention: number // Day 1 retention
    d7Retention: number // Week 1 retention  
    d30Retention: number // Month 1 retention
    gamificationImpactOnRetention: number
  }
}
```

## 🚀 Implementation Roadmap

### Phase 1: Core System (Weeks 5-6)
```yaml
Week 5:
  - Badge engine with investment badges
  - Basic challenge system (weekly)
  - Points reward integration
  - Database schema implementation

Week 6:
  - Leaderboard calculation engine
  - Social badges (reviews, referrals)
  - Challenge completion validation
  - Admin badge management
```

### Phase 2: Advanced Features (Weeks 7-8)
```yaml
Week 7:
  - Learn & earn system (quiz, reviews)
  - Share card generation
  - Referral program implementation
  - Community activity feed

Week 8:
  - Personalized challenges
  - Advanced analytics
  - Performance optimization
  - Error handling & recovery
```

## References
- See `api/gamification-endpoints.md` for API specifications
- See `04-specifications/mobile-app/v1/gamification/` for UI requirements
- See `services/points-service.md` for points integration
- See `services/notification-service.md` for celebration notifications

---

**⚡ Implementation Priority:** HIGH (V1) - Core engagement driver
**🧪 Test Coverage Target:** 95% - User experience critical
**📈 Performance Target:** <200ms badge checks, <500ms leaderboard
**🎮 Engagement Goal:** +40% user retention, +25% monthly active users
