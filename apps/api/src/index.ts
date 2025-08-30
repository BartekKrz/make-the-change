/**
 * API tRPC principale - Make the CHANGE
 * Point d'entrée de l'API avec tous les routers
 */

import express from 'express';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { router } from './lib/trpc.js';
import { createContext } from './lib/trpc.js';

// Import des routers
import { authRouter } from '../routers/auth.js';
import { usersRouter } from '../routers/users.js';

// Router principal combinant tous les sous-routers
export const appRouter = router({
  auth: authRouter,
  users: usersRouter,
  // Ajoutez d'autres routers ici au fur et à mesure
});

// Export du type pour le client tRPC
export type AppRouter = typeof appRouter;

// Configuration Express
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware CORS
app.use(
  cors({
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://make-the-change.com', 'https://admin.make-the-change.com']
      : ['http://localhost:3000', 'http://localhost:3002'],
    credentials: true,
  })
);

// Middleware tRPC
app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext,
    onError: ({ error, path, input }) => {
      console.error(`❌ tRPC Error on ${path}:`, error);
      console.error('Input:', input);
    },
  })
);

// Route de santé
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'make-the-change-api',
    version: '0.1.0',
  });
});

// Route racine
app.get('/', (req, res) => {
  res.json({
    message: 'Make the CHANGE API',
    version: '0.1.0',
    endpoints: {
      trpc: '/trpc',
      health: '/health',
    },
    documentation: 'https://github.com/BartekKrz/make-the-change',
  });
});

// Gestion des erreurs globales
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Global error handler:', error);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Make the CHANGE API running on http://localhost:${PORT}`);
  console.log(`📊 tRPC endpoint: http://localhost:${PORT}/trpc`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
});
