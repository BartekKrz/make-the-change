# Job Scheduling (pg_cron) – Make the CHANGE

Goal: Define how recurring jobs run without external workers, using PostgreSQL `pg_cron` on Supabase.

## Prerequisites
```sql
-- Enable pg_cron (Supabase: Database > Extensions)
CREATE EXTENSION IF NOT EXISTS pg_cron;
```

## Annual Subscriptions – Monthly Points Accrual

We allocate annual subscription points monthly (12 tranches). We use a schedule table and a cron-driven processor.

### Table
```sql
CREATE TABLE IF NOT EXISTS scheduled_point_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  run_at TIMESTAMPTZ NOT NULL,
  points_amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, processed, cancelled
  idempotency_key TEXT NOT NULL UNIQUE,   -- subscriptionId:YYYY-MM
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_spa_due ON scheduled_point_allocations(status, run_at);
```

### Processor Function
```sql
CREATE OR REPLACE FUNCTION process_due_point_allocations(batch_limit INT DEFAULT 500)
RETURNS VOID AS $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT * FROM scheduled_point_allocations
    WHERE status = 'pending' AND run_at <= now()
    ORDER BY run_at ASC
    LIMIT batch_limit
    FOR UPDATE SKIP LOCKED
  ) LOOP
    BEGIN
      -- Idempotent insert into points_transactions
      INSERT INTO points_transactions (
        user_id, type, amount, balance_after, source_type, source_id, expires_at, description
      )
      SELECT 
        r.user_id,
        'earned',
        r.points_amount,
        0, -- recalculated by trigger update_user_points_balance
        'subscription',
        r.subscription_id,
        now() + interval '18 months',
        'Annual subscription monthly accrual'
      WHERE NOT EXISTS (
        SELECT 1 FROM points_transactions
        WHERE source_type = 'subscription'
          AND source_id = r.subscription_id
          AND description LIKE ('%' || to_char(now(),'YYYY-MM') || '%')
      );

      UPDATE scheduled_point_allocations
      SET status = 'processed', processed_at = now()
      WHERE id = r.id;
    EXCEPTION WHEN OTHERS THEN
      -- keep pending for retry; optionally log to audit
      NULL;
    END;
  END LOOP;
END;$$ LANGUAGE plpgsql;
```

### Cron Job
```sql
-- Run every hour
SELECT cron.schedule(
  'process-points-accrual',
  '0 * * * *',
  $$SELECT process_due_point_allocations(500);$$
);
```

### Seeding Schedules
On annual subscription creation, insert 12 rows spaced monthly:
```sql
-- Pseudocode: server inserts schedule rows with idempotency_key = `${subscriptionId}:${YYYY}-${MM}`
```

## Points Expiry Warnings (60/30/7 days)

We leverage `points_expiry_schedule` and run periodic tasks.

### Warning Function (sketch)
```sql
CREATE OR REPLACE FUNCTION send_points_expiry_warnings()
RETURNS VOID AS $$
BEGIN
  -- 60 days
  UPDATE points_expiry_schedule
  SET warning_60d_sent = true
  WHERE status = 'active'
    AND warning_60d_sent = false
    AND expires_at BETWEEN now() + interval '60 days' AND now() + interval '61 days';

  -- 30 days
  UPDATE points_expiry_schedule
  SET warning_30d_sent = true
  WHERE status = 'active'
    AND warning_30d_sent = false
    AND expires_at BETWEEN now() + interval '30 days' AND now() + interval '31 days';

  -- 7 days
  UPDATE points_expiry_schedule
  SET warning_7d_sent = true
  WHERE status = 'active'
    AND warning_7d_sent = false
    AND expires_at BETWEEN now() + interval '7 days' AND now() + interval '8 days';
END;$$ LANGUAGE plpgsql;
```

### Cron
```sql
SELECT cron.schedule('points-expiry-warnings', '0 8 * * *', 'SELECT send_points_expiry_warnings();');
```

## Materialized Views Refresh
See commands in `database-schema.md`. For convenience, register cron jobs:
```sql
SELECT cron.schedule('refresh-user-summary', '0 2 * * *', 'REFRESH MATERIALIZED VIEW CONCURRENTLY user_subscription_summary;');
SELECT cron.schedule('refresh-popular-projects', '0 3 * * *', 'REFRESH MATERIALIZED VIEW CONCURRENTLY popular_projects;');
SELECT cron.schedule('refresh-hybrid-metrics', '0 4 * * *', 'REFRESH MATERIALIZED VIEW CONCURRENTLY hybrid_performance_metrics;');
SELECT cron.schedule('refresh-inventory-status', '0 */6 * * *', 'REFRESH MATERIALIZED VIEW CONCURRENTLY inventory_status_overview;');
```

## Observability
- Log rows processed per run; alert on backlog growth (pending rows > threshold).
- Keep idempotency keys unique to avoid double-awards.

## Notes
- All of the above runs on Supabase Free using pg_cron; no external workers required.

