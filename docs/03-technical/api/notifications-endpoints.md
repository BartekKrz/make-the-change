# Notifications Endpoints - Make the CHANGE

 tRPC Router: `notifications` | Priority: Medium | Weeks: 13-16

## Scope
Push and email notifications, bulk sends, user preferences management.

## Router Definition
```ts
export const notificationsRouter = router({
  sendPush: adminProcedure.input(pushSchema).mutation(sendPush),
  sendEmail: adminProcedure.input(emailSchema).mutation(sendEmail),
  sendBulk: adminProcedure.input(bulkSchema).mutation(sendBulk),
  preferences: router({
    get: protectedProcedure.query(getPreferences),
    update: protectedProcedure.input(updatePreferencesSchema).mutation(updatePreferences),
  })
})
```

## Schemas
```ts
export const pushSchema = z.object({ userId: z.string().uuid(), title: z.string().min(1), body: z.string().min(1), data: z.record(z.any()).optional(), deepLink: z.string().url().optional() })
export const emailSchema = z.object({ to: z.string().email(), template: z.string(), variables: z.record(z.any()), priority: z.enum(['low','normal','high']).default('normal') })
export const bulkSchema = z.object({ userIds: z.array(z.string().uuid()).min(1), notification: z.object({ title: z.string(), body: z.string(), data: z.record(z.any()).optional() }), scheduling: z.object({ at: z.date().optional() }).optional() })
export const updatePreferencesSchema = z.object({ email: z.boolean().optional(), push: z.boolean().optional(), sms: z.boolean().optional() })
```

## Business Rules
- Respect user preferences and legal opt-ins; per-channel throttling.
- Bulk sends queued; retries with backoff; dead-letter for failures.

## Security
- Admin protected for sends; user protected for preferences; PII redaction.

## Errors
- INVALID_TEMPLATE, DELIVERY_FAILED, USER_OPTOUT, RATE_LIMITED.

## Testing
- Preference overrides, throttling, provider outages.

## Observability
- Metrics: delivery rate, open/click (email), failure reasons; store messageId for tracking.

## References
- See `services/notification-service.md` for providers and templates.

## Outputs
- `sendPush` → `PushSendResultDTO`
- `sendEmail` → `EmailSendResultDTO`
- `sendBulk` → `BulkSendResultDTO`
- `preferences.get` → `NotificationPreferencesDTO`
- `preferences.update` → `NotificationPreferencesDTO`

See DTOs in `schemas/response-models.md`.
