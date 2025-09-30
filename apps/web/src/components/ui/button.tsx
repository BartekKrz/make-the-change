import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

import type { ButtonHTMLAttributes, ReactNode, ForwardedRef } from 'react';

const buttonVariants = cva(
  'control-button focus-visible:ring-primary/50 dark:focus-visible:ring-primary/60 focus-visible:ring-offset-background dark:focus-visible:ring-offset-card group relative inline-flex cursor-pointer items-center justify-center gap-2 overflow-hidden text-sm font-medium whitespace-nowrap transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground [@media(hover:hover)]:hover:shadow-primary/15 [@media(hover:hover)]:hover:bg-primary-dark shadow-sm active:scale-[0.98] active:shadow-sm [@media(hover:hover)]:hover:shadow-lg',

        secondary:
          'bg-secondary text-secondary-foreground [@media(hover:hover)]:hover:bg-secondary-dark active:bg-secondary-dark shadow-sm active:scale-[0.98] [@media(hover:hover)]:hover:shadow-md',

        accent:
          'bg-accent text-accent-foreground [@media(hover:hover)]:hover:shadow-accent/15 [@media(hover:hover)]:hover:bg-accent-dark shadow-sm active:scale-[0.98] active:shadow-sm [@media(hover:hover)]:hover:shadow-lg',

        success:
          'bg-success text-success-foreground [@media(hover:hover)]:hover:shadow-success/15 shadow-sm active:scale-[0.98] active:shadow-sm [@media(hover:hover)]:hover:shadow-lg [@media(hover:hover)]:hover:brightness-110',

        destructive:
          'bg-destructive text-destructive-foreground [@media(hover:hover)]:hover:shadow-destructive/15 shadow-sm active:scale-[0.98] active:shadow-sm [@media(hover:hover)]:hover:shadow-lg [@media(hover:hover)]:hover:brightness-110',

        warning:
          'bg-warning text-warning-foreground [@media(hover:hover)]:hover:shadow-warning/15 shadow-sm active:scale-[0.98] active:shadow-sm [@media(hover:hover)]:hover:shadow-lg [@media(hover:hover)]:hover:brightness-110',

        info: 'bg-info text-info-foreground [@media(hover:hover)]:hover:shadow-info/15 shadow-sm active:scale-[0.98] active:shadow-sm [@media(hover:hover)]:hover:shadow-lg [@media(hover:hover)]:hover:brightness-110',

        outline:
          'border-border bg-background dark:bg-card text-foreground dark:text-foreground [@media(hover:hover)]:hover:bg-primary [@media(hover:hover)]:hover:text-primary-foreground [@media(hover:hover)]:hover:border-primary dark:[@media(hover:hover)]:hover:bg-primary dark:[@media(hover:hover)]:hover:border-primary border shadow-sm active:scale-[0.98] active:shadow-sm dark:shadow-black/10 dark:active:shadow-black/15 [@media(hover:hover)]:hover:shadow-md dark:[@media(hover:hover)]:hover:shadow-black/25',

        ghost:
          'text-foreground dark:text-foreground [@media(hover:hover)]:hover:bg-secondary/50 dark:[@media(hover:hover)]:hover:bg-muted/40 [@media(hover:hover)]:hover:text-foreground dark:[@media(hover:hover)]:hover:text-foreground active:bg-secondary/70 dark:active:bg-muted/60 active:scale-[0.98]',

        link: 'text-primary [@media(hover:hover)]:hover:text-primary-dark active:text-primary-dark/80 underline-offset-4 [@media(hover:hover)]:hover:underline',

        hero: 'bg-gradient-primary text-primary-foreground [@media(hover:hover)]:hover:shadow-primary/25 gradient-shift shadow-lg active:scale-[0.98] [@media(hover:hover)]:hover:shadow-xl',

        glass:
          'glass-card text-foreground dark:text-foreground [@media(hover:hover)]:hover:bg-card/95 dark:[@media(hover:hover)]:hover:bg-card/70 dark:active:bg-card/80 active:scale-[0.98] [@media(hover:hover)]:hover:shadow-lg dark:[@media(hover:hover)]:hover:shadow-black/40',

        nature:
          'bg-mesh-nature text-primary-foreground [@media(hover:hover)]:hover:shadow-emerald/20 shadow-lg active:scale-[0.98] [@media(hover:hover)]:hover:shadow-xl',
      },
      size: {
        default: 'h-10 px-4 py-2 text-sm',
        sm: 'h-8 [border-radius:var(--radius-md)] px-3 text-xs' /* 6px pour compact */,
        lg: 'h-12 [border-radius:var(--radius-xl)] px-8 text-base font-semibold' /* 12px pour large */,
        icon: 'h-10 w-10',
        full: 'h-10 w-full px-4 py-2',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
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
          <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-500 ease-out dark:via-white/12 [@media(hover:hover)]:group-hover:translate-x-[100%]" />
        )}

        {/* Effet shimmer pour outline */}
        {shimmer && !isDisabled && variant === 'outline' && (
          <div className="from-primary/0 via-primary/8 dark:via-primary/15 to-primary/0 absolute inset-0 translate-x-[-100%] bg-gradient-to-r transition-transform duration-500 ease-out [@media(hover:hover)]:group-hover:translate-x-[100%]" />
        )}

        {/* Effet shimmer pour ghost */}
        {shimmer && !isDisabled && variant === 'ghost' && (
          <div className="from-secondary/0 via-secondary/12 dark:via-muted/20 to-secondary/0 absolute inset-0 translate-x-[-100%] bg-gradient-to-r transition-transform duration-500 ease-out [@media(hover:hover)]:group-hover:translate-x-[100%]" />
        )}

        {/* Effet shimmer pour glass */}
        {shimmer && !isDisabled && variant === 'glass' && (
          <div className="from-card/0 via-card/15 dark:via-card/25 to-card/0 absolute inset-0 translate-x-[-100%] bg-gradient-to-r transition-transform duration-500 ease-out [@media(hover:hover)]:group-hover:translate-x-[100%]" />
        )}

        {/* Contenu principal */}
        {loading ? (
          <div className="relative z-10 flex items-center justify-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <span>{loadingText ?? children}</span>
          </div>
        ) : (
          <div className="relative z-10 flex items-center justify-center gap-2">
            {icon && (
              <span className="transition-transform duration-200 ease-out group-active:scale-95 [@media(hover:hover)]:group-hover:scale-105">
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
