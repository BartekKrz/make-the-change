# Subscriptions Endpoints - Dual Billing System

**🔐 tRPC Router:** `subscriptions` | **📍 Priority:** ⭐️⭐️⭐️ CRITICAL | **🗓️ Week:** 1-3

## Overview

Dual billing subscription system supporting monthly Stripe Subscriptions and annual Payment Intents, with Customer Portal integration and billing frequency conversion.

## 🔄 tRPC Router Definition

```typescript
export const subscriptionsRouter = router({
  create: protectedProcedure
    .input(createSubscriptionSchema)
    .output(createSubscriptionResponseSchema)
    .mutation(async ({ input, ctx }) => createSubscription(input, ctx)),
    
  changeBillingFrequency: protectedProcedure
    .input(changeBillingFrequencySchema)
    .output(changeBillingFrequencyResponseSchema)
    .mutation(async ({ input, ctx }) => changeBillingFrequency(input, ctx)),
    
  updateTier: protectedProcedure
    .input(updateTierSchema)
    .output(updateTierResponseSchema)
    .mutation(async ({ input, ctx }) => updateSubscriptionTier(input, ctx)),
    
  getSubscription: protectedProcedure
    .input(getUserSubscriptionSchema)
    .output(getUserSubscriptionResponseSchema)
    .query(async ({ input, ctx }) => getUserSubscription(input, ctx)),
    
  getBillingHistory: protectedProcedure
    .input(getBillingHistorySchema)
    .output(getBillingHistoryResponseSchema)
    .query(async ({ input, ctx }) => getBillingHistory(input, ctx)),
    
  createBillingPortalSession: protectedProcedure
    .input(createPortalSessionSchema)
    .output(createPortalSessionResponseSchema)
    .mutation(async ({ input, ctx }) => createBillingPortalSession(input, ctx)),
    
  cancel: protectedProcedure
    .input(cancelSubscriptionSchema)
    .output(cancelSubscriptionResponseSchema)
    .mutation(async ({ input, ctx }) => cancelSubscription(input, ctx)),
    
  pause: protectedProcedure
    .input(pauseSubscriptionSchema)
    .output(pauseSubscriptionResponseSchema)
    .mutation(async ({ input, ctx }) => pauseSubscription(input, ctx)),
    
  // NOUVEAU: Allocation flexible pour Ambassadeurs
  updateProjectAllocation: protectedProcedure
    .input(updateProjectAllocationSchema)
    .output(updateProjectAllocationResponseSchema)
    .mutation(async ({ input, ctx }) => updateProjectAllocation(input, ctx)),
    
  getProjectAllocation: protectedProcedure
    .input(getProjectAllocationSchema)
    .output(getProjectAllocationResponseSchema)
    .query(async ({ input, ctx }) => getProjectAllocation(input, ctx)),
    
  getAllocatedProjects: protectedProcedure
    .input(getAllocatedProjectsSchema)
    .output(getAllocatedProjectsResponseSchema)
    .query(async ({ input, ctx }) => getAllocatedProjects(input, ctx)),
})
```

## 📋 Key Schemas

### Create Subscription
```typescript
export const createSubscriptionSchema = z.object({
  tier: z.enum(['ambassadeur_standard', 'ambassadeur_premium']),
  billingFrequency: z.enum(['monthly', 'annual']),
  paymentMethodId: z.string(), // Stripe Payment Method
  projectAllocation: z.array(z.object({
    projectId: z.string().uuid(),
    percentage: z.number().min(0).max(100),
  })).optional(),
  couponCode: z.string().optional(),
})

export const createSubscriptionResponseSchema = z.object({
  success: z.boolean(),
  subscription: z.object({
    id: z.string().uuid(),
    tier: z.enum(['ambassadeur_standard', 'ambassadeur_premium']),
    billingFrequency: z.enum(['monthly', 'annual']),
    amount: z.number(),
    pointsGenerated: z.number(),
    status: z.enum(['active', 'pending', 'cancelled']),
    nextBillingDate: z.date().optional(),
    stripeSubscriptionId: z.string().optional(),
    stripePaymentIntentId: z.string().optional(),
  }).optional(),
  error: z.object({
    code: z.enum([
      'PAYMENT_METHOD_REQUIRED',
      'PAYMENT_FAILED',
      'ALREADY_SUBSCRIBED',
      'INVALID_TIER',
      'STRIPE_ERROR',
    ]),
    message: z.string(),
  }).optional(),
})
```

### Billing Frequency Change
```typescript
export const changeBillingFrequencySchema = z.object({
  subscriptionId: z.string().uuid(),
  newFrequency: z.enum(['monthly', 'annual']),
  prorationHandling: z.enum(['immediate', 'next_cycle']).default('immediate'),
})

export const changeBillingFrequencyResponseSchema = z.object({
  success: z.boolean(),
  subscription: z.object({
    id: z.string().uuid(),
    billingFrequency: z.enum(['monthly', 'annual']),
    amount: z.number(),
    nextBillingDate: z.date(),
  }).optional(),
  proration: z.object({
    creditAmount: z.number(),
    nextChargeAmount: z.number(),
    effectiveDate: z.date(),
  }).optional(),
  pointsAdjustment: z.number().optional(),
})
```

### Project Allocation Management (NOUVEAU)
```typescript
export const updateProjectAllocationSchema = z.object({
  subscriptionId: z.string().uuid(),
  allocations: z.array(z.object({
    projectId: z.string().uuid(),
    percentage: z.number().min(0).max(100),
    priority: z.enum(['high', 'medium', 'low']).default('medium'),
  })),
  validateTotal: z.boolean().default(true), // Ensure total = 100%
})

export const updateProjectAllocationResponseSchema = z.object({
  success: z.boolean(),
  allocations: z.array(z.object({
    projectId: z.string().uuid(),
    projectName: z.string(),
    percentage: z.number(),
    pointsAllocated: z.number(),
    priority: z.enum(['high', 'medium', 'low']),
  })),
  totalAllocated: z.number(),
  remainingToAllocate: z.number(),
  nextMonthlyPoints: z.number(),
  error: z.object({
    code: z.enum([
      'INVALID_ALLOCATION_TOTAL',
      'PROJECT_NOT_FOUND',
      'SUBSCRIPTION_INACTIVE',
      'ALLOCATION_LIMIT_EXCEEDED',
    ]),
    message: z.string(),
  }).optional(),
})

export const getProjectAllocationSchema = z.object({
  subscriptionId: z.string().uuid().optional(), // If not provided, use user's active subscription
})

export const getProjectAllocationResponseSchema = z.object({
  allocations: z.array(z.object({
    projectId: z.string().uuid(),
    projectName: z.string(),
    projectType: z.enum(['beehive', 'olive_tree', 'vineyard']),
    percentage: z.number(),
    pointsAllocated: z.number(),
    priority: z.enum(['high', 'medium', 'low']),
    lastModified: z.date(),
  })),
  totalAllocated: z.number(),
  availableToAllocate: z.number(),
  nextMonthlyPoints: z.number(),
  maxProjectAllocations: z.number(), // Based on tier (10 for standard, unlimited for premium)
})

export const getAllocatedProjectsSchema = z.object({
  subscriptionId: z.string().uuid().optional(),
  includeInactive: z.boolean().default(false),
})

export const getAllocatedProjectsResponseSchema = z.object({
  projects: z.array(z.object({
    id: z.string().uuid(),
    name: z.string(),
    type: z.enum(['beehive', 'olive_tree', 'vineyard']),
    allocation: z.object({
      percentage: z.number(),
      pointsAllocated: z.number(),
      priority: z.enum(['high', 'medium', 'low']),
    }),
    producer: z.object({
      name: z.string(),
      location: z.string(),
    }),
    status: z.enum(['active', 'funded', 'closed']),
    fundingProgress: z.number(),
    lastUpdate: z.date().optional(),
  })),
  totalProjects: z.number(),
  totalPointsAllocated: z.number(),
})
```

## 🔧 Business Logic Implementation

### Dual Billing Creation (avec accrual mensuel pour les annuels)
```typescript
export async function createSubscription(
  input: CreateSubscriptionInput,
  ctx: Context
): Promise<CreateSubscriptionResponse> {
  const { tier, billingFrequency, paymentMethodId } = input
  
  // Get pricing
  const pricing = SUBSCRIPTION_PRICING[tier][billingFrequency]
  
  if (billingFrequency === 'monthly') {
    // Create Stripe Subscription
    const stripeSubscription = await ctx.stripe.subscriptions.create({
      customer: ctx.user.stripeCustomerId,
      items: [{ price: pricing.stripePriceId }],
      default_payment_method: paymentMethodId,
      metadata: { userId: ctx.user.id, tier },
    })
    
    // Create DB subscription
    const subscription = await ctx.db.subscription.create({
      data: {
        userId: ctx.user.id,
        tier,
        billingFrequency: 'monthly',
        amount: pricing.amount,
        pointsGenerated: pricing.points,
        stripeSubscriptionId: stripeSubscription.id,
        status: 'active',
        nextBillingDate: new Date(stripeSubscription.current_period_end * 1000),
      }
    })
    
    return { success: true, subscription }
    
  } else {
    // Create annual Payment Intent (points alloués mensuellement)
    const paymentIntent = await ctx.stripe.paymentIntents.create({
      amount: pricing.amount * 100, // cents
      currency: 'eur',
      customer: ctx.user.stripeCustomerId,
      payment_method: paymentMethodId,
      confirm: true,
      metadata: { userId: ctx.user.id, tier, type: 'annual_subscription' },
    })
    
    if (paymentIntent.status === 'succeeded') {
      const subscription = await ctx.db.subscription.create({
        data: {
          userId: ctx.user.id,
          tier,
          billingFrequency: 'annual',
          amount: pricing.amount,
          pointsGenerated: pricing.points, // total annuel, voir accrual
          stripePaymentIntentId: paymentIntent.id,
          status: 'active',
          startDate: new Date(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        }
      })
      // Planifier l'allocation mensuelle (12 tranches) avec expiry par tranche
      await scheduleAnnualPointsAccrual({
        userId: ctx.user.id,
        subscriptionId: subscription.id,
        totalPoints: pricing.points,
        months: 12,
      })

      return { success: true, subscription }
    }
  }
}
```

### Billing Frequency Conversion
```typescript
export async function changeBillingFrequency(
  input: ChangeBillingFrequencyInput,
  ctx: Context
): Promise<ChangeBillingFrequencyResponse> {
  const subscription = await ctx.db.subscription.findUnique({
    where: { id: input.subscriptionId, userId: ctx.user.id }
  })
  
  if (!subscription) throw new TRPCError({ code: 'NOT_FOUND' })
  
  const newPricing = SUBSCRIPTION_PRICING[subscription.tier][input.newFrequency]
  
  if (subscription.billingFrequency === 'monthly' && input.newFrequency === 'annual') {
    // Monthly → Annual conversion
    
    // 1. Cancel Stripe subscription
    await ctx.stripe.subscriptions.cancel(subscription.stripeSubscriptionId!)
    
    // 2. Calculate proration credit
    const proratedCredit = calculateMonthlyProrationCredit(subscription)
    
    // 3. Create annual payment with credit
    const paymentIntent = await ctx.stripe.paymentIntents.create({
      amount: (newPricing.amount - proratedCredit) * 100,
      currency: 'eur',
      customer: ctx.user.stripeCustomerId,
      metadata: { conversion: 'monthly_to_annual', originalSubscriptionId: subscription.id },
    })
    
    // 4. Update subscription
    await ctx.db.subscription.update({
      where: { id: subscription.id },
      data: {
        billingFrequency: 'annual',
        amount: newPricing.amount,
        pointsGenerated: newPricing.points,
        stripeSubscriptionId: null,
        stripePaymentIntentId: paymentIntent.id,
      }
    })
    // 5. Replanifier l'accrual mensuel pour la période restante
    await rescheduleAnnualAccrual(subscription.id, { totalPoints: newPricing.points, months: 12 })

    return {
      success: true,
      subscription: { /* updated subscription */ },
      proration: { creditAmount: proratedCredit },
      // Les points sont alloués mensuellement: pas de crédit immédiat
      pointsAdjustment: 0,
    }
  }

  // Handle Annual → Monthly conversion similarly
}
```

### Project Allocation Management (NOUVEAU)
```typescript
export async function updateProjectAllocation(
  input: UpdateProjectAllocationInput,
  ctx: Context
): Promise<UpdateProjectAllocationResponse> {
  const subscription = await ctx.db.subscription.findUnique({
    where: { id: input.subscriptionId, userId: ctx.user.id, status: 'active' }
  })
  
  if (!subscription) throw new TRPCError({ code: 'NOT_FOUND' })
  
  // Validate allocation total = 100%
  const totalPercentage = input.allocations.reduce((sum, alloc) => sum + alloc.percentage, 0)
  if (input.validateTotal && totalPercentage !== 100) {
    throw new TRPCError({ 
      code: 'BAD_REQUEST',
      message: `Total allocation must equal 100%, got ${totalPercentage}%`
    })
  }
  
  // Check project limits based on tier
  const maxAllocations = subscription.tier === 'ambassadeur_standard' ? 10 : 999
  if (input.allocations.length > maxAllocations) {
    throw new TRPCError({
      code: 'BAD_REQUEST', 
      message: `Maximum ${maxAllocations} project allocations for ${subscription.tier}`
    })
  }
  
  // Validate all projects exist and are active
  const projectIds = input.allocations.map(a => a.projectId)
  const projects = await ctx.db.project.findMany({
    where: { id: { in: projectIds }, status: 'active' }
  })
  
  if (projects.length !== projectIds.length) {
    throw new TRPCError({ code: 'BAD_REQUEST', message: 'Some projects not found or inactive' })
  }
  
  // Update allocation in database
  await ctx.db.subscription.update({
    where: { id: subscription.id },
    data: {
      project_allocation: {
        allocations: input.allocations,
        lastModified: new Date(),
        totalAllocated: totalPercentage,
      }
    }
  })
  
  // Calculate points allocation for next billing cycle
  const monthlyPoints = getMonthlyPoints(subscription.tier, subscription.billingFrequency)
  const allocationsWithPoints = input.allocations.map(alloc => ({
    ...alloc,
    projectName: projects.find(p => p.id === alloc.projectId)?.name || '',
    pointsAllocated: Math.round((monthlyPoints * alloc.percentage) / 100),
  }))
  
  return {
    success: true,
    allocations: allocationsWithPoints,
    totalAllocated: totalPercentage,
    remainingToAllocate: 100 - totalPercentage,
    nextMonthlyPoints: monthlyPoints,
  }
}

export async function getProjectAllocation(
  input: GetProjectAllocationInput,
  ctx: Context
): Promise<GetProjectAllocationResponse> {
  const subscriptionId = input.subscriptionId || await getCurrentSubscriptionId(ctx.user.id)
  
  const subscription = await ctx.db.subscription.findUnique({
    where: { id: subscriptionId, userId: ctx.user.id },
    include: {
      allocatedProjects: {
        include: { project: true }
      }
    }
  })
  
  if (!subscription) throw new TRPCError({ code: 'NOT_FOUND' })
  
  const allocations = subscription.project_allocation?.allocations || []
  const monthlyPoints = getMonthlyPoints(subscription.tier, subscription.billingFrequency)
  const maxAllocations = subscription.tier === 'ambassadeur_standard' ? 10 : 999
  
  return {
    allocations: allocations.map(alloc => ({
      projectId: alloc.projectId,
      projectName: alloc.project?.name || '',
      projectType: alloc.project?.type || 'beehive',
      percentage: alloc.percentage,
      pointsAllocated: Math.round((monthlyPoints * alloc.percentage) / 100),
      priority: alloc.priority,
      lastModified: subscription.project_allocation?.lastModified || subscription.updated_at,
    })),
    totalAllocated: allocations.reduce((sum, a) => sum + a.percentage, 0),
    availableToAllocate: 100 - allocations.reduce((sum, a) => sum + a.percentage, 0),
    nextMonthlyPoints: monthlyPoints,
    maxProjectAllocations: maxAllocations,
  }
}
```

## 💳 Stripe Integration Points

### Webhook Handlers Required
```typescript
// Handle monthly subscription events
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscription = await findSubscriptionByStripeId(invoice.subscription as string)
  await generateMonthlyPoints(subscription)
  await updateNextBillingDate(subscription, invoice.period_end)
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const subscription = await findSubscriptionByStripeId(invoice.subscription as string)
  await pauseSubscription(subscription.id)
  await notifyPaymentFailure(subscription.userId)
}

// Handle annual payment events (allocation mensuelle programmée)
async function handleAnnualPaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  if (paymentIntent.metadata.type === 'annual_subscription') {
    // Ne pas attribuer l'intégralité des points immédiatement.
    // Un schedule de 12 allocations mensuelles est créé lors de la souscription.
    await markAnnualPaymentActive(paymentIntent.id)
  }
}
```

### Pricing Configuration (source: Pricing Master Sheet)
```typescript
const SUBSCRIPTION_PRICING = {
  ambassadeur_standard: {
    monthly: {
      amount: 18, // €18/month
      points: 24, // 33% bonus (24 pts/mois)
      stripePriceId: 'price_monthly_standard',
    },
    annual: {
      amount: 180, // €180/year (17% discount)
      points: 252, // total annuel, accrual 21 pts/mois
      stripePriceId: null, // Payment Intent
    }
  },
  ambassadeur_premium: {
    monthly: {
      amount: 32, // €32/month  
      points: 40, // 25% bonus (40 pts/mois)
      stripePriceId: 'price_monthly_premium',
    },
    annual: {
      amount: 320, // €320/year (17% discount)
      points: 480, // total annuel, accrual 40 pts/mois
      stripePriceId: null, // Payment Intent
    }
  }
} as const
```

## 🔒 Customer Portal Integration

```typescript
export async function createBillingPortalSession(
  input: { returnUrl: string },
  ctx: Context
): Promise<{ portalUrl: string }> {
  const session = await ctx.stripe.billingPortal.sessions.create({
    customer: ctx.user.stripeCustomerId,
    return_url: input.returnUrl,
    configuration: 'bpc_1234567890', // Pre-configured portal
  })
  
  return { portalUrl: session.url }
}
```

## Points Accrual (Annuel)
- Attribution mensuelle: 1/12 des points annuels (Standard: 21/mois; Premium: 40/mois).
- Expiration: chaque tranche mensuelle expire à +18 mois de sa date d’allocation.
- Implémentation: création d’un schedule (12 jobs) à la souscription + vérification via cron mensuel (ou table d’échéances) pour robustesse.
  - Voir `services/job-scheduling.md` (table `scheduled_point_allocations`, fonction `process_due_point_allocations`).

## 📊 Analytics & Metrics

### Key Subscription Metrics
```typescript
interface SubscriptionMetrics {
  mrr: number // Monthly Recurring Revenue
  arr: number // Annual Recurring Revenue
  churnRate: number
  upgradeRate: number // Standard → Premium
  conversionRate: number // Monthly → Annual
  avgLifetimeValue: number
  
  billingFrequencyDistribution: {
    monthly: number
    annual: number
  }
  
  tierDistribution: {
    ambassadeur_standard: number
    ambassadeur_premium: number
  }
}
```

## 🚨 Error Handling

```typescript
export const SUBSCRIPTION_ERROR_CODES = {
  PAYMENT_METHOD_REQUIRED: 'Valid payment method required',
  PAYMENT_FAILED: 'Payment failed. Please check your payment method.',
  ALREADY_SUBSCRIBED: 'User already has an active subscription',
  INVALID_TIER: 'Invalid subscription tier',
  STRIPE_ERROR: 'Payment processing temporarily unavailable',
  PRORATION_ERROR: 'Error calculating billing adjustment',
  CONVERSION_FAILED: 'Failed to convert billing frequency',
} as const
```

## ✅ Testing Strategy

### Critical Test Cases
```typescript
describe('Subscriptions API', () => {
  it('should create monthly subscription with Stripe', async () => {
    const result = await subscriptionsRouter.create({
      input: { tier: 'ambassadeur_standard', billingFrequency: 'monthly' },
      ctx: mockContext
    })
    expect(result.subscription?.stripeSubscriptionId).toBeDefined()
  })
  
  it('should convert monthly to annual with proration', async () => {
    const result = await subscriptionsRouter.changeBillingFrequency({
      input: { subscriptionId: 'sub_123', newFrequency: 'annual' },
      ctx: mockContext
    })
    expect(result.proration?.creditAmount).toBeGreaterThan(0)
  })
  
  it('should handle failed payment gracefully', async () => {
    // Mock Stripe payment failure
    mockStripe.paymentIntents.create.mockRejectedValue(new Error('Payment failed'))
    
    await expect(subscriptionsRouter.create({ /* input */ }))
      .rejects.toThrow('PAYMENT_FAILED')
  })
})
```

## Outputs
- `create` → `SubscriptionDTO`
- `changeBillingFrequency` → `{ success: boolean; subscription: SubscriptionDTO; proration?: { creditAmount: number; nextChargeAmount?: number; effectiveDate: string }; pointsAdjustment?: number }`
- `updateTier` → `SubscriptionDTO`
- `getSubscription` → `SubscriptionDTO | null`
- `getBillingHistory` → `Paginated<{ periodStart: string; periodEnd: string; amountEur: number; pointsAwarded: number; status: 'paid'|'payment_pending'|'payment_failed' }>`
- `createBillingPortalSession` → `{ portalUrl: string }`
- `cancel`/`pause` → `{ success: boolean }`
- `updateProjectAllocation` → `UpdateProjectAllocationResponseDTO`
- `getProjectAllocation` → `ProjectAllocationResponseDTO`
- `getAllocatedProjects` → `AllocatedProjectsResponseDTO`

See DTOs in `schemas/response-models.md`.

---

**⚡ Implementation Priority:** CRITICAL - Core revenue system
**🧪 Test Coverage Target:** 95% - Financial operations
**📈 Business Impact:** Direct MRR/ARR tracking
**🔒 Security Level:** High - Payment processing
