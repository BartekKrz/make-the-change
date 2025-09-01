'use client'

import { useEffect, useRef, useMemo } from 'react'
import { MapContainer as LeafletMapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Icon, LatLngBounds } from 'leaflet'
import 'leaflet/dist/leaflet.css'

import { MapPin, Leaf, TreePine, Grape, Badge } from 'lucide-react'

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

type MapContainerProps = {
  projects: ProjectLocation[]
  selectedProject: ProjectLocation | null
  onProjectSelect: (project: ProjectLocation) => void
  selectedType: string
}

const projectTypeLabels = {
  beehive: 'Ruche',
  olive_tree: 'Olivier',
  vineyard: 'Vigne'
}

const createProjectIcon = (type: string) => {
  const colors = {
    beehive: '#eab308',
    olive_tree: '#16a34a',
    vineyard: '#9333ea'
  }

  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="${colors[type as keyof typeof colors]}" stroke="white" stroke-width="2"/>
        <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `)}`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  })
}

export default function MapContainer({
  projects,
  selectedProject,
  onProjectSelect,
  selectedType
}: MapContainerProps) {
  const filteredProjects = useMemo(() => {
    return selectedType === 'all'
      ? projects
      : projects.filter(p => p.type === selectedType)
  }, [projects, selectedType])

  const mapCenter = useMemo(() => {
    if (filteredProjects.length === 0) return [46.603354, 1.888334]

    const lats = filteredProjects.map(p => p.coordinates[0]).filter(lat => lat !== 0)
    const lngs = filteredProjects.map(p => p.coordinates[1]).filter(lng => lng !== 0)

    if (lats.length === 0 || lngs.length === 0) return [46.603354, 1.888334]

    const avgLat = lats.reduce((sum, lat) => sum + lat, 0) / lats.length
    const avgLng = lngs.reduce((sum, lng) => sum + lng, 0) / lngs.length

    return [avgLat, avgLng]
  }, [filteredProjects])

  const mapZoom = filteredProjects.length <= 1 ? 8 : 5

  return (
    <div className="relative w-full h-[600px] rounded-lg border overflow-hidden">
      <LeafletMapContainer
        center={mapCenter as [number, number]}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {filteredProjects.map((project) => {
          if (!project.coordinates ||
              project.coordinates[0] === 0 ||
              project.coordinates[1] === 0 ||
              isNaN(project.coordinates[0]) ||
              isNaN(project.coordinates[1])) {
            return null
          }

          return (
            <Marker
              key={project.id}
              position={project.coordinates as [number, number]}
              icon={createProjectIcon(project.type)}
              eventHandlers={{
                click: () => onProjectSelect(project)
              }}
            >
              <Popup>
                <div className="min-w-[280px] p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      project.type === 'beehive' ? 'bg-yellow-500' :
                      project.type === 'olive_tree' ? 'bg-green-600' : 'bg-purple-600'
                    }`}>
                      <Leaf className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{project.name}</h3>
                      <p className="text-sm text-gray-600">{project.city}, {project.country}</p>
                      <p className="text-xs text-amber-600 mt-1">📍 Coordonnées approximatives</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Financement:</span>
                      <span className="font-semibold">{project.fundingProgress}%</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Budget:</span>
                      <span className="font-semibold">{project.currentFunding}€ / {project.targetBudget}€</span>
                    </div>

                    {project.impactMetrics.co2_offset_kg_per_year && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">CO2 compensé:</span>
                        <span className="font-semibold">{project.impactMetrics.co2_offset_kg_per_year}kg/an</span>
                      </div>
                    )}

                    {project.impactMetrics.local_jobs_created && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Emplois créés:</span>
                        <span className="font-semibold">{project.impactMetrics.local_jobs_created}</span>
                      </div>
                    )}

                    {project.impactMetrics.biodiversity_score && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Score biodiversité:</span>
                        <span className="font-semibold">{project.impactMetrics.biodiversity_score}/100</span>
                      </div>
                    )}

                    {project.impactMetrics.educational_visits && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Visites éducatives:</span>
                        <span className="font-semibold">{project.impactMetrics.educational_visits}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <Badge variant="secondary" className={
                      project.type === 'beehive' ? 'bg-yellow-100 text-yellow-800' :
                      project.type === 'olive_tree' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }>
                      {projectTypeLabels[project.type]}
                    </Badge>
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </LeafletMapContainer>

      {}
      <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg border z-[1000]">
        <h4 className="font-semibold text-sm mb-3">Légende</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <span className="text-sm">Ruches</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-600 rounded-full"></div>
            <span className="text-sm">Oliviers</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-600 rounded-full"></div>
            <span className="text-sm">Vignes</span>
          </div>
        </div>
      </div>
    </div>
  )
}
