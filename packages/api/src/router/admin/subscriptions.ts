import { z } from 'zod';
import { initTRPC } from '@trpc/server';
import { createClient } from '@supabase/supabase-js';
import type { TRPCContext } from '../../context';

const t = initTRPC.context<TRPCContext>().create();
const createRouter = t.router;

// Supabase service client for server-side ops
const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Auth middleware (réutilise la logique existante)
const isAuthenticated = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new Error('Authentication required');
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});

const protectedProcedure = t.procedure.use(isAuthenticated);

// Admin guard
const isAdminMw = t.middleware(async ({ ctx, next }) => {
  if (!ctx.user) throw new Error('Unauthorized');
  const allow = (process.env.ADMIN_EMAIL_ALLOWLIST || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const email = (((ctx.user as any)?.email as string) || '').toLowerCase();
  let allowed = false;
  if (allow.length) {
    allowed = allow.includes(email);
  } else {
    // Check user_level in database
    const { data } = await supabase
      .from('user_profiles')
      .select('user_level')
      .eq('id', ctx.user.id)
      .single();
    allowed = ['admin', 'super_admin'].includes(((data as any)?.user_level ?? '').toLowerCase());
  }
  if (!allowed) throw new Error('Admin access required');
  return next();
});

const adminProcedure = protectedProcedure.use(isAdminMw);

// Schemas de validation
const subscriptionFilterSchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(20),
  search: z.string().optional(),
  status: z.enum(['active', 'cancelled', 'suspended', 'past_due']).optional(),
  subscriptionTier: z.enum(['ambassadeur_standard', 'ambassadeur_premium']).optional(),
  billingFrequency: z.enum(['monthly', 'annual']).optional(),
});

const subscriptionUpdateSchema = z.object({
  id: z.string(),
  patch: z.object({
    subscription_tier: z.enum(['ambassadeur_standard', 'ambassadeur_premium']).optional(),
    billing_frequency: z.enum(['monthly', 'annual']).optional(),
    status: z.enum(['active', 'cancelled', 'suspended', 'past_due']).optional(),
    amount_eur: z.number().optional(),
  }),
});

export const adminSubscriptionsRouter = createRouter({
  // ✅ Lecture - Liste avec filtres
  list: adminProcedure
    .input(subscriptionFilterSchema)
    .query(async ({ input }) => {
      let query = supabase
        .from('subscriptions')
        .select(`
          *,
          users!inner(email, id,
            user_profiles(first_name, last_name, avatar_url)
          )
        `)
        .order('created_at', { ascending: false });

      // Filtres
      if (input.status) {
        query = query.eq('status', input.status);
      }
      if (input.subscriptionTier) {
        query = query.eq('subscription_tier', input.subscriptionTier);
      }
      if (input.billingFrequency) {
        query = query.eq('billing_frequency', input.billingFrequency);
      }
      if (input.search) {
        query = query.or(`users.email.ilike.%${input.search}%,users.user_profiles.first_name.ilike.%${input.search}%,users.user_profiles.last_name.ilike.%${input.search}%`);
      }

      // Pagination
      const offset = (input.page - 1) * input.limit;
      query = query.range(offset, offset + input.limit - 1);
      
      const { data, error } = await query;

      if (error) throw new Error(error.message);

      return {
        items: data || [],
        total: data?.length || 0,
        hasMore: (data?.length || 0) === input.limit,
      };
    }),

  // ✅ Lecture - Détail abonnement
  byId: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const { data, error } = await supabase
        .from('subscriptions')
        .select(`
          *,
          users!inner(email, id,
            user_profiles(first_name, last_name, avatar_url, phone)
          ),
          subscription_billing_history(*)
        `)
        .eq('id', input.id)
        .single();

      if (error) throw new Error(error.message);
      if (!data) throw new Error('Abonnement introuvable');

      return data;
    }),

  // ✅ Création - Nouvel abonnement
  create: adminProcedure
    .input(z.object({
      user_id: z.string(),
      subscription_tier: z.enum(['ambassadeur_standard', 'ambassadeur_premium']),
      billing_frequency: z.enum(['monthly', 'annual']),
      amount_eur: z.number(),
      start_date: z.string(),
    }))
    .mutation(async ({ input }) => {
      const { data, error } = await supabase
        .from('subscriptions')
        .insert({
          ...input,
          status: 'active',
          currency: 'EUR',
          next_billing_date: new Date(
            new Date(input.start_date).getTime() + 
            (input.billing_frequency === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000
          ).toISOString(),
        })
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    }),

  // ✅ Mise à jour - Modification abonnement
  update: adminProcedure
    .input(subscriptionUpdateSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await supabase
        .from('subscriptions')
        .update({
          ...input.patch,
          updated_at: new Date().toISOString(),
        })
        .eq('id', input.id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    }),

  // ✅ Actions - Suspension
  suspend: adminProcedure
    .input(z.object({
      id: z.string(),
      reason: z.string(),
    }))
    .mutation(async ({ input }) => {
      const { data, error } = await supabase
        .from('subscriptions')
        .update({
          status: 'suspended',
          suspended_reason: input.reason,
          suspended_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', input.id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    }),

  // ✅ Actions - Réactivation
  reactivate: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { data, error } = await supabase
        .from('subscriptions')
        .update({
          status: 'active',
          suspended_reason: null,
          suspended_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', input.id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    }),
});
