'use client';

import { cn } from '@/lib/utils';

import type { ComponentProps } from 'react';

export type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'success'
  | 'warning';

export type BadgeProps = {
  variant?: BadgeVariant;
} & ComponentProps<'div'>;

const badgeVariants = {
  default:
    'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
  secondary:
    'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
  destructive:
    'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80',
  outline:
    'text-foreground border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  success: 'border-transparent bg-green-500 text-white hover:bg-green-600',
  warning: 'border-transparent bg-yellow-500 text-white hover:bg-yellow-600',
};

export function Badge({
  className,
  variant = 'default',
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        'focus:ring-ring inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none',
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  );
}
