'use client';
import Link from 'next/link';
import  { type FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Package, Plus, Star, Zap, Filter, X } from 'lucide-react';
import { ViewToggle, type ViewMode } from '@/app/admin/(dashboard)/components/ui/view-toggle';
import { DataCard, DataList } from '@/app/admin/(dashboard)/components/ui/data-list';
import { ListContainer } from '@/app/admin/(dashboard)/components/ui/list-container';
import { ProductListItem } from '@/app/admin/(dashboard)/components/products/product-list-item';
import { Badge } from '@/app/admin/(dashboard)/components/badge';
import { Button } from '@/app/admin/(dashboard)/components/ui/button';
import { CheckboxWithLabel } from '@/app/admin/(dashboard)/components/ui/checkbox';
import { Input } from '@/app/admin/(dashboard)/components/ui/input';
import { AdminPagination } from '@/app/admin/(dashboard)/components/layout/admin-pagination';
import { ProductFilterModal } from './components/product-filter-modal';
import { trpc } from '@/lib/trpc';
import { getMainProductImage } from '@/components/ProductImage';

export type ProductView = 'grid' | 'list';

const pageSize = 18;

type ProductsErrorStateProps = {
  productsError: any;
  refetch: () => void;
};

const ProductsErrorState: FC<ProductsErrorStateProps> = ({ productsError, refetch }) => (
  <div className="text-center py-12">
    <div className="p-4 bg-red-50 text-red-800 rounded-lg mb-4 max-w-md mx-auto">
      <h3 className="font-medium mb-2">Erreur de chargement</h3>
      <p className="text-sm mb-3">
        {productsError?.message || 'Impossible de charger les produits'}
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

type ProductProps = {
  product: any;
  view: 'grid' | 'list';
  createQueryKey: () => any;
};

const Product: FC<ProductProps> = ({ product, view, createQueryKey }) => {
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

  // Actions pour le grid
  const gridActions = (
    <DataCard.Footer>
      <div className="flex items-center gap-1 md:gap-2 flex-wrap">
        <Button 
          size="sm" 
          variant="outline" 
          className="text-xs px-2 h-8 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustStock(1); }}
        >
           +1
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          className="text-xs px-2 h-8 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustStock(-1); }}
        >
          -1
        </Button>
      </div>
      <div className="flex items-center gap-1 md:gap-2 flex-wrap">
        <Button 
          size="sm" 
          variant="outline" 
          className="text-xs px-2 h-8 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFeature(); }}
        >
          <span className="hidden sm:inline">{product.featured ? 'Unfeature' : 'Feature'}</span>
          <span className="sm:hidden">{product.featured ? '★' : '☆'}</span>
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          className="text-xs px-2 h-8 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleActive(); }}
        >
          <span className="hidden sm:inline">{product.is_active ? 'Désactiver' : 'Activer'}</span>
          <span className="sm:hidden">{product.is_active ? 'Off' : 'On'}</span>
        </Button>
      </div>
      {updateProduct.isError && (
        <div className="text-xs text-red-600 mt-2">
          Erreur: {updateProduct.error?.message || 'Impossible de sauvegarder'}
        </div>
      )}
    </DataCard.Footer>
  );

  // Actions pour la liste
  const listActions = (
    <div className="flex items-center gap-1 md:gap-2 flex-wrap">
      <div className="flex items-center gap-1">
        <Button 
          size="sm" 
          variant="outline" 
          className="text-xs px-2 h-8 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustStock(1); }}
        >
          +1
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          className="text-xs px-2 h-8 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustStock(-1); }}
        >
          -1
        </Button>
      </div>
      <div className="flex items-center gap-1">
        <Button 
          size="sm" 
          variant="outline" 
          className="text-xs px-2 h-8 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFeature(); }}
        >
          <span className="hidden sm:inline">{product.featured ? 'Unfeature' : 'Feature'}</span>
          <span className="sm:hidden">{product.featured ? '★' : '☆'}</span>
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          className="text-xs px-2 h-8 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleActive(); }}
        >
          <span className="hidden sm:inline">{product.is_active ? 'Désactiver' : 'Activer'}</span>
          <span className="sm:hidden">{product.is_active ? 'Off' : 'On'}</span>
        </Button>
      </div>
      {updateProduct.isError && (
        <div className="text-xs text-red-600 w-full">
          Erreur: {updateProduct.error?.message || 'Impossible de sauvegarder'}
        </div>
      )}
    </div>
  );

  
  if (view === 'grid') {
    const mainImage = getMainProductImage(product.images);
    
    return (
      <DataCard href={`/admin/products/${product.id}`}>
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
              <Badge color={product.is_active ? 'green' : 'red'}>{product.is_active ? 'actif' : 'inactif'}</Badge>
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
        {gridActions}
      </DataCard>
    );
  }

  
  return (
    <ProductListItem
      key={product.id}
      product={product}
      actions={listActions}
    />
  );
};



type ProductsListProps = {
  products: any[];
  view: 'grid' | 'list';
  createQueryKey: () => any;
};


const ProductListSkeleton: FC = () => (
  <div className="group relative py-3 px-3 -mx-3 md:py-4 md:px-4 md:-mx-4 border border-transparent rounded-lg">
    <div className="relative min-h-[76px] md:min-h-[80px] px-1 py-1">
      
      {/* Header skeleton */}
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

      {/* Metadata skeleton */}
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
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 animate-pulse rounded" />
            <div className="w-20 h-3 bg-gray-200 animate-pulse rounded" />
          </div>
        </div>
      </div>

      {/* Actions skeleton */}
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

      {/* Arrow */}
      <div className="flex-shrink-0 ml-auto self-center">
        <div className="w-4 h-4 bg-gray-200 animate-pulse rounded" />
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
        action: null // Pas besoin d'action dans un skeleton
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

const ProductsList: FC<ProductsListProps> = ({ 
  products, 
  view,
  createQueryKey
}) => {
  // Plus de gestion de l'état vide ici - c'est géré au niveau supérieur
  
  if (view === 'grid') return (
    <DataList
      items={products}
      isLoading={false}
      gridCols={3}
      emptyState={{
        title: 'Aucun produit',
        description: 'Aucun résultat pour ces filtres.',
        action: null // Jamais affiché car on gère l'état vide avec ProductsEmptyState
      }}
      renderItem={(product) => (
        <Product
          key={product.id}
          product={product}
          view="grid"
          createQueryKey={createQueryKey}
        />
      )}
    />
  );

  
  return (
    <ListContainer>
      {products.map((product) => (
        <Product
          key={product.id}
          product={product}
          view="list"
          createQueryKey={createQueryKey}
        />
      ))}
    </ListContainer>
  );
};


const AdminProductsPage: FC = () => {
  const [search, setSearch] = useState('');
  const [activeOnly, setActiveOnly] = useState(false);
  const [selectedProducerId, setSelectedProducerId] = useState<string | undefined>(undefined);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [view, setView] = useState<ViewMode>('grid');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  
  const { 
    data: producers, 
    isLoading: isLoadingProducers,
    isError: isErrorProducers,
    error: producersError 
  } = trpc.admin.products.producers.useQuery();

  const { 
    data: productsData,
    isLoading, 
    isFetching,
    isError: isErrorProducts,
    error: productsError,
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
  const currentPage = Math.max(1, Math.floor((totalProducts - products.length) / pageSize) + 1);
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
    <div className="min-h-screen flex flex-col h-screen">
      
      <header className="sticky top-0 z-20 backdrop-blur-xl bg-background/95 border-b border-border/50 shadow-lg">
        <div className="px-4 md:px-6 py-2.5 md:py-4">
          
          
          <div className="md:hidden">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Rechercher"
                value={search}
                onChange={(e) => setSearch((e.target as HTMLInputElement).value)}
                className="flex-1 h-9 bg-background/60 backdrop-blur-sm border-border/50 text-sm"
              />
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsFilterModalOpen(true)}
                  className="h-9 w-9 p-0 relative focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
                >
                  <Filter className="h-4 w-4" />
                  
                  {(selectedProducerId || activeOnly) && (
                    <span className="sr-only">Filtres actifs</span>
                  )}
                  {(selectedProducerId || activeOnly) && (
                    <div className="w-2 h-2 bg-primary rounded-full ml-1" />
                  )}
                </Button>
                {(isLoading || isFetching) && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                )}
              </div>
            </div>
          </div>

          
          <div className="hidden md:block space-y-3">
            
            <div className="flex items-center justify-between gap-4">
              <Input
                placeholder="Rechercher des produits..."
                value={search}
                onChange={(e) => setSearch((e.target as HTMLInputElement).value)}
                className="flex-1 max-w-md h-9 bg-background/60 backdrop-blur-sm border-border/50"
              />
              
              <div className="flex items-center gap-3 flex-shrink-0">
                {(isLoading || isFetching) && (
                  <span className="text-sm text-muted-foreground flex items-center gap-2 whitespace-nowrap">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    Chargement...
                  </span>
                )}
                
                <Link href="/admin/products/new">
                  <Button 
                    size="sm" 
                    className="flex items-center gap-2 whitespace-nowrap text-xs px-3 h-8 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
                  >
                    <Plus className="h-4 w-4" />
                    Nouveau produit
                  </Button>
                </Link>
                
                <ViewToggle
                  value={view}
                  onChange={setView}
                  availableViews={['grid', 'list']}
                />
              </div>
            </div>
            
            
            <div className="flex items-center justify-between gap-4 flex-wrap">
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
            </div>
          </div>
        </div>
      </header>

      
      <main className="${flex-1 overflow-auto} px-4 md:px-6 py-6">
        {isErrorProducts ? (
          <ProductsErrorState 
            productsError={productsError}
            refetch={refetch}
          />
        ) : isLoading ? (
          <ProductsListSkeleton 
            view={view as 'grid' | 'list'}
          />
        ) : products.length === 0 ? (
          <ProductsEmptyState
            resetFilters={resetFilters}
          />
        ) : (
          <ProductsList 
            products={products}
            view={view as 'grid' | 'list'}
            createQueryKey={createQueryKey}
          />
        )}
      </main>

      
      {totalProducts > pageSize && (
        <footer className="sticky bottom-0 ${z-20} backdrop-blur-xl bg-background/95 border-t border-border/50 shadow-lg">
          <div className="px-4 md:px-6 py-2">
            <AdminPagination
              pagination={{
                currentPage,
                pageSize,
                totalItems: totalProducts,
                totalPages
              }}
            />
          </div>
        </footer>
      )}

      
      <Link href="/admin/products/new" className="md:hidden">
        <div className="fixed bottom-6 right-6 z-50 group">
          <Button 
            className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 bg-primary hover:bg-primary/90"
          >
            <Plus className="h-6 w-6 transition-transform group-hover:rotate-90" />
          </Button>
        </div>
      </Link>

      
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
    </div>
  )
};

export default AdminProductsPage
