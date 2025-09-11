'use client';

import * as Switch from '@radix-ui/react-switch';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState, type FC } from 'react';

import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn';


export const CompactThemeToggle: FC = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className='relative inline-flex h-5 w-9 items-center rounded-full bg-gray-300'>
        <div className='pointer-events-none block h-3 w-3 rounded-full bg-white shadow-sm ring-0 translate-x-1' />
      </div>
    );
  }

  const isDark = theme === 'dark';

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  return (
    <div className='flex items-center gap-1.5'>
      <Sun className={cn('h-3.5 w-3.5 transition-all duration-300', isDark ? 'text-gray-400' : 'text-yellow-500')} />

      <Switch.Root
        aria-label='Basculer entre le mode clair et sombre'
        checked={isDark}
        className={cn(
          'relative cursor-pointer inline-flex h-5 w-9 items-center rounded-full transition-colors',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-1',
          'data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-300',
          'dark:data-[state=unchecked]:bg-gray-600'
        )}
        onCheckedChange={toggleTheme}
      >
        <Switch.Thumb
          className={cn(
            'pointer-events-none block h-3 w-3 rounded-full bg-white shadow-sm ring-0 transition-transform',
            'data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-1'
          )}
        />
      </Switch.Root>

      <Moon className={cn('h-3.5 w-3.5 transition-all duration-300', isDark ? 'text-blue-400' : 'text-gray-400')} />
    </div>
  );
};
