'use client';

import { Save, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useFormContext } from '@/app/[locale]/admin/(dashboard)/components/form/create-admin-form';

type ProductEditHeaderProps = {
  isSaving?: boolean;
  hasUnsavedChanges?: boolean;
};

export function ProductEditHeader({ isSaving = false, hasUnsavedChanges = false }: ProductEditHeaderProps) {
  const t = useTranslations();
  const form = useFormContext(); // Use context instead of props

  const isValid = form.state.isValid;
  const isSubmitting = form.state.isSubmitting;

  const handleSave = async () => {
    await form.handleSubmit();
  };

  const getStatusIcon = () => {
    if (isSaving || isSubmitting) {
      return <Loader2 className="h-4 w-4 animate-spin" />;
    }
    if (hasUnsavedChanges) {
      return <AlertCircle className="h-4 w-4 text-amber-500" />;
    }
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  const getStatusText = () => {
    if (isSaving || isSubmitting) {
      return 'Sauvegarde en cours...';
    }
    if (hasUnsavedChanges) {
      return 'Modifications non sauvegardées';
    }
    return 'Sauvegardé automatiquement';
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <h1 className="text-2xl font-bold text-gray-900">
          Édition du produit
        </h1>

        {/* Status indicator */}
        <div className="flex items-center space-x-2 text-sm">
          {getStatusIcon()}
          <span className={
            hasUnsavedChanges ? 'text-amber-600' :
            isSaving || isSubmitting ? 'text-blue-600' :
            'text-green-600'
          }>
            {getStatusText()}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Auto-save status using Subscribe */}
        <form.Subscribe
          selector={(state) => state.isDirty}
        >
          {(isDirty) => (
            <div className="flex items-center space-x-2 text-sm">
              <div className={`h-2 w-2 rounded-full ${isDirty ? 'bg-amber-500' : 'bg-green-500'}`} />
              <span className="text-gray-600">
                {isDirty ? 'Sauvegarde automatique activée' : 'Synchronisé'}
              </span>
            </div>
          )}
        </form.Subscribe>

        {/* Manual save button */}
        <button
          onClick={handleSave}
          disabled={!isValid || isSaving || isSubmitting || !hasUnsavedChanges}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving || isSubmitting ? 'Sauvegarde...' : 'Sauvegarder manuellement'}
        </button>
      </div>
    </div>
  );
}