'use client';

import { X } from 'lucide-react';
import { type FC, useState, useEffect, type TouchEvent } from 'react';

import { CheckboxWithLabel } from '@/app/[locale]/admin/(dashboard)/components/ui/checkbox';
import { ViewToggle, type ViewMode } from '@/app/[locale]/admin/(dashboard)/components/ui/view-toggle';
import { Button } from '@/components/ui/button';


type Producer = {
  id: string;
  name: string;
};

type FilterModalProps = {
  isOpen: boolean;
  onClose: () => void;
  producers: Producer[];
  selectedProducerId: string | undefined;
  setSelectedProducerId: (id: string | undefined) => void;
  activeOnly: boolean;
  setActiveOnly: (value: boolean) => void;
  view: ViewMode;
  setView: (view: ViewMode) => void;
};

export const ProductFilterModal: FC<FilterModalProps> = ({ 
  isOpen, 
  onClose, 
  producers, 
  selectedProducerId, 
  setSelectedProducerId,
  activeOnly,
  setActiveOnly,
  view,
  setView
}) => {

  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);

  const handleTouchStart = (e: TouchEvent) => {
    setStartY(e.touches[0].clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - startY;
    if (deltaY > 0) setDragY(deltaY);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (dragY > 100) onClose();
    setDragY(0);
  };

  useEffect(() => {
    if (!isOpen) {
      setDragY(0);
      setIsDragging(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      <div 
        className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border rounded-t-xl shadow-2xl transform transition-transform duration-300 max-h-[80vh] overflow-hidden"
        style={{
          transform: `translateY(${dragY}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out'
        }}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        onTouchStart={handleTouchStart}
      >
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>
        
        <div className="flex items-center justify-between p-4 border-b border-border bg-white">
          <h3 className="text-lg font-semibold text-foreground">Filtres</h3>
          <Button size="sm" variant="ghost" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)] bg-white">
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-3 block">Mode d&apos;affichage</label>
              <ViewToggle availableViews={['grid', 'list']} value={view} onChange={setView} />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-3 block">Partenaire</label>
              <div className="space-y-2">
                <Button
                  className="w-full justify-start"
                  variant={selectedProducerId === undefined ? "default" : "outline"}
                  onClick={() => setSelectedProducerId(undefined)}
                >
                  Tous les partenaires
                </Button>
                {producers?.map((producer) => (
                  <Button
                    key={producer.id}
                    className="w-full justify-start"
                    variant={selectedProducerId === producer.id ? "default" : "outline"}
                    onClick={() => setSelectedProducerId(producer.id)}
                  >
                    {producer.name}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-3 block">Options</label>
              <CheckboxWithLabel
                checked={activeOnly}
                label="Afficher uniquement les produits actifs"
                onCheckedChange={(v) => setActiveOnly(Boolean(v))}
              />
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-border bg-white">
          <div className="flex gap-3">
            <Button 
              className="flex-1" 
              variant="outline"
              onClick={() => {
                setSelectedProducerId(undefined);
                setActiveOnly(false);
              }}
            >
              Réinitialiser
            </Button>
            <Button className="flex-1" onClick={onClose}>
              Appliquer
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};