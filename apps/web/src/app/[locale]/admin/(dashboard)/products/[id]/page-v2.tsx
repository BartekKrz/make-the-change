'use client';

import { useParams } from 'next/navigation';
import { type FC } from 'react';

import { AdminPageLayout } from '@/app/[locale]/admin/(dashboard)/components/admin-layout';
import { AdminDetailLayout } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-detail-layout';
import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';
import { useEntityErrorHandler } from '@/hooks/use-entity-error-handler';
import { trpc } from '@/lib/trpc';

import { ProductDetailSkeleton } from './components/product-detail-skeleton';
import { ProductEditHeader } from './components/product-edit-header-v2';
import { EssentialInfoSection } from './components/sections/essential-info-section-v2';
import { PricingStatusSection } from './components/sections/pricing-status-section-v2';
import { ProductDetailsSection } from './components/sections/product-details-section-v2';
import { useProductForm } from './hooks/use-product-form';

const AdminProductEditPage: FC = () => {
  const params = useParams<{ id: string }>();
  const productId = params.id;

  const {
    data: product,
    isPending: isLoadingProduct,
    error,
    isError,
  } = trpc.admin.products.detail_enriched.useQuery({ productId });

  useEntityErrorHandler(error, {
    redirectTo: '/admin/products',
    entityType: 'product',
  });

  const productForm = useProductForm({
    productId,
    initialData: product,
  });

  // Show loading state while either data is loading or form is initializing
  if (isLoadingProduct || isError || productForm.isLoading) {
    return <ProductDetailSkeleton />;
  }

  return (
    <AdminPageLayout>
      <form
        onSubmit={e => {
          e.preventDefault();
          e.stopPropagation();
          productForm.form.handleSubmit();
        }}
      >
        <AdminDetailLayout
          headerContent={<ProductEditHeader productForm={productForm} />}
        >
          <DetailView gridCols={2} spacing="md" variant="cards">
            <EssentialInfoSection productForm={productForm} />
            <PricingStatusSection productForm={productForm} />
            <ProductDetailsSection productForm={productForm} />

            {/* Additional sections can be added here */}
            {/* <ConfigurationSection productForm={productForm} /> */}
            {/* <MetadataSection productForm={productForm} /> */}
            {/* <ImagesSection productForm={productForm} /> */}
          </DetailView>
        </AdminDetailLayout>
      </form>
    </AdminPageLayout>
  );
};

export default AdminProductEditPage;
