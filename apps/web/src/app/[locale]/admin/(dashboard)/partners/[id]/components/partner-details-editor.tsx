'use client';

import {
  partnerStatusLabels,
  type PartnerFormData,
} from '@make-the-change/api/validators/partner';
import { Building2, Mail, Save } from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/[locale]/admin/(dashboard)/components/ui/card';
import { FormInput, FormSelect, FormTextArea } from '@/components/form';
import { Button } from '@/components/ui/button';
import { useFormWithToast } from '@/hooks/use-form-with-toast';

import type { FC, PropsWithChildren } from 'react';

type PartnerDetailsEditorProps = {
  partnerData: PartnerFormData & { id: string };
  isEditing: boolean;
  isSaving?: boolean;
  onSave?: (data: PartnerFormData) => Promise<void>;
};

const PartnerCardsGrid: FC<PropsWithChildren> = ({ children }) => (
  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8 [&>*]:h-full">
    {children}
  </div>
);

const statusOptions = Object.entries(partnerStatusLabels).map(
  ([value, label]) => ({
    value,
    label,
  })
);

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
        description: 'Les modifications ont été enregistrées avec succès',
      },
      error: {
        title: 'Erreur',
        description: 'Impossible de mettre à jour le partenaire',
      },
    },
  });

  const contentSections = [
    {
      id: 'general',
      title: 'Informations générales',
      icon: Building2,
      content: (
        <div className="space-y-4">
          <form.Field name="name">
            {field => (
              <FormInput
                required
                disabled={!isEditing}
                field={field}
                label="Nom du partenaire"
                placeholder="Nom du partenaire"
              />
            )}
          </form.Field>

          <form.Field name="slug">
            {field => (
              <FormInput
                required
                disabled={!isEditing}
                field={field}
                label="Slug"
                placeholder="slug-du-partenaire"
              />
            )}
          </form.Field>

          <form.Field name="description">
            {field => (
              <FormTextArea
                disabled={!isEditing}
                field={field}
                label="Description"
                placeholder="Description du partenaire..."
                rows={6}
              />
            )}
          </form.Field>
        </div>
      ),
    },
    {
      id: 'contact',
      title: 'Contact & Statut',
      icon: Mail,
      content: (
        <div className="space-y-4">
          <form.Field name="contact_email">
            {field => (
              <FormInput
                required
                disabled={!isEditing}
                field={field}
                label="Email de contact"
                placeholder="contact@partenaire.com"
                type="email"
              />
            )}
          </form.Field>

          <form.Field name="website">
            {field => (
              <FormInput
                disabled={!isEditing}
                field={field}
                label="Site web"
                placeholder="https://partenaire.com"
                type="url"
              />
            )}
          </form.Field>

          <form.Field name="status">
            {field => (
              <FormSelect
                disabled={!isEditing}
                field={field}
                label="Statut"
                options={statusOptions}
                placeholder="Sélectionner un statut"
              />
            )}
          </form.Field>
        </div>
      ),
    },
  ];

  return (
    <form
      className="space-y-6 md:space-y-8"
      onSubmit={e => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <PartnerCardsGrid>
        {contentSections.map(section => (
          <Card
            key={section.id}
            className="transition-all duration-200 hover:shadow-lg"
          >
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="from-primary/20 border-primary/20 rounded-lg border bg-gradient-to-br to-orange-500/20 p-2">
                  <section.icon className="text-primary h-5 w-5" />
                </div>
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>{section.content}</CardContent>
          </Card>
        ))}
      </PartnerCardsGrid>

      {isEditing && (
        <div className="flex justify-end">
          <Button
            className="flex items-center gap-2"
            disabled={isSubmitting || isSaving}
            type="submit"
          >
            {isSubmitting || isSaving ? (
              <>
                <div className="border-primary-foreground h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
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
