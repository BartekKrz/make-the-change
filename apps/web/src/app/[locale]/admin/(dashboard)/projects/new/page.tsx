
'use client';

import { ArrowLeft, Package, Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


import { Badge } from '@/app/[locale]/admin/(dashboard)/components/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/[locale]/admin/(dashboard)/components/ui/card';
import { createProject } from '@/app/[locale]/admin/(dashboard)/projects/actions';
import { useAppForm, FormInput, FormTextArea, FormSelect } from '@/components/form';
import { Button } from '@/components/ui/button';
import ImageUpload from '@/components/ui/image-upload';
import { useToast } from '@/hooks/use-toast';
import { trpc } from '@/lib/trpc';
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
        for (const [key, val] of Object.entries(value)) {
          if (val != null) {
            formData.append(key, val.toString());
          }
        }
        
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
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          href="/admin/projects"
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
      <form className="space-y-6" onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}>
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
                  <FormInput required label="Nom du projet" placeholder="Ruche en Provence Bio" />
                )}
              </form.Field>

              <form.Field name="slug">
                {() => (
                  <FormInput required description="Utilisé dans l'URL du projet" label="Slug (URL)" placeholder="ruche-provence-bio" />
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
                    required
                    label="Budget cible (€)"
                    min="1"
                    placeholder="5000"
                    type="number"
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
              bucket="projects"
              currentImages={projectImages}
              entityId="temp-project" // Sera remplacé par l'ID réel après création
              maxFiles={8}
              onImagesChange={setProjectImages}
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
                      checked={Boolean(field.state.value)}
                      type="checkbox"
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.checked)}
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
            className="flex items-center gap-2"
            disabled={!form.state.canSubmit || form.state.isSubmitting}
            type="submit"
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
