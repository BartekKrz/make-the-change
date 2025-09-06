'use client';

import { forwardRef } from 'react';

import { Check } from 'lucide-react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';

import { cn } from '@/app/admin/(dashboard)/components/cn';

import type { ElementRef, ComponentPropsWithoutRef, ForwardedRef } from 'react';

const Checkbox = forwardRef<
  ElementRef<typeof CheckboxPrimitive.Root>,
  ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref: ForwardedRef<ElementRef<typeof CheckboxPrimitive.Root>>) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'peer h-4 w-4 shrink-0 rounded-sm border border-neutral-300 dark:border-neutral-600 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-white dark:ring-offset-neutral-950 dark:focus-visible:ring-blue-300 dark:data-[state=checked]:bg-blue-600 dark:data-[state=checked]:border-blue-600',
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn('flex items-center justify-center text-current')}>
      <Check className='h-3 w-3' />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

type CheckboxWithLabelProps = {
  label?: string;
  description?: string;
  error?: string;
} & ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>;

const CheckboxWithLabel = forwardRef<ElementRef<typeof CheckboxPrimitive.Root>, CheckboxWithLabelProps>(
  ({ className, label, description, error, ...props }, ref: ForwardedRef<ElementRef<typeof CheckboxPrimitive.Root>>) => (
    <div className='space-y-2'>
      <div className='flex items-center space-x-2 cursor-pointer'>
        <Checkbox ref={ref} className={className} {...props} />
        {label && (
          <label
            htmlFor={props.id}
            className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
          >
            {label}
          </label>
        )}
      </div>
      {description && <p className='text-sm text-neutral-600 dark:text-neutral-400'>{description}</p>}
      {error && <p className='text-sm text-red-600 dark:text-red-400'>{error}</p>}
    </div>
  )
);
CheckboxWithLabel.displayName = 'CheckboxWithLabel';

export { Checkbox, CheckboxWithLabel };
