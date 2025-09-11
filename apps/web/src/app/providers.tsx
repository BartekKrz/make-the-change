'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import dynamic from 'next/dynamic'
import { ThemeProvider } from 'next-themes'
import { type FC, type PropsWithChildren, useState } from 'react'

import { trpc, trpcClient } from '@/lib/trpc'

const ReactQueryDevtools =
  process.env.NODE_ENV === 'development'
    ? dynamic(() => import('@tanstack/react-query-devtools').then(m => ({ default: m.ReactQueryDevtools })), { ssr: false })
    : (() => null) as unknown as React.ComponentType<{ initialIsOpen?: boolean }>

export const Providers: FC<PropsWithChildren> = ({children}) => {
  
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            gcTime: 10 * 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  )

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
  )
}
