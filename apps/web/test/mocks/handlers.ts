/**
 * MSW Handlers pour les tests - Make the CHANGE
 * Mocks des API tRPC et services externes selon la stratégie TDD
 */

import { http, HttpResponse } from 'msw'

export const handlers = [
  // Mock tRPC endpoints - Auth
  http.post('/api/trpc/auth.register', () => {
    return HttpResponse.json({
      result: {
        data: {
          user: {
            id: 'user_test_123',
            email: 'test@example.com',
            level: 'explorer',
            points_balance: 0,
            created_at: new Date().toISOString(),
          },
          session: {
            access_token: 'test-access-token',
            user: {
              id: 'user_test_123',
              email: 'test@example.com',
            },
          },
        },
      },
    })
  }),

  http.post('/api/trpc/auth.login', () => {
    return HttpResponse.json({
      result: {
        data: {
          user: {
            id: 'user_test_123',
            email: 'test@example.com',
            level: 'protector',
            points_balance: 65,
            created_at: new Date().toISOString(),
          },
          session: {
            access_token: 'test-access-token',
            user: {
              id: 'user_test_123',
              email: 'test@example.com',
            },
          },
        },
      },
    })
  }),

  // Mock tRPC endpoints - Users
  http.post('/api/trpc/users.getProfile', () => {
    return HttpResponse.json({
      result: {
        data: {
          id: 'user_test_123',
          email: 'test@example.com',
          level: 'protector',
          points_balance: 65,
          kyc_status: 'verified',
          created_at: new Date().toISOString(),
        },
      },
    })
  }),

  http.post('/api/trpc/users.getPointsBalance', () => {
    return HttpResponse.json({
      result: {
        data: {
          current_balance: 65,
          total_earned: 65,
          total_spent: 0,
          expiring_soon: 0,
          next_expiry_date: null,
        },
      },
    })
  }),

  // Mock Supabase Auth
  http.post('https://test.supabase.co/auth/v1/signup', () => {
    return HttpResponse.json({
      user: {
        id: 'user_test_123',
        email: 'test@example.com',
      },
      session: {
        access_token: 'test-access-token',
        refresh_token: 'test-refresh-token',
      },
    })
  }),

  http.post('https://test.supabase.co/auth/v1/token', () => {
    return HttpResponse.json({
      user: {
        id: 'user_test_123',
        email: 'test@example.com',
      },
      session: {
        access_token: 'test-access-token',
        refresh_token: 'test-refresh-token',
      },
    })
  }),

  // Mock Stripe (pour les tests de paiement futurs)
  http.post('/api/webhooks/stripe', () => {
    return HttpResponse.json({ received: true })
  }),
]
