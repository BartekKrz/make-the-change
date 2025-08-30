# Rate Limiting (PostgreSQL-Only) – Make the CHANGE

Goal: Simple, zero-cost rate limiting using PostgreSQL (Supabase) without Redis. Applies to auth and other sensitive endpoints.

## Strategy
- Store counters in a compact `rate_limits` table per `(scope, identifier)` with a sliding window.
- Upsert + increment inside a transaction; evaluate window using `window_start` and `count`.
- Attach `retryAfterSeconds` in error payloads when blocked.

## Table
```sql
CREATE TABLE IF NOT EXISTS rate_limits (
  scope TEXT NOT NULL,             -- e.g. 'auth:login', 'auth:register', 'password:reset'
  identifier TEXT NOT NULL,        -- e.g. user email, IP, device id
  window_start TIMESTAMPTZ NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  last_attempt_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (scope, identifier)
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_scope ON rate_limits(scope);
```

## Helper Function
```sql
-- Checks and increments an attempt. Returns (allowed boolean, retry_after_seconds int)
CREATE OR REPLACE FUNCTION check_and_increment_rate_limit(
  p_scope TEXT,
  p_identifier TEXT,
  p_window_seconds INT,
  p_max_attempts INT
) RETURNS TABLE(allowed BOOLEAN, retry_after_seconds INT) AS $$
DECLARE
  v_now TIMESTAMPTZ := now();
  v_record rate_limits;
  v_retry INT := 0;
BEGIN
  SELECT * INTO v_record FROM rate_limits 
  WHERE scope = p_scope AND identifier = p_identifier
  FOR UPDATE;

  IF NOT FOUND THEN
    INSERT INTO rate_limits(scope, identifier, window_start, count)
    VALUES (p_scope, p_identifier, v_now, 1);
    RETURN QUERY SELECT true, 0;
  END IF;

  -- Reset window if expired
  IF v_record.window_start + make_interval(secs => p_window_seconds) <= v_now THEN
    UPDATE rate_limits
      SET window_start = v_now, count = 1, last_attempt_at = v_now
      WHERE scope = p_scope AND identifier = p_identifier;
    RETURN QUERY SELECT true, 0;
  END IF;

  -- Within window
  IF v_record.count + 1 > p_max_attempts THEN
    v_retry := EXTRACT(EPOCH FROM (v_record.window_start + make_interval(secs => p_window_seconds) - v_now));
    RETURN QUERY SELECT false, GREATEST(v_retry, 1);
  ELSE
    UPDATE rate_limits
      SET count = v_record.count + 1, last_attempt_at = v_now
      WHERE scope = p_scope AND identifier = p_identifier;
    RETURN QUERY SELECT true, 0;
  END IF;
END;$$ LANGUAGE plpgsql;
```

## Usage (Pseudocode)
```ts
// auth.login (window 15 min, max 5)
const { allowed, retry_after_seconds } = await db.raw(
  `SELECT * FROM check_and_increment_rate_limit($1,$2,$3,$4)`,
  ['auth:login', ctx.ip, 900, 5]
)
if (!allowed) throw new TRPCError({
  code: 'TOO_MANY_REQUESTS',
  message: 'Too many login attempts',
  // attach unified error shape
  // data: { code: 'RATE_LIMITED', retryAfterSeconds: retry_after_seconds }
})
```

## Recommended Policies
```ts
// Windows and limits (same logic as previous docs)
register:  { windowSeconds: 900,  maxAttempts: 3 },   // 15 min
login:     { windowSeconds: 900,  maxAttempts: 5 },   // 15 min
password:  { windowSeconds: 3600, maxAttempts: 3 },   // 1 hour
```

## Cleanup
- Option 1: No cleanup needed (rows reused by keys).
- Option 2: Periodic vacuum by deleting long-idle rows:
```sql
DELETE FROM rate_limits WHERE last_attempt_at < now() - interval '30 days';
```

## Observability
- Track total blocked attempts per scope via a lightweight view or BI query.

## Notes
- This design avoids external Redis entirely and works on Supabase Free.
- Use `identifier = ctx.ip` for unauthenticated, or `identifier = user.email`/`userId` once known.

