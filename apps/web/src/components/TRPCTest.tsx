/**
 * Composant de test pour l'intégration tRPC
 * Teste les endpoints d'authentification et de gestion des utilisateurs
 */

'use client';

import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/hooks/useAuth';

export function TRPCTest() {
  const { user, session } = useAuth();
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('testpassword123');
  const [message, setMessage] = useState('');

  // Queries tRPC
  const { data: userProfile, refetch: refetchProfile } = trpc.users.getProfile.useQuery(
    undefined,
    {
      enabled: !!user,
    }
  );

  const { data: pointsBalance } = trpc.users.getPointsBalance.useQuery(
    undefined,
    {
      enabled: !!user,
    }
  );

  // Mutations tRPC
  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: (data) => {
      setMessage(`✅ Registration successful: ${data.message}`);
    },
    onError: (error) => {
      setMessage(`❌ Registration error: ${error.message}`);
    },
  });

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      setMessage(`✅ Login successful: ${data.message}`);
      refetchProfile();
    },
    onError: (error) => {
      setMessage(`❌ Login error: ${error.message}`);
    },
  });

  const handleRegister = async () => {
    try {
      await registerMutation.mutateAsync({ email, password });
    } catch (error) {
      console.error('Register error:', error);
    }
  };

  const handleLogin = async () => {
    try {
      await loginMutation.mutateAsync({ email, password });
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">🧪 Test tRPC Integration</h2>
      
      {/* Status de l'authentification Supabase */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Supabase Auth Status</h3>
        <p><strong>User:</strong> {user ? user.email : 'Not authenticated'}</p>
        <p><strong>Session:</strong> {session ? 'Active' : 'None'}</p>
      </div>

      {/* Données utilisateur via tRPC */}
      {user && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">tRPC User Data</h3>
          <p><strong>Profile:</strong> {userProfile ? JSON.stringify(userProfile, null, 2) : 'Loading...'}</p>
          <p><strong>Points Balance:</strong> {pointsBalance !== undefined ? pointsBalance : 'Loading...'}</p>
        </div>
      )}

      {/* Formulaire de test */}
      <div className="mb-6 p-4 border rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Test Authentication</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="test@example.com"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Password (min 8 chars)"
          />
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={handleRegister}
            disabled={registerMutation.isPending}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            {registerMutation.isPending ? 'Registering...' : 'Register via tRPC'}
          </button>
          
          <button
            onClick={handleLogin}
            disabled={loginMutation.isPending}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loginMutation.isPending ? 'Logging in...' : 'Login via tRPC'}
          </button>
        </div>

        {message && (
          <div className="p-3 bg-gray-100 border rounded">
            <pre className="text-sm">{message}</pre>
          </div>
        )}
      </div>

      {/* Debug info */}
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">🔍 Debug Info</h3>
        <p><strong>tRPC Client:</strong> {typeof trpc !== 'undefined' ? '✅ Loaded' : '❌ Not loaded'}</p>
        <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
        <p><strong>API URL:</strong> /api/trpc</p>
      </div>
    </div>
  );
}
