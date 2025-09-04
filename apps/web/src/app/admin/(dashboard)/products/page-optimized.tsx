'use client';
import { type FC, useCallback, useMemo, useState } from 'react';
import { Box, Package, Star, Zap, Filter } from 'lucide-react';
import { DataCard } from '@/app/admin/(dashboard)/components/ui/data-list';
import { ProductListItem } from '@/app/admin/(dashboard)/components/products/product-list-item';
import { Badge } from '@/app/admin/(dashboard)/components/badge';
import { Button } from '@/app/admin/(dashboard)/components/ui/button';
import { CheckboxWithLabel } from '@/app/admin/(dashboard)/components/ui/checkbox';
import { AdminPagination } from '@/app/admin/(dashboard)/components/layout/admin-pagination';
import { ProductFilterModal } from './components/product-filter-modal';
import { trpc } from '@/lib/trpc';
import { getMainProductImage } from '@/components/ProductImage';

// 🎯 Hooks composables
import { useSearchDebounce, usePagination, useViewToggle, useDataStates } from '@/hooks/useAdminPatterns';

// 🎨 Composants composables
import {
  AdminPageLayout,
  AdminSearchHeader,
  AdminFilters,
  CreateButton,
  AdminViewToggle,
  MobileFAB,
  AdminDataStates
} from '@/components/admin/AdminComponents';

// 🔄 Renderers de vues
import {
  GridRenderer,
  ListRenderer,
  MultiViewRenderer,
  createViewRenderer
} from '@/components/admin/ViewRenderers';

// ==========================================
// � COMPOSANTS SPÉCIFIQUES PRODUITS
// ==========================================

const pageSize = 18;

// États spécifiques
type ProductsErrorStateProps = {
  error: any;
  refetch: () => void;
};

const ProductsErrorState: FC<ProductsErrorStateProps> = ({ error, refetch }) => (
  <div className="text-center py-12">
    <div className="p-4 bg-red-50 text-red-800 rounded-lg mb-4 max-w-md mx-auto">
      <h3 className="font-medium mb-2">Erreur de chargement</h3>
      <p className="text-sm mb-3">
        {error?.message || 'Impossible de charger les produits'}
      </p>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={() => refetch()}
        className="text-xs px-2 h-8 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
      >
        Réessayer
      </Button>
    </div>
  </div>
);

const ProductsEmptyState: FC<{ resetFilters: () => void }> = ({ resetFilters }) => (
  <div className="text-center py-8">
    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
    <h3 className="text-lg font-medium text-foreground mb-2">Aucun produit</h3>
    <p className="text-muted-foreground mb-4">Aucun résultat pour ces filtres.</p>
    <Button 
      size="sm" 
      variant="outline" 
      onClick={resetFilters}
      className="text-xs px-2 h-8 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
    >
      Réinitialiser
    </Button>
  </div>
);

const ProductListSkeleton: FC = () => (
  <div className="group relative py-3 px-3 -mx-3 md:py-4 md:px-4 md:-mx-4 border border-transparent rounded-lg">
    <div className="relative min-h-[76px] md:min-h-[80px] px-1 py-1">
      <div className="mb-1.5 md:mb-2">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-7 h-7 md:w-8 md:h-8 bg-gray-200 animate-pulse rounded-full flex-shrink-0" />
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-32 h-4 bg-gray-200 animate-pulse rounded" />
            <div className="w-20 h-3 bg-gray-200 animate-pulse rounded" />
            <div className="w-12 h-5 bg-gray-200 animate-pulse rounded-full" />
            <div className="w-4 h-4 bg-gray-200 animate-pulse rounded" />
          </div>
        </div>
      </div>
      <div className="space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 animate-pulse rounded" />
            <div className="w-12 h-3 bg-gray-200 animate-pulse rounded" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 animate-pulse rounded" />
            <div className="w-16 h-3 bg-gray-200 animate-pulse rounded" />
          </div>
        </div>
      </div>
      <div className="relative z-10 mt-3 pt-2 border-t border-border/20">
        <div className="flex items-center gap-1 md:gap-2 flex-wrap">
          <div className="flex items-center gap-1">
            <div className="w-8 h-6 bg-gray-200 animate-pulse rounded" />
            <div className="w-8 h-6 bg-gray-200 animate-pulse rounded" />
          </div>
          <div className="flex items-center gap-1">
            <div className="w-16 h-6 bg-gray-200 animate-pulse rounded" />
            <div className="w-16 h-6 bg-gray-200 animate-pulse rounded" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ProductsListSkeleton: FC = () => (
  <GridRenderer
    items={Array.from({ length: 6 })}
    renderItem={() => <div className="h-64 bg-gray-200 animate-pulse rounded-2xl" />}
    gridCols={3}
    emptyState={{
      title: 'Chargement...',
      description: 'Chargement des produits en cours.'
    }}
  />
);

// ==========================================
// 🎯 COMPOSANT PRINCIPAL (Version Composable)
// ==========================================

const AdminProductsPage: FC = () => {
  // 🔧 Hooks composables
  const { search, setSearch, debouncedSearch, resetSearch } = useSearchDebounce();
  const { view, setView, availableViews } = useViewToggle({
    defaultView: 'grid' as const,
    availableViews: ['grid', 'list'] as const
  });
  
  // 🎛️ États spécifiques aux produits
  const [activeOnly, setActiveOnly] = useState(false);
  const [selectedProducerId, setSelectedProducerId] = useState<string | undefined>(undefined);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  
  // 📊 Queries
  const { 
    data: producers, 
    isLoading: isLoadingProducers,
    isError: isErrorProducers,
    error: producersError 
  } = trpc.admin.products.producers.useQuery();

  const queryParams = useMemo(() => ({
    limit: pageSize,
    search: debouncedSearch || undefined,
    activeOnly: activeOnly || undefined,
    producerId: selectedProducerId,
  }), [debouncedSearch, activeOnly, selectedProducerId]);

  const query = trpc.admin.products.list.useQuery(queryParams);
  const pagination = usePagination(query.data, pageSize);
  const dataStates = useDataStates(query, pagination);
  
  // ⚡ Reset complet des filtres
  const resetAllFilters = useCallback(() => {
    resetSearch();
    setActiveOnly(false);
    setSelectedProducerId(undefined);
    dataStates.resetAllFilters();
  }, [resetSearch, dataStates]);

  // 🎨 Renderers pour chaque vue
  const renderProductGrid = useCallback((product: any) => {
    const mainImage = getMainProductImage(product.images);
    
    return (
      <DataCard key={product.id} href={`/admin/products/${product.id}`}>
        <DataCard.Header>
          <DataCard.Title
            icon={Package}
            image={mainImage}
            imageAlt={product.name}
            images={product.images}
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium">{product.name}</span>
              <span className="font-mono text-xs text-muted-foreground">{product.slug}</span>
              <Badge color={product.is_active ? 'green' : 'red'}>
                {product.is_active ? 'actif' : 'inactif'}
              </Badge>
              {product.featured && <Star className="w-4 h-4 text-yellow-500" />}
            </div>
          </DataCard.Title>
        </DataCard.Header>
        <DataCard.Content>
          <div className="flex items-center gap-4 flex-wrap text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <Zap className="w-3.5 h-3.5" />
              <span>{product.price_points} pts</span>
            </div>
            <div className="flex items-center gap-3">
              <Box className="w-3.5 h-3.5" />
              <span>Stock: {product.stock_quantity ?? 0}</span>
            </div>
            {product.producer && (
              <div className="flex items-center gap-3">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {product.producer.name}
                </span>
              </div>
            )}
          </div>
        </DataCard.Content>
        <DataCard.Footer>
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <Button size="sm" variant="outline" className="text-xs px-2 h-6">+1</Button>
            <Button size="sm" variant="outline" className="text-xs px-2 h-6">-1</Button>
            <Button size="sm" variant="outline" className="text-xs px-2 h-6">
              {product.featured ? '★' : '☆'}
            </Button>
            <Button size="sm" variant="outline" className="text-xs px-2 h-6">
              {product.is_active ? 'Off' : 'On'}
            </Button>
          </div>
        </DataCard.Footer>
      </DataCard>
    );
  }, []);

  const renderProductList = useCallback((product: any) => (
    <ProductListItem
      key={product.id}
      product={product}
      actions={
        <div className="flex items-center gap-1">
          <Button size="sm" variant="outline" className="text-xs px-2 h-6">+1</Button>
          <Button size="sm" variant="outline" className="text-xs px-2 h-6">-1</Button>
          <Button size="sm" variant="outline" className="text-xs px-2 h-6">★</Button>
          <Button size="sm" variant="outline" className="text-xs px-2 h-6">On/Off</Button>
        </div>
      }
    />
  ), []);

  // 🔄 Configuration des renderers par vue
  const viewRenderers = createViewRenderer({
    grid: (items: any[]) => (
      <GridRenderer
        items={items}
        renderItem={renderProductGrid}
        gridCols={3}
        emptyState={{
          title: 'Aucun produit',
          description: 'Aucun résultat pour ces filtres.'
        }}
      />
    ),
    list: (items: any[]) => (
      <ListRenderer
        items={items}
        renderItem={renderProductList}
      />
    )
  });

  // 🎛️ Composants UI modulaires
  const searchHeader = (
    <AdminSearchHeader
      search={search}
      onSearchChange={setSearch}
      placeholder="Rechercher des produits..."
      isLoading={query.isLoading}
      isFetching={query.isFetching}
      actions={
        <>
          <CreateButton
            href="/admin/products/new"
            label="Nouveau produit"
          />
          <AdminViewToggle
            view={view}
            onViewChange={setView}
            availableViews={availableViews}
          />
        </>
      }
      mobileActions={
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsFilterModalOpen(true)}
          className="h-9 w-9 p-0 relative focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
        >
          <Filter className="h-4 w-4" />
          {(selectedProducerId || activeOnly) && (
            <div className="w-2 h-2 bg-primary rounded-full ml-1" />
          )}
        </Button>
      }
    />
  );

  const filters = (
    <AdminFilters>
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            variant={selectedProducerId === undefined ? "default" : "outline"}
            onClick={() => setSelectedProducerId(undefined)}
            className="h-8 px-3 text-sm font-medium focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
          >
            Tous
          </Button>
          
          {isLoadingProducers ? (
            <>
              <div className="h-8 w-20 bg-gray-200 animate-pulse rounded" />
              <div className="h-8 w-24 bg-gray-200 animate-pulse rounded" />
              <div className="h-8 w-16 bg-gray-200 animate-pulse rounded" />
            </>
          ) : isErrorProducers ? (
            <div className="text-xs text-red-600 px-2 py-1 bg-red-50 rounded">
              Erreur producteurs: {producersError?.message || 'Chargement échoué'}
            </div>
          ) : (
            producers?.map((producer) => (
              <Button
                key={producer.id}
                size="sm"
                variant={selectedProducerId === producer.id ? "default" : "outline"}
                onClick={() => setSelectedProducerId(producer.id)}
                className="h-8 px-3 text-sm font-medium whitespace-nowrap focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
              >
                {producer.name}
              </Button>
            ))
          )}
        </div>
      </div>
      
      <CheckboxWithLabel
        checked={activeOnly}
        onCheckedChange={(v) => setActiveOnly(Boolean(v))}
        label="Actifs uniquement"
        className="text-sm whitespace-nowrap flex-shrink-0"
      />
    </AdminFilters>
  );

  const paginationComponent = pagination.hasMore ? (
    <AdminPagination
      pagination={{
        currentPage: pagination.currentPage,
        pageSize,
        totalItems: pagination.totalItems,
        totalPages: pagination.totalPages
      }}
    />
  ) : undefined;

  const fab = (
    <MobileFAB href="/admin/products/new" />
  );

  // 🎯 Render principal avec composition
  return (
    <>
      <AdminPageLayout
        header={searchHeader}
        filters={filters}
        footer={paginationComponent}
        fab={fab}
      >
        <AdminDataStates
          isLoading={query.isLoading}
          isError={query.isError}
          error={query.error}
          isEmpty={dataStates.isEmpty}
          refetch={query.refetch}
          resetFilters={resetAllFilters}
          loadingComponent={<ProductsListSkeleton />}
          errorComponent={<ProductsErrorState error={query.error} refetch={query.refetch} />}
          emptyComponent={<ProductsEmptyState resetFilters={resetAllFilters} />}
        >
          {viewRenderers(view, pagination.items)}
        </AdminDataStates>
      </AdminPageLayout>

      {/* 🎛️ Modal de filtres */}
      <ProductFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        producers={producers || []}
        selectedProducerId={selectedProducerId}
        setSelectedProducerId={setSelectedProducerId}
        activeOnly={activeOnly}
        setActiveOnly={setActiveOnly}
        view={view}
        setView={setView}
      />
    </>
  );
};

export default AdminProductsPage;

// ==========================================
// 🎨 COMPOSANTS RÉUTILISABLES (UI Patterns)
// ==========================================

/**
 * Layout standard pour les pages admin avec filtres
 */
type AdminPageLayoutProps = {
  title?: string;
  searchPlaceholder?: string;
  search: string;
  onSearchChange: (value: string) => void;
  isLoading?: boolean;
  isFetching?: boolean;
  createButton?: {
    href: string;
    label: string;
  };
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
  filters?: React.ReactNode;
  mobileFilters?: React.ReactNode;
  children: React.ReactNode;
  pagination?: React.ReactNode;
};

const AdminPageLayout: FC<AdminPageLayoutProps> = ({
  searchPlaceholder = "Rechercher...",
  search,
  onSearchChange,
  isLoading,
  isFetching,
  createButton,
  view,
  onViewChange,
  filters,
  mobileFilters,
  children,
  pagination
}) => (
  <div className="min-h-screen flex flex-col h-screen">
    {/* 📱 Header avec filtres */}
    <header className="sticky top-0 z-20 backdrop-blur-xl bg-background/95 border-b border-border/50 shadow-lg">
      <div className="px-4 md:px-6 py-2.5 md:py-4">
        
        {/* Mobile Layout */}
        <div className="md:hidden">
          <div className="flex items-center gap-2">
            <Input
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="flex-1 h-9 bg-background/60 backdrop-blur-sm border-border/50 text-sm"
            />
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {mobileFilters}
              {(isLoading || isFetching) && (
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              )}
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block space-y-3">
          {/* Première ligne: Recherche + Actions */}
          <div className="flex items-center justify-between gap-4">
            <Input
              placeholder={searchPlaceholder}
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
              
              {createButton && (
                <Link href={createButton.href}>
                  <Button 
                    size="sm" 
                    className="flex items-center gap-2 whitespace-nowrap text-xs px-3 h-8 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
                  >
                    <Plus className="h-4 w-4" />
                    {createButton.label}
                  </Button>
                </Link>
              )}
              
              <ViewToggle
                value={view}
                onChange={onViewChange}
                availableViews={['grid', 'list']}
              />
            </div>
          </div>
          
          {/* Deuxième ligne: Filtres */}
          {filters && (
            <div className="flex items-center justify-between gap-4 flex-wrap">
              {filters}
            </div>
          )}
        </div>
      </div>
    </header>

    {/* 📋 Contenu principal */}
    <main className="flex-1 overflow-auto px-4 md:px-6 py-6">
      {children}
    </main>

    {/* 📊 Pagination */}
    {pagination && (
      <footer className="sticky bottom-0 z-20 backdrop-blur-xl bg-background/95 border-t border-border/50 shadow-lg">
        <div className="px-4 md:px-6 py-2">
          {pagination}
        </div>
      </footer>
    )}

    {/* 🎯 FAB Mobile */}
    {createButton && (
      <Link href={createButton.href} className="md:hidden">
        <div className="fixed bottom-6 right-6 z-50 group">
          <Button 
            className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 bg-primary hover:bg-primary/90"
          >
            <Plus className="h-6 w-6 transition-transform group-hover:rotate-90" />
          </Button>
        </div>
      </Link>
    )}
  </div>
);

/**
 * States standards pour les listes admin
 */
type AdminDataStatesProps<T> = {
  isLoading: boolean;
  isError: boolean;
  error: any;
  items: T[];
  refetch: () => void;
  resetFilters: () => void;
  skeletonComponent: React.ComponentType<{ view: 'grid' | 'list' }>;
  emptyComponent: React.ComponentType<{ resetFilters: () => void }>;
  errorComponent: React.ComponentType<{ error: any; refetch: () => void }>;
  view: 'grid' | 'list';
  children: React.ReactNode;
};

const AdminDataStates = <T,>({
  isLoading,
  isError,
  error,
  items,
  refetch,
  resetFilters,
  skeletonComponent: SkeletonComponent,
  emptyComponent: EmptyComponent,
  errorComponent: ErrorComponent,
  view,
  children
}: AdminDataStatesProps<T>) => {
  if (isError) {
    return <ErrorComponent error={error} refetch={refetch} />;
  }
  
  if (isLoading) {
    return <SkeletonComponent view={view} />;
  }
  
  if (items.length === 0) {
    return <EmptyComponent resetFilters={resetFilters} />;
  }

  return <>{children}</>;
};

// ==========================================
// 🏭 COMPOSANTS SPÉCIFIQUES PRODUITS
// ==========================================

const pageSize = 18;

type ProductsErrorStateProps = {
  error: any;
  refetch: () => void;
};

const ProductsErrorState: FC<ProductsErrorStateProps> = ({ error, refetch }) => (
  <div className="text-center py-12">
    <div className="p-4 bg-red-50 text-red-800 rounded-lg mb-4 max-w-md mx-auto">
      <h3 className="font-medium mb-2">Erreur de chargement</h3>
      <p className="text-sm mb-3">
        {error?.message || 'Impossible de charger les produits'}
      </p>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={() => refetch()}
        className="text-xs px-2 h-8 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
      >
        Réessayer
      </Button>
    </div>
  </div>
);

type ProductsEmptyStateProps = {
  resetFilters: () => void;
};

const ProductsEmptyState: FC<ProductsEmptyStateProps> = ({ resetFilters }) => (
  <div className="text-center py-8">
    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
    <h3 className="text-lg font-medium text-foreground mb-2">Aucun produit</h3>
    <p className="text-muted-foreground mb-4">Aucun résultat pour ces filtres.</p>
    <Button 
      size="sm" 
      variant="outline" 
      onClick={resetFilters}
      className="text-xs px-2 h-8 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
    >
      Réinitialiser
    </Button>
  </div>
);

const ProductListSkeleton: FC = () => (
  <div className="group relative py-3 px-3 -mx-3 md:py-4 md:px-4 md:-mx-4 border border-transparent rounded-lg">
    <div className="relative min-h-[76px] md:min-h-[80px] px-1 py-1">
      <div className="mb-1.5 md:mb-2">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-7 h-7 md:w-8 md:h-8 bg-gray-200 animate-pulse rounded-full flex-shrink-0" />
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-32 h-4 bg-gray-200 animate-pulse rounded" />
            <div className="w-20 h-3 bg-gray-200 animate-pulse rounded" />
            <div className="w-12 h-5 bg-gray-200 animate-pulse rounded-full" />
            <div className="w-4 h-4 bg-gray-200 animate-pulse rounded" />
          </div>
        </div>
      </div>
      <div className="space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 animate-pulse rounded" />
            <div className="w-12 h-3 bg-gray-200 animate-pulse rounded" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 animate-pulse rounded" />
            <div className="w-16 h-3 bg-gray-200 animate-pulse rounded" />
          </div>
        </div>
      </div>
      <div className="relative z-10 mt-3 pt-2 border-t border-border/20">
        <div className="flex items-center gap-1 md:gap-2 flex-wrap">
          <div className="flex items-center gap-1">
            <div className="w-8 h-6 bg-gray-200 animate-pulse rounded" />
            <div className="w-8 h-6 bg-gray-200 animate-pulse rounded" />
          </div>
          <div className="flex items-center gap-1">
            <div className="w-16 h-6 bg-gray-200 animate-pulse rounded" />
            <div className="w-16 h-6 bg-gray-200 animate-pulse rounded" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

type ProductsListSkeletonProps = {
  view: 'grid' | 'list';
};

const ProductsListSkeleton: FC<ProductsListSkeletonProps> = ({ view }) => {
  return view === 'grid' ? (
    <DataList
      items={[]}
      isLoading={true}
      gridCols={3}
      emptyState={{
        title: 'Aucun produit',
        description: 'Aucun résultat pour ces filtres.',
        action: null
      }}
      renderItem={() => null}
    />
  ) : (
    <ListContainer>
      {Array.from({ length: 6 }).map((_, i) => (
        <ProductListSkeleton key={i} />
      ))}
    </ListContainer>
  );
};

// ==========================================
// 🎯 COMPOSANT PRINCIPAL (Version optimisée)
// ==========================================

const AdminProductsPage: FC = () => {
  // 🔧 Hooks réutilisables
  const { search, setSearch, debouncedSearch } = useAdminFilters();
  const { view, setView, renderWithView } = useAdminViews();
  
  // 🎛️ États spécifiques aux produits
  const [activeOnly, setActiveOnly] = useState(false);
  const [selectedProducerId, setSelectedProducerId] = useState<string | undefined>(undefined);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  
  // 📊 Queries
  const { 
    data: producers, 
    isLoading: isLoadingProducers,
    isError: isErrorProducers,
    error: producersError 
  } = trpc.admin.products.producers.useQuery();

  const queryParams = useMemo(() => ({
    limit: pageSize,
    search: debouncedSearch || undefined,
    activeOnly: activeOnly || undefined,
    producerId: selectedProducerId,
  }), [debouncedSearch, activeOnly, selectedProducerId]);

  const { 
    data: productsData,
    isLoading, 
    isFetching,
    isError: isErrorProducts,
    error: productsError,
    refetch 
  } = trpc.admin.products.list.useQuery(queryParams);

  // 📄 Pagination
  const pagination = useAdminPagination(productsData, pageSize);
  
  // ⚡ Callbacks
  const resetFilters = useCallback(() => {
    setSearch(''); 
    setActiveOnly(false); 
    setSelectedProducerId(undefined); 
    pagination.setCursor(undefined);
    refetch();
  }, [refetch, setSearch, pagination]);

  const createQueryKey = useCallback(() => queryParams, [queryParams]);

  // 🎨 Render functions pour les vues
  const renderProductGrid = useCallback((product: any) => {
    const mainImage = getMainProductImage(product.images);
    
    return (
      <DataCard key={product.id} href={`/admin/products/${product.id}`}>
        <DataCard.Header>
          <DataCard.Title
            icon={Package}
            image={mainImage}
            imageAlt={product.name}
            images={product.images}
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium">{product.name}</span>
              <span className="font-mono text-xs text-muted-foreground">{product.slug}</span>
              <Badge color={product.is_active ? 'green' : 'red'}>
                {product.is_active ? 'actif' : 'inactif'}
              </Badge>
              {product.featured && <Star className="w-4 h-4 text-yellow-500" />}
            </div>
          </DataCard.Title>
        </DataCard.Header>
        <DataCard.Content>
          <div className="flex items-center gap-4 flex-wrap text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <Zap className="w-3.5 h-3.5" />
              <span>{product.price_points} pts</span>
            </div>
            <div className="flex items-center gap-3">
              <Box className="w-3.5 h-3.5" />
              <span>Stock: {product.stock_quantity ?? 0}</span>
            </div>
            {product.producer && (
              <div className="flex items-center gap-3">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {product.producer.name}
                </span>
              </div>
            )}
          </div>
        </DataCard.Content>
        <DataCard.Footer>
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <Button size="sm" variant="outline" className="text-xs px-2 h-6">+1</Button>
            <Button size="sm" variant="outline" className="text-xs px-2 h-6">-1</Button>
            <Button size="sm" variant="outline" className="text-xs px-2 h-6">
              {product.featured ? '★' : '☆'}
            </Button>
            <Button size="sm" variant="outline" className="text-xs px-2 h-6">
              {product.is_active ? 'Off' : 'On'}
            </Button>
          </div>
        </DataCard.Footer>
      </DataCard>
    );
  }, []);

  const renderProductList = useCallback((product: any) => (
    <ProductListItem
      key={product.id}
      product={product}
      actions={
        <div className="flex items-center gap-1">
          <Button size="sm" variant="outline" className="text-xs px-2 h-6">+1</Button>
          <Button size="sm" variant="outline" className="text-xs px-2 h-6">-1</Button>
          <Button size="sm" variant="outline" className="text-xs px-2 h-6">★</Button>
          <Button size="sm" variant="outline" className="text-xs px-2 h-6">On/Off</Button>
        </div>
      }
    />
  ), []);

  // 🎛️ Filtres UI
  const filters = (
    <>
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            variant={selectedProducerId === undefined ? "default" : "outline"}
            onClick={() => setSelectedProducerId(undefined)}
            className="h-8 px-3 text-sm font-medium focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
          >
            Tous
          </Button>
          
          {isLoadingProducers ? (
            <>
              <div className="h-8 w-20 bg-gray-200 animate-pulse rounded" />
              <div className="h-8 w-24 bg-gray-200 animate-pulse rounded" />
              <div className="h-8 w-16 bg-gray-200 animate-pulse rounded" />
            </>
          ) : isErrorProducers ? (
            <div className="text-xs text-red-600 px-2 py-1 bg-red-50 rounded">
              Erreur producteurs: {producersError?.message || 'Chargement échoué'}
            </div>
          ) : (
            producers?.map((producer) => (
              <Button
                key={producer.id}
                size="sm"
                variant={selectedProducerId === producer.id ? "default" : "outline"}
                onClick={() => setSelectedProducerId(producer.id)}
                className="h-8 px-3 text-sm font-medium whitespace-nowrap focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
              >
                {producer.name}
              </Button>
            ))
          )}
        </div>
      </div>
      
      <CheckboxWithLabel
        checked={activeOnly}
        onCheckedChange={(v) => setActiveOnly(Boolean(v))}
        label="Actifs uniquement"
        className="text-sm whitespace-nowrap flex-shrink-0"
      />
    </>
  );

  const mobileFilters = (
    <Button
      size="sm"
      variant="outline"
      onClick={() => setIsFilterModalOpen(true)}
      className="h-9 w-9 p-0 relative focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
    >
      <Filter className="h-4 w-4" />
      {(selectedProducerId || activeOnly) && (
        <div className="w-2 h-2 bg-primary rounded-full ml-1" />
      )}
    </Button>
  );

  // 🎯 Render principal
  return (
    <>
      <AdminPageLayout
        searchPlaceholder="Rechercher des produits..."
        search={search}
        onSearchChange={setSearch}
        isLoading={isLoading}
        isFetching={isFetching}
        createButton={{
          href: "/admin/products/new",
          label: "Nouveau produit"
        }}
        view={view}
        onViewChange={setView}
        filters={filters}
        mobileFilters={mobileFilters}
        pagination={
          pagination.hasMore ? (
            <AdminPagination
              pagination={{
                currentPage: pagination.currentPage,
                pageSize,
                totalItems: pagination.totalItems,
                totalPages: pagination.totalPages
              }}
            />
          ) : undefined
        }
      >
        <AdminDataStates
          isLoading={isLoading}
          isError={isErrorProducts}
          error={productsError}
          items={pagination.items}
          refetch={refetch}
          resetFilters={resetFilters}
          skeletonComponent={ProductsListSkeleton}
          emptyComponent={ProductsEmptyState}
          errorComponent={ProductsErrorState}
          view={view as 'grid' | 'list'}
        >
          {renderWithView(
            pagination.items,
            renderProductGrid,
            renderProductList,
            {
              emptyState: {
                title: 'Aucun produit',
                description: 'Aucun résultat pour ces filtres.',
                action: null
              }
            }
          )}
        </AdminDataStates>
      </AdminPageLayout>

      {/* 🎛️ Modal de filtres */}
      <ProductFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        producers={producers || []}
        selectedProducerId={selectedProducerId}
        setSelectedProducerId={setSelectedProducerId}
        activeOnly={activeOnly}
        setActiveOnly={setActiveOnly}
        view={view}
        setView={setView}
      />
    </>
  );
};

export default AdminProductsPage;
