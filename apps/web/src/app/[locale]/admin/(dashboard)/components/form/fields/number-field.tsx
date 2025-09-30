'use client';

import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn';
import { FormField } from '../form-field';
import type { FormFieldProps } from '../form-field';
import type { DeepKeys } from '@tanstack/react-form';

export type NumberFieldProps<TFormData, TField extends DeepKeys<TFormData>> =
  Omit<FormFieldProps<TFormData, TField>, 'children'> & {
    placeholder?: string;
    min?: number;
    max?: number;
    step?: number;
    readOnly?: boolean;
    suffix?: string;
    prefix?: string;
    onValueChange?: (value: number | undefined) => void;
  };

export function NumberField<TFormData, TField extends DeepKeys<TFormData>>({
  placeholder,
  min,
  max,
  step,
  readOnly,
  suffix,
  prefix,
  onValueChange,
  className,
  ...fieldProps
}: NumberFieldProps<TFormData, TField>) {
  return (
    <FormField {...fieldProps} className={className}>
      {({ state, helpers }) => (
        <div className="relative">
          {prefix && (
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
              {prefix}
            </span>
          )}

          <input
            type="number"
            value={state.value as number || ''}
            onChange={(e) => {
              const rawValue = e.target.value;
              const numValue = rawValue === '' ? undefined : Number(rawValue);
              helpers.setValue(numValue as any);
              onValueChange?.(numValue);
            }}
            onBlur={helpers.setTouched}
            placeholder={placeholder}
            min={min}
            max={max}
            step={step}
            readOnly={readOnly}
            className={cn(
              'w-full px-3 py-2 border rounded-md transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'placeholder:text-gray-400',
              state.errors.length > 0 && state.isTouched
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300',
              readOnly && 'bg-gray-50',
              prefix && 'pl-8',
              suffix && 'pr-8',
            )}
          />

          {suffix && (
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
              {suffix}
            </span>
          )}
        </div>
      )}
    </FormField>
  );
}