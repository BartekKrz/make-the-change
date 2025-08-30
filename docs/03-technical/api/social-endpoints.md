# Social Endpoints - Make the CHANGE

**🤝 tRPC Router:** `social` | **📍 Priority:** ⭐️⭐️ HIGH (V1) | **🗓️ Week:** 7-8

## Overview

Complete social features system supporting product reviews, impact sharing, referral program, and community engagement to drive viral growth and user retention.

## 🔄 tRPC Router Definition

```typescript
import { z } from 'zod'
import { publicProcedure, protectedProcedure, adminProcedure, router } from '../trpc'

export const socialRouter = router({
  reviews: router({
    createReview: protectedProcedure
      .input(createReviewSchema)
      .output(createReviewResponseSchema)
      .mutation(async ({ input, ctx }) => createProductReview(input, ctx)),
      
    getProductReviews: publicProcedure
      .input(getProductReviewsSchema)
      .output(getProductReviewsResponseSchema)
      .query(async ({ input, ctx }) => getProductReviews(input, ctx)),
      
    getUserReviews: protectedProcedure
      .input(getUserReviewsSchema)
      .output(getUserReviewsResponseSchema)
      .query(async ({ input, ctx }) => getUserReviews(input, ctx)),
      
    updateReview: protectedProcedure
      .input(updateReviewSchema)
      .output(updateReviewResponseSchema)
      .mutation(async ({ input, ctx }) => updateProductReview(input, ctx)),
      
    deleteReview: protectedProcedure
      .input(deleteReviewSchema)
      .output(deleteReviewResponseSchema)
      .mutation(async ({ input, ctx }) => deleteProductReview(input, ctx)),
  }),

  sharing: router({
    generateShareCard: protectedProcedure
      .input(generateShareCardSchema)
      .output(generateShareCardResponseSchema)
      .mutation(async ({ input, ctx }) => generateShareCard(input, ctx)),
      
    trackShare: protectedProcedure
      .input(trackShareSchema)
      .output(trackShareResponseSchema)
      .mutation(async ({ input, ctx }) => trackShare(input, ctx)),
      
    getShareHistory: protectedProcedure
      .input(getShareHistorySchema)
      .output(getShareHistoryResponseSchema)
      .query(async ({ input, ctx }) => getUserShareHistory(input, ctx)),
      
    generateImpactReport: protectedProcedure
      .input(generateImpactReportSchema)
      .output(generateImpactReportResponseSchema)
      .mutation(async ({ input, ctx }) => generateImpactReport(input, ctx)),
  }),

  referrals: router({
    getReferralCode: protectedProcedure
      .input(getReferralCodeSchema)
      .output(getReferralCodeResponseSchema)
      .query(async ({ input, ctx }) => getUserReferralCode(input, ctx)),
      
    trackReferral: publicProcedure
      .input(trackReferralSchema)
      .output(trackReferralResponseSchema)
      .mutation(async ({ input, ctx }) => trackReferral(input, ctx)),
      
    getReferralStats: protectedProcedure
      .input(getReferralStatsSchema)
      .output(getReferralStatsResponseSchema)
      .query(async ({ input, ctx }) => getUserReferralStats(input, ctx)),
      
    processReferralReward: protectedProcedure
      .input(processReferralRewardSchema)
      .output(processReferralRewardResponseSchema)
      .mutation(async ({ input, ctx }) => processReferralReward(input, ctx)),
  }),

  community: router({
    getActivityFeed: protectedProcedure
      .input(getActivityFeedSchema)
      .output(getActivityFeedResponseSchema)
      .query(async ({ input, ctx }) => getCommunityActivityFeed(input, ctx)),
      
    likeActivity: protectedProcedure
      .input(likeActivitySchema)
      .output(likeActivityResponseSchema)
      .mutation(async ({ input, ctx }) => likeActivity(input, ctx)),
      
    reportContent: protectedProcedure
      .input(reportContentSchema)
      .output(reportContentResponseSchema)
      .mutation(async ({ input, ctx }) => reportContent(input, ctx)),
  }),

  // Admin moderation endpoints
  admin: router({
    moderateReview: adminProcedure
      .input(moderateReviewSchema)
      .output(moderateReviewResponseSchema)
      .mutation(async ({ input, ctx }) => moderateReview(input, ctx)),
      
    getModerationQueue: adminProcedure
      .input(getModerationQueueSchema)
      .output(getModerationQueueResponseSchema)
      .query(async ({ input, ctx }) => getModerationQueue(input, ctx)),
      
    bulkModerateContent: adminProcedure
      .input(bulkModerateSchema)
      .output(bulkModerateResponseSchema)
      .mutation(async ({ input, ctx }) => bulkModerateContent(input, ctx)),
  }),
})
```

## 📋 Input/Output Schemas

### Product Reviews System
```typescript
export const createReviewSchema = z.object({
  productId: z.string().uuid(),
  orderId: z.string().uuid(), // Must have purchased product
  rating: z.number().min(1).max(5),
  title: z.string().min(5).max(100),
  content: z.string().min(10).max(1000),
  photos: z.array(z.string().url()).max(5).default([]),
  isQualityReview: z.boolean().default(false), // +15 points vs +5 points
  tags: z.array(z.string()).max(10).default([]),
  wouldRecommend: z.boolean(),
})

export const createReviewResponseSchema = z.object({
  success: z.boolean(),
  review: z.object({
    id: z.string().uuid(),
    rating: z.number(),
    title: z.string(),
    content: z.string(),
    photos: z.array(z.string()),
    isQualityReview: z.boolean(),
    status: z.enum(['pending', 'approved', 'rejected']),
    createdAt: z.date(),
  }).optional(),
  pointsEarned: z.number(),
  badgeProgress: z.object({
    badgeName: z.string(),
    progress: z.number(),
    target: z.number(),
    completed: z.boolean(),
  }).optional(),
  error: z.object({
    code: z.enum([
      'PRODUCT_NOT_FOUND',
      'ORDER_NOT_FOUND', 
      'REVIEW_ALREADY_EXISTS',
      'INVALID_RATING',
      'CONTENT_TOO_SHORT',
      'DAILY_REVIEW_LIMIT_EXCEEDED',
      'MODERATION_REQUIRED',
    ]),
    message: z.string(),
  }).optional(),
})

export const getProductReviewsSchema = z.object({
  productId: z.string().uuid(),
  rating: z.number().min(1).max(5).optional(),
  sortBy: z.enum(['newest', 'oldest', 'rating_high', 'rating_low', 'helpful']).default('helpful'),
  pagination: z.object({
    page: z.number().min(1).default(1),
    limit: z.number().min(5).max(50).default(20),
  }),
  includePhotos: z.boolean().default(true),
})

export const getProductReviewsResponseSchema = z.object({
  reviews: z.array(z.object({
    id: z.string().uuid(),
    author: z.object({
      firstName: z.string(),
      lastInitial: z.string(), // Privacy protection
      userLevel: z.enum(['explorateur', 'protecteur', 'ambassadeur']),
      avatar: z.string().optional(),
      badgeCount: z.number(),
    }),
    rating: z.number(),
    title: z.string(),
    content: z.string(),
    photos: z.array(z.string()),
    isQualityReview: z.boolean(),
    tags: z.array(z.string()),
    wouldRecommend: z.boolean(),
    helpfulVotes: z.number(),
    createdAt: z.date(),
    verified: z.boolean(), // Verified purchase
  })),
  summary: z.object({
    averageRating: z.number(),
    totalReviews: z.number(),
    ratingDistribution: z.record(z.number()), // {1: 2, 2: 1, 3: 5, 4: 15, 5: 20}
    qualityReviewsCount: z.number(),
    verifiedPurchases: z.number(),
  }),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    hasMore: z.boolean(),
  }),
})
```

### Impact Sharing System
```typescript
export const generateShareCardSchema = z.object({
  type: z.enum(['impact_report', 'badge_earned', 'project_support', 'milestone_reached']),
  context: z.object({
    badgeId: z.string().uuid().optional(),
    projectId: z.string().uuid().optional(),
    investmentId: z.string().uuid().optional(),
    period: z.enum(['monthly', 'quarterly', 'annual']).optional(),
  }),
  customization: z.object({
    includeReferralCode: z.boolean().default(true),
    template: z.enum(['minimal', 'detailed', 'story']).default('detailed'),
    platform: z.enum(['instagram', 'linkedin', 'facebook', 'twitter', 'whatsapp']).optional(),
  }),
})

export const generateShareCardResponseSchema = z.object({
  success: z.boolean(),
  shareCard: z.object({
    id: z.string().uuid(),
    type: z.string(),
    imageUrl: z.string().url(),
    shareText: z.string(),
    shareUrl: z.string().url(),
    referralCode: z.string().optional(),
    expiresAt: z.date(), // 24h expiry for generated images
    metadata: z.object({
      impactData: z.record(z.any()).optional(),
      template: z.string(),
      platform: z.string().optional(),
    }),
  }).optional(),
  error: z.object({
    code: z.enum([
      'INVALID_CONTEXT',
      'INSUFFICIENT_DATA',
      'TEMPLATE_ERROR',
      'IMAGE_GENERATION_FAILED',
      'DAILY_GENERATION_LIMIT_EXCEEDED',
    ]),
    message: z.string(),
  }).optional(),
})

export const trackShareSchema = z.object({
  shareCardId: z.string().uuid(),
  platform: z.enum(['instagram', 'linkedin', 'facebook', 'twitter', 'whatsapp', 'email', 'sms', 'other']),
  shareMethod: z.enum(['native_share', 'copy_link', 'direct_post']),
  metadata: z.record(z.any()).optional(),
})

export const trackShareResponseSchema = z.object({
  success: z.boolean(),
  pointsEarned: z.number(), // +5 points per share (max 1/week)
  shareTracking: z.object({
    id: z.string().uuid(),
    platform: z.string(),
    sharedAt: z.date(),
    trackingUrl: z.string().url(), // For conversion tracking
  }),
  weeklySharesRemaining: z.number(),
})
```

### Referral Program
```typescript
export const getReferralCodeSchema = z.object({
  regenerate: z.boolean().default(false),
})

export const getReferralCodeResponseSchema = z.object({
  referralCode: z.string(),
  referralUrl: z.string().url(),
  stats: z.object({
    totalInvitesSent: z.number(),
    pendingSignups: z.number(),
    convertedReferrals: z.number(),
    totalPointsEarned: z.number(),
    conversionRate: z.number(),
  }),
  recentActivity: z.array(z.object({
    type: z.enum(['invite_sent', 'signup', 'first_investment']),
    referredUser: z.object({
      firstName: z.string(),
      lastInitial: z.string(),
    }).optional(),
    date: z.date(),
    pointsEarned: z.number().optional(),
  })),
})

export const trackReferralSchema = z.object({
  referralCode: z.string(),
  action: z.enum(['visit', 'signup', 'first_investment']),
  userAgent: z.string().optional(),
  ipAddress: z.string().optional(),
  metadata: z.record(z.any()).optional(),
})

export const trackReferralResponseSchema = z.object({
  success: z.boolean(),
  referralTracking: z.object({
    id: z.string().uuid(),
    referralCode: z.string(),
    action: z.string(),
    trackedAt: z.date(),
    conversionStage: z.enum(['visit', 'signup', 'converted']),
  }),
  rewards: z.object({
    referrerPointsEarned: z.number(),
    refereeBonus: z.number(), // +10% bonus on first investment
    planetAction: z.object({
      type: z.string(), // "tree_planted"
      description: z.string(),
      location: z.string(),
    }).optional(),
  }).optional(),
})

export const processReferralRewardSchema = z.object({
  referralId: z.string().uuid(),
  conversionType: z.enum(['first_investment', 'subscription']),
  conversionAmount: z.number(),
  refereeUserId: z.string().uuid(),
})

export const processReferralRewardResponseSchema = z.object({
  success: z.boolean(),
  referrerReward: z.object({
    pointsAwarded: z.number(), // 100 points for conversion
    badgeProgress: z.object({
      badgeName: z.string(),
      progress: z.number(),
      completed: z.boolean(),
    }).optional(),
  }),
  refereeReward: z.object({
    bonusPercentage: z.number(), // 10%
    bonusPoints: z.number(),
    welcomeMessage: z.string(),
  }),
  planetAction: z.object({
    type: z.string(),
    description: z.string(),
    certificateUrl: z.string().url().optional(),
  }),
})
```

## 🔧 Business Logic Implementation

### Product Review Creation with Quality Detection
```typescript
export async function createProductReview(
  input: CreateReviewInput,
  ctx: Context
): Promise<CreateReviewResponse> {
  // Verify user purchased the product
  const order = await ctx.db.order.findFirst({
    where: {
      id: input.orderId,
      userId: ctx.user.id,
      status: 'delivered',
      items: {
        some: { productId: input.productId }
      }
    }
  })
  
  if (!order) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Order not found or product not purchased',
    })
  }
  
  // Check for existing review
  const existingReview = await ctx.db.productReview.findFirst({
    where: {
      userId: ctx.user.id,
      productId: input.productId,
    }
  })
  
  if (existingReview) {
    throw new TRPCError({
      code: 'CONFLICT',
      message: 'Review already exists for this product',
    })
  }
  
  // Determine if this is a quality review
  const isQualityReview = input.content.length >= 50 && input.photos.length > 0
  const pointsReward = isQualityReview ? 15 : 5
  
  // Create review
  const review = await ctx.db.productReview.create({
    data: {
      userId: ctx.user.id,
      productId: input.productId,
      orderId: input.orderId,
      rating: input.rating,
      title: input.title,
      content: input.content,
      photos: input.photos,
      isQualityReview,
      tags: input.tags,
      wouldRecommend: input.wouldRecommend,
      status: 'approved', // Auto-approve for MVP, add moderation later
    }
  })
  
  // Award points for review
  await ctx.db.pointsTransaction.create({
    data: {
      userId: ctx.user.id,
      type: 'earned',
      subtype: 'quality_review',
      amount: pointsReward,
      description: `Review written: ${input.title}`,
      referenceId: review.id,
      expiresAt: new Date(Date.now() + 18 * 30 * 24 * 60 * 60 * 1000), // 18 months
    }
  })
  
  // Check badge progress (Reviewer badges)
  const badgeProgress = await checkReviewerBadgeProgress(ctx.user.id)
  
  // Track analytics
  await ctx.analytics.track('review_created', {
    userId: ctx.user.id,
    productId: input.productId,
    rating: input.rating,
    isQualityReview,
    pointsEarned: pointsReward,
  })
  
  return {
    success: true,
    review: {
      id: review.id,
      rating: review.rating,
      title: review.title,
      content: review.content,
      photos: review.photos,
      isQualityReview,
      status: review.status,
      createdAt: review.createdAt,
    },
    pointsEarned: pointsReward,
    badgeProgress,
  }
}
```

### Impact Share Card Generation
```typescript
export async function generateShareCard(
  input: GenerateShareCardInput,
  ctx: Context
): Promise<GenerateShareCardResponse> {
  const userId = ctx.user.id
  
  // Get user's impact data based on share type
  let impactData = {}
  let shareText = ''
  
  switch (input.type) {
    case 'impact_report':
      impactData = await calculateUserImpactReport(userId, input.context.period)
      shareText = generateImpactReportText(impactData, ctx.user.firstName)
      break
      
    case 'badge_earned':
      const badge = await ctx.db.badge.findUnique({
        where: { id: input.context.badgeId }
      })
      shareText = `🏆 Je viens de débloquer le badge "${badge.name}" sur Make the CHANGE ! Rejoignez-moi pour protéger la biodiversité.`
      break
      
    case 'project_support':
      const project = await ctx.db.project.findUnique({
        where: { id: input.context.projectId },
        include: { producer: true }
      })
      shareText = `🌱 Je viens de soutenir le projet "${project.name}" de ${project.producer.name} ! Ensemble, protégeons la biodiversité.`
      break
  }
  
  // Generate visual share card
  const shareCard = await generateVisualShareCard({
    type: input.type,
    impactData,
    shareText,
    userInfo: {
      firstName: ctx.user.firstName,
      userLevel: ctx.user.userLevel,
    },
    template: input.customization.template,
    platform: input.customization.platform,
  })
  
  // Store share card for tracking
  const shareCardRecord = await ctx.db.shareCard.create({
    data: {
      userId,
      type: input.type,
      imageUrl: shareCard.imageUrl,
      shareText,
      shareUrl: shareCard.shareUrl,
      referralCode: input.customization.includeReferralCode ? ctx.user.referralCode : null,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h expiry
      metadata: {
        impactData,
        template: input.customization.template,
        platform: input.customization.platform,
      },
    }
  })
  
  return {
    success: true,
    shareCard: {
      id: shareCardRecord.id,
      type: input.type,
      imageUrl: shareCard.imageUrl,
      shareText,
      shareUrl: shareCard.shareUrl,
      referralCode: shareCardRecord.referralCode,
      expiresAt: shareCardRecord.expiresAt,
      metadata: shareCardRecord.metadata,
    },
  }
}
```

### Referral Conversion Processing
```typescript
export async function processReferralReward(
  input: ProcessReferralRewardInput,
  ctx: Context
): Promise<ProcessReferralRewardResponse> {
  const referral = await ctx.db.referral.findUnique({
    where: { id: input.referralId },
    include: { referrer: true, referee: true }
  })
  
  if (!referral) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Referral not found',
    })
  }
  
  // Calculate rewards
  const referrerPoints = 100 // Fixed reward for conversion
  const refereeBonus = Math.round(input.conversionAmount * 0.1) // 10% bonus
  
  // Award points to referrer
  await ctx.db.pointsTransaction.create({
    data: {
      userId: referral.referrerId,
      type: 'earned',
      subtype: 'referral_reward',
      amount: referrerPoints,
      description: `Parrainage réussi: ${referral.referee.firstName}`,
      referenceId: referral.id,
      expiresAt: new Date(Date.now() + 18 * 30 * 24 * 60 * 60 * 1000),
    }
  })
  
  // Award bonus to referee
  await ctx.db.pointsTransaction.create({
    data: {
      userId: referral.refereeId,
      type: 'earned',
      subtype: 'referral_bonus',
      amount: refereeBonus,
      description: `Bonus de bienvenue: ${refereeBonus} points`,
      referenceId: referral.id,
      expiresAt: new Date(Date.now() + 18 * 30 * 24 * 60 * 60 * 1000),
    }
  })
  
  // Trigger planet action (symbolic tree planting)
  const planetAction = await triggerPlanetAction(referral.id)
  
  // Update referral status
  await ctx.db.referral.update({
    where: { id: referral.id },
    data: { 
      status: 'converted',
      convertedAt: new Date(),
      conversionAmount: input.conversionAmount,
    }
  })
  
  // Check referrer badge progress
  const badgeProgress = await checkReferralBadgeProgress(referral.referrerId)
  
  return {
    success: true,
    referrerReward: {
      pointsAwarded: referrerPoints,
      badgeProgress,
    },
    refereeReward: {
      bonusPercentage: 10,
      bonusPoints: refereeBonus,
      welcomeMessage: `Bienvenue ! Votre parrain vous a offert ${refereeBonus} points bonus.`,
    },
    planetAction: {
      type: 'tree_planted',
      description: `Un arbre planté à Madagascar grâce à votre parrainage !`,
      certificateUrl: planetAction.certificateUrl,
    },
  }
}
```

## 🎯 Badge Definitions

### Social Engagement Badges
```typescript
const SOCIAL_BADGES = [
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
  },
  {
    id: 'viral_ambassador',
    name: 'Ambassadeur Viral',
    description: 'Générer 25 partages d\'impact',
    category: 'social',
    icon: 'share',
    rarity: 'legendary',
    criteria: { type: 'shares_generated', threshold: 25 },
    pointsReward: 1000,
    autoAward: true,
  },
] as const
```

## 🚨 Error Handling

### Social Error Codes
```typescript
export const SOCIAL_ERROR_CODES = {
  // Review errors
  PRODUCT_NOT_FOUND: 'Product not found',
  ORDER_NOT_FOUND: 'Order not found or not eligible for review',
  REVIEW_ALREADY_EXISTS: 'Review already exists for this product',
  INVALID_RATING: 'Rating must be between 1 and 5',
  CONTENT_TOO_SHORT: 'Review content must be at least 10 characters',
  DAILY_REVIEW_LIMIT_EXCEEDED: 'Daily review limit exceeded (5 reviews max)',
  MODERATION_REQUIRED: 'Review submitted for moderation',
  
  // Sharing errors
  INVALID_CONTEXT: 'Invalid context for share card generation',
  INSUFFICIENT_DATA: 'Insufficient data to generate impact report',
  TEMPLATE_ERROR: 'Error processing share card template',
  IMAGE_GENERATION_FAILED: 'Failed to generate share card image',
  DAILY_GENERATION_LIMIT_EXCEEDED: 'Daily share card generation limit exceeded',
  
  // Referral errors
  INVALID_REFERRAL_CODE: 'Invalid or expired referral code',
  SELF_REFERRAL_BLOCKED: 'Cannot use your own referral code',
  REFERRAL_ALREADY_USED: 'Referral code already used by this user',
  CONVERSION_ALREADY_PROCESSED: 'Referral conversion already processed',
  
  // Community errors
  CONTENT_NOT_FOUND: 'Content not found',
  ALREADY_LIKED: 'Content already liked by user',
  REPORT_DUPLICATE: 'Content already reported by user',
  INSUFFICIENT_PERMISSIONS: 'Insufficient permissions for this action',
} as const
```

## 📊 Database Schema Requirements

### Required Tables
```sql
-- Product reviews with quality detection
CREATE TABLE product_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    photos TEXT[] DEFAULT '{}',
    is_quality_review BOOLEAN DEFAULT FALSE,
    tags TEXT[] DEFAULT '{}',
    would_recommend BOOLEAN NOT NULL,
    helpful_votes INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'approved', -- pending, approved, rejected
    moderated_by UUID REFERENCES users(id),
    moderated_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, product_id) -- One review per user per product
);

-- Share cards for impact sharing
CREATE TABLE share_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(30) NOT NULL, -- impact_report, badge_earned, project_support
    image_url TEXT NOT NULL,
    share_text TEXT NOT NULL,
    share_url TEXT NOT NULL,
    referral_code VARCHAR(20),
    expires_at TIMESTAMP NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Share tracking for analytics
CREATE TABLE share_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    share_card_id UUID REFERENCES share_cards(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    platform VARCHAR(20) NOT NULL, -- instagram, linkedin, etc.
    share_method VARCHAR(20) NOT NULL, -- native_share, copy_link, direct_post
    shared_at TIMESTAMP DEFAULT NOW(),
    tracking_url TEXT,
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}'
);

-- Referral system
CREATE TABLE referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    referee_id UUID REFERENCES users(id) ON DELETE CASCADE,
    referral_code VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- pending, signup, converted
    conversion_type VARCHAR(20), -- first_investment, subscription
    conversion_amount INTEGER,
    converted_at TIMESTAMP,
    points_awarded INTEGER DEFAULT 0,
    planet_action_triggered BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(referee_id) -- One referral per referee
);

-- User referral codes
CREATE TABLE user_referral_codes (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    referral_code VARCHAR(20) UNIQUE NOT NULL,
    total_uses INTEGER DEFAULT 0,
    total_conversions INTEGER DEFAULT 0,
    total_points_earned INTEGER DEFAULT 0,
    last_used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Community activity feed
CREATE TABLE community_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    activity_type VARCHAR(30) NOT NULL, -- investment, review, badge_earned, level_up
    title VARCHAR(255) NOT NULL,
    description TEXT,
    reference_id UUID, -- investment_id, review_id, badge_id, etc.
    privacy_level VARCHAR(20) DEFAULT 'public', -- public, friends, private
    likes_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Activity likes
CREATE TABLE activity_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_id UUID REFERENCES community_activities(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(activity_id, user_id)
);
```

## 📊 Analytics & Monitoring

### Social Engagement Metrics
```typescript
interface SocialMetrics {
  reviews: {
    totalReviews: number
    qualityReviewsPercentage: number
    averageRating: number
    reviewsPerUser: number
    photosPerReview: number
  }
  
  sharing: {
    shareCardsGenerated: number
    sharesByPlatform: Record<string, number>
    shareToConversionRate: number
    viralCoefficient: number
  }
  
  referrals: {
    totalReferrals: number
    conversionRate: number
    averageTimeToConversion: number // days
    topReferrers: ReferrerStats[]
    planetActionsTriggered: number
  }
  
  community: {
    activeUsers: number
    activitiesPosted: number
    engagementRate: number // likes per activity
    contentModerationRate: number
  }
}
```

## ✅ Testing Strategy

### Critical Test Cases
```typescript
describe('Social Endpoints', () => {
  describe('reviews', () => {
    it('should create quality review with photo and award 15 points', async () => {
      const result = await socialRouter.reviews.createReview({
        input: {
          productId: 'prod_123',
          orderId: 'order_123',
          rating: 5,
          title: 'Excellent miel de lavande',
          content: 'Produit exceptionnel, goût authentique, livraison rapide. Je recommande vivement !',
          photos: ['https://example.com/photo1.jpg'],
          wouldRecommend: true,
        },
        ctx: mockContext
      })
      
      expect(result.success).toBe(true)
      expect(result.pointsEarned).toBe(15)
      expect(result.review?.isQualityReview).toBe(true)
    })
  })
  
  describe('referrals', () => {
    it('should process referral reward correctly', async () => {
      const result = await socialRouter.referrals.processReferralReward({
        input: {
          referralId: 'ref_123',
          conversionType: 'first_investment',
          conversionAmount: 80,
          refereeUserId: 'user_456',
        },
        ctx: mockContext
      })
      
      expect(result.referrerReward.pointsAwarded).toBe(100)
      expect(result.refereeReward.bonusPoints).toBe(8) // 10% of 80€
      expect(result.planetAction.type).toBe('tree_planted')
    })
  })
})
```

## Outputs

### Reviews
- `createReview` → `ProductReviewDTO`
- `getProductReviews` → `Paginated<ProductReviewDTO>`
- `getUserReviews` → `Paginated<UserReviewDTO>`
- `updateReview` → `ProductReviewDTO`
- `deleteReview` → `{ success: boolean }`

### Sharing
- `generateShareCard` → `ShareCardDTO`
- `trackShare` → `ShareTrackingDTO`
- `getShareHistory` → `Paginated<ShareHistoryDTO>`
- `generateImpactReport` → `ImpactReportDTO`

### Referrals
- `getReferralCode` → `ReferralCodeDTO`
- `trackReferral` → `ReferralTrackingDTO`
- `getReferralStats` → `ReferralStatsDTO`
- `processReferralReward` → `ReferralRewardDTO`

### Community
- `getActivityFeed` → `Paginated<CommunityActivityDTO>`
- `likeActivity` → `{ success: boolean, newLikesCount: number }`
- `reportContent` → `{ success: boolean, moderationId: string }`

See DTOs in `schemas/response-models.md`.

## References
- See `services/social-service.md` for business logic implementation
- See `04-specifications/mobile-app/v1/social/` for UI specifications
- See `04-specifications/mobile-app/v1/gamification/referral-program.md` for referral mechanics

---

**⚡ Implementation Priority:** HIGH (V1) - Core social engagement
**🧪 Test Coverage Target:** 90% - User-generated content critical
**📈 Performance Target:** <300ms P95 response time
**🤝 Social Goal:** +25% viral growth through referrals and sharing
