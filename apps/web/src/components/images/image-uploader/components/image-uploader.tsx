import { Loader2, AlertCircle } from 'lucide-react';
import { type FC, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

import { ImageDisplay } from './image-display';
import { ImageInput } from './image-input';
import { ImageUploadArea } from './image-upload-area';
import { useImageHandler } from '../hooks/use-image-handler';

type ImageUploaderProps =  {
  currentImage?: string;
  onImageSelect?: (file: File | null) => void;
  onImagesSelect?: (files: File[]) => void; 
  onImageRemove?: () => void;
  onUploadComplete?: () => void; 
  width?: string;
  height?: string;
  disabled?: boolean;
  multiple?: boolean; 
  className?: string;
  isUploading?: boolean; 
}

export const ImageUploader: FC<ImageUploaderProps> = ({
  currentImage,
  onImageSelect,
  onImagesSelect,
  onImageRemove,
  onUploadComplete,
  width = 'w-full',
  height = 'h-48',
  disabled = false,
  multiple = false,
  className,
  isUploading: externalIsUploading = false,
}) => {
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
    if (disabled) {
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    
    handleImageUpload(e);
    const files = e.target.files;
    
    if (files && files.length > 0) {
      
      if (multiple) {
        
        const fileArray = [...files];
        if (onImagesSelect) {
          try {
            await onImagesSelect(fileArray);
            
            clearImage();
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
            onUploadComplete?.();
          } catch (error) {
            console.error('Upload failed:', error);
          }
        } else {
        }
      } else {
        
        const file = files[0];
        if (onImageSelect) {
          try {
            await onImageSelect(file);
            
            clearImage();
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
            onUploadComplete?.();
          } catch (error) {
            console.error('Upload failed:', error);
          }
        } else {
        }
      }
    } else {
    }
  };

  const handleRemove = () => {
    clearImage();
    onImageRemove?.();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  
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

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      if (multiple) {
        
        const fileArray = [...files];
        handleImageUpload({ target: { files: fileArray } } as any);
        
        if (onImagesSelect) {
          try {
            await onImagesSelect(fileArray);
            
            clearImage();
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
            onUploadComplete?.();
          } catch (error) {
            console.error('Upload failed:', error);
          }
        }
      } else {
        
        const file = files[0];
        handleImageUpload({ target: { files: [file] } } as any);
        
        if (onImageSelect) {
          try {
            await onImageSelect(file);
            clearImage();
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
            onUploadComplete?.();
          } catch (error) {
            console.error('Upload failed:', error);
          }
        }
      }
    }
  };

  
  
  const displayImage = multiple ? undefined : (uploadedImageSrc || currentImage);

  return (
    <div 
      className={cn(
        'relative border-2 border-dashed border-muted-foreground/25 rounded-lg transition-all duration-300 ease-in-out hover:border-muted-foreground/50 overflow-hidden',
        width,
        height,
        isDragOver && 'border-primary/50 bg-primary/5',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {displayImage && !isUploading ? (
        <ImageDisplay 
          src={displayImage} 
          onChange={triggerFileInput}
          onRemove={handleRemove}
        />
      ) : isUploading ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/80 backdrop-blur-sm">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Upload en cours...</p>
        </div>
      ) : error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6">
          <div className="p-3 rounded-lg bg-destructive/10">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-destructive mb-2">Erreur</p>
            <p className="text-xs text-muted-foreground">{error}</p>
          </div>
        </div>
      ) : (
        <ImageUploadArea 
          disabled={disabled} 
          isDragOver={isDragOver}
          isUploading={isUploading || externalIsUploading}
          onClick={triggerFileInput}
        />
      )}
      
      <ImageInput
        ref={fileInputRef}
        disabled={disabled}
        multiple={multiple}
        onChange={handleFileSelect}
      />
    </div>
  );
};
