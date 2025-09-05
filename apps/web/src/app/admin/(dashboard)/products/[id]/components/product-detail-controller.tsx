'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { type FC } from 'react';
import { ProductDetailLayout } from '@/app/admin/(dashboard)/products/[id]/components/product-detail-layout';
import { ProductCompactHeader } from '@/app/admin/(dashboard)/products/[id]/components/product-compact-header';
import { ProductDetailsEditor } from '@/app/admin/(dashboard)/products/[id]/components/product-details-editor';
import { ProductBreadcrumbs } from '@/app/admin/(dashboard)/products/[id]/components/product-breadcrumbs';
import type { ProductFormData } from '@/lib/validators/product';
import type { SaveStatus } from '@/app/admin/(dashboard)/products/[id]/types';

type ProductDetailControllerProps = {
  productData: ProductFormData & { id: string };
  onSave: (patch: Partial<ProductFormData>) => Promise<void>;
};

// Helper function to create debounced save
const createDebouncedSave = (saveFn: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (data: any) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      saveFn(data);
    }, delay);
  };
};

export const ProductDetailController: FC<ProductDetailControllerProps> = ({
  productData,
  onSave
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<Partial<ProductFormData>>({});
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Données actuelles = données originales + modifications en attente
  const currentData = useMemo(() => ({
    ...productData,
    ...pendingChanges
  }), [productData, pendingChanges]);

  // Fonction de sauvegarde intelligente
  const smartSave = useCallback(async (changes: Partial<ProductFormData>, immediate = false) => {
    if (Object.keys(changes).length === 0) return;

    setIsSaving(true);
    setSaveError(null);

    try {
      // Créer le patch en comparant avec les données originales pour ne sauvegarder que ce qui a changé
      const patch: Partial<ProductFormData> = {};
      for (const key in changes) {
        const typedKey = key as keyof ProductFormData;
        if (productData[typedKey] !== changes[typedKey]) {
          (patch as any)[typedKey] = changes[typedKey];
        }
      }

      if (Object.keys(patch).length > 0) {
        await onSave(patch);
        
        // Succès : nettoyer les changements en attente qui viennent d'être sauvegardés
        setPendingChanges(prev => {
          const updated = { ...prev };
          Object.keys(patch).forEach(key => delete (updated as any)[key]);
          return updated;
        });
        
        setLastSaved(new Date());
      }
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Erreur de sauvegarde');
    } finally {
      setIsSaving(false);
    }
  }, [productData, onSave]);

  // Auto-save avec debounce pour les champs texte
  const debouncedSave = useMemo(
    () => createDebouncedSave(smartSave, 3000),
    [smartSave]
  );

  // Gestion des changements de champ
  const handleFieldChange = useCallback((field: keyof ProductFormData, value: any) => {
    setPendingChanges(prev => ({
      ...prev,
      [field]: value
    }));

    // Stratégie de sauvegarde selon le type de champ
    const immediateFields: (keyof ProductFormData)[] = ['is_active', 'featured', 'min_tier', 'fulfillment_method', 'category_id', 'producer_id', 'images'];
    const autoSaveFields: (keyof ProductFormData)[] = ['name', 'slug', 'short_description', 'description', 'price_points', 'stock_quantity'];

    if (immediateFields.includes(field)) {
      // Sauvegarde immédiate pour toggles, selects et images
      smartSave({ [field]: value }, true);
    } else if (autoSaveFields.includes(field)) {
      // Auto-save avec debounce pour les champs texte
      debouncedSave({ [field]: value });
    }
  }, [smartSave, debouncedSave]);

  // Fonction pour sauvegarder manuellement toutes les modifications en attente
  const saveAllPending = useCallback(() => {
    if (Object.keys(pendingChanges).length > 0) {
      smartSave(pendingChanges, true);
    }
  }, [pendingChanges, smartSave]);

  // Indicateur de statut
  const saveStatus = useMemo((): SaveStatus => {
    if (isSaving) return { type: 'saving' as const, message: 'Sauvegarde...' };
    if (saveError) return { type: 'error' as const, message: `Erreur: ${saveError}` };
    if (Object.keys(pendingChanges).length > 0) {
      return { 
        type: 'modified' as const, 
        message: `${Object.keys(pendingChanges).length} modification(s) en attente`,
        count: Object.keys(pendingChanges).length
      };
    }
    if (lastSaved) {
      const timeSince = Math.floor((Date.now() - lastSaved.getTime()) / 1000);
      if (timeSince < 60) {
        return { type: 'saved' as const, message: `Sauvegardé il y a ${timeSince}s` };
      }
    }
    return { type: 'pristine' as const, message: 'Tous les changements sont sauvegardés' };
  }, [isSaving, saveError, pendingChanges, lastSaved]);

  // Fonction pour gérer le changement de statut
  const handleStatusChange = useCallback(async (newStatus: 'active' | 'inactive') => {
    const patch = { is_active: newStatus === 'active' };
    await smartSave(patch, true); // Force immediate save
  }, [smartSave]);

  return (
    <ProductDetailLayout
      header={
        <>
          <ProductBreadcrumbs productData={productData} />
          <ProductCompactHeader
            productData={currentData}
            saveStatus={saveStatus}
            onSaveAll={saveAllPending}
            onStatusChange={handleStatusChange}
          />
        </>
      }
      toolbar={<div />}
      content={
        <ProductDetailsEditor
          productData={currentData}
          onFieldChange={handleFieldChange}
          saveStatus={saveStatus}
          pendingChanges={pendingChanges}
          onSaveAll={saveAllPending}
        />
      }
    />
  );
};