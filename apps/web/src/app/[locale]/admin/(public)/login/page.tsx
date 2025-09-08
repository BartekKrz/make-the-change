
import Link from 'next/link'
import { SignInSection } from '@/app/[locale]/admin/(public)/login/components/sign-in-section'
export default function AdminLoginPage() {
  return (
    <main className='flex flex-col md:flex-row min-h-screen bg-background relative overflow-hidden'>
      {}
      <div className='fixed inset-0 z-0 pointer-events-none' aria-hidden='true'>
        <div className='absolute top-0 right-0 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-primary/25 via-orange-500/20 to-primary/15 dark:from-primary/35 dark:via-orange-500/25 dark:to-primary/20 translate-x-1/3 -translate-y-1/3 blur-3xl' />
        <div className='absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-orange-500/20 via-primary/15 to-orange-500/25 dark:from-orange-500/30 dark:via-primary/20 dark:to-orange-500/35 -translate-x-1/4 translate-y-1/4 blur-3xl' />
        <div className='absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-full bg-gradient-to-bl from-primary/10 to-orange-500/10 dark:from-primary/20 dark:to-orange-500/20 -translate-x-1/2 -translate-y-1/2 blur-2xl' />
      </div>

      {}
      <SignInSection />

      {}
      <div className='absolute bottom-6 left-1/2 -translate-x-1/2 z-10'>
        <Link href='/' className='text-sm text-primary/90 hover:text-primary'>← Retour au site</Link>
      </div>
    </main>
  )
}
