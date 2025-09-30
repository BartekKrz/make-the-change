import { DataCard, DataListItem } from '../../components/ui/data-list';

import type { FC } from 'react';

export const ProjectCardSkeleton: FC = () => (
  <DataCard>
    <DataCard.Header>
      <DataCard.Title>
        <div className="flex items-center gap-3">
          {/* Project image/icon */}
          <div className="h-12 w-12 flex-shrink-0 animate-pulse [border-radius:var(--radius-surface)] bg-gray-200" />

          {/* Title and badges */}
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <div className="h-5 w-40 animate-pulse [border-radius:var(--radius-xs)] bg-gray-200" />
              <div className="h-4 w-16 animate-pulse [border-radius:var(--radius-pill)] bg-gray-200" />
              <div className="h-4 w-4 animate-pulse [border-radius:var(--radius-xs)] bg-gray-200" />
            </div>
          </div>
        </div>
      </DataCard.Title>
    </DataCard.Header>

    <DataCard.Content>
      {/* Progress and funding */}
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-3">
          <div className="h-3.5 w-3.5 animate-pulse [border-radius:var(--radius-xs)] bg-gray-200" />
          <div className="h-3 w-20 animate-pulse [border-radius:var(--radius-xs)] bg-gray-200" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-3.5 w-3.5 animate-pulse [border-radius:var(--radius-xs)] bg-gray-200" />
          <div className="h-3 w-32 animate-pulse [border-radius:var(--radius-xs)] bg-gray-200" />
        </div>
      </div>

      {/* Type, country, impact badges */}
      <div className="mt-2 flex flex-wrap gap-2">
        <div className="h-6 w-20 animate-pulse [border-radius:var(--radius-sm)] bg-gray-200" />
        <div className="h-6 w-24 animate-pulse [border-radius:var(--radius-sm)] bg-gray-200" />
        <div className="h-6 w-18 animate-pulse [border-radius:var(--radius-sm)] bg-gray-200" />
      </div>
    </DataCard.Content>

    <DataCard.Footer>
      <div className="flex flex-wrap items-center gap-1 md:gap-2">
        <div className="h-8 w-24 animate-pulse [border-radius:var(--radius-sm)] bg-gray-200" />
        <div className="h-8 w-8 animate-pulse [border-radius:var(--radius-sm)] bg-gray-200" />
        <div className="h-8 w-20 animate-pulse [border-radius:var(--radius-sm)] bg-gray-200" />
      </div>
    </DataCard.Footer>
  </DataCard>
);

export const ProjectListSkeleton: FC = () => (
  <DataListItem>
    <DataListItem.Header>
      <div className="flex items-center gap-3">
        {/* Project icon */}
        <div className="h-10 w-10 flex-shrink-0 animate-pulse [border-radius:var(--radius-surface)] bg-gray-200" />

        {/* Title and main info */}
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <div className="h-5 w-48 animate-pulse [border-radius:var(--radius-xs)] bg-gray-200" />
            <div className="h-4 w-16 animate-pulse [border-radius:var(--radius-pill)] bg-gray-200" />
            <div className="h-4 w-4 animate-pulse [border-radius:var(--radius-xs)] bg-gray-200" />
          </div>
          <div className="h-3 w-28 animate-pulse [border-radius:var(--radius-xs)] bg-gray-200" />
        </div>

        {/* Progress indicator */}
        <div className="flex-shrink-0">
          <div className="h-6 w-20 animate-pulse [border-radius:var(--radius-sm)] bg-gray-200" />
        </div>
      </div>
    </DataListItem.Header>

    <DataListItem.Content>
      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 animate-pulse [border-radius:var(--radius-xs)] bg-gray-200" />
            <div className="h-3 w-16 animate-pulse [border-radius:var(--radius-xs)] bg-gray-200" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 animate-pulse [border-radius:var(--radius-xs)] bg-gray-200" />
            <div className="h-3 w-24 animate-pulse [border-radius:var(--radius-xs)] bg-gray-200" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 animate-pulse [border-radius:var(--radius-xs)] bg-gray-200" />
            <div className="h-3 w-20 animate-pulse [border-radius:var(--radius-xs)] bg-gray-200" />
          </div>
        </div>

        {/* Type, country, impact badges */}
        <div className="flex flex-wrap gap-1">
          <div className="h-5 w-16 animate-pulse [border-radius:var(--radius-sm)] bg-gray-200" />
          <div className="h-5 w-20 animate-pulse [border-radius:var(--radius-sm)] bg-gray-200" />
          <div className="h-5 w-18 animate-pulse [border-radius:var(--radius-sm)] bg-gray-200" />
          <div className="h-5 w-22 animate-pulse [border-radius:var(--radius-sm)] bg-gray-200" />
        </div>
      </div>
    </DataListItem.Content>

    <DataListItem.Actions>
      <div className="flex flex-wrap items-center gap-1 md:gap-2">
        <div className="h-7 w-24 animate-pulse [border-radius:var(--radius-sm)] bg-gray-200" />
        <div className="h-7 w-8 animate-pulse [border-radius:var(--radius-sm)] bg-gray-200" />
        <div className="h-7 w-20 animate-pulse [border-radius:var(--radius-sm)] bg-gray-200" />
      </div>
    </DataListItem.Actions>
  </DataListItem>
);