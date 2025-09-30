import { z } from 'zod';

export const productFormSchema = z
  .object({
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
        /^[\da-z-]+$/,
        'Le slug ne peut contenir que des lettres minuscules, chiffres et tirets'
      ),

    short_description: z
      .string()
      .max(200, 'La description courte ne peut pas dépasser 200 caractères')
      .optional()
      .transform(val => val?.trim() || ''),

    description: z
      .string()
      .max(2000, 'La description ne peut pas dépasser 2000 caractères')
      .optional()
      .transform(val => val?.trim() || ''),

    price_points: z
      .number()
      .min(1, "Le prix doit être d'au moins 1 point")
      .max(50_000, 'Le prix ne peut pas dépasser 50 000 points')
      .int('Le prix doit être un nombre entier'),

    stock_quantity: z
      .number()
      .min(0, 'Le stock ne peut pas être négatif')
      .max(10_000, 'Le stock ne peut pas dépasser 10 000')
      .int('Le stock doit être un nombre entier')
      .default(0),

    category_id: z
      .string()
      .min(1, 'La catégorie est requise')
      .max(50, "L'identifiant de catégorie ne peut pas dépasser 50 caractères"),

    producer_id: z
      .string()
      .max(50, "L'identifiant du producteur ne peut pas dépasser 50 caractères")
      .optional()
      .default(''),

    min_tier: z
      .enum(['explorateur', 'protecteur', 'ambassadeur'], {
        errorMap: () => ({ message: 'Niveau minimum invalide' }),
      })
      .default('explorateur'),

    fulfillment_method: z
      .enum(['stock', 'dropship', 'ondemand'], {
        errorMap: () => ({ message: 'Méthode de livraison invalide' }),
      })
      .default('stock'),

    is_active: z.boolean().default(true),
    featured: z.boolean().default(false),
    is_hero_product: z.boolean().default(false),

    price_eur_equivalent: z
      .number()
      .min(0, 'Le prix EUR ne peut pas être négatif')
      .optional(),

    stock_management: z.boolean().default(true),

    weight_grams: z
      .number()
      .min(0, 'Le poids ne peut pas être négatif')
      .optional(),

    dimensions: z.record(z.number()).optional(),

    secondary_category_id: z.string().optional(),
    tags: z.array(z.string()).default([]),
    variants: z.record(z.unknown()).optional(),
    metadata: z.record(z.unknown()).optional(),

    nutrition_facts: z.record(z.unknown()).optional(),
    allergens: z.array(z.string()).default([]),
    certifications: z.array(z.string()).default([]),
    seasonal_availability: z.record(z.unknown()).optional(),

    origin_country: z.string().optional(),
    partner_source: z.string().optional(),

    launch_date: z.string().optional(),
    discontinue_date: z.string().optional(),

    seo_title: z
      .string()
      .max(60, 'Le titre SEO ne peut pas dépasser 60 caractères')
      .optional(),
    seo_description: z
      .string()
      .max(160, 'La description SEO ne peut pas dépasser 160 caractères')
      .optional(),

    images: z
      .array(z.string().url("URL d'image invalide"))
      .max(10, 'Maximum 10 images par produit')
      .default([]),
  })
  .refine(
    data => {
      if (data.price_points > 1000 && !data.description) {
        return false;
      }
      return true;
    },
    {
      message:
        'Une description détaillée est requise pour les produits premium (>1000 points)',
      path: ['description'],
    }
  )
  .refine(
    data => {
      if (
        (data.fulfillment_method === 'dropship' ||
          data.fulfillment_method === 'ondemand') &&
        data.stock_quantity > 0
      ) {
        return false;
      }
      return true;
    },
    {
      message:
        'Les produits en dropshipping/sur commande ne peuvent pas avoir de stock',
      path: ['stock_quantity'],
    }
  );

export type ProductFormData = z.infer<typeof productFormSchema>;

export const defaultProductValues: ProductFormData = {
  name: '',
  slug: '',
  short_description: '',
  description: '',
  stock_management: false,
  price_points: 100,
  stock_quantity: 0,
  category_id: '',
  producer_id: '', // Optional field
  min_tier: 'explorateur',
  fulfillment_method: 'stock',
  is_active: true,
  featured: false,
  is_hero_product: false,
  images: [],
  tags: [],
  allergens: [],
  certifications: [],
};