'use client';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, Edit3, Eye, GripVertical } from 'lucide-react';
import Image from 'next/image';
import { type FC } from 'react';

import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn';
import { useIsMobile } from '@/hooks/use-media-query';
import type { ProductBlurHash } from '@/types/blur';

import type { DragEndEvent } from '@dnd-kit/core';

type ImageMasonryProps = {
  images: string[];
  className?: string;
  gridCols?: 2 | 3 | 4 | 5 | 6 | 'auto';
  aspectRatio?: 'square' | 'video' | 'auto';
  size?: 'sm' | 'md' | 'lg';
  onImageClick?: (imageUrl: string, index: number) => void;
  onImageReplace?: (imageUrl: string, index: number) => void;
  onImageDelete?: (imageUrl: string, index: number) => void;
  onImagePreview?: (imageUrl: string, index: number) => void;
  onImagesReorder?: (
    oldIndex: number,
    newIndex: number,
    newImages: string[]
  ) => void;
  imageBlurMap?: Record<string, ProductBlurHash>;
  entityId?: string; // Plus générique que productId
};

const SortableImageItem: FC<{
  src: string;
  alt: string;
  index: number;
  className?: string;
  id: string;
  onImageClick?: (imageUrl: string, index: number) => void;
  onImageReplace?: (imageUrl: string, index: number) => void;
  onImageDelete?: (imageUrl: string, index: number) => void;
  onImagePreview?: (imageUrl: string, index: number) => void;
  blurHash?: ProductBlurHash;
}> = ({
  src,
  alt,
  index,
  className,
  id,
  onImageClick,
  onImageReplace,
  onImageDelete,
  onImagePreview,
  blurHash,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isMobile = useIsMobile();

  // Utiliser la data URL issue de la DB si disponible (zéro dépendance react-blurhash)
  const blurProps = blurHash?.blurDataURL
    ? { placeholder: 'blur' as const, blurDataURL: blurHash.blurDataURL }
    : {};

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative h-full w-full cursor-pointer',
        isDragging && 'z-10 scale-95 opacity-50',
        className
      )}
      onClick={() => onImageClick?.(src, index)}
    >
      {/* Handle de drag & drop avec z-index élevé */}
      {!isMobile && (
        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 left-2 z-30 cursor-grab active:cursor-grabbing"
        >
          <div className="rounded-lg bg-white/90 p-1.5 shadow-md backdrop-blur-sm transition-colors hover:bg-white">
            <GripVertical className="h-3 w-3 text-gray-600" />
          </div>
        </div>
      )}

      {/* 🚀 Image Next.js avec blur optimisé du serveur */}
      <Image
        fill
        alt={alt}
        className="rounded-lg object-cover transition-all duration-200"
        priority={index < 4} // Prioriser les 4 premières images
        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        src={src}
        unoptimized={src.includes('unsplash')}
        {...blurProps} // 🚀 Blur hash du serveur !
      />

      {/* Actions overlay avec z-index élevé */}
      <div className="absolute inset-0 z-20 bg-black/0 transition-colors duration-200 group-hover:bg-black/20">
        <div className="absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
            <div className="flex items-center gap-2">
              {onImagePreview && (
                <button
                  className="rounded-lg bg-white/90 p-2 shadow-md transition-colors hover:bg-white"
                  title="Prévisualiser"
                  onClick={e => {
                    e.stopPropagation();
                    onImagePreview(src, index);
                  }}
                >
                  <Eye className="h-4 w-4 text-gray-700" />
                </button>
              )}
              {onImageReplace && (
                <button
                  className="rounded-lg bg-white/90 p-2 shadow-md transition-colors hover:bg-white"
                  title="Remplacer"
                  onClick={e => {
                    e.stopPropagation();
                    onImageReplace(src, index);
                  }}
                >
                  <Edit3 className="h-4 w-4 text-gray-700" />
                </button>
              )}
              {onImageDelete && (
                <button
                  className="rounded-lg bg-white/90 p-2 shadow-md transition-colors hover:bg-red-50"
                  title="Supprimer"
                  onClick={e => {
                    e.stopPropagation();
                    onImageDelete(src, index);
                  }}
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ImageMasonry: FC<ImageMasonryProps> = ({
  images,
  className = 'w-full',
  gridCols = 'auto',
  aspectRatio = 'square',
  size = 'md',
  onImageClick,
  onImageReplace,
  onImageDelete,
  onImagePreview,
  onImagesReorder,
  imageBlurMap = {},
}) => {
  // 🚀 NOUVEAU : Helper pour obtenir le blur hash d'une image
  const getBlurForImage = (imageUrl: string): ProductBlurHash | undefined =>
    imageBlurMap?.[imageUrl];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = images.indexOf(active.id.toString());
      const newIndex = images.indexOf(over.id.toString());

      const newImages = arrayMove(images, oldIndex, newIndex);
      onImagesReorder?.(oldIndex, newIndex, newImages);
    }
  };

  const isMobile = useIsMobile();

  // Configuration responsive du grid
  const getGridClasses = () => {
    if (gridCols === 'auto') {
      return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6';
    }
    return `grid-cols-${Math.min(gridCols, 2)} sm:grid-cols-${Math.min(gridCols, 3)} md:grid-cols-${gridCols}`;
  };

  // Configuration des tailles
  const getSizeClasses = () => {
    const sizeMap = {
      sm: { gap: 'gap-1', padding: 'p-1', minHeight: 'min-h-[100px]' },
      md: { gap: 'gap-2', padding: 'p-2', minHeight: 'min-h-[120px]' },
      lg: { gap: 'gap-3', padding: 'p-3', minHeight: 'min-h-[150px]' },
    };
    return sizeMap[size];
  };

  // Configuration du ratio d'aspect
  const getAspectRatioClass = () => {
    const ratioMap = {
      square: 'aspect-square',
      video: 'aspect-video',
      auto: 'aspect-auto',
    };
    return ratioMap[aspectRatio];
  };

  const sizeClasses = getSizeClasses();

  const content = (
    <div
      className={cn(
        'border-border overflow-hidden rounded-lg border',
        className
      )}
    >
      <div
        className={cn(
          'grid',
          getGridClasses(),
          sizeClasses.gap,
          sizeClasses.padding
        )}
      >
        {images.map((imageUrl, index) => (
          <div
            key={imageUrl}
            className={cn(
              'relative',
              getAspectRatioClass(),
              sizeClasses.minHeight
            )}
          >
            <SortableImageItem
              alt={`Image ${index + 1}`}
              blurHash={getBlurForImage(imageUrl)}
              id={imageUrl}
              index={index}
              src={imageUrl}
              onImageClick={onImageClick}
              onImageDelete={onImageDelete}
              onImagePreview={onImagePreview}
              onImageReplace={onImageReplace}
            />
          </div>
        ))}
      </div>
    </div>
  );

  if (!isMobile) {
    return (
      <div className="space-y-4">
        <DndContext
          collisionDetection={closestCenter}
          sensors={sensors}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={images} strategy={rectSortingStrategy}>
            {content}
          </SortableContext>
        </DndContext>
      </div>
    );
  }

  // Sinon, rendu simple (comme l'ancien quand pas de reorder)
  return <div className="space-y-4">{content}</div>;
};
