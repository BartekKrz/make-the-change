'use client';

import type { FC, PropsWithChildren } from 'react';

type AdminPageContainerProps = {
  className?: string;
} & PropsWithChildren;

export const AdminPageContainer: FC<AdminPageContainerProps> = ({
  children,
  className = '',
}) => (
  <div
    className={`safe-bottom h-full overflow-auto px-4 py-4 md:px-6 md:py-6 ${className}`}
  >
    {children}
  </div>
);
