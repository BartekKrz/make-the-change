import { SignInForm } from '@/app/[locale]/admin/(public)/login/components/sign-in-form';

import type { FC } from 'react';

export const SignInSection: FC = () => (
  <section
    aria-labelledby="sign-in-heading"
    className="from-background/60 via-background/40 to-background/30 relative z-10 flex flex-1 flex-col justify-center bg-gradient-to-br px-8 pb-20 shadow-2xl shadow-black/10 backdrop-blur-xl sm:px-16 sm:py-8 sm:pb-0 md:w-5/12 md:px-12 md:shadow-[-20px_0_50px_-12px_rgba(0,0,0,0.15)] lg:px-24 dark:shadow-black/25 dark:md:shadow-[-20px_0_50px_-12px_rgba(0,0,0,0.4)]"
  >
    <div className="w-full">
      <header className="mb-12 flex flex-col gap-6">
        <h2
          className="text-foreground from-foreground via-foreground to-muted-foreground bg-gradient-to-br bg-clip-text text-4xl font-bold tracking-tight"
          id="sign-in-heading"
        >
          Accès Administrateur
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed opacity-90">
          Veuillez entrer vos identifiants administrateur.
        </p>
      </header>

      <SignInForm />
    </div>
  </section>
);
