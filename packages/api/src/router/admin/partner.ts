import { z } from 'zod';
import { initTRPC, TRPCError } from '@trpc/server';
import { createClient } from '@supabase/supabase-js';
import type { TRPCContext } from '../../context';

// Supabase service client for server-side ops
const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const t = initTRPC.context<TRPCContext>().create();
const createRouter = t.router;
const publicProcedure = t.procedure;

// Auth middleware
const isAuthenticated = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Authentication required' });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});

const protectedProcedure = publicProcedure.use(isAuthenticated);

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
      .single()
    allowed = ['admin', 'super_admin'].includes(((data as any)?.user_level ?? '').toLowerCase())
  }
  if (!allowed) throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  return next();
});

const adminProcedure = protectedProcedure.use(isAdminMw);

import { partnerFormSchema } from '../../validators/partner';

export const partnerRouter = createRouter({
  list: adminProcedure
    .input(
      z.object({
        q: z.string().optional(),
        status: z.enum(['active', 'inactive', 'suspended']).optional(),
        limit: z.number().int().min(1).max(100).default(50),
        cursor: z.string().uuid().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      let query = supabase
        .from('producers')
        .select('*')
        .order('created_at', { ascending: false });

      if (input?.q) {
        const searchTerm = input.q.toLowerCase();
        query = query.or(
          `name.ilike.%${searchTerm}%,contact_info->>email.ilike.%${searchTerm}%`
        );
      }

      if (input?.status) {
        query = query.eq('status', input.status);
      }

      if (input?.cursor) {
        query = query.lt('id', input.cursor);
      }

      query = query.limit(input?.limit ?? 50);

      const { data, error } = await query;
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });

      // Transform producers to match partner format expected by frontend
      const items = (data || []).map(producer => ({
        id: producer.id,
        name: producer.name,
        slug: producer.slug,
        contact_email: (producer.contact_info as any)?.email || '',
        website: (producer.contact_info as any)?.website || '',
        description: producer.description || '',
        status: producer.status,
      }));

      return {
        items,
        nextCursor: data?.at(-1)?.id ?? null,
      };
    }),

  byId: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const { data, error } = await supabase
        .from('producers')
        .select('*')
        .eq('id', input.id)
        .single();
      
      if (error) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Partner not found' });
      }

      // Transform producer to match partner format expected by frontend
      return {
        id: data.id,
        name: data.name,
        slug: data.slug,
        contact_email: (data.contact_info as any)?.email || '',
        website: (data.contact_info as any)?.website || '',
        description: data.description || '',
        status: data.status,
      };
    }),

  create: adminProcedure
    .input(partnerFormSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await supabase
        .from('producers')
        .insert({
          name: input.name,
          slug: input.slug,
          type: 'cooperative', // default type
          description: input.description,
          address: {}, // empty object for now
          contact_info: {
            email: input.contact_email,
            website: input.website,
          },
          status: input.status,
        })
        .select()
        .single();

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
      
      // Transform back to partner format
      return {
        id: data.id,
        name: data.name,
        slug: data.slug,
        contact_email: (data.contact_info as any)?.email || '',
        website: (data.contact_info as any)?.website || '',
        description: data.description || '',
        status: data.status,
      };
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        patch: partnerFormSchema.partial(),
      })
    )
    .mutation(async ({ input }) => {
      // First get current data
      const { data: current, error: fetchError } = await supabase
        .from('producers')
        .select('contact_info')
        .eq('id', input.id)
        .single();

      if (fetchError) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Partner not found' });
      }

      // Prepare update data
      const updateData: any = {};
      if (input.patch.name) updateData.name = input.patch.name;
      if (input.patch.slug) updateData.slug = input.patch.slug;
      if (input.patch.description) updateData.description = input.patch.description;
      if (input.patch.status) updateData.status = input.patch.status;
      
      // Update contact_info if needed
      if (input.patch.contact_email || input.patch.website) {
        const currentContactInfo = (current.contact_info as any) || {};
        updateData.contact_info = {
          ...currentContactInfo,
          ...(input.patch.contact_email && { email: input.patch.contact_email }),
          ...(input.patch.website && { website: input.patch.website }),
        };
      }

      const { data, error } = await supabase
        .from('producers')
        .update(updateData)
        .eq('id', input.id)
        .select()
        .single();

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });

      // Transform back to partner format
      return {
        id: data.id,
        name: data.name,
        slug: data.slug,
        contact_email: (data.contact_info as any)?.email || '',
        website: (data.contact_info as any)?.website || '',
        description: data.description || '',
        status: data.status,
      };
    })
});