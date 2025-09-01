'use client'
import { CreditCard } from 'lucide-react'
import { Badge } from '@/app/admin/(dashboard)/components/badge'
import { getInitials } from '@/app/admin/(dashboard)/components/ui/format-utils'
import { type FC } from 'react'
import type { Subscription } from '@/lib/types/subscription'

type SubscriptionListHeaderProps = {
  subscription: Subscription
}

export const SubscriptionListHeader: FC<SubscriptionListHeaderProps> = ({ subscription }) => {
  const displayName = subscription.users?.user_profiles 
    ? `${subscription.users.user_profiles.first_name} ${subscription.users.user_profiles.last_name}`
    : subscription.users?.email || 'Utilisateur inconnu'

  return (
    <div className="flex items-center gap-2 md:gap-3">
      <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
        {getInitials(displayName)}
      </div>

      <div className="flex items-center gap-2 flex-1 min-w-0">
        <h3 className="text-base font-medium text-foreground truncate">
          {displayName}
        </h3>

        <Badge color={subscription.status === 'active' ? 'green' : subscription.status === 'expired' ? 'red' : 'gray'}>
          {subscription.status}
        </Badge>

        <CreditCard className="w-4 h-4 text-muted-foreground" />
      </div>
    </div>
  )
}
