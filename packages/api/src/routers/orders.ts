/**
 * Orders Router (Public)
 */
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'
import { createRouter, protectedProcedure } from '../trpc'
import { getQuote } from './pricing'

// Supabase service client
const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

export const ordersRouter = createRouter({
  create: protectedProcedure
    .input(
      z.object({
        items: z.array(
          z.object({ productId: z.string().uuid(), quantity: z.number().int().positive() })
        ).min(1),
        shippingAddress: z.object({
          street: z.string(),
          city: z.string(),
          postalCode: z.string(),
          country: z.string(),
          firstName: z.string(),
          lastName: z.string(),
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const quote = await getQuote({ items: input.items })
      const { data: orderRow, error: orderError }: any = await supabase
        .from('orders')
        .insert({
          user_id: (ctx.user as any).id,
          status: 'pending',
          total_points: quote.totalPoints,
          shipping_address: input.shippingAddress,
        })
        .select()
        .single()
      if (orderError) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: orderError.message })

      const itemsPayload = quote.lineItems.map((li: any) => ({
        order_id: orderRow.id,
        product_id: li.productId,
        quantity: li.quantity,
        unit_price_points: li.unitPricePoints,
        total_price_points: li.totalPricePoints,
      }))
      const { error: itemsError } = await supabase.from('order_items').insert(itemsPayload)
      if (itemsError) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: itemsError.message })

      return { orderId: orderRow.id }
    }),
})