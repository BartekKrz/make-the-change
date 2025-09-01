import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/app/globals.css'
import { Providers } from '@/app/providers'
import type { FC, PropsWithChildren } from 'react'

const inter = Inter({ subsets: ['latin'] })
export const metadata: Metadata = {
  title: 'Make the CHANGE - Plateforme Écologique',
  description: 'Investissez dans des projets écologiques et découvrez des produits durables',
  keywords: ['écologie', 'investissement', 'durable', 'environnement', 'projets verts'],
}

const RootLayout: FC<PropsWithChildren> = ({
  children,
}) =>  {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-background text-text">
            <main>{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  )
}

export default RootLayout
