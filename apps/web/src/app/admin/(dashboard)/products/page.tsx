"use client"
import { type FC, useCallback, useMemo, useState, useTransition, useDeferredValue, useOptimistic } from 'react';
import { Package, Plus } from 'lucide-react';
import { AdminPageLayout, Filters, FilterModal } from '@/app/admin/(dashboard)/components/admin-layout';
import { AdminPageHeader } from '@/app/admin/(dashboard)/components/admin-layout/header';
import { ViewToggle, type ViewMode } from '@/app/admin/(dashboard)/components/ui/view-toggle';
import { FilterButton } from '@/app/admin/(dashboard)/components/admin-layout/filter-modal';
import { DataList } from '@/app/admin/(dashboard)/components/ui/data-list';
import { Button } from '@/components/ui/button';
import { CheckboxWithLabel } from '@/app/admin/(dashboard)/components/ui/checkbox';
import { SimpleSelect } from '@/app/admin/(dashboard)/components/ui/select';
import { AdminPagination } from '@/app/admin/(dashboard)/components/layout/admin-pagination';
import { RouterOutputs, trpc } from '@/lib/trpc';
import { EmptyState } from '@/app/admin/(dashboard)/components/ui/empty-state';
import { ProductCardSkeleton, ProductListSkeleton } from '@/app/admin/(dashboard)/products/components/product-card-skeleton';
import { Product } from '@/app/admin/(dashboard)/products/components/product';
import Link from 'next/link';

const pageSize = 18;


type SelectOption = { value: string; label: string };

type Categories = RouterOutputs['admin']['categories']['list'];


type SortOption = 'created_at_desc' | 'created_at_asc' | 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc' | 'featured_first';

const createCategoryHierarchy = (categories: Categories | undefined): SelectOption[] => {
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


const sortOptions: SelectOption[] = [
  { value: 'created_at_desc', label: 'Plus récents' },
  { value: 'created_at_asc', label: 'Plus anciens' },
  { value: 'name_asc', label: 'Nom (A-Z)' },
  { value: 'name_desc', label: 'Nom (Z-A)' },
  { value: 'price_asc', label: 'Prix croissant' },
  { value: 'price_desc', label: 'Prix décroissant' },
  { value: 'featured_first', label: 'Mis en avant' },
];


const defaultProducerOptions: SelectOption[] = [{ value: 'all', label: 'Tous les partenaires' }];
const defaultCategoryOptions: SelectOption[] = [{ value: 'all', label: 'Toutes les catégories' }];
const defaultTagOptions: SelectOption[] = [];


const sortSelectionItems = sortOptions.map(option => ({
  id: option.value,
  name: option.label
}));

 const ProductsPage: FC = () => {
  const [search, setSearch] = useState('');
  const [activeOnly, setActiveOnly] = useState(false);
  const [selectedProducerId, setSelectedProducerId] = useState<string | undefined>();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('created_at_desc');
  const [cursor, setCursor] = useState<string | undefined>();
  const [view, setView] = useState<ViewMode>('grid');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);  
  
  
  const [isPendingFilters, startFilterTransition] = useTransition();
  const deferredSearch = useDeferredValue(search);
  const [optimisticTags, removeOptimisticTag] = useOptimistic(
    selectedTags,
    (currentTags, tagToRemove: string) => currentTags.filter(tag => tag !== tagToRemove)
  );


  const queryParams = useMemo(() => ({
    cursor,
    search: deferredSearch || undefined,
    activeOnly: activeOnly || undefined,
    producerId: selectedProducerId === 'all' ? undefined : selectedProducerId,
    categoryId: selectedCategoryId === 'all' ? undefined : selectedCategoryId,
    tags: selectedTags.length > 0 ? selectedTags : undefined,
    sortBy: sortBy || undefined,
    limit: pageSize,
  }), [cursor, deferredSearch, activeOnly, selectedProducerId, selectedCategoryId, selectedTags, sortBy]);

  const { data: producers, isPending: isPendingProducers } = trpc.admin.products.producers.useQuery();
  const { data: categories, isPending: isPendingCategories } = trpc.admin.categories.list.useQuery({ activeOnly: true });
  const { data: tagsData, isPending: isPendingTags } = trpc.admin.products.tags.useQuery({ activeOnly: true, withStats: true });
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

  // Calculer si des filtres sont actifs
  const isFilterActive = useMemo(() => {
    return !!(
      deferredSearch ||
      activeOnly ||
      (selectedProducerId && selectedProducerId !== 'all') ||
      (selectedCategoryId && selectedCategoryId !== 'all') ||
      (selectedTags && selectedTags.length > 0) ||
      (sortBy && sortBy !== 'created_at_desc')
    );
  }, [deferredSearch, activeOnly, selectedProducerId, selectedCategoryId, selectedTags, sortBy]);


  const producerOptions = useMemo((): SelectOption[] => 
    (isPendingProducers || !producers) ? defaultProducerOptions : createSelectOptions(producers, 'Tous les partenaires'), 
    [producers, isPendingProducers]
  );

  const categoryOptions = useMemo((): SelectOption[] => 
    (isPendingCategories || !categories) ? defaultCategoryOptions : createCategoryHierarchy(categories), 
    [categories, isPendingCategories]
  );

  const tagOptions = useMemo((): SelectOption[] => {
    if (isPendingTags || !tagsData) return defaultTagOptions;
    if (!tagsData?.tags) return [];
    return tagsData.tags.map(tag => ({
      value: tag,
      label: tag
    }));
  }, [tagsData, isPendingTags]);

  
  const hasActiveFilters = useMemo(() => Boolean(
    search.trim() ||
    activeOnly ||
    selectedProducerId ||
    selectedCategoryId ||
    selectedTags.length > 0 ||
    sortBy !== 'created_at_desc'
  ), [search, activeOnly, selectedProducerId, selectedCategoryId, selectedTags, sortBy]);

  
  const handleFilterChange = useCallback((filterFn: () => void) => {
    startFilterTransition(filterFn);
  }, [startFilterTransition]);

  const resetFilters = useCallback(() => {
    startFilterTransition(() => {
      setSearch(''); 
      setActiveOnly(false); 
      setSelectedProducerId(undefined); 
      setSelectedCategoryId(undefined);
      setSelectedTags([]);
      setSortBy('created_at_desc');
      setCursor(undefined); 
    });
    refetch();
  }, [refetch, startFilterTransition]);

  
  const handleRemoveTag = useCallback((tagToRemove: string) => {
    removeOptimisticTag(tagToRemove); 
    handleFilterChange(() => {
      setSelectedTags(prev => prev.filter(tag => tag !== tagToRemove));
    });
  }, [removeOptimisticTag, handleFilterChange]);

  return (
    <AdminPageLayout>
      <AdminPageHeader>
        
        <div className="md:hidden space-y-3">
          <div className="flex items-center gap-2">
            <AdminPageHeader.Search
              value={search}
              onChange={setSearch}
              placeholder="Rechercher des produits..."
              isLoading={isLoading || isFetching}
            />
            <FilterButton 
              onClick={() => setIsFilterModalOpen(true)} 
              isActive={isFilterActive}
            />
          </div>
          <Link href={"/admin/products/new"} className="w-full">
          <Button variant="accent" size="sm" className="w-full" >
            Nouveau produit
          </Button>
          </Link>
          
        </div>

        
        <div className="hidden md:block space-y-4">
          
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
              
              <Link href={"/admin/products/new"} className="w-full">
          <Button icon={<Plus />} size="sm" className="w-full" >
            Nouveau produit
          </Button>
          </Link>
          
            </div>
          </div>

          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 flex-wrap flex-1">
              <SimpleSelect
                placeholder="Tous les partenaires"
                value={selectedProducerId || 'all'}
                onValueChange={(value) => handleFilterChange(() => setSelectedProducerId(value === 'all' ? undefined : value))}
                options={producerOptions}
                className="w-48"
                disabled={isPendingProducers || !producers || isPendingFilters}
              />
              
              <SimpleSelect
                placeholder="Toutes les catégories"
                value={selectedCategoryId || 'all'}
                onValueChange={(value) => handleFilterChange(() => setSelectedCategoryId(value === 'all' ? undefined : value))}
                options={categoryOptions}
                className="w-52"
                disabled={isPendingCategories || !categories || isPendingFilters}
              />
              
              <SimpleSelect
                placeholder="Trier par"
                value={sortBy}
                onValueChange={(value) => handleFilterChange(() => setSortBy(value as SortOption))}
                options={sortOptions}
                className="w-44"
                disabled={isPendingFilters}
              />
              
              
              <SimpleSelect
                placeholder="Tags..."
                value=""
                onValueChange={(value) => {
                  if (value && !selectedTags.includes(value)) {
                    handleFilterChange(() => setSelectedTags([...selectedTags, value]));
                  }
                }}
                options={tagOptions}
                className="w-40"
                disabled={isPendingTags || !tagsData || isPendingFilters}
              />
              
              <CheckboxWithLabel
                checked={activeOnly}
                onCheckedChange={(v) => handleFilterChange(() => setActiveOnly(Boolean(v)))}
                label="Actifs uniquement"
                disabled={isPendingFilters}
              />
              
              
              <ViewToggle value={view} onChange={setView} />
              
              
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetFilters}
                  className="text-xs px-3 py-2 h-auto text-muted-foreground hover:text-foreground border-dashed"
                >
                  Effacer filtres
                </Button>
              )}
              
              
              {optimisticTags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {optimisticTags.map(tag => (
                    <span 
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-primary/10 text-primary border border-primary/20 rounded-md cursor-pointer hover:bg-primary/20"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      {tag}
                      <span className="text-primary/60 hover:text-primary">×</span>
                    </span>
                  ))}
                </div>
              )}
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
                onFilterChange={{
                  setCategory: (categoryId: string) => 
                    handleFilterChange(() => setSelectedCategoryId(categoryId)),
                  setProducer: (producerId: string) => 
                    handleFilterChange(() => setSelectedProducerId(producerId)),
                  addTag: (tag: string) => {
                    if (!selectedTags.includes(tag)) {
                      handleFilterChange(() => setSelectedTags([...selectedTags, tag]));
                    }
                  }
                }}
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
            items={sortSelectionItems}
            selectedId={sortBy}
            onSelectionChange={(id) => handleFilterChange(() => setSortBy((id || 'created_at_desc') as SortOption))}
            label="Trier par"
            allLabel=""
          />
          
          <Filters.Selection
            items={producers || []}
            selectedId={selectedProducerId}
            onSelectionChange={(id) => handleFilterChange(() => setSelectedProducerId(id))}
            label="Partenaire"
            allLabel="Tous les partenaires"
          />
          
          <Filters.Selection
            items={categories?.filter(cat => !cat.parent_id) || []}
            selectedId={selectedCategoryId}
            onSelectionChange={(id) => handleFilterChange(() => setSelectedCategoryId(id))}
            label="Catégorie"
            allLabel="Toutes les catégories"
          />
          
          <Filters.Selection
            items={tagsData?.tags?.map(tag => ({ id: tag, name: tag })) || []}
            selectedId=""
            onSelectionChange={(tagId) => {
              if (tagId && !selectedTags.includes(tagId)) {
                handleFilterChange(() => setSelectedTags([...selectedTags, tagId]));
              }
            }}
            label="Tags"
            allLabel=""
          />
          
          <Filters.Toggle
            checked={activeOnly}
            onCheckedChange={(v) => handleFilterChange(() => setActiveOnly(v))}
            label="Afficher uniquement les éléments actifs"
          />
          
          
          {hasActiveFilters && (
            <div className="pt-4 border-t border-border/30">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  resetFilters();
                  setIsFilterModalOpen(false);
                }}
                className="w-full text-muted-foreground hover:text-foreground border-dashed"
              >
                Effacer tous les filtres
              </Button>
            </div>
          )}
        </Filters>
      </FilterModal>
    </AdminPageLayout>
  );
};

export default ProductsPage;