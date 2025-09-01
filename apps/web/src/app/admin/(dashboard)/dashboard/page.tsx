"use client"

import Link from 'next/link'
import { useEffect } from 'react'
import { FC } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/admin/(dashboard)/components/ui/card'
import { Button } from '@/app/admin/(dashboard)/components/ui/button'

const AdminDashboardPage = () => {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login')
    }
  }, [user, loading, router])

  const handleSignOut = async () => {
    await signOut()
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirection vers la page de connexion...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto px-4 md:px-6 py-4 md:py-6 safe-bottom">
      {}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm md:text-base">Utilisateurs Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-semibold bg-gradient-primary bg-clip-text text-transparent">1,247</div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm md:text-base">Revenus Mensuels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-semibold bg-gradient-accent bg-clip-text text-transparent">€12,847</div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm md:text-base">Conversions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-semibold text-foreground">24.57%</div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm md:text-base">Projets Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-semibold text-success">42</div>
          </CardContent>
        </Card>
      </div>

      {}
      <div className="mt-6 md:mt-8">
        <Card className="glass-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg md:text-xl">Actions Rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <Button asChild variant="default" className="h-12 md:h-10 text-responsive">
                <Link href="/admin/products">Gérer Produits</Link>
              </Button>
              <Button asChild variant="accent" className="h-12 md:h-10 text-responsive">
                <Link href="/admin/orders">Voir Commandes</Link>
              </Button>
              <Button asChild variant="info" className="h-12 md:h-10 text-responsive">
                <Link href="/admin/users">Utilisateurs</Link>
              </Button>
              <Button asChild variant="outline" className="h-12 md:h-10 text-responsive">
                <Link href="/demo-2025">Demo 2025</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminDashboardPage
