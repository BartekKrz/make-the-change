/**
 * OptimizedImageMasonry - Make the CHANGE
 * Reproduction exacte de l'ancien ImageMasonry avec le nouveau système blur optimisé
 * Conserve la même UI/UX que l'ancien système
 */

'use client';

import { type FC } from 'react';
import Image from 'next/image';
import { Trash2, Edit3, Eye, GripVertical } from 'lucide-react';
import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn';
import { ProductBlurService, type ProductBlurHash } from '@/lib/services/product-blur-service';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy,
  rectSortingStrategy
} from '@dnd-kit/sortable';
import { 
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useIsMobile } from '@/hooks/useMediaQuery';

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
  
  // 🚀 NOUVEAU : Support pour blur hashes optimisés
  blurHashes?: ProductBlurHash[];  // Nouveau système scalable
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

  // 🚀 NOUVEAU : Utiliser le blur hash optimisé - TOUJOURS un blur !
  const blurProps = blurHash 
    ? ProductBlurService.formatBlurForNextImage(blurHash)
    : { placeholder: 'blur', blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R7Dh5zNvN2GpuY8CnFrJ0' }; // Blur générique gris moyen

  console.log(`🖼️ [SortableImageItem] Image ${src.slice(-15)}:`, {
    index,
    hasBlur: !!blurHash,
    blurHash: blurHash?.blurHash?.slice(0, 10) + '...' || 'none',
    blurProps: Object.keys(blurProps)
  });

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
        src={src}
        alt={alt}
        fill
        className="object-cover transition-all duration-200 rounded-lg"
        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        priority={index < 4} // Prioriser les 4 premières images
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
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Prévisualisation cliquée:', src, index);
                    onImagePreview?.(src, index);
                  }}
                  className="bg-white/90 hover:bg-white p-2 rounded-lg shadow-md transition-colors"
                  title="Prévisualiser"
                >
                  <Eye className="h-4 w-4 text-gray-700" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Remplacement cliqué:', src, index);
                    onImageReplace?.(src, index);
                  }}
                  className="bg-white/90 hover:bg-white p-2 rounded-lg shadow-md transition-colors"
                  title="Remplacer"
                >
                  <Edit3 className="h-4 w-4 text-gray-700" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Suppression cliquée:', src, index);
                    onImageDelete?.(src, index);
                  }}
                  className="bg-white/90 hover:bg-red-50 p-2 rounded-lg shadow-md transition-colors"
                  title="Supprimer"
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
  blurHashes = [],    // 🚀 NOUVEAU : blur hashes optimisés
  productId
}) => {
  console.log('🎨 [OptimizedImageMasonry] Rendu avec:', {
    productId,
    imagesCount: images.length,
    blurHashesCount: blurHashes.length,
    images: images.slice(0, 3), // Première 3 images pour debug
    blurHashes: blurHashes.slice(0, 3) // Premiers 3 blur hashes pour debug
  });


  // 🚀 NOUVEAU : Helper pour obtenir le blur hash d'une image
  const getBlurForImage = (imageUrl: string): ProductBlurHash | undefined => {
    const foundBlur = blurHashes.find(blur => blur.url === imageUrl);
    console.log(`🔍 [OptimizedImageMasonry] Recherche blur pour ${imageUrl.slice(-20)}:`, foundBlur ? '✅ trouvé' : '❌ absent');
    return foundBlur;
  };

  // 🚀 NOUVEAU : Statistiques du nouveau système
  const optimizedStats = {
    totalImages: images.length,
    withBlur: blurHashes.length,
    missing: images.length - blurHashes.length,
    coverage: images.length > 0 ? Math.round((blurHashes.length / images.length) * 100) : 100
  };

  console.log('📊 [OptimizedImageMasonry] Stats système scalable:', optimizedStats);

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
      const oldIndex = images.findIndex((img) => img === active.id);
      const newIndex = images.findIndex((img) => img === over.id);
      
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
          <div key={index} className="relative aspect-square min-h-[120px]">
            <SortableImageItem
              key={imageUrl}
              src={imageUrl}
              alt={`Image ${index + 1}`}
              index={index}
              id={imageUrl}
              showActions={showActions}
              onImageClick={onImageClick}
              onImageReplace={onImageReplace}
              onImageDelete={onImageDelete}
              onImagePreview={onImagePreview}
              blurHash={getBlurForImage(imageUrl)} // 🚀 NOUVEAU : blur optimisé !
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
        {/* 🚀 Debug info du nouveau système optimisé */}
        {process.env.NODE_ENV === 'development' && optimizedStats.totalImages > 0 && (
          <div className="text-xs text-blue-600 px-2 py-1 bg-blue-50 rounded">
            🚀 Système Blur Scalable: {optimizedStats.withBlur}/{optimizedStats.totalImages} images 
            ({optimizedStats.coverage}% coverage) {productId && `- ${productId}`}
          </div>
        )}
        
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
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