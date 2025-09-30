'use client';

import {
  CreditCard,
  Euro,
  Calendar as _Calendar,
  Edit,
  X,
  Save,
} from 'lucide-react';
import { type FC } from 'react';

import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn';
import { Button } from '@/components/ui/button';

type SubscriptionData = {
  id: string;
  user_id: string;
  subscription_tier?: string;
  billing_frequency?: string;
  amount_eur?: number;
  status?: string;
  start_date?: string;
  end_date?: string;
};

type SubscriptionCompactHeaderProps = {
  subscription: SubscriptionData;
  isEditing?: boolean;
  onEditToggle?: (editing: boolean) => void;
  onSave?: () => void;
  isSaving?: boolean;
  hasChanges?: boolean;
};

export const SubscriptionCompactHeader: FC<SubscriptionCompactHeaderProps> = ({
  subscription,
  isEditing = false,
  onEditToggle,
  onSave,
  isSaving = false,
  hasChanges = false,
}) => {
  const getStatusConfig = (status?: string) => {
    const configs = {
      active: {
        label: 'Actif',
        color: 'bg-green-500',
        bgClass: 'from-green-500/10 to-green-600/5',
        borderClass: 'border-green-500/20',
      },
      cancelled: {
        label: 'Annulé',
        color: 'bg-red-500',
        bgClass: 'from-red-500/10 to-red-600/5',
        borderClass: 'border-red-500/20',
      },
      suspended: {
        label: 'Suspendu',
        color: 'bg-orange-500',
        bgClass: 'from-orange-500/10 to-orange-600/5',
        borderClass: 'border-orange-500/20',
      },
      past_due: {
        label: 'En retard',
        color: 'bg-yellow-500',
        bgClass: 'from-yellow-500/10 to-yellow-600/5',
        borderClass: 'border-yellow-500/20',
      },
    };
    return configs[status as keyof typeof configs] || configs.active;
  };

  const statusInfo = getStatusConfig(subscription.status);

  const formatTier = (tier?: string): string => {
    const labels = {
      ambassadeur_standard: 'Ambassadeur Standard',
      ambassadeur_premium: 'Ambassadeur Premium',
    };
    return labels[tier as keyof typeof labels] || tier || 'Non défini';
  };

  const formatFrequency = (frequency?: string): string => {
    const labels = {
      monthly: 'Mensuel',
      quarterly: 'Trimestriel',
      yearly: 'Annuel',
    };
    return (
      labels[frequency as keyof typeof labels] || frequency || 'Non défini'
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-4 pb-3 md:px-8 md:py-6 md:pb-4">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center md:gap-6">
        {}
        <div className="flex min-w-0 flex-1 items-start gap-3 md:items-center md:gap-4">
          <div className="from-primary/20 border-primary/20 flex-shrink-0 rounded-xl border bg-gradient-to-br to-blue-500/20 p-2 backdrop-blur-sm md:p-3">
            <CreditCard className="text-primary h-5 w-5 md:h-6 md:w-6" />
          </div>

          <div className="min-w-0 flex-1">
            {}
            <h1 className="text-foreground mb-2 truncate text-lg leading-tight font-bold md:mb-2 md:text-2xl">
              {formatTier(subscription.subscription_tier)}
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
                <span>{subscription.amount_eur || 0} €</span>
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
                <Calendar className="h-3 w-3" />
                {formatFrequency(subscription.billing_frequency)}
              </div>

              <div className="bg-muted/40 flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium">
                <Euro className="h-3 w-3" />
                {subscription.amount_eur || 0} €
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="flex flex-shrink-0 items-center gap-2">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Button
                className="h-8 px-3"
                disabled={isSaving}
                size="sm"
                variant="outline"
                onClick={() => onEditToggle?.(false)}
              >
                <X className="mr-1 h-4 w-4" />
                Annuler
              </Button>
              <Button
                className="h-8 px-3"
                disabled={isSaving || !hasChanges}
                size="sm"
                onClick={onSave}
              >
                {isSaving ? (
                  <div className="mr-1 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <Save className="mr-1 h-4 w-4" />
                )}
                Sauvegarder
              </Button>
            </div>
          ) : (
            <Button
              className="h-8 px-3"
              size="sm"
              variant="outline"
              onClick={() => onEditToggle?.(true)}
            >
              <Edit className="mr-1 h-4 w-4" />
              Modifier
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
