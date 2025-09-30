'use client';

import {
  useFieldContext,
  useFieldErrors,
} from '@/app/[locale]/admin/(dashboard)/components/form/form-context';

export type FormToggleProps = {
  label: string;
  description?: string;
  className?: string;
  hideLabel?: boolean;
};

export const FormToggle = ({
  label,
  description,
  className,
  hideLabel = false,
}: FormToggleProps) => {
  const field = useFieldContext<boolean>();
  const checked = Boolean(field.state.value);
  const errors = useFieldErrors();
  const hasError = errors.length > 0;

  return (
    <div className="space-y-1">
      <div className="flex items-center space-x-2">
        <input
          aria-label={hideLabel ? label : undefined}
          checked={checked}
          className={`h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 ${className}`}
          id={hideLabel ? undefined : label}
          type="checkbox"
          onBlur={field.handleBlur}
          onChange={e => field.handleChange(e.target.checked)}
        />
        <div className="grid gap-1.5 leading-none">
          {!hideLabel && (
            <label
              className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor={label}
            >
              {label}
            </label>
          )}
          {description && (
            <p className="text-muted-foreground text-xs">{description}</p>
          )}
        </div>
      </div>
      {hasError && errors[0] && (
        <p className="text-sm text-red-500">{errors[0]}</p>
      )}
    </div>
  );
};
