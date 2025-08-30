# Gamification Endpoints - Make the CHANGE

**🎮 tRPC Router:** `gamification` | **📍 Priority:** ⭐️⭐️ HIGH (V1) | **🗓️ Week:** 5-6

## Overview

Complete gamification system supporting badges, challenges, leaderboards, and learn & earn mechanics to drive user engagement and long-term retention.

## 🔄 tRPC Router Definition

```typescript
import { z } from 'zod'
import { publicProcedure, protectedProcedure, adminProcedure, router } from '../trpc'

export const gamificationRouter = router({
  badges: router({
    getUserBadges: protectedProcedure
      .input(getUserBadgesSchema)
      .output(getUserBadgesResponseSchema)
      .query(async ({ input, ctx }) => getUserBadges(input, ctx)),
      
    checkBadgeEligibility: protectedProcedure
      .input(checkBadgeEligibilitySchema)
      .output(checkBadgeEligibilityResponseSchema)
      .query(async ({ input, ctx }) => checkBadgeEligibility(input, ctx)),
      
    getBadgeProgress: protectedProcedure
      .input(getBadgeProgressSchema)
      .output(getBadgeProgressResponseSchema)
      .query(async ({ input, ctx }) => getBadgeProgress(input, ctx)),
  }),

  challenges: router({
    getActiveChallenges: protectedProcedure
      .input(getActiveChallengesSchema)
      .output(getActiveChallengesResponseSchema)
      .query(async ({ input, ctx }) => getActiveChallenges(input, ctx)),
      
    completeChallenge: protectedProcedure
      .input(completeChallengeSchema)
      .output(completeChallengeResponseSchema)
      .mutation(async ({ input, ctx }) => completeChallenge(input, ctx)),
      
    getChallengeProgress: protectedProcedure
      .input(getChallengeProgressSchema)
      .output(getChallengeProgressResponseSchema)
      .query(async ({ input, ctx }) => getChallengeProgress(input, ctx)),
  }),

  leaderboard: router({
    getImpactLeaderboard: publicProcedure
      .input(leaderboardSchema)
      .output(leaderboardResponseSchema)
      .query(async ({ input, ctx }) => getImpactLeaderboard(input, ctx)),
      
    getUserRanking: protectedProcedure
      .input(getUserRankingSchema)
      .output(getUserRankingResponseSchema)
      .query(async ({ input, ctx }) => getUserRanking(input, ctx)),
  }),

  rewards: router({
    earnPointsFromActivity: protectedProcedure
      .input(earnPointsSchema)
      .output(earnPointsResponseSchema)
      .mutation(async ({ input, ctx }) => earnPointsFromActivity(input, ctx)),
      
    getActivityRewards: protectedProcedure
      .input(getActivityRewardsSchema)
      .output(getActivityRewardsResponseSchema)
      .query(async ({ input, ctx }) => getActivityRewards(input, ctx)),
  }),

  // Admin endpoints
  admin: router({
    createChallenge: adminProcedure
      .input(createChallengeSchema)
      .output(createChallengeResponseSchema)
      .mutation(async ({ input, ctx }) => createChallenge(input, ctx)),
      
    updateChallenge: adminProcedure
      .input(updateChallengeSchema)
      .output(updateChallengeResponseSchema)
      .mutation(async ({ input, ctx }) => updateChallenge(input, ctx)),
      
    getBadgeAnalytics: adminProcedure
      .input(badgeAnalyticsSchema)
      .output(badgeAnalyticsResponseSchema)
      .query(async ({ input, ctx }) => getBadgeAnalytics(input, ctx)),
  }),
})
```

## 📋 Input/Output Schemas

### Badges Management
```typescript
export const getUserBadgesSchema = z.object({
  status: z.enum(['earned', 'in_progress', 'available', 'all']).default('earned'),
  category: z.enum(['investment', 'engagement', 'social', 'milestone', 'all']).default('all'),
})

export const getUserBadgesResponseSchema = z.object({
  badges: z.array(z.object({
    id: z.string().uuid(),
    name: z.string(),
    description: z.string(),
    category: z.enum(['investment', 'engagement', 'social', 'milestone']),
    icon: z.string(),
    rarity: z.enum(['common', 'rare', 'epic', 'legendary']),
    status: z.enum(['earned', 'in_progress', 'locked']),
    earnedAt: z.date().optional(),
    progress: z.object({
      current: z.number(),
      target: z.number(),
      percentage: z.number(),
    }).optional(),
    criteria: z.object({
      type: z.string(),
      threshold: z.number(),
      description: z.string(),
    }),
  })),
  totalEarned: z.number(),
  totalAvailable: z.number(),
  nextBadges: z.array(z.object({
    id: z.string().uuid(),
    name: z.string(),
    progress: z.object({
      current: z.number(),
      target: z.number(),
      percentage: z.number(),
    }),
  })),
})

export const checkBadgeEligibilitySchema = z.object({
  badgeId: z.string().uuid().optional(),
  category: z.enum(['investment', 'engagement', 'social', 'milestone']).optional(),
})

export const checkBadgeEligibilityResponseSchema = z.object({
  eligibleBadges: z.array(z.object({
    badgeId: z.string().uuid(),
    name: z.string(),
    pointsReward: z.number(),
    autoAward: z.boolean(),
  })),
  newlyEarned: z.array(z.object({
    badgeId: z.string().uuid(),
    name: z.string(),
    earnedAt: z.date(),
    celebrationConfig: z.object({
      showModal: z.boolean(),
      animationType: z.enum(['bounce', 'glow', 'confetti']),
      soundEffect: z.string().optional(),
    }),
  })),
})
```

### Challenges System
```typescript
export const getActiveChallengesSchema = z.object({
  type: z.enum(['weekly', 'monthly', 'seasonal', 'all']).default('all'),
  status: z.enum(['active', 'completed', 'expired', 'all']).default('active'),
})

export const getActiveChallengesResponseSchema = z.object({
  challenges: z.array(z.object({
    id: z.string().uuid(),
    title: z.string(),
    description: z.string(),
    type: z.enum(['weekly', 'monthly', 'seasonal']),
    category: z.enum(['discovery', 'engagement', 'community', 'spending']),
    difficulty: z.enum(['easy', 'medium', 'hard']),
    startDate: z.date(),
    endDate: z.date(),
    status: z.enum(['active', 'completed', 'expired']),
    progress: z.object({
      current: z.number(),
      target: z.number(),
      percentage: z.number(),
    }),
    rewards: z.object({
      points: z.number(),
      badge: z.string().optional(),
      title: z.string().optional(),
    }),
    requirements: z.array(z.object({
      type: z.string(),
      description: z.string(),
      completed: z.boolean(),
    })),
  })),
  weeklyReset: z.date(),
  monthlyReset: z.date(),
})

export const completeChallengeSchema = z.object({
  challengeId: z.string().uuid(),
  evidence: z.object({
    type: z.enum(['investment', 'review', 'share', 'check_in']),
    referenceId: z.string().uuid().optional(), // investment_id, review_id, etc.
    metadata: z.record(z.any()).optional(),
  }),
})

export const completeChallengeResponseSchema = z.object({
  success: z.boolean(),
  challenge: z.object({
    id: z.string().uuid(),
    title: z.string(),
    completedAt: z.date(),
    progress: z.object({
      current: z.number(),
      target: z.number(),
      completed: z.boolean(),
    }),
  }).optional(),
  rewards: z.object({
    pointsAwarded: z.number(),
    badgesEarned: z.array(z.string()),
    celebrationConfig: z.object({
      showCelebration: z.boolean(),
      message: z.string(),
      animationType: z.enum(['fireworks', 'confetti', 'glow']),
    }),
  }).optional(),
  error: z.object({
    code: z.enum([
      'CHALLENGE_NOT_FOUND',
      'CHALLENGE_EXPIRED',
      'CHALLENGE_ALREADY_COMPLETED',
      'INVALID_EVIDENCE',
      'REQUIREMENTS_NOT_MET',
    ]),
    message: z.string(),
  }).optional(),
})
```

### Impact Leaderboard
```typescript
export const leaderboardSchema = z.object({
  period: z.enum(['weekly', 'monthly', 'quarterly', 'all_time']).default('monthly'),
  category: z.enum(['overall', 'investment', 'engagement', 'community']).default('overall'),
  userLevel: z.enum(['explorateur', 'protecteur', 'ambassadeur', 'all']).default('all'),
  limit: z.number().min(10).max(100).default(50),
})

export const leaderboardResponseSchema = z.object({
  leaderboard: z.array(z.object({
    rank: z.number(),
    userId: z.string().uuid(),
    displayName: z.string(), // firstName + last initial pour privacy
    avatar: z.string().optional(),
    userLevel: z.enum(['explorateur', 'protecteur', 'ambassadeur']),
    impactScore: z.number(),
    impactBreakdown: z.object({
      investmentPoints: z.number(),
      subscriptionPoints: z.number(),
      engagementPoints: z.number(),
      communityPoints: z.number(),
    }),
    badges: z.array(z.object({
      id: z.string().uuid(),
      name: z.string(),
      icon: z.string(),
      rarity: z.enum(['common', 'rare', 'epic', 'legendary']),
    })),
    achievements: z.object({
      projectsSupported: z.number(),
      totalInvested: z.number(),
      reviewsWritten: z.number(),
      referralsConverted: z.number(),
    }),
  })),
  userPosition: z.object({
    rank: z.number(),
    percentile: z.number(),
    impactScore: z.number(),
    nextRankThreshold: z.number().optional(),
  }).optional(),
  periodInfo: z.object({
    startDate: z.date(),
    endDate: z.date(),
    totalParticipants: z.number(),
  }),
})
```

### Learn & Earn System
```typescript
export const earnPointsSchema = z.object({
  activityType: z.enum(['quiz_completion', 'quality_review', 'project_check_in', 'content_engagement']),
  activityId: z.string().uuid(),
  evidence: z.object({
    quizScore: z.number().min(0).max(100).optional(),
    reviewText: z.string().optional(),
    photoUploaded: z.boolean().optional(),
    engagementTime: z.number().optional(), // seconds
  }).optional(),
})

export const earnPointsResponseSchema = z.object({
  success: z.boolean(),
  pointsEarned: z.number(),
  activityType: z.string(),
  newBalance: z.number(),
  streakBonus: z.number().optional(),
  achievementUnlocked: z.object({
    type: z.enum(['badge', 'title', 'level_progress']),
    name: z.string(),
    description: z.string(),
    celebrationConfig: z.object({
      showModal: z.boolean(),
      animationType: z.string(),
    }),
  }).optional(),
  error: z.object({
    code: z.enum([
      'ACTIVITY_NOT_FOUND',
      'ALREADY_COMPLETED',
      'INSUFFICIENT_EVIDENCE',
      'DAILY_LIMIT_EXCEEDED',
      'QUIZ_SCORE_TOO_LOW',
    ]),
    message: z.string(),
  }).optional(),
})
```

## 🔧 Business Logic Implementation

### Badge Award System
```typescript
export async function checkBadgeEligibility(
  input: CheckBadgeEligibilityInput,
  ctx: Context
): Promise<CheckBadgeEligibilityResponse> {
  const userId = ctx.user.id
  
  // Get user's current achievements
  const userStats = await ctx.db.userAchievements.findUnique({
    where: { userId },
    include: {
      badges: true,
      investments: { where: { status: 'active' } },
      subscriptions: { where: { status: 'active' } },
      reviews: true,
    }
  })
  
  // Check all badge criteria
  const eligibleBadges = await Promise.all(
    BADGE_DEFINITIONS.map(async (badge) => {
      const isEligible = await checkBadgeCriteria(badge, userStats)
      const alreadyEarned = userStats.badges.some(b => b.badgeId === badge.id)
      
      if (isEligible && !alreadyEarned) {
        return {
          badgeId: badge.id,
          name: badge.name,
          pointsReward: badge.pointsReward,
          autoAward: badge.autoAward,
        }
      }
      return null
    })
  )
  
  // Auto-award eligible badges
  const newlyEarned = []
  for (const eligibleBadge of eligibleBadges.filter(Boolean)) {
    if (eligibleBadge.autoAward) {
      const awardedBadge = await awardBadge(userId, eligibleBadge.badgeId)
      newlyEarned.push(awardedBadge)
      
      // Generate points reward
      await ctx.db.pointsTransaction.create({
        data: {
          userId,
          type: 'earned',
          subtype: 'badge_reward',
          amount: eligibleBadge.pointsReward,
          description: `Badge earned: ${eligibleBadge.name}`,
          expiresAt: new Date(Date.now() + 18 * 30 * 24 * 60 * 60 * 1000), // 18 months
        }
      })
    }
  }
  
  return {
    eligibleBadges: eligibleBadges.filter(Boolean),
    newlyEarned,
  }
}
```

### Challenge Completion
```typescript
export async function completeChallenge(
  input: CompleteChallengeInput,
  ctx: Context
): Promise<CompleteChallengeResponse> {
  const challenge = await ctx.db.challenge.findUnique({
    where: { id: input.challengeId },
    include: { requirements: true }
  })
  
  if (!challenge) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Challenge not found',
    })
  }
  
  // Check if challenge is still active
  if (challenge.endDate < new Date()) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Challenge has expired',
    })
  }
  
  // Validate evidence based on challenge type
  const isValidEvidence = await validateChallengeEvidence(challenge, input.evidence)
  if (!isValidEvidence) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Invalid evidence provided',
    })
  }
  
  // Check if user already completed this challenge
  const existingProgress = await ctx.db.userChallengeProgress.findUnique({
    where: {
      userId_challengeId: {
        userId: ctx.user.id,
        challengeId: challenge.id,
      }
    }
  })
  
  if (existingProgress?.status === 'completed') {
    throw new TRPCError({
      code: 'CONFLICT',
      message: 'Challenge already completed',
    })
  }
  
  // Update progress and check completion
  const updatedProgress = await updateChallengeProgress(
    ctx.user.id,
    challenge.id,
    input.evidence
  )
  
  if (updatedProgress.completed) {
    // Award points and potential badges
    const pointsAwarded = challenge.rewards.points
    await ctx.db.pointsTransaction.create({
      data: {
        userId: ctx.user.id,
        type: 'earned',
        subtype: 'challenge_completion',
        amount: pointsAwarded,
        description: `Challenge completed: ${challenge.title}`,
        referenceId: challenge.id,
        expiresAt: new Date(Date.now() + 18 * 30 * 24 * 60 * 60 * 1000),
      }
    })
    
    // Check for badge rewards
    const badgesEarned = []
    if (challenge.rewards.badge) {
      const badge = await awardBadge(ctx.user.id, challenge.rewards.badge)
      badgesEarned.push(badge.name)
    }
    
    return {
      success: true,
      challenge: {
        id: challenge.id,
        title: challenge.title,
        completedAt: new Date(),
        progress: {
          current: updatedProgress.current,
          target: updatedProgress.target,
          completed: true,
        },
      },
      rewards: {
        pointsAwarded,
        badgesEarned,
        celebrationConfig: {
          showCelebration: true,
          message: `Défi "${challenge.title}" terminé ! +${pointsAwarded} points`,
          animationType: 'confetti',
        },
      },
    }
  }
  
  return {
    success: true,
    challenge: {
      id: challenge.id,
      title: challenge.title,
      completedAt: null,
      progress: {
        current: updatedProgress.current,
        target: updatedProgress.target,
        completed: false,
      },
    },
  }
}
```

### Impact Leaderboard Calculation
```typescript
export async function getImpactLeaderboard(
  input: LeaderboardInput,
  ctx: Context
): Promise<LeaderboardResponse> {
  const { period, category, userLevel, limit } = input
  
  // Calculate date range based on period
  const dateRange = calculatePeriodRange(period)
  
  // Build query based on filters
  let whereClause = {
    AND: [
      { createdAt: { gte: dateRange.start, lte: dateRange.end } },
      userLevel !== 'all' ? { user: { userLevel } } : {},
    ]
  }
  
  // Calculate impact scores based on category
  const leaderboardQuery = await ctx.db.$queryRaw`
    WITH user_impact_scores AS (
      SELECT 
        u.id as user_id,
        u.first_name,
        u.last_name,
        u.user_level,
        u.avatar_url,
        
        -- Investment impact points
        COALESCE(SUM(CASE 
          WHEN i.investment_type = 'ruche' THEN 100
          WHEN i.investment_type = 'olivier' THEN 150  
          WHEN i.investment_type = 'parcelle_familiale' THEN 300
          ELSE 0
        END), 0) as investment_impact,
        
        -- Subscription impact points (monthly contribution)
        COALESCE(SUM(CASE 
          WHEN s.subscription_tier = 'ambassadeur_standard' AND s.billing_frequency = 'monthly' THEN 20
          WHEN s.subscription_tier = 'ambassadeur_premium' AND s.billing_frequency = 'monthly' THEN 35
          WHEN s.subscription_tier = 'ambassadeur_standard' AND s.billing_frequency = 'annual' THEN 252
          WHEN s.subscription_tier = 'ambassadeur_premium' AND s.billing_frequency = 'annual' THEN 480
          ELSE 0
        END), 0) as subscription_impact,
        
        -- Engagement impact points
        COALESCE(COUNT(r.id) * 10, 0) as engagement_impact,
        
        -- Community impact points  
        COALESCE(COUNT(ref.id) * 50, 0) as community_impact
        
      FROM users u
      LEFT JOIN investments i ON u.id = i.user_id AND i.status = 'active' 
        AND i.created_at BETWEEN ${dateRange.start} AND ${dateRange.end}
      LEFT JOIN subscriptions s ON u.id = s.user_id AND s.status = 'active'
        AND s.created_at BETWEEN ${dateRange.start} AND ${dateRange.end}  
      LEFT JOIN product_reviews r ON u.id = r.user_id
        AND r.created_at BETWEEN ${dateRange.start} AND ${dateRange.end}
      LEFT JOIN referrals ref ON u.id = ref.referrer_id AND ref.status = 'converted'
        AND ref.created_at BETWEEN ${dateRange.start} AND ${dateRange.end}
      WHERE u.user_level != 'admin'
      GROUP BY u.id, u.first_name, u.last_name, u.user_level, u.avatar_url
    )
    SELECT 
      *,
      (investment_impact + subscription_impact + engagement_impact + community_impact) as total_impact,
      ROW_NUMBER() OVER (ORDER BY (investment_impact + subscription_impact + engagement_impact + community_impact) DESC) as rank
    FROM user_impact_scores
    WHERE (investment_impact + subscription_impact + engagement_impact + community_impact) > 0
    ORDER BY total_impact DESC
    LIMIT ${limit}
  `
  
  // Get user's position if authenticated
  let userPosition = null
  if (ctx.user) {
    const userRank = await getUserLeaderboardPosition(ctx.user.id, period, category)
    userPosition = userRank
  }
  
  return {
    leaderboard: leaderboardQuery.map(row => ({
      rank: row.rank,
      userId: row.user_id,
      displayName: `${row.first_name} ${row.last_name[0]}.`, // Privacy
      avatar: row.avatar_url,
      userLevel: row.user_level,
      impactScore: row.total_impact,
      impactBreakdown: {
        investmentPoints: row.investment_impact,
        subscriptionPoints: row.subscription_impact,
        engagementPoints: row.engagement_impact,
        communityPoints: row.community_impact,
      },
      badges: [], // To be populated from user_badges table
      achievements: {
        projectsSupported: 0, // To be calculated
        totalInvested: 0,
        reviewsWritten: 0,
        referralsConverted: 0,
      },
    })),
    userPosition,
    periodInfo: {
      startDate: dateRange.start,
      endDate: dateRange.end,
      totalParticipants: leaderboardQuery.length,
    },
  }
}
```

## 🎯 Badge Definitions

### Investment Badges
```typescript
const INVESTMENT_BADGES = [
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
] as const
```

### Engagement Badges
```typescript
const ENGAGEMENT_BADGES = [
  {
    id: 'reviewer',
    name: 'Critique Constructif',
    description: 'Écrire 10 avis de qualité',
    category: 'engagement',
    icon: 'star',
    rarity: 'common',
    criteria: { type: 'quality_reviews', threshold: 10 },
    pointsReward: 100,
    autoAward: true,
  },
  {
    id: 'educator',
    name: 'Éducateur Vert',
    description: 'Réussir 20 quiz éducatifs',
    category: 'engagement',
    icon: 'graduation-cap',
    rarity: 'rare',
    criteria: { type: 'quiz_completions', threshold: 20 },
    pointsReward: 150,
    autoAward: true,
  },
] as const
```

## 🚨 Error Handling

### Gamification Error Codes
```typescript
export const GAMIFICATION_ERROR_CODES = {
  // Badge errors
  BADGE_NOT_FOUND: 'Badge not found',
  BADGE_ALREADY_EARNED: 'Badge already earned by user',
  BADGE_CRITERIA_NOT_MET: 'Badge criteria not met',
  
  // Challenge errors
  CHALLENGE_NOT_FOUND: 'Challenge not found',
  CHALLENGE_EXPIRED: 'Challenge has expired',
  CHALLENGE_ALREADY_COMPLETED: 'Challenge already completed',
  INVALID_EVIDENCE: 'Invalid evidence provided',
  REQUIREMENTS_NOT_MET: 'Challenge requirements not met',
  
  // Activity errors
  ACTIVITY_NOT_FOUND: 'Activity not found',
  ALREADY_COMPLETED: 'Activity already completed today',
  INSUFFICIENT_EVIDENCE: 'Insufficient evidence for activity',
  DAILY_LIMIT_EXCEEDED: 'Daily activity limit exceeded',
  QUIZ_SCORE_TOO_LOW: 'Quiz score below minimum threshold (80%)',
  
  // Leaderboard errors
  LEADERBOARD_UNAVAILABLE: 'Leaderboard temporarily unavailable',
  INVALID_PERIOD: 'Invalid leaderboard period',
} as const
```

## 📊 Analytics & Monitoring

### Gamification Metrics
```typescript
interface GamificationMetrics {
  badges: {
    totalBadgesEarned: number
    badgeEarnRate: number // badges per user per month
    topBadgesByCategory: BadgePopularity[]
    averageTimeToEarn: Record<string, number> // badge_id -> days
  }
  
  challenges: {
    activeChallenges: number
    completionRate: number
    averageCompletionTime: number
    topChallengeCategories: ChallengePopularity[]
  }
  
  leaderboard: {
    activeParticipants: number
    averageImpactScore: number
    impactScoreDistribution: ScoreDistribution
    engagementByLevel: Record<UserLevel, EngagementMetrics>
  }
  
  learningRewards: {
    quizCompletions: number
    averageQuizScore: number
    qualityReviewsCount: number
    totalPointsFromLearning: number
  }
}
```

## ✅ Testing Strategy

### Unit Tests
```typescript
describe('Gamification Endpoints', () => {
  describe('badges', () => {
    it('should award badge when criteria met', async () => {
      // Create user with qualifying investments
      const user = await createTestUser()
      await createTestInvestments(user.id, 5, 'ruche')
      
      const result = await gamificationRouter.badges.checkBadgeEligibility({
        input: { category: 'investment' },
        ctx: createMockContext(user)
      })
      
      expect(result.newlyEarned).toHaveLength(1)
      expect(result.newlyEarned[0].name).toBe('Protecteur des Abeilles')
    })
  })
  
  describe('challenges', () => {
    it('should complete challenge with valid evidence', async () => {
      const challenge = await createTestChallenge({
        type: 'discovery',
        requirements: [{ type: 'invest_in_category', target: 2 }]
      })
      
      const result = await gamificationRouter.challenges.completeChallenge({
        input: {
          challengeId: challenge.id,
          evidence: { type: 'investment', referenceId: 'inv_123' }
        },
        ctx: mockContext
      })
      
      expect(result.success).toBe(true)
      expect(result.rewards?.pointsAwarded).toBeGreaterThan(0)
    })
  })
})
```

## 📊 Database Schema Requirements

### Required Tables
```sql
-- Badges definitions and user progress
CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    description TEXT,
    category VARCHAR(20) NOT NULL, -- investment, engagement, social, milestone
    icon VARCHAR(50),
    rarity VARCHAR(20) DEFAULT 'common', -- common, rare, epic, legendary
    criteria JSONB NOT NULL, -- {type, threshold, description}
    points_reward INTEGER DEFAULT 0,
    auto_award BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES badges(id),
    earned_at TIMESTAMP DEFAULT NOW(),
    progress JSONB DEFAULT '{}', -- current progress towards badge
    UNIQUE(user_id, badge_id)
);

-- Challenges system
CREATE TABLE challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL, -- weekly, monthly, seasonal
    category VARCHAR(20) NOT NULL, -- discovery, engagement, community, spending
    difficulty VARCHAR(10) DEFAULT 'medium', -- easy, medium, hard
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    requirements JSONB NOT NULL, -- array of requirements
    rewards JSONB NOT NULL, -- {points, badge?, title?}
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_challenge_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'in_progress', -- in_progress, completed, expired
    progress JSONB DEFAULT '{}', -- current progress data
    completed_at TIMESTAMP,
    evidence JSONB DEFAULT '{}', -- evidence provided for completion
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, challenge_id)
);

-- Learn & Earn activities
CREATE TABLE learning_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(30) NOT NULL, -- quiz, article, video, project_update
    title VARCHAR NOT NULL,
    content_url TEXT,
    questions JSONB DEFAULT '{}', -- quiz questions if applicable
    points_reward INTEGER DEFAULT 5,
    daily_limit INTEGER DEFAULT 3,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_activity_completions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    activity_id UUID REFERENCES learning_activities(id),
    completion_date DATE DEFAULT CURRENT_DATE,
    score INTEGER, -- quiz score if applicable
    evidence JSONB DEFAULT '{}', -- proof of completion
    points_earned INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, activity_id, completion_date) -- Prevent multiple same-day completions
);
```

## 🔗 Dependencies

### External Services
- **None required** - Pure backend logic with existing infrastructure

### Internal Dependencies
- Points service for reward distribution
- User service for level progression tracking
- Analytics service for metrics calculation
- Notification service for achievement celebrations

## Outputs

### Badges
- `getUserBadges` → `UserBadgesDTO`
- `checkBadgeEligibility` → `BadgeEligibilityDTO`
- `getBadgeProgress` → `BadgeProgressDTO`

### Challenges
- `getActiveChallenges` → `ActiveChallengesDTO`
- `completeChallenge` → `ChallengeCompletionDTO`
- `getChallengeProgress` → `ChallengeProgressDTO`

### Leaderboard
- `getImpactLeaderboard` → `LeaderboardDTO`
- `getUserRanking` → `UserRankingDTO`

### Learn & Earn
- `earnPointsFromActivity` → `ActivityRewardDTO`
- `getActivityRewards` → `ActivityRewardsDTO`

See DTOs in `schemas/response-models.md`.

## References
- See `services/gamification-service.md` for business logic implementation
- See `04-specifications/mobile-app/v1/gamification/` for UI specifications

---

**⚡ Implementation Priority:** HIGH (V1) - Core engagement system
**🧪 Test Coverage Target:** 90% - User engagement critical
**📈 Performance Target:** <300ms P95 response time
**🎮 Engagement Goal:** +40% user retention through gamification
