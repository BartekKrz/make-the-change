import { ImageUploader } from '../components/ImageUploader';

// Type pour TanStack Form Field
interface TanStackFormField {
  state: {
    value: string[] | null | undefined;
  };
  handleChange: (updater: ((prev: string[]) => string[]) | string[]) => void;
}

interface ImageUploaderFieldProps {
  field: TanStackFormField;
  onImagesChange?: (images: string[]) => void;
  width?: string;
  height?: string;
  disabled?: boolean;
  multiple?: boolean;
  productId?: string;
}

export const ImageUploaderField = ({
  field,
  onImagesChange,
  width = 'w-full',
  height = 'h-48',
  disabled = false,
  multiple = false,
  productId
}: ImageUploaderFieldProps) => {
  
  const handleImageSelect = async (file: File | null) => {
    if (!file) {
      console.log('🚫 No file selected');
      return;
    }

    await uploadSingleImage(file);
  };

  const handleImagesSelect = async (files: File[]) => {
    if (!files || files.length === 0) {
      console.log('🚫 No files selected');
      return;
    }

    console.log('📸 Starting multiple upload:', {
      fileCount: files.length,
      fileNames: files.map(f => f.name),
      productId,
      multiple
    });

    try {
      // Créer FormData pour l'upload multiple
      const formData = new FormData();
      
      // Ajouter tous les fichiers
      files.forEach((file, index) => {
        formData.append('files', file); // Utiliser 'files' pour multiple
      });
      
      if (productId) {
        formData.append('productId', productId);
        console.log('📦 Added productId to FormData:', productId);
      }

      console.log('🚀 Calling API /api/upload/product-images with multiple files...');

      // Appeler l'API d'upload améliorée
      const response = await fetch('/api/upload/product-images', {
        method: 'POST',
        body: formData,
      });

      console.log('📡 API Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error response:', errorText);
        throw new Error(`Upload failed: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Multiple upload successful, result:', result);
      
      // L'API retourne maintenant toutes les images mises à jour
      if (result.images) {
        console.log('📝 Updating field with API response images:', result.images);
        field.handleChange(result.images);
        onImagesChange?.(result.images);
      }
      
      console.log('🎉 Multiple upload completed successfully');
    } catch (error) {
      console.error('💥 Multiple upload error:', error);
      // TODO: Ajouter une notification d'erreur
    }
  };

  const uploadSingleImage = async (file: File) => {
    console.log('📸 Starting upload:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      productId,
      multiple
    });

    try {
      // Créer FormData pour l'upload
      const formData = new FormData();
      formData.append('file', file);
      
      if (productId) {
        formData.append('productId', productId);
        console.log('📦 Added productId to FormData:', productId);
      }

      console.log('🚀 Calling API /api/upload/product-images...');

      // Appeler l'API d'upload améliorée
      const response = await fetch('/api/upload/product-images', {
        method: 'POST',
        body: formData,
      });

      console.log('📡 API Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error response:', errorText);
        throw new Error(`Upload failed: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Upload successful, result:', result);
      
      // L'API retourne maintenant toutes les images mises à jour
      if (result.images) {
        console.log('📝 Updating field with API response images:', result.images);
        field.handleChange(result.images);
        onImagesChange?.(result.images);
      } else {
        // Fallback pour compatibilité
        if (multiple) {
          const currentImages = field.state.value || [];
          const newImages = [...currentImages, result.url];
          console.log('📝 Updating field (multiple - fallback):', newImages);
          field.handleChange(newImages);
          onImagesChange?.(newImages);
        } else {
          console.log('📝 Updating field (single):', [result.url]);
          field.handleChange([result.url]);
          onImagesChange?.([result.url]);
        }
      }
      
      console.log('🎉 Field update completed successfully');
    } catch (error) {
      console.error('💥 Upload error:', error);
      // TODO: Ajouter une notification d'erreur
    }
  };

  const handleImageRemove = async (imageUrl?: string) => {
    console.log('🗑️ Starting image removal:', { imageUrl, productId, multiple });
    
    try {
      if (imageUrl && productId) {
        console.log('🔄 Deleting from storage and database...');
        
        // Extraire le path du fichier depuis l'URL
        let filePath = '';
        if (imageUrl.includes('supabase.co/storage')) {
          filePath = imageUrl.split('/storage/v1/object/public/products/')[1];
        }
        
        console.log('📂 Delete path:', filePath);
        
        // Appeler l'API DELETE améliorée
        const deleteUrl = new URL('/api/upload/product-images', window.location.origin);
        deleteUrl.searchParams.set('path', filePath);
        deleteUrl.searchParams.set('productId', productId);
        deleteUrl.searchParams.set('imageUrl', imageUrl);
        
        const deleteResponse = await fetch(deleteUrl.toString(), {
          method: 'DELETE',
        });
        
        console.log('🗑️ Delete API response:', deleteResponse.status);
        
        if (!deleteResponse.ok) {
          console.warn('⚠️ Delete from storage/DB failed');
          throw new Error('Échec de la suppression');
        }

        const result = await deleteResponse.json();
        console.log('✅ Delete successful, updated images:', result.images);
        
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
          console.log('📝 Updating field (remove multiple - local):', newImages);
          field.handleChange(newImages);
          onImagesChange?.(newImages);
        } else {
          console.log('📝 Updating field (remove single - local)');
          field.handleChange([]);
          onImagesChange?.([]);
        }
      }
      
      console.log('✅ Image removal completed');
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

  const handleImageReplace = async (index: number, file: File) => {
    console.log('🔄 Starting image replacement at index:', index);
    
    try {
      const currentImages = field.state.value || [];
      const oldImageUrl = currentImages[index];
      
      if (!oldImageUrl) {
        console.error('❌ No image to replace at index:', index);
        return;
      }

      console.log('🔄 Replacing image:', {
        index,
        oldUrl: oldImageUrl,
        newFile: file.name,
        productId
      });

      const formData = new FormData();
      formData.append('file', file);
      
      if (productId) {
        formData.append('productId', productId);
        formData.append('oldImageUrl', oldImageUrl);
        formData.append('imageIndex', index.toString());
        
        console.log('🔄 Calling PUT API with FormData:', {
          productId,
          oldImageUrl,
          imageIndex: index,
          fileName: file.name
        });
        
        const uploadResponse = await fetch('/api/upload/product-images', {
          method: 'PUT',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Échec du remplacement');
        }

        const result = await uploadResponse.json();
        console.log('✅ Replace successful, updated images:', result.images);
        
        // Utiliser les images mises à jour retournées par l'API
        if (result.images) {
          field.handleChange(result.images);
          onImagesChange?.(result.images);
        }
      } else {
        // Mode local : upload standard puis remplacement dans la liste
        const uploadResponse = await fetch('/api/upload/product-images', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Échec de l\'upload');
        }

        const result = await uploadResponse.json();
        
        if (result.url) {
          const newImages = [...currentImages];
          newImages[index] = result.url;
          console.log('📝 Updating field (replace - local):', newImages);
          field.handleChange(newImages);
          onImagesChange?.(newImages);
        }
      }
      
      console.log('✅ Image replacement completed');
    } catch (error) {
      console.error('💥 Replace error:', error);
    }
  };

  const currentImages = field.state.value || [];
  
  // En mode multiple, ne pas afficher d'image courante dans la zone d'upload
  // La galerie est affichée séparément
  const currentImage = multiple 
    ? undefined  // Toujours vide en mode multiple pour permettre l'ajout
    : (currentImages.length > 0 ? currentImages[0] : undefined);

  // Callback pour nettoyer l'état de l'ImageUploader après upload réussi
  const handleUploadComplete = () => {
    console.log('🎉 Upload completed, clearing ImageUploader state');
    // Ce callback permet à ImageUploader de nettoyer son état local
  };

  return (
    <ImageUploader
      currentImage={currentImage}
      onImageSelect={multiple ? undefined : handleImageSelect}
      onImagesSelect={multiple ? handleImagesSelect : undefined}
      onImageRemove={() => handleImageRemove(currentImage)}
      onUploadComplete={handleUploadComplete}
      multiple={multiple}
      width={width}
      height={height}
      disabled={disabled}
    />
  );
};
