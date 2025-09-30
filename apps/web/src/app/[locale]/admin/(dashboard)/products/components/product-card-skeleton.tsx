import { DataCard, DataListItem } from '../../components/ui/data-list';

import type { FC } from 'react';

export const ProductCardSkeleton: FC = () => (
  <DataCard>
    <DataCard.Header>
      <DataCard.Title>
        <div className="flex items-center gap-3">
          {/* Image du produit */}
          <div className="h-12 w-12 flex-shrink-0 animate-pulse [border-radius:var(--radius-surface)] bg-gray-200" />

          {/* Titre et badges */}
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <div className="h-5 w-32 animate-pulse [border-radius:var(--radius-xs)] bg-gray-200" />
              <div className="h-4 w-12 animate-pulse [border-radius:var(--radius-pill)] bg-gray-200" />
              <div className="h-4 w-4 animate-pulse [border-radius:var(--radius-xs)] bg-gray-200" />
            </div>
          </div>
        </div>
      </DataCard.Title>
    </DataCard.Header>

    <DataCard.Content>
      {/* Points et stock */}
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-3">
          <div className="h-3.5 w-3.5 animate-pulse [border-radius:var(--radius-xs)] bg-gray-200" />
          <div className="h-3 w-16 animate-pulse [border-radius:var(--radius-xs)] bg-gray-200" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-3.5 w-3.5 animate-pulse [border-radius:var(--radius-xs)] bg-gray-200" />
          <div className="h-3 w-20 animate-pulse [border-radius:var(--radius-xs)] bg-gray-200" />
        </div>
      </div>

      {/* Badges des catégories */}
      <div className="mt-2 flex flex-wrap gap-2">
        <div className="h-6 w-16 animate-pulse [border-radius:var(--radius-sm)] bg-gray-200" />
        <div className="h-6 w-20 animate-pulse [border-radius:var(--radius-sm)] bg-gray-200" />
        <div className="h-6 w-18 animate-pulse [border-radius:var(--radius-sm)] bg-gray-200" />
      </div>
    </DataCard.Content>

    <DataCard.Footer>
      <div className="flex flex-wrap items-center gap-1 md:gap-2">
        <div className="h-8 w-8 animate-pulse [border-radius:var(--radius-sm)] bg-gray-200" />
        <div className="h-8 w-8 animate-pulse [border-radius:var(--radius-sm)] bg-gray-200" />
        <div className="h-8 w-8 animate-pulse [border-radius:var(--radius-sm)] bg-gray-200" />
        <div className="h-8 w-12 animate-pulse [border-radius:var(--radius-sm)] bg-gray-200" />
      </div>
    </DataCard.Footer>
  </DataCard>
);

export const ProductListSkeleton: FC = () => (
  <DataListItem>
    <DataListItem.Header>
      {/* Skeleton du ProductListHeader */}
      <div className="flex items-center gap-3">
        {/* Image du produit */}
        <div className="h-10 w-10 flex-shrink-0 animate-pulse [border-radius:var(--radius-surface)] bg-gray-200" />

        {/* Titre et informations principales */}
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <div className="h-5 w-40 animate-pulse [border-radius:var(--radius-xs)] bg-gray-200" />
            <div className="h-4 w-12 animate-pulse [border-radius:var(--radius-pill)] bg-gray-200" />
            <div className="h-4 w-4 animate-pulse [border-radius:var(--radius-xs)] bg-gray-200" />
          </div>
          <div className="h-3 w-24 animate-pulse [border-radius:var(--radius-xs)] bg-gray-200" />
        </div>

        {/* Prix */}
        <div className="flex-shrink-0">
          <div className="h-6 w-16 animate-pulse [border-radius:var(--radius-sm)] bg-gray-200" />
        </div>
      </div>
    </DataListItem.Header>

    <DataListItem.Content>
      {/* Skeleton du ProductListMetadata */}
      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 animate-pulse [border-radius:var(--radius-xs)] bg-gray-200" />
            <div className="h-3 w-20 animate-pulse [border-radius:var(--radius-xs)] bg-gray-200" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 animate-pulse [border-radius:var(--radius-xs)] bg-gray-200" />
            <div className="h-3 w-16 animate-pulse [border-radius:var(--radius-xs)] bg-gray-200" />
          </div>
        </div>

        {/* Badges des catégories */}
        <div className="flex flex-wrap gap-1">
          <div className="h-5 w-16 animate-pulse [border-radius:var(--radius-sm)] bg-gray-200" />
          <div className="h-5 w-20 animate-pulse [border-radius:var(--radius-sm)] bg-gray-200" />
          <div className="h-5 w-18 animate-pulse [border-radius:var(--radius-sm)] bg-gray-200" />
        </div>
      </div>
    </DataListItem.Content>

    <DataListItem.Actions>
      {/* Skeleton des actions */}
      <div className="flex flex-wrap items-center gap-1 md:gap-2">
        <div className="h-7 w-8 animate-pulse [border-radius:var(--radius-sm)] bg-gray-200" />
        <div className="h-7 w-8 animate-pulse [border-radius:var(--radius-sm)] bg-gray-200" />
        <div className="h-7 w-8 animate-pulse [border-radius:var(--radius-sm)] bg-gray-200" />
        <div className="h-7 w-12 animate-pulse [border-radius:var(--radius-sm)] bg-gray-200" />
      </div>
    </DataListItem.Actions>
  </DataListItem>
);
