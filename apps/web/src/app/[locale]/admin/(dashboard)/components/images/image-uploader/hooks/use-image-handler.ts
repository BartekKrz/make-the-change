import { useState, type ChangeEvent } from 'react';

export const useImageHandler = () => {
  // Support pour images multiples
  const [uploadedImages, setUploadedImages] = useState<
    Array<{ src: string; file: File }>
  >([]);
  const [uploadedImageSrc, setUploadedImageSrc] = useState<string | null>(null);
  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    const maxSize = 10 * 1024 * 1024; // 10MB pour correspondre à la config Supabase
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (file.size > maxSize) {
      return 'Fichier trop volumineux (max 10MB)';
    }

    if (!allowedTypes.includes(file.type)) {
      return 'Format non supporté (JPEG, PNG, WebP uniquement)';
    }

    return null;
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setError(null);

    if (!files || files.length === 0) {
      setUploadedImageSrc(null);
      setUploadedImageFile(null);
      setUploadedImages([]);
      return;
    }

    // Support pour images multiples
    if (files.length > 1) {
      const validFiles: Array<{ src: string; file: File }> = [];
      let hasError = false;

      for (const file of files) {
        // Validation du fichier
        const validationError = validateFile(file);
        if (validationError) {
          setError(validationError);
          hasError = true;
          continue;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            validFiles.push({ src: reader.result, file });
            if (validFiles.length === files.length && !hasError) {
              setUploadedImages(validFiles);
            }
          }
        };
        reader.onerror = () => {
          setError('Erreur lors de la lecture du fichier');
          hasError = true;
        };
        reader.readAsDataURL(file);
      }
    } else {
      // Single file (compatibilité avec l'ancien système)
      const file = files[0];

      // Validation du fichier
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      setUploadedImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setUploadedImageSrc(reader.result);
        }
      };
      reader.onerror = () => {
        setError('Erreur lors de la lecture du fichier');
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setUploadedImageSrc(null);
    setUploadedImageFile(null);
    setUploadedImages([]);
    setError(null);
  };

  return {
    // Single image (compatibilité)
    uploadedImageSrc,
    uploadedImageFile,
    // Multiple images
    uploadedImages,
    isUploading,
    error,
    handleImageUpload,
    setUploadedImageSrc,
    setIsUploading,
    setError,
    clearImage,
  };
};
