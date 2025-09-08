'use client'

import { type FC } from 'react'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAdminSidebar } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-sidebar-context'
import { CompactThemeToggle } from '@/app/[locale]/admin/(dashboard)/components/theme/compact-theme-toggle'

export const AdminMobileHeader: FC = () => {
  const { toggleMobileSidebar } = useAdminSidebar()

  return (
    <header className="sticky top-0 z-[45] flex md:hidden items-center justify-between h-14 px-4 bg-background/95 backdrop-blur-md border-b border-border/50">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleMobileSidebar}
          className="p-3 rounded-2xl min-h-[44px] min-w-[44px] touch-manipulation"
          aria-label="Ouvrir le menu de navigation"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <h1 className="text-lg font-bold text-foreground">Make the CHANGE</h1>
        </div>
      </div>

      <CompactThemeToggle />
    </header>
  )
}
