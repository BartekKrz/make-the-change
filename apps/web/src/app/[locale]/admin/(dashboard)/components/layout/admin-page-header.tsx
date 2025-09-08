'use client'

import type { FC, PropsWithChildren } from 'react'

type AdminPageHeaderProps = {
  title?: string
  description?: string
  className?: string
} & PropsWithChildren

export const AdminPageHeader: FC<AdminPageHeaderProps> = ({
  title,
  description,
  children,
  className = ''
}) => (
  <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 ${className}`}>
    {(title || description) && (
      <div>
        {title && <h1 className="text-2xl md:text-3xl font-semibold text-foreground">{title}</h1>}
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
    )}
    {children && (
      <div className="flex items-center gap-2 flex-wrap ml-auto">
        {children}
      </div>
    )}
  </div>
)
