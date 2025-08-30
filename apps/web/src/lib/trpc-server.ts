/**
 * Configuration tRPC côté serveur pour l'application web
 * Version simplifiée intégrée directement dans Next.js
 */

import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { calculateInvestmentPoints, calculateSubscriptionPoints } from './business/points-calculator';

// Configuration Supabase
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Interface du contexte tRPC
export interface TRPCContext {
  supabase: typeof supabase;
  user: any | null;
  req: Request;
}

// Initialisation tRPC
const t = initTRPC.context<TRPCContext>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof Error && error.cause.name === 'ZodError'
            ? (error.cause as any).flatten?.() || null
            : null,
      },
    };
  },
});

// Export des utilitaires tRPC
export const router = t.router;
export const publicProcedure = t.procedure;

// Middleware d'authentification
const isAuthenticated = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Authentication required',
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

export const protectedProcedure = publicProcedure.use(isAuthenticated);

// Router d'authentification
export const authRouter = router({
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email('Invalid email'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;

      try {
        // Créer l'utilisateur dans auth.users via Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (authError) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: authError.message,
          });
        }

        if (!authData.user) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'User creation failed',
          });
        }

        // Créer l'entrée dans la table users
        const { data: userData, error: userError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email,
            user_level: 'explorateur',
            kyc_status: 'pending',
            kyc_level: 0,
            points_balance: 100, // Points de bienvenue
            preferences: {},
          })
          .select()
          .single();

        if (userError) {
          // Cleanup: supprimer l'utilisateur auth si la création user échoue
          await supabase.auth.admin.deleteUser(authData.user.id);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'User profile creation failed',
          });
        }

        // Attribution des points de bienvenue
        await supabase.from('points_transactions').insert({
          user_id: authData.user.id,
          type: 'bonus_welcome',
          amount: 100,
          balance_after: 100,
          description: 'Points de bienvenue',
        });

        return {
          user: userData,
          message: 'Compte créé avec succès ! Vérifiez votre email.',
        };
      } catch (error) {
        console.error('Registration error:', error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Registration failed',
        });
      }
    }),

  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Email ou mot de passe incorrect',
          });
        }

        if (!data.user || !data.session) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Connexion échouée',
          });
        }

        // Mise à jour de la dernière connexion
        await supabase
          .from('users')
          .update({ last_login_at: new Date().toISOString() })
          .eq('id', data.user.id);

        return {
          user: data.user,
          session: data.session,
          message: 'Connexion réussie',
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Login failed',
        });
      }
    }),

  me: protectedProcedure.query(async ({ ctx }) => {
    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select(`
          *,
          user_profiles (*)
        `)
        .eq('id', ctx.user.id)
        .single();

      if (userError || !userData) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Utilisateur non trouvé',
        });
      }

      return userData;
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch user profile',
      });
    }
  }),
});

// Router des utilisateurs
export const usersRouter = router({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    return authRouter.me({ ctx });
  }),

  getPointsBalance: protectedProcedure.query(async ({ ctx }) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('points_balance')
        .eq('id', ctx.user.id)
        .single();

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch points balance',
        });
      }

      return data.points_balance;
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch points balance',
      });
    }
  }),
});

// Router principal
export const appRouter = router({
  auth: authRouter,
  users: usersRouter,
});

export type AppRouter = typeof appRouter;
