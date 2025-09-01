'use client'

import { FC } from 'react'

export const AdminBackgroundDecoration: FC = () => (
  <div className="fixed inset-0 z-[1] pointer-events-none">
    <div className="absolute top-10 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
    <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/4 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
  </div>
)
