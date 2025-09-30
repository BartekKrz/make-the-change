'use client';

import Link from 'next/link';

import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn';

import type { ReactNode, MouseEvent, FC } from 'react';

type AdminListItemProps = {
  href: string;
  header: ReactNode;
  metadata: ReactNode;
  actions?: ReactNode;
  className?: string;
};

export const AdminListItem: FC<AdminListItemProps> = ({
  href,
  header,
  metadata,
  actions,
  className,
}) => {
  const handleActionClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      className={cn(
        'group relative cursor-pointer',
        '[margin:calc(var(--density-spacing-md)*-1)] [padding:var(--density-spacing-md)]',
        'transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]',
        '[border-radius:var(--radius-surface)] border border-transparent',
        'md:hover:from-primary/5 md:hover:via-background/20 md:hover:bg-gradient-to-r md:hover:to-orange-500/5',
        'md:hover:shadow-primary/10 md:hover:border-primary/20 md:hover:shadow-lg',
        'md:hover:-translate-y-0.5 md:hover:scale-[1.005]',
        'active:from-primary/4 active:via-background/15 active:bg-gradient-to-r active:to-orange-500/4',
        'active:shadow-primary/8 active:border-primary/15 active:shadow-md',
        'active:translate-y-0 active:scale-[0.998]',
        'backdrop-blur-sm',
        className
      )}
    >
      {}
      <Link
        aria-label="Accéder aux détails"
        className="absolute inset-0 z-10 block"
        href={href}
        tabIndex={0}
      />

      <div className="pointer-events-none relative z-20 flex items-center justify-between">
        <div className="min-w-0 flex-1">
          {}
          <div className="[margin-bottom:var(--density-spacing-sm)]">
            {header}
          </div>

          {}
          <div className="text-muted-foreground md:group-hover:text-foreground/90 space-y-2 text-sm transition-colors duration-300">
            {metadata}
          </div>

          {}
          {actions && (
            <div
              className="border-border/20 pointer-events-auto relative z-30 [margin-top:var(--density-spacing-md)] border-t [padding-top:var(--density-spacing-sm)]"
              onClick={handleActionClick}
            >
              {actions}
            </div>
          )}
        </div>

        {}
        <div className="ml-4 flex-shrink-0 transition-all duration-300 group-active:translate-x-0.5 group-active:scale-105 md:group-hover:translate-x-1 md:group-hover:scale-110">
          <div className="relative">
            {}
            <div className="bg-primary/10 absolute inset-0 scale-150 [border-radius:var(--radius-pill)] opacity-0 transition-opacity duration-300 md:group-hover:opacity-100" />
            <svg
              className="relative z-10 drop-shadow-sm"
              fill="none"
              height="20"
              viewBox="0 0 24 24"
              width="20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id={`chevronGradient-${href.replaceAll(/\W/g, '')}`}
                  x1="0%"
                  x2="100%"
                  y1="0%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
              <path
                className="opacity-50 transition-all duration-300 group-active:opacity-70 md:group-hover:opacity-100"
                d="m9 18 6-6-6-6"
                stroke={`url(#chevronGradient-${href.replaceAll(/\W/g, '')})`}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>
      </div>

      {}
      <div className="pointer-events-none absolute inset-0 [border-radius:var(--radius-surface)] bg-gradient-to-r from-transparent via-white/3 to-transparent opacity-0 transition-opacity duration-300 md:group-hover:opacity-100" />

      {}
      <div className="ring-primary/20 pointer-events-none absolute inset-0 [border-radius:var(--radius-surface)] opacity-0 ring-2 ring-offset-2 transition-opacity duration-200 group-focus-within:opacity-100" />
    </div>
  );
};
