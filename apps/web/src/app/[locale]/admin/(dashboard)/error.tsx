'use client';

import { type FC } from 'react';

type AdminErrorProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

const AdminError: FC<AdminErrorProps> = ({ error, reset }) => (
  <div className="p-8">
    <h1 className="mb-2 text-xl font-semibold">Une erreur est survenue</h1>
    <p className="mb-4 text-sm text-gray-600">
      {error.message || 'Erreur inconnue'}
    </p>
    <button
      className="rounded border px-3 py-1 text-sm hover:bg-gray-50"
      onClick={reset}
    >
      Réessayer
    </button>
  </div>
);

export default AdminError;
