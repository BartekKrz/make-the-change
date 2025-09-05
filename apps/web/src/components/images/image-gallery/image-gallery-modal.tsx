'use client';

import { type FC, useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Eye, Edit3, Trash2 } from 'lucide-react';
import { cn } from '@/app/admin/(dashboard)/components/cn';

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

  // Réinitialiser l'index quand la modal s'ouvre
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  // Ajuster l'index si les images changent (après suppression)
  useEffect(() => {
    if (images.length === 0) {
      // Fermer le modal si plus d'images
      onClose();
      return;
    }
    
    // Ajuster l'index si il est invalide
    if (currentIndex >= images.length) {
      setCurrentIndex(Math.max(0, images.length - 1));
    }
  }, [images, currentIndex, onClose]);

  // Navigation avec les flèches du clavier
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isOpen) return;

    switch (event.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
        break;
      case 'ArrowRight':
        event.preventDefault();
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        break;
    }
  }, [isOpen, images.length, onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Empêcher le scroll du body quand la modal est ouverte
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Gestion du remplacement d'image
  const handleReplace = () => {
    if (currentIndex >= 0 && currentIndex < images.length) {
      const currentImageUrl = images[currentIndex];
      onImageReplace?.(currentImageUrl, currentIndex);
    }
  };

  // Gestion de la suppression d'image
  const handleDelete = () => {
    if (currentIndex >= 0 && currentIndex < images.length) {
      const currentImageUrl = images[currentIndex];
      onImageDelete?.(currentImageUrl, currentIndex);
    }
  };

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
            <button
              onClick={handleReplace}
              className="p-2 rounded-full bg-blue-500/80 text-white hover:bg-blue-500 transition-colors"
              title="Remplacer cette image"
            >
              <Edit3 className="w-5 h-5" />
            </button>
            
            {/* Bouton supprimer */}
            <button
              onClick={handleDelete}
              className="p-2 rounded-full bg-red-500/80 text-white hover:bg-red-500 transition-colors"
              title="Supprimer cette image"
            >
              <Trash2 className="w-5 h-5" />
            </button>
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
            {currentIndex >= 0 && currentIndex < images.length && (
              <Image
                src={images[currentIndex]}
                alt={`Image ${currentIndex + 1} sur ${images.length}`}
                fill
                className="object-contain"
                unoptimized={images[currentIndex].includes('unsplash')}
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
              {currentIndex + 1} / {images.length}
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
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    "relative w-12 h-12 rounded overflow-hidden border-2 transition-all",
                    index === currentIndex 
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
