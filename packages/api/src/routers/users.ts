/**
 * Users Router (Public)
 */
import { TRPCError } from '@trpc/server'
import { createClient } from '@supabase/supabase-js'
import { createRouter, protectedProcedure } from '../trpc'
import { authRouter } from './auth'

// Supabase service client
const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

export const usersRouter = createRouter({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    // Delegate to auth.me
    return authRouter.createCaller(ctx).me()
  }),

  getPointsBalance: protectedProcedure.query(async ({ ctx }) => {
    const { data, error } = await supabase
      .from('users')
      .select('points_balance')
      .eq('id', (ctx.user as any).id)
      .single()
    if (error) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch points balance' })
    }
    return data.points_balance as number
  }),
})