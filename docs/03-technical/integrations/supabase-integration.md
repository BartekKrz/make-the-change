# Supabase Integration - Make the CHANGE

 Scope: Auth, PostgreSQL, RLS, storage (optional), migrations.

## Auth
- Use supabase-js in Edge-safe mode (no session persistence); inject user JWT in headers for RLS.

## Database
- Extensions: uuid-ossp, postgis, pg_trgm.
- RLS enabled on sensitive tables; policies included in `database-schema.md`.
- Triggers for points balance; materialized views for analytics.
 - Scheduling: enable `pg_cron` for points accrual and view refresh (see `services/job-scheduling.md`).

## Storage (optional)
- Media can use Supabase Storage or Vercel Blob; choose per cost/perf.

## Migrations
- Keep SQL migration scripts under `packages/database`; apply via Supabase CLI.
 - Include creation of `rate_limits` (Postgres-only rate limiting) per `services/rate-limiting.md`.

## Observability
- Monitor slow queries; index usage; connection pool saturation.

## References
- `database-schema.md`, `services/*`.
