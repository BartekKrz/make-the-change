'use client';

import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/app/admin/(dashboard)/components/cn';
import type { ElementRef, ComponentPropsWithoutRef, FC } from 'react';
import { forwardRef } from 'react';

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
      'flex h-[var(--density-button-height)] w-full items-center justify-between',
      'rounded-[var(--radius-control)] bg-background border border-border',
      'px-[var(--density-spacing-md)] py-[var(--density-spacing-sm)]',
      'text-sm font-medium text-foreground leading-relaxed',
      
      // Modern transitions 2025
      'transition-all duration-[var(--transition-normal)] ease-[cubic-bezier(0.4,0,0.2,1)]',
      'will-change-transform',
      
      // Enhanced hover states
      'hover:bg-gradient-to-r hover:from-primary/4 hover:to-accent/2',
      'hover:border-primary/40 hover:shadow-[var(--shadow-surface)]',
      'hover:scale-[1.01] hover:-translate-y-px',
      
      // Modern focus states
      'focus:outline-none focus:ring-2 focus:ring-primary/60',
      'focus:ring-offset-2 focus:ring-offset-background',
      'focus:border-primary/70 focus:bg-primary/5',
      
      // States
      'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:translate-y-0',
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
      <ChevronDown className='h-4 w-4 text-muted-foreground transition-all duration-[var(--transition-normal)] ease-[cubic-bezier(0.4,0,0.2,1)] data-[state=open]:rotate-180 data-[state=open]:text-primary' />
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
    <ChevronUp className='h-4 w-4' />
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
    <ChevronDown className='h-4 w-4' />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = forwardRef<
  ElementRef<typeof SelectPrimitive.Content>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        // Enhanced dropdown design 2025
        'relative z-[var(--z-overlay)] max-h-96 min-w-[12rem] overflow-hidden',
        'rounded-[var(--radius-overlay)] border border-border/40',
        'bg-background/98 backdrop-blur-xl text-foreground',
        'shadow-[var(--shadow-dialog)] shadow-primary/8',
        
        // Advanced animations with spring curves
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        'data-[state=open]:duration-300 data-[state=closed]:duration-200',
        
        // Directional slide animations
        position === 'popper' && [
          'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
          'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2'
        ],
        
        className
      )}
      position={position}
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
      'py-[var(--density-spacing-sm)] pl-10 pr-[var(--density-spacing-sm)]',
      'text-xs font-semibold text-muted-foreground/80',
      'uppercase tracking-wider leading-tight',
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
      'relative flex w-full cursor-pointer select-none items-center',
      'rounded-[var(--radius-control)] py-[var(--density-spacing-sm)] pl-10 pr-[var(--density-spacing-sm)]',
      'text-sm font-medium text-foreground leading-relaxed tracking-wide',
      'outline-none will-change-transform',
      
      // Modern transitions and micro-interactions 2025
      'transition-all duration-[var(--transition-normal)] ease-[cubic-bezier(0.4,0,0.2,1)]',
      
      // Enhanced hover/focus states
      'hover:bg-gradient-to-r hover:from-primary/8 hover:to-accent/4',
      'hover:text-foreground hover:scale-[1.02] hover:shadow-sm',
      'focus:bg-primary/10 focus:text-foreground focus:scale-[1.02]',
      'focus:shadow-[var(--shadow-surface)] focus:shadow-primary/10',
      
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
    <span className='absolute left-3 flex h-4 w-4 items-center justify-center'>
      <SelectPrimitive.ItemIndicator>
        <Check className='h-3.5 w-3.5 text-primary font-bold animate-in zoom-in-75 duration-200' />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText className='flex-1 truncate'>{children}</SelectPrimitive.ItemText>
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
      'h-px bg-gradient-to-r from-transparent via-border/60 to-transparent',
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
  SelectScrollDownButton
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
  disabled
}) => {
  
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
