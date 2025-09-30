'use client';
import { User, Settings, Euro, Calendar } from 'lucide-react';
import { type FC } from 'react';

import type { Subscription } from '@/lib/types/subscription';

type SubscriptionListMetadataProps = {
  subscription: Subscription;
};

export const SubscriptionListMetadata: FC<SubscriptionListMetadataProps> = ({
  subscription,
}) => (
  <div className="space-y-2">
    <div className="flex flex-wrap items-center gap-4">
      <div className="md:group-hover:text-foreground group-active:text-foreground flex items-center gap-2 transition-colors duration-200">
        <User className="text-primary/70 md:group-hover:text-primary group-active:text-primary h-4 w-4 transition-colors duration-200" />
        <span className="text-sm">{subscription.users?.email}</span>
      </div>

      <div className="md:group-hover:text-foreground group-active:text-foreground flex items-center gap-2 transition-colors duration-200">
        <Settings className="h-4 w-4 text-blue-500/70 transition-colors duration-200 group-active:text-blue-500 md:group-hover:text-blue-500" />
        <span className="text-sm">{subscription.subscription_tier}</span>
      </div>
    </div>

    <div className="flex flex-wrap items-center gap-4">
      <div className="md:group-hover:text-foreground group-active:text-foreground flex items-center gap-2 transition-colors duration-200">
        <Euro className="h-4 w-4 text-green-500/70 transition-colors duration-200 group-active:text-green-500 md:group-hover:text-green-500" />
        <span className="text-sm">
          €{subscription.amount_eur} /{' '}
          {subscription.billing_frequency === 'monthly' ? 'mois' : 'an'}
        </span>
      </div>

      <div className="md:group-hover:text-foreground group-active:text-foreground flex items-center gap-2 transition-colors duration-200">
        <Calendar className="h-4 w-4 text-purple-500/70 transition-colors duration-200 group-active:text-purple-500 md:group-hover:text-purple-500" />
        <span className="text-sm">
          Début: {new Date(subscription.start_date).toLocaleDateString('fr-FR')}
        </span>
      </div>
    </div>
  </div>
);
