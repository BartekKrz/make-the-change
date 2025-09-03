/**
 * Service pour récupérer les produits avec leurs blur hashes optimisés
 * Make the CHANGE - Interface avec la nouvelle architecture DB scalable
 */

import { createClient } from '@supabase/supabase-js'

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export interface ProductBlurHash {
  url: string
  blurHash: string
  width?: number
  height?: number
  fileSize?: number
}

export interface ProductWithBlur {
  id: string
  name: string
  slug: string
  images: string[]
  computed_blur_hashes: ProductBlurHash[]
  blur_count: number
  total_images: number
  blur_coverage_percent: number
  // ... autres propriétés du produit
  [key: string]: any
}

/**
 * Service pour gérer les produits avec blur hashes optimisés
 */
export class ProductBlurService {

  /**
   * Récupérer un produit avec ses blur hashes optimisés
   */
  static async getProductWithBlur(productId: string): Promise<ProductWithBlur | null> {
    console.log('🔍 [ProductBlurService] Début récupération produit:', productId);
    
    try {
      const { data, error } = await supabase
        .from('products_with_blur_hashes')
        .select('*')
        .eq('id', productId)
        .single()

      if (error) {
        console.error('❌ [ProductBlurService] Erreur Supabase récupération produit avec blur:', {
          productId,
          error,
          code: error.code,
          message: error.message
        });
        return null
      }

      console.log('✅ [ProductBlurService] Produit récupéré avec succès:', {
        productId: data?.id,
        name: data?.name,
        totalImages: data?.total_images,
        blurCount: data?.blur_count,
        coverage: data?.blur_coverage_percent + '%',
        blurHashesPreview: data?.computed_blur_hashes?.slice(0, 2) // Premiers 2 pour debug
      });

      return data
    } catch (error) {
      console.error('💥 [ProductBlurService] Exception service ProductBlur:', {
        productId,
        error: error instanceof Error ? error.message : error
      });
      return null
    }
  }

  /**
   * Récupérer tous les produits avec leurs blur hashes
   */
  static async getAllProductsWithBlur(
    filters?: {
      isActive?: boolean
      featured?: boolean
      categoryId?: string
      limit?: number
      offset?: number
    }
  ): Promise<ProductWithBlur[]> {
    try {
      let query = supabase
        .from('products_with_blur_hashes')
        .select('*')

      // Appliquer les filtres
      if (filters?.isActive !== undefined) {
        query = query.eq('is_active', filters.isActive)
      }
      if (filters?.featured !== undefined) {
        query = query.eq('featured', filters.featured)
      }
      if (filters?.categoryId) {
        query = query.eq('category_id', filters.categoryId)
      }
      if (filters?.limit) {
        query = query.limit(filters.limit)
      }
      if (filters?.offset) {
        query = query.range(filters.offset, (filters.offset + (filters.limit || 50)) - 1)
      }

      // Ordonner par défaut
      query = query.order('created_at', { ascending: false })

      const { data, error } = await query

      if (error) {
        console.error('Erreur récupération produits avec blur:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Erreur service getAllProductsWithBlur:', error)
      return []
    }
  }

  /**
   * Récupérer les statistiques des blur hashes
   */
  static async getBlurStats() {
    try {
      const { data, error } = await supabase
        .from('blur_system_stats')
        .select('*')

      if (error) {
        console.error('Erreur récupération stats blur:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Erreur service getBlurStats:', error)
      return null
    }
  }

  /**
   * Récupérer les produits qui ont besoin de blur hashes
   */
  static async getProductsMissingBlur(limit: number = 10) {
    try {
      const { data, error } = await supabase
        .from('products_missing_blur')
        .select('*')
        .limit(limit)

      if (error) {
        console.error('Erreur récupération produits sans blur:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Erreur service getProductsMissingBlur:', error)
      return []
    }
  }

  /**
   * Helper : Obtenir le blur hash d'une image spécifique
   */
  static getBlurForImage(product: ProductWithBlur, imageUrl: string): ProductBlurHash | null {
    return product.computed_blur_hashes.find(blur => blur.url === imageUrl) || null
  }

  /**
   * Helper : Vérifier si un produit a tous ses blur hashes
   */
  static hasCompleteBlur(product: ProductWithBlur): boolean {
    return product.blur_coverage_percent >= 100
  }

  /**
   * Helper : Obtenir le blur de la première image
   */
  static getPrimaryImageBlur(product: ProductWithBlur): ProductBlurHash | null {
    if (product.images.length === 0) return null
    
    const primaryImageUrl = product.images[0]
    return this.getBlurForImage(product, primaryImageUrl)
  }

  /**
   * Helper : Formatter les blur hashes pour Next.js Image
   */
  static formatBlurForNextImage(blur: ProductBlurHash | null): { 
    placeholder?: 'blur'
    blurDataURL?: string 
  } {
    if (!blur?.blurHash) {
      console.log('⚠️ [ProductBlurService] formatBlurForNextImage: pas de blur hash fourni');
      return {}
    }

    // Convertir le blur hash en data URL pour Next.js
    // En production, vous pouvez utiliser une vraie conversion blur hash -> data URL
    const blurDataURL = `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${blur.width || 100} ${blur.height || 100}">
        <defs>
          <linearGradient id="b" x2="0" y2="100%">
            <stop stop-color="#ccc" offset="0%"/>
            <stop stop-color="#eee" offset="100%"/>
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#b)"/>
      </svg>
    `)}`

    console.log('🎨 [ProductBlurService] formatBlurForNextImage success:', {
      url: blur.url?.slice(-20),
      blurHash: blur.blurHash.slice(0, 15) + '...',
      dimensions: `${blur.width}x${blur.height}`,
      blurDataURL: blurDataURL.slice(0, 50) + '...'
    });

    return {
      placeholder: 'blur' as const,
      blurDataURL
    }
  }
}

/**
 * Hook React pour utiliser le service ProductBlur
 */
export const useProductBlur = () => {
  const getProduct = async (productId: string) => {
    return ProductBlurService.getProductWithBlur(productId)
  }

  const getProducts = async (filters?: Parameters<typeof ProductBlurService.getAllProductsWithBlur>[0]) => {
    return ProductBlurService.getAllProductsWithBlur(filters)
  }

  const getStats = async () => {
    return ProductBlurService.getBlurStats()
  }

  const getMissingBlur = async (limit?: number) => {
    return ProductBlurService.getProductsMissingBlur(limit)
  }

  const formatBlur = (blur: ProductBlurHash | null) => {
    return ProductBlurService.formatBlurForNextImage(blur)
  }

  return {
    getProduct,
    getProducts,
    getStats,
    getMissingBlur,
    formatBlur,
    getBlurForImage: ProductBlurService.getBlurForImage,
    hasCompleteBlur: ProductBlurService.hasCompleteBlur,
    getPrimaryImageBlur: ProductBlurService.getPrimaryImageBlur
  }
}

/**
 * Exemple d'utilisation :
 * 
 * const { getProduct, formatBlur, getPrimaryImageBlur } = useProductBlur()
 * 
 * // Récupérer un produit avec blur
 * const product = await getProduct('product-123')
 * 
 * // Obtenir le blur de l'image principale
 * const primaryBlur = getPrimaryImageBlur(product)
 * 
 * // Formatter pour Next.js Image
 * const nextImageProps = formatBlur(primaryBlur)
 * 
 * // Utiliser dans Next.js Image
 * <Image src={product.images[0]} {...nextImageProps} />
 */