# Partner Service - Make the CHANGE

 Scope: Partner users, permissions, project assignments, updates lifecycle, media handling.

## Responsibilities
- Partner auth/login, sessions, and permission checks.
- CRUD for project updates with media uploads and moderation workflow.
- Assign projects to partners; notify on status changes.

## Design
- Separate partner user domain (`partner_users`, `partner_sessions`); distinct RLS policies.
- Media: upload to Blob/Storage; create thumbnails; store metadata.

## Lifecycle
1) Draft → Pending (submit) → Moderation (admin) → Published/Rejected.
2) Notifications to users on published updates (optional flag).

## Security
- Rate limits for updates/uploads; file scanning; permission checks by project.

## Observability
- Metrics: updates per partner, approval rate, time-to-publish.

## Testing
- Project scoping, moderation outcomes, media upload errors.

## References
- `api/partners-endpoints.md`, `integrations/partner-webhooks.md`.

