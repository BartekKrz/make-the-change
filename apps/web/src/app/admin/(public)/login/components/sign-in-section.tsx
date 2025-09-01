import type { FC } from 'react'
import { SignInForm } from '@/app/admin/(public)/login/components/sign-in-form'

export const SignInSection: FC = () => (
  <section
    className={`
      flex-1 flex flex-col justify-center
      px-8 sm:px-16 md:px-12 lg:px-24
      sm:py-8 md:w-5/12 pb-20 sm:pb-0
      relative z-10
      bg-gradient-to-br from-background/60 via-background/40 to-background/30
      backdrop-blur-xl
      shadow-2xl shadow-black/10 dark:shadow-black/25
      md:shadow-[-20px_0_50px_-12px_rgba(0,0,0,0.15)] dark:md:shadow-[-20px_0_50px_-12px_rgba(0,0,0,0.4)]
    `}
    aria-labelledby='sign-in-heading'
  >
    <div className='w-full'>
      <header className='flex flex-col gap-6 mb-12'>
        <h2
          id='sign-in-heading'
          className={`
            text-foreground text-4xl font-bold tracking-tight
            bg-gradient-to-br from-foreground via-foreground to-muted-foreground
            bg-clip-text
          `}
        >
          Accès Administrateur
        </h2>
        <p className='text-muted-foreground text-lg leading-relaxed opacity-90'>
          Veuillez entrer vos identifiants administrateur.
        </p>
      </header>

      <SignInForm />
    </div>
  </section>
)
