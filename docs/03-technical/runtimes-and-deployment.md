# Runtimes & Deployment – Make the CHANGE

Purpose: Clarify runtime choices on Vercel for API routes, tRPC handlers, and Stripe webhooks.

## Runtime Rules
- tRPC API (app router `[trpc]`): Edge runtime for low-latency, type-safe procedures.
  - Constraints: Edge runtime forbids certain Node APIs (no native `crypto` modules requiring Node polyfills, no `stripe` SDK instantiation here).
  - Pattern: Use lightweight fetch-based clients and pure TypeScript in procedures.

- Stripe Webhooks: Node runtime route handler.
  - Location: `apps/web/src/app/api/webhooks/stripe/route.ts` (or similar)
  - Config: `export const config = { runtime: 'nodejs' }` to enable signature verification with the official `stripe` SDK.

## Environment Variables
- `STRIPE_SECRET_KEY` (Node runtime only)
- `STRIPE_WEBHOOK_SECRET` (Node runtime only)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY` (server-side operations if needed)

## Vercel Project Setup
- Set the above env vars in Vercel Project Settings.
- Ensure the Stripe webhook route is on Node runtime; all other API routes remain Edge by default for performance.
- Supabase `pg_cron` enabled for scheduled jobs (see `services/job-scheduling.md`).

## References
- `api/stripe-webhook-example.ts`
- `architecture-overview.md`
- `services/job-scheduling.md`

