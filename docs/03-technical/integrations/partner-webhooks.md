# Partner Webhooks - Make the CHANGE

 Scope: Contracts for receiving partner production/impact data and optional order/stock hooks.

## Security
- HMAC signature header `x-mtc-signature` with shared secret; timestamp to prevent replay.
- 5 retries with exponential backoff; idempotency via event ID.

## Example Payloads
```json
{
  "id": "evt_123",
  "type": "production.metrics.updated",
  "partner": "habeebee",
  "project_id": "uuid",
  "period": "2025-Q1",
  "metrics": {"honey_kg": 123.4},
  "created_at": "2025-01-10T12:00:00Z"
}
```

## Endpoints
- POST `/api/partners/webhooks/:partner`

## Error Handling
- 2xx acknowledge; non-2xx triggers retry; log and alert after exhaustion.

## References
- `services/partner-service.md`.

