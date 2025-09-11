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

import type {
  DragEndEvent
} from '@dnd-kit/core';

type ImageMasonryProps = {
  images: string[];
  className?: string;
  onImageClick?: (imageUrl: string, index: number) => void;
  onImageReplace?: (imageUrl: string, index: number) => void;
  onImageDelete?: (imageUrl: string, index: number) => void;
  onImagePreview?: (imageUrl: string, index: number) => void;
  onImagesReorder?: (oldIndex: number, newIndex: number, newImages: string[]) => void;
  showActions?: boolean;
  enableReorder?: boolean;
};

export const ImageMasonry: FC<ImageMasonryProps> = ({ 
  images, 
  className, 
  onImageClick,
  onImageReplace,
  onImageDelete,
  onImagePreview,
  onImagesReorder,
  showActions = false,
  enableReorder = false
}) => {
  const isMobile = useIsMobile();
  
  
  // Configuration des sensors pour le drag & drop avec activation plus permissive
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Distance réduite pour une activation plus facile
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handler pour la fin du drag & drop
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = images.findIndex((_, index) => `image-${index}` === active.id);
      const newIndex = images.findIndex((_, index) => `image-${index}` === over?.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newImages = arrayMove(images, oldIndex, newIndex);
        onImagesReorder?.(oldIndex, newIndex, newImages);
      }
    }
  };

  // Composant sortable pour une image individuelle
  const SortableImageItem: FC<{ 
    src: string; 
    alt: string; 
    index: number; 
    className?: string;
    id: string;
  }> = ({ src, alt, index, className, id }) => {
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

    return (
      <div 
        ref={setNodeRef}
        style={style}
        className={cn(
          "relative group w-full h-full",
          isDragging && "z-50 opacity-50",
          className
        )}
      >
        {/* Drag handle pour desktop et mobile */}
        {enableReorder && showActions && (
          <div 
            {...attributes}
            {...listeners}
            className="absolute top-2 left-2 z-30 p-1 bg-black/70 rounded cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
            title="Glisser pour réorganiser"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <GripVertical className="w-4 h-4 text-white" />
          </div>
        )}

        {/* Image standard (placeholder Next/Image non utilisé ici) */}
        <Image
          fill
          alt={alt}
          src={src}
          unoptimized={src.includes('unsplash')}
          className={cn(
            "object-cover transition-all duration-200",
            showActions ? "group-hover:brightness-75" : "hover:brightness-90 cursor-pointer",
            isDragging && "brightness-75"
          )}
        />

        {/* Click handler overlay - Réactivé mais conditionnel */}
        {!showActions && onImageClick && (
          <div 
            className="absolute inset-0 z-5 cursor-pointer"
            onClick={() => {
              onImageClick(src, index);
            }}
          />
        )}
        
        {/* Overlay avec actions au hover en mode édition */}
        {showActions && (
          <div 
            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center z-20"
            onMouseDown={(e) => {
              // Empêcher l'overlay d'interférer avec le drag sur le handle
              if (enableReorder) {
                e.stopPropagation();
              }
            }}
          >
            <div className="flex gap-2">
              {/* Bouton prévisualiser */}
              <button
                className="p-2 bg-blue-500/90 hover:bg-blue-500 rounded-full transition-colors duration-200 shadow-lg"
                title="Prévisualiser l'image"
                onClick={(e) => {
                  e.stopPropagation();
                  onImagePreview?.(src, index);
                }}
              >
                <Eye className="w-4 h-4 text-white" />
              </button>
              
              {/* Bouton remplacer */}
              <button
                className="p-2 bg-white/90 hover:bg-white rounded-full transition-colors duration-200 shadow-lg"
                title="Remplacer l'image"
                onClick={(e) => {
                  e.stopPropagation();
                  onImageReplace?.(src, index);
                }}
              >
                <Edit3 className="w-4 h-4 text-gray-700" />
              </button>
              
              {/* Bouton supprimer */}
              <button
                className="p-2 bg-red-500/90 hover:bg-red-500 rounded-full transition-colors duration-200 shadow-lg"
                title="Supprimer l'image"
                onClick={(e) => {
                  e.stopPropagation();
                  onImageDelete?.(src, index);
                }}
              >
                <Trash2 className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        )}
        
        {/* Indicateur de clic en mode non-édition */}
        {!showActions && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
            <div className="bg-black/50 rounded-full p-3">
              <Eye className="w-6 h-6 text-white" />
            </div>
          </div>
        )}
      </div>
    );
  };

  // Vérification de sécurité
  if (!images || !Array.isArray(images) || images.length === 0) {
    return (
      <div className={cn("border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center", className)}>
        <p className="text-muted-foreground">Aucune image</p>
      </div>
    );
  }

  // Configuration pour DndContext
  const imageIds = images.map((_, index) => `image-${index}`);
  
  // Grille uniforme et responsive pour toutes les images
  const GalleryContent = () => {
    return (
      <div className={cn("border border-border rounded-lg overflow-hidden", className)}>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 p-2">
          {images.map((imageUrl, index) => (
            <div key={index} className="relative aspect-square min-h-[120px]">
              <SortableImageItem
                alt={`Product image ${index + 1}`}
                className="cursor-pointer"
                id={imageIds[index]}
                index={index}
                src={imageUrl}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Si le réordonnancement est activé et qu'on est en mode édition, envelopper avec DndContext
  if (enableReorder && showActions) {
    return (
      <DndContext 
        collisionDetection={closestCenter}
        sensors={sensors}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={imageIds} strategy={rectSortingStrategy}>
          <GalleryContent />
        </SortableContext>
      </DndContext>
    );
  }

  // Sinon, affichage normal sans drag & drop
  return <GalleryContent />;
};
