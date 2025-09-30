'use client';

import { Save, ImageIcon, Info, DollarSign } from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/[locale]/admin/(dashboard)/components/ui/card';
import { FormInput, FormSelect, FormTextArea } from '@/components/form';
import { Button } from '@/components/ui/button';
import { useFormWithToast } from '@/hooks/use-form-with-toast';
import {
  projectTypeLabels,
  projectStatusLabels,
  type ProjectFormData,
} from '@/lib/validators/project';

import type { FC, PropsWithChildren } from 'react';

type ProjectDetailsEditorProps = {
  projectData: ProjectFormData & { id: string };
  isEditing: boolean;
  isSaving?: boolean;
  onSave?: (data: ProjectFormData) => Promise<void>;
  onImageUpload?: (file: File) => void;
  onImageRemove?: (url: string) => void;
};

const ProjectCardsGrid: FC<PropsWithChildren> = ({ children }) => (
  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8 [&>*]:h-full">
    {children}
  </div>
);

const typeOptions = Object.entries(projectTypeLabels).map(([value, label]) => ({
  value,
  label,
}));

const statusOptions = Object.entries(projectStatusLabels).map(
  ([value, label]) => ({
    value,
    label,
  })
);

const ProjectDetailsEditor: React.FC<ProjectDetailsEditorProps> = ({
  projectData,
  isEditing,
  isSaving = false,
  onSave,
  onImageUpload,
  onImageRemove,
}) => {
  const { form, isSubmitting } = useFormWithToast({
    defaultValues: projectData,
    onSubmit: async (value: ProjectFormData) => {
      if (onSave) {
        await onSave(value);
        return { success: true };
      }
      return { success: true };
    },
    toasts: {
      success: {
        title: 'Projet mis à jour',
        description: 'Les modifications ont été enregistrées avec succès',
      },
      error: {
        title: 'Erreur',
        description: 'Impossible de mettre à jour le projet',
      },
    },
  });

  const contentSections = [
    {
      id: 'general',
      title: 'Informations générales',
      icon: Info,
      content: (
        <div className="space-y-4">
          <form.Field name="name">
            {field => (
              <FormInput
                required
                disabled={!isEditing}
                field={field}
                label="Nom du projet"
                placeholder="Nom du projet"
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
                placeholder="slug-du-projet"
              />
            )}
          </form.Field>

          <form.Field name="type">
            {field => (
              <FormSelect
                required
                disabled={!isEditing}
                field={field}
                label="Type de projet"
                options={typeOptions}
                placeholder="Sélectionner un type"
              />
            )}
          </form.Field>

          <form.Field name="description">
            {field => (
              <FormTextArea
                disabled={!isEditing}
                field={field}
                label="Description courte"
                placeholder="Description courte du projet..."
                rows={3}
              />
            )}
          </form.Field>

          <form.Field name="long_description">
            {field => (
              <FormTextArea
                disabled={!isEditing}
                field={field}
                label="Description détaillée"
                placeholder="Description détaillée du projet..."
                rows={6}
              />
            )}
          </form.Field>
        </div>
      ),
    },
    {
      id: 'funding',
      title: 'Financement & Configuration',
      icon: DollarSign,
      content: (
        <div className="space-y-4">
          <form.Field name="target_budget">
            {field => (
              <FormInput
                required
                disabled={!isEditing}
                field={field}
                label="Budget cible (€)"
                placeholder="1000"
                type="number"
              />
            )}
          </form.Field>

          <form.Field name="producer_id">
            {field => (
              <FormInput
                required
                disabled={!isEditing}
                field={field}
                label="ID Producteur"
                placeholder="ID du producteur"
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
    {
      id: 'images',
      title: 'Images',
      icon: ImageIcon,
      content: (
        <div className="space-y-4">
          {isEditing && onImageUpload && (
            <div>
              <label className="mb-2 block text-sm font-medium">
                Ajouter des images
              </label>
              <input
                multiple
                accept="image/*"
                className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                type="file"
                onChange={e => {
                  const files = [...(e.target.files || [])];
                  for (const file of files) onImageUpload(file);
                }}
              />
            </div>
          )}
          <p className="text-muted-foreground text-sm">
            Gestionnaire d&apos;images du projet
          </p>
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
      <ProjectCardsGrid>
        {contentSections.map(section => (
          <Card
            key={section.id}
            className="transition-all duration-200 hover:shadow-lg"
          >
            <CardHeader>
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
      </ProjectCardsGrid>

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

export { ProjectDetailsEditor };
export type { ProjectDetailsEditorProps };
