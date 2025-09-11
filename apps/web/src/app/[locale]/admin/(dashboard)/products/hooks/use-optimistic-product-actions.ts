import { useState } from 'react';

import { trpc } from '@/lib/trpc';

export const useOptimisticProductActions = (queryParams: {
  cursor?: string;
  limit: number;
  search?: string;
  activeOnly?: boolean;
  producerId?: string;
}) => {
  const [loadingActions, setLoadingActions] = useState<Record<string, string>>({});
  const utils = trpc.useUtils();

  const updateProduct = trpc.admin.products.update.useMutation({
    onMutate: async ({ id, patch }) => {
      await utils.admin.products.list.cancel();
      
      const queryKey = queryParams;
      const previousData = utils.admin.products.list.getData(queryKey);

      if (previousData?.items) {
        utils.admin.products.list.setData(queryKey, {
          ...previousData,
          items: previousData.items.map(product => 
            product.id === id ? { ...product, ...patch } : product
          )
        });
      }

      return { previousData, queryKey };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousData && context?.queryKey) {
        utils.admin.products.list.setData(context.queryKey, context.previousData);
      }
    },
    onSuccess: (updatedProduct, { id }) => {
      const currentData = utils.admin.products.list.getData(queryParams);
      if (currentData?.items) {
        utils.admin.products.list.setData(queryParams, {
          ...currentData,
          items: currentData.items.map(product => 
            product.id === id ? updatedProduct : product
          )
        });
      }
    },
  });

  const adjustStock = (productId: string, delta: number) => {
    const actionKey = `${productId}-stock-${delta > 0 ? 'inc' : 'dec'}`;
    setLoadingActions(prev => ({ ...prev, [actionKey]: 'pending' }));
    
    const currentData = utils.admin.products.list.getData(queryParams);
    const product = currentData?.items?.find(p => p.id === productId);
    
    if (product) {
      updateProduct.mutate({
        id: productId,
        patch: {
          stock_quantity: Math.max(0, (product.stock_quantity || 0) + delta)
        }
      }, {
        onSettled: () => {
          setLoadingActions(prev => {
            const { [actionKey]: _, ...rest } = prev;
            return rest;
          });
        }
      });
    }
  };

  const toggleFeature = (productId: string, currentFeatured: boolean) => {
    const actionKey = `${productId}-featured`;
    setLoadingActions(prev => ({ ...prev, [actionKey]: 'pending' }));
    
    updateProduct.mutate({
      id: productId,
      patch: { featured: !currentFeatured }
    }, {
      onSettled: () => {
        setLoadingActions(prev => {
          const { [actionKey]: _, ...rest } = prev;
          return rest;
        });
      }
    });
  };

  const toggleActive = (productId: string, currentActive: boolean) => {
    const actionKey = `${productId}-active`;
    setLoadingActions(prev => ({ ...prev, [actionKey]: 'pending' }));
    
    updateProduct.mutate({
      id: productId,
      patch: { is_active: !currentActive }
    }, {
      onSettled: () => {
        setLoadingActions(prev => {
          const { [actionKey]: _, ...rest } = prev;
          return rest;
        });
      }
    });
  };

  const isActionLoading = (productId: string, action: string) => {
    return !!loadingActions[`${productId}-${action}`];
  };

  return {
    adjustStock,
    toggleFeature,
    toggleActive,
    isActionLoading,
    isLoading: updateProduct.isPending,
  };
};