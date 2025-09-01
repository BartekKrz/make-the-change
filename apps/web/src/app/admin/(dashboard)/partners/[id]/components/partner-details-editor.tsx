'use client';

import type { FC, PropsWithChildren } from 'react';
import { Building2, Mail, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/admin/(dashboard)/components/ui/card';
import { Button } from '@/app/admin/(dashboard)/components/ui/button';
import { useFormWithToast } from '@/hooks/use-form-with-toast';
import { FormInput, FormSelect, FormTextArea } from '@/components/form';
import { partnerFormSchema, partnerStatusLabels, type PartnerFormData } from '@make-the-change/api/validators/partner';
type PartnerDetailsEditorProps = {
  partnerData: PartnerFormData & { id: string };
  isEditing: boolean;
  isSaving?: boolean;
  onSave?: (data: PartnerFormData) => Promise<void>;
};

const PartnerCardsGrid: FC<PropsWithChildren> = ({ children }) => (
  <div className='grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 [&>*]:h-full'>{children}</div>
);

const statusOptions = Object.entries(partnerStatusLabels).map(([value, label]) => ({
  value,
  label
}));

export const PartnerDetailsEditor: FC<PartnerDetailsEditorProps> = ({
  partnerData,
  isEditing,
  isSaving = false,
  onSave,
}) => {
  const { form, isSubmitting } = useFormWithToast({
    defaultValues: partnerData,
    onSubmit: async (value: PartnerFormData) => {
      if (onSave) {
        await onSave(value);
        return { success: true };
      }
      return { success: true };
    },
    toasts: {
      success: {
        title: 'Partenaire mis à jour',
        description: 'Les modifications ont été enregistrées avec succès'
      },
      error: {
        title: 'Erreur',
        description: 'Impossible de mettre à jour le partenaire'
      }
    }
  });

  const contentSections = [
    {
      id: 'general',
      title: 'Informations générales',
      icon: Building2,
      content: (
        <div className='space-y-4'>
          <form.Field name="name">
            {(field) => (
              <FormInput
                field={field}
                label="Nom du partenaire"
                placeholder="Nom du partenaire"
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
                placeholder="slug-du-partenaire"
                disabled={!isEditing}
                required
              />
            )}
          </form.Field>

          <form.Field name="description">
            {(field) => (
              <FormTextArea
                field={field}
                label="Description"
                placeholder="Description du partenaire..."
                rows={6}
                disabled={!isEditing}
              />
            )}
          </form.Field>
        </div>
      )
    },
    {
      id: 'contact',
      title: 'Contact & Statut',
      icon: Mail,
      content: (
        <div className='space-y-4'>
          <form.Field name="contact_email">
            {(field) => (
              <FormInput
                field={field}
                label="Email de contact"
                type="email"
                placeholder="contact@partenaire.com"
                disabled={!isEditing}
                required
              />
            )}
          </form.Field>

          <form.Field name="website">
            {(field) => (
              <FormInput
                field={field}
                label="Site web"
                type="url"
                placeholder="https://partenaire.com"
                disabled={!isEditing}
              />
            )}
          </form.Field>

          <form.Field name="status">
            {(field) => (
              <FormSelect
                field={field}
                label="Statut"
                placeholder="Sélectionner un statut"
                options={statusOptions}
                disabled={!isEditing}
              />
            )}
          </form.Field>
        </div>
      )
    },
  ];

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    }} className='space-y-6 md:space-y-8'>
      <PartnerCardsGrid>
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
      </PartnerCardsGrid>

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
