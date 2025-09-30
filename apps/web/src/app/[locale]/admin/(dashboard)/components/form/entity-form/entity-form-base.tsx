'use client';

import { useCallback, useEffect } from 'react';
import { createTypedForm } from '../tanstack-form-base';
import { useToast } from '@/hooks/use-toast';
import { trpc } from '@/lib/trpc';
import type { ZodSchema } from 'zod';

export type EntityFormConfig<TEntity, TFormData> = {
  entityType: string;
  entityId: string;
  validationSchema: ZodSchema<TFormData>;
  defaultValues: TFormData;
  queryKey: string[];
  updateMutation: string;
  listInvalidationKey?: string[];
};

export function useEntityForm<TEntity, TFormData>(
  config: EntityFormConfig<TEntity, TFormData>
) {
  const {
    entityType,
    entityId,
    validationSchema,
    defaultValues,
    queryKey,
    updateMutation,
    listInvalidationKey,
  } = config;

  const { toast } = useToast();
  const utils = trpc.useUtils();

  // Dynamic query - this would need to be typed properly in real implementation
  const {
    data: entityData,
    isPending: isLoading,
  } = trpc.useQuery(queryKey as any, { entityId });

  // Dynamic mutation - this would need to be typed properly in real implementation
  const {
    mutateAsync: updateEntity,
    isPending: isSaving,
  } = trpc.useMutation(updateMutation as any, {
    onSuccess: () => {
      toast({
        variant: 'default',
        title: 'Sauvegardé automatiquement',
        description: 'Les modifications ont été sauvegardées.',
      });
      utils.invalidateQueries({ queryKey: queryKey as any });
      if (listInvalidationKey) {
        utils.invalidateQueries({ queryKey: listInvalidationKey as any });
      }
    },
    onError: (error) => {
      console.error(`[useEntityForm] ${entityType} save failed:`, error);
      toast({
        variant: 'destructive',
        title: 'Erreur de sauvegarde',
        description: "Les modifications n'ont pas pu être sauvegardées.",
      });
    },
  });

  const handleSubmit = useCallback(async (values: TFormData) => {
    if (!entityId) {
      console.warn(`[useEntityForm] No ${entityType}Id available`);
      return;
    }

    try {
      await updateEntity({
        id: entityId,
        patch: values,
      });
    } catch (error) {
      console.error(`[useEntityForm] ${entityType} submit failed:`, error);
      throw error;
    }
  }, [entityId, entityType, updateEntity]);

  const form = createTypedForm<TFormData>({
    defaultValues,
    validationSchema,
    onSubmit: handleSubmit,
    asyncDebounceMs: 300,
    revalidateMode: 'onChange',
  });

  // Sync form with server data when it loads
  useEffect(() => {
    if (entityData) {
      console.log(`[useEntityForm] Syncing ${entityType} with server data:`, entityData);
      form.reset(entityData);
    }
  }, [entityData, form, entityType]);

  const hasUnsavedChanges = form.state.isDirty && !form.state.isSubmitting;

  return {
    form,
    isLoading,
    isSaving,
    hasUnsavedChanges,
    entityData,
  };
}