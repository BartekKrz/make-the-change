# Workflow: Social Engagement Flow - Make the CHANGE

## Objective
Orchestrate viral growth and community engagement through reviews, sharing, referrals, and user-generated content while maintaining quality and preventing abuse.

## Steps

### 1) **Content Creation & Validation**
   - Validate user eligibility for content creation
   - Apply auto-moderation rules
   - Detect quality content (reviews with photos, detailed descriptions)
   - Queue content for manual moderation if needed

### 2) **Quality Assessment & Rewards**
   - Assess content quality using ML and heuristics
   - Award appropriate points (5 for standard, 15 for quality)
   - Track user content creation patterns
   - Update reviewer/contributor reputation

### 3) **Social Amplification**
   - Generate shareable impact cards
   - Create tracking URLs for conversion measurement
   - Optimize content for different platforms
   - Enable easy sharing with referral codes

### 4) **Viral Growth Processing**
   - Track referral visits and conversions
   - Process referral rewards for both parties
   - Trigger planet actions for meaningful conversions
   - Update viral coefficient metrics

### 5) **Community Engagement**
   - Generate activity feed from user actions
   - Enable likes and social interactions
   - Feature high-impact activities
   - Moderate community content

### 6) **Analytics & Optimization**
   - Track social engagement metrics
   - Optimize sharing templates based on performance
   - Identify viral content patterns
   - Update recommendation algorithms

## Failure Paths
- **Content moderation fails** → Default to pending status, queue for manual review
- **Share card generation fails** → Fallback to text-only sharing
- **Referral processing fails** → Queue for retry, preserve user experience
- **Viral tracking fails** → Log error, continue with basic functionality

## Business Rules

### Content Quality Thresholds
```typescript
const QUALITY_THRESHOLDS = {
  review: {
    quality: { minWords: 50, requiresPhoto: true, minRating: 3 },
    standard: { minWords: 10, requiresPhoto: false },
    spam: { maxRepeatedChars: 3, bannedWords: ['spam', 'fake'] },
  },
  share: {
    maxGenerationsPerDay: 10,
    cooldownBetweenShares: 300, // 5 minutes
    trackingExpiry: 24 * 60 * 60 * 1000, // 24 hours
  },
  referral: {
    maxUsesPerCode: 100,
    conversionWindow: 30 * 24 * 60 * 60 * 1000, // 30 days
    fraudDetectionThreshold: 10, // same IP conversions
  }
} as const
```

### Viral Growth Mechanics
```typescript
const VIRAL_MECHANICS = {
  referral: {
    referrerReward: 100, // points
    refereeBonus: 0.1, // 10% of first investment
    planetActionThreshold: 1, // 1 conversion = 1 tree
    conversionTypes: ['first_investment', 'subscription'],
  },
  sharing: {
    shareReward: 5, // points per share
    conversionReward: 25, // points if share leads to signup
    weeklyShareLimit: 7,
    platforms: ['instagram', 'linkedin', 'facebook', 'twitter', 'whatsapp'],
  },
  community: {
    likeReward: 1, // points for receiving likes
    featureBonus: 10, // bonus for featured activity
    engagementMultiplier: 1.5, // multiplier for high engagement
  }
} as const
```

## Security & Fraud Prevention

### Anti-Abuse Measures
- **Referral fraud** : IP tracking, device fingerprinting, velocity analysis
- **Review manipulation** : Purchase verification, content authenticity checks
- **Points gaming** : Daily limits, streak validation, action verification
- **Spam prevention** : Content filters, user behavior analysis

### Privacy Protection
```typescript
const PRIVACY_RULES = {
  publicDisplay: {
    name: 'firstName + lastInitial', // "Marie D."
    location: 'cityOnly', // No precise address
    investments: 'aggregatedOnly', // Total count, not specific projects
  },
  sharing: {
    defaultPrivacy: 'public',
    allowPrivacyControl: true,
    anonymizeData: true, // Remove PII from share cards
  },
  community: {
    moderateAll: false, // Auto-approve from trusted users
    flagSensitiveContent: true,
    respectUserPreferences: true,
  }
} as const
```

## Performance Optimization

### Caching Strategy
```typescript
const CACHE_STRATEGY = {
  leaderboard: {
    ttl: 30 * 60, // 30 minutes
    refreshTriggers: ['new_investment', 'badge_earned', 'challenge_completed'],
    backgroundRefresh: true,
  },
  userBadges: {
    ttl: 5 * 60, // 5 minutes  
    refreshTriggers: ['badge_earned', 'progress_update'],
    invalidateOnWrite: true,
  },
  activityFeed: {
    ttl: 3 * 60, // 3 minutes
    refreshTriggers: ['new_activity', 'activity_liked'],
    paginationCache: true,
  },
  shareCards: {
    ttl: 24 * 60 * 60, // 24 hours
    refreshTriggers: ['never'], // Static content
    cleanupExpired: true,
  }
} as const
```

### Database Optimization
```sql
-- Optimized indexes for social queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reviews_product_rating 
ON product_reviews(product_id, rating DESC, created_at DESC) 
WHERE status = 'approved';

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reviews_user_quality
ON product_reviews(user_id, is_quality_review, created_at DESC)
WHERE status = 'approved';

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_activities_feed
ON community_activities(privacy_level, is_featured DESC, likes_count DESC, created_at DESC)
WHERE privacy_level = 'public';

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_referrals_tracking
ON referrals(referrer_id, status, converted_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_share_tracking
ON share_tracking(share_card_id, platform, shared_at DESC);
```

## Error Recovery Strategies

### Graceful Degradation
```typescript
export class SocialErrorRecovery {
  async handleReviewCreationFailure(userId: string, reviewData: ReviewInput): Promise<void> {
    // Save as draft for later completion
    await this.db.reviewDraft.create({
      data: {
        userId,
        productId: reviewData.productId,
        content: reviewData.content,
        rating: reviewData.rating,
        photos: reviewData.photos,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      }
    })
    
    // Award partial points for attempt
    await this.pointsService.awardGamificationPoints(
      userId,
      'activity',
      2, // Reduced points for draft
      'Review draft saved',
      null
    )
  }

  async handleSharingFailure(userId: string, shareConfig: ShareConfig): Promise<ShareCard> {
    // Generate text-only fallback
    const fallbackText = this.generateFallbackShareText(shareConfig)
    
    return {
      id: generateUUID(),
      type: shareConfig.type,
      imageUrl: null, // No image
      shareText: fallbackText,
      shareUrl: await this.createBasicShareUrl(userId, shareConfig),
      referralCode: shareConfig.includeReferralCode ? await this.getReferralCode(userId) : null,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      metadata: { fallback: true, error: 'image_generation_failed' },
    }
  }

  async handleReferralFailure(referralId: string, error: Error): Promise<void> {
    // Queue for retry with exponential backoff
    await this.retryQueue.add('process_referral', {
      referralId,
      attempt: 1,
      maxAttempts: 5,
      backoff: 'exponential',
    })
    
    // If payment-related, escalate immediately
    if (error.message.includes('PAYMENT') || error.message.includes('STRIPE')) {
      await this.escalateToAdmin(referralId, error)
    }
  }
}
```

## Monitoring & Observability

### Social Flow Metrics
```typescript
interface SocialFlowMetrics {
  contentCreation: {
    reviewsPerDay: number
    qualityReviewPercentage: number
    moderationQueueSize: number
    autoApprovalRate: number
  }
  
  viralGrowth: {
    shareGenerationRate: number
    shareConversionRate: number
    referralConversionRate: number
    viralCoefficient: number
    organicGrowthRate: number
  }
  
  engagement: {
    dailyActiveUsers: number
    communityActivityRate: number
    contentInteractionRate: number
    retentionImpactFromSocial: number
  }
  
  performance: {
    averageProcessingTime: number
    errorRate: number
    cacheEfficiency: number
    backgroundJobHealth: number
  }
}
```

### Real-time Alerts
```typescript
const ALERT_THRESHOLDS = {
  error_rate: { warning: 5, critical: 10 }, // %
  processing_time: { warning: 500, critical: 1000 }, // ms
  moderation_queue: { warning: 50, critical: 100 }, // pending items
  viral_coefficient: { warning: 0.5, critical: 0.3 }, // below threshold
} as const
```

## Success Metrics

### Social Engagement Goals
- **Content quality** : >70% quality reviews with photos
- **Viral growth** : Viral coefficient >1.2 (sustainable growth)
- **Community engagement** : >50% users interact with community features
- **Referral success** : >15% conversion rate from referrals
- **Retention impact** : +25% D30 retention from social features

## Integration Testing

### Critical User Journeys
```typescript
describe('Social Engagement Flow', () => {
  it('should complete full viral loop: review → share → referral → conversion', async () => {
    // 1. User creates quality review
    const review = await socialService.reviews.createReview(userId, qualityReviewData)
    expect(review.isQualityReview).toBe(true)
    
    // 2. Generate and share impact card
    const shareCard = await socialService.sharing.generateImpactCard(userId, 'badge_earned', context)
    expect(shareCard.imageUrl).toBeDefined()
    
    // 3. Track referral from share
    const referralTracking = await socialService.referrals.trackReferral({
      referralCode: shareCard.referralCode,
      action: 'signup',
    })
    expect(referralTracking.success).toBe(true)
    
    // 4. Process referral conversion
    const referralReward = await socialService.referrals.processReferralConversion(
      referralTracking.referralTracking.id,
      { amount: 80, type: 'first_investment' }
    )
    expect(referralReward.referrerReward.pointsAwarded).toBe(100)
    expect(referralReward.planetAction.type).toBe('tree_planted')
  })
})
```

---

**⚡ Implementation Priority:** HIGH (V1) - Core social engagement
**🧪 Test Coverage Target:** 90% - User-generated content critical  
**📈 Performance Target:** <300ms social operations
**🤝 Social Goal:** +30% viral growth, +25% community engagement
