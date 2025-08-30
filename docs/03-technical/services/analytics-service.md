# Analytics Service - Make the CHANGE

 Scope: Aggregate metrics for dashboards and domain analytics using PostgreSQL views/materialized views.

## Responsibilities
- Provide consistent KPIs: MRR/ARR, conversion, points economy, order performance, impact metrics.
- Manage view refresh schedules and cache invalidation tags for web RSC.
- Export reports (csv/xlsx/pdf) with privacy safeguards.

## Data
- Views: user_subscription_summary, user_points_summary, popular_projects, hybrid_performance_metrics, inventory_status_overview.

## Security
- Admin-only access by default; anonymize user identifiers for exports unless justified.

## Observability
- Metrics: refresh duration, query runtimes P95, export throughput.

## Testing
- Cross-check samples against base tables; date range boundaries; export formatting.

## References
- `api/analytics-endpoints.md`, `database-schema.md`.

