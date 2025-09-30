import { useCallback, useEffect } from 'react';

import { createAdminForm } from '@/app/[locale]/admin/(dashboard)/components/form/create-admin-form';
import { useToast } from '@/hooks/use-toast';
import { trpc } from '@/lib/trpc';

import {
  defaultProductValues,
  productFormSchema,
} from '../types/product-form.types';

import type { ProductFormData } from '../types/product-form.types';

export type UseProductFormProps = {
  productId: string;
  initialData?: Partial<ProductFormData>;
};

export type UseProductFormReturn = {
  form: ReturnType<typeof createAdminForm<ProductFormData>>;
  isLoading: boolean;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
};

export function useProductForm({
  productId,
  initialData,
}: UseProductFormProps): UseProductFormReturn {
  const { toast } = useToast();
  const utils = trpc.useUtils();

  const { data: productData, isPending: isLoading } =
    trpc.admin.products.detail_enriched.useQuery({ productId });

  const { mutateAsync: updateProduct, isPending: isSaving } =
    trpc.admin.products.update.useMutation({
      onSuccess: () => {
        toast({
          variant: 'default',
          title: 'Sauvegardé automatiquement',
          description: 'Les modifications ont été sauvegardées.',
        });
        utils.admin.products.detail_enriched.invalidate({ productId });
        utils.admin.products.list.invalidate();
      },
      onError: error => {
        console.error('[useProductForm] Save failed:', error);
        toast({
          variant: 'destructive',
          title: 'Erreur de sauvegarde',
          description: "Les modifications n'ont pas pu être sauvegardées.",
        });
      },
    });

  const handleSubmit = useCallback(
    async (values: ProductFormData) => {
      if (!productId) {
        console.warn('[useProductForm] No productId available');
        return;
      }

      try {
        console.log('[useProductForm] Starting auto-save with values:', values);
        console.log('[useProductForm] ProductId:', productId);

        const result = await updateProduct({
          id: productId,
          patch: values,
        });

        console.log('[useProductForm] Auto-save completed successfully:', result);
      } catch (error) {
        console.error('[useProductForm] Submit failed:', error);
        console.error('[useProductForm] Error details:', {
          productId,
          values,
          error: error instanceof Error ? error.message : error
        });
        throw error;
      }
    },
    [productId, updateProduct]
  );

  // Use the new createAdminForm with auto-save functionality
  const form = createAdminForm<ProductFormData>({
    defaultValues: initialData || defaultProductValues,
    validationSchema: productFormSchema,
    onSubmit: handleSubmit,
    autoSave: true, // Enable auto-save
    autoSaveDebounceMs: 500, // Debounce auto-save to 500ms
  });

  // Sync form with server data when it loads (but not during user interactions)
  useEffect(() => {
    if (productData && !form.state.isSubmitting && !form.state.isDirty) {
      console.log('[useProductForm] Syncing with server data:', productData);
      console.log('[useProductForm] Product data fields:', Object.keys(productData));
      console.log('[useProductForm] Important fields:', {
        category_id: productData.category_id,
        producer_id: productData.producer_id,
        name: productData.name,
        slug: productData.slug
      });

      // Fix null values for form compatibility
      const formData = {
        ...productData,
        producer_id: productData.producer_id || '', // Convert null to empty string
        short_description: productData.short_description || '',
        description: productData.description || '',
      };

      form.reset(formData);
      console.log('[useProductForm] Form reset with cleaned server data');
    } else if (form.state.isDirty) {
      console.log('[useProductForm] Skipping reset - user has unsaved changes, form is dirty');
    } else if (form.state.isSubmitting) {
      console.log('[useProductForm] Skipping reset - form is submitting');
    }
  }, [productData, form]);

  const hasUnsavedChanges = form.state.isDirty && !form.state.isSubmitting;

  return {
    form,
    isLoading,
    isSaving,
    hasUnsavedChanges,
  };
}