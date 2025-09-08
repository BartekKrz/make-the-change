'use client';
import { type FC } from 'react'

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Building2, Save } from 'lucide-react';
import { useFormWithToast } from '@/hooks/use-form-with-toast';
import { trpc } from '@/lib/trpc';
import {
  partnerFormSchema,
  defaultPartnerValues,
  partnerStatusLabels,
  type PartnerFormData
} from '@make-the-change/api/validators/partner';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/[locale]/admin/(dashboard)/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormInput, FormSelect, FormTextArea } from '@/components/form';
import { generateSlug } from '@/lib/form-utils';

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
        <Link href="/admin/partners" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Retour aux partenaires
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <Building2 className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Nouveau partenaire</h1>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-6"
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
                  {(field) => <FormInput field={field} label="Nom du partenaire" placeholder="Ex: Les Ruchers du Vexin" required />}
                </form.Field>
                <form.Field name="slug">
                  {(field) => <FormInput field={field} label="Slug" placeholder="ex-les-ruchers-du-vexin" required />}
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
                  {(field) => <FormInput field={field} label="Email de contact" type="email" placeholder="contact@partenaire.com" required />}
                </form.Field>
                <form.Field name="website">
                  {(field) => <FormInput field={field} label="Site web" type="url" placeholder="https://partenaire.com" />}
                </form.Field>
                <form.Field name="status">
                  {(field) => <FormSelect field={field} label="Statut" options={statusOptions} />}
                </form.Field>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>Annuler</Button>
          <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
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
