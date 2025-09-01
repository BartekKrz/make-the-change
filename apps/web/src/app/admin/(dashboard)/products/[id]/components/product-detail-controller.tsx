'use client';

import { useState } from 'react';
import { FC } from 'react';
import { ProductDetailLayout } from '@/app/admin/(dashboard)/products/[id]/components/product-detail-layout';
import { ProductCompactHeader } from '@/app/admin/(dashboard)/products/[id]/components/product-compact-header';
import { ProductDetailsEditor } from '@/app/admin/(dashboard)/products/[id]/components/product-details-editor';
import { ProductBreadcrumbs } from '@/app/admin/(dashboard)/products/[id]/components/product-breadcrumbs';
import type { ProductFormData } from '@/lib/validators/product';

type ProductDetailControllerProps = {
  productData: ProductFormData & { id: string };
  onSave: (patch: Partial<ProductFormData>) => Promise<void>;
  onImageUpload?: (file: File) => Promise<void>;
  onImageRemove?: (url: string) => Promise<void>;
};

export const ProductDetailController: FC<ProductDetailControllerProps> = ({
  productData,
  onSave,
  onImageUpload,
  onImageRemove
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingData, setPendingData] = useState<Partial<ProductFormData>>({});

  const handleEditToggle = (editing: boolean) => {
    if (!editing) {
      setPendingData({});
    }
    setIsEditing(editing);
  };

  const handleDataChange = (data: Partial<ProductFormData>) => {
    setPendingData(prev => ({ ...prev, ...data }));
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const patch: Partial<ProductFormData> = {};
      for (const key of [
        'name','slug','price_points','short_description','description','is_active','featured','stock_quantity','min_tier','category_id','producer_id','fulfillment_method','images'
      ] as const) {
        if (key in pendingData && (productData as any)[key] !== (pendingData as any)[key]) {
          (patch as any)[key] = (pendingData as any)[key];
        }
      }

      if (Object.keys(patch).length > 0) {
        await onSave(patch);
      }

      setIsEditing(false);
      setPendingData({});
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (onImageUpload) {
      try {
        await onImageUpload(file);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const handleImageRemove = async (url: string) => {
    if (onImageRemove) {
      try {
        await onImageRemove(url);
      } catch (error) {
        console.error('Error removing image:', error);
      }
    } else {
      const currentImages = displayData.images || [];
      const newImages = currentImages.filter(img => img !== url);
      handleDataChange({ images: newImages });
    }
  };

  const displayData = { ...productData, ...pendingData };

  return (
    <ProductDetailLayout
      header={
        <>
          <ProductBreadcrumbs productData={productData} />
          <ProductCompactHeader
            productData={displayData}
            isEditing={isEditing}
            onEditToggle={handleEditToggle}
            onSave={handleSave}
            isSaving={isSaving}
          />
        </>
      }
      toolbar={<div />}
      content={
        <ProductDetailsEditor
          productData={displayData}
          isEditing={isEditing}
          isSaving={isSaving}
          onSave={async (data) => {
            const patch: Partial<ProductFormData> = {};
            for (const key of [
              'name','slug','short_description','description','price_points','stock_quantity',
              'category_id','producer_id','min_tier','fulfillment_method','is_active','featured','images'
            ] as const) {
              if ((data as any)[key] !== undefined && (productData as any)[key] !== (data as any)[key]) {
                (patch as any)[key] = (data as any)[key];
              }
            }

            if (Object.keys(patch).length > 0) {
              await onSave(patch);
            }
            setIsEditing(false);
          }}
          onImageUpload={handleImageUpload}
          onImageRemove={handleImageRemove}
        />
      }
    />
  );
};
