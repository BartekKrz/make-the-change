/**
 * Investments Router
 */
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'
import { createRouter, protectedProcedure } from '../trpc'
import { calculateInvestmentPoints } from '@make-the-change/shared'

// Supabase service client
const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

export const investmentsRouter = createRouter({
  createAdoption: protectedProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        type: z.enum(['beehive', 'olive_tree', 'family_plot']),
        eurAmount: z.number().positive(),
        partner: z.enum(['habeebee', 'ilanga', 'promiel', 'multi']).default('habeebee'),
        bonusPercentage: z.number().min(0).max(100).default(30),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const calc = calculateInvestmentPoints({
        type: input.type,
        amount_eur: input.eurAmount,
        bonus_percentage: input.bonusPercentage,
        partner: input.partner,
      })
      const { data: inv, error: invErr } = await supabase
        .from('investments')
        .insert({
          user_id: (ctx.user as any).id,
          project_id: input.projectId,
          amount_points: calc.total_points,
          amount_eur_equivalent: input.eurAmount,
          status: 'active',
        })
        .select()
        .single()
      if (invErr) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: invErr.message })

      const { data: userRow, error: userErr } = await supabase
        .from('users')
        .select('points_balance')
        .eq('id', (ctx.user as any).id)
        .single()
      if (userErr || !userRow) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Cannot load user' })
      const newBalance = (userRow.points_balance ?? 0) + calc.total_points
      const { error: upErr } = await supabase
        .from('users')
        .update({ points_balance: newBalance })
        .eq('id', (ctx.user as any).id)
      if (upErr) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: upErr.message })

      const { error: txErr } = await supabase.from('points_transactions').insert({
        user_id: (ctx.user as any).id,
        type: 'earned_purchase',
        amount: calc.total_points,
        balance_after: newBalance,
        reference_type: 'investment',
        reference_id: inv.id,
        description: `Adoption ${input.type}`,
      })
      if (txErr) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: txErr.message })

      return { investmentId: inv.id, pointsEarned: calc.total_points, balanceAfter: newBalance }
    }),
})