'use client';
import { useParams } from 'next/navigation';
import { type FC, useEffect } from 'react';
import z from 'zod';

import { AdminPageLayout } from '@/app/[locale]/admin/(dashboard)/components/admin-layout';
import { AdminDetailLayout } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-detail-layout';
import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';
import { ProductDetailSkeleton } from '@/app/[locale]/admin/(dashboard)/products/[id]/components/product-detail-skeleton';
import { ProductEditHeader } from '@/app/[locale]/admin/(dashboard)/products/[id]/components/product-edit-header';
import { ConfigurationSection } from '@/app/[locale]/admin/(dashboard)/products/[id]/components/sections/configuration-section';
import { EssentialInfoSection } from '@/app/[locale]/admin/(dashboard)/products/[id]/components/sections/essential-info-section';
import { ImagesSection } from '@/app/[locale]/admin/(dashboard)/products/[id]/components/sections/images-section';
import { MetadataSection } from '@/app/[locale]/admin/(dashboard)/products/[id]/components/sections/metadata-section';
import { PricingStatusSection } from '@/app/[locale]/admin/(dashboard)/products/[id]/components/sections/pricing-status-section';
import { ProductDetailsSection } from '@/app/[locale]/admin/(dashboard)/products/[id]/components/sections/product-details-section';
import { useAppForm } from '@/components/form';
import { useEntityErrorHandler } from '@/hooks/use-entity-error-handler';
import { useToast } from '@/hooks/use-toast';
import { trpc } from '@/lib/trpc';
import type { RouterInputs } from '@/lib/trpc';

function getDirtyFields<T extends Record<string, any>>(
  current: T,
  original?: T
): Partial<T> {
  if (!original) return current;

  const changes: Partial<T> = {};
  for (const key in current) {
    if (current[key] !== original[key]) {
      changes[key] = current[key];
    }
  }
  return changes;
}

const defaultProductValues: ProductFormData = {
  name: '',
  slug: '',
  short_description: '',
  description: '',
  stock_management: false,
  price_points: 100,
  stock_quantity: 0,
  category_id: '',
  producer_id: '',
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

const _productFormSchema = z
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
      .transform(val => val?.trim()),

    description: z
      .string()
      .max(2000, 'La description ne peut pas dépasser 2000 caractères')
      .optional()
      .transform(val => val?.trim()),

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
      .min(1, 'Le producteur est requis')
      .max(
        50,
        "L'identifiant du producteur ne peut pas dépasser 50 caractères"
      ),

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

    // Pricing
    price_eur_equivalent: z
      .number()
      .min(0, 'Le prix EUR ne peut pas être négatif')
      .optional(),

    // Stock management
    stock_management: z.boolean().default(true),

    // Physical properties
    weight_grams: z
      .number()
      .min(0, 'Le poids ne peut pas être négatif')
      .optional(),

    dimensions: z.record(z.number()).optional(),

    // Categorization & Metadata
    secondary_category_id: z.string().optional(),
    tags: z.array(z.string()).default([]),
    variants: z.record(z.unknown()).optional(),
    metadata: z.record(z.unknown()).optional(),

    // Product details
    nutrition_facts: z.record(z.unknown()).optional(),
    allergens: z.array(z.string()).default([]),
    certifications: z.array(z.string()).default([]),
    seasonal_availability: z.record(z.unknown()).optional(),

    // Logistics
    origin_country: z.string().optional(),
    partner_source: z.string().optional(),

    // Lifecycle
    launch_date: z.string().optional(),
    discontinue_date: z.string().optional(),

    // SEO
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

type ProductFormData = z.infer<typeof _productFormSchema>;

type ProductUpdateInput = RouterInputs['admin']['products']['update'];

const AdminProductEditPage: FC = () => {
  const params = useParams<{ id: string }>();
  const productId = params.id;

  const {
    data: product,
    isPending,
    error,
    isError,
  } = trpc.admin.products.detail_enriched.useQuery({ productId });

  useEntityErrorHandler(error, {
    redirectTo: '/admin/products',
    entityType: 'product',
  });

  const { toast } = useToast();
  const utils = trpc.useUtils();

  const { mutateAsync: updateProduct } =
    trpc.admin.products.update.useMutation<ProductUpdateInput>({
      onSuccess: () => {
        toast({
          variant: 'default',
          title: 'Sauvegardé automatiquement',
          description: 'Les modifications ont été sauvegardées.',
        });
      },
      onError: error => {
        console.error('[AdminProductEditPage] Auto-save failed:', error);
        toast({
          variant: 'destructive',
          title: 'Erreur de sauvegarde automatique',
          description:
            "Les modifications n'ont pas pu être sauvegardées automatiquement.",
        });
      },
      onSettled: () => {
        utils.admin.products.detail_enriched.invalidate({ productId });
        utils.admin.products.list.invalidate();
      },
    });

  const form = useAppForm({
    defaultValues: defaultProductValues,

    // Auto-save natif avec debounce intégré
    listeners: {
      onChange: async ({ formApi }) => {
        if (!formApi.state.isDirty || !productId) return;

        const changes = getDirtyFields(formApi.state.values, product);
        if (Object.keys(changes).length === 0) return;

        try {
          await updateProduct({ id: productId, patch: changes });
          console.log('Auto-saved:', Object.keys(changes));
        } catch (error) {
          console.error('Auto-save failed:', error);
        }
      },
      onChangeDebounceMs: 2000, // 2 secondes de débounce
    },

    // Validation native
    validators: {
      onSubmit: _productFormSchema,
    },
  });

  // Sync avec les données serveur
  useEffect(() => {
    if (product) {
      form.reset(product);
      console.debug('[AdminProductEditPage] Synced form with product data');
    }
  }, [product, form]);

  if (isPending || isError) return <ProductDetailSkeleton />;

  return (
    <AdminPageLayout>
      <form.AppForm key={product.id}>
        <AdminDetailLayout headerContent={<ProductEditHeader />}>
          <DetailView gridCols={2} spacing="md" variant="cards">
            <EssentialInfoSection />
            <PricingStatusSection />
            <ConfigurationSection />
            <MetadataSection />
            <ProductDetailsSection />
            <ImagesSection />
          </DetailView>
        </AdminDetailLayout>
      </form.AppForm>
    </AdminPageLayout>
  );
};

export default AdminProductEditPage;
