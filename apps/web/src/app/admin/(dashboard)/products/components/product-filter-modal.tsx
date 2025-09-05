'use client';

import { type FC, useState, useEffect, type TouchEvent } from 'react';
import { X } from 'lucide-react';
import { ViewToggle, type ViewMode } from '@/app/admin/(dashboard)/components/ui/view-toggle';
import { Button } from '@/app/admin/(dashboard)/components/ui/button';
import { CheckboxWithLabel } from '@/app/admin/(dashboard)/components/ui/checkbox';


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

export const ProductFilterModal: FC<FilterModalProps> = (props) => {
  const { 
    isOpen, 
    onClose, 
    producers, 
    selectedProducerId, 
    setSelectedProducerId,
    activeOnly,
    setActiveOnly,
    view,
    setView
  } = props;

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
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>
        
        <div className="flex items-center justify-between p-4 border-b border-border bg-white">
          <h3 className="text-lg font-semibold text-foreground">Filtres</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)] bg-white">
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-3 block">Mode d&apos;affichage</label>
              <ViewToggle value={view} onChange={setView} availableViews={['grid', 'list']} />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-3 block">Partenaire</label>
              <div className="space-y-2">
                <Button
                  variant={selectedProducerId === undefined ? "default" : "outline"}
                  onClick={() => setSelectedProducerId(undefined)}
                  className="w-full justify-start"
                >
                  Tous les partenaires
                </Button>
                {producers?.map((producer) => (
                  <Button
                    key={producer.id}
                    variant={selectedProducerId === producer.id ? "default" : "outline"}
                    onClick={() => setSelectedProducerId(producer.id)}
                    className="w-full justify-start"
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
                onCheckedChange={(v) => setActiveOnly(Boolean(v))}
                label="Afficher uniquement les produits actifs"
              />
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-border bg-white">
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedProducerId(undefined);
                setActiveOnly(false);
              }}
              className="flex-1"
            >
              Réinitialiser
            </Button>
            <Button onClick={onClose} className="flex-1">
              Appliquer
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};