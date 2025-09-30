'use client';
import { Search } from 'lucide-react';

import { cn } from '../cn';

import type { FC, ReactNode } from 'react';

// Types pour les sous-composants
type AdminPageHeaderProps = {
  children: ReactNode;
  className?: string;
};

type AdminPageHeaderSearchProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  className?: string;
};

// Composant racine
const AdminPageHeaderComponent: FC<AdminPageHeaderProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn('admin-header', className)}>
      <div className="p-6">{children}</div>
    </div>
  );
};

const AdminPageHeaderSearch: FC<AdminPageHeaderSearchProps> = ({
  value,
  onChange,
  placeholder = 'Rechercher...',
  isLoading = false,
  className,
}) => (
  <div className={cn('relative w-full', className)}>
    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
    <input
      className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-blue-500"
      placeholder={placeholder}
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
    />
    {isLoading && (
      <div className="absolute top-1/2 right-3 -translate-y-1/2 transform">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
      </div>
    )}
  </div>
);

export const AdminPageHeader = Object.assign(AdminPageHeaderComponent, {
  Search: AdminPageHeaderSearch,
});
