'use client';

import { forwardRef, useState, useId } from 'react';

import { Eye, EyeOff } from 'lucide-react';

import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn';

import type { InputHTMLAttributes, ReactNode, ForwardedRef } from 'react';

export type InputVariant = 'default' | 'outlined' | 'filled';

export type InputProps = {
  label?: string;
  error?: string;
  helpText?: string;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  showPasswordToggle?: boolean;
  variant?: InputVariant;
  size?: 'sm' | 'md' | 'lg';
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      label,
      error,
      helpText,
      leadingIcon,
      trailingIcon,
      showPasswordToggle = false,
      variant = 'default',
      size = 'md',
      ...props
    },
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [shakeAnimation, setShakeAnimation] = useState('');
    const inputId = useId();
    const ariaDescribedBy = error ? `${inputId}-error` : helpText ? `${inputId}-help` : undefined;

    const inputType = showPasswordToggle ? (showPassword ? 'text' : 'password') : type;

    const handleErrorShake = () => {
      if (error) {
        setShakeAnimation('animate-shake');
        setTimeout(() => setShakeAnimation(''), 500);
      }
    };

    const sizeClasses = {
      sm: 'h-9 text-sm px-3',
      md: 'h-11 text-sm px-4',
      lg: 'h-13 text-base px-4'
    };

    const variantClasses = {
      default:
        'bg-background/70 backdrop-blur-sm border border-border/80 shadow-sm dark:border-border dark:bg-background/90',
      outlined: 'bg-transparent border-2 border-border dark:border-border/80',
      filled: 'bg-muted/70 backdrop-blur-sm border border-border/70 shadow-sm dark:bg-muted/50 dark:border-border'
    };

    return (
      <div className='space-y-1.5 w-full'>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'flex items-center gap-1 text-sm font-medium transition-colors',
              error ? 'text-destructive' : 'text-muted-foreground dark:text-foreground/80'
            )}
          >
            {label}
            {error && <span className='text-destructive animate-pulse'>*</span>}
          </label>
        )}

        <div
          className={cn(
            'relative flex items-center transition-all duration-300 rounded-2xl',
            isFocused && 'ring-2 ring-primary/25 ring-offset-1 shadow-lg',
            error && 'ring-2 ring-destructive/25 ring-offset-1',
            shakeAnimation
          )}
        >
          {leadingIcon && (
            <div className='absolute left-4 flex items-center text-muted-foreground/70 z-10 pointer-events-none'>
              {leadingIcon}
            </div>
          )}

          <input
            type={inputType}
            id={inputId}
            style={{
              WebkitTextFillColor: 'var(--foreground)',
              transition: 'background-color 5000s ease-in-out 0s'
            }}
            className={cn(
              'flex w-full rounded-2xl transition-all duration-300',
              variantClasses[variant],
              sizeClasses[size],
              'text-foreground placeholder:text-muted-foreground/60',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-1',
              'focus-visible:border-primary/70 focus-visible:shadow-md',
              'disabled:cursor-not-allowed disabled:opacity-50',
              leadingIcon && 'pl-12',
              (trailingIcon ?? (showPasswordToggle && type === 'password') ?? error) && 'pr-12',
              error
                ? 'border-destructive bg-destructive/5 focus-visible:ring-destructive/30 focus-visible:border-destructive dark:bg-destructive/10'
                : 'hover:border-border hover:shadow-sm dark:hover:border-border/90 dark:hover:bg-background/95',
              className
            )}
            ref={ref}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={ariaDescribedBy}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => {
              handleErrorShake();
              props.onChange?.(e);
            }}
            {...props}
          />

          {(trailingIcon ?? (showPasswordToggle && type === 'password')) && (
            <div className='absolute right-4 flex items-center gap-2'>
              {trailingIcon}
              {showPasswordToggle && type === 'password' && (
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='text-muted-foreground/70 cursor-pointer hover:text-foreground transition-colors p-1 rounded-lg hover:bg-muted/50'
                >
                  {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                </button>
              )}
            </div>
          )}
        </div>

        {(error ?? helpText) && (
          <p
            id={ariaDescribedBy}
            className={cn('text-sm transition-colors', error ? 'text-destructive' : 'text-muted-foreground')}
          >
            {error ?? helpText}
          </p>
        )}
      </div>
    );
  }
);

const PasswordInput = forwardRef<HTMLInputElement, Omit<InputProps, 'type' | 'showPasswordToggle'>>(
  (props, ref: ForwardedRef<HTMLInputElement>) => (
    <Input type='password' showPasswordToggle {...props} ref={ref} />
  )
);

PasswordInput.displayName = 'PasswordInput';
Input.displayName = 'Input';

export { Input, PasswordInput };
