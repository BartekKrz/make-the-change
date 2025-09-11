'use client';

import {
  partnerFormSchema,
  defaultPartnerValues,
  partnerStatusLabels,
  type PartnerFormData
} from '@make-the-change/api/validators/partner';
import { ArrowLeft, Building2, Save } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type FC } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/app/[locale]/admin/(dashboard)/components/ui/card';
import { FormInput, FormSelect, FormTextArea } from '@/components/form';
import { Button } from '@/components/ui/button';
import { useFormWithToast } from '@/hooks/use-form-with-toast';
import { generateSlug } from '@/lib/form-utils';
import { trpc } from '@/lib/trpc';

const statusOptions = Object.entries(partnerStatusLabels).map(([value, label]) => ({ value, label }));

const NewPartnerPage: FC = () => {
  const router = useRouter();
  const utils = trpc.useUtils();

  const createPartner = trpc.admin.partners.create.useMutation({
    onSuccess: (data) => {
      utils.admin.partners.list.invalidate();
      router.push(`/admin/partners/${data.id}`);
    },
  });

  const { form, isSubmitting } = useFormWithToast({
    defaultValues: defaultPartnerValues,
    schema: partnerFormSchema,
    onSubmit: async (value: PartnerFormData) => {
      await createPartner.mutateAsync(value);
      return { success: true };
    },
    toasts: {
      success: { title: 'Partenaire créé', description: 'Le nouveau partenaire a été ajouté avec succès.' },
      error: { title: 'Erreur de création', description: 'Impossible de créer le partenaire.' },
    },
  });

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center gap-4">
        <Link className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors" href="/admin/partners">
          <ArrowLeft className="h-4 w-4" />
          Retour aux partenaires
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <Building2 className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Nouveau partenaire</h1>
      </div>

      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader><CardTitle>Informations principales</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <form.Field
                  name="name"
                  onChange={(value) => {
                    if (!form.state.fieldMeta.slug.isDirty) {
                      form.setFieldValue('slug', generateSlug(value as string));
                    }
                    return value;
                  }}
                >
                  {(field) => <FormInput required field={field} label="Nom du partenaire" placeholder="Ex: Les Ruchers du Vexin" />}
                </form.Field>
                <form.Field name="slug">
                  {(field) => <FormInput required field={field} label="Slug" placeholder="ex-les-ruchers-du-vexin" />}
                </form.Field>
                <form.Field name="description">
                  {(field) => <FormTextArea field={field} label="Description" placeholder="Description du partenaire..." rows={5} />}
                </form.Field>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Contact & Statut</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <form.Field name="contact_email">
                  {(field) => <FormInput required field={field} label="Email de contact" placeholder="contact@partenaire.com" type="email" />}
                </form.Field>
                <form.Field name="website">
                  {(field) => <FormInput field={field} label="Site web" placeholder="https://partenaire.com" type="url" />}
                </form.Field>
                <form.Field name="status">
                  {(field) => <FormSelect field={field} label="Statut" options={statusOptions} />}
                </form.Field>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button disabled={isSubmitting} type="button" variant="outline" onClick={() => router.back()}>Annuler</Button>
          <Button className="flex items-center gap-2" disabled={isSubmitting} type="submit">
            {isSubmitting ? (
              <><div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />Création...</>
            ) : (
              <><Save className="h-4 w-4" />Créer le partenaire</>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default NewPartnerPage
