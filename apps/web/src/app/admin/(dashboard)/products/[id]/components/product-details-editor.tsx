import { SimpleInput, SimpleTextArea, SimpleSelect } from "./simple-form-components";
import { ImageGalleryModal } from "@/components/ImageGallery";
import { ImageMasonry } from "@/components/ImageMasonry";
import { ImageUploaderField } from "@/components/ImageUploader";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ProductFormData, tierLabels, fulfillmentMethodLabels } from "@/lib/validators/product";
import { Info, DollarSign, ImageIcon, Clock, CheckCircle, AlertCircle, Save } from "lucide-react";
import { FC, PropsWithChildren, useState, useEffect } from "react";
import type { SaveStatus } from "@/app/admin/(dashboard)/products/[id]/types";

type ProductDetailsEditorProps = {
  productData: ProductFormData & { id: string };
  onFieldChange: (field: string, value: any) => void;
  saveStatus?: SaveStatus;
  pendingChanges: Partial<ProductFormData>;
  onSaveAll?: () => void;
};

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
  onFieldChange,
  pendingChanges
}) => {
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


  const contentSections = [
    {
      id: 'general',
      title: 'Informations générales',
      icon: Info,
      content: (
        <div className='space-y-4'>
          <div>
            <SimpleInput
              label="Nom du produit"
              placeholder="Nom du produit"
              value={productData.name}
              onChange={(value) => onFieldChange('name', value)}
              required
            />
          </div>

          <div>
            <SimpleInput
              label="Slug"
              placeholder="slug-du-produit"
              value={productData.slug}
              onChange={(value) => onFieldChange('slug', value)}
              required
            />
          </div>

          <div>
            <SimpleTextArea
              label="Description courte"
              placeholder="Description courte du produit..."
              rows={3}
              value={productData.short_description || ''}
              onChange={(value) => onFieldChange('short_description', value)}
            />
          </div>

          <div>
            <SimpleTextArea
              label="Description"
              placeholder="Description détaillée du produit..."
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
      title: 'Prix & Configuration',
      icon: DollarSign,
      content: (
        <div className='space-y-4'>
          <div>
            <SimpleInput
              label="Prix en points"
              type="number"
              placeholder="100"
              value={productData.price_points?.toString() || ''}
              onChange={(value) => onFieldChange('price_points', parseInt(value) || 0)}
              required
            />
          </div>

          <div>
            <SimpleInput
              label="Quantité en stock"
              type="number"
              placeholder="0"
              value={productData.stock_quantity?.toString() || ''}
              onChange={(value) => onFieldChange('stock_quantity', parseInt(value) || 0)}
            />
          </div>

          <div>
            <SimpleSelect
              label="Niveau minimum"
              placeholder="Sélectionner un niveau"
              options={tierOptions}
              value={productData.min_tier}
              onChange={(value) => onFieldChange('min_tier', value)}
            />
          </div>

          <div>
            <SimpleSelect
              label="Méthode de livraison"
              placeholder="Sélectionner une méthode"
              options={fulfillmentOptions}
              value={productData.fulfillment_method}
              onChange={(value) => onFieldChange('fulfillment_method', value)}
            />
          </div>
        </div>
      )
    },
    {
      id: 'images',
      title: 'Images',
      icon: ImageIcon,
      content: (
        <div className='w-full space-y-6'>
          <div className='w-full space-y-6'>
            {/* Galerie actuelle */}
            {productData.images && productData.images.length > 0 && (
              <ImageMasonry 
                images={productData.images} 
                blurHashes={productData.blur_hashes || []}
                className='w-full'
                showActions={true}
                enableReorder={true}
                onImageClick={(imageUrl: string, index: number) => {
                  console.log('Image cliquée:', imageUrl, 'index:', index);
                }}
                onImagePreview={(imageUrl: string, index: number) => {
                  console.log('🖼️ [DEBUG] Prévisualisation image déclenchée:', imageUrl, 'index:', index);
                  console.log('🖼️ [DEBUG] GalleryModal state avant:', galleryModal);
                  setGalleryModal({
                    isOpen: true,
                    images: productData.images || [],
                    initialIndex: index
                  });
                  console.log('🖼️ [DEBUG] GalleryModal state après setGalleryModal appelé');
                }}
                onImagesReorder={async (oldIndex: number, newIndex: number, newImages: string[]) => {
                  console.log('🔄 Réorganisation images:', { oldIndex, newIndex });
                  onFieldChange('images', newImages);
                }}
                onImageReplace={async (imageUrl: string, index: number) => {
                  console.log('🔄 [DEBUG] Remplacement image déclenchée:', imageUrl, 'index:', index);
                  
                  // Créer un input file pour sélectionner une nouvelle image
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.style.display = 'none';
                  
                  input.addEventListener('click', (e) => {
                    console.log('🔄 [DEBUG] Input file cliqué');
                    e.stopPropagation();
                  });
                  
                  input.onchange = async (e) => {
                    console.log('🔄 [DEBUG] Fichier sélectionné');
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) {
                      try {
                        // TODO: Upload du fichier vers Supabase
                        console.log('📷 Fichier sélectionné pour remplacement:', file.name);
                        
                        // Simuler l'upload pour le moment
                        const newImageUrl = URL.createObjectURL(file);
                        const newImages = [...(productData.images || [])];
                        newImages[index] = newImageUrl;
                        
                        onFieldChange('images', newImages);
                      } catch (error) {
                        console.error('❌ Erreur lors du remplacement:', error);
                      }
                    }
                    document.body.removeChild(input);
                  };
                  
                  document.body.appendChild(input);
                  console.log('🔄 [DEBUG] Input ajouté au DOM, déclenchement du clic...');
                  input.click();
                }}
                onImageDelete={async (imageUrl: string, index: number) => {
                  console.log('🗑️ [DEBUG] Suppression image déclenchée:', imageUrl, 'index:', index);
                  console.log('🗑️ [DEBUG] Images avant suppression:', productData.images);
                  const newImages = productData.images?.filter((_, i) => i !== index) || [];
                  console.log('🗑️ [DEBUG] Images après suppression:', newImages);
                  onFieldChange('images', newImages);
                  console.log('🗑️ [DEBUG] onFieldChange appelé avec:', newImages);
                }}
              />
            )}

            {/* Zone d'upload d'images */}
            <div className="space-y-4">
              <label className="text-sm font-medium">Ajouter des images</label>
              <ImageUploaderField
                field={{
                  state: {
                    value: productData.images || []
                  },
                  handleChange: (updater) => {
                    const newImages = typeof updater === 'function' 
                      ? updater(productData.images || [])
                      : updater;
                    console.log('🔄 [DEBUG] ImageUploaderField handleChange appelé avec:', newImages);
                    console.log('🔄 [DEBUG] Images actuelles avant mise à jour:', productData.images);
                    console.log('🔄 [DEBUG] Appel de onFieldChange("images", newImages)');
                    onFieldChange('images', newImages);
                  }
                }}
                onImagesChange={(images) => {
                  console.log('📷 [DEBUG] onImagesChange appelé avec:', images);
                  console.log('📷 [DEBUG] Déclenchement de onFieldChange("images", images)');
                  onFieldChange('images', images);
                }}
                multiple={true}
                productId={productData.id}
                disabled={false}
                width="w-full"
                height="h-32"
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
          images={galleryModal.images}
          initialIndex={galleryModal.initialIndex}
          isOpen={galleryModal.isOpen}
          onClose={() => setGalleryModal(prev => ({ ...prev, isOpen: false }))}
          showActions={true}
          onImageReplace={async (imageUrl: string, index: number) => {
            console.log('🔄 Remplacer image depuis modal:', imageUrl, 'index:', index);
            setGalleryModal(prev => ({ ...prev, isOpen: false }));
            // Logique de remplacement ici
          }}
          onImageDelete={async (imageUrl: string, index: number) => {
            console.log('🗑️ Supprimer image depuis modal:', imageUrl, 'index:', index);
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
        />
      )}
    </>
  );
};

export { ProductDetailsEditor };
export type { ProductDetailsEditorProps };