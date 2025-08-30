/**
 * Client tRPC pour l'application web
 * Configuration avec TanStack Query et authentification Supabase
 */

import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink, loggerLink } from '@trpc/client';
import type { AppRouter } from '@/lib/trpc-server';

// Créer le client tRPC React
export const trpc = createTRPCReact<AppRouter>();

// Configuration du client tRPC
export const trpcClient = trpc.createClient({
  links: [
    loggerLink({
      enabled: (opts) =>
        process.env.NODE_ENV === 'development' ||
        (opts.direction === 'down' && opts.result instanceof Error),
    }),
    httpBatchLink({
      url: '/api/trpc',
      // Ajouter automatiquement le token d'authentification
      async headers() {
        const headers: Record<string, string> = {};
        
        // Récupérer le token Supabase depuis le localStorage ou les cookies
        if (typeof window !== 'undefined') {
          try {
            const supabaseAuth = localStorage.getItem('sb-ebmjxinsyyjwshnynwwu-auth-token');
            if (supabaseAuth) {
              const authData = JSON.parse(supabaseAuth);
              if (authData?.access_token) {
                headers.authorization = `Bearer ${authData.access_token}`;
              }
            }
          } catch (error) {
            console.error('Error getting auth token:', error);
          }
        }
        
        return headers;
      },
    }),
  ],
});