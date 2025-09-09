'use client';

import type { FC } from 'react';
import { memo } from 'react';
import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn';
import { ChevronDown } from 'lucide-react';

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

export const FormSelect: FC<FormSelectProps> = memo(({
  value,
  onChange,
  options,
  placeholder = 'Sélectionner...',
  disabled = false,
  className,
  testId = 'form-select'
}) => {
  return (
    <div className="relative">
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={cn(
          'w-full px-3 py-2 bg-background border border-border rounded-lg',
          'text-sm text-foreground placeholder:text-muted-foreground',
          'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'transition-colors duration-200',
          'appearance-none pr-10',
          className
        )}
        data-testid={testId}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <ChevronDown className={cn(
          'w-4 h-4 text-muted-foreground transition-colors',
          disabled ? 'opacity-50' : ''
        )} />
      </div>
    </div>
  );
});

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

export const FormToggle: FC<FormToggleProps> = memo(({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
  className,
  testId = 'form-toggle'
}) => {
  const sizeClasses = {
    sm: 'h-5 w-9',
    md: 'h-6 w-11',
    lg: 'h-7 w-13'
  };

  const thumbSizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5', 
    lg: 'h-6 w-6'
  };

  const translateClasses = {
    sm: checked ? 'translate-x-4' : 'translate-x-0',
    md: checked ? 'translate-x-5' : 'translate-x-0',
    lg: checked ? 'translate-x-6' : 'translate-x-0'
  };

  return (
    <div className={cn('flex items-start gap-3', className)} data-testid={testId}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={cn(
          'relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2',
          sizeClasses[size],
          checked 
            ? 'bg-primary' 
            : 'bg-muted',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none inline-block rounded-full bg-background shadow transform ring-0 transition duration-200 ease-in-out',
            thumbSizeClasses[size],
            translateClasses[size]
          )}
        />
      </button>
      
      {(label || description) && (
        <div className="flex-1 min-w-0">
          {label && (
            <label className="text-sm font-medium text-foreground cursor-pointer">
              {label}
            </label>
          )}
          {description && (
            <p className="text-xs text-muted-foreground mt-1">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
});

export type FormCheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
  testId?: string;
};

export const FormCheckbox: FC<FormCheckboxProps> = memo(({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className,
  testId = 'form-checkbox'
}) => {
  return (
    <div className={cn('flex items-start gap-3', className)} data-testid={testId}>
      <div className="flex items-center h-5">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className={cn(
            'w-4 h-4 text-primary bg-background border-border rounded',
            'focus:ring-2 focus:ring-primary/20 focus:ring-offset-0',
            'transition-colors duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        />
      </div>
      
      {(label || description) && (
        <div className="flex-1 min-w-0">
          {label && (
            <label className="text-sm font-medium text-foreground">
              {label}
            </label>
          )}
          {description && (
            <p className="text-xs text-muted-foreground mt-1">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
});