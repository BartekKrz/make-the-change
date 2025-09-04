'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Package, Star, Zap } from 'lucide-react';
import { AdminPageLayout, GenericFilters } from '@/app/admin/(dashboard)/components/admin-layout';
import { type ViewMode } from '@/app/admin/(dashboard)/components/ui/view-toggle';
import { DataCard, DataList } from '@/app/admin/(dashboard)/components/ui/data-list';
import { ListContainer } from '@/app/admin/(dashboard)/components/ui/list-container';
import { ProductListItem } from '@/app/admin/(dashboard)/components/products/product-list-item';
import { Badge } from '@/app/admin/(dashboard)/components/badge';
import { Button } from '@/app/admin/(dashboard)/components/ui/button';
import { CheckboxWithLabel } from '@/app/admin/(dashboard)/components/ui/checkbox';
import { AdminPagination } from '@/app/admin/(dashboard)/components/layout/admin-pagination';
import { trpc } from '@/lib/trpc';
import { getMainProductImage } from '@/components/ProductImage';

const pageSize = 18;

type ProductProps = {
  product: any;
  view: 'grid' | 'list';
  createQueryKey: () => any;
};

const Product = ({ product, view, createQueryKey }: ProductProps) => {
  const pendingRequest = useRef<NodeJS.Timeout | null>(null);
  const utils = trpc.useUtils();
  
  const updateProduct = trpc.admin.products.update.useMutation({
    onMutate: async ({ id, patch }) => {
      await utils.admin.products.list.cancel();
      const queryKey = createQueryKey();
      const previousData = utils.admin.products.list.getData(queryKey);

      if (previousData?.items) {
        const updatedData = {
          ...previousData,
          items: previousData.items.map(product => 
            product.id === id ? { ...product, ...patch } : product
          )
        };
        utils.admin.products.list.setData(queryKey, updatedData);
      }
      return { previousData, queryKey };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousData && context.queryKey) {
        utils.admin.products.list.setData(context.queryKey, context.previousData);
      }
    },
  });
  
  const debouncedMutation = useCallback((patch: any, delay = 500) => {
    if (pendingRequest.current) {
      clearTimeout(pendingRequest.current);
    }

    const queryKey = createQueryKey();
    const currentData = utils.admin.products.list.getData(queryKey);
    
    if (currentData?.items) {
      const optimisticData = {
        ...currentData,
        items: currentData.items.map(p => 
          p.id === product.id ? { ...p, ...patch } : p
        )
      };
      utils.admin.products.list.setData(queryKey, optimisticData);
    }

    pendingRequest.current = setTimeout(() => {
      updateProduct.mutate({ id: product.id, patch });
      pendingRequest.current = null;
    }, delay);
  }, [product.id, updateProduct, utils, createQueryKey]);

  const adjustStock = useCallback((delta: number) => {
    const currentStock = product.stock_quantity || 0;
    const newStock = Math.max(0, currentStock + delta);
    if (newStock === currentStock) return;
    debouncedMutation({ stock_quantity: newStock });
  }, [product.stock_quantity, debouncedMutation]);

  const toggleFeature = useCallback(() => {
    const newFeatured = !product.featured;
    debouncedMutation({ featured: newFeatured }, 300);
  }, [product.featured, debouncedMutation]);

  const toggleActive = useCallback(() => {
    const newActive = !product.is_active;
    debouncedMutation({ is_active: newActive }, 300);
  }, [product.is_active, debouncedMutation]);

  const actions = (
    <div className="flex items-center gap-1 md:gap-2 flex-wrap">
      <Button size="sm" variant="outline" className="text-xs px-2 h-8" 
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustStock(1); }}>
        +1
      </Button>
      <Button size="sm" variant="outline" className="text-xs px-2 h-8"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustStock(-1); }}>
        -1
      </Button>
      <Button size="sm" variant="outline" className="text-xs px-2 h-8"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFeature(); }}>
        {product.featured ? '★' : '☆'}
      </Button>
      <Button size="sm" variant="outline" className="text-xs px-2 h-8"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleActive(); }}>
        {product.is_active ? 'Off' : 'On'}
      </Button>
    </div>
  );

  if (view === 'grid') {
    const mainImage = getMainProductImage(product.images);
    
    return (
      <DataCard href={`/admin/products/${product.id}`}>
        <DataCard.Header>
          <DataCard.Title icon={Package} image={mainImage} imageAlt={product.name} images={product.images}>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium">{product.name}</span>
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
          </div>
        </DataCard.Content>
        <DataCard.Footer>{actions}</DataCard.Footer>
      </DataCard>
    );
  }

  return <ProductListItem key={product.id} product={product} actions={actions} />;
};

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [activeOnly, setActiveOnly] = useState(false);
  const [selectedProducerId, setSelectedProducerId] = useState<string | undefined>();
  const [cursor, setCursor] = useState<string | undefined>();
  const [view, setView] = useState<ViewMode>('grid');
  
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: producers } = trpc.admin.products.producers.useQuery();
  const { 
    data: productsData,
    isLoading, 
    isFetching,
    isError,
    error,
    refetch 
  } = trpc.admin.products.list.useQuery({
    cursor,
    limit: pageSize,
    search: debouncedSearch || undefined,
    activeOnly: activeOnly || undefined,
    producerId: selectedProducerId,
  });

  const products = useMemo(() => productsData?.items || [], [productsData?.items]);
  const totalProducts = productsData?.total || 0;
  const totalPages = Math.ceil(totalProducts / pageSize);

  const createQueryKey = useCallback(() => ({
    cursor,
    limit: pageSize,
    search: debouncedSearch || undefined,
    activeOnly: activeOnly || undefined,
    producerId: selectedProducerId,
  }), [cursor, debouncedSearch, activeOnly, selectedProducerId]);

  const resetFilters = useCallback(() => {
    setSearch(''); 
    setActiveOnly(false); 
    setSelectedProducerId(undefined); 
    setCursor(undefined); 
    refetch();
  }, [refetch]);

  return (
    <AdminPageLayout>
      <AdminPageLayout.Header
        search={search}
        onSearchChange={setSearch}
        isLoading={isLoading}
        isFetching={isFetching}
        searchPlaceholder="Rechercher des produits..."
        createButton={{ href: '/admin/products/new', label: 'Nouveau produit' }}
        view={view}
        onViewChange={setView}
        showMobileFilters={true}
      >
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Produits</h1>
          <span className="text-sm text-gray-500">
            {products.length} produit{products.length > 1 ? 's' : ''}
          </span>
        </div>

        {/* Filtres desktop */}
        <div className="hidden md:flex items-center gap-3 flex-wrap mt-4">
          <Button
            size="sm"
            variant={selectedProducerId === undefined ? "default" : "outline"}
            onClick={() => setSelectedProducerId(undefined)}
          >
            Tous
          </Button>
          {producers?.map((producer) => (
            <Button
              key={producer.id}
              size="sm"
              variant={selectedProducerId === producer.id ? "default" : "outline"}
              onClick={() => setSelectedProducerId(producer.id)}
            >
              {producer.name}
            </Button>
          ))}
          <CheckboxWithLabel
            checked={activeOnly}
            onCheckedChange={(v) => setActiveOnly(Boolean(v))}
            label="Actifs uniquement"
          />
        </div>
      </AdminPageLayout.Header>

      <AdminPageLayout.Content>
        {isError ? (
          <div className="text-center py-12">
            <div className="p-4 bg-red-50 text-red-800 rounded-lg mb-4 max-w-md mx-auto">
              <h3 className="font-medium mb-2">Erreur de chargement</h3>
              <p className="text-sm mb-3">{error?.message || 'Impossible de charger les produits'}</p>
              <Button size="sm" variant="outline" onClick={() => refetch()}>Réessayer</Button>
            </div>
          </div>
        ) : isLoading ? (
          view === 'grid' ? (
            <DataList
              items={[]}
              isLoading={true}
              gridCols={3}
              emptyState={{ title: 'Chargement...', description: '', action: null }}
              renderItem={() => null}
            />
          ) : (
            <ListContainer>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded animate-pulse" />
              ))}
            </ListContainer>
          )
        ) : products.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun produit</h3>
            <p className="text-muted-foreground mb-4">Aucun résultat pour ces filtres.</p>
            <Button size="sm" variant="outline" onClick={resetFilters}>Réinitialiser</Button>
          </div>
        ) : view === 'grid' ? (
          <DataList
            items={products}
            isLoading={false}
            gridCols={3}
            emptyState={{ title: 'Aucun produit', description: '', action: null }}
            renderItem={(product) => (
              <Product key={product.id} product={product} view="grid" createQueryKey={createQueryKey} />
            )}
          />
        ) : (
          <ListContainer>
            {products.map((product) => (
              <Product key={product.id} product={product} view="list" createQueryKey={createQueryKey} />
            ))}
          </ListContainer>
        )}

        {totalProducts > pageSize && (
          <div className="mt-6">
            <AdminPagination
              pagination={{
                currentPage: Math.max(1, Math.floor((totalProducts - products.length) / pageSize) + 1),
                pageSize,
                totalItems: totalProducts,
                totalPages
              }}
            />
          </div>
        )}
      </AdminPageLayout.Content>

      {/* Modal de filtres automatique - simplifié ! */}
      <AdminPageLayout.FilterModal>
        <GenericFilters
          view={view}
          onViewChange={setView}
          producers={producers || []}
          selectedProducerId={selectedProducerId}
          onProducerChange={setSelectedProducerId}
          activeOnly={activeOnly}
          onActiveOnlyChange={setActiveOnly}
        />
      </AdminPageLayout.FilterModal>
    </AdminPageLayout>
  );
}
