'use client';

import { FileText } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';
import { TextField, TextAreaField } from '@/app/[locale]/admin/(dashboard)/components/form/fields';
import type { UseProductFormReturn } from '../../hooks/use-product-form';
import type { ProductFormData } from '../../types/product-form.types';

type ProductDetailsSectionProps = {
  productForm: UseProductFormReturn;
};

export function ProductDetailsSection({ productForm }: ProductDetailsSectionProps) {
  const t = useTranslations();
  const { form } = productForm;

  return (
    <DetailView.Section icon={FileText} title="Détails du produit">
      <TextAreaField<ProductFormData, 'short_description'>
        name="short_description"
        form={form}
        label="Description courte"
        placeholder="Une description concise du produit..."
        rows={2}
        maxLength={200}
      />

      <TextAreaField<ProductFormData, 'description'>
        name="description"
        form={form}
        label="Description détaillée"
        placeholder="Description complète du produit, ses avantages, son origine..."
        rows={6}
        maxLength={2000}
      />

      {/* Dynamic validation indicator for premium products */}
      <form.Subscribe
        selector={(state) => ({
          pricePoints: state.values.price_points,
          hasDescription: !!state.values.description?.trim()
        })}
      >
        {({ pricePoints, hasDescription }) => (
          pricePoints > 1000 && !hasDescription && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
              <p className="text-sm text-amber-800">
                ℹ️ Une description détaillée est requise pour les produits premium (&gt;1000 points)
              </p>
            </div>
          )
        )}
      </form.Subscribe>

      <TextField<ProductFormData, 'origin_country'>
        name="origin_country"
        form={form}
        label="Pays d'origine"
        placeholder="France"
      />

      <TextField<ProductFormData, 'seo_title'>
        name="seo_title"
        form={form}
        label="Titre SEO"
        placeholder="Titre optimisé pour les moteurs de recherche"
        maxLength={60}
      />

      <TextAreaField<ProductFormData, 'seo_description'>
        name="seo_description"
        form={form}
        label="Description SEO"
        placeholder="Description pour les moteurs de recherche"
        rows={3}
        maxLength={160}
      />
    </DetailView.Section>
  );
}