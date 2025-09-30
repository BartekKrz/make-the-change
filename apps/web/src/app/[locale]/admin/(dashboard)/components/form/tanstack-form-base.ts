import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import type {
  FormApi,
  FieldApi,
  DeepKeys,
  DeepValue,
  ValidationError
} from '@tanstack/react-form';
import type { ZodSchema } from 'zod';

export type BaseFormConfig<TFormData> = {
  defaultValues: TFormData;
  validationSchema?: ZodSchema<TFormData>;
  onSubmit: (values: TFormData) => Promise<void> | void;
  asyncDebounceMs?: number;
  revalidateMode?: 'onChange' | 'onBlur' | 'onSubmit';
};

export type TypedFormApi<TFormData> = FormApi<TFormData, typeof zodValidator>;

export type TypedFieldApi<TFormData, TField extends DeepKeys<TFormData>> = FieldApi<
  TFormData,
  TField,
  typeof zodValidator,
  never,
  DeepValue<TFormData, TField>
>;

export function createTypedForm<TFormData>(config: BaseFormConfig<TFormData>) {
  const {
    defaultValues,
    validationSchema,
    onSubmit,
    asyncDebounceMs = 500,
    revalidateMode = 'onChange'
  } = config;

  return useForm({
    defaultValues,
    validatorAdapter: zodValidator(),
    validators: validationSchema ? {
      [revalidateMode]: validationSchema
    } : undefined,
    asyncDebounceMs,
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });
}

export type FormError = ValidationError[];

export type FieldRenderProps<TFormData, TField extends DeepKeys<TFormData>> = {
  field: TypedFieldApi<TFormData, TField>;
  state: {
    value: DeepValue<TFormData, TField>;
    errors: FormError;
    isValidating: boolean;
    isTouched: boolean;
    isDirty: boolean;
  };
  helpers: {
    setValue: (value: DeepValue<TFormData, TField>) => void;
    setTouched: () => void;
    setErrors: (errors: FormError) => void;
    focus: () => void;
  };
};