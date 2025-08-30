# Users Endpoints - Make the CHANGE

 tRPC Router: `users` | Priority: High | Weeks: 1-3

## Scope
Profile, preferences, addresses, sessions/devices, and KYC with Stripe Identity. All endpoints are protected unless marked public.

## Router Definition
```ts
export const usersRouter = router({
  me: protectedProcedure.query(getMe),
  update: protectedProcedure.input(updateUserSchema).mutation(updateUser),

  preferences: router({
    get: protectedProcedure.query(getPreferences),
    update: protectedProcedure.input(updatePreferencesSchema).mutation(updatePreferences),
  }),

  addresses: router({
    list: protectedProcedure.query(listAddresses),
    create: protectedProcedure.input(addressCreateSchema).mutation(createAddress),
    update: protectedProcedure.input(addressUpdateSchema).mutation(updateAddress),
    delete: protectedProcedure.input(idSchema).mutation(deleteAddress),
    setDefault: protectedProcedure.input(idSchema).mutation(setDefaultAddress),
  }),

  security: router({
    sessions: protectedProcedure.query(listSessions),
    revokeSession: protectedProcedure.input(idSchema).mutation(revokeSession),
    devices: protectedProcedure.query(listDevices),
    revokeDevice: protectedProcedure.input(idSchema).mutation(revokeDevice),
  }),

  kyc: router({
    initiate: protectedProcedure.input(kycInitiateSchema).output(kycInitiateResponseSchema).mutation(initiateKyc),
    status: protectedProcedure.output(kycStatusResponseSchema).query(getKycStatus),
    process: publicProcedure.input(kycWebhookSchema).output(kycProcessResponseSchema).mutation(processKycResult), // Stripe webhook callback
  }),
})
```

## Schemas (Zod)
```ts
export const idSchema = z.object({ id: z.string().uuid() })

export const updateUserSchema = z.object({
  firstName: z.string().min(2).max(50).optional(),
  lastName: z.string().min(2).max(50).optional(),
  phone: z.string().optional(),
  avatarUrl: z.string().url().optional(),
})

export const updatePreferencesSchema = z.object({
  locale: z.enum(['fr', 'en']).optional(),
  marketingConsent: z.boolean().optional(),
  notificationPreferences: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(true),
    sms: z.boolean().default(false),
  }).partial(),
})

export const addressSchema = z.object({
  label: z.string().max(100).optional(),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  street: z.string().min(3),
  city: z.string().min(2),
  postalCode: z.string().min(2),
  country: z.string().length(2),
  phone: z.string().optional(),
  isDefault: z.boolean().optional(),
})
export const addressCreateSchema = z.object({ address: addressSchema })
export const addressUpdateSchema = z.object({ id: z.string().uuid(), address: addressSchema.partial() })

export const kycInitiateSchema = z.object({ level: z.enum(['light', 'complete']) })

export const kycInitiateResponseSchema = z.object({
  success: z.boolean(),
  sessionUrl: z.string().url().optional(),
  message: z.string().optional(),
  error: z.object({
    code: z.enum(['ALREADY_VERIFIED', 'RATE_LIMIT_EXCEEDED', 'STRIPE_IDENTITY_ERROR']),
    message: z.string(),
  }).optional(),
})

export const kycStatusResponseSchema = z.object({
  status: z.enum(['pending', 'light', 'complete', 'failed']),
  level: z.number(),
  currentLimits: z.object({
    maxInvestment: z.number(),
    maxWithdrawal: z.number(),
  }),
  nextLevelRequirements: z.object({
    level: z.string(),
    requirements: z.array(z.string()),
    maxAmount: z.number(),
  }).optional(),
  lastUpdated: z.date(),
})

export const kycWebhookSchema = z.object({ sessionId: z.string(), event: z.string() })

export const kycProcessResponseSchema = z.object({
  success: z.boolean(),
  error: z.object({
    code: z.enum(['SESSION_NOT_FOUND', 'INVALID_SIGNATURE', 'PROCESSING_ERROR']),
    message: z.string(),
  }).optional(),
})
```

## Business Logic
- Self access only enforced by RLS and `ctx.user.id` checks.
- KYC thresholds: light ≥ €100; complete ≥ €1000 lifetime payments.
- Revoking session logs security event and invalidates refresh token.
- Default address uniqueness per user (partial unique index). Setting a default unsets any previous default.

## Security
- RLS on `users`, `user_profiles`, `user_sessions`, addresses table.
- Rate limit: update (20/min), addresses (60/min), KYC initiate (5/day).
- PII minimization: mask phone, avoid logging personal data.

## Errors
- USER_NOT_FOUND, VALIDATION_ERROR, SESSION_NOT_FOUND, KYC_UNAVAILABLE, RATE_LIMITED.

## Testing
- Me returns joined profile with active subscription flags.
- Address CRUD with default switching and RLS denial cross-user.
- KYC flow: initiate → webhook → status update.

## Observability
- Audit: profile_update, address_create/update/delete, session_revoked, kyc_started/approved/denied.

## References
- See `services/auth-service.md`, `services/notification-service.md`.

## Outputs
- `me` → `UserMeDTO`
- `update` → `UserMeDTO`

- `preferences.get` → `PreferencesDTO`
- `preferences.update` → `PreferencesDTO`

- `addresses.list` → `Array<AddressDTO>`
- `addresses.create` → `AddressDTO`
- `addresses.update` → `AddressDTO`
- `addresses.delete` → `{ success: boolean }`
- `addresses.setDefault` → `AddressDTO`

- `security.sessions` → `Array<SessionDTO>`
- `security.revokeSession` → `{ success: boolean }`
- `security.devices` → `Array<DeviceDTO>`
- `security.revokeDevice` → `{ success: boolean }`

- `kyc.initiate` → `{ success: boolean; sessionUrl?: string }`
- `kyc.status` → `KycStatusDTO`
- `kyc.process` → `{ success: boolean }` (Stripe webhook callback)

See DTOs in `schemas/response-models.md`.
