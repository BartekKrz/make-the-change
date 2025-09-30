/**
 * Products Router (Public)
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

export const productsRouter = createRouter({
  list: publicProcedure
    .input(
      z
        .object({
          categoryId: z.string().uuid().optional(),
          featured: z.boolean().optional(),
          minTier: z.enum(['explorateur', 'protecteur', 'ambassadeur']).optional(),
          search: z.string().min(1).max(64).optional(),
          limit: z.number().int().min(1).max(100).default(24),
          cursor: z.string().uuid().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      let query = supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (input?.categoryId) query = query.eq('category_id', input.categoryId)
      if (input?.featured !== undefined) query = query.eq('featured', input.featured)
      if (input?.minTier) query = query.gte('min_tier', input.minTier)
      if (input?.search) {
        query = query.or(
          `name.ilike.%${input.search}%,tags.cs.{${input.search.toLowerCase()}}`
        )
      }
      if (input?.cursor) {
        query = query.lt('id', input.cursor)
      }
      query = query.limit(input?.limit ?? 24)

      const { data, error } = await query
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return { items: data, nextCursor: data?.at(-1)?.id ?? null }
    }),

  bySlug: publicProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ input }) => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', input.slug)
        .eq('is_active', true)
        .single()
      if (error) throw new TRPCError({ code: 'NOT_FOUND', message: 'Product not found' })
      return data
    }),
})