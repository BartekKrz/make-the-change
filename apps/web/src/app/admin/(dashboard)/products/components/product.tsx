'use client';
import { ProductImage } from "@/components/images/product-image";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { type FC, useRef, startTransition } from "react";
import { Package, Star, Zap, Box, User, Plus, Minus, Eye, EyeOff } from "lucide-react";
import { DataCard, DataListItem } from "@/app/admin/(dashboard)/components/ui/data-list";
import { getInitials } from "@/app/admin/(dashboard)/components/ui/format-utils";
import type { RouterOutputs, RouterInputs } from '@/lib/trpc';
import { cn } from "@/lib/utils";

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
  
  if (name.includes('miel') || name.includes('honey') || category.includes('miel')) {
    return 'badge-honey';
  }
  if (name.includes('huile') || name.includes('olive') || name.includes('oil')) {
    return 'badge-olive';
  }
  if (name.includes('eau') || name.includes('water') || name.includes('aqua') || producer.includes('ocean')) {
    return 'badge-ocean';
  }
  if (producer.includes('terre') || category.includes('agriculture') || name.includes('terre')) {
    return 'badge-earth';
  }
  return 'badge-accent-subtle';
};

export const Product: FC<ProductProps> = ({ product, view, queryParams, onFilterChange }) => {
  const pendingRequest = useRef<NodeJS.Timeout | null>(null);
  const utils = trpc.useUtils();
  
  const updateProduct = trpc.admin.products.update.useMutation({
    onMutate: async ({ id, patch }) => {
      await utils.admin.products.list.cancel();
      const previousData = utils.admin.products.list.getData(queryParams);

      
      utils.admin.products.list.setData(queryParams, (old) => {
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
          })
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
          })
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
    <div className="flex items-center justify-between w-full gap-4">
      <div className="flex items-center gap-3">
        {/* Stock Control */}
        <div className="inline-flex items-center bg-white border border-border rounded-xl shadow-sm overflow-hidden group">
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-10 px-3 rounded-none border-0 text-muted-foreground hover:text-primary hover:bg-primary/8 transition-all duration-200 active:scale-95"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustStock(1); }}
            title="Augmenter le stock"
            aria-label="Augmenter le stock"
          >
            <Plus className="w-4 h-4" />
          </Button>
          
          <div className="relative px-4 py-2 min-w-[4rem] text-center border-x border-border bg-muted/30">
            <span className="text-sm font-semibold tabular-nums text-foreground">
              {product.stock_quantity || 0}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          
          <Button 
            disabled={product.stock_quantity === 0}
            size="sm" 
            variant="ghost"
            className="h-10 px-3 rounded-none border-0 text-muted-foreground hover:text-destructive hover:bg-destructive/8 disabled:hover:text-muted-foreground disabled:hover:bg-transparent transition-all duration-200 active:scale-95"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustStock(-1); }}
            title="Diminuer le stock"
            aria-label="Diminuer le stock"
          >
            <Minus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Visibility Toggle */}
      <div className="flex items-center gap-2">
        <div 
          className={cn(
            "relative inline-flex h-6 w-11 cursor-pointer rounded-full border-2 transition-all duration-200 ease-in-out focus-within:ring-2 focus-within:ring-primary/20",
            product.is_active 
              ? "bg-success border-success shadow-sm" 
              : "bg-muted border-border hover:bg-muted/80"
          )}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleActive(); }}
          role="switch"
          aria-checked={product.is_active ? "true" : "false"}
          aria-label={product.is_active ? "Masquer le produit" : "Afficher le produit"}
          tabIndex={0}
          onKeyDown={(e) => {
            if (!(e.key === 'Enter' || e.key === ' ')) return;
            e.preventDefault();
            e.stopPropagation();
            toggleActive();
          }}
        >
          <span
            className={cn(
              "inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out",
              product.is_active ? "translate-x-5" : "translate-x-0"
            )}
          />
        </div>
        
        <div className="flex items-center gap-1.5 text-sm">
          <div className={cn(
            "flex items-center justify-center transition-colors duration-200",
            product.is_active ? "text-success" : "text-muted-foreground"
          )}>
            {product.is_active ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </div>
          <span className={cn(
            "font-medium transition-colors duration-200",
            product.is_active ? "text-foreground" : "text-muted-foreground"
          )}>
            {product.is_active ? "Visible" : "Masqué"}
          </span>
        </div>
      </div>
    </div>
  );

  if (view === 'grid') return (
    <DataCard href={`/admin/products/${product.id}`}>
      <DataCard.Header>
        <DataCard.Title 
          icon={Package} 
          image={product.images?.[0]} 
          imageAlt={product.name} 
          images={product.images || undefined}
        >
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-semibold text-lg leading-tight tracking-tight">{product.name}</span>
            <span className="font-medium text-xs text-muted-foreground/80 leading-relaxed">{product.short_description}</span>
          </div>
        </DataCard.Title>
      </DataCard.Header>
      <DataCard.Content>
        <div className="flex items-center gap-4 flex-wrap text-sm">
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-muted-foreground" />
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-base text-foreground tabular-nums tracking-tight">{product.price_points}</span>
              <span className="text-xs font-medium text-muted-foreground/70 uppercase tracking-wide">pts</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Box className="w-3.5 h-3.5 text-muted-foreground" />
            <div className="flex items-baseline gap-1">
              <span className="font-semibold text-sm text-foreground tabular-nums tracking-tight">{product.stock_quantity ?? 0}</span>
              <span className="text-xs font-medium text-muted-foreground/70 uppercase tracking-wide">stock</span>
            </div>
          </div>
        </div>
          
        <div className="flex flex-wrap gap-2 mt-2">
          {product.category && (
            <button 
              className="badge-subtle hover:bg-primary/15 hover:text-primary hover:border-primary/30 hover:shadow-sm hover:scale-105 transition-all duration-200 cursor-pointer active:scale-95"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onFilterChange && product.category) {
                  onFilterChange.setCategory(product.category.id);
                }
              }}
              title={`Filtrer par catégorie: ${product.category.name}`}
            >
              {product.category.name}
            </button>
          )}
          {product.secondary_category && (
            <button 
              className="tag-subtle hover:bg-accent/20 hover:text-accent-dark hover:border-accent/40 hover:shadow-sm hover:scale-105 transition-all duration-200 cursor-pointer active:scale-95"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onFilterChange && product.secondary_category) {
                  onFilterChange.setCategory(product.secondary_category.id);
                }
              }}
              title={`Filtrer par sous-catégorie: ${product.secondary_category.name}`}
            >
              {product.secondary_category.name}
            </button>
          )}
          {product.producer && (
            <button 
              className={cn(
                getProductContextClass(product),
                "hover:shadow-sm hover:scale-105 hover:brightness-110 transition-all duration-200 cursor-pointer active:scale-95"
              )}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onFilterChange && product.producer) {
                  onFilterChange.setProducer(product.producer.id);
                }
              }}
              title={`Filtrer par producteur: ${product.producer.name}`}
            >
              {product.producer.name}
            </button>
          )}
          {product.partner_source && (
            <span className="tag-subtle">
              {product.partner_source}
            </span>
          )}
          {/* Tags cliquables */}
          {product.tags?.slice(0, 3).map(tag => (
            <button 
              key={tag} 
              className="inline-flex items-center px-2 py-1 text-xs bg-muted/50 text-muted-foreground border border-muted/60 rounded-md hover:bg-muted hover:text-foreground hover:border-muted-foreground/80 hover:shadow-sm hover:scale-105 transition-all duration-200 cursor-pointer active:scale-95"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onFilterChange) {
                  onFilterChange.addTag(tag);
                }
              }}
              title={`Filtrer par tag: ${tag}`}
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
                  src={product.images?.[0]}
                  alt={product.name}
                  size="xs"
                  fallbackType="initials"
                  initials={getInitials(product.name)}
                />
              </div>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-foreground truncate leading-tight tracking-tight">
                  {product.name}
                </h3>
        
                <span className="font-mono text-xs text-muted-foreground/80 tracking-wider uppercase">{product.slug}</span>
        
             
                {product.featured && (
                  <button
                    className="transition-all duration-200 hover:scale-110 hover:text-accent hover:drop-shadow-sm active:scale-95 cursor-pointer pointer-events-auto"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (onFilterChange) {
                        console.log('Filter by featured products');
                      }
                    }}
                    title="Filtrer par produits mis en avant"
                  >
                    <Star className="w-4 h-4 text-accent-subtle fill-current" />
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
              <div className="flex items-center justify-center w-5 h-5 rounded bg-accent/10">
                <Zap className="w-3 h-3 text-accent" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-bold text-foreground tabular-nums tracking-tight">{product.price_points}</span>
                <span className="text-xs font-medium text-muted-foreground/70 uppercase tracking-wide">pts</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-5 h-5 rounded bg-muted/40">
                <Box className="w-3 h-3 text-muted-foreground" />
              </div>
              <span className="text-sm font-semibold text-foreground tabular-nums tracking-tight">{product.stock_quantity ?? 0}</span>
            </div>

            {product.producer && (
              <button
                className="flex items-center gap-2 text-muted-foreground hover:shadow-sm hover:brightness-110 hover:scale-105 transition-all duration-200 cursor-pointer active:scale-95 pointer-events-auto"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (onFilterChange && product.producer) {
                    onFilterChange.setProducer(product.producer.id);
                  }
                }}
                title={`Filtrer par producteur: ${product.producer.name}`}
              >
                <User className="w-4 h-4" />
                <span className="text-sm font-medium truncate max-w-[120px] leading-relaxed">
                  {product.producer.name}
                </span>
              </button>
            )}
          </div>

          {/* Badges et tags cliquables */}
          <div className="flex flex-wrap gap-2">
            {product.category && (
              <button 
                className="badge-subtle hover:bg-primary/15 hover:text-primary hover:border-primary/30 hover:shadow-sm hover:scale-105 transition-all duration-200 cursor-pointer active:scale-95 pointer-events-auto"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (onFilterChange && product.category) {
                    onFilterChange.setCategory(product.category.id);
                  }
                }}
                title={`Filtrer par catégorie: ${product.category.name}`}
              >
                {product.category.name}
              </button>
            )}
            {product.secondary_category && (
              <button 
                className="tag-subtle hover:bg-accent/20 hover:text-accent-dark hover:border-accent/40 hover:shadow-sm hover:scale-105 transition-all duration-200 cursor-pointer active:scale-95 pointer-events-auto"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (onFilterChange && product.secondary_category) {
                    onFilterChange.setCategory(product.secondary_category.id);
                  }
                }}
                title={`Filtrer par sous-catégorie: ${product.secondary_category.name}`}
              >
                {product.secondary_category.name}
              </button>
            )}
            {product.partner_source && (
              <span className="tag-subtle">
                {product.partner_source}
              </span>
            )}
            {/* Tags cliquables */}
            {product.tags?.slice(0, 4).map(tag => (
              <button 
                key={tag} 
                className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-muted/50 text-muted-foreground border border-muted/60 rounded-md hover:bg-muted hover:text-foreground hover:border-muted-foreground/80 hover:shadow-sm hover:scale-105 transition-all duration-200 cursor-pointer active:scale-95 pointer-events-auto tracking-wide leading-tight"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (onFilterChange) {
                    onFilterChange.addTag(tag);
                  }
                }}
                title={`Filtrer par tag: ${tag}`}
              >
                {tag}
              </button>
            ))}
            {product.tags && product.tags.length > 4 && (
              <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium text-muted-foreground/60 tracking-wide">
                +{product.tags.length - 4} autres
              </span>
            )}
          </div>
        </div>
      </DataListItem.Content>
      <DataListItem.Actions>
        {actions}
      </DataListItem.Actions>
    </DataListItem>
  );
};