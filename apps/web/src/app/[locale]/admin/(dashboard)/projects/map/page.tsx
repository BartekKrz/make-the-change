'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

import { MapPin, Leaf, TreePine, Grape, TrendingUp, Users, Wind, Award, Plus } from 'lucide-react'
import { Badge } from '@/app/[locale]/admin/(dashboard)/components/badge'
import { trpc } from '@/lib/trpc'
import { AdminPageContainer } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-page-container'
import { AdminPageHeader } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-page-header'
import { ViewToggle, type ViewMode } from '@/app/[locale]/admin/(dashboard)/components/ui/view-toggle'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/[locale]/admin/(dashboard)/components/ui/card'
import { SimpleSelect } from '@/app/[locale]/admin/(dashboard)/components/ui/select'
import { Input } from '@/app/[locale]/admin/(dashboard)/components/ui/input'
import Link from 'next/link'
import { type FC } from 'react'

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

type ProjectLocation = {
  id: string
  name: string
  type: 'beehive' | 'olive_tree' | 'vineyard'
  coordinates: [number, number]
  fundingProgress: number
  targetBudget: number
  currentFunding: number
  impactMetrics: {
    local_jobs_created?: number
    co2_offset_kg_per_year?: number
    educational_visits?: number
    biodiversity_score?: number
  }
  country: string
  city: string
  description: string
}

const projectTypeConfig = {
  beehive: {
    icon: Leaf,
    color: 'bg-yellow-500',
    label: 'Ruche',
    description: 'Protection des abeilles'
  },
  olive_tree: {
    icon: TreePine,
    color: 'bg-green-600',
    label: 'Olivier',
    description: 'Agriculture durable'
  },
  vineyard: {
    icon: Grape,
    color: 'bg-purple-600',
    label: 'Vigne',
    description: 'Viticulture responsable'
  }
}

const ProjectsMapPage: FC = () => {
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedProject, setSelectedProject] = useState<ProjectLocation | null>(null)
  const [search, setSearch] = useState('')
  const [view, setView] = useState<ViewMode>('grid')

  const { data: projectsData, isLoading } = trpc.admin.projects.list.useQuery({
    limit: 50
  })

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

  const cityCoordinates: Record<string, [number, number]> = {
    'Antananarivo': [-18.8792, 47.5079],
    'Toliara': [-23.3500, 43.6667],
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
    'Lyon': [45.7640, 4.8357],
    'Marseille': [43.2965, 5.3698],
    'Toulouse': [43.6047, 1.4442],
    'Nice': [43.7102, 7.2620],
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

  const projectLocations: ProjectLocation[] = projectsData?.items?.map(project => ({
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
  })) || []

  const filteredProjects = projectLocations.filter(project => {
    const matchesType = selectedType === 'all' || project.type === selectedType
    const matchesSearch = search === '' || project.name.toLowerCase().includes(search.toLowerCase())
    return matchesType && matchesSearch
  })
  const getProjectIcon = (type: string) => {
    const config = projectTypeConfig[type as keyof typeof projectTypeConfig]
    return config?.icon || MapPin
  }

  const getProjectColor = (type: string) => {
    const config = projectTypeConfig[type as keyof typeof projectTypeConfig]
    return config?.color || 'bg-gray-500'
  }

  return (
    <AdminPageContainer>
      <AdminPageHeader>
        <Input
          placeholder="Rechercher un projet..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <SimpleSelect
          value={selectedType}
          onValueChange={setSelectedType}
          options={[
            { value: 'all', label: 'Tous les types' },
            { value: 'beehive', label: 'Ruches' },
            { value: 'olive_tree', label: 'Oliviers' },
            { value: 'vineyard', label: 'Vignes' }
          ]}
        />
        {isLoading && <span className="text-xs text-muted-foreground" aria-live="polite">Chargement…</span>}

        <Link href="/admin/projects/new">
          <Button size="sm" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouveau projet
          </Button>
        </Link>
        <ViewToggle
          value={view}
          onChange={setView}
          availableViews={['map']}
        />
      </AdminPageHeader>
      {}
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
              projects={filteredProjects}
              selectedProject={selectedProject}
              onProjectSelect={setSelectedProject}
              selectedType={selectedType}
            />
          )}
        </CardContent>
      </Card>

      {}
      {selectedProject && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${getProjectColor(selectedProject.type)}`}>
                  {(() => {
                    const Icon = getProjectIcon(selectedProject.type)
                    return <Icon className="h-5 w-5 text-white" />
                  })()}
                </div>
                <div>
                  <CardTitle className="text-xl">{selectedProject.name}</CardTitle>
                  <CardDescription>{selectedProject.city}, {selectedProject.country}</CardDescription>
                </div>
              </div>
              <Badge color="blue">
                {projectTypeConfig[selectedProject.type as keyof typeof projectTypeConfig]?.label}
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
                <p className="text-sm font-medium text-muted-foreground">CO2 Compensé</p>
                <p className="text-2xl font-bold">{selectedProject.impactMetrics.co2_offset_kg_per_year || 0}kg/an</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Emplois Créés</p>
                <p className="text-2xl font-bold">{selectedProject.impactMetrics.local_jobs_created || 0}</p>
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
                <Button variant="outline" size="sm">
                  Voir le projet
                </Button>
              </Link>
              <Button variant="outline" size="sm">
                Modifier
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </AdminPageContainer>
  )
}

export default ProjectsMapPage
