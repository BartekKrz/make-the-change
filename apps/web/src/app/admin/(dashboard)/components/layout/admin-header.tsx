'use client'

import { FC } from 'react'
import { ThemeToggle } from '@/app/admin/(dashboard)/components/theme/theme-toggle'
import { Button } from '@/app/admin/(dashboard)/components/ui/button'
import { Bell, Search, User } from 'lucide-react'

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
      <Button variant="ghost" size="sm">
        <Search className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm">
        <Bell className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm">
        <User className="w-4 h-4" />
      </Button>
      <ThemeToggle />
    </div>
  </header>
)
