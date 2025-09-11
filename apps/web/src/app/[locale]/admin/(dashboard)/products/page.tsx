"use client"
import { type FC, useCallback, useMemo, useState, useTransition, useDeferredValue, useOptimistic } from 'react';
import { useTranslations } from 'next-intl';
import { Package, Plus } from 'lucide-react';
import { AdminPageLayout, Filters, FilterModal } from '@/app/[locale]/admin/(dashboard)/components/admin-layout';
import { AdminPageHeader } from '@/app/[locale]/admin/(dashboard)/components/admin-layout/header';
import { ViewToggle, type ViewMode } from '@/app/[locale]/admin/(dashboard)/components/ui/view-toggle';
import { FilterButton } from '@/app/[locale]/admin/(dashboard)/components/admin-layout/filter-modal';
import { DataList } from '@/app/[locale]/admin/(dashboard)/components/ui/data-list';
import { Button } from '@/components/ui/button';
import { CheckboxWithLabel } from '@/app/[locale]/admin/(dashboard)/components/ui/checkbox';
import { SimpleSelect } from '@/app/[locale]/admin/(dashboard)/components/ui/select';
import { AdminPagination } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-pagination';
import { RouterOutputs, trpc } from '@/lib/trpc';
import { EmptyState } from '@/app/[locale]/admin/(dashboard)/components/ui/empty-state';
import { ProductCardSkeleton, ProductListSkeleton } from '@/app/[locale]/admin/(dashboard)/products/components/product-card-skeleton';
import { Product } from '@/app/[locale]/admin/(dashboard)/products/components/product';
import { LocalizedLink } from '@/components/localized-link';


const pageSize = 18;


type SelectOption = { value: string; label: string };

type Categories = RouterOutputs['admin']['categories']['list'];


type SortOption = 'created_at_desc' | 'created_at_asc' | 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc' | 'featured_first';

const createCategoryHierarchy = (categories: Categories | undefined, t: (key: string) => string): SelectOption[] => {
  if (!categories) return [{ value: 'all', label: t('admin.products.filters.all_categories') }];
  
  
  const rootCategories = categories.filter(cat => !cat.parent_id);
  const subCategories = categories.filter(cat => cat.parent_id);
  
  const options: SelectOption[] = [{ value: 'all', label: t('admin.products.filters.all_categories') }];
  
  
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


const getSortOptions = (t: (key: string) => string): SelectOption[] => [
  { value: 'created_at_desc', label: t('admin.products.sort.newest') },
  { value: 'created_at_asc', label: t('admin.products.sort.oldest') },
  { value: 'name_asc', label: t('admin.products.sort.name_asc') },
  { value: 'name_desc', label: t('admin.products.sort.name_desc') },
  { value: 'price_asc', label: t('admin.products.sort.price_asc') },
  { value: 'price_desc', label: t('admin.products.sort.price_desc') },
  { value: 'featured_first', label: t('admin.products.sort.featured') },
];


const getDefaultProducerOptions = (t: (key: string) => string): SelectOption[] => [{ value: 'all', label: t('admin.products.filters.all_partners') }];
const getDefaultCategoryOptions = (t: (key: string) => string): SelectOption[] => [{ value: 'all', label: t('admin.products.filters.all_categories') }];
const defaultTagOptions: SelectOption[] = [];

const getSortSelectionItems = (t: (key: string) => string) => getSortOptions(t).map(option => ({
  id: option.value,
  name: option.label
}));

 const ProductsPage: FC = () => {
  const t = useTranslations();

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

  
  const isFilterActive = useMemo(() => !!(
    deferredSearch ||
    activeOnly ||
    (selectedProducerId && selectedProducerId !== 'all') ||
    (selectedCategoryId && selectedCategoryId !== 'all') ||
    (selectedTags && selectedTags.length > 0) ||
    (sortBy && sortBy !== 'created_at_desc')
  ), [deferredSearch, activeOnly, selectedProducerId, selectedCategoryId, selectedTags, sortBy]);


  const producerOptions = useMemo((): SelectOption[] => 
    (isPendingProducers || !producers) ? getDefaultProducerOptions(t) : createSelectOptions(producers, t('admin.products.filters.all_partners')), 
    [producers, isPendingProducers, t]
  );

  const categoryOptions = useMemo((): SelectOption[] => 
    (isPendingCategories || !categories) ? getDefaultCategoryOptions(t) : createCategoryHierarchy(categories, t), 
    [categories, isPendingCategories, t]
  );

  const tagOptions = useMemo((): SelectOption[] => {
    if (isPendingTags || !tagsData) return defaultTagOptions;
    if (!tagsData?.tags) return [];
    return tagsData.tags.map(tag => ({
      value: tag,
      label: tag
    }));
  }, [tagsData, isPendingTags]);

  const sortOptions = useMemo(() => getSortOptions(t), [t]);
  const sortSelectionItems = useMemo(() => getSortSelectionItems(t), [t]);

  
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
              placeholder={t('admin.products.search_placeholder')}
              isLoading={isLoading || isFetching}
            />
            <FilterButton 
              onClick={() => setIsFilterModalOpen(true)} 
              isActive={isFilterActive}
            />
          </div>
          <LocalizedLink href={"/admin/products/new"} className="w-full">
          <Button variant="accent" size="sm" className="w-full" >
            {t('admin.products.new_product')}
          </Button>
          </LocalizedLink>
          
        </div>

        
        <div className="hidden md:block space-y-4">
          
          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-md">
              <AdminPageHeader.Search
                value={search}
                onChange={setSearch}
                placeholder={t('admin.products.search_placeholder')}
                isLoading={isLoading || isFetching}
              />
            </div>
            <div className="flex items-center gap-3">
              
              <LocalizedLink href={"/admin/products/new"} className="w-full">
          <Button icon={<Plus />} size="sm" className="w-full" >
            {t('admin.products.new_product')}
          </Button>
          </LocalizedLink>
          
            </div>
          </div>

          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 flex-wrap flex-1">
              <SimpleSelect
                placeholder={t('admin.products.filters.all_partners')}
                value={selectedProducerId || 'all'}
                onValueChange={(value) => handleFilterChange(() => setSelectedProducerId(value === 'all' ? undefined : value))}
                options={producerOptions}
                className="w-48"
                disabled={isPendingProducers || !producers || isPendingFilters}
              />
              
              <SimpleSelect
                placeholder={t('admin.products.filters.all_categories')}
                value={selectedCategoryId || 'all'}
                onValueChange={(value) => handleFilterChange(() => setSelectedCategoryId(value === 'all' ? undefined : value))}
                options={categoryOptions}
                className="w-52"
                disabled={isPendingCategories || !categories || isPendingFilters}
              />
              
              <SimpleSelect
                placeholder={t('admin.products.filters.sort_by')}
                value={sortBy}
                onValueChange={(value) => handleFilterChange(() => setSortBy(value as SortOption))}
                options={sortOptions}
                className="w-44"
                disabled={isPendingFilters}
              />
              
              
              <SimpleSelect
                placeholder={t('admin.products.filters.tags_placeholder')}
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
                label={t('admin.products.filters.active_only')}
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
                  {t('admin.products.filters.clear_filters')}
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
            title={t('admin.products.error.loading_title')}
            description={error?.message || t('admin.products.error.loading_description')}
            action={
              <Button size="sm" variant="outline" onClick={() => refetch()}>
                {t('admin.products.error.retry')}
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
              title: t('admin.products.empty_state.title'),
              description: t('admin.products.empty_state.description'),
              action: (
                <Button size="sm" variant="outline" onClick={resetFilters}>
                  {t('admin.products.filters.reset')}
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
            label={t('admin.products.filters.sort_by')}
            allLabel=""
          />
          
          <Filters.Selection
            items={producers || []}
            selectedId={selectedProducerId}
            onSelectionChange={(id) => handleFilterChange(() => setSelectedProducerId(id))}
            label={t('admin.products.filter_modal.partner')}
            allLabel={t('admin.products.filters.all_partners')}
          />
          
          <Filters.Selection
            items={categories?.filter(cat => !cat.parent_id) || []}
            selectedId={selectedCategoryId}
            onSelectionChange={(id) => handleFilterChange(() => setSelectedCategoryId(id))}
            label={t('admin.products.filter_modal.category')}
            allLabel={t('admin.products.filters.all_categories')}
          />
          
          <Filters.Selection
            items={tagsData?.tags?.map(tag => ({ id: tag, name: tag })) || []}
            selectedId=""
            onSelectionChange={(tagId) => {
              if (tagId && !selectedTags.includes(tagId)) {
                handleFilterChange(() => setSelectedTags([...selectedTags, tagId]));
              }
            }}
            label={t('admin.products.filter_modal.tags')}
            allLabel=""
          />
          
          <Filters.Toggle
            checked={activeOnly}
            onCheckedChange={(v) => handleFilterChange(() => setActiveOnly(v))}
            label={t('admin.products.filter_modal.active_only_description')}
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
                {t('admin.products.filters.clear_all_filters')}
              </Button>
            </div>
          )}
        </Filters>
      </FilterModal>
    </AdminPageLayout>
  );
};

export default ProductsPage;