'use client';
import { type FC, type ReactNode } from 'react';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import { cn } from '../cn';

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

type CreateButtonProps = {
  href: string;
  label: string;
  className?: string;
};

// Composant racine
const AdminPageHeaderComponent: FC<AdminPageHeaderProps> = ({ 
  children, 
  className 
}) => {
  return (
    <div className={cn("admin-header", className)}>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};


const AdminPageHeaderSearch: FC<AdminPageHeaderSearchProps> = ({ 
  value, 
  onChange, 
  placeholder = "Rechercher...", 
  isLoading = false,
  className 
}) => (
  <div className={cn("relative w-full", className)}>
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
    {isLoading && (
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
        <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-blue-600 rounded-full" />
      </div>
    )}
  </div>
);



export const AdminPageHeader = Object.assign(AdminPageHeaderComponent, {
  Search: AdminPageHeaderSearch
});
