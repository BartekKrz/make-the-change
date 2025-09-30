'use client';
import { LayoutGrid, List, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { type FC } from 'react';

import { Button } from '@/components/ui/button';

export type ViewMode = 'grid' | 'list' | 'map';

type ViewToggleProps = {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
  availableViews?: ViewMode[];
};

const VIEW_CONFIG = {
  grid: { icon: LayoutGrid },
  list: { icon: List },
  map: { icon: MapPin },
} as const;

export const ViewToggle: FC<ViewToggleProps> = ({
  value,
  onChange,
  availableViews = ['grid', 'list'],
}) => {
  const t = useTranslations('ui.view_modes');

  if (availableViews.length <= 1) return null;

  return (
    <div className="border-border/60 dark:border-border/40 bg-background/50 dark:bg-card/60 inline-flex items-center gap-1 rounded-xl border p-1 backdrop-blur-sm">
      {availableViews.map(viewMode => {
        const { icon: Icon } = VIEW_CONFIG[viewMode];
        const isActive = value === viewMode;

        return (
          <Button
            key={viewMode}
            icon={<Icon className="h-4 w-4" />}
            size="sm"
            variant={isActive ? 'default' : 'outline'}
            onClick={() => onChange(viewMode)}
          >
            {t(viewMode)}
          </Button>
        );
      })}
    </div>
  );
};
