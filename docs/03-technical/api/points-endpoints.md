# Points Endpoints - Make the CHANGE

 tRPC Router: `points` | Priority: High | Weeks: 5-8

## Scope
Query, generate and manage user points with 18-month expiry, warnings, and adjustments.

## Router Definition
```ts
export const pointsRouter = router({
  balance: protectedProcedure.query(getPointsBalance),
  history: protectedProcedure.input(pointsHistorySchema).query(getPointsHistory),
  projection: protectedProcedure.query(getProjectedPoints),
  expiring: protectedProcedure.input(expiringSchema).query(getExpiringPoints),

  // internal/admin
  generateFromInvestment: protectedProcedure.input(pointsFromInvestmentSchema).mutation(generateFromInvestment),
  generateFromSubscription: protectedProcedure.input(pointsFromSubscriptionSchema).mutation(generateFromSubscription),
  adjust: adminProcedure.input(pointsAdjustSchema).mutation(adjustPoints),
  refund: adminProcedure.input(pointsRefundSchema).mutation(refundPoints),
})
```

## Schemas
```ts
export const pointsHistorySchema = z.object({
  pagination: paginationSchema,
  type: z.enum(['earned','spent','expired','bonus']).optional(),
})
export const expiringSchema = z.object({ daysAhead: z.number().min(1).max(365).default(60) })

export const pointsFromInvestmentSchema = z.object({
  userId: z.string().uuid(),
  investmentId: z.string().uuid(),
  baseAmount: z.number().int().positive(),
  bonusPercentage: z.number().min(0).max(200),
})
export const pointsFromSubscriptionSchema = z.object({
  userId: z.string().uuid(), subscriptionId: z.string().uuid(), period: z.string(), tier: z.string()
})
export const pointsAdjustSchema = z.object({ userId: z.string().uuid(), amount: z.number().int(), reason: z.string().min(3) })
export const pointsRefundSchema = z.object({ userId: z.string().uuid(), transactionId: z.string().uuid(), reason: z.string() })
```

## Business Logic
- Expiry = created_at + 18 months; schedule warnings at 60/30/7 days.
- Balance computed via trigger or view; expose consistent number.
- Prevent negative balance on debit; atomic operations with transactions.

## Security
- Admin only for manual adjust/refund; audit every change.
- Idempotency for generation from webhooks.

## Errors
- INSUFFICIENT_POINTS, DUPLICATE_TRANSACTION, INVALID_PERIOD, ADMIN_ONLY.

## Testing
- History pagination and filters; expiry scheduling; negative prevention; refund reversibility.

## Observability
- Metrics: points_earned/spent/expired by period; warning delivery rate.

## Outputs
- `balance` → `PointsBalanceDTO`
- `history` → `Paginated<PointsTransactionDTO>`
- `projection` → `{ next30d: number; next90d: number; annual: number }`
- `expiring` → `Array<{ transactionId: string; pointsAmount: number; expiresAt: string }>`

See DTOs in `schemas/response-models.md`.

## References
- See `services/points-service.md` for algorithms and expiry jobs.
