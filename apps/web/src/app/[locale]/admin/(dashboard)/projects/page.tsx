
"use client"

import { Box, Star, Package, Plus, Target, User, MapPin } from 'lucide-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useState, useEffect, type FC } from 'react'

import { Badge } from '@/app/[locale]/admin/(dashboard)/components/badge'
import { AdminPageContainer } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-page-container'
import { AdminPageHeader } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-page-header'
import { AdminPagination } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-pagination'
import { ProjectListItem } from '@/app/[locale]/admin/(dashboard)/components/projects/project-list-item'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/[locale]/admin/(dashboard)/components/ui/card'
import { DataList, DataCard } from '@/app/[locale]/admin/(dashboard)/components/ui/data-list'
import { Input } from '@/app/[locale]/admin/(dashboard)/components/ui/input'
import { ListContainer } from '@/app/[locale]/admin/(dashboard)/components/ui/list-container'
import { SimpleSelect } from '@/app/[locale]/admin/(dashboard)/components/ui/select'
import { ViewToggle, type ViewMode } from '@/app/[locale]/admin/(dashboard)/components/ui/view-toggle'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { trpc } from '@/lib/trpc'

const MapContainer = dynamic(() => import('@/components/ui/map-container'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
      <div className="text-center">
        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Chargement de la carte...</p>
      </div>
    </div>
  ),
})

const AdminProjectsPage: FC = () => {
  const { toast } = useToast()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'active' | 'funded' | 'closed' | 'suspended' | undefined>()
  const [type, setType] = useState<'beehive' | 'olive_tree' | 'vineyard' | undefined>()
  const utils = trpc.useUtils()

  const handleStatusChange = (value: string) => {
    setStatus(value as 'active' | 'funded' | 'closed' | 'suspended' | undefined)
  }

  const handleTypeChange = (value: string) => {
    setType(value as 'beehive' | 'olive_tree' | 'vineyard' | undefined)
  }

  const [view, setView] = useState<ViewMode>('grid')
  const [cursor, setCursor] = useState<string | undefined>()
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 20

  const [selectedProject, setSelectedProject] = useState<any>(null)

  const cityCoordinates: Record<string, [number, number]> = {
    'Antananarivo': [-18.8792, 47.5079],
    'Toliara': [-23.35, 43.6667],
    'Antsiranana': [-12.2667, 49.2833],
    'Mahajanga': [-15.7167, 46.3167],
    'Fianarantsoa': [-21.4333, 47.0833],

    'Esch-sur-Alzette': [49.4958, 5.9806],
    'Luxembourg City': [49.6117, 6.1319],
    'Differdange': [49.5244, 5.8914],
    'Dudelange': [49.4806, 6.0878],

    'Gand': [51.0543, 3.7174],
    'Bruxelles': [50.8503, 4.3517],
    'Anvers': [51.2194, 4.4025],
    'Liège': [50.6292, 5.5797],
    'Bruges': [51.2093, 3.2247],

    'Paris': [48.8566, 2.3522],
    'Lyon': [45.764, 4.8357],
    'Marseille': [43.2965, 5.3698],
    'Toulouse': [43.6047, 1.4442],
    'Nice': [43.7102, 7.262],
  }

  const defaultCoordinates: Record<string, [number, number]> = {
    'Madagascar': [-18.8792, 47.5079],
    'Luxembourg': [49.6117, 6.1319],
    'Belgique': [50.4477, 3.8198],
    'France': [46.6034, 1.8883],
  }

  const getProjectCoordinates = (project: any): [number, number] => {
    const postgisCoords = parsePostGISPoint(project.location)
    if (postgisCoords) return postgisCoords

    const cityCoords = cityCoordinates[project.address?.city]
    if (cityCoords) return cityCoords

    return defaultCoordinates[project.address?.country] || defaultCoordinates['France']
  }

  const parsePostGISPoint = (locationString: string): [number, number] | null => {
    if (!locationString) return null

    try {
      if (locationString.startsWith('0101000020')) {
        return null
      }

      return null
    } catch (error) {
      console.warn('Erreur parsing coordonnées PostGIS:', error)
      return null
    }
  }

  const [projects, setProjects] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFetching, setIsFetching] = useState(false)

  const { data, isLoading: trpcLoading, isFetching: trpcFetching, refetch } = trpc.admin.projects.list.useQuery(
    { search: search || undefined, status: status || undefined, type: type || undefined, limit: 20, cursor },
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
      setProjects(data.items || [])
    }
  }, [data])

  const projectLocations = projects.map(project => ({
    id: project.id,
    name: project.name,
    type: project.type,
    coordinates: getProjectCoordinates(project),
    fundingProgress: project.funding_progress || 0,
    targetBudget: project.target_budget,
    currentFunding: project.current_funding || 0,
    impactMetrics: project.impact_metrics || {},
    country: project.address?.country || 'Non spécifié',
    city: project.address?.city || 'Non spécifié',
    description: project.description || project.long_description || ''
  }))

  const createProject = trpc.admin.projects.create.useMutation({
    onMutate: async () => {
      await utils.admin.projects.list.cancel()

      const prevData = utils.admin.projects.list.getData()
      return { prevData }
    },
    onSuccess: () => {
      utils.admin.projects.list.invalidate()
      toast({ variant: 'success', title: 'Projet créé' })
    },
    onError: (e, vars, ctx) => {
      if (ctx?.prevData) {
        utils.admin.projects.list.setData(undefined, ctx.prevData)
      }
      toast({ variant: 'destructive', title: 'Création échouée', description: e.message })
    },
    onSettled: () => {
      utils.admin.projects.list.invalidate()
    }
  })

  const updateProject = trpc.admin.projects.update.useMutation({
    onMutate: async (vars) => {
      await utils.admin.projects.list.cancel()
      const prev = utils.admin.projects.list.getData()
      if (prev) {
        utils.admin.projects.list.setData(undefined, {
          ...prev,
          items: prev.items.map((p: any) => (p.id === vars.id ? { ...p, ...vars.patch } : p)),
        } as any)
      }
      return { prev }
    },
    onError: (_e, _vars, ctx) => {
      if (ctx?.prev) utils.admin.projects.list.setData(undefined, ctx.prev as any)
      toast({ variant: 'destructive', title: 'Mise à jour échouée' })
    },
    onSuccess: () => toast({ variant: 'success', title: 'Projet mis à jour' }),
    onSettled: () => utils.admin.projects.list.invalidate(),
  })

  return (
    <AdminPageContainer>
      <AdminPageHeader>
        <Input
          className="max-w-xs"
          placeholder="Rechercher un projet..."
          value={search}
          onChange={(e) => setSearch((e.target as HTMLInputElement).value)}
        />
        <SimpleSelect
          className="w-[150px]"
          placeholder="Statut"
          value={status}
          options={[
            { value: 'active', label: 'Actif' },
            { value: 'funded', label: 'Financé' },
            { value: 'closed', label: 'Fermé' },
            { value: 'suspended', label: 'Suspendu' },
          ]}
          onValueChange={handleStatusChange}
        />
        <SimpleSelect
          className="w-[150px]"
          placeholder="Type"
          value={type}
          options={[
            { value: 'beehive', label: 'Ruche' },
            { value: 'olive_tree', label: 'Olivier' },
            { value: 'vineyard', label: 'Vigne' },
          ]}
          onValueChange={handleTypeChange}
        />
        {(isLoading || isFetching) && <span aria-live="polite" className="text-xs text-muted-foreground">Chargement…</span>}

        <Link href="/admin/projects/new">
          <Button className="flex items-center gap-2" size="sm">
            <Plus className="h-4 w-4" />
            Nouveau projet
          </Button>
        </Link>
        <ViewToggle
          availableViews={['grid', 'list', 'map']}
          value={view}
          onChange={setView}
        />
      </AdminPageHeader>
      {view === 'map' ? (
        <>
          <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Localisation des Projets
            </CardTitle>
            <CardDescription>
              Cliquez sur les marqueurs pour voir les détails de chaque projet
            </CardDescription>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
              <p className="text-sm text-amber-800">
                <strong>ℹ️ Note:</strong> Les coordonnées affichées sont approximatives basées sur les villes.
                Pour des coordonnées GPS précises, une intégration avec une bibliothèque PostGIS serait nécessaire.
              </p>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="w-full h-[600px] bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Chargement de la carte...</p>
                </div>
              </div>
            ) : (
              <MapContainer
                projects={projectLocations}
                selectedProject={selectedProject}
                selectedType={type ?? 'all'}
                onProjectSelect={setSelectedProject}
              />
            )}
          </CardContent>
        </Card>
        {selectedProject && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    selectedProject.type === 'beehive' ? 'bg-yellow-500' :
                    (selectedProject.type === 'olive_tree' ? 'bg-green-600' : 'bg-purple-600')
                  }`}>
                    <Package className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{selectedProject.name}</CardTitle>
                    <CardDescription>{selectedProject.city}, {selectedProject.country}</CardDescription>
                  </div>
                </div>
                <Badge color={selectedProject.status === 'active' ? 'green' : 'gray'}>
                  {selectedProject.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Financement</p>
                  <p className="text-2xl font-bold">{selectedProject.fundingProgress}%</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedProject.currentFunding}€ / {selectedProject.targetBudget}€
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Type</p>
                  <p className="text-2xl font-bold">{selectedProject.type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Statut</p>
                  <p className="text-2xl font-bold">{selectedProject.status}</p>
                </div>
              </div>

              {selectedProject.description && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
                  <p className="text-sm">{selectedProject.description}</p>
                </div>
              )}

              <div className="flex gap-2">
                <Link href={`/admin/projects/${selectedProject.id}`}>
                  <Button size="sm" variant="outline">
                    Voir le projet complet
                  </Button>
                </Link>
                <Button size="sm" variant="outline">
                  Modifier
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        </>
      ) : view === 'grid' ? (
        <DataList
          gridCols={3}
          isLoading={isLoading}
          items={projects}
          emptyState={{
            title: 'Aucun projet trouvé',
            description: 'Aucun résultat pour ces filtres.',
            action: (
              <Button size="sm" variant="outline" onClick={() => { setSearch(''); setStatus(undefined); setType(undefined); setCursor(undefined); refetch() }}>
                Réinitialiser les filtres
              </Button>
            )
          }}
          renderItem={(p: any) => (
            <DataCard href={`/admin/projects/${p.id}`}>
              <DataCard.Header>
                <DataCard.Title>
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{p.name}</span>
                    <Badge color={p.status === 'active' ? 'green' : 'gray'}>{p.status}</Badge>
                    {p.featured && <Star className="w-4 h-4 text-yellow-500" />}
                  </div>
                </DataCard.Title>
              </DataCard.Header>
              <DataCard.Content>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Target className="w-3.5 h-3.5" />
                  <span>{p.type}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Box className="w-3.5 h-3.5" />
                  <span>{p.current_funding ?? 0} / {p.target_budget} €</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <User className="w-3.5 h-3.5" />
                  <span>{p.producer_id}</span>
                </div>
              </DataCard.Content>
              <DataCard.Footer>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={(e) => { e.preventDefault(); updateProject.mutate({ id: p.id, patch: { featured: !p.featured } }) }}>{p.featured ? 'Unfeature' : 'Feature'}</Button>
                  <Button size="sm" variant="outline" onClick={(e) => { e.preventDefault(); updateProject.mutate({ id: p.id, patch: { status: p.status === 'active' ? 'suspended' : 'active' } }) }}>{p.status === 'active' ? 'Suspendre' : 'Activer'}</Button>
                </div>
                <span className="text-xs text-muted-foreground">ID: {p.id}</span>
              </DataCard.Footer>
            </DataCard>
          )}
        />
      ) : (
        isLoading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Chargement des projets...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Aucun projet trouvé</h3>
            <p className="text-muted-foreground mb-4">Aucun résultat pour ces filtres.</p>
            <Button size="sm" variant="outline" onClick={() => { setSearch(''); setStatus(undefined); setType(undefined); setCursor(undefined); refetch() }}>
              Réinitialiser les filtres
            </Button>
          </div>
        ) : (
          <ListContainer>
            {projects.map((project) => (
              <ProjectListItem
                key={project.id}
                project={project}
                actions={
                  <div className="flex items-center gap-2 flex-wrap">
                    <Button size="sm" variant="outline" onClick={(e) => { e.preventDefault(); updateProject.mutate({ id: project.id, patch: { featured: !project.featured } }) }}>
                      {project.featured ? 'Unfeature' : 'Feature'}
                    </Button>
                    <Button size="sm" variant="outline" onClick={(e) => { e.preventDefault(); updateProject.mutate({ id: project.id, patch: { status: project.status === 'active' ? 'suspended' : 'active' } }) }}>
                      {project.status === 'active' ? 'Suspendre' : 'Activer'}
                    </Button>
                  </div>
                }
              />
            ))}
          </ListContainer>
        )
      )}

      <AdminPagination
        pagination={projects.length > pageSize ? {
          currentPage,
          pageSize,
          totalItems: projects.length,
          totalPages: Math.ceil(projects.length / pageSize)
        } : undefined}
      />
    </AdminPageContainer>
  )
}

export default AdminProjectsPage
