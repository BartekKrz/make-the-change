'use client';

import type { FC } from 'react';

import { cn } from '@/app/admin/(dashboard)/components/cn';

export type FieldErrorProps = {
  errors?: string[];
  className?: string;
  isValidating?: boolean;
}

export const FieldError: FC<FieldErrorProps> = ({
  errors,
  className,
  isValidating = false
}) => {
  if (isValidating) {
    return (
      <p className={cn('text-sm text-muted-foreground animate-pulse', className)}>
        Validation en cours...
      </p>
    );
  }

  if (!errors || errors.length === 0) {
    return null;
  }

  return (
    <div className={cn('text-sm text-destructive space-y-1', className)}>
      {errors.map((error, index) => (
        <p key={index} className='flex items-start gap-1'>
          <span className='text-destructive'>•</span>
          {error}
        </p>
      ))}
    </div>
  );
};
