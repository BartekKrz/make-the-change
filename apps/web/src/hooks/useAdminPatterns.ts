// ==========================================
// 🎯 HOOKS COMPOSABLES (Extraction des patterns)
// ==========================================

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { ViewMode } from '@/app/admin/(dashboard)/components/ui/view-toggle';

/**
 * Hook pour la recherche avec debounce - Réutilisable partout
 */
export const useSearchDebounce = (delay: number = 300) => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), delay);
    return () => clearTimeout(timer);
  }, [search, delay]);

  const resetSearch = useCallback(() => setSearch(''), []);

  return {
    search,
    setSearch,
    debouncedSearch,
    resetSearch
  };
};

/**
 * Hook pour la pagination - Réutilisable et flexible
 */
export const usePagination = (data: any, pageSize: number) => {
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  
  const items = useMemo(() => data?.items || [], [data?.items]);
  const totalItems = data?.total || 0;
  const currentPage = Math.max(1, Math.floor((totalItems - items.length) / pageSize) + 1);
  const totalPages = Math.ceil(totalItems / pageSize);

  const resetPagination = useCallback(() => setCursor(undefined), []);

  return {
    cursor,
    setCursor,
    items,
    totalItems,
    currentPage,
    totalPages,
    hasMore: totalItems > pageSize,
    resetPagination
  };
};

/**
 * Hook pour les vues - COMPOSABLE et extensible
 */
type ViewConfig<T extends string = ViewMode> = {
  defaultView?: T;
  availableViews?: T[];
};

export const useViewToggle = <T extends string = ViewMode>(
  config: ViewConfig<T> = {}
) => {
  const { 
    defaultView = 'grid' as T, 
    availableViews = ['grid', 'list'] as T[] 
  } = config;
  
  const [view, setView] = useState<T>(defaultView);

  // Fonction pour vérifier si une vue est disponible
  const isViewAvailable = useCallback((viewToCheck: T) => 
    availableViews.includes(viewToCheck), [availableViews]);

  return {
    view,
    setView,
    availableViews,
    isViewAvailable
  };
};

/**
 * Hook pour les états de données - Pattern complet
 */
export const useDataStates = <T>(
  query: {
    data: any;
    isLoading: boolean;
    isError: boolean;
    error: any;
    refetch: () => void;
  },
  pagination: ReturnType<typeof usePagination>
) => {
  const resetAllFilters = useCallback(() => {
    pagination.resetPagination();
    query.refetch();
  }, [pagination, query]);

  return {
    ...query,
    items: pagination.items,
    resetAllFilters,
    isEmpty: !query.isLoading && !query.isError && pagination.items.length === 0
  };
};
