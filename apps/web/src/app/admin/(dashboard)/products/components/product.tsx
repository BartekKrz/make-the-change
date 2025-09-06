'use client';
import { ProductImage } from "@/components/images/product-image";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { FC, useRef, useCallback } from "react";
import { Package, Star, Zap, Box, User } from "lucide-react";
import { DataCard, DataListItem } from "@/app/admin/(dashboard)/components/ui/data-list";
import { getInitials } from "@/app/admin/(dashboard)/components/ui/format-utils";
import { Badge } from "@/app/admin/(dashboard)/components/ui/badge";
import type { RouterOutputs, RouterInputs } from '@/lib/trpc';

type ProductUpdateInput = RouterInputs['admin']['products']['update']['patch'];

type ProductProps = {
  product: RouterOutputs['admin']['products']['list']['items'][number];
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

const getProductContextClass = (product: any) => {
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
    onMutate: async ({ id, patch }: { id: string; patch: any }) => {
      await utils.admin.products.list.cancel();
      const previousData = utils.admin.products.list.getData(queryParams);

      if (previousData?.items) {
        const updatedData = {
          ...previousData,
          items: previousData.items.map((product: any) => 
            product.id === id ? { ...product, ...patch } : product
          )
        };
        utils.admin.products.list.setData(queryParams, updatedData);
      }
      return { previousData, queryKey: queryParams };
    },
    onError: (_err: any, _variables: any, context: any) => {
      if (context?.previousData && context.queryKey) {
        utils.admin.products.list.setData(context.queryKey, context.previousData);
      }
    },
  });
  
  const debouncedMutation = useCallback((patch: ProductUpdateInput, delay = 500) => {
    if (pendingRequest.current) {
      clearTimeout(pendingRequest.current);
    }

    const currentData = utils.admin.products.list.getData(queryParams);
    
    if (currentData?.items) {
      const optimisticData = {
        ...currentData,
        items: currentData.items.map((p: any) => 
          p.id === product.id ? { ...p, ...patch } : p
        )
      };
      utils.admin.products.list.setData(queryParams, optimisticData);
    }

    pendingRequest.current = setTimeout(() => {
      updateProduct.mutate({ id: product.id, patch });
      pendingRequest.current = null;
    }, delay);
  }, [product.id, updateProduct, utils, queryParams]);

  const adjustStock = useCallback((delta: number) => {
    const currentStock = product.stock_quantity || 0;
    const newStock = Math.max(0, currentStock + delta);
    if (newStock === currentStock) return;
    debouncedMutation({ stock_quantity: newStock });
  }, [product.stock_quantity, debouncedMutation]);

  
  const toggleActive = useCallback(() => {
    const newActive = !product.is_active;
    debouncedMutation({ is_active: newActive }, 300);
  }, [product.is_active, debouncedMutation]);

  const actions = (
    <div className="flex items-center gap-1 md:gap-2 flex-wrap">
      <Button size="sm" variant="outline" className="action-primary control-button" 
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustStock(1); }}>
        +1
      </Button>
      <Button disabled={product.stock_quantity === 0} size="sm" variant="outline" className="action-primary control-button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustStock(-1); }}>
        -1
      </Button>
      
      <Button size="sm" variant="outline" className="action-primary control-button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleActive(); }}>
        {product.is_active ? 'Off' : 'On'}
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
            <span className={`tag-subtle ${!product.is_active ? 'text-red-600' : ''}`}>
              {product.is_active ? 'actif' : 'inactif'}
            </span>
            
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
  </div>
      </DataListItem.Content>
      <DataListItem.Actions>
        {actions}
      </DataListItem.Actions>
    </DataListItem>
  );
};