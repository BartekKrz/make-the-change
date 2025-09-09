'use client';

import type { FC, ReactNode } from 'react';
import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn';

export type AdminDetailLayoutProps = {
  children: ReactNode;
  headerContent?: ReactNode;
  sidebar?: ReactNode;
  stickyHeader?: boolean;
  className?: string;
  testId?: string;
};

export const AdminDetailLayout: FC<AdminDetailLayoutProps> = ({
  children,
  headerContent,
  sidebar,
  stickyHeader = true,
  className,
  testId = 'admin-detail-layout'
}) => {
  return (
    <div 
      className={cn(
        'min-h-screen flex flex-col bg-gradient-to-br from-background via-background/95 to-background',
        className
      )}
      data-testid={testId}
    >
      {/* Header Section - Sticky et compact */}
      {headerContent && (
        <div className={cn(
          'sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border/50',
          'shadow-sm'
        )}>
          {headerContent}
        </div>
      )}

      {/* Content Section - Espacement réduit */}
      <div className={cn(
        'flex-1 overflow-y-auto',
        headerContent ? 'py-6' : 'pt-8 pb-6'
      )}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-4 md:space-y-6">
          {sidebar ? (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
              <div className="lg:col-span-3 space-y-6">
                {children}
              </div>
              <div className="lg:col-span-1 space-y-4">
                {sidebar}
              </div>
            </div>
          ) : (
            <div className="w-full">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};