# Projects Endpoints - Make the CHANGE

 tRPC Router: `projects` | Priority: High | Weeks: 2-5

## Scope
Public discovery, project details, nearby search, updates feed; Admin CRUD and status management.

## Router Definition
```ts
export const projectsRouter = router({
  list: publicProcedure.input(projectFiltersSchema).query(listProjects),
  bySlug: publicProcedure.input(z.object({ slug: z.string() })).query(getProjectBySlug),
  nearby: publicProcedure.input(locationSearchSchema).query(getNearbyProjects),
  updates: publicProcedure.input(projectUpdatesListSchema).query(listProjectUpdates),

  admin: adminProcedure.router({
    create: adminProcedure.input(projectCreateSchema).mutation(createProject),
    update: adminProcedure.input(projectUpdateSchema).mutation(updateProject),
    changeStatus: adminProcedure.input(projectStatusSchema).mutation(changeProjectStatus),
    setFeatured: adminProcedure.input(z.object({ id: z.string().uuid(), featured: z.boolean() })).mutation(setFeatured),
  })
})
```

## Outputs
- `list` → `Paginated<ProjectSummaryDTO>`
- `bySlug` → `ProjectDetailDTO`
- `nearby` → `Paginated<ProjectSummaryDTO>`
- `updates` → `Paginated<{ id: string; title: string; update_type: 'milestone'|'routine'|'event'; publishedAt: string; media: string[] }>`

See DTOs in `schemas/response-models.md`.

## Schemas
```ts
export const paginationSchema = z.object({ page: z.number().min(1).default(1), limit: z.number().min(1).max(100).default(20) })

export const projectFiltersSchema = z.object({
  type: z.enum(['beehive', 'olive_tree', 'vineyard']).optional(),
  status: z.enum(['active', 'funded']).optional(),
  featured: z.boolean().optional(),
  q: z.string().max(64).optional(),
  pagination: paginationSchema,
  sort: z.enum(['created_at', 'funding_progress', 'supporters_count']).default('funding_progress')
})

export const locationSearchSchema = z.object({ lat: z.number(), lng: z.number(), radius: z.number().max(100_000) })

export const projectCreateSchema = z.object({
  basic: z.object({ name: z.string(), type: z.enum(['beehive', 'olive_tree', 'vineyard']), short_description: z.string(), long_description: z.string().optional() }),
  slug: z.string().min(3),
  location: z.object({ coordinates: z.tuple([z.number(), z.number()]), address: z.any() }),
  partner: z.object({ producer_id: z.string().uuid(), certifications: z.array(z.string()).default([]) }),
  funding: z.object({ target_amount: z.number().int().positive(), funding_deadline: z.date().optional() }),
  media: z.object({ hero_image: z.string().url(), gallery: z.array(z.string().url()).default([]) }),
})

export const projectUpdateSchema = z.object({ id: z.string().uuid(), updates: z.record(z.any()) })
export const projectStatusSchema = z.object({ id: z.string().uuid(), status: z.enum(['active', 'funded', 'closed', 'suspended']), reason: z.string().optional() })

export const projectUpdatesListSchema = z.object({ projectId: z.string().uuid(), pagination: paginationSchema })
```

## Business Rules
- Slug uniqueness; immutable once published.
- Funding progress computed from investments + subscriptions allocation.
- Nearby search uses PostGIS with radius; cap radius to protect performance.
- Status transitions: draft→active; active→funded/closed/suspended with reason and optional partner notification webhook.

## Security
- Public reads through restricted columns; admin writes restricted by role.
- Media uploads via signed URLs; virus scanning as needed.

## Errors
- PROJECT_NOT_FOUND, SLUG_TAKEN, INVALID_LOCATION, STATUS_TRANSITION_INVALID.

## Testing
- List with filters/sorting; nearest ordering; slug detail with related producer and updates pagination.
- Admin create/update and status change auditing.

## Observability
- Audit: project_create/update/status_change; partner_notification_sent/failed.

## References
- See `services/partner-service.md` for updates moderation, and `services/analytics-service.md` for popularity metrics.
