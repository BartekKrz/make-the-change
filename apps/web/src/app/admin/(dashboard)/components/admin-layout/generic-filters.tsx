'use client';
import { type ViewMode } from '../ui/view-toggle';
import { ViewToggle } from '../ui/view-toggle';
import { Button } from '../ui/button';
import { CheckboxWithLabel } from '../ui/checkbox';

// Types pour les producteurs
type Producer = {
  id: string;
  name: string;
};

// Props pour le composant de filtres génériques
type GenericFiltersProps = {
  // Vue
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
  
  // Producteurs
  producers?: Producer[];
  selectedProducerId?: string;
  onProducerChange: (id: string | undefined) => void;
  
  // Filtre actif uniquement
  activeOnly: boolean;
  onActiveOnlyChange: (value: boolean) => void;
  
  // Autres filtres personnalisés
  children?: React.ReactNode;
};

export const GenericFilters = ({
  view,
  onViewChange,
  producers = [],
  selectedProducerId,
  onProducerChange,
  activeOnly,
  onActiveOnlyChange,
  children
}: GenericFiltersProps) => (
  <div className="space-y-6">
    {/* Mode d'affichage */}
    <div>
      <label className="text-sm font-medium mb-3 block">Mode d&apos;affichage</label>
      <ViewToggle 
        value={view} 
        onChange={onViewChange} 
        availableViews={['grid', 'list']} 
      />
    </div>
      
    {/* Producteurs */}
    {producers.length > 0 && (
      <div>
        <label className="text-sm font-medium mb-3 block">Partenaire</label>
        <div className="space-y-2">
          <Button
            variant={selectedProducerId === undefined ? "default" : "outline"}
            onClick={() => onProducerChange(undefined)}
            className="w-full justify-start"
          >
            Tous les partenaires
          </Button>
          {producers.map((producer) => (
            <Button
              key={producer.id}
              variant={selectedProducerId === producer.id ? "default" : "outline"}
              onClick={() => onProducerChange(producer.id)}
              className="w-full justify-start"
            >
              {producer.name}
            </Button>
          ))}
        </div>
      </div>
    )}
      
    {/* Filtre actifs uniquement */}
    <div>
      <CheckboxWithLabel
        checked={activeOnly}
        onCheckedChange={(checked) => onActiveOnlyChange(Boolean(checked))}
        label="Afficher uniquement les éléments actifs"
      />
    </div>
      
    {/* Filtres personnalisés */}
    {children}
  </div>
);
