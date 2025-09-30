'use client';

import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { forwardRef, useId } from 'react';

import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn';

import type { ElementRef, ComponentPropsWithoutRef, ForwardedRef } from 'react';

const Checkbox = forwardRef<
  ElementRef<typeof CheckboxPrimitive.Root>,
  ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(
  (
    { className, ...props },
    ref: ForwardedRef<ElementRef<typeof CheckboxPrimitive.Root>>
  ) => (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        'peer border-border h-5 w-5 shrink-0 rounded-[var(--radius-control)] border-2',
        'bg-background transition-all duration-[var(--transition-normal)] ease-[cubic-bezier(0.4,0,0.2,1)]',
        'cursor-pointer will-change-transform',

        'hover:border-primary/60 hover:bg-primary/5 hover:scale-105',
        'hover:shadow-primary/20 hover:shadow-sm',

        'focus-visible:ring-primary/60 focus-visible:ring-2 focus-visible:outline-none',
        'focus-visible:ring-offset-background focus-visible:ring-offset-2',
        'focus-visible:border-primary/70',

        'data-[state=checked]:bg-primary data-[state=checked]:border-primary',
        'data-[state=checked]:text-primary-foreground data-[state=checked]:shadow-sm',
        'data-[state=checked]:hover:bg-primary/90 data-[state=checked]:hover:scale-105',

        'data-[state=indeterminate]:bg-primary data-[state=indeterminate]:border-primary',
        'data-[state=indeterminate]:text-primary-foreground',

        'disabled:cursor-not-allowed disabled:opacity-50',
        'disabled:hover:border-border disabled:hover:bg-background disabled:hover:scale-100',

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
        <Check className="h-3.5 w-3.5 font-bold drop-shadow-sm" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
);
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

type CheckboxWithLabelProps = {
  label?: string;
  description?: string;
  error?: string;
} & ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>;

const CheckboxWithLabel = forwardRef<
  ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxWithLabelProps
>(
  (
    { className, label, description, error, id, ...props },
    ref: ForwardedRef<ElementRef<typeof CheckboxPrimitive.Root>>
  ) => {
    const reactId = useId();
    const checkboxId = id ?? `checkbox-${reactId}`;

    return (
      <div className="space-y-[var(--density-spacing-sm)]">
        <div className="group flex items-center gap-[var(--density-spacing-sm)]">
          <Checkbox
            ref={ref}
            id={checkboxId}
            className={cn(
              'group-hover:border-primary/70 group-hover:bg-primary/8 group-hover:scale-105',
              'group-hover:shadow-primary/25 group-hover:shadow-md',
              className
            )}
            {...props}
          />
          {label && (
            <label
              htmlFor={checkboxId}
              className={cn(
                'text-foreground text-sm leading-relaxed font-medium tracking-wide',
                'cursor-pointer transition-all duration-[var(--transition-normal)] select-none',
                'group-hover:text-primary group-hover:scale-[1.02]',
                'peer-disabled:cursor-not-allowed peer-disabled:opacity-50'
              )}
            >
              {label}
            </label>
          )}
        </div>
        {description && (
          <p className="text-muted-foreground/80 ml-7 text-xs leading-relaxed tracking-wide">
            {description}
          </p>
        )}
        {error && (
          <p className="text-destructive ml-7 flex items-center gap-1 text-xs leading-tight font-medium">
            <span className="bg-destructive inline-block h-1 w-1 rounded-full" />
            {error}
          </p>
        )}
      </div>
    );
  }
);
CheckboxWithLabel.displayName = 'CheckboxWithLabel';

export { Checkbox, CheckboxWithLabel };
