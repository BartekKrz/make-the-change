import { createFormHookContexts } from '@tanstack/react-form';

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

// Helper hook for field errors (temporary compatibility)
export const useFieldErrors = () => {
  const field = useFieldContext();
  return field?.state?.meta?.errors || [];
};
