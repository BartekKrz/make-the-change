import type { ReactNode } from 'react';
import type { ViewMode } from '../ui/view-toggle';

// 🎯 Types principaux pour les layouts admin
export type CreateButtonConfig = {
  href: string;
  label: string;
};

export type AdminPageLayoutProps = {
  children: ReactNode;
};

export type AdminPageHeaderProps = {
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
  mobileFilters?: ReactNode;
};

export type AdminPageContentProps = {
  children: ReactNode;
  className?: string;
};

export type AdminPageFooterProps = {
  children?: ReactNode;
};

// 🔄 Types pour DataList composable
export type AdminPageDataListProps<T> = {
  items: T[];
  view: ViewMode;
  isLoading: boolean;
  isError: boolean;
  error?: any;
  onRefetch: () => void;
  onResetFilters: () => void;
  skeletonComponent: React.ComponentType<{ view: 'grid' | 'list' }>;
  emptyComponent: React.ComponentType<{ resetFilters: () => void }>;
  errorComponent: React.ComponentType<{ error: any; refetch: () => void }>;
  gridRender: (item: T) => ReactNode;
  listRender: (item: T) => ReactNode;
  gridProps?: {
    gridCols?: 1 | 2 | 3 | 4;
    spacing?: 'sm' | 'md' | 'lg';
    emptyState?: {
      title: string;
      description?: string;
      action?: ReactNode;
    };
  };
};
