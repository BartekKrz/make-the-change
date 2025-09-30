import { AdminPageLayout } from '@/app/[locale]/admin/(dashboard)/components/admin-layout';
import { AdminDetailLayout } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-detail-layout';
import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';

import type { FC } from 'react';

const ProductDetailHeaderSkeleton: FC = () => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className="h-8 w-8 animate-pulse [border-radius:var(--radius-sm)] bg-gray-200" />
      <div className="space-y-1">
        <div className="h-6 w-48 animate-pulse [border-radius:var(--radius-xs)] bg-gray-200" />
        <div className="h-4 w-32 animate-pulse [border-radius:var(--radius-xs)] bg-gray-200" />
      </div>
    </div>
    <div className="flex items-center gap-2">
      <div className="h-9 w-20 animate-pulse [border-radius:var(--radius-sm)] bg-gray-200" />
      <div className="h-9 w-24 animate-pulse [border-radius:var(--radius-sm)] bg-gray-200" />
    </div>
  </div>
);

const ProductDetailSectionSkeleton: FC = () => (
  <div className="space-y-6 rounded-lg border bg-white p-6">
    <div className="space-y-1">
      <div className="h-5 w-40 animate-pulse [border-radius:var(--radius-xs)] bg-gray-200" />
      <div className="h-3 w-56 animate-pulse [border-radius:var(--radius-xs)] bg-gray-200" />
    </div>

    <div className="space-y-4">
      <div className="space-y-2">
        <div className="h-4 w-24 animate-pulse [border-radius:var(--radius-xs)] bg-gray-200" />
        <div className="h-10 w-full animate-pulse [border-radius:var(--radius-sm)] bg-gray-200" />
      </div>

      <div className="space-y-2">
        <div className="h-4 w-28 animate-pulse [border-radius:var(--radius-xs)] bg-gray-200" />
        <div className="h-24 w-full animate-pulse [border-radius:var(--radius-sm)] bg-gray-200" />
      </div>

      <div className="flex gap-4">
        <div className="flex-1 space-y-2">
          <div className="h-4 w-16 animate-pulse [border-radius:var(--radius-xs)] bg-gray-200" />
          <div className="h-10 w-full animate-pulse [border-radius:var(--radius-sm)] bg-gray-200" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="h-4 w-20 animate-pulse [border-radius:var(--radius-xs)] bg-gray-200" />
          <div className="h-10 w-full animate-pulse [border-radius:var(--radius-sm)] bg-gray-200" />
        </div>
      </div>
    </div>
  </div>
);

const ProductImagesSectionSkeleton: FC = () => (
  <div className="space-y-6 rounded-lg border bg-white p-6">
    <div className="space-y-1">
      <div className="h-5 w-32 animate-pulse [border-radius:var(--radius-xs)] bg-gray-200" />
      <div className="h-3 w-48 animate-pulse [border-radius:var(--radius-xs)] bg-gray-200" />
    </div>

    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="aspect-square animate-pulse [border-radius:var(--radius-surface)] bg-gray-200"
        />
      ))}
    </div>

    <div className="flex justify-center">
      <div className="h-10 w-32 animate-pulse [border-radius:var(--radius-sm)] bg-gray-200" />
    </div>
  </div>
);

export const ProductDetailSkeleton: FC = () => (
  <AdminPageLayout>
    <AdminDetailLayout headerContent={<ProductDetailHeaderSkeleton />}>
      <DetailView gridCols={2} spacing="md" variant="cards">
        <ProductDetailSectionSkeleton />
        <ProductDetailSectionSkeleton />
        <ProductDetailSectionSkeleton />
        <ProductDetailSectionSkeleton />
        <ProductDetailSectionSkeleton />
        <ProductImagesSectionSkeleton />
      </DetailView>

      <div className="mt-6 flex justify-end gap-2">
        <div className="h-10 w-20 animate-pulse [border-radius:var(--radius-sm)] bg-gray-200" />
        <div className="h-10 w-28 animate-pulse [border-radius:var(--radius-sm)] bg-gray-200" />
      </div>
    </AdminDetailLayout>
  </AdminPageLayout>
);
