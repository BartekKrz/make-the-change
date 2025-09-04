'use client';
import type { FC, PropsWithChildren } from 'react';
import { cn } from '../cn';

type AdminPageContentProps = {
  className?: string;
};

export const AdminPageContent: FC<PropsWithChildren & AdminPageContentProps> = ({ children, className }) => (
  <main className={cn("flex-1 overflow-auto", className)}>
    <div className="p-6 pb-8">
      {children}
    </div>
  </main>
);
