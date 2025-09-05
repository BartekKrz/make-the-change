'use client';

import { type FC } from 'react';
import Link from 'next/link';
import { ChevronRight, Home, Package } from 'lucide-react';

type ProductData = {
  id: string;
  name: string;
  category_id?: string;
};

type ProductBreadcrumbsProps = {
  productData: ProductData;
};

export const ProductBreadcrumbs: FC<ProductBreadcrumbsProps> = ({ productData }) => {
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
          href='/admin/products'
          className='flex items-center gap-1 hover:text-foreground transition-colors'
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
};
