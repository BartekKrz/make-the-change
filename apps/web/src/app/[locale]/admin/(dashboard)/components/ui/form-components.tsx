'use client';

import { ChevronDown } from 'lucide-react';
import { memo } from 'react';

import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn';

import type { FC } from 'react';

export type FormSelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type FormSelectProps = {
  value?: string;
  onChange: (value: string) => void;
  options: FormSelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  testId?: string;
};

export const FormSelect: FC<FormSelectProps> = memo(
  ({
    value,
    onChange,
    options,
    placeholder = 'Sélectionner...',
    disabled = false,
    className,
    testId = 'form-select',
  }) => {
    return (
      <div className="relative">
        <select
          data-testid={testId}
          disabled={disabled}
          value={value || ''}
          className={cn(
            'bg-background border-border w-full rounded-lg border px-3 py-2',
            'text-foreground placeholder:text-muted-foreground text-sm',
            'focus:ring-primary/20 focus:border-primary focus:ring-2 focus:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'transition-colors duration-200',
            'appearance-none pr-10',
            className
          )}
          onChange={e => onChange(e.target.value)}
        >
          {placeholder && (
            <option disabled value="">
              {placeholder}
            </option>
          )}
          {options.map(option => (
            <option
              key={option.value}
              disabled={option.disabled}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronDown
            className={cn(
              'text-muted-foreground h-4 w-4 transition-colors',
              disabled ? 'opacity-50' : ''
            )}
          />
        </div>
      </div>
    );
  }
);

export type FormToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  testId?: string;
};

export const FormToggle: FC<FormToggleProps> = memo(
  ({
    checked,
    onChange,
    label,
    description,
    disabled = false,
    size = 'md',
    className,
    testId = 'form-toggle',
  }) => {
    const sizeClasses = {
      sm: 'h-5 w-9',
      md: 'h-6 w-11',
      lg: 'h-7 w-13',
    };

    const thumbSizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    };

    const translateClasses = {
      sm: checked ? 'translate-x-4' : 'translate-x-0',
      md: checked ? 'translate-x-5' : 'translate-x-0',
      lg: checked ? 'translate-x-6' : 'translate-x-0',
    };

    return (
      <div
        className={cn('flex items-start gap-3', className)}
        data-testid={testId}
      >
        <button
          aria-checked={checked}
          disabled={disabled}
          role="switch"
          type="button"
          className={cn(
            'focus:ring-primary/20 relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-offset-2 focus:outline-none',
            sizeClasses[size],
            checked ? 'bg-primary' : 'bg-muted',
            disabled && 'cursor-not-allowed opacity-50'
          )}
          onClick={() => !disabled && onChange(!checked)}
        >
          <span
            aria-hidden="true"
            className={cn(
              'bg-background pointer-events-none inline-block transform rounded-full shadow ring-0 transition duration-200 ease-in-out',
              thumbSizeClasses[size],
              translateClasses[size]
            )}
          />
        </button>

        {(label || description) && (
          <div className="min-w-0 flex-1">
            {label && (
              <label className="text-foreground cursor-pointer text-sm font-medium">
                {label}
              </label>
            )}
            {description && (
              <p className="text-muted-foreground mt-1 text-xs">
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

export type FormCheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
  testId?: string;
};

export const FormCheckbox: FC<FormCheckboxProps> = memo(
  ({
    checked,
    onChange,
    label,
    description,
    disabled = false,
    className,
    testId = 'form-checkbox',
  }) => {
    return (
      <div
        className={cn('flex items-start gap-3', className)}
        data-testid={testId}
      >
        <div className="flex h-5 items-center">
          <input
            checked={checked}
            disabled={disabled}
            type="checkbox"
            className={cn(
              'text-primary bg-background border-border h-4 w-4 rounded',
              'focus:ring-primary/20 focus:ring-2 focus:ring-offset-0',
              'transition-colors duration-200',
              'disabled:cursor-not-allowed disabled:opacity-50'
            )}
            onChange={e => onChange(e.target.checked)}
          />
        </div>

        {(label || description) && (
          <div className="min-w-0 flex-1">
            {label && (
              <label className="text-foreground text-sm font-medium">
                {label}
              </label>
            )}
            {description && (
              <p className="text-muted-foreground mt-1 text-xs">
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);
