import { DataCard, DataListItem } from "../../components/ui/data-list";

import type { FC } from "react";


export const ProductCardSkeleton: FC = () => (
  <DataCard>
    <DataCard.Header>
      <DataCard.Title>
        <div className="flex items-center gap-3">
          {/* Image du produit */}
          <div className="w-12 h-12 bg-gray-200 [border-radius:var(--radius-surface)] animate-pulse flex-shrink-0" />
          
          {/* Titre et badges */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <div className="w-32 h-5 bg-gray-200 [border-radius:var(--radius-xs)] animate-pulse" />
              <div className="w-12 h-4 bg-gray-200 [border-radius:var(--radius-pill)] animate-pulse" />
              <div className="w-4 h-4 bg-gray-200 [border-radius:var(--radius-xs)] animate-pulse" />
            </div>
          </div>
        </div>
      </DataCard.Title>
    </DataCard.Header>
    
    <DataCard.Content>
      {/* Points et stock */}
      <div className="flex items-center gap-4 flex-wrap text-sm">
        <div className="flex items-center gap-3">
          <div className="w-3.5 h-3.5 bg-gray-200 [border-radius:var(--radius-xs)] animate-pulse" />
          <div className="w-16 h-3 bg-gray-200 [border-radius:var(--radius-xs)] animate-pulse" />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-3.5 h-3.5 bg-gray-200 [border-radius:var(--radius-xs)] animate-pulse" />
          <div className="w-20 h-3 bg-gray-200 [border-radius:var(--radius-xs)] animate-pulse" />
        </div>
      </div>
      
      {/* Badges des catégories */}
      <div className="flex flex-wrap gap-2 mt-2">
        <div className="w-16 h-6 bg-gray-200 [border-radius:var(--radius-sm)] animate-pulse" />
        <div className="w-20 h-6 bg-gray-200 [border-radius:var(--radius-sm)] animate-pulse" />
        <div className="w-18 h-6 bg-gray-200 [border-radius:var(--radius-sm)] animate-pulse" />
      </div>
    </DataCard.Content>
    
    <DataCard.Footer>
      <div className="flex items-center gap-1 md:gap-2 flex-wrap">
        <div className="w-8 h-8 bg-gray-200 [border-radius:var(--radius-sm)] animate-pulse" />
        <div className="w-8 h-8 bg-gray-200 [border-radius:var(--radius-sm)] animate-pulse" />
        <div className="w-8 h-8 bg-gray-200 [border-radius:var(--radius-sm)] animate-pulse" />
        <div className="w-12 h-8 bg-gray-200 [border-radius:var(--radius-sm)] animate-pulse" />
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
        <div className="w-10 h-10 bg-gray-200 [border-radius:var(--radius-surface)] animate-pulse flex-shrink-0" />
        
        {/* Titre et informations principales */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-40 h-5 bg-gray-200 [border-radius:var(--radius-xs)] animate-pulse" />
            <div className="w-12 h-4 bg-gray-200 [border-radius:var(--radius-pill)] animate-pulse" />
            <div className="w-4 h-4 bg-gray-200 [border-radius:var(--radius-xs)] animate-pulse" />
          </div>
          <div className="w-24 h-3 bg-gray-200 [border-radius:var(--radius-xs)] animate-pulse" />
        </div>
        
        {/* Prix */}
        <div className="flex-shrink-0">
          <div className="w-16 h-6 bg-gray-200 [border-radius:var(--radius-sm)] animate-pulse" />
        </div>
      </div>
    </DataListItem.Header>
    
    <DataListItem.Content>
      {/* Skeleton du ProductListMetadata */}
      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-200 [border-radius:var(--radius-xs)] animate-pulse" />
            <div className="w-20 h-3 bg-gray-200 [border-radius:var(--radius-xs)] animate-pulse" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-200 [border-radius:var(--radius-xs)] animate-pulse" />
            <div className="w-16 h-3 bg-gray-200 [border-radius:var(--radius-xs)] animate-pulse" />
          </div>
        </div>
        
        {/* Badges des catégories */}
        <div className="flex flex-wrap gap-1">
          <div className="w-16 h-5 bg-gray-200 [border-radius:var(--radius-sm)] animate-pulse" />
          <div className="w-20 h-5 bg-gray-200 [border-radius:var(--radius-sm)] animate-pulse" />
          <div className="w-18 h-5 bg-gray-200 [border-radius:var(--radius-sm)] animate-pulse" />
        </div>
      </div>
    </DataListItem.Content>
    
    <DataListItem.Actions>
      {/* Skeleton des actions */}
      <div className="flex items-center gap-1 md:gap-2 flex-wrap">
        <div className="w-8 h-7 bg-gray-200 [border-radius:var(--radius-sm)] animate-pulse" />
        <div className="w-8 h-7 bg-gray-200 [border-radius:var(--radius-sm)] animate-pulse" />
        <div className="w-8 h-7 bg-gray-200 [border-radius:var(--radius-sm)] animate-pulse" />
        <div className="w-12 h-7 bg-gray-200 [border-radius:var(--radius-sm)] animate-pulse" />
      </div>
    </DataListItem.Actions>
  </DataListItem>
);
