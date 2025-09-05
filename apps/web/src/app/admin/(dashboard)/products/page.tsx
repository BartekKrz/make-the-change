'use client';
import { type FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Package, Star, Zap } from 'lucide-react';
import { AdminPageLayout, Filters, FilterModal } from '@/app/admin/(dashboard)/components/admin-layout';
import { type ViewMode } from '@/app/admin/(dashboard)/components/ui/view-toggle';
import { DataCard, DataList, DataListItem } from '@/app/admin/(dashboard)/components/ui/data-list';
import { Badge } from '@/app/admin/(dashboard)/components/badge';
import { Button } from '@/app/admin/(dashboard)/components/ui/button';
import { CheckboxWithLabel } from '@/app/admin/(dashboard)/components/ui/checkbox';
import { SimpleSelect } from '@/app/admin/(dashboard)/components/ui/select';
import { AdminPagination } from '@/app/admin/(dashboard)/components/layout/admin-pagination';
import { trpc } from '@/lib/trpc';
import { EmptyState } from '@/app/admin/(dashboard)/components/ui/empty-state';
import { ProductListHeader } from '../components/products/product-list-header';
import { ProductListMetadata } from '../components/products/product-list-metadata';
import { ProductCardSkeleton, ProductListSkeleton } from './components/product-card';

const pageSize = 18;


type ProductProps = {
  product: any;
  view: 'grid' | 'list';
  queryParams: {
    cursor?: string;
    search?: string;
    activeOnly?: boolean;
    producerId?: string;
    categoryId?: string;
    limit: number;
  };
};

const Product: FC<ProductProps> = ({ product, view, queryParams }) => {
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
      <Button size="sm" variant="outline" className="control-button" 
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustStock(1); }}>
        +1
      </Button>
      <Button size="sm" variant="outline" className="control-button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustStock(-1); }}>
        -1
      </Button>
      <Button size="sm" variant="outline" className="control-button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFeature(); }}>
        {product.featured ? '★' : '☆'}
      </Button>
      <Button size="sm" variant="outline" className="control-button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleActive(); }}>
        {product.is_active ? 'Off' : 'On'}
      </Button>
    </div>
  );

  if (view === 'grid') return (
    <DataCard href={`/admin/products/${product.id}`}>
      <DataCard.Header>
        <DataCard.Title icon={Package} image={product.images[0]} imageAlt={product.name} images={product.images}>
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
          
        <div className="flex flex-wrap gap-2 mt-2">
          {product.category && (
            <Badge color="green">
              {product.category.name}
            </Badge>
          )}
          {product.secondary_category && (
            <Badge color="gray">
              {product.secondary_category.name}
            </Badge>
          )}
          {product.producer && (
            <Badge color="blue">
              {product.producer.name}
            </Badge>
          )}
          {product.partner_source && (
            <Badge color="yellow">
              {product.partner_source}
            </Badge>
          )}
            
        </div>
      </DataCard.Content>
      <DataCard.Footer>{actions}</DataCard.Footer>
    </DataCard>
  );

  return (
    <DataListItem href={`/admin/products/${product.id}`}>
      <DataListItem.Header>
        <ProductListHeader product={product} />
      </DataListItem.Header>
      <DataListItem.Content>
        <ProductListMetadata product={product} />
      </DataListItem.Content>
      <DataListItem.Actions>
        {actions}
      </DataListItem.Actions>
    </DataListItem>
  );
};

 const ProductsPage: FC = () => {
  const [search, setSearch] = useState('');
  const [activeOnly, setActiveOnly] = useState(false);
  const [selectedProducerId, setSelectedProducerId] = useState<string | undefined>();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>();
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
    producerId: selectedProducerId === 'all' ? undefined : selectedProducerId,
    categoryId: selectedCategoryId === 'all' ? undefined : selectedCategoryId,
    limit: pageSize,
  }), [cursor, debouncedSearch, activeOnly, selectedProducerId, selectedCategoryId]);

  const { data: producers } = trpc.admin.products.producers.useQuery();
  const { data: categories } = trpc.admin.categories.list.useQuery({ activeOnly: true });
  const { 
    data: productsData,
    isLoading, 
    isFetching,
    isError,
    error,
    refetch 
  } = trpc.admin.products.list.useQuery(queryParams);

  const products = useMemo(() => productsData?.items || [], [productsData?.items]);
  const totalProducts = productsData?.total || 0;
  const totalPages = Math.ceil(totalProducts / pageSize);

  
  const producerOptions = useMemo(() => [
    { value: 'all', label: 'Tous les partenaires' },
    ...(producers?.map(p => ({ value: p.id, label: p.name })) || [])
  ], [producers]);

  const categoryOptions = useMemo(() => [
    { value: 'all', label: 'Toutes les catégories' },
    ...(categories?.filter(cat => !cat.parent_id).map(c => ({ value: c.id, label: c.name })) || [])
  ], [categories]);

  const resetFilters = useCallback(() => {
    setSearch(''); 
    setActiveOnly(false); 
    setSelectedProducerId(undefined); 
    setSelectedCategoryId(undefined);
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
        <div className="hidden md:flex items-center gap-3 flex-wrap">
          <SimpleSelect
            placeholder="Sélectionner un partenaire"
            value={selectedProducerId || 'all'}
            onValueChange={(value) => setSelectedProducerId(value === 'all' ? undefined : value)}
            options={producerOptions}
            className="w-48"
          />
          
          <SimpleSelect
            placeholder="Sélectionner une catégorie"
            value={selectedCategoryId || 'all'}
            onValueChange={(value) => setSelectedCategoryId(value === 'all' ? undefined : value)}
            options={categoryOptions}
            className="w-48"
          />
          
          <CheckboxWithLabel
            checked={activeOnly}
            onCheckedChange={(v) => setActiveOnly(Boolean(v))}
            label="Actifs uniquement"
          />
          
          {(selectedProducerId || selectedCategoryId || activeOnly) && (
            <Button
              size="sm"
              variant="ghost"
              onClick={resetFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              Effacer les filtres
            </Button>
          )}
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
        ) : (
          <DataList
            variant={view === 'map' ? 'grid' : view}
            items={products}
            isLoading={isLoading}
            gridCols={3}
            renderSkeleton={() => view === 'grid' ? <ProductCardSkeleton /> : <ProductListSkeleton />}
            emptyState={{
              icon: Package,
              title: 'Aucun produit',
              description: 'Aucun résultat pour ces filtres.',
              action: (
                <Button size="sm" variant="outline" onClick={resetFilters}>
                  Réinitialiser
                </Button>
              )
            }}
            renderItem={(product) => (
              <Product 
                key={product.id} 
                product={product} 
                view={view === 'map' ? 'grid' : view} 
                queryParams={queryParams}
              />
            )}
          />
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
          
          <Filters.Selection
            items={categories?.filter(cat => !cat.parent_id) || []}
            selectedId={selectedCategoryId}
            onSelectionChange={setSelectedCategoryId}
            label="Catégorie"
            allLabel="Toutes les catégories"
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