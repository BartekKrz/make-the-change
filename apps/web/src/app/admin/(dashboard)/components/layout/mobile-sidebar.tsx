'use client'

import { type FC } from 'react'
import { useEffect, useState } from 'react'
import { X, LayoutDashboard, Package, ShoppingCart, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/app/admin/(dashboard)/components/cn'
import { useMobile } from '@/app/admin/(dashboard)/components/layout/mobile-context'

export const MobileSidebar: FC = () => {
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useMobile()
  const pathname = usePathname()

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname, setIsMobileMenuOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false)
    }
    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen, setIsMobileMenuOpen])

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Produits', icon: Package },
    { href: '/admin/orders', label: 'Commandes', icon: ShoppingCart },
    { href: '/admin/users', label: 'Utilisateurs', icon: Users },
  ]

  if (!isMobileMenuOpen) return null

  return (
    <>
      {}
      <div
        className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-xl md:hidden"
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {}
      <aside className="fixed left-0 top-0 h-full w-[92vw] max-w-[320px] z-[65] bg-card/95 backdrop-blur-xl border-r border-border shadow-2xl md:hidden">
        {}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">MC</span>
            </div>
            <span className="font-semibold text-foreground">Make the CHANGE</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                  'min-h-[44px] touch-manipulation',
                  pathname === item.href
                    ? 'bg-gradient-primary text-primary-foreground shadow-lg'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/10'
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        {}
        <div className="p-4 border-t border-border">
          <div className="text-xs text-muted-foreground text-center">
            © 2025 Make the CHANGE
          </div>
        </div>
      </aside>
    </>
  )
}

export const useMobileSidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  return { isOpen, setIsOpen, toggle: () => setIsOpen(!isOpen) }
}
