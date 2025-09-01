'use client';

import Link from 'next/link';
import { FC } from 'react';
import { ChevronRight, Home, CreditCard } from 'lucide-react';

type SubscriptionData = {
  id: string;
  user_id: string;
  subscription_tier?: string;
};

type SubscriptionBreadcrumbsProps = {
  subscription: SubscriptionData;
};

export const SubscriptionBreadcrumbs: FC<SubscriptionBreadcrumbsProps> = ({ subscription }) => {
  return (
    <div className='max-w-7xl mx-auto px-4 md:px-8 pt-4 md:pt-6 pb-2'>
      <nav aria-label='Breadcrumb' className='flex items-center gap-2 text-sm text-muted-foreground'>
        <Link
          href='/admin/dashboard'
          className='flex items-center gap-1 hover:text-foreground transition-colors'
        >
          <Home className='h-4 w-4' />
          <span>Tableau de bord</span>
        </Link>

        <ChevronRight className='h-4 w-4' />

        <Link
          href='/admin/subscriptions'
          className='flex items-center gap-1 hover:text-foreground transition-colors'
        >
          <CreditCard className='h-4 w-4' />
          <span>Abonnements</span>
        </Link>

        <ChevronRight className='h-4 w-4' />

        <span className='text-foreground font-medium truncate max-w-[200px] md:max-w-none'>
          {subscription.subscription_tier || subscription.id}
        </span>
      </nav>
    </div>
  );
};
