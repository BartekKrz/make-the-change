'use client';

import { DollarSign } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';
import { useFormContext } from '@/app/[locale]/admin/(dashboard)/components/form/create-admin-form';

export function PricingStatusSection() {
  const t = useTranslations();
  const form = useFormContext();

  // Debug: vérifier que le contexte fonctionne
  if (!form) {
    console.error('[PricingStatusSection] Form context not found!');
    return <div className="p-4 bg-red-100 text-red-700">❌ Form context manquant</div>;
  }

  const fulfillmentOptions = [
    { value: 'stock', label: 'Stock physique' },
    { value: 'dropship', label: 'Dropshipping' },
    { value: 'ondemand', label: 'Sur commande' },
  ];

  return (
    <DetailView.Section icon={DollarSign} title="Prix et statut">
      <form.AppField name="price_points">
        {(field) => (
          <field.NumberField
            label="Prix en points"
            placeholder="100"
            min={1}
            max={50000}
            step={1}
            suffix="pts"
            required
          />
        )}
      </form.AppField>

      <form.AppField name="price_eur_equivalent">
        {(field) => (
          <field.NumberField
            label="Équivalent EUR (optionnel)"
            placeholder="0.00"
            min={0}
            step={0.01}
            prefix="€"
          />
        )}
      </form.AppField>

      <form.AppField name="fulfillment_method">
        {(field) => (
          <field.SelectField
            label="Méthode de livraison"
            options={fulfillmentOptions}
            required
          />
        )}
      </form.AppField>

      {/* Conditional stock field using form.Subscribe */}
      <form.Subscribe
        selector={(state) => state.values.fulfillment_method}
      >
        {(fulfillmentMethod) => (
          fulfillmentMethod === 'stock' && (
            <form.AppField name="stock_quantity">
              {(field) => (
                <field.NumberField
                  label="Quantité en stock"
                  placeholder="0"
                  min={0}
                  max={10000}
                  step={1}
                  suffix="unités"
                />
              )}
            </form.AppField>
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