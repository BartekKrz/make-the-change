import type { FC, PropsWithChildren } from 'react'
import { ToastProvider, ToastViewport } from '@/app/[locale]/admin/(dashboard)/components/ui/toast'
import { Toaster } from '@/app/[locale]/admin/(dashboard)/components/ui/toaster'
import { AdminSidebar } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-sidebar'
import { AdminMobileSidebar } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-sidebar'
import { AdminMobileHeader } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-mobile-header'
import { AdminBackgroundDecoration } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-background-decoration'
import { AdminSidebarProvider } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-sidebar-context'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const metadata = { robots: { index: false, follow: false } }

const AdminDashboardLayout: FC<PropsWithChildren> = ({ children }) => (
  <ToastProvider>
    <AdminSidebarProvider>
      <div className='flex flex-col md:flex-row h-screen bg-background relative'>
        <AdminMobileHeader />
        <AdminSidebar />
        <AdminBackgroundDecoration />
        <div className='absolute inset-0 opacity-[0.025] dark:opacity-[0.04]'>
          <div
            className='w-full h-full'
            style={{
              backgroundImage: `
        linear-gradient(to right, currentColor 1px, transparent 1px),
        linear-gradient(to bottom, currentColor 1px, transparent 1px)
      `,
              backgroundSize: '60px 60px'
            }}
          />
        </div>
        <main className='flex-1 z-20 transition-all duration-300 bg-gradient-to-br from-background via-muted/5 to-background'>
          <div className='h-full'>{children}</div>
        </main>
      </div>
      <AdminMobileSidebar />
      <ToastViewport />
      <Toaster />
    </AdminSidebarProvider>
  </ToastProvider>
)

export default AdminDashboardLayout
