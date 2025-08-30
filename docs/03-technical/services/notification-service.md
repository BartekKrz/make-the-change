# Notification Service - Make the CHANGE

 Scope: Push and email notifications, templates, scheduling, delivery tracking.

## Responsibilities
- Send transactional and bulk notifications (push/email/SMS optional).
- Manage user notification preferences and compliance.
- Template rendering with variables and A/B testing hooks.

## Providers
- Push: Expo Push (mobile), APNS/FCM later.
- Email: Resend or SendGrid.

## Design
- Queue bulk sends via cron/queue; retries with backoff; track message IDs.
- Preferences enforced per-channel; GDPR unsubscribe.

## Observability
- Metrics: delivery rate, bounce, open/click (email), latency.

## Testing
- Provider failures, throttling, preference overrides, template variables.

## References
- `api/notifications-endpoints.md`.

