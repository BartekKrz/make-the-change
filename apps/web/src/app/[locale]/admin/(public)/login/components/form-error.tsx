import { AlertCircle } from 'lucide-react'

import type { FC } from 'react'

type FormErrorProps = { message: string }

export const FormError: FC<FormErrorProps> = ({ message }) => {
  
  return (
    <div
      role='alert'
      className={`
        text-destructive text-sm font-medium p-4 mt-6
        bg-destructive/5 dark:bg-destructive/10 backdrop-blur-sm
        rounded-2xl border border-destructive/20 dark:border-destructive/30
        flex items-center gap-3 shadow-sm
      `}
    >
      <AlertCircle aria-hidden='true' className='shrink-0' size={16} />
      <span className='leading-relaxed'>{message}</span>
    </div>
  );
}
