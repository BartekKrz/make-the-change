import { Inter } from 'next/font/google'

import type { Metadata } from 'next'
import '@/app/globals.css'
import type { FC, PropsWithChildren } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Make the CHANGE - Plateforme Écologique',
  description: 'Investissez dans des projets écologiques et découvrez des produits durables',
  keywords: ['écologie', 'investissement', 'durable', 'environnement', 'projets verts'],
}

const RootLayout: FC<PropsWithChildren> = ({
  children,
}) => (
  <html>
    <body className={inter.className}>
      {children}
    </body>
  </html>
)

export default RootLayout
