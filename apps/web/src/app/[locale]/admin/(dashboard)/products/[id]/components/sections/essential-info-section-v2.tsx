'use client';

import { Info } from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
  TextField,
  SelectField,
} from '@/app/[locale]/admin/(dashboard)/components/form/fields';
import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';

import type { UseProductFormReturn } from '../../hooks/use-product-form';
import type { ProductFormData } from '../../types/product-form.types';

type EssentialInfoSectionProps = {
  productForm: UseProductFormReturn;
};

export function EssentialInfoSection({
  productForm,
}: EssentialInfoSectionProps) {
  const t = useTranslations();
  const { form } = productForm;

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
      <TextField<ProductFormData, 'name'>
        required
        form={form}
        label={t('admin.products.edit.fields.name')}
        name="name"
        placeholder={t('admin.products.edit.placeholders.name')}
        onValueChange={value => {
          // Auto-génération du slug
          if (value) {
            const slug = value
              .toLowerCase()
              .replaceAll(/[^\da-z]/g, '-')
              .replaceAll(/-+/g, '-')
              .replaceAll(/^-|-$/g, '');

            // Use TanStack Form's linked field feature
            form.setFieldValue('slug', slug);
          }
        }}
      />

      <TextField<ProductFormData, 'slug'>
        required
        className="font-mono"
        form={form}
        label={t('admin.products.edit.fields.slug')}
        name="slug"
        placeholder={t('admin.products.edit.placeholders.slug')}
      />

      <SelectField<ProductFormData, 'category_id'>
        required
        form={form}
        label={t('admin.products.edit.fields.category_id')}
        name="category_id"
        options={categoryOptions}
        placeholder="Rechercher une catégorie..."
      />

      <SelectField<ProductFormData, 'min_tier'>
        required
        form={form}
        label={t('admin.products.edit.fields.min_tier')}
        name="min_tier"
        options={tierOptions}
        placeholder="Sélectionner un niveau..."
      />
    </DetailView.Section>
  );
}
