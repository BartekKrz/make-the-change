'use client';
import { type ReactNode } from 'react';

type AdminPageFooterProps = {
  children?: ReactNode;
};

export const AdminPageFooter = ({ children }: AdminPageFooterProps) => {
  if (!children) return null;
  
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="p-4">
        {children}
      </div>
    </footer>
  );
};
