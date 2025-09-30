'use client';

import { Bell, Search, User } from 'lucide-react';
import { type FC } from 'react';

import { ThemeToggle } from '@/app/[locale]/admin/(dashboard)/components/theme/theme-toggle';
import { Button } from '@/components/ui/button';

export const AdminHeader: FC = () => (
  <header className="border-border bg-card/50 flex h-16 shrink-0 items-center justify-between border-b px-6 backdrop-blur-sm">
    {}
    <div className="flex items-center gap-4">
      <div className="bg-gradient-primary flex h-8 w-8 items-center justify-center rounded-lg">
        <span className="text-primary-foreground text-sm font-bold">MC</span>
      </div>
      <span className="text-foreground hidden font-semibold md:inline">
        Make the CHANGE
      </span>
    </div>

    {}
    <div className="flex items-center gap-2">
      <Button size="sm" variant="ghost">
        <Search className="h-4 w-4" />
      </Button>
      <Button size="sm" variant="ghost">
        <Bell className="h-4 w-4" />
      </Button>
      <Button size="sm" variant="ghost">
        <User className="h-4 w-4" />
      </Button>
      <ThemeToggle />
    </div>
  </header>
);
