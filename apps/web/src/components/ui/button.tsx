import { forwardRef } from 'react';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

import type { ButtonHTMLAttributes, ReactNode, ForwardedRef } from 'react';

const buttonVariants = cva(
  'relative cursor-pointer overflow-hidden inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 ease-out focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-60 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 group active:scale-[0.97] active:brightness-95 tap-highlight-transparent touch-manipulation',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-primary text-primary-foreground shadow-lg [@media(hover:hover)]:hover:shadow-xl [@media(hover:hover)]:hover:shadow-primary/20 active:scale-[0.98] transition-all duration-300',

        secondary:
          'bg-secondary [@media(hover:hover)]:hover:bg-secondary/80 text-secondary-foreground shadow-sm [@media(hover:hover)]:hover:shadow-md hover-lift active:bg-secondary/90',

        accent:
          'bg-gradient-accent text-accent-foreground shadow-lg [@media(hover:hover)]:hover:shadow-xl [@media(hover:hover)]:hover:shadow-accent/20 active:scale-[0.98] transition-all duration-300',

        success:
          'bg-gradient-success text-success-foreground shadow-lg [@media(hover:hover)]:hover:shadow-xl [@media(hover:hover)]:hover:shadow-success/20 active:scale-[0.98] transition-all duration-300',

        destructive:
          'bg-destructive [@media(hover:hover)]:hover:bg-destructive-light text-destructive-foreground shadow-lg [@media(hover:hover)]:hover:shadow-xl [@media(hover:hover)]:hover:shadow-destructive/20 hover-lift active:bg-destructive/95',

        warning:
          'bg-gradient-accent text-warning-foreground shadow-lg [@media(hover:hover)]:hover:shadow-xl [@media(hover:hover)]:hover:shadow-warning/20 active:scale-[0.98] transition-all duration-300',

        info:
          'bg-gradient-ocean text-info-foreground shadow-lg [@media(hover:hover)]:hover:shadow-xl [@media(hover:hover)]:hover:shadow-info/20 active:scale-[0.98] transition-all duration-300',

        outline:
          'border border-border bg-background/80 backdrop-blur-sm [@media(hover:hover)]:hover:bg-accent/10 [@media(hover:hover)]:hover:border-accent/40 [@media(hover:hover)]:hover:text-accent-foreground text-foreground shadow-sm [@media(hover:hover)]:hover:shadow-md hover-lift active:bg-accent/20',

        ghost:
          'text-foreground [@media(hover:hover)]:hover:bg-gradient-to-r [@media(hover:hover)]:hover:from-accent/5 [@media(hover:hover)]:hover:to-primary/5 [@media(hover:hover)]:hover:text-accent-foreground transition-all duration-300 active:bg-accent/15',

        link:
          'text-primary underline-offset-4 [@media(hover:hover)]:hover:underline [@media(hover:hover)]:hover:text-accent [@media(hover:hover)]:hover:bg-gradient-to-r [@media(hover:hover)]:hover:from-transparent [@media(hover:hover)]:hover:to-accent/5 transition-all duration-300 active:text-accent/80',

        hero:
          'bg-gradient-hero text-primary-foreground shadow-xl [@media(hover:hover)]:hover:shadow-2xl [@media(hover:hover)]:hover:shadow-accent/30 active:scale-[0.98] gradient-shift',

        glass:
          'glass-card text-foreground [@media(hover:hover)]:hover:bg-card/95 hover-lift shadow-lg [@media(hover:hover)]:hover:shadow-xl',

        nature:
          'bg-mesh-nature text-primary-foreground shadow-lg [@media(hover:hover)]:hover:shadow-xl [@media(hover:hover)]:hover:shadow-emerald/20 active:scale-[0.98] transition-all duration-500'
      },
      size: {
        default: 'h-10 px-4 py-2 text-sm',
        sm: 'h-9 rounded-md px-3 text-xs',
        lg: 'h-12 rounded-xl px-8 text-base font-semibold',
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
      (variant === 'default' ||
        variant === 'accent' ||
        variant === 'destructive' ||
        variant === 'success' ||
        variant === 'warning' ||
        variant === 'info');

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled ? 'true' : undefined}
        {...props}
      >
        <div>
          {/* Effet shimmer pour variants avec gradients */}
          {shouldShowShimmer && (
            <div className='absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] [@media(hover:hover)]:group-hover:translate-x-[100%] transition-transform duration ease-out' />
          )}

          {/* Effet shimmer pour outline */}
          {shimmer && !isDisabled && variant === 'outline' && (
            <div className='absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 translate-x-[-100%] [@media(hover:hover)]:group-hover:translate-x-[100%] transition-transform duration ease-out' />
          )}

          {/* Contenu avec loading state */}
          {loading ? (
            <div className='flex items-center justify-center gap-2 relative z-10 pointer-events-none'>
              <div className='animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent' />
              <span className='animate-pulse'>{loadingText ?? children}</span>
            </div>
          ) : (
            <div className='flex items-center justify-center gap-2 relative z-10 pointer-events-none'>
              {icon && (
                <span className='transition-transform [@media(hover:hover)]:group-hover:scale-110 group-active:scale-95 duration-200 ease-out pointer-events-none'>
                  {icon}
                </span>
              )}
              <span className='flex items-center gap-2 pointer-events-none'>{children}</span>
            </div>
          )}
        </div>
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
