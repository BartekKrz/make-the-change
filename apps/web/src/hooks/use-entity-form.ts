'use client';

import { useReducer, useCallback, useMemo } from 'react';
import { type SaveStatus } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-detail-header';

export type EntityFormConfig<T> = {
  initialData: T;
  onSave: (patch: Partial<T>) => Promise<void>;
  autoSaveFields?: (keyof T)[];
  immediateFields?: (keyof T)[];
  autoSaveDelay?: number;
};

export type EntityFormState<T> = {
  pendingChanges: Partial<T>;
  isSaving: boolean;
  saveError: string | null;
  lastSaved: Date | null;
};

export type EntityFormActions<T> = {
  updateField: (field: keyof T, value: unknown) => void;
  saveAll: () => void;
  clearError: () => void;
  getSaveStatus: () => SaveStatus;
  getCurrentData: () => T;
  hasPendingChanges: () => boolean;
};

type FormAction<T> = 
  | { type: 'FIELD_CHANGE'; field: keyof T; value: unknown }
  | { type: 'SAVE_START' }
  | { type: 'SAVE_SUCCESS'; savedFields: string[] }
  | { type: 'SAVE_ERROR'; error: string }
  | { type: 'CLEAR_ERROR' };

function createFormReducer<T>() {
  return (state: EntityFormState<T>, action: FormAction<T>): EntityFormState<T> => {
    switch (action.type) {
      case 'FIELD_CHANGE':
        return {
          ...state,
          pendingChanges: {
            ...state.pendingChanges,
            [action.field]: action.value
          },
          saveError: null
        };
      
      case 'SAVE_START':
        return {
          ...state,
          isSaving: true,
          saveError: null
        };
      
      case 'SAVE_SUCCESS':
        const updatedChanges = { ...state.pendingChanges };
        action.savedFields.forEach(field => {
          if (field in updatedChanges) {
            delete updatedChanges[field as keyof Partial<T>];
          }
        });
        return {
          ...state,
          isSaving: false,
          pendingChanges: updatedChanges,
          lastSaved: new Date(),
          saveError: null
        };
      
      case 'SAVE_ERROR':
        return {
          ...state,
          isSaving: false,
          saveError: action.error
        };
      
      case 'CLEAR_ERROR':
        return {
          ...state,
          saveError: null
        };
      
      default:
        return state;
    }
  };
}

export function useEntityForm<T extends Record<string, unknown>>(
  config: EntityFormConfig<T>
): EntityFormActions<T> {
  const {
    initialData,
    onSave,
    autoSaveFields = [],
    immediateFields = [],
    autoSaveDelay = 3000
  } = config;

  const formReducer = useMemo(() => createFormReducer<T>(), []);
  
  const [state, dispatch] = useReducer(formReducer, {
    pendingChanges: {},
    isSaving: false,
    saveError: null,
    lastSaved: null
  });

  const getCurrentData = useCallback((): T => ({
    ...initialData,
    ...state.pendingChanges
  }), [initialData, state.pendingChanges]);

  const smartSave = useCallback(async (changes: Partial<T>) => {
    if (Object.keys(changes).length === 0) return;

    dispatch({ type: 'SAVE_START' });

    try {
      const patch: Partial<T> = {};
      for (const key in changes) {
        const typedKey = key as keyof T;
        const oldValue = initialData[typedKey];
        const newValue = changes[typedKey];
        
        if (oldValue !== newValue) {
          (patch as any)[typedKey] = newValue;
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
  }, [initialData, onSave]);

  const debouncedSave = useCallback((changes: Partial<T>) => {
    const timeout = setTimeout(() => {
      smartSave(changes);
    }, autoSaveDelay);
    return () => clearTimeout(timeout);
  }, [smartSave, autoSaveDelay]);

  const updateField = useCallback((field: keyof T, value: unknown) => {
    dispatch({ type: 'FIELD_CHANGE', field, value });

    if (immediateFields.includes(field)) {
      smartSave({ [field]: value } as Partial<T>);
    } else if (autoSaveFields.includes(field)) {
      debouncedSave({ [field]: value } as Partial<T>);
    }
  }, [smartSave, debouncedSave, immediateFields, autoSaveFields]);

  const saveAll = useCallback(() => {
    if (Object.keys(state.pendingChanges).length > 0) {
      smartSave(state.pendingChanges);
    }
  }, [state.pendingChanges, smartSave]);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const hasPendingChanges = useCallback(() => {
    return Object.keys(state.pendingChanges).length > 0;
  }, [state.pendingChanges]);

  const getSaveStatus = useCallback((): SaveStatus => {
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

  return {
    updateField,
    saveAll,
    clearError,
    getSaveStatus,
    getCurrentData,
    hasPendingChanges
  };
}