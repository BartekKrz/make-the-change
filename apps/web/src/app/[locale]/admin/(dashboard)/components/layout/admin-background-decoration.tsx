'use client';

import { type FC } from 'react';

export const AdminBackgroundDecoration: FC = () => (
  <div className="pointer-events-none fixed inset-0 z-[1]">
    <div className="bg-primary/5 absolute top-10 left-10 h-72 w-72 animate-pulse rounded-full blur-3xl" />
    <div
      className="bg-accent/4 absolute right-20 bottom-20 h-96 w-96 animate-pulse rounded-full blur-3xl"
      style={{ animationDelay: '2s' }}
    />
    <div
      className="bg-emerald/3 absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full blur-3xl"
      style={{ animationDelay: '4s' }}
    />
  </div>
);
