'use client';

import { ChevronRight, Home, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { type FC } from 'react';

type SubscriptionData = {
  id: string;
  user_id: string;
  subscription_tier?: string;
};

type SubscriptionBreadcrumbsProps = {
  subscription: SubscriptionData;
};

export const SubscriptionBreadcrumbs: FC<SubscriptionBreadcrumbsProps> = ({
  subscription,
}) => {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-4 pb-2 md:px-8 md:pt-6">
      <nav
        aria-label="Breadcrumb"
        className="text-muted-foreground flex items-center gap-2 text-sm"
      >
        <Link
          className="hover:text-foreground flex items-center gap-1 transition-colors"
          href="/admin/dashboard"
        >
          <Home className="h-4 w-4" />
          <span>Tableau de bord</span>
        </Link>

        <ChevronRight className="h-4 w-4" />

        <Link
          className="hover:text-foreground flex items-center gap-1 transition-colors"
          href="/admin/subscriptions"
        >
          <CreditCard className="h-4 w-4" />
          <span>Abonnements</span>
        </Link>

        <ChevronRight className="h-4 w-4" />

        <span className="text-foreground max-w-[200px] truncate font-medium md:max-w-none">
          {subscription.subscription_tier || subscription.id}
        </span>
      </nav>
    </div>
  );
};
