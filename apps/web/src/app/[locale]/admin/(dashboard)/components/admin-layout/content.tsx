'use client';
import type { FC, PropsWithChildren } from 'react';
import { cn } from '../cn';

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
