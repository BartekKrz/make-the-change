'use client';

import { Menu, Search, Bell } from 'lucide-react';
import { type FC } from 'react';

import { useMobile } from '@/app/[locale]/admin/(dashboard)/components/layout/mobile-context';
import { CompactThemeToggle } from '@/app/[locale]/admin/(dashboard)/components/theme/compact-theme-toggle';
import { Button } from '@/components/ui/button';

export const MobileHeader: FC = () => {
  const { toggleMobileMenu } = useMobile();

  return (
    <header className="bg-background/90 border-border/10 sticky top-0 z-[45] border-b shadow-[0_8px_32px_-8px_rgba(0,0,0,0.1)] backdrop-blur-xl md:hidden">
      <div className="flex items-center justify-between p-4">
        {}
        <div className="flex items-center gap-3">
          <div className="bg-gradient-primary flex h-8 w-8 items-center justify-center rounded-lg">
            <span className="text-primary-foreground text-sm font-bold">
              MC
            </span>
          </div>
          <span className="text-foreground font-semibold">Admin</span>
        </div>

        {}
        <div className="flex items-center gap-2">
          <Button
            className="min-h-[44px] min-w-[44px] touch-manipulation rounded-2xl p-3"
            size="sm"
            variant="ghost"
          >
            <Search className="h-5 w-5" />
          </Button>
          <Button
            className="min-h-[44px] min-w-[44px] touch-manipulation rounded-2xl p-3"
            size="sm"
            variant="ghost"
          >
            <Bell className="h-5 w-5" />
          </Button>
          <CompactThemeToggle />
          <Button
            className="min-h-[44px] min-w-[44px] touch-manipulation rounded-2xl p-3"
            size="sm"
            variant="ghost"
            onClick={toggleMobileMenu}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
