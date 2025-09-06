'use client';

import { forwardRef } from 'react';

import { cn } from '@/app/admin/(dashboard)/components/cn';

import type { HTMLAttributes, ForwardedRef } from 'react';

type CardProps = HTMLAttributes<HTMLDivElement> & {
  interactive?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, interactive = false, ...props }, ref: ForwardedRef<HTMLDivElement>) => (
    <div
      ref={ref}
      className={cn(
        'rounded-2xl border border-border bg-background/50 backdrop-blur-md text-card-foreground shadow-sm transition-all duration-300',
        interactive && '',
        className
      )}
      {...props}
    />
  )
);
Card.displayName = 'Card';

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref: ForwardedRef<HTMLDivElement>) => (
    <div
      ref={ref}
      className={cn(
        'flex flex-col space-y-2 p-8 border-b border-border/50 bg-gradient-to-r from-primary/5 to-secondary/5',
        className
      )}
      {...props}
    />
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref: ForwardedRef<HTMLParagraphElement>) => (
    <h3
      ref={ref}
      className={cn('text-2xl font-semibold leading-tight tracking-tight text-foreground', className)}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref: ForwardedRef<HTMLParagraphElement>) => (
    <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
  )
);
CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref: ForwardedRef<HTMLDivElement>) => (
    <div ref={ref} className={cn('px-8 pb-8 pt-4', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref: ForwardedRef<HTMLDivElement>) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center p-8 pt-0 border-t border-border/30 bg-gradient-to-r from-primary/3 to-secondary/3',
        className
      )}
      {...props}
    />
  )
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
