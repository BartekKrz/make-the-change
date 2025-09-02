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
};

export const ProductDetailController: FC<ProductDetailControllerProps> = ({
  productData,
  onSave
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
    console.log('🔄 ProductDetailController.handleSave() - Début');
    setIsSaving(true);

    try {
      console.log('📊 Données actuelles:', productData);
      console.log('📝 Données en attente:', pendingData);

      const patch: Partial<ProductFormData> = {};
      for (const key of [
        'name','slug','price_points','short_description','description','is_active','featured','stock_quantity','min_tier','category_id','producer_id','fulfillment_method','images'
      ] as const) {
        if (key in pendingData && (productData as any)[key] !== (pendingData as any)[key]) {
          console.log(`🔄 Champ ${key} modifié:`, {
            ancien: (productData as any)[key],
            nouveau: (pendingData as any)[key]
          });
          (patch as any)[key] = (pendingData as any)[key];
        }
      }

      console.log('📦 Patch final:', patch);
      console.log('📊 Taille du patch:', Object.keys(patch).length);

      if (Object.keys(patch).length > 0) {
        console.log('✅ Appel de onSave()...');
        await onSave(patch);
        console.log('✅ onSave() terminé avec succès');
      } else {
        console.log('⚠️ Aucun changement détecté');
      }

      setIsEditing(false);
      setPendingData({});
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde:', error);
      console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    } finally {
      console.log('🔄 ProductDetailController.handleSave() - Fin');
      setIsSaving(false);
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
            console.log('🎯 ProductDetailController onSave called with data:', data);
            console.log('🖼️ Images in data:', data.images);
            console.log('🏭 Original productData.images:', productData.images);
            
            const patch: Partial<ProductFormData> = {};
            for (const key of [
              'name','slug','short_description','description','price_points','stock_quantity',
              'category_id','producer_id','min_tier','fulfillment_method','is_active','featured','images'
            ] as const) {
              if ((data as any)[key] !== undefined && (productData as any)[key] !== (data as any)[key]) {
                console.log(`🔄 Field ${key} changed:`, {
                  from: (productData as any)[key],
                  to: (data as any)[key]
                });
                (patch as any)[key] = (data as any)[key];
              }
            }

            console.log('📦 Final patch to send:', patch);
            
            if (Object.keys(patch).length > 0) {
              console.log('✅ Patch has content, calling onSave...');
              await onSave(patch);
            } else {
              console.log('⚠️ No changes detected, skipping save');
            }
            setIsEditing(false);
          }}
        />
      }
    />
  );
};
