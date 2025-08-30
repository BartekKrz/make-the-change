# API Contracts (tRPC) - Make the CHANGE

 Scope: Router tree, naming conventions, error mapping, and RSC vs HTTP usage.

## App Router Tree
```ts
export const appRouter = router({
  auth: authRouter,
  users: usersRouter,
  projects: projectsRouter,
  investments: investmentsRouter,
  subscriptions: subscriptionsRouter,
  points: pointsRouter,
  products: productsRouter,
  orders: ordersRouter,
  partners: partnersRouter,
  analytics: analyticsRouter,
  notifications: notificationsRouter,
})
export type AppRouter = typeof appRouter
```

## Conventions
- Queries: list/get/bySlug/nearby; Mutations: create/update/delete/cancel/changeStatus.
- Input validation via Zod; output typing explicit when useful.
- Error mapping: use typed TRPCError codes; standardize client-facing messages.
 - Outputs: adopt `Paginated<T>` and DTOs from `schemas/response-models.md`; unify error shape via `ErrorObject`.

## RSC vs HTTP
- Server Components: `createCaller(ctx)` for SSR data; tag with revalidate for caching.
- Client: `@trpc/react-query` with TanStack Query, invalidations after mutations.

## Versioning
- Routers are versionless internally; breaking changes coordinated with app releases.

## Security
- Procedures wrapped in `protectedProcedure`/`adminProcedure`/`partnerProcedure` as appropriate.

## References
- `architecture-overview.md` (tRPC patterns), `api/*-endpoints.md`.
 - `schemas/response-models.md` (DTOs, pagination, error contract).
