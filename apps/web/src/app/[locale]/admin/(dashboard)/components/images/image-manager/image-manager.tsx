'use client';

import { GripVertical, X, Eye, ArrowLeft, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { type FC, useState } from 'react';

import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn';
import { Button } from '@/components/ui/button';

type ImageManagerProps = {
  images: string[];
  onImagesReorder: (newImages: string[]) => void;
  onImageRemove: (imageUrl: string) => void;
  onImagePreview?: (imageUrl: string) => void;
  disabled?: boolean;
  className?: string;
};

export const ImageManager: FC<ImageManagerProps> = ({
  images,
  onImagesReorder,
  onImageRemove,
  onImagePreview,
  disabled = false,
  className,
}) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Vérification de sécurité
  if (!images || !Array.isArray(images)) {
    return (
      <div
        className={cn(
          'border-muted-foreground/25 rounded-lg border-2 border-dashed p-8 text-center',
          className
        )}
      >
        <p className="text-muted-foreground">Aucune image à gérer</p>
        <p className="text-muted-foreground mt-2 text-sm">
          Ajoutez des images via l&apos;uploader pour les organiser ici
        </p>
      </div>
    );
  }

  const moveImage = (fromIndex: number, toIndex: number) => {
    if (disabled || toIndex < 0 || toIndex >= images.length) return;

    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    onImagesReorder(newImages);
  };

  const handlePreview = (imageUrl: string) => {
    setPreviewImage(imageUrl);
    onImagePreview?.(imageUrl);
  };

  if (images.length === 0) {
    return (
      <div
        className={cn(
          'border-muted-foreground/25 rounded-lg border-2 border-dashed p-8 text-center',
          className
        )}
      >
        <p className="text-muted-foreground">Aucune image à gérer</p>
        <p className="text-muted-foreground mt-2 text-sm">
          Ajoutez des images via l&apos;uploader pour les organiser ici
        </p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">
          Gestion des images ({images.length})
        </h3>
        <p className="text-muted-foreground text-sm">
          Utilisez les flèches pour réorganiser
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {images.map((imageUrl, index) => (
          <div
            key={imageUrl}
            className={cn(
              'group bg-background relative overflow-hidden rounded-lg border shadow-sm transition-all hover:shadow-md',
              disabled && 'pointer-events-none opacity-50'
            )}
          >
            {/* Badge de position */}
            <div className="bg-primary text-primary-foreground absolute top-2 right-2 z-10 rounded-full px-2 py-1 text-xs font-medium">
              {index + 1}
            </div>

            {/* Image */}
            <div className="relative h-40 w-full">
              <Image
                fill
                alt={`Product image ${index + 1}`}
                className="object-cover"
                src={imageUrl}
                unoptimized={imageUrl.includes('unsplash')}
              />
            </div>

            {/* Actions */}
            <div className="space-y-2 p-3">
              {/* Contrôles de réorganisation */}
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  <Button
                    className="h-8 w-8 p-0"
                    disabled={index === 0}
                    size="sm"
                    variant="outline"
                    onClick={() => moveImage(index, index - 1)}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    className="h-8 w-8 p-0"
                    disabled={index === images.length - 1}
                    size="sm"
                    variant="outline"
                    onClick={() => moveImage(index, index + 1)}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex gap-1">
                  <Button
                    className="h-8 w-8 p-0"
                    size="sm"
                    variant="outline"
                    onClick={() => handlePreview(imageUrl)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    className="h-8 w-8 p-0"
                    size="sm"
                    variant="destructive"
                    onClick={() => onImageRemove(imageUrl)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Indicateur d'image principale */}
              {index === 0 && (
                <div className="text-primary bg-primary/10 rounded py-1 text-center text-xs font-medium">
                  Image principale
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal de prévisualisation */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative h-full max-h-[90vh] w-full max-w-4xl">
            <Image
              fill
              alt="Image preview"
              className="object-contain"
              src={previewImage}
              unoptimized={previewImage.includes('unsplash')}
            />
            <Button
              className="absolute top-4 right-4"
              size="sm"
              variant="secondary"
              onClick={() => setPreviewImage(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
