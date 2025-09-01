'use client';

import type { FC, PropsWithChildren } from 'react';
import {  DollarSign, Save, ImageIcon, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/admin/(dashboard)/components/ui/card';
import { Button } from '@/app/admin/(dashboard)/components/ui/button';
import { useFormWithToast } from '@/hooks/use-form-with-toast';
import { FormInput, FormSelect, FormTextArea } from '@/components/form';
import {  tierLabels, fulfillmentMethodLabels, type ProductFormData } from '@/lib/validators/product';

type ProductDetailsEditorProps = {
  productData: ProductFormData & { id: string };
  isEditing: boolean;
  isSaving?: boolean;
  onSave?: (data: ProductFormData) => Promise<void>;
  onImageUpload?: (file: File) => void;
  onImageRemove?: (url: string) => void;
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
  onSave,
  onImageUpload,
  onImageRemove
}) => {
  const { form, isSubmitting } = useFormWithToast({
    defaultValues: productData,
    onSubmit: async (value: ProductFormData) => {
      if (onSave) {
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
          {isEditing && onImageUpload && (
            <div>
              <label className='block text-sm font-medium mb-2'>Ajouter des images</label>
              <input
                type='file'
                accept='image/*'
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || [])
                  files.forEach(file => onImageUpload(file))
                }}
                className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
              />
            </div>
          )}
          <p className='text-sm text-muted-foreground'>
            Gestionnaire d&apos;images du produit
          </p>
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