'use client';

import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';

// Create the form contexts - RECOMMENDED by TanStack Form docs
export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

// Import field components that will use these contexts
import { NumberField } from './fields/number-field-context';
import { SelectField } from './fields/select-field-context';
import { TextField } from './fields/text-field-context';
import { TextAreaField } from './fields/textarea-field-context';

// Create the admin form hook with context support - FIXED
export const { useAppForm: useAdminForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    NumberField,
    SelectField,
    TextAreaField,
  },
  formComponents: {},
});

export type AdminFormApi = ReturnType<typeof useAdminForm>;

// Helper to create typed forms with auto-save
export function createAdminForm<TFormData>(config: {
  defaultValues: TFormData;
  validationSchema?: any;
  onSubmit: (values: TFormData) => Promise<void> | void;
  autoSave?: boolean;
  autoSaveDebounceMs?: number;
}) {
  const {
    defaultValues,
    validationSchema,
    onSubmit,
    autoSave = true,
    autoSaveDebounceMs = 500,
  } = config;

  return useAdminForm({
    defaultValues,
    validatorAdapter: zodValidator(),
    validators: validationSchema
      ? {
          onChange: validationSchema,
        }
      : undefined,
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
    // AUTO-SAVE IMPLEMENTATION using form-level listeners (FIXED)
    listeners: autoSave
      ? {
          onChange: ({ formApi }) => {
            // Auto-save when form is valid, dirty, and not already submitting
            if (
              formApi.state.isValid &&
              formApi.state.isDirty &&
              !formApi.state.isSubmitting
            ) {
              console.log('[Auto-save] Form valid and dirty, triggering save...', {
                values: formApi.state.values,
                errors: formApi.state.errorMap
              });
              formApi.handleSubmit();
            } else {
              console.log('[Auto-save] Skipping save - DETAILED ERRORS:');
              console.log('❌ errorMap:', formApi.state.errorMap);
              console.log('❌ allErrors:', formApi.getAllErrors());
              console.log('📊 values:', formApi.state.values);
              console.log('🔍 validation state:', {
                isValid: formApi.state.isValid,
                isDirty: formApi.state.isDirty,
                isSubmitting: formApi.state.isSubmitting
              });
            }
          },
          onChangeDebounceMs: autoSaveDebounceMs,
        }
      : undefined,
  });
}
