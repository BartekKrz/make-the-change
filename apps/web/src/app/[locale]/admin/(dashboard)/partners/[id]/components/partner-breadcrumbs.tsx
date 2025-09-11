'use client';

import { ChevronRight, Home, Building2 } from 'lucide-react';
import Link from 'next/link';
import { type FC } from 'react';

type PartnerData = {
  id: string;
  name: string;
};

type PartnerBreadcrumbsProps = {
  partnerData: PartnerData;
};

export const PartnerBreadcrumbs: FC<PartnerBreadcrumbsProps> = ({ partnerData }) => {
  return (
    <div className='max-w-7xl mx-auto px-4 md:px-8 pt-4 md:pt-6 pb-2'>
      <nav aria-label='Breadcrumb' className='flex items-center gap-2 text-sm text-muted-foreground'>
        <Link
          className='flex items-center gap-1 hover:text-foreground transition-colors'
          href='/admin/dashboard'
        >
          <Home className='h-4 w-4' />
          <span>Tableau de bord</span>
        </Link>

        <ChevronRight className='h-4 w-4' />

        <Link
          className='flex items-center gap-1 hover:text-foreground transition-colors'
          href='/admin/partners'
        >
          <Building2 className='h-4 w-4' />
          <span>Partenaires</span>
        </Link>

        <ChevronRight className='h-4 w-4' />

        <span className='text-foreground font-medium truncate max-w-[200px] md:max-w-none'>
          {partnerData.name}
        </span>
      </nav>
    </div>
  );
};
