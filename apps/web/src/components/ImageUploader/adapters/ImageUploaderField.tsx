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

      // Appeler votre API d'upload
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
      
      if (multiple) {
        // Mode multiple : ajouter à la liste existante
        const currentImages = field.state.value || [];
        const newImages = [...currentImages, result.url];
        console.log('📝 Updating field (multiple):', {
          currentImages,
          newImages,
          addedUrl: result.url
        });
        field.handleChange(newImages);
        onImagesChange?.(newImages);
      } else {
        // Mode simple : remplacer l'image
        console.log('📝 Updating field (single):', {
          newUrl: result.url
        });
        field.handleChange([result.url]);
        onImagesChange?.([result.url]);
      }
      
      console.log('🎉 Field update completed successfully');
    } catch (error) {
      console.error('💥 Upload error:', error);
      // Vous pouvez ajouter une notification d'erreur ici
    }
  };

  const handleImageRemove = async (imageUrl?: string) => {
    console.log('🗑️ Starting image removal:', { imageUrl, productId, multiple });
    
    try {
      if (imageUrl && productId) {
        console.log('🔄 Deleting from storage...');
        // Supprimer du storage via API
        const urlParts = imageUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const filePath = `${productId}/gallery/${fileName}`;
        
        console.log('📂 Delete path:', filePath);
        
        const deleteResponse = await fetch(`/api/upload/product-images?path=${encodeURIComponent(filePath)}`, {
          method: 'DELETE',
        });
        
        console.log('🗑️ Delete API response:', deleteResponse.status);
        
        if (!deleteResponse.ok) {
          console.warn('⚠️ Delete from storage failed, but continuing with field update');
        }
      }

      if (multiple) {
        const currentImages = field.state.value || [];
        const newImages = imageUrl 
          ? currentImages.filter(img => img !== imageUrl)
          : [];
        console.log('📝 Updating field (remove multiple):', {
          currentImages,
          newImages,
          removedUrl: imageUrl
        });
        field.handleChange(newImages);
        onImagesChange?.(newImages);
      } else {
        console.log('📝 Updating field (remove single)');
        field.handleChange([]);
        onImagesChange?.([]);
      }
      
      console.log('✅ Image removal completed');
    } catch (error) {
      console.error('💥 Delete error:', error);
    }
  };

  const currentImages = field.state.value || [];
  
  // En mode multiple, ne pas afficher d'image courante dans la zone d'upload
  // La galerie est affichée séparément
  const currentImage = multiple 
    ? undefined  // Toujours vide en mode multiple pour permettre l'ajout
    : (currentImages.length > 0 ? currentImages[0] : undefined);

  return (
    <ImageUploader
      currentImage={currentImage}
      onImageSelect={handleImageSelect}
      onImageRemove={() => handleImageRemove(currentImage)}
      width={width}
      height={height}
      disabled={disabled}
    />
  );
};
