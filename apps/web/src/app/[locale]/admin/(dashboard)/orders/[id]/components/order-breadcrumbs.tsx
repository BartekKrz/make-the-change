'use client';

import { ChevronRight, Home, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { type FC } from 'react';

type OrderBreadcrumbsProps = { orderData: { id: string } };

export const OrderBreadcrumbs: FC<OrderBreadcrumbsProps> = ({ orderData }) => {
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
          href="/admin/orders"
        >
          <ShoppingCart className="h-4 w-4" />
          <span>Commandes</span>
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground max-w-[200px] truncate font-medium md:max-w-none">
          Commande #{orderData.id.slice(0, 8)}
        </span>
      </nav>
    </div>
  );
};
