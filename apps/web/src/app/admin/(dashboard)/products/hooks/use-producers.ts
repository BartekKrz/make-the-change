import { useMemo } from 'react';
import { trpc } from '@/lib/trpc';

/**
 * Hook pour récupérer la liste des producteurs pour les filtres
 * Utilise l'endpoint dédié admin.products.producers au lieu de faire une requête générale
 */
export const useProducers = () => {
  const { data: producers, isLoading, error } = trpc.admin.products.producers.useQuery();

  const producersWithCounts = useMemo(() => {
    return producers || [];
  }, [producers]);

  return {
    producers: producersWithCounts,
    isLoading,
    error,
  };
};