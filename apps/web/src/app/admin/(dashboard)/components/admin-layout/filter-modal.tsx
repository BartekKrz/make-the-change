'use client';
import { createContext, useContext, useState, type ReactNode } from 'react';
import { Filter } from 'lucide-react';
import { Button } from '../ui/button';

// Contexte pour gérer l'état du modal de filtres
type FilterModalContextType = {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
};

const FilterModalContext = createContext<FilterModalContextType | null>(null);

// Hook pour utiliser le contexte du modal de filtres
const useFilterModal = () => {
  const context = useContext(FilterModalContext);
  if (!context) {
    throw new Error('useFilterModal must be used within AdminPageLayout.FilterModalProvider');
  }
  return context;
};

// Provider pour gérer l'état du modal
type FilterModalProviderProps = {
  children: ReactNode;
};

const FilterModalProvider = ({ children }: FilterModalProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const contextValue = {
    isOpen,
    openModal: () => setIsOpen(true),
    closeModal: () => setIsOpen(false),
  };

  return (
    <FilterModalContext.Provider value={contextValue}>
      {children}
    </FilterModalContext.Provider>
  );
};

// Bouton de filtres pour mobile - s'intègre automatiquement dans le header
const FilterButton = () => {
  const { openModal } = useFilterModal();

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={openModal}
      className="h-9 w-9 p-0 relative focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
    >
      <Filter className="h-4 w-4" />
    </Button>
  );
};

// Wrapper pour le modal de filtres - se ferme automatiquement
type FilterModalProps = {
  children: ReactNode;
};

const FilterModal = ({ children }: FilterModalProps) => {
  const { isOpen, closeModal } = useFilterModal();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeModal}
      />
      
      {/* Modal content */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border rounded-t-xl shadow-2xl transform transition-transform duration-300 max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-lg font-semibold">Filtres</h3>
          <Button
            size="sm"
            variant="ghost"
            onClick={closeModal}
            className="h-8 w-8 p-0"
          >
            ×
          </Button>
        </div>
        <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)]">
          {children}
        </div>
      </div>
    </>
  );
};

export { FilterModalProvider, FilterButton, FilterModal, useFilterModal };
