'use client';

import { Plus } from 'lucide-react';
import { type ReactNode                                     , FC } from 'react';


import { useFormContext } from '@/components/form/form-context';
import { Button } from '@/components/ui/button';



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
          className={className}
          disabled={!canSubmit || isSubmitting}
          size={size}
          type="submit"
          variant={variant}
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
