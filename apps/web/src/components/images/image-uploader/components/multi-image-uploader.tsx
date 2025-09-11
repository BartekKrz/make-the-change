import { X, Upload } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import { cn } from '@/lib/utils';

import { ImageUploader } from './image-uploader';

import type { FC } from 'react';

type MultiImageUploaderProps =  {
  currentImages?: string[];
  onImagesChange?: (images: string[]) => void;
  maxImages?: number;
  disabled?: boolean;
  className?: string;
}

export const MultiImageUploader: FC<MultiImageUploaderProps> = ({
  currentImages = [],
  onImagesChange,
  maxImages = 10,
  disabled = false,
  className = ''
}) => {
  const [uploadingCount, setUploadingCount] = useState(0);

  const handleImageSelect = async (file: File | null) => {
    if (!file || currentImages.length >= maxImages) return;

    try {
      setUploadingCount(prev => prev + 1);

      // Simuler un upload (remplacez par votre logique d'upload)
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload/product-images', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const result = await response.json();
      const newImages = [...currentImages, result.url];
      
      onImagesChange?.(newImages);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploadingCount(prev => prev - 1);
    }
  };

  const handleImageRemove = (indexToRemove: number) => {
    const newImages = currentImages.filter((_, index) => index !== indexToRemove);
    onImagesChange?.(newImages);
  };

  const remainingSlots = maxImages - currentImages.length;
  const canUploadMore = remainingSlots > 0 && !disabled;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Zone d'upload principale (si des slots disponibles) */}
      {canUploadMore && (
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-8 text-center hover:border-primary/50 transition-colors">
          <ImageUploader
            disabled={disabled || uploadingCount > 0}
            height="h-48"
            width="w-full"
            onImageSelect={handleImageSelect}
          />
        </div>
      )}

      {/* Grille des images existantes */}
      {currentImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentImages.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                <Image
                  alt={`Image ${index + 1}`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  height={300}
                  src={imageUrl}
                  width={300}
                />
              </div>
              
              {!disabled && (
                <button
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  type="button"
                  onClick={() => handleImageRemove(index)}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Indicateurs d'état */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {currentImages.length}/{maxImages} images
        </span>
        {uploadingCount > 0 && (
          <span className="text-primary">
            Upload en cours... ({uploadingCount})
          </span>
        )}
        {!canUploadMore && currentImages.length >= maxImages && (
          <span className="text-orange-500">
            Limite atteinte
          </span>
        )}
      </div>
    </div>
  );
};
