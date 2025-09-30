'use client';

import {
  useFieldContext,
  useFieldErrors,
} from '@/app/[locale]/admin/(dashboard)/components/form/form-context';

export type FormSelectProps = {
  label?: string;
  placeholder?: string;
  required?: boolean;
  options: Array<{ value: string; label: string }>;
  className?: string;
};

export const FormSelect = ({
  label,
  placeholder,
  required,
  options,
  className,
}: FormSelectProps) => {
  const field = useFieldContext<string>();
  const value = (field.state.value as string) ?? '';
  const errors = useFieldErrors();
  const hasError = errors.length > 0;

  return (
    <div className="space-y-1">
      {label && (
        <label className="text-sm font-medium">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      <select
        className={`border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring w-full border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${hasError ? 'border-red-500 focus:border-red-500' : ''} ${className}`}
        value={value}
        onBlur={field.handleBlur}
        onChange={e => field.handleChange(e.target.value)}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hasError && errors[0] && (
        <p className="text-sm text-red-500">{errors[0]}</p>
      )}
    </div>
  );
};
