'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/[locale]/admin/(dashboard)/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

const AdminDashboardPage = () => {
  const { user, loading, signOut: _signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-primary h-32 w-32 animate-spin rounded-full border-b-2" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">
            Redirection vers la page de connexion...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="safe-bottom h-full overflow-auto px-4 py-4 md:px-6 md:py-6">
      {}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm md:text-base">
              Utilisateurs Actifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-primary bg-clip-text text-2xl font-semibold text-transparent md:text-3xl">
              1,247
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm md:text-base">
              Revenus Mensuels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-accent bg-clip-text text-2xl font-semibold text-transparent md:text-3xl">
              €12,847
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm md:text-base">Conversions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-foreground text-2xl font-semibold md:text-3xl">
              24.57%
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm md:text-base">
              Projets Actifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-success text-2xl font-semibold md:text-3xl">
              42
            </div>
          </CardContent>
        </Card>
      </div>

      {}
      <div className="mt-6 md:mt-8">
        <Card className="glass-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg md:text-xl">
              Actions Rapides
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-4">
              <Button
                asChild
                className="text-responsive h-12 md:h-10"
                variant="default"
              >
                <Link href="/admin/products">Gérer Produits</Link>
              </Button>
              <Button
                asChild
                className="text-responsive h-12 md:h-10"
                variant="accent"
              >
                <Link href="/admin/orders">Voir Commandes</Link>
              </Button>
              <Button
                asChild
                className="text-responsive h-12 md:h-10"
                variant="info"
              >
                <Link href="/admin/users">Utilisateurs</Link>
              </Button>
              <Button
                asChild
                className="text-responsive h-12 md:h-10"
                variant="outline"
              >
                <Link href="/demo-2025">Demo 2025</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
