'use client';
import { type FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Package, Star, Zap } from 'lucide-react';
import { AdminPageLayout, Filters, FilterModal } from '@/app/admin/(dashboard)/components/admin-layout';
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
import { EmptyState } from '@/app/admin/(dashboard)/components/ui/empty-state';

const pageSize = 18;

type ProductProps = {
  product: any;
  view: 'grid' | 'list';
  queryParams: {
    cursor?: string;
    search?: string;
    activeOnly?: boolean;
    producerId?: string;
    limit: number;
  };
};

const Product = ({ product, view, queryParams }: ProductProps) => {
  const pendingRequest = useRef<NodeJS.Timeout | null>(null);
  const utils = trpc.useUtils();
  
  const updateProduct = trpc.admin.products.update.useMutation({
    onMutate: async ({ id, patch }) => {
      await utils.admin.products.list.cancel();
      const previousData = utils.admin.products.list.getData(queryParams);

      if (previousData?.items) {
        const updatedData = {
          ...previousData,
          items: previousData.items.map(product => 
            product.id === id ? { ...product, ...patch } : product
          )
        };
        utils.admin.products.list.setData(queryParams, updatedData);
      }
      return { previousData, queryKey: queryParams };
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

    const currentData = utils.admin.products.list.getData(queryParams);
    
    if (currentData?.items) {
      const optimisticData = {
        ...currentData,
        items: currentData.items.map(p => 
          p.id === product.id ? { ...p, ...patch } : p
        )
      };
      utils.admin.products.list.setData(queryParams, optimisticData);
    }

    pendingRequest.current = setTimeout(() => {
      updateProduct.mutate({ id: product.id, patch });
      pendingRequest.current = null;
    }, delay);
  }, [product.id, updateProduct, utils, queryParams]);

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

 const ProductsPage: FC = () => {
  const [search, setSearch] = useState('');
  const [activeOnly, setActiveOnly] = useState(false);
  const [selectedProducerId, setSelectedProducerId] = useState<string | undefined>();
  const [cursor, setCursor] = useState<string | undefined>();
  const [view, setView] = useState<ViewMode>('grid');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);  
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  
  const queryParams = useMemo(() => ({
    cursor,
    search: debouncedSearch || undefined,
    activeOnly: activeOnly || undefined,
    producerId: selectedProducerId,
    limit: pageSize,
  }), [cursor, debouncedSearch, activeOnly, selectedProducerId]);

  const { data: producers } = trpc.admin.products.producers.useQuery();
  const { 
    data: productsData,
    isLoading, 
    isFetching,
    isError,
    error,
    refetch 
  } = trpc.admin.products.list.useQuery(queryParams);

  const products = productsData?.items || [];
  const totalProducts = productsData?.total || 0;
  const totalPages = Math.ceil(totalProducts / pageSize);

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
        onOpenFilterModal={() => setIsFilterModalOpen(true)}
      >
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
          <EmptyState
            variant="muted"
            icon={Package}
            title="Erreur de chargement"
            description={error?.message || 'Impossible de charger les produits'}
            action={
              <Button size="sm" variant="outline" onClick={() => refetch()}>
                Réessayer
              </Button>
            }
          />
        ) : isLoading ? (
          view === 'grid' ? (
            <DataList
              items={[]}
              isLoading={true}
              gridCols={3}
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
          <EmptyState
            icon={Package}
            title="Aucun produit"
            description="Aucun résultat pour ces filtres."
            action={
              <Button size="sm" variant="outline" onClick={resetFilters}>
                Réinitialiser
              </Button>
            }
          />
        ) : view === 'grid' ? (
          <DataList
            items={products}
            isLoading={false}
            gridCols={3}
            emptyState={{ title: 'Aucun produit', description: '', action: null }}
            renderItem={(product) => (
              <Product 
                key={product.id} 
                product={product} 
                view="grid" 
                queryParams={queryParams}
              />
            )}
          />
        ) : (
          <ListContainer>
            {products.map((product) => (
              <Product 
                key={product.id} 
                product={product} 
                view="list" 
                queryParams={queryParams}
              />
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

   
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      >
        <Filters>
          <Filters.View
            view={view}
            onViewChange={setView}
          />
          
          <Filters.Selection
            items={producers || []}
            selectedId={selectedProducerId}
            onSelectionChange={setSelectedProducerId}
            label="Partenaire"
            allLabel="Tous les partenaires"
          />
          
          <Filters.Toggle
            checked={activeOnly}
            onCheckedChange={setActiveOnly}
            label="Afficher uniquement les éléments actifs"
          />
        </Filters>
      </FilterModal>
    </AdminPageLayout>
  );
};

export default ProductsPage;