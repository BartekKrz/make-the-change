/**
 * Admin Orders Router
 */
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'
import { createRouter, adminProcedure } from '../../trpc'

// Supabase service client
const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

export const adminOrdersRouter = createRouter({
  list: adminProcedure
    .input(
      z
        .object({
          status: z
            .enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'])
            .optional(),
          limit: z.number().int().min(1).max(100).default(50),
          cursor: z.string().uuid().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      let q = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
      if (input?.status) q = q.eq('status', input.status)
      if (input?.cursor) q = q.lt('id', input.cursor)
      q = q.limit(input?.limit ?? 50)
      const { data, error } = await q
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return { items: data, nextCursor: data?.at(-1)?.id ?? null }
    }),

  detail: adminProcedure
    .input(z.object({ orderId: z.string().uuid() }))
    .query(async ({ input }) => {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('id', input.orderId)
        .single()
      if (error) throw new TRPCError({ code: 'NOT_FOUND', message: 'Order not found' })
      return data
    }),

  update_status: adminProcedure
    .input(
      z.object({
        orderId: z.string().uuid(),
        status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']),
        reason: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { data: order, error: orderErr } = await supabase
        .from('orders')
        .select('id, user_id, status, total_points')
        .eq('id', input.orderId)
        .single()
      if (orderErr || !order) throw new TRPCError({ code: 'NOT_FOUND', message: 'Order not found' })

      // Handle refund on cancel from confirmed
      if (input.status === 'cancelled' && order.status === 'confirmed') {
        const { data: userRow, error: userErr } = await supabase
          .from('users')
          .select('points_balance')
          .eq('id', (order as any).user_id)
          .single()
        if (userErr || !userRow) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Cannot load user' })
        const newBalance = (userRow.points_balance ?? 0) + (order as any).total_points
        const { error: upErr } = await supabase
          .from('users')
          .update({ points_balance: newBalance })
          .eq('id', (order as any).user_id)
        if (upErr) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: upErr.message })
        const { error: txErr } = await supabase.from('points_transactions').insert({
          user_id: (order as any).user_id,
          type: 'adjustment_admin',
          amount: (order as any).total_points,
          balance_after: newBalance,
          reference_type: 'order',
          reference_id: (order as any).id,
          description: input.reason || 'Order refund (admin)',
        })
        if (txErr) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: txErr.message })
      }

      const { error: upOrderErr } = await supabase
        .from('orders')
        .update({ status: input.status, admin_notes: input.reason ?? null })
        .eq('id', input.orderId)
      if (upOrderErr) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: upOrderErr.message })
      return { success: true }
    }),

  add_note: adminProcedure
    .input(z.object({ orderId: z.string().uuid(), note: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const { error } = await supabase
        .from('orders')
        .update({ admin_notes: input.note })
        .eq('id', input.orderId)
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return { success: true }
    }),

  update: adminProcedure
    .input(
      z.object({
        orderId: z.string().uuid(),
        patch: z
          .object({
            status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']).optional(),
            admin_notes: z.string().optional(),
            tracking_number: z.string().optional(),
            shipping_carrier: z.string().optional(),
          })
          .refine((p) => Object.keys(p).length > 0, 'Patch cannot be empty'),
      })
    )
    .mutation(async ({ input }) => {
      const { data, error } = await supabase
        .from('orders')
        .update(input.patch as any)
        .eq('id', input.orderId)
        .select()
        .single()
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),
})