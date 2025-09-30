'use client';
import { CreditCard } from 'lucide-react';
import { type FC } from 'react';

import { Badge } from '@/app/[locale]/admin/(dashboard)/components/badge';
import { getInitials } from '@/app/[locale]/admin/(dashboard)/components/ui/format-utils';
import type { Subscription } from '@/lib/types/subscription';

type SubscriptionListHeaderProps = {
  subscription: Subscription;
};

export const SubscriptionListHeader: FC<SubscriptionListHeaderProps> = ({
  subscription,
}) => {
  const displayName = subscription.users?.user_profiles
    ? `${subscription.users.user_profiles.first_name} ${subscription.users.user_profiles.last_name}`
    : subscription.users?.email || 'Utilisateur inconnu';

  return (
    <div className="flex items-center gap-2 md:gap-3">
      <div className="bg-primary/10 text-primary flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium md:h-8 md:w-8">
        {getInitials(displayName)}
      </div>

      <div className="flex min-w-0 flex-1 items-center gap-2">
        <h3 className="text-foreground truncate text-base font-medium">
          {displayName}
        </h3>

        <Badge
          color={
            subscription.status === 'active'
              ? 'green'
              : (subscription.status === 'expired'
                ? 'red'
                : 'gray')
          }
        >
          {subscription.status}
        </Badge>

        <CreditCard className="text-muted-foreground h-4 w-4" />
      </div>
    </div>
  );
};
