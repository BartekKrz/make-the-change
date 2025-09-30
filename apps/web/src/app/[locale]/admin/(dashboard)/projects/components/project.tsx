'use client';
import { MapPin, Plus, Minus, Eye, EyeOff, Star } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { type FC, useRef, startTransition } from 'react';

import {
  DataCard,
  DataListItem,
} from '@/app/[locale]/admin/(dashboard)/components/ui/data-list';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
import type { RouterOutputs, RouterInputs } from '@/lib/trpc';
import { cn } from '@/lib/utils';

type ProjectUpdateInput = RouterInputs['admin']['projects']['update']['patch'];
type ProjectItem = RouterOutputs['admin']['projects']['list']['items'][number];

type ProjectStatus = 'active' | 'funded' | 'closed' | 'suspended';

type ProjectProps = {
  project: ProjectItem;
  view: 'grid' | 'list';
  queryParams: {
    cursor?: string;
    search?: string;
    activeOnly?: boolean;
    status?: ProjectStatus;
    partnerId?: string;
    projectType?: string;
    country?: string;
    impactTypes?: string[];
    sortBy?: string;
    limit: number;
  };
  onFilterChange?: {
    setProjectType: (type: string) => void;
    setPartner: (partnerId: string) => void;
    setCountry: (country: string) => void;
    addImpactType: (type: string) => void;
  };
};

const getProjectContextClass = (project: ProjectItem) => {
  const type = project.type?.toLowerCase() || '';

  if (type.includes('beehive') || type.includes('bee')) {
    return 'badge-honey';
  }
  if (type.includes('olive') || type.includes('tree')) {
    return 'badge-olive';
  }
  if (type.includes('vineyard') || type.includes('wine')) {
    return 'badge-grape';
  }
  if (type.includes('forest') || type.includes('reforestation')) {
    return 'badge-earth';
  }
  if (type.includes('solar') || type.includes('renewable')) {
    return 'badge-energy';
  }
  return 'badge-accent-subtle';
};

export const Project: FC<ProjectProps> = ({
  project,
  view,
  queryParams,
  onFilterChange,
}) => {
  const t = useTranslations('admin.projects');
  const pendingRequest = useRef<NodeJS.Timeout | null>(null);
  const utils = trpc.useUtils();

  const removeFocusFromParent = (e: any) => {
    const listContainer = e.currentTarget.closest('[role="button"]');
    if (listContainer) {
      (listContainer as HTMLElement).blur();
    }
  };

  const updateProject = trpc.admin.projects.update.useMutation({
    onMutate: async ({ id, patch }) => {
      await utils.admin.projects.list.cancel();
      const previousData = utils.admin.projects.list.getData(queryParams);

      utils.admin.projects.list.setData(queryParams, old => {
        if (!old?.items) return old;

        return {
          ...old,
          items: old.items.map((item: ProjectItem) => {
            if (item.id === id) {
              const updated: ProjectItem = { ...item };
              if (patch.funding_target !== undefined) {
                updated.funding_target = patch.funding_target;
              }
              if (patch.status !== undefined) {
                updated.status = patch.status;
              }
              if (patch.featured !== undefined) {
                updated.featured = patch.featured;
              }
              return updated;
            }
            return item;
          }),
        };
      });

      return { previousData };
    },
    onError: (_err: any, _variables: any, context: any) => {
      if (context?.previousData) {
        utils.admin.projects.list.setData(queryParams, context.previousData);
      }
    },
  });

  const debouncedMutation = (patch: ProjectUpdateInput, delay = 500) => {
    if (pendingRequest.current) {
      clearTimeout(pendingRequest.current);
    }

    startTransition(() => {
      const currentData = utils.admin.projects.list.getData(queryParams);

      if (currentData?.items) {
        const optimisticData = {
          ...currentData,
          items: currentData.items.map((p: ProjectItem) => {
            if (p.id === project.id) {
              const updated: ProjectItem = { ...p };
              if (patch.funding_target !== undefined) {
                updated.funding_target = patch.funding_target;
              }
              if (patch.status !== undefined) {
                updated.status = patch.status;
              }
              if (patch.featured !== undefined) {
                updated.featured = patch.featured;
              }
              return updated;
            }
            return p;
          }),
        };
        utils.admin.projects.list.setData(queryParams, optimisticData);
      }
    });

    pendingRequest.current = setTimeout(() => {
      updateProject.mutate({ id: project.id, patch });
      pendingRequest.current = null;
    }, delay);
  };

  const adjustFundingTarget = (delta: number) => {
    const currentTarget = project.funding_target || 0;
    const newTarget = Math.max(0, currentTarget + delta);
    if (newTarget === currentTarget) return;

    startTransition(() => {
      debouncedMutation({ funding_target: newTarget });
    });
  };

  const toggleStatus = () => {
    const newStatus = project.status === 'active' ? 'suspended' : 'active';
    startTransition(() => {
      debouncedMutation({ status: newStatus }, 300);
    });
  };

  const toggleFeatured = () => {
    startTransition(() => {
      debouncedMutation({ featured: !project.featured }, 300);
    });
  };

  const actions = (
    <div className="flex w-full items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="bg-background dark:bg-card border-border dark:border-border group inline-flex items-center overflow-hidden rounded-xl border shadow-sm dark:shadow-black/10">
          <Button
            aria-label={t('funding.increase')}
            className="text-muted-foreground hover:text-primary hover:bg-primary/8 h-10 rounded-none border-0 px-3 transition-all duration-200 active:scale-95"
            size="sm"
            title={t('funding.increase')}
            variant="ghost"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              removeFocusFromParent(e);
              adjustFundingTarget(1000); // Increase by 1000€
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>

          <div className="border-border dark:border-border bg-muted/30 dark:bg-muted/20 relative min-w-[4rem] border-x px-4 py-2 text-center">
            <span className="text-foreground dark:text-foreground text-sm font-semibold tabular-nums">
              {project.funding_target || 0}€
            </span>
            <div className="via-primary/5 dark:via-primary/10 absolute inset-0 bg-gradient-to-r from-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>

          <Button
            aria-label={t('funding.decrease')}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/8 disabled:hover:text-muted-foreground h-10 rounded-none border-0 px-3 transition-all duration-200 active:scale-95 disabled:hover:bg-transparent"
            disabled={project.funding_target === 0}
            size="sm"
            title={t('funding.decrease')}
            variant="ghost"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              removeFocusFromParent(e);
              adjustFundingTarget(-1000); // Decrease by 1000€
            }}
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>

        {/* Featured Toggle */}
        <Button
          size="sm"
          variant="ghost"
          aria-label={
            project.featured ? t('featured.remove') : t('featured.add')
          }
          className={cn(
            'h-10 px-3 transition-all duration-200 active:scale-95',
            project.featured
              ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100 hover:text-yellow-700'
              : 'text-muted-foreground hover:bg-yellow-50 hover:text-yellow-600'
          )}
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            removeFocusFromParent(e);
            toggleFeatured();
          }}
        >
          <Star className={cn('h-4 w-4', project.featured && 'fill-current')} />
        </Button>
      </div>

      {/* Status Toggle */}
      <div className="flex items-center gap-2">
        <div
          aria-checked={project.status === 'active' ? 'true' : 'false'}
          role="switch"
          tabIndex={0}
          aria-label={
            project.status === 'active'
              ? t('statusActions.suspend')
              : t('statusActions.activate')
          }
          className={cn(
            'focus-within:ring-primary/20 dark:focus-within:ring-primary/30 relative inline-flex h-6 w-11 cursor-pointer rounded-full border-2 transition-all duration-200 ease-in-out focus-within:ring-2',
            project.status === 'active'
              ? 'bg-success dark:bg-success border-success dark:border-success dark:shadow-success/20 shadow-sm'
              : 'bg-muted dark:bg-muted border-border dark:border-border hover:bg-muted/80 dark:hover:bg-muted/60'
          )}
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            removeFocusFromParent(e);
            toggleStatus();
          }}
          onKeyDown={e => {
            if (!(e.key === 'Enter' || e.key === ' ')) return;
            e.preventDefault();
            e.stopPropagation();
            toggleStatus();
          }}
        >
          <span
            className={cn(
              'bg-background dark:bg-background inline-block h-5 w-5 transform rounded-full shadow-sm transition-transform duration-200 ease-in-out dark:shadow-black/20',
              project.status === 'active' ? 'translate-x-5' : 'translate-x-0'
            )}
          />
        </div>

        <div className="flex items-center gap-1.5 text-sm">
          <div
            className={cn(
              'flex items-center justify-center transition-colors duration-200',
              project.status === 'active'
                ? 'text-success dark:text-success'
                : 'text-muted-foreground dark:text-muted-foreground'
            )}
          >
            {project.status === 'active' ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </div>
          <span
            className={cn(
              'font-medium transition-colors duration-200',
              project.status === 'active'
                ? 'text-foreground dark:text-foreground'
                : 'text-muted-foreground dark:text-muted-foreground'
            )}
          >
            {project.status === 'active'
              ? t('statuses.active')
              : t('statuses.inactive')}
          </span>
        </div>
      </div>
    </div>
  );

  if (view === 'grid')
    return (
      <DataCard href={`/admin/projects/${project.id}`}>
        <DataCard.Header>
          <DataCard.Title
            icon={MapPin}
            image={project.images?.[0]}
            imageAlt={project.name}
            imageBlurDataURL={(project as any).cover_blur_data_url || undefined}
            images={project.images || undefined}
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-lg leading-tight font-semibold tracking-tight">
                {project.name}
              </span>
              <span className="text-muted-foreground/80 text-xs leading-relaxed font-medium">
                {project.short_description}
              </span>
            </div>
          </DataCard.Title>
        </DataCard.Header>

        <DataCard.Content>
          <div className="mt-2 flex flex-wrap gap-2">
            {/* Project Type Badge */}
            {project.type && (
              <button
                title={t('filters_tooltip.type', { type: project.type })}
                className={cn(
                  getProjectContextClass(project),
                  'cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-sm hover:brightness-110 active:scale-95'
                )}
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (onFilterChange) {
                    onFilterChange.setProjectType(project.type);
                  }
                }}
              >
                {project.type}
              </button>
            )}

            {/* Partner Badge */}
            {project.partner && (
              <button
                className="badge-subtle hover:bg-primary/15 dark:hover:bg-primary/20 hover:text-primary dark:hover:text-primary hover:border-primary/30 dark:hover:border-primary/40 dark:hover:shadow-primary/10 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-sm active:scale-95"
                title={t('filters_tooltip.partner', {
                  name: project.partner.name,
                })}
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (onFilterChange && project.partner) {
                    onFilterChange.setPartner(project.partner.id);
                  }
                }}
              >
                {project.partner.name}
              </button>
            )}

            {/* Country Badge */}
            {project.country && (
              <button
                className="tag-subtle hover:bg-accent/20 dark:hover:bg-accent/25 hover:text-accent-dark dark:hover:text-accent hover:border-accent/40 dark:hover:border-accent/50 dark:hover:shadow-accent/10 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-sm active:scale-95"
                title={t('filters_tooltip.country', {
                  country: project.country,
                })}
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (onFilterChange) {
                    onFilterChange.setCountry(project.country!);
                  }
                }}
              >
                {project.country}
              </button>
            )}

            {/* Impact Types */}
            {project.impact_types?.slice(0, 3).map(impactType => (
              <button
                key={impactType}
                className="bg-muted/50 dark:bg-muted/30 text-muted-foreground dark:text-muted-foreground border-muted/60 dark:border-muted/40 hover:bg-muted dark:hover:bg-muted/60 hover:text-foreground dark:hover:text-foreground hover:border-muted-foreground/80 dark:hover:border-muted-foreground/60 inline-flex cursor-pointer items-center rounded-md border px-2 py-1 text-xs transition-all duration-200 hover:scale-105 hover:shadow-sm active:scale-95 dark:hover:shadow-black/20"
                title={t('filters_tooltip.impact_type', { type: impactType })}
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (onFilterChange) {
                    onFilterChange.addImpactType(impactType);
                  }
                }}
              >
                {impactType}
              </button>
            ))}
          </div>
        </DataCard.Content>
        <DataCard.Footer>{actions}</DataCard.Footer>
      </DataCard>
    );

  return (
    <DataListItem href={`/admin/projects/${project.id}`}>
      <DataListItem.Header>
        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex-shrink-0">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
              <MapPin className="text-primary h-5 w-5" />
            </div>
          </div>
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <h3 className="text-foreground truncate text-lg leading-tight font-semibold tracking-tight">
              {project.name}
            </h3>

            <span className="text-muted-foreground/80 font-mono text-xs tracking-wider uppercase">
              {project.slug}
            </span>

            {project.featured && (
              <button
                className="hover:text-accent pointer-events-auto cursor-pointer transition-all duration-200 hover:scale-110 hover:drop-shadow-sm active:scale-95"
                title={t('filters_tooltip.featured')}
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeFocusFromParent(e);
                }}
              >
                <Star className="h-4 w-4 fill-current text-yellow-500" />
              </button>
            )}
          </div>
        </div>
      </DataListItem.Header>

      <DataListItem.Content>
        <div className="space-y-3">
          {/* Badges and clickable tags */}
          <div className="flex flex-wrap gap-2">
            {project.type && (
              <button
                title={t('filters_tooltip.type', { type: project.type })}
                className={cn(
                  getProjectContextClass(project),
                  'pointer-events-auto cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-sm active:scale-95'
                )}
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeFocusFromParent(e);
                  if (onFilterChange) {
                    onFilterChange.setProjectType(project.type!);
                  }
                }}
              >
                {project.type}
              </button>
            )}

            {project.partner && (
              <button
                className="badge-subtle hover:bg-primary/15 dark:hover:bg-primary/20 hover:text-primary dark:hover:text-primary hover:border-primary/30 dark:hover:border-primary/40 dark:hover:shadow-primary/10 pointer-events-auto cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-sm active:scale-95"
                title={t('filters_tooltip.partner', {
                  name: project.partner.name,
                })}
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeFocusFromParent(e);
                  if (onFilterChange && project.partner) {
                    onFilterChange.setPartner(project.partner.id);
                  }
                }}
              >
                {project.partner.name}
              </button>
            )}

            {project.country && (
              <button
                className="tag-subtle hover:bg-accent/20 dark:hover:bg-accent/25 hover:text-accent-dark dark:hover:text-accent hover:border-accent/40 dark:hover:border-accent/50 dark:hover:shadow-accent/10 pointer-events-auto cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-sm active:scale-95"
                title={t('filters_tooltip.country', {
                  country: project.country,
                })}
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeFocusFromParent(e);
                  if (onFilterChange) {
                    onFilterChange.setCountry(project.country!);
                  }
                }}
              >
                {project.country}
              </button>
            )}

            {/* Impact Types */}
            {project.impact_types?.slice(0, 4).map(impactType => (
              <button
                key={impactType}
                className="bg-muted/50 dark:bg-muted/30 text-muted-foreground dark:text-muted-foreground border-muted/60 dark:border-muted/40 hover:bg-muted dark:hover:bg-muted/60 hover:text-foreground dark:hover:text-foreground hover:border-muted-foreground/80 dark:hover:border-muted-foreground/60 pointer-events-auto inline-flex cursor-pointer items-center rounded-md border px-2.5 py-1 text-xs leading-tight font-medium tracking-wide transition-all duration-200 hover:scale-105 hover:shadow-sm active:scale-95 dark:hover:shadow-black/20"
                title={t('filters_tooltip.impact_type', { type: impactType })}
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeFocusFromParent(e);
                  if (onFilterChange) {
                    onFilterChange.addImpactType(impactType);
                  }
                }}
              >
                {impactType}
              </button>
            ))}
            {project.impact_types && project.impact_types.length > 4 && (
              <span className="text-muted-foreground/60 inline-flex items-center px-2 py-0.5 text-xs font-medium tracking-wide">
                {t('other_impact_types', {
                  count: project.impact_types.length - 4,
                })}
              </span>
            )}
          </div>
        </div>
      </DataListItem.Content>
      <DataListItem.Actions>{actions}</DataListItem.Actions>
    </DataListItem>
  );
};
