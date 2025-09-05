'use client'

import { useState, useEffect } from 'react'
import { type FC } from 'react'
import { trpc } from '@/lib/trpc'
import { DataList, DataCard } from '@/app/admin/(dashboard)/components/ui/data-list'
import { ListContainer } from '@/app/admin/(dashboard)/components/ui/list-container'
import { OrderListItem } from '@/app/admin/(dashboard)/components/orders/order-list-item'
import { Badge } from '@/app/admin/(dashboard)/components/badge'
import { ShoppingCart, User, Calendar, DollarSign } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Input } from '@/app/admin/(dashboard)/components/ui/input'
import { Button } from '@/app/admin/(dashboard)/components/ui/button'
import { AdminPageContainer } from '@/app/admin/(dashboard)/components/layout/admin-page-container'
import { AdminPageHeader } from '@/app/admin/(dashboard)/components/layout/admin-page-header'
import { AdminPagination } from '@/app/admin/(dashboard)/components/layout/admin-pagination'
import { ViewToggle, type ViewMode } from '@/app/admin/(dashboard)/components/ui/view-toggle'
import { SimpleSelect } from '@/app/admin/(dashboard)/components/ui/select'

const AdminOrdersPage: FC = () => {
  const { toast } = useToast()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded' | undefined>(undefined)
  const utils = trpc.useUtils()

  const [view, setView] = useState<ViewMode>('grid')
  const [cursor, setCursor] = useState<string | undefined>(undefined)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 20

  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFetching, setIsFetching] = useState(false)

  const { data, isLoading: trpcLoading, isFetching: trpcFetching, refetch } = trpc.admin.orders.list.useQuery(
    { status: status || undefined, limit: 20, cursor },
    { retry: false }
  )

  useEffect(() => {
    setIsLoading(trpcLoading)
    setIsFetching(trpcFetching)
  }, [trpcLoading, trpcFetching])

  useEffect(() => {
    if (data) {
      setOrders(data.items);
    }
  }, [data])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'yellow'
      case 'shipped': return 'blue'
      case 'delivered': return 'green'
      case 'cancelled': return 'red'
      default: return 'gray'
    }
  }

  return (
    <AdminPageContainer>
      <AdminPageHeader>
        <Input
          placeholder="Rechercher par client ou ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <SimpleSelect
          placeholder="Filtrer par statut"
          value={status}
          onValueChange={(value) => setStatus(value as 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded' | undefined)}
          options={[
            { value: 'pending', label: 'En attente' },
            { value: 'shipped', label: 'Expédiée' },
            { value: 'delivered', label: 'Livrée' },
            { value: 'cancelled', label: 'Annulée' },
          ]}
          className="w-[180px]"
        />
        {(isLoading || isFetching) && <span className="text-xs text-muted-foreground" aria-live="polite">Chargement…</span>}

        <ViewToggle
          value={view}
          onChange={setView}
          availableViews={['grid', 'list']}
        />
      </AdminPageHeader>
      {view === 'grid' ? (
        <DataList
          items={orders}
          gridCols={3}
          emptyState={{
            title: 'Aucune commande',
            description: 'Aucun résultat pour ces filtres.',
            action: (
              <Button size="sm" variant="outline" onClick={() => { setSearch(''); setStatus(undefined); setCursor(undefined); refetch() }}>
                Réinitialiser
              </Button>
            )
          }}
          renderItem={(o: any) => (
            <DataCard href={`/admin/orders/${o.id}`}>
              <DataCard.Header>
                <DataCard.Title>
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Commande #{o.id.substring(0, 8)}</span>
                    <Badge color={getStatusColor(o.status)}>{o.status}</Badge>
                  </div>
                </DataCard.Title>
              </DataCard.Header>
              <DataCard.Content>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <User className="w-3.5 h-3.5" />
                  <span>{o.customerName}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(o.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-semibold">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>{(o.total ?? 0).toFixed(2)} €</span>
                </div>
              </DataCard.Content>
            </DataCard>
          )}
        />
      ) : (
        isLoading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Chargement des commandes...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Aucune commande</h3>
            <p className="text-muted-foreground mb-4">Aucun résultat pour ces filtres.</p>
            <Button size="sm" variant="outline" onClick={() => { setSearch(''); setStatus(undefined); setCursor(undefined); refetch() }}>
              Réinitialiser
            </Button>
          </div>
        ) : (
          <ListContainer>
            {orders.map((order) => (
              <OrderListItem key={order.id} order={order} />
            ))}
          </ListContainer>
        )
      )}

      <AdminPagination
        pagination={orders.length > pageSize ? {
          currentPage: currentPage,
          pageSize: pageSize,
          totalItems: orders.length,
          totalPages: Math.ceil(orders.length / pageSize)
        } : undefined}
      />
    </AdminPageContainer>
  )
}

export default AdminOrdersPage
