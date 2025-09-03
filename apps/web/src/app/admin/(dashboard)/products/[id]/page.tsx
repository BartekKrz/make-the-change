
"use client"

import { useParams } from 'next/navigation'
import { trpc } from '@/lib/trpc'
import { FC } from 'react'
import { ProductDetailController } from '@/app/admin/(dashboard)/products/[id]/components/product-detail-controller'
import { useToast } from '@/hooks/use-toast'
import type { ProductFormData } from '@/lib/validators/product'

const AdminProductEditPage: FC = () => {
  const params = useParams<{ id: string }>()
  const productId = params?.id as string
  const utils = trpc.useUtils()
  const { toast } = useToast()

  const { data: product, isLoading, error } = trpc.admin.products.detail.useQuery(
    { productId },
    {
      enabled: !!productId,
      retry: 1,
      retryDelay: 500
    }
  )

  const update = trpc.admin.products.update.useMutation({
    onMutate: async (vars) => {
      await utils.admin.products.detail.cancel({ productId })
      await utils.admin.products.list.cancel()

      const prevDetail = utils.admin.products.detail.getData({ productId })
      const prevList = utils.admin.products.list.getData()

      if (prevDetail) {
        const newDetail = { ...prevDetail, ...vars.patch };
        utils.admin.products.detail.setData({ productId }, newDetail)
      }

      if (prevList) {
        const newList = {
          ...prevList,
          items: prevList.items.map(p => p.id === productId ? { ...p, ...vars.patch } : p)
        };
        utils.admin.products.list.setData(undefined, newList)
      }

      return { prevDetail, prevList }
    },
    onError: (error, vars, ctx) => {
      if (ctx?.prevDetail) {
        utils.admin.products.detail.setData({ productId }, ctx.prevDetail)
      }
      if (ctx?.prevList) {
        utils.admin.products.list.setData(undefined, ctx.prevList)
      }

      toast({
        variant: 'destructive',
        title: 'Erreur de sauvegarde',
        description: error.message || 'Une erreur inconnue est survenue.',
      })
    },
    onSettled: () => {
      utils.admin.products.detail.invalidate({ productId })
      utils.admin.products.list.invalidate()
    }
  })

  const productData = product || null

  if (!productId) return <div className="p-8">ID de produit manquant</div>
  if (isLoading && !productData) return <div className="p-8">Chargement…</div>
  if (error || !productData) return <div className="p-8">Produit non trouvé</div>

  const handleSave = async (patch: Partial<ProductFormData>) => {
    if (product) {
      update.mutate({ id: productId, patch })
    }
  }

  return (
    <ProductDetailController
      productData={productData}
      onSave={handleSave}
    />
  )
}

export default AdminProductEditPage
