import { X, Upload } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import { cn } from '@/lib/utils';

import { ImageUploader } from './image-uploader';

import type { FC } from 'react';

type MultiImageUploaderProps = {
  currentImages?: string[];
  onImagesChange?: (images: string[]) => void;
  maxImages?: number;
  disabled?: boolean;
  className?: string;
};

export const MultiImageUploader: FC<MultiImageUploaderProps> = ({
  currentImages = [],
  onImagesChange,
  maxImages = 10,
  disabled = false,
  className = '',
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
    const newImages = currentImages.filter(
      (_, index) => index !== indexToRemove
    );
    onImagesChange?.(newImages);
  };

  const remainingSlots = maxImages - currentImages.length;
  const canUploadMore = remainingSlots > 0 && !disabled;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Zone d'upload principale (si des slots disponibles) */}
      {canUploadMore && (
        <div className="border-muted-foreground/25 hover:border-primary/50 rounded-xl border-2 border-dashed p-8 text-center transition-colors">
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
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {currentImages.map((imageUrl, index) => (
            <div key={index} className="group relative">
              <div className="bg-muted aspect-square overflow-hidden rounded-lg">
                <Image
                  alt={`Image ${index + 1}`}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  height={300}
                  src={imageUrl}
                  width={300}
                />
              </div>

              {!disabled && (
                <button
                  className="bg-destructive text-destructive-foreground absolute -top-2 -right-2 rounded-full p-1 opacity-0 shadow-lg transition-opacity group-hover:opacity-100"
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
      <div className="text-muted-foreground flex items-center justify-between text-sm">
        <span>
          {currentImages.length}/{maxImages} images
        </span>
        {uploadingCount > 0 && (
          <span className="text-primary">
            Upload en cours... ({uploadingCount})
          </span>
        )}
        {!canUploadMore && currentImages.length >= maxImages && (
          <span className="text-orange-500">Limite atteinte</span>
        )}
      </div>
    </div>
  );
};
