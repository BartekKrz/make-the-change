'use client';

import { useReducer, useCallback, useMemo } from 'react';
import { type FC } from 'react';

import { ProductBreadcrumbs } from '@/app/[locale]/admin/(dashboard)/products/[id]/components/product-breadcrumbs';
import { ProductCompactHeader } from '@/app/[locale]/admin/(dashboard)/products/[id]/components/product-compact-header';
import { ProductDetailLayout } from '@/app/[locale]/admin/(dashboard)/products/[id]/components/product-detail-layout';
import { ProductDetailsEditor } from '@/app/[locale]/admin/(dashboard)/products/[id]/components/product-details-editor';
import type { SaveStatus } from '@/app/[locale]/admin/(dashboard)/products/[id]/types';
import type { ProductFormData } from '@/lib/validators/product';

type ProductDetailControllerProps = {
  productData: ProductFormData & { id: string };
  onSave: (patch: Partial<ProductFormData>) => Promise<void>;
};

type FormState = {
  pendingChanges: Partial<ProductFormData>;
  isSaving: boolean;
  saveError: string | null;
  lastSaved: Date | null;
};

type FormAction = 
  | { type: 'FIELD_CHANGE'; field: keyof ProductFormData; value: unknown }
  | { type: 'SAVE_START' }
  | { type: 'SAVE_SUCCESS'; savedFields: string[] }
  | { type: 'SAVE_ERROR'; error: string }
  | { type: 'CLEAR_ERROR' };

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'FIELD_CHANGE': {
      return {
        ...state,
        pendingChanges: {
          ...state.pendingChanges,
          [action.field]: action.value
        },
        saveError: null
      };
    }
    
    case 'SAVE_START': {
      return {
        ...state,
        isSaving: true,
        saveError: null
      };
    }
    
    case 'SAVE_SUCCESS': {
      const updatedChanges = { ...state.pendingChanges };
      for (const field of action.savedFields) {
        if (field in updatedChanges) {
          delete updatedChanges[field as keyof Partial<ProductFormData>];
        }
      }
      return {
        ...state,
        isSaving: false,
        pendingChanges: updatedChanges,
        lastSaved: new Date(),
        saveError: null
      };
    }
    
    case 'SAVE_ERROR': {
      return {
        ...state,
        isSaving: false,
        saveError: action.error
      };
    }
    
    case 'CLEAR_ERROR': {
      return {
        ...state,
        saveError: null
      };
    }
    
    default: {
      return state;
    }
  }
};

// Helper function to create debounced save
const createDebouncedSave = (
  saveFn: (data: Partial<ProductFormData>) => Promise<void>, 
  delay: number
) => {
  let timeoutId: NodeJS.Timeout;
  return (data: Partial<ProductFormData>) => {
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
  const [state, dispatch] = useReducer(formReducer, {
    pendingChanges: {},
    isSaving: false,
    saveError: null,
    lastSaved: null
  });

  // Données actuelles = données originales + modifications en attente
  const currentData = useMemo(() => ({
    ...productData,
    ...state.pendingChanges
  }), [productData, state.pendingChanges]);

  // Fonction de sauvegarde intelligente
  const smartSave = useCallback(async (changes: Partial<ProductFormData>) => {
    if (Object.keys(changes).length === 0) return;

    dispatch({ type: 'SAVE_START' });

    try {
      // Créer le patch en comparant avec les données originales pour ne sauvegarder que ce qui a changé
      const patch: Partial<ProductFormData> = {};
      for (const key in changes) {
        const typedKey = key as keyof ProductFormData;
        const oldValue = productData[typedKey];
        const newValue = changes[typedKey];
        
        if (oldValue !== newValue) {
          // Type assertion sécurisée car nous savons que typedKey est une clé valide
          (patch as Record<string, unknown>)[typedKey] = newValue;
        }
      }

      if (Object.keys(patch).length > 0) {
        await onSave(patch);
        dispatch({ type: 'SAVE_SUCCESS', savedFields: Object.keys(patch) });
      }
    } catch (error) {
      dispatch({ 
        type: 'SAVE_ERROR', 
        error: error instanceof Error ? error.message : 'Erreur de sauvegarde' 
      });
    }
  }, [productData, onSave]);

  // Auto-save avec debounce pour les champs texte
  const debouncedSave = useMemo(
    () => createDebouncedSave(smartSave, 3000),
    [smartSave]
  );

  // Gestion des changements de champ
  const handleFieldChange = useCallback((field: string, value: unknown) => {
    const typedField = field as keyof ProductFormData;
    dispatch({ type: 'FIELD_CHANGE', field: typedField, value });

    // Stratégie de sauvegarde selon le type de champ
    const immediateFields: (keyof ProductFormData)[] = ['is_active', 'featured', 'min_tier', 'fulfillment_method', 'category_id', 'producer_id', 'images'];
    const autoSaveFields: (keyof ProductFormData)[] = ['name', 'slug', 'short_description', 'description', 'price_points', 'stock_quantity'];

    if (immediateFields.includes(typedField)) {
      // Sauvegarde immédiate pour toggles, selects et images
      smartSave({ [typedField]: value });
    } else if (autoSaveFields.includes(typedField)) {
      // Auto-save avec debounce pour les champs texte
      debouncedSave({ [typedField]: value });
    }
  }, [smartSave, debouncedSave]);

  // Fonction pour sauvegarder manuellement toutes les modifications en attente
  const saveAllPending = useCallback(() => {
    if (Object.keys(state.pendingChanges).length > 0) {
      smartSave(state.pendingChanges);
    }
  }, [state.pendingChanges, smartSave]);

  // Indicateur de statut
  const saveStatus = useMemo((): SaveStatus => {
    if (state.isSaving) return { type: 'saving', message: 'Sauvegarde...' };
    if (state.saveError) return { 
      type: 'error', 
      message: `Erreur: ${state.saveError}`,
      retryable: true
    };
    if (Object.keys(state.pendingChanges).length > 0) {
      return { 
        type: 'modified', 
        message: `${Object.keys(state.pendingChanges).length} modification(s) en attente`,
        count: Object.keys(state.pendingChanges).length,
        fields: Object.keys(state.pendingChanges)
      };
    }
    if (state.lastSaved) {
      const timeSince = Math.floor((Date.now() - state.lastSaved.getTime()) / 1000);
      if (timeSince < 60) {
        return { 
          type: 'saved', 
          message: `Sauvegardé il y a ${timeSince}s`,
          timestamp: state.lastSaved
        };
      }
    }
    return { type: 'pristine', message: 'Tous les changements sont sauvegardés' };
  }, [state]);

  // Fonction pour gérer le changement de statut
  const handleStatusChange = useCallback(async (newStatus: 'active' | 'inactive') => {
    const patch = { is_active: newStatus === 'active' };
    await smartSave(patch);
  }, [smartSave]);

  return (
    <ProductDetailLayout
      toolbar={<div />}
      content={
        <ProductDetailsEditor
          pendingChanges={state.pendingChanges}
          productData={currentData}
          saveStatus={saveStatus}
          onFieldChange={handleFieldChange}
          onSaveAll={saveAllPending}
        />
      }
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
    />
  );
};