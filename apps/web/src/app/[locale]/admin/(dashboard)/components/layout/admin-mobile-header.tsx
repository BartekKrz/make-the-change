'use client';

import { Menu } from 'lucide-react';
import { type FC } from 'react';

import { useAdminSidebar } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-sidebar-context';
import { CompactThemeToggle } from '@/app/[locale]/admin/(dashboard)/components/theme/compact-theme-toggle';
import { Button } from '@/components/ui/button';

export const AdminMobileHeader: FC = () => {
  const { toggleMobileSidebar } = useAdminSidebar();

  return (
    <header className="bg-background/95 border-border/50 sticky top-0 z-[45] flex h-14 items-center justify-between border-b px-4 backdrop-blur-md md:hidden">
      <div className="flex items-center gap-3">
        <Button
          aria-label="Ouvrir le menu de navigation"
          className="min-h-[44px] min-w-[44px] touch-manipulation rounded-2xl p-3"
          size="sm"
          variant="ghost"
          onClick={toggleMobileSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-2">
          <div className="from-primary via-primary to-accent flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br">
            <span className="text-sm font-bold text-white">M</span>
          </div>
          <h1 className="text-foreground text-lg font-bold">Make the CHANGE</h1>
        </div>
      </div>

      <CompactThemeToggle />
    </header>
  );
};
