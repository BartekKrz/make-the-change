'use client';

import { type FC } from 'react';

export const AdminFooter: FC = () => (
  <footer className="border-border bg-card/50 text-muted-foreground hidden h-12 shrink-0 items-center justify-between border-t px-6 text-sm backdrop-blur-sm md:flex">
    <div className="flex items-center gap-4">
      <span>© 2025 Make the CHANGE</span>
      <span>•</span>
      <span>Dashboard Admin</span>
    </div>

    <div className="flex items-center gap-4">
      <span className="text-xs">v1.0.0</span>
    </div>
  </footer>
);
