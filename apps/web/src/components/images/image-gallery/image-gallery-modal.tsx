'use client';

import { type FC, useEffect, useState, useMemo, useOptimistic, useActionState, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Eye, Edit3, Trash2 } from 'lucide-react';
import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn';

type ImageGalleryModalProps = {
  images: string[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
  showActions?: boolean;
  onImageReplace?: (imageUrl: string, index: number) => void;
  onImageDelete?: (imageUrl: string, index: number) => void;
};

export const ImageGalleryModal: FC<ImageGalleryModalProps> = ({
  images,
  initialIndex,
  isOpen,
  onClose,
  showActions = false,
  onImageReplace,
  onImageDelete
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [optimisticIndex, setOptimisticIndex] = useOptimistic(
    currentIndex,
    (state, newIndex: number) => newIndex
  );

  // Réinitialiser l'index quand la modal s'ouvre
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setOptimisticIndex(initialIndex);
    }
  }, [isOpen, initialIndex, setOptimisticIndex]);

  // Index valide dérivé
  const validIndex = useMemo(() => {
    if (images.length === 0) return -1;
    return Math.min(optimisticIndex, images.length - 1);
  }, [optimisticIndex, images.length]);

  // Effet simplifié pour fermeture
  useEffect(() => {
    if (images.length === 0) {
      onClose();
      return;
    }
    
    // Synchroniser l'index réel avec l'index valide
    if (currentIndex !== validIndex && validIndex >= 0) {
      setCurrentIndex(validIndex);
    }
  }, [images.length, onClose, currentIndex, validIndex]);

  // Navigation avec les flèches du clavier
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isOpen) return;

    switch (event.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        const prevIndex = optimisticIndex === 0 ? images.length - 1 : optimisticIndex - 1;
        setOptimisticIndex(prevIndex);
        setCurrentIndex(prevIndex);
        break;
      case 'ArrowRight':
        event.preventDefault();
        const nextIndex = optimisticIndex === images.length - 1 ? 0 : optimisticIndex + 1;
        setOptimisticIndex(nextIndex);
        setCurrentIndex(nextIndex);
        break;
    }
  }, [isOpen, images.length, optimisticIndex, setOptimisticIndex, onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Empêcher le scroll du body quand la modal est ouverte
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const goToPrevious = () => {
    const newIndex = optimisticIndex === 0 ? images.length - 1 : optimisticIndex - 1;
    setOptimisticIndex(newIndex);
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const newIndex = optimisticIndex === images.length - 1 ? 0 : optimisticIndex + 1;
    setOptimisticIndex(newIndex);
    setCurrentIndex(newIndex);
  };

  // Actions avec useActionState
  const [replaceState, replaceAction] = useActionState(
    async (_: { success: boolean; error: string | null }) => {
      try {
        if (validIndex >= 0 && validIndex < images.length) {
          const currentImageUrl = images[validIndex];
          onImageReplace?.(currentImageUrl, validIndex);
        }
        return { success: true, error: null };
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' };
      }
    },
    { success: false, error: null }
  );

  const [deleteState, deleteAction] = useActionState(
    async (_: { success: boolean; error: string | null }) => {
      try {
        if (validIndex >= 0 && validIndex < images.length) {
          const currentImageUrl = images[validIndex];
          onImageDelete?.(currentImageUrl, validIndex);
        }
        return { success: true, error: null };
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' };
      }
    },
    { success: false, error: null }
  );

  if (!isOpen || !images.length) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Boutons d'action en mode édition */}
        {showActions && (
          <div className="absolute top-4 right-16 z-20 flex gap-2">
            {/* Bouton remplacer */}
            <form action={replaceAction}>
              <button
                type="submit"
                disabled={replaceState.success === false && replaceState.error !== null}
                className="p-2 rounded-full bg-blue-500/80 text-white hover:bg-blue-500 transition-colors disabled:opacity-50"
                title="Remplacer cette image"
              >
                <Edit3 className="w-5 h-5" />
              </button>
            </form>
            
            {/* Bouton supprimer */}
            <form action={deleteAction}>
              <button
                type="submit"
                disabled={deleteState.success === false && deleteState.error !== null}
                className="p-2 rounded-full bg-red-500/80 text-white hover:bg-red-500 transition-colors disabled:opacity-50"
                title="Supprimer cette image"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}

        {/* Flèche gauche */}
        {images.length > 1 && (
          <button
            onClick={goToPrevious}
            className="absolute left-4 z-20 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
        )}

        {/* Image principale */}
        <div className="relative max-w-6xl max-h-[90vh] w-full h-full flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            {validIndex >= 0 && validIndex < images.length && (
              <Image
                src={images[validIndex]}
                alt={`Image ${validIndex + 1} sur ${images.length}`}
                fill
                className="object-contain"
                unoptimized={images[validIndex].includes('unsplash')}
                priority
              />
            )}
          </div>
        </div>

        {/* Flèche droite */}
        {images.length > 1 && (
          <button
            onClick={goToNext}
            className="absolute right-4 z-20 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        )}

        {/* Indicateur de position */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
            <div className="bg-black/50 rounded-full px-4 py-2 text-white text-sm">
              {validIndex + 1} / {images.length}
            </div>
          </div>
        )}

        {/* Thumbnails navigation (optionnel, pour les galeries avec beaucoup d'images) */}
        {images.length > 1 && images.length <= 10 && (
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-20">
            <div className="flex gap-2 bg-black/50 rounded-lg p-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setOptimisticIndex(index);
                    setCurrentIndex(index);
                  }}
                  className={cn(
                    "relative w-12 h-12 rounded overflow-hidden border-2 transition-all",
                    index === validIndex 
                      ? "border-white scale-110" 
                      : "border-transparent hover:border-white/50"
                  )}
                >
                  <Image
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized={image.includes('unsplash')}
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Composant pour le bouton de prévisualisation
export const PreviewButton: FC<{ 
  onClick: () => void; 
  className?: string; 
}> = ({ onClick, className }) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    className={cn(
      "p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors",
      className
    )}
    title="Prévisualiser"
  >
    <Eye className="w-4 h-4" />
  </button>
);
