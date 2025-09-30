'use client';

import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn';

import type { FC, PropsWithChildren } from 'react';

type ListContainerProps = {
  className?: string;
} & PropsWithChildren;

export const ListContainer: FC<ListContainerProps> = ({
  children,
  className,
}) => (
  <div
    className={cn('divide-border/40 dark:divide-border/80 divide-y', className)}
  >
    {children}
  </div>
);
