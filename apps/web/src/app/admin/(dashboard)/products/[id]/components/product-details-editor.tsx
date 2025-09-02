'use client';
import type { FC, PropsWithChildren } from 'react';
import {  DollarSign, Save, ImageIcon, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/admin/(dashboard)/components/ui/card';
import { Button } from '@/app/admin/(dashboard)/components/ui/button';
import { useFormWithToast } from '@/hooks/use-form-with-toast';
import { FormInput, FormSelect, FormTextArea } from '@/components/form';
import {  tierLabels, fulfillmentMethodLabels, type ProductFormData } from '@/lib/validators/product';
import { ImageUploaderField } from '@/components/ImageUploader';
import { ImageMasonry } from '@/components/ImageMasonry/ImageMasonry';

type ProductDetailsEditorProps = {
  productData: ProductFormData & { id: string };
  isEditing: boolean;
  isSaving?: boolean;
  onSave?: (data: ProductFormData) => Promise<void>;
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
  isEditing,
  isSaving = false,
  onSave
}) => {
  const { form, isSubmitting } = useFormWithToast({
    defaultValues: productData,
    onSubmit: async (value: ProductFormData) => {
      console.log('📝 ProductDetailsEditor onSubmit called with:', value);
      console.log('📷 Images in form data:', value.images);
      
      if (onSave) {
        console.log('🚀 Calling onSave with form data...');
        await onSave(value);
        return { success: true };
      }
      return { success: true };
    },
    toasts: {
      success: {
        title: 'Produit mis à jour',
        description: 'Les modifications ont été enregistrées avec succès'
      },
      error: {
        title: 'Erreur',
        description: 'Impossible de mettre à jour le produit'
      }
    }
  });

  const contentSections = [
    {
      id: 'general',
      title: 'Informations générales',
      icon: Info,
      content: (
        <div className='space-y-4'>
          <form.Field name="name">
            {(field) => (
              <FormInput
                field={field}
                label="Nom du produit"
                placeholder="Nom du produit"
                disabled={!isEditing}
                required
              />
            )}
          </form.Field>

          <form.Field name="slug">
            {(field) => (
              <FormInput
                field={field}
                label="Slug"
                placeholder="slug-du-produit"
                disabled={!isEditing}
                required
              />
            )}
          </form.Field>

          <form.Field name="short_description">
            {(field) => (
              <FormTextArea
                field={field}
                label="Description courte"
                placeholder="Description courte du produit..."
                rows={3}
                disabled={!isEditing}
              />
            )}
          </form.Field>

          <form.Field name="description">
            {(field) => (
              <FormTextArea
                field={field}
                label="Description"
                placeholder="Description détaillée du produit..."
                rows={6}
                disabled={!isEditing}
              />
            )}
          </form.Field>
        </div>
      )
    },
    {
      id: 'pricing',
      title: 'Prix & Configuration',
      icon: DollarSign,
      content: (
        <div className='space-y-4'>
          <form.Field name="price_points">
            {(field) => (
              <FormInput
                field={field}
                label="Prix en points"
                type="number"
                placeholder="100"
                disabled={!isEditing}
                required
              />
            )}
          </form.Field>

          <form.Field name="stock_quantity">
            {(field) => (
              <FormInput
                field={field}
                label="Quantité en stock"
                type="number"
                placeholder="0"
                disabled={!isEditing}
              />
            )}
          </form.Field>

          <form.Field name="min_tier">
            {(field) => (
              <FormSelect
                field={field}
                label="Niveau minimum"
                placeholder="Sélectionner un niveau"
                options={tierOptions}
                disabled={!isEditing}
              />
            )}
          </form.Field>

          <form.Field name="fulfillment_method">
            {(field) => (
              <FormSelect
                field={field}
                label="Méthode de livraison"
                placeholder="Sélectionner une méthode"
                options={fulfillmentOptions}
                disabled={!isEditing}
              />
            )}
          </form.Field>
        </div>
      )
    },
    {
      id: 'images',
      title: 'Images',
      icon: ImageIcon,
      content: (
        <div className='space-y-4'>
          <form.Field name="images">
            {(field) => {
              // Debug des données
              console.log('🔍 Field images state:', field.state.value);
              console.log('🔍 ProductData images:', productData.images);
              
              // TOUJOURS utiliser productData.images comme source de vérité
              const images = productData.images || [];
              
              return (
                <div className='space-y-4'>
                  {/* Interface unifiée : galerie + zone d'ajout */}
                  <div className='space-y-3'>
                    {/* Galerie actuelle sans label - TOUJOURS afficher si images existent */}
                    {images && images.length > 0 && (
                      <ImageMasonry 
                        images={images} 
                        className='max-w-2xl'
                        showActions={isEditing}
                        onImageClick={(imageUrl: string, index: number) => {
                          console.log('Image cliquée:', imageUrl, 'index:', index);
                        }}
                        onImageReplace={(imageUrl: string, index: number) => {
                          console.log('Remplacer image:', imageUrl, 'index:', index);
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/*';
                          input.onchange = async (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (file && productData.id) {
                              try {
                                const formData = new FormData();
                                formData.append('file', file);
                                formData.append('productId', productData.id);
                                
                                const response = await fetch('/api/upload/product-images', {
                                  method: 'POST',
                                  body: formData,
                                });
                                
                                if (response.ok) {
                                  const result = await response.json();
                                  const newImages = [...images];
                                  newImages[index] = result.url;
                                  field.handleChange(newImages);
                                }
                              } catch (error) {
                                console.error('Erreur remplacement:', error);
                              }
                            }
                          };
                          input.click();
                        }}
                        onImageDelete={(imageUrl: string, index: number) => {
                          console.log('Supprimer image:', imageUrl, 'index:', index);
                          const newImages = images.filter((_, i) => i !== index);
                          field.handleChange(newImages);
                        }}
                      />
                    )}

                    {/* Zone d'upload intégrée sans label */}
                    <ImageUploaderField
                      field={field}
                      width="w-full"
                      height="h-32"
                      disabled={!isEditing}
                      multiple={true}
                      productId={productData.id}
                      onImagesChange={(newImages) => {
                        console.log('📸 Nouvelles images uploadées:', newImages);
                        field.handleChange(newImages);
                      }}
                    />
                  </div>

                  {/* Bouton pour la gestion avancée */}
                  {images && images.length > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        window.open(`/admin/products/${productData.id}/images`, '_blank');
                      }}
                      className='w-full'
                    >
                      <ImageIcon className='w-4 h-4 mr-2' />
                      Gérer l&apos;ordre et la disposition des images
                    </Button>
                  )}
                </div>
              );
            }}
          </form.Field>
        </div>
      ),
    },
  ];

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    }} className='space-y-6 md:space-y-8'>
      <ProductCardsGrid>
        {contentSections.map((section) => (
          <Card key={section.id} className='transition-all duration-200 hover:shadow-lg'>
            <CardHeader className='pb-4'>
              <CardTitle className='flex items-center gap-3 text-lg'>
                <div className='p-2 bg-gradient-to-br from-primary/20 to-orange-500/20 rounded-lg border border-primary/20'>
                  <section.icon className='h-5 w-5 text-primary' />
                </div>
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent className='pt-0'>
              {section.content}
            </CardContent>
          </Card>
        ))}
      </ProductCardsGrid>

      {isEditing && (
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting || isSaving}
            className="flex items-center gap-2"
          >
            {(isSubmitting || isSaving) ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Sauvegarde...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Sauvegarder
              </>
            )}
          </Button>
        </div>
      )}
    </form>
  );
};

export { ProductDetailsEditor }
export type { ProductDetailsEditorProps }