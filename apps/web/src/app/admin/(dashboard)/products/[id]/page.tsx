"use client"

import { useParams } from 'next/navigation'
import { trpc } from '@/lib/trpc'
import { useMemo } from 'react'
import { FC } from 'react'
import { ProductDetailController } from '@/app/admin/(dashboard)/products/[id]/components/product-detail-controller'

const AdminProductEditPage: FC = () => {
  const params = useParams<{ id: string }>()
  const productId = params?.id as string
  const utils = trpc.useUtils()

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
      console.log('🔄 TanStack Query onMutate - Début');
      console.log('📦 Variables reçues:', vars);
      console.log('🆔 ProductId:', productId);

      await utils.admin.products.detail.cancel({ productId })
      await utils.admin.products.list.cancel()

      const prevDetail = utils.admin.products.detail.getData({ productId })
      const prevList = utils.admin.products.list.getData()

      console.log('📊 Données précédentes - Detail:', prevDetail);
      console.log('📊 Données précédentes - List:', prevList ? prevList.items.length : 0, 'items');

      if (prevDetail) {
        const newDetail = { ...prevDetail, ...vars.patch };
        console.log('🔄 Mise à jour cache detail:', newDetail);
        utils.admin.products.detail.setData({ productId }, newDetail)
      }

      if (prevList) {
        const newList = {
          ...prevList,
          items: prevList.items.map(p => p.id === productId ? { ...p, ...vars.patch } : p)
        };
        console.log('🔄 Mise à jour cache list:', newList.items.length, 'items');
        utils.admin.products.list.setData(undefined, newList)
      }

      return { prevDetail, prevList }
    },
    onError: (error, vars, ctx) => {
      console.error('❌ TanStack Query onError:', error);
      console.error('❌ Variables:', vars);
      console.error('❌ Contexte:', ctx);

      if (ctx?.prevDetail) {
        console.log('🔄 Rollback cache detail');
        utils.admin.products.detail.setData({ productId }, ctx.prevDetail)
      }
      if (ctx?.prevList) {
        console.log('🔄 Rollback cache list');
        utils.admin.products.list.setData(undefined, ctx.prevList)
      }

      alert(`Erreur lors de la sauvegarde: ${error.message || 'Erreur inconnue'}`)
    },
    onSuccess: (data, vars) => {
      console.log('✅ TanStack Query onSuccess:', data);
      console.log('✅ Variables utilisées:', vars);
    },
    onSettled: () => {
      console.log('🔄 TanStack Query onSettled - Invalidation des queries');
      utils.admin.products.detail.invalidate({ productId })
      utils.admin.products.list.invalidate()
    }
  })

  const productData = useMemo(() => {
    return product || null
  }, [product])

  if (!productId) return <div className="p-8">Missing productId</div>
  if (isLoading && !productData) return <div className="p-8">Chargement…</div>
  if (!productData) return <div className="p-8">Produit non trouvé</div>

  const handleSave = async (patch: any) => {
    console.log('💾 HandleSave called with patch:', patch);
    
    if (product) {
      console.log('🔄 Calling update.mutate with:', { id: productId, patch });
      update.mutate({ id: productId, patch })
    } else {
      console.log('⚠️ No product - mock mode');
      console.log('Mode mock - sauvegarde simulée:', patch)
      alert('Sauvegarde simulée (mode développement)')
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
