# Analytics Endpoints - Make the CHANGE

 tRPC Router: `analytics` | Priority: Medium | Weeks: 13-16

## Scope
Dashboards and domain analytics built on PostgreSQL materialized views; export features.

## Router Definition
```ts
export const analyticsRouter = router({
  dashboard: adminProcedure.query(getDashboardMetrics),
  investments: adminProcedure.input(dateRangeSchema).query(getInvestmentAnalytics),
  points: adminProcedure.input(dateRangeSchema).query(getPointsAnalytics),
  impact: adminProcedure.input(dateRangeSchema).query(getImpactMetrics),
  ecommerce: adminProcedure.input(dateRangeSchema).query(getEcommerceAnalytics),
  
  // NOUVEAU: KPIs Business critiques
  businessKpis: adminProcedure.input(dateRangeSchema).query(getBusinessKpis),
  conversionFunnels: adminProcedure.input(funnelSchema).query(getConversionFunnels),
  retentionAnalysis: adminProcedure.input(retentionSchema).query(getRetentionAnalysis),
  cohortAnalysis: adminProcedure.input(cohortSchema).query(getCohortAnalysis),
  
  export: adminProcedure.input(exportSchema).mutation(exportAnalytics),
})
```

## Schemas
```ts
export const dateRangeSchema = z.object({ from: z.date().optional(), to: z.date().optional() })

export const funnelSchema = z.object({ 
  type: z.enum(['registration', 'conversion', 'upgrade']), 
  dateRange: dateRangeSchema.optional() 
})

export const retentionSchema = z.object({ 
  cohortDate: z.date(), 
  periods: z.array(z.enum(['d1', 'd7', 'd30', 'd90'])).default(['d1', 'd7', 'd30'])
})

export const cohortSchema = z.object({ 
  groupBy: z.enum(['month', 'week']), 
  metric: z.enum(['revenue', 'engagement', 'retention']),
  dateRange: dateRangeSchema.optional() 
})

export const exportSchema = z.object({ 
  format: z.enum(['csv','xlsx','pdf']), 
  report: z.enum(['dashboard','investments','points','impact','ecommerce','business_kpis']), 
  params: z.record(z.any()).optional() 
})
```

## Business Rules
- Read from materialized views; schedule refresh via cron.
- Exports paginated and streamed for large datasets; secure links with expiry.

## Security
- Admin-only; redact PII; row-level scoping if needed for partner views.

## Errors
- EXPORT_TOO_LARGE, VIEW_NOT_AVAILABLE, INVALID_DATE_RANGE.

## Testing
- Data consistency vs base tables; export sizes; view refresh logic.

## Observability
- Metrics: query time P95, export generation time, refresh duration.

## Output Models
Reference DTOs are documented for each endpoint below. Dates are ISO strings.

```ts
export interface DashboardMetricsDTO {
  kpis: {
    mrr: number
    arr: number
    activeAmbassadors: number
    totalPointsOutstanding: number
  }
  timeseries: Array<{ date: string; newSubscribers: number; churned: number; pointsEarned: number; pointsSpent: number }>
  funnels: {
    registrationToSubscription: { step: string; value: number }[]
  }
}

// NOUVEAU: KPIs Business critiques
export interface BusinessKpisDTO {
  revenue: {
    mrr: number // Monthly Recurring Revenue
    arr: number // Annual Recurring Revenue
    mrrGrowthRate: number // % croissance mensuelle
    arrTarget: number // 60% du total subscribers
  }
  customers: {
    clv: number // Customer Lifetime Value (€420 target)
    cac: number // Customer Acquisition Cost (<€15 target)
    churnRateMonthly: number // <12% target
    churnRateAnnual: number // <8% target
    monthlyToAnnualConversion: number // >20% target après 6 mois
  }
  engagement: {
    explorateurToProtecteurConversion: number // 30% target dans 90 jours
    protecteurToAmbassadeurConversion: number // 15% target dans 12 mois
    retentionRate: number // 85% target annuel
    pointsUtilization: number // >90% avant expiration
    nps: number // Net Promoter Score >50 target
    sessionFrequency: number // 3+ par semaine target
  }
  billingFrequency: {
    monthlyPercentage: number // 40% target
    annualPercentage: number // 60% target
    conversionRate: number // monthly→annual
  }
}

export interface ConversionFunnelsDTO {
  registration: {
    visitors: number
    registrations: number
    emailVerified: number
    firstInvestment: number
    conversionRate: number
  }
  upgrade: {
    explorateurs: number
    protecteurs: number
    ambassadeurs: number
    upgradeRate: number
  }
  billing: {
    monthlySignups: number
    annualSignups: number
    monthlyToAnnual: number
    annualToMonthly: number
  }
}

export interface RetentionAnalysisDTO {
  cohortDate: string
  cohortSize: number
  retention: {
    d1: number // Day 1 retention
    d7: number // Week 1 retention
    d30: number // Month 1 retention
    d90: number // Quarter 1 retention
  }
  revenue: {
    d1Revenue: number
    d30Revenue: number
    d90Revenue: number
  }
}

export interface InvestmentAnalyticsDTO {
  totals: { count: number; amountEur: number; pointsAwarded: number }
  byProject: Array<{ projectId: string; name: string; count: number; amountEur: number }>
  timeseries: Array<{ date: string; amountEur: number; count: number }>
}

export interface PointsAnalyticsDTO {
  balanceSummary: { totalActive: number; expiring60d: number; expired30d: number }
  flows: Array<{ date: string; earned: number; spent: number; expired: number }>
  topEarners: Array<{ userId: string; email: string; earned: number }>
}

export interface ImpactMetricsDTO {
  aggregates: Record<string, number> // e.g. { bees_supported: 120000, trees_planted: 340 }
  byPartner: Array<{ partner: string; metric: string; value: number; period: string }>
}

export interface EcommerceAnalyticsDTO {
  revenuePoints: { total: number; last30d: number }
  splitByFulfillment: Array<{ type: 'stock'|'dropship'; orders: number; points: number; marginPct: number }>
  topProducts: Array<{ productId: string; name: string; points: number; orders: number }>
  timeseries: Array<{ date: string; orders: number; points: number }>
}

export interface ExportJobDTO {
  jobId: string
  status: 'queued' | 'running' | 'completed' | 'failed'
  downloadUrl?: string // signed URL with expiry
}
```

### Example Responses
```json
// /analytics.dashboard
{
  "kpis": { "mrr": 3200, "arr": 38400, "activeAmbassadors": 215, "totalPointsOutstanding": 74210 },
  "timeseries": [ { "date": "2025-08-01", "newSubscribers": 8, "churned": 1, "pointsEarned": 1200, "pointsSpent": 980 } ],
  "funnels": { "registrationToSubscription": [ { "step": "visited", "value": 1000 }, { "step": "registered", "value": 240 }, { "step": "subscribed", "value": 75 } ] }
}
```

## References
- See `services/analytics-service.md` and `database-schema.md` views section.
- DTOs: `schemas/response-models.md`.
