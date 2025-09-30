import { Badge } from '@/app/[locale]/admin/(dashboard)/components/badge';
import type { Subscription } from '@/lib/types/subscription';

import type { FC } from 'react';

type SubscriptionStatusBadgeProps = {
  status: Subscription['status'];
};

export const SubscriptionStatusBadge: FC<SubscriptionStatusBadgeProps> = ({
  status,
}) => {
  const variants = {
    active: { color: 'green' as const, label: 'Actif' },
    suspended: { color: 'yellow' as const, label: 'Suspendu' },
    cancelled: { color: 'red' as const, label: 'Annulé' },
    past_due: { color: 'red' as const, label: 'En retard' },
  };

  const config = variants[status];

  return <Badge color={config.color}>{config.label}</Badge>;
};
