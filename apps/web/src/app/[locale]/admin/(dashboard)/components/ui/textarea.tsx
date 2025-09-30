import { forwardRef, useState, useId } from 'react';

import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn';

import type { InputHTMLAttributes, ReactNode } from 'react';

export type TextAreaVariant = 'default' | 'outlined' | 'filled';

export type TextAreaProps = {
  label?: string;
  error?: string;
  helpText?: string;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  variant?: TextAreaVariant;
  size?: 'sm' | 'md' | 'lg';
  rows?: number;
} & Omit<InputHTMLAttributes<HTMLTextAreaElement>, 'size'>;

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      className,
      type: _type,
      label,
      error,
      helpText,
      leadingIcon,
      trailingIcon,
      variant = 'default',
      size = 'md',
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [shakeAnimation, setShakeAnimation] = useState('');
    const TextAreaId = useId();
    const ariaDescribedBy = error
      ? `${TextAreaId}-error`
      : (helpText
        ? `${TextAreaId}-help`
        : undefined);

    const handleErrorShake = () => {
      if (error) {
        setShakeAnimation('animate-shake');
        setTimeout(() => setShakeAnimation(''), 500);
      }
    };

    const sizeClasses = {
      sm: 'min-h-[80px] text-sm px-3 py-2',
      md: 'min-h-[100px] text-sm px-4 py-3',
      lg: 'min-h-[120px] text-base px-4 py-3',
    };

    const variantClasses = {
      default:
        'bg-background/70 backdrop-blur-sm border border-border shadow-sm',
      outlined: 'bg-transparent border-2 border-border',
      filled: 'bg-muted/70 backdrop-blur-sm border border-border/70 shadow-sm',
    };

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={TextAreaId}
            className={cn(
              'flex items-center gap-1 text-sm font-medium transition-colors',
              error ? 'text-destructive' : 'text-muted-foreground'
            )}
          >
            {label}
            {error && <span className="text-destructive animate-pulse">*</span>}
          </label>
        )}

        <div
          className={cn(
            'relative flex items-start rounded-xl transition-all duration-300',
            isFocused && 'ring-primary/25 shadow-lg ring-2 ring-offset-1',
            error && 'ring-destructive/25 ring-2 ring-offset-1',
            shakeAnimation
          )}
        >
          {leadingIcon && (
            <div className="text-muted-foreground/70 absolute top-3 left-4 flex items-center">
              {leadingIcon}
            </div>
          )}

          <textarea
            ref={ref}
            aria-describedby={ariaDescribedBy}
            aria-invalid={error ? 'true' : undefined}
            id={TextAreaId}
            className={cn(
              'flex w-full resize-y rounded-xl transition-all duration-300',
              variantClasses[variant],
              sizeClasses[size],
              'text-foreground placeholder:text-muted-foreground/60',
              'focus-visible:ring-primary/30 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none',
              'focus-visible:border-primary/70 focus-visible:shadow-md',
              'disabled:cursor-not-allowed disabled:opacity-50',
              leadingIcon && 'pl-12',
              (trailingIcon ?? error) && 'pr-12',
              error
                ? 'border-destructive bg-destructive/5 focus-visible:ring-destructive/30 focus-visible:border-destructive'
                : 'hover:border-border/80 dark:hover:border-border hover:shadow-sm',
              className
            )}
            onBlur={() => setIsFocused(false)}
            onFocus={() => setIsFocused(true)}
            onChange={e => {
              handleErrorShake();
              props.onChange?.(e);
            }}
            {...props}
          />

          {trailingIcon && (
            <div className="absolute top-3 right-4 flex items-center gap-2">
              {trailingIcon}
            </div>
          )}
        </div>

        {(error ?? helpText) && (
          <p
            id={ariaDescribedBy}
            className={cn(
              'text-sm transition-colors',
              error ? 'text-destructive' : 'text-muted-foreground'
            )}
          >
            {error ?? helpText}
          </p>
        )}
      </div>
    );
  }
);
TextArea.displayName = 'TextArea';
