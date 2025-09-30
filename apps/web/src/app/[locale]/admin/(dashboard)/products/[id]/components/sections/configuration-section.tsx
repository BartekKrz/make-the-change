'use client';
import { Package } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';
import type { FC } from 'react';
import type { AppFormApi } from '@/components/form';

interface ConfigurationSectionProps {
  form: AppFormApi;
}

export const ConfigurationSection: FC<ConfigurationSectionProps> = ({ form }) => {
  const t = useTranslations();

  return (
    <DetailView.Section icon={Package} title="Configuration">
      <DetailView.FieldGroup layout="grid-2">
        <DetailView.Field
          label={t('admin.products.edit.fields.fulfillment_method')}
        >
          <form.Field name="fulfillment_method">
            <FulfillmentMethodField />
          </form.Field>
        </DetailView.Field>

        <DetailView.Field
          label={t('admin.products.edit.fields.stock_quantity')}
        >
          <form.Field name="stock_quantity">
            <StockQuantityField />
          </form.Field>
        </DetailView.Field>
      </DetailView.FieldGroup>

      <DetailView.Field
        label={t('admin.products.edit.fields.short_description')}
      >
        <form.Field name="short_description">
          <ShortDescriptionField />
        </form.Field>
      </DetailView.Field>

      <DetailView.Field label={t('admin.products.edit.fields.description')}>
        <form.Field name="description">
          <DescriptionField />
        </form.Field>
      </DetailView.Field>
    </DetailView.Section>
  );
};

const FulfillmentMethodField: FC = () => {
  return (
    <select className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
      <option value="">Rechercher une méthode...</option>
      <option value="stock">Stock</option>
      <option value="dropship">Dropshipping</option>
      <option value="ondemand">Sur commande</option>
    </select>
  );
};

const StockQuantityField: FC = () => {
  return (
    <input
      type="number"
      min={0}
      placeholder="0"
      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
};

const ShortDescriptionField: FC = () => {
  const t = useTranslations();
  return (
    <textarea
      placeholder={t('admin.products.edit.placeholders.short_description')}
      rows={2}
      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
};

const DescriptionField: FC = () => {
  const t = useTranslations();
  return (
    <textarea
      placeholder={t('admin.products.edit.placeholders.description')}
      rows={4}
      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
};
