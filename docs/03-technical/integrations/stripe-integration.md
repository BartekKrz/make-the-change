# Stripe Integration - Make the CHANGE

 Scope: Dual billing (subscriptions + payment intents), webhooks, portal.

## Configuration
- API version: 2023-10-16
- Env: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- Products/Prices: monthly standard/premium price IDs; annual via PaymentIntent.

## Webhooks (Node runtime)
- invoice.payment_succeeded → award monthly points + next billing date (mensuel)
- invoice.payment_failed → pause subscription + notify
- customer.subscription.created/updated/deleted → sync state
- payment_intent.succeeded (annual) → activate annual; créer/valider le schedule d’allocation mensuelle (pas d’attribution globale immédiate)

Idempotency: store processed event IDs; ensure handler is retry-safe. Les jobs d’allocation mensuelle doivent aussi être idempotents (clé par subscriptionId+mois).

## Customer Portal
- Create portal session with return URL; restrict settings as per product.

## Errors & Retries
- Respect Stripe retry schedule; do not throw to trigger retries intentionally unless transient.

## References
- `api/subscriptions-endpoints.md`, `services/billing-service.md`, `api/stripe-webhook-example.ts`.
