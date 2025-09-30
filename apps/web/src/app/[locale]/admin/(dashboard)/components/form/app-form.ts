import { createFormHook } from '@tanstack/react-form';

import {
  FormAutocomplete,
  FormNumberField,
  FormTextField,
} from '@/app/[locale]/admin/(dashboard)/components/form';
import { FormDateField } from '@/app/[locale]/admin/(dashboard)/components/form/form-date-field';
import { FormImagesUploader } from '@/app/[locale]/admin/(dashboard)/components/form/form-images-uploader';
import { FormTextArea } from '@/app/[locale]/admin/(dashboard)/components/form/form-textarea';
import {
  FormSelect,
  FormToggle,
} from '@/app/[locale]/admin/(dashboard)/components/ui/form-components';

import { fieldContext, formContext, useFieldContext, useFormContext } from './form-context';

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    FormTextField,
    FormTextArea,
    FormSelect,
    FormToggle,
    FormAutocomplete,
    FormDateField,
    FormNumberField,
    FormImagesUploader,
  },
  formComponents: {},
});

// Create custom hooks with proper naming
export const useAppFormContext = useFormContext;
export const useAppFieldContext = useFieldContext;

// Re-export context hooks for direct usage
export { useFieldContext, useFormContext };

export type AppFormApi = ReturnType<typeof useAppForm>;
