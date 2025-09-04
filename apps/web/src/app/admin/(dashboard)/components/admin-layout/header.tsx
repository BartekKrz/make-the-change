'use client';
import { FC, type ReactNode } from 'react';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import { ViewToggle, type ViewMode } from '../ui/view-toggle';
import { FilterButton } from './filter-modal';


type CreateButtonConfig = {
  href: string;
  label: string;
};

type AdminPageHeaderProps = {
  children?: ReactNode;
  searchPlaceholder?: string;
  search: string;
  onSearchChange: (value: string) => void;
  isLoading?: boolean;
  isFetching?: boolean;
  createButton?: CreateButtonConfig;
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
  availableViews?: ViewMode[];
  showMobileFilters?: boolean;
  onOpenFilterModal?: () => void; 
};

export const AdminPageHeader: FC<AdminPageHeaderProps> = ({
  children,
  searchPlaceholder = "Rechercher...",
  search,
  onSearchChange,
  isLoading,
  isFetching,
  createButton,
  view,
  onViewChange,
  availableViews = ['grid', 'list'],
  showMobileFilters = true,
  onOpenFilterModal
}) => (
  <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
    <div className="p-6">
      <div className="flex flex-col gap-4">
        {/* Version mobile */}
        <div className="md:hidden">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {(isLoading || isFetching) && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-blue-600 rounded-full" />
                </div>
              )}
            </div>
              
            {/* Bouton de filtres automatique en mobile */}
            {showMobileFilters && onOpenFilterModal && (
              <FilterButton onClick={onOpenFilterModal} />
            )}
          </div>
        </div>

        {/* Version desktop */}
        <div className="hidden md:block">
          {/* Titre et actions principales */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex-1">
              {children}
            </div>
              
            {createButton && (
              <Link
                href={createButton.href}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                {createButton.label}
              </Link>
            )}
          </div>

          {/* Barre de recherche et contrôles */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {(isLoading || isFetching) && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-blue-600 rounded-full" />
                </div>
              )}
            </div>

            {/* Vue toggle */}
            <ViewToggle
              value={view}
              onChange={onViewChange}
              availableViews={availableViews}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);
