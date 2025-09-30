'use client';
import { DollarSign } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';
import type { FC } from 'react';
import type { AppFormApi } from '@/components/form';

interface PricingStatusSectionProps {
  form: AppFormApi;
}

export const PricingStatusSection: FC<PricingStatusSectionProps> = ({ form }) => {
  const t = useTranslations();

  return (
    <DetailView.Section icon={DollarSign} title="Prix & Statuts">
      <DetailView.FieldGroup layout="grid-2">
        <DetailView.Field
          required
          label={t('admin.products.edit.fields.price_points')}
        >
          <form.Field name="price_points">
            {(field) => (
              <input
                type="number"
                min={0}
                value={field.state.value || ''}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                placeholder="100"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </form.Field>
        </DetailView.Field>

        <DetailView.Field
          label={t('admin.products.edit.fields.price_eur_equivalent')}
        >
          <form.Field name="price_eur_equivalent">
            {(field) => (
              <input
                type="number"
                min={0}
                step={0.01}
                value={field.state.value || ''}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                placeholder="0.00"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </form.Field>
        </DetailView.Field>
      </DetailView.FieldGroup>

      <DetailView.FieldGroup label="Visibilité" layout="row">
        <DetailView.Field label={t('admin.products.edit.fields.is_active')}>
          <form.Field name="is_active">
            {(field) => (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={field.state.value || false}
                  onChange={(e) => field.handleChange(e.target.checked)}
                  className="rounded"
                />
                <label>{t('admin.products.edit.status.active')}</label>
              </div>
            )}
          </form.Field>
        </DetailView.Field>

        <DetailView.Field label={t('admin.products.edit.fields.featured')}>
          <form.Field name="featured">
            {(field) => (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={field.state.value || false}
                  onChange={(e) => field.handleChange(e.target.checked)}
                  className="rounded"
                />
                <label>{t('admin.products.edit.status.featured')}</label>
              </div>
            )}
          </form.Field>
        </DetailView.Field>

        <DetailView.Field
          label={t('admin.products.edit.fields.is_hero_product')}
        >
          <form.Field name="is_hero_product">
            {(field) => (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={field.state.value || false}
                  onChange={(e) => field.handleChange(e.target.checked)}
                  className="rounded"
                />
                <label>{t('admin.products.edit.status.hero')}</label>
              </div>
            )}
          </form.Field>
        </DetailView.Field>
      </DetailView.FieldGroup>
    </DetailView.Section>
  );
};

