'use client';

import type { FC, PropsWithChildren } from 'react';

type AdminPageHeaderProps = {
  title?: string;
  description?: string;
  className?: string;
} & PropsWithChildren;

export const AdminPageHeader: FC<AdminPageHeaderProps> = ({
  title,
  description,
  children,
  className = '',
}) => (
  <div
    className={`mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center ${className}`}
  >
    {(title || description) && (
      <div>
        {title && (
          <h1 className="text-foreground text-2xl font-semibold md:text-3xl">
            {title}
          </h1>
        )}
        {description && (
          <p className="text-muted-foreground mt-1 text-sm">{description}</p>
        )}
      </div>
    )}
    {children && (
      <div className="ml-auto flex flex-wrap items-center gap-2">
        {children}
      </div>
    )}
  </div>
);
