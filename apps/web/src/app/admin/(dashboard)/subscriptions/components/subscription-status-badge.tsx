import { Badge } from '@/app/admin/(dashboard)/components/badge';
import type { Subscription } from '@/lib/types/subscription';

interface SubscriptionStatusBadgeProps {
  status: Subscription['status'];
}

export function SubscriptionStatusBadge({ status }: SubscriptionStatusBadgeProps) {
  const variants = {
    active: { color: 'green' as const, label: 'Actif' },
    suspended: { color: 'yellow' as const, label: 'Suspendu' },
    cancelled: { color: 'red' as const, label: 'Annulé' },
    past_due: { color: 'red' as const, label: 'En retard' },
  };

  const config = variants[status];

  return (
    <Badge color={config.color}>
      {config.label}
    </Badge>
  );
}
