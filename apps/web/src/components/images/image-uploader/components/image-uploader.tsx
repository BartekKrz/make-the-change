import { type FC, useRef, useState } from 'react';
import { ImageDisplay } from './image-display';
import { ImageUploadArea } from './image-upload-area';
import { ImageInput } from './image-input';
import { useImageHandler } from '../hooks/use-image-handler';
import { cn } from '@/lib/utils';
import { Loader2, AlertCircle } from 'lucide-react';

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
    console.log('🎯 [ImageUploader] triggerFileInput appelé, disabled:', disabled);
    if (!disabled) {
      console.log('🎯 [ImageUploader] Déclenchement du clic sur file input');
      fileInputRef.current?.click();
    } else {
      console.log('⚠️ [ImageUploader] Upload désactivé');
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('📁 [ImageUploader] handleFileSelect appelé');
    console.log('📁 [ImageUploader] Event target files:', e.target.files);
    
    handleImageUpload(e);
    const files = e.target.files;
    
    if (files && files.length > 0) {
      console.log('📁 [ImageUploader] Files détectés:', files.length, 'multiple:', multiple);
      
      if (multiple) {
        
        const fileArray = Array.from(files);
        console.log('📁 [ImageUploader] Mode multiple, appel onImagesSelect avec:', fileArray.length, 'files');
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
          console.log('⚠️ [ImageUploader] onImagesSelect non défini');
        }
      } else {
        
        const file = files[0];
        console.log('📁 [ImageUploader] Mode single, appel onImageSelect avec:', file.name);
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
          console.log('⚠️ [ImageUploader] onImageSelect non défini');
        }
      }
    } else {
      console.log('⚠️ [ImageUploader] Aucun fichier détecté');
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
        
        const fileArray = Array.from(files);
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
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {displayImage && !isUploading ? (
        <ImageDisplay 
          src={displayImage} 
          onRemove={handleRemove}
          onChange={triggerFileInput}
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
          onClick={triggerFileInput} 
          isDragOver={isDragOver}
          disabled={disabled}
          isUploading={isUploading || externalIsUploading}
        />
      )}
      
      <ImageInput
        ref={fileInputRef}
        onChange={handleFileSelect}
        multiple={multiple}
        disabled={disabled}
      />
    </div>
  );
};
