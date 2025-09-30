'use client';

import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn';
import { FormField } from '../form-field';
import type { FormFieldProps } from '../form-field';
import type { DeepKeys } from '@tanstack/react-form';

export type TextAreaFieldProps<TFormData, TField extends DeepKeys<TFormData>> =
  Omit<FormFieldProps<TFormData, TField>, 'children'> & {
    placeholder?: string;
    rows?: number;
    maxLength?: number;
    readOnly?: boolean;
    resize?: 'none' | 'both' | 'horizontal' | 'vertical';
    onValueChange?: (value: string) => void;
  };

export function TextAreaField<TFormData, TField extends DeepKeys<TFormData>>({
  placeholder,
  rows = 4,
  maxLength,
  readOnly,
  resize = 'vertical',
  onValueChange,
  className,
  ...fieldProps
}: TextAreaFieldProps<TFormData, TField>) {
  return (
    <FormField {...fieldProps} className={className}>
      {({ state, helpers }) => (
        <div className="relative">
          <textarea
            value={state.value as string || ''}
            onChange={(e) => {
              const newValue = e.target.value;
              helpers.setValue(newValue as any);
              onValueChange?.(newValue);
            }}
            onBlur={helpers.setTouched}
            placeholder={placeholder}
            rows={rows}
            maxLength={maxLength}
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
              resize === 'none' && 'resize-none',
              resize === 'both' && 'resize',
              resize === 'horizontal' && 'resize-x',
              resize === 'vertical' && 'resize-y',
            )}
          />

          {maxLength && (
            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
              {(state.value as string || '').length}/{maxLength}
            </div>
          )}
        </div>
      )}
    </FormField>
  );
}