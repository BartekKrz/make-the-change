# 📊 Dashboard Principal Admin

**Vue d'ensemble complète des KPIs business et métriques opérationnelles de Make the CHANGE.**

## 🎯 Objectif

Fournir une vue synthétique en temps réel des performances de la plateforme pour une prise de décision rapide et éclairée.

## 👤 Utilisateurs Cibles

- **Directeurs** : Vision stratégique et KPIs business
- **Gestionnaires opérationnels** : Métriques opérationnelles quotidiennes
- **Analystes** : Données détaillées et tendances
- **Support** : Indicateurs de santé système

## 🎨 Design & Layout

### Structure Dashboard
```text
┌─────────────────────────────────────────────────────────────┐
│ Dashboard | Tableau de Bord               [Profile Menu ▼] │
├─────────────────────────────────────────────────────────────┤
│ 📊 KPIs Business (4 cartes principales)                    │
├─────────────────────────────────────────────────────────────┤
│ 📈 Graphiques Performances (2 colonnes)                    │
├─────────────────────────────────────────────────────────────┤
│ 🔔 Alertes & Actions | 📋 Dernières Activités              │
└─────────────────────────────────────────────────────────────┘
```

### Grid Layout Responsive
- **Desktop** : 4 colonnes pour KPIs, 2 colonnes pour graphiques
- **Tablet** : 2 colonnes pour KPIs, 1 colonne pour graphiques  
- **Mobile** : 1 colonne stack vertical

## 📱 Composants UI

### KPIs Principaux (4 Cards)

**1. Utilisateurs Actifs**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Membres</CardTitle>
    <CardDescription>Inscrits total</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="text-3xl font-bold">1,247</div>
    <Badge variant="success">+12% cette semaine</Badge>
  </CardContent>
</Card>
```

**2. Volume d'Abonnements**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Revenus Engagés</CardTitle>
    <CardDescription>Investissements + Abonnements (€)</CardDescription>
  </CardHeader>
  <CardContent>
    <div class="text-3xl font-bold">€89,450</div>
    <Badge variant="success">+€7,800 ce mois</Badge>
  </CardContent>
</Card>
```

**3. Points en Circulation**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Points Actifs</CardTitle>
    <CardDescription>Solde global utilisateurs</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="text-3xl font-bold">71,560 pts</div>
    <Badge variant="warning">-2,400 expiry 30j</Badge>
  </CardContent>
</Card>
```

**4. Commandes du Mois**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Commandes</CardTitle>
    <CardDescription>Ce mois-ci</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="text-3xl font-bold">156</div>
    <Badge variant="success">+23% vs mois dernier</Badge>
  </CardContent>
</Card>
```

### Graphiques Performances

**Évolution des Abonnements (recharts)**
```tsx
<Card className="col-span-2">
  <CardHeader>
    <CardTitle>Évolution des Revenus Engagés</CardTitle>
    <CardDescription>Investissements + Abonnements (€ par semaine)</CardDescription>
  </CardHeader>
  <CardContent>
    <LineChart data={revenueData}>
      <Line dataKey="amount" stroke="#8884d8" />
      <XAxis dataKey="week" />
      <YAxis />
    </LineChart>
  </CardContent>
</Card>
```

**Répartition Points Usage**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Usage Points</CardTitle>
    <CardDescription>Conversion par catégorie</CardDescription>
  </CardHeader>
  <CardContent>
    <PieChart data={pointsUsageData}>
      <Pie dataKey="value" nameKey="category" />
    </PieChart>
  </CardContent>
</Card>
```

### Alertes & Actions
```tsx
<Card>
  <CardHeader>
    <CardTitle>Alertes</CardTitle>
  </CardHeader>
  <CardContent>
    <Alert variant="warning">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        47 utilisateurs ont des points expirant dans 7 jours
      </AlertDescription>
    </Alert>
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        Stock miel lavande critique (3 unités restantes)
      </AlertDescription>
    </Alert>
  </CardContent>
</Card>
```

### Activités Récentes
```tsx
<Card>
  <CardHeader>
    <CardTitle>Dernières Activités</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-2">
      <div className="flex items-center">
        <Avatar className="h-8 w-8">
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="ml-2">
          <p class="text-sm">Claire N. est devenue Protectrice en investissant dans un projet de ruche.</p>
          <p className="text-xs text-muted-foreground">Il y a 2h</p>
        </div>
      </div>
      // ... autres activités
    </div>
  </CardContent>
</Card>
```

## 🔄 États & Interactions

### Auto-refresh
- **Intervalle** : 30 secondes pour KPIs critiques
- **Background** : Mise à jour sans interruption UX
- **Indicators** : Dot vert = données fresh, rouge = stale

### Interactions
- **Click KPI Card** : Navigation vers page détaillée
- **Hover graphiques** : Tooltips avec données précises
- **Click alerte** : Action directe (ex: voir utilisateurs expiry)

### États de Chargement
```tsx
// Skeleton pour KPIs
<Card>
  <CardHeader>
    <Skeleton className="h-4 w-20" />
    <Skeleton className="h-3 w-32" />
  </CardHeader>
  <CardContent>
    <Skeleton className="h-8 w-16" />
    <Skeleton className="h-4 w-24" />
  </CardContent>
</Card>
```

## 📡 API & Données

### Routes tRPC Principales
```typescript
// Dashboard global data
admin.analytics.dashboard: {
  users: {
    total: number;
    growth_weekly: number;
    active_30d: number;
  };
  revenue: {
    total_amount: number; // investments + subscriptions
    investments_amount: number;
    subscriptions_amount: number;
    growth_monthly: number;
  };
  points: {
    total_circulation: number;
    expiring_30d: number;
    conversion_rate: number;
  };
  orders: {
    monthly_count: number;
    growth_monthly: number;
    avg_value: number;
  };
}

// Charts data
admin.analytics.revenue_chart: {
  week: string;
  investments: number;
  subscriptions: number;
}[]

admin.analytics.points_usage: {
  category: string;
  value: number;
  percentage: number;
}[]

// Alerts data
admin.alerts.dashboard: {
  type: 'warning' | 'error' | 'info';
  message: string;
  action_url?: string;
  count?: number;
}[]

// Recent activities
admin.activities.recent: {
  id: string;
  type: 'user_signup' | 'investment' | 'subscription' | 'order' | 'production';
  description: string;
  user?: { name: string; avatar?: string };
  timestamp: Date;
}[]
```

### Cache Strategy
- **Dashboard data** : Cache 30s avec invalidation manuelle
- **Charts** : Cache 5min avec background refresh
- **Activities** : Real-time avec WebSocket (Phase 2)

## ✅ Validations

### Contraintes Business
- **Permissions** : Admin, Manager, Analyst minimum
- **Data freshness** : Alertes si données >5min
- **Performance** : Dashboard complet <2s

### Calculs KPIs
```typescript
// Croissance hebdomadaire utilisateurs
growth_weekly = ((users_this_week - users_last_week) / users_last_week) * 100

// Taux conversion points
conversion_rate = (points_used_monthly / points_generated_monthly) * 100

// Points expiry warning
expiring_points = points WHERE expiry_date BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 30 DAY)
```

## 🚨 Gestion d'Erreurs

### Fallbacks UI
```tsx
// En cas d'erreur API
<Card>
  <CardContent className="flex items-center justify-center h-24">
    <div className="text-center">
      <AlertTriangle className="h-6 w-6 text-yellow-500 mx-auto" />
      <p className="text-sm text-muted-foreground mt-2">
        Impossible de charger les données
      </p>
      <Button variant="outline" size="sm" onClick={retry}>
        Réessayer
      </Button>
    </div>
  </CardContent>
</Card>
```

### Alertes Système
- **API down** : Banner d'avertissement global
- **Données incomplètes** : Badges "estimation" sur KPIs
- **Performance lente** : Message d'info temporaire

## 🔗 Navigation

### Actions Rapides depuis Dashboard
```typescript
const quickActions = {
  'Nouveau projet': '/admin/projects/new',
  'Traiter commandes': '/admin/orders?status=pending',
  'Utilisateurs récents': '/admin/users?sort=created_desc',
  'Points expirant': '/admin/points?expiring=30d',
  'Analytics complets': '/admin/analytics'
};
```

### Deep Links
- **KPI Cards** : Click → Page détaillée correspondante
- **Alertes** : Click → Action directe ou page de résolution
- **Activités** : Click → Détail de l'activité

## 📝 Tests Utilisateur

### Scénarios Critiques
1. **Charge initiale** : Dashboard complet <2s
2. **Refresh data** : Mise à jour sans flash/reload
3. **Navigation** : Retour dashboard = état préservé
4. **Responsive** : Toutes tailles écran fonctionnelles
5. **Offline** : Fallbacks appropriés

### KPIs de Performance
- **Time to Interactive** : <1.5s
- **Data accuracy** : 100% cohérence avec DB
- **Refresh rate** : 30s max pour données critiques
- **Error rate** : <0.1% requêtes API

## 💾 Stockage Local

### Préférences Dashboard
```typescript
interface DashboardPrefs {
  refreshInterval: 30 | 60 | 120; // secondes
  defaultTimeRange: '7d' | '30d' | '90d';
  favoriteKPIs: string[];
  layoutMode: 'compact' | 'detailed';
  autoRefresh: boolean;
}
```

### Cache Local
- **KPIs data** : 30s cache avec timestamp
- **Chart data** : 5min cache background update
- **User prefs** : Persistent localStorage

---

**Stack Technique** : Next.js 15.5 (App Router) sur Vercel + Recharts + TanStack Query + shadcn/ui  
**Priorité** : 🔥 Critique - Page principale admin  
**Estimation** : 5-7 jours développement + intégration APIs
