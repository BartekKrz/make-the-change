/**
 * Points Router
 */
import { TRPCError } from '@trpc/server'
import { createClient } from '@supabase/supabase-js'
import { createRouter, protectedProcedure } from '../trpc'

// Supabase service client
const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

export const pointsRouter = createRouter({
  balance: protectedProcedure.query(async ({ ctx }) => {
    const { data, error } = await supabase
      .from('users')
      .select('points_balance')
      .eq('id', (ctx.user as any).id)
      .single()
    if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
    return { balance: data.points_balance as number }
  }),
})