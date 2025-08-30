# Zod Schemas (Shared) - Make the CHANGE

 Scope: Shared validation schemas and patterns for tRPC routers.

## Base Types
```ts
export const UUID = z.string().uuid()
export const Slug = z.string().regex(/^[a-z0-9-]{3,}$/)
export const Pagination = z.object({ page: z.number().min(1).default(1), limit: z.number().min(1).max(100).default(20) })
export const DateRange = z.object({ from: z.date().optional(), to: z.date().optional() })
export const MoneyCents = z.number().int().nonnegative()
export const Points = z.number().int().nonnegative()
```

## Common Objects
```ts
export const Address = z.object({
  firstName: z.string().min(2), lastName: z.string().min(2),
  street: z.string().min(3), city: z.string().min(2),
  postalCode: z.string().min(2), country: z.string().length(2),
  phone: z.string().optional(),
})

export const SecurityEvent = z.object({ type: z.string(), ipAddress: z.string().optional(), userAgent: z.string().optional() })
```

## Patterns
```ts
// Idempotency key derivation
export function makeIdempotencyKey(parts: string[]) { return parts.join(':') }

// Standard error object (unified across routers)
export const ErrorObject = z.object({
  code: z.string(),
  message: z.string(),
  field: z.string().optional(),
  retryAfterSeconds: z.number().optional(),
  details: z.record(z.any()).optional(),
})
```

## Usage
- Import from a `packages/shared` library when implemented; keep parity across routers.
