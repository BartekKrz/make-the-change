import { useForm } from '@tanstack/react-form';

console.log('[simple-app-form] Module loaded');

// Export simple et direct sans createFormHook complexe
export const useAppForm = (options: Parameters<typeof useForm>[0]) => {
  console.log('[useAppForm] Called with options:', options);
  const form = useForm(options);
  console.log('[useAppForm] Form created:', {
    state: form.state,
    Field: !!form.Field,
    handleSubmit: !!form.handleSubmit
  });
  return form;
};

// Hooks simplifiés sans contexte pour éviter les erreurs
export const useAppFieldContext = () => {
  console.warn('[useAppFieldContext] Called - this should not be used in current architecture');
  throw new Error('useAppFieldContext should not be used - use form.Field render props instead');
};

export const useAppFormContext = () => {
  console.warn('[useAppFormContext] Called - this should not be used in current architecture');
  throw new Error('useAppFormContext should not be used - pass form as prop instead');
};

export type AppFormApi = ReturnType<typeof useForm>;