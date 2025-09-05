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

  const toggleFeature = useCallback(() => {
    const newFeatured = !product.featured;
    debouncedMutation({ featured: newFeatured }, 300);
  }, [product.featured, debouncedMutation]);

  const toggleActive = useCallback(() => {
    const newActive = !product.is_active;
    debouncedMutation({ is_active: newActive }, 300);
  }, [product.is_active, debouncedMutation]);

  const actions = (
    <div className="flex items-center gap-1 md:gap-2 flex-wrap">
      <Button size="sm" variant="outline" className="control-button" 
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustStock(1); }}>
        +1
      </Button>
      <Button disabled={product.stock_quantity === 0} size="sm" variant="outline" className="control-button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustStock(-1); }}>
        -1
      </Button>
      <Button size="sm" variant="outline" className="control-button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFeature(); }}>
        {product.featured ? '★' : '☆'}
      </Button>
      <Button size="sm" variant="outline" className="control-button"
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
            <Badge color={product.is_active ? 'green' : 'red'}>
              {product.is_active ? 'actif' : 'inactif'}
            </Badge>
            {product.featured && <Star className="w-4 h-4 text-yellow-500" />}
          </div>
        </DataCard.Title>
      </DataCard.Header>
      <DataCard.Content>
        <div className="flex items-center gap-4 flex-wrap text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            <Zap className="w-3.5 h-3.5" />
            <span>{product.price_points} pts</span>
          </div>
          <div className="flex items-center gap-3">
            <Box className="w-3.5 h-3.5" />
            <span>Stock: {product.stock_quantity ?? 0}</span>
          </div>
        </div>
          
        <div className="flex flex-wrap gap-2 mt-2">
          {product.category && (
            <Badge color="green">
              {product.category.name}
            </Badge>
          )}
          {product.secondary_category && (
            <Badge color="gray">
              {product.secondary_category.name}
            </Badge>
          )}
          {product.producer && (
            <Badge color="blue">
              {product.producer.name}
            </Badge>
          )}
          {product.partner_source && (
            <Badge color="yellow">
              {product.partner_source}
            </Badge>
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
        
                <Badge color={product.is_active ? 'green' : 'red'}>
                  {product.is_active ? 'actif' : 'inactif'}
                </Badge>
        
                {product.featured && <Star className="w-4 h-4 text-yellow-500" />}
              </div>
            </div>
      </DataListItem.Header>
      <DataListItem.Content>
        <div className="space-y-2">
    <div className="flex items-center gap-4 flex-wrap">
      <div className="flex items-center gap-2 transition-colors duration-200 md:group-hover:text-foreground group-active:text-foreground">
        <Zap className="w-4 h-4 text-primary/70 md:group-hover:text-primary group-active:text-primary transition-colors duration-200" />
        <span className="text-sm">{product.price_points} pts</span>
      </div>

      <div className="flex items-center gap-2 transition-colors duration-200 md:group-hover:text-foreground group-active:text-foreground">
        <Box className="w-4 h-4 text-orange-500/70 md:group-hover:text-orange-500 group-active:text-orange-500 transition-colors duration-200" />
        <span className="text-sm">Stock: {product.stock_quantity ?? 0}</span>
      </div>

      {product.producer && (
        <div className="flex items-center gap-2 transition-colors duration-200 md:group-hover:text-foreground group-active:text-foreground">
          <User className="w-4 h-4 text-blue-500/70 md:group-hover:text-blue-500 group-active:text-blue-500 transition-colors duration-200" />
          <span className="text-sm">{product.producer.name}</span>
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