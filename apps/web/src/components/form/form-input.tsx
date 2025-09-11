'use client';

import { forwardRef } from 'react';

import { Input, type InputProps } from '@/app/[locale]/admin/(dashboard)/components/ui/input';
import { FormField, type FormFieldProps } from '@/components/form/form-field';

import type { FieldApi } from '@tanstack/react-form';
import type { ForwardedRef } from 'react';

type FormInputProps = FormFieldProps &
  Omit<InputProps, 'value' | 'onChange' | 'onBlur' | 'name' | 'id' | 'error' | 'label'> & {
    field?: FieldApi<any, any, any, any>;
  };

const FormInputComponent = (
  { field, label, description, className, required, ...inputProps }: FormInputProps,
  ref: ForwardedRef<HTMLInputElement>
) => {
  if (!field) {
    throw new Error('FormInput requires a field prop when used with TanStack Form');
  }

  const fieldName = String(field.name);
  const fieldId = `field-${fieldName}`;

  return (
    <FormField
      className={className}
      description={description}
      error={field.state.meta.errors?.[0]}
      fieldId={fieldId}
      isValidating={field.state.meta.isValidating}
      label={label}
      required={required}
    >
      <Input
        ref={ref}
        id={fieldId}
        name={fieldName}
        value={field.state.value ?? ''}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        {...inputProps}
      />
    </FormField>
  );
};

FormInputComponent.displayName = 'FormInputComponent';

export const FormInput = forwardRef(FormInputComponent);
FormInput.displayName = 'FormInput';
