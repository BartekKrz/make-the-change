'use client';
import {
  Package,
  Star,
  Zap,
  Box,
  User,
  Plus,
  Minus,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { type FC, useRef, startTransition } from 'react';

import {
  DataCard,
  DataListItem,
} from '@/app/[locale]/admin/(dashboard)/components/ui/data-list';
import { ProductImage } from '@/app/[locale]/admin/(dashboard)/components/images/product-image';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
import type { RouterOutputs, RouterInputs } from '@/lib/trpc';
import { cn } from '@/lib/utils';

type ProductUpdateInput = RouterInputs['admin']['products']['update']['patch'];
type ProductItem = RouterOutputs['admin']['products']['list']['items'][number];

type ProductProps = {
  product: ProductItem;
  view: 'grid' | 'list';
  queryParams: {
    cursor?: string;
    search?: string;
    activeOnly?: boolean;
    producerId?: string;
    categoryId?: string;
    limit: number;
  };
  onFilterChange?: {
    setCategory: (categoryId: string) => void;
    setProducer: (producerId: string) => void;
    addTag: (tag: string) => void;
  };
};

const getProductContextClass = (product: ProductItem) => {
  const name = product.name?.toLowerCase() || '';
  const category = product.category?.name?.toLowerCase() || '';
  const producer = product.producer?.name?.toLowerCase() || '';

  if (
    name.includes('miel') ||
    name.includes('honey') ||
    category.includes('miel')
  ) {
    return 'badge-honey';
  }
  if (
    name.includes('huile') ||
    name.includes('olive') ||
    name.includes('oil')
  ) {
    return 'badge-olive';
  }
  if (
    name.includes('eau') ||
    name.includes('water') ||
    name.includes('aqua') ||
    producer.includes('ocean')
  ) {
    return 'badge-ocean';
  }
  if (
    producer.includes('terre') ||
    category.includes('agriculture') ||
    name.includes('terre')
  ) {
    return 'badge-earth';
  }
  return 'badge-accent-subtle';
};

export const Product: FC<ProductProps> = ({
  product,
  view,
  queryParams,
  onFilterChange,
}) => {
  const t = useTranslations('admin.products');
  const pendingRequest = useRef<NodeJS.Timeout | null>(null);
  const utils = trpc.useUtils();

  // Helper to remove focus from parent list item
  const removeFocusFromParent = (e: any) => {
    const listContainer = e.currentTarget.closest('[role="button"]');
    if (listContainer) {
      (listContainer as HTMLElement).blur();
    }
  };

  const updateProduct = trpc.admin.products.update.useMutation({
    onMutate: async ({ id, patch }) => {
      await utils.admin.products.list.cancel();
      const previousData = utils.admin.products.list.getData(queryParams);

      utils.admin.products.list.setData(queryParams, old => {
        if (!old?.items) return old;

        return {
          ...old,
          items: old.items.map((item: ProductItem) => {
            if (item.id === id) {
              const updated: ProductItem = { ...item };
              if (patch.stock_quantity !== undefined) {
                updated.stock_quantity = patch.stock_quantity;
              }
              if (patch.is_active !== undefined) {
                updated.is_active = patch.is_active;
              }
              return updated;
            }
            return item;
          }),
        };
      });

      return { previousData };
    },
    onError: (_err: any, _variables: any, context: any) => {
      if (context?.previousData) {
        utils.admin.products.list.setData(queryParams, context.previousData);
      }
    },
  });

  const debouncedMutation = (patch: ProductUpdateInput, delay = 500) => {
    if (pendingRequest.current) {
      clearTimeout(pendingRequest.current);
    }

    startTransition(() => {
      const currentData = utils.admin.products.list.getData(queryParams);

      if (currentData?.items) {
        const optimisticData = {
          ...currentData,
          items: currentData.items.map((p: ProductItem) => {
            if (p.id === product.id) {
              const updated: ProductItem = { ...p };
              if (patch.stock_quantity !== undefined) {
                updated.stock_quantity = patch.stock_quantity;
              }
              if (patch.is_active !== undefined) {
                updated.is_active = patch.is_active;
              }
              return updated;
            }
            return p;
          }),
        };
        utils.admin.products.list.setData(queryParams, optimisticData);
      }
    });

    pendingRequest.current = setTimeout(() => {
      updateProduct.mutate({ id: product.id, patch });
      pendingRequest.current = null;
    }, delay);
  };

  const adjustStock = (delta: number) => {
    const currentStock = product.stock_quantity || 0;
    const newStock = Math.max(0, currentStock + delta);
    if (newStock === currentStock) return;

    startTransition(() => {
      debouncedMutation({ stock_quantity: newStock });
    });
  };

  const toggleActive = () => {
    const newActive = !product.is_active;
    startTransition(() => {
      debouncedMutation({ is_active: newActive }, 300);
    });
  };

  const actions = (
    <div className="flex w-full items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        {/* Stock Control - Enhanced for dark theme */}
        <div className="bg-background dark:bg-card border-border dark:border-border group inline-flex items-center overflow-hidden rounded-xl border shadow-sm dark:shadow-black/10">
          <Button
            aria-label={t('stock.increase')}
            className="text-muted-foreground hover:text-primary hover:bg-primary/8 h-10 rounded-none border-0 px-3 transition-all duration-200 active:scale-95"
            size="sm"
            title={t('stock.increase')}
            variant="ghost"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              removeFocusFromParent(e);
              adjustStock(1);
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>

          <div className="border-border dark:border-border bg-muted/30 dark:bg-muted/20 relative min-w-[4rem] border-x px-4 py-2 text-center">
            <span className="text-foreground dark:text-foreground text-sm font-semibold tabular-nums">
              {product.stock_quantity || 0}
            </span>
            <div className="via-primary/5 dark:via-primary/10 absolute inset-0 bg-gradient-to-r from-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>

          <Button
            aria-label={t('stock.decrease')}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/8 disabled:hover:text-muted-foreground h-10 rounded-none border-0 px-3 transition-all duration-200 active:scale-95 disabled:hover:bg-transparent"
            disabled={product.stock_quantity === 0}
            size="sm"
            title={t('stock.decrease')}
            variant="ghost"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              removeFocusFromParent(e);
              adjustStock(-1);
            }}
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Visibility Toggle */}
      <div className="flex items-center gap-2">
        <div
          aria-checked={product.is_active ? 'true' : 'false'}
          role="switch"
          tabIndex={0}
          aria-label={
            product.is_active ? t('visibility.hide') : t('visibility.show')
          }
          className={cn(
            'focus-within:ring-primary/20 dark:focus-within:ring-primary/30 relative inline-flex h-6 w-11 cursor-pointer rounded-full border-2 transition-all duration-200 ease-in-out focus-within:ring-2',
            product.is_active
              ? 'bg-success dark:bg-success border-success dark:border-success dark:shadow-success/20 shadow-sm'
              : 'bg-muted dark:bg-muted border-border dark:border-border hover:bg-muted/80 dark:hover:bg-muted/60'
          )}
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            removeFocusFromParent(e);
            toggleActive();
          }}
          onKeyDown={e => {
            if (!(e.key === 'Enter' || e.key === ' ')) return;
            e.preventDefault();
            e.stopPropagation();
            toggleActive();
          }}
        >
          <span
            className={cn(
              'bg-background dark:bg-background inline-block h-5 w-5 transform rounded-full shadow-sm transition-transform duration-200 ease-in-out dark:shadow-black/20',
              product.is_active ? 'translate-x-5' : 'translate-x-0'
            )}
          />
        </div>

        <div className="flex items-center gap-1.5 text-sm">
          <div
            className={cn(
              'flex items-center justify-center transition-colors duration-200',
              product.is_active
                ? 'text-success dark:text-success'
                : 'text-muted-foreground dark:text-muted-foreground'
            )}
          >
            {product.is_active ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </div>
          <span
            className={cn(
              'font-medium transition-colors duration-200',
              product.is_active
                ? 'text-foreground dark:text-foreground'
                : 'text-muted-foreground dark:text-muted-foreground'
            )}
          >
            {product.is_active
              ? t('visibility.visible')
              : t('visibility.hidden')}
          </span>
        </div>
      </div>
    </div>
  );

  if (view === 'grid')
    return (
      <DataCard href={`/admin/products/${product.id}`}>
        <DataCard.Header>
          <DataCard.Title
            icon={Package}
            image={product.images?.[0]}
            imageAlt={product.name}
            imageBlurDataURL={(product as any).cover_blur_data_url || undefined}
            images={product.images || undefined}
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-lg leading-tight font-semibold tracking-tight">
                {product.name}
              </span>
              <span className="text-muted-foreground/80 text-xs leading-relaxed font-medium">
                {product.short_description}
              </span>
            </div>
          </DataCard.Title>
        </DataCard.Header>
        <DataCard.Content>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Zap className="text-muted-foreground h-3.5 w-3.5" />
              <div className="flex items-baseline gap-1">
                <span className="text-foreground text-base font-bold tracking-tight tabular-nums">
                  {product.price_points}
                </span>
                <span className="text-muted-foreground/70 text-xs font-medium tracking-wide uppercase">
                  {t('stock.points_label')}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Box className="text-muted-foreground h-3.5 w-3.5" />
              <div className="flex items-baseline gap-1">
                <span className="text-foreground text-sm font-semibold tracking-tight tabular-nums">
                  {product.stock_quantity ?? 0}
                </span>
                <span className="text-muted-foreground/70 text-xs font-medium tracking-wide uppercase">
                  {t('stock.label')}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {product.category && (
              <button
                className="badge-subtle hover:bg-primary/15 dark:hover:bg-primary/20 hover:text-primary dark:hover:text-primary hover:border-primary/30 dark:hover:border-primary/40 dark:hover:shadow-primary/10 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-sm active:scale-95"
                title={t('filters_tooltip.category', {
                  name: product.category.name,
                })}
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (onFilterChange && product.category) {
                    onFilterChange.setCategory(product.category.id);
                  }
                }}
              >
                {product.category.name}
              </button>
            )}
            {product.secondary_category && (
              <button
                className="tag-subtle hover:bg-accent/20 dark:hover:bg-accent/25 hover:text-accent-dark dark:hover:text-accent hover:border-accent/40 dark:hover:border-accent/50 dark:hover:shadow-accent/10 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-sm active:scale-95"
                title={t('filters_tooltip.subcategory', {
                  name: product.secondary_category.name,
                })}
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (onFilterChange && product.secondary_category) {
                    onFilterChange.setCategory(product.secondary_category.id);
                  }
                }}
              >
                {product.secondary_category.name}
              </button>
            )}
            {product.producer && (
              <button
                className={cn(
                  getProductContextClass(product),
                  'cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-sm hover:brightness-110 active:scale-95'
                )}
                title={t('filters_tooltip.producer', {
                  name: product.producer.name,
                })}
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (onFilterChange && product.producer) {
                    onFilterChange.setProducer(product.producer.id);
                  }
                }}
              >
                {product.producer.name}
              </button>
            )}
            {product.partner_source && (
              <span className="tag-subtle">{product.partner_source}</span>
            )}
            {/* Tags cliquables */}
            {product.tags?.slice(0, 3).map(tag => (
              <button
                key={tag}
                className="bg-muted/50 dark:bg-muted/30 text-muted-foreground dark:text-muted-foreground border-muted/60 dark:border-muted/40 hover:bg-muted dark:hover:bg-muted/60 hover:text-foreground dark:hover:text-foreground hover:border-muted-foreground/80 dark:hover:border-muted-foreground/60 inline-flex cursor-pointer items-center rounded-md border px-2 py-1 text-xs transition-all duration-200 hover:scale-105 hover:shadow-sm active:scale-95 dark:hover:shadow-black/20"
                title={t('filters_tooltip.tag', { tag })}
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (onFilterChange) {
                    onFilterChange.addTag(tag);
                  }
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </DataCard.Content>
        <DataCard.Footer>{actions}</DataCard.Footer>
      </DataCard>
    );

  return (
    <DataListItem href={`/admin/products/${product.id}`}>
      <DataListItem.Header>
        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex-shrink-0">
            <ProductImage
              alt={product.name}
              blurDataURL={(product as any).cover_blur_data_url || undefined}
              blurHash={(product as any).cover_blur_hash || undefined}
              fallbackType="placeholder"
              size="xs"
              src={product.images?.[0]}
            />
          </div>
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <h3 className="text-foreground truncate text-lg leading-tight font-semibold tracking-tight">
              {product.name}
            </h3>

            <span className="text-muted-foreground/80 font-mono text-xs tracking-wider uppercase">
              {product.slug}
            </span>

            {product.featured && (
              <button
                className="hover:text-accent pointer-events-auto cursor-pointer transition-all duration-200 hover:scale-110 hover:drop-shadow-sm active:scale-95"
                title={t('filters_tooltip.featured')}
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeFocusFromParent(e);
                  if (onFilterChange) {
                  }
                }}
              >
                <Star className="text-accent-subtle h-4 w-4 fill-current" />
              </button>
            )}
          </div>
        </div>
      </DataListItem.Header>
      <DataListItem.Content>
        <div className="space-y-3">
          {/* Métriques principales */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="bg-accent/10 flex h-5 w-5 items-center justify-center rounded">
                <Zap className="text-accent h-3 w-3" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-foreground text-base font-bold tracking-tight tabular-nums">
                  {product.price_points}
                </span>
                <span className="text-muted-foreground/70 text-xs font-medium tracking-wide uppercase">
                  {t('stock.points_label')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-muted/40 flex h-5 w-5 items-center justify-center rounded">
                <Box className="text-muted-foreground h-3 w-3" />
              </div>
              <span className="text-foreground text-sm font-semibold tracking-tight tabular-nums">
                {product.stock_quantity ?? 0}
              </span>
            </div>

            {product.producer && (
              <button
                className="text-muted-foreground dark:text-muted-foreground pointer-events-auto flex cursor-pointer items-center gap-2 transition-all duration-200 hover:scale-105 hover:shadow-sm hover:brightness-110 active:scale-95 dark:hover:shadow-black/20 dark:hover:brightness-125"
                title={t('filters_tooltip.producer', {
                  name: product.producer.name,
                })}
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeFocusFromParent(e);
                  if (onFilterChange && product.producer) {
                    onFilterChange.setProducer(product.producer.id);
                  }
                }}
              >
                <User className="h-4 w-4" />
                <span className="max-w-[120px] truncate text-sm leading-relaxed font-medium">
                  {product.producer.name}
                </span>
              </button>
            )}
          </div>

          {/* Badges et tags cliquables */}
          <div className="flex flex-wrap gap-2">
            {product.category && (
              <button
                className="badge-subtle hover:bg-primary/15 dark:hover:bg-primary/20 hover:text-primary dark:hover:text-primary hover:border-primary/30 dark:hover:border-primary/40 dark:hover:shadow-primary/10 pointer-events-auto cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-sm active:scale-95"
                title={t('filters_tooltip.category', {
                  name: product.category.name,
                })}
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeFocusFromParent(e);
                  if (onFilterChange && product.category) {
                    onFilterChange.setCategory(product.category.id);
                  }
                }}
              >
                {product.category.name}
              </button>
            )}
            {product.secondary_category && (
              <button
                className="tag-subtle hover:bg-accent/20 dark:hover:bg-accent/25 hover:text-accent-dark dark:hover:text-accent hover:border-accent/40 dark:hover:border-accent/50 dark:hover:shadow-accent/10 pointer-events-auto cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-sm active:scale-95"
                title={t('filters_tooltip.subcategory', {
                  name: product.secondary_category.name,
                })}
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeFocusFromParent(e);
                  if (onFilterChange && product.secondary_category) {
                    onFilterChange.setCategory(product.secondary_category.id);
                  }
                }}
              >
                {product.secondary_category.name}
              </button>
            )}
            {product.partner_source && (
              <span className="tag-subtle">{product.partner_source}</span>
            )}
            {/* Tags cliquables */}
            {product.tags?.slice(0, 4).map(tag => (
              <button
                key={tag}
                className="bg-muted/50 dark:bg-muted/30 text-muted-foreground dark:text-muted-foreground border-muted/60 dark:border-muted/40 hover:bg-muted dark:hover:bg-muted/60 hover:text-foreground dark:hover:text-foreground hover:border-muted-foreground/80 dark:hover:border-muted-foreground/60 pointer-events-auto inline-flex cursor-pointer items-center rounded-md border px-2.5 py-1 text-xs leading-tight font-medium tracking-wide transition-all duration-200 hover:scale-105 hover:shadow-sm active:scale-95 dark:hover:shadow-black/20"
                title={t('filters_tooltip.tag', { tag })}
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeFocusFromParent(e);
                  if (onFilterChange) {
                    onFilterChange.addTag(tag);
                  }
                }}
              >
                {tag}
              </button>
            ))}
            {product.tags && product.tags.length > 4 && (
              <span className="text-muted-foreground/60 inline-flex items-center px-2 py-0.5 text-xs font-medium tracking-wide">
                {t('other_tags', { count: product.tags.length - 4 })}
              </span>
            )}
          </div>
        </div>
      </DataListItem.Content>
      <DataListItem.Actions>{actions}</DataListItem.Actions>
    </DataListItem>
  );
};
