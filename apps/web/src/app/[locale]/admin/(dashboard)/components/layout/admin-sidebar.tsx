'use client';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  X,
  ChevronRight,
  Target,
  Building2,
  CreditCard
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState, useCallback, type FC } from 'react';

import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn';
import { useAdminSidebar } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-sidebar-context';
import { ThemeToggle } from '@/app/[locale]/admin/(dashboard)/components/theme/theme-toggle';
import { LocaleSwitcher } from '@/components/locale-switcher';
import { Button } from '@/components/ui/button';

import type { LucideIcon } from 'lucide-react';

const useNavigationSections = () => {
  const tSidebar = useTranslations('admin.sidebar');
  const tProducts = useTranslations('admin.products');
  const tProjects = useTranslations('admin.projects');
  const tOrders = useTranslations('admin.orders');
  const tPartners = useTranslations('admin.partners');
  const tUsers = useTranslations('navigation');
  const tSubscriptions = useTranslations('admin.subscriptions');

  return [
    {
      key: 'dashboard',
      label: tSidebar('dashboard.label'),
      icon: LayoutDashboard,
      isStandalone: true,
      href: '/admin/dashboard',
      description: tSidebar('dashboard.description')
    },
    {
      key: 'management',
      label: tSidebar('management.label'),
      icon: Package,
      items: [
        {
          href: '/admin/products',
          icon: Package,
          label: tProducts('title'),
          description: tProducts('title')
        },
        {
          href: '/admin/projects',
          icon: Target,
          label: tProjects('title'),
          description: tProjects('title')
        },
        {
          href: '/admin/orders',
          icon: ShoppingCart,
          label: tOrders('title'),
          description: tOrders('description')
        },
        {
          href: '/admin/partners',
          icon: Building2,
          label: tPartners('title'),
          description: tPartners('description')
        },
        {
          href: '/admin/users',
          icon: Users,
          label: tUsers('users'),
          description: tUsers('users')
        },
        {
          href: '/admin/subscriptions',
          icon: CreditCard,
          label: tSubscriptions('title'),
          description: tSubscriptions('title')
        }
      ]
    }
  ];
};

export const AdminSidebar: FC = () => {
  const tSidebar = useTranslations('admin.sidebar');
  
  return (
    <aside
      aria-label={tSidebar('main_navigation')}
      role='navigation'
      className={cn(
        'hidden md:block md:relative h-full z-10',
        'w-64 lg:w-72 xl:w-80',
        'bg-gradient-to-b from-background/95 via-background/90 to-background/95',
        'dark:from-background/90 dark:via-background/85 dark:to-background/90',
        'backdrop-blur-xl',
        'border-r border-border dark:border-border/20',
        'shadow-[0_24px_48px_-12px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.05)]',
        'dark:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.25),0_0_0_1px_rgba(255,255,255,0.02)]'
      )}
    >
      <AdminSidebarContent />
    </aside>
  );
};

export const AdminMobileSidebar: FC = () => {
  const { isMobileOpen, setIsMobileOpen } = useAdminSidebar();
  const closeMobileMenu = useCallback(() => setIsMobileOpen(false), [setIsMobileOpen]);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [_isClosing, setIsClosing] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    management: false
  });
  const pathname = usePathname();
  const navigationSections = useNavigationSections();
  const tSidebar = useTranslations('admin.sidebar');

  const toggleSection = (sectionKey: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  useEffect(() => {
    const activeSection = navigationSections.find((section) => {
      if (section.isStandalone) {
        return pathname === section.href || pathname?.startsWith(section.href);
      }
      return section.items?.some((item) => {
        if (item.href === '/admin') {
          return pathname === item.href;
        }
        return pathname?.startsWith(item.href);
      });
    });

    if (activeSection && !activeSection.isStandalone && !openSections[activeSection.key]) {
      setOpenSections((prev) => ({
        ...prev,
        [activeSection.key]: true
      }));
    }
  }, [pathname, openSections]);

  useEffect(() => {
    if (!isMobileOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsClosing(true);
        setTimeout(() => {
          closeMobileMenu();
          setIsClosing(false);
        }, 300);
      }

      if (e.key === 'Tab' && sidebarRef.current) {
        const focusable = sidebarRef.current.querySelectorAll<HTMLElement>(
          'a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable.at(-1);

        if (!first || !last) return;

        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
      sidebarRef.current?.querySelector<HTMLElement>('a,button')?.focus();
    }, 150);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isMobileOpen, closeMobileMenu]);

  const handleOverlayClick = () => {
    setIsClosing(true);
    setTimeout(() => {
      closeMobileMenu();
      setIsClosing(false);
    }, 300);
  };

  return (
    <AnimatePresence>
      {isMobileOpen && (
        <div className='fixed inset-0 z-[9999] md:hidden'>
          {}
          <motion.div
            animate={{ opacity: 1 }}
            className='absolute inset-0 bg-black/30 backdrop-blur-xl'
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            onClick={handleOverlayClick}
          />

          {}
          <motion.div
            ref={sidebarRef}
            animate={{ x: 0, opacity: 1 }}
            aria-label={tSidebar('mobile_navigation_menu')}
            aria-modal='true'
            exit={{ x: '-100%', opacity: 0 }}
            initial={{ x: '-100%', opacity: 0 }}
            role='dialog'
            tabIndex={-1}
            className={cn(
              'absolute left-0 top-0 h-full w-[92vw] max-w-[440px]',
              'flex flex-col',
              'bg-gradient-to-br from-background/96 via-background/92 to-background/96',
              'dark:from-background/92 dark:via-background/88 dark:to-background/92',
              'backdrop-blur-3xl',
              'border-r border-border/25 dark:border-border/15',
              'shadow-[0_40px_80px_-12px_rgba(0,0,0,0.18),0_0_0_1px_rgba(255,255,255,0.08)]',
              'dark:shadow-[0_40px_80px_-12px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.03)]'
            )}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 200,
              duration: 0.5
            }}
          >
            {}
            <motion.header
              animate={{ y: 0, opacity: 1 }}
              initial={{ y: -30, opacity: 0 }}
              transition={{ delay: 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={cn(
                'flex items-center justify-between p-7 pb-5 flex-shrink-0',
                'border-b border-border/15 bg-gradient-to-r from-muted/20 to-muted/10'
              )}
            >
              {}
              <div className='flex items-center gap-4'>
                <motion.div className='relative group' whileTap={{ scale: 0.95 }}>
                  <div
                    className={cn(
                      'w-12 h-12 rounded-3xl flex items-center justify-center relative overflow-hidden',
                      'bg-gradient-to-br from-primary via-primary to-accent',
                      'shadow-xl shadow-primary/30'
                    )}
                  >
                    <span className='text-white font-bold text-lg tracking-tight'>M</span>

                    {}
                    <div className='absolute inset-0 bg-gradient-to-tr from-white/25 via-transparent to-transparent' />
                  </div>

                  {}
                  <div className='absolute inset-0 bg-gradient-to-br from-primary/50 to-accent/40 rounded-3xl blur-xl opacity-60 animate-pulse group-hover:opacity-80 transition-opacity' />
                </motion.div>

                <div>
                  <h1
                    className={cn(
                      'text-2xl font-bold text-foreground tracking-tight',
                      'bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text'
                    )}
                  >
                    Make the CHANGE
                  </h1>
                </div>
              </div>

              {}
              <motion.button
                aria-label={tSidebar('close_menu')}
                whileTap={{ scale: 0.9, rotate: 90 }}
                className={cn(
                  'p-3.5 rounded-3xl transition-all duration-300',
                  'bg-gradient-to-br from-muted/60 to-muted/40',
                  'border border-border/25 backdrop-blur-sm',
                  'text-muted-foreground active:bg-gradient-to-br active:from-muted/80 active:to-muted/60',
                  'active:text-foreground shadow-lg active:shadow-xl',
                  'focus:outline-none focus:ring-2 focus:ring-primary/25'
                )}
                onClick={handleOverlayClick}
              >
                <X className='h-5 w-5' />
              </motion.button>
            </motion.header>

            {}
            <div className='flex-1 overflow-hidden min-h-0'>
              <nav className='h-full overflow-y-auto overflow-x-hidden py-6 space-y-4 sidebar-scroll-area'>
                {}
                <motion.div
                  animate={{ y: 0, opacity: 1 }}
                  className='px-4'
                  initial={{ y: 20, opacity: 0 }}
                  transition={{
                    delay: 0.2,
                    duration: 0.4,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                >
                  <AdminMobileSidebarLink
                    isPrimary
                    description={tSidebar('dashboard.description')}
                    href='/admin/dashboard'
                    icon={LayoutDashboard}
                    label={tSidebar('dashboard.label')}
                    onClick={closeMobileMenu}
                  />
                </motion.div>

                {}
                <motion.div
                  animate={{ opacity: 1, scaleX: 1 }}
                  className='mx-4'
                  initial={{ opacity: 0, scaleX: 0 }}
                  transition={{
                    delay: 0.35,
                    duration: 0.3,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                >
                  <div className='h-px bg-gradient-to-r from-transparent via-border/30 to-transparent' />
                </motion.div>

                {}
                {navigationSections
                  .filter((section) => !section.isStandalone)
                  .map((section, sectionIndex) => {
                    const isOpen = openSections[section.key];
                    const hasActiveItem =
                      section.items?.some((item) => {
                        if (item.href === '/admin') {
                          return pathname === item.href;
                        }
                        return pathname?.startsWith(item.href);
                      }) ?? false;

                    return (
                      <motion.div
                        key={section.key}
                        animate={{ y: 0, opacity: 1 }}
                        className='space-y-2'
                        initial={{ y: 20, opacity: 0 }}
                        transition={{
                          delay: 0.4 + sectionIndex * 0.1,
                          duration: 0.4,
                          ease: [0.25, 0.46, 0.45, 0.94]
                        }}
                      >
                        {}
                        <div className='px-4'>
                          <motion.button
                            whileTap={{ scale: 0.98 }}
                            className={cn(
                              'w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300',
                              'active:bg-muted/50 focus:bg-muted/30',
                              'focus:outline-none focus:ring-2 focus:ring-primary/20',
                              hasActiveItem
                                ? 'bg-gradient-to-r from-primary/10 to-accent/5 border border-primary/20'
                                : 'bg-muted/10 border border-border/10'
                            )}
                            onClick={() => toggleSection(section.key)}
                          >
                            <div className='flex items-center gap-3'>
                              <div
                                className={cn(
                                  'w-1 h-4 rounded-full transition-all duration-300',
                                  hasActiveItem
                                    ? 'bg-gradient-to-b from-primary to-accent'
                                    : 'bg-muted-foreground/30'
                                )}
                              />
                              <span
                                className={cn(
                                  'text-xs font-semibold uppercase tracking-wider transition-colors duration-300',
                                  hasActiveItem ? 'text-primary' : 'text-muted-foreground'
                                )}
                              >
                                {section.label}
                              </span>
                            </div>

                            {}
                            <motion.div
                              animate={{ rotate: isOpen ? 90 : 0 }}
                              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                            >
                              <ChevronRight
                                className={cn(
                                  'h-4 w-4 transition-colors duration-300',
                                  hasActiveItem ? 'text-primary' : 'text-muted-foreground'
                                )}
                              />
                            </motion.div>
                          </motion.button>
                        </div>

                        {}
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              animate={{ height: 'auto', opacity: 1 }}
                              className='overflow-hidden space-y-1'
                              exit={{ height: 0, opacity: 0 }}
                              initial={{ height: 0, opacity: 0 }}
                              transition={{
                                duration: 0.4,
                                ease: [0.4, 0, 0.2, 1],
                                opacity: { duration: 0.3 }
                              }}
                            >
                              {section.items?.map((item, itemIndex) => (
                                <motion.div
                                  key={item.href}
                                  animate={{ x: 0, opacity: 1 }}
                                  className='px-4'
                                  exit={{ x: -20, opacity: 0 }}
                                  initial={{ x: -20, opacity: 0 }}
                                  transition={{
                                    delay: itemIndex * 0.05,
                                    duration: 0.3,
                                    ease: [0.25, 0.46, 0.45, 0.94]
                                  }}
                                >
                                  <AdminMobileSidebarLink
                                    description={item.description}
                                    href={item.href}
                                    icon={item.icon}
                                    label={item.label}
                                    onClick={closeMobileMenu}
                                  />
                                </motion.div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
              </nav>
            </div>

            {}
            <motion.footer
              animate={{ y: 0, opacity: 1 }}
              className='p-6 pt-4 border-t border-border/10 space-y-4 flex-shrink-0 sidebar-footer-shadow'
              initial={{ y: 30, opacity: 0 }}
              transition={{ delay: 0.6, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {}
              <div className='flex flex-col items-stretch gap-3 py-2'>
                <LocaleSwitcher />
                <div className='flex justify-center'>
                  <ThemeToggle />
                </div>
              </div>

              {}
              <Button
                className="w-full"
                variant="destructive"
                onClick={() => {
                  // TODO: Implement sign out functionality
                }}
              >
                {tSidebar('logout')}
              </Button>
            </motion.footer>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const AdminSidebarContent: FC<{ onLinkClick?: () => void }> = ({ onLinkClick }) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const pathname = usePathname();
  const navigationSections = useNavigationSections();
  const tSidebar = useTranslations('admin.sidebar');

  const handleSectionToggle = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const isActive = (href: string) => (href === '/admin' ? pathname === href : pathname?.startsWith(href));

  return (
    <div className='flex flex-col h-full min-h-0 text-foreground'>
      {}
      <header
        className={cn(
          'relative p-8 pb-6 flex-shrink-0',
          'bg-gradient-to-br from-muted/30 via-muted/10 to-transparent',
          'border-b border-border/20'
        )}
      >
        {}
        <div className='flex items-center gap-4'>
          <div className='relative'>
            {}
            <div
              className={cn(
                'w-12 h-12 rounded-2xl flex items-center justify-center relative overflow-hidden',
                'bg-gradient-to-br from-primary via-primary to-accent',
                'shadow-lg shadow-primary/25'
              )}
            >
              <span className='text-white font-bold text-lg tracking-tight'>M</span>

              {}
              <div className='absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent' />
            </div>

            {}
            <div className='absolute inset-0 bg-gradient-to-br from-primary/40 to-accent/30 rounded-2xl blur-xl opacity-60 animate-pulse' />
          </div>

          <div className='flex-1'>
            <h1
              className={cn(
                'text-2xl font-bold text-foreground tracking-tight',
                'bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text'
              )}
            >
              Make the CHANGE
            </h1>
          </div>
        </div>
      </header>

      {}
      <div className='flex-1 min-h-0 overflow-hidden'>
        <nav className='h-full overflow-y-auto overflow-x-hidden py-6 space-y-4 sidebar-scroll-area'>
          {}
          <div className='px-6'>
            <AdminSidebarLink href='/admin/dashboard' icon={LayoutDashboard} label={tSidebar('dashboard.label')} onClick={onLinkClick} />
          </div>

          {}
          <div className='px-6'>
            <div className='relative h-px bg-gradient-to-r from-transparent via-border/40 to-transparent'>
              <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-border/60 rounded-full' />
            </div>
          </div>

          {}
          {navigationSections
            .filter((section) => !section.isStandalone)
            .map((section, _sectionIndex) => {
              const sectionActive = section.items?.some((item) => isActive(item.href)) ?? false;
              const isOpen = openSections[section.key] ?? sectionActive;

              return (
                <section key={section.key} className='space-y-2'>
                  {}
                  <div className='px-6'>
                    <button
                      aria-expanded={isOpen}
                      role='button'
                      tabIndex={0}
                      type='button'
                      className={cn(
                        'w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300',
                        'hover:bg-muted/30 active:bg-muted/50',
                        'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2',
                        sectionActive
                          ? 'bg-gradient-to-r from-primary/8 to-accent/5 border border-primary/15'
                          : 'bg-muted/10 border border-border/10 hover:border-border/20'
                      )}
                      onClick={() => handleSectionToggle(section.key)}
                    >
                      <div className='flex items-center gap-3'>
                        <div
                          className={cn(
                            'w-1.5 h-5 rounded-full transition-all duration-300',
                            sectionActive ? 'bg-gradient-to-b from-primary to-accent' : 'bg-muted-foreground/30'
                          )}
                        />

                        <div className='text-left'>
                          <span
                            className={cn(
                              'text-sm font-semibold transition-colors duration-300',
                              sectionActive ? 'text-primary' : 'text-foreground/80'
                            )}
                          >
                            {section.label}
                          </span>
                        </div>
                      </div>

                      <motion.div
                        animate={{ rotate: isOpen ? 90 : 0 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      >
                        <ChevronRight
                          className={cn(
                            'h-5 w-5 transition-colors duration-300',
                            sectionActive ? 'text-primary' : 'text-muted-foreground/60'
                          )}
                        />
                      </motion.div>
                    </button>
                  </div>

                  {}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        animate={{ height: 'auto', opacity: 1 }}
                        className='overflow-hidden space-y-1'
                        exit={{ height: 0, opacity: 0 }}
                        initial={{ height: 0, opacity: 0 }}
                        transition={{
                          duration: 0.4,
                          ease: [0.4, 0, 0.2, 1],
                          opacity: { duration: 0.3 }
                        }}
                      >
                        {section.items?.map((item, itemIndex) => (
                          <motion.div
                            key={item.href}
                            animate={{ x: 0, opacity: 1 }}
                            className='px-6'
                            exit={{ x: -20, opacity: 0 }}
                            initial={{ x: -20, opacity: 0 }}
                            transition={{
                              delay: itemIndex * 0.05,
                              duration: 0.3,
                              ease: [0.25, 0.46, 0.45, 0.94]
                            }}
                          >
                            <AdminSidebarLink href={item.href} icon={item.icon} label={item.label} onClick={onLinkClick} />
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </section>
              );
            })}
        </nav>
      </div>
      {}
      <footer className='p-6 border-t border-border/20 space-y-4 flex-shrink-0 sidebar-footer-shadow'>
        {}
        <div className='flex flex-col items-stretch gap-3 py-2'>
          <LocaleSwitcher />
          <div className='flex justify-center'>
            <ThemeToggle />
          </div>
        </div>

        {}
        <Button
          className="w-full"
          variant="destructive"
          onClick={() => {
            // TODO: Implement sign out functionality
          }}
        >
          {tSidebar('logout')}
        </Button>
      </footer>
    </div>
  );
};

type AdminSidebarLinkProps = {
  href: string;
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  isHighlighted?: boolean;
  isCompact?: boolean;
  isPrimary?: boolean;
};

const AdminSidebarLink: FC<AdminSidebarLinkProps> = ({
  href,
  icon: Icon,
  label,
  onClick,
  isHighlighted,
  isCompact,
  isPrimary
}) => {
  const pathname = usePathname();
  const isActive = href === '/admin' ? pathname === href : pathname?.startsWith(href);
  const testId = href.replace('/admin', '').replace('/', '') || 'dashboard';

  return (
    <motion.div
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      whileHover={isActive ? {} : { scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link
        aria-current={isActive ? 'page' : undefined}
        data-testid={`sidebar-link-${testId}`}
        href={href}
        className={cn(
          'group relative flex items-center gap-4 rounded-2xl transition-all duration-300',
          'overflow-hidden cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2',
          isCompact ? 'py-3 px-4' : 'py-4 px-5',

          isPrimary && [
            'bg-gradient-to-r from-primary/10 via-primary/5 to-accent/5',
            'border border-primary/20 hover:border-primary/30',
            'shadow-lg shadow-primary/10 hover:shadow-primary/15',
            'font-bold text-foreground'
          ],

          isActive &&
            !isPrimary && [
              'bg-gradient-to-r from-primary/12 to-accent/8 text-foreground font-semibold',
              'border border-primary/25 shadow-lg shadow-primary/10',
              'before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2',
              'before:h-8 before:w-1.5 before:bg-gradient-to-b before:from-primary before:to-accent before:rounded-r-full'
            ],

          isHighlighted &&
            !isActive &&
            !isPrimary && [
              'bg-gradient-to-r from-primary/6 to-accent/4 hover:from-primary/10 hover:to-accent/6',
              'border border-primary/15 hover:border-primary/25',
              'font-semibold text-foreground/90 hover:text-foreground',
              'shadow-md hover:shadow-lg hover:shadow-primary/5'
            ],

          !isActive &&
            !isHighlighted &&
            !isPrimary && [
              'text-muted-foreground/80 hover:text-foreground',
              'border border-transparent hover:border-border/30',
              'hover:bg-muted/30 hover:shadow-sm'
            ],

          isActive && 'hover:scale-100 hover:shadow-none'
        )}
        onClick={onClick}
      >
        {}
        <div
          className={cn(
            'relative rounded-xl transition-all duration-300 flex items-center justify-center',
            isCompact ? 'w-9 h-9' : 'w-11 h-11',

            isPrimary && [
              'bg-gradient-to-br from-primary/20 to-accent/15',
              'text-primary shadow-lg shadow-primary/20'
            ],

            isActive &&
              !isPrimary && [
                'bg-gradient-to-br from-primary/20 to-accent/15 text-primary',
                'shadow-lg shadow-primary/20'
              ],

            isHighlighted &&
              !isActive &&
              !isPrimary && ['bg-primary/12 text-primary', 'group-hover:bg-primary/18 group-hover:shadow-md'],

            !isActive &&
              !isHighlighted &&
              !isPrimary && [
                'bg-muted/30 text-muted-foreground/70',
                'group-hover:bg-muted/50 group-hover:text-muted-foreground group-hover:shadow-sm'
              ]
          )}
        >
          <Icon
            className={cn(
              'transition-all duration-300',
              isCompact ? 'h-4 w-4' : 'h-5 w-5'
            )}
          />

          {}
          {(isPrimary || isActive || isHighlighted) && (
            <div className='absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent rounded-xl' />
          )}
        </div>

        {}
        <div className='flex-1 min-w-0'>
          <span
            className={cn(
              'block font-medium transition-all duration-300 truncate',
              isCompact ? 'text-sm' : 'text-base',
              isPrimary && 'font-bold text-lg',
              isHighlighted && 'font-semibold'
            )}
          >
            {label}
          </span>
        </div>

        {}
        <div className='flex items-center gap-2'>
          {isActive && (
            <motion.div
              animate={{ scale: 1, rotate: 0 }}
              initial={{ scale: 0, rotate: -180 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className={cn(
                'bg-gradient-to-r from-primary to-accent rounded-full',
                isCompact ? 'w-2 h-2' : 'w-2.5 h-2.5'
              )}
            />
          )}

          {isHighlighted && !isActive && (
            <motion.div
              animate={{ scale: 1 }}
              className={cn('bg-primary/60 rounded-full', isCompact ? 'w-1.5 h-1.5' : 'w-2 h-2')}
              initial={{ scale: 0 }}
            />
          )}
        </div>

        {}
        {!isActive && (
          <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl overflow-hidden' />
        )}
      </Link>
    </motion.div>
  );
};

type AdminMobileSidebarProps = {
  href: string;
  icon: LucideIcon;
  label: string;
  description?: string;
  onClick?: () => void;
  isHighlighted?: boolean;
  isCompact?: boolean;
  isPrimary?: boolean;
};

const AdminMobileSidebarLink: FC<AdminMobileSidebarProps> = ({
  href,
  icon: Icon,
  label,
  description,
  onClick,
  isHighlighted,
  isCompact,
  isPrimary
}) => {
  const pathname = usePathname();
  const isActive = href === '/admin' ? pathname === href : pathname?.startsWith(href);

  return (
    <motion.div whileTap={{ scale: 0.98 }}>
      <Link
        aria-current={isActive ? 'page' : undefined}
        href={href}
        className={cn(
          'group relative flex items-center gap-4 rounded-3xl transition-all duration-300 overflow-hidden',
          'active:shadow-lg active:shadow-primary/10',
          isCompact ? 'p-4' : 'p-5',

          isPrimary && [
            'bg-gradient-to-r from-primary/12 via-primary/8 to-accent/6',
            'border border-primary/25 shadow-xl shadow-primary/15',
            'text-foreground font-bold'
          ],

          isActive &&
            !isPrimary && [
              'bg-gradient-to-r from-primary/15 via-primary/10 to-accent/10',
              'border border-primary/25 shadow-xl shadow-primary/15',
              'text-foreground font-semibold'
            ],

          !isActive &&
            !isPrimary && [
              'bg-gradient-to-r from-muted/15 to-muted/10 active:from-muted/25 active:to-muted/15',
              'border border-border/10 active:border-border/20',
              'text-muted-foreground/70 active:text-foreground/90'
            ],

          isHighlighted &&
            !isActive &&
            !isPrimary && [
              'bg-gradient-to-r from-primary/10 to-accent/8 active:from-primary/15 active:to-accent/10',
              'border border-primary/25 active:border-primary/35',
              'text-foreground font-semibold shadow-md active:shadow-lg'
            ],

          isActive && 'active:shadow-current active:translate-y-0'
        )}
        onClick={onClick}
      >
        {}
        <motion.div
          whileTap={isActive ? {} : { scale: 0.95 }}
          className={cn(
            'relative rounded-2xl transition-all duration-300 flex items-center justify-center',
            isCompact ? 'w-10 h-10' : 'w-12 h-12',

            isPrimary && [
              'bg-gradient-to-br from-primary/25 to-accent/20',
              'text-primary shadow-xl shadow-primary/25'
            ],

            isActive &&
              !isPrimary && [
                'bg-gradient-to-br from-primary/25 to-accent/20 text-primary',
                'shadow-xl shadow-primary/25'
              ],

            isHighlighted &&
              !isActive &&
              !isPrimary && ['bg-primary/15 text-primary', 'group-active:bg-primary/20 group-active:shadow-lg'],

            !isActive &&
              !isHighlighted &&
              !isPrimary && [
                'bg-muted/30 text-muted-foreground/60',
                'group-active:bg-muted/50 group-active:text-muted-foreground/80'
              ]
          )}
        >
          <Icon
            className={cn(
              'transition-all duration-300',
              isCompact ? 'h-5 w-5' : 'h-6 w-6'
            )}
          />

          {}
          {(isPrimary || isActive || isHighlighted) && (
            <div className='absolute inset-0 bg-gradient-to-tr from-white/15 via-transparent to-transparent rounded-2xl' />
          )}
        </motion.div>

        {}
        <div className='flex-1 min-w-0'>
          <div className='flex items-center justify-between'>
            <div className='min-w-0 flex-1'>
              <h3
                className={cn(
                  'font-semibold truncate transition-colors duration-300',
                  isCompact ? 'text-sm' : 'text-base',
                  isPrimary && 'font-bold text-lg text-foreground',
                  isHighlighted && 'font-bold text-foreground'
                )}
              >
                {label}
              </h3>
              {description && (
                <p
                  className={cn(
                    'text-muted-foreground mt-0.5 truncate opacity-80',
                    isCompact ? 'text-xs' : 'text-xs',
                    isHighlighted && 'text-foreground/60 font-medium'
                  )}
                >
                  {description}
                </p>
              )}
            </div>

            {}
            <motion.div animate={{ x: isActive ? 0 : -10 }} className='flex items-center gap-2' initial={false}>
              {isActive ? (
                <motion.div
                  animate={{ scale: 1 }}
                  className={cn('bg-primary rounded-full', isCompact ? 'w-1.5 h-1.5' : 'w-2 h-2')}
                  initial={{ scale: 0 }}
                />
              ) : (isHighlighted ? (
                <motion.div
                  animate={{ scale: 1 }}
                  className={cn('bg-primary/60 rounded-full', isCompact ? 'w-1 h-1' : 'w-1.5 h-1.5')}
                  initial={{ scale: 0 }}
                />
              ) : (
                <ChevronRight className='h-4 w-4 opacity-40 group-active:opacity-80 transition-opacity' />
              ))}
            </motion.div>
          </div>
        </div>

        {}
        {!isActive && (
          <div
            className={cn(
              'absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent opacity-0 group-active:opacity-100 transition-opacity duration-200 pointer-events-none rounded-3xl'
            )}
          />
        )}
      </Link>
    </motion.div>
  );
};
