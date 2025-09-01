"use client"

import { useParams } from 'next/navigation'
import { trpc } from '@/lib/trpc'
import { useMemo } from 'react'
import { FC } from 'react'
import { supabase } from '@/supabase/client'
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
      await utils.admin.products.detail.cancel({ productId })
      await utils.admin.products.list.cancel()

      const prevDetail = utils.admin.products.detail.getData({ productId })
      const prevList = utils.admin.products.list.getData()

      if (prevDetail) {
        utils.admin.products.detail.setData({ productId }, { ...prevDetail, ...vars.patch })
      }

      if (prevList) {
        utils.admin.products.list.setData(undefined, {
          ...prevList,
          items: prevList.items.map(p => p.id === productId ? { ...p, ...vars.patch } : p)
        })
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
      console.error('Erreur lors de la mise à jour:', error)
      alert('Erreur lors de la sauvegarde')
    },
    onSettled: () => {
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
    if (product) {
      update.mutate({ id: productId, patch })
    } else {
      console.log('Mode mock - sauvegarde simulée:', patch)
      alert('Sauvegarde simulée (mode développement)')
    }
  }

  const handleImageUpload = async (file: File) => {
    const bucket = 'product-images'
    const path = `${productId}/${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true })
    if (error) {
      alert('Upload échoué: ' + error.message)
      throw error
    }
    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    const url = data.publicUrl
    const currentImages = productData.images || []
    const newImages = [...currentImages, url]
    await handleSave({ images: newImages })
  }

  const handleImageRemove = async (url: string) => {
    const currentImages = productData.images || []
    const newImages = currentImages.filter((img: string) => img !== url)
    await handleSave({ images: newImages })
  }

  return (
    <ProductDetailController
      productData={productData}
      onSave={handleSave}
      onImageUpload={handleImageUpload}
      onImageRemove={handleImageRemove}
    />
  )
}

export default AdminProductEditPage
