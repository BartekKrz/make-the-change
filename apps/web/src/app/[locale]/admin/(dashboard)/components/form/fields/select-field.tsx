'use client';

import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn';
import { FormField } from '../form-field';
import type { FormFieldProps } from '../form-field';
import type { DeepKeys } from '@tanstack/react-form';

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type SelectFieldProps<TFormData, TField extends DeepKeys<TFormData>> =
  Omit<FormFieldProps<TFormData, TField>, 'children'> & {
    placeholder?: string;
    options: SelectOption[];
    readOnly?: boolean;
    onValueChange?: (value: string) => void;
  };

export function SelectField<TFormData, TField extends DeepKeys<TFormData>>({
  placeholder,
  options,
  readOnly,
  onValueChange,
  className,
  ...fieldProps
}: SelectFieldProps<TFormData, TField>) {
  return (
    <FormField {...fieldProps} className={className}>
      {({ state, helpers }) => (
        <select
          value={state.value as string || ''}
          onChange={(e) => {
            const newValue = e.target.value;
            helpers.setValue(newValue as any);
            onValueChange?.(newValue);
          }}
          onBlur={helpers.setTouched}
          disabled={readOnly}
          className={cn(
            'w-full px-3 py-2 border rounded-md transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'bg-white',
            state.errors.length > 0 && state.isTouched
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300',
            readOnly && 'bg-gray-50',
          )}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
      )}
    </FormField>
  );
}