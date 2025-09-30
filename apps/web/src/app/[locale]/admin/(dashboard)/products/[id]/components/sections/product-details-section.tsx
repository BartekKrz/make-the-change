'use client';
import { Package } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';
import type { FC } from 'react';
import type { AppFormApi } from '@/components/form';

const WeightField: FC = () => {
  return (
    <input
      type="number"
      min={0}
      placeholder="0"
      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
};

const OriginCountryField: FC = () => {
  return (
    <select className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
      <option value="">Rechercher un pays...</option>
      <option value="france">France</option>
      <option value="madagascar">Madagascar</option>
      <option value="belgique">Belgique</option>
      <option value="luxembourg">Luxembourg</option>
      <option value="espagne">Espagne</option>
      <option value="italie">Italie</option>
      <option value="allemagne">Allemagne</option>
      <option value="pays-bas">Pays-Bas</option>
      <option value="maroc">Maroc</option>
      <option value="tunisie">Tunisie</option>
      <option value="portugal">Portugal</option>
      <option value="suisse">Suisse</option>
    </select>
  );
};

const PartnerSourceField: FC = () => {
  return (
    <select className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
      <option value="">Rechercher un partenaire...</option>
      <option value="habeebee">HABEEBEE</option>
      <option value="ilanga-nature">ILANGA NATURE</option>
      <option value="promiel">PROMIEL</option>
      <option value="producteur-local">Producteur local</option>
      <option value="cooperative">Coopérative agricole</option>
      <option value="artisan-local">Artisan local</option>
      <option value="ferme-bio">Ferme biologique</option>
    </select>
  );
};

const AllergensField: FC = () => {
  return (
    <input
      type="text"
      placeholder="Rechercher des allergènes..."
      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
};

const CertificationsField: FC = () => {
  return (
    <input
      type="text"
      placeholder="Rechercher des certifications..."
      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
};

interface ProductDetailsSectionProps {
  form: AppFormApi;
}

export const ProductDetailsSection: FC<ProductDetailsSectionProps> = ({ form }) => {
  const t = useTranslations();

  return (
    <DetailView.Section icon={Package} span={2} title="Détails produit">
      <DetailView.FieldGroup layout="grid-3">
        <DetailView.Field label={t('admin.products.edit.fields.weight_grams')}>
          <form.Field name="weight_grams">
            <WeightField />
          </form.Field>
        </DetailView.Field>

        <DetailView.Field
          label={t('admin.products.edit.fields.origin_country')}
        >
          <form.Field name="origin_country">
            <OriginCountryField />
          </form.Field>
        </DetailView.Field>

        <DetailView.Field
          label={t('admin.products.edit.fields.partner_source')}
        >
          <form.Field name="partner_source">
            <PartnerSourceField />
          </form.Field>
        </DetailView.Field>
      </DetailView.FieldGroup>

      <DetailView.FieldGroup layout="grid-2">
        <DetailView.Field
          description="Allergènes officiels selon réglementation EU"
          label={t('admin.products.edit.fields.allergens')}
        >
          <form.Field name="allergens">
            <AllergensField />
          </form.Field>
        </DetailView.Field>

        <DetailView.Field
          description="Labels de qualité et certifications officielles"
          label={t('admin.products.edit.fields.certifications')}
        >
          <form.Field name="certifications">
            <CertificationsField />
          </form.Field>
        </DetailView.Field>
      </DetailView.FieldGroup>
    </DetailView.Section>
  );
};
