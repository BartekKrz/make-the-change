import {  Images, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FC } from 'react';

type ImageUploadAreaProps = {
  onClick: () => void;
  isDragOver?: boolean;
  disabled?: boolean;
  isUploading?: boolean;
}

export const ImageUploadArea: FC<ImageUploadAreaProps> = ({ 
  onClick, 
  isDragOver = false,
  disabled = false,
  isUploading = false
}) => (
  <div 
    className={cn(
      'absolute inset-0 group flex flex-col items-center justify-center gap-3 p-6',
      'cursor-pointer transition-all duration-300 ease-out',
      // Animation légère du background de toute la zone
      '',
      'hover:bg-muted/20 active:scale-[0.98]',
      isDragOver && 'bg-muted/30 scale-[1.02]',
      disabled && 'cursor-not-allowed opacity-50'
    )}
    onClick={!disabled ? () => {
      console.log('🖱️ [ImageUploadArea] Zone cliquée, disabled:', disabled);
      onClick();
    } : undefined}
  >
    <div className={cn(
      'p-4 rounded-lg transition-all duration-300 ease-out',
      'bg-muted/30 group-hover:bg-muted/50 group-hover:scale-105',
      'shadow-sm group-hover:shadow-md',
      isDragOver && 'bg-muted/60 scale-110 shadow-lg',
      isUploading && 'bg-blue-50 border border-blue-200'
    )}>
      {isUploading ? (
        <Loader2 className={cn(
          'w-8 h-8 animate-spin',
          'text-blue-500'
        )} />
      ) : (
        <Images className={cn(
          'w-8 h-8 transition-all duration-300 ease-out',
          'text-muted-foreground group-hover:text-foreground',
          isDragOver && 'text-primary'
        )} />
      )}
    </div>
    <div className="text-center">
      <p className={cn(
        'text-sm font-medium transition-all duration-300 ease-out',
        'text-muted-foreground/80 group-hover:text-muted-foreground',
        'uppercase tracking-wide transform group-hover:scale-105',
        isDragOver && 'text-primary font-semibold',
        isUploading && 'text-blue-600 font-semibold'
      )}>
        {isUploading 
          ? 'Upload de l\'image en cours...' 
          : isDragOver 
            ? 'Déposer ici' 
            : 'Ajouter des images'
        }
      </p>
    </div>
  </div>
);
