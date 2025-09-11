import { Info, DollarSign, ImageIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { type FC, type PropsWithChildren, useState, useEffect } from "react";

import type { SaveStatus } from "@/app/[locale]/admin/(dashboard)/products/[id]/types";
import { ImageGalleryModal } from "@/components/images/image-gallery";
import { ImageUploaderField } from "@/components/images/image-uploader";
import { OptimizedImageMasonry } from "@/components/ui/optimized-image-masonry";
import { type ProductBlurHash } from "@/types/blur";
import { trpc } from '@/lib/trpc';
import type { ProductFormData} from "@/lib/validators/product";
import { tierLabels, fulfillmentMethodLabels } from "@/lib/validators/product";

import { SimpleInput, SimpleTextArea, SimpleSelect } from "./simple-form-components";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";


type ProductDetailsEditorProps = {
  productData: ProductFormData & { id: string };
  onFieldChange: (field: string, value: unknown) => void;
  saveStatus?: SaveStatus;
  pendingChanges: Partial<ProductFormData>;
  onSaveAll?: () => void;
};

// État pour les blur hashes optimisés
type ProductBlurState = {
  imageBlurMap: Record<string, ProductBlurHash>;
  stats: {
    totalImages: number;
    withBlur: number;
    missing: number;
    coverage: number;
  };
  isLoading: boolean;
}

const ProductCardsGrid: FC<PropsWithChildren> = ({ children }) => (
  <div className='grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 [&>*]:h-full'>{children}</div>
);

const tierOptions = Object.entries(tierLabels).map(([value, label]) => ({
  value,
  label
}));

const fulfillmentOptions = Object.entries(fulfillmentMethodLabels).map(([value, label]) => ({
  value,
  label
}));


const ProductDetailsEditor: React.FC<ProductDetailsEditorProps> = ({
  productData,
  onFieldChange
}) => {
  const t = useTranslations();
  // État pour le modal de prévisualisation d'images
  const [galleryModal, setGalleryModal] = useState<{
    isOpen: boolean;
    images: string[];
    initialIndex: number;
  }>({
    isOpen: false,
    images: [],
    initialIndex: 0
  });

  // État pour les blur hashes du nouveau système DB
  const [blurState, setBlurState] = useState<ProductBlurState>({
    imageBlurMap: {},
    stats: { totalImages: 0, withBlur: 0, missing: 0, coverage: 100 },
    isLoading: false
  });

  const blurQuery = trpc.admin.products.detail_enriched.useQuery(
    { productId: productData.id },
    { enabled: !!productData.id && Array.isArray(productData.images) && productData.images.length > 0, staleTime: 120000 }
  )

  useEffect(() => {
    if (!productData.id) return
    if (blurQuery.isFetching) {
      setBlurState(prev => ({ ...prev, isLoading: true }))
      return
    }
    if (!productData.images?.length) {
      setBlurState({ imageBlurMap: {}, stats: { totalImages: 0, withBlur: 0, missing: 0, coverage: 100 }, isLoading: false })
      return
    }
    const mapped: any = blurQuery.data
    if (mapped && mapped.image_blur_map) {
      const stats = {
        totalImages: mapped.total_images,
        withBlur: mapped.blur_count,
        missing: mapped.total_images - mapped.blur_count,
        coverage: mapped.blur_coverage_percent,
      }
      const normalized: Record<string, ProductBlurHash> = {}
      Object.entries(mapped.image_blur_map as Record<string, any>).forEach(([url, v]: any) => { normalized[url] = { url, ...(v as any) } })
      setBlurState({ imageBlurMap: normalized, stats, isLoading: false })
    } else {
      setBlurState({ imageBlurMap: {}, stats: { totalImages: productData.images.length, withBlur: 0, missing: productData.images.length, coverage: 0 }, isLoading: false })
    }
  }, [productData.id, productData.images, blurQuery.isFetching, blurQuery.data])


  const contentSections = [
    {
      id: 'general',
      title: t('admin.products.edit.sections.general'),
      icon: Info,
      content: (
        <div className='space-y-4'>
          <div>
            <SimpleInput
              required
              label={t('admin.products.edit.fields.name')}
              placeholder={t('admin.products.edit.placeholders.name')}
              value={productData.name}
              onChange={(value) => onFieldChange('name', value)}
            />
          </div>

          <div>
            <SimpleInput
              required
              label={t('admin.products.edit.fields.slug')}
              placeholder={t('admin.products.edit.placeholders.slug')}
              value={productData.slug}
              onChange={(value) => onFieldChange('slug', value)}
            />
          </div>

          <div>
            <SimpleTextArea
              label={t('admin.products.edit.fields.short_description')}
              placeholder={t('admin.products.edit.placeholders.short_description')}
              rows={3}
              value={productData.short_description || ''}
              onChange={(value) => onFieldChange('short_description', value)}
            />
          </div>

          <div>
            <SimpleTextArea
              label={t('admin.products.edit.fields.description')}
              placeholder={t('admin.products.edit.placeholders.description')}
              rows={6}
              value={productData.description || ''}
              onChange={(value) => onFieldChange('description', value)}
            />
          </div>
        </div>
      )
    },
    {
      id: 'pricing',
      title: t('admin.products.edit.sections.pricing'),
      icon: DollarSign,
      content: (
        <div className='space-y-4'>
          <div>
            <SimpleInput
              required
              label={t('admin.products.edit.fields.price_points')}
              placeholder="100"
              type="number"
              value={productData.price_points?.toString() || ''}
              onChange={(value) => onFieldChange('price_points', Number.parseInt(value) || 0)}
            />
          </div>

          <div>
            <SimpleInput
              label={t('admin.products.edit.fields.stock_quantity')}
              placeholder="0"
              type="number"
              value={productData.stock_quantity?.toString() || ''}
              onChange={(value) => onFieldChange('stock_quantity', Number.parseInt(value) || 0)}
            />
          </div>

          <div>
            <SimpleSelect
              label={t('admin.products.edit.fields.min_tier')}
              options={tierOptions}
              placeholder={t('admin.products.edit.placeholders.min_tier')}
              value={productData.min_tier}
              onChange={(value) => onFieldChange('min_tier', value)}
            />
          </div>

          <div>
            <SimpleSelect
              label={t('admin.products.edit.fields.fulfillment_method')}
              options={fulfillmentOptions}
              placeholder={t('admin.products.edit.placeholders.fulfillment_method')}
              value={productData.fulfillment_method}
              onChange={(value) => onFieldChange('fulfillment_method', value)}
            />
          </div>
        </div>
      )
    },
    {
      id: 'images',
      title: t('admin.products.edit.sections.images'),
      icon: ImageIcon,
      content: (
        <div className='w-full space-y-6'>
          

          <div className='w-full space-y-6'>
            {/* 🚀 Galerie avec nouveau système DB Blur */}
            {productData.images && productData.images.length > 0 && (
              <OptimizedImageMasonry
                enableReorder
                showActions
                imageBlurMap={blurState.imageBlurMap}
                className='w-full'
                images={productData.images}
                productId={productData.id}        // 🚀 NOUVEAU : ID pour diagnostics
                onImageClick={(_imageUrl: string, _index: number) => {
                  // Image click handler
                }}
                onImageDelete={async (_imageUrl: string, index: number) => {
                  const newImages = productData.images?.filter((_, i) => i !== index) || [];
                  onFieldChange('images', newImages);
                }}
                onImagePreview={(_imageUrl: string, index: number) => {
                  setGalleryModal({
                    isOpen: true,
                    images: productData.images || [],
                    initialIndex: index
                  });
                }}
                onImageReplace={async (_imageUrl: string, index: number) => {
                  // Créer un input file pour sélectionner une nouvelle image
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.style.display = 'none';
                  
                  input.addEventListener('click', (e) => {
                    e.stopPropagation();
                  });
                  
                  input.addEventListener('change', async (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) {
                      try {
                        // TODO: Upload du fichier vers Supabase
                        // Simuler l'upload pour le moment
                        const newImageUrl = URL.createObjectURL(file);
                        const newImages = [...(productData.images || [])];
                        newImages[index] = newImageUrl;
                        
                        onFieldChange('images', newImages);
                      } catch (error) {
                        console.error('❌ Error during replacement:', error);
                      }
                    }
                    input.remove();
                  });
                  
                  document.body.append(input);
                  input.click();
                }}
                onImagesReorder={async (_oldIndex: number, _newIndex: number, newImages: string[]) => {
                  onFieldChange('images', newImages);
                }}
              />
            )}

            {/* Zone d'upload d'images */}
            <div className="space-y-4">
              <label className="text-sm font-medium">{t('admin.products.edit.images.add')}</label>
              <ImageUploaderField
                multiple
                disabled={false}
                height="h-32"
                productId={productData.id}
                width="w-full"
                field={{
                  state: {
                    value: productData.images || []
                  },
                  handleChange: (updater) => {
                    const newImages = typeof updater === 'function' 
                      ? updater(productData.images || [])
                      : updater;
                    onFieldChange('images', newImages);
                  }
                }}
                onImagesChange={(images) => {
                  onFieldChange('images', images);
                }}
              />
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className='space-y-6 md:space-y-8'>

        <ProductCardsGrid>
          {contentSections.map((section) => (
            <Card 
              key={section.id} 
              className={`transition-all duration-200 hover:shadow-lg ${
                section.id === 'images' ? 'md:col-span-2' : ''
              }`}
            >
              <CardHeader>
                <CardTitle className='flex items-center gap-3 text-lg'>
                  <div className='p-2 bg-gradient-to-br from-primary/20 to-orange-500/20 rounded-lg border border-primary/20'>
                    <section.icon className='h-5 w-5 text-primary' />
                  </div>
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="!pt-4">
                {section.content}
              </CardContent>
            </Card>
          ))}
        </ProductCardsGrid>
      </div>

      {/* Modal de prévisualisation d'images */}
      {galleryModal.isOpen && (
        <ImageGalleryModal
          showActions
          images={galleryModal.images}
          initialIndex={galleryModal.initialIndex}
          isOpen={galleryModal.isOpen}
          imageBlurMap={blurState.imageBlurMap}
          onClose={() => setGalleryModal(prev => ({ ...prev, isOpen: false }))}
          onImageDelete={async (imageUrl: string, index: number) => {
            const newImages = productData.images?.filter((_: string, i: number) => i !== index) || [];
            onFieldChange('images', newImages);
            setGalleryModal(prev => ({ 
              ...prev, 
              images: newImages,
              initialIndex: index >= newImages.length ? Math.max(0, newImages.length - 1) : index
            }));
            if (newImages.length === 0) {
              setGalleryModal(prev => ({ ...prev, isOpen: false }));
            }
          }}
          onImageReplace={async (imageUrl: string, index: number) => {
            setGalleryModal(prev => ({ ...prev, isOpen: false }));
            // Logique de remplacement ici
          }}
        />
      )}
    </>
  );
};

export { ProductDetailsEditor };
export type { ProductDetailsEditorProps };
