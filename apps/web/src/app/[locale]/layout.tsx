import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

import { Providers } from '@/app/providers';
import { routing } from '@/i18n/routing';

import type { FC, PropsWithChildren } from 'react';

type LocaleLayoutProps = PropsWithChildren<{
  params: Promise<{ locale: string }>;
}>;

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

const LocaleLayout: FC<LocaleLayoutProps> = async ({ children, params }) => {
  const { locale } = await params;

  // Vérifier que la locale est supportée
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Récupérer les messages pour cette locale
  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider messages={messages}>
      <Providers>
        <div className="bg-background text-text min-h-screen">
          <main>{children}</main>
        </div>
      </Providers>
    </NextIntlClientProvider>
  );
};

export default LocaleLayout;
