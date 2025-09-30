'use client';

import { Icon } from 'leaflet';
import { useMemo, useState, useCallback } from 'react';
import {
  MapContainer as LeafletMapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './map-container.css';

import {
  Leaf,
  Badge,
  TreePine,
  Grape,
  ExternalLink,
  TrendingUp,
  Users,
  Zap,
  MapPin,
  X,
  ChevronRight
} from 'lucide-react';

type ProjectLocation = {
  id: string;
  name: string;
  type: 'beehive' | 'olive_tree' | 'vineyard';
  coordinates: [number, number];
  fundingProgress: number;
  targetBudget: number;
  currentFunding: number;
  impactMetrics: {
    local_jobs_created?: number;
    co2_offset_kg_per_year?: number;
    educational_visits?: number;
    biodiversity_score?: number;
  };
  country: string;
  city: string;
  description: string;
};

type MapContainerProps = {
  projects: ProjectLocation[];
  selectedProject: ProjectLocation | null;
  onProjectSelect: (project: ProjectLocation) => void;
  selectedType: string;
};

const projectTypeLabels = {
  beehive: 'Ruche',
  olive_tree: 'Olivier',
  vineyard: 'Vigne',
};

const projectTypeIcons = {
  beehive: `<path d="M12 2C13.1 2 14 2.9 14 4V5H17C18.1 5 19 5.9 19 7V10C19 11.1 18.1 12 17 12H16V14H17C18.1 14 19 14.9 19 16V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V16C5 14.9 5.9 14 7 14H8V12H7C5.9 12 5 11.1 5 10V7C5 5.9 5.9 5 7 5H10V4C10 2.9 10.9 2 12 2ZM16 7H8V10H10V12H8V14H16V12H14V10H16V7Z" fill="white"/>`,
  olive_tree: `<path d="M12 3C8.1 3 5 6.1 5 10C5 13.9 8.1 17 12 17C15.9 17 19 13.9 19 10C19 6.1 15.9 3 12 3ZM12 21L10.5 19.5C6.4 15.4 4 12 4 8.5C4 5.4 6.4 3 9.5 3C10.8 3 12.1 3.5 13 4.4C13.9 3.5 15.2 3 16.5 3C19.6 3 22 5.4 22 8.5C22 12 19.6 15.4 15.5 19.5L12 21Z" fill="white"/>`,
  vineyard: `<path d="M9.75 12C11.13 12 12.25 10.88 12.25 9.5S11.13 7 9.75 7S7.25 8.12 7.25 9.5S8.37 12 9.75 12ZM15.75 12C17.13 12 18.25 10.88 18.25 9.5S17.13 7 15.75 7S13.25 8.12 13.25 9.5S14.37 12 15.75 12ZM9.75 16C11.13 16 12.25 14.88 12.25 13.5S11.13 11 9.75 11S7.25 12.12 7.25 13.5S8.37 16 9.75 16ZM15.75 16C17.13 16 18.25 14.88 18.25 13.5S17.13 11 15.75 11S13.25 12.12 13.25 13.5S14.37 16 15.75 16ZM12 21L10.5 19.5C6.4 15.4 4 12 4 8.5C4 5.4 6.4 3 9.5 3C10.8 3 12.1 3.5 13 4.4C13.9 3.5 15.2 3 16.5 3C19.6 3 22 5.4 22 8.5C22 12 19.6 15.4 15.5 19.5L12 21Z" fill="white"/>`,
};

const createProjectIcon = (type: string, progress: number = 0, isSelected: boolean = false) => {
  const colors = {
    beehive: { main: '#f59e0b', bg: '#fef3c7', ring: '#f59e0b' },
    olive_tree: { main: '#10b981', bg: '#d1fae5', ring: '#10b981' },
    vineyard: { main: '#8b5cf6', bg: '#e9d5ff', ring: '#8b5cf6' },
  };

  const colorSet = colors[type as keyof typeof colors] || colors.beehive;
  const iconSvg = projectTypeIcons[type as keyof typeof projectTypeIcons] || projectTypeIcons.beehive;
  const size = isSelected ? 50 : 40;
  const strokeWidth = isSelected ? 3 : 2;

  const svgString = `
    <svg width="${size}" height="${size + 10}" viewBox="0 0 40 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow${type}" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.3)"/>
        </filter>
        <linearGradient id="progress${type}" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="${colorSet.main}"/>
          <stop offset="${progress}%" stop-color="${colorSet.main}"/>
          <stop offset="${progress}%" stop-color="${colorSet.bg}"/>
          <stop offset="100%" stop-color="${colorSet.bg}"/>
        </linearGradient>
      </defs>

      <!-- Progress ring -->
      <circle cx="20" cy="20" r="16" fill="none" stroke="url(#progress${type})" stroke-width="3" transform="rotate(-90 20 20)" stroke-linecap="round"/>

      <!-- Main circle -->
      <circle cx="20" cy="20" r="14" fill="${colorSet.main}" stroke="white" stroke-width="${strokeWidth}" filter="url(#shadow${type})"/>

      <!-- Icon -->
      <g transform="translate(14, 14) scale(0.5)">
        ${iconSvg}
      </g>

      <!-- Pointer -->
      <path d="M20 36 L16 42 L24 42 Z" fill="${colorSet.main}" stroke="white" stroke-width="1"/>

      ${isSelected ? `<circle cx="20" cy="20" r="18" fill="none" stroke="${colorSet.ring}" stroke-width="2" opacity="0.6" stroke-dasharray="2,2"><animateTransform attributeName="transform" type="rotate" values="0 20 20;360 20 20" dur="3s" repeatCount="indefinite"/></circle>` : ''}
    </svg>
  `;

  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(svgString)}`,
    iconSize: [size, size + 10],
    iconAnchor: [size / 2, size + 10],
    popupAnchor: [0, -(size + 10)],
  });
};

export default function MapContainer({
  projects,
  selectedProject,
  onProjectSelect,
  selectedType,
}: MapContainerProps) {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [showMiniCard, setShowMiniCard] = useState(false);

  const filteredProjects = useMemo(() => {
    return selectedType === 'all'
      ? projects
      : projects.filter(p => p.type === selectedType);
  }, [projects, selectedType]);

  const handleProjectHover = useCallback((project: ProjectLocation | null) => {
    setHoveredProject(project?.id || null);
    setShowMiniCard(!!project);
  }, []);

  const handleProjectClick = useCallback((project: ProjectLocation) => {
    onProjectSelect(project);
    setShowMiniCard(false);
  }, [onProjectSelect]);

  const mapCenter = useMemo(() => {
    if (filteredProjects.length === 0) return [46.603_354, 1.888_334];

    const lats = filteredProjects
      .map(p => p.coordinates[0])
      .filter(lat => lat !== 0);
    const lngs = filteredProjects
      .map(p => p.coordinates[1])
      .filter(lng => lng !== 0);

    if (lats.length === 0 || lngs.length === 0) return [46.603_354, 1.888_334];

    const avgLat = lats.reduce((sum, lat) => sum + lat, 0) / lats.length;
    const avgLng = lngs.reduce((sum, lng) => sum + lng, 0) / lngs.length;

    return [avgLat, avgLng];
  }, [filteredProjects]);

  const mapZoom = filteredProjects.length <= 1 ? 8 : 5;

  return (
    <div className="relative h-[600px] w-full overflow-hidden rounded-xl border bg-gradient-to-br from-blue-50 to-green-50 shadow-lg">
      <LeafletMapContainer
        zoomControl={false}
        center={mapCenter as [number, number]}
        style={{ height: '100%', width: '100%', borderRadius: '0.75rem' }}
        zoom={mapZoom}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        className="rounded-xl"
      >
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          opacity={0.9}
        />

        {filteredProjects.map(project => {
          if (
            !project.coordinates ||
            project.coordinates[0] === 0 ||
            project.coordinates[1] === 0 ||
            isNaN(project.coordinates[0]) ||
            isNaN(project.coordinates[1])
          ) {
            return null;
          }

          const isHovered = hoveredProject === project.id;
          const isSelected = selectedProject?.id === project.id;

          return (
            <Marker
              key={project.id}
              icon={createProjectIcon(project.type, project.fundingProgress, isSelected || isHovered)}
              position={project.coordinates as [number, number]}
              eventHandlers={{
                click: () => handleProjectClick(project),
                mouseover: () => handleProjectHover(project),
                mouseout: () => handleProjectHover(null),
              }}
            >
              <Popup closeButton={false} className="custom-popup">
                <div className="min-w-[320px] max-w-[380px] p-0">
                  {/* Header avec image de fond */}
                  <div className={`relative h-16 rounded-t-lg bg-gradient-to-r ${
                    project.type === 'beehive'
                      ? 'from-yellow-400 to-orange-500'
                      : project.type === 'olive_tree'
                        ? 'from-green-400 to-emerald-600'
                        : 'from-purple-400 to-violet-600'
                  }`}>
                    <div className="absolute inset-0 bg-black/20 rounded-t-lg" />
                    <div className="relative h-full flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 flex items-center justify-center">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            {project.type === 'beehive' && (
                              <path d="M12 2C13.1 2 14 2.9 14 4V5H17C18.1 5 19 5.9 19 7V10C19 11.1 18.1 12 17 12H16V14H17C18.1 14 19 14.9 19 16V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V16C5 14.9 5.9 14 7 14H8V12H7C5.9 12 5 11.1 5 10V7C5 5.9 5.9 5 7 5H10V4C10 2.9 10.9 2 12 2ZM16 7H8V10H10V12H8V14H16V12H14V10H16V7Z" fill="white"/>
                            )}
                            {project.type === 'olive_tree' && (
                              <path d="M12 3C8.1 3 5 6.1 5 10C5 13.9 8.1 17 12 17C15.9 17 19 13.9 19 10C19 6.1 15.9 3 12 3ZM12 21L10.5 19.5C6.4 15.4 4 12 4 8.5C4 5.4 6.4 3 9.5 3C10.8 3 12.1 3.5 13 4.4C13.9 3.5 15.2 3 16.5 3C19.6 3 22 5.4 22 8.5C22 12 19.6 15.4 15.5 19.5L12 21Z" fill="white"/>
                            )}
                            {project.type === 'vineyard' && (
                              <path d="M9.75 12C11.13 12 12.25 10.88 12.25 9.5S11.13 7 9.75 7S7.25 8.12 7.25 9.5S8.37 12 9.75 12ZM15.75 12C17.13 12 18.25 10.88 18.25 9.5S17.13 7 15.75 7S13.25 8.12 13.25 9.5S14.37 12 15.75 12ZM9.75 16C11.13 16 12.25 14.88 12.25 13.5S11.13 11 9.75 11S7.25 12.12 7.25 13.5S8.37 16 9.75 16ZM15.75 16C17.13 16 18.25 14.88 18.25 13.5S17.13 11 15.75 11S13.25 12.12 13.25 13.5S14.37 16 15.75 16ZM12 21L10.5 19.5C6.4 15.4 4 12 4 8.5C4 5.4 6.4 3 9.5 3C10.8 3 12.1 3.5 13 4.4C13.9 3.5 15.2 3 16.5 3C19.6 3 22 5.4 22 8.5C22 12 19.6 15.4 15.5 19.5L12 21Z" fill="white"/>
                            )}
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-lg leading-tight">
                            {project.name}
                          </h3>
                          <p className="text-white/90 text-sm flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {project.city}, {project.country}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 space-y-4">
                    {/* Progress Bar */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Financement</span>
                        <span className="text-sm font-bold text-gray-900">{project.fundingProgress.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${
                            project.type === 'beehive'
                              ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                              : project.type === 'olive_tree'
                                ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                                : 'bg-gradient-to-r from-purple-400 to-violet-500'
                          }`}
                          style={{ width: `${Math.min(project.fundingProgress, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-600 mt-1">
                        <span>{project.currentFunding.toLocaleString()}€</span>
                        <span>{project.targetBudget.toLocaleString()}€</span>
                      </div>
                    </div>

                    {/* Impact Metrics */}
                    <div className="grid grid-cols-2 gap-3">
                      {project.impactMetrics.co2_offset_kg_per_year && (
                        <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                          <Leaf className="h-4 w-4 text-green-600" />
                          <div>
                            <p className="text-xs text-green-700 font-medium">CO2 compensé</p>
                            <p className="text-sm font-bold text-green-800">
                              {project.impactMetrics.co2_offset_kg_per_year}kg/an
                            </p>
                          </div>
                        </div>
                      )}

                      {project.impactMetrics.local_jobs_created && (
                        <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                          <Users className="h-4 w-4 text-blue-600" />
                          <div>
                            <p className="text-xs text-blue-700 font-medium">Emplois</p>
                            <p className="text-sm font-bold text-blue-800">
                              {project.impactMetrics.local_jobs_created}
                            </p>
                          </div>
                        </div>
                      )}

                      {project.impactMetrics.biodiversity_score && (
                        <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
                          <TreePine className="h-4 w-4 text-purple-600" />
                          <div>
                            <p className="text-xs text-purple-700 font-medium">Biodiversité</p>
                            <p className="text-sm font-bold text-purple-800">
                              {project.impactMetrics.biodiversity_score}/100
                            </p>
                          </div>
                        </div>
                      )}

                      {project.impactMetrics.educational_visits && (
                        <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg">
                          <Zap className="h-4 w-4 text-orange-600" />
                          <div>
                            <p className="text-xs text-orange-700 font-medium">Visites</p>
                            <p className="text-sm font-bold text-orange-800">
                              {project.impactMetrics.educational_visits}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <button
                      className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:scale-[1.02] ${
                        project.type === 'beehive'
                          ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                          : project.type === 'olive_tree'
                            ? 'bg-green-500 hover:bg-green-600 text-white'
                            : 'bg-purple-500 hover:bg-purple-600 text-white'
                      }`}
                      onClick={() => handleProjectClick(project)}
                    >
                      <span>Voir le projet</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </LeafletMapContainer>

      {/* Custom Zoom Controls */}
      <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-1">
        <button
          className="h-10 w-10 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg hover:bg-white transition-colors flex items-center justify-center text-gray-700 hover:text-gray-900"
          onClick={() => {}}
        >
          +
        </button>
        <button
          className="h-10 w-10 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg hover:bg-white transition-colors flex items-center justify-center text-gray-700 hover:text-gray-900"
          onClick={() => {}}
        >
          −
        </button>
      </div>

      {/* Enhanced Legend */}
      <div className="absolute top-4 right-4 z-[1000] bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl p-4 shadow-xl">
        <h4 className="mb-3 text-sm font-bold text-gray-800 flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Types de projets
        </h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-yellow-500">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C13.1 2 14 2.9 14 4V5H17C18.1 5 19 5.9 19 7V10C19 11.1 18.1 12 17 12H16V14H17C18.1 14 19 14.9 19 16V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V16C5 14.9 5.9 14 7 14H8V12H7C5.9 12 5 11.1 5 10V7C5 5.9 5.9 5 7 5H10V4C10 2.9 10.9 2 12 2ZM16 7H8V10H10V12H8V14H16V12H14V10H16V7Z" fill="white"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Ruches</p>
              <p className="text-xs text-gray-600">{projects.filter(p => p.type === 'beehive').length} projets</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-green-500">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 3C8.1 3 5 6.1 5 10C5 13.9 8.1 17 12 17C15.9 17 19 13.9 19 10C19 6.1 15.9 3 12 3ZM12 21L10.5 19.5C6.4 15.4 4 12 4 8.5C4 5.4 6.4 3 9.5 3C10.8 3 12.1 3.5 13 4.4C13.9 3.5 15.2 3 16.5 3C19.6 3 22 5.4 22 8.5C22 12 19.6 15.4 15.5 19.5L12 21Z" fill="white"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Oliviers</p>
              <p className="text-xs text-gray-600">{projects.filter(p => p.type === 'olive_tree').length} projets</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-purple-500">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9.75 12C11.13 12 12.25 10.88 12.25 9.5S11.13 7 9.75 7S7.25 8.12 7.25 9.5S8.37 12 9.75 12ZM15.75 12C17.13 12 18.25 10.88 18.25 9.5S17.13 7 15.75 7S13.25 8.12 13.25 9.5S14.37 12 15.75 12ZM9.75 16C11.13 16 12.25 14.88 12.25 13.5S11.13 11 9.75 11S7.25 12.12 7.25 13.5S8.37 16 9.75 16ZM15.75 16C17.13 16 18.25 14.88 18.25 13.5S17.13 11 15.75 11S13.25 12.12 13.25 13.5S14.37 16 15.75 16ZM12 21L10.5 19.5C6.4 15.4 4 12 4 8.5C4 5.4 6.4 3 9.5 3C10.8 3 12.1 3.5 13 4.4C13.9 3.5 15.2 3 16.5 3C19.6 3 22 5.4 22 8.5C22 12 19.6 15.4 15.5 19.5L12 21Z" fill="white"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Vignes</p>
              <p className="text-xs text-gray-600">{projects.filter(p => p.type === 'vineyard').length} projets</p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            L'anneau indique le financement
          </p>
        </div>
      </div>

      {/* Project Counter */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-2 shadow-lg">
        <p className="text-sm font-medium text-gray-800">
          {filteredProjects.length} projet{filteredProjects.length > 1 ? 's' : ''} affiché{filteredProjects.length > 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}
