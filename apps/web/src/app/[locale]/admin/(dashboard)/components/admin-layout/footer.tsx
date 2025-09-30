'use client';
import type { FC, PropsWithChildren } from 'react';

export const AdminPageFooter: FC<PropsWithChildren> = ({ children }) => {
  if (!children) return null;

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="p-4">{children}</div>
    </footer>
  );
};
