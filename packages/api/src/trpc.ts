/**
 * tRPC Base Configuration and Procedures
 */
import { initTRPC, TRPCError } from '@trpc/server'
import { createClient } from '@supabase/supabase-js'
import type { TRPCContext } from './context'

// Supabase service client for middlewares
const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// Initialize tRPC
export const t = initTRPC.context<TRPCContext>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof Error && error.cause.name === 'ZodError'
            ? (error.cause as any).flatten?.() || null
            : null,
      },
    }
  },
})

// Auth middleware
export const isAuthenticated = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Authentication required' })
  }
  return next({ ctx: { ...ctx, user: ctx.user } })
})

// Admin guard using email allowlist or DB user_level
export const isAdminMw = t.middleware(async ({ ctx, next }) => {
  if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' })

  const allow = (process.env.ADMIN_EMAIL_ALLOWLIST || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)

  const email = (((ctx.user as any)?.email as string) || '').toLowerCase()
  let allowed = false

  if (allow.length) {
    allowed = allow.includes(email)
  } else {
    const { data } = await supabase
      .from('users')
      .select('user_level')
      .eq('id', (ctx.user as any).id)
      .single()
    allowed = ['admin', 'super_admin'].includes(((data as any)?.user_level ?? '').toLowerCase())
  }

  if (!allowed) throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' })
  return next()
})

// Base procedures
export const publicProcedure = t.procedure
export const protectedProcedure = publicProcedure.use(isAuthenticated)
export const adminProcedure = protectedProcedure.use(isAdminMw)

// Helper function to create routers
export const createRouter = t.router