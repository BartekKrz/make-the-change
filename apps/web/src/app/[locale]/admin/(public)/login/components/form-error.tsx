import { AlertCircle } from 'lucide-react';

import type { FC } from 'react';

type FormErrorProps = { message: string };

export const FormError: FC<FormErrorProps> = ({ message }) => {
  return (
    <div
      className="text-destructive bg-destructive/5 dark:bg-destructive/10 border-destructive/20 dark:border-destructive/30 mt-6 flex items-center gap-3 rounded-2xl border p-4 text-sm font-medium shadow-sm backdrop-blur-sm"
      role="alert"
    >
      <AlertCircle aria-hidden="true" className="shrink-0" size={16} />
      <span className="leading-relaxed">{message}</span>
    </div>
  );
};
