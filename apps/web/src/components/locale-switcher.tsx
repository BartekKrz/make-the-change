'use client';
import { Globe, Check } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useTransition,
  type FC,
} from 'react';

type LocaleOption = {
  code: string;
  label: string;
  flag: string;
  nativeName: string;
};

const locales: LocaleOption[] = [
  { code: 'fr', label: 'Français', flag: '🇫🇷', nativeName: 'FR' },
  { code: 'en', label: 'English', flag: '🇺🇸', nativeName: 'EN' },
  { code: 'nl', label: 'Nederlands', flag: '🇳🇱', nativeName: 'NL' },
];

const DROPDOWN_HEIGHT = 200;

type CompactLocaleSwitcherProps = {
  className?: string;
};

export const LocaleSwitcher: FC<CompactLocaleSwitcherProps> = ({
  className,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<'top' | 'bottom'>(
    'bottom'
  );
  const [isPending, startTransition] = useTransition();

  const currentLocale = useMemo(
    () => pathname.split('/')[1] || 'fr',
    [pathname]
  );
  const currentLocaleData = useMemo(
    () => locales.find(locale => locale.code === currentLocale) || locales[0],
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

  const handleToggleOpen = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      if (!isOpen) {
        const rect = e.currentTarget.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;

        setDropdownPosition(spaceBelow >= DROPDOWN_HEIGHT ? 'bottom' : 'top');
      }

      setIsOpen(!isOpen);
    },
    [isOpen]
  );

  const switchLocale = useCallback(
    (newLocale: string) => {
      if (newLocale === currentLocale) return;

      const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '');
      const newUrl = `/${newLocale}${pathWithoutLocale}`;

      setIsOpen(false);
      startTransition(() => {
        router.push(newUrl);
      });
    },
    [currentLocale, pathname, router, startTransition]
  );

  if (!mounted) {
    return (
      <div
        className={`flex min-w-[120px] animate-pulse items-center gap-2 rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 dark:border-gray-700 dark:bg-gray-800 ${className || ''}`}
      >
        <Globe className="h-4 w-4 text-gray-400" />
        <div className="h-4 w-8 rounded bg-gray-300 dark:bg-gray-600" />
      </div>
    );
  }

  return (
    <div className={`relative ${className || ''}`}>
      <button
        aria-expanded={isOpen}
        aria-label="Changer de langue"
        className={`flex w-full min-w-[120px] cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-3 transition-all duration-300 hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-green-500/20 focus-visible:outline-none active:scale-[0.98] ${
          isOpen
            ? 'border-green-500/25 bg-gradient-to-r from-green-500/8 to-yellow-500/5 text-gray-900 shadow-lg shadow-green-500/10 dark:text-gray-100'
            : 'border-gray-200/15 bg-gradient-to-r from-gray-100/20 to-gray-100/10 text-gray-600 hover:border-gray-200/30 hover:from-gray-100/30 hover:to-gray-100/15 hover:text-gray-900 dark:border-gray-700/15 dark:from-gray-800/20 dark:to-gray-800/10 dark:text-gray-400 dark:hover:border-gray-700/30 dark:hover:from-gray-800/30 dark:hover:to-gray-800/15 dark:hover:text-gray-100'
        }`}
        onClick={handleToggleOpen}
      >
        <div className="flex min-w-0 items-center gap-2">
          <Globe
            className={`h-4 w-4 flex-shrink-0 transition-colors duration-300 ${
              isOpen
                ? 'text-green-600 dark:text-green-400'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          />
          <span
            className={`truncate text-sm font-medium transition-colors duration-300 ${
              isOpen ? 'text-green-600 dark:text-green-400' : ''
            }`}
          >
            {isPending ? '...' : currentLocaleData.nativeName}
          </span>
        </div>

        <div
          className={`flex-shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
        >
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            className={`h-3 w-3 transition-colors duration-300 ${
              isOpen ? 'text-green-600 dark:text-green-400' : 'text-gray-400'
            }`}
          >
            <path
              d="M19 9l-7 7-7-7"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 left-0 z-50 min-w-[200px] overflow-hidden rounded-2xl border border-gray-200/20 bg-gradient-to-br from-white/95 to-white/90 shadow-2xl shadow-black/10 backdrop-blur-xl dark:border-gray-700/20 dark:from-gray-900/95 dark:to-gray-900/90 dark:shadow-black/40 ${
            dropdownPosition === 'bottom'
              ? 'animate-in slide-in-from-top-2 fade-in-0 zoom-in-95 top-full mt-2 duration-200'
              : 'animate-in slide-in-from-bottom-2 fade-in-0 zoom-in-95 bottom-full mb-2 duration-200'
          }`}
          onClick={e => e.stopPropagation()}
        >
          <div className="space-y-1 p-2">
            {locales.map(locale => {
              const isSelected = locale.code === currentLocale;

              return (
                <button
                  key={locale.code}
                  disabled={isSelected}
                  className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-medium transition-all duration-200 hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-green-500/20 focus-visible:outline-none active:scale-[0.98] disabled:cursor-default ${
                    isSelected
                      ? 'border border-green-500/20 bg-gradient-to-r from-green-500/12 to-yellow-500/8 text-green-600 shadow-lg shadow-green-500/10 dark:text-green-400'
                      : 'border border-transparent text-gray-600 hover:border-gray-200/20 hover:bg-gray-100/30 hover:text-gray-900 active:bg-gray-100/40 dark:text-gray-400 dark:hover:border-gray-700/20 dark:hover:bg-gray-800/30 dark:hover:text-gray-100 dark:active:bg-gray-800/40'
                  }`}
                  onClick={() => switchLocale(locale.code)}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="flex-shrink-0 text-lg"
                      role="img"
                    >
                      {locale.flag}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div
                        className={`truncate font-medium ${
                          isSelected ? 'text-green-600 dark:text-green-400' : ''
                        }`}
                      >
                        {locale.label}
                      </div>
                      <div
                        className={`truncate text-xs opacity-70 ${
                          isSelected
                            ? 'text-green-600/80 dark:text-green-400/80'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        {locale.nativeName}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="animate-in zoom-in-50 spin-in-12 duration-300">
                      <Check className="h-4 w-4 flex-shrink-0 text-green-600 dark:text-green-400" />
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
