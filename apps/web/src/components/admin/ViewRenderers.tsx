import { type ReactNode } from 'react';
import { DataList } from '@/app/admin/(dashboard)/components/ui/data-list';
import { ListContainer } from '@/app/admin/(dashboard)/components/ui/list-container';

// ==========================================
// 🎯 RENDERERS COMPOSABLES (Pour différentes vues)
// ==========================================

/**
 * Renderer pour vue grid - Flexible et réutilisable
 */
type GridRendererProps<T> = {
  items: T[];
  renderItem: (item: T) => ReactNode;
  gridCols?: 1 | 2 | 3 | 4;
  spacing?: 'sm' | 'md' | 'lg';
  emptyState?: {
    title: string;
    description?: string;
    action?: ReactNode;
  };
  className?: string;
};

export const GridRenderer = <T,>({
  items,
  renderItem,
  gridCols = 3,
  spacing = 'md',
  emptyState,
  className
}: GridRendererProps<T>) => (
  <DataList
    items={items}
    renderItem={renderItem}
    gridCols={gridCols}
    spacing={spacing}
    emptyState={emptyState}
    className={className}
  />
);

/**
 * Renderer pour vue list - Simple et efficace
 */
type ListRendererProps<T> = {
  items: T[];
  renderItem: (item: T) => ReactNode;
  className?: string;
};

export const ListRenderer = <T,>({
  items,
  renderItem,
  className
}: ListRendererProps<T>) => (
  <ListContainer className={className}>
    {items.map(renderItem)}
  </ListContainer>
);

/**
 * Renderer pour vue map - Extensible pour les projets
 */
type MapRendererProps<T> = {
  items: T[];
  renderMapItem?: (item: T) => ReactNode;
  mapComponent?: ReactNode;
  className?: string;
};

export const MapRenderer = <T,>({
  items,
  renderMapItem,
  mapComponent,
  className = ""
}: MapRendererProps<T>) => (
  <div className={`w-full h-full ${className}`}>
    {mapComponent || (
      <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
        <p className="text-muted-foreground">Carte à implémenter</p>
      </div>
    )}
  </div>
);

/**
 * Renderer de vues COMPOSABLE - Le composant ultime !
 */
type ViewRenderer<T> = (items: T[]) => ReactNode;

type MultiViewRendererProps<T, V extends string> = {
  view: V;
  items: T[];
  renderers: Partial<Record<V, ViewRenderer<T>>>;
  fallbackRenderer?: ViewRenderer<T>;
};

export const MultiViewRenderer = <T, V extends string>({
  view,
  items,
  renderers,
  fallbackRenderer
}: MultiViewRendererProps<T, V>) => {
  const renderer = renderers[view] || fallbackRenderer;
  
  if (!renderer) {
    console.warn(`No renderer found for view: ${view}`);
    return <div>Vue non supportée: {view}</div>;
  }

  return <>{renderer(items)}</>;
};

/**
 * Factory pour créer des renderers personnalisés
 */
export const createViewRenderer = <T, V extends string>(
  config: Record<V, ViewRenderer<T>>
) => {
  return (view: V, items: T[]) => {
    const renderer = config[view];
    return renderer ? renderer(items) : null;
  };
};
