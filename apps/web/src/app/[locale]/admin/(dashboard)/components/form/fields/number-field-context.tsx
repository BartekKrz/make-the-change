'use client';

import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn';
import { useFieldContext } from '../create-admin-form';

export type NumberFieldProps = {
  label?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  readOnly?: boolean;
  required?: boolean;
  description?: string;
  suffix?: string;
  prefix?: string;
  className?: string;
  onValueChange?: (value: number | undefined) => void;
};

export function NumberField({
  label,
  placeholder,
  min,
  max,
  step,
  readOnly,
  required,
  description,
  suffix,
  prefix,
  className,
  onValueChange,
}: NumberFieldProps) {
  const field = useFieldContext<number>();

  const value = field.state.value;
  const errors = field.state.meta.errors;
  const isValidating = field.state.meta.isValidating;
  const isTouched = field.state.meta.isTouched;
  const hasErrors = errors.length > 0 && isTouched;

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
        {prefix && (
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
            {prefix}
          </span>
        )}

        <input
          type="number"
          value={value || ''}
          onChange={(e) => {
            const rawValue = e.target.value;
            const numValue = rawValue === '' ? undefined : Number(rawValue);
            field.handleChange(numValue);
            onValueChange?.(numValue);
          }}
          onBlur={field.handleBlur}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          readOnly={readOnly}
          className={cn(
            'w-full rounded-md border px-3 py-2 transition-colors',
            'focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'placeholder:text-gray-400',
            hasErrors
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300',
            readOnly && 'bg-gray-50',
            prefix && 'pl-8',
            suffix && 'pr-8'
          )}
        />

        {suffix && (
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
            {suffix}
          </span>
        )}

        {isValidating && (
          <div className="absolute top-2 right-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          </div>
        )}
      </div>

      {hasErrors && (
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
}