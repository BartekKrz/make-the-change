'use client';
import { Mail, LogIn } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useActionState } from 'react';

import {
  Input,
  PasswordInput,
} from '@/app/[locale]/admin/(dashboard)/components/ui/input';
import { SubmitButton } from '@/app/[locale]/admin/(dashboard)/components/ui/submit-button';
import { FormError } from '@/app/[locale]/admin/(public)/login/components/form-error';
import { signInAction } from '@/app/[locale]/admin/login/actions';

import type { FC } from 'react';

const initialState: any = { success: false, message: '', errors: undefined };

export const SignInForm: FC = () => {
  const searchParams = useSearchParams();
  const [state, formAction, isPending] = useActionState(
    signInAction as any,
    initialState
  );
  const redirectTarget = searchParams?.get('redirect') || '/admin/dashboard';

  const getFieldError = (fieldName: 'email' | 'password'): string => {
    if (state?.success || !state?.errors) return '';
    return state.errors?.[fieldName]?.[0] ?? '';
  };
  const emailError = getFieldError('email');
  const passwordError = getFieldError('password');
  const generalErrorMessage =
    !state?.success && state?.message ? state.message : '';

  return (
    <form
      action={formAction}
      aria-labelledby="sign-in-form-title"
      className="space-y-8"
    >
      <input name="redirect" type="hidden" value={redirectTarget} />
      <h3 className="sr-only" id="sign-in-form-title">
        Formulaire de connexion
      </h3>

      <fieldset className="space-y-10">
        <legend className="sr-only">Informations de connexion</legend>

        <div className="space-y-2">
          <Input
            required
            autoComplete="email"
            className="bg-background/60 border-border/40 hover:border-border/60 focus:border-primary/50 placeholder:text-muted-foreground/60 h-14 rounded-2xl pr-5 pl-12 text-lg backdrop-blur-sm transition-all duration-300"
            error={emailError}
            id="email"
            label="Adresse email"
            name="email"
            placeholder="admin@makethechange.com"
            type="email"
            leadingIcon={
              <Mail
                aria-hidden="true"
                className="text-muted-foreground"
                size={18}
              />
            }
          />
        </div>

        <div className="space-y-2">
          <PasswordInput
            required
            autoComplete="current-password"
            className="bg-background/60 border-border/40 hover:border-border/60 focus:border-primary/50 placeholder:text-muted-foreground/60 h-14 rounded-2xl px-5 text-lg backdrop-blur-sm transition-all duration-300"
            error={passwordError}
            id="password"
            label="Mot de passe"
            name="password"
            placeholder="••••••••"
          />
        </div>
      </fieldset>

      <div className="pt-4">
        <SubmitButton
          showLoadingIndicator
          showSuccessIndicator
          aria-live="polite"
          autoSuccess={state?.success}
          className="h-14 rounded-2xl text-lg font-semibold shadow-lg transition-all hover:shadow-xl"
          disabled={isPending}
          forceSuccess={state?.success}
          icon={<LogIn aria-hidden="true" size={20} />}
          loading={isPending}
          pendingText="Connexion en cours..."
          size="full"
          successText="Connexion réussie!"
          type="submit"
          variant="accent"
        >
          Se connecter
        </SubmitButton>
      </div>

      {generalErrorMessage && <FormError message={generalErrorMessage} />}

      <div className="mt-6 text-center">
        <p className="text-muted-foreground text-sm">
          Pas encore de compte ?{' '}
          <a
            className="text-primary font-medium hover:underline"
            href="/fr/admin/register"
          >
            Créer un compte administrateur
          </a>
        </p>
      </div>
    </form>
  );
};
