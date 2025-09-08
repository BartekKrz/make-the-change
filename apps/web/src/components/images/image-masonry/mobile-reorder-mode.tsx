'use client';

import { type FC, useState } from 'react';
import Image from 'next/image';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Check, X } from 'lucide-react';
import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn';

type MobileReorderModeProps = {
  images: string[];
  onReorder: (newImages: string[]) => void;
  onCancel: () => void;
  className?: string;
};

export const MobileReorderMode: FC<MobileReorderModeProps> = ({
  images,
  onReorder,
  onCancel,
  className
}) => {
  const [currentImages, setCurrentImages] = useState([...images]);

  const moveImage = (index: number, direction: 'up' | 'down' | 'left' | 'right') => {
    const newImages = [...currentImages];
    let newIndex = index;

    switch (direction) {
      case 'up':
        newIndex = Math.max(0, index - 1);
        break;
      case 'down':
        newIndex = Math.min(newImages.length - 1, index + 1);
        break;
      case 'left':
        newIndex = Math.max(0, index - 1);
        break;
      case 'right':
        newIndex = Math.min(newImages.length - 1, index + 1);
        break;
    }

    if (newIndex !== index) {
      const [movedImage] = newImages.splice(index, 1);
      newImages.splice(newIndex, 0, movedImage);
      setCurrentImages(newImages);
    }
  };

  const handleSave = () => {
    onReorder(currentImages);
  };

  return (
    <div className={cn("bg-white dark:bg-gray-900 border border-border rounded-lg p-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Réorganiser les images</h3>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            title="Sauvegarder"
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            onClick={onCancel}
            className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            title="Annuler"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Liste des images avec contrôles */}
      <div className="space-y-3">
        {currentImages.map((imageUrl, index) => (
          <div
            key={index}
            className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-lg p-3"
          >
            {/* Image miniature */}
            <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-border">
              <Image
                src={imageUrl}
                alt={`Image ${index + 1}`}
                fill
                className="object-cover"
                unoptimized={imageUrl.includes('unsplash')}
              />
            </div>

            {/* Numéro */}
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
              {index + 1}
            </div>

            {/* Contrôles de mouvement */}
            <div className="flex-1 flex justify-end gap-1">
              {/* Boutons flèches pour mobile */}
              <div className="grid grid-cols-2 gap-1">
                <button
                  onClick={() => moveImage(index, 'up')}
                  disabled={index === 0}
                  className={cn(
                    "p-2 rounded border transition-colors",
                    index === 0
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white hover:bg-blue-50 text-blue-600 border-blue-200"
                  )}
                  title="Déplacer vers le haut"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => moveImage(index, 'left')}
                  disabled={index === 0}
                  className={cn(
                    "p-2 rounded border transition-colors",
                    index === 0
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white hover:bg-blue-50 text-blue-600 border-blue-200"
                  )}
                  title="Déplacer vers la gauche"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => moveImage(index, 'down')}
                  disabled={index === currentImages.length - 1}
                  className={cn(
                    "p-2 rounded border transition-colors",
                    index === currentImages.length - 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white hover:bg-blue-50 text-blue-600 border-blue-200"
                  )}
                  title="Déplacer vers le bas"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => moveImage(index, 'right')}
                  disabled={index === currentImages.length - 1}
                  className={cn(
                    "p-2 rounded border transition-colors",
                    index === currentImages.length - 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white hover:bg-blue-50 text-blue-600 border-blue-200"
                  )}
                  title="Déplacer vers la droite"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
