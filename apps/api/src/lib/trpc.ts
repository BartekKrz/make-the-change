/**
 * Configuration tRPC pour Make the CHANGE
 * Context, middleware et utilitaires
 */

import { initTRPC, TRPCError } from '@trpc/server';
import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { supabase, supabaseAuth } from './supabase.js';
import { verifyJWT } from '../utils/jwt.js';

// Context interface
export interface Context {
  user?: {
    id: string;
    email: string;
    role?: string;
  };
  supabase: typeof supabase;
  supabaseAuth: typeof supabaseAuth;
}

// Création du context pour chaque requête
export const createContext = async ({
  req,
}: CreateExpressContextOptions): Promise<Context> => {
  // Récupération du token depuis l'header Authorization
  const authHeader = req.headers.authorization;
  let user: Context['user'] = undefined;

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    
    try {
      // Vérification du JWT Supabase
      const payload = await verifyJWT(token);
      
      if (payload.sub && payload.email) {
        user = {
          id: payload.sub,
          email: payload.email as string,
          role: payload.role as string | undefined,
        };
      }
    } catch (error) {
      // Token invalide, mais on continue sans user (pour les endpoints publics)
      console.warn('Invalid token:', error);
    }
  }

  return {
    user,
    supabase,
    supabaseAuth,
  };
};

// Initialisation tRPC
const t = initTRPC.context<Context>().create({
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

// Exports des utilitaires tRPC
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
      user: ctx.user, // user est maintenant garanti d'exister
    },
  });
});

// Middleware admin (pour les opérations sensibles)
const isAdmin = t.middleware(({ ctx, next }) => {
  if (!ctx.user || ctx.user.role !== 'admin') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Admin access required',
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

// Procédures avec middleware
export const protectedProcedure = publicProcedure.use(isAuthenticated);
export const adminProcedure = publicProcedure.use(isAdmin);
