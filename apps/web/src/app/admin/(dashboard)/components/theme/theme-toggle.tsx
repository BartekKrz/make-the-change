'use client';

import * as Switch from '@radix-ui/react-switch';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/app/admin/(dashboard)/components/cn';
import { useEffect, useState, type FC } from 'react';

export const ThemeToggle: FC = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const oldThemeKeys = ['theme', 'next-themes-theme'];
    oldThemeKeys.forEach((key) => {
      if (localStorage.getItem(key) && key !== 'sextant-theme') {
        localStorage.removeItem(key);
      }
    });
  }, []);

  if (!mounted) {
    return (
      <div className='flex items-center gap-2'>
        <Sun className='h-4 w-4 text-gray-400' />
        <div className='relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300'>
          <div className='pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 translate-x-1' />
        </div>
        <Moon className='h-4 w-4 text-gray-400' />
      </div>
    );
  }

  const isDark = theme === 'dark';

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };
  return (
    <div className='flex items-center gap-2'>
      {}
      <Sun className={cn('h-4 w-4 transition-all duration-300', isDark ? 'text-gray-400' : 'text-yellow-500')} />

      {}
      <Switch.Root
        checked={isDark}
        onCheckedChange={toggleTheme}
        className={cn(
          'relative cursor-pointer inline-flex h-6 w-11 items-center rounded-full transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
          'data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-300',
          'dark:data-[state=unchecked]:bg-gray-600'
        )}
        aria-label='Basculer entre le mode clair et sombre'
      >
        <Switch.Thumb
          className={cn(
            'pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform',
            'data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-1'
          )}
        />
      </Switch.Root>

      <Moon className={cn('h-4 w-4 transition-all duration-300', isDark ? 'text-blue-400' : 'text-gray-400')} />
    </div>
  );
};
