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

export const PartnerBreadcrumbs: FC<PartnerBreadcrumbsProps> = ({
  partnerData,
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
          href="/admin/partners"
        >
          <Building2 className="h-4 w-4" />
          <span>Partenaires</span>
        </Link>

        <ChevronRight className="h-4 w-4" />

        <span className="text-foreground max-w-[200px] truncate font-medium md:max-w-none">
          {partnerData.name}
        </span>
      </nav>
    </div>
  );
};
