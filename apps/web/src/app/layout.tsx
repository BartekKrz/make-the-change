import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Make the CHANGE - Plateforme Écologique',
  description: 'Investissez dans des projets écologiques et découvrez des produits durables',
  keywords: ['écologie', 'investissement', 'durable', 'environnement', 'projets verts'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-background text-text">
            <header className="border-b border-surface">
              <div className="container mx-auto px-4 py-4">
                <nav className="flex items-center justify-between">
                  <div className="text-xl font-bold text-primary">
                    Make the CHANGE
                  </div>
                  <div className="flex items-center space-x-4">
                    <a href="/shop" className="text-muted hover:text-text">
                      Boutique
                    </a>
                    <a href="/projects" className="text-muted hover:text-text">
                      Projets
                    </a>
                    <a href="/dashboard" className="text-muted hover:text-text">
                      Dashboard
                    </a>
                    <a href="/test" className="text-muted hover:text-text">
                      🧪 Test Auth
                    </a>
                  </div>
                </nav>
              </div>
            </header>
            <main>{children}</main>
            <footer className="border-t border-surface mt-12">
              <div className="container mx-auto px-4 py-8">
                <div className="text-center text-muted">
                  © 2025 Make the CHANGE. Plateforme écologique pour un avenir durable.
                </div>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  )
}
