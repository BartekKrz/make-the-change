/**
 * Admin Users Router
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

export const adminUsersRouter = createRouter({
  list: adminProcedure
    .input(z.object({ q: z.string().optional(), limit: z.number().int().min(1).max(100).default(50), cursor: z.string().uuid().optional() }).optional())
    .query(async ({ input }) => {
      let q = supabase.from('users').select('id, email, user_level, points_balance').order('created_at', { ascending: false })
      if (input?.q) q = q.ilike('email', `%${input.q}%`)
      if (input?.cursor) q = q.lt('id', input.cursor)
      q = q.limit(input?.limit ?? 50)
      const { data, error } = await q
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return { items: data, nextCursor: data?.at(-1)?.id ?? null }
    }),

  detail: adminProcedure
    .input(z.object({ userId: z.string().uuid() }))
    .query(async ({ input }) => {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, user_level, points_balance, kyc_status, kyc_level')
        .eq('id', input.userId)
        .single()
      if (error) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
      return data
    }),

  update: adminProcedure
    .input(
      z.object({
        userId: z.string().uuid(),
        patch: z
          .object({
            name: z.string().optional(),
            email: z.string().email().optional(),
            phone: z.string().optional(),
            user_level: z.enum(['explorateur', 'protecteur', 'ambassadeur']).optional(),
            points_balance: z.number().int().min(0).optional(),
            is_active: z.boolean().optional(),
            kyc_level: z.number().int().min(0).max(3).optional(),
            kyc_status: z.enum(['none', 'pending', 'verified', 'rejected']).optional(),
            last_login_at: z.string().optional(),
          })
          .refine((p) => Object.keys(p).length > 0, 'Patch cannot be empty'),
      })
    )
    .mutation(async ({ input }) => {
      const { data, error } = await supabase
        .from('users')
        .update(input.patch as any)
        .eq('id', input.userId)
        .select()
        .single()
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  suspend: adminProcedure
    .input(
      z.object({
        userId: z.string().uuid(),
        reason: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { data, error } = await supabase
        .from('users')
        .update({
          is_active: false,
          suspended_at: new Date().toISOString(),
          suspension_reason: input.reason,
        })
        .eq('id', input.userId)
        .select()
        .single()
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  activate: adminProcedure
    .input(z.object({ userId: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const { data, error } = await supabase
        .from('users')
        .update({
          is_active: true,
          suspended_at: null,
          suspension_reason: null,
        })
        .eq('id', input.userId)
        .select()
        .single()
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data
    }),

  create: adminProcedure
    .input(
      z.object({
        email: z.string().email('Email invalide'),
        password: z.string().min(6, 'Mot de passe trop court'),
        user_level: z.enum(['explorateur', 'protecteur', 'ambassadeur']).default('explorateur'),
        points_balance: z.number().int().min(0).default(100),
        kyc_status: z.enum(['none', 'pending', 'verified', 'rejected']).default('pending'),
        is_active: z.boolean().default(true),
        raw_user_meta_data: z
          .object({
            firstName: z.string().optional(),
            lastName: z.string().optional(),
            country: z.string().optional(),
          })
          .optional(),
        send_welcome_email: z.boolean().default(false),
      })
    )
    .mutation(async ({ input }) => {
      // Créer l'utilisateur dans Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: input.email,
        password: input.password,
        user_metadata: input.raw_user_meta_data || {},
        email_confirm: !input.send_welcome_email, // Si pas d'email de bienvenue, on confirme directement
      })

      if (authError) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: authError.message })
      }

      if (!authData.user) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'User creation failed' })
      }

      // Créer l'entrée dans la table users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: input.email,
          user_level: input.user_level,
          kyc_status: input.kyc_status,
          kyc_level: 0,
          points_balance: input.points_balance,
          is_active: input.is_active,
          preferences: {},
        })
        .select()
        .single()

      if (userError) {
        // Rollback - supprimer l'utilisateur auth créé
        await supabase.auth.admin.deleteUser(authData.user.id)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: userError.message })
      }

      return userData
    }),
})