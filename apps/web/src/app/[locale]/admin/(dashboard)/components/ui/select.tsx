'use client';

import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { forwardRef } from 'react';

import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn';

import type { ElementRef, ComponentPropsWithoutRef, FC } from 'react';

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = forwardRef<
  ElementRef<typeof SelectPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      // Base layout with design system tokens
      'flex h-[var(--density-button-height)] w-full cursor-pointer items-center justify-between',
      'bg-background border-border rounded-[var(--radius-control)] border',
      'px-[var(--density-spacing-md)] py-[var(--density-spacing-sm)]',
      'text-foreground text-sm leading-relaxed font-medium',

      // Modern transitions 2025
      'transition-all duration-[var(--transition-normal)] ease-[cubic-bezier(0.4,0,0.2,1)]',
      'will-change-transform',

      // Enhanced hover states
      'hover:from-primary/4 hover:to-accent/2 hover:bg-gradient-to-r',
      'hover:border-primary/40 hover:shadow-[var(--shadow-surface)]',
      'hover:-translate-y-px hover:scale-[1.01]',

      // Modern focus states
      'focus:ring-primary/60 focus:ring-2 focus:outline-none',
      'focus:ring-offset-background focus:ring-offset-2',
      'focus:border-primary/70 focus:bg-primary/5',

      // States
      'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:scale-100',
      'data-[state=open]:bg-primary/8 data-[state=open]:border-primary/50',
      'data-[state=open]:shadow-[var(--shadow-card)]',

      // Typography
      'placeholder:text-muted-foreground/60 placeholder:font-normal',
      '[&>span]:line-clamp-1 [&>span]:tracking-wide',
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="text-muted-foreground data-[state=open]:text-primary h-4 w-4 transition-all duration-[var(--transition-normal)] ease-[cubic-bezier(0.4,0,0.2,1)] data-[state=open]:rotate-180" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = forwardRef<
  ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      'flex cursor-default items-center justify-center py-2',
      'text-muted-foreground hover:text-foreground',
      'transition-colors duration-[var(--transition-fast)]',
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = forwardRef<
  ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      'flex cursor-default items-center justify-center py-2',
      'text-muted-foreground hover:text-foreground',
      'transition-colors duration-[var(--transition-fast)]',
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = forwardRef<
  ElementRef<typeof SelectPrimitive.Content>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      position={position}
      className={cn(
        // Enhanced dropdown design 2025
        'relative z-[var(--z-overlay)] max-h-96 min-w-[12rem] overflow-hidden',
        'border-border/40 rounded-[var(--radius-overlay)] border',
        'bg-background/98 text-foreground backdrop-blur-xl',
        'shadow-primary/8 shadow-[var(--shadow-dialog)]',

        // Advanced animations with spring curves
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        'data-[state=closed]:duration-200 data-[state=open]:duration-300',

        // Directional slide animations
        position === 'popper' && [
          'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
          'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        ],

        className
      )}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          'p-[var(--density-spacing-sm)]',
          position === 'popper' &&
            'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = forwardRef<
  ElementRef<typeof SelectPrimitive.Label>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn(
      'py-[var(--density-spacing-sm)] pr-[var(--density-spacing-sm)] pl-10',
      'text-muted-foreground/80 text-xs font-semibold',
      'leading-tight tracking-wider uppercase',
      className
    )}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = forwardRef<
  ElementRef<typeof SelectPrimitive.Item>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      // Base layout with improved spacing
      'relative flex w-full cursor-pointer items-center select-none',
      'rounded-[var(--radius-control)] py-[var(--density-spacing-sm)] pr-[var(--density-spacing-sm)] pl-10',
      'text-foreground text-sm leading-relaxed font-medium tracking-wide',
      'will-change-transform outline-none',

      // Modern transitions and micro-interactions 2025
      'transition-all duration-[var(--transition-normal)] ease-[cubic-bezier(0.4,0,0.2,1)]',

      // Enhanced hover/focus states
      'hover:from-primary/8 hover:to-accent/4 hover:bg-gradient-to-r',
      'hover:text-foreground hover:scale-[1.02] hover:shadow-sm',
      'focus:bg-primary/10 focus:text-foreground focus:scale-[1.02]',
      'focus:shadow-primary/10 focus:shadow-[var(--shadow-surface)]',

      // Selected state
      'data-[state=checked]:bg-primary/15 data-[state=checked]:text-primary',
      'data-[state=checked]:font-semibold data-[state=checked]:shadow-sm',

      // Disabled state
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-40',
      'data-[disabled]:hover:scale-100 data-[disabled]:hover:bg-transparent',

      className
    )}
    {...props}
  >
    <span className="absolute left-3 flex h-4 w-4 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="text-primary animate-in zoom-in-75 h-3.5 w-3.5 font-bold duration-200" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText className="flex-1 truncate">
      {children}
    </SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = forwardRef<
  ElementRef<typeof SelectPrimitive.Separator>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn(
      '-mx-[var(--density-spacing-sm)] my-[var(--density-spacing-sm)]',
      'via-border/60 h-px bg-gradient-to-r from-transparent to-transparent',
      className
    )}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};

export type SimpleSelectProps = {
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  options: { value: string; label: string; disabled?: boolean }[];
  className?: string;
  disabled?: boolean;
};

export const SimpleSelect: FC<SimpleSelectProps> = ({
  placeholder = 'Sélectionner...',
  value,
  onValueChange,
  options,
  className,
  disabled,
}) => {
  return (
    <Select disabled={disabled} value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map(option => (
          <SelectItem
            key={option.value}
            disabled={option.disabled}
            value={option.value}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
