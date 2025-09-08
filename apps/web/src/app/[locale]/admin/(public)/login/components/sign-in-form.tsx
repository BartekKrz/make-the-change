"use client";
import type { FC } from 'react';
import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Mail, LogIn } from 'lucide-react';
import { Input, PasswordInput } from '@/app/[locale]/admin/(dashboard)/components/ui/input';
import { SubmitButton } from '@/app/[locale]/admin/(dashboard)/components/ui/submit-button';
import { FormError } from '@/app/[locale]/admin/(public)/login/components/form-error';
import { signInAction } from '@/app/[locale]/admin/login/actions';

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
      <input type="hidden" name="redirect" value={redirectTarget} />
      <h3 id="sign-in-form-title" className="sr-only">
        Formulaire de connexion
      </h3>

      <fieldset className="space-y-10">
        <legend className="sr-only">Informations de connexion</legend>

        <div className="space-y-2">
          <Input
            id="email"
            name="email"
            type="email"
            label="Adresse email"
            placeholder="admin@makethechange.com"
            autoComplete="email"
            required
            leadingIcon={<Mail size={18} className="text-muted-foreground" aria-hidden="true" />}
            error={emailError}
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
            id="password"
            name="password"
            label="Mot de passe"
            placeholder="••••••••"
            autoComplete="current-password"
            required
            error={passwordError}
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
          size="full"
          icon={<LogIn size={20} aria-hidden="true" />}
          pendingText="Connexion en cours..."
          successText="Connexion réussie!"
          variant="accent"
          className="font-semibold text-lg h-14 rounded-2xl shadow-lg hover:shadow-xl transition-all"
          forceSuccess={state?.success}
          autoSuccess={state?.success}
          showLoadingIndicator
          showSuccessIndicator
          disabled={isPending}
          loading={isPending}
          aria-live="polite"
          type="submit"
        >
          Se connecter
        </SubmitButton>
      </div>

      {generalErrorMessage && <FormError message={generalErrorMessage} />}
    </form>
  );
};
