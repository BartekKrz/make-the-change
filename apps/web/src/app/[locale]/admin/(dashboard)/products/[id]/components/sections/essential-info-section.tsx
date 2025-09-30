'use client';
import { Info } from 'lucide-react';
import { useTranslations } from 'next-intl';

// Plus besoin d'importer les composants form TanStack
import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';
import type { AppFormApi } from '@/components/form';

import type { FC } from 'react';


type EssentialInfoSectionProps = {
  form: AppFormApi;
};

export const EssentialInfoSection: FC<EssentialInfoSectionProps> = ({
  form,
}) => {
  console.log('[EssentialInfoSection] Rendering with form:', {
    hasForm: !!form,
    hasField: !!form?.Field,
    formState: form?.state
  });

  const t = useTranslations();

  return (
    <DetailView.Section icon={Info} title="Informations essentielles">
      <DetailView.Field required label={t('admin.products.edit.fields.name')}>
        <form.Field
          name="name"
          listeners={{
            onChange: ({ value }) => {
              // Auto-génération du slug
              if (value) {
                const slug = value
                  .toLowerCase()
                  .replaceAll(/[^\da-z]/g, '-')
                  .replaceAll(/-+/g, '-')
                  .replaceAll(/^-|-$/g, '');
                form.setFieldValue('slug', slug);
              }
            },
          }}
          validators={{
            onChange: ({ value }) =>
              value.length === 0 ? 'Le nom est requis' : undefined,
          }}
        >
          {(field) => (
            <input
              type="text"
              value={field.state.value || ''}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder={t('admin.products.edit.placeholders.name')}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
        </form.Field>
      </DetailView.Field>

      <DetailView.Field required label={t('admin.products.edit.fields.slug')}>
        <form.Field name="slug">
          {(field) => (
            <input
              type="text"
              value={field.state.value || ''}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder={t('admin.products.edit.placeholders.slug')}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          )}
        </form.Field>
      </DetailView.Field>

      <DetailView.Field
        required
        label={t('admin.products.edit.fields.category_id')}
      >
        <form.Field name="category_id">
          {(field) => (
            <select
              value={field.state.value || ''}
              onChange={(e) => field.handleChange(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Rechercher une catégorie...</option>
              <option value="miels">Miels & Apiculture</option>
              <option value="huiles">Huiles & Olives</option>
              <option value="transformes">Produits transformés</option>
              <option value="epices">Épices & Condiments</option>
              <option value="cosmetiques">Cosmétiques naturels</option>
              <option value="artisanat">Artisanat local</option>
              <option value="saisonniers">Produits saisonniers</option>
              <option value="bio">Agriculture biologique</option>
              <option value="equitable">Commerce équitable</option>
              <option value="mer">Produits de la mer</option>
            </select>
          )}
        </form.Field>
      </DetailView.Field>

      <DetailView.Field
        required
        label={t('admin.products.edit.fields.min_tier')}
      >
        <form.Field name="min_tier">
          {(field) => (
            <select
              value={field.state.value || ''}
              onChange={(e) => field.handleChange(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner un niveau...</option>
              <option value="explorateur">{t('admin.products.edit.tiers.explorateur')}</option>
              <option value="protecteur">{t('admin.products.edit.tiers.protecteur')}</option>
              <option value="ambassadeur">{t('admin.products.edit.tiers.ambassadeur')}</option>
            </select>
          )}
        </form.Field>
      </DetailView.Field>
    </DetailView.Section>
  );
};
