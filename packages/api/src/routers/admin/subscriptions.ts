/**
 * Admin Subscriptions Router
 */
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createRouter, adminProcedure } from '../../trpc'
import { createClient } from '@supabase/supabase-js'

// Supabase service client
const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

export const adminSubscriptionsRouter = createRouter({
  list: adminProcedure
    .input(z.object({
      status: z.enum(['active', 'cancelled', 'paused', 'expired']).optional(),
      userId: z.string().uuid().optional(),
      limit: z.number().int().min(1).max(100).default(50),
      cursor: z.string().uuid().optional(),
    }).optional())
    .query(async ({ input }) => {
      let query = supabase
        .from('subscriptions')
        .select(`
          *,
          user:users(id, email, user_level)
        `)
        .order('created_at', { ascending: false })

      if (input?.status) query = query.eq('status', input.status)
      if (input?.userId) query = query.eq('user_id', input.userId)
      if (input?.cursor) query = query.lt('id', input.cursor)
      query = query.limit(input?.limit ?? 50)

      const { data, error } = await query
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return { items: data, nextCursor: data?.at(-1)?.id ?? null }
    }),

  detail: adminProcedure
    .input(z.object({ subscriptionId: z.string().uuid() }))
    .query(async ({ input }) => {
      const { data, error } = await supabase
        .from('subscriptions')
        .select(`
          *,
          user:users(id, email, user_level, points_balance)
        `)
        .eq('id', input.subscriptionId)
        .single()
      if (error) throw new TRPCError({ code: 'NOT_FOUND', message: 'Subscription not found' })
      return data
    }),

  update: adminProcedure
    .input(z.object({
      subscriptionId: z.string().uuid(),
      patch: z.object({
        status: z.enum(['active', 'cancelled', 'paused', 'expired']).optional(),
        monthly_amount: z.number().min(0).optional(),
        admin_notes: z.string().optional(),
      }).refine((p) => Object.keys(p).length > 0, 'Patch cannot be empty'),
    }))
    .mutation(async ({ input }) => {
      const { data, error } = await supabase
        .from('subscriptions')
        .update(input.patch as any)
        .eq('id', input.subscriptionId)
        .select()
        .single()
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  cancel: adminProcedure
    .input(z.object({
      subscriptionId: z.string().uuid(),
      reason: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { data, error } = await supabase
        .from('subscriptions')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
          admin_notes: input.reason,
        })
        .eq('id', input.subscriptionId)
        .select()
        .single()
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  stats: adminProcedure
    .query(async () => {
      // Get subscription statistics
      const { data: stats, error } = await supabase
        .from('subscriptions')
        .select('status, monthly_amount')

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })

      const summary = stats?.reduce((acc, sub) => {
        acc.total += 1
        acc.byStatus[sub.status] = (acc.byStatus[sub.status] || 0) + 1
        if (sub.status === 'active') {
          acc.monthlyRevenue += sub.monthly_amount || 0
        }
        return acc
      }, {
        total: 0,
        byStatus: {} as Record<string, number>,
        monthlyRevenue: 0
      }) || { total: 0, byStatus: {}, monthlyRevenue: 0 }

      return summary
    }),
})