'use client'

import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'

export function SupabaseTest() {
  const { user, signIn, signUp, signOut } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [testResult, setTestResult] = useState<string>('')

  const handleSignUp = async () => {
    if (email && password) {
      const { error } = await signUp(email, password)
      if (error) {
        setTestResult(`❌ Sign up failed: ${error.message}`)
      } else {
        setTestResult('✅ Sign up successful - check your email')
      }
    }
  }

  const handleSignIn = async () => {
    if (email && password) {
      const { error } = await signIn(email, password)
      if (error) {
        setTestResult(`❌ Sign in failed: ${error.message}`)
      } else {
        setTestResult('✅ Sign in successful')
      }
    }
  }

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (error) {
      setTestResult(`❌ Sign out failed: ${error.message}`)
    } else {
      setTestResult('✅ Sign out successful')
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-surface rounded-lg">
      <h2 className="text-2xl font-bold mb-6">🧪 Supabase Auth Test Panel</h2>
      
      {/* Auth Status */}
      <div className="mb-6 p-4 bg-white rounded border">
        <h3 className="font-semibold mb-2">Authentication Status</h3>
        {user ? (
          <div className="text-green-600">
            <p>✅ Logged in as: {user.email}</p>
            <p>User ID: {user.id}</p>
            <button 
              onClick={handleSignOut}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <p className="text-red-600">❌ Not logged in</p>
        )}
      </div>

      {/* Auth Form */}
      {!user && (
        <div className="mb-6 p-4 bg-white rounded border">
          <h3 className="font-semibold mb-4">Test Authentication</h3>
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-primary"
            />
            <input
              type="password"
              placeholder="Password (min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-primary"
            />
            <div className="flex space-x-2">
              <button
                onClick={handleSignUp}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
              >
                Sign Up
              </button>
              <button
                onClick={handleSignIn}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Test Results */}
      {testResult && (
        <div className="p-4 bg-white rounded border">
          <h3 className="font-semibold mb-2">Test Results</h3>
          <p className="font-mono text-sm">{testResult}</p>
        </div>
      )}
    </div>
  )
}
