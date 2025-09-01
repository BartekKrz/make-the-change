'use client';

import { ReactNode } from 'react';

import { Plus } from 'lucide-react';

import { Button } from '@/app/admin/(dashboard)/components/ui/button';

import { useFormContext } from '@/components/form/form-context';

import type { FC } from 'react';

export type FormSubmitButtonProps = {
  children?: ReactNode;
  variant?: 'default' | 'outline' | 'destructive' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  loadingText?: string;
  icon?: ReactNode;
}

export const FormSubmitButton: FC<FormSubmitButtonProps> = ({
  children,
  variant = 'default',
  size = 'default',
  className,
  loadingText = 'Envoi en cours...',
  icon = <Plus className="h-4 w-4" />
}) => {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => [state.isSubmitting, state.canSubmit]}>
      {([isSubmitting, canSubmit]) => (
        <Button
          type="submit"
          variant={variant}
          size={size}
          className={className}
          disabled={!canSubmit || isSubmitting}
          onClick={form.handleSubmit}
        >
          {isSubmitting ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent mr-2" />
              {loadingText}
            </>
          ) : (
            <>
              {icon && <span className="mr-2">{icon}</span>}
              {children}
            </>
          )}
        </Button>
      )}
    </form.Subscribe>
  );
};
