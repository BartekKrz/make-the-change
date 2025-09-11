
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

import type { ButtonHTMLAttributes, ReactNode, ForwardedRef } from 'react';

const buttonVariants = cva(
  'control-button relative cursor-pointer overflow-hidden inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 dark:focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:focus-visible:ring-offset-card disabled:pointer-events-none disabled:opacity-50 dark:disabled:opacity-40 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 group will-change-transform',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-sm [@media(hover:hover)]:hover:shadow-lg [@media(hover:hover)]:hover:shadow-primary/15 [@media(hover:hover)]:hover:bg-primary-dark active:scale-[0.98] active:shadow-sm',

        secondary:
          'bg-secondary text-secondary-foreground shadow-sm [@media(hover:hover)]:hover:bg-secondary-dark [@media(hover:hover)]:hover:shadow-md active:scale-[0.98] active:bg-secondary-dark',

        accent:
          'bg-accent text-accent-foreground shadow-sm [@media(hover:hover)]:hover:shadow-lg [@media(hover:hover)]:hover:shadow-accent/15 [@media(hover:hover)]:hover:bg-accent-dark active:scale-[0.98] active:shadow-sm',

        success:
          'bg-success text-success-foreground shadow-sm [@media(hover:hover)]:hover:shadow-lg [@media(hover:hover)]:hover:shadow-success/15 [@media(hover:hover)]:hover:brightness-110 active:scale-[0.98] active:shadow-sm',

        destructive:
          'bg-destructive text-destructive-foreground shadow-sm [@media(hover:hover)]:hover:shadow-lg [@media(hover:hover)]:hover:shadow-destructive/15 [@media(hover:hover)]:hover:brightness-110 active:scale-[0.98] active:shadow-sm',

        warning:
          'bg-warning text-warning-foreground shadow-sm [@media(hover:hover)]:hover:shadow-lg [@media(hover:hover)]:hover:shadow-warning/15 [@media(hover:hover)]:hover:brightness-110 active:scale-[0.98] active:shadow-sm',

        info:
          'bg-info text-info-foreground shadow-sm [@media(hover:hover)]:hover:shadow-lg [@media(hover:hover)]:hover:shadow-info/15 [@media(hover:hover)]:hover:brightness-110 active:scale-[0.98] active:shadow-sm',

        outline:
          'border border-border bg-background dark:bg-card text-foreground dark:text-foreground shadow-sm dark:shadow-black/10 [@media(hover:hover)]:hover:bg-primary [@media(hover:hover)]:hover:text-primary-foreground [@media(hover:hover)]:hover:border-primary [@media(hover:hover)]:hover:shadow-md dark:[@media(hover:hover)]:hover:shadow-black/25 dark:[@media(hover:hover)]:hover:bg-primary dark:[@media(hover:hover)]:hover:border-primary active:scale-[0.98] active:shadow-sm dark:active:shadow-black/15',

        ghost:
          'text-foreground dark:text-foreground [@media(hover:hover)]:hover:bg-secondary/50 dark:[@media(hover:hover)]:hover:bg-muted/40 [@media(hover:hover)]:hover:text-foreground dark:[@media(hover:hover)]:hover:text-foreground active:scale-[0.98] active:bg-secondary/70 dark:active:bg-muted/60',

        link:
          'text-primary underline-offset-4 [@media(hover:hover)]:hover:underline [@media(hover:hover)]:hover:text-primary-dark active:text-primary-dark/80',

        hero:
          'bg-gradient-primary text-primary-foreground shadow-lg [@media(hover:hover)]:hover:shadow-xl [@media(hover:hover)]:hover:shadow-primary/25 active:scale-[0.98] gradient-shift',

        glass:
          'glass-card text-foreground dark:text-foreground [@media(hover:hover)]:hover:bg-card/95 dark:[@media(hover:hover)]:hover:bg-card/70 [@media(hover:hover)]:hover:shadow-lg dark:[@media(hover:hover)]:hover:shadow-black/40 active:scale-[0.98] dark:active:bg-card/80',

        nature:
          'bg-mesh-nature text-primary-foreground shadow-lg [@media(hover:hover)]:hover:shadow-xl [@media(hover:hover)]:hover:shadow-emerald/20 active:scale-[0.98]'
      },
      size: {
        default: 'h-10 px-4 py-2 text-sm',
        sm: 'h-8 px-3 text-xs [border-radius:var(--radius-md)]', /* 6px pour compact */
        lg: 'h-12 px-8 text-base font-semibold [border-radius:var(--radius-xl)]', /* 12px pour large */
        icon: 'h-10 w-10',
        full: 'w-full h-10 px-4 py-2'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
    loadingText?: string;
    icon?: ReactNode;
    shimmer?: boolean;
  };

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      loadingText,
      disabled,
      children,
      icon,
      shimmer = true,
      ...props
    },
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    const Comp = asChild ? Slot : 'button';
    const isDisabled = disabled ?? loading;

    const shouldShowShimmer =
      shimmer &&
      !isDisabled &&
      ['default', 'accent', 'hero'].includes(variant || 'default');

    if (asChild) {
      return (
        <Comp
          ref={ref}
          aria-disabled={isDisabled ? 'true' : undefined}
          className={cn(buttonVariants({ variant, size, className }))}
          disabled={isDisabled}
          {...props}
        >
          {children}
        </Comp>
      );
    }

    return (
      <Comp
        ref={ref}
        aria-disabled={isDisabled ? 'true' : undefined}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={isDisabled}
        {...props}
      >
        {/* Effet shimmer pour variants spéciaux */}
        {shouldShowShimmer && (
          <div className='absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 dark:via-white/12 to-white/0 translate-x-[-100%] [@media(hover:hover)]:group-hover:translate-x-[100%] transition-transform duration-500 ease-out' />
        )}

        {/* Effet shimmer pour outline */}
        {shimmer && !isDisabled && variant === 'outline' && (
          <div className='absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/8 dark:via-primary/15 to-primary/0 translate-x-[-100%] [@media(hover:hover)]:group-hover:translate-x-[100%] transition-transform duration-500 ease-out' />
        )}

        {/* Effet shimmer pour ghost */}
        {shimmer && !isDisabled && variant === 'ghost' && (
          <div className='absolute inset-0 bg-gradient-to-r from-secondary/0 via-secondary/12 dark:via-muted/20 to-secondary/0 translate-x-[-100%] [@media(hover:hover)]:group-hover:translate-x-[100%] transition-transform duration-500 ease-out' />
        )}

        {/* Effet shimmer pour glass */}
        {shimmer && !isDisabled && variant === 'glass' && (
          <div className='absolute inset-0 bg-gradient-to-r from-card/0 via-card/15 dark:via-card/25 to-card/0 translate-x-[-100%] [@media(hover:hover)]:group-hover:translate-x-[100%] transition-transform duration-500 ease-out' />
        )}

        {/* Contenu principal */}
        {loading ? (
          <div className='flex items-center justify-center gap-2 relative z-10'>
            <div className='animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent' />
            <span>{loadingText ?? children}</span>
          </div>
        ) : (
          <div className='flex items-center justify-center gap-2 relative z-10'>
            {icon && (
              <span className='transition-transform [@media(hover:hover)]:group-hover:scale-105 group-active:scale-95 duration-200 ease-out'>
                {icon}
              </span>
            )}
            <span>{children}</span>
          </div>
        )}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };