"use client"

import { useState, useEffect, type FC } from 'react'
import { DataList, DataCard } from '@/app/admin/(dashboard)/components/ui/data-list'
import { ListContainer } from '@/app/admin/(dashboard)/components/ui/list-container'
import { SubscriptionListItem } from '@/app/admin/(dashboard)/components/subscriptions/subscription-list-item'
import { Badge } from '@/app/admin/(dashboard)/components/badge'
import { CreditCard, User, Plus, Settings, Euro, Calendar } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/admin/(dashboard)/components/ui/card'
import { Input } from '@/app/admin/(dashboard)/components/ui/input'
import { Button } from '@/components/ui/button'
import { SimpleSelect } from '@/app/admin/(dashboard)/components/ui/select'

import { AdminPageContainer } from '@/app/admin/(dashboard)/components/layout/admin-page-container'
import { AdminPageHeader } from '@/app/admin/(dashboard)/components/layout/admin-page-header'
import { AdminPagination } from '@/app/admin/(dashboard)/components/layout/admin-pagination'
import { ViewToggle, type ViewMode } from '@/app/admin/(dashboard)/components/ui/view-toggle'
import { trpc } from '@/lib/trpc'

const AdminSubscriptionsPage: FC = () => {
  const { toast } = useToast()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'active' | 'cancelled' | 'suspended' | 'past_due' | undefined>(undefined)
  const [subscriptionTier, setSubscriptionTier] = useState<'ambassadeur_standard' | 'ambassadeur_premium' | undefined>(undefined)
  const utils = trpc.useUtils()

  const handleStatusChange = (value: string) => {
    setStatus(value as 'active' | 'cancelled' | 'suspended' | 'past_due' | undefined)
  }

  const handleTierChange = (value: string) => {
    setSubscriptionTier(value as 'ambassadeur_standard' | 'ambassadeur_premium' | undefined)
  }

  const [view, setView] = useState<ViewMode>('grid')
  const [cursor, setCursor] = useState<string | undefined>(undefined)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 20

  const [subscriptions, setSubscriptions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFetching, setIsFetching] = useState(false)

  const { data, isLoading: trpcLoading, isFetching: trpcFetching, refetch } = trpc.admin.subscriptions.list.useQuery(
    { search: search || undefined, status: status || undefined, subscriptionTier: subscriptionTier || undefined, limit: 20, page: currentPage },
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
      setSubscriptions(data.items || [])
    }
  }, [data])

  const createSubscription = trpc.admin.subscriptions.create.useMutation({
    onMutate: async () => {
      await utils.admin.subscriptions.list.cancel()

      const prevData = utils.admin.subscriptions.list.getData({ search: search || undefined, status: status || undefined, subscriptionTier: subscriptionTier || undefined, limit: 20, page: currentPage })
      return { prevData }
    },
    onSuccess: () => {
      utils.admin.subscriptions.list.invalidate()
      toast({ variant: 'success', title: 'Abonnement créé' })
    },
    onError: (e, vars, ctx) => {
      if (ctx?.prevData) {
        utils.admin.subscriptions.list.setData({ search: search || undefined, status: status || undefined, subscriptionTier: subscriptionTier || undefined, limit: 20, page: currentPage }, ctx.prevData)
      }
      toast({ variant: 'destructive', title: 'Création échouée', description: e.message })
    },
    onSettled: () => {
      utils.admin.subscriptions.list.invalidate()
    }
  })

  const updateSubscription = trpc.admin.subscriptions.update.useMutation({
    onMutate: async (vars) => {
      await utils.admin.subscriptions.list.cancel()
      const prev = utils.admin.subscriptions.list.getData({ search: search || undefined, status: status || undefined, subscriptionTier: subscriptionTier || undefined, limit: 20, page: currentPage })
      if (prev) {
        utils.admin.subscriptions.list.setData({ search: search || undefined, status: status || undefined, subscriptionTier: subscriptionTier || undefined, limit: 20, page: currentPage }, {
          ...prev,
          items: prev.items.map((s: any) => (s.id === vars.id ? { ...s, ...vars.patch } : s)),
        } as any)
      }
      return { prev }
    },
    onError: (_e, _vars, ctx) => {
      if (ctx?.prev) utils.admin.subscriptions.list.setData({ search: search || undefined, status: status || undefined, subscriptionTier: subscriptionTier || undefined, limit: 20, page: currentPage }, ctx.prev as any)
      toast({ variant: 'destructive', title: 'Mise à jour échouée' })
    },
    onSuccess: () => toast({ variant: 'success', title: 'Abonnement mis à jour' }),
    onSettled: () => utils.admin.subscriptions.list.invalidate(),
  })

  return (
    <AdminPageContainer>
      <AdminPageHeader>
        <Input
          placeholder="Rechercher un abonnement..."
          value={search}
          onChange={(e) => setSearch((e.target as HTMLInputElement).value)}
          className="max-w-xs"
        />
        <SimpleSelect
          placeholder="Statut"
          value={status}
          onValueChange={handleStatusChange}
          options={[
            { value: 'active', label: 'Actif' },
            { value: 'cancelled', label: 'Annulé' },
            { value: 'suspended', label: 'Suspendu' },
            { value: 'past_due', label: 'En retard' },
          ]}
          className="w-[150px]"
        />
        <SimpleSelect
          placeholder="Niveau"
          value={subscriptionTier}
          onValueChange={handleTierChange}
          options={[
            { value: 'ambassadeur_standard', label: 'Standard' },
            { value: 'ambassadeur_premium', label: 'Premium' },
          ]}
          className="w-[150px]"
        />
        {(isLoading || isFetching) && <span className="text-xs text-muted-foreground" aria-live="polite">Chargement…</span>}

        <Link href="/admin/subscriptions/new">
          <Button size="sm" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouvel abonnement
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
          items={subscriptions}
          isLoading={isLoading}
          gridCols={3}
          emptyState={{
            title: 'Aucun abonnement trouvé',
            description: 'Aucun résultat pour ces filtres.',
            action: (
              <Button size="sm" variant="outline" onClick={() => { setSearch(''); setStatus(undefined); setSubscriptionTier(undefined); setCursor(undefined); refetch() }}>
                Réinitialiser les filtres
              </Button>
            )
          }}
          renderItem={(s: any) => (
            <DataCard href={`/admin/subscriptions/${s.id}`}>
              <DataCard.Header>
                <DataCard.Title>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">
                      {s.users?.user_profiles?.first_name} {s.users?.user_profiles?.last_name}
                    </span>
                    <Badge color={s.status === 'active' ? 'green' : 'gray'}>{s.status}</Badge>
                  </div>
                </DataCard.Title>
              </DataCard.Header>
              <DataCard.Content>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <User className="w-3.5 h-3.5" />
                  <span>{s.users?.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Settings className="w-3.5 h-3.5" />
                  <span>{s.subscription_tier}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Euro className="w-3.5 h-3.5" />
                  <span>€{s.amount_eur} / {s.billing_frequency === 'monthly' ? 'mois' : 'an'}</span>
                </div>
              </DataCard.Content>
              <DataCard.Footer>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={(e) => { e.preventDefault(); updateSubscription.mutate({ id: s.id, patch: { status: s.status === 'active' ? 'suspended' : 'active' } }) }}>{s.status === 'active' ? 'Suspendre' : 'Activer'}</Button>
                </div>
                <span className="text-xs text-muted-foreground">ID: {s.id}</span>
              </DataCard.Footer>
            </DataCard>
          )}
        />
      ) : (
        isLoading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Chargement des abonnements...</p>
          </div>
        ) : subscriptions.length === 0 ? (
          <div className="text-center py-8">
            <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Aucun abonnement trouvé</h3>
            <p className="text-muted-foreground mb-4">Aucun résultat pour ces filtres.</p>
            <Button size="sm" variant="outline" onClick={() => { setSearch(''); setStatus(undefined); setSubscriptionTier(undefined); setCursor(undefined); refetch() }}>
              Réinitialiser les filtres
            </Button>
          </div>
        ) : (
          <ListContainer>
            {subscriptions.map((subscription) => (
              <SubscriptionListItem
                key={subscription.id}
                subscription={subscription}
                actions={
                  <div className="flex items-center gap-2 flex-wrap">
                    <Button size="sm" variant="outline" onClick={(e) => { e.preventDefault(); updateSubscription.mutate({ id: subscription.id, patch: { status: subscription.status === 'active' ? 'suspended' : 'active' } }) }}>
                      {subscription.status === 'active' ? 'Suspendre' : 'Activer'}
                    </Button>
                  </div>
                }
              />
            ))}
          </ListContainer>
        )
      )}

      <AdminPagination
        pagination={subscriptions.length > pageSize ? {
          currentPage: currentPage,
          pageSize: pageSize,
          totalItems: subscriptions.length,
          totalPages: Math.ceil(subscriptions.length / pageSize)
        } : {
          currentPage: 1,
          pageSize: pageSize,
          totalItems: subscriptions.length,
          totalPages: 1
        }}
      />
    </AdminPageContainer>
  )
}

export default AdminSubscriptionsPage
