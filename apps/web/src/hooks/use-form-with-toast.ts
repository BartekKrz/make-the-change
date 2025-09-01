
'use client';

import { useRouter } from 'next/navigation';

import { useForm, type BaseFormOptions } from '@tanstack/react-form';

import { useToast } from '@/hooks/use-toast';

import type { FormToastConfig, FormMutationResult } from '@/lib/form-utils';

export type UseFormWithToastOptions<TFormData, TFormValidator = any> =
  Omit<BaseFormOptions<TFormData>, 'onSubmit'> & {

  toasts?: FormToastConfig

  onSubmit: (values: TFormData) => Promise<FormMutationResult> | FormMutationResult

  redirectOnSuccess?: string

  onSuccess?: (result: FormMutationResult) => void

  onError?: (error: string | Record<string, string[]>) => void
}

export const useFormWithToast = <TFormData, TFormValidator = any>({
  toasts,
  onSubmit,
  redirectOnSuccess,
  onSuccess,
  onError,
  ...formOptions
}: UseFormWithToastOptions<TFormData, TFormValidator>) => {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm({
    ...formOptions,
    onSubmit: async ({ value, formApi }) => {
      try {
        const result = await onSubmit(value as TFormData);

        if (result.success) {
          if (toasts?.success) {
            toast({
              variant: 'success',
              title: toasts.success.title,
              description: toasts.success.description,
            });
          }

          if (redirectOnSuccess) {
            router.push(redirectOnSuccess);
          }

          onSuccess?.(result);

        } else {
          if (result.errors) {
            Object.entries(result.errors).forEach(([fieldName, messages]) => {
              if (messages.length > 0) {
                formApi.setFieldMeta(fieldName, (prev) => ({
                  ...prev,
                  errors: messages,
                }));
              }
            });
          }

          const errorMessage = result.error || 'Une erreur est survenue';
          toast({
            variant: 'destructive',
            title: toasts?.error?.title || 'Erreur',
            description: toasts?.error?.description || errorMessage,
          });

          onError?.(result.errors || errorMessage);
        }

      } catch (error: any) {
        const errorMessage = error?.message || 'Erreur inattendue';

        toast({
          variant: 'destructive',
          title: toasts?.error?.title || 'Erreur',
          description: toasts?.error?.description || errorMessage,
        });

        onError?.(errorMessage);
      }
    }
  });

  return {
    form,
    isSubmitting: form.state.isSubmitting,
    canSubmit: form.state.canSubmit,
    isDirty: form.state.isDirty,
    reset: () => form.reset(),
    clearErrors: () => {
      Object.keys(form.state.values as object).forEach((fieldName) => {
        form.setFieldMeta(fieldName, (prev: any) => ({
          ...prev,
          errors: [],
        }));
      });
    }
  };
};

export const useSimpleForm = <TFormData>(
  defaultValues: TFormData,
  onSubmit: (values: TFormData) => Promise<void> | void
) => useFormWithToast({
  defaultValues,
  onSubmit: async (values) => {
    try {
      await onSubmit(values as TFormData);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la soumission'
      };
    }
  },
  toasts: {
    success: {
      title: 'Succès',
      description: 'Opération réalisée avec succès'
    },
    error: {
      title: 'Erreur',
      description: 'Une erreur est survenue'
    }
  }
});
