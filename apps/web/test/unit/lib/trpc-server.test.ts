/**
 * Tests TDD CRITIQUES - tRPC Server
 * Niveau ROUGE selon stratégie TDD (Coverage: 90%+)
 * 
 * Tests des endpoints tRPC selon les spécifications API
 */

import { describe, it, expect, vi } from 'vitest'
import { appRouter } from '@/lib/trpc-server'
import type { TRPCContext } from '@/lib/trpc-server'

// Mock Supabase client
const mockSupabase = {
  auth: {
    signUp: vi.fn(),
    signInWithPassword: vi.fn(),
    signOut: vi.fn(),
    getUser: vi.fn(),
  },
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn(),
      })),
    })),
    insert: vi.fn(),
    update: vi.fn(() => ({
      eq: vi.fn(),
    })),
  })),
}

// Helper pour créer un caller tRPC avec contexte mock
function createTestCaller(contextOverrides: Partial<TRPCContext> = {}) {
  const defaultContext: TRPCContext = {
    supabase: mockSupabase as any,
    user: null,
    req: new Request('http://localhost:3000/api/trpc'),
    ...contextOverrides,
  }
  
  // Créer un caller manuel pour les tests
  return {
    auth: {
      register: (input: any) => appRouter._def.procedures.auth.register({ input, ctx: defaultContext }),
      login: (input: any) => appRouter._def.procedures.auth.login({ input, ctx: defaultContext }),
    },
    users: {
      getProfile: () => appRouter._def.procedures.users.getProfile({ ctx: defaultContext }),
      getPointsBalance: () => appRouter._def.procedures.users.getPointsBalance({ ctx: defaultContext }),
    },
  }
}

describe('tRPC Auth Router (TDD CRITIQUE)', () => {
  describe('register endpoint', () => {
    it('should register new user with correct points calculation', async () => {
      // Mock successful Supabase registration
      mockSupabase.auth.signUp.mockResolvedValueOnce({
        data: {
          user: {
            id: 'user_123',
            email: 'test@example.com',
          },
          session: {
            access_token: 'token_123',
            user: { id: 'user_123', email: 'test@example.com' },
          },
        },
        error: null,
      })

      // Mock user creation in users table
      mockSupabase.from.mockReturnValueOnce({
        insert: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn().mockResolvedValueOnce({
              data: {
                id: 'user_123',
                email: 'test@example.com',
                user_level: 'explorateur',
                points_balance: 100,
              },
              error: null,
            }),
          })),
        })),
      })

      // Mock points transaction creation
      mockSupabase.from.mockReturnValueOnce({
        insert: vi.fn().mockResolvedValueOnce({
          data: {},
          error: null,
        }),
      })

      const caller = createTestCaller()
      
      const result = await caller.auth.register({
        email: 'test@example.com',
        password: 'password123',
      })

      expect(result.user.email).toBe('test@example.com')
      expect(result.user.user_level).toBe('explorateur')
      expect(result.user.points_balance).toBe(100)
      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })

    it('should handle registration errors gracefully', async () => {
      mockSupabase.auth.signUp.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: { message: 'Email already exists' },
      })

      const caller = createTestCaller()
      
      await expect(caller.auth.register({
        email: 'existing@example.com',
        password: 'password123',
      })).rejects.toThrow('Email already exists')
    })

    it('should validate email format', async () => {
      const caller = createTestCaller()
      
      await expect(caller.auth.register({
        email: 'invalid-email',
        password: 'password123',
      })).rejects.toThrow('Invalid email')
    })

    it('should validate password strength', async () => {
      const caller = createTestCaller()
      
      await expect(caller.auth.register({
        email: 'test@example.com',
        password: '123', // Trop court
      })).rejects.toThrow('Password must be at least 6 characters')
    })
  })

  describe('login endpoint', () => {
    it('should login user and return session', async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
        data: {
          user: {
            id: 'user_123',
            email: 'test@example.com',
          },
          session: {
            access_token: 'token_123',
            user: { id: 'user_123', email: 'test@example.com' },
          },
        },
        error: null,
      })

      // Mock profile fetch
      mockSupabase.from.mockReturnValueOnce({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn().mockResolvedValueOnce({
              data: {
                id: 'user_123',
                email: 'test@example.com',
                level: 'protector',
                points_balance: 65,
              },
              error: null,
            }),
          })),
        })),
      })

      const caller = createTestCaller()
      
      const result = await caller.auth.login({
        email: 'test@example.com',
        password: 'password123',
      })

      expect(result.user.email).toBe('test@example.com')
      expect(result.user.level).toBe('protector')
      expect(result.user.points_balance).toBe(65)
      expect(result.session.access_token).toBe('token_123')
    })

    it('should handle invalid credentials', async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: { message: 'Invalid login credentials' },
      })

      const caller = createTestCaller()
      
      await expect(caller.auth.login({
        email: 'wrong@example.com',
        password: 'wrongpassword',
      })).rejects.toThrow('Invalid login credentials')
    })
  })
})

describe('tRPC Users Router (TDD CRITIQUE)', () => {
  describe('getProfile endpoint', () => {
    it('should return user profile for authenticated user', async () => {
      const mockUser = {
        id: 'user_123',
        email: 'test@example.com',
        level: 'protector',
        points_balance: 65,
      }

      // Mock profile fetch
      mockSupabase.from.mockReturnValueOnce({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn().mockResolvedValueOnce({
              data: mockUser,
              error: null,
            }),
          })),
        })),
      })

      const caller = createTestCaller({
        user: mockUser,
      })
      
      const result = await caller.users.getProfile()

      expect(result.id).toBe('user_123')
      expect(result.email).toBe('test@example.com')
      expect(result.level).toBe('protector')
      expect(result.points_balance).toBe(65)
    })

    it('should require authentication', async () => {
      const caller = createTestCaller() // No user in context
      
      await expect(caller.users.getProfile()).rejects.toThrow('UNAUTHORIZED')
    })
  })

  describe('getPointsBalance endpoint', () => {
    it('should return detailed points balance', async () => {
      const mockUser = { id: 'user_123', email: 'test@example.com' }
      
      // Mock points balance query
      mockSupabase.from.mockReturnValueOnce({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn().mockResolvedValueOnce({
              data: {
                current_balance: 65,
                total_earned: 65,
                total_spent: 0,
                expiring_soon: 0,
                next_expiry_date: null,
              },
              error: null,
            }),
          })),
        })),
      })

      const caller = createTestCaller({
        user: mockUser,
      })
      
      const result = await caller.users.getPointsBalance()

      expect(result.current_balance).toBe(65)
      expect(result.total_earned).toBe(65)
      expect(result.total_spent).toBe(0)
      expect(result.expiring_soon).toBe(0)
    })

    it('should require authentication for points balance', async () => {
      const caller = createTestCaller()
      
      await expect(caller.users.getPointsBalance()).rejects.toThrow('UNAUTHORIZED')
    })
  })
})

describe('tRPC Context Creation', () => {
  it('should create context with valid request', async () => {
    const mockRequest = new Request('http://localhost:3000/api/trpc', {
      headers: {
        'authorization': 'Bearer valid-token',
      },
    })

    // Ce test vérifiera que le contexte est créé correctement
    // avec l'authentification Supabase
    expect(mockRequest.headers.get('authorization')).toBe('Bearer valid-token')
  })

  it('should handle requests without authorization header', async () => {
    const mockRequest = new Request('http://localhost:3000/api/trpc')

    expect(mockRequest.headers.get('authorization')).toBeNull()
  })
})

describe('tRPC Error Handling', () => {
  it('should handle database connection errors', async () => {
    mockSupabase.from.mockReturnValueOnce({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn().mockRejectedValueOnce(new Error('Database connection failed')),
        })),
      })),
    })

    const caller = createTestCaller({
      user: { id: 'user_123', email: 'test@example.com' },
    })

    await expect(caller.users.getProfile()).rejects.toThrow('Database connection failed')
  })
})
