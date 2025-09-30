'use client';
import { MapPin, Plus } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import {
  type FC,
  useCallback,
  useMemo,
  useState,
  useTransition,
  useDeferredValue,
  useOptimistic,
} from 'react';

import {
  AdminPageLayout,
  Filters,
  FilterModal,
} from '@/app/[locale]/admin/(dashboard)/components/admin-layout';
import { FilterButton } from '@/app/[locale]/admin/(dashboard)/components/admin-layout/filter-modal';
import { AdminPageHeader } from '@/app/[locale]/admin/(dashboard)/components/admin-layout/header';
import { AdminPagination } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-pagination';
import { CheckboxWithLabel } from '@/app/[locale]/admin/(dashboard)/components/ui/checkbox';
import { DataList } from '@/app/[locale]/admin/(dashboard)/components/ui/data-list';
import { EmptyState } from '@/app/[locale]/admin/(dashboard)/components/ui/empty-state';
import { SimpleSelect } from '@/app/[locale]/admin/(dashboard)/components/ui/select';
import {
  ViewToggle,
  type ViewMode,
} from '@/app/[locale]/admin/(dashboard)/components/ui/view-toggle';
import { Project } from '@/app/[locale]/admin/(dashboard)/projects/components/project';
import {
  ProjectCardSkeleton,
  ProjectListSkeleton,
} from '@/app/[locale]/admin/(dashboard)/projects/components/project-card-skeleton';
import { LocalizedLink } from '@/components/localized-link';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';

// Dynamically import MapContainer to avoid SSR issues with Leaflet
const MapContainer = dynamic(() => import('@/components/ui/map-container'), {
  ssr: false,
  loading: () => (
    <div className="bg-muted flex h-[600px] items-center justify-center rounded-lg border">
      <div className="text-center">
        <div className="border-primary mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
        <p className="text-muted-foreground text-sm">
          Chargement de la carte...
        </p>
      </div>
    </div>
  ),
});

const pageSize = 18;

type SelectOption = { value: string; label: string };

type ProjectSortOption =
  | 'created_at_desc'
  | 'created_at_asc'
  | 'name_asc'
  | 'name_desc'
  | 'target_budget_desc'
  | 'target_budget_asc'
  | 'featured_first';

type ProjectStatus = 'active' | 'funded' | 'closed' | 'suspended';

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

type ApiProject = {
  id: string;
  name?: string;
  type?: 'beehive' | 'olive_tree' | 'vineyard';
  latitude?: string | number;
  longitude?: string | number;
  location?: string;
  funding_progress?: number;
  target_budget?: number;
  total_invested?: number;
  impact_metrics?: {
    local_jobs_created?: number;
    co2_offset_kg_per_year?: number;
    educational_visits?: number;
    biodiversity_score?: number;
  };
  address?: {
    country?: string;
    city?: string;
  };
  description?: string;
  long_description?: string;
};

// Fonction pour extraire les coordonnées d'une géometry PostGIS hexadécimale
const extractCoordinatesFromLocation = (
  locationHex: string
): [number, number] | null => {
  try {
    if (!locationHex || locationHex.length < 50) return null;

    // Format WKB: 0101000020E6100000 + longitude (8 bytes) + latitude (8 bytes)
    // Header: 01 01 00 00 20 E6 10 00 00 = 18 characters
    const startIdx = 18;

    // Extract longitude (next 16 hex chars = 8 bytes)
    const lonHex = locationHex.slice(startIdx, startIdx + 16);
    // Extract latitude (next 16 hex chars = 8 bytes)
    const latHex = locationHex.slice(startIdx + 16, startIdx + 32);

    if (lonHex.length !== 16 || latHex.length !== 16) return null;

    // Convert hex to bytes for little-endian float64
    const lonBytes = new Uint8Array(8);
    const latBytes = new Uint8Array(8);

    // Parse longitude bytes (little-endian order from hex)
    for (let i = 0; i < 8; i++) {
      lonBytes[i] = Number.parseInt(lonHex.slice(i * 2, i * 2 + 2), 16);
    }

    // Parse latitude bytes (little-endian order from hex)
    for (let i = 0; i < 8; i++) {
      latBytes[i] = Number.parseInt(latHex.slice(i * 2, i * 2 + 2), 16);
    }

    // Convert bytes to Float64
    const lonView = new DataView(lonBytes.buffer);
    const latView = new DataView(latBytes.buffer);

    const longitude = lonView.getFloat64(0, true); // true = little-endian
    const latitude = latView.getFloat64(0, true);

    // Validate coordinates are reasonable
    if (
      longitude < -180 ||
      longitude > 180 ||
      latitude < -90 ||
      latitude > 90
    ) {
      return null;
    }

    return [latitude, longitude];
  } catch (error) {
    console.warn('Failed to extract coordinates from location hex:', error);
    return null;
  }
};

// Transformation des projets pour la carte
const transformProjectsForMap = (projects: ApiProject[]): ProjectLocation[] => {
  return projects
    .filter(project => {
      // Filtrer les projets qui ont une localisation
      if (project.latitude && project.longitude) {
        return (
          !Number.isNaN(Number(project.latitude)) && !Number.isNaN(Number(project.longitude))
        );
      }
      // Ou qui ont un champ location
      return project.location;
    })
    .map(project => {
      let coordinates: [number, number];

      if (project.latitude && project.longitude) {
        coordinates = [Number(project.latitude), Number(project.longitude)];
      } else if (project.location) {
        const extracted = extractCoordinatesFromLocation(project.location);
        if (!extracted) return null;
        coordinates = extracted;
      } else {
        return null;
      }

      return {
        id: project.id,
        name: project.name || 'Projet sans nom',
        type: project.type || 'beehive',
        coordinates,
        fundingProgress: project.funding_progress || 0,
        targetBudget: project.target_budget || 0,
        currentFunding: project.total_invested || 0,
        impactMetrics: {
          local_jobs_created: project.impact_metrics?.local_jobs_created,
          co2_offset_kg_per_year:
            project.impact_metrics?.co2_offset_kg_per_year,
          educational_visits: project.impact_metrics?.educational_visits,
          biodiversity_score: project.impact_metrics?.biodiversity_score,
        },
        country: project.address?.country || 'Non spécifié',
        city: project.address?.city || 'Non spécifié',
        description: project.description || project.long_description || '',
      };
    })
    .filter(Boolean) as ProjectLocation[];
};

const createSelectOptions = <T extends { id: string; name: string }>(
  items: T[] | undefined,
  allLabel: string
): SelectOption[] => [
  { value: 'all', label: allLabel },
  ...(items?.map(item => ({ value: item.id, label: item.name })) || []),
];

const getProjectSortOptions = (t: (key: string) => string): SelectOption[] => [
  { value: 'created_at_desc', label: t('admin.projects.sort.newest') },
  { value: 'created_at_asc', label: t('admin.projects.sort.oldest') },
  { value: 'name_asc', label: t('admin.projects.sort.name_asc') },
  { value: 'name_desc', label: t('admin.projects.sort.name_desc') },
  { value: 'target_budget_desc', label: t('admin.projects.sort.budget_desc') },
  { value: 'target_budget_asc', label: t('admin.projects.sort.budget_asc') },
  { value: 'featured_first', label: t('admin.projects.sort.featured') },
];

const getProjectStatusOptions = (
  t: (key: string) => string
): SelectOption[] => [
  { value: 'all', label: t('admin.projects.filters.all_statuses') },
  { value: 'active', label: t('admin.projects.statuses.active') },
  { value: 'funded', label: t('admin.projects.statuses.funded') },
  { value: 'closed', label: t('admin.projects.statuses.closed') },
  { value: 'suspended', label: t('admin.projects.statuses.suspended') },
];

const getProjectTypeOptions = (t: (key: string) => string): SelectOption[] => [
  { value: 'all', label: t('admin.projects.filters.all_types') },
  { value: 'beehive', label: t('admin.projects.type.beehive') },
  { value: 'olive_tree', label: t('admin.projects.type.olive_tree') },
  { value: 'vineyard', label: t('admin.projects.type.vineyard') },
  { value: 'forest', label: t('admin.projects.type.forest') },
  { value: 'solar', label: t('admin.projects.type.solar') },
];

const getDefaultPartnerOptions = (
  t: (key: string) => string
): SelectOption[] => [
  { value: 'all', label: t('admin.projects.filters.all_partners') },
];

const getDefaultCountryOptions = (
  t: (key: string) => string
): SelectOption[] => [
  { value: 'all', label: t('admin.projects.filters.all_countries') },
];

const defaultImpactTypeOptions: SelectOption[] = [];

const getSortSelectionItems = (t: (key: string) => string) =>
  getProjectSortOptions(t).map(option => ({
    id: option.value,
    name: option.label,
  }));

const ProjectsPage: FC = () => {
  const t = useTranslations();

  const [search, setSearch] = useState('');
  const [activeOnly, setActiveOnly] = useState(false);
  const [selectedPartnerId, setSelectedPartnerId] = useState<
    string | undefined
  >();
  const [selectedStatus, setSelectedStatus] = useState<
    ProjectStatus | undefined
  >();
  const [selectedProjectType, setSelectedProjectType] = useState<
    string | undefined
  >();
  const [selectedCountry, setSelectedCountry] = useState<string | undefined>();
  const [selectedImpactTypes, setSelectedImpactTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<ProjectSortOption>('created_at_desc');
  const [cursor, setCursor] = useState<string | undefined>();
  const [view, setView] = useState<ViewMode>('grid');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] =
    useState<ProjectLocation | null>(null);

  const [isPendingFilters, startFilterTransition] = useTransition();
  const deferredSearch = useDeferredValue(search);
  const [optimisticImpactTypes, removeOptimisticImpactType] = useOptimistic(
    selectedImpactTypes,
    (currentTypes, typeToRemove: string) =>
      currentTypes.filter(type => type !== typeToRemove)
  );

  const queryParams = useMemo(
    () => ({
      cursor,
      search: deferredSearch || undefined,
      activeOnly: activeOnly || undefined,
      status: selectedStatus,
      partnerId: selectedPartnerId === 'all' ? undefined : selectedPartnerId,
      projectType:
        selectedProjectType === 'all' ? undefined : selectedProjectType,
      country: selectedCountry === 'all' ? undefined : selectedCountry,
      impactTypes:
        selectedImpactTypes.length > 0 ? selectedImpactTypes : undefined,
      sortBy: sortBy || undefined,
      limit: pageSize,
    }),
    [
      cursor,
      deferredSearch,
      activeOnly,
      selectedPartnerId,
      selectedStatus,
      selectedProjectType,
      selectedCountry,
      selectedImpactTypes,
      sortBy,
    ]
  );

  const { data: partners, isPending: isPendingPartners } =
    trpc.admin.projects.partners.useQuery();
  const { data: countries, isPending: isPendingCountries } =
    trpc.admin.projects.countries.useQuery({ activeOnly: true });
  const { data: impactTypesData, isPending: isPendingImpactTypes } =
    trpc.admin.projects.impactTypes.useQuery({
      activeOnly: true,
      withStats: true,
    });
  const {
    data: projectsData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = trpc.admin.projects.list.useQuery(queryParams);

  const projects = useMemo(
    () => projectsData?.items || [],
    [projectsData?.items]
  );
  const totalProjects = projectsData?.total || 0;
  const totalPages = Math.ceil(totalProjects / pageSize);

  // Transform projects for map view
  const projectsForMap = useMemo(
    () => transformProjectsForMap(projects),
    [projects]
  );

  const isFilterActive = useMemo(
    () =>
      !!(
        deferredSearch ||
        activeOnly ||
        (selectedPartnerId && selectedPartnerId !== 'all') ||
        selectedStatus ||
        (selectedProjectType && selectedProjectType !== 'all') ||
        (selectedCountry && selectedCountry !== 'all') ||
        (selectedImpactTypes && selectedImpactTypes.length > 0) ||
        (sortBy && sortBy !== 'created_at_desc')
      ),
    [
      deferredSearch,
      activeOnly,
      selectedPartnerId,
      selectedStatus,
      selectedProjectType,
      selectedCountry,
      selectedImpactTypes,
      sortBy,
    ]
  );

  const partnerOptions = useMemo(
    (): SelectOption[] =>
      isPendingPartners || !partners
        ? getDefaultPartnerOptions(t)
        : createSelectOptions(
            partners,
            t('admin.projects.filters.all_partners')
          ),
    [partners, isPendingPartners, t]
  );

  const countryOptions = useMemo(
    (): SelectOption[] =>
      isPendingCountries || !countries
        ? getDefaultCountryOptions(t)
        : createSelectOptions(
            countries,
            t('admin.projects.filters.all_countries')
          ),
    [countries, isPendingCountries, t]
  );

  const impactTypeOptions = useMemo((): SelectOption[] => {
    if (isPendingImpactTypes || !impactTypesData)
      return defaultImpactTypeOptions;
    if (!impactTypesData?.types) return [];
    return impactTypesData.types.map(type => ({
      value: type,
      label: type,
    }));
  }, [impactTypesData, isPendingImpactTypes]);

  const statusOptions = useMemo(() => getProjectStatusOptions(t), [t]);
  const typeOptions = useMemo(() => getProjectTypeOptions(t), [t]);
  const sortOptions = useMemo(() => getProjectSortOptions(t), [t]);
  const sortSelectionItems = useMemo(() => getSortSelectionItems(t), [t]);

  const hasActiveFilters = useMemo(
    () =>
      Boolean(
        search.trim() ||
          activeOnly ||
          selectedPartnerId ||
          selectedStatus ||
          selectedProjectType ||
          selectedCountry ||
          selectedImpactTypes.length > 0 ||
          sortBy !== 'created_at_desc'
      ),
    [
      search,
      activeOnly,
      selectedPartnerId,
      selectedStatus,
      selectedProjectType,
      selectedCountry,
      selectedImpactTypes,
      sortBy,
    ]
  );

  const handleFilterChange = useCallback(
    (filterFn: () => void) => {
      startFilterTransition(filterFn);
    },
    [startFilterTransition]
  );

  const resetFilters = useCallback(() => {
    startFilterTransition(() => {
      setSearch('');
      setActiveOnly(false);
      setSelectedPartnerId(undefined);
      setSelectedStatus(undefined);
      setSelectedProjectType(undefined);
      setSelectedCountry(undefined);
      setSelectedImpactTypes([]);
      setSortBy('created_at_desc');
      setCursor(undefined);
    });
    refetch();
  }, [refetch, startFilterTransition]);

  const handleRemoveImpactType = useCallback(
    (typeToRemove: string) => {
      removeOptimisticImpactType(typeToRemove);
      handleFilterChange(() => {
        setSelectedImpactTypes(prev =>
          prev.filter(type => type !== typeToRemove)
        );
      });
    },
    [removeOptimisticImpactType, handleFilterChange]
  );

  return (
    <AdminPageLayout>
      <AdminPageHeader>
        <div className="space-y-3 md:hidden">
          <div className="flex items-center gap-2">
            <AdminPageHeader.Search
              isLoading={isLoading || isFetching}
              placeholder={t('admin.projects.search_placeholder')}
              value={search}
              onChange={setSearch}
            />
            <FilterButton
              isActive={isFilterActive}
              onClick={() => setIsFilterModalOpen(true)}
            />
          </div>
          <LocalizedLink className="w-full" href="/admin/projects/new">
            <Button className="w-full" size="sm" variant="accent">
              {t('admin.projects.new_project')}
            </Button>
          </LocalizedLink>
        </div>

        {/* Desktop Layout - reproduction exacte */}
        <div className="hidden space-y-4 md:block">
          <div className="flex items-center gap-4">
            <div className="max-w-md flex-1">
              <AdminPageHeader.Search
                isLoading={isLoading || isFetching}
                placeholder={t('admin.projects.search_placeholder')}
                value={search}
                onChange={setSearch}
              />
            </div>
            <div className="flex items-center gap-3">
              <LocalizedLink href="/admin/projects/new">
                <Button className="w-full" icon={<Plus />} size="sm">
                  {t('admin.projects.new_project')}
                </Button>
              </LocalizedLink>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-1 flex-wrap items-center gap-3">
              {/* Status Filter */}
              <SimpleSelect
                className="w-44"
                options={statusOptions}
                placeholder={t('admin.projects.filters.all_statuses')}
                value={selectedStatus || 'all'}
                onValueChange={value =>
                  handleFilterChange(() =>
                    setSelectedStatus(
                      value === 'all' ? undefined : (value as ProjectStatus)
                    )
                  )
                }
              />

              {/* Project Type Filter */}
              <SimpleSelect
                className="w-48"
                disabled={isPendingFilters}
                options={typeOptions}
                placeholder={t('admin.projects.filters.all_types')}
                value={selectedProjectType || 'all'}
                onValueChange={value =>
                  handleFilterChange(() =>
                    setSelectedProjectType(value === 'all' ? undefined : value)
                  )
                }
              />

              {/* Partner Filter */}
              <SimpleSelect
                className="w-48"
                disabled={isPendingPartners || !partners || isPendingFilters}
                options={partnerOptions}
                placeholder={t('admin.projects.filters.all_partners')}
                value={selectedPartnerId || 'all'}
                onValueChange={value =>
                  handleFilterChange(() =>
                    setSelectedPartnerId(value === 'all' ? undefined : value)
                  )
                }
              />

              {/* Country Filter */}
              <SimpleSelect
                className="w-40"
                disabled={isPendingCountries || !countries || isPendingFilters}
                options={countryOptions}
                placeholder={t('admin.projects.filters.all_countries')}
                value={selectedCountry || 'all'}
                onValueChange={value =>
                  handleFilterChange(() =>
                    setSelectedCountry(value === 'all' ? undefined : value)
                  )
                }
              />

              {/* Sort */}
              <SimpleSelect
                className="w-44"
                disabled={isPendingFilters}
                options={sortOptions}
                placeholder={t('admin.projects.filters.sort_by')}
                value={sortBy}
                onValueChange={value =>
                  handleFilterChange(() =>
                    setSortBy(value as ProjectSortOption)
                  )
                }
              />

              {/* Impact Types */}
              <SimpleSelect
                className="w-40"
                options={impactTypeOptions}
                placeholder={t('admin.projects.filters.impact_types')}
                value=""
                disabled={
                  isPendingImpactTypes || !impactTypesData || isPendingFilters
                }
                onValueChange={value => {
                  if (value && !selectedImpactTypes.includes(value)) {
                    handleFilterChange(() =>
                      setSelectedImpactTypes([...selectedImpactTypes, value])
                    );
                  }
                }}
              />

              {/* Active Only Checkbox */}
              <CheckboxWithLabel
                checked={activeOnly}
                disabled={isPendingFilters}
                label={t('admin.projects.filters.active_only')}
                onCheckedChange={v =>
                  handleFilterChange(() => setActiveOnly(Boolean(v)))
                }
              />

              {/* View Toggle */}
              <ViewToggle
                availableViews={['grid', 'list', 'map']}
                value={view}
                onChange={setView}
              />

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button
                  className="text-muted-foreground hover:text-foreground h-auto border-dashed px-3 py-2 text-xs"
                  size="sm"
                  variant="outline"
                  onClick={resetFilters}
                >
                  {t('admin.projects.filters.clear_filters')}
                </Button>
              )}

              {/* Impact Type Tags */}
              {optimisticImpactTypes.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {optimisticImpactTypes.map(type => (
                    <span
                      key={type}
                      className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 focus:ring-primary/20 inline-flex cursor-pointer items-center gap-1 rounded-md border px-2 py-1 text-xs focus:ring-2 focus:outline-none"
                      role="button"
                      tabIndex={0}
                      onClick={() => handleRemoveImpactType(type)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleRemoveImpactType(type);
                        }
                      }}
                    >
                      {type}
                      <span className="text-primary/60 hover:text-primary">
                        ×
                      </span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </AdminPageHeader>

      <AdminPageLayout.Content>
        {(() => {
          if (isError) {
            return (
              <EmptyState
                icon={MapPin}
                title={t('admin.projects.error.loading_title')}
                variant="muted"
                action={
                  <Button size="sm" variant="outline" onClick={() => refetch()}>
                    {t('admin.projects.error.retry')}
                  </Button>
                }
                description={
                  error?.message || t('admin.projects.error.loading_description')
                }
              />
            );
          }

          if (view === 'map') {
            if (isLoading) {
              return (
                <div className="bg-muted flex h-[600px] items-center justify-center rounded-lg border">
                  <div className="text-center">
                    <div className="border-primary mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
                    <p className="text-muted-foreground text-sm">
                      Chargement de la carte...
                    </p>
                  </div>
                </div>
              );
            }

            if (projectsForMap.length === 0) {
              return (
                <div className="bg-muted flex h-[600px] items-center justify-center rounded-lg border">
                  <div className="text-center">
                    <MapPin className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                    <h3 className="mb-2 text-lg font-semibold">
                      Aucun projet avec localisation
                    </h3>
                    <p className="text-muted-foreground mb-4 text-sm">
                      Les projets doivent avoir des coordonnées GPS pour apparaître
                      sur la carte.
                    </p>
                    <Button size="sm" variant="outline" onClick={resetFilters}>
                      Réinitialiser les filtres
                    </Button>
                  </div>
                </div>
              );
            }

            return (
              <MapContainer
                projects={projectsForMap}
                selectedProject={selectedProject}
                selectedType={selectedProjectType || 'all'}
                onProjectSelect={setSelectedProject}
              />
            );
          }

          // Grid/List View
          return (
            <DataList
              isLoading={isLoading}
              items={projects}
              variant={view}
              emptyState={{
                icon: MapPin,
                title: t('admin.projects.empty_state.title'),
                description: t('admin.projects.empty_state.description'),
                action: (
                  <Button size="sm" variant="outline" onClick={resetFilters}>
                    {t('admin.projects.filters.reset')}
                  </Button>
                ),
              }}
              renderItem={project => (
                <Project
                  key={project.id}
                  project={project}
                  queryParams={queryParams}
                  view={view}
                  onFilterChange={{
                    setProjectType: (type: string) =>
                      handleFilterChange(() => setSelectedProjectType(type)),
                    setPartner: (partnerId: string) =>
                      handleFilterChange(() => setSelectedPartnerId(partnerId)),
                    setCountry: (country: string) =>
                      handleFilterChange(() => setSelectedCountry(country)),
                    addImpactType: (type: string) => {
                      if (!selectedImpactTypes.includes(type)) {
                        handleFilterChange(() =>
                          setSelectedImpactTypes([...selectedImpactTypes, type])
                        );
                      }
                    },
                  }}
                />
              )}
              renderSkeleton={() =>
                view === 'grid' ? (
                  <ProjectCardSkeleton />
                ) : (
                  <ProjectListSkeleton />
                )
              }
            />
          );
        })()}

        {totalProjects > pageSize && (
          <div className="mt-6">
            <AdminPagination
              pagination={{
                currentPage: Math.max(
                  1,
                  Math.floor((totalProjects - projects.length) / pageSize) + 1
                ),
                pageSize,
                totalItems: totalProjects,
                totalPages,
              }}
            />
          </div>
        )}
      </AdminPageLayout.Content>

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      >
        <Filters>
          <Filters.View view={view} onViewChange={setView} />

          <Filters.Selection
            allLabel=""
            items={sortSelectionItems}
            label={t('admin.projects.filters.sort_by')}
            selectedId={sortBy}
            onSelectionChange={id =>
              handleFilterChange(() =>
                setSortBy((id || 'created_at_desc') as ProjectSortOption)
              )
            }
          />

          <Filters.Selection
            allLabel={t('admin.projects.filters.all_statuses')}
            label={t('admin.projects.labels.status')}
            selectedId={selectedStatus}
            items={
              statusOptions?.map(opt => ({ id: opt.value, name: opt.label })) ||
              []
            }
            onSelectionChange={id =>
              handleFilterChange(() =>
                setSelectedStatus(
                  !id || id === 'all' ? undefined : (id as ProjectStatus)
                )
              )
            }
          />

          <Filters.Selection
            allLabel={t('admin.projects.filters.all_partners')}
            items={partners || []}
            label={t('admin.projects.filter_modal.partner')}
            selectedId={selectedPartnerId}
            onSelectionChange={id =>
              handleFilterChange(() => setSelectedPartnerId(id))
            }
          />

          <Filters.Selection
            allLabel={t('admin.projects.filters.all_types')}
            label={t('admin.projects.filter_modal.type')}
            selectedId={selectedProjectType}
            items={
              typeOptions?.map(opt => ({ id: opt.value, name: opt.label })) ||
              []
            }
            onSelectionChange={id =>
              handleFilterChange(() => setSelectedProjectType(id))
            }
          />

          <Filters.Selection
            allLabel={t('admin.projects.filters.all_countries')}
            items={countries || []}
            label={t('admin.projects.filter_modal.country')}
            selectedId={selectedCountry}
            onSelectionChange={id =>
              handleFilterChange(() => setSelectedCountry(id))
            }
          />

          <Filters.Selection
            allLabel=""
            label={t('admin.projects.filter_modal.impact_types')}
            selectedId=""
            items={
              impactTypesData?.types?.map(type => ({ id: type, name: type })) ||
              []
            }
            onSelectionChange={typeId => {
              if (typeId && !selectedImpactTypes.includes(typeId)) {
                handleFilterChange(() =>
                  setSelectedImpactTypes([...selectedImpactTypes, typeId])
                );
              }
            }}
          />

          <Filters.Toggle
            checked={activeOnly}
            label={t('admin.projects.filter_modal.active_only_description')}
            onCheckedChange={v => handleFilterChange(() => setActiveOnly(v))}
          />

          {hasActiveFilters && (
            <div className="border-border/30 border-t pt-4">
              <Button
                className="text-muted-foreground hover:text-foreground w-full border-dashed"
                size="sm"
                variant="outline"
                onClick={() => {
                  resetFilters();
                  setIsFilterModalOpen(false);
                }}
              >
                {t('admin.projects.filters.clear_all_filters')}
              </Button>
            </div>
          )}
        </Filters>
      </FilterModal>
    </AdminPageLayout>
  );
};

export default ProjectsPage;
