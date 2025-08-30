# Authentication Endpoints - Make the CHANGE

**🔐 tRPC Router:** `auth` | **📍 Priority:** ⭐️⭐️⭐️ CRITICAL | **🗓️ Week:** 1-2

## Overview

Complete authentication system supporting dual billing choice during registration, KYC integration with Stripe Identity, and secure session management with Supabase Auth.

## 🔄 tRPC Router Definition

```typescript
import { z } from 'zod'
import { publicProcedure, protectedProcedure, router } from '../trpc'

export const authRouter = router({
  register: publicProcedure
    .input(registerSchema)
    .output(registerResponseSchema)
    .mutation(async ({ input, ctx }) => registerUser(input, ctx)),
    
  login: publicProcedure
    .input(loginSchema)
    .output(loginResponseSchema)
    .mutation(async ({ input, ctx }) => loginUser(input, ctx)),
    
  logout: protectedProcedure
    .input(logoutSchema)
    .output(logoutResponseSchema)
    .mutation(async ({ input, ctx }) => logoutUser(input, ctx)),
    
  refreshToken: publicProcedure
    .input(refreshTokenSchema)
    .output(refreshTokenResponseSchema)
    .mutation(async ({ input, ctx }) => refreshUserToken(input, ctx)),
    
  validateEmail: publicProcedure
    .input(validateEmailSchema)
    .output(validateEmailResponseSchema)
    .query(async ({ input, ctx }) => validateEmailAvailability(input, ctx)),
    
  resetPassword: publicProcedure
    .input(resetPasswordSchema)
    .output(resetPasswordResponseSchema)
    .mutation(async ({ input, ctx }) => resetUserPassword(input, ctx)),
    
  confirmEmail: publicProcedure
    .input(confirmEmailSchema)
    .output(confirmEmailResponseSchema)
    .mutation(async ({ input, ctx }) => confirmUserEmail(input, ctx)),
    
  resendConfirmation: publicProcedure
    .input(resendConfirmationSchema)
    .output(resendConfirmationResponseSchema)
    .mutation(async ({ input, ctx }) => resendEmailConfirmation(input, ctx)),
})
```

## 📋 Input/Output Schemas

### Registration Schema
```typescript
export const registerSchema = z.object({
  // Basic info
  email: z.string()
    .email('Invalid email format')
    .max(254, 'Email too long')
    .transform(email => email.toLowerCase()),
    
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long')
    .refine(password => /[A-Z]/.test(password), 'Password must contain uppercase letter')
    .refine(password => /[a-z]/.test(password), 'Password must contain lowercase letter')
    .refine(password => /\d/.test(password), 'Password must contain number')
    .refine(password => /[^A-Za-z0-9]/.test(password), 'Password must contain special character'),
    
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name too long')
    .regex(/^[a-zA-ZÀ-ÿ\s-']+$/, 'Invalid characters in first name'),
    
  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name too long')
    .regex(/^[a-zA-ZÀ-ÿ\s-']+$/, 'Invalid characters in last name'),
    
  // Legal consent
  acceptedTerms: z.boolean()
    .refine(val => val === true, 'Terms and conditions must be accepted'),
    
  acceptedPrivacy: z.boolean()
    .refine(val => val === true, 'Privacy policy must be accepted'),
    
  // NOUVEAU: Dual Billing Choice
  billingFrequency: z.enum(['monthly', 'annual'])
    .default('monthly'),
    
  subscriptionTier: z.enum(['ambassadeur_standard', 'ambassadeur_premium'])
    .optional(),
    
  // Optional metadata
  source: z.enum(['mobile', 'web']).optional(),
  deviceInfo: z.object({
    platform: z.enum(['ios', 'android', 'web']).optional(),
    version: z.string().optional(),
    deviceId: z.string().optional(),
  }).optional(),
  
  // Marketing consent
  marketingConsent: z.boolean().default(false),
  
  // Referral tracking
  referralCode: z.string().optional(),
})

export const registerResponseSchema = z.object({
  success: z.boolean(),
  user: z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    userLevel: z.enum(['explorateur', 'protecteur', 'ambassadeur']),
    pointsBalance: z.number(),
    emailVerified: z.boolean(),
    createdAt: z.date(),
  }).optional(),
  
  session: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    expiresAt: z.date(),
    sessionId: z.string().uuid(),
  }).optional(),
  
  // NOUVEAU: Stripe customer for billing
  stripeCustomer: z.object({
    id: z.string(),
    setupIntentClientSecret: z.string().optional(), // For payment method setup
  }).optional(),
  
  // Error handling
  error: z.object({
    code: z.enum([
      'EMAIL_ALREADY_EXISTS',
      'INVALID_EMAIL_DOMAIN', 
      'PASSWORD_TOO_WEAK',
      'INVALID_INPUT',
      'RATE_LIMIT_EXCEEDED',
      'SERVER_ERROR'
    ]),
    message: z.string(),
    field: z.string().optional(), // Which field caused the error
  }).optional(),
})
```

### Login Schema
```typescript
export const loginSchema = z.object({
  email: z.string()
    .email('Invalid email format')
    .transform(email => email.toLowerCase()),
    
  password: z.string()
    .min(1, 'Password required'),
    
  rememberMe: z.boolean().default(false),
  
  deviceInfo: z.object({
    platform: z.enum(['ios', 'android', 'web']).optional(),
    deviceName: z.string().optional(),
    ipAddress: z.string().optional(),
  }).optional(),
})

export const loginResponseSchema = z.object({
  success: z.boolean(),
  
  user: z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    userLevel: z.enum(['explorateur', 'protecteur', 'ambassadeur']),
    pointsBalance: z.number(),
    emailVerified: z.boolean(),
    lastLoginAt: z.date(),
    
    // Profile completion status
    profileComplete: z.boolean(),
    kycStatus: z.enum(['pending', 'light', 'complete']),
    
    // Billing info
    hasActiveSubscription: z.boolean(),
    billingFrequency: z.enum(['monthly', 'annual']).optional(),
  }).optional(),
  
  session: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    expiresAt: z.date(),
    sessionId: z.string().uuid(),
  }).optional(),
  
  // First login experience
  isFirstLogin: z.boolean(),
  onboardingStep: z.string().optional(),
  
  error: z.object({
    code: z.enum([
      'INVALID_CREDENTIALS',
      'EMAIL_NOT_VERIFIED',
      'ACCOUNT_SUSPENDED',
      'ACCOUNT_NOT_FOUND',
      'RATE_LIMIT_EXCEEDED',
      'SERVER_ERROR'
    ]),
    message: z.string(),
    retryAfter: z.number().optional(), // Seconds to wait before retry
  }).optional(),
})
```

### Email Validation Schema
```typescript
export const validateEmailSchema = z.object({
  email: z.string()
    .email('Invalid email format')
    .transform(email => email.toLowerCase()),
})

export const validateEmailResponseSchema = z.object({
  valid: z.boolean(),
  available: z.boolean(),
  
  // Email suggestions if invalid/unavailable
  suggestions: z.array(z.string().email()).optional(),
  
  // Domain validation
  domain: z.object({
    valid: z.boolean(),
    disposable: z.boolean(), // Temporary email domains
    roleAccount: z.boolean(), // info@, admin@, etc.
  }),
  
  // Corporate domain detection
  corporate: z.boolean(),
})
```

### Password Reset Schemas
```typescript
export const resetPasswordSchema = z.object({
  email: z.string()
    .email('Invalid email format')
    .transform(email => email.toLowerCase()),
})

export const resetPasswordResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  
  // Rate limiting info
  cooldownPeriod: z.number().optional(), // Seconds until next reset allowed
  
  error: z.object({
    code: z.enum([
      'EMAIL_NOT_FOUND',
      'TOO_MANY_REQUESTS',
      'SERVER_ERROR'
    ]),
    message: z.string(),
  }).optional(),
})

export const confirmPasswordResetSchema = z.object({
  token: z.string().uuid(),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long'),
})
```

## 🔧 Business Logic Implementation

### Registration Flow with Dual Billing
```typescript
export async function registerUser(
  input: RegisterInput, 
  ctx: Context
): Promise<RegisterResponse> {
  // 1. Validate email availability
  const emailCheck = await validateEmailAvailability({ email: input.email }, ctx)
  if (!emailCheck.available) {
    throw new TRPCError({
      code: 'CONFLICT',
      message: 'Email already registered',
    })
  }
  
  // 2. Create Supabase user
  const { user, error: authError } = await ctx.supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        userLevel: 'explorateur', // Default level
        billingFrequency: input.billingFrequency,
      }
    }
  })
  
  if (authError || !user) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to create user account',
    })
  }
  
  // 3. Create Stripe customer for future billing
  const stripeCustomer = await ctx.stripe.customers.create({
    email: input.email,
    name: `${input.firstName} ${input.lastName}`,
    metadata: {
      userId: user.id,
      billingFrequency: input.billingFrequency,
      source: input.source || 'web',
    }
  })
  
  // 4. Create user profile in database
  const userProfile = await ctx.db.user.create({
    data: {
      id: user.id,
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      userLevel: 'explorateur',
      pointsBalance: 0,
      stripeCustomerId: stripeCustomer.id,
      billingFrequency: input.billingFrequency,
      marketingConsent: input.marketingConsent,
      referralCode: input.referralCode,
    }
  })
  
  // 5. Generate session tokens
  const session = await generateSessionTokens(user.id)
  
  // 6. Send welcome email with verification
  await ctx.emailService.sendWelcomeEmail({
    email: input.email,
    firstName: input.firstName,
    billingFrequency: input.billingFrequency,
  })
  
  // 7. Track registration analytics
  await ctx.analytics.track('user_registered', {
    userId: user.id,
    billingFrequency: input.billingFrequency,
    source: input.source,
    hasReferral: !!input.referralCode,
  })
  
  return {
    success: true,
    user: {
      id: user.id,
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      userLevel: 'explorateur',
      pointsBalance: 0,
      emailVerified: false,
      createdAt: new Date(),
    },
    session,
    stripeCustomer: {
      id: stripeCustomer.id,
    }
  }
}
```

### Login Flow with Security
```typescript
export async function loginUser(
  input: LoginInput, 
  ctx: Context
): Promise<LoginResponse> {
  // 1. Rate limiting check
  const rateLimitKey = `login_attempts:${ctx.ip}`
  const attempts = await ctx.redis.incr(rateLimitKey)
  
  if (attempts === 1) {
    await ctx.redis.expire(rateLimitKey, 900) // 15 minutes window
  }
  
  if (attempts > 5) {
    throw new TRPCError({
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many login attempts. Try again in 15 minutes.',
    })
  }
  
  // 2. Attempt login with Supabase
  const { data, error } = await ctx.supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  })
  
  if (error || !data.user) {
    // Increment failed attempts
    await ctx.redis.incr(rateLimitKey)
    
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Invalid email or password',
    })
  }
  
  // 3. Get user profile from database
  const userProfile = await ctx.db.user.findUnique({
    where: { id: data.user.id },
    include: {
      subscriptions: {
        where: { status: 'active' },
        select: { tier: true, billingFrequency: true }
      }
    }
  })
  
  if (!userProfile) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'User profile not found',
    })
  }
  
  // 4. Check account status
  if (userProfile.status === 'suspended') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Account suspended. Contact support.',
    })
  }
  
  // 5. Update last login timestamp
  await ctx.db.user.update({
    where: { id: data.user.id },
    data: { 
      lastLoginAt: new Date(),
      lastIpAddress: ctx.ip,
    }
  })
  
  // 6. Generate session tokens
  const session = await generateSessionTokens(data.user.id, input.rememberMe)
  
  // 7. Log security event
  await ctx.db.securityEvent.create({
    data: {
      userId: data.user.id,
      type: 'login_success',
      ipAddress: ctx.ip,
      userAgent: ctx.userAgent,
      deviceInfo: input.deviceInfo,
    }
  })
  
  // 8. Clear rate limiting on success
  await ctx.redis.del(rateLimitKey)
  
  // 9. Track analytics
  await ctx.analytics.track('user_login', {
    userId: data.user.id,
    platform: input.deviceInfo?.platform,
    isFirstLogin: !userProfile.lastLoginAt,
  })
  
  return {
    success: true,
    user: {
      id: userProfile.id,
      email: userProfile.email,
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      userLevel: userProfile.userLevel,
      pointsBalance: userProfile.pointsBalance,
      emailVerified: !!data.user.email_confirmed_at,
      lastLoginAt: new Date(),
      profileComplete: checkProfileComplete(userProfile),
      kycStatus: userProfile.kycStatus,
      hasActiveSubscription: userProfile.subscriptions.length > 0,
      billingFrequency: userProfile.subscriptions[0]?.billingFrequency,
    },
    session,
    isFirstLogin: !userProfile.lastLoginAt,
    onboardingStep: userProfile.onboardingStep,
  }
}
```

Note: The example shows Redis-style counters. For MVP we implement Postgres-only rate limiting; see `services/rate-limiting.md` for the production approach and replace Redis calls accordingly.

## 🔒 Security Implementation

### Rate Limiting Strategy (PostgreSQL-only)
Postgres-based counters using a small table and a helper function. See `services/rate-limiting.md`.

Recommended thresholds:
- `auth.register`: 3 attempts / 15 minutes
- `auth.login`: 5 attempts / 15 minutes
- `auth.resetPassword`: 3 attempts / hour

On block, return unified error with `code: 'RATE_LIMITED'` and `retryAfterSeconds`.

### Session Management
```typescript
interface SessionTokens {
  accessToken: string // JWT, 1 hour expiry
  refreshToken: string // UUID, 30 days expiry (7 days if not "remember me")
  sessionId: string // Database session tracking
}

// JWT payload structure
interface AccessTokenPayload {
  userId: string
  email: string
  userLevel: 'explorateur' | 'protecteur' | 'ambassadeur'
  sessionId: string
  iat: number
  exp: number
}
```

### Email Domain Validation
```typescript
const BLOCKED_EMAIL_DOMAINS = [
  'tempmail.org',
  '10minutemail.com',
  'guerrillamail.com',
  'mailinator.com',
  // ... extensive list of temporary email domains
]

const ROLE_ACCOUNT_PATTERNS = [
  /^admin@/,
  /^info@/,
  /^contact@/,
  /^support@/,
  /^noreply@/,
  /^no-reply@/,
]

export function validateEmailDomain(email: string): EmailDomainValidation {
  const domain = email.split('@')[1]?.toLowerCase()
  
  return {
    valid: !BLOCKED_EMAIL_DOMAINS.includes(domain),
    disposable: BLOCKED_EMAIL_DOMAINS.includes(domain),
    roleAccount: ROLE_ACCOUNT_PATTERNS.some(pattern => pattern.test(email)),
    corporate: detectCorporateDomain(domain),
  }
}
```

## 🚨 Error Handling

### Error Types and Responses
```typescript
export const AUTH_ERROR_CODES = {
  // Registration errors
  EMAIL_ALREADY_EXISTS: 'This email is already registered',
  INVALID_EMAIL_DOMAIN: 'Email domain not allowed',
  PASSWORD_TOO_WEAK: 'Password does not meet security requirements',
  
  // Login errors
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_NOT_VERIFIED: 'Please verify your email address',
  ACCOUNT_SUSPENDED: 'Account suspended. Contact support.',
  ACCOUNT_NOT_FOUND: 'Account not found',
  
  // Rate limiting
  RATE_LIMIT_EXCEEDED: 'Too many attempts. Please try again later.',
  
  // Password reset
  EMAIL_NOT_FOUND: 'No account found with this email address',
  TOO_MANY_REQUESTS: 'Password reset requested too recently',
  INVALID_RESET_TOKEN: 'Invalid or expired reset token',
  
  // Server errors
  SERVER_ERROR: 'An unexpected error occurred. Please try again.',
  SUPABASE_ERROR: 'Authentication service temporarily unavailable',
  STRIPE_ERROR: 'Billing service temporarily unavailable',
} as const
```

### Error Recovery Strategies
```typescript
export async function handleAuthError(error: unknown, operation: string) {
  if (error instanceof TRPCError) {
    // Log structured error
    await logger.error('Auth operation failed', {
      operation,
      code: error.code,
      message: error.message,
      timestamp: new Date().toISOString(),
    })
    
    // Return user-friendly error
    throw error
  }
  
  // Handle unexpected errors
  await logger.error('Unexpected auth error', {
    operation,
    error: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined,
  })
  
  throw new TRPCError({
    code: 'INTERNAL_SERVER_ERROR',
    message: AUTH_ERROR_CODES.SERVER_ERROR,
  })
}
```

## 📊 Analytics & Monitoring

### Key Metrics to Track
```typescript
interface AuthMetrics {
  registration: {
    total_attempts: number
    successful_registrations: number
    conversion_rate: number
    billing_frequency_choice: {
      monthly: number
      annual: number
    }
    abandonment_points: {
      email_step: number
      password_step: number
      billing_step: number
      terms_step: number
    }
  }
  
  login: {
    total_attempts: number
    successful_logins: number
    failed_attempts: number
    rate_limited_attempts: number
    average_session_duration: number
  }
  
  security: {
    suspicious_login_attempts: number
    password_reset_requests: number
    email_verification_rate: number
    session_hijacking_attempts: number
  }
}
```

## ✅ Testing Strategy

### Unit Tests
```typescript
describe('Auth Endpoints', () => {
  describe('register', () => {
    it('should create user with monthly billing preference', async () => {
      const input = createMockRegisterInput({ billingFrequency: 'monthly' })
      const result = await authRouter.register({ input, ctx: mockContext })
      
      expect(result.success).toBe(true)
      expect(result.user?.id).toBeDefined()
      expect(result.stripeCustomer?.id).toBeDefined()
    })
    
    it('should reject registration with existing email', async () => {
      const input = createMockRegisterInput({ email: 'existing@example.com' })
      
      await expect(authRouter.register({ input, ctx: mockContext }))
        .rejects.toThrow('EMAIL_ALREADY_EXISTS')
    })
    
    it('should enforce password complexity requirements', async () => {
      const input = createMockRegisterInput({ password: 'weak' })
      
      await expect(authRouter.register({ input, ctx: mockContext }))
        .rejects.toThrow('PASSWORD_TOO_WEAK')
    })
  })
  
  describe('login', () => {
    it('should authenticate valid user', async () => {
      const input = createMockLoginInput()
      const result = await authRouter.login({ input, ctx: mockContext })
      
      expect(result.success).toBe(true)
      expect(result.session?.accessToken).toBeDefined()
    })
    
    it('should rate limit excessive login attempts', async () => {
      const input = createMockLoginInput({ email: 'test@example.com' })
      
      // Simulate 6 failed attempts
      for (let i = 0; i < 6; i++) {
        try {
          await authRouter.login({ input, ctx: mockContext })
        } catch {} // Ignore failures
      }
      
      await expect(authRouter.login({ input, ctx: mockContext }))
        .rejects.toThrow('RATE_LIMIT_EXCEEDED')
    })
  })
})
```

### Integration Tests
```typescript
describe('Auth Integration', () => {
  it('should complete full registration → login flow', async () => {
    // 1. Register user
    const registerResult = await testClient.auth.register.mutate(mockRegisterInput)
    expect(registerResult.success).toBe(true)
    
    // 2. Verify email (simulate)
    await testClient.auth.confirmEmail.mutate({
      token: registerResult.emailConfirmationToken
    })
    
    // 3. Login with registered credentials
    const loginResult = await testClient.auth.login.mutate({
      email: mockRegisterInput.email,
      password: mockRegisterInput.password
    })
    
    expect(loginResult.success).toBe(true)
    expect(loginResult.user?.emailVerified).toBe(true)
  })
})
```

## 🔗 Dependencies

### External Services
- **Supabase Auth** - Primary authentication provider
- **Stripe API** - Customer creation for billing
- **Email Service** - Welcome emails and verification
- **Analytics Service** - Event tracking

### Infrastructure Notes
- Rate limiting uses PostgreSQL only (no Redis) per `services/rate-limiting.md`.

### Internal Dependencies
- User database models
- Email template system
- Security logging service
- Session management utilities

---

**⚡ Implementation Priority:** CRITICAL - Required for all user flows
**🧪 Test Coverage Target:** 95% - Security critical functionality
**📈 Performance Target:** <200ms P95 response time
**🔒 Security Level:** Maximum - Authentication is the security foundation
