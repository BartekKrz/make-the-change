# Social Service - Make the CHANGE

**🤝 Service:** `SocialService` | **📍 Priority:** ⭐️⭐️ HIGH (V1) | **🗓️ Week:** 7-8

## Overview

Comprehensive social engagement service managing product reviews, impact sharing, referral program, and community features to drive viral growth and user-generated content.

## 🏗️ Service Architecture

### Core Components
```typescript
interface SocialService {
  reviews: ReviewsEngine
  sharing: SharingEngine
  referrals: ReferralEngine
  community: CommunityEngine
  moderation: ModerationEngine
  analytics: SocialAnalytics
}

interface ReviewsEngine {
  createReview(userId: string, reviewData: ReviewInput): Promise<Review>
  validatePurchase(userId: string, productId: string): Promise<boolean>
  detectQualityReview(content: string, photos: string[]): boolean
  moderateReview(reviewId: string, decision: ModerationDecision): Promise<Review>
  calculateReviewerStats(userId: string): Promise<ReviewerStats>
}

interface SharingEngine {
  generateImpactCard(userId: string, type: ShareType, context: ShareContext): Promise<ShareCard>
  generateShareText(impactData: ImpactData, template: ShareTemplate): string
  trackShareConversion(shareId: string, conversionData: ConversionData): Promise<void>
  optimizeShareContent(userId: string, platform: SocialPlatform): Promise<OptimizedContent>
}

interface ReferralEngine {
  generateReferralCode(userId: string): Promise<string>
  trackReferralVisit(referralCode: string, visitorData: VisitorData): Promise<void>
  processReferralConversion(referralId: string, conversionData: ConversionData): Promise<ReferralReward>
  calculateReferralStats(userId: string): Promise<ReferralStats>
  triggerPlanetAction(referralId: string): Promise<PlanetAction>
}

interface CommunityEngine {
  createActivityPost(userId: string, activityData: ActivityData): Promise<CommunityActivity>
  moderateContent(contentId: string, decision: ModerationDecision): Promise<void>
  calculateEngagementScore(userId: string): Promise<number>
  getFeedForUser(userId: string, filters: FeedFilters): Promise<ActivityFeed>
}
```

## 🌟 Reviews Engine Implementation

### Quality Review Detection
```typescript
export class ReviewsEngine {
  private readonly QUALITY_CRITERIA = {
    minWordCount: 50,
    minPhotos: 1,
    mustHavePhotos: true,
    bannedWords: ['spam', 'fake', 'bot'], // Simple content filter
  } as const

  async createReview(userId: string, reviewData: ReviewInput): Promise<Review> {
    // Validate purchase eligibility
    const isPurchaseValid = await this.validatePurchase(userId, reviewData.productId)
    if (!isPurchaseValid) {
      throw new Error('PURCHASE_NOT_VERIFIED')
    }
    
    // Check for existing review
    const existingReview = await this.getExistingReview(userId, reviewData.productId)
    if (existingReview) {
      throw new Error('REVIEW_ALREADY_EXISTS')
    }
    
    // Detect quality review
    const isQualityReview = this.detectQualityReview(reviewData.content, reviewData.photos)
    
    // Create review with auto-moderation
    const review = await this.db.productReview.create({
      data: {
        ...reviewData,
        userId,
        isQualityReview,
        status: this.shouldAutoApprove(reviewData) ? 'approved' : 'pending',
        helpfulVotes: 0,
        createdAt: new Date(),
      }
    })
    
    // Award points based on quality
    const pointsReward = isQualityReview ? 15 : 5
    await this.pointsService.awardGamificationPoints(
      userId,
      'activity',
      pointsReward,
      `Review: ${reviewData.title}`,
      review.id
    )
    
    // Check reviewer badge progress
    await this.checkReviewerBadgeProgress(userId)
    
    // Track analytics
    await this.analytics.trackReviewCreated({
      userId,
      productId: reviewData.productId,
      isQualityReview,
      pointsEarned: pointsReward,
    })
    
    return review
  }

  detectQualityReview(content: string, photos: string[]): boolean {
    const wordCount = content.split(/\s+/).length
    const hasPhotos = photos.length > 0
    const meetsWordCount = wordCount >= this.QUALITY_CRITERIA.minWordCount
    
    // Check for spam indicators
    const containsBannedWords = this.QUALITY_CRITERIA.bannedWords.some(word => 
      content.toLowerCase().includes(word)
    )
    
    return meetsWordCount && hasPhotos && !containsBannedWords
  }

  private shouldAutoApprove(reviewData: ReviewInput): boolean {
    // Auto-approve reviews from verified users with good history
    // For MVP, auto-approve all non-suspicious reviews
    const suspiciousPatterns = [
      /(.)\1{4,}/, // Repeated characters (aaaaa)
      /[A-Z]{10,}/, // Excessive caps
      /\b(spam|fake|bot|scam)\b/i, // Obvious spam words
    ]
    
    return !suspiciousPatterns.some(pattern => pattern.test(reviewData.content))
  }

  async calculateReviewerStats(userId: string): Promise<ReviewerStats> {
    const reviews = await this.db.productReview.findMany({
      where: { userId, status: 'approved' }
    })
    
    return {
      totalReviews: reviews.length,
      qualityReviews: reviews.filter(r => r.isQualityReview).length,
      averageRating: reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length,
      totalHelpfulVotes: reviews.reduce((sum, r) => sum + r.helpfulVotes, 0),
      reviewsThisMonth: reviews.filter(r => 
        r.createdAt >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ).length,
    }
  }
}
```

## 🎨 Sharing Engine Implementation

### Impact Card Generation
```typescript
export class SharingEngine {
  private readonly SHARE_TEMPLATES = {
    impact_report: {
      minimal: 'En 2025, j\'ai contribué à {impact_summary} via Make the CHANGE ! 🌱',
      detailed: '🌱 Mon impact 2025 :\n{impact_details}\n\nRejoignez-moi sur Make the CHANGE !',
      story: '🌍 Histoire de mon impact :\n{impact_story}\n\n#MakeTheChange #Biodiversité',
    },
    badge_earned: {
      minimal: '🏆 Nouveau badge débloqué : {badge_name} !',
      detailed: '🏆 Je viens de débloquer "{badge_name}" sur Make the CHANGE !\n{badge_description}',
      story: '🎯 Étape franchie ! {achievement_story}\n\nÀ votre tour de protéger la biodiversité !',
    },
    project_support: {
      minimal: '🌱 Je soutiens {project_name} !',
      detailed: '🌱 Je viens de soutenir {project_name} de {producer_name} !\n{project_description}',
      story: '💚 Nouvelle contribution : {investment_story}\n\nEnsemble, protégeons la biodiversité !',
    }
  } as const

  async generateImpactCard(
    userId: string,
    type: ShareType,
    context: ShareContext
  ): Promise<ShareCard> {
    // Get user impact data
    const impactData = await this.calculateUserImpactData(userId, context.period)
    
    // Generate share text
    const shareText = this.generateShareText(impactData, type, context.template)
    
    // Generate visual card
    const imageUrl = await this.generateVisualCard({
      type,
      impactData,
      userInfo: await this.getUserInfo(userId),
      template: context.template,
      platform: context.platform,
    })
    
    // Create shareable URL with tracking
    const shareUrl = await this.createTrackingUrl(userId, type, context)
    
    // Store share card
    const shareCard = await this.db.shareCard.create({
      data: {
        userId,
        type,
        imageUrl,
        shareText,
        shareUrl,
        referralCode: context.includeReferralCode ? await this.getReferralCode(userId) : null,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h expiry
        metadata: {
          impactData,
          template: context.template,
          platform: context.platform,
        },
      }
    })
    
    return shareCard
  }

  private async calculateUserImpactData(userId: string, period?: TimePeriod): Promise<ImpactData> {
    const dateRange = period ? this.calculatePeriodRange(period) : null
    
    const whereClause = {
      userId,
      ...(dateRange && {
        createdAt: { gte: dateRange.start, lte: dateRange.end }
      })
    }
    
    // Get investment impact
    const investments = await this.db.investment.findMany({
      where: { ...whereClause, status: 'active' },
      include: { project: { include: { producer: true } } }
    })
    
    // Calculate environmental impact
    const environmentalImpact = investments.reduce((impact, investment) => {
      switch (investment.investmentType) {
        case 'ruche':
          impact.beesSupported += 1000 // 1 ruche = 1000 abeilles
          impact.honeyProduced += 25 // kg per year
          break
        case 'olivier':
          impact.treesPlanted += 1
          impact.co2Captured += 22 // kg per year per tree
          break
        case 'parcelle_familiale':
          impact.treesPlanted += 10
          impact.co2Captured += 220
          break
      }
      return impact
    }, {
      beesSupported: 0,
      treesPlanted: 0,
      honeyProduced: 0,
      co2Captured: 0,
    })
    
    return {
      totalInvestments: investments.length,
      totalAmountInvested: investments.reduce((sum, inv) => sum + inv.amountEur, 0),
      projectsSupported: new Set(investments.map(inv => inv.projectId)).size,
      producersSupported: new Set(investments.map(inv => inv.project.producerId)).size,
      environmentalImpact,
      period: period || 'all_time',
    }
  }

  generateShareText(impactData: ImpactData, type: ShareType, template: ShareTemplate): string {
    const templateText = this.SHARE_TEMPLATES[type][template]
    
    // Replace placeholders based on type
    switch (type) {
      case 'impact_report':
        return templateText
          .replace('{impact_summary}', this.formatImpactSummary(impactData))
          .replace('{impact_details}', this.formatImpactDetails(impactData))
          .replace('{impact_story}', this.formatImpactStory(impactData))
          
      case 'badge_earned':
        return templateText
          .replace('{badge_name}', impactData.badgeName)
          .replace('{badge_description}', impactData.badgeDescription)
          .replace('{achievement_story}', this.formatAchievementStory(impactData))
          
      case 'project_support':
        return templateText
          .replace('{project_name}', impactData.projectName)
          .replace('{producer_name}', impactData.producerName)
          .replace('{project_description}', impactData.projectDescription)
          .replace('{investment_story}', this.formatInvestmentStory(impactData))
          
      default:
        return templateText
    }
  }
}
```

## 🔄 Referral Engine Implementation

### Referral Code Generation & Tracking
```typescript
export class ReferralEngine {
  private readonly REFERRAL_CONFIG = {
    codeLength: 8,
    codePrefix: 'MTC',
    conversionReward: 100, // points for referrer
    welcomeBonus: 0.1, // 10% bonus for referee
    planetActionThreshold: 1, // 1 conversion = 1 tree planted
  } as const

  async generateReferralCode(userId: string): Promise<string> {
    // Check if user already has a referral code
    const existing = await this.db.userReferralCode.findUnique({
      where: { userId }
    })
    
    if (existing) {
      return existing.referralCode
    }
    
    // Generate unique code
    let referralCode: string
    let isUnique = false
    
    do {
      referralCode = this.generateRandomCode()
      const existingCode = await this.db.userReferralCode.findUnique({
        where: { referralCode }
      })
      isUnique = !existingCode
    } while (!isUnique)
    
    // Store referral code
    await this.db.userReferralCode.create({
      data: {
        userId,
        referralCode,
        totalUses: 0,
        totalConversions: 0,
        totalPointsEarned: 0,
      }
    })
    
    return referralCode
  }

  async processReferralConversion(
    referralId: string,
    conversionData: ConversionData
  ): Promise<ReferralReward> {
    const referral = await this.db.referral.findUnique({
      where: { id: referralId },
      include: { referrer: true, referee: true }
    })
    
    if (!referral) {
      throw new Error('REFERRAL_NOT_FOUND')
    }
    
    // Calculate rewards
    const referrerPoints = this.REFERRAL_CONFIG.conversionReward
    const refereeBonus = Math.round(conversionData.amount * this.REFERRAL_CONFIG.welcomeBonus)
    
    // Award points to referrer
    await this.pointsService.awardGamificationPoints(
      referral.referrerId,
      'referral',
      referrerPoints,
      `Parrainage réussi: ${referral.referee.firstName}`,
      referralId
    )
    
    // Award bonus to referee  
    await this.pointsService.awardGamificationPoints(
      referral.refereeId,
      'referral_bonus',
      refereeBonus,
      `Bonus de bienvenue: ${refereeBonus} points`,
      referralId
    )
    
    // Trigger planet action
    const planetAction = await this.triggerPlanetAction(referralId)
    
    // Update referral status
    await this.db.referral.update({
      where: { id: referralId },
      data: {
        status: 'converted',
        convertedAt: new Date(),
        conversionAmount: conversionData.amount,
        pointsAwarded: referrerPoints,
      }
    })
    
    // Update referrer stats
    await this.db.userReferralCode.update({
      where: { userId: referral.referrerId },
      data: {
        totalConversions: { increment: 1 },
        totalPointsEarned: { increment: referrerPoints },
      }
    })
    
    return {
      referrerReward: {
        pointsAwarded: referrerPoints,
        badgeProgress: await this.checkReferralBadgeProgress(referral.referrerId),
      },
      refereeReward: {
        bonusPercentage: this.REFERRAL_CONFIG.welcomeBonus * 100,
        bonusPoints: refereeBonus,
        welcomeMessage: `Bienvenue ! ${referral.referrer.firstName} vous a offert ${refereeBonus} points bonus.`,
      },
      planetAction,
    }
  }

  async triggerPlanetAction(referralId: string): Promise<PlanetAction> {
    // Generate tree planting certificate
    const certificateId = generateUUID()
    const treeLocation = await this.selectTreePlantingLocation() // Madagascar via ILANGA
    
    // Create planet action record
    const planetAction = await this.db.planetAction.create({
      data: {
        referralId,
        type: 'tree_planted',
        description: `Arbre planté à ${treeLocation.region}, Madagascar`,
        location: treeLocation,
        certificateId,
        status: 'completed',
        completedAt: new Date(),
      }
    })
    
    // Generate certificate URL (to be implemented with partner ILANGA)
    const certificateUrl = await this.generateTreeCertificate(certificateId, treeLocation)
    
    return {
      type: 'tree_planted',
      description: planetAction.description,
      certificateUrl,
      location: treeLocation.region,
      completedAt: planetAction.completedAt,
    }
  }

  private generateRandomCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = this.REFERRAL_CONFIG.codePrefix
    
    for (let i = 0; i < this.REFERRAL_CONFIG.codeLength; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    
    return code
  }
}
```

## 🎨 Sharing Engine Implementation  

### Visual Share Card Generation
```typescript
export class SharingEngine {
  private readonly CARD_DIMENSIONS = {
    instagram_story: { width: 1080, height: 1920 },
    instagram_post: { width: 1080, height: 1080 },
    linkedin: { width: 1200, height: 630 },
    facebook: { width: 1200, height: 630 },
    twitter: { width: 1200, height: 675 },
  } as const

  async generateVisualCard(config: VisualCardConfig): Promise<string> {
    const { type, impactData, userInfo, template, platform } = config
    
    // Select dimensions based on platform
    const dimensions = this.CARD_DIMENSIONS[platform] || this.CARD_DIMENSIONS.instagram_post
    
    // Create canvas for image generation
    const canvas = await this.createCanvas(dimensions.width, dimensions.height)
    const ctx = canvas.getContext('2d')
    
    // Apply Make the CHANGE brand styling
    await this.applyBrandStyling(ctx, template)
    
    // Add content based on type
    switch (type) {
      case 'impact_report':
        await this.renderImpactReport(ctx, impactData, userInfo)
        break
        
      case 'badge_earned':
        await this.renderBadgeCard(ctx, impactData.badge, userInfo)
        break
        
      case 'project_support':
        await this.renderProjectSupportCard(ctx, impactData.project, userInfo)
        break
    }
    
    // Add referral code if requested
    if (config.includeReferralCode) {
      await this.addReferralCode(ctx, userInfo.referralCode)
    }
    
    // Generate and upload image
    const buffer = canvas.toBuffer('image/png')
    const imageUrl = await this.uploadShareCardImage(buffer, `${type}_${Date.now()}`)
    
    return imageUrl
  }

  private async renderImpactReport(ctx: CanvasRenderingContext2D, impactData: ImpactData, userInfo: UserInfo): Promise<void> {
    // Background gradient
    ctx.fillStyle = 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    
    // Title
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 48px Inter'
    ctx.textAlign = 'center'
    ctx.fillText('Mon Impact 2025', ctx.canvas.width / 2, 100)
    
    // User name
    ctx.font = '32px Inter'
    ctx.fillText(`${userInfo.firstName} ${userInfo.lastInitial}.`, ctx.canvas.width / 2, 160)
    
    // Impact metrics
    const metrics = [
      { icon: '🐝', value: impactData.environmentalImpact.beesSupported, label: 'abeilles protégées' },
      { icon: '🌳', value: impactData.environmentalImpact.treesPlanted, label: 'arbres soutenus' },
      { icon: '🌍', value: impactData.environmentalImpact.co2Captured, label: 'kg CO₂ compensés' },
    ]
    
    let yPosition = 250
    metrics.forEach(metric => {
      if (metric.value > 0) {
        ctx.font = '28px Inter'
        ctx.fillText(`${metric.icon} ${metric.value.toLocaleString()} ${metric.label}`, ctx.canvas.width / 2, yPosition)
        yPosition += 60
      }
    })
    
    // Call to action
    ctx.font = 'bold 24px Inter'
    ctx.fillText('Rejoignez-moi sur Make the CHANGE !', ctx.canvas.width / 2, yPosition + 80)
  }

  async trackShareConversion(shareId: string, conversionData: ConversionData): Promise<void> {
    // Update share tracking
    await this.db.shareTracking.update({
      where: { id: shareId },
      data: {
        clicks: { increment: 1 },
        conversions: conversionData.converted ? { increment: 1 } : undefined,
      }
    })
    
    // Award conversion points to sharer if applicable
    if (conversionData.converted) {
      const shareCard = await this.db.shareCard.findUnique({
        where: { id: conversionData.shareCardId }
      })
      
      if (shareCard) {
        await this.pointsService.awardGamificationPoints(
          shareCard.userId,
          'share_conversion',
          25, // +25 points for successful conversion
          'Partage converti en inscription',
          shareId
        )
      }
    }
  }
}
```

## 🏘️ Community Engine Implementation

### Activity Feed & Engagement
```typescript
export class CommunityEngine {
  private readonly ACTIVITY_TYPES = {
    INVESTMENT: 'investment',
    BADGE_EARNED: 'badge_earned',
    LEVEL_UP: 'level_up', 
    REVIEW_POSTED: 'review_posted',
    CHALLENGE_COMPLETED: 'challenge_completed',
    REFERRAL_SUCCESS: 'referral_success',
  } as const

  async createActivityPost(userId: string, activityData: ActivityData): Promise<CommunityActivity> {
    // Auto-generate activity posts for certain events
    const activityPost = await this.db.communityActivity.create({
      data: {
        userId,
        activityType: activityData.type,
        title: this.generateActivityTitle(activityData),
        description: this.generateActivityDescription(activityData),
        referenceId: activityData.referenceId,
        privacyLevel: activityData.privacyLevel || 'public',
        likesCount: 0,
        isFeatured: false,
      }
    })
    
    // Auto-feature high-impact activities
    if (this.shouldFeatureActivity(activityData)) {
      await this.featureActivity(activityPost.id)
    }
    
    return activityPost
  }

  async getFeedForUser(userId: string, filters: FeedFilters): Promise<ActivityFeed> {
    const user = await this.db.user.findUnique({ where: { id: userId } })
    
    // Build feed query based on user level and preferences
    const activities = await this.db.communityActivity.findMany({
      where: {
        privacyLevel: 'public',
        createdAt: {
          gte: filters.dateRange?.start || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          lte: filters.dateRange?.end || new Date(),
        },
        ...(filters.activityType && { activityType: filters.activityType }),
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            userLevel: true,
            avatarUrl: true,
          }
        },
        likes: {
          where: { userId }, // Check if current user liked
          select: { id: true }
        }
      },
      orderBy: [
        { isFeatured: 'desc' },
        { likesCount: 'desc' },
        { createdAt: 'desc' },
      ],
      take: filters.limit || 20,
      skip: ((filters.page || 1) - 1) * (filters.limit || 20),
    })
    
    return {
      activities: activities.map(activity => ({
        id: activity.id,
        type: activity.activityType,
        title: activity.title,
        description: activity.description,
        author: {
          firstName: activity.user.firstName,
          lastInitial: activity.user.lastName[0],
          userLevel: activity.user.userLevel,
          avatar: activity.user.avatarUrl,
        },
        likesCount: activity.likesCount,
        isLikedByUser: activity.likes.length > 0,
        isFeatured: activity.isFeatured,
        createdAt: activity.createdAt,
      })),
      hasMore: activities.length === (filters.limit || 20),
      totalCount: await this.countActivities(filters),
    }
  }

  async likeActivity(userId: string, activityId: string): Promise<LikeResult> {
    // Check if already liked
    const existingLike = await this.db.activityLike.findUnique({
      where: {
        activityId_userId: {
          activityId,
          userId,
        }
      }
    })
    
    if (existingLike) {
      // Unlike
      await this.db.activityLike.delete({
        where: { id: existingLike.id }
      })
      
      await this.db.communityActivity.update({
        where: { id: activityId },
        data: { likesCount: { decrement: 1 } }
      })
      
      return { liked: false, newLikesCount: await this.getLikesCount(activityId) }
    } else {
      // Like
      await this.db.activityLike.create({
        data: { activityId, userId }
      })
      
      await this.db.communityActivity.update({
        where: { id: activityId },
        data: { likesCount: { increment: 1 } }
      })
      
      // Award engagement point to activity author (not the liker)
      const activity = await this.db.communityActivity.findUnique({
        where: { id: activityId }
      })
      
      if (activity && activity.userId !== userId) {
        await this.pointsService.awardGamificationPoints(
          activity.userId,
          'engagement',
          1,
          'Like reçu sur activité',
          activityId
        )
      }
      
      return { liked: true, newLikesCount: await this.getLikesCount(activityId) }
    }
  }
}
```

## 🛡️ Moderation Engine Implementation

### Content Moderation System
```typescript
export class ModerationEngine {
  private readonly AUTO_MODERATION_RULES = {
    review: {
      minLength: 10,
      maxLength: 1000,
      bannedWords: ['spam', 'fake', 'scam', 'bot'],
      maxCapsPercentage: 0.3,
      maxRepeatedChars: 3,
    },
    activity: {
      minLength: 5,
      maxLength: 500,
      bannedWords: ['spam', 'fake', 'scam'],
      requiresManualReview: ['investment_large', 'negative_review'],
    }
  } as const

  async moderateReview(reviewId: string, decision: ModerationDecision): Promise<Review> {
    const review = await this.db.productReview.findUnique({
      where: { id: reviewId },
      include: { user: true }
    })
    
    if (!review) {
      throw new Error('REVIEW_NOT_FOUND')
    }
    
    // Update review status
    const updatedReview = await this.db.productReview.update({
      where: { id: reviewId },
      data: {
        status: decision.action,
        moderatedBy: decision.moderatorId,
        moderatedAt: new Date(),
        moderationNotes: decision.notes,
      }
    })
    
    // Handle rejection
    if (decision.action === 'rejected') {
      // Refund points if they were awarded
      const pointsTransaction = await this.db.pointsTransaction.findFirst({
        where: { 
          userId: review.userId,
          referenceId: reviewId,
          type: 'earned',
          subtype: 'quality_review'
        }
      })
      
      if (pointsTransaction) {
        await this.pointsService.refundPoints(
          review.userId,
          pointsTransaction.id,
          'Review rejected during moderation'
        )
      }
      
      // Notify user
      await this.notificationService.sendReviewRejectionNotification(
        review.userId,
        decision.notes || 'Votre avis ne respecte pas nos guidelines communautaires.'
      )
    }
    
    // Handle approval
    if (decision.action === 'approved' && review.status === 'pending') {
      // Award points if not already awarded
      const pointsReward = review.isQualityReview ? 15 : 5
      await this.pointsService.awardGamificationPoints(
        review.userId,
        'activity',
        pointsReward,
        `Review approved: ${review.title}`,
        reviewId
      )
      
      // Check badge progress
      await this.gamificationService.badges.checkReviewerBadgeProgress(review.userId)
    }
    
    return updatedReview
  }

  async autoModerateContent(content: string, type: 'review' | 'activity'): Promise<ModerationResult> {
    const rules = this.AUTO_MODERATION_RULES[type]
    const violations = []
    
    // Length check
    if (content.length < rules.minLength) {
      violations.push('CONTENT_TOO_SHORT')
    }
    if (content.length > rules.maxLength) {
      violations.push('CONTENT_TOO_LONG')
    }
    
    // Banned words check
    const lowerContent = content.toLowerCase()
    const hasBannedWords = rules.bannedWords.some(word => lowerContent.includes(word))
    if (hasBannedWords) {
      violations.push('BANNED_WORDS_DETECTED')
    }
    
    // Caps check
    const capsCount = (content.match(/[A-Z]/g) || []).length
    const capsPercentage = capsCount / content.length
    if (capsPercentage > rules.maxCapsPercentage) {
      violations.push('EXCESSIVE_CAPS')
    }
    
    // Repeated characters check
    const hasRepeatedChars = new RegExp(`(.)\\1{${rules.maxRepeatedChars},}`).test(content)
    if (hasRepeatedChars) {
      violations.push('REPEATED_CHARACTERS')
    }
    
    return {
      approved: violations.length === 0,
      violations,
      confidence: this.calculateModerationConfidence(violations),
      requiresManualReview: violations.length > 0 || this.requiresManualReview(content, type),
    }
  }
}
```

## 📊 Social Analytics Implementation

### Engagement Tracking & Insights
```typescript
export class SocialAnalytics {
  async getEngagementMetrics(period: TimePeriod): Promise<SocialEngagementMetrics> {
    const dateRange = this.calculatePeriodRange(period)
    
    return {
      reviews: await this.getReviewMetrics(dateRange),
      sharing: await this.getSharingMetrics(dateRange),
      referrals: await this.getReferralMetrics(dateRange),
      community: await this.getCommunityMetrics(dateRange),
      retention: await this.getRetentionMetrics(dateRange),
    }
  }

  private async getReviewMetrics(dateRange: DateRange): Promise<ReviewMetrics> {
    const reviews = await this.db.productReview.findMany({
      where: {
        createdAt: { gte: dateRange.start, lte: dateRange.end },
        status: 'approved',
      },
      include: { user: true }
    })
    
    const totalReviews = reviews.length
    const qualityReviews = reviews.filter(r => r.isQualityReview).length
    const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
    const uniqueReviewers = new Set(reviews.map(r => r.userId)).size
    
    return {
      totalReviews,
      qualityReviewsPercentage: (qualityReviews / totalReviews) * 100,
      averageRating,
      reviewsPerUser: totalReviews / uniqueReviewers,
      photosPerReview: reviews.reduce((sum, r) => sum + r.photos.length, 0) / totalReviews,
      engagementRate: reviews.reduce((sum, r) => sum + r.helpfulVotes, 0) / totalReviews,
    }
  }

  private async getSharingMetrics(dateRange: DateRange): Promise<SharingMetrics> {
    const shareCards = await this.db.shareCard.findMany({
      where: { createdAt: { gte: dateRange.start, lte: dateRange.end } },
      include: { tracking: true }
    })
    
    const totalShares = shareCards.reduce((sum, card) => sum + card.tracking.length, 0)
    const totalClicks = shareCards.reduce((sum, card) => 
      sum + card.tracking.reduce((clicks, track) => clicks + track.clicks, 0), 0
    )
    const totalConversions = shareCards.reduce((sum, card) =>
      sum + card.tracking.reduce((conv, track) => conv + track.conversions, 0), 0
    )
    
    return {
      shareCardsGenerated: shareCards.length,
      totalShares,
      sharesByPlatform: this.calculateSharesByPlatform(shareCards),
      shareToConversionRate: totalShares > 0 ? (totalConversions / totalShares) * 100 : 0,
      viralCoefficient: this.calculateViralCoefficient(shareCards),
      clickThroughRate: totalShares > 0 ? (totalClicks / totalShares) * 100 : 0,
    }
  }

  private calculateViralCoefficient(shareCards: ShareCard[]): number {
    // Viral coefficient = (shares per user) * (conversion rate)
    const uniqueSharers = new Set(shareCards.map(card => card.userId)).size
    const sharesPerUser = shareCards.length / uniqueSharers
    const conversions = shareCards.reduce((sum, card) => 
      sum + card.tracking.reduce((conv, track) => conv + track.conversions, 0), 0
    )
    const conversionRate = shareCards.length > 0 ? conversions / shareCards.length : 0
    
    return sharesPerUser * conversionRate
  }
}
```

## 🔄 Background Jobs & Automation

### Scheduled Tasks
```typescript
export class SocialAutomation {
  async runDailyTasks(): Promise<void> {
    // Clean up expired share cards
    await this.cleanupExpiredShareCards()
    
    // Process pending moderation queue
    await this.processModerationQueue()
    
    // Update community activity rankings
    await this.updateActivityRankings()
    
    // Send daily engagement notifications
    await this.sendDailyEngagementNotifications()
  }

  async runWeeklyTasks(): Promise<void> {
    // Generate weekly community highlights
    await this.generateWeeklyHighlights()
    
    // Process referral tree planting actions
    await this.processWeeklyPlanetActions()
    
    // Clean up old tracking data
    await this.cleanupOldTrackingData()
  }

  async runMonthlyTasks(): Promise<void> {
    // Generate monthly impact reports for top users
    await this.generateMonthlyImpactReports()
    
    // Process monthly referral bonuses
    await this.processMonthlyReferralBonuses()
    
    // Update social engagement analytics
    await this.updateSocialEngagementAnalytics()
  }
}
```

## 🚨 Error Handling & Recovery

### Resilience Strategies
```typescript
export class SocialErrorHandler {
  async handleReviewCreationFailure(userId: string, reviewData: ReviewInput, error: Error): Promise<void> {
    // Log detailed error
    await this.logger.error('Review creation failed', {
      userId,
      productId: reviewData.productId,
      error: error.message,
      timestamp: new Date(),
    })
    
    // Save draft for user to retry
    await this.db.reviewDraft.create({
      data: {
        userId,
        productId: reviewData.productId,
        content: reviewData.content,
        rating: reviewData.rating,
        photos: reviewData.photos,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      }
    })
    
    // Notify user about draft saved
    await this.notificationService.sendReviewDraftSavedNotification(userId)
  }

  async handleShareCardGenerationFailure(userId: string, shareConfig: ShareConfig, error: Error): Promise<void> {
    // Fall back to text-only share
    const fallbackShareText = this.generateFallbackShareText(shareConfig.type, shareConfig.context)
    
    // Create minimal share record
    await this.db.shareCard.create({
      data: {
        userId,
        type: shareConfig.type,
        imageUrl: null, // No image generated
        shareText: fallbackShareText,
        shareUrl: await this.createTrackingUrl(userId, shareConfig.type, shareConfig.context),
        status: 'fallback',
        metadata: { error: error.message, fallback: true },
      }
    })
  }

  async handleReferralProcessingFailure(referralId: string, error: Error): Promise<void> {
    // Queue for retry
    await this.retryQueue.add('process_referral', {
      referralId,
      attempt: 1,
      maxAttempts: 5,
      error: error.message,
    })
    
    // Alert admin if critical
    if (error.message.includes('PAYMENT')) {
      await this.notificationService.sendAdminAlert({
        type: 'referral_payment_failed',
        referralId,
        error: error.message,
        severity: 'high',
      })
    }
  }
}
```

## 🎯 Performance Optimization

### Caching & Efficiency
```typescript
export class SocialPerformanceOptimizer {
  private readonly CACHE_STRATEGIES = {
    leaderboard: { ttl: 1800, refreshOnWrite: true }, // 30 min
    userBadges: { ttl: 300, refreshOnWrite: true }, // 5 min
    activityFeed: { ttl: 180, refreshOnWrite: false }, // 3 min
    referralStats: { ttl: 600, refreshOnWrite: true }, // 10 min
  } as const

  async optimizeLeaderboardQueries(): Promise<void> {
    // Use materialized view for leaderboard calculation
    await this.db.$executeRaw`
      CREATE MATERIALIZED VIEW IF NOT EXISTS user_impact_leaderboard AS
      WITH impact_calculations AS (
        SELECT 
          u.id as user_id,
          u.first_name,
          u.last_name,
          u.user_level,
          u.avatar_url,
          
          -- Investment impact
          COALESCE(SUM(CASE 
            WHEN i.investment_type = 'ruche' THEN 100
            WHEN i.investment_type = 'olivier' THEN 150
            WHEN i.investment_type = 'parcelle_familiale' THEN 300
            ELSE 0
          END), 0) as investment_impact,
          
          -- Subscription impact
          COALESCE(SUM(CASE 
            WHEN s.subscription_tier = 'ambassadeur_standard' AND s.billing_frequency = 'monthly' THEN 20
            WHEN s.subscription_tier = 'ambassadeur_premium' AND s.billing_frequency = 'monthly' THEN 35
            WHEN s.subscription_tier = 'ambassadeur_standard' AND s.billing_frequency = 'annual' THEN 252
            WHEN s.subscription_tier = 'ambassadeur_premium' AND s.billing_frequency = 'annual' THEN 480
            ELSE 0
          END), 0) as subscription_impact,
          
          -- Engagement impact
          COALESCE(SUM(CASE WHEN r.is_quality_review THEN 20 ELSE 10 END), 0) as engagement_impact,
          
          -- Community impact
          COALESCE(COUNT(ref.id) * 50, 0) as community_impact
          
        FROM users u
        LEFT JOIN investments i ON u.id = i.user_id AND i.status = 'active'
        LEFT JOIN subscriptions s ON u.id = s.user_id AND s.status = 'active'
        LEFT JOIN product_reviews r ON u.id = r.user_id AND r.status = 'approved'
        LEFT JOIN referrals ref ON u.id = ref.referrer_id AND ref.status = 'converted'
        WHERE u.user_level != 'admin'
        GROUP BY u.id, u.first_name, u.last_name, u.user_level, u.avatar_url
      )
      SELECT 
        *,
        (investment_impact + subscription_impact + engagement_impact + community_impact) as total_impact,
        ROW_NUMBER() OVER (ORDER BY (investment_impact + subscription_impact + engagement_impact + community_impact) DESC) as rank
      FROM impact_calculations
      WHERE (investment_impact + subscription_impact + engagement_impact + community_impact) > 0
      ORDER BY total_impact DESC
    `
    
    // Refresh materialized view daily
    await this.scheduleViewRefresh('user_impact_leaderboard', 'daily')
  }

  async optimizeActivityFeedQueries(): Promise<void> {
    // Create optimized indexes for activity feed
    await this.db.$executeRaw`
      CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_community_activities_feed 
      ON community_activities(privacy_level, created_at DESC, is_featured DESC)
      WHERE privacy_level = 'public'
    `
    
    await this.db.$executeRaw`
      CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_activity_likes_count
      ON activity_likes(activity_id)
    `
  }
}
```

## 🔗 Integration Points

### Points Service Integration
```typescript
interface PointsServiceIntegration {
  // Award points for social activities
  awardSocialPoints(
    userId: string,
    activity: SocialActivity,
    amount: number,
    description: string,
    referenceId?: string
  ): Promise<PointsTransaction>
  
  // Refund points for rejected content
  refundSocialPoints(
    userId: string,
    originalTransactionId: string,
    reason: string
  ): Promise<PointsTransaction>
}
```

### Notification Service Integration
```typescript
interface NotificationServiceIntegration {
  // Social notifications
  sendReviewApprovedNotification(userId: string, review: Review): Promise<void>
  sendReviewRejectedNotification(userId: string, reason: string): Promise<void>
  sendReferralConversionNotification(referrerId: string, refereeFirstName: string): Promise<void>
  sendShareConversionNotification(sharerId: string, conversionData: ConversionData): Promise<void>
  
  // Community notifications
  sendActivityLikedNotification(authorId: string, likerFirstName: string): Promise<void>
  sendWeeklyHighlightsNotification(userId: string, highlights: WeeklyHighlights): Promise<void>
}
```

## 🎯 Success Metrics

### Social Engagement KPIs
```typescript
interface SocialKPIs {
  reviews: {
    reviewSubmissionRate: number // % users who submit reviews
    qualityReviewPercentage: number
    reviewHelpfulnessScore: number
    moderationAccuracy: number
  }
  
  sharing: {
    shareCardGenerationRate: number
    shareConversionRate: number
    viralGrowthRate: number
    organicReachMultiplier: number
  }
  
  referrals: {
    referralParticipationRate: number // % users with referral code
    referralConversionRate: number
    averageTimeToConversion: number
    referralLifetimeValue: number
  }
  
  community: {
    communityEngagementRate: number
    contentCreationRate: number
    moderationEfficiency: number
    userGeneratedContentQuality: number
  }
}
```

## 🚀 Implementation Roadmap

### Phase 1: Core Social (Week 7)
```yaml
Day 1-2:
  - Reviews engine with quality detection
  - Basic moderation system
  - Points integration for reviews

Day 3-4:
  - Referral code generation
  - Referral tracking system
  - Conversion reward processing

Day 5-7:
  - Share card generation (text-based)
  - Basic community activity feed
  - Social analytics foundation
```

### Phase 2: Advanced Features (Week 8)
```yaml
Day 1-3:
  - Visual share card generation
  - Advanced moderation with ML
  - Community engagement features

Day 4-5:
  - Planet action integration
  - Advanced referral analytics
  - Performance optimization

Day 6-7:
  - Error handling & recovery
  - Background job automation
  - Testing & validation
```

## References
- See `api/social-endpoints.md` for API specifications
- See `04-specifications/mobile-app/v1/social/` for UI requirements
- See `services/points-service.md` for points integration
- See `services/notification-service.md` for social notifications

---

**⚡ Implementation Priority:** HIGH (V1) - Core social engagement
**🧪 Test Coverage Target:** 90% - User-generated content critical
**📈 Performance Target:** <300ms social operations
**🤝 Social Goal:** +30% viral growth, +25% user-generated content
