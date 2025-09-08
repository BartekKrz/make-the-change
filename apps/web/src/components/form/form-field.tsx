'use client';

import { type ReactNode } from 'react';

import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn';

import type { FC } from 'react';

export type FormFieldProps = {
  label?: string;
  description?: string;
  className?: string;
  required?: boolean;
  children?: ReactNode;
  error?: string;
  isValidating?: boolean;
  fieldId?: string;
}

export const FormField: FC<FormFieldProps> = ({
  label,
  description,
  className,
  required = false,
  children,
  error,
  isValidating = false,
  fieldId
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label
          htmlFor={fieldId}
          className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
        >
          {label}
          {required && <span className='text-destructive ml-1'>*</span>}
        </label>
      )}

      {description && (
        <p className='text-sm text-muted-foreground'>
          {description}
        </p>
      )}

      <div className='relative'>
        {children}
      </div>

      {error && (
        <div className='text-sm text-destructive'>
          <p>{error}</p>
        </div>
      )}

      {isValidating && (
        <p className='text-sm text-muted-foreground'>
          Validation en cours...
        </p>
      )}
    </div>
  );
};
