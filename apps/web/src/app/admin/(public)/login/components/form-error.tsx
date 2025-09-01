import type { FC } from 'react'
import { AlertCircle } from 'lucide-react'

type FormErrorProps = { message: string }

export const FormError: FC<FormErrorProps> = ({ message }) => (
  <div
    className={`
      text-destructive text-sm font-medium p-4 mt-6
      bg-destructive/5 dark:bg-destructive/10 backdrop-blur-sm
      rounded-2xl border border-destructive/20 dark:border-destructive/30
      flex items-center gap-3 shadow-sm
    `}
    role='alert'
  >
    <AlertCircle size={16} className='shrink-0' aria-hidden='true' />
    <span className='leading-relaxed'>{message}</span>
  </div>
)
