'use client';

import { forwardRef, type ForwardedRef } from 'react';

import { TextArea } from '@/app/[locale]/admin/(dashboard)/components/ui/textarea';
import {
  useFieldContext,
  useFieldErrors,
} from '@/app/[locale]/admin/(dashboard)/components/form/form-context';
import { cn } from '@/lib/utils';

export type FormTextAreaProps = {
  label?: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  maxLength?: number;
  description?: string;
  className?: string;
} & Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  'value' | 'onChange' | 'onBlur'
>;

const FormTextAreaComponent = (
  {
    label,
    placeholder,
    required,
    rows = 3,
    maxLength,
    description,
    className,
    ...props
  }: FormTextAreaProps,
  ref: ForwardedRef<HTMLTextAreaElement>
) => {
  const field = useFieldContext<string>();
  const value = field.state.value ?? '';
  const errors = useFieldErrors();
  const hasError = errors.length > 0;

  return (
    <div className="space-y-1">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
          {maxLength && (
            <span className="text-muted-foreground text-xs">
              {value.length}/{maxLength}
            </span>
          )}
        </div>
      )}
      {description && (
        <p className="text-muted-foreground text-xs">{description}</p>
      )}
      <TextArea
        ref={ref}
        maxLength={maxLength}
        placeholder={placeholder}
        rows={rows}
        value={value}
        className={cn(
          hasError && 'border-red-500 focus:border-red-500',
          className
        )}
        onBlur={field.handleBlur}
        onChange={e => field.handleChange(e.target.value)}
        {...props}
      />
      {hasError && errors[0] && (
        <p className="text-sm text-red-500">{errors[0]}</p>
      )}
    </div>
  );
};

export const FormTextArea = forwardRef(FormTextAreaComponent);
