/**
 * Pricing Router
 */
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'
import { createRouter, publicProcedure } from '../trpc'

// Supabase service client
const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// Helpers
type QuoteInput = { items: Array<{ productId: string; quantity: number }> }
type QuoteResult = {
  lineItems: Array<{ productId: string; quantity: number; unitPricePoints: number; totalPricePoints: number }>
  subtotalPoints: number
  shippingPoints: number
  taxPoints: number
  totalPoints: number
}

async function getQuote(input: QuoteInput): Promise<QuoteResult> {
  const productIds = input.items.map((i) => i.productId)
  const { data: products, error } = await supabase
    .from('products')
    .select('id, price_points')
    .in('id', productIds)
  if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
  const priceMap = new Map(products.map((p: any) => [p.id, p.price_points]))
  let subtotal = 0
  const lineItems = input.items.map((i) => {
    const unit = Number(priceMap.get(i.productId) ?? 0)
    const total = unit * i.quantity
    subtotal += total
    return { productId: i.productId, quantity: i.quantity, unitPricePoints: unit, totalPricePoints: total }
  })
  const shipping = 0
  const taxes = 0
  const total = subtotal + shipping + taxes
  return { lineItems, subtotalPoints: subtotal, shippingPoints: shipping, taxPoints: taxes, totalPoints: total }
}

export const pricingRouter = createRouter({
  quote: publicProcedure
    .input(
      z.object({
        items: z
          .array(
            z.object({
              productId: z.string().uuid(),
              quantity: z.number().int().positive().max(999),
            })
          )
          .min(1),
      })
    )
    .query(async ({ input }) => getQuote(input)),
})

// Export helper for use in other routers
export { getQuote }