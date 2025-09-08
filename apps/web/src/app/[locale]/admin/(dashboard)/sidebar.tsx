'use client';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { Layout, Receipt, Package, Users, LogOut, X, ChevronRight, MapPin, FolderOpen, CreditCard } from 'lucide-react';
import {  useState, type FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/app/[locale]/admin/(dashboard)/components/theme/theme-toggle';

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
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ projects: true, management: true });
  const pathname = usePathname();
  const { user } = useAuth();

  const handleSectionToggle = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isActive = (href: string) => href === '/admin/dashboard' ? pathname === href : pathname?.startsWith(href);

  return (
    <div className='flex flex-col h-full min-h-0 text-foreground'>
      <header className={cn('relative p-8 pb-6 flex-shrink-0', 'bg-gradient-to-br from-muted/30 via-muted/10 to-transparent', 'border-b border-border/20')}>
        <div className='flex items-center gap-4'>
          <div className='relative'>
            <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center relative overflow-hidden', 'bg-gradient-to-br from-primary via-primary to-orange-500', 'shadow-lg shadow-primary/25')}>
              <span className='text-white font-bold text-lg tracking-tight'>M</span>
              <div className='absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent' />
            </div>
            <div className='absolute inset-0 bg-gradient-to-br from-primary/40 to-orange-500/30 rounded-2xl blur-xl opacity-60 animate-pulse' />
          </div>
          <div className='flex-1'>
            <h1 className={cn('text-xl font-bold text-foreground tracking-tight', 'bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text')}>Make the CHANGE</h1>
            <p className="mt-1 text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
      </header>

      <div className='flex-1 min-h-0 overflow-hidden'>
        <nav className='h-full overflow-y-auto overflow-x-hidden py-6 space-y-4 sidebar-scroll-area'>
          {navigationSections.map((section) => (
            section.isStandalone ? (
              <div key={section.key} className='px-6'>
                <SidebarLink href={section.href ?? '#'} icon={section.icon} label={section.label} onClick={onLinkClick} />
              </div>
            ) : (
              <section key={section.key} className='space-y-2'>
                <div className='px-6'>
                  <button type='button' role='button' aria-expanded={openSections[section.key]} tabIndex={0} onClick={() => handleSectionToggle(section.key)} className={cn('w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300', 'hover:bg-muted/30 active:bg-muted/50', 'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2', openSections[section.key] ? 'bg-muted/20' : 'bg-muted/10')}>
                    <div className='flex items-center gap-3'>
                      <div className={cn('w-1.5 h-5 rounded-full transition-all duration-300', openSections[section.key] ? 'bg-gradient-to-b from-primary to-orange-500' : 'bg-muted-foreground/30')} />
                      <span className={cn('text-sm font-semibold uppercase tracking-wider transition-colors duration-300', openSections[section.key] ? 'text-primary' : 'text-muted-foreground')}>{section.label}</span>
                    </div>
                    <motion.div animate={{ rotate: openSections[section.key] ? 90 : 0 }} transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}>
                      <ChevronRight className={cn('h-5 w-5 transition-colors duration-300', openSections[section.key] ? 'text-primary' : 'text-muted-foreground/60')} />
                    </motion.div>
                  </button>
                </div>
                <AnimatePresence initial={false}>
                  {openSections[section.key] && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }} className='overflow-hidden space-y-1'>
                      {section.items?.map((item, itemIndex) => (
                        <motion.div key={item.href} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} transition={{ delay: itemIndex * 0.05, duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }} className='px-6'>
                          <SidebarLink href={item.href} icon={item.icon} label={item.label} onClick={onLinkClick} />
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>
            )
          ))}
        </nav>
      </div>
      <footer className='p-6 border-t border-border/20 space-y-4 flex-shrink-0 sidebar-footer-shadow'>
        <div className='flex justify-center py-2'>
          <ThemeToggle />
        </div>
        <SignOutButton />
      </footer>
    </div>
  );
};

type SidebarLinkProps = { href: string; icon: LucideIcon; label: string; onClick?: () => void; };

const SidebarLink: FC<SidebarLinkProps> = ({ href, icon: Icon, label, onClick }) => {
  const pathname = usePathname();
  const isActive = href === '/admin/dashboard' ? pathname === href : pathname?.startsWith(href);

  return (
    <motion.div whileHover={!isActive ? { scale: 1.01 } : {}} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
      <Link href={href} onClick={onClick} className={cn('group relative flex items-center gap-4 rounded-2xl p-4 transition-all duration-300', 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2', isActive ? 'bg-gradient-to-r from-primary/12 to-orange-500/8 text-foreground font-semibold border border-primary/25 shadow-lg shadow-primary/10' : 'text-muted-foreground/80 hover:text-foreground border border-transparent hover:border-border/30 hover:bg-muted/30 hover:shadow-sm')} aria-current={isActive ? 'page' : undefined}>
        <div className={cn('relative rounded-xl transition-all duration-300 flex items-center justify-center w-11 h-11', isActive ? 'bg-gradient-to-br from-primary/20 to-orange-500/15 text-primary shadow-lg shadow-primary/20' : 'bg-muted/30 text-muted-foreground/70 group-hover:bg-muted/50 group-hover:text-muted-foreground')}>
          <Icon className='h-5 w-5' />
        </div>
        <span className='block font-medium transition-all duration-300 truncate text-base'>{label}</span>
        {isActive && <motion.div layoutId="sidebar-active-indicator" className='absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1.5 bg-gradient-to-b from-primary to-orange-500 rounded-r-full' />}
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
    <Button variant="outline" size="full" onClick={handleSignOut}>
      <LogOut className='h-4 w-4' />
      Se déconnecter
    </Button>
  );
};

export default SidebarContent;
