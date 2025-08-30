# Mes Investissements & Mon Impact - Site E-commerce

## 🎯 Objectif

Permettre aux membres de suivre leurs investissements dans des projets spécifiques (ruches, oliviers, etc.), de visualiser l'impact généré par leurs contributions et d'accéder aux détails de chaque projet soutenu.

## 👤 Utilisateurs Cibles

- **Protecteurs & Ambassadeurs** : Utilisateurs ayant réalisé au moins un investissement.
- **Tous personas** : Suivi transparent de l'impact de chaque projet soutenu.
- **Focus retention** : Démontrer la valeur générée par les investissements pour encourager le ré-investissement ou l'upgrade vers le statut d'Ambassadeur.

## 🎨 Design & Layout

### Structure de Page

```text
[Header Global]
├── Page Header (Stats globales)
├── Filtres & Actions
├── Liste des Abonnements/Projets Soutenus
│   ├── Card par Abonnement/Projet
│   └── Détails expandables
├── Section Impact Global
└── [Footer Global]
```

### Page Header avec Métriques

```jsx
<div class="bg-gradient-to-r from-green-600 to-blue-600 text-white py-12">
  <div class="container mx-auto px-4">
    <div class="mb-8">
      <h1 class="text-4xl font-bold mb-2">Mes Investissements & Mon Impact</h1>
      <p class="text-green-100 text-lg">
        Suivez l'impact de vos contributions à la biodiversité.
      </p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6">
        <div class="flex items-center">
          <div class="flex-1">
            <p class="text-white/80 text-sm mb-1">Total Contribué</p>
            <p class="text-3xl font-bold">€{totalContributed.toLocaleString()}</p>
            <p class="text-green-200 text-xs flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              Niveau {userLevel}
            </p>
          </div>
          <Euro className="w-8 h-8 text-white/60" />
        </div>
      </div>
      
      <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6">
        <div class="flex items-center">
          <div class="flex-1">
            <p class="text-white/80 text-sm mb-1">Projets Soutenus</p>
            <p className="text-3xl font-bold">{projectsCount}</p>
            <p class="text-blue-200 text-xs flex items-center mt-1">
              <TreePine className="w-3 h-3 mr-1" />
              {activeProjectsCount} en cours
            </p>
          </div>
          <Heart className="w-8 h-8 text-white/60" />
        </div>
      </div>
      
      <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6">
        <div class="flex items-center">
          <div class="flex-1">
            <p class="text-white/80 text-sm mb-1">Points Reçus</p>
            <p className="text-3xl font-bold">{totalPointsEarned}</p>
            <p className="text-yellow-200 text-xs flex items-center mt-1">
              <Coins className="w-3 h-3 mr-1" />
              {pointsBalance} disponibles
            </p>
          </div>
          <Zap className="w-8 h-8 text-white/60" />
        </div>
      </div>
      
      <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6">
        <div class="flex items-center">
          <div class="flex-1">
            <p class="text-white/80 text-sm mb-1">Impact CO₂</p>
            <p className="text-3xl font-bold">{totalCO2Offset}T</p>
            <p className="text-green-200 text-xs flex items-center mt-1">
              <Leaf className="w-3 h-3 mr-1" />
              compensées
            </p>
          </div>
          <Leaf className="w-8 h-8 text-white/60" />
        </div>
      </div>
    </div>
  </div>
</div>
```

### Filtres et Actions

```jsx
<div class="container mx-auto px-4 -mt-8 mb-8">
  <Card className="shadow-lg">
    <CardContent className="p-6">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div class="flex flex-wrap gap-4">
          <div class="flex items-center space-x-2">
            <Search className="w-4 h-4 text-slate-400" />
            <Input
              placeholder="Rechercher un projet..."
              value={searchQuery}
              onChange={setSearchQuery}
              className="w-64"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Statut Investissement" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="active">Actif</SelectItem>
              <SelectItem value="expired">Expiré</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Plus récents</SelectItem>
              <SelectItem value="oldest">Plus anciens</SelectItem>
              <SelectItem value="projectType">Type de projet</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div class="flex space-x-2">
          <Button variant="outline" onClick={exportInvestments}>
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          <Button variant="outline" onClick={generateImpactReport}>
            <FileText className="w-4 h-4 mr-2" />
            Rapport d'impact
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
</div>
```

### Liste des Investissements

```jsx
<div class="container mx-auto px-4 mb-12">
  {investments.length > 0 ? (
    <div class="space-y-6">
      {investments.map((inv) => (
        <Card key={inv.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {inv.projectName} - {inv.investmentType}
                </h3>
                <div class="flex items-center space-x-4 text-sm text-slate-500">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Investissement du {formatDate(inv.investmentDate)}
                  </span>
                </div>
              </div>
              <Badge variant={inv.status === 'active' ? 'success' : 'secondary'}>
                {inv.status}
              </Badge>
            </div>
            
            {/* Métriques de l'investissement */}
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div class="text-center p-3 bg-green-50 rounded-lg">
                <p class="text-sm text-slate-600">Votre contribution</p>
                <p className="text-xl font-bold text-green-700">
                  €{inv.amount}
                </p>
              </div>
              <div class="text-center p-3 bg-yellow-50 rounded-lg">
                <p class="text-sm text-slate-600">Points Reçus</p>
                <p className="text-xl font-bold text-yellow-700">
                  {inv.pointsGenerated}
                </p>
              </div>
              <div class="text-center p-3 bg-blue-50 rounded-lg">
                <p class="text-sm text-slate-600">Bonus</p>
                <p className="text-xl font-bold text-blue-700">
                  +{inv.bonusPercentage}%
                </p>
              </div>
              <div class="text-center p-3 bg-purple-50 rounded-lg">
                <p class="text-sm text-slate-600">Suivi</p>
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/projects/${inv.projectSlug}/updates`}>
                    Voir les nouvelles
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
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          Aucun investissement pour le moment
        </h3>
        <p className="text-slate-600 mb-6">
          Soutenez un projet pour commencer à suivre votre impact.
        </p>
        <Button asChild>
          <Link href="/projects">
            <Heart className="w-4 h-4 mr-2" />
            Découvrir les projets
          </Link>
        </Button>
      </CardContent>
    </Card>
  )}
</div>
```

## 🔄 États & Interactions

### Données d'Investissement

```typescript
interface UserInvestment {
  id: string;
  userId: string;
  projectId: string;
  projectName: string;
  projectSlug: string;
  investmentType: string; // 'ruche', 'olivier', etc.
  amount: number;
  pointsGenerated: number;
  bonusPercentage: number;
  status: 'active' | 'expired';
  investmentDate: Date;
}

interface ImpactStats {
  totalContributed: number;
  totalPointsEarned: number;
  projectsSupportedCount: number;
  activeInvestmentsCount: number;
  totalCo2Offset: number;
  treesPlanted: number;
  waterSaved: number;
  jobsSupported: number;
  biodiversityScore: number;
}
```

## 📡 API & Données

### Endpoints tRPC

```typescript
// Liste des investissements utilisateur (standardisé tRPC)
investments.list: {
  input: {
    page?: number;
    limit?: number;
    status?: 'active' | 'expired' | 'cancelled';
    search?: string;
    sort?: 'newest' | 'oldest' | 'project_type';
  };
  output: Paginated<UserInvestment> & { meta?: { stats?: ImpactStats } };
}

// Statistiques d'impact (utilisateur)
investments.analytics: {
  input: { from?: Date; to?: Date };
  output: ImpactStats;
}

// Export des données investissements
analytics.export: {
  input: { format: 'csv' | 'xlsx' | 'pdf'; report: 'investments' };
  output: { jobId: string; status: 'queued' | 'running' | 'completed' | 'failed'; downloadUrl?: string };
}
```

## 📝 Tests Utilisateur

### Scénarios Critiques

1. **Vue d'ensemble claire** : Métriques d'impact et d'investissement visibles en <2s
2. **Suivi détaillé** : Informations complètes par investissement
3. **Export facile** : Génération rapports/certificats
4. **Navigation fluide** : Accès détails projets soutenus
5. **Mobile friendly** : Interface optimisée mobile

### Métriques Success

- **Temps de chargement** : <2s pour 10 investissements
- **Engagement** : >70% consultent détails de l'impact
- **Export usage** : >15% téléchargent rapports
- **Taux de ré-investissement** : >30% des utilisateurs ré-investissent dans un nouveau projet
- **Satisfaction** : >4.6/5
