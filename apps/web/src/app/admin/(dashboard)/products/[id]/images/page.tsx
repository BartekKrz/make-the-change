'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/app/admin/(dashboard)/components/ui/button';
import { ImageMasonry } from '@/components/ImageMasonry/ImageMasonry';
import { ImageManager } from '@/components/ImageManager/ImageManager';
import { ImageUploaderField } from '@/components/ImageUploader/adapters/ImageUploaderField';
import { useForm } from '@tanstack/react-form';
import { trpc } from '@/lib/trpc';

export default function ImageManagementPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const productId = params?.id as string;

  // Récupération des données du produit
  const { data: product, isLoading } = trpc.admin.products.detail.useQuery(
    { productId },
    { enabled: !!productId }
  );

  const update = trpc.admin.products.update.useMutation({
    onSuccess: () => {
      router.back();
    }
  });

  const [images, setImages] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Mettre à jour les images quand le produit est chargé
  React.useEffect(() => {
    if (product?.images && Array.isArray(product.images)) {
      setImages(product.images);
    }
  }, [product]);

  // Form pour l'uploader
  const form = useForm({
    defaultValues: {
      images: images
    }
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await update.mutateAsync({
        id: productId,
        patch: { images }
      });
    } catch (error) {
      console.error('Error saving images:', error);
      setIsSaving(false);
    }
  };

  const handleImagesReorder = (newImages: string[]) => {
    setImages(newImages);
    form.setFieldValue('images', newImages);
  };

  const handleImageRemove = async (imageUrl: string) => {
    const newImages = images.filter(img => img !== imageUrl);
    setImages(newImages);
    form.setFieldValue('images', newImages);
    
    // Supprimer du storage si c'est une image uploadée
    if (imageUrl.includes('supabase.co')) {
      try {
        const urlParts = imageUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const filePath = `${productId}/gallery/${fileName}`;
        
        await fetch(`/api/upload/product-images?path=${encodeURIComponent(filePath)}`, {
          method: 'DELETE',
        });
      } catch (error) {
        console.error('Error deleting image from storage:', error);
      }
    }
  };

  const handleNewImages = (newImages: string[]) => {
    setImages(newImages);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Produit non trouvé</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Gestion des images</h1>
                <p className="text-muted-foreground">{product.name}</p>
              </div>
            </div>
            
            <Button 
              onClick={handleSave}
              disabled={isSaving || update.isPending}
              className="gap-2"
            >
              <Save className="w-4 h-4" />
              {isSaving || update.isPending ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </div>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Aperçu actuel */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Aperçu actuel</h2>
          <ImageMasonry images={images} className="max-w-md" />
        </div>

        {/* Uploader */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Ajouter des images</h2>
          <form.Field name="images">
            {(field) => (
              <ImageUploaderField
                field={field}
                width="w-full"
                height="h-64"
                multiple={true}
                productId={productId}
                onImagesChange={handleNewImages}
              />
            )}
          </form.Field>
        </div>

        {/* Gestionnaire d'images */}
        <div className="space-y-4">
          <ImageManager
            images={images}
            onImagesReorder={handleImagesReorder}
            onImageRemove={handleImageRemove}
          />
        </div>

        {/* Instructions */}
        <div className="bg-muted/50 rounded-lg p-6 space-y-2">
          <h3 className="font-medium">Instructions :</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• La première image sera utilisée comme image principale</li>
            <li>• Utilisez les flèches ← → pour réorganiser l&apos;ordre</li>
            <li>• Cliquez sur l&apos;œil pour prévisualiser en grand</li>
            <li>• Cliquez sur X pour supprimer une image</li>
            <li>• N&apos;oubliez pas de sauvegarder vos modifications</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
