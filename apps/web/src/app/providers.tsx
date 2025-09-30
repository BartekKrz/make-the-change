'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { ThemeProvider } from 'next-themes';
import { type FC, type PropsWithChildren, useState } from 'react';

import { trpc, trpcClient } from '@/lib/trpc';

const ReactQueryDevtools =
  process.env.NODE_ENV === 'development'
    ? dynamic(
        () =>
          import('@tanstack/react-query-devtools').then(m => ({
            default: m.ReactQueryDevtools,
          })),
        { ssr: false }
      )
    : ((() => null) as unknown as React.ComponentType<{
        initialIsOpen?: boolean;
      }>);

export const Providers: FC<PropsWithChildren> = ({ children }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 min - données considérées fraîches
            gcTime: 10 * 60 * 1000, // 10 min - cache en mémoire
            refetchOnWindowFocus: false, // Pas de refetch au focus (bon pour admin)
            refetchOnMount: false, // Pas de refetch si données fraîches
            refetchOnReconnect: 'always', // Refetch après reconnexion réseau
            networkMode: 'online', // Pause les queries si offline
            retry: (failureCount, error: any) => {
              // Ne pas retry les erreurs client (400-499)
              if (error?.status >= 400 && error?.status < 500) return false;
              if (error?.data?.httpStatus >= 400 && error?.data?.httpStatus < 500) return false;
              // Retry max 2 fois pour erreurs serveur/réseau
              return failureCount < 2;
            },
            retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30_000), // Backoff exponentiel
          },
          mutations: {
            retry: 1, // Une seule retry pour les mutations
            networkMode: 'online', // Pause les mutations si offline
          },
        },
      })
  );

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      disableTransitionOnChange={false}
      enableSystem={false}
      storageKey="make-the-change-theme"
      themes={['light', 'dark']}
    >
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          {children}
          {process.env.NODE_ENV === 'development' && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
        </QueryClientProvider>
      </trpc.Provider>
    </ThemeProvider>
  );
};
