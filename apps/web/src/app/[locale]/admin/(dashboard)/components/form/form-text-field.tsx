'use client';

import { forwardRef, type ForwardedRef } from 'react';

import { Input } from '@/app/[locale]/admin/(dashboard)/components/ui/input';
import {
  useFieldContext,
  useFieldErrors,
} from '@/app/[locale]/admin/(dashboard)/components/form/form-context';
import { cn } from '@/lib/utils';

export type FormTextFieldProps = {
  label?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
} & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange' | 'onBlur' | 'size'
>;

const FormTextFieldComponent = (
  { label, placeholder, required, className, ...props }: FormTextFieldProps,
  ref: ForwardedRef<HTMLInputElement>
) => {
  const field = useFieldContext<string>();
  const value = field.state.value ?? '';
  const onChange = (v: string) => field.handleChange(v);
  const onBlur = field.handleBlur;
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
      <Input
        ref={ref}
        placeholder={placeholder}
        value={value}
        className={cn(
          hasError && 'border-red-500 focus:border-red-500',
          className
        )}
        onBlur={onBlur}
        onChange={e => onChange(e.target.value)}
        {...props}
      />
      {hasError && errors[0] && (
        <p className="text-sm text-red-500">{errors[0]}</p>
      )}
    </div>
  );
};

export const FormTextField = forwardRef(FormTextFieldComponent);
