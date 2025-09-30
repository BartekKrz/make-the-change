'use client';

import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn';

import { FormField } from '../form-field';

import type { FormFieldProps } from '../form-field';
import type { DeepKeys } from '@tanstack/react-form';

export type TextFieldProps<
  TFormData,
  TField extends DeepKeys<TFormData>,
> = Omit<FormFieldProps<TFormData, TField>, 'children'> & {
  placeholder?: string;
  type?: 'text' | 'email' | 'url' | 'tel';
  autoComplete?: string;
  maxLength?: number;
  readOnly?: boolean;
  onValueChange?: (value: string) => void;
};

export function TextField<TFormData, TField extends DeepKeys<TFormData>>({
  placeholder,
  type = 'text',
  autoComplete,
  maxLength,
  readOnly,
  onValueChange,
  className,
  ...fieldProps
}: TextFieldProps<TFormData, TField>) {
  return (
    <FormField {...fieldProps} className={className}>
      {({ state, helpers }) => (
        <input
          autoComplete={autoComplete}
          maxLength={maxLength}
          placeholder={placeholder}
          readOnly={readOnly}
          type={type}
          value={(state.value as string) || ''}
          className={cn(
            'w-full rounded-md border px-3 py-2 transition-colors',
            'focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'placeholder:text-gray-400',
            state.errors.length > 0 && state.isTouched
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300',
            readOnly && 'bg-gray-50'
          )}
          onBlur={helpers.setTouched}
          onChange={e => {
            const newValue = e.target.value;
            helpers.setValue(newValue as any);
            onValueChange?.(newValue);
          }}
        />
      )}
    </FormField>
  );
}
