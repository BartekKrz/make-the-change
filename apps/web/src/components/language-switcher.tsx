'use client';

import { useLocale, useTranslations } from 'next-intl';

import { useRouter, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

export function LanguageSwitcher() {
  const t = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: string) => {
    router.push(pathname, { locale: newLocale });
  };

  return (
    <div className="flex items-center gap-2">
      {routing.locales.map(loc => (
        <button
          key={loc}
          className={`rounded border px-2 py-1 text-sm ${
            locale === loc
              ? 'bg-primary text-primary-foreground'
              : 'bg-background text-foreground hover:bg-accent'
          }`}
          onClick={() => handleLocaleChange(loc)}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
