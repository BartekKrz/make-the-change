import { trpc } from '@/lib/trpc'

/**
 * Service pour récupérer les données des produits depuis la base de données
 */
export const ProductService = {
  /**
   * Récupère tous les champs d'un produit par son ID
   * @param productId - L'identifiant unique du produit
   * @returns Toutes les données du produit
   */
  async getProductById(productId: string) {
    try {
      const product = await trpc.admin.products.detail.query({
        productId
      })

      return {
        success: true,
        data: product
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du produit:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      }
    }
  },

  /**
   * Récupère tous les champs d'un produit avec les relations (catégorie, producteur)
   * @param productId - L'identifiant unique du produit
   * @returns Toutes les données du produit avec les relations
   */
  async getProductWithRelations(productId: string) {
    try {
      // Pour récupérer avec les relations, on utilise la liste filtrée par ID
      const result = await trpc.admin.products.list.query({
        limit: 1,
        search: undefined, // Recherche par ID n'est pas disponible, on récupère tout et on filtre
      })

      const product = result.items.find(p => p.id === productId)

      if (!product) {
        return {
          success: false,
          error: 'Produit non trouvé'
        }
      }

      return {
        success: true,
        data: product
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du produit avec relations:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      }
    }
  },

};

// Types pour les données du produit
export type ProductData = {
  id: string
  name: string
  slug: string
  short_description?: string
  description?: string
  price_points: number
  price_eur_equivalent?: number
  stock_quantity: number
  fulfillment_method: string
  min_tier: string
  featured: boolean
  is_active: boolean
  is_hero_product: boolean
  weight_grams?: number
  dimensions?: any
  images: string[]
  tags: string[]
  variants?: any
  nutrition_facts?: any
  allergens: string[]
  certifications: string[]
  origin_country?: string
  seasonal_availability?: any
  seo_title?: string
  seo_description?: string
  metadata?: any
  created_at: string
  updated_at: string
  category_id?: string
  producer_id?: string
  launch_date?: string
  discontinue_date?: string
  stock_management: boolean
}






