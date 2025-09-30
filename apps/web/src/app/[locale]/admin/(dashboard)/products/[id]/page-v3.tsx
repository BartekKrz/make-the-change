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

  console.log('[AdminProductEditPage] Creating form with:', {
    productId,
    defaultProductValues,
    hasProduct: !!product,
  });

  const form = useAppForm({
    defaultValues: defaultProductValues,
    onSubmit: async ({ value }) => {
      console.log('[form.onSubmit] Called with value:', value);
      console.log('[form.onSubmit] Product data for comparison:', product);
      try {
        if (!productId) {
          console.warn('[form.onSubmit] No productId available');
          return;
        }
        const changes = getDirtyFields(value, product);
        console.log('[form.onSubmit] Changes to save:', changes);
        console.log(
          '[form.onSubmit] Changes keys count:',
          Object.keys(changes).length
        );

        if (Object.keys(changes).length === 0) {
          console.log('[form.onSubmit] No changes detected, skipping save');
          toast({
            variant: 'default',
            title: 'Aucun changement',
            description: 'Aucune modification à sauvegarder.',
          });
          return;
        }

        console.log('[form.onSubmit] Calling updateProduct with:', {
          id: productId,
          patch: changes,
        });
        await updateProduct({ id: productId, patch: changes });
        console.log('[form.onSubmit] Save successful');
        toast({
          variant: 'default',
          title: 'Sauvegardé',
          description: 'Les modifications ont été sauvegardées.',
        });
      } catch (error) {
        console.error('[form.onSubmit] Submit failed:', error);
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Impossible de sauvegarder les modifications.',
        });
      }
    },
  });

  console.log('[AdminProductEditPage] Form created:', {
    formState: form.state,
    hasField: !!form.Field,
    hasHandleSubmit: !!form.handleSubmit,
  });

  // Sync avec les données serveur
  useEffect(() => {
    if (product) {
      console.log(
        '[AdminProductEditPage] Syncing form with product data:',
        product
      );
      console.log(
        '[AdminProductEditPage] Form state before reset:',
        form.state.values
      );
      form.reset(product);
      console.log(
        '[AdminProductEditPage] Form state after reset:',
        form.state.values
      );
      console.log(
        '[AdminProductEditPage] Form isDirty after reset:',
        form.state.isDirty
      );
    }
  }, [product, form]);

  if (isPending || isError) return <ProductDetailSkeleton />;

  return (
    <AdminPageLayout>
      <form
        onSubmit={e => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <AdminDetailLayout headerContent={<ProductEditHeader form={form} />}>
          <DetailView gridCols={2} spacing="md" variant="cards">
            <EssentialInfoSection form={form} />
            <PricingStatusSection form={form} />
            <ConfigurationSection form={form} />
            <MetadataSection form={form} />
            <ProductDetailsSection form={form} />
            <ImagesSection form={form} />
          </DetailView>
        </AdminDetailLayout>
      </form>
    </AdminPageLayout>
  );
};

export default AdminProductEditPage;
