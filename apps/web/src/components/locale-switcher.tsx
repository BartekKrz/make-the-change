"use client"
import { usePathname, useRouter } from 'next/navigation';
import { Globe, Check } from 'lucide-react';
import { useEffect, useState, useMemo, useCallback, useTransition, type FC } from 'react';

type LocaleOption = {
  code: string;
  label: string;
  flag: string;
  nativeName: string;
};

const locales: LocaleOption[] = [
  { code: 'fr', label: 'Français', flag: '🇫🇷', nativeName: 'FR' },
  { code: 'en', label: 'English', flag: '🇺🇸', nativeName: 'EN' },
  { code: 'nl', label: 'Nederlands', flag: '🇳🇱', nativeName: 'NL' }
];

const DROPDOWN_HEIGHT = 200;

type CompactLocaleSwitcherProps=  {
  className?: string;
}

export const LocaleSwitcher: FC<CompactLocaleSwitcherProps> = ({ className }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<'top' | 'bottom'>('bottom');
  const [isPending, startTransition] = useTransition();
  
  const currentLocale = useMemo(() => pathname.split('/')[1] || 'fr', [pathname]);
  const currentLocaleData = useMemo(() => 
    locales.find(locale => locale.code === currentLocale) || locales[0],
    [currentLocale]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setIsOpen(false);
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);

  const handleToggleOpen = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isOpen) {
      const rect = e.currentTarget.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      
      setDropdownPosition(spaceBelow >= DROPDOWN_HEIGHT ? 'bottom' : 'top');
    }
    
    setIsOpen(!isOpen);
  }, [isOpen]);

  const switchLocale = useCallback((newLocale: string) => {
    if (newLocale === currentLocale) return;
    
    const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '');
    const newUrl = `/${newLocale}${pathWithoutLocale}`;
    
    setIsOpen(false);
    startTransition(() => {
      router.push(newUrl);
    });
  }, [currentLocale, pathname, router, startTransition]);

  if (!mounted) {
    return (
      <div className={`flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 animate-pulse min-w-[120px] ${className || ''}`}>
        <Globe className="w-4 h-4 text-gray-400" />
        <div className="w-8 h-4 bg-gray-300 dark:bg-gray-600 rounded" />
      </div>
    );
  }

  return (
    <div className={`relative ${className || ''}`}>
      <button
        onClick={handleToggleOpen}
        className={`flex cursor-pointer items-center justify-between gap-3 w-full min-w-[120px] px-4 py-3 rounded-xl transition-all duration-300 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500/20 hover:scale-[1.02] active:scale-[0.98] ${
          isOpen
            ? 'border-green-500/25 bg-gradient-to-r from-green-500/8 to-yellow-500/5 text-gray-900 dark:text-gray-100 shadow-lg shadow-green-500/10'
            : 'border-gray-200/15 dark:border-gray-700/15 hover:border-gray-200/30 dark:hover:border-gray-700/30 bg-gradient-to-r from-gray-100/20 to-gray-100/10 dark:from-gray-800/20 dark:to-gray-800/10 hover:from-gray-100/30 hover:to-gray-100/15 dark:hover:from-gray-800/30 dark:hover:to-gray-800/15 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
        }`}
        aria-label="Changer de langue"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 min-w-0">
          <Globe className={`w-4 h-4 transition-colors duration-300 flex-shrink-0 ${
            isOpen ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'
          }`} />
          <span className={`text-sm font-medium transition-colors duration-300 truncate ${
            isOpen ? 'text-green-600 dark:text-green-400' : ''
          }`}>
            {isPending ? '...' : currentLocaleData.nativeName}
          </span>
        </div>
        
        <div
          className={`flex-shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
        >
          <svg 
            className={`w-3 h-3 transition-colors duration-300 ${
              isOpen ? 'text-green-600 dark:text-green-400' : 'text-gray-400'
            }`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div
          className={`absolute left-0 right-0 z-50 bg-gradient-to-br from-white/95 to-white/90 dark:from-gray-900/95 dark:to-gray-900/90 backdrop-blur-xl border border-gray-200/20 dark:border-gray-700/20 rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/40 overflow-hidden min-w-[200px] ${
            dropdownPosition === 'bottom' 
              ? 'top-full mt-2 animate-in slide-in-from-top-2 fade-in-0 zoom-in-95 duration-200' 
              : 'bottom-full mb-2 animate-in slide-in-from-bottom-2 fade-in-0 zoom-in-95 duration-200'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-2 space-y-1">
            {locales.map((locale) => {
              const isSelected = locale.code === currentLocale;
              
              return (
                <button
                  key={locale.code}
                  onClick={() => switchLocale(locale.code)}
                  disabled={isSelected}
                  className={`flex cursor-pointer items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500/20 disabled:cursor-default hover:scale-[1.02] active:scale-[0.98] ${
                    isSelected
                      ? 'bg-gradient-to-r from-green-500/12 to-yellow-500/8 text-green-600 dark:text-green-400 border border-green-500/20 shadow-lg shadow-green-500/10'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100/30 dark:hover:bg-gray-800/30 active:bg-gray-100/40 dark:active:bg-gray-800/40 border border-transparent hover:border-gray-200/20 dark:hover:border-gray-700/20'
                  }`}
                >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-lg flex-shrink-0" role="img" aria-hidden="true">
                        {locale.flag}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className={`font-medium truncate ${
                          isSelected ? 'text-green-600 dark:text-green-400' : ''
                        }`}>
                          {locale.label}
                        </div>
                        <div className={`text-xs opacity-70 truncate ${
                          isSelected ? 'text-green-600/80 dark:text-green-400/80' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {locale.nativeName}
                        </div>
                      </div>
                    </div>
                  
                  {isSelected && (
                    <div className="animate-in zoom-in-50 spin-in-12 duration-300">
                      <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
            
          
        </div>
      )}
    </div>
  );
};