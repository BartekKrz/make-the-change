
import { createFormHookContexts } from '@tanstack/react-form';

export const {
  fieldContext,
  formContext,
  useFieldContext,
  useFormContext
} = createFormHookContexts()

export const {
  fieldContext: adminFieldContext,
  formContext: adminFormContext,
  useFieldContext: useAdminFieldContext,
  useFormContext: useAdminFormContext
} = createFormHookContexts()
