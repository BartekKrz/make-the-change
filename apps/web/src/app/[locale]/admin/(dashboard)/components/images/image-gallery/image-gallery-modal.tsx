'use client';

import { X, ChevronLeft, ChevronRight, Eye, Edit3, Trash2 } from 'lucide-react';
import Image from 'next/image';
import {
  type FC,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react';

import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn';
import type { ProductBlurHash } from '@/types/blur';

type ImageGalleryModalProps = {
  images: string[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onImageReplace?: (imageUrl: string, index: number) => void;
  onImageDelete?: (imageUrl: string, index: number) => void;
  // Optionnel: map URL -> blur pour améliorer le rendu
  imageBlurMap?: Record<string, ProductBlurHash>;
};

export const ImageGalleryModal: FC<ImageGalleryModalProps> = ({
  images,
  initialIndex,
  isOpen,
  onClose,
  onImageReplace,
  onImageDelete,
  imageBlurMap,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Réinitialiser l'index quand la modal s'ouvre
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  // Index valide dérivé
  const validIndex = useMemo(() => {
    if (images.length === 0) return -1;
    return Math.max(0, Math.min(currentIndex, images.length - 1));
  }, [currentIndex, images.length]);

  // Blur du serveur pour l'image affichée via la map
  const currentBlur = useMemo(() => {
    if (!imageBlurMap || validIndex < 0 || validIndex >= images.length)
      return;
    const url = images[validIndex];
    return url ? imageBlurMap[url] : undefined;
  }, [imageBlurMap, images, validIndex]);

  // Effet simplifié pour fermeture
  useEffect(() => {
    if (images.length === 0) {
      onClose();
      return;
    }

    // Synchroniser l'index si nécessaire
    if (currentIndex >= images.length && images.length > 0) {
      setCurrentIndex(images.length - 1);
    }
  }, [images.length, onClose, currentIndex, validIndex]);

  // Navigation unifiée
  const navigateTo = useCallback((index: number) => {
    if (images.length === 0) return;
    let newIndex = index;
    if (index < 0) newIndex = images.length - 1;
    if (index >= images.length) newIndex = 0;
    setCurrentIndex(newIndex);
  }, [images.length]);

  const goToPrevious = useCallback(() => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    navigateTo(newIndex);
  }, [currentIndex, images.length, navigateTo]);

  const goToNext = useCallback(() => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    navigateTo(newIndex);
  }, [currentIndex, images.length, navigateTo]);

  // Navigation avec les flèches du clavier
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'Escape': {
          onClose();
          break;
        }
        case 'ArrowLeft': {
          event.preventDefault();
          goToPrevious();
          break;
        }
        case 'ArrowRight': {
          event.preventDefault();
          goToNext();
          break;
        }
      }
    },
    [isOpen, goToPrevious, goToNext, onClose]
  );

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


  // Actions simplifiées
  const handleReplace = useCallback(() => {
    if (validIndex >= 0 && validIndex < images.length) {
      const imageUrl = images[validIndex];
      if (imageUrl) {
        onImageReplace?.(imageUrl, validIndex);
      }
    }
  }, [validIndex, images, onImageReplace]);

  const handleDelete = useCallback(() => {
    if (validIndex >= 0 && validIndex < images.length) {
      const imageUrl = images[validIndex];
      if (imageUrl) {
        onImageDelete?.(imageUrl, validIndex);
      }
    }
  }, [validIndex, images, onImageDelete]);

  if (!isOpen || images.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="relative z-10 flex h-full w-full items-center justify-center p-4">
        {/* Bouton fermer */}
        <button
          className="absolute top-4 right-4 z-20 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </button>

        {/* Boutons d'action */}
        {(onImageReplace || onImageDelete) && (
          <div className="absolute top-4 right-16 z-20 flex gap-2">
            {onImageReplace && (
              <button
                className="rounded-full bg-blue-500/80 p-2 text-white transition-colors hover:bg-blue-500"
                title="Remplacer cette image"
                onClick={handleReplace}
              >
                <Edit3 className="h-5 w-5" />
              </button>
            )}
            {onImageDelete && (
              <button
                className="rounded-full bg-red-500/80 p-2 text-white transition-colors hover:bg-red-500"
                title="Supprimer cette image"
                onClick={handleDelete}
              >
                <Trash2 className="h-5 w-5" />
              </button>
            )}
          </div>
        )}

        {/* Flèche gauche */}
        {images.length > 1 && (
          <button
            className="absolute left-4 z-20 rounded-full bg-black/50 p-3 text-white transition-colors hover:bg-black/70"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
        )}

        {/* Image principale */}
        <div className="relative flex h-full max-h-[90vh] w-full max-w-6xl items-center justify-center">
          <div className="relative flex h-full w-full items-center justify-center">
            {validIndex >= 0 && validIndex < images.length && images[validIndex] && (
              <Image
                fill
                priority
                alt={`Image ${validIndex + 1} sur ${images.length}`}
                className="object-contain"
                src={images[validIndex]!}
                unoptimized={images[validIndex]!.includes('unsplash')}
                {...(currentBlur?.blurDataURL
                  ? {
                      placeholder: 'blur' as const,
                      blurDataURL: currentBlur.blurDataURL,
                    }
                  : {})}
              />
            )}
          </div>
        </div>

        {/* Flèche droite */}
        {images.length > 1 && (
          <button
            className="absolute right-4 z-20 rounded-full bg-black/50 p-3 text-white transition-colors hover:bg-black/70"
            onClick={goToNext}
          >
            <ChevronRight className="h-8 w-8" />
          </button>
        )}

        {/* Indicateur de position */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 transform">
            <div className="rounded-full bg-black/50 px-4 py-2 text-sm text-white">
              {validIndex + 1} / {images.length}
            </div>
          </div>
        )}

        {/* Thumbnails navigation (optionnel, pour les galeries avec beaucoup d'images) */}
        {images.length > 1 && images.length <= 10 && (
          <div className="absolute bottom-16 left-1/2 z-20 -translate-x-1/2 transform">
            <div className="flex gap-2 rounded-lg bg-black/50 p-2">
              {images.map((image, index) => {
                if (!image) return null;
                return (
                  <button
                    key={index}
                    className={cn(
                      'relative h-12 w-12 overflow-hidden rounded border-2 transition-all',
                      index === validIndex
                        ? 'scale-110 border-white'
                        : 'border-transparent hover:border-white/50'
                    )}
                    onClick={() => navigateTo(index)}
                  >
                    <Image
                      fill
                      alt={`Thumbnail ${index + 1}`}
                      className="object-cover"
                      src={image}
                      unoptimized={image.includes('unsplash')}
                    />
                  </button>
                );
              })}
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
    title="Prévisualiser"
    className={cn(
      'rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70',
      className
    )}
    onClick={e => {
      e.stopPropagation();
      onClick();
    }}
  >
    <Eye className="h-4 w-4" />
  </button>
);
