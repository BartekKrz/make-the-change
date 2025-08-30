# Points Service - Make the CHANGE

 Scope: Points calculation, expiry scheduling, warnings, debits/refunds, and analytics.

## Responsibilities
- Calculate points from investments and subscriptions (tier/frequency bonuses).
- Persist transactions with expiry and maintain balance via triggers/views.
- Schedule warnings (60/30/7 days) and process expiries.
- Debit for orders and handle refunds/adjustments.

## Algorithms
- Investment: points = baseAmount × (1 + bonus%).
- Subscription: points from pricing table by tier × frequency; monthly accrual via webhooks.
- Expiry: created_at + 18 months; materialized view for upcoming expiries; cron-driven processing.

## Data
- Tables: points_transactions, points_expiry_schedule; materialized views: user_points_summary.

## Security
- All writes via server; admin-only adjustments; idempotency keys per source_id.

## Observability
- Metrics: earned/spent/expired per cohort; warning delivery/open rates.

## Testing
- Boundary dates; idempotent awards; negative balance prevention; refund chain.

## References
- `api/points-endpoints.md`, `database-schema.md`.

