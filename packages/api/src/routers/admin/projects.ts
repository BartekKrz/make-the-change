/**
 * Admin Projects Router
 */
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'
import { createRouter, adminProcedure } from '../../trpc'

// Supabase service client
const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

export const adminProjectsRouter = createRouter({
  list: adminProcedure
    .input(
      z
        .object({
          cursor: z.string().optional(),
          search: z.string().optional(),
          status: z.enum(['active', 'funded', 'closed', 'suspended']).optional(),
          activeOnly: z.boolean().optional(),
          partnerId: z.string().optional(),
          projectType: z.string().optional(),
          country: z.string().optional(),
          impactTypes: z.array(z.string()).optional(),
          sortBy: z.enum([
            'created_at_desc',
            'created_at_asc',
            'name_asc',
            'name_desc',
            'target_budget_desc',
            'target_budget_asc',
            'featured_first'
          ]).optional(),
          limit: z.number().int().min(1).max(100).default(18),
        })
        .optional()
    )
    .query(async ({ input }) => {
      let q = supabase
        .from('projects')
        .select(`
          *,
          partner:producers!projects_producer_id_fkey(id, name)
        `);

      // Apply filters
      if (input?.search) {
        q = q.or(`name.ilike.%${input.search}%,description.ilike.%${input.search}%`);
      }

      if (input?.status) {
        q = q.eq('status', input.status);
      } else if (input?.activeOnly) {
        q = q.eq('status', 'active');
      }

      if (input?.partnerId) {
        q = q.eq('producer_id', input.partnerId);
      }

      if (input?.projectType) {
        q = q.eq('type', input.projectType);
      }

      if (input?.country) {
        q = q.eq('address->>country', input.country);
      }

      if (input?.impactTypes && input.impactTypes.length > 0) {
        // Filter by impact types (array contains any of the specified types)
        const impactFilter = input.impactTypes.map(type => `impact_types.cs.["${type}"]`).join(',');
        q = q.or(impactFilter);
      }

      // Apply sorting
      const sortBy = input?.sortBy || 'created_at_desc';
      switch (sortBy) {
        case 'created_at_asc':
          q = q.order('created_at', { ascending: true });
          break;
        case 'name_asc':
          q = q.order('name', { ascending: true });
          break;
        case 'name_desc':
          q = q.order('name', { ascending: false });
          break;
        case 'target_budget_desc':
          q = q.order('target_budget', { ascending: false });
          break;
        case 'target_budget_asc':
          q = q.order('target_budget', { ascending: true });
          break;
        case 'featured_first':
          q = q.order('featured', { ascending: false }).order('created_at', { ascending: false });
          break;
        case 'created_at_desc':
        default:
          q = q.order('created_at', { ascending: false });
          break;
      }

      // Apply pagination
      if (input?.cursor) {
        q = q.lt('created_at', input.cursor);
      }

      q = q.limit(input?.limit ?? 18);

      const { data, error } = await q;
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });

      // Prepare result list
      const projectsList = data ?? [];

      // Get total count for pagination
      let countQuery = supabase
        .from('projects')
        .select('id', { count: 'exact', head: true });

      // Apply same filters for count
      if (input?.search) {
        countQuery = countQuery.or(`name.ilike.%${input.search}%,description.ilike.%${input.search}%`);
      }
      if (input?.status) {
        countQuery = countQuery.eq('status', input.status);
      } else if (input?.activeOnly) {
        countQuery = countQuery.eq('status', 'active');
      }
      if (input?.partnerId) {
        countQuery = countQuery.eq('producer_id', input.partnerId);
      }
      if (input?.projectType) {
        countQuery = countQuery.eq('type', input.projectType);
      }
      if (input?.country) {
        countQuery = countQuery.eq('address->>country', input.country);
      }

      if (input?.impactTypes && input.impactTypes.length > 0) {
        const impactFilter = input.impactTypes.map(type => `impact_types.cs.["${type}"]`).join(',');
        countQuery = countQuery.or(impactFilter);
      }

      const { count } = await countQuery;

      return {
        items: projectsList,
        total: count || 0,
        nextCursor: data?.at(-1)?.created_at || null
      };
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

  partners: adminProcedure
    .query(async () => {
      const { data, error } = await supabase
        .from('producers')
        .select('id, name')
        .order('name');
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
      return data;
    }),

  countries: adminProcedure
    .input(z.object({ activeOnly: z.boolean().optional() }).optional())
    .query(async ({ input }) => {
      let q = supabase
        .from('projects')
        .select('address')
        .not('address', 'is', null);

      if (input?.activeOnly) {
        q = q.eq('status', 'active');
      }

      const { data, error } = await q;
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });

      // Extract unique countries and format them
      const uniqueCountries = [...new Set(
        data?.map(item => item.address?.country).filter(Boolean)
      )];
      return uniqueCountries.map(country => ({ id: country, name: country }));
    }),

  impactTypes: adminProcedure
    .input(z.object({
      activeOnly: z.boolean().optional(),
      withStats: z.boolean().optional()
    }).optional())
    .query(async ({ input }) => {
      let q = supabase
        .from('projects')
        .select('impact_types')
        .not('impact_types', 'is', null);

if (input?.activeOnly) {
        q = q.eq('status', 'active');
      }

      const { data, error } = await q;
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });

      // Extract and flatten all impact types
      const allImpactTypes = data?.flatMap(item =>
        Array.isArray(item.impact_types) ? item.impact_types : []
      ).filter(Boolean) || [];

      const uniqueTypes = [...new Set(allImpactTypes)];

      if (input?.withStats) {
        return {
          types: uniqueTypes,
          stats: uniqueTypes.map(type => ({
            type,
            count: allImpactTypes.filter(t => t === type).length
          }))
        };
      }

      return { types: uniqueTypes };
    }),
})





