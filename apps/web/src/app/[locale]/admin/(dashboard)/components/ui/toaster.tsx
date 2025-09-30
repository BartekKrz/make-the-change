'use client';

import {
  ToastWithIcon,
  ToastClose,
  ToastDescription,
  ToastTitle,
} from '@/app/[locale]/admin/(dashboard)/components/ui/toast';
import { useToast } from '@/hooks/use-toast';

export const Toaster = () => {
  const { toasts } = useToast();

  return (
    <>
      {toasts.map(({ id, title, description, action, ...props }) => {
        return (
          <ToastWithIcon key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </ToastWithIcon>
        );
      })}
    </>
  );
};
