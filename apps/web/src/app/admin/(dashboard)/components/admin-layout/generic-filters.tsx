'use client';
import { type ViewMode } from '../ui/view-toggle';
import { ViewToggle } from '../ui/view-toggle';
import { Button } from '../ui/button';
import { CheckboxWithLabel } from '../ui/checkbox';
import { type ReactNode } from 'react';

type FiltersProps = {
  children: ReactNode;
};

export const Filters = ({ children }: FiltersProps) => (
  <div className="space-y-6 pb-20">
    {children}
  </div>
);


type ViewFilterProps = {
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
  availableViews?: ViewMode[];
  label?: string;
};

const ViewFilter = ({ 
  view, 
  onViewChange, 
  availableViews = ['grid', 'list'],
  label = "Mode d'affichage"
}: ViewFilterProps) => (
  <div>
    <label className="text-sm font-medium mb-3 block">{label}</label>
    <ViewToggle 
      value={view} 
      onChange={onViewChange} 
      availableViews={availableViews} 
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
  allLabel = "Tous"
}: SelectionFilterProps) => {
  if (items.length === 0) return null;
  
  return (
    <div>
      <label className="text-sm font-medium mb-3 block">{label}</label>
      <div className="space-y-2">
        <Button
          variant={selectedId === undefined ? "default" : "outline"}
          onClick={() => onSelectionChange(undefined)}
          className="w-full justify-start"
        >
          {allLabel}
        </Button>
        {items.map((item) => (
          <Button
            key={item.id}
            variant={selectedId === item.id ? "default" : "outline"}
            onClick={() => onSelectionChange(item.id)}
            className="w-full justify-start"
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

const ToggleFilter = ({ checked, onCheckedChange, label }: ToggleFilterProps) => {
  return (
    <div>
      <CheckboxWithLabel
        checked={checked}
        onCheckedChange={(checked) => onCheckedChange(Boolean(checked))}
        label={label}
      />
    </div>
  );
};


Filters.View = ViewFilter;
Filters.Selection = SelectionFilter;
Filters.Toggle = ToggleFilter;


export { type ViewMode, type SelectionItem };
