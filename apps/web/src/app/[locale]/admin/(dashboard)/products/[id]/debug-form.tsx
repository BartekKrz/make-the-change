'use client';

import { useFormContext } from '@/app/[locale]/admin/(dashboard)/components/form/create-admin-form';

/**
 * Component de debug pour vérifier que le contexte TanStack Form fonctionne
 * À placer temporairement dans votre page pour diagnostiquer
 */
export function FormDebugger() {
  const form = useFormContext();

  if (!form) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        ❌ PROBLÈME: Contexte TanStack Form non trouvé!
        <br />
        Vérifiez que vous êtes bien dans un &lt;form.AppForm&gt;
      </div>
    );
  }

  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded-md">
      <h3 className="font-semibold text-green-800">✅ TanStack Form Context OK</h3>
      <div className="mt-2 text-sm text-green-700">
        <div>Form Status:</div>
        <ul className="ml-4 list-disc">
          <li>isDirty: {form.state.isDirty ? '✅' : '❌'}</li>
          <li>isValid: {form.state.isValid ? '✅' : '❌'}</li>
          <li>isSubmitting: {form.state.isSubmitting ? '🔄' : '✅'}</li>
          <li>Nb erreurs: {Object.keys(form.state.errorMap).length}</li>
        </ul>

        <details className="mt-2">
          <summary className="cursor-pointer">Voir les valeurs du formulaire</summary>
          <pre className="mt-2 text-xs bg-white p-2 rounded border overflow-auto max-h-40">
            {JSON.stringify(form.state.values, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
}