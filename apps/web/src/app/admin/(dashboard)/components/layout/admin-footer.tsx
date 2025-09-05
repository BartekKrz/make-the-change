'use client'

import { type FC } from 'react'

export const AdminFooter: FC = () => (
  <footer className="hidden md:flex h-12 border-t border-border bg-card/50 backdrop-blur-sm items-center justify-between px-6 text-sm text-muted-foreground shrink-0">
    <div className="flex items-center gap-4">
      <span>© 2025 Make the CHANGE</span>
      <span>•</span>
      <span>Dashboard Admin</span>
    </div>

    <div className="flex items-center gap-4">
      <span className="text-xs">v1.0.0</span>
    </div>
  </footer>
)
