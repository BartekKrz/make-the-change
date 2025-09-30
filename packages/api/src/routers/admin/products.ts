/**
 * Admin Products Router - Complete implementation
 */
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'
import { createRouter, adminProcedure } from '../../trpc'
import type {
  Product,
  ProductWithRelations,
  ProductListResponse,
  Producer,
} from '../../types/database'

// Supabase service client
const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

export const adminProductsRouter = createRouter({
  detail_enriched: adminProcedure
    .input(z.object({ productId: z.string().uuid() }))
    .query(async ({ input }) => {
      // Base product
      const { data: product, error: prodErr } = await supabase
        .from('products')
        .select('*')
        .eq('id', input.productId)
        .single()
      if (prodErr || !product) throw new TRPCError({ code: 'NOT_FOUND', message: 'Product not found' })

      // Blur aggregation
      const { data: blurRow, error: blurErr } = await supabase
        .from('products_with_blur_hashes')
        .select('*')
        .eq('id', input.productId)
        .single()
      if (blurErr) {
        // Return product without blur info if view not available
        return product
      }

      const row = blurRow as any
      const image_blur_map: Record<string, any> = {}
      if (Array.isArray(row?.computed_blur_hashes)) {
        for (const it of row.computed_blur_hashes as any[]) {
          const url = it.url ?? it.image_url
          if (!url) continue
          image_blur_map[url] = {
            blurHash: it.blurHash ?? it.blur_hash ?? '',
            blurDataURL: it.blurDataURL ?? it.blur_data_url ?? undefined,
            width: it.width ?? undefined,
            height: it.height ?? undefined,
            fileSize: it.fileSize ?? it.file_size ?? undefined,
          }
        }
      }

      return {
        ...product,
        image_blur_map,
        blur_count: row?.blur_count ?? 0,
        total_images: row?.total_images ?? ((product as any).images?.length ?? 0),
        blur_coverage_percent: row?.blur_coverage_percent ?? 0,
      }
    }),

  blur: createRouter({
    detail: adminProcedure
      .input(z.object({ productId: z.string().uuid() }))
      .query(async ({ input }) => {
        const { data, error } = await supabase
          .from('products_with_blur_hashes')
          .select('*')
          .eq('id', input.productId)
          .single()
        if (error) throw new TRPCError({ code: 'NOT_FOUND', message: 'Product blur not found' })

        const row = data as any
        const computed_blur_hashes = Array.isArray(row?.computed_blur_hashes)
          ? (row.computed_blur_hashes as any[]).map((it) => ({
              url: it.url ?? it.image_url ?? '',
              blurHash: it.blurHash ?? it.blur_hash ?? '',
              blurDataURL: it.blurDataURL ?? it.blur_data_url ?? undefined,
              width: it.width ?? undefined,
              height: it.height ?? undefined,
              fileSize: it.fileSize ?? it.file_size ?? undefined,
            }))
          : []

        return {
          id: row.id,
          name: row.name,
          slug: row.slug,
          images: (row.images as string[] | null) || [],
          blur_count: row.blur_count || 0,
          total_images: row.total_images || 0,
          blur_coverage_percent: row.blur_coverage_percent || 0,
          computed_blur_hashes,
          created_at: row.created_at,
          is_active: row.is_active,
          featured: row.featured,
          category_id: row.category_id,
        }
      }),

    list: adminProcedure
      .input(
        z
          .object({
            isActive: z.boolean().optional(),
            featured: z.boolean().optional(),
            categoryId: z.string().uuid().optional(),
            limit: z.number().int().min(1).max(200).default(50),
            offset: z.number().int().min(0).default(0),
          })
          .optional()
      )
      .query(async ({ input }) => {
        let q = supabase
          .from('products_with_blur_hashes')
          .select('*')

        if (input?.isActive !== undefined) q = q.eq('is_active', input.isActive)
        if (input?.featured !== undefined) q = q.eq('featured', input.featured)
        if (input?.categoryId) q = q.eq('category_id', input.categoryId)
        if (input?.offset) q = q.range(input.offset, input.offset + (input.limit ?? 50) - 1)
        if (input?.limit) q = q.limit(input.limit)

        q = q.order('created_at', { ascending: false })

        const { data, error } = await q
        if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
        return data?.map((row: any) => ({
          id: row.id,
          name: row.name,
          slug: row.slug,
          images: (row.images as string[] | null) || [],
          blur_count: row.blur_count || 0,
          total_images: row.total_images || 0,
          blur_coverage_percent: row.blur_coverage_percent || 0,
          computed_blur_hashes: Array.isArray(row?.computed_blur_hashes)
            ? (row.computed_blur_hashes as any[]).map((it) => ({
                url: it.url ?? it.image_url ?? '',
                blurHash: it.blurHash ?? it.blur_hash ?? '',
                blurDataURL: it.blurDataURL ?? it.blur_data_url ?? undefined,
                width: it.width ?? undefined,
                height: it.height ?? undefined,
                fileSize: it.fileSize ?? it.file_size ?? undefined,
              }))
            : [],
        })) || []
      }),

    missing: adminProcedure
      .input(z.object({ limit: z.number().int().min(1).max(100).default(10) }).optional())
      .query(async ({ input }) => {
        const { data, error } = await supabase
          .from('products_missing_blur')
          .select('*')
          .limit(input?.limit ?? 10)
        if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
        return data
      }),

    repair: adminProcedure
      .input(z.object({ productId: z.string().uuid() }))
      .mutation(async ({ input }) => {
        const { data, error } = await supabase
          .from('products_with_blur_hashes')
          .select('id, images, computed_blur_hashes')
          .eq('id', input.productId)
          .single()
        if (error) throw new TRPCError({ code: 'NOT_FOUND', message: 'Product not found' })

        const images: string[] = Array.isArray((data as any)?.images) ? (data as any).images as string[] : []
        const existing = Array.isArray((data as any)?.computed_blur_hashes) ? (data as any).computed_blur_hashes as Array<{ url?: string; image_url?: string }> : []
        const existingUrls = new Set(
          existing
            .map((b) => b.url ?? b.image_url)
            .filter((u): u is string => typeof u === 'string' && !!u)
        )
        const missing = images.filter((url) => !existingUrls.has(url))

        if (missing.length === 0) return { success: true, repaired: 0, totalMissing: 0 }

        let repaired = 0
        for (const imageUrl of missing) {
          try {
            const resp = await fetch(`${supabaseUrl}/functions/v1/generate-blur-hash`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${supabaseServiceKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ imageUrl, entityType: 'product', entityId: input.productId }),
            })
            if (resp.ok) {
              const r = await resp.json().catch(() => null)
              if (!r || (r as any)?.success === false) {
                // continue
              } else {
                repaired += 1
              }
            }
          } catch {}
        }
        return { success: true, repaired, totalMissing: missing.length }
      }),
  }),

  list: adminProcedure
    .input(
      z
        .object({
          activeOnly: z.boolean().default(false),
          search: z.string().optional(),
          producerId: z.string().uuid().optional(),
          categoryId: z.string().uuid().optional(),
          tags: z.array(z.string()).optional(),
          sortBy: z.enum(['created_at_desc', 'created_at_asc', 'name_asc', 'name_desc', 'price_asc', 'price_desc', 'featured_first']).default('created_at_desc'),
          partnerSource: z.string().optional(),
          originCountry: z.string().optional(),
          limit: z.number().int().min(1).max(100).default(50),
          cursor: z.string().uuid().optional(),
        })
        .optional()
    )
    .query(async ({ input }): Promise<ProductListResponse> => {
      // Helper function to apply sorting
      const applySorting = (query: any, sortBy: string) => {
        switch (sortBy) {
          case 'created_at_asc':
            return query.order('created_at', { ascending: true })
          case 'name_asc':
            return query.order('name', { ascending: true })
          case 'name_desc':
            return query.order('name', { ascending: false })
          case 'price_asc':
            return query.order('price_points', { ascending: true })
          case 'price_desc':
            return query.order('price_points', { ascending: false })
          case 'featured_first':
            return query.order('featured', { ascending: false }).order('created_at', { ascending: false })
          case 'created_at_desc':
          default:
            return query.order('created_at', { ascending: false })
        }
      }

      // Query for items
      let q = supabase
        .from('products')
        .select(`
          *,
          producer:producers(
            id,
            name,
            slug
          ),
          category:categories!category_id(
            id,
            name,
            slug
          ),
          secondary_category:categories!secondary_category_id(
            id,
            name,
            slug
          )
        `)

      // Apply sorting
      q = applySorting(q, input?.sortBy || 'created_at_desc')

      if (input?.activeOnly) q = q.eq('is_active', true)
      if (input?.search) q = q.or(`name.ilike.%${input.search}%,slug.ilike.%${input.search}%`)
      if (input?.producerId) q = q.eq('producer_id', input.producerId)

      // Handle category filtering with hierarchy support
      if (input?.categoryId) {
        // Get all subcategories of the selected category
        const { data: subcategories } = await supabase
          .from('categories')
          .select('id')
          .eq('parent_id', input.categoryId)

        const subcategoryIds = subcategories?.map(cat => cat.id) || []
        const allCategoryIds = [input.categoryId, ...subcategoryIds]

        // Build OR condition for all category IDs (including subcategories)
        const categoryConditions = allCategoryIds
          .map(id => `category_id.eq.${id},secondary_category_id.eq.${id}`)
          .join(',')
        q = q.or(categoryConditions)
      }

      if (input?.partnerSource) q = q.eq('partner_source', input.partnerSource)
      if (input?.originCountry) q = q.eq('origin_country', input.originCountry)

      // Handle tags filtering - products must contain ALL selected tags
      if (input?.tags && input.tags.length > 0) {
        input.tags.forEach(tag => {
          q = q.contains('tags', [tag])
        })
      }

      if (input?.cursor) q = q.lt('id', input.cursor)
      q = q.limit(input?.limit ?? 50)
      const { data, error } = await q
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })

      // Query for total count (without cursor and limit) - same logic for categories
      let countQ = supabase
        .from('products')
        .select('id', { count: 'exact', head: true })
      if (input?.activeOnly) countQ = countQ.eq('is_active', true)
      if (input?.search) countQ = countQ.or(`name.ilike.%${input.search}%,slug.ilike.%${input.search}%`)
      if (input?.producerId) countQ = countQ.eq('producer_id', input.producerId)

      // Handle category filtering with hierarchy support for count query
      if (input?.categoryId) {
        // Reuse the same subcategory logic
        const { data: subcategories } = await supabase
          .from('categories')
          .select('id')
          .eq('parent_id', input.categoryId)

        const subcategoryIds = subcategories?.map(cat => cat.id) || []
        const allCategoryIds = [input.categoryId, ...subcategoryIds]

        const categoryConditions = allCategoryIds
          .map(id => `category_id.eq.${id},secondary_category_id.eq.${id}`)
          .join(',')
        countQ = countQ.or(categoryConditions)
      }
      if (input?.partnerSource) countQ = countQ.eq('partner_source', input.partnerSource)
      if (input?.originCountry) countQ = countQ.eq('origin_country', input.originCountry)

      // Handle tags filtering for count query
      if (input?.tags && input.tags.length > 0) {
        for (const tag of input.tags) {
          countQ = countQ.contains('tags', [tag])
        }
      }

      const { count, error: countError } = await countQ
      if (countError) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: countError.message })

      // Enrich cover blur for list (products_cover_blur)
      let items = (data as ProductWithRelations[]) || []
      const ids = items.map((p: any) => p.id).filter(Boolean)
      if (ids.length > 0) {
        const { data: covers, error: coverErr } = await supabase
          .from('products_cover_blur')
          .select('id, cover_blur_data_url, cover_blur_hash, cover_image')
          .in('id', ids)

        if (!coverErr && covers) {
          const map = new Map<string, any>(covers.map((c: any) => [c.id, c]))
          items = items.map((it: any) => {
            const c = map.get(it.id)
            return c
              ? { ...it, cover_blur_data_url: c.cover_blur_data_url, cover_blur_hash: c.cover_blur_hash, cover_image: c.cover_image }
              : it
          })
        }
      }

      return { items, nextCursor: data?.at(-1)?.id ?? null, total: count ?? 0 }
    }),

  create: adminProcedure
    .input(
      z.object({
        // Champs obligatoires
        name: z.string().min(1),
        slug: z.string().min(1),
        price_points: z.number().int().min(0),

        // Champs optionnels avec defaults
        category_id: z.string().uuid().optional(),
        producer_id: z.string().uuid().optional(),
        short_description: z.string().optional(),
        description: z.string().optional(),
        fulfillment_method: z.enum(['stock', 'dropship', 'ondemand']).default('dropship'),
        is_active: z.boolean().default(true),
        featured: z.boolean().default(false),
        is_hero_product: z.boolean().default(false),
        stock_quantity: z.number().int().min(0).default(0),
        min_tier: z.enum(['explorateur', 'protecteur', 'ambassadeur']).default('explorateur'),

        // Champs étendus optionnels
        price_eur_equivalent: z.number().min(0).optional(),
        secondary_category_id: z.string().uuid().optional(),
        tags: z.array(z.string()).default([]),
        allergens: z.array(z.string()).default([]),
        certifications: z.array(z.string()).default([]),
        weight_grams: z.number().int().min(0).optional(),
        origin_country: z.string().optional(),
        partner_source: z.string().optional(),
        launch_date: z.string().optional(),
        discontinue_date: z.string().optional(),
        seo_title: z.string().max(60).optional(),
        seo_description: z.string().max(160).optional(),
        images: z.array(z.string().url()).max(10).default([]),
      })
    )
    .mutation(async ({ input }): Promise<Product> => {
      const { data, error } = await supabase
        .from('products')
        .insert(input as any)
        .select()
        .single()
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data as Product
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        patch: z
          .object({
            // Champs de base
            name: z.string().optional(),
            slug: z.string().optional(),
            short_description: z.string().optional(),
            description: z.string().optional(),

            // Prix et stock
            price_points: z.number().int().min(0).optional(),
            price_eur_equivalent: z.number().min(0).optional(),
            stock_quantity: z.number().int().min(0).optional(),

            // Statuts et visibilité
            is_active: z.boolean().optional(),
            featured: z.boolean().optional(),
            is_hero_product: z.boolean().optional(),

            // Catégorisation
            min_tier: z.enum(['explorateur', 'protecteur', 'ambassadeur']).optional(),
            category_id: z.string().uuid().optional(),
            secondary_category_id: z.string().uuid().optional(),
            producer_id: z.string().uuid().optional(),

            // Configuration produit
            fulfillment_method: z.enum(['stock', 'dropship', 'ondemand']).optional(),

            // Métadonnées et tags
            tags: z.array(z.string()).optional(),
            allergens: z.array(z.string()).optional(),
            certifications: z.array(z.string()).optional(),

            // Propriétés physiques
            weight_grams: z.number().int().min(0).optional(),

            // Origine et partenaires
            origin_country: z.string().optional(),
            partner_source: z.string().optional(),

            // Dates de cycle de vie
            launch_date: z.string().optional(),
            discontinue_date: z.string().optional(),

            // SEO
            seo_title: z.string().max(60).optional(),
            seo_description: z.string().max(160).optional(),

            // Images
            images: z.array(z.string().url()).max(10).optional(),
          })
          .refine((p) => Object.keys(p).length > 0, 'Patch cannot be empty'),
      })
    )
    .mutation(async ({ input }): Promise<Product> => {
      console.log('🔄 Backend: admin.products.update - Début');
      console.log('📦 Input reçu:', JSON.stringify(input, null, 2));

      const { data: productBefore, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .eq('id', input.id)
        .single();

      if (fetchError) {
        console.error('❌ Erreur récupération produit:', fetchError);
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Product not found' });
      }

      console.log('📊 Produit avant mise à jour:', {
        id: productBefore.id,
        name: productBefore.name,
        images_count: productBefore.images ? productBefore.images.length : 0,
        images: productBefore.images
      });

      console.log('🔄 Patch appliqué:', JSON.stringify(input.patch, null, 2));

      const { data, error } = await supabase
        .from('products')
        .update(input.patch as any)
        .eq('id', input.id)
        .select()
        .single();

      if (error) {
        console.error('❌ Erreur mise à jour:', error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
      }

      console.log('✅ Produit mis à jour:', {
        id: data.id,
        name: data.name,
        images_count: data.images ? data.images.length : 0,
        images: data.images
      });

      console.log('🎉 Backend: admin.products.update - Succès');
      return data as Product;
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

  tags: adminProcedure
    .input(
      z.object({
        activeOnly: z.boolean().default(true),
        withStats: z.boolean().default(true),
      }).optional()
    )
    .query(async ({ input }) => {
      let query = supabase.from('products').select('tags')

      if (input?.activeOnly) {
        query = query.eq('is_active', true)
      }

      const { data: products, error } = await query
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })

      // Extract and count all tags
      const tagCounts = new Map<string, number>()

      products?.forEach((product: any) => {
        if (product.tags && Array.isArray(product.tags)) {
          product.tags.forEach((tag: any) => {
            if (tag && typeof tag === 'string' && tag.trim()) {
              const normalizedTag = tag.trim().toLowerCase()
              tagCounts.set(normalizedTag, (tagCounts.get(normalizedTag) || 0) + 1)
            }
          })
        }
      })

      // Convert to array and sort by usage count
      const tags = Array.from(tagCounts.entries())
        .map(([tag, count]) => ({
          tag,
          count: input?.withStats ? count : undefined
        }))
        .sort((a, b) => (b.count || 0) - (a.count || 0))

      return {
        tags: tags.map(t => t.tag),
        tagStats: input?.withStats ? tags : undefined,
        total: tags.length
      }
    }),

  producers: adminProcedure
    .query(async (): Promise<Producer[]> => {
      const { data, error } = await supabase
        .from('producers')
        .select('id, name, slug')
        .eq('status', 'active')
        .order('name', { ascending: true })
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message })
      return data as Producer[]
    }),
})