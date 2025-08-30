/**
 * Router d'authentification - Make the CHANGE
 * Gestion de l'inscription, connexion, et profils utilisateurs
 */

import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { router, publicProcedure, protectedProcedure } from '../src/lib/trpc.js';
import { CreateUserSchema, UserSchema } from '@make-the-change/shared';

export const authRouter = router({
  /**
   * Inscription d'un nouvel utilisateur
   */
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { email, password, firstName, lastName } = input;

      try {
        // 1. Créer l'utilisateur dans auth.users via Supabase Auth
        const { data: authData, error: authError } = await ctx.supabaseAuth.auth.signUp({
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

        // 2. Créer l'entrée dans la table users
        const { data: userData, error: userError } = await ctx.supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email,
            user_level: 'explorateur',
            kyc_status: 'pending',
            kyc_level: 0,
            points_balance: 0,
            preferences: {},
          })
          .select()
          .single();

        if (userError) {
          // Cleanup: supprimer l'utilisateur auth si la création user échoue
          await ctx.supabaseAuth.auth.admin.deleteUser(authData.user.id);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'User profile creation failed',
          });
        }

        // 3. Créer le profil utilisateur
        const { error: profileError } = await ctx.supabase
          .from('user_profiles')
          .insert({
            user_id: authData.user.id,
            first_name: firstName,
            last_name: lastName,
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          // Non-bloquant, on peut créer le profil plus tard
        }

        // 4. Attribution des points de bienvenue
        await ctx.supabase.from('points_transactions').insert({
          user_id: authData.user.id,
          type: 'bonus_welcome',
          amount: 100, // 100 points de bienvenue
          balance_after: 100,
          description: 'Points de bienvenue',
        });

        // 5. Mise à jour du solde de points
        await ctx.supabase
          .from('users')
          .update({ points_balance: 100 })
          .eq('id', authData.user.id);

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

  /**
   * Connexion utilisateur
   */
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
        const { data, error } = await ctx.supabaseAuth.auth.signInWithPassword({
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
        await ctx.supabase
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

  /**
   * Récupération du profil utilisateur actuel
   */
  me: protectedProcedure.query(async ({ ctx }) => {
    try {
      // Récupération des données utilisateur avec profil
      const { data: userData, error: userError } = await ctx.supabase
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

  /**
   * Mise à jour du profil utilisateur
   */
  updateProfile: protectedProcedure
    .input(
      z.object({
        firstName: z.string().min(1).optional(),
        lastName: z.string().min(1).optional(),
        phone: z.string().optional(),
        bio: z.string().optional(),
        address: z
          .object({
            street: z.string(),
            city: z.string(),
            postalCode: z.string(),
            country: z.string(),
          })
          .optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { firstName, lastName, phone, bio, address } = input;

      try {
        // Mise à jour du profil
        const { data, error } = await ctx.supabase
          .from('user_profiles')
          .update({
            ...(firstName && { first_name: firstName }),
            ...(lastName && { last_name: lastName }),
            ...(phone && { phone }),
            ...(bio && { bio }),
            ...(address && { address }),
          })
          .eq('user_id', ctx.user.id)
          .select()
          .single();

        if (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Mise à jour du profil échouée',
          });
        }

        return {
          profile: data,
          message: 'Profil mis à jour avec succès',
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Profile update failed',
        });
      }
    }),

  /**
   * Déconnexion
   */
  logout: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      const { error } = await ctx.supabaseAuth.auth.signOut();
      
      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Logout failed',
        });
      }

      return {
        message: 'Déconnexion réussie',
      };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Logout failed',
      });
    }
  }),
});
