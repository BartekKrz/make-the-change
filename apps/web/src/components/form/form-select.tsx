'use client';

import { forwardRef } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  type SimpleSelectProps
} from '@/app/[locale]/admin/(dashboard)/components/ui/select';
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
      className={className}
      description={description}
      error={field.state.meta.errors?.[0]}
      fieldId={fieldId}
      isValidating={field.state.meta.isValidating}
      label={label}
      required={required}
    >
      <Select
        disabled={disabled}
        value={field.state.value ?? ''}
        onOpenChange={(open) => !open && field.handleBlur()}
        onValueChange={(newValue) => field.handleChange(newValue)}
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
              disabled={option.disabled}
              value={option.value}
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
