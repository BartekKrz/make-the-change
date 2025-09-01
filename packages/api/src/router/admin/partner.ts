import { z } from 'zod';
import { initTRPC } from '@trpc/server';
import type { TRPCContext } from '../../context';

const t = initTRPC.context<TRPCContext>().create();
const createRouter = t.router;
const publicProcedure = t.procedure;

// Auth middleware
const isAuthenticated = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new Error('Authentication required');
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});

const protectedProcedure = publicProcedure.use(isAuthenticated);

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
    // This would normally check user_level, but for now we'll use email allowlist
    allowed = true; // Temporarily allow all authenticated users
  }
  if (!allowed) throw new Error('Admin access required');
  return next();
});

const adminProcedure = protectedProcedure.use(isAdminMw);

import { partnerFormSchema } from '../../validators/partner';


// Mock Database
const mockPartners = [
  {
    id: 'part_1',
    name: 'Habeebee',
    slug: 'habeebee',
    contact_email: 'contact@habeebee.com',
    website: 'https://habeebee.com',
    description: 'Producteur de miel biologique en Provence.',
    status: 'active' as const,
  },
  {
    id: 'part_2',
    name: 'Ilanga Nature',
    slug: 'ilanga-nature',
    contact_email: 'info@ilanga-nature.com',
    website: 'https://ilanga-nature.com',
    description: 'Spécialiste des huiles essentielles de Madagascar.',
    status: 'active' as const,
  },
  {
    id: 'part_3',
    name: 'Promiel',
    slug: 'promiel',
    contact_email: 'contact@promiel.fr',
    website: 'https://promiel.fr',
    description: 'Coopérative apicole pour la protection des abeilles.',
    status: 'pending' as const,
  },
];

export const partnerRouter = createRouter({
  list: adminProcedure
    .input(
      z.object({
        q: z.string().optional(),
        status: z.enum(['active', 'pending', 'archived']).optional(),
      })
    )
    .query(({ input }) => {
      let filteredPartners = [...mockPartners];

      if (input.q) {
        const query = input.q.toLowerCase();
        filteredPartners = filteredPartners.filter(p => 
          p.name.toLowerCase().includes(query) || 
          p.contact_email.toLowerCase().includes(query)
        );
      }

      if (input.status) {
        filteredPartners = filteredPartners.filter(p => p.status === input.status);
      }

      return {
        items: filteredPartners,
        nextCursor: null, // Mocked: no pagination in mock data
      };
    }),

  byId: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      const partner = mockPartners.find(p => p.id === input.id);
      if (!partner) {
        throw new Error('Partner not found');
      }
      return partner;
    }),

  create: adminProcedure
    .input(partnerFormSchema)
    .mutation(({ input }) => {
      const newPartner = {
        id: `part_${Math.random().toString(36).substring(2, 9)}`,
        ...input,
      };
      mockPartners.push(newPartner);
      return newPartner;
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        patch: partnerFormSchema.partial(),
      })
    )
    .mutation(({ input }) => {
      const index = mockPartners.findIndex(p => p.id === input.id);
      if (index === -1) {
        throw new Error('Partner not found');
      }
      const updatedPartner = { ...mockPartners[index], ...input.patch };
      mockPartners[index] = updatedPartner;
      return updatedPartner;
    })
});