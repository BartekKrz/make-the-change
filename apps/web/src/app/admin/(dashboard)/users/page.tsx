"use client"
import { DataList, DataCard } from '@/app/admin/(dashboard)/components/ui/data-list'
import { ListContainer } from '@/app/admin/(dashboard)/components/ui/list-container'
import { UserListItem } from '@/app/admin/(dashboard)/components/users/user-list-item'
import { Badge } from '@/app/admin/(dashboard)/components/badge'
import { User, Mail, Shield, Plus } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import { Input } from '@/app/admin/(dashboard)/components/ui/input'
import { Button } from '@/components/ui/button'
import { AdminPageContainer } from '@/app/admin/(dashboard)/components/layout/admin-page-container'
import { AdminPageHeader } from '@/app/admin/(dashboard)/components/layout/admin-page-header'
import { AdminPagination } from '@/app/admin/(dashboard)/components/layout/admin-pagination'
import { ViewToggle, type ViewMode } from '@/app/admin/(dashboard)/components/ui/view-toggle'
import { SimpleSelect } from '@/app/admin/(dashboard)/components/ui/select'
import { trpc } from '@/lib/trpc'
import { type FC, useState, useEffect } from 'react'

const AdminUsersPage: FC = () => {
  const { toast } = useToast()
  const [search, setSearch] = useState('')
  const [role, setRole] = useState<string | undefined>(undefined)
  const utils = trpc.useUtils()

  const [view, setView] = useState<ViewMode>('grid')
  const [cursor, setCursor] = useState<string | undefined>(undefined)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 20

  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFetching, setIsFetching] = useState(false)

  const { data, isLoading: trpcLoading, isFetching: trpcFetching, refetch } = trpc.admin.users.list.useQuery(
    { q: search || undefined, limit: 20, cursor },
    { retry: false }
  )

  useEffect(() => {
    setIsLoading(trpcLoading)
    setIsFetching(trpcFetching)
  }, [trpcLoading, trpcFetching])
  useEffect(() => {
    if (data) {
      setUsers(data.items);
    }
  }, [data]);

  const updateUser = trpc.admin.users.update.useMutation({
    onMutate: async (vars) => {
      await utils.admin.users.list.cancel()
      const prev = utils.admin.users.list.getData()
      if (prev) {
        utils.admin.users.list.setData(undefined, {
          ...prev,
          items: prev.items.map((u: any) => (u.id === vars.userId ? { ...u, ...vars.patch } : u)),
        } as any)
      }
      return { prev }
    },
    onError: (_e, _vars, ctx) => {
      if (ctx?.prev) utils.admin.users.list.setData(undefined, ctx.prev as any)
      toast({ variant: 'destructive', title: 'Mise à jour échouée' })
    },
    onSuccess: () => toast({ variant: 'success', title: 'Utilisateur mis à jour' }),
    onSettled: () => utils.admin.users.list.invalidate(),
  })

  const suspendUser = trpc.admin.users.suspend.useMutation({
    onSuccess: () => {
      toast({ variant: 'success', title: 'Utilisateur suspendu' })
      utils.admin.users.list.invalidate()
    },
    onError: (e) => toast({ variant: 'destructive', title: 'Erreur', description: e.message }),
  })

  const activateUser = trpc.admin.users.activate.useMutation({
    onSuccess: () => {
      toast({ variant: 'success', title: 'Utilisateur activé' })
      utils.admin.users.list.invalidate()
    },
    onError: (e) => toast({ variant: 'destructive', title: 'Erreur', description: e.message }),
  })

  return (
    <AdminPageContainer>
      <AdminPageHeader>
        <Input
          placeholder="Rechercher par nom ou email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <SimpleSelect
          placeholder="Filtrer par rôle"
          value={role}
          onValueChange={setRole}
          options={[
            { value: 'admin', label: 'Admin' },
            { value: 'user', label: 'User' },
          ]}
          className="w-[180px]"
        />
        {(isLoading || isFetching) && <span className="text-xs text-muted-foreground" aria-live="polite">Chargement…</span>}

        <Link href="/admin/users/new">
          <Button size="sm" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouvel utilisateur
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
          items={users}
          isLoading={isLoading}
          gridCols={3}
          emptyState={{
            title: 'Aucun utilisateur',
            description: 'Aucun résultat pour ces filtres.',
            action: (
              <Button size="sm" variant="outline" onClick={() => { setSearch(''); setRole(undefined); setCursor(undefined); refetch() }}>
                Réinitialiser
              </Button>
            )
          }}
          renderItem={(u: any) => (
            <DataCard href={`/admin/users/${u.id}`}>
              <DataCard.Header>
                <DataCard.Title>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{u.name}</span>
                    <Badge color={u.is_active ? 'green' : 'red'}>{u.is_active ? 'actif' : 'inactif'}</Badge>
                  </div>
                </DataCard.Title>
              </DataCard.Header>
              <DataCard.Content>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{u.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Shield className="w-3.5 h-3.5" />
                  <span>{u.role}</span>
                </div>
              </DataCard.Content>
              <DataCard.Footer>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault();
                      if (u.is_active) {
                        suspendUser.mutate({ userId: u.id, reason: 'Suspended by admin' });
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
      ) : (

        isLoading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Chargement des utilisateurs...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-8">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Aucun utilisateur</h3>
            <p className="text-muted-foreground mb-4">Aucun résultat pour ces filtres.</p>
            <Button size="sm" variant="outline" onClick={() => { setSearch(''); setRole(undefined); setCursor(undefined); refetch() }}>
              Réinitialiser
            </Button>
          </div>
        ) : (
          <ListContainer>
            {users.map((user) => (
              <UserListItem
                key={user.id}
                user={user}
                actions={
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.preventDefault();
                        if (user.is_active) {
                          suspendUser.mutate({ userId: user.id, reason: 'Suspended by admin' });
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
        )
      )}

      <AdminPagination
        pagination={users.length > pageSize ? {
          currentPage,
          pageSize,
          totalItems: users.length,
          totalPages: Math.ceil(users.length / pageSize)
        } : undefined}
      />
    </AdminPageContainer>
  )
}
export default AdminUsersPage
