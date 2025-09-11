'use client';
import { cn } from '../cn';

import type { FC, PropsWithChildren } from 'react';

type AdminPageContentProps = {
  className?: string;
};

export const AdminPageContent: FC<PropsWithChildren & AdminPageContentProps> = ({ children, className }) => (
  <main className={cn("admin-content", className)}>
    <div className="p-6 pb-8 pt-40 md:pt-52">
      {children}
    </div>
  </main>
);
