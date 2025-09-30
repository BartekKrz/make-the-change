'use client';

import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { useRouter } from 'next/navigation';

import { useToast } from './use-toast';

type UseFormWithToastOptions<T> = {
  defaultValues: T;
  onSubmit: (values: T) => Promise<{ success: boolean }>;
  toasts: {
    success: {
      title: string;
      description: string;
    };
    error: {
      title: string;
      description: string;
    };
  };
  redirectOnSuccess?: string;
}

export function useFormWithToast<T>({
  defaultValues,
  onSubmit,
  toasts,
  redirectOnSuccess,
}: UseFormWithToastOptions<T>) {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm({
    defaultValues,
    validatorAdapter: zodValidator,
    onSubmit: async ({ value }) => {
      try {
        const result = await onSubmit(value);

        if (result.success) {
          toast({
            title: toasts.success.title,
            description: toasts.success.description,
          });

          if (redirectOnSuccess) {
            router.push(redirectOnSuccess);
          }
        }

        return result;
      } catch (error) {
        console.error('Form submission error:', error);
        toast({
          title: toasts.error.title,
          description: toasts.error.description,
          variant: 'destructive',
        });
        throw error;
      }
    },
  });

  return {
    form,
    isSubmitting: form.state.isSubmitting,
    canSubmit: form.state.canSubmit,
  };
}
