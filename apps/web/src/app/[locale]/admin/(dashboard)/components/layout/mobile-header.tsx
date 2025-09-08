'use client'

import { type FC } from 'react'
import { Menu, Search, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CompactThemeToggle } from '@/app/[locale]/admin/(dashboard)/components/theme/compact-theme-toggle'
import { useMobile } from '@/app/[locale]/admin/(dashboard)/components/layout/mobile-context'

export const MobileHeader: FC = () => {
  const { toggleMobileMenu } = useMobile()

  return (
    <header className="md:hidden sticky top-0 z-[45] bg-background/90 backdrop-blur-xl border-b border-border/10 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.1)]">
      <div className="flex justify-between items-center p-4">
        {}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">MC</span>
          </div>
          <span className="font-semibold text-foreground">Admin</span>
        </div>

        {}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="p-3 rounded-2xl min-h-[44px] min-w-[44px] touch-manipulation">
            <Search className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm" className="p-3 rounded-2xl min-h-[44px] min-w-[44px] touch-manipulation">
            <Bell className="w-5 h-5" />
          </Button>
          <CompactThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            className="p-3 rounded-2xl min-h-[44px] min-w-[44px] touch-manipulation"
            onClick={toggleMobileMenu}
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
