"use client"
import { Package, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { type FC, useCallback, useMemo, useState, useTransition, useDeferredValue, useOptimistic, useEffect } from 'react';

import { AdminPageLayout, Filters, FilterModal } from '@/app/[locale]/admin/(dashboard)/components/admin-layout';
import { FilterButton } from '@/app/[locale]/admin/(dashboard)/components/admin-layout/filter-modal';
import { AdminPageHeader } from '@/app/[locale]/admin/(dashboard)/components/admin-layout/header';
import { AdminPagination } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-pagination';
import { CheckboxWithLabel } from '@/app/[locale]/admin/(dashboard)/components/ui/checkbox';
import { DataList } from '@/app/[locale]/admin/(dashboard)/components/ui/data-list';
import { EmptyState } from '@/app/[locale]/admin/(dashboard)/components/ui/empty-state';
import { SimpleSelect } from '@/app/[locale]/admin/(dashboard)/components/ui/select';
import { ViewToggle, type ViewMode } from '@/app/[locale]/admin/(dashboard)/components/ui/view-toggle';
import { Product } from '@/app/[locale]/admin/(dashboard)/products/components/product';
import { ProductCardSkeleton, ProductListSkeleton } from '@/app/[locale]/admin/(dashboard)/products/components/product-card-skeleton';
import { LocalizedLink } from '@/components/localized-link';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
import type { RouterOutputs} from '@/lib/trpc';


const pageSize = 18;


type SelectOption = { value: string; label: string };

type Categories = RouterOutputs['admin']['categories']['list'];


type SortOption = 'created_at_desc' | 'created_at_asc' | 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc' | 'featured_first';

const createCategoryHierarchy = (categories: Categories | undefined, t: (key: string) => string): SelectOption[] => {
  if (!categories) return [{ value: 'all', label: t('admin.products.filters.all_categories') }];
  
  
  const rootCategories = categories.filter(cat => !cat.parent_id);
  const subCategories = categories.filter(cat => cat.parent_id);
  
  const options: SelectOption[] = [{ value: 'all', label: t('admin.products.filters.all_categories') }];
  
  
  for (const root of rootCategories) {
    
    options.push({ value: root.id, label: root.name });
    
    
    const children = subCategories.filter(sub => sub.parent_id === root.id);
    for (const child of children) {
      options.push({ value: child.id, label: `  └── ${child.name}` });
    }
  }
  
  
  const orphanCategories = subCategories.filter(sub => 
    !rootCategories.some(root => root.id === sub.parent_id) &&
    !subCategories.some(other => other.id === sub.parent_id)
  );
  for (const orphan of orphanCategories) {
    options.push({ value: orphan.id, label: `⚠️ ${orphan.name}` });
  }
  
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

  // Debug logs – liste produits + blur cover
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    try {
      // Sanitize params for logging
      const params = { ...queryParams } as any;
      console.groupCollapsed('🧪 [Admin/Products] Liste - Debug');
      console.log('QueryParams', params);
      console.log('Total (API)', productsData?.total, 'Items (page)', products.length);
      const sample = (products || []).slice(0, 5).map((p: any) => ({
        id: p?.id,
        name: p?.name,
        hasCover: !!p?.images?.[0],
        coverImage: p?.images?.[0] || null,
        hasCoverBlurDataURL: !!p?.cover_blur_data_url,
        hasCoverBlurHash: !!p?.cover_blur_hash,
      }));
      console.table(sample);
      console.groupEnd();
    } catch {}
  }, [productsData, products, queryParams]);

  
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
              isLoading={isLoading || isFetching}
              placeholder={t('admin.products.search_placeholder')}
              value={search}
              onChange={setSearch}
            />
            <FilterButton 
              isActive={isFilterActive} 
              onClick={() => setIsFilterModalOpen(true)}
            />
          </div>
          <LocalizedLink className="w-full" href="/admin/products/new">
          <Button className="w-full" size="sm" variant="accent" >
            {t('admin.products.new_product')}
          </Button>
          </LocalizedLink>
          
        </div>

        
        <div className="hidden md:block space-y-4">
          
          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-md">
              <AdminPageHeader.Search
                isLoading={isLoading || isFetching}
                placeholder={t('admin.products.search_placeholder')}
                value={search}
                onChange={setSearch}
              />
            </div>
            <div className="flex items-center gap-3">
              
              <LocalizedLink className="w-full" href="/admin/products/new">
          <Button className="w-full" icon={<Plus />} size="sm" >
            {t('admin.products.new_product')}
          </Button>
          </LocalizedLink>
          
            </div>
          </div>

          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 flex-wrap flex-1">
              <SimpleSelect
                className="w-48"
                disabled={isPendingProducers || !producers || isPendingFilters}
                options={producerOptions}
                placeholder={t('admin.products.filters.all_partners')}
                value={selectedProducerId || 'all'}
                onValueChange={(value) => handleFilterChange(() => setSelectedProducerId(value === 'all' ? undefined : value))}
              />
              
              <SimpleSelect
                className="w-52"
                disabled={isPendingCategories || !categories || isPendingFilters}
                options={categoryOptions}
                placeholder={t('admin.products.filters.all_categories')}
                value={selectedCategoryId || 'all'}
                onValueChange={(value) => handleFilterChange(() => setSelectedCategoryId(value === 'all' ? undefined : value))}
              />
              
              <SimpleSelect
                className="w-44"
                disabled={isPendingFilters}
                options={sortOptions}
                placeholder={t('admin.products.filters.sort_by')}
                value={sortBy}
                onValueChange={(value) => handleFilterChange(() => setSortBy(value as SortOption))}
              />
              
              
              <SimpleSelect
                className="w-40"
                disabled={isPendingTags || !tagsData || isPendingFilters}
                options={tagOptions}
                placeholder={t('admin.products.filters.tags_placeholder')}
                value=""
                onValueChange={(value) => {
                  if (value && !selectedTags.includes(value)) {
                    handleFilterChange(() => setSelectedTags([...selectedTags, value]));
                  }
                }}
              />
              
              <CheckboxWithLabel
                checked={activeOnly}
                disabled={isPendingFilters}
                label={t('admin.products.filters.active_only')}
                onCheckedChange={(v) => handleFilterChange(() => setActiveOnly(Boolean(v)))}
              />
              
              
              <ViewToggle value={view} onChange={setView} />
              
              
              {hasActiveFilters && (
                <Button
                  className="text-xs px-3 py-2 h-auto text-muted-foreground hover:text-foreground border-dashed"
                  size="sm"
                  variant="outline"
                  onClick={resetFilters}
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
            description={error?.message || t('admin.products.error.loading_description')}
            icon={Package}
            title={t('admin.products.error.loading_title')}
            variant="muted"
            action={
              <Button size="sm" variant="outline" onClick={() => refetch()}>
                {t('admin.products.error.retry')}
              </Button>
            }
          />
        ) : (
          <DataList
            isLoading={isLoading}
            items={products}
            renderSkeleton={() => view === 'grid' ? <ProductCardSkeleton /> : <ProductListSkeleton />}
            variant={view === 'map' ? 'grid' : view}
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
                queryParams={queryParams} 
                view={view === 'map' ? 'grid' : view}
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
            allLabel=""
            items={sortSelectionItems}
            label={t('admin.products.filters.sort_by')}
            selectedId={sortBy}
            onSelectionChange={(id) => handleFilterChange(() => setSortBy((id || 'created_at_desc') as SortOption))}
          />
          
          <Filters.Selection
            allLabel={t('admin.products.filters.all_partners')}
            items={producers || []}
            label={t('admin.products.filter_modal.partner')}
            selectedId={selectedProducerId}
            onSelectionChange={(id) => handleFilterChange(() => setSelectedProducerId(id))}
          />
          
          <Filters.Selection
            allLabel={t('admin.products.filters.all_categories')}
            items={categories?.filter(cat => !cat.parent_id) || []}
            label={t('admin.products.filter_modal.category')}
            selectedId={selectedCategoryId}
            onSelectionChange={(id) => handleFilterChange(() => setSelectedCategoryId(id))}
          />
          
          <Filters.Selection
            allLabel=""
            items={tagsData?.tags?.map(tag => ({ id: tag, name: tag })) || []}
            label={t('admin.products.filter_modal.tags')}
            selectedId=""
            onSelectionChange={(tagId) => {
              if (tagId && !selectedTags.includes(tagId)) {
                handleFilterChange(() => setSelectedTags([...selectedTags, tagId]));
              }
            }}
          />
          
          <Filters.Toggle
            checked={activeOnly}
            label={t('admin.products.filter_modal.active_only_description')}
            onCheckedChange={(v) => handleFilterChange(() => setActiveOnly(v))}
          />
          
          
          {hasActiveFilters && (
            <div className="pt-4 border-t border-border/30">
              <Button
                className="w-full text-muted-foreground hover:text-foreground border-dashed"
                size="sm"
                variant="outline"
                onClick={() => {
                  resetFilters();
                  setIsFilterModalOpen(false);
                }}
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
