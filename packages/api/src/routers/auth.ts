/**
 * Authentication Router
 */
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'
import { createRouter, publicProcedure, protectedProcedure } from '../trpc'

// Supabase service client
const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

export const authRouter = createRouter({
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email('Invalid email'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
      })
    )
    .mutation(async ({ input }) => {
      const { email, password } = input

      const { data: authData, error: authError } = await supabase.auth.signUp({ email, password })
      if (authError) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: authError.message })
      }
      if (!authData.user) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'User creation failed' })
      }

      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email,
          user_level: 'explorateur',
          kyc_status: 'pending',
          kyc_level: 0,
          points_balance: 100,
          preferences: {},
        })
      if (userError) {
        await supabase.auth.admin.deleteUser(authData.user.id)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'User profile creation failed' })
      }

      return { userId: authData.user.id }
    }),

  login: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string() }))
    .mutation(async ({ input }) => {
      const { email, password } = input
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Email ou mot de passe incorrect' })
      }
      if (!data.user || !data.session) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Connexion échouée' })
      }
      await supabase.from('users').update({ last_login_at: new Date().toISOString() }).eq('id', data.user.id)
      return { user: data.user, session: data.session, message: 'Connexion réussie' }
    }),

  me: protectedProcedure.query(async ({ ctx }) => {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select(`*, user_profiles (*)`)
      .eq('id', (ctx.user as any).id)
      .single()
    if (userError || !userData) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Utilisateur non trouvé' })
    }
    return userData
  }),
})