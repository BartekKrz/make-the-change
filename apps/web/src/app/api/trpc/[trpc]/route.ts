import { appRouter, createTRPCContext } from '@make-the-change/api';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

export const runtime = 'nodejs';

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
