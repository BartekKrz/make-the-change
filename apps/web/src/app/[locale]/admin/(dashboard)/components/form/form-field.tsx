'use client';

import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn';

import type { FieldRenderProps, TypedFieldApi } from './tanstack-form-base';
import type { DeepKeys, DeepValue } from '@tanstack/react-form';
import type { ReactNode } from 'react';

export type FormFieldProps<TFormData, TField extends DeepKeys<TFormData>> = {
  name: TField;
  form: any; // Will be properly typed by parent
  label?: string;
  description?: string;
  required?: boolean;
  className?: string;
  children: (props: FieldRenderProps<TFormData, TField>) => ReactNode;
};

export function FormField<TFormData, TField extends DeepKeys<TFormData>>({
  name,
  form,
  label,
  description,
  required,
  className,
  children,
}: FormFieldProps<TFormData, TField>) {
  return (
    <form.Field name={name}>
      {(field: TypedFieldApi<TFormData, TField>) => {
        const value = field.state.value;
        const errors = field.state.meta.errors;
        const isValidating = field.state.meta.isValidating;
        const isTouched = field.state.meta.isTouched;
        const isDirty = field.state.meta.isDirty;

        const fieldProps: FieldRenderProps<TFormData, TField> = {
          field,
          state: {
            value,
            errors,
            isValidating,
            isTouched,
            isDirty,
          },
          helpers: {
            setValue: (newValue: DeepValue<TFormData, TField>) =>
              field.handleChange(newValue),
            setTouched: () => field.handleBlur(),
            setErrors: newErrors =>
              field.setMeta(prev => ({ ...prev, errors: newErrors })),
            focus: () => field.focus?.(),
          },
        };

        return (
          <div className={cn('space-y-2', className)}>
            {label && (
              <label className="block text-sm font-medium text-gray-700">
                {label}
                {required && <span className="ml-1 text-red-500">*</span>}
              </label>
            )}

            {description && (
              <p className="text-sm text-gray-500">{description}</p>
            )}

            <div className="relative">
              {children(fieldProps)}

              {isValidating && (
                <div className="absolute top-2 right-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                </div>
              )}
            </div>

            {errors.length > 0 && isTouched && (
              <div className="space-y-1">
                {errors.map((error, index) => (
                  <p key={index} className="text-sm text-red-600">
                    {error}
                  </p>
                ))}
              </div>
            )}
          </div>
        );
      }}
    </form.Field>
  );
}
