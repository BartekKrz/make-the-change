"use client"
import { type FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Package } from 'lucide-react';
import { AdminPageLayout, Filters, FilterModal } from '@/app/admin/(dashboard)/components/admin-layout';
import { AdminPageHeader, CreateButton } from '@/app/admin/(dashboard)/components/admin-layout/header';
import { ViewToggle, type ViewMode } from '@/app/admin/(dashboard)/components/ui/view-toggle';
import { FilterButton } from '@/app/admin/(dashboard)/components/admin-layout/filter-modal';
import {  DataList } from '@/app/admin/(dashboard)/components/ui/data-list';
import { Button } from '@/app/admin/(dashboard)/components/ui/button';
import { CheckboxWithLabel } from '@/app/admin/(dashboard)/components/ui/checkbox';
import { SimpleSelect } from '@/app/admin/(dashboard)/components/ui/select';
import { AdminPagination } from '@/app/admin/(dashboard)/components/layout/admin-pagination';
import { trpc } from '@/lib/trpc';
import { EmptyState } from '@/app/admin/(dashboard)/components/ui/empty-state';
import { ProductCardSkeleton, ProductListSkeleton } from '@/app/admin/(dashboard)/products/components/product-card';
import { Product } from '@/app/admin/(dashboard)/products/components/product';

const pageSize = 18;


type SelectOption = { value: string; label: string };


const createCategoryHierarchy = (categories: any[] | undefined): SelectOption[] => {
  if (!categories) return [{ value: 'all', label: 'Toutes les catégories' }];
  
  
  const rootCategories = categories.filter(cat => !cat.parent_id);
  const subCategories = categories.filter(cat => cat.parent_id);
  
  const options: SelectOption[] = [{ value: 'all', label: 'Toutes les catégories' }];
  
  
  rootCategories.forEach(root => {
    
    options.push({ value: root.id, label: root.name });
    
    
    const children = subCategories.filter(sub => sub.parent_id === root.id);
    children.forEach(child => {
      options.push({ value: child.id, label: `  └── ${child.name}` });
    });
  });
  
  
  const orphanCategories = subCategories.filter(sub => 
    !rootCategories.some(root => root.id === sub.parent_id) &&
    !subCategories.some(other => other.id === sub.parent_id)
  );
  orphanCategories.forEach(orphan => {
    options.push({ value: orphan.id, label: `⚠️ ${orphan.name}` });
  });
  
  return options;
};


const createSelectOptions = <T extends { id: string; name: string }>(
  items: T[] | undefined,
  allLabel: string
): SelectOption[] => [
  { value: 'all', label: allLabel },
  ...(items?.map(item => ({ value: item.id, label: item.name })) || [])
];

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

  const producerOptions = useMemo((): SelectOption[] => 
    createSelectOptions(producers, 'Tous les partenaires'), 
    [producers]
  );

  const categoryOptions = useMemo((): SelectOption[] => 
    createCategoryHierarchy(categories), 
    [categories]
  );

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
      <AdminPageHeader>
        {/* Version mobile */}
        <div className="md:hidden space-y-3">
          <div className="flex items-center gap-2">
            <AdminPageHeader.Search
              value={search}
              onChange={setSearch}
              placeholder="Rechercher des produits..."
              isLoading={isLoading || isFetching}
            />
            <FilterButton onClick={() => setIsFilterModalOpen(true)} />
          </div>
          <CreateButton href="/admin/products/new" label="Nouveau produit" className="w-full" />
        </div>

        {/* Version desktop */}
        <div className="hidden md:block space-y-4">
          {/* Ligne 1: Recherche et bouton principal */}
          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-md">
              <AdminPageHeader.Search
                value={search}
                onChange={setSearch}
                placeholder="Rechercher des produits..."
                isLoading={isLoading || isFetching}
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-muted-foreground">
                {totalProducts} produit{totalProducts > 1 ? 's' : ''}
              </div>
              <CreateButton href="/admin/products/new" label="Nouveau produit" />
            </div>
          </div>

          {/* Ligne 2: Contrôles de filtrage et vue */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-wrap flex-1">
              <SimpleSelect
                placeholder="Tous les partenaires"
                value={selectedProducerId || 'all'}
                onValueChange={(value) => setSelectedProducerId(value === 'all' ? undefined : value)}
                options={producerOptions}
                className="w-48"
              />
              
              <SimpleSelect
                placeholder="Toutes les catégories"
                value={selectedCategoryId || 'all'}
                onValueChange={(value) => setSelectedCategoryId(value === 'all' ? undefined : value)}
                options={categoryOptions}
                className="w-52"
              />
              
              <CheckboxWithLabel
                checked={activeOnly}
                onCheckedChange={(v) => setActiveOnly(Boolean(v))}
                label="Actifs uniquement"
              />
            </div>

            <div className="flex items-center gap-3">
              <ViewToggle value={view} onChange={setView} />
            </div>
          </div>
        </div>
      </AdminPageHeader>

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