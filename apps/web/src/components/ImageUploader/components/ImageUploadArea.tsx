import { Plus, Images } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadAreaProps {
  onClick: () => void;
  isDragOver?: boolean;
  disabled?: boolean;
}

export const ImageUploadArea = ({ 
  onClick, 
  isDragOver = false,
  disabled = false 
}: ImageUploadAreaProps) => (
  <div 
    className={cn(
      'absolute inset-0 flex flex-col items-center justify-center gap-3 p-6',
      'cursor-pointer transition-all duration-300 ease-out',
      // Animation légère du background de toute la zone
      'animate-pulse hover:animate-none',
      'hover:bg-muted/20 active:scale-[0.98]',
      isDragOver && 'bg-muted/30 scale-[1.02]',
      disabled && 'cursor-not-allowed opacity-50'
    )}
    onClick={!disabled ? onClick : undefined}
  >
    <div className={cn(
      'p-4 rounded-lg transition-all duration-300 ease-out',
      'bg-muted/30 hover:bg-muted/50 hover:scale-105',
      'shadow-sm hover:shadow-md',
      isDragOver && 'bg-muted/60 scale-110 shadow-lg'
    )}>
      <Images className={cn(
        'w-8 h-8 transition-all duration-300 ease-out',
        'text-muted-foreground hover:text-foreground',
        isDragOver && 'text-primary'
      )} />
    </div>
    <div className="text-center">
      <p className={cn(
        'text-sm font-medium transition-all duration-300 ease-out',
        'text-muted-foreground/80 hover:text-muted-foreground',
        'uppercase tracking-wide transform hover:scale-105',
        isDragOver && 'text-primary font-semibold'
      )}>
        {isDragOver ? 'Déposer ici' : 'Ajouter des images'}
      </p>
    </div>
  </div>
);
