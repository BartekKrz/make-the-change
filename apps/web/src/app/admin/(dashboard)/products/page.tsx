'use client';

import Link from 'next/link';
import React, { useState } from 'react';
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
import { trpc } from '@/lib/trpc';
import { getMainProductImage } from '@/components/ProductImage';

export type ProductView = 'grid' | 'list';

const pageSize = 18;

// Composant FilterModal pour mobile
function FilterModal({ 
  isOpen, 
  onClose, 
  producers, 
  selectedProducerId, 
  setSelectedProducerId,
  activeOnly,
  setActiveOnly,
  view,
  setView
}: {
  isOpen: boolean;
  onClose: () => void;
  producers: Array<{ id: string; name: string }>;
  selectedProducerId: string | undefined;
  setSelectedProducerId: (id: string | undefined) => void;
  activeOnly: boolean;
  setActiveOnly: (value: boolean) => void;
  view: ViewMode;
  setView: (view: ViewMode) => void;
}) {
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);

  // Gestion du swipe pour fermer
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - startY;
    
    // Ne permettre que le swipe vers le bas
    if (deltaY > 0) {
      setDragY(deltaY);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    
    // Fermer si swipe > 100px vers le bas
    if (dragY > 100) {
      onClose();
    }
    
    // Reset position
    setDragY(0);
  };

  // Reset dragY quand la modal se ferme
  React.useEffect(() => {
    if (!isOpen) {
      setDragY(0);
      setIsDragging(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border rounded-t-xl shadow-2xl transform transition-transform duration-300 max-h-[80vh] overflow-hidden"
        style={{
          transform: `translateY(${dragY}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Handle bar pour indiquer qu'on peut swiper */}
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-white">
          <h3 className="text-lg font-semibold text-foreground">Filtres</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)] bg-white">
          <div className="space-y-6">
            
            {/* Mode d'affichage */}
            <div>
              <label className="text-sm font-medium mb-3 block">Mode d&apos;affichage</label>
              <ViewToggle
                value={view}
                onChange={setView}
                availableViews={['grid', 'list']}
              />
            </div>
            
            {/* Filtre partenaires */}
            <div>
              <label className="text-sm font-medium mb-3 block">Partenaire</label>
              <div className="space-y-2">
                <Button
                  variant={selectedProducerId === undefined ? "default" : "outline"}
                  onClick={() => setSelectedProducerId(undefined)}
                  className="w-full justify-start"
                >
                  Tous les partenaires
                </Button>
                {producers?.map((producer) => (
                  <Button
                    key={producer.id}
                    variant={selectedProducerId === producer.id ? "default" : "outline"}
                    onClick={() => setSelectedProducerId(producer.id)}
                    className="w-full justify-start"
                  >
                    {producer.name}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Options */}
            <div>
              <label className="text-sm font-medium mb-3 block">Options</label>
              <CheckboxWithLabel
                checked={activeOnly}
                onCheckedChange={(v) => setActiveOnly(Boolean(v))}
                label="Afficher uniquement les produits actifs"
              />
            </div>
          </div>
        </div>
        
        {/* Footer avec actions */}
        <div className="p-4 border-t border-border bg-white">
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedProducerId(undefined);
                setActiveOnly(false);
              }}
              className="flex-1"
            >
              Réinitialiser
            </Button>
            <Button onClick={onClose} className="flex-1">
              Appliquer
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

function AdminProductsPage() {
  const [search, setSearch] = useState('');
  const [activeOnly, setActiveOnly] = useState(false);
  const [selectedProducerId, setSelectedProducerId] = useState<string | undefined>(undefined);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [view, setView] = useState<ViewMode>('grid');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(80); // Hauteur par défaut
  
  const headerRef = React.useRef<HTMLDivElement>(null);

  // Simple debounce implementation
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Calcul dynamique de la hauteur du header
  const updateHeaderHeight = React.useCallback(() => {
    if (headerRef.current) {
      const height = headerRef.current.offsetHeight;
      setHeaderHeight(height + 16); // +16px pour marge de sécurité
    }
  }, []);

  // Observer les changements de taille du header
  React.useEffect(() => {
    updateHeaderHeight();
    
    const resizeObserver = new ResizeObserver(updateHeaderHeight);
    if (headerRef.current) {
      resizeObserver.observe(headerRef.current);
    }

    // Écouter les changements de taille de fenêtre
    window.addEventListener('resize', updateHeaderHeight);
    
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateHeaderHeight);
    };
  }, [updateHeaderHeight]);

  // Récupération des producteurs depuis l'API
  const { data: producersData } = trpc.admin.products.list.useQuery(
    { limit: 100 }, // On récupère plus de produits pour avoir tous les producteurs
    { enabled: true }
  );

  // Extraction unique des producteurs depuis les produits
  const producers = React.useMemo(() => {
    if (!producersData?.items) return [];
    
    const uniqueProducers = new Map();
    producersData.items.forEach(product => {
      if (product.producer && product.producer.id && product.producer.name) {
        uniqueProducers.set(product.producer.id, {
          id: product.producer.id,
          name: product.producer.name
        });
      }
    });
    
    return Array.from(uniqueProducers.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [producersData]);

  // Re-calculer la hauteur du header quand les producteurs changent
  React.useEffect(() => {
    updateHeaderHeight();
  }, [producers, updateHeaderHeight]);

  const { 
    data: productsData,
    isLoading, 
    isFetching,
    refetch 
  } = trpc.admin.products.list.useQuery(
    {
      cursor,
      limit: pageSize,
      search: debouncedSearch || undefined,
      activeOnly: activeOnly || undefined,
      producerId: selectedProducerId,
    }
  );

  const products = productsData?.items || [];

  const updateProduct = trpc.admin.products.update.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  // Fonction helper pour ajuster le stock
  const adjustStock = (productId: string, delta: number) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      updateProduct.mutate({
        id: productId,
        patch: {
          stock_quantity: Math.max(0, (product.stock_quantity || 0) + delta)
        }
      });
    }
  };

  const currentPage = cursor ? Math.floor(products.length / pageSize) + 1 : 1;

  return (
    <div className="h-full relative">
      {/* Zone de contenu scrollable en arrière-plan */}
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
              renderItem={(p: any) => {
                const mainImage = getMainProductImage(p.images);
                
                const handleImageGalleryOpen = () => {
                  console.log('Ouvrir galerie pour produit:', p.id, 'Images:', p.images);
                };
                
                return (
                  <DataCard href={`/admin/products/${p.id}`}>
                    <DataCard.Header>
                      <DataCard.Title
                        icon={Package}
                        image={mainImage}
                        imageAlt={p.name}
                        images={p.images}
                        onImageClick={handleImageGalleryOpen}
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
                        <Button size="sm" variant="outline" className="text-xs px-2" onClick={(e) => { e.preventDefault(); adjustStock(p.id, 1) }}>+1</Button>
                        <Button size="sm" variant="outline" className="text-xs px-2" onClick={(e) => { e.preventDefault(); adjustStock(p.id, -1) }}>-1</Button>
                      </div>
                      <div className="flex items-center gap-1 md:gap-2 flex-wrap">
                        <Button size="sm" variant="outline" className="text-xs whitespace-nowrap" onClick={(e) => { e.preventDefault(); updateProduct.mutate({ id: p.id, patch: { featured: !p.featured } }) }}>
                          <span className="hidden sm:inline">{p.featured ? 'Unfeature' : 'Feature'}</span>
                          <span className="sm:hidden">{p.featured ? '★' : '☆'}</span>
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs whitespace-nowrap" onClick={(e) => { e.preventDefault(); updateProduct.mutate({ id: p.id, patch: { is_active: !p.is_active } }) }}>
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
                          <Button size="sm" variant="outline" className="text-xs px-2" onClick={(e) => { e.preventDefault(); adjustStock(product.id, 1) }}>+1</Button>
                          <Button size="sm" variant="outline" className="text-xs px-2" onClick={(e) => { e.preventDefault(); adjustStock(product.id, -1) }}>-1</Button>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button size="sm" variant="outline" className="text-xs whitespace-nowrap" onClick={(e) => { e.preventDefault(); updateProduct.mutate({ id: product.id, patch: { featured: !product.featured } }) }}>
                            <span className="hidden sm:inline">{product.featured ? 'Unfeature' : 'Feature'}</span>
                            <span className="sm:hidden">{product.featured ? '★' : '☆'}</span>
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs whitespace-nowrap" onClick={(e) => { e.preventDefault(); updateProduct.mutate({ id: product.id, patch: { is_active: !product.is_active } }) }}>
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

      {/* Header fixe avec effet glassomorphisme - Version responsive */}
      <div 
        ref={headerRef}
        className="absolute top-0 left-0 right-0 z-40 backdrop-blur-[20px] bg-background/80 border-b border-border/50 shadow-lg"
      >
        <div className="px-2 py-2.5 md:px-6 md:py-4">
          
          {/* Layout Mobile: 1 ligne ultra-compacte */}
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

          {/* Layout Desktop: Layout intelligent avec wrapping par groupes */}
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

      {/* FAB - Floating Action Button - Mobile uniquement */}
      <Link href="/admin/products/new" className="md:hidden">
        <div className="fixed bottom-6 right-6 z-50 group">
          <Button 
            size="lg" 
            className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-primary hover:bg-primary/90 hover:scale-105 active:scale-95"
          >
            <Plus className="h-6 w-6 transition-transform group-hover:rotate-90" />
          </Button>
        </div>
      </Link>

      {/* Footer fixe avec pagination - Plus compact */}
      {products.length > pageSize && (
        <div className="absolute bottom-0 left-0 right-0 z-40 backdrop-blur-[20px] bg-background/80 border-t border-border/50 shadow-lg">
          <div className="px-4 py-2">
            <AdminPagination
              pagination={{
                currentPage,
                pageSize,
                totalItems: products.length,
                totalPages: Math.ceil(products.length / pageSize)
              }}
            />
          </div>
        </div>
      )}

      {/* Modal de filtres pour mobile */}
      <FilterModal
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
}

export default AdminProductsPage
