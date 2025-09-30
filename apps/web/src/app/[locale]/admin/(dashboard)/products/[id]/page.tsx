'use client';

import { useParams } from 'next/navigation';
import { type FC } from 'react';

import { AdminPageLayout } from '@/app/[locale]/admin/(dashboard)/components/admin-layout';
import { AdminDetailLayout } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-detail-layout';
import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';
import { useEntityErrorHandler } from '@/hooks/use-entity-error-handler';
import { trpc } from '@/lib/trpc';

import { ProductDetailSkeleton } from './components/product-detail-skeleton';
import { ProductEditHeader } from './components/product-edit-header-v3';
import { EssentialInfoSection } from './components/sections/essential-info-section-v3';
import { PricingStatusSection } from './components/sections/pricing-status-section-v3';
import { ProductDetailsSection } from './components/sections/product-details-section-v3';
import { useProductForm } from './hooks/use-product-form-v3';
import { FormDebugger } from './debug-form';
import { formContext } from '@/app/[locale]/admin/(dashboard)/components/form/create-admin-form';

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

  // Debug: voir ce qui est disponible sur form
  console.log('[DEBUG] productForm.form keys:', Object.keys(productForm.form));

  return (
    <AdminPageLayout>
      {/* Provide form context to all children - RECOMMENDED PATTERN */}
      <formContext.Provider value={productForm.form}>
        <form
          onSubmit={e => {
            e.preventDefault();
            e.stopPropagation();
            productForm.form.handleSubmit();
          }}
        >
          <AdminDetailLayout
            headerContent={
              <ProductEditHeader
                hasUnsavedChanges={productForm.hasUnsavedChanges}
                isSaving={productForm.isSaving}
              />
            }
          >
            <DetailView gridCols={2} spacing="md" variant="cards">
              {/* Debug component - Remove in production */}
              <FormDebugger />

              {/*
                All sections now use context instead of props - MUCH cleaner!
                No more prop drilling of form everywhere
              */}
              <EssentialInfoSection />
              <PricingStatusSection />
              <ProductDetailsSection />

              {/* Additional sections can be added here without prop drilling */}
              {/* <ConfigurationSection /> */}
              {/* <MetadataSection /> */}
              {/* <ImagesSection /> */}
            </DetailView>
          </AdminDetailLayout>
        </form>
      </formContext.Provider>
    </AdminPageLayout>
  );
};

export default AdminProductEditPage;
