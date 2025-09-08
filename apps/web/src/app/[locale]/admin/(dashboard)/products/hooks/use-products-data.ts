import { useMemo } from 'react';
import { trpc } from '@/lib/trpc';

type UseProductsDataOptions = {
  cursor?: string;
  limit: number;
  search?: string;
  activeOnly?: boolean;
  producerId?: string;
}

export const useProductsData = (options: UseProductsDataOptions) => {
  const { 
    data: productsData,
    isLoading, 
    isFetching,
    refetch 
  } = trpc.admin.products.list.useQuery({
    cursor: options.cursor,
    limit: options.limit,
    search: options.search || undefined,
    activeOnly: options.activeOnly || undefined,
    producerId: options.producerId,
  });

  // Extraire les producteurs uniques des produits récupérés
  const producers = useMemo(() => {
    if (!productsData?.items) return [];
    
    const uniqueProducers = new Map();
    productsData.items.forEach(product => {
      if (product.producer && product.producer.id && product.producer.name) {
        uniqueProducers.set(product.producer.id, {
          id: product.producer.id,
          name: product.producer.name
        });
      }
    });
    
    return Array.from(uniqueProducers.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [productsData]);

  // Calculer les infos de pagination
  const paginationInfo = useMemo(() => {
    const products = productsData?.items || [];
    const total = productsData?.total || 0;
    const hasNextPage = !!productsData?.nextCursor;
    const hasPreviousPage = !!options.cursor;
    
    // Pour cursor-based pagination, on ne peut pas calculer une page exacte
    // On utilise une approximation basée sur le nombre d'éléments récupérés
    const estimatedCurrentPage = Math.floor((total - products.length) / options.limit) + 1;
    const totalPages = Math.ceil(total / options.limit);
    
    return {
      products,
      total,
      hasNextPage,
      hasPreviousPage,
      currentPage: Math.max(1, estimatedCurrentPage),
      totalPages,
      nextCursor: productsData?.nextCursor,
    };
  }, [productsData, options.limit, options.cursor]);

  return {
    ...paginationInfo,
    producers,
    isLoading,
    isFetching,
    refetch,
  };
};