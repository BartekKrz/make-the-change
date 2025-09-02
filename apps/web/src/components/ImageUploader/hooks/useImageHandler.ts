import { useState, ChangeEvent } from 'react';

export const useImageHandler = () => {
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
    const file = e.target.files?.[0] || null;
    setError(null);

    if (!file) {
      setUploadedImageSrc(null);
      setUploadedImageFile(null);
      return;
    }

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
  };

  const clearImage = () => {
    setUploadedImageSrc(null);
    setUploadedImageFile(null);
    setError(null);
  };

  return {
    uploadedImageSrc,
    uploadedImageFile,
    isUploading,
    error,
    handleImageUpload,
    setUploadedImageSrc,
    setIsUploading,
    setError,
    clearImage
  };
};
