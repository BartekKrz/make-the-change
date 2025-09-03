'use client';
import Link from 'next/link';
import  { type FC, useCallback, useEffect, useRef, useState } from 'react';
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
import { useProducers } from './hooks/use-producers';

export type ProductView = 'grid' | 'list';

const pageSize = 18;



const AdminProductsPage: FC = () => {
  const [search, setSearch] = useState('');
  const [activeOnly, setActiveOnly] = useState(false);
  const [selectedProducerId, setSelectedProducerId] = useState<string | undefined>(undefined);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [view, setView] = useState<ViewMode>('grid');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(80);
  
  // État local pour les mises à jour optimistes + debounce
  const [optimisticUpdates, setOptimisticUpdates] = useState<Record<string, any>>({});
  const [pendingRequests, setPendingRequests] = useState<Record<string, NodeJS.Timeout>>({});
  
 
  
  const headerRef = useRef<HTMLDivElement>(null);

  
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  
  const updateHeaderHeight = useCallback(() => {
    if (headerRef.current) {
      const height = headerRef.current.offsetHeight;
      setHeaderHeight(height + 16); 
    }
  }, []);

  
  useEffect(() => {
    updateHeaderHeight();
    
    const resizeObserver = new ResizeObserver(updateHeaderHeight);
    if (headerRef.current) {
      resizeObserver.observe(headerRef.current);
    }

    
    window.addEventListener('resize', updateHeaderHeight);
    
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateHeaderHeight);
    };
  }, [updateHeaderHeight]);

  
  const { producers } = useProducers();

  // Requête principale pour les produits
  const { 
    data: productsData,
    isLoading, 
    isFetching,
    refetch 
  } = trpc.admin.products.list.useQuery({
    cursor,
    limit: pageSize,
    search: debouncedSearch || undefined,
    activeOnly: activeOnly || undefined,
    producerId: selectedProducerId,
  });

  const baseProducts = productsData?.items || [];
  const totalProducts = productsData?.total || 0;
  
  // Produits avec les mises à jour optimistes appliquées pour l'affichage
  const products = baseProducts.map(product => {
    const optimisticUpdate = optimisticUpdates[product.id];
    return optimisticUpdate ? { ...product, ...optimisticUpdate } : product;
  });
  const currentPage = Math.max(1, Math.floor((totalProducts - products.length) / pageSize) + 1);
  const totalPages = Math.ceil(totalProducts / pageSize);

  
  useEffect(() => {
    updateHeaderHeight();
  }, [producers, updateHeaderHeight]);

  const utils = trpc.useUtils();
  
  // Helper pour créer une clé de requête cohérente
  const createQueryKey = () => ({
    cursor,
    limit: pageSize,
    search: debouncedSearch || undefined,
    activeOnly: activeOnly || undefined,
    producerId: selectedProducerId,
  });
  
  const updateProduct = trpc.admin.products.update.useMutation({
    onMutate: async ({ id, patch }) => {
      // 1. Annuler toutes les requêtes en cours pour éviter les conflicts
      await utils.admin.products.list.cancel();
      
      // 2. Créer la clé de requête
      const queryKey = createQueryKey();

      // 3. Snapshot de l'état actuel pour rollback
      const previousData = utils.admin.products.list.getData(queryKey);

      // 4. ⭐ OPTIMISTIC UPDATE : Mise à jour immédiate du cache
      if (previousData?.items) {
        const updatedData = {
          ...previousData,
          items: previousData.items.map(product => 
            product.id === id ? { ...product, ...patch } : product
          )
        };
        
        utils.admin.products.list.setData(queryKey, updatedData);
      }

      // 5. Retourner le contexte pour rollback
      return { previousData, queryKey };
    },
    onError: (err, variables, context) => {
      // 6. ⚠️ ROLLBACK en cas d'erreur
      if (context?.previousData && context.queryKey) {
        utils.admin.products.list.setData(context.queryKey, context.previousData);
      }
    },
    onSuccess: (updatedProduct, { id }) => {
      // 7. ✅ Mettre à jour avec les vraies données du serveur
      const queryKey = createQueryKey();
      
      const currentData = utils.admin.products.list.getData(queryKey);
      if (currentData?.items) {
        utils.admin.products.list.setData(queryKey, {
          ...currentData,
          items: currentData.items.map(product => 
            product.id === id ? updatedProduct : product
          )
        });
      }
    }
  });

  // Fonction pour appliquer une mise à jour optimiste immédiate
  const applyOptimisticUpdate = (productId: string, patch: any) => {
    setOptimisticUpdates(prev => ({
      ...prev,
      [productId]: { ...prev[productId], ...patch }
    }));
  };

  // Fonction pour envoyer la requête avec debounce
  const debouncedMutation = (productId: string, patch: any, delay = 500) => {
    // Nettoyer le timer précédent si il existe
    if (pendingRequests[productId]) {
      clearTimeout(pendingRequests[productId]);
    }

    // Créer un nouveau timer
    const timer = setTimeout(() => {
      updateProduct.mutate({
        id: productId,
        patch
      }, {
        onSettled: () => {
          // Nettoyer l'état optimiste après la réponse du serveur
          setOptimisticUpdates(prev => {
            const newState = { ...prev };
            delete newState[productId];
            return newState;
          });
          // Nettoyer le timer
          setPendingRequests(prev => {
            const newState = { ...prev };
            delete newState[productId];
            return newState;
          });
        }
      });
    }, delay);

    // Sauvegarder le timer
    setPendingRequests(prev => ({ ...prev, [productId]: timer }));
  };

  const adjustStock = (productId: string, delta: number) => {
    const displayProduct = getDisplayProduct(productId);
    const currentStock = displayProduct.stock_quantity || 0;
    const newStock = Math.max(0, currentStock + delta);
    
    // Ne rien faire si le stock ne change pas
    if (newStock === currentStock) return;
    
    // 1. Mise à jour optimiste immédiate
    applyOptimisticUpdate(productId, { stock_quantity: newStock });
    
    // 2. Envoyer la requête avec debounce
    debouncedMutation(productId, { stock_quantity: newStock });
  };

  const toggleFeature = (productId: string) => {
    const displayProduct = getDisplayProduct(productId);
    const newFeatured = !displayProduct.featured;
    
    // 1. Mise à jour optimiste immédiate
    applyOptimisticUpdate(productId, { featured: newFeatured });
    
    // 2. Envoyer la requête avec debounce
    debouncedMutation(productId, { featured: newFeatured }, 300);
  };

  const toggleActive = (productId: string) => {
    const displayProduct = getDisplayProduct(productId);
    const newActive = !displayProduct.is_active;
    
    // 1. Mise à jour optimiste immédiate
    applyOptimisticUpdate(productId, { is_active: newActive });
    
    // 2. Envoyer la requête avec debounce
    debouncedMutation(productId, { is_active: newActive }, 300);
  };

  // Fonction helper pour obtenir le produit avec les mises à jour optimistes appliquées
  const getDisplayProduct = (productId: string) => {
    const baseProduct = baseProducts.find(p => p.id === productId);
    const optimisticUpdate = optimisticUpdates[productId];
    return { ...baseProduct, ...optimisticUpdate };
  };

  return (
    <div className="h-full relative">
      <div className="absolute inset-0 overflow-auto">
        <div 
          className="pb-20 px-4 md:px-6"
          style={{ paddingTop: `${headerHeight}px` }}
        >
          {view === 'grid' ? (
            <DataList
              items={products}
              isLoading={isLoading}
              gridCols={3}
              emptyState={{
                title: 'Aucun produit',
                description: 'Aucun résultat pour ces filtres.',
                action: (
                  <Button size="sm" variant="outline" onClick={() => { setSearch(''); setActiveOnly(false); setSelectedProducerId(undefined); setCursor(undefined); refetch() }}>
                    Réinitialiser
                  </Button>
                )
              }}
              renderItem={(p) => {
                const mainImage = getMainProductImage(p.images);
                
                return (
                  <DataCard href={`/admin/products/${p.id}`}>
                    <DataCard.Header>
                      <DataCard.Title
                        icon={Package}
                        image={mainImage}
                        imageAlt={p.name}
                        images={p.images}
                      >
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium">{p.name}</span>
                          <span className="font-mono text-xs text-muted-foreground">{p.slug}</span>
                          <Badge color={p.is_active ? 'green' : 'red'}>{p.is_active ? 'actif' : 'inactif'}</Badge>
                          {p.featured && <Star className="w-4 h-4 text-yellow-500" />}
                        </div>
                      </DataCard.Title>
                    </DataCard.Header>
                    <DataCard.Content>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Zap className="w-3.5 h-3.5" />
                        <span>{p.price_points} pts</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Box className="w-3.5 h-3.5" />
                        <span>Stock: {p.stock_quantity ?? 0}</span>
                      </div>
                      {p.producer && (
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {p.producer.name}
                          </span>
                        </div>
                      )}
                    </DataCard.Content>
                    <DataCard.Footer>
                      <div className="flex items-center gap-1 md:gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-xs px-2" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustStock(p.id, 1); }}
                        >
                          +1
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-xs px-2" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustStock(p.id, -1); }}
                        >
                          -1
                        </Button>
                      </div>
                      <div className="flex items-center gap-1 md:gap-2 flex-wrap">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-xs whitespace-nowrap" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFeature(p.id); }}
                        >
                          <span className="hidden sm:inline">{p.featured ? 'Unfeature' : 'Feature'}</span>
                          <span className="sm:hidden">{p.featured ? '★' : '☆'}</span>
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-xs whitespace-nowrap" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleActive(p.id); }}
                        >
                          <span className="hidden sm:inline">{p.is_active ? 'Désactiver' : 'Activer'}</span>
                          <span className="sm:hidden">{p.is_active ? 'Off' : 'On'}</span>
                        </Button>
                      </div>
                    </DataCard.Footer>
                  </DataCard>
                );
              }}
            />
          ) : (
            isLoading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Chargement des produits...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Aucun produit</h3>
                <p className="text-muted-foreground mb-4">Aucun résultat pour ces filtres.</p>
                <Button size="sm" variant="outline" onClick={() => { setSearch(''); setActiveOnly(false); setSelectedProducerId(undefined); setCursor(undefined); refetch() }}>
                  Réinitialiser
                </Button>
              </div>
            ) : (
              <ListContainer>
                {products.map((product) => (
                  <ProductListItem
                    key={product.id}
                    product={product}
                    actions={
                      <div className="flex items-center gap-1 md:gap-2 flex-wrap">
                        <div className="flex items-center gap-1">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-xs px-2" 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustStock(product.id, 1); }}
                          >
                            +1
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-xs px-2" 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustStock(product.id, -1); }}
                          >
                            -1
                          </Button>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-xs whitespace-nowrap" 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFeature(product.id); }}
                          >
                            <span className="hidden sm:inline">{product.featured ? 'Unfeature' : 'Feature'}</span>
                            <span className="sm:hidden">{product.featured ? '★' : '☆'}</span>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-xs whitespace-nowrap" 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleActive(product.id); }}
                          >
                            <span className="hidden sm:inline">{product.is_active ? 'Désactiver' : 'Activer'}</span>
                            <span className="sm:hidden">{product.is_active ? 'Off' : 'On'}</span>
                          </Button>
                        </div>
                      </div>
                    }
                  />
                ))}
              </ListContainer>
            )
          )}
        </div>
      </div>

      
      <div 
        ref={headerRef}
        className="absolute top-0 left-0 right-0 z-40 backdrop-blur-[20px] bg-background/80 border-b border-border/50 shadow-lg"
      >
        <div className="px-2 py-2.5 md:px-6 md:py-4">
          
          
          <div className="md:hidden">
            <div className="flex  items-center gap-2">
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
                  className="h-9 w-9 p-0 relative"
                >
                  <Filter className="h-4 w-4" />
                  {/* Badge indicateur si filtres actifs */}
                  {(selectedProducerId || activeOnly) && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
                  )}
                </Button>
                {(isLoading || isFetching) && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                )}
              </div>
            </div>
          </div>

          
          <div className="hidden md:block space-y-3">
            {/* Première ligne : Recherche + Actions principales */}
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
                  <Button size="sm" className="flex items-center gap-2 whitespace-nowrap">
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
            
            {/* Deuxième ligne : Filtres + Options */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3 flex-wrap">
                
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    size="sm"
                    variant={selectedProducerId === undefined ? "default" : "outline"}
                    onClick={() => setSelectedProducerId(undefined)}
                    className="h-8 px-3 text-sm font-medium"
                  >
                    Tous
                  </Button>
                  {producers?.map((producer) => (
                    <Button
                      key={producer.id}
                      size="sm"
                      variant={selectedProducerId === producer.id ? "default" : "outline"}
                      onClick={() => setSelectedProducerId(producer.id)}
                      className="h-8 px-3 text-sm font-medium whitespace-nowrap"
                    >
                      {producer.name}
                    </Button>
                  ))}
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
      </div>

   
      <Link href="/admin/products/new" className="md:hidden">
        <div className="fixed bottom-6  right-6 z-50 group">
          <Button 
            size="lg" 
            className="h-14 w-14 bg-gray-500 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-primary hover:bg-primary/90 hover:scale-105 active:scale-95"
          >
            <Plus className="h-6 w-6 transition-transform group-hover:rotate-90" />
          </Button>
        </div>
      </Link>

      {totalProducts > pageSize && (
        <div className="absolute bottom-0 left-0 right-0 z-40 backdrop-blur-[20px] bg-background/80 border-t border-border/50 shadow-lg">
          <div className="px-4 py-2">
            <AdminPagination
              pagination={{
                currentPage,
                pageSize,
                totalItems: totalProducts,
                totalPages
              }}
            />
          </div>
        </div>
      )}

   
      <ProductFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        producers={producers}
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
