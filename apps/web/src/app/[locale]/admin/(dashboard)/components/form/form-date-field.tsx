'use client';

import { forwardRef, type ForwardedRef } from 'react';

import { Input } from '@/app/[locale]/admin/(dashboard)/components/ui/input';
import { useFieldContext } from '@/app/[locale]/admin/(dashboard)/components/form/form-context';
import { cn } from '@/lib/utils';

// Helper function extracted to outer scope for better performance
const toErrorMessage = (u: unknown): string => {
  if (typeof u === 'string') return u;
  if (typeof u === 'object' && u && 'message' in u) {
    const msg = (u as { message?: unknown }).message;
    if (typeof msg === 'string') return msg;
  }
  try {
    return JSON.stringify(u);
  } catch {
    return String(u);
  }
};

export type FormDateFieldProps = {
  label?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  min?: string;
  max?: string;
} & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange' | 'onBlur' | 'size' | 'type' | 'min' | 'max'
>;

const FormDateFieldComponent = (
  {
    label,
    placeholder,
    required,
    className,
    min,
    max,
    ...props
  }: FormDateFieldProps,
  ref: ForwardedRef<HTMLInputElement>
) => {
  const field = useFieldContext<string | undefined>();
  const value = field.state.value ?? '';
  const errors = ((field.state.meta.errors as unknown[]) ?? [])
    .map(error => toErrorMessage(error))
    .filter(Boolean);
  const hasError = errors.length > 0;

  const handleChange = (s: string) => {
    field.handleChange(s || undefined);
  };

  return (
    <div className="space-y-1">
      <Input
        ref={ref}
        max={max}
        min={min}
        placeholder={placeholder}
        type="date"
        value={value}
        className={cn(
          hasError && 'border-red-500 focus:border-red-500',
          className
        )}
        onBlur={field.handleBlur}
        onChange={e => handleChange(e.target.value)}
        {...props}
      />
      {hasError && errors[0] && (
        <p className="text-sm text-red-500">{errors[0]}</p>
      )}
    </div>
  );
};

export const FormDateField = forwardRef(FormDateFieldComponent);
