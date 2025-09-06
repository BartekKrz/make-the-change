'use client';

import type { FC, PropsWithChildren } from 'react';
import { Save, ImageIcon, Info, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/admin/(dashboard)/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFormWithToast } from '@/hooks/use-form-with-toast';
import { FormInput, FormSelect, FormTextArea } from '@/components/form';
import {  projectTypeLabels, projectStatusLabels, type ProjectFormData } from '@/lib/validators/project';

type ProjectDetailsEditorProps = {
  projectData: ProjectFormData & { id: string };
  isEditing: boolean;
  isSaving?: boolean;
  onSave?: (data: ProjectFormData) => Promise<void>;
  onImageUpload?: (file: File) => void;
  onImageRemove?: (url: string) => void;
};

const ProjectCardsGrid: FC<PropsWithChildren> = ({ children }) => (
  <div className='grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 [&>*]:h-full'>{children}</div>
);

const typeOptions = Object.entries(projectTypeLabels).map(([value, label]) => ({
  value,
  label
}));

const statusOptions = Object.entries(projectStatusLabels).map(([value, label]) => ({
  value,
  label
}));

const ProjectDetailsEditor: React.FC<ProjectDetailsEditorProps> = ({
  projectData,
  isEditing,
  isSaving = false,
  onSave,
  onImageUpload,
  onImageRemove
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
        description: 'Les modifications ont été enregistrées avec succès'
      },
      error: {
        title: 'Erreur',
        description: 'Impossible de mettre à jour le projet'
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
                label="Nom du projet"
                placeholder="Nom du projet"
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
                placeholder="slug-du-projet"
                disabled={!isEditing}
                required
              />
            )}
          </form.Field>

          <form.Field name="type">
            {(field) => (
              <FormSelect
                field={field}
                label="Type de projet"
                placeholder="Sélectionner un type"
                options={typeOptions}
                disabled={!isEditing}
                required
              />
            )}
          </form.Field>

          <form.Field name="description">
            {(field) => (
              <FormTextArea
                field={field}
                label="Description courte"
                placeholder="Description courte du projet..."
                rows={3}
                disabled={!isEditing}
              />
            )}
          </form.Field>

          <form.Field name="long_description">
            {(field) => (
              <FormTextArea
                field={field}
                label="Description détaillée"
                placeholder="Description détaillée du projet..."
                rows={6}
                disabled={!isEditing}
              />
            )}
          </form.Field>
        </div>
      )
    },
    {
      id: 'funding',
      title: 'Financement & Configuration',
      icon: DollarSign,
      content: (
        <div className='space-y-4'>
          <form.Field name="target_budget">
            {(field) => (
              <FormInput
                field={field}
                label="Budget cible (€)"
                type="number"
                placeholder="1000"
                disabled={!isEditing}
                required
              />
            )}
          </form.Field>

          <form.Field name="producer_id">
            {(field) => (
              <FormInput
                field={field}
                label="ID Producteur"
                placeholder="ID du producteur"
                disabled={!isEditing}
                required
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
            Gestionnaire d&apos;images du projet
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
      <ProjectCardsGrid>
        {contentSections.map((section) => (
          <Card key={section.id} className='transition-all duration-200 hover:shadow-lg'>
            <CardHeader>
              <CardTitle className='flex items-center gap-3 text-lg'>
                <div className='p-2 bg-gradient-to-br from-primary/20 to-orange-500/20 rounded-lg border border-primary/20'>
                  <section.icon className='h-5 w-5 text-primary' />
                </div>
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {section.content}
            </CardContent>
          </Card>
        ))}
      </ProjectCardsGrid>

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

export { ProjectDetailsEditor }
export type { ProjectDetailsEditorProps }