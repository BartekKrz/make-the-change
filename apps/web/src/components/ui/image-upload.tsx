'use client';

import { Upload, X, Loader2 } from 'lucide-react';
import { useState, useCallback, useRef, type FC } from 'react';

import { useImageUpload } from '@/lib/upload';
import type { UploadOptions } from '@/lib/upload';

type ImageUploadProps = {
  entityId: string;
  bucket: 'projects' | 'products' | 'producers' | 'users' | 'categories';
  folder?: string;
  maxFiles?: number;
  currentImages?: string[];
  onImagesChange: (images: string[]) => void;
  className?: string;
  multiple?: boolean;
  acceptedTypes?: string[];
};

type UploadingFile = {
  file: File;
  progress: number;
  preview: string;
  error?: string;
};

export const ImageUpload: FC<ImageUploadProps> = ({
  entityId,
  bucket,
  folder,
  maxFiles = 5,
  currentImages = [],
  onImagesChange,
  className = '',
  multiple = true,
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
}) => {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploadImage, uploadMultiple, deleteImage } = useImageUpload();

  const handleFileSelect = useCallback(
    (files: File[]) => {
      const validFiles = files.filter(
        file =>
          acceptedTypes.includes(file.type) && file.size <= 10 * 1024 * 1024 // 10MB max
      );

      if (validFiles.length === 0) return;

      // Limiter le nombre de fichiers
      const remainingSlots = maxFiles - currentImages.length;
      const filesToUpload = validFiles.slice(0, remainingSlots);

      // Créer les previews
      const newUploadingFiles = filesToUpload.map(file => ({
        file,
        progress: 0,
        preview: URL.createObjectURL(file),
      }));

      setUploadingFiles(prev => [...prev, ...newUploadingFiles]);

      // Upload des fichiers
      uploadFiles(filesToUpload);
    },
    [acceptedTypes, maxFiles, currentImages.length]
  );

  const uploadFiles = async (files: File[]) => {
    const uploadOptions: UploadOptions = {
      bucket,
      folder,
      maxWidth: bucket === 'products' ? 1200 : 1920,
      maxHeight: bucket === 'products' ? 1200 : 1080,
      quality: 0.85,
    };

    try {
      const results = await uploadMultiple(files, entityId, uploadOptions);

      const successfulUploads = results
        .filter(result => result.success && result.url)
        .map(result => result.url!);

      if (successfulUploads.length > 0) {
        onImagesChange([...currentImages, ...successfulUploads]);
      }

      // Nettoyer les fichiers en cours d'upload
      setUploadingFiles(prev =>
        prev.filter(uploading => !files.includes(uploading.file))
      );

      // Gérer les erreurs
      const errors = results.filter(result => !result.success);
      if (errors.length > 0) {
        console.error('Upload errors:', errors);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadingFiles(prev =>
        prev.filter(uploading => !files.includes(uploading.file))
      );
    }
  };

  const removeImage = async (imageUrl: string, index: number) => {
    try {
      // Extraire le path de l'URL Supabase
      const urlParts = imageUrl.split('/');
      const fileName = urlParts.at(-1);
      const filePath = folder
        ? `${entityId}/${folder}/${fileName}`
        : `${entityId}/${fileName}`;

      await deleteImage(bucket, filePath);

      const newImages = currentImages.filter((_, i) => i !== index);
      onImagesChange(newImages);
    } catch (error) {
      console.error('Failed to delete image:', error);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);

      const files = [...e.dataTransfer.files];
      handleFileSelect(files);
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Zone de drop */}
      <div
        className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
          dragActive
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50'
        } ${currentImages.length >= maxFiles ? 'pointer-events-none opacity-50' : ''} `}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <Upload className="text-muted-foreground mx-auto mb-4 h-12 w-12" />

        <div className="space-y-2">
          <p className="text-sm font-medium">
            Glissez vos images ici ou{' '}
            <button
              className="text-primary hover:underline"
              type="button"
              onClick={openFileDialog}
            >
              parcourez
            </button>
          </p>
          <p className="text-muted-foreground text-xs">
            PNG, JPG, WEBP jusqu&apos;à 10MB • Maximum {maxFiles} images
          </p>
          <p className="text-muted-foreground text-xs">
            {currentImages.length}/{maxFiles} images uploadées
          </p>
        </div>

        <input
          ref={fileInputRef}
          accept={acceptedTypes.join(',')}
          className="hidden"
          multiple={multiple}
          type="file"
          onChange={e => {
            if (e.target.files) {
              handleFileSelect([...e.target.files]);
              e.target.value = ''; // Reset input
            }
          }}
        />
      </div>

      {/* Images uploadées */}
      {currentImages.length > 0 && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {currentImages.map((imageUrl, index) => (
            <div key={index} className="group relative">
              <div className="bg-muted aspect-square overflow-hidden rounded-lg">
                <img
                  alt={`Image ${index + 1}`}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  src={imageUrl}
                />
              </div>

              <button
                className="bg-destructive text-destructive-foreground absolute -top-2 -right-2 rounded-full p-1 opacity-0 transition-opacity group-hover:opacity-100"
                type="button"
                onClick={() => removeImage(imageUrl, index)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Fichiers en cours d'upload */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Upload en cours...</h4>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {uploadingFiles.map((uploading, index) => (
              <div key={index} className="relative">
                <div className="bg-muted aspect-square overflow-hidden rounded-lg">
                  <img
                    alt="Preview"
                    className="h-full w-full object-cover opacity-60"
                    src={uploading.preview}
                  />
                </div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-background/80 rounded-full p-2">
                    <Loader2 className="text-primary h-6 w-6 animate-spin" />
                  </div>
                </div>

                {uploading.error && (
                  <div className="absolute right-2 bottom-2 left-2">
                    <p className="text-destructive bg-destructive-foreground/90 rounded px-2 py-1 text-xs">
                      {uploading.error}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
