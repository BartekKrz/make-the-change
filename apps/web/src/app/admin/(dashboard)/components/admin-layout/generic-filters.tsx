'use client';
import { type ViewMode } from '../ui/view-toggle';
import { ViewToggle } from '../ui/view-toggle';
import { Button } from '../ui/button';
import { CheckboxWithLabel } from '../ui/checkbox';

// Conteneur principal pour les filtres
type FiltersProps = {
  children: React.ReactNode;
};

export const Filters = ({ children }: FiltersProps) => (
  <div className="space-y-6">
    {children}
  </div>
);

// Composant pour le mode d'affichage
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

// Composant pour les filtres de sélection (producteurs, catégories, etc.)
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

// Composant pour les filtres booléens (actif/inactif, etc.)
type ToggleFilterProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
};

const ToggleFilter = ({ checked, onCheckedChange, label }: ToggleFilterProps) => (
  <div>
    <CheckboxWithLabel
      checked={checked}
      onCheckedChange={(checked) => onCheckedChange(Boolean(checked))}
      label={label}
    />
  </div>
);

// Composition des sous-composants
Filters.View = ViewFilter;
Filters.Selection = SelectionFilter;
Filters.Toggle = ToggleFilter;

// Export du composant principal et des types utiles
export { type ViewMode, type SelectionItem };
