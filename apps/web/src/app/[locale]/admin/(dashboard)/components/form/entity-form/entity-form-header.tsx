'use client';

import { Save, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

export type EntityFormHeaderProps = {
  title: string;
  form: any; // Will be properly typed by usage
  isSaving?: boolean;
  hasUnsavedChanges?: boolean;
  onSave?: () => Promise<void> | void;
  showAutoSaveToggle?: boolean;
};

export function EntityFormHeader({
  title,
  form,
  isSaving = false,
  hasUnsavedChanges = false,
  onSave,
  showAutoSaveToggle = true,
}: EntityFormHeaderProps) {
  const isValid = form.state.isValid;
  const isSubmitting = form.state.isSubmitting;

  const handleSave = async () => {
    if (onSave) {
      await onSave();
    } else {
      await form.handleSubmit();
    }
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
    return 'Sauvegardé';
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <h1 className="text-2xl font-bold text-gray-900">
          {title}
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
        {/* Auto-save toggle */}
        {showAutoSaveToggle && (
          <form.Subscribe
            selector={(state: any) => state.values}
          >
            {() => (
              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-gray-600">Sauvegarde automatique</span>
              </label>
            )}
          </form.Subscribe>
        )}

        {/* Manual save button */}
        <button
          onClick={handleSave}
          disabled={!isValid || isSaving || isSubmitting || !hasUnsavedChanges}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving || isSubmitting ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
      </div>
    </div>
  );
}