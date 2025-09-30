'use client';

import { ShoppingCart, User, Calendar, DollarSign } from 'lucide-react';
import { type FC } from 'react';
import { useState, useEffect } from 'react';

import { Badge } from '@/app/[locale]/admin/(dashboard)/components/badge';
import { AdminPageContainer } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-page-container';
import { AdminPageHeader } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-page-header';
import { AdminPagination } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-pagination';
import { OrderListItem } from '@/app/[locale]/admin/(dashboard)/components/orders/order-list-item';
import {
  DataList,
  DataCard,
} from '@/app/[locale]/admin/(dashboard)/components/ui/data-list';
import { Input } from '@/app/[locale]/admin/(dashboard)/components/ui/input';
import { ListContainer } from '@/app/[locale]/admin/(dashboard)/components/ui/list-container';
import { SimpleSelect } from '@/app/[locale]/admin/(dashboard)/components/ui/select';
import {
  ViewToggle,
  type ViewMode,
} from '@/app/[locale]/admin/(dashboard)/components/ui/view-toggle';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';

const AdminOrdersPage: FC = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'refunded'
    | undefined
  >();

  const [view, setView] = useState<ViewMode>('grid');
  const [cursor, setCursor] = useState<string | undefined>();
  const [currentPage] = useState(1);
  const pageSize = 20;

  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  const {
    data,
    isLoading: trpcLoading,
    isFetching: trpcFetching,
    refetch,
  } = trpc.admin.orders.list.useQuery(
    { status: status || undefined, limit: 20, cursor },
    { retry: false }
  );

  useEffect(() => {
    setIsLoading(trpcLoading);
    setIsFetching(trpcFetching);
  }, [trpcLoading, trpcFetching]);

  useEffect(() => {
    if (data) {
      setOrders(data.items);
    }
  }, [data]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': {
        return 'yellow';
      }
      case 'shipped': {
        return 'blue';
      }
      case 'delivered': {
        return 'green';
      }
      case 'cancelled': {
        return 'red';
      }
      default: {
        return 'gray';
      }
    }
  };

  return (
    <AdminPageContainer>
      <AdminPageHeader>
        <Input
          className="max-w-xs"
          placeholder="Rechercher par client ou ID"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <SimpleSelect
          className="w-[180px]"
          placeholder="Filtrer par statut"
          value={status}
          options={[
            { value: 'pending', label: 'En attente' },
            { value: 'shipped', label: 'Expédiée' },
            { value: 'delivered', label: 'Livrée' },
            { value: 'cancelled', label: 'Annulée' },
          ]}
          onValueChange={value =>
            setStatus(
              value as
                | 'pending'
                | 'confirmed'
                | 'processing'
                | 'shipped'
                | 'delivered'
                | 'cancelled'
                | 'refunded'
                | undefined
            )
          }
        />
        {(isLoading || isFetching) && (
          <span aria-live="polite" className="text-muted-foreground text-xs">
            Chargement…
          </span>
        )}

        <ViewToggle
          availableViews={['grid', 'list']}
          value={view}
          onChange={setView}
        />
      </AdminPageHeader>
      {view === 'grid' ? (
        <DataList
          gridCols={3}
          items={orders}
          emptyState={{
            title: 'Aucune commande',
            description: 'Aucun résultat pour ces filtres.',
            action: (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSearch('');
                  setStatus(undefined);
                  setCursor(undefined);
                  refetch();
                }}
              >
                Réinitialiser
              </Button>
            ),
          }}
          renderItem={(o: any) => (
            <DataCard href={`/admin/orders/${o.id}`}>
              <DataCard.Header>
                <DataCard.Title>
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="text-muted-foreground h-4 w-4" />
                    <span className="font-medium">
                      Commande #{o.id.slice(0, 8)}
                    </span>
                    <Badge color={getStatusColor(o.status)}>{o.status}</Badge>
                  </div>
                </DataCard.Title>
              </DataCard.Header>
              <DataCard.Content>
                <div className="text-muted-foreground flex items-center gap-3 text-sm">
                  <User className="h-3.5 w-3.5" />
                  <span>{o.customerName}</span>
                </div>
                <div className="text-muted-foreground flex items-center gap-3 text-sm">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{new Date(o.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-semibold">
                  <DollarSign className="h-3.5 w-3.5" />
                  <span>{(o.total ?? 0).toFixed(2)} €</span>
                </div>
              </DataCard.Content>
            </DataCard>
          )}
        />
      ) : isLoading ? (
        <div className="py-8 text-center">
          <p className="text-muted-foreground">Chargement des commandes...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="py-8 text-center">
          <ShoppingCart className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <h3 className="text-foreground mb-2 text-lg font-medium">
            Aucune commande
          </h3>
          <p className="text-muted-foreground mb-4">
            Aucun résultat pour ces filtres.
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSearch('');
              setStatus(undefined);
              setCursor(undefined);
              refetch();
            }}
          >
            Réinitialiser
          </Button>
        </div>
      ) : (
        <ListContainer>
          {orders.map(order => (
            <OrderListItem key={order.id} order={order} />
          ))}
        </ListContainer>
      )}

      <AdminPagination
        pagination={
          orders.length > pageSize
            ? {
                currentPage,
                pageSize,
                totalItems: orders.length,
                totalPages: Math.ceil(orders.length / pageSize),
              }
            : undefined
        }
      />
    </AdminPageContainer>
  );
};

export default AdminOrdersPage;
