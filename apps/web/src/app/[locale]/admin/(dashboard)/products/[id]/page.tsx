"use client"

import { type FC, useCallback, useTransition, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { RouterOutputs, trpc, type RouterInputs } from '@/lib/trpc'
import { ProductDetailController } from '@/app/[locale]/admin/(dashboard)/products/[id]/components/product-detail-controller'
import { useToast } from '@/hooks/use-toast'
import type { ProductFormData } from '@/lib/validators/product'
import { EmptyState } from '@/app/[locale]/admin/(dashboard)/components/ui/empty-state'
import { Button } from '@/components/ui/button'
import { Package } from 'lucide-react'
import type { TRPCClientErrorLike } from '@trpc/client'
import type { AppRouter } from '@make-the-change/api'


const isValidProductId = (id: string | undefined): id is string => {
  return typeof id === 'string' && id.length > 0
}

type ProductItem = RouterOutputs['admin']['products']['list']['items'][number];
type UpdateProductInput = RouterInputs['admin']['products']['update'];
type ProductDetail = RouterOutputs['admin']['products']['detail'];

const AdminProductEditPage: FC = () => {
  const params = useParams<{ id: string }>()
  const productId = params?.id
  const utils = trpc.useUtils()
  const { toast } = useToast()
  const [isPendingSave, startSaveTransition] = useTransition()

  
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
      staleTime: 2 * 60 * 1000, 
      retry: (failureCount, error) => {
        
        if (error?.data?.httpStatus === 404 || (error?.data?.httpStatus && error.data.httpStatus < 500)) {
          return false
        }
        return failureCount < 2
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30_000)
    }
  )

  const updateMutation = trpc.admin.products.update.useMutation({
    onMutate: async (variables: UpdateProductInput) => {
      const { id, patch } = variables
      
      await utils.admin.products.detail.cancel({ productId: id })
      await utils.admin.products.list.cancel()
      
      const prevDetail = utils.admin.products.detail.getData({ productId: id })
      
      if (prevDetail) {
        utils.admin.products.detail.setData({ productId: id }, { ...prevDetail, ...patch })
      }
      
      return { prevDetail }
    },
    onError: (
      err: TRPCClientErrorLike<AppRouter>, 
      variables: UpdateProductInput, 
      context?: { prevDetail?: ProductDetail }
    ) => {
      if (context?.prevDetail) {
        utils.admin.products.detail.setData({ productId: variables.id }, context.prevDetail)
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
    onSettled: (
      _data: ProductDetail | undefined,
      _error: TRPCClientErrorLike<AppRouter> | null,
      variables: UpdateProductInput
    ) => {
      utils.admin.products.detail.invalidate({ productId: variables.id })
      utils.admin.products.list.invalidate()
    }
  })
  
  const updateProduct = useMemo(() => ({
    mutate: ({ id, patch }: UpdateProductInput) => {
      updateMutation.mutate({ id, patch })
    },
    isPending: updateMutation.isPending
  }), [updateMutation])

  
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

  
  const queryState = {
    isInitialLoading: isLoading && !product,
    isRefetching: isFetching && !!product,
    isSaving: updateProduct.isPending || isPendingSave,
    hasError: !!error
  }

  
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

  
  if (queryState.isInitialLoading) return (
    <div className="p-8">
      <EmptyState
        variant="muted"
        icon={Package}
        title="Chargement du produit"
        description="Veuillez patienter pendant le chargement des données..."
      />
    </div>
  )

  
  if (!product) return (
    <div className="p-8">
      <EmptyState
        variant="muted"
        icon={Package}
        title="Produit non trouvé"
        description="Le produit demandé n'existe pas dans la base de données."
      />
    </div>
  )

  return (
    <ProductDetailController
      productData={product}
      onSave={handleSave}
    />
  )
}

export default AdminProductEditPage