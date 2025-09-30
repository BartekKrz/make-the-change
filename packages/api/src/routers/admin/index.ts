/**
 * Admin Router Assembly
 */
import { createRouter } from '../../trpc'
import { adminProductsRouter } from './products'
import { adminOrdersRouter } from './orders'
import { adminUsersRouter } from './users'
import { adminProjectsRouter } from './projects'
import { categoriesRouter } from './categories'
import { partnerRouter } from './partner'
import { adminSubscriptionsRouter } from './subscriptions'
import { imagesRouter } from './images'

export const adminRouter = createRouter({
  products: adminProductsRouter,
  orders: adminOrdersRouter,
  users: adminUsersRouter,
  projects: adminProjectsRouter,
  categories: categoriesRouter,
  partners: partnerRouter,
  subscriptions: adminSubscriptionsRouter,
  images: imagesRouter,
})

export type AdminRouter = typeof adminRouter