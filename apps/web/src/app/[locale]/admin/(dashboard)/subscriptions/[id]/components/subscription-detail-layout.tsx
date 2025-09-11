'use client';

import type { FC, ReactNode } from 'react';

type SubscriptionDetailLayoutProps = {
  breadcrumbs?: ReactNode;
  header: ReactNode;
  content: ReactNode;
  sidebar?: ReactNode;
  className?: string;
};

export const SubscriptionDetailLayout: FC<SubscriptionDetailLayoutProps> = ({
  breadcrumbs,
  header,
  content,
  sidebar,
  className = ''
}) => {
  return (
    <div className={`h-screen relative bg-gradient-to-br from-background via-background/95 to-background ${className}`}>
      {}
      <div className='absolute top-0 left-0 right-0 z-40'>
        <div
          className='backdrop-blur-[20px] border-b border-border shadow-2xl'
          style={{
            background: 'var(--filters-bg)',
            boxShadow: 'var(--elevation-filters)'
          }}
        >
          {breadcrumbs}
          {header}

          {}
          <div className='hidden md:block px-8 pb-4' />
        </div>
      </div>

      {}
      <div className='h-full overflow-y-auto pt-48 sm:pt-48 md:pt-64 lg:pt-56 pb-20 md:pb-8'>
        <div className='max-w-7xl mx-auto px-4 md:px-8 space-y-4 md:space-y-6'>
          {sidebar ? (
            <div className='grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8'>
              <div className='lg:col-span-3'>{content}</div>
              <div className='lg:col-span-1'>{sidebar}</div>
            </div>
          ) : (
            <div className='w-full'>{content}</div>
          )}
        </div>
      </div>
    </div>
  );
};
