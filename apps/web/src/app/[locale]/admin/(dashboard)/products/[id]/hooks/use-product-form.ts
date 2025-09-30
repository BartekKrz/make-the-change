import { useCallback, useEffect } from 'react';

import { createTypedForm } from '@/app/[locale]/admin/(dashboard)/components/form/tanstack-form-base';
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
  form: ReturnType<typeof createTypedForm<ProductFormData>>;
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
        await updateProduct({
          id: productId,
          patch: values,
        });
      } catch (error) {
        console.error('[useProductForm] Submit failed:', error);
        throw error;
      }
    },
    [productId, updateProduct]
  );

  const form = createTypedForm<ProductFormData>({
    defaultValues: initialData || defaultProductValues,
    validationSchema: productFormSchema,
    onSubmit: handleSubmit,
    asyncDebounceMs: 300,
    revalidateMode: 'onChange',
  });

  // Sync form with server data when it loads
  useEffect(() => {
    if (productData) {
      console.log('[useProductForm] Syncing with server data:', productData);
      form.reset(productData);
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
