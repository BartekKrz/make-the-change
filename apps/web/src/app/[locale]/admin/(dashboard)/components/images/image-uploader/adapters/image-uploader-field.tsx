import { useState } from 'react';

import { useToast } from '@/hooks/use-toast';

import { ImageUploader } from '../components/image-uploader';

import type { FC } from 'react';

type TanStackFormField = {
  state: {
    value: string[] | null | undefined;
  };
  handleChange: (updater: ((prev: string[]) => string[]) | string[]) => void;
};

type ImageUploaderFieldProps = {
  field: TanStackFormField;
  onImagesChange?: (images: string[]) => void;
  width?: string;
  height?: string;
  disabled?: boolean;
  multiple?: boolean;
  productId?: string;
};

export const ImageUploaderField: FC<ImageUploaderFieldProps> = ({
  field,
  onImagesChange,
  width = 'w-full',
  height = 'h-48',
  disabled = false,
  multiple = false,
  productId,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleImageSelect = async (file: File | null) => {
    if (!file) {
      return;
    }

    setIsUploading(true); // 🚀 Démarrer le loading
    await uploadSingleImage(file);
    setIsUploading(false); // 🏁 Arrêter le loading
  };

  const handleImagesSelect = async (files: File[]) => {
    if (!files || files.length === 0) {
      return;
    }

    setIsUploading(true); // 🚀 Démarrer le loading
    // Log de contexte (optionnel)
    console.log('📸 Starting multiple upload:', {
      fileCount: files.length,
      fileNames: files.map(f => f.name),
      productId,
      multiple,
    });

    try {
      // Créer FormData pour l'upload multiple
      const formData = new FormData();

      // Ajouter tous les fichiers
      for (const [index, file] of files.entries()) {
        formData.append('files', file); // Utiliser 'files' pour multiple
      }

      if (productId) {
        formData.append('productId', productId);
      }

      // Appeler l'API d'upload améliorée
      const response = await fetch('/api/upload/product-images', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error response:', errorText);
        throw new Error(`Upload failed: ${response.status} - ${errorText}`);
      }

      const result = await response.json();

      // L'API retourne maintenant toutes les images mises à jour
      if (result.images) {
        field.handleChange(result.images);
        onImagesChange?.(result.images);

        // Toast de succès spécifique pour l'upload d'images
        toast({
          variant: 'success',
          title: 'Images uploadées',
          description: `${files.length} image(s) ajoutée(s) avec succès`,
        });
      }
    } catch (error) {
      console.error('💥 Multiple upload error:', error);

      // Toast d'erreur spécifique pour l'upload d'images
      toast({
        variant: 'destructive',
        title: "Erreur d'upload",
        description: "Impossible d'uploader les images. Veuillez réessayer.",
      });
    } finally {
      setIsUploading(false); // 🏁 Arrêter le loading dans tous les cas
    }
  };

  const uploadSingleImage = async (file: File) => {
    // Log de contexte (optionnel)
    console.log('🚀 Calling API /api/upload/product-images (single)...', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      productId,
      multiple,
    });

    try {
      // Créer FormData pour l'upload
      const formData = new FormData();
      formData.append('file', file);

      if (productId) {
        formData.append('productId', productId);
      }

      // Appeler l'API d'upload améliorée
      const response = await fetch('/api/upload/product-images', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error response:', errorText);
        throw new Error(`Upload failed: ${response.status} - ${errorText}`);
      }

      const result = await response.json();

      // L'API retourne maintenant toutes les images mises à jour
      if (result.images) {
        field.handleChange(result.images);
        onImagesChange?.(result.images);
      } else {
        // Fallback pour compatibilité
        if (multiple) {
          const currentImages = field.state.value || [];
          const newImages = [...currentImages, result.url];
          field.handleChange(newImages);
          onImagesChange?.(newImages);
        } else {
          field.handleChange([result.url]);
          onImagesChange?.([result.url]);
        }
      }
    } catch (error) {
      console.error('💥 Upload error:', error);
      // TODO: Ajouter une notification d'erreur
    }
  };

  const handleImageRemove = async (imageUrl?: string) => {
    try {
      if (imageUrl && productId) {
        // Extraire le path du fichier depuis l'URL
        let filePath = '';
        if (imageUrl.includes('supabase.co/storage')) {
          filePath = imageUrl.split('/storage/v1/object/public/products/')[1];
        }

        // Appeler l'API DELETE améliorée
        const deleteUrl = new URL(
          '/api/upload/product-images',
          window.location.origin
        );
        deleteUrl.searchParams.set('path', filePath);
        deleteUrl.searchParams.set('productId', productId);
        deleteUrl.searchParams.set('imageUrl', imageUrl);

        const deleteResponse = await fetch(deleteUrl.toString(), {
          method: 'DELETE',
        });

        if (!deleteResponse.ok) {
          console.warn('⚠️ Delete from storage/DB failed');
          throw new Error('Échec de la suppression');
        }

        const result = await deleteResponse.json();

        // Utiliser les images mises à jour retournées par l'API
        if (result.images) {
          field.handleChange(result.images);
          onImagesChange?.(result.images);
        }
      } else {
        // Mode local : juste retirer de la liste
        if (multiple) {
          const currentImages = field.state.value || [];
          const newImages = imageUrl
            ? currentImages.filter(img => img !== imageUrl)
            : [];
          field.handleChange(newImages);
          onImagesChange?.(newImages);
        } else {
          field.handleChange([]);
          onImagesChange?.([]);
        }
      }
    } catch (error) {
      console.error('💥 Delete error:', error);
      // Fallback : juste retirer de la liste locale
      if (multiple) {
        const currentImages = field.state.value || [];
        const newImages = imageUrl
          ? currentImages.filter(img => img !== imageUrl)
          : [];
        field.handleChange(newImages);
        onImagesChange?.(newImages);
      } else {
        field.handleChange([]);
        onImagesChange?.([]);
      }
    }
  };

  const currentImages = field.state.value || [];

  // En mode multiple, JAMAIS afficher d'image courante dans la zone d'upload
  // La galerie est affichée séparément par ImageMasonry
  const currentImage = multiple
    ? undefined // TOUJOURS vide en mode multiple pour garder la zone d'upload
    : (currentImages.length > 0
      ? currentImages[0]
      : undefined);

  // Callback pour nettoyer l'état de l'ImageUploader après upload réussi
  const handleUploadComplete = () => {
    // Ce callback permet à ImageUploader de nettoyer son état local
  };

  return (
    <ImageUploader
      currentImage={currentImage}
      disabled={disabled}
      height={height}
      isUploading={isUploading}
      multiple={multiple}
      width={width}
      onImageRemove={() => handleImageRemove(currentImage)}
      onImageSelect={multiple ? undefined : handleImageSelect}
      onImagesSelect={multiple ? handleImagesSelect : undefined}
      onUploadComplete={handleUploadComplete}
    />
  );
};
