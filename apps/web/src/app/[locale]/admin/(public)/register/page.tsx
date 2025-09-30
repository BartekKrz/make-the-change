'use client';

import { Mail, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useActionState } from 'react';

import { registerAction } from '@/app/[locale]/admin/register/actions';
import { Button } from '@/components/ui/button';

const initialState: any = { success: false, message: '', errors: undefined };

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(
    registerAction as any,
    initialState
  );

  const getFieldError = (fieldName: 'email' | 'password'): string => {
    if (state?.success || !state?.errors) return '';
    return state.errors?.[fieldName]?.[0] ?? '';
  };

  const emailError = getFieldError('email');
  const passwordError = getFieldError('password');

  return (
    <main className="bg-background relative flex min-h-screen flex-col overflow-hidden">
      {/* Background decorations */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
        <div className="from-primary/25 to-primary/15 absolute top-0 right-0 h-[700px] w-[700px] translate-x-1/3 -translate-y-1/3 rounded-full bg-gradient-to-br via-orange-500/20 blur-3xl" />
        <div className="via-primary/15 absolute bottom-0 left-0 h-[600px] w-[600px] -translate-x-1/4 translate-y-1/4 rounded-full bg-gradient-to-tr from-orange-500/20 to-orange-500/25 blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="mx-auto max-w-md">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold">Créer un compte admin</h1>
            <p className="text-muted-foreground">
              Page temporaire pour créer un compte administrateur
            </p>
          </div>

          <div className="bg-background/60 border-border/40 rounded-2xl border p-8 shadow-xl backdrop-blur-sm">
            <form action={formAction} className="space-y-6">
              <div>
                <label
                  className="mb-2 block text-sm font-medium"
                  htmlFor="email"
                >
                  Email admin autorisé
                </label>
                <div className="relative">
                  <Mail
                    className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 transform"
                    size={18}
                  />
                  <input
                    required
                    id="email"
                    name="email"
                    placeholder="krynskibartosz08@gmail.com"
                    type="email"
                    className={`bg-background/60 focus:ring-primary/20 focus:border-primary w-full rounded-xl border py-3 pr-4 pl-12 focus:ring-2 ${
                      emailError ? 'border-red-400' : 'border-border/40'
                    }`}
                  />
                </div>
                {emailError && (
                  <p className="mt-1 text-xs text-red-500">{emailError}</p>
                )}
                <p className="text-muted-foreground mt-1 text-xs">
                  Doit être dans la liste : admin@make-the-change.com,
                  krynskibartosz08@gmail.com
                </p>
              </div>

              <div>
                <label
                  className="mb-2 block text-sm font-medium"
                  htmlFor="password"
                >
                  Mot de passe
                </label>
                <input
                  required
                  id="password"
                  minLength={6}
                  name="password"
                  placeholder="••••••••"
                  type="password"
                  className={`bg-background/60 focus:ring-primary/20 focus:border-primary w-full rounded-xl border px-4 py-3 focus:ring-2 ${
                    passwordError ? 'border-red-400' : 'border-border/40'
                  }`}
                />
                {passwordError && (
                  <p className="mt-1 text-xs text-red-500">{passwordError}</p>
                )}
                <p className="text-muted-foreground mt-1 text-xs">
                  Minimum 6 caractères
                </p>
              </div>

              <Button
                className="h-auto w-full rounded-xl py-3 text-lg"
                disabled={isPending}
                type="submit"
              >
                <User className="mr-2" size={20} />
                {isPending ? 'Création en cours...' : 'Créer le compte'}
              </Button>
            </form>

            {state?.message && (
              <div
                className={`mt-4 rounded-lg p-3 ${
                  state.success
                    ? 'border border-green-200 bg-green-50 text-green-700'
                    : 'border border-red-200 bg-red-50 text-red-700'
                }`}
              >
                {state.message}
              </div>
            )}

            <div className="mt-6 text-center">
              <Link
                className="text-primary inline-flex items-center text-sm hover:underline"
                href="/fr/admin/login"
              >
                <ArrowLeft className="mr-1" size={16} />
                Retour à la connexion
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
