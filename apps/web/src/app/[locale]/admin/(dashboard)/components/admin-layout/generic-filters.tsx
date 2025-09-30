'use client';

import { Button } from '@/components/ui/button';

import { CheckboxWithLabel } from '../ui/checkbox';
import { ViewToggle } from '../ui/view-toggle';

import type { ViewMode } from '../ui/view-toggle';
import type { FC, ReactNode } from 'react';

type FiltersProps = {
  children: ReactNode;
};

export const Filters = ({ children }: FiltersProps) => (
  <div className="space-y-6 pb-20">{children}</div>
);

type ViewFilterProps = {
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
  availableViews?: ViewMode[];
  label?: string;
};

const ViewFilter: FC<ViewFilterProps> = ({
  view,
  onViewChange,
  availableViews = ['grid', 'list'],
  label = "Mode d'affichage",
}) => (
  <div>
    <label className="mb-3 block text-sm font-medium">{label}</label>
    <ViewToggle
      availableViews={availableViews}
      value={view}
      onChange={onViewChange}
    />
  </div>
);

type SelectionItem = {
  id: string;
  name: string;
};

type SelectionFilterProps = {
  items: SelectionItem[];
  selectedId?: string;
  onSelectionChange: (id: string | undefined) => void;
  label: string;
  allLabel?: string;
};

const SelectionFilter = ({
  items,
  selectedId,
  onSelectionChange,
  label,
  allLabel = 'Tous',
}: SelectionFilterProps) => {
  if (items.length === 0) return null;

  return (
    <div>
      <label className="mb-3 block text-sm font-medium">{label}</label>
      <div className="space-y-2">
        <Button
          className="w-full justify-start"
          variant={selectedId === undefined ? 'default' : 'outline'}
          onClick={() => onSelectionChange()}
        >
          {allLabel}
        </Button>
        {items.map(item => (
          <Button
            key={item.id}
            className="w-full justify-start"
            variant={selectedId === item.id ? 'default' : 'outline'}
            onClick={() => onSelectionChange(item.id)}
          >
            {item.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

type ToggleFilterProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
};

const ToggleFilter: FC<ToggleFilterProps> = ({
  checked,
  onCheckedChange,
  label,
}) => (
  <div>
    <CheckboxWithLabel
      checked={checked}
      label={label}
      onCheckedChange={checked => onCheckedChange(Boolean(checked))}
    />
  </div>
);

Filters.View = ViewFilter;
Filters.Selection = SelectionFilter;
Filters.Toggle = ToggleFilter;

export { type SelectionItem };

export { type ViewMode } from '../ui/view-toggle';
