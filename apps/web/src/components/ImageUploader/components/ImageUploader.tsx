import { useRef, useState } from 'react';
import { ImageDisplay } from './ImageDisplay';
import { ImageUploadArea } from './ImageUploadArea';
import { ImageInput } from './ImageInput';
import { useImageHandler } from '../hooks/useImageHandler';
import { cn } from '@/lib/utils';
import { Loader2, AlertCircle } from 'lucide-react';

interface ImageUploaderProps {
  currentImage?: string;
  onImageSelect?: (file: File | null) => void;
  onImageRemove?: () => void;
  width?: string;
  height?: string;
  disabled?: boolean;
  className?: string;
}

export const ImageUploader = ({
  currentImage,
  onImageSelect,
  onImageRemove,
  width = 'w-full',
  height = 'h-48',
  disabled = false,
  className = ''
}: ImageUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const { 
    uploadedImageSrc, 
    handleImageUpload, 
    clearImage, 
    isUploading, 
    error 
  } = useImageHandler();

  const triggerFileInput = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageUpload(e);
    const file = e.target.files?.[0] || null;
    onImageSelect?.(file);
  };

  const handleRemove = () => {
    clearImage();
    onImageRemove?.();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Gestion du drag & drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      handleImageUpload({ target: { files: [file] } } as any);
      onImageSelect?.(file);
    }
  };

  const displayImage = uploadedImageSrc || currentImage;

  return (
    <div className={cn('space-y-2', className)}>
      <div
        className={cn(
          'relative border-2 border-dashed rounded-xl transition-all duration-300',
          width,
          height,
          isDragOver 
            ? 'border-primary bg-primary/5' 
            : 'border-muted-foreground/25 hover:border-primary/50',
          disabled && 'opacity-50 cursor-not-allowed',
          displayImage && !disabled ? 'hover:border-primary/30' : '',
          'focus-within:ring-2 focus-within:ring-primary/20 focus-within:ring-offset-2'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <ImageInput
          ref={fileInputRef}
          onChange={handleFileSelect}
          className={displayImage ? 'cursor-default' : 'cursor-pointer'}
          disabled={disabled}
        />

        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-xl">
            <div className="flex items-center gap-2 text-primary">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-sm font-medium">Upload en cours...</span>
            </div>
          </div>
        )}

        {!displayImage && !isUploading && (
          <ImageUploadArea 
            onClick={triggerFileInput} 
            isDragOver={isDragOver}
            disabled={disabled}
          />
        )}

        {displayImage && !isUploading && (
          <ImageDisplay 
            src={displayImage} 
            onRemove={handleRemove} 
            onChange={triggerFileInput}
            disabled={disabled}
          />
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-destructive text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
