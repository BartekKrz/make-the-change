"use client";
import { Mail, LogIn } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useActionState } from 'react';

import { Input, PasswordInput } from '@/app/[locale]/admin/(dashboard)/components/ui/input';
import { SubmitButton } from '@/app/[locale]/admin/(dashboard)/components/ui/submit-button';
import { FormError } from '@/app/[locale]/admin/(public)/login/components/form-error';
import { signInAction } from '@/app/[locale]/admin/login/actions';

import type { FC } from 'react';

const initialState: any = { success: false, message: '', errors: undefined };

export const SignInForm: FC = () => {
  const searchParams = useSearchParams();
  const [state, formAction, isPending] = useActionState(signInAction as any, initialState);
  const redirectTarget = searchParams?.get('redirect') || '/admin/dashboard';

  const getFieldError = (fieldName: 'email' | 'password'): string => {
    if (state?.success || !state?.errors) return '';
    return state.errors?.[fieldName]?.[0] ?? '';
  };
  const emailError = getFieldError('email');
  const passwordError = getFieldError('password');
  const generalErrorMessage = !state?.success && state?.message ? state.message : '';

  return (
    <form action={formAction} aria-labelledby="sign-in-form-title" className="space-y-8">
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
            error={emailError}
            id="email"
            label="Adresse email"
            leadingIcon={<Mail aria-hidden="true" className="text-muted-foreground" size={18} />}
            name="email"
            placeholder="admin@makethechange.com"
            type="email"
            className={`
              h-14 pl-12 pr-5 text-lg
              bg-background/60 backdrop-blur-sm
              border-border/40 hover:border-border/60 focus:border-primary/50
              rounded-2xl transition-all duration-300
              placeholder:text-muted-foreground/60
            `}
          />
        </div>

        <div className="space-y-2">
          <PasswordInput
            required
            autoComplete="current-password"
            error={passwordError}
            id="password"
            label="Mot de passe"
            name="password"
            placeholder="••••••••"
            className={`
              h-14 px-5 text-lg
              bg-background/60 backdrop-blur-sm
              border-border/40 hover:border-border/60 focus:border-primary/50
              rounded-2xl transition-all duration-300
              placeholder:text-muted-foreground/60
            `}
          />
        </div>
      </fieldset>

      <div className="pt-4">
        <SubmitButton
          showLoadingIndicator
          showSuccessIndicator
          aria-live="polite"
          autoSuccess={state?.success}
          className="font-semibold text-lg h-14 rounded-2xl shadow-lg hover:shadow-xl transition-all"
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
    </form>
  );
};
