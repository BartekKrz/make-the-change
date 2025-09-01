'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { trpc } from '@/lib/trpc'
import { DataList, DataCard } from '@/app/admin/(dashboard)/components/ui/data-list'
import { ListContainer } from '@/app/admin/(dashboard)/components/ui/list-container'
import { PartnerListItem } from '@/app/admin/(dashboard)/components/partners/partner-list-item'
import { Badge } from '@/app/admin/(dashboard)/components/badge'
import { AdminPageContainer } from '@/app/admin/(dashboard)/components/layout/admin-page-container'
import { AdminPageHeader } from '@/app/admin/(dashboard)/components/layout/admin-page-header'
import { AdminPagination } from '@/app/admin/(dashboard)/components/layout/admin-pagination'
import { ViewToggle, type ViewMode } from '@/app/admin/(dashboard)/components/ui/view-toggle'
import { Button } from '@/app/admin/(dashboard)/components/ui/button'
import { Input } from '@/app/admin/(dashboard)/components/ui/input'
import { SimpleSelect } from '@/app/admin/(dashboard)/components/ui/select'
import { Building2, Mail, Plus } from 'lucide-react'
import { partnerStatusLabels } from '@make-the-change/api/validators/partner';
import { FC } from 'react'

const statusOptions = Object.entries(partnerStatusLabels).map(([value, label]) => ({ value, label }));

const AdminPartnersPage: FC = () => {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<string | undefined>(undefined)
  const [view, setView] = useState<ViewMode>('grid')

  const { data, isLoading, isFetching, refetch } = trpc.admin.partners.list.useQuery(
    { q: search || undefined, status: status as any },
    { retry: false, keepPreviousData: true }
  )

  return (
    <AdminPageContainer>
      <AdminPageHeader>
        <Input
          placeholder="Rechercher par nom ou email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <SimpleSelect
          placeholder="Filtrer par statut"
          value={status}
          onValueChange={setStatus}
          options={statusOptions}
          className="w-[180px]"
        />
        {(isLoading || isFetching) && <span className="text-xs text-muted-foreground" aria-live="polite">Chargement…</span>}

        <Link href="/admin/partners/new">
          <Button size="sm" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouveau partenaire
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
          items={data?.items ?? []}
          isLoading={isLoading}
          gridCols={3}
          emptyState={{
            icon: Building2,
            title: 'Aucun partenaire trouvé',
            description: 'Aucun partenaire ne correspond à vos filtres. Essayez de les modifier ou créez un nouveau partenaire.',
            action: (
              <Button size="sm" variant="outline" onClick={() => { setSearch(''); setStatus(undefined); refetch(); }}>
                Réinitialiser les filtres
              </Button>
            )
          }}
          renderItem={(partner: any) => (
            <DataCard href={`/admin/partners/${partner.id}`}>
              <DataCard.Header>
                <DataCard.Title>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{partner.name}</span>
                    <Badge color={partner.status === 'active' ? 'green' : partner.status === 'pending' ? 'yellow' : 'gray'}>
                      {partnerStatusLabels[partner.status as keyof typeof partnerStatusLabels]}
                    </Badge>
                  </div>
                </DataCard.Title>
              </DataCard.Header>
              <DataCard.Content>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{partner.contact_email}</span>
                </div>
              </DataCard.Content>
            </DataCard>
          )}
        />
      ) : (
        isLoading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Chargement des partenaires...</p>
          </div>
        ) : (data?.items?.length ?? 0) === 0 ? (
          <div className="text-center py-8">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Aucun partenaire trouvé</h3>
            <p className="text-muted-foreground mb-4">Aucun partenaire ne correspond à vos filtres.</p>
            <Button size="sm" variant="outline" onClick={() => { setSearch(''); setStatus(undefined); refetch(); }}>
              Réinitialiser les filtres
            </Button>
          </div>
        ) : (
          <ListContainer>
            {(data?.items ?? []).map((partner) => (
              <PartnerListItem key={partner.id} partner={partner} />
            ))}
          </ListContainer>
        )
      )}

      <AdminPagination
        pagination={(data?.items.length ?? 0) > 0 ? {
          currentPage: 1,
          pageSize: data?.items.length ?? 0,
          totalItems: data?.total ?? 0,
          totalPages: 1,
        } : undefined}
      />
    </AdminPageContainer>
  )
}

export default AdminPartnersPage
