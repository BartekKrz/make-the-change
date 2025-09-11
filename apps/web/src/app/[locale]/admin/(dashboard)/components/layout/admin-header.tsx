'use client'

import { Bell, Search, User } from 'lucide-react'
import { type FC } from 'react'

import { ThemeToggle } from '@/app/[locale]/admin/(dashboard)/components/theme/theme-toggle'
import { Button } from '@/components/ui/button'

export const AdminHeader: FC = () => (
  <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-6 shrink-0">
    {}
    <div className="flex items-center gap-4">
      <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
        <span className="text-primary-foreground font-bold text-sm">MC</span>
      </div>
      <span className="font-semibold text-foreground hidden md:inline">Make the CHANGE</span>
    </div>

    {}
    <div className="flex items-center gap-2">
      <Button size="sm" variant="ghost">
        <Search className="w-4 h-4" />
      </Button>
      <Button size="sm" variant="ghost">
        <Bell className="w-4 h-4" />
      </Button>
      <Button size="sm" variant="ghost">
        <User className="w-4 h-4" />
      </Button>
      <ThemeToggle />
    </div>
  </header>
)
