/**
 * Router utilisateurs - Make the CHANGE
 * Gestion des profils, points, et données utilisateurs
 */

import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { router, protectedProcedure, adminProcedure } from '../src/lib/trpc.js';

export const usersRouter = router({
  /**
   * Récupération du solde de points
   */
  getPointsBalance: protectedProcedure.query(async ({ ctx }) => {
    try {
      const { data, error } = await ctx.supabase
        .from('users')
        .select('points_balance')
        .eq('id', ctx.user.id)
        .single();

      if (error || !data) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Utilisateur non trouvé',
        });
      }

      return {
        balance: data.points_balance,
      };
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

  /**
   * Historique des transactions de points
   */
  getPointsHistory: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      const { limit, offset } = input;

      try {
        const { data, error } = await ctx.supabase
          .from('points_transactions')
          .select('*')
          .eq('user_id', ctx.user.id)
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1);

        if (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to fetch points history',
          });
        }

        return {
          transactions: data || [],
          hasMore: data?.length === limit,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch points history',
        });
      }
    }),

  /**
   * Mise à jour du niveau utilisateur (KYC)
   */
  updateKycLevel: protectedProcedure
    .input(
      z.object({
        kycLevel: z.enum(['0', '1', '2']).transform(val => parseInt(val) as 0 | 1 | 2),
        documents: z.array(z.string().url()).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { kycLevel, documents } = input;

      try {
        // Détermination du statut KYC basé sur le niveau
        let kycStatus: 'pending' | 'light' | 'complete';
        let userLevel: 'explorateur' | 'protecteur' | 'ambassadeur';

        switch (kycLevel) {
          case 0:
            kycStatus = 'pending';
            userLevel = 'explorateur';
            break;
          case 1:
            kycStatus = 'light';
            userLevel = 'protecteur';
            break;
          case 2:
            kycStatus = 'complete';
            userLevel = 'ambassadeur';
            break;
        }

        // Mise à jour de l'utilisateur
        const { data, error } = await ctx.supabase
          .from('users')
          .update({
            kyc_level: kycLevel,
            kyc_status: kycStatus,
            user_level: userLevel,
          })
          .eq('id', ctx.user.id)
          .select()
          .single();

        if (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'KYC update failed',
          });
        }

        // Attribution de points bonus pour passage de niveau
        if (kycLevel > 0) {
          const bonusPoints = kycLevel === 1 ? 250 : 500; // 250 pour Protecteur, 500 pour Ambassadeur
          
          await ctx.supabase.from('points_transactions').insert({
            user_id: ctx.user.id,
            type: 'bonus_milestone',
            amount: bonusPoints,
            balance_after: data.points_balance + bonusPoints,
            description: `Bonus passage niveau ${userLevel}`,
          });

          // Mise à jour du solde
          await ctx.supabase
            .from('users')
            .update({ points_balance: data.points_balance + bonusPoints })
            .eq('id', ctx.user.id);
        }

        return {
          user: data,
          message: `Niveau mis à jour vers ${userLevel}`,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'KYC update failed',
        });
      }
    }),

  /**
   * Récupération des investissements utilisateur
   */
  getInvestments: protectedProcedure
    .input(
      z.object({
        status: z.enum(['active', 'matured', 'cancelled']).optional(),
        limit: z.number().min(1).max(50).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      const { status, limit, offset } = input;

      try {
        let query = ctx.supabase
          .from('investments')
          .select(`
            *,
            projects (
              id,
              name,
              type,
              status,
              images
            )
          `)
          .eq('user_id', ctx.user.id);

        if (status) {
          query = query.eq('status', status);
        }

        const { data, error } = await query
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1);

        if (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to fetch investments',
          });
        }

        return {
          investments: data || [],
          hasMore: data?.length === limit,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch investments',
        });
      }
    }),

  /**
   * Admin: Liste des utilisateurs
   */
  list: adminProcedure
    .input(
      z.object({
        search: z.string().optional(),
        level: z.enum(['explorateur', 'protecteur', 'ambassadeur']).optional(),
        kycStatus: z.enum(['pending', 'light', 'complete']).optional(),
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      const { search, level, kycStatus, limit, offset } = input;

      try {
        let query = ctx.supabase
          .from('users')
          .select(`
            *,
            user_profiles (
              first_name,
              last_name,
              phone
            )
          `);

        if (search) {
          query = query.or(`email.ilike.%${search}%,user_profiles.first_name.ilike.%${search}%,user_profiles.last_name.ilike.%${search}%`);
        }

        if (level) {
          query = query.eq('user_level', level);
        }

        if (kycStatus) {
          query = query.eq('kyc_status', kycStatus);
        }

        const { data, error } = await query
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1);

        if (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to fetch users',
          });
        }

        return {
          users: data || [],
          hasMore: data?.length === limit,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch users',
        });
      }
    }),

  /**
   * Admin: Attribution manuelle de points
   */
  addPoints: adminProcedure
    .input(
      z.object({
        userId: z.string().uuid(),
        amount: z.number().int(),
        reason: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { userId, amount, reason } = input;

      try {
        // Récupération du solde actuel
        const { data: userData, error: userError } = await ctx.supabase
          .from('users')
          .select('points_balance')
          .eq('id', userId)
          .single();

        if (userError || !userData) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Utilisateur non trouvé',
          });
        }

        const newBalance = userData.points_balance + amount;

        // Transaction de points
        await ctx.supabase.from('points_transactions').insert({
          user_id: userId,
          type: 'adjustment_admin',
          amount,
          balance_after: newBalance,
          description: reason,
        });

        // Mise à jour du solde
        const { data, error } = await ctx.supabase
          .from('users')
          .update({ points_balance: newBalance })
          .eq('id', userId)
          .select()
          .single();

        if (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Points update failed',
          });
        }

        return {
          user: data,
          message: `${amount} points ${amount > 0 ? 'ajoutés' : 'retirés'}`,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Points adjustment failed',
        });
      }
    }),
});
