# Auth Service - Make the CHANGE

 Scope: Supabase Auth integration, session management, rate limiting, KYC integration hooks.

## Responsibilities
- Register/login/logout flows; refresh tokens and rotation.
- Email validation and domain checks; password complexity.
- Session tracking per device (user_sessions), revoke sessions, security events.
- KYC initialization via Stripe Identity and webhook processing.

## Design
- Source of truth for authentication is Supabase Auth; application profile lives in `users` + `user_profiles`.
- Access token (JWT) 1h expiry; refresh token 7–30d depending on remember me.
- Rate limiting: PostgreSQL-only counters (no Redis) using `rate_limits` table + function. See `services/rate-limiting.md`.

## APIs
- Used by `auth` router and `users` router security endpoints.

## Data
- Tables: users, user_profiles, user_sessions, audit_log.
- RLS: self-only; admin bypass via security definer RPC if needed.

## KYC
- Levels: light (€100), complete (€1000+). Store `kyc_status`, `kyc_level`.
- Webhooks: update status, write audit, trigger notifications.

## Security
- Block disposable/role emails; device/IP logging; suspicious login detection.
- Brute-force protection: exponential backoff after threshold.

## Observability
- Metrics: login success rate, rate limited attempts, session duration.

## Testing
- Token rotation, session revoke, multi-device, KYC state transitions.
