'use client';

import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn';
import { useFieldContext } from '../create-admin-form';

export type TextFieldProps = {
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'url' | 'tel';
  autoComplete?: string;
  maxLength?: number;
  readOnly?: boolean;
  required?: boolean;
  description?: string;
  className?: string;
  onValueChange?: (value: string) => void;
};

// Context-based field component (RECOMMENDED pattern)
export function TextField({
  label,
  placeholder,
  type = 'text',
  autoComplete,
  maxLength,
  readOnly,
  required,
  description,
  className,
  onValueChange,
}: TextFieldProps) {
  // Use context instead of receiving field as prop
  const field = useFieldContext<string>();

  const value = field.state.value || '';
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
        <input
          type={type}
          value={value}
          onChange={(e) => {
            const newValue = e.target.value;
            console.log('[TextField] Value changing from', value, 'to', newValue);
            field.handleChange(newValue);
            onValueChange?.(newValue);
          }}
          onBlur={field.handleBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          maxLength={maxLength}
          readOnly={readOnly}
          className={cn(
            'w-full rounded-md border px-3 py-2 transition-colors',
            'focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'placeholder:text-gray-400',
            hasErrors
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300',
            readOnly && 'bg-gray-50'
          )}
        />

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