/**
 * Contexte tRPC pour l'application web Next.js
 * Intègre l'authentification Supabase avec tRPC
 */

import { type CreateNextContextOptions } from '@trpc/server/adapters/next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client Supabase avec clé de service pour l'API
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export interface TRPCContext {
  supabase: typeof supabase;
  user: any | null;
  req: Request;
}

export const createTRPCContext = async (opts: { req: Request }): Promise<TRPCContext> => {
  const { req } = opts;

  // Extraire le token d'autorisation du header
  const authorization = req.headers.get('authorization');
  let user = null;

  if (authorization?.startsWith('Bearer ')) {
    const token = authorization.substring(7);
    try {
      // Vérifier le JWT avec Supabase
      const { data: { user: authUser }, error } = await supabase.auth.getUser(token);
      if (!error && authUser) {
        user = authUser;
      }
    } catch (error) {
      console.error('Error verifying token:', error);
    }
  }

  return {
    supabase,
    user,
    req,
  };
};
