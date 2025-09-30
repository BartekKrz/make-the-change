'use client';

import { Info } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useFormContext } from '@/app/[locale]/admin/(dashboard)/components/form/create-admin-form';
import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';

export function EssentialInfoSection() {
  const t = useTranslations();
  const form = useFormContext(); // Use context instead of props

  // Debug: vérifier que le contexte fonctionne
  if (!form) {
    console.error('[EssentialInfoSection] Form context not found!');
    return <div className="p-4 bg-red-100 text-red-700">❌ Form context manquant</div>;
  }

  const categoryOptions = [
    { value: 'miels', label: 'Miels & Apiculture' },
    { value: 'huiles', label: 'Huiles & Olives' },
    { value: 'transformes', label: 'Produits transformés' },
    { value: 'epices', label: 'Épices & Condiments' },
    { value: 'cosmetiques', label: 'Cosmétiques naturels' },
    { value: 'artisanat', label: 'Artisanat local' },
    { value: 'saisonniers', label: 'Produits saisonniers' },
    { value: 'bio', label: 'Agriculture biologique' },
    { value: 'equitable', label: 'Commerce équitable' },
    { value: 'mer', label: 'Produits de la mer' },
  ];

  const tierOptions = [
    { value: 'explorateur', label: t('admin.products.edit.tiers.explorateur') },
    { value: 'protecteur', label: t('admin.products.edit.tiers.protecteur') },
    { value: 'ambassadeur', label: t('admin.products.edit.tiers.ambassadeur') },
  ];

  return (
    <DetailView.Section icon={Info} title="Informations essentielles">
      <form.AppField name="name">
        {field => (
          <field.TextField
            required
            label={t('admin.products.edit.fields.name')}
            placeholder={t('admin.products.edit.placeholders.name')}
            onValueChange={value => {
              // Auto-génération du slug avec listeners (TanStack Form pattern)
              if (value) {
                const slug = value
                  .toLowerCase()
                  .replaceAll(/[^\da-z]/g, '-')
                  .replaceAll(/-+/g, '-')
                  .replaceAll(/^-|-$/g, '');

                form.setFieldValue('slug', slug);
              }
            }}
          />
        )}
      </form.AppField>

      <form.AppField name="slug">
        {field => (
          <field.TextField
            required
            className="font-mono"
            label={t('admin.products.edit.fields.slug')}
            placeholder={t('admin.products.edit.placeholders.slug')}
          />
        )}
      </form.AppField>

      <form.AppField name="category_id">
        {field => (
          <field.SelectField
            required
            label={t('admin.products.edit.fields.category_id')}
            options={categoryOptions}
            placeholder="Rechercher une catégorie..."
          />
        )}
      </form.AppField>

      <form.AppField name="min_tier">
        {field => (
          <field.SelectField
            required
            label={t('admin.products.edit.fields.min_tier')}
            options={tierOptions}
            placeholder="Sélectionner un niveau..."
          />
        )}
      </form.AppField>

      {/* Hidden field for producer_id - temporary fix for validation */}
      <form.AppField name="producer_id">
        {field => (
          <input
            type="hidden"
            value={field.state.value || ''}
            onChange={(e) => field.handleChange(e.target.value)}
          />
        )}
      </form.AppField>
    </DetailView.Section>
  );
}
