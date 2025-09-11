'use client';

import { ChevronRight, Home, Package } from 'lucide-react';
import Link from 'next/link';
import { type FC } from 'react';

type ProductData = {
  id: string;
  name: string;
  category_id?: string;
};

type ProductBreadcrumbsProps = {
  productData: ProductData;
};

export const ProductBreadcrumbs: FC<ProductBreadcrumbsProps> = ({ productData }) => (
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
        href='/admin/products'
      >
        <Package className='h-4 w-4' />
        <span>Produits</span>
      </Link>

      <ChevronRight className='h-4 w-4' />

      <span className='text-foreground font-medium truncate max-w-[200px] md:max-w-none'>
        {productData.name}
      </span>
    </nav>
  </div>
);
