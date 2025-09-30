'use client';

import { forwardRef } from 'react';

import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn';

import type { HTMLAttributes, ForwardedRef } from 'react';

type CardProps = HTMLAttributes<HTMLDivElement> & {
  interactive?: boolean;
};

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { className, interactive = false, ...props },
    ref: ForwardedRef<HTMLDivElement>
  ) => (
    <div
      ref={ref}
      className={cn(
        'border-border bg-background/50 text-card-foreground rounded-2xl border shadow-sm backdrop-blur-md transition-all duration-300',
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
        'border-border/50 from-primary/5 to-secondary/5 flex flex-col space-y-2 border-b bg-gradient-to-r p-8',
        className
      )}
      {...props}
    />
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref: ForwardedRef<HTMLParagraphElement>) => (
  <h3
    ref={ref}
    className={cn(
      'text-foreground text-2xl leading-tight font-semibold tracking-tight',
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref: ForwardedRef<HTMLParagraphElement>) => (
  <p
    ref={ref}
    className={cn('text-muted-foreground text-sm', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref: ForwardedRef<HTMLDivElement>) => (
    <div ref={ref} className={cn('px-8 pt-4 pb-8', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref: ForwardedRef<HTMLDivElement>) => (
    <div
      ref={ref}
      className={cn(
        'border-border/30 from-primary/3 to-secondary/3 flex items-center border-t bg-gradient-to-r p-8 pt-0',
        className
      )}
      {...props}
    />
  )
);
CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
