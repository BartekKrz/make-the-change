'use client'

import type { ReactNode, FC } from 'react'
import { cn } from '@/app/admin/(dashboard)/components/cn'

type ListContainerProps = {
  children: ReactNode
  className?: string
}

export const ListContainer: FC<ListContainerProps> = ({ children, className }) => {
  return (
    <div className={cn(
      'divide-y divide-border/40 dark:divide-border/80',
      className
    )}>
      {children}
    </div>
  )
}
