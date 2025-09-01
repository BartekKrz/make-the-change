'use client'

import { AdminListItem } from '@/app/admin/(dashboard)/components/ui/admin-list-item'

import type { FC, ReactNode } from 'react'
import type { Subscription } from '@/lib/types/subscription'
import { SubscriptionListHeader } from './subscription-list-header'
import { SubscriptionListMetadata } from './subscription-list-metadata'

type SubscriptionListItemProps = {
  subscription: Subscription
  actions?: ReactNode
}

export const SubscriptionListItem: FC<SubscriptionListItemProps> = ({ subscription, actions }) => (
  <AdminListItem
    href={`/admin/subscriptions/${subscription.id}`}
    header={<SubscriptionListHeader subscription={subscription} />}
    metadata={<SubscriptionListMetadata subscription={subscription} />}
    actions={actions}
  />
)
