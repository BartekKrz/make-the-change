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
  createViewRenderer
} from '@/components/admin/ViewRenderers';

// ==========================================
// 🏭 COMPOSANTS SPÉCIFIQUES PRODUITS
// ==========================================

const PAGE_SIZE = 18;

// États spécifiques - erreur
type ProductsErrorProps = {
  error: any;
  refetch: () => void;
};

const ProductsErrorState: FC<ProductsErrorProps> = ({ error, refetch }) => (
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

// États spécifiques - vide
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

// Skeleton de chargement
const ProductsLoadingSkeleton: FC = () => (
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

const AdminProductsPageComposable: FC = () => {
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
    limit: PAGE_SIZE,
    search: debouncedSearch || undefined,
    activeOnly: activeOnly || undefined,
    producerId: selectedProducerId,
  }), [debouncedSearch, activeOnly, selectedProducerId]);

  const query = trpc.admin.products.list.useQuery(queryParams);
  const pagination = usePagination(query.data, PAGE_SIZE);
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
        pageSize: PAGE_SIZE,
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
          loadingComponent={<ProductsLoadingSkeleton />}
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
        view={view as any}
        setView={setView as any}
      />
    </>
  );
};

export default AdminProductsPageComposable;
