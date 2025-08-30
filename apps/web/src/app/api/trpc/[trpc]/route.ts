/**
 * Routes API tRPC pour Next.js App Router
 * Connecte l'API tRPC existante avec Next.js
 */

import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/lib/trpc-server';
import { createTRPCContext } from '@/lib/trpc-context';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: createTRPCContext,
    onError: ({ error, path, input }) => {
      console.error(`❌ tRPC Error on ${path}:`, error);
      console.error('Input:', input);
    },
  });

export { handler as GET, handler as POST };
