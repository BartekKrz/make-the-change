"use client"

import { type FC, useCallback, useTransition, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { RouterOutputs, trpc } from '@/lib/trpc'
import { ProductDetailController } from '@/app/admin/(dashboard)/products/[id]/components/product-detail-controller'
import { useToast } from '@/hooks/use-toast'
import type { ProductFormData } from '@/lib/validators/product'
import { EmptyState } from '@/app/admin/(dashboard)/components/ui/empty-state'
import { Button } from '@/components/ui/button'
import { Package } from 'lucide-react'


const isValidProductId = (id: string | undefined): id is string => {
  return typeof id === 'string' && id.length > 0
}
type ProductItem = RouterOutputs['admin']['products']['list']['items'][number];

const AdminProductEditPage: FC = () => {
  const params = useParams<{ id: string }>()
  const productId = params?.id
  const utils = trpc.useUtils()
  const { toast } = useToast()
  const [isPendingSave, startSaveTransition] = useTransition()

  // Define queries and mutations first
  const { 
    data: product, 
    isLoading, 
    isFetching,
    error, 
    refetch 
  } = trpc.admin.products.detail.useQuery(
    { productId: productId! },
    {
      enabled: isValidProductId(productId),
      staleTime: 2 * 60 * 1000, // 2 minutes - product details change less frequently
      retry: (failureCount, error) => {
        // Don't retry on 404 or client errors
        if (error?.data?.httpStatus === 404 || (error?.data?.httpStatus && error.data.httpStatus < 500)) {
          return false
        }
        return failureCount < 2
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30_000)
    }
  )

  const updateMutation = trpc.admin.products.update.useMutation({
    onMutate: async ({ id, patch }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await utils.admin.products.detail.cancel({ productId: id })
      await utils.admin.products.list.cancel()
      
      // Snapshot the previous values
      const prevDetail = utils.admin.products.detail.getData({ productId: id })
      
      // Optimistically update the detail cache
      if (prevDetail) {
        utils.admin.products.detail.setData({ productId: id }, { ...prevDetail, ...patch })
      }
      
      return { prevDetail }
    },
    onError: (err, _variables, context) => {
      // If the mutation fails, use the context to rollback
      if (context?.prevDetail) {
        utils.admin.products.detail.setData({ productId: _variables.id }, context.prevDetail)
      }
      
      toast({
        variant: 'destructive',
        title: 'Erreur de sauvegarde',
        description: err.message || 'Une erreur inconnue est survenue lors de la sauvegarde.',
      })
    },
    onSuccess: () => {
      toast({
        variant: 'default',
        title: 'Produit mis à jour',
        description: 'Les modifications ont été sauvegardées avec succès.',
      })
    },
    onSettled: (_data, _error, variables) => {
      // Always refetch after error or success to ensure consistency
      utils.admin.products.detail.invalidate({ productId: variables.id })
      utils.admin.products.list.invalidate()
    }
  })
  
  const updateProduct = useMemo(() => ({
    mutate: ({ id, patch }: { id: string, patch: any }) => {
      updateMutation.mutate({ id, patch })
    },
    isPending: updateMutation.isPending
  }), [updateMutation])

  // Handle save callback after mutation definition
  const handleSave = useCallback(async (patch: Partial<ProductFormData>) => {
    if (isValidProductId(productId)) {
      startSaveTransition(() => {
        updateProduct.mutate({ id: productId, patch })
      })
    }
  }, [productId, updateProduct])
  
  if (!isValidProductId(productId)) {
    return (
      <div className="p-8">
        <EmptyState
          variant="muted"
          icon={Package}
          title="ID de produit manquant"
          description="L'identifiant du produit n'est pas valide ou manquant dans l'URL."
        />
      </div>
    )
  }

  // Query state for better UX feedback
  const queryState = {
    isInitialLoading: isLoading && !product,
    isRefetching: isFetching && !!product,
    isSaving: updateProduct.isPending || isPendingSave,
    hasError: !!error
  }

  // Enhanced error handling with retry capability
  if (error) {
    const isNotFound = error.data?.httpStatus === 404
    const isServerError = error.data?.httpStatus && error.data.httpStatus >= 500
    
    return (
      <div className="p-8">
        <EmptyState
          variant="muted"
          icon={Package}
          title={isNotFound ? 'Produit non trouvé' : 'Erreur de chargement'}
          description={
            isNotFound 
              ? 'Le produit demandé n\'existe pas ou a été supprimé.' 
              : error.message || 'Une erreur est survenue lors du chargement du produit.'
          }
          action={
            isServerError ? (
              <Button size="sm" variant="outline" onClick={() => refetch()}>
                Réessayer
              </Button>
            ) : undefined
          }
        />
      </div>
    )
  }

  // Loading state with better UX
  if (queryState.isInitialLoading) {
    return (
      <div className="p-8">
        <EmptyState
          variant="muted"
          icon={Package}
          title="Chargement du produit"
          description="Veuillez patienter pendant le chargement des données..."
        />
      </div>
    )
  }

  // Product not found after successful load
  if (!product) {
    return (
      <div className="p-8">
        <EmptyState
          variant="muted"
          icon={Package}
          title="Produit non trouvé"
          description="Le produit demandé n'existe pas dans la base de données."
        />
      </div>
    )
  }

  return (
    <ProductDetailController
      productData={product}
      onSave={handleSave}
    />
  )
}

export default AdminProductEditPage