# Projets à Soutenir - Site E-commerce

## 🎯 Objectif

Permettre aux utilisateurs de découvrir les projets de biodiversité qu'ils peuvent soutenir en devenant membre de Make the CHANGE, en complément de l'app mobile.

## 👤 Utilisateurs Cibles

- **Visiteurs anonymes** : Peuvent voir les projets, incités à s'inscrire.
  - **Utilisateurs connectés** : Peuvent choisir un projet à soutenir via leur investissement.
- **Focus découverte** : Interface web optimisée pour exploration.

## 🎨 Design & Layout

### Structure de Page

```text
[Header Global]
├── Page Header (Titre + Filtres)
├── Stats Impact Global
├── Layout 2 Colonnes:
│   ├── Sidebar Filtres (25%)
│   └── Zone Projets (75%)
│       ├── Barre Actions (Tri + Vue)
│       ├── Grille Projets
│       └── Pagination
└── [Footer Global]
```

### Page Header avec Impact Global

```jsx
<div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-12">
  <div className="container mx-auto px-4">
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold mb-4">
        Projets de Biodiversité
      </h1>
      <p className="text-xl text-green-100 mb-6">
        Soutenez l'avenir de notre planète
      </p>
    </div>
    
    {/* Stats impact global */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
        <TreePine className="w-8 h-8 mx-auto mb-2 text-green-200" />
        <p className="text-2xl font-bold">{totalProjects}</p>
        <p className="text-green-100 text-sm">Projets actifs</p>
      </div>
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
        <Euro className="w-8 h-8 mx-auto mb-2 text-blue-200" />
        <p className="text-2xl font-bold">€{totalFunding.toLocaleString()}</p>
        <p className="text-blue-100 text-sm">Fonds alloués</p>
      </div>
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
        <Users className="w-8 h-8 mx-auto mb-2 text-purple-200" />
        <p className="text-2xl font-bold">{totalMembers}</p>
        <p className="text-purple-100 text-sm">Membres</p>
      </div>
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
        <Leaf className="w-8 h-8 mx-auto mb-2 text-green-200" />
        <p className="text-2xl font-bold">{co2Offset}T</p>
        <p className="text-green-100 text-sm">CO₂ compensé</p>
      </div>
    </div>
  </div>
</div>
```

### Filtres Sidebar

```jsx
<aside className="w-80 p-6 bg-white border-r">
  <div className="space-y-6">
    <div>
      <h3 className="font-semibold text-slate-900 mb-3">Recherche</h3>
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Rechercher un projet..."
          value={searchQuery}
          onChange={setSearchQuery}
          className="pl-10"
        />
      </div>
    </div>

    <Separator />

    <div>
      <h3 className="font-semibold text-slate-900 mb-3">Statut</h3>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="funding" 
            checked={filters.status.includes('funding')}
            onCheckedChange={(checked) => toggleFilter('status', 'funding', checked)}
          />
          <label htmlFor="funding" className="text-sm flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            Recherche de soutien
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="production" 
            checked={filters.status.includes('production')}
            onCheckedChange={(checked) => toggleFilter('status', 'production', checked)}
          />
          <label htmlFor="production" className="text-sm flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            En production
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="completed" 
            checked={filters.status.includes('completed')}
            onCheckedChange={(checked) => toggleFilter('status', 'completed', checked)}
          />
          <label htmlFor="completed" className="text-sm flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
            Terminé
          </label>
        </div>
      </div>
    </div>

    <Separator />

    <div>
      <h3 className="font-semibold text-slate-900 mb-3">Type de Projet</h3>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox id="apiculture" />
          <label htmlFor="apiculture" className="text-sm">🐝 Apiculture</label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="agriculture" />
          <label htmlFor="agriculture" className="text-sm">🌱 Agriculture</label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="forestry" />
          <label htmlFor="forestry" className="text-sm">🌳 Foresterie</label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="conservation" />
          <label htmlFor="conservation" className="text-sm">🦋 Conservation</label>
        </div>
      </div>
    </div>

    <Separator />

    <div>
      <h3 className="font-semibold text-slate-900 mb-3">Région</h3>
      <Select value={filters.region} onValueChange={(value) => setFilters({...filters, region: value})}>
        <SelectTrigger>
          <SelectValue placeholder="Toutes les régions" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes les régions</SelectItem>
          <SelectItem value="provence">Provence-Alpes-Côte d'Azur</SelectItem>
          <SelectItem value="occitanie">Occitanie</SelectItem>
          <SelectItem value="auvergne">Auvergne-Rhône-Alpes</SelectItem>
          <SelectItem value="nouvelle_aquitaine">Nouvelle-Aquitaine</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div className="pt-4">
      <Button variant="outline" onClick={resetFilters} className="w-full">
        <X className="w-4 h-4 mr-2" />
        Réinitialiser
      </Button>
    </div>
  </div>
</aside>
```

### Barre d'Actions et Tri

```jsx
<div className="flex justify-between items-center mb-6">
  <div className="flex items-center space-x-4">
    <p className="text-slate-600">
      {filteredProjects.length} projet{filteredProjects.length > 1 ? 's' : ''} trouvé{filteredProjects.length > 1 ? 's' : ''}
    </p>
    {activeFiltersCount > 0 && (
      <Badge variant="secondary">
        {activeFiltersCount} filtre{activeFiltersCount > 1 ? 's' : ''}
      </Badge>
    )}
  </div>
  
  <div className="flex items-center space-x-4">
    <Select value={sortBy} onValueChange={setSortBy}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Trier par" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="newest">Plus récents</SelectItem>
        <SelectItem value="funding_progress">Progression financement</SelectItem>
        <SelectItem value="alphabetical">Ordre alphabétique</SelectItem>
        <SelectItem value="ending_soon">Se termine bientôt</SelectItem>
      </SelectContent>
    </Select>
    
    <ToggleGroup type="single" value={viewMode} onValueChange={setViewMode}>
      <ToggleGroupItem value="grid">
        <Grid3X3 className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="list">
        <List className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  </div>
</div>
```

### Card Projet (Vue Grid)

```jsx
<Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
  <CardContent className="p-0">
    {/* Image */}
    <div className="aspect-video relative overflow-hidden">
      <img
        src={project.images[0]?.url}
        alt={project.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      
      {/* Badges overlay */}
      <div className="absolute top-3 left-3 space-y-2">
        <Badge variant={getStatusVariant(project.status)}>
          {getStatusLabel(project.status)}
        </Badge>
        {project.is_featured && (
          <Badge variant="default">
            <Star className="w-3 h-3 mr-1" />
            Coup de cœur
          </Badge>
        )}
      </div>
      
      {/* Progress overlay */}
      <div className="absolute bottom-3 right-3">
        <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
          <span className="text-sm font-medium text-slate-900">
            {project.funding_progress}%
          </span>
        </div>
      </div>
    </div>
    
    {/* Contenu */}
    <div className="p-6">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-slate-900 line-clamp-1">
            {project.name}
          </h3>
          <div className="flex items-center text-sm text-slate-500">
            <MapPin className="w-3 h-3 mr-1" />
            {project.location.region}
          </div>
        </div>
        <p className="text-slate-600 text-sm line-clamp-2 mb-3">
          {project.description}
        </p>
      </div>
      
      {/* Métriques */}
      <div className="space-y-3 mb-4">
        {/* Barre de progression */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-600">Financement</span>
            <span className="font-medium">
              €{project.current_funding.toLocaleString()} / €{project.funding_goal.toLocaleString()}
            </span>
          </div>
          <Progress value={project.funding_progress} className="h-2" />
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-semibold text-slate-900">
              {project.supporters_count}
            </p>
            <p className="text-xs text-slate-500">Membres</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-900">
              {project.estimated_co2_offset}T
            </p>
            <p className="text-xs text-slate-500">CO₂ compensé</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-900">
              {project.duration_months}
            </p>
            <p className="text-xs text-slate-500">Mois</p>
          </div>
        </div>
      </div>
      
      {/* Producteur */}
      <div className="flex items-center space-x-3 mb-4">
        <Avatar className="h-8 w-8">
          <AvatarImage src={project.producer.avatar} />
          <AvatarFallback>{project.producer.name.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium text-slate-900">
            {project.producer.name}
          </p>
          <div className="flex items-center">
            <Star className="w-3 h-3 text-yellow-500 fill-current" />
            <span className="text-xs text-slate-500 ml-1">
              {project.producer.rating}/5
            </span>
          </div>
        </div>
      </div>
      
      {/* Actions */}
      <div className="space-y-2">
        <Button className="w-full" asChild>
          <Link href={`/projets/${project.id}`}>
            <Eye className="w-4 h-4 mr-2" />
            Découvrir le projet
          </Link>
        </Button>
      </div>
    </div>
  </CardContent>
</Card>
```

## 🔄 États & Interactions

### États Projets

```typescript
type ProjectStatus = 
  | 'funding'      // Recherche de soutien
  | 'production'   // En cours de production
  | 'completed'    // Terminé avec succès
  | 'cancelled';   // Annulé

interface ProjectFilters {
  search: string;
  status: ProjectStatus[];
  type: string[];
  region: string;
  funding_progress: number;
}
```

### Actions Utilisateur

```tsx
const projectActions = {
  // Navigation
  viewProject: (id: string) => router.push(`/projets/${id}`),
  subscribeToSupport: (id: string) => router.push(`/abonnements?project=${id}`),
  
  // Filtres
  updateFilters: (newFilters: Partial<ProjectFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    updateURL(newFilters);
  },
  resetFilters: () => setFilters(defaultFilters),
  
  // Tri et vue
  changeSorting: (sortBy: string) => setSortBy(sortBy),
  toggleView: (mode: 'grid' | 'list') => setViewMode(mode),
  
  // Actions rapides
  saveProject: (id: string) => toggleFavorite(id),
  shareProject: (id: string) => shareOnSocial(id)
};
```

## 📡 API & Données

### Endpoints tRPC

```typescript
// Liste projets avec filtres
ecommerce.projects.list: {
  input: {
    page: number;
    limit: number;
    filters: ProjectFilters;
    sort_by: string;
  };
  output: {
    projects: Project[];
    total: number;
    global_stats: GlobalStats;
    filters_count: number;
  };
}

// Stats globales
ecommerce.projects.globalStats: {
  output: {
    total_projects: number;
    total_funding: number;
    total_members: number;
    co2_offset: number;
  };
}

// Suggestions basées sur l'historique
ecommerce.projects.recommendations: {
  input: { user_id?: string };
  output: { recommended_projects: Project[] };
}
```

### Modèles de Données

```typescript
interface Project {
  id: string;
  name: string;
  description: string;
  images: Image[];
  status: ProjectStatus;
  type: string;
  location: {
    region: string;
    coordinates: [number, number];
  };
  
  // Financement
  funding_goal: number;
  current_funding: number;
  funding_progress: number;
  supporters_count: number;
  
  // Impact
  estimated_co2_offset: number;
  duration_months: number;
  
  // Producteur
  producer: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
  };
  
  // Métadonnées
  is_featured: boolean;
  created_at: Date;
  funding_deadline: Date;
}

interface GlobalStats {
  total_projects: number;
  total_funding: number;
  total_members: number;
  co2_offset: number;
}
```

## 📱 Responsive Design

### Mobile Optimization

```jsx
// Version mobile avec cards simplifiées
<div className="grid grid-cols-1 gap-6">
  {projects.map(project => (
    <Card key={project.id} className="overflow-hidden">
      <div className="flex">
        <div className="w-32 h-32 flex-shrink-0">
          <img
            src={project.images[0]?.url}
            alt={project.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 p-4">
          <h3 className="font-semibold text-sm line-clamp-2 mb-2">
            {project.name}
          </h3>
          <div className="flex items-center justify-between mb-2">
            <Badge size="sm" variant={getStatusVariant(project.status)}>
              {getStatusLabel(project.status)}
            </Badge>
            <span className="text-sm font-medium">
              {project.funding_progress}%
            </span>
          </div>
          <Progress value={project.funding_progress} className="h-1 mb-2" />
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500">
              €{project.current_funding.toLocaleString()}
            </span>
            <Button size="sm" asChild>
              <Link href={`/projets/${project.id}`}>Voir</Link>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  ))}
</div>
```

## ✅ Validations & Performance

### Optimisations

```typescript
// Pagination et lazy loading
const PROJECTS_PER_PAGE = 12;

// Cache des données fréquentes
const cachedGlobalStats = cache(() => getGlobalStats(), 300); // 5min

// Search avec debounce
const debouncedSearch = useDebounce(searchQuery, 300);

// Images lazy loading
const optimizedImages = {
  loading: 'lazy',
  sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
};
```

### SEO & Métadonnées

```typescript
// Génération métadonnées dynamiques
export const generateMetadata = ({ searchParams }: Props): Metadata => {
  const filters = parseFilters(searchParams);
  
  return {
    title: `Projets de Biodiversité${filters.type ? ` - ${filters.type}` : ''} | Make the CHANGE`,
    description: 'Découvrez et soutenez des projets de biodiversité qui font la différence.',
    keywords: ['biodiversité', 'soutien', 'environnement', 'apiculture', 'agriculture', 'investissement écologique'],
  };
};
```

## 📝 Tests Utilisateur

### Scénarios Critiques

1. **Navigation fluide** : Filtres réactifs <500ms
2. **Découverte efficace** : Trouver projet pertinent <2min
3. **Mobile friendly** : Expérience optimisée tablette/mobile
4. **Performance** : Chargement <2s avec 50+ projets
5. **Conversion** : Transition vers le tunnel d'investissement fluide

### Métriques Success

- **Temps de chargement** : <1.8s
- **Taux conversion** : >8% vers page détail
- **Engagement filtres** : >40% utilisent filtres
- **Mobile usage** : >50% du trafic
- **Satisfaction** : >4.5/5

---

**Stack Technique** : Vercel Edge Functions + shadcn/ui + tRPC + Search Algolia  
**Priorité** : 🔥 Critique - Cœur découverte projets  
**Estimation** : 8-10 jours développement + optimisation search
