import { AdminBackgroundDecoration } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-background-decoration';
import { AdminMobileHeader } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-mobile-header';
import {
  AdminSidebar,
  AdminMobileSidebar,
} from '@/app/[locale]/admin/(dashboard)/components/layout/admin-sidebar';
import { AdminSidebarProvider } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-sidebar-context';
import {
  ToastProvider,
  ToastViewport,
} from '@/app/[locale]/admin/(dashboard)/components/ui/toast';
import { Toaster } from '@/app/[locale]/admin/(dashboard)/components/ui/toaster';

import type { FC, PropsWithChildren } from 'react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const metadata = { robots: { index: false, follow: false } };

const AdminDashboardLayout: FC<PropsWithChildren> = ({ children }) => (
  <ToastProvider>
    <AdminSidebarProvider>
      <div className="bg-background relative flex h-screen flex-col md:flex-row">
        <AdminMobileHeader />
        <AdminSidebar />
        <AdminBackgroundDecoration />
        <div className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `
        linear-gradient(to right, currentColor 1px, transparent 1px),
        linear-gradient(to bottom, currentColor 1px, transparent 1px)
      `,
              backgroundSize: '60px 60px',
            }}
          />
        </div>
        <main className="from-background via-muted/5 to-background z-20 flex-1 bg-gradient-to-br transition-all duration-300">
          <div className="h-full">{children}</div>
        </main>
      </div>
      <AdminMobileSidebar />
      <ToastViewport />
      <Toaster />
    </AdminSidebarProvider>
  </ToastProvider>
);

export default AdminDashboardLayout;
