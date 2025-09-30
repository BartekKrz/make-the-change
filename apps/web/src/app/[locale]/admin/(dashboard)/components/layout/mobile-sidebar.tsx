'use client';

import { X, LayoutDashboard, Package, ShoppingCart, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { type FC } from 'react';

import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn';
import { useMobile } from '@/app/[locale]/admin/(dashboard)/components/layout/mobile-context';
import { Button } from '@/components/ui/button';

export const MobileSidebar: FC = () => {
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useMobile();
  const pathname = usePathname();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname, setIsMobileMenuOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen, setIsMobileMenuOpen]);

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Produits', icon: Package },
    { href: '/admin/orders', label: 'Commandes', icon: ShoppingCart },
    { href: '/admin/users', label: 'Utilisateurs', icon: Users },
  ];

  if (!isMobileMenuOpen) return null;

  return (
    <>
      {}
      <div
        className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-xl md:hidden"
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {}
      <aside className="bg-card/95 border-border fixed top-0 left-0 z-[65] h-full w-[92vw] max-w-[320px] border-r shadow-2xl backdrop-blur-xl md:hidden">
        {}
        <div className="border-border flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-primary flex h-8 w-8 items-center justify-center rounded-lg">
              <span className="text-primary-foreground text-sm font-bold">
                MC
              </span>
            </div>
            <span className="text-foreground font-semibold">
              Make the CHANGE
            </span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                  'min-h-[44px] touch-manipulation',
                  pathname === item.href
                    ? 'bg-gradient-primary text-primary-foreground shadow-lg'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/10'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        {}
        <div className="border-border border-t p-4">
          <div className="text-muted-foreground text-center text-xs">
            © 2025 Make the CHANGE
          </div>
        </div>
      </aside>
    </>
  );
};

export const useMobileSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return { isOpen, setIsOpen, toggle: () => setIsOpen(!isOpen) };
};
