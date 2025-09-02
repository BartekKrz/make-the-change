import { FormTextArea, FormSelect, FormInput } from "@/components/form";
import { ImageGalleryModal } from "@/components/ImageGallery";
import { ImageMasonry } from "@/components/ImageMasonry";
import { ImageUploaderField } from "@/components/ImageUploader";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useFormWithToast } from "@/hooks/use-form-with-toast";
import { ProductFormData, tierLabels, fulfillmentMethodLabels } from "@/lib/validators/product";
import { Info, DollarSign, ImageIcon, Save } from "lucide-react";
import { FC, PropsWithChildren, useState } from "react";

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
      console.log('� ProductDetailsEditor onSubmit called with:', value);
      console.log('🚨 Calling stack trace:', new Error().stack);
      console.log('📷 Images in form data:', value.images);
      
      if (onSave) {
        console.log('🚀 Calling onSave with form data...');
        
        // Détecter s'il y a des changements réels (plus précis que JSON.stringify)
        const hasChanges = Object.keys(value).some(key => {
          const currentValue = (value as any)[key];
          const originalValue = (productData as any)[key];
          
          // Comparaison spéciale pour les arrays (comme images)
          if (Array.isArray(currentValue) && Array.isArray(originalValue)) {
            return JSON.stringify(currentValue.sort()) !== JSON.stringify(originalValue.sort());
          }
          
          return currentValue !== originalValue;
        });
        
        if (hasChanges) {
          console.log('✅ Changes detected, proceeding with save and showing toast');
          await onSave(value);
          return { success: true };
        } else {
          console.log('⚠️ No changes detected in onSubmit, not showing toast');
          return { success: false }; // Ne pas afficher le toast s'il n'y a pas de changements
        }
      }
      return { success: false }; // Pas de onSave, pas de toast
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
        <div className='w-full space-y-6'>
          <form.Field name="images">
            {(field) => {
              // Debug des données
              console.log('🔍 Field images state:', field.state.value);
              console.log('🔍 ProductData images:', productData.images);
              
              // Utiliser field.state.value comme source de vérité pour l'affichage
              // Initialiser avec productData.images si le field est vide
              const images = field.state.value && field.state.value.length >= 0 
                ? field.state.value 
                : productData.images || [];
              
              // Synchroniser le field avec productData au premier rendu si nécessaire
              if ((!field.state.value || field.state.value.length === 0) && 
                  productData.images && productData.images.length > 0) {
                console.log('🔄 Initialisation du field avec productData');
                field.handleChange(productData.images);
              }
              
              return (
                <div className='w-full space-y-6'>
                  {/* Interface unifiée : galerie + zone d'ajout */}
                  <div className='w-full space-y-6'>
                    {/* Galerie actuelle - TOUJOURS afficher si images existent */}
                    {images && images.length > 0 && (
                      <ImageMasonry 
                        images={images} 
                        className='w-full'
                        showActions={isEditing}
                        enableReorder={isEditing}
                        onImageClick={(imageUrl: string, index: number) => {
                          console.log('Image cliquée:', imageUrl, 'index:', index);
                        }}
                        onImagePreview={(imageUrl: string, index: number) => {
                          console.log('🖼️ Prévisualisation image:', imageUrl, 'index:', index);
                          setGalleryModal({
                            isOpen: true,
                            images: images,
                            initialIndex: index
                          });
                        }}
                        onImagesReorder={async (oldIndex: number, newIndex: number, newImages: string[]) => {
                          console.log('🔄 Début réorganisation:', { oldIndex, newIndex });
                          
                          // Sauvegarder l'état original pour le rollback
                          const originalImages = [...images];
                          
                          // 🚀 OPTIMISTIC UPDATE : Réorganiser immédiatement dans l'UI
                          console.log('⚡ Optimistic update - nouvelles images:', newImages);
                          field.handleChange(newImages);
                          
                          if (productData.id) {
                            try {
                              // Appeler l'API PATCH pour la réorganisation
                              const response = await fetch('/api/upload/product-images', {
                                method: 'PATCH',
                                headers: {
                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                  productId: productData.id,
                                  images: newImages,
                                }),
                              });
                              
                              if (response.ok) {
                                const result = await response.json();
                                console.log('✅ Reorder successful, API confirmed:', result.images);
                                
                                // Synchroniser avec les données retournées par l'API si différentes
                                if (result.images && JSON.stringify(result.images) !== JSON.stringify(newImages)) {
                                  console.log('🔄 Synchronisation avec API');
                                  field.handleChange(result.images);
                                }
                              } else {
                                // 🔄 ROLLBACK : Restaurer l'ordre original si l'API échoue
                                console.error('❌ Reorder API failed, rolling back to:', originalImages);
                                field.handleChange(originalImages);
                              }
                            } catch (error) {
                              console.error('💥 Erreur réorganisation:', error);
                              // 🔄 ROLLBACK : Restaurer l'ordre original si erreur réseau
                              console.log('🔄 Network error, rolling back to:', originalImages);
                              field.handleChange(originalImages);
                            }
                          }
                        }}
                        onImageReplace={async (imageUrl: string, index: number) => {
                          console.log('� Remplacement image:', imageUrl, 'index:', index);
                          
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/*';
                          
                          // Empêcher la soumission du formulaire quand l'input est créé
                          input.addEventListener('click', (e) => {
                            e.stopPropagation();
                          });
                          
                          // Attacher l'input au body (en dehors du formulaire) pour éviter la soumission
                          input.style.display = 'none';
                          document.body.appendChild(input);
                          input.onchange = async (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (file && productData.id) {
                              // 🚀 OPTIMISTIC UPDATE : Afficher l'image temporairement
                              const tempImageUrl = URL.createObjectURL(file);
                              const optimisticImages = [...images];
                              optimisticImages[index] = tempImageUrl;
                              field.handleChange(optimisticImages);
                              
                              try {
                                const formData = new FormData();
                                formData.append('file', file);
                                formData.append('productId', productData.id);
                                formData.append('oldImageUrl', imageUrl);
                                formData.append('imageIndex', index.toString());
                                
                                const response = await fetch('/api/upload/product-images', {
                                  method: 'PUT',
                                  body: formData,
                                });
                                
                                if (response.ok) {
                                  const result = await response.json();
                                  console.log('✅ Replace successful, final URL:', result.images);
                                  
                                  // Nettoyer l'URL temporaire
                                  URL.revokeObjectURL(tempImageUrl);
                                  
                                  // Utiliser les images mises à jour retournées par l'API
                                  if (result.images) {
                                    field.handleChange(result.images);
                                  }
                                  
                                  // Nettoyer l'input du DOM
                                  document.body.removeChild(input);
                                } else {
                                  // 🔄 ROLLBACK : Restaurer l'image originale si l'API échoue
                                  console.error('❌ Replace API failed, rolling back');
                                  URL.revokeObjectURL(tempImageUrl);
                                  field.handleChange(images); // Restaurer l'état original
                                  
                                  // Nettoyer l'input du DOM
                                  document.body.removeChild(input);
                                }
                              } catch (error) {
                                console.error('💥 Erreur remplacement:', error);
                                // 🔄 ROLLBACK : Restaurer l'image originale si erreur
                                URL.revokeObjectURL(tempImageUrl);
                                field.handleChange(images); // Restaurer l'état original
                              } finally {
                                // Nettoyer l'input du DOM
                                document.body.removeChild(input);
                              }
                            }
                          };
                          
                          input.click();
                        }}
                        onImageDelete={async (imageUrl: string, index: number) => {
                          console.log('🚀 Début suppression:', imageUrl, 'index:', index);
                          console.log('📊 Images avant suppression:', images);
                          
                          // Sauvegarder l'état original pour le rollback
                          const originalImages = [...images];
                          
                          // 🚀 OPTIMISTIC UPDATE : Supprimer immédiatement de l'UI
                          const newImages = images.filter((_, i) => i !== index);
                          console.log('⚡ Optimistic update - nouvelles images:', newImages);
                          field.handleChange(newImages);
                          
                          if (productData.id) {
                            try {
                              // Extraire le path du fichier depuis l'URL
                              let filePath = '';
                              if (imageUrl.includes('supabase.co/storage')) {
                                filePath = imageUrl.split('/storage/v1/object/public/products/')[1];
                              }
                              
                              // Utiliser l'API DELETE améliorée
                              const deleteUrl = new URL('/api/upload/product-images', window.location.origin);
                              deleteUrl.searchParams.set('path', filePath);
                              deleteUrl.searchParams.set('productId', productData.id);
                              deleteUrl.searchParams.set('imageUrl', imageUrl);
                              
                              const response = await fetch(deleteUrl.toString(), {
                                method: 'DELETE',
                              });
                              
                              if (response.ok) {
                                const result = await response.json();
                                console.log('✅ Delete successful, API confirmed:', result.images);
                                
                                // Synchroniser avec les données retournées par l'API si différentes
                                if (result.images && JSON.stringify(result.images) !== JSON.stringify(newImages)) {
                                  console.log('🔄 Synchronisation avec API');
                                  field.handleChange(result.images);
                                }
                              } else {
                                // 🔄 ROLLBACK : Restaurer l'image si l'API échoue
                                console.error('❌ Delete API failed, rolling back to:', originalImages);
                                field.handleChange(originalImages);
                              }
                            } catch (error) {
                              console.error('💥 Erreur suppression:', error);
                              // 🔄 ROLLBACK : Restaurer l'image si erreur réseau
                              console.log('🔄 Network error, rolling back to:', originalImages);
                              field.handleChange(originalImages);
                            }
                          }
                        }}
                      />
                    )}

                    {/* Zone d'upload intégrée sans label */}
                    <ImageUploaderField
                      field={field}
                      width="w-full"
                      height="h-48"
                      disabled={!isEditing}
                      multiple={true}
                      productId={productData.id}
                      onImagesChange={(newImages) => {
                        console.log('📸 Nouvelles images uploadées depuis API:', newImages);
                        console.log('🔄 Galerie devrait se mettre à jour automatiquement');
                        // Le field est déjà mis à jour par ImageUploaderField
                        // Pas besoin de double appel à field.handleChange
                      }}
                    />
                  </div>
                </div>
              );
            }}
          </form.Field>
        </div>
      ),
    },
  ];

  return (
    <>
    <form onSubmit={(e) => {
      console.log('🎯 Form onSubmit event triggered', e);
      console.log('🎯 Event target:', e.target);
      console.log('🎯 Event currentTarget:', e.currentTarget);
      e.preventDefault();
      e.stopPropagation();
      console.log('🎯 About to call form.handleSubmit()');
      form.handleSubmit();
    }} className='space-y-6 md:space-y-8'>
      <ProductCardsGrid>
        {contentSections.map((section) => (
          <Card 
            key={section.id} 
            className={`transition-all duration-200 hover:shadow-lg ${
              section.id === 'images' ? 'md:col-span-2' : ''
            }`}
          >
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

    {/* Modal de prévisualisation d'images */}
    {galleryModal.isOpen && (
      <ImageGalleryModal
        images={galleryModal.images}
        initialIndex={galleryModal.initialIndex}
        isOpen={galleryModal.isOpen}
        onClose={() => setGalleryModal(prev => ({ ...prev, isOpen: false }))}
        showActions={isEditing}
        onImageReplace={async (imageUrl: string, index: number) => {
          console.log('🔄 Remplacer image depuis modal:', imageUrl, 'index:', index);
          
          // Fermer le modal d'abord
          setGalleryModal(prev => ({ ...prev, isOpen: false }));
          
          // Déclencher l'input file
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = 'image/*';
          
          // Empêcher la soumission du formulaire quand l'input est créé
          input.addEventListener('click', (e) => {
            e.stopPropagation();
          });
          
          // Attacher l'input au body (en dehors du formulaire) pour éviter la soumission
          input.style.display = 'none';
          document.body.appendChild(input);
          input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file && productData.id) {
              // Accéder aux images actuelles depuis le form
              const currentImages = form.getFieldValue('images') || [];
              
              // 🚀 OPTIMISTIC UPDATE : Afficher l'image temporairement
              const tempImageUrl = URL.createObjectURL(file);
              const optimisticImages = [...currentImages];
              optimisticImages[index] = tempImageUrl;
              form.setFieldValue('images', optimisticImages);
              
              try {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('productId', productData.id);
                formData.append('oldImageUrl', imageUrl);
                formData.append('imageIndex', index.toString());
                
                const response = await fetch('/api/upload/product-images', {
                  method: 'PUT',
                  body: formData,
                });
                
                if (response.ok) {
                  const result = await response.json();
                  console.log('✅ Replace successful from modal, final URL:', result.images);
                  
                  // Nettoyer l'URL temporaire
                  URL.revokeObjectURL(tempImageUrl);
                  
                  // Utiliser les images mises à jour retournées par l'API
                  if (result.images) {
                    form.setFieldValue('images', result.images);
                  }
                  
                  // Nettoyer l'input du DOM
                  document.body.removeChild(input);
                } else {
                  // 🔄 ROLLBACK : Restaurer l'image originale si l'API échoue
                  console.error('❌ Replace API failed from modal, rolling back');
                  URL.revokeObjectURL(tempImageUrl);
                  form.setFieldValue('images', currentImages);
                  
                  // Nettoyer l'input du DOM
                  document.body.removeChild(input);
                }
              } catch (error) {
                console.error('💥 Erreur remplacement depuis modal:', error);
                // 🔄 ROLLBACK : Restaurer l'image originale si erreur
                URL.revokeObjectURL(tempImageUrl);
                form.setFieldValue('images', currentImages);
                
                // Nettoyer l'input du DOM
                document.body.removeChild(input);
              }
            }
          };
          input.click();
        }}
        onImageDelete={async (imageUrl: string, index: number) => {
          console.log('🗑️ Supprimer image depuis modal:', imageUrl, 'index:', index);
          
          // Accéder aux images actuelles depuis le form
          const currentImages = form.getFieldValue('images') || [];
          console.log('📊 Images avant suppression depuis modal:', currentImages);
          
          // Sauvegarder l'état original pour le rollback
          const originalImages = [...currentImages];
          
          // 🚀 OPTIMISTIC UPDATE : Supprimer immédiatement de l'UI
          const newImages = currentImages.filter((_: string, i: number) => i !== index);
          console.log('⚡ Optimistic update depuis modal - nouvelles images:', newImages);
          form.setFieldValue('images', newImages);
          
          // Mettre à jour le modal avec les nouvelles images
          setGalleryModal(prev => ({ 
            ...prev, 
            images: newImages,
            // Ajuster l'index si nécessaire
            initialIndex: index >= newImages.length ? Math.max(0, newImages.length - 1) : index
          }));
          
          if (productData.id) {
            try {
              // Extraire le path du fichier depuis l'URL
              let filePath = '';
              if (imageUrl.includes('supabase.co/storage')) {
                filePath = imageUrl.split('/storage/v1/object/public/products/')[1];
              }
              
              // Utiliser l'API DELETE améliorée
              const deleteUrl = new URL('/api/upload/product-images', window.location.origin);
              deleteUrl.searchParams.set('path', filePath);
              deleteUrl.searchParams.set('productId', productData.id);
              deleteUrl.searchParams.set('imageUrl', imageUrl);
              
              const response = await fetch(deleteUrl.toString(), {
                method: 'DELETE',
              });
              
              if (response.ok) {
                const result = await response.json();
                console.log('✅ Delete successful from modal, API confirmed:', result.images);
                
                // Synchroniser avec les données retournées par l'API si différentes
                if (result.images && JSON.stringify(result.images) !== JSON.stringify(newImages)) {
                  console.log('🔄 Synchronisation avec API depuis modal');
                  form.setFieldValue('images', result.images);
                  setGalleryModal(prev => ({ ...prev, images: result.images }));
                }
                
                // Si plus d'images, fermer le modal
                if (result.images.length === 0) {
                  setGalleryModal(prev => ({ ...prev, isOpen: false }));
                }
              } else {
                // 🔄 ROLLBACK : Restaurer l'image si l'API échoue
                console.error('❌ Delete API failed from modal, rolling back to:', originalImages);
                form.setFieldValue('images', originalImages);
                setGalleryModal(prev => ({ ...prev, images: originalImages }));
              }
            } catch (error) {
              console.error('💥 Erreur suppression depuis modal:', error);
              // 🔄 ROLLBACK : Restaurer l'image si erreur réseau
              console.log('🔄 Network error from modal, rolling back to:', originalImages);
              form.setFieldValue('images', originalImages);
              setGalleryModal(prev => ({ ...prev, images: originalImages }));
            }
          }
        }}
      />
    )}
    </>
  );
};

export { ProductDetailsEditor }
export type { ProductDetailsEditorProps }