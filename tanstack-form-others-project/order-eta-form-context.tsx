import { msg } from '@lingui/core/macro';
import { createFormHookContexts, createFormHook, formOptions } from '@tanstack/react-form';
import { z } from 'zod';

export const {
  fieldContext: etaFieldContext,
  formContext: etaFormContext,
  useFieldContext: useETAFieldContext,
  useFormContext: useETAFormContext
} = createFormHookContexts();

export const { useAppForm: useETAForm } = createFormHook({
  fieldContext: etaFieldContext,
  formContext: etaFormContext,
  fieldComponents: {},
  formComponents: {}
});

const getUpdateETAOrderSchema = () =>
  z.object({
    eta: z.date({
      message: msg`Une date valide est requise`.comment
    })
  });

export const etaFormOpts = formOptions({
  validators: {
    onBlur: getUpdateETAOrderSchema(),
    onChange: getUpdateETAOrderSchema(),
    onSubmit: getUpdateETAOrderSchema()
  }
});
