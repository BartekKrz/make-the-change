'use client'

import type { FC, PropsWithChildren } from 'react'

type AdminPageContainerProps = {
  className?: string
} & PropsWithChildren

export const AdminPageContainer: FC<AdminPageContainerProps> = ({
  children,
  className = ''
}) => (
  <div className={`h-full overflow-auto px-4 md:px-6 py-4 md:py-6 safe-bottom ${className}`}>
    {children}
  </div>
)
