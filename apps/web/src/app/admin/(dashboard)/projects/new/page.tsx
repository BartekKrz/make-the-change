
'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { ArrowLeft, Package, Plus } from 'lucide-react';

import { trpc } from '@/lib/trpc';

import { Card, CardContent, CardHeader, CardTitle } from '@/app/admin/(dashboard)/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/app/admin/(dashboard)/components/badge';
import { useAppForm, FormInput, FormTextArea, FormSelect } from '@/components/form';

import { useToast } from '@/hooks/use-toast';
import { createProject } from '@/app/admin/(dashboard)/projects/actions';
import ImageUpload from '@/components/ui/image-upload';

import type { ProjectFormData } from '@/lib/validators/project';

import {
  defaultProjectValues,
  projectTypeLabels,
  projectStatusLabels
} from '@/lib/validators/project';

const NewProjectPage = () => {
  const router = useRouter();
  const utils = trpc.useUtils();
  const { toast } = useToast();
  const [projectImages, setProjectImages] = useState<string[]>([]);

  const form = useAppForm({
    defaultValues: defaultProjectValues,
    onSubmit: async ({ value }: { value: ProjectFormData }) => {
      try {

        const formData = new FormData();
        Object.entries(value).forEach(([key, val]) => {
          if (val != null) {
            formData.append(key, val.toString());
          }
        });
        
        // Ajouter les images
        if (projectImages.length > 0) {
          formData.append('images', JSON.stringify(projectImages));
        }

        const result = await createProject({ success: false, message: '' }, formData);

        if (result.success) {

          utils.admin.projects.list.invalidate();
          toast({
            variant: 'success',
            title: 'Projet créé',
            description: 'Le projet a été créé avec succès'
          });
          router.push('/admin/projects');
        } else {
          toast({
            variant: 'destructive',
            title: 'Erreur',
            description: result.message || 'Impossible de créer le projet'
          });
        }
      } catch (error: any) {
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: error.message || 'Erreur inattendue'
        });
      }
    }
  });

  return (
    <div className="space-y-6">
      {}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/projects"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux projets
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <Package className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Nouveau projet</h1>
      </div>

      {}
      <form onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Informations principales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form.Field name="name">
                {() => (
                  <FormInput label="Nom du projet" placeholder="Ruche en Provence Bio" required />
                )}
              </form.Field>

              <form.Field name="slug">
                {() => (
                  <FormInput label="Slug (URL)" placeholder="ruche-provence-bio" required description="Utilisé dans l'URL du projet" />
                )}
              </form.Field>

              <form.Field name="type">
                {() => (
                  <FormSelect
                    label="Type de projet"
                    options={Object.entries(projectTypeLabels).map(([value, label]) => ({ value, label }))}
                  />
                )}
              </form.Field>

              <form.Field name="description">
                {() => (
                  <FormInput label="Description courte" placeholder="Projet de ruche collective en Provence" />
                )}
              </form.Field>

              <form.Field name="long_description">
                {() => (
                  <FormTextArea
                    label="Description détaillée"
                    placeholder="Description complète du projet..."
                    rows={5}
                  />
                )}
              </form.Field>
            </CardContent>
          </Card>

          {}
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form.Field name="target_budget">
                {() => (
                  <FormInput
                    label="Budget cible (€)"
                    type="number"
                    min="1"
                    placeholder="5000"
                    required
                  />
                )}
              </form.Field>

              <form.Field name="producer_id">
                {() => (
                  <FormInput label="Producteur ID" placeholder="prod_habeebee" />
                )}
              </form.Field>

              <form.Field name="status">
                {() => (
                  <FormSelect
                    label="Statut"
                    options={Object.entries(projectStatusLabels).map(([value, label]) => ({ value, label }))}
                  />
                )}
              </form.Field>
            </CardContent>
          </Card>
        </div>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Images du projet</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUpload
              entityId="temp-project" // Sera remplacé par l'ID réel après création
              bucket="projects"
              currentImages={projectImages}
              onImagesChange={setProjectImages}
              maxFiles={8}
            />
          </CardContent>
        </Card>

        {}
        <Card>
          <CardHeader>
            <CardTitle>Options</CardTitle>
          </CardHeader>
          <CardContent>
            <form.Field name="featured">
              {(field) => (
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={Boolean(field.state.value)}
                      onChange={(e) => field.handleChange(e.target.checked)}
                      onBlur={field.handleBlur}
                    />
                    <span className="text-sm">Projet vedette</span>
                    <Badge color={field.state.value ? "blue" : "gray"}>
                      {field.state.value ? 'Vedette' : 'Standard'}
                    </Badge>
                  </label>
                </div>
              )}
            </form.Field>
          </CardContent>
        </Card>

        {}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Annuler
          </Button>

          <Button
            type="submit"
            disabled={!form.state.canSubmit || form.state.isSubmitting}
            className="flex items-center gap-2"
          >
            {form.state.isSubmitting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Création...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Créer le projet
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewProjectPage;
