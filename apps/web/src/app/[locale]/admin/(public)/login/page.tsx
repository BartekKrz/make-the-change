import Link from 'next/link';

import { SignInSection } from '@/app/[locale]/admin/(public)/login/components/sign-in-section';
export default function AdminLoginPage() {
  return (
    <main className="bg-background relative flex min-h-screen flex-col overflow-hidden md:flex-row">
      {}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
        <div className="from-primary/25 to-primary/15 dark:from-primary/35 dark:to-primary/20 absolute top-0 right-0 h-[700px] w-[700px] translate-x-1/3 -translate-y-1/3 rounded-full bg-gradient-to-br via-orange-500/20 blur-3xl dark:via-orange-500/25" />
        <div className="via-primary/15 dark:via-primary/20 absolute bottom-0 left-0 h-[600px] w-[600px] -translate-x-1/4 translate-y-1/4 rounded-full bg-gradient-to-tr from-orange-500/20 to-orange-500/25 blur-3xl dark:from-orange-500/30 dark:to-orange-500/35" />
        <div className="from-primary/10 dark:from-primary/20 absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-bl to-orange-500/10 blur-2xl dark:to-orange-500/20" />
      </div>

      {}
      <SignInSection />

      {}
      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2">
        <Link className="text-primary/90 hover:text-primary text-sm" href="/">
          ← Retour au site
        </Link>
      </div>
    </main>
  );
}
