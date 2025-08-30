# Investments Endpoints - Make the CHANGE

 tRPC Router: `investments` | Priority: High | Weeks: 5-8

## Scope
Create and manage unit investments into specific projects (ruche, olivier, parcelle). Handles Stripe Payment Intents, point generation, and tracking IDs.

## Router Definition
```ts
export const investmentsRouter = router({
  create: protectedProcedure.input(investmentCreateSchema).mutation(createInvestment),
  list: protectedProcedure.input(investmentsListSchema).query(listUserInvestments),
  byId: protectedProcedure.input(idSchema).query(getInvestmentById),
  cancel: protectedProcedure.input(idSchema).mutation(cancelInvestment),
  analytics: protectedProcedure.input(analyticsFiltersSchema).query(getInvestmentAnalytics),
})
```

## Schemas
```ts
export const idSchema = z.object({ id: z.string().uuid() })

export const investmentCreateSchema = z.object({
  projectId: z.string().uuid(),
  investmentType: z.enum(['ruche', 'olivier', 'parcelle_familiale']),
  amount: z.enum([z.literal(50), z.literal(80), z.literal(150)] as any),
  paymentMethodId: z.string(), // Stripe PM
})

export const investmentsListSchema = z.object({ pagination: paginationSchema, status: z.enum(['active', 'expired', 'cancelled']).optional() })

export const analyticsFiltersSchema = z.object({ from: z.date().optional(), to: z.date().optional() })
```

## Flow (Create)
1) Validate project/status/type/price; compute bonus %.
2) Create Stripe Payment Intent (idempotency key: `inv:${userId}:${projectId}:${amount}:${ts}`).
3) Persist pending investment with PI id.
4) On webhook `payment_intent.succeeded`:
   - Mark investment active; generate points (expiry + schedule warnings).
   - Assign tracking IDs if applicable; update project funding progress.
   - Track analytics; send confirmation email/push.

## Security
- Idempotency; verify project availability; prevent duplicate charges.
- Webhook signature verification; handle retries safely.

## Errors
- PAYMENT_FAILED, INVALID_AMOUNT, PROJECT_UNAVAILABLE, DUPLICATE_REQUEST, WEBHOOK_INVALID.

## Testing
- Happy path, duplicate idempotency, payment failure, webhook retry, points correctness.

## Observability
- Audit: investment_created/pending/confirmed/cancelled; points_awarded; webhook_processed.

## References
- See `services/billing-service.md`, `services/points-service.md`.

