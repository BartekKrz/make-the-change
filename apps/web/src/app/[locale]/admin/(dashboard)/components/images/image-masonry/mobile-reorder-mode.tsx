'use client';

import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Check,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { type FC, useState } from 'react';

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
  className,
}) => {
  const [currentImages, setCurrentImages] = useState([...images]);

  const moveImage = (
    index: number,
    direction: 'up' | 'down' | 'left' | 'right'
  ) => {
    const newImages = [...currentImages];
    let newIndex = index;

    switch (direction) {
      case 'up': {
        newIndex = Math.max(0, index - 1);
        break;
      }
      case 'down': {
        newIndex = Math.min(newImages.length - 1, index + 1);
        break;
      }
      case 'left': {
        newIndex = Math.max(0, index - 1);
        break;
      }
      case 'right': {
        newIndex = Math.min(newImages.length - 1, index + 1);
        break;
      }
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
    <div
      className={cn(
        'border-border rounded-lg border bg-white p-4 dark:bg-gray-900',
        className
      )}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Réorganiser les images</h3>
        <div className="flex gap-2">
          <button
            className="rounded-lg bg-green-500 p-2 text-white transition-colors hover:bg-green-600"
            title="Sauvegarder"
            onClick={handleSave}
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            className="rounded-lg bg-gray-500 p-2 text-white transition-colors hover:bg-gray-600"
            title="Annuler"
            onClick={onCancel}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Liste des images avec contrôles */}
      <div className="space-y-3">
        {currentImages.map((imageUrl, index) => (
          <div
            key={index}
            className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800"
          >
            {/* Image miniature */}
            <div className="border-border relative h-16 w-16 overflow-hidden rounded-lg border">
              <Image
                fill
                alt={`Image ${index + 1}`}
                className="object-cover"
                src={imageUrl}
                unoptimized={imageUrl.includes('unsplash')}
              />
            </div>

            {/* Numéro */}
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-sm font-semibold text-white">
              {index + 1}
            </div>

            {/* Contrôles de mouvement */}
            <div className="flex flex-1 justify-end gap-1">
              {/* Boutons flèches pour mobile */}
              <div className="grid grid-cols-2 gap-1">
                <button
                  disabled={index === 0}
                  title="Déplacer vers le haut"
                  className={cn(
                    'rounded border p-2 transition-colors',
                    index === 0
                      ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                      : 'border-blue-200 bg-white text-blue-600 hover:bg-blue-50'
                  )}
                  onClick={() => moveImage(index, 'up')}
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  disabled={index === 0}
                  title="Déplacer vers la gauche"
                  className={cn(
                    'rounded border p-2 transition-colors',
                    index === 0
                      ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                      : 'border-blue-200 bg-white text-blue-600 hover:bg-blue-50'
                  )}
                  onClick={() => moveImage(index, 'left')}
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  disabled={index === currentImages.length - 1}
                  title="Déplacer vers le bas"
                  className={cn(
                    'rounded border p-2 transition-colors',
                    index === currentImages.length - 1
                      ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                      : 'border-blue-200 bg-white text-blue-600 hover:bg-blue-50'
                  )}
                  onClick={() => moveImage(index, 'down')}
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button
                  disabled={index === currentImages.length - 1}
                  title="Déplacer vers la droite"
                  className={cn(
                    'rounded border p-2 transition-colors',
                    index === currentImages.length - 1
                      ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                      : 'border-blue-200 bg-white text-blue-600 hover:bg-blue-50'
                  )}
                  onClick={() => moveImage(index, 'right')}
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
