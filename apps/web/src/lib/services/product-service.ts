import { trpc } from '@/lib/trpc'

/**
 * Service pour récupérer les données des produits depuis la base de données
 */
export class ProductService {
  /**
   * Récupère tous les champs d'un produit par son ID
   * @param productId - L'identifiant unique du produit
   * @returns Toutes les données du produit
   */
  static async getProductById(productId: string) {
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
  }

  /**
   * Récupère tous les champs d'un produit avec les relations (catégorie, producteur)
   * @param productId - L'identifiant unique du produit
   * @returns Toutes les données du produit avec les relations
   */
  static async getProductWithRelations(productId: string) {
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
  }

  /**
   * Affiche tous les champs d'un produit dans la console
   * @param productId - L'identifiant unique du produit
   */
  static async logAllProductFields(productId: string) {
    const result = await this.getProductById(productId)

    if (result.success && result.data) {
      console.group('📦 Détails complets du produit')
      console.log('ID:', result.data.id)
      console.log('Nom:', result.data.name)
      console.log('Slug:', result.data.slug)
      console.log('Description courte:', result.data.short_description)
      console.log('Description complète:', result.data.description)
      console.log('Prix (points):', result.data.price_points)
      console.log('Prix équivalent (€):', result.data.price_eur_equivalent)
      console.log('Quantité en stock:', result.data.stock_quantity)
      console.log('Méthode de livraison:', result.data.fulfillment_method)
      console.log('Niveau minimum requis:', result.data.min_tier)
      console.log('Produit vedette:', result.data.featured)
      console.log('Produit actif:', result.data.is_active)
      console.log('Produit héros:', result.data.is_hero_product)
      console.log('Poids (grammes):', result.data.weight_grams)
      console.log('Dimensions:', result.data.dimensions)
      console.log('Images:', result.data.images)
      console.log('Tags:', result.data.tags)
      console.log('Variantes:', result.data.variants)
      console.log('Informations nutritionnelles:', result.data.nutrition_facts)
      console.log('Allergènes:', result.data.allergens)
      console.log('Certifications:', result.data.certifications)
      console.log('Pays d\'origine:', result.data.origin_country)
      console.log('Disponibilité saisonnière:', result.data.seasonal_availability)
      console.log('Titre SEO:', result.data.seo_title)
      console.log('Description SEO:', result.data.seo_description)
      console.log('Métadonnées:', result.data.metadata)
      console.log('Date de création:', result.data.created_at)
      console.log('Date de mise à jour:', result.data.updated_at)
      console.log('ID catégorie:', result.data.category_id)
      console.log('ID producteur:', result.data.producer_id)
      console.log('Date de lancement:', result.data.launch_date)
      console.log('Date d\'arrêt:', result.data.discontinue_date)
      console.log('Gestion du stock:', result.data.stock_management)
      console.groupEnd()

      return result.data
    } else {
      console.error('❌ Erreur:', result.error)
      return null
    }
  }
}

// Types pour les données du produit
export interface ProductData {
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


