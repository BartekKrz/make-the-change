'use client';

import * as Switch from '@radix-ui/react-switch';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState, type FC } from 'react';

import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn';

export const ThemeToggle: FC = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Cleanup old theme keys with better error handling
    const oldThemeKeys = ['theme', 'next-themes-theme'];
    for (const key of oldThemeKeys) {
      try {
        if (localStorage.getItem(key) && key !== 'sextant-theme') {
          localStorage.removeItem(key);
        }
      } catch {
        // Silently handle localStorage errors (e.g., in incognito mode)
        console.warn(`Failed to remove old theme key: ${key}`);
      }
    }
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-[var(--density-spacing-sm)]">
        <Sun className="text-muted-foreground/50 h-4 w-4" />
        <div className="bg-muted/60 relative inline-flex h-6 w-11 items-center rounded-full backdrop-blur-sm">
          <div className="bg-background pointer-events-none block h-4 w-4 translate-x-1 rounded-full shadow-sm ring-0 transition-all duration-200" />
        </div>
        <Moon className="text-muted-foreground/50 h-4 w-4" />
      </div>
    );
  }

  const isDark = theme === 'dark';

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };
  return (
    <div className="group flex items-center gap-[var(--density-spacing-sm)]">
      {/* Sun Icon with modern animations */}
      <Sun
        className={cn(
          'h-4 w-4 transition-all duration-[var(--transition-normal)] ease-[cubic-bezier(0.4,0,0.2,1)]',
          'will-change-transform',
          isDark
            ? 'text-muted-foreground/60 scale-90 rotate-180'
            : 'scale-100 rotate-0 text-amber-500 drop-shadow-sm'
        )}
      />

      {/* Enhanced Switch with design system */}
      <Switch.Root
        aria-label="Basculer entre le mode clair et sombre"
        checked={isDark}
        className={cn(
          'relative inline-flex h-6 w-11 cursor-pointer items-center',
          'rounded-full transition-all duration-[var(--transition-normal)] ease-[cubic-bezier(0.4,0,0.2,1)]',
          'backdrop-blur-sm will-change-transform',

          // Focus states with design system
          'focus-visible:ring-primary/60 focus-visible:ring-2 focus-visible:outline-none',
          'focus-visible:ring-offset-background focus-visible:ring-offset-2',
          'focus-visible:scale-105',

          // Hover states
          'hover:scale-105 hover:shadow-md',

          // Active states
          'active:scale-95',

          // Theme states with design system colors
          'data-[state=checked]:bg-primary data-[state=checked]:shadow-primary/20 data-[state=checked]:shadow-sm',
          'data-[state=unchecked]:bg-muted data-[state=unchecked]:border-border data-[state=unchecked]:border',

          // Hover effects per state
          'data-[state=checked]:hover:bg-primary/90 data-[state=checked]:hover:shadow-lg',
          'data-[state=unchecked]:hover:bg-muted/80 data-[state=unchecked]:hover:border-border/60'
        )}
        onCheckedChange={toggleTheme}
      >
        <Switch.Thumb
          className={cn(
            'bg-background pointer-events-none block h-4 w-4 rounded-full shadow-lg',
            'ring-0 transition-all duration-[var(--transition-normal)] ease-[cubic-bezier(0.4,0,0.2,1)]',
            'will-change-transform',

            // Position states
            'data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-1',

            // Scale effects
            'group-hover:scale-110 group-active:scale-95',

            // Shadow variations
            'data-[state=checked]:shadow-primary/10 data-[state=unchecked]:shadow-black/10'
          )}
        />
      </Switch.Root>

      {/* Moon Icon with modern animations */}
      <Moon
        className={cn(
          'h-4 w-4 transition-all duration-[var(--transition-normal)] ease-[cubic-bezier(0.4,0,0.2,1)]',
          'will-change-transform',
          isDark
            ? 'text-primary scale-100 rotate-0 drop-shadow-sm'
            : 'text-muted-foreground/60 scale-90 rotate-180'
        )}
      />
    </div>
  );
};
