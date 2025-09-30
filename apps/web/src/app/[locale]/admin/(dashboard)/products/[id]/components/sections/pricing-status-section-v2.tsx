'use client';

import { DollarSign } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';
import { NumberField, SelectField } from '@/app/[locale]/admin/(dashboard)/components/form/fields';
import type { UseProductFormReturn } from '../../hooks/use-product-form';
import type { ProductFormData } from '../../types/product-form.types';

type PricingStatusSectionProps = {
  productForm: UseProductFormReturn;
};

export function PricingStatusSection({ productForm }: PricingStatusSectionProps) {
  const t = useTranslations();
  const { form } = productForm;

  const fulfillmentOptions = [
    { value: 'stock', label: 'Stock physique' },
    { value: 'dropship', label: 'Dropshipping' },
    { value: 'ondemand', label: 'Sur commande' },
  ];

  return (
    <DetailView.Section icon={DollarSign} title="Prix et statut">
      <NumberField<ProductFormData, 'price_points'>
        name="price_points"
        form={form}
        label="Prix en points"
        placeholder="100"
        min={1}
        max={50000}
        step={1}
        suffix="pts"
        required
      />

      <NumberField<ProductFormData, 'price_eur_equivalent'>
        name="price_eur_equivalent"
        form={form}
        label="Équivalent EUR (optionnel)"
        placeholder="0.00"
        min={0}
        step={0.01}
        prefix="€"
      />

      <SelectField<ProductFormData, 'fulfillment_method'>
        name="fulfillment_method"
        form={form}
        label="Méthode de livraison"
        options={fulfillmentOptions}
        required
      />

      {/* Conditional stock field based on fulfillment method */}
      <form.Subscribe
        selector={(state) => state.values.fulfillment_method}
      >
        {(fulfillmentMethod) => (
          fulfillmentMethod === 'stock' && (
            <NumberField<ProductFormData, 'stock_quantity'>
              name="stock_quantity"
              form={form}
              label="Quantité en stock"
              placeholder="0"
              min={0}
              max={10000}
              step={1}
              suffix="unités"
            />
          )
        )}
      </form.Subscribe>

      <div className="grid grid-cols-2 gap-4">
        <form.Field name="is_active">
          {(field) => (
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={field.state.value || false}
                onChange={(e) => field.handleChange(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Produit actif</span>
            </label>
          )}
        </form.Field>

        <form.Field name="featured">
          {(field) => (
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={field.state.value || false}
                onChange={(e) => field.handleChange(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Produit mis en avant</span>
            </label>
          )}
        </form.Field>
      </div>
    </DetailView.Section>
  );
}