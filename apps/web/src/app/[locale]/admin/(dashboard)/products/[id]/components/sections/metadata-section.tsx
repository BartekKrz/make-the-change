'use client';
import { Info } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';
import type { FC } from 'react';
import type { AppFormApi } from '@/components/form';

interface MetadataSectionProps {
  form: AppFormApi;
}

export const MetadataSection: FC<MetadataSectionProps> = ({ form }) => {
  const t = useTranslations();

  return (
    <DetailView.Section icon={Info} span={2} title="Métadonnées">
      <DetailView.FieldGroup layout="grid-2">
        <DetailView.Field
          label={t('admin.products.edit.fields.secondary_category_id')}
        >
          <form.Field name="secondary_category_id">
            <SecondaryCategoryField />
          </form.Field>
        </DetailView.Field>

        <DetailView.Field
          description="Recherchez ou créez des tags"
          label={t('admin.products.edit.fields.tags')}
        >
          <form.Field name="tags">
            <TagsField />
          </form.Field>
        </DetailView.Field>
      </DetailView.FieldGroup>

      <DetailView.FieldGroup layout="grid-2">
        <DetailView.Field label={t('admin.products.edit.fields.launch_date')}>
          <form.Field name="launch_date">
            <LaunchDateField />
          </form.Field>
        </DetailView.Field>

        <DetailView.Field
          label={t('admin.products.edit.fields.discontinue_date')}
        >
          <form.Field name="discontinue_date">
            <DiscontinueDateField />
          </form.Field>
        </DetailView.Field>
      </DetailView.FieldGroup>

      <DetailView.FieldGroup layout="grid-2">
        <DetailView.Field
          description="Max 60 caractères"
          label={t('admin.products.edit.fields.seo_title')}
        >
          <form.Field name="seo_title">
            <SeoTitleField />
          </form.Field>
        </DetailView.Field>

        <DetailView.Field
          description="Max 160 caractères"
          label={t('admin.products.edit.fields.seo_description')}
        >
          <form.Field name="seo_description">
            <SeoDescriptionField />
          </form.Field>
        </DetailView.Field>
      </DetailView.FieldGroup>
    </DetailView.Section>
  );
};

const SecondaryCategoryField: FC = () => {
  return (
    <select className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
      <option value="">Rechercher une catégorie secondaire...</option>
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
  );
};

const TagsField: FC = () => {
  return (
    <input
      type="text"
      placeholder="Rechercher des tags..."
      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
};

const LaunchDateField: FC = () => {
  return (
    <input
      type="date"
      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
};

const DiscontinueDateField: FC = () => {
  return (
    <input
      type="date"
      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
};

const SeoTitleField: FC = () => {
  const t = useTranslations();
  return (
    <input
      type="text"
      maxLength={60}
      placeholder={t('admin.products.edit.placeholders.seo_title')}
      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
};

const SeoDescriptionField: FC = () => {
  const t = useTranslations();
  return (
    <textarea
      maxLength={160}
      placeholder={t('admin.products.edit.placeholders.seo_description')}
      rows={2}
      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
};
