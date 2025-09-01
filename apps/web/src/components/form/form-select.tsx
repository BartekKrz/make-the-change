'use client';

import { forwardRef } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  type SimpleSelectProps
} from '@/app/admin/(dashboard)/components/ui/select';
import { FormField, type FormFieldProps } from '@/components/form/form-field';

import type { FieldApi } from '@tanstack/react-form';

import type { ForwardedRef } from 'react';

type FormSelectProps = FormFieldProps & {
  field?: FieldApi<any, any, any, any>;
  placeholder?: string;
  options: { value: string; label: string; disabled?: boolean }[];
  disabled?: boolean;
};

const FormSelectComponent = (
  {
    field,
    label,
    description,
    className,
    required,
    placeholder = 'Sélectionner...',
    options,
    disabled
  }: FormSelectProps,
  ref: ForwardedRef<HTMLButtonElement>
) => {
  if (!field) {
    throw new Error('FormSelect requires a field prop when used with TanStack Form');
  }

  const fieldName = String(field.name);
  const fieldId = `field-${fieldName}`;

  return (
    <FormField
      label={label}
      description={description}
      className={className}
      required={required}
      error={field.state.meta.errors?.[0]}
      isValidating={field.state.meta.isValidating}
      fieldId={fieldId}
    >
      <Select
        value={field.state.value ?? ''}
        onValueChange={(newValue) => field.handleChange(newValue)}
        onOpenChange={(open) => !open && field.handleBlur()}
        disabled={disabled}
      >
        <SelectTrigger
          ref={ref}
          id={fieldId}
          name={fieldName}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  );
};

FormSelectComponent.displayName = 'FormSelectComponent';

export const FormSelect = forwardRef(FormSelectComponent);
FormSelect.displayName = 'FormSelect';
