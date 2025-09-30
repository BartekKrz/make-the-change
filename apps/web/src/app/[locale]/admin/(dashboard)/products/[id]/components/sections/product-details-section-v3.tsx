'use client';

import { FileText } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';
import { useFormContext } from '@/app/[locale]/admin/(dashboard)/components/form/create-admin-form';

export function ProductDetailsSection() {
  const t = useTranslations();
  const form = useFormContext();

  // Debug: vérifier que le contexte fonctionne
  if (!form) {
    console.error('[ProductDetailsSection] Form context not found!');
    return <div className="p-4 bg-red-100 text-red-700">❌ Form context manquant</div>;
  }

  return (
    <DetailView.Section icon={FileText} title="Détails du produit">
      <form.AppField name="short_description">
        {(field) => (
          <field.TextAreaField
            label="Description courte"
            placeholder="Une description concise du produit..."
            rows={2}
            maxLength={200}
          />
        )}
      </form.AppField>

      <form.AppField name="description">
        {(field) => (
          <field.TextAreaField
            label="Description détaillée"
            placeholder="Description complète du produit, ses avantages, son origine..."
            rows={6}
            maxLength={2000}
          />
        )}
      </form.AppField>

      {/* Dynamic validation indicator for premium products using Subscribe */}
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

      <form.AppField name="origin_country">
        {(field) => (
          <field.TextField
            label="Pays d'origine"
            placeholder="France"
          />
        )}
      </form.AppField>

      <form.AppField name="seo_title">
        {(field) => (
          <field.TextField
            label="Titre SEO"
            placeholder="Titre optimisé pour les moteurs de recherche"
            maxLength={60}
          />
        )}
      </form.AppField>

      <form.AppField name="seo_description">
        {(field) => (
          <field.TextAreaField
            label="Description SEO"
            placeholder="Description pour les moteurs de recherche"
            rows={3}
            maxLength={160}
          />
        )}
      </form.AppField>
    </DetailView.Section>
  );
}