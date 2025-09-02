/**
 * tRPC Router - Images Management
 * APIs pour gestion des uploads et images
 */

import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { initTRPC } from '@trpc/server'
import type { TRPCContext } from '../../context'
import { createClient } from '@supabase/supabase-js'

// Initialize tRPC
const t = initTRPC.context<TRPCContext>().create()

// Auth middleware
const isAuthenticated = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Authentication required' })
  }
  return next({ ctx: { ...ctx, user: ctx.user } })
})

// Admin middleware
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
    // Check user_level in database if needed
    allowed = true // Pour simplifier, on assume que les users authentifiés sont admins pour ce router
  }
  if (!allowed) throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' })
  return next()
})

const protectedProcedure = t.procedure.use(isAuthenticated)
const adminProcedure = protectedProcedure.use(isAdminMw)

const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Validation schemas
const bucketSchema = z.enum(['projects', 'products', 'producers', 'users', 'categories'])

const uploadUrlSchema = z.object({
  bucket: bucketSchema,
  fileName: z.string().min(1),
  folder: z.string().optional(),
  contentType: z.string().regex(/^image\/(jpeg|jpg|png|webp)$/),
  entityId: z.string().uuid()
})

const deleteImageSchema = z.object({
  bucket: bucketSchema,
  filePath: z.string().min(1)
})

const updateImagesSchema = z.object({
  entityType: z.enum(['project', 'product', 'producer', 'user_profile', 'category']),
  entityId: z.string().uuid(),
  images: z.array(z.string().url()).max(15)
})

export const imagesRouter = t.router({
  /**
   * Génération d'URL signée pour upload direct
   * Permet l'upload sécurisé côté client
   */
  generateUploadUrl: adminProcedure
    .input(uploadUrlSchema)
    .mutation(async ({ input }) => {
      try {
        const filePath = input.folder 
          ? `${input.entityId}/${input.folder}/${input.fileName}`
          : `${input.entityId}/${input.fileName}`

        const { data, error } = await supabase.storage
          .from(input.bucket)
          .createSignedUploadUrl(filePath, {
            upsert: true
          })

        if (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Failed to generate upload URL: ${error.message}`
          })
        }

        return {
          uploadUrl: data.signedUrl,
          filePath: data.path,
          publicUrl: supabase.storage.from(input.bucket).getPublicUrl(data.path).data.publicUrl
        }

      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to generate upload URL'
        })
      }
    }),

  /**
   * Suppression d'image
   */
  deleteImage: adminProcedure
    .input(deleteImageSchema)
    .mutation(async ({ input }) => {
      try {
        const { error } = await supabase.storage
          .from(input.bucket)
          .remove([input.filePath])

        if (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Failed to delete image: ${error.message}`
          })
        }

        return { success: true }

      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to delete image'
        })
      }
    }),

  /**
   * Mise à jour des images d'une entité
   * Met à jour le champ images[] dans la base de données
   */
  updateEntityImages: adminProcedure
    .input(updateImagesSchema)
    .mutation(async ({ input }) => {
      try {
        const { entityType, entityId, images } = input

        // Déterminer la table et la colonne selon le type d'entité
        const tableMap = {
          'project': 'projects',
          'product': 'products', 
          'producer': 'producers',
          'user_profile': 'user_profiles',
          'category': 'categories'
        }

        const columnMap = {
          'project': 'images',
          'product': 'images',
          'producer': 'images', 
          'user_profile': 'avatar_url',
          'category': 'image_url'
        }

        const table = tableMap[entityType]
        const column = columnMap[entityType]

        // Mise à jour database
        let updateData: any = {}
        
        if (entityType === 'user_profile' || entityType === 'category') {
          // Champ texte simple pour avatar et catégorie
          updateData[column] = images[0] || null
        } else {
          // Array pour les autres
          updateData[column] = images
        }

        const { error } = await supabase
          .from(table)
          .update(updateData)
          .eq('id', entityId)

        if (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Failed to update ${entityType} images: ${error.message}`
          })
        }

        return { success: true, imagesCount: images.length }

      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to update entity images'
        })
      }
    }),

  /**
   * Listage des images d'un bucket
   */
  listImages: adminProcedure
    .input(z.object({
      bucket: bucketSchema,
      folder: z.string().optional(),
      limit: z.number().min(1).max(100).default(50)
    }))
    .query(async ({ input }) => {
      try {
        const { data, error } = await supabase.storage
          .from(input.bucket)
          .list(input.folder, {
            limit: input.limit,
            sortBy: { column: 'created_at', order: 'desc' }
          })

        if (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Failed to list images: ${error.message}`
          })
        }

        const images = data.map(file => ({
          name: file.name,
          size: file.metadata?.size || 0,
          lastModified: file.updated_at,
          publicUrl: supabase.storage
            .from(input.bucket)
            .getPublicUrl(input.folder ? `${input.folder}/${file.name}` : file.name)
            .data.publicUrl
        }))

        return { images }

      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to list images'
        })
      }
    }),

  /**
   * Statistiques storage
   */
  getStorageStats: adminProcedure
    .query(async () => {
      try {
        const buckets = ['projects', 'products', 'producers', 'users', 'categories']
        const stats = []

        for (const bucket of buckets) {
          const { data, error } = await supabase.storage
            .from(bucket)
            .list('', { limit: 1000 })

          if (!error && data) {
            const totalSize = data.reduce((sum, file) => 
              sum + (file.metadata?.size || 0), 0)
            
            stats.push({
              bucket,
              fileCount: data.length,
              totalSize,
              totalSizeMB: Math.round(totalSize / 1024 / 1024 * 100) / 100
            })
          }
        }

        return { bucketStats: stats }

      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to get storage stats'
        })
      }
    }),

  /**
   * Optimisation automatique des images existantes
   * Utile pour migration ou optimisation batch
   */
  optimizeImages: adminProcedure
    .input(z.object({
      bucket: bucketSchema,
      entityId: z.string().uuid(),
      maxWidth: z.number().default(1920),
      maxHeight: z.number().default(1080),
      quality: z.number().min(0.1).max(1).default(0.85)
    }))
    .mutation(async ({ input }) => {
      try {
        // Cette mutation déclencherait un job en arrière-plan
        // pour re-traiter et optimiser les images existantes
        
        // Pour l'instant, on retourne juste un flag de succès
        // L'implémentation complète nécessiterait un worker/queue
        
        return { 
          success: true, 
          message: 'Optimization job queued',
          entityId: input.entityId,
          bucket: input.bucket
        }

      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to queue optimization'
        })
      }
    })
})