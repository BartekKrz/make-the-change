
import { z } from 'zod'

export const productFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Le nom du produit est requis')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères')
    .trim(),

  slug: z
    .string()
    .min(1, 'Le slug est requis')
    .max(80, 'Le slug ne peut pas dépasser 80 caractères')
    .regex(
      /^[a-z0-9-]+$/,
      'Le slug ne peut contenir que des lettres minuscules, chiffres et tirets'
    ),

  short_description: z
    .string()
    .max(200, 'La description courte ne peut pas dépasser 200 caractères')
    .optional()
    .transform(val => val?.trim()),

  description: z
    .string()
    .max(2000, 'La description ne peut pas dépasser 2000 caractères')
    .optional()
    .transform(val => val?.trim()),

  price_points: z
    .number()
    .min(1, 'Le prix doit être d\'au moins 1 point')
    .max(50000, 'Le prix ne peut pas dépasser 50 000 points')
    .int('Le prix doit être un nombre entier'),

  stock_quantity: z
    .number()
    .min(0, 'Le stock ne peut pas être négatif')
    .max(10000, 'Le stock ne peut pas dépasser 10 000')
    .int('Le stock doit être un nombre entier')
    .default(0),

  category_id: z
    .string()
    .min(1, 'La catégorie est requise')
    .max(50, 'L\'identifiant de catégorie ne peut pas dépasser 50 caractères'),

  producer_id: z
    .string()
    .min(1, 'Le producteur est requis')
    .max(50, 'L\'identifiant du producteur ne peut pas dépasser 50 caractères'),

  min_tier: z.enum(['explorateur', 'protecteur', 'ambassadeur'], {
    errorMap: () => ({ message: 'Niveau minimum invalide' })
  }).default('explorateur'),

  fulfillment_method: z.enum(['stock', 'dropship'], {
    errorMap: () => ({ message: 'Méthode de livraison invalide' })
  }).default('stock'),

  is_active: z.boolean().default(true),
  featured: z.boolean().default(false),

  images: z
    .array(z.string().url('URL d\'image invalide'))
    .max(10, 'Maximum 10 images par produit')
    .default([]),
}).refine((data) => {
  if (data.price_points > 1000 && !data.description) {
    return false
  }
  return true
}, {
  message: 'Une description détaillée est requise pour les produits premium (>1000 points)',
  path: ['description']
}).refine((data) => {
  if (data.fulfillment_method === 'dropship' && data.stock_quantity > 0) {
    return false
  }
  return true
}, {
  message: 'Les produits en dropshipping ne peuvent pas avoir de stock',
  path: ['stock_quantity']
})

export const productAsyncSchema = z.object({
  slug: z.string().refine(async (slug) => {
    if (!slug) return true
    return !['admin', 'api', 'shop', 'cart'].includes(slug)
  }, 'Ce slug est déjà utilisé'),

  category_id: z.string().refine(async (categoryId) => {
    if (!categoryId) return true
    return true
  }, 'Cette catégorie n\'existe pas'),
})

export type ProductFormData = z.infer<typeof productFormSchema>

export const defaultProductValues: ProductFormData = {
  name: '',
  slug: '',
  short_description: '',
  description: '',
  price_points: 100,
  stock_quantity: 0,
  category_id: '',
  producer_id: '',
  min_tier: 'explorateur',
  fulfillment_method: 'stock',
  is_active: true,
  featured: false,
  images: [],
}

export const tierLabels = {
  explorateur: 'Explorateur',
  protecteur: 'Protecteur',
  ambassadeur: 'Ambassadeur',
} as const

export const fulfillmentMethodLabels = {
  stock: 'Stock interne',
  dropship: 'Dropshipping',
} as const

export const tierPricingRules = {
  explorateur: {
    maxPrice: 500,
    description: 'Produits d\'entrée de gamme'
  },
  protecteur: {
    maxPrice: 2000,
    description: 'Produits premium accessibles'
  },
  ambassadeur: {
    maxPrice: 10000,
    description: 'Tous les produits'
  },
} as const

export const productFormSchemaWithTierValidation = productFormSchema.superRefine((data, ctx) => {
  const tierRule = tierPricingRules[data.min_tier]

  if (data.price_points > tierRule.maxPrice) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_big,
      maximum: tierRule.maxPrice,
      type: 'number',
      inclusive: true,
      path: ['price_points'],
      message: `Prix trop élevé pour le niveau ${tierLabels[data.min_tier]} (max: ${tierRule.maxPrice} points)`,
    })
  }
})
