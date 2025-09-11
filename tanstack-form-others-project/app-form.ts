import { createFormHook } from '@tanstack/react-form';
import { FormTextField } from '@/src/components/form/form-text-field';
import { FormTextFieldMultiline } from '@/src/components/form/form-text-field-multiline';
import { FormPasswordField } from '@/src/components/form/form-password-field';
import { fieldContext, formContext } from '@/src/components/form/form-context';

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    FormTextField,
    FormTextFieldMultiline,
    FormPasswordField
  },
  formComponents: {}
});
