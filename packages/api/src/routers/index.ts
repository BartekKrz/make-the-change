/**
 * Main Router Assembly - tRPC AppRouter
 */
import { createRouter } from '../trpc'
import { authRouter } from './auth'
import { usersRouter } from './users'
import { productsRouter } from './products'
import { pricingRouter } from './pricing'
import { ordersRouter } from './orders'
import { investmentsRouter } from './investments'
import { pointsRouter } from './points'
import { adminRouter } from './admin'

export const appRouter = createRouter({
  // Authentication & Users
  auth: authRouter,
  users: usersRouter,

  // Public APIs
  products: productsRouter,
  pricing: pricingRouter,
  orders: ordersRouter,
  investments: investmentsRouter,
  points: pointsRouter,

  // Admin APIs
  admin: adminRouter,
})

export type AppRouter = typeof appRouter

// Re-export routers for individual use if needed
export { authRouter, usersRouter, productsRouter, adminRouter }