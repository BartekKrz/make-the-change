# Dashboard Utilisateur - Site E-commerce

## 🎯 Objectif

Donner une vue d'ensemble de l'impact, des points, des investissements et de l'activité de l'utilisateur sur la plateforme Make the CHANGE.

## 👤 Utilisateurs Cibles

- **Utilisateurs connectés** : Page d'accueil après login
- **Tous personas** : Vue synthétique de leur parcours
- **Focus engagement** : Encourager davantage d'actions

## 🎨 Design & Layout

### Structure de Page

```text
[Header Global]
├── Welcome Header
├── KPIs Grid (4 cartes)
├── Section Mes Projets Soutenus
├── Section Mes Commandes Récentes
├── Section Recommandations
└── [Footer Global]
```

### Welcome Header

```jsx
<div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-12">
  <div className="container mx-auto px-4">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-4xl font-bold mb-2">
          Bonjour {user.firstName} ! 👋
        </h1>
        <p className="text-green-100 text-lg">
          Voici votre impact sur la biodiversité
        </p>
      </div>
      <div className="hidden md:block">
        <div className="text-right">
          <p className="text-green-100 text-sm">Membre depuis</p>
          <p className="text-xl font-semibold">
            {formatDate(user.created_at, 'MMMM yyyy')}
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
```

### KPIs Grid

```jsx
<div className="container mx-auto px-4 -mt-8 mb-12">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {/* Solde Points */}
    <Card className="shadow-lg border-0">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">
              Solde Points
            </p>
            <p className="text-3xl font-bold text-slate-900">
              {user.points_balance}
            </p>
            <p className="text-sm text-green-600 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +{monthlyPointsEarned} ce mois
            </p>
          </div>
          <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <Coins className="h-6 w-6 text-yellow-600" />
          </div>
        </div>
        <div className="mt-4">
          <Button size="sm" variant="outline" className="w-full" asChild>
            <Link href="/produits">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Utiliser mes points
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>

    {/* Total Contribué */}
    <Card className="shadow-lg border-0">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">
              Total Contribué
            </p>
            <p className="text-3xl font-bold text-slate-900">
              €{totalInvested.toLocaleString()}
            </p>
            <p className="text-sm text-blue-600 flex items-center mt-1">
              <Heart className="w-3 h-3 mr-1" />
              {projectsSupported} projets soutenus
            </p>
          </div>
          <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Euro className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <div className="mt-4">
          <Button size="sm" variant="outline" className="w-full" asChild>
            <Link href="/projets">
              <TreePine className="w-4 h-4 mr-2" />
              Découvrir projets
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>

    {/* Impact Généré */}
    <Card className="shadow-lg border-0">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">
              Impact CO₂
            </p>
            <p className="text-3xl font-bold text-slate-900">
              {co2Impact}T
            </p>
            <p className="text-sm text-green-600 flex items-center mt-1">
              <Leaf className="w-3 h-3 mr-1" />
              compensées
            </p>
          </div>
          <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
            <TreePine className="h-6 w-6 text-green-600" />
          </div>
        </div>
        <div className="mt-4">
          <Button size="sm" variant="outline" className="w-full" asChild>
            <Link href="/dashboard/impact">
              <BarChart className="w-4 h-4 mr-2" />
              Voir détails
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>

    {/* Commandes */}
    <Card className="shadow-lg border-0">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">
              Commandes
            </p>
            <p className="text-3xl font-bold text-slate-900">
              {totalOrders}
            </p>
            <p className="text-sm text-purple-600 flex items-center mt-1">
              <Package className="w-3 h-3 mr-1" />
              {pendingOrders} en cours
            </p>
          </div>
          <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <ShoppingCart className="h-6 w-6 text-purple-600" />
          </div>
        </div>
        <div className="mt-4">
          <Button size="sm" variant="outline" className="w-full" asChild>
            <Link href="/dashboard/commandes">
              <Truck className="w-4 h-4 mr-2" />
              Suivre commandes
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</div>
```

### Section Mes Projets Soutenus

```jsx
<div className="container mx-auto px-4 mb-12">
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-2xl font-bold text-slate-900">
      Mes Projets Soutenus
    </h2>
    <Button variant="outline" asChild>
      <Link href="/dashboard/investissements">
        Voir tous
        <ArrowRight className="w-4 h-4 ml-2" />
      </Link>
    </Button>
  </div>

  {supportedProjects.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {supportedProjects.slice(0, 3).map((project) => (
        <Card key={project.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-0">
            <div className="aspect-video relative overflow-hidden rounded-t-lg">
              <img
                src={project.images[0]?.url}
                alt={project.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3">
                <Badge variant="success">
                  {project.funding_progress}% financé
                </Badge>
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-semibold text-slate-900 mb-2">
                {project.name}
              </h3>
              <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                {project.description}
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">
                  Votre contribution: €{project.user_investment}
                </span>
                <span className="text-green-600 font-medium">
                  +{project.points_earned} points
                </span>
              </div>
              <div className="mt-4">
                <Button size="sm" variant="outline" className="w-full" asChild>
                  <Link href={`/projets/${project.id}`}>
                    <Eye className="w-4 h-4 mr-2" />
                    Voir projet
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  ) : (
    <Card>
      <CardContent className="p-12 text-center">
        <TreePine className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Aucun projet soutenu
        </h3>
        <p className="text-slate-600 mb-6">
          Découvrez nos projets et commencez à faire la différence
        </p>
        <Button asChild>
          <Link href="/projets">
            Découvrir les projets
          </Link>
        </Button>
      </CardContent>
    </Card>
  )}
</div>
```

### Section Commandes Récentes

```jsx
<div className="container mx-auto px-4 mb-12">
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-2xl font-bold text-slate-900">
      Commandes Récentes
    </h2>
    <Button variant="outline" asChild>
      <Link href="/dashboard/commandes">
        Voir toutes
        <ArrowRight className="w-4 h-4 ml-2" />
      </Link>
    </Button>
  </div>

  {recentOrders.length > 0 ? (
    <Card>
      <CardContent className="p-0">
        {recentOrders.slice(0, 5).map((order, index) => (
          <div key={order.id}>
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-slate-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">
                    Commande #{order.id}
                  </p>
                  <p className="text-sm text-slate-500">
                    {order.items_count} articles • {order.total_points} points
                  </p>
                  <p className="text-xs text-slate-400">
                    {formatDate(order.created_at)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge 
                  variant={order.status === 'delivered' ? 'success' : 'default'}
                >
                  {getOrderStatusLabel(order.status)}
                </Badge>
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/dashboard/commandes/${order.id}`}>
                    <Eye className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
            {index < recentOrders.length - 1 && <Separator />}
          </div>
        ))}
      </CardContent>
    </Card>
  ) : (
    <Card>
      <CardContent className="p-12 text-center">
        <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Aucune commande
        </h3>
        <p className="text-slate-600 mb-6">
          Utilisez vos points pour commander des produits
        </p>
        <Button asChild>
          <Link href="/produits">
            Découvrir les produits
          </Link>
        </Button>
      </CardContent>
    </Card>
  )}
</div>
```

## 🔄 États & Interactions

### Données Dashboard

```typescript
interface DashboardData {
  user: {
    id: string;
    firstName: string;
    points_balance: number;
    created_at: Date;
  };
  
  metrics: {
    total_invested: number;
    projects_supported: number;
    co2_impact: number;
    total_orders: number;
    pending_orders: number;
    monthly_points_earned: number;
  };
  
  supported_projects: Project[];
  recent_orders: Order[];
  recommendations: Project[];
}
```

### Actions Rapides

```tsx
const dashboardActions = {
  // Navigation rapide
  goToProducts: () => router.push('/produits'),
  goToProjects: () => router.push('/projets'),
  viewAllOrders: () => router.push('/dashboard/commandes'),
  viewImpact: () => router.push('/dashboard/impact'),
  
  // Actions directes
  supportProject: (projectId: string) => router.push(`/projets/${projectId}`),
  trackOrder: (orderId: string) => router.push(`/dashboard/commandes/${orderId}`),
  
  // Gestion compte
  editProfile: () => router.push('/dashboard/profil'),
  contactSupport: () => router.push('/contact')
};
```

## 📡 API & Données

### Endpoints tRPC

```typescript
// Dashboard data
ecommerce.dashboard.getData: {
  input: { user_id: string };
  output: {
    user: UserProfile;
    metrics: DashboardMetrics;
    supported_projects: Project[];
    recent_orders: Order[];
    recommendations: Project[];
  };
}

// Actions rapides
ecommerce.dashboard.quickActions: {
  input: { action: 'invest' | 'order' | 'redeem'; data: any };
  output: { success: boolean; redirect_url?: string };
}
```

### Modèles de Données

```typescript
interface DashboardMetrics {
  total_invested: number;
  projects_supported: number;
  co2_impact: number;
  total_orders: number;
  pending_orders: number;
  monthly_points_earned: number;
  lifetime_points_earned: number;
  points_spent: number;
}

interface ProjectSummary {
  id: string;
  name: string;
  description: string;
  images: Image[];
  funding_progress: number;
  user_investment: number;
  points_earned: number;
  status: 'funding' | 'production' | 'completed';
}
```

## 📱 Responsive Design

### Mobile Optimization

```jsx
// Version mobile adaptée
<div className="px-4 py-6">
  {/* KPIs en 2x2 sur mobile */}
  <div className="grid grid-cols-2 gap-4 mb-8">
    <Card className="text-center">
      <CardContent className="p-4">
        <Coins className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
        <p className="text-2xl font-bold">{user.points_balance}</p>
        <p className="text-xs text-slate-500">Points</p>
      </CardContent>
    </Card>
    {/* Autres KPIs... */}
  </div>
  
  {/* Sections empilées sur mobile */}
  <div className="space-y-8">
    {/* Projets en carousel mobile */}
    <div>
      <h2 className="text-xl font-bold mb-4">Mes Projets</h2>
      <div className="overflow-x-auto">
        <div className="flex space-x-4 pb-4">
          {/* Cards projets... */}
        </div>
      </div>
    </div>
  </div>
</div>
```

## ✅ Validations & Sécurité

### Protection Route

```typescript
// Middleware dashboard
export const protectDashboard = async (req: NextRequest) => {
  const session = await getSession(req);
  
  if (!session?.user) {
    return redirect('/auth/login');
  }
  
  return session.user;
};
```

### Gestion Cache

```typescript
// Cache des données dashboard
const DASHBOARD_CACHE_TTL = 300; // 5 minutes

export const getDashboardData = cache(async (userId: string) => {
  const data = await fetchDashboardData(userId);
  return data;
}, DASHBOARD_CACHE_TTL);
```

## 📝 Tests Utilisateur

### Scénarios Critiques

1. **Chargement rapide** : Dashboard visible <2s
2. **Navigation intuitive** : Accès direct aux actions principales
3. **Données temps réel** : Métriques à jour
4. **Mobile friendly** : Expérience fluide sur mobile
5. **Actions rapides** : Raccourcis vers fonctionnalités clés

### Métriques Success

- **Temps de chargement** : <1.5s
- **Engagement** : >60% utilisent les raccourcis
- **Satisfaction** : >4.6/5
- **Retention** : +25% de retour dashboard
- **Conversion** : +15% d'actions depuis dashboard

---

**Stack Technique** : Vercel Edge Functions + shadcn/ui + tRPC + Cache Redis  
**Priorité** : 🔥 Critique - Point central utilisateur  
**Estimation** : 6-8 jours développement + optimisation performance
