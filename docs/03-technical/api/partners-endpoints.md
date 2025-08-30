# Partners Endpoints - Make the CHANGE

 tRPC Router: `partners` (admin + partner-app) | Priority: Medium | Weeks: 9-12

## Scope
Partner app auth, project assignments, updates creation with media, moderation workflow, and lightweight partner webhooks.

## Router Definition
```ts
export const partnersRouter = router({
  app: router({
    login: publicProcedure.input(partnerLoginSchema).mutation(partnerLogin),
    me: partnerProcedure.query(getPartnerMe),
    projects: partnerProcedure.query(listAssignedProjects),
    createUpdate: partnerProcedure.input(partnerUpdateCreateSchema).mutation(createProjectUpdate),
    uploadMedia: partnerProcedure.input(mediaUploadSchema).mutation(uploadUpdateMedia),
    myUpdates: partnerProcedure.input(paginationSchema).query(listMyUpdates),
  }),

  admin: router({
    listPartners: adminProcedure.input(paginationSchema).query(listPartners),
    assignProject: adminProcedure.input(assignProjectSchema).mutation(assignProjectToPartner),
    moderateUpdate: adminProcedure.input(moderationSchema).mutation(moderateUpdate),
    
    // NOUVEAU: Gestion complète partenaires
    createPartner: adminProcedure.input(createPartnerSchema).mutation(createPartner),
    updatePartner: adminProcedure.input(updatePartnerSchema).mutation(updatePartner),
    invitePartnerUser: adminProcedure.input(invitePartnerUserSchema).mutation(invitePartnerUser),
    
    // NOUVEAU: Modération workflow complet
    getModerationQueue: adminProcedure.input(moderationQueueSchema).query(getModerationQueue),
    bulkModerateUpdates: adminProcedure.input(bulkModerationSchema).mutation(bulkModerateUpdates),
    getModerationHistory: adminProcedure.input(moderationHistorySchema).query(getModerationHistory),
  })
})
```

## Schemas
```ts
export const partnerLoginSchema = z.object({ email: z.string().email(), password: z.string().min(8) })
export const partnerUpdateCreateSchema = z.object({ projectId: z.string().uuid(), title: z.string().min(3), description: z.string().optional(), update_type: z.enum(['milestone','routine','event']), location: z.object({ lat: z.number(), lng: z.number() }).optional() })
export const mediaUploadSchema = z.object({ updateId: z.string().uuid(), files: z.array(z.object({ name: z.string(), type: z.string(), size: z.number().max(25_000_000) })).max(10) })
export const assignProjectSchema = z.object({ projectId: z.string().uuid(), partnerUserId: z.string().uuid() })
export const moderationSchema = z.object({ updateId: z.string().uuid(), status: z.enum(['approved','rejected']), notes: z.string().optional() })
export const paginationSchema = z.object({ page: z.number().min(1).default(1), limit: z.number().min(1).max(100).default(20) })

// NOUVEAU: Schémas pour gestion complète partenaires
export const createPartnerSchema = z.object({
  name: z.string().min(2).max(255),
  type: z.enum(['beekeeper', 'olive_grower', 'winery', 'cooperative']),
  description: z.string().optional(),
  location: z.object({ lat: z.number(), lng: z.number() }),
  address: z.object({
    street: z.string(),
    city: z.string(),
    postalCode: z.string(),
    country: z.string().length(2),
  }),
  contactInfo: z.object({
    email: z.string().email(),
    phone: z.string().optional(),
    website: z.string().url().optional(),
  }),
  commissionRate: z.number().min(0.10).max(0.30).default(0.15),
  certifications: z.array(z.string()).default([]),
})

export const updatePartnerSchema = z.object({
  id: z.string().uuid(),
  updates: z.object({
    name: z.string().min(2).max(255).optional(),
    description: z.string().optional(),
    commissionRate: z.number().min(0.10).max(0.30).optional(),
    status: z.enum(['active', 'inactive', 'suspended']).optional(),
    certifications: z.array(z.string()).optional(),
  }),
})

export const invitePartnerUserSchema = z.object({
  partnerId: z.string().uuid(),
  email: z.string().email(),
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
  role: z.enum(['owner', 'staff']),
  permissions: z.array(z.string()).default([]),
})

// NOUVEAU: Schémas modération workflow complet
export const moderationQueueSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected', 'all']).default('pending'),
  partnerId: z.string().uuid().optional(),
  projectId: z.string().uuid().optional(),
  priority: z.enum(['high', 'medium', 'low']).optional(),
  pagination: paginationSchema,
  sort: z.enum(['created_at', 'priority', 'partner_name']).default('created_at'),
})

export const bulkModerationSchema = z.object({
  updateIds: z.array(z.string().uuid()).min(1).max(50),
  action: z.enum(['approve', 'reject']),
  notes: z.string().optional(),
  notifyPartners: z.boolean().default(true),
})

export const moderationHistorySchema = z.object({
  updateId: z.string().uuid().optional(),
  moderatorId: z.string().uuid().optional(),
  action: z.enum(['approved', 'rejected']).optional(),
  dateRange: z.object({
    from: z.date().optional(),
    to: z.date().optional(),
  }).optional(),
  pagination: paginationSchema,
})
```

## Business Rules
- Updates default to `pending`; admin moderation required before publish.
- Media uploaded to Blob/Storage; generate thumbnails + validate MIME.
- Partner users limited to assigned projects with granular permissions.

## Security
- Separate partner auth domain; distinct sessions and policies (RLS on `partner_users`, `project_updates_v2`).
- Rate limit media uploads; scan for malware.

## Errors
- PARTNER_AUTH_FAILED, PERMISSION_DENIED, UPDATE_NOT_FOUND, MEDIA_TOO_LARGE.

## Testing
- Login, projects scoping, update lifecycle, moderation states.

## Outputs
- `app.login` → `PartnerLoginResponseDTO`
- `app.me` → `PartnerUserDTO`
- `app.projects` → `Array<PartnerProjectDTO>`
- `app.createUpdate` → `PartnerUpdateDTO`
- `app.uploadMedia` → `Array<MediaUploadDTO>`
- `app.myUpdates` → `Paginated<PartnerUpdateDTO>`

- `admin.listPartners` → `Paginated<PartnerUserAdminDTO>`
- `admin.assignProject` → `{ success: boolean }`
- `admin.moderateUpdate` → `PartnerUpdateDTO`
- `admin.createPartner` → `PartnerDTO`
- `admin.updatePartner` → `PartnerDTO`
- `admin.invitePartnerUser` → `PartnerUserInviteDTO`
- `admin.getModerationQueue` → `Paginated<ModerationQueueItemDTO>`
- `admin.bulkModerateUpdates` → `BulkModerationResultDTO`
- `admin.getModerationHistory` → `Paginated<ModerationHistoryItemDTO>`

See DTOs in `schemas/response-models.md`.

## References
- See `services/partner-service.md` and `integrations/partner-webhooks.md`.
