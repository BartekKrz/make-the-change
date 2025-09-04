import { z } from 'zod';
import { initTRPC, TRPCError } from '@trpc/server';
import { createClient } from '@supabase/supabase-js';
import type { TRPCContext } from '../../context';

// Supabase service client for server-side ops
const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const t = initTRPC.context<TRPCContext>().create();
const createRouter = t.router;

// Auth middleware
const isAuthenticated = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Authentication required' });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});

const protectedProcedure = t.procedure.use(isAuthenticated);

// Admin guard
const isAdminMw = t.middleware(async ({ ctx, next }) => {
  if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });
  const allow = (process.env.ADMIN_EMAIL_ALLOWLIST || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const email = (((ctx.user as any)?.email as string) || '').toLowerCase();
  let allowed = false;
  if (allow.length) {
    allowed = allow.includes(email);
  } else {
    const { data } = await supabase
      .from('users')
      .select('user_level')
      .eq('id', (ctx.user as any).id)
      .single();
    allowed = ['admin', 'super_admin'].includes(((data as any)?.user_level ?? '').toLowerCase());
  }
  if (!allowed) throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  return next();
});

const adminProcedure = protectedProcedure.use(isAdminMw);

// Helper function to build category tree
function buildCategoryTree(categories: any[]): any[] {
  const categoryMap = new Map();
  const rootCategories: any[] = [];

  // Create a map of all categories
  categories.forEach(category => {
    categoryMap.set(category.id, { ...category, children: [] });
  });

  // Build the tree structure
  categories.forEach(category => {
    if (category.parent_id) {
      const parent = categoryMap.get(category.parent_id);
      if (parent) {
        parent.children.push(categoryMap.get(category.id));
      }
    } else {
      rootCategories.push(categoryMap.get(category.id));
    }
  });

  return rootCategories;
}

export const categoriesRouter = createRouter({
  list: adminProcedure
    .input(z.object({
      activeOnly: z.boolean().default(true),
      parentId: z.string().uuid().optional(), // Pour hiérarchie
    }))
    .query(async ({ input }) => {
      let query = supabase
        .from('categories')
        .select('id, name, slug, parent_id, sort_order')
        .order('sort_order', { ascending: true });
      
      if (input.activeOnly) query = query.eq('is_active', true);
      if (input.parentId) query = query.eq('parent_id', input.parentId);
      
      const { data, error } = await query;
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
      return data;
    }),

  tree: adminProcedure
    .query(async () => {
      // Structure hiérarchique complète
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug, parent_id, sort_order')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
      
      // Transformer en arbre
      return buildCategoryTree(data);
    }),
});
