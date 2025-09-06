'use client';
import { ProductImage } from "@/components/images/product-image";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { type FC, useRef, startTransition } from "react";
import { Package, Star, Zap, Box, User, Plus, Minus, Eye, EyeOff } from "lucide-react";
import { DataCard, DataListItem } from "@/app/admin/(dashboard)/components/ui/data-list";
import { getInitials } from "@/app/admin/(dashboard)/components/ui/format-utils";
import type { RouterOutputs, RouterInputs } from '@/lib/trpc';

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

export const Product: FC<ProductProps> = ({ product, view, queryParams }) => {
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
    <div className="flex items-center gap-2 flex-wrap">
      
      <div className="flex items-center rounded-lg border border-primary/20 overflow-hidden bg-primary/5 shadow-sm">
        <Button 
          size="sm" 
          variant="ghost" 
          className="h-10 px-3 rounded-none border-0 hover:bg-primary/15 transition-colors"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustStock(1); }}
          title="Augmenter le stock"
        >
          <Plus className="w-4 h-4 text-primary" />
        </Button>
        <div className="px-4 py-2 bg-primary/10 text-sm font-mono min-w-[3rem] text-center border-x border-primary/20 text-primary font-semibold">
          {product.stock_quantity || 0}
        </div>
        <Button 
          disabled={product.stock_quantity === 0}
          size="sm" 
          variant="ghost"
          className="h-10 px-3 rounded-none border-0 hover:bg-primary/15 disabled:opacity-50 transition-colors"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustStock(-1); }}
          title="Diminuer le stock"
        >
          <Minus className="w-4 h-4 text-primary" />
        </Button>
      </div>

      

      
      <Button 
        size="sm" 
        variant="outline" 
        className={`h-10 px-4 transition-all duration-200 ${
          product.is_active 
            ? 'bg-primary/12 border-primary/25 text-primary hover:bg-primary/18 shadow-sm' 
            : 'bg-muted/50 border-muted-foreground/20 text-muted-foreground hover:bg-muted/80'
        }`}
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleActive(); }}
        title={product.is_active ? "Masquer le produit" : "Afficher le produit"}
      >
        {product.is_active ? (
          <>
            <Eye className="w-4 h-4 mr-1" />
            Visible
          </>
        ) : (
          <>
            <EyeOff className="w-4 h-4 mr-1" />
            Masqué
          </>
        )}
      </Button>
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
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium">{product.name}</span>
            <span className="font-medium">{product.short_description}</span>
          </div>
        </DataCard.Title>
      </DataCard.Header>
      <DataCard.Content>
        <div className="flex items-center gap-4 flex-wrap text-sm">
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-data">{product.price_points} pts</span>
          </div>
          <div className="flex items-center gap-2">
            <Box className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-data">Stock: {product.stock_quantity ?? 0}</span>
          </div>
        </div>
          
        <div className="flex flex-wrap gap-2 mt-2">
          {product.category && (
            <span className="badge-subtle">
              {product.category.name}
            </span>
          )}
          {product.secondary_category && (
            <span className="tag-subtle">
              {product.secondary_category.name}
            </span>
          )}
          {product.producer && (
            <span className={getProductContextClass(product)}>
              {product.producer.name}
            </span>
          )}
          {product.partner_source && (
            <span className="tag-subtle">
              {product.partner_source}
            </span>
          )}
          {/* Affichage des tags */}
          {product.tags?.slice(0, 3).map(tag => (
            <span key={tag} className="inline-flex items-center px-2 py-1 text-xs bg-primary/10 text-primary border border-primary/20 rounded-md">
              {tag}
            </span>
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
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <h3 className="text-base font-medium text-foreground truncate">
                  {product.name}
                </h3>
        
                <span className="font-mono text-xs text-muted-foreground">{product.slug}</span>
        
                <span className={`tag-subtle ${!product.is_active ? 'text-red-600' : ''}`}>
                  {product.is_active ? 'actif' : 'inactif'}
                </span>
        
                {product.featured && <Star className="w-4 h-4 text-accent-subtle fill-current" />}
              </div>
            </div>
      </DataListItem.Header>
      <DataListItem.Content>
        <div className="space-y-2">
    <div className="flex items-center gap-4 flex-wrap">
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-data">{product.price_points} pts</span>
      </div>

      <div className="flex items-center gap-2">
        <Box className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-data">Stock: {product.stock_quantity ?? 0}</span>
      </div>

      {product.producer && (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{product.producer.name}</span>
        </div>
      )}
    </div>
    
    {/* Tags dans la vue liste */}
    {product.tags && product.tags.length > 0 && (
      <div className="flex flex-wrap gap-1 mt-2">
        {product.tags.slice(0, 4).map(tag => (
          <span key={tag} className="inline-flex items-center px-2 py-1 text-xs bg-primary/10 text-primary border border-primary/20 rounded-md">
            {tag}
          </span>
        ))}
      </div>
    )}
  </div>
      </DataListItem.Content>
      <DataListItem.Actions>
        {actions}
      </DataListItem.Actions>
    </DataListItem>
  );
};