# Workflow: Review Moderation Flow - Make the CHANGE

## Objective
Ensure high-quality user-generated reviews while maintaining fast approval times and preventing spam/abuse through automated and manual moderation processes.

## Steps

### 1) **Review Submission**
   - User submits product review with rating, text, photos
   - Validate user has purchased product (order verification)
   - Check for duplicate reviews from same user
   - Apply initial content filters

### 2) **Auto-Moderation Assessment**
   - Run content through automated quality checks
   - Detect spam patterns, inappropriate content
   - Assess review quality (word count, photos, helpfulness)
   - Determine if manual moderation required

### 3) **Quality Classification**
   - Standard review: 10+ words, basic content
   - Quality review: 50+ words + photo + detailed feedback
   - Suspicious review: Flagged patterns, requires manual review
   - Auto-approve or queue for moderation

### 4) **Manual Moderation (if required)**
   - Admin reviews flagged content
   - Checks authenticity and compliance
   - Makes approval/rejection decision
   - Provides feedback for rejected reviews

### 5) **Reward Processing**
   - Award points based on review quality (5 or 15 points)
   - Update reviewer badge progress
   - Track review analytics and user reputation
   - Generate review confirmation notification

### 6) **Publication & Distribution**
   - Publish approved review on product page
   - Update product rating average
   - Include in community activity feed
   - Enable review helpfulness voting

## Failure Paths
- **Purchase verification fails** → Reject with clear error message
- **Auto-moderation fails** → Default to manual review queue
- **Manual moderation timeout** → Auto-approve after 48h (trusted users)
- **Points award fails** → Queue for retry, maintain user experience
- **Publication fails** → Rollback approval, retry publication

## Business Rules

### Auto-Moderation Criteria
```typescript
const AUTO_MODERATION_RULES = {
  autoApprove: {
    conditions: [
      'user.trustScore >= 80',
      'content.length >= 10',
      'content.length <= 1000',
      'rating >= 1 && rating <= 5',
      'no_banned_words',
      'caps_percentage < 30%',
      'no_repeated_chars > 3',
    ]
  },
  autoReject: {
    conditions: [
      'content.length < 10',
      'contains_spam_patterns',
      'excessive_profanity',
      'obvious_fake_content',
      'user.trustScore < 20',
    ]
  },
  requireManualReview: {
    conditions: [
      'rating <= 2', // Low ratings need human review
      'content.length > 500', // Long reviews
      'user.trustScore < 50',
      'contains_sensitive_keywords',
      'first_review_from_user',
    ]
  }
} as const
```

### Quality Assessment Algorithm
```typescript
const QUALITY_ASSESSMENT = {
  factors: {
    wordCount: { weight: 0.3, thresholds: { good: 50, excellent: 100 } },
    hasPhotos: { weight: 0.2, bonus: 20 },
    sentiment: { weight: 0.2, balanced: true },
    specificity: { weight: 0.2, keywordDensity: true },
    helpfulness: { weight: 0.1, predictiveModel: true },
  },
  qualityThreshold: 70, // Score out of 100
  pointsMapping: {
    basic: 5, // Score < 70
    quality: 15, // Score >= 70
    exceptional: 25, // Score >= 90 (rare bonus)
  }
} as const
```

### Trust Score Calculation
```typescript
const TRUST_SCORE_FACTORS = {
  accountAge: { weight: 0.2, maxDays: 365 },
  verifiedPurchases: { weight: 0.3, perPurchase: 10 },
  reviewHistory: { weight: 0.3, qualityReviews: 15, standardReviews: 5 },
  communityEngagement: { weight: 0.1, likes: 1, shares: 2 },
  moderationHistory: { weight: 0.1, rejections: -20, approvals: 5 },
} as const
```

## Security & Anti-Abuse

### Spam Detection
```typescript
export class ReviewSpamDetector {
  private readonly SPAM_PATTERNS = [
    /(.)\1{4,}/, // Repeated characters (aaaaa)
    /[A-Z]{10,}/, // Excessive caps
    /\b(spam|fake|bot|scam|promotional|advertisement)\b/i,
    /\b(http|www|\.com|\.org|\.net)\b/i, // URLs
    /\b(contact|email|phone|whatsapp|telegram)\b/i, // Contact info
  ]

  async detectSpam(content: string, userHistory: UserHistory): Promise<SpamDetectionResult> {
    let spamScore = 0
    const detectedPatterns = []
    
    // Pattern matching
    for (const pattern of this.SPAM_PATTERNS) {
      if (pattern.test(content)) {
        spamScore += 25
        detectedPatterns.push(pattern.source)
      }
    }
    
    // User behavior analysis
    if (userHistory.reviewsToday >= 5) {
      spamScore += 30 // Excessive daily reviews
    }
    
    if (userHistory.averageReviewLength < 15) {
      spamScore += 20 // Consistently short reviews
    }
    
    // Sentiment analysis
    const sentiment = await this.analyzeSentiment(content)
    if (sentiment.score < -0.8) {
      spamScore += 15 // Extremely negative
    }
    
    return {
      isSpam: spamScore >= 50,
      spamScore,
      detectedPatterns,
      confidence: Math.min(spamScore / 100, 1.0),
      requiresManualReview: spamScore >= 30 && spamScore < 50,
    }
  }
}
```

### Fraud Prevention for Reviews
```typescript
export class ReviewFraudPrevention {
  async validateReviewAuthenticity(
    userId: string,
    productId: string,
    reviewData: ReviewInput
  ): Promise<AuthenticityResult> {
    // Verify purchase
    const purchase = await this.validatePurchaseHistory(userId, productId)
    if (!purchase.valid) {
      return { authentic: false, reason: 'NO_VERIFIED_PURCHASE' }
    }
    
    // Check review timing (too soon after purchase?)
    const daysSincePurchase = this.calculateDaysSince(purchase.deliveryDate)
    if (daysSincePurchase < 1) {
      return { authentic: false, reason: 'TOO_SOON_AFTER_PURCHASE' }
    }
    
    // Analyze review similarity to existing reviews
    const similarityScore = await this.checkReviewSimilarity(reviewData.content, productId)
    if (similarityScore > 0.85) {
      return { authentic: false, reason: 'DUPLICATE_CONTENT' }
    }
    
    // Check user review velocity
    const recentReviews = await this.getRecentReviews(userId, 7)
    if (recentReviews.length > 10) {
      return { authentic: false, reason: 'EXCESSIVE_REVIEW_VELOCITY' }
    }
    
    return { authentic: true, confidence: this.calculateAuthenticityConfidence(purchase, reviewData) }
  }
}
```

## Performance Optimization

### Moderation Queue Management
```typescript
export class ModerationQueueManager {
  private readonly QUEUE_PRIORITIES = {
    high: { score: 90, sla: 2 }, // 2 hours
    medium: { score: 50, sla: 24 }, // 24 hours  
    low: { score: 20, sla: 72 }, // 72 hours
  } as const

  async prioritizeModeration(reviewId: string): Promise<ModerationPriority> {
    const review = await this.getReviewWithContext(reviewId)
    let priorityScore = 0
    
    // User trust score impact
    if (review.user.trustScore < 30) priorityScore += 40
    else if (review.user.trustScore < 60) priorityScore += 20
    
    // Content factors
    if (review.rating <= 2) priorityScore += 30 // Low ratings need attention
    if (review.content.length > 500) priorityScore += 15 // Long reviews
    if (review.photos.length === 0) priorityScore += 10 // No photos
    
    // Product factors
    if (review.product.isNewProduct) priorityScore += 25
    if (review.product.averageRating < 3) priorityScore += 20
    
    // Determine priority level
    if (priorityScore >= this.QUEUE_PRIORITIES.high.score) {
      return { level: 'high', sla: this.QUEUE_PRIORITIES.high.sla }
    } else if (priorityScore >= this.QUEUE_PRIORITIES.medium.score) {
      return { level: 'medium', sla: this.QUEUE_PRIORITIES.medium.sla }
    } else {
      return { level: 'low', sla: this.QUEUE_PRIORITIES.low.sla }
    }
  }

  async autoApproveIfSLAExpired(): Promise<void> {
    // Auto-approve low-risk reviews if SLA expired
    const expiredReviews = await this.db.productReview.findMany({
      where: {
        status: 'pending',
        createdAt: { lte: new Date(Date.now() - 72 * 60 * 60 * 1000) }, // 72h ago
      },
      include: { user: true }
    })
    
    for (const review of expiredReviews) {
      if (review.user.trustScore >= 60) {
        await this.autoApproveReview(review.id, 'SLA_EXPIRED')
      }
    }
  }
}
```

## Monitoring & Alerts

### Moderation Health Metrics
```typescript
interface ModerationMetrics {
  queue: {
    currentQueueSize: number
    averageWaitTime: number // hours
    slaCompliance: number // %
    autoApprovalRate: number // %
  }
  
  quality: {
    falsePositiveRate: number // %
    falseNegativeRate: number // %
    moderatorAgreementRate: number // %
    userAppealSuccessRate: number // %
  }
  
  performance: {
    averageModerationTime: number // minutes
    moderatorProductivity: number // reviews/hour
    escalationRate: number // %
    automationEfficiency: number // %
  }
}
```

### Real-time Alerts
```typescript
const MODERATION_ALERTS = {
  queueBacklog: {
    warning: 50, // reviews pending
    critical: 100,
    action: 'notify_moderation_team',
  },
  spamWave: {
    warning: 10, // suspicious reviews in 1h
    critical: 25,
    action: 'enable_strict_mode',
  },
  moderatorOverload: {
    warning: 20, // reviews per moderator per hour
    critical: 40,
    action: 'distribute_workload',
  }
} as const
```

---

**⚡ Implementation Priority:** HIGH (V1) - Content quality critical
**🧪 Test Coverage Target:** 95% - User trust essential
**📈 Performance Target:** <100ms auto-moderation, <24h manual review
**🛡️ Quality Goal:** >95% appropriate content, <5% false positives
