'use client'

import { FC } from "react";

type AdminErrorProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

 const AdminError: FC< AdminErrorProps> = ({ error, reset }) => (
  <div className="p-8">
    <h1 className="text-xl font-semibold mb-2">Une erreur est survenue</h1>
    <p className="text-sm text-gray-600 mb-4">{error.message || 'Erreur inconnue'}</p>
    <button onClick={reset} className="px-3 py-1 rounded border hover:bg-gray-50 text-sm">Réessayer</button>
  </div>
);

export default AdminError
