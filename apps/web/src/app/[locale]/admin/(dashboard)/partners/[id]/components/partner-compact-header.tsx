'use client';

import { Building2, Mail, Link as LinkIcon, Edit, X, Save } from 'lucide-react';
import { type FC } from 'react';

import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn';
import { Button } from '@/components/ui/button';

import type { PartnerFormData } from '@make-the-change/api/validators/partner';

type PartnerCompactHeaderProps = {
  partnerData: PartnerFormData & { id: string };
  isEditing?: boolean;
  onEditToggle?: (editing: boolean) => void;
  onSave?: () => void;
  isSaving?: boolean;
};

export const PartnerCompactHeader: FC<PartnerCompactHeaderProps> = ({
  partnerData,
  isEditing = false,
  onEditToggle,
  onSave,
  isSaving = false,
}) => {
  const status = partnerData.status;

  const statusConfig = {
    active: {
      label: 'Actif',
      color: 'bg-green-500',
      bgClass: 'from-green-500/10 to-green-600/5',
      borderClass: 'border-green-500/20',
    },
    pending: {
      label: 'En attente',
      color: 'bg-yellow-500',
      bgClass: 'from-yellow-500/10 to-yellow-600/5',
      borderClass: 'border-yellow-500/20',
    },
    archived: {
      label: 'Archivé',
      color: 'bg-gray-500',
      bgClass: 'from-gray-500/10 to-gray-600/5',
      borderClass: 'border-gray-500/20',
    },
  };

  const statusInfo = statusConfig[status];

  return (
    <div className="mx-auto max-w-7xl px-4 py-4 pb-3 md:px-8 md:py-6 md:pb-4">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center md:gap-6">
        {}
        <div className="flex min-w-0 flex-1 items-start gap-3 md:items-center md:gap-4">
          <div className="from-primary/20 border-primary/20 flex-shrink-0 rounded-xl border bg-gradient-to-br to-orange-500/20 p-2 backdrop-blur-sm md:p-3">
            <Building2 className="text-primary h-5 w-5 md:h-6 md:w-6" />
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="text-foreground mb-2 truncate text-lg leading-tight font-bold md:mb-2 md:text-2xl">
              {partnerData.name}
            </h1>

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
                <Mail className="h-3 w-3" />
                {partnerData.contact_email}
              </div>

              {partnerData.website && (
                <div className="bg-muted/40 flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium">
                  <LinkIcon className="h-3 w-3" />
                  <a
                    className="hover:underline"
                    href={partnerData.website}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {partnerData.website}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {}
        <div className="flex flex-shrink-0 items-center gap-2 self-start md:self-auto">
          {onEditToggle && (
            <>
              {isEditing ? (
                <div className="flex items-center gap-2">
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
                    {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
                  </Button>
                </div>
              ) : (
                <Button
                  className="text-sm"
                  size="sm"
                  variant="outline"
                  onClick={() => onEditToggle(true)}
                >
                  <Edit className="mr-1 h-4 w-4" />
                  Modifier
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
