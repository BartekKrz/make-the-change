/**
 * Shared tRPC Routers (auth, users, etc.)
 */
import { initTRPC, TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'
import {
  calculateInvestmentPoints,
  calculateSubscriptionPoints,
} from '@make-the-change/shared/utils'
import type { TRPCContext } from './context'
import { partnerRouter } from './router/admin/partner';

// Supabase service client for server-side ops
const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// Helpers
type QuoteInput = { items: Array<{ productId: string; quantity: number }> }
type QuoteResult = {
  lineItems: Array<{ productId: string; quantity: number; unitPricePoints: number; totalPricePoints: number }>
  subtotalPoints: number
  shippingPoints: number
  taxPoints: number
  totalPoints: number
}

async function getQuote(input: QuoteInput): Promise<QuoteResult> {
  const productIds = input.items.map((i) => i.productId)
  const { data: products, error } = await supabase
    .from('products')
    .select('id, price_points')
    .in('id', productIds)
  if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
  const priceMap = new Map(products.map((p: any) => [p.id, p.price_points]))
  let subtotal = 0
  const lineItems = input.items.map((i) => {
    const unit = Number(priceMap.get(i.productId) ?? 0)
    const total = unit * i.quantity
    subtotal += total
    return { productId: i.productId, quantity: i.quantity, unitPricePoints: unit, totalPricePoints: total }
  })
  const shipping = 0
  const taxes = 0
  const total = subtotal + shipping + taxes
  return { lineItems, subtotalPoints: subtotal, shippingPoints: shipping, taxPoints: taxes, totalPoints: total }
}

const t = initTRPC.context<TRPCContext>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof Error && error.cause.name === 'ZodError'
            ? (error.cause as any).flatten?.() || null
            : null,
      },
    }
  },
})

export const publicProcedure = t.procedure

// Helper function to create routers
const createRouter = t.router

// Auth middleware
const isAuthenticated = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Authentication required' })
  }
  return next({ ctx: { ...ctx, user: ctx.user } })
})

export const protectedProcedure = publicProcedure.use(isAuthenticated)

// Admin guard using email allowlist or DB user_level
const isAdminMw = t.middleware(async ({ ctx, next }) => {
  if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' })
  const allow = (process.env.ADMIN_EMAIL_ALLOWLIST || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
  const email = (((ctx.user as any)?.email as string) || '').toLowerCase()
  let allowed = false
  if (allow.length) {
    allowed = allow.includes(email)
  } else {
    const { data } = await supabase
      .from('users')
      .select('user_level')
      .eq('id', (ctx.user as any).id)
      .single()
    allowed = ['admin', 'super_admin'].includes(((data as any)?.user_level ?? '').toLowerCase())
  }
  if (!allowed) throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' })
  return next()
})

export const adminProcedure = protectedProcedure.use(isAdminMw)

export const authRouter = createRouter({
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email('Invalid email'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
      })
    )
    .mutation(async ({ input }) => {
      const { email, password } = input

      const { data: authData, error: authError } = await supabase.auth.signUp({ email, password })
      if (authError) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: authError.message })
      }
      if (!authData.user) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'User creation failed' })
      }

      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email,
          user_level: 'explorateur',
          kyc_status: 'pending',
          kyc_level: 0,
          points_balance: 100,
          preferences: {},
        })
      if (userError) {
        await supabase.auth.admin.deleteUser(authData.user.id)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'User profile creation failed' })
      }

      return { userId: authData.user.id }
    }),

  login: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string() }))
    .mutation(async ({ input }) => {
      const { email, password } = input
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Email ou mot de passe incorrect' })
      }
      if (!data.user || !data.session) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Connexion échouée' })
      }
      await supabase.from('users').update({ last_login_at: new Date().toISOString() }).eq('id', data.user.id)
      return { user: data.user, session: data.session, message: 'Connexion réussie' }
    }),

  me: protectedProcedure.query(async ({ ctx }) => {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select(`*, user_profiles (*)`)
      .eq('id', (ctx.user as any).id)
      .single()
    if (userError || !userData) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Utilisateur non trouvé' })
    }
    return userData
  }),
})

export const usersRouter = createRouter({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    // Delegate to auth.me
    return authRouter.createCaller(ctx).me()
  }),

  getPointsBalance: protectedProcedure.query(async ({ ctx }) => {
    const { data, error } = await supabase
      .from('users')
      .select('points_balance')
      .eq('id', (ctx.user as any).id)
      .single()
    if (error) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch points balance' })
    }
    return data.points_balance as number
  }),
})

export const appRouter = createRouter({
  auth: authRouter,
  users: usersRouter,
  admin: createRouter({
    partners: partnerRouter,
    orders: createRouter({
      list: adminProcedure
        .input(
          z
            .object({
              status: z
                .enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'])
                .optional(),
              limit: z.number().int().min(1).max(100).default(50),
              cursor: z.string().uuid().optional(),
            })
            .optional()
        )
        .query(async ({ input }) => {
          let q = supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false })
          if (input?.status) q = q.eq('status', input.status)
          if (input?.cursor) q = q.lt('id', input.cursor)
          q = q.limit(input?.limit ?? 50)
          const { data, error } = await q
          if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
          return { items: data, nextCursor: data?.at(-1)?.id ?? null }
        }),

      detail: adminProcedure
        .input(z.object({ orderId: z.string().uuid() }))
        .query(async ({ input }) => {
          const { data, error } = await supabase
            .from('orders')
            .select('*, order_items(*)')
            .eq('id', input.orderId)
            .single()
          if (error) throw new TRPCError({ code: 'NOT_FOUND', message: 'Order not found' })
          return data
        }),

      update_status: adminProcedure
        .input(
          z.object({
            orderId: z.string().uuid(),
            status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']),
            reason: z.string().optional(),
          })
        )
        .mutation(async ({ input }) => {
          const { data: order, error: orderErr } = await supabase
            .from('orders')
            .select('id, user_id, status, total_points')
            .eq('id', input.orderId)
            .single()
          if (orderErr || !order) throw new TRPCError({ code: 'NOT_FOUND', message: 'Order not found' })

          // Handle refund on cancel from confirmed
          if (input.status === 'cancelled' && order.status === 'confirmed') {
            const { data: userRow, error: userErr } = await supabase
              .from('users')
              .select('points_balance')
              .eq('id', (order as any).user_id)
              .single()
            if (userErr || !userRow) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Cannot load user' })
            const newBalance = (userRow.points_balance ?? 0) + (order as any).total_points
            const { error: upErr } = await supabase
              .from('users')
              .update({ points_balance: newBalance })
              .eq('id', (order as any).user_id)
            if (upErr) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: upErr.message })
            const { error: txErr } = await supabase.from('points_transactions').insert({
              user_id: (order as any).user_id,
              type: 'adjustment_admin',
              amount: (order as any).total_points,
              balance_after: newBalance,
              reference_type: 'order',
              reference_id: (order as any).id,
              description: input.reason || 'Order refund (admin)',
            })
            if (txErr) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: txErr.message })
          }

          const { error: upOrderErr } = await supabase
            .from('orders')
            .update({ status: input.status, admin_notes: input.reason ?? null })
            .eq('id', input.orderId)
          if (upOrderErr) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: upOrderErr.message })
          return { success: true }
        }),

      add_note: adminProcedure
        .input(z.object({ orderId: z.string().uuid(), note: z.string().min(1) }))
        .mutation(async ({ input }) => {
          const { error } = await supabase
            .from('orders')
            .update({ admin_notes: input.note })
            .eq('id', input.orderId)
          if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
          return { success: true }
        }),

      update: adminProcedure
        .input(
          z.object({
            orderId: z.string().uuid(),
            patch: z
              .object({
                status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']).optional(),
                admin_notes: z.string().optional(),
                tracking_number: z.string().optional(),
                shipping_carrier: z.string().optional(),
              })
              .refine((p) => Object.keys(p).length > 0, 'Patch cannot be empty'),
          })
        )
        .mutation(async ({ input }) => {
          const { data, error } = await supabase
            .from('orders')
            .update(input.patch as any)
            .eq('id', input.orderId)
            .select()
            .single()
          if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
          return data
        }),
    }),

    products: createRouter({
      list: adminProcedure
        .input(
          z
            .object({
              activeOnly: z.boolean().default(false),
              search: z.string().optional(),
              limit: z.number().int().min(1).max(100).default(50),
              cursor: z.string().uuid().optional(),
            })
            .optional()
        )
        .query(async ({ input }) => {
          let q = supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false })
          if (input?.activeOnly) q = q.eq('is_active', true)
          if (input?.search) q = q.or(`name.ilike.%${input.search}%,slug.ilike.%${input.search}%`)
          if (input?.cursor) q = q.lt('id', input.cursor)
          q = q.limit(input?.limit ?? 50)
          const { data, error } = await q
          if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
          return { items: data, nextCursor: data?.at(-1)?.id ?? null }
        }),

      create: adminProcedure
        .input(
          z.object({
            name: z.string().min(1),
            slug: z.string().min(1),
            price_points: z.number().int().min(0),
            category_id: z.string().uuid().optional(),
            producer_id: z.string().uuid().optional(),
            short_description: z.string().optional(),
            description: z.string().optional(),
            fulfillment_method: z.enum(['stock', 'dropship']).default('dropship'),
            is_active: z.boolean().default(true),
            featured: z.boolean().default(false),
            stock_quantity: z.number().int().min(0).default(0),
            min_tier: z.enum(['explorateur', 'protecteur', 'ambassadeur']).default('explorateur'),
          })
        )
        .mutation(async ({ input }) => {
          const { data, error } = await supabase
            .from('products')
            .insert(input as any)
            .select()
            .single()
          if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
          return data
        }),

      update: adminProcedure
        .input(
          z.object({
            id: z.string().uuid(),
            patch: z
              .object({
                name: z.string().optional(),
                slug: z.string().optional(),
                price_points: z.number().int().min(0).optional(),
                short_description: z.string().optional(),
                description: z.string().optional(),
                is_active: z.boolean().optional(),
                featured: z.boolean().optional(),
                stock_quantity: z.number().int().min(0).optional(),
                min_tier: z.enum(['explorateur', 'protecteur', 'ambassadeur']).optional(),
                category_id: z.string().uuid().optional(),
                producer_id: z.string().uuid().optional(),
                fulfillment_method: z.enum(['stock','dropship']).optional(),
                images: z.array(z.string().url()).optional(),
              })
              .refine((p) => Object.keys(p).length > 0, 'Patch cannot be empty'),
          })
        )
        .mutation(async ({ input }) => {
          const { data, error } = await supabase
            .from('products')
            .update(input.patch as any)
            .eq('id', input.id)
            .select()
            .single()
          if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
          return data
        }),

      inventoryAdjust: adminProcedure
        .input(z.object({ productId: z.string().uuid(), delta: z.number().int(), reason: z.string().optional() }))
        .mutation(async ({ input }) => {
          const { data: prod, error: prodErr } = await supabase
            .from('products')
            .select('stock_quantity')
            .eq('id', input.productId)
            .single()
          if (prodErr || !prod) throw new TRPCError({ code: 'NOT_FOUND', message: 'Product not found' })
          const newQty = Math.max(0, (prod as any).stock_quantity + input.delta)
          const { error: upErr } = await supabase
            .from('products')
            .update({ stock_quantity: newQty })
            .eq('id', input.productId)
          if (upErr) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: upErr.message })
          return { success: true, stock_quantity: newQty }
        }),
      detail: adminProcedure
        .input(z.object({ productId: z.string().uuid() }))
        .query(async ({ input }) => {
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', input.productId)
            .single()
          if (error) throw new TRPCError({ code: 'NOT_FOUND', message: 'Product not found' })
          return data
        }),
    }),

    projects: createRouter({
      list: adminProcedure
        .input(
          z
            .object({
              status: z.enum(['active', 'funded', 'closed', 'suspended']).optional(),
              type: z.enum(['beehive', 'olive_tree', 'vineyard']).optional(),
              search: z.string().optional(),
              limit: z.number().int().min(1).max(100).default(50),
              cursor: z.string().uuid().optional(),
            })
            .optional()
        )
        .query(async ({ input }) => {
          let q = supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false })

          if (input?.status) q = q.eq('status', input.status);
          if (input?.type) q = q.eq('type', input.type);
          if (input?.search) q = q.or(`name.ilike.%${input.search}%,slug.ilike.%${input.search}%`);
          if (input?.cursor) q = q.lt('id', input.cursor);
          q = q.limit(input?.limit ?? 50);

          const { data, error } = await q;
          if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
          return { items: data, nextCursor: data?.at(-1)?.id ?? null };
        }),

      byId: adminProcedure
        .input(z.object({ id: z.string().uuid() }))
        .query(async ({ input }) => {
          const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', input.id)
            .single();
          if (error) throw new TRPCError({ code: 'NOT_FOUND', message: 'Project not found' });
          return data;
        }),

      create: adminProcedure
        .input(z.object({
          name: z.string().min(1),
          slug: z.string().min(1),
          type: z.enum(['beehive', 'olive_tree', 'vineyard']),
          target_budget: z.number().int().min(0),
          producer_id: z.string().uuid().optional(),
          description: z.string().optional(),
          long_description: z.string().optional(),
          status: z.enum(['active', 'funded', 'closed', 'suspended']).default('active'),
          featured: z.boolean().default(false),
          images: z.array(z.string()).optional(),
        }))
        .mutation(async ({ input }) => {
          const { data, error } = await supabase
            .from('projects')
            .insert(input)
            .select()
            .single();
          if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
          return data;
        }),

      update: adminProcedure
        .input(z.object({
          id: z.string().uuid(),
          patch: z.object({
            name: z.string().min(1).optional(),
            slug: z.string().min(1).optional(),
            type: z.enum(['beehive', 'olive_tree', 'vineyard']).optional(),
            target_budget: z.number().int().min(0).optional(),
            producer_id: z.string().uuid().optional(),
            description: z.string().optional(),
            long_description: z.string().optional(),
            status: z.enum(['active', 'funded', 'closed', 'suspended']).optional(),
            featured: z.boolean().optional(),
            images: z.array(z.string()).optional(),
          })
        }))
        .mutation(async ({ input }) => {
          const { data, error } = await supabase
            .from('projects')
            .update(input.patch)
            .eq('id', input.id)
            .select()
            .single();
          if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
          return data;
        }),
    }),

    users: createRouter({
      list: adminProcedure
        .input(z.object({ q: z.string().optional(), limit: z.number().int().min(1).max(100).default(50), cursor: z.string().uuid().optional() }).optional())
        .query(async ({ input }) => {
          let q = supabase.from('users').select('id, email, user_level, points_balance').order('created_at', { ascending: false })
          if (input?.q) q = q.ilike('email', `%${input.q}%`)
          if (input?.cursor) q = q.lt('id', input.cursor)
          q = q.limit(input?.limit ?? 50)
          const { data, error } = await q
          if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
          return { items: data, nextCursor: data?.at(-1)?.id ?? null }
        }),

      detail: adminProcedure
        .input(z.object({ userId: z.string().uuid() }))
        .query(async ({ input }) => {
          const { data, error } = await supabase
            .from('users')
            .select('id, email, user_level, points_balance, kyc_status, kyc_level')
            .eq('id', input.userId)
            .single()
          if (error) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
          return data
        }),

      update: adminProcedure
        .input(
          z.object({
            userId: z.string().uuid(),
            patch: z
              .object({
                name: z.string().optional(),
                email: z.string().email().optional(),
                phone: z.string().optional(),
                user_level: z.enum(['explorateur', 'protecteur', 'ambassadeur']).optional(),
                points_balance: z.number().int().min(0).optional(),
                is_active: z.boolean().optional(),
                kyc_level: z.number().int().min(0).max(3).optional(),
                kyc_status: z.enum(['none', 'pending', 'verified', 'rejected']).optional(),
                last_login_at: z.string().optional(),
              })
              .refine((p) => Object.keys(p).length > 0, 'Patch cannot be empty'),
          })
        )
        .mutation(async ({ input }) => {
          const { data, error } = await supabase
            .from('users')
            .update(input.patch as any)
            .eq('id', input.userId)
            .select()
            .single()
          if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
          return data
        }),

      suspend: adminProcedure
        .input(
          z.object({
            userId: z.string().uuid(),
            reason: z.string().optional(),
          })
        )
        .mutation(async ({ input }) => {
          const { data, error } = await supabase
            .from('users')
            .update({
              is_active: false,
              suspended_at: new Date().toISOString(),
              suspension_reason: input.reason,
            })
            .eq('id', input.userId)
            .select()
            .single()
          if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
          return data
        }),

      activate: adminProcedure
        .input(z.object({ userId: z.string().uuid() }))
        .mutation(async ({ input }) => {
          const { data, error } = await supabase
            .from('users')
            .update({
              is_active: true,
              suspended_at: null,
              suspension_reason: null,
            })
            .eq('id', input.userId)
            .select()
            .single()
          if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
          return data
        }),
    }),
  }),

  // Public routers from backup
  products: createRouter({
    list: publicProcedure
      .input(
        z
          .object({
            categoryId: z.string().uuid().optional(),
            featured: z.boolean().optional(),
            minTier: z.enum(['explorateur', 'protecteur', 'ambassadeur']).optional(),
            search: z.string().min(1).max(64).optional(),
            limit: z.number().int().min(1).max(100).default(24),
            cursor: z.string().uuid().optional(),
          })
          .optional()
      )
      .query(async ({ input }) => {
        let query = supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })

        if (input?.categoryId) query = query.eq('category_id', input.categoryId)
        if (input?.featured !== undefined) query = query.eq('featured', input.featured)
        if (input?.minTier) query = query.gte('min_tier', input.minTier)
        if (input?.search) {
          query = query.or(
            `name.ilike.%${input.search}%,tags.cs.{${input.search.toLowerCase()}}`
          )
        }
        if (input?.cursor) {
          query = query.lt('id', input.cursor)
        }
        query = query.limit(input?.limit ?? 24)

        const { data, error } = await query
        if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
        return { items: data, nextCursor: data?.at(-1)?.id ?? null }
      }),

    bySlug: publicProcedure
      .input(z.object({ slug: z.string().min(1) }))
      .query(async ({ input }) => {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('slug', input.slug)
          .eq('is_active', true)
          .single()
        if (error) throw new TRPCError({ code: 'NOT_FOUND', message: 'Product not found' })
        return data
      }),
  }),

  pricing: createRouter({
    quote: publicProcedure
      .input(
        z.object({
          items: z
            .array(
              z.object({
                productId: z.string().uuid(),
                quantity: z.number().int().positive().max(999),
              })
            )
            .min(1),
        })
      )
      .query(async ({ input }) => getQuote(input)),
  }),

  orders: createRouter({
    create: protectedProcedure
      .input(
        z.object({
          items: z.array(
            z.object({ productId: z.string().uuid(), quantity: z.number().int().positive() })
          ).min(1),
          shippingAddress: z.object({
            street: z.string(), city: z.string(), postalCode: z.string(), country: z.string(), firstName: z.string(), lastName: z.string(),
          }),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const quote = await getQuote({ items: input.items })
        const { data: orderRow, error: orderError }: any = await supabase
          .from('orders')
          .insert({
            user_id: (ctx.user as any).id,
            status: 'pending',
            total_points: quote.totalPoints,
            shipping_address: input.shippingAddress,
          })
          .select()
          .single()
        if (orderError) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: orderError.message })

        const itemsPayload = quote.lineItems.map((li: any) => ({
          order_id: orderRow.id,
          product_id: li.productId,
          quantity: li.quantity,
          unit_price_points: li.unitPricePoints,
          total_price_points: li.totalPricePoints,
        }))
        const { error: itemsError } = await supabase.from('order_items').insert(itemsPayload)
        if (itemsError) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: itemsError.message })

        return { orderId: orderRow.id }
      }),
  }),

  points: createRouter({
    balance: protectedProcedure.query(async ({ ctx }) => {
      const { data, error } = await supabase
        .from('users')
        .select('points_balance')
        .eq('id', (ctx.user as any).id)
        .single()
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return { balance: data.points_balance as number }
    }),
  }),

  investments: createRouter({
    createAdoption: protectedProcedure
      .input(
        z.object({
          projectId: z.string().uuid(),
          type: z.enum(['beehive', 'olive_tree', 'family_plot']),
          eurAmount: z.number().positive(),
          partner: z.enum(['habeebee', 'ilanga', 'promiel', 'multi']).default('habeebee'),
          bonusPercentage: z.number().min(0).max(100).default(30),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const calc = calculateInvestmentPoints({
          type: input.type,
          amount_eur: input.eurAmount,
          bonus_percentage: input.bonusPercentage,
          partner: input.partner,
        })
        const { data: inv, error: invErr } = await supabase
          .from('investments')
          .insert({
            user_id: (ctx.user as any).id,
            project_id: input.projectId,
            amount_points: calc.total_points,
            amount_eur_equivalent: input.eurAmount,
            status: 'active',
          })
          .select()
          .single()
        if (invErr) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: invErr.message })

        const { data: userRow, error: userErr } = await supabase
          .from('users')
          .select('points_balance')
          .eq('id', (ctx.user as any).id)
          .single()
        if (userErr || !userRow) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Cannot load user' })
        const newBalance = (userRow.points_balance ?? 0) + calc.total_points
        const { error: upErr } = await supabase
          .from('users')
          .update({ points_balance: newBalance })
          .eq('id', (ctx.user as any).id)
        if (upErr) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: upErr.message })

        const { error: txErr } = await supabase.from('points_transactions').insert({
          user_id: (ctx.user as any).id,
          type: 'earned_purchase',
          amount: calc.total_points,
          balance_after: newBalance,
          reference_type: 'investment',
          reference_id: inv.id,
          description: `Adoption ${input.type}`,
        })
        if (txErr) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: txErr.message })

        return { investmentId: inv.id, pointsEarned: calc.total_points, balanceAfter: newBalance }
      }),
  }),
})

export type AppRouter = typeof appRouter