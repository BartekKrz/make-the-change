'use client';

import {
  Target,
  Star,
  Euro,
  Calendar as _Calendar,
  Edit,
  X,
  Save,
  Info,
  ChevronDown,
  ChevronUp,
  TrendingUp as _TrendingUp,
} from 'lucide-react';
import { useState } from 'react';
import { type FC } from 'react';

import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn';
import { Button } from '@/components/ui/button';

type ProjectData = {
  id: string;
  name: string;
  slug: string;
  type: 'beehive' | 'olive_tree' | 'vineyard';
  target_budget: number;
  current_funding?: number;
  status: 'active' | 'funded' | 'closed' | 'suspended';
  featured: boolean;
  producer_id: string;
  description?: string;
  long_description?: string;
  images?: string[];
};

type ProjectCompactHeaderProps = {
  projectData: ProjectData;
  isEditing?: boolean;
  onEditToggle?: (editing: boolean) => void;
  onSave?: () => void;
  isSaving?: boolean;
};

export const ProjectCompactHeader: FC<ProjectCompactHeaderProps> = ({
  projectData,
  isEditing = false,
  onEditToggle,
  onSave,
  isSaving = false,
}) => {
  const [showMobileDetails, setShowMobileDetails] = useState(false);

  const getProjectStatus = (): 'active' | 'funded' | 'closed' | 'suspended' => {
    return projectData.status;
  };

  const getProjectTypeLabel = (type: string): string => {
    const labels = {
      beehive: 'Ruche',
      olive_tree: 'Olivier',
      vineyard: 'Vigne',
    };
    return labels[type as keyof typeof labels] || type;
  };

  const status = getProjectStatus();

  const statusConfig = {
    active: {
      label: 'Actif',
      color: 'bg-green-500',
      bgClass: 'from-green-500/10 to-green-600/5',
      borderClass: 'border-green-500/20',
    },
    funded: {
      label: 'Financé',
      color: 'bg-blue-500',
      bgClass: 'from-blue-500/10 to-blue-600/5',
      borderClass: 'border-blue-500/20',
    },
    closed: {
      label: 'Fermé',
      color: 'bg-gray-500',
      bgClass: 'from-gray-500/10 to-gray-600/5',
      borderClass: 'border-gray-500/20',
    },
    suspended: {
      label: 'Suspendu',
      color: 'bg-orange-500',
      bgClass: 'from-orange-500/10 to-orange-600/5',
      borderClass: 'border-orange-500/20',
    },
  };

  const statusInfo = statusConfig[status];

  const formatBudget = (): string => {
    return `${projectData.target_budget} €`;
  };

  const formatFunding = (): string => {
    const current = projectData.current_funding ?? 0;
    const target = projectData.target_budget;
    const percentage = target > 0 ? Math.round((current / target) * 100) : 0;
    return `${current} / ${target} € (${percentage}%)`;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-4 pb-3 md:px-8 md:py-6 md:pb-4">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center md:gap-6">
        {}
        <div className="flex min-w-0 flex-1 items-start gap-3 md:items-center md:gap-4">
          <div className="from-primary/20 border-primary/20 flex-shrink-0 rounded-xl border bg-gradient-to-br to-orange-500/20 p-2 backdrop-blur-sm md:p-3">
            <Target className="text-primary h-5 w-5 md:h-6 md:w-6" />
          </div>

          <div className="min-w-0 flex-1">
            {}
            <h1 className="text-foreground mb-2 truncate text-lg leading-tight font-bold md:mb-2 md:text-2xl">
              {projectData.name}
            </h1>

            {}
            <div className="flex flex-wrap items-center gap-2 md:hidden">
              <div
                className={cn(
                  'flex items-center gap-2 rounded-full border px-2 py-1 text-xs font-medium',
                  `bg-gradient-to-r ${statusInfo.bgClass} ${statusInfo.borderClass}`
                )}
              >
                <div className={cn('h-2 w-2 rounded-full', statusInfo.color)} />
                {statusInfo.label}
              </div>

              <div className="bg-muted/40 text-muted-foreground flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium">
                <Euro className="h-3 w-3" />
                <span>{formatBudget()}</span>
              </div>
            </div>

            {}
            <div className="hidden flex-wrap items-center gap-4 md:flex">
              <div
                className={cn(
                  'flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium',
                  `bg-gradient-to-r ${statusInfo.bgClass} ${statusInfo.borderClass}`
                )}
              >
                <div className={cn('h-2 w-2 rounded-full', statusInfo.color)} />
                {statusInfo.label}
              </div>

              <div className="bg-muted/40 flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium">
                <Target className="h-3 w-3" />
                {getProjectTypeLabel(projectData.type)}
              </div>

              <div className="bg-muted/40 flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium">
                <Euro className="h-3 w-3" />
                {formatFunding()}
              </div>

              {projectData.featured && (
                <div className="flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-600">
                  <Star className="h-3 w-3" />
                  En vedette
                </div>
              )}

              <div className="from-primary/10 text-primary border-primary/20 rounded-full border bg-gradient-to-r to-orange-500/10 px-3 py-1 text-xs font-medium">
                #{projectData.id}
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="flex flex-shrink-0 items-center gap-2 self-start md:self-auto">
          {}
          {!isEditing && (
            <button
              className="text-muted-foreground hover:text-foreground focus:ring-primary/20 border-border/40 hover:border-border/60 flex items-center gap-1 rounded-md border px-2 py-1.5 text-xs transition-colors duration-200 focus:ring-2 focus:outline-none md:hidden"
              aria-label={
                showMobileDetails
                  ? 'Masquer les détails'
                  : 'Afficher les détails'
              }
              onClick={() => setShowMobileDetails(!showMobileDetails)}
            >
              <Info className="h-3 w-3" />
              {showMobileDetails ? (
                <ChevronUp className="h-3 w-3 transition-transform duration-200" />
              ) : (
                <ChevronDown className="h-3 w-3 transition-transform duration-200" />
              )}
            </button>
          )}

          {onEditToggle && (
            <>
              {isEditing ? (
                <>
                  {}
                  <div className="flex items-center gap-2 md:hidden">
                    <Button
                      className="min-h-[40px] min-w-[80px] px-4 py-2 text-sm font-medium"
                      disabled={isSaving}
                      size="default"
                      variant="outline"
                      onClick={() => onEditToggle(false)}
                    >
                      <X className="mr-1 h-4 w-4" />
                      Annuler
                    </Button>
                    <Button
                      className="from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 min-h-[40px] min-w-[100px] bg-gradient-to-r px-4 py-2 text-sm font-medium"
                      disabled={isSaving}
                      size="default"
                      variant="default"
                      onClick={onSave}
                    >
                      <Save className="mr-1 h-4 w-4" />
                      {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
                    </Button>
                  </div>

                  {}
                  <div className="hidden items-center gap-2 md:flex">
                    <Button
                      className="text-sm"
                      disabled={isSaving}
                      size="sm"
                      variant="outline"
                      onClick={() => onEditToggle(false)}
                    >
                      <X className="mr-1 h-4 w-4" />
                      Annuler
                    </Button>
                    <Button
                      className="text-sm"
                      disabled={isSaving}
                      size="sm"
                      variant="default"
                      onClick={onSave}
                    >
                      <Save className="mr-1 h-4 w-4" />
                      Sauvegarder
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {}
                  <Button
                    className="border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 flex min-h-[40px] min-w-[80px] px-4 py-2 text-sm font-medium md:hidden"
                    size="default"
                    variant="outline"
                    onClick={() => onEditToggle(true)}
                  >
                    <Edit className="mr-1 h-4 w-4" />
                    Éditer
                  </Button>

                  {}
                  <Button
                    className="hidden text-sm md:flex"
                    size="sm"
                    variant="outline"
                    onClick={() => onEditToggle(true)}
                  >
                    <Edit className="mr-1 h-4 w-4" />
                    Modifier
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {}
      {showMobileDetails && (
        <div className="border-border/30 animate-in slide-in-from-top-2 mt-3 flex border-t pt-3 duration-200 ease-out md:hidden">
          <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
            <div className="bg-muted/30 flex items-center gap-1 rounded-full px-2 py-1">
              <Target className="h-3 w-3" />
              <span>{getProjectTypeLabel(projectData.type)}</span>
            </div>
            <div className="bg-muted/30 flex items-center gap-1 rounded-full px-2 py-1">
              <Euro className="h-3 w-3" />
              <span>{formatFunding()}</span>
            </div>
            {projectData.featured && (
              <div className="flex items-center gap-1 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-2 py-1 text-yellow-600">
                <Star className="h-3 w-3" />
                <span>Vedette</span>
              </div>
            )}
            <div className="from-primary/10 text-primary border-primary/20 rounded-full border bg-gradient-to-r to-orange-500/10 px-2 py-1 text-xs font-medium">
              #{projectData.id}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
