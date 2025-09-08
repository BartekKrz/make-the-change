'use client'

import type { FC, PropsWithChildren } from 'react'
import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn'

type ListContainerProps = {
  className?: string
} & PropsWithChildren

export const ListContainer: FC<ListContainerProps> = ({ children, className }) => (
  <div className={cn(
    'divide-y divide-border/40 dark:divide-border/80',
    className
  )}>
    {children}
  </div>
)
