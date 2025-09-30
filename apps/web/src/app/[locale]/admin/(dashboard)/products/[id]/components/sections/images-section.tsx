'use client';
import { ImageIcon } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState, useMemo, useCallback } from 'react';

import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';
import type { AppFormApi } from '@/components/form';
import { ImageGalleryModal } from '@/app/[locale]/admin/(dashboard)/components/images/image-gallery';
import { ImageMasonry } from '@/components/ui/image-masonry';
import { useToast } from '@/hooks/use-toast';
import type { ProductBlurHash } from '@/types/blur';

import type { FC } from 'react';

// Composant inline pour respecter les règles des hooks et avoir un typage correct
const ImagesField: FC<{
  productId: string;
  imageBlurMap: Record<string, ProductBlurHash>;
  currentImages: string[];
  handleImageDelete: (
    imageUrl: string,
    index: number,
    updateField?: (images: string[]) => void
  ) => Promise<void>;
  handleImageReplace: (
    imageUrl: string,
    index: number,
    updateField?: (images: string[]) => void
  ) => void;
  handleImagesReorder: (
    oldIndex: number,
    newIndex: number,
    newImages: string[],
    updateField?: (images: string[]) => void
  ) => Promise<void>;
  setGalleryModal: React.Dispatch<
    React.SetStateAction<{
      isOpen: boolean;
      images: string[];
      initialIndex: number;
    }>
  >;
}> = ({
  productId,
  imageBlurMap,
  currentImages,
  handleImageDelete,
  handleImageReplace,
  handleImagesReorder,
  setGalleryModal,
}) => {
  const t = useTranslations();
  const hasImages = currentImages.length > 0;

  return (
    <>
      {hasImages && (
        <ImageMasonry
          className="w-full"
          entityId={productId}
          imageBlurMap={imageBlurMap}
          images={currentImages}
          onImageClick={() => {}}
          onImageDelete={(url, index) =>
            handleImageDelete(url, index)
          }
          onImagePreview={(_, index) => {
            setGalleryModal({
              isOpen: true,
              images: currentImages,
              initialIndex: index,
            });
          }}
          onImageReplace={(url, index) =>
            handleImageReplace(url, index)
          }
          onImagesReorder={(oldIndex, newIndex, newImages) =>
            handleImagesReorder(
              oldIndex,
              newIndex,
              newImages
            )
          }
        />
      )}

      <div className="space-y-4">
        <label className="text-sm font-medium">
          {t('admin.products.edit.images.add')}
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </>
  );
};

interface ImagesSectionProps {
  form: AppFormApi;
}

export const ImagesSection: FC<ImagesSectionProps> = ({ form }) => {
  const t = useTranslations();
  //todo: revoir cela, je me demande si il y a un coup à déclarer les deux lignes suivante (constant params et productId) dans chaque composant, on pourrait peut-être jsute passer en props productId
  const params = useParams<{ id: string }>();
  const productId = params.id;

  const { toast } = useToast();

  const [galleryModal, setGalleryModal] = useState<{
    isOpen: boolean;
    images: string[];
    initialIndex: number;
  }>({
    isOpen: false,
    images: [],
    initialIndex: 0,
  });

  // Note: imageBlurMap devrait être passé via le form state ou récupéré
  // Pour l'instant, on utilise un objet vide comme placeholder
  const imageBlurMap = useMemo(() => {
    return {} as Record<string, ProductBlurHash>;
  }, []);

  const handleImageDelete = useCallback(
    async (
      imageUrl: string,
      index: number,
      updateField?: (images: string[]) => void
    ) => {
      try {
        if (!productId) return;

        // Get current images from form state
        const currentImages = (form.state.values.images as string[]) || [];
        const next = currentImages.filter((_, i) => i !== index);

        // Logique de suppression depuis storage
        let filePath = '';
        const marker = '/storage/v1/object/public/products/';
        if (imageUrl.includes(marker)) {
          const parts = imageUrl.split(marker);
          filePath = parts[1] || '';
        }

        if (filePath) {
          const url = new URL(
            '/api/upload/product-images',
            window.location.origin
          );
          url.searchParams.set('path', filePath);
          url.searchParams.set('productId', productId);
          url.searchParams.set('imageUrl', imageUrl);

          const del = await fetch(url.toString(), {
            method: 'DELETE',
          });

          if (!del.ok) throw new Error('Erreur suppression image');

          const result = await del.json();
          updateField?.(result.images) ||
            form.setFieldValue('images', result.images);
        } else {
          // Fallback: mise à jour côté DB seulement
          const response = await fetch('/api/upload/product-images', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId, images: next }),
          });

          if (!response.ok) throw new Error('Erreur mise à jour des images');

          const result = await response.json();
          updateField?.(result.images) ||
            form.setFieldValue('images', result.images);
        }

        toast({
          variant: 'default',
          title: t('common.updated'),
          description: t('admin.products.edit.images.deleted'),
        });
      } catch {
        toast({
          variant: 'destructive',
          title: t('common.error'),
          description: t('admin.products.edit.images.delete_error'),
        });
      }
    },
    [productId, form, toast, t]
  );

  const handleImageReplace = useCallback(
    (
      imageUrl: string,
      index: number,
      updateField?: (images: string[]) => void
    ) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.style.display = 'none';

      input.addEventListener('change', async e => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file || !productId) {
          input.remove();
          return;
        }

        try {
          // Access field through AppField render prop
          const formData = new FormData();
          formData.append('file', file);
          formData.append('productId', productId);
          formData.append('oldImageUrl', imageUrl);
          formData.append('imageIndex', String(index));

          const response = await fetch('/api/upload/product-images', {
            method: 'PUT',
            body: formData,
          });

          if (!response.ok) throw new Error('Erreur remplacement image');

          const result = await response.json();
          updateField?.(result.images) ||
            form.setFieldValue('images', result.images);

          toast({
            variant: 'default',
            title: t('common.updated'),
            description: t('admin.products.edit.images.replaced'),
          });
        } catch {
          toast({
            variant: 'destructive',
            title: t('common.error'),
            description: t('admin.products.edit.images.replace_error'),
          });
        } finally {
          input.remove();
        }
      });

      document.body.append(input);
      input.click();
    },
    [productId, form, toast, t]
  );

  const handleImagesReorder = useCallback(
    async (
      _oldIndex: number,
      _newIndex: number,
      newImages: string[],
      updateField?: (images: string[]) => void
    ) => {
      try {
        if (!productId) return;

        // Access field through AppField render prop
        const response = await fetch('/api/upload/product-images', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId, images: newImages }),
        });

        if (!response.ok)
          throw new Error('Erreur mise à jour ordre des images');

        const result = await response.json();
        updateField?.(result.images) ||
          form.setFieldValue('images', result.images);

        toast({
          variant: 'default',
          title: t('common.updated'),
          description: t('admin.products.edit.images.order_updated'),
        });
      } catch {
        toast({
          variant: 'destructive',
          title: t('common.error'),
          description: t('admin.products.edit.images.order_update_error'),
        });
      }
    },
    [productId, form, toast, t]
  );

  if (!productId) {
    return null; // Early return si pas de productId
  }

  return (
    <>
      <DetailView.Section
        icon={ImageIcon}
        span={2}
        title={t('admin.products.edit.sections.images')}
      >
        <div className="w-full space-y-6">
          <form.Field name="images">
            {(field) => (
              <ImagesField
                currentImages={field.state.value || []}
                handleImageDelete={handleImageDelete}
                handleImageReplace={handleImageReplace}
                handleImagesReorder={handleImagesReorder}
                imageBlurMap={imageBlurMap}
                productId={productId}
                setGalleryModal={setGalleryModal}
              />
            )}
          </form.Field>
        </div>
      </DetailView.Section>

      {galleryModal.isOpen && (
        <ImageGalleryModal
          imageBlurMap={imageBlurMap}
          images={galleryModal.images}
          initialIndex={galleryModal.initialIndex}
          isOpen={galleryModal.isOpen}
          onClose={() => setGalleryModal(prev => ({ ...prev, isOpen: false }))}
          onImageDelete={async (imageUrl, index) => {
            const currentImages = galleryModal.images;
            await handleImageDelete(imageUrl, index);

            const newImages = currentImages.filter(
              (_: string, i: number) => i !== index
            );
            setGalleryModal(prev => ({
              ...prev,
              images: newImages,
              initialIndex:
                index >= newImages.length
                  ? Math.max(0, newImages.length - 1)
                  : index,
            }));

            if (newImages.length === 0) {
              setGalleryModal(prev => ({ ...prev, isOpen: false }));
            }
          }}
          onImageReplace={async (imageUrl, index) => {
            await handleImageReplace(imageUrl, index);
            setGalleryModal(prev => ({ ...prev, isOpen: false }));
          }}
        />
      )}
    </>
  );
};
