"use client"

import { useState, useEffect } from 'react'
import { trpc } from '@/lib/trpc'
import { DataList, DataCard } from '@/app/admin/(dashboard)/components/ui/data-list'
import { ListContainer } from '@/app/admin/(dashboard)/components/ui/list-container'
import { ProductListItem } from '@/app/admin/(dashboard)/components/products/product-list-item'
import { Badge } from '@/app/admin/(dashboard)/components/badge'
import { Box, Star, Package, Zap, Plus } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'

import { Input } from '@/app/admin/(dashboard)/components/ui/input'
import { Button } from '@/app/admin/(dashboard)/components/ui/button'

import { CheckboxWithLabel } from '@/app/admin/(dashboard)/components/ui/checkbox'
import { AdminPageContainer } from '@/app/admin/(dashboard)/components/layout/admin-page-container'
import { AdminPageHeader } from '@/app/admin/(dashboard)/components/layout/admin-page-header'
import { AdminPagination } from '@/app/admin/(dashboard)/components/layout/admin-pagination'
import { ViewToggle, type ViewMode } from '@/app/admin/(dashboard)/components/ui/view-toggle'
import { FC } from 'react'

const AdminProductsPage: FC = () => {
  const { toast } = useToast()
  const [search, setSearch] = useState('')
  const [activeOnly, setActiveOnly] = useState(false)
  const utils = trpc.useUtils()

  const [view, setView] = useState<ViewMode>('grid')
  const [cursor, setCursor] = useState<string | undefined>(undefined)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 20

  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFetching, setIsFetching] = useState(false)

  const { data, isLoading: trpcLoading, isFetching: trpcFetching, refetch } = trpc.admin.products.list.useQuery(
    { search: search || undefined, activeOnly, limit: 20, cursor },
    {
      retry: false
    }
  )

  useEffect(() => {
    setIsLoading(trpcLoading)
    setIsFetching(trpcFetching)
  }, [trpcLoading, trpcFetching])

  useEffect(() => {
    if (data) {
      setProducts(data.items || [])
    }
  }, [data])

  const createProduct = trpc.admin.products.create.useMutation({
    onSuccess: () => {
      utils.admin.products.list.invalidate()
      toast({ variant: 'success', title: 'Produit créé' })
    },
    onError: (e) => toast({ variant: 'destructive', title: 'Création échouée', description: e.message }),
  })

  const updateProduct = trpc.admin.products.update.useMutation({
    onMutate: async (vars) => {
      await utils.admin.products.list.cancel()
      const prev = utils.admin.products.list.getData()
      if (prev) {
        utils.admin.products.list.setData(undefined, {
          ...prev,
          items: prev.items.map((p: any) => (p.id === vars.id ? { ...p, ...vars.patch } : p)),
        } as any)
      }
      return { prev }
    },
    onError: (_e, _vars, ctx) => {
      if (ctx?.prev) utils.admin.products.list.setData(undefined, ctx.prev as any)
      toast({ variant: 'destructive', title: 'Mise à jour échouée' })
    },
    onSuccess: () => toast({ variant: 'success', title: 'Produit mis à jour' }),
    onSettled: () => utils.admin.products.list.invalidate(),
  })

  const adjustStock = trpc.admin.products.inventoryAdjust.useMutation({
    onMutate: async (vars) => {
      await utils.admin.products.list.cancel()
      const prev = utils.admin.products.list.getData()
      if (prev) {
        utils.admin.products.list.setData(undefined, {
          ...prev,
          items: prev.items.map((p: any) =>
            p.id === vars.productId ? { ...p, stock_quantity: Math.max(0, (p.stock_quantity ?? 0) + vars.delta) } : p
          ),
        } as any)
      }
      return { prev }
    },
    onError: (_e, _vars, ctx) => {
      if (ctx?.prev) utils.admin.products.list.setData(undefined, ctx.prev as any)
      toast({ variant: 'destructive', title: 'Ajustement de stock échoué' })
    },
    onSuccess: () => toast({ variant: 'success', title: 'Stock ajusté' }),
    onSettled: () => utils.admin.products.list.invalidate(),
  })
  return (
    <AdminPageContainer>
      <AdminPageHeader>
        <Input
          placeholder="Rechercher"
          value={search}
          onChange={(e) => setSearch((e.target as HTMLInputElement).value)}
          className="max-w-xs"
        />
        <CheckboxWithLabel
          checked={activeOnly}
          onCheckedChange={(v) => setActiveOnly(Boolean(v))}
          label="actifs"
        />
        {(isLoading || isFetching) && <span className="text-xs text-muted-foreground" aria-live="polite">Chargement…</span>}

        <Link href="/admin/products/new">
          <Button size="sm" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouveau produit
          </Button>
        </Link>
        <ViewToggle
          value={view}
          onChange={setView}
          availableViews={['grid', 'list']}
        />
      </AdminPageHeader>
      {view === 'grid' ? (
        <DataList
          items={products}
          isLoading={isLoading}
          gridCols={3}
          emptyState={{
            title: 'Aucun produit',
            description: 'Aucun résultat pour ces filtres.',
            action: (
              <Button size="sm" variant="outline" onClick={() => { setSearch(''); setActiveOnly(false); setCursor(undefined); refetch() }}>
                Réinitialiser
              </Button>
            )
          }}
          renderItem={(p: any) => (
            <DataCard href={`/admin/products/${p.id}`}>
              <DataCard.Header>
                <DataCard.Title>
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{p.name}</span>
                    <span className="font-mono text-xs text-muted-foreground">{p.slug}</span>
                    <Badge color={p.is_active ? 'green' : 'red'}>{p.is_active ? 'actif' : 'inactif'}</Badge>
                    {p.featured && <Star className="w-4 h-4 text-yellow-500" />}
                  </div>
                </DataCard.Title>
              </DataCard.Header>
              <DataCard.Content>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Zap className="w-3.5 h-3.5" />
                  <span>{p.price_points} pts</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Box className="w-3.5 h-3.5" />
                  <span>Stock: {p.stock_quantity ?? 0}</span>
                </div>
              </DataCard.Content>
              <DataCard.Footer>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={(e) => { e.preventDefault(); adjustStock.mutate({ productId: p.id, delta: 1 }) }}>+1</Button>
                  <Button size="sm" variant="outline" onClick={(e) => { e.preventDefault(); adjustStock.mutate({ productId: p.id, delta: -1 }) }}>-1</Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={(e) => { e.preventDefault(); updateProduct.mutate({ id: p.id, patch: { featured: !p.featured } }) }}>{p.featured ? 'Unfeature' : 'Feature'}</Button>
                  <Button size="sm" variant="outline" onClick={(e) => { e.preventDefault(); updateProduct.mutate({ id: p.id, patch: { is_active: !p.is_active } }) }}>{p.is_active ? 'Désactiver' : 'Activer'}</Button>
                </div>
              </DataCard.Footer>
            </DataCard>
          )}
        />
      ) : (
        isLoading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Chargement des produits...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Aucun produit</h3>
            <p className="text-muted-foreground mb-4">Aucun résultat pour ces filtres.</p>
            <Button size="sm" variant="outline" onClick={() => { setSearch(''); setActiveOnly(false); setCursor(undefined); refetch() }}>
              Réinitialiser
            </Button>
          </div>
        ) : (
          <ListContainer>
            {products.map((product) => (
              <ProductListItem
                key={product.id}
                product={product}
                actions={
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={(e) => { e.preventDefault(); adjustStock.mutate({ productId: product.id, delta: 1 }) }}>+1</Button>
                      <Button size="sm" variant="outline" onClick={(e) => { e.preventDefault(); adjustStock.mutate({ productId: product.id, delta: -1 }) }}>-1</Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={(e) => { e.preventDefault(); updateProduct.mutate({ id: product.id, patch: { featured: !product.featured } }) }}>
                        {product.featured ? 'Unfeature' : 'Feature'}
                      </Button>
                      <Button size="sm" variant="outline" onClick={(e) => { e.preventDefault(); updateProduct.mutate({ id: product.id, patch: { is_active: !product.is_active } }) }}>
                        {product.is_active ? 'Désactiver' : 'Activer'}
                      </Button>
                    </div>
                  </div>
                }
              />
            ))}
          </ListContainer>
        )
      )}

      <AdminPagination
        pagination={products.length > pageSize ? {
          currentPage,
          pageSize,
          totalItems: products.length,
          totalPages: Math.ceil(products.length / pageSize)
        } : undefined}
      />
    </AdminPageContainer>
  )
}

export default AdminProductsPage
