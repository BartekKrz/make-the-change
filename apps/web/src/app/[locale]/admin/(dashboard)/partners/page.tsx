'use client';

import { partnerStatusLabels } from '@make-the-change/api/validators/partner';
import { Building2, Mail, Plus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { type FC } from 'react';

import { Badge } from '@/app/[locale]/admin/(dashboard)/components/badge';
import { AdminPageContainer } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-page-container';
import { AdminPageHeader } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-page-header';
import { AdminPagination } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-pagination';
import { PartnerListItem } from '@/app/[locale]/admin/(dashboard)/components/partners/partner-list-item';
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

const statusOptions = Object.entries(partnerStatusLabels).map(
  ([value, label]) => ({ value, label })
);

const AdminPartnersPage: FC = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string | undefined>();
  const [view, setView] = useState<ViewMode>('grid');

  const { data, isLoading, isFetching, refetch } =
    trpc.admin.partners.list.useQuery(
      { q: search || undefined, status: status as any },
      { retry: false, keepPreviousData: true }
    );

  return (
    <AdminPageContainer>
      <AdminPageHeader>
        <Input
          className="max-w-xs"
          placeholder="Rechercher par nom ou email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <SimpleSelect
          className="w-[180px]"
          options={statusOptions}
          placeholder="Filtrer par statut"
          value={status}
          onValueChange={setStatus}
        />
        {(isLoading || isFetching) && (
          <span aria-live="polite" className="text-muted-foreground text-xs">
            Chargement…
          </span>
        )}

        <Link href="/admin/partners/new">
          <Button className="flex items-center gap-2" size="sm">
            <Plus className="h-4 w-4" />
            Nouveau partenaire
          </Button>
        </Link>
        <ViewToggle
          availableViews={['grid', 'list']}
          value={view}
          onChange={setView}
        />
      </AdminPageHeader>
      {view === 'grid' ? (
        <DataList
          gridCols={3}
          isLoading={isLoading}
          items={data?.items ?? []}
          emptyState={{
            icon: Building2,
            title: 'Aucun partenaire trouvé',
            description:
              'Aucun partenaire ne correspond à vos filtres. Essayez de les modifier ou créez un nouveau partenaire.',
            action: (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSearch('');
                  setStatus(undefined);
                  refetch();
                }}
              >
                Réinitialiser les filtres
              </Button>
            ),
          }}
          renderItem={(partner: any) => (
            <DataCard href={`/admin/partners/${partner.id}`}>
              <DataCard.Header>
                <DataCard.Title>
                  <div className="flex items-center gap-2">
                    <Building2 className="text-muted-foreground h-4 w-4" />
                    <span className="font-medium">{partner.name}</span>
                    <Badge
                      color={
                        partner.status === 'active'
                          ? 'green'
                          : (partner.status === 'pending'
                            ? 'yellow'
                            : 'gray')
                      }
                    >
                      {
                        partnerStatusLabels[
                          partner.status as keyof typeof partnerStatusLabels
                        ]
                      }
                    </Badge>
                  </div>
                </DataCard.Title>
              </DataCard.Header>
              <DataCard.Content>
                <div className="text-muted-foreground flex items-center gap-3 text-sm">
                  <Mail className="h-3.5 w-3.5" />
                  <span>{partner.contact_email}</span>
                </div>
              </DataCard.Content>
            </DataCard>
          )}
        />
      ) : isLoading ? (
        <div className="py-8 text-center">
          <p className="text-muted-foreground">Chargement des partenaires...</p>
        </div>
      ) : (data?.items?.length ?? 0) === 0 ? (
        <div className="py-8 text-center">
          <Building2 className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <h3 className="text-foreground mb-2 text-lg font-medium">
            Aucun partenaire trouvé
          </h3>
          <p className="text-muted-foreground mb-4">
            Aucun partenaire ne correspond à vos filtres.
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSearch('');
              setStatus(undefined);
              refetch();
            }}
          >
            Réinitialiser les filtres
          </Button>
        </div>
      ) : (
        <ListContainer>
          {(data?.items ?? []).map(partner => (
            <PartnerListItem key={partner.id} partner={partner} />
          ))}
        </ListContainer>
      )}

      <AdminPagination
        pagination={
          (data?.items.length ?? 0) > 0
            ? {
                currentPage: 1,
                pageSize: data?.items.length ?? 0,
                totalItems: data?.total ?? 0,
                totalPages: 1,
              }
            : undefined
        }
      />
    </AdminPageContainer>
  );
};

export default AdminPartnersPage;
