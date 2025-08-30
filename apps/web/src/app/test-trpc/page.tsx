/**
 * Page de test pour l'intégration tRPC
 * Teste les fonctionnalités d'authentification et API via tRPC
 */

import { TRPCTest } from '@/components/TRPCTest';

// Force dynamic rendering pour éviter les erreurs avec les variables d'environnement
export const dynamic = 'force-dynamic';

export default function TestTRPCPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            🧪 Test tRPC Integration
          </h1>
          <p className="text-gray-600 mt-2">
            Test des endpoints tRPC avec authentification Supabase
          </p>
        </div>
        
        <TRPCTest />
      </div>
    </div>
  );
}
