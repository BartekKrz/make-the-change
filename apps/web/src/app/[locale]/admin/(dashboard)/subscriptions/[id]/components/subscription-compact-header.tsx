'use client';

import { CreditCard, Euro, Calendar as _Calendar, Edit, X, Save } from 'lucide-react';
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
  hasChanges = false
}) => {
  const getStatusConfig = (status?: string) => {
    const configs = {
      active: {
        label: 'Actif',
        color: 'bg-green-500',
        bgClass: 'from-green-500/10 to-green-600/5',
        borderClass: 'border-green-500/20'
      },
      cancelled: {
        label: 'Annulé',
        color: 'bg-red-500',
        bgClass: 'from-red-500/10 to-red-600/5',
        borderClass: 'border-red-500/20'
      },
      suspended: {
        label: 'Suspendu',
        color: 'bg-orange-500',
        bgClass: 'from-orange-500/10 to-orange-600/5',
        borderClass: 'border-orange-500/20'
      },
      past_due: {
        label: 'En retard',
        color: 'bg-yellow-500',
        bgClass: 'from-yellow-500/10 to-yellow-600/5',
        borderClass: 'border-yellow-500/20'
      }
    };
    return configs[status as keyof typeof configs] || configs.active;
  };

  const statusInfo = getStatusConfig(subscription.status);

  const formatTier = (tier?: string): string => {
    const labels = {
      ambassadeur_standard: 'Ambassadeur Standard',
      ambassadeur_premium: 'Ambassadeur Premium'
    };
    return labels[tier as keyof typeof labels] || tier || 'Non défini';
  };

  const formatFrequency = (frequency?: string): string => {
    const labels = {
      monthly: 'Mensuel',
      quarterly: 'Trimestriel',
      yearly: 'Annuel'
    };
    return labels[frequency as keyof typeof labels] || frequency || 'Non défini';
  };

  return (
    <div className='max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-6 pb-3 md:pb-4'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-6'>
        {}
        <div className='flex items-start md:items-center gap-3 md:gap-4 flex-1 min-w-0'>
          <div className='p-2 md:p-3 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-xl border border-primary/20 backdrop-blur-sm flex-shrink-0'>
            <CreditCard className='h-5 w-5 md:h-6 md:w-6 text-primary' />
          </div>

          <div className='flex-1 min-w-0'>
            {}
            <h1 className='text-lg md:text-2xl font-bold text-foreground leading-tight truncate mb-2 md:mb-2'>
              {formatTier(subscription.subscription_tier)}
            </h1>

            {}
            <div className='flex md:hidden items-center gap-2 flex-wrap'>
              <div
                className={cn(
                  'flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium border',
                  `bg-gradient-to-r ${statusInfo.bgClass} ${statusInfo.borderClass}`
                )}
              >
                <div className={cn('w-2 h-2 rounded-full', statusInfo.color)} />
                {statusInfo.label}
              </div>

              <div className='flex items-center gap-1 px-2 py-1 bg-muted/40 rounded-full text-xs font-medium text-muted-foreground'>
                <Euro className='h-3 w-3' />
                <span>{subscription.amount_eur || 0} €</span>
              </div>
            </div>

            {}
            <div className='hidden md:flex items-center gap-4 flex-wrap'>
              <div
                className={cn(
                  'flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border',
                  `bg-gradient-to-r ${statusInfo.bgClass} ${statusInfo.borderClass}`
                )}
              >
                <div className={cn('w-2 h-2 rounded-full', statusInfo.color)} />
                {statusInfo.label}
              </div>

              <div className='flex items-center gap-2 px-3 py-1 bg-muted/40 rounded-full text-xs font-medium'>
                <Calendar className='h-3 w-3' />
                {formatFrequency(subscription.billing_frequency)}
              </div>

              <div className='flex items-center gap-2 px-3 py-1 bg-muted/40 rounded-full text-xs font-medium'>
                <Euro className='h-3 w-3' />
                {subscription.amount_eur || 0} €
              </div>
            </div>
          </div>
        </div>

        {}
        <div className='flex items-center gap-2 flex-shrink-0'>
          {isEditing ? (
            <div className='flex items-center gap-2'>
              <Button
                className='h-8 px-3'
                disabled={isSaving}
                size='sm'
                variant='outline'
                onClick={() => onEditToggle?.(false)}
              >
                <X className='h-4 w-4 mr-1' />
                Annuler
              </Button>
              <Button
                className='h-8 px-3'
                disabled={isSaving || !hasChanges}
                size='sm'
                onClick={onSave}
              >
                {isSaving ? (
                  <div className='h-4 w-4 mr-1 animate-spin rounded-full border-2 border-current border-t-transparent' />
                ) : (
                  <Save className='h-4 w-4 mr-1' />
                )}
                Sauvegarder
              </Button>
            </div>
          ) : (
            <Button
              className='h-8 px-3'
              size='sm'
              variant='outline'
              onClick={() => onEditToggle?.(true)}
            >
              <Edit className='h-4 w-4 mr-1' />
              Modifier
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
