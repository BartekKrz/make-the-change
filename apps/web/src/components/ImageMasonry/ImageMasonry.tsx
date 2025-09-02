'use client';

import { FC } from 'react';
import Image from 'next/image';
import { Trash2, Edit3 } from 'lucide-react';
import { cn } from '@/app/admin/(dashboard)/components/cn';

type ImageMasonryProps = {
  images: string[];
  className?: string;
  onImageClick?: (imageUrl: string, index: number) => void;
  onImageReplace?: (imageUrl: string, index: number) => void;
  onImageDelete?: (imageUrl: string, index: number) => void;
  showActions?: boolean;
};

export const ImageMasonry: FC<ImageMasonryProps> = ({ 
  images, 
  className, 
  onImageClick,
  onImageReplace,
  onImageDelete,
  showActions = false
}) => {
  // Composant pour une image avec actions hover
  const ImageWithActions: FC<{ 
    src: string; 
    alt: string; 
    index: number; 
    className?: string;
  }> = ({ src, alt, index, className }) => (
    <div className={cn("relative group w-full h-full", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-all duration-200 group-hover:brightness-75"
        unoptimized={src.includes('unsplash')}
        onClick={() => onImageClick?.(src, index)}
      />
      
      {/* Overlay avec actions au hover */}
      {showActions && (
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <div className="flex gap-2">
            {/* Bouton remplacer */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onImageReplace?.(src, index);
              }}
              className="p-2 bg-white/90 hover:bg-white rounded-full transition-colors duration-200 shadow-lg"
              title="Remplacer l'image"
            >
              <Edit3 className="w-4 h-4 text-gray-700" />
            </button>
            
            {/* Bouton supprimer */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onImageDelete?.(src, index);
              }}
              className="p-2 bg-red-500/90 hover:bg-red-500 rounded-full transition-colors duration-200 shadow-lg"
              title="Supprimer l'image"
            >
              <Trash2 className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // Vérification de sécurité
  if (!images || !Array.isArray(images)) {
    return (
      <div className={cn("border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center", className)}>
        <p className="text-muted-foreground">Aucune image</p>
      </div>
    );
  }

  const totalImages = images.length;

  if (totalImages === 0) {
    return (
      <div className={cn("border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center", className)}>
        <p className="text-muted-foreground">Aucune image</p>
      </div>
    );
  }

  // 1 image : affichage simple
  if (totalImages === 1) {
    return (
      <div className={cn("border border-border rounded-lg overflow-hidden", className)}>
        <div className="relative w-full aspect-[4/3]">
          <ImageWithActions
            src={images[0]}
            alt="Product image"
            index={0}
            className="cursor-pointer"
          />
        </div>
      </div>
    );
  }

  // 2 images : côte à côte
  if (totalImages === 2) {
    return (
      <div className={cn("border border-border rounded-lg overflow-hidden", className)}>
        <div className="flex gap-1 h-64">
          {images.map((imageUrl, index) => (
            <div key={index} className="relative flex-1">
              <ImageWithActions
                src={imageUrl}
                alt={`Product image ${index + 1}`}
                index={index}
                className="cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 3 images : 1 grande à gauche, 2 petites à droite
  if (totalImages === 3) {
    return (
      <div className={cn("border border-border rounded-lg overflow-hidden", className)}>
        <div className="flex gap-1 h-64">
          {/* Image principale (grande) */}
          <div className="relative flex-[2]">
            <ImageWithActions
              src={images[0]}
              alt="Main product image"
              index={0}
              className="cursor-pointer"
            />
          </div>
          
          {/* Colonne des 2 images à droite */}
          <div className="flex-1 flex flex-col gap-1">
            {images.slice(1, 3).map((imageUrl, index) => (
              <div key={index + 1} className="relative flex-1">
                <ImageWithActions
                  src={imageUrl}
                  alt={`Product image ${index + 2}`}
                  index={index + 1}
                  className="cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 4+ images : 1 grande à gauche, 3 à droite avec compteur sur la dernière
  return (
    <div className={cn("border border-border rounded-lg overflow-hidden", className)}>
      <div className="flex gap-1 h-64">
        {/* Image principale (grande) */}
        <div className="relative flex-[2]">
          <ImageWithActions
            src={images[0]}
            alt="Main product image"
            index={0}
            className="cursor-pointer"
          />
        </div>
        
        {/* Colonne des 3 images à droite */}
        <div className="flex-1 flex flex-col gap-1">
          {/* Première image de la colonne */}
          <div className="relative flex-1">
            <ImageWithActions
              src={images[1]}
              alt="Product image 2"
              index={1}
              className="cursor-pointer"
            />
          </div>
          
          {/* Deuxième image de la colonne */}
          <div className="relative flex-1">
            <ImageWithActions
              src={images[2]}
              alt="Product image 3"
              index={2}
              className="cursor-pointer"
            />
          </div>
          
          {/* Troisième image avec overlay si plus de 4 images */}
          <div className="relative flex-1">
            <ImageWithActions
              src={images[3]}
              alt="Product image 4"
              index={3}
              className="cursor-pointer"
            />
            {/* Overlay avec compteur pour les images supplémentaires */}
            {totalImages > 4 && (
              <div 
                className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors z-10"
                onClick={() => onImageClick?.(images[3], 3)}
              >
                <span className="text-white font-semibold text-xl">
                  +{totalImages - 3}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant alternatif pour l'affichage simple en mosaïque (garder pour compatibilité)
export const SimpleMosaicImages: FC<{ images: string[] }> = ({ images }) => {
  if (!images || !Array.isArray(images)) return null;
  
  return (
    <div className="flex flex-wrap gap-2 p-2">
      {images.map((imageUrl, index) => (
        <div key={index} className="relative w-[48%] aspect-square overflow-hidden rounded-md">
          <Image
            src={imageUrl}
            alt={`Product image ${index + 1}`}
            fill
            className="object-cover"
            unoptimized={imageUrl.includes('unsplash')}
          />
        </div>
      ))}
    </div>
  );
};
