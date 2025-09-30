'use client';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layout,
  Receipt,
  Package,
  Users,
  LogOut,
  X,
  ChevronRight,
  MapPin,
  FolderOpen,
  CreditCard,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, type FC } from 'react';

import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn';
import { ThemeToggle } from '@/app/[locale]/admin/(dashboard)/components/theme/theme-toggle';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

import type { LucideIcon } from 'lucide-react';

const navigationSections = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: Layout,
    href: '/admin/dashboard',
    isStandalone: true,
  },

  {
    key: 'projects',
    label: 'Projets',
    icon: FolderOpen,
    href: '/admin/projects',
    isStandalone: true,
  },
  {
    key: 'management',
    label: 'Gestion',
    icon: Users,
    items: [
      { href: '/admin/orders', icon: Receipt, label: 'Commandes' },
      { href: '/admin/products', icon: Package, label: 'Produits' },
      { href: '/admin/users', icon: Users, label: 'Utilisateurs' },
      { href: '/admin/subscriptions', icon: CreditCard, label: 'Abonnements' },
    ],
  },
];

type SidebarContentProps = {
  onLinkClick?: () => void;
};

const SidebarContent: FC<SidebarContentProps> = ({ onLinkClick }) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    projects: true,
    management: true,
  });
  const pathname = usePathname();
  const { user } = useAuth();

  const handleSectionToggle = (key: string) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const isActive = (href: string) =>
    href === '/admin/dashboard'
      ? pathname === href
      : pathname?.startsWith(href);

  return (
    <div className="text-foreground flex h-full min-h-0 flex-col">
      <header
        className={cn(
          'relative flex-shrink-0 p-8 pb-6',
          'from-muted/30 via-muted/10 bg-gradient-to-br to-transparent',
          'border-border/20 border-b'
        )}
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <div
              className={cn(
                'relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl',
                'from-primary via-primary bg-gradient-to-br to-orange-500',
                'shadow-primary/25 shadow-lg'
              )}
            >
              <span className="text-lg font-bold tracking-tight text-white">
                M
              </span>
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent" />
            </div>
            <div className="from-primary/40 absolute inset-0 animate-pulse rounded-2xl bg-gradient-to-br to-orange-500/30 opacity-60 blur-xl" />
          </div>
          <div className="flex-1">
            <h1
              className={cn(
                'text-foreground text-xl font-bold tracking-tight',
                'from-foreground to-foreground/80 bg-gradient-to-r bg-clip-text'
              )}
            >
              Make the CHANGE
            </h1>
            <p className="text-muted-foreground mt-1 truncate text-xs">
              {user?.email}
            </p>
          </div>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-hidden">
        <nav className="sidebar-scroll-area h-full space-y-4 overflow-x-hidden overflow-y-auto py-6">
          {navigationSections.map(section =>
            section.isStandalone ? (
              <div key={section.key} className="px-6">
                <SidebarLink
                  href={section.href ?? '#'}
                  icon={section.icon}
                  label={section.label}
                  onClick={onLinkClick}
                />
              </div>
            ) : (
              <section key={section.key} className="space-y-2">
                <div className="px-6">
                  <button
                    aria-expanded={openSections[section.key]}
                    role="button"
                    tabIndex={0}
                    type="button"
                    className={cn(
                      'flex w-full items-center justify-between rounded-xl p-4 transition-all duration-300',
                      'hover:bg-muted/30 active:bg-muted/50',
                      'focus:ring-primary/20 focus:ring-2 focus:ring-offset-2 focus:outline-none',
                      openSections[section.key] ? 'bg-muted/20' : 'bg-muted/10'
                    )}
                    onClick={() => handleSectionToggle(section.key)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'h-5 w-1.5 rounded-full transition-all duration-300',
                          openSections[section.key]
                            ? 'from-primary bg-gradient-to-b to-orange-500'
                            : 'bg-muted-foreground/30'
                        )}
                      />
                      <span
                        className={cn(
                          'text-sm font-semibold tracking-wider uppercase transition-colors duration-300',
                          openSections[section.key]
                            ? 'text-primary'
                            : 'text-muted-foreground'
                        )}
                      >
                        {section.label}
                      </span>
                    </div>
                    <motion.div
                      animate={{ rotate: openSections[section.key] ? 90 : 0 }}
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    >
                      <ChevronRight
                        className={cn(
                          'h-5 w-5 transition-colors duration-300',
                          openSections[section.key]
                            ? 'text-primary'
                            : 'text-muted-foreground/60'
                        )}
                      />
                    </motion.div>
                  </button>
                </div>
                <AnimatePresence initial={false}>
                  {openSections[section.key] && (
                    <motion.div
                      animate={{ height: 'auto', opacity: 1 }}
                      className="space-y-1 overflow-hidden"
                      exit={{ height: 0, opacity: 0 }}
                      initial={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                    >
                      {section.items?.map((item, itemIndex) => (
                        <motion.div
                          key={item.href}
                          animate={{ x: 0, opacity: 1 }}
                          className="px-6"
                          exit={{ x: -20, opacity: 0 }}
                          initial={{ x: -20, opacity: 0 }}
                          transition={{
                            delay: itemIndex * 0.05,
                            duration: 0.3,
                            ease: [0.25, 0.46, 0.45, 0.94],
                          }}
                        >
                          <SidebarLink
                            href={item.href}
                            icon={item.icon}
                            label={item.label}
                            onClick={onLinkClick}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>
            )
          )}
        </nav>
      </div>
      <footer className="border-border/20 sidebar-footer-shadow flex-shrink-0 space-y-4 border-t p-6">
        <div className="flex justify-center py-2">
          <ThemeToggle />
        </div>
        <SignOutButton />
      </footer>
    </div>
  );
};

type SidebarLinkProps = {
  href: string;
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
};

const SidebarLink: FC<SidebarLinkProps> = ({
  href,
  icon: Icon,
  label,
  onClick,
}) => {
  const pathname = usePathname();
  const isActive =
    href === '/admin/dashboard'
      ? pathname === href
      : pathname?.startsWith(href);

  return (
    <motion.div
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      whileHover={isActive ? {} : { scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link
        aria-current={isActive ? 'page' : undefined}
        href={href}
        className={cn(
          'group relative flex items-center gap-4 rounded-2xl p-4 transition-all duration-300',
          'focus-visible:ring-primary/20 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
          isActive
            ? 'from-primary/12 text-foreground border-primary/25 shadow-primary/10 border bg-gradient-to-r to-orange-500/8 font-semibold shadow-lg'
            : 'text-muted-foreground/80 hover:text-foreground hover:border-border/30 hover:bg-muted/30 border border-transparent hover:shadow-sm'
        )}
        onClick={onClick}
      >
        <div
          className={cn(
            'relative flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300',
            isActive
              ? 'from-primary/20 text-primary shadow-primary/20 bg-gradient-to-br to-orange-500/15 shadow-lg'
              : 'bg-muted/30 text-muted-foreground/70 group-hover:bg-muted/50 group-hover:text-muted-foreground'
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <span className="block truncate text-base font-medium transition-all duration-300">
          {label}
        </span>
        {isActive && (
          <motion.div
            className="from-primary absolute top-1/2 left-0 h-8 w-1.5 -translate-y-1/2 rounded-r-full bg-gradient-to-b to-orange-500"
            layoutId="sidebar-active-indicator"
          />
        )}
      </Link>
    </motion.div>
  );
};

const SignOutButton: FC = () => {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/admin/login');
  };

  return (
    <Button size="full" variant="outline" onClick={handleSignOut}>
      <LogOut className="h-4 w-4" />
      Se déconnecter
    </Button>
  );
};

export default SidebarContent;
