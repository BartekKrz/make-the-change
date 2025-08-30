/**
 * Configuration globale des tests - Make the CHANGE
 * Setup selon la stratégie TDD définie dans docs/06-development/tdd-strategy.md
 */

import '@testing-library/jest-dom'
import { setupServer } from 'msw/node'
import { handlers } from './mocks/handlers'

// Setup MSW Server pour les tests
const server = setupServer(...handlers)

// Configuration globale des tests
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key'
process.env.SUPABASE_URL = 'https://test.supabase.co'
