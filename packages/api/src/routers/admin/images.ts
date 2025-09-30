/**
 * Admin Images Router
 */
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createRouter, adminProcedure } from '../../trpc'
import { createClient } from '@supabase/supabase-js'

// Supabase service client
const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

export const imagesRouter = createRouter({
  upload: adminProcedure
    .input(z.object({
      entityType: z.enum(['product', 'producer', 'project', 'user_profile', 'category']),
      entityId: z.string().uuid(),
      file: z.string(), // Base64 encoded file
      filename: z.string(),
    }))
    .mutation(async ({ input }) => {
      // TODO: Implement image upload logic
      // This is a placeholder for the actual implementation
      throw new TRPCError({
        code: 'NOT_IMPLEMENTED',
        message: 'Image upload not implemented yet'
      })
    }),

  delete: adminProcedure
    .input(z.object({
      entityType: z.enum(['product', 'producer', 'project', 'user_profile', 'category']),
      entityId: z.string().uuid(),
      imageUrl: z.string().url(),
    }))
    .mutation(async ({ input }) => {
      // TODO: Implement image deletion logic
      throw new TRPCError({
        code: 'NOT_IMPLEMENTED',
        message: 'Image deletion not implemented yet'
      })
    }),

  list: adminProcedure
    .input(z.object({
      entityType: z.enum(['product', 'producer', 'project', 'user_profile', 'category']).optional(),
      entityId: z.string().uuid().optional(),
      limit: z.number().int().min(1).max(100).default(50),
    }))
    .query(async ({ input }) => {
      // TODO: Implement image listing logic
      return {
        images: [],
        total: 0
      }
    }),
})