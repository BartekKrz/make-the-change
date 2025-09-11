/**
 * OptimizedImageMasonry - Make the CHANGE
 * Reproduction exacte de l'ancien ImageMasonry avec le nouveau système blur optimisé
 * Conserve la même UI/UX que l'ancien système
 */

'use client';

import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy,
  rectSortingStrategy
, 
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, Edit3, Eye, GripVertical } from 'lucide-react';
import Image from 'next/image';
import { type FC } from 'react';

import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn';
import { useIsMobile } from '@/hooks/use-media-query';
import type { ProductBlurHash } from '@/types/blur';

import type {
  DragEndEvent
} from '@dnd-kit/core';

type OptimizedImageMasonryProps = {
  images: string[];
  className?: string;
  onImageClick?: (imageUrl: string, index: number) => void;
  onImageReplace?: (imageUrl: string, index: number) => void;
  onImageDelete?: (imageUrl: string, index: number) => void;
  onImagePreview?: (imageUrl: string, index: number) => void;
  onImagesReorder?: (oldIndex: number, newIndex: number, newImages: string[]) => void;
  showActions?: boolean;
  enableReorder?: boolean;
  
  // 🚀 NOUVEAU : Support pour blur via map URL -> blur
  imageBlurMap?: Record<string, ProductBlurHash>;
  productId?: string;              // Pour diagnostics
};

// Composant sortable pour une image individuelle (reproduction exacte de l'ancien)
const SortableImageItem: FC<{
  src: string;
  alt: string;
  index: number;
  className?: string;
  id: string;
  showActions?: boolean;
  onImageClick?: (imageUrl: string, index: number) => void;
  onImageReplace?: (imageUrl: string, index: number) => void;
  onImageDelete?: (imageUrl: string, index: number) => void;
  onImagePreview?: (imageUrl: string, index: number) => void;
  
  // 🚀 NOUVEAU : Support blur optimisé
  blurHash?: ProductBlurHash;
}> = ({ 
  src, 
  alt, 
  index, 
  className, 
  id, 
  showActions = false,
  onImageClick,
  onImageReplace,
  onImageDelete,
  onImagePreview,
  blurHash
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
        'relative group w-full h-full cursor-pointer',
        isDragging && 'opacity-50 scale-95 z-10',
        className
      )}
      onClick={() => onImageClick?.(src, index)}
    >
      {/* Handle de drag & drop (reproduction exacte) avec z-index élevé */}
      {showActions && !isMobile && (
        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 left-2 z-30 cursor-grab active:cursor-grabbing"
        >
          <div className="bg-white/90 hover:bg-white p-1.5 rounded-lg shadow-md backdrop-blur-sm transition-colors">
            <GripVertical className="h-3 w-3 text-gray-600" />
          </div>
        </div>
      )}


      {/* 🚀 Image Next.js avec blur optimisé du serveur */}
      <Image
        fill
        alt={alt}
        className="object-cover transition-all duration-200 rounded-lg"
        priority={index < 4} // Prioriser les 4 premières images
        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        src={src}
        unoptimized={src.includes('unsplash')}
        {...blurProps} // 🚀 Blur hash du serveur !
      />

      {/* Actions overlay (reproduction exacte de l'ancien) avec z-index élevé */}
      {showActions && (
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 z-20">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="flex items-center gap-2">
                <button
                  className="bg-white/90 hover:bg-white p-2 rounded-lg shadow-md transition-colors"
                  title="Prévisualiser"
                  onClick={(e) => {
                    e.stopPropagation();
                    onImagePreview?.(src, index);
                  }}
                >
                  <Eye className="h-4 w-4 text-gray-700" />
                </button>
                <button
                  className="bg-white/90 hover:bg-white p-2 rounded-lg shadow-md transition-colors"
                  title="Remplacer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onImageReplace?.(src, index);
                  }}
                >
                  <Edit3 className="h-4 w-4 text-gray-700" />
                </button>
                <button
                  className="bg-white/90 hover:bg-red-50 p-2 rounded-lg shadow-md transition-colors"
                  title="Supprimer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onImageDelete?.(src, index);
                  }}
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const OptimizedImageMasonry: FC<OptimizedImageMasonryProps> = ({ 
  images, 
  className = 'w-full',
  onImageClick,
  onImageReplace,
  onImageDelete,
  onImagePreview,
  onImagesReorder,
  showActions = false,
  enableReorder = false,
  imageBlurMap = {},    // 🚀 NOUVEAU : blur map optimisé
  productId
}) => {


  // 🚀 NOUVEAU : Helper pour obtenir le blur hash d'une image
  const getBlurForImage = (imageUrl: string): ProductBlurHash | undefined => imageBlurMap?.[imageUrl];

  // 🚀 NOUVEAU : Statistiques du nouveau système
  const optimizedStats = {
    totalImages: images.length,
    withBlur: Object.keys(imageBlurMap).length,
    missing: images.length - Object.keys(imageBlurMap).length,
    coverage: images.length > 0 ? Math.round((Object.keys(imageBlurMap).length / images.length) * 100) : 100
  };


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
      const oldIndex = images.indexOf(active.id);
      const newIndex = images.indexOf(over.id);
      
      const newImages = arrayMove(images, oldIndex, newIndex);
      onImagesReorder?.(oldIndex, newIndex, newImages);
    }
  };

  const isMobile = useIsMobile();

  // Structure identique à l'ancien ImageMasonry qui fonctionnait
  const content = (
    <div className={cn("border border-border rounded-lg overflow-hidden", className)}>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 p-2">
        {images.map((imageUrl, index) => (
          <div key={imageUrl} className="relative aspect-square min-h-[120px]">
            <SortableImageItem
              alt={`Image ${index + 1}`}
              blurHash={getBlurForImage(imageUrl)} // 🚀 NOUVEAU : blur optimisé !
              id={imageUrl}
              index={index}
              showActions={showActions}
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

  // Si reorder activé, envelopper avec DndContext (comme l'ancien)
  if (enableReorder && !isMobile) {
    return (
      <div className="space-y-4">
        <DndContext
          collisionDetection={closestCenter}
          sensors={sensors}
          onDragEnd={handleDragEnd}
        >
            <SortableContext 
            items={images} 
            strategy={rectSortingStrategy}
          >
            {content}
          </SortableContext>
        </DndContext>
      </div>
    );
  }

  // Sinon, rendu simple (comme l'ancien quand pas de reorder)
  return (
    <div className="space-y-4">
      
      {content}
    </div>
  );
};

// Export pour compatibilité
export default OptimizedImageMasonry;
