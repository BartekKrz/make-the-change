'use client';

import { forwardRef } from 'react';

import { Check } from 'lucide-react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';

import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn';

import type { ElementRef, ComponentPropsWithoutRef, ForwardedRef } from 'react';

const Checkbox = forwardRef<
  ElementRef<typeof CheckboxPrimitive.Root>,
  ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref: ForwardedRef<ElementRef<typeof CheckboxPrimitive.Root>>) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      
      'peer h-5 w-5 shrink-0 rounded-[var(--radius-control)] border-2 border-border',
      'bg-background transition-all duration-[var(--transition-normal)] ease-[cubic-bezier(0.4,0,0.2,1)]',
      'will-change-transform cursor-pointer',
      
      
      'hover:border-primary/60 hover:bg-primary/5 hover:scale-105',
      'hover:shadow-sm hover:shadow-primary/20',
      
      
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60',
      'focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      'focus-visible:border-primary/70',
      
      
      'data-[state=checked]:bg-primary data-[state=checked]:border-primary',
      'data-[state=checked]:text-primary-foreground data-[state=checked]:shadow-sm',
      'data-[state=checked]:hover:bg-primary/90 data-[state=checked]:hover:scale-105',
      
      
      'data-[state=indeterminate]:bg-primary data-[state=indeterminate]:border-primary',
      'data-[state=indeterminate]:text-primary-foreground',
      
      
      'disabled:cursor-not-allowed disabled:opacity-50',
      'disabled:hover:scale-100 disabled:hover:border-border disabled:hover:bg-background',
      
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator 
      className={cn(
        'flex items-center justify-center text-current',
        'data-[state=checked]:animate-in data-[state=checked]:zoom-in-75 data-[state=checked]:duration-200',
        'data-[state=unchecked]:animate-out data-[state=unchecked]:zoom-out-75 data-[state=unchecked]:duration-150'
      )}
    >
      <Check className='h-3.5 w-3.5 font-bold drop-shadow-sm' />
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
  ({ className, label, description, error, id, ...props }, ref: ForwardedRef<ElementRef<typeof CheckboxPrimitive.Root>>) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <div className='space-y-[var(--density-spacing-sm)]'>
        <div className='flex items-center gap-[var(--density-spacing-sm)] group'>
          <Checkbox 
            ref={ref} 
            id={checkboxId}
            className={cn(
              
              'group-hover:border-primary/70 group-hover:bg-primary/8 group-hover:scale-105',
              'group-hover:shadow-md group-hover:shadow-primary/25',
              className
            )} 
            {...props} 
          />
          {label && (
            <label
              htmlFor={checkboxId}
              className={
                cn(
                  'text-sm font-medium text-foreground leading-relaxed tracking-wide',
                  'cursor-pointer select-none transition-all duration-[var(--transition-normal)]',
                  'group-hover:text-primary group-hover:scale-[1.02]',
                  'peer-disabled:cursor-not-allowed peer-disabled:opacity-50'
                )
              }
            >
              {label}
            </label>
          )}
        </div>
        {description && (
          <p className='text-xs text-muted-foreground/80 leading-relaxed tracking-wide ml-7'>
            {description}
          </p>
        )}
        {error && (
          <p className='text-xs text-destructive font-medium leading-tight ml-7 flex items-center gap-1'>
            <span className='inline-block w-1 h-1 bg-destructive rounded-full' />
            {error}
          </p>
        )}
      </div>
    );
  }
);
CheckboxWithLabel.displayName = 'CheckboxWithLabel';

export { Checkbox, CheckboxWithLabel };
