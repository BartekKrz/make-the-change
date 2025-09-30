/**
 * Admin Partner Router
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

export const partnerRouter = createRouter({
  list: adminProcedure
    .input(z.object({
      status: z.enum(['active', 'pending', 'archived']).optional(),
      search: z.string().optional(),
      limit: z.number().int().min(1).max(100).default(50),
      cursor: z.string().uuid().optional(),
    }).optional())
    .query(async ({ input }) => {
      let query = supabase
        .from('producers')
        .select('*')
        .order('created_at', { ascending: false })

      if (input?.status) query = query.eq('status', input.status)
      if (input?.search) query = query.ilike('name', `%${input.search}%`)
      if (input?.cursor) query = query.lt('id', input.cursor)
      query = query.limit(input?.limit ?? 50)

      const { data, error } = await query
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return { items: data, nextCursor: data?.at(-1)?.id ?? null }
    }),

  detail: adminProcedure
    .input(z.object({ partnerId: z.string().uuid() }))
    .query(async ({ input }) => {
      const { data, error } = await supabase
        .from('producers')
        .select('*')
        .eq('id', input.partnerId)
        .single()
      if (error) throw new TRPCError({ code: 'NOT_FOUND', message: 'Partner not found' })
      return data
    }),

  create: adminProcedure
    .input(z.object({
      name: z.string().min(1),
      slug: z.string().min(1),
      status: z.enum(['active', 'pending', 'archived']).default('pending'),
      contact_email: z.string().email(),
      description: z.string().optional(),
      website: z.string().url().optional(),
      address_street: z.string().optional(),
      address_city: z.string().optional(),
      address_postal_code: z.string().optional(),
      address_country: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { data, error } = await supabase
        .from('producers')
        .insert(input as any)
        .select()
        .single()
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  update: adminProcedure
    .input(z.object({
      partnerId: z.string().uuid(),
      patch: z.object({
        name: z.string().min(1).optional(),
        slug: z.string().min(1).optional(),
        status: z.enum(['active', 'pending', 'archived']).optional(),
        contact_email: z.string().email().optional(),
        description: z.string().optional(),
        website: z.string().url().optional(),
        address_street: z.string().optional(),
        address_city: z.string().optional(),
        address_postal_code: z.string().optional(),
        address_country: z.string().optional(),
      }).refine((p) => Object.keys(p).length > 0, 'Patch cannot be empty'),
    }))
    .mutation(async ({ input }) => {
      const { data, error } = await supabase
        .from('producers')
        .update(input.patch as any)
        .eq('id', input.partnerId)
        .select()
        .single()
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  delete: adminProcedure
    .input(z.object({ partnerId: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const { error } = await supabase
        .from('producers')
        .update({ status: 'archived' })
        .eq('id', input.partnerId)
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return { success: true }
    }),
})