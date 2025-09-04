import { type FC, type ReactNode } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/app/admin/(dashboard)/components/ui/button';
import { Input } from '@/app/admin/(dashboard)/components/ui/input';
import { ViewToggle } from '@/app/admin/(dashboard)/components/ui/view-toggle';

// ==========================================
// 🎨 COMPOSANTS COMPOSABLES (UI Flexible)
// ==========================================

/**
 * Header de recherche - Composable et personnalisable
 */
type AdminSearchHeaderProps = {
  search: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  isFetching?: boolean;
  actions?: ReactNode;
  mobileActions?: ReactNode;
};

export const AdminSearchHeader: FC<AdminSearchHeaderProps> = ({
  search,
  onSearchChange,
  placeholder = "Rechercher...",
  isLoading,
  isFetching,
  actions,
  mobileActions
}) => (
  <div className="px-4 md:px-6 py-2.5 md:py-4">
    {/* Mobile Layout */}
    <div className="md:hidden">
      <div className="flex items-center gap-2">
        <Input
          placeholder={placeholder}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1 h-9 bg-background/60 backdrop-blur-sm border-border/50 text-sm"
        />
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {mobileActions}
          {(isLoading || isFetching) && (
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          )}
        </div>
      </div>
    </div>

    {/* Desktop Layout */}
    <div className="hidden md:block space-y-3">
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder={placeholder}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1 max-w-md h-9 bg-background/60 backdrop-blur-sm border-border/50"
        />
        
        <div className="flex items-center gap-3 flex-shrink-0">
          {(isLoading || isFetching) && (
            <span className="text-sm text-muted-foreground flex items-center gap-2 whitespace-nowrap">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              Chargement...
            </span>
          )}
          {actions}
        </div>
      </div>
    </div>
  </div>
);

/**
 * Section de filtres - Composable
 */
type AdminFiltersProps = {
  children: ReactNode;
  className?: string;
};

export const AdminFilters: FC<AdminFiltersProps> = ({ children, className = "" }) => (
  <div className={`flex items-center justify-between gap-4 flex-wrap px-4 md:px-6 pb-4 ${className}`}>
    {children}
  </div>
);

/**
 * Bouton de création - Composable
 */
type CreateButtonProps = {
  href: string;
  label: string;
  icon?: ReactNode;
};

export const CreateButton: FC<CreateButtonProps> = ({ 
  href, 
  label, 
  icon = <Plus className="h-4 w-4" /> 
}) => (
  <Link href={href}>
    <Button 
      size="sm" 
      className="flex items-center gap-2 whitespace-nowrap text-xs px-3 h-8 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
    >
      {icon}
      {label}
    </Button>
  </Link>
);

/**
 * Toggle de vues - Composable et extensible
 */
type AdminViewToggleProps<T extends string> = {
  view: T;
  onViewChange: (view: T) => void;
  availableViews: T[];
};

export const AdminViewToggle = <T extends string>({
  view,
  onViewChange,
  availableViews
}: AdminViewToggleProps<T>) => (
  <ViewToggle
    value={view as any}
    onChange={onViewChange as any}
    availableViews={availableViews as any}
  />
);

/**
 * FAB Mobile - Composable
 */
type MobileFABProps = {
  href: string;
  icon?: ReactNode;
  className?: string;
};

export const MobileFAB: FC<MobileFABProps> = ({ 
  href, 
  icon = <Plus className="h-6 w-6 transition-transform group-hover:rotate-90" />,
  className = "md:hidden"
}) => (
  <Link href={href} className={className}>
    <div className="fixed bottom-6 right-6 z-50 group">
      <Button 
        className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 bg-primary hover:bg-primary/90"
      >
        {icon}
      </Button>
    </div>
  </Link>
);

/**
 * Layout principal - TRÈS composable
 */
type AdminPageLayoutProps = {
  children: ReactNode;
  header?: ReactNode;
  filters?: ReactNode;
  footer?: ReactNode;
  fab?: ReactNode;
  className?: string;
};

export const AdminPageLayout: FC<AdminPageLayoutProps> = ({
  children,
  header,
  filters,
  footer,
  fab,
  className = ""
}) => (
  <div className={`min-h-screen flex flex-col h-screen ${className}`}>
    {/* Header modulaire */}
    {header && (
      <header className="sticky top-0 z-20 backdrop-blur-xl bg-background/95 border-b border-border/50 shadow-lg">
        {header}
        {filters}
      </header>
    )}

    {/* Contenu principal */}
    <main className="flex-1 overflow-auto px-4 md:px-6 py-6">
      {children}
    </main>

    {/* Footer modulaire */}
    {footer && (
      <footer className="sticky bottom-0 z-20 backdrop-blur-xl bg-background/95 border-t border-border/50 shadow-lg">
        <div className="px-4 md:px-6 py-2">
          {footer}
        </div>
      </footer>
    )}

    {/* FAB modulaire */}
    {fab}
  </div>
);

/**
 * Gestionnaire d'états - Très flexible
 */
type AdminDataStatesProps<T> = {
  isLoading: boolean;
  isError: boolean;
  error: any;
  isEmpty: boolean;
  refetch: () => void;
  resetFilters: () => void;
  loadingComponent: ReactNode;
  errorComponent: ReactNode;
  emptyComponent: ReactNode;
  children: ReactNode;
};

export const AdminDataStates = <T,>({
  isLoading,
  isError,
  error,
  isEmpty,
  refetch,
  resetFilters,
  loadingComponent,
  errorComponent,
  emptyComponent,
  children
}: AdminDataStatesProps<T>) => {
  if (isError) return <>{errorComponent}</>;
  if (isLoading) return <>{loadingComponent}</>;
  if (isEmpty) return <>{emptyComponent}</>;
  return <>{children}</>;
};
