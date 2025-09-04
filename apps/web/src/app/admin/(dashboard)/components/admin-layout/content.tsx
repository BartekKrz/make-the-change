'use client';
import { type ReactNode } from 'react';
import { cn } from '../cn';

type AdminPageContentProps = {
  children: ReactNode;
  className?: string;
};

export const AdminPageContent = ({ children, className }: AdminPageContentProps) => {
  return (
    <main className={cn("flex-1 overflow-auto", className)}>
      <div className="p-6 pb-8">
        {children}
      </div>
    </main>
  );
};
