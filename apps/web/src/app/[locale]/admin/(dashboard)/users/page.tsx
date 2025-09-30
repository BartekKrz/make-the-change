'use client';
import { User, Mail, Shield, Plus } from 'lucide-react';
import Link from 'next/link';
import { type FC, useState, useEffect } from 'react';

import { Badge } from '@/app/[locale]/admin/(dashboard)/components/badge';
import { AdminPageContainer } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-page-container';
import { AdminPageHeader } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-page-header';
import { AdminPagination } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-pagination';
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
import { UserListItem } from '@/app/[locale]/admin/(dashboard)/components/users/user-list-item';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { trpc } from '@/lib/trpc';

const AdminUsersPage: FC = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<string | undefined>();
  const utils = trpc.useUtils();

  const [view, setView] = useState<ViewMode>('grid');
  const [cursor, setCursor] = useState<string | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  const {
    data,
    isLoading: trpcLoading,
    isFetching: trpcFetching,
    refetch,
  } = trpc.admin.users.list.useQuery(
    { q: search || undefined, limit: 20, cursor },
    { retry: false }
  );

  useEffect(() => {
    setIsLoading(trpcLoading);
    setIsFetching(trpcFetching);
  }, [trpcLoading, trpcFetching]);
  useEffect(() => {
    if (data) {
      setUsers(data.items);
    }
  }, [data]);

  const updateUser = trpc.admin.users.update.useMutation({
    onMutate: async vars => {
      await utils.admin.users.list.cancel();
      const prev = utils.admin.users.list.getData();
      if (prev) {
        utils.admin.users.list.setData(undefined, {
          ...prev,
          items: prev.items.map((u: any) =>
            u.id === vars.userId ? { ...u, ...vars.patch } : u
          ),
        } as any);
      }
      return { prev };
    },
    onError: (_e, _vars, ctx) => {
      if (ctx?.prev) utils.admin.users.list.setData(undefined, ctx.prev as any);
      toast({ variant: 'destructive', title: 'Mise à jour échouée' });
    },
    onSuccess: () =>
      toast({ variant: 'success', title: 'Utilisateur mis à jour' }),
    onSettled: () => utils.admin.users.list.invalidate(),
  });

  const suspendUser = trpc.admin.users.suspend.useMutation({
    onSuccess: () => {
      toast({ variant: 'success', title: 'Utilisateur suspendu' });
      utils.admin.users.list.invalidate();
    },
    onError: e =>
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: e.message,
      }),
  });

  const activateUser = trpc.admin.users.activate.useMutation({
    onSuccess: () => {
      toast({ variant: 'success', title: 'Utilisateur activé' });
      utils.admin.users.list.invalidate();
    },
    onError: e =>
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: e.message,
      }),
  });

  return (
    <AdminPageContainer>
      <AdminPageHeader>
        <Input
          className="max-w-xs"
          placeholder="Rechercher par nom ou email"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <SimpleSelect
          className="w-[180px]"
          placeholder="Filtrer par rôle"
          value={role}
          options={[
            { value: 'admin', label: 'Admin' },
            { value: 'user', label: 'User' },
          ]}
          onValueChange={setRole}
        />
        {(isLoading || isFetching) && (
          <span aria-live="polite" className="text-muted-foreground text-xs">
            Chargement…
          </span>
        )}

        <Link href="/admin/users/new">
          <Button className="flex items-center gap-2" size="sm">
            <Plus className="h-4 w-4" />
            Nouvel utilisateur
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
          items={users}
          emptyState={{
            title: 'Aucun utilisateur',
            description: 'Aucun résultat pour ces filtres.',
            action: (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSearch('');
                  setRole(undefined);
                  setCursor(undefined);
                  refetch();
                }}
              >
                Réinitialiser
              </Button>
            ),
          }}
          renderItem={(u: any) => (
            <DataCard href={`/admin/users/${u.id}`}>
              <DataCard.Header>
                <DataCard.Title>
                  <div className="flex items-center gap-2">
                    <User className="text-muted-foreground h-4 w-4" />
                    <span className="font-medium">{u.name}</span>
                    <Badge color={u.is_active ? 'green' : 'red'}>
                      {u.is_active ? 'actif' : 'inactif'}
                    </Badge>
                  </div>
                </DataCard.Title>
              </DataCard.Header>
              <DataCard.Content>
                <div className="text-muted-foreground flex items-center gap-3 text-sm">
                  <Mail className="h-3.5 w-3.5" />
                  <span>{u.email}</span>
                </div>
                <div className="text-muted-foreground flex items-center gap-3 text-sm">
                  <Shield className="h-3.5 w-3.5" />
                  <span>{u.role}</span>
                </div>
              </DataCard.Content>
              <DataCard.Footer>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={e => {
                      e.preventDefault();
                      if (u.is_active) {
                        suspendUser.mutate({
                          userId: u.id,
                          reason: 'Suspended by admin',
                        });
                      } else {
                        activateUser.mutate({ userId: u.id });
                      }
                    }}
                  >
                    {u.is_active ? 'Suspendre' : 'Activer'}
                  </Button>
                </div>
              </DataCard.Footer>
            </DataCard>
          )}
        />
      ) : isLoading ? (
        <div className="py-8 text-center">
          <p className="text-muted-foreground">
            Chargement des utilisateurs...
          </p>
        </div>
      ) : users.length === 0 ? (
        <div className="py-8 text-center">
          <User className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <h3 className="text-foreground mb-2 text-lg font-medium">
            Aucun utilisateur
          </h3>
          <p className="text-muted-foreground mb-4">
            Aucun résultat pour ces filtres.
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSearch('');
              setRole(undefined);
              setCursor(undefined);
              refetch();
            }}
          >
            Réinitialiser
          </Button>
        </div>
      ) : (
        <ListContainer>
          {users.map(user => (
            <UserListItem
              key={user.id}
              user={user}
              actions={
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={e => {
                      e.preventDefault();
                      if (user.is_active) {
                        suspendUser.mutate({
                          userId: user.id,
                          reason: 'Suspended by admin',
                        });
                      } else {
                        activateUser.mutate({ userId: user.id });
                      }
                    }}
                  >
                    {user.is_active ? 'Suspendre' : 'Activer'}
                  </Button>
                </div>
              }
            />
          ))}
        </ListContainer>
      )}

      <AdminPagination
        pagination={
          users.length > pageSize
            ? {
                currentPage,
                pageSize,
                totalItems: users.length,
                totalPages: Math.ceil(users.length / pageSize),
              }
            : undefined
        }
      />
    </AdminPageContainer>
  );
};
export default AdminUsersPage;
