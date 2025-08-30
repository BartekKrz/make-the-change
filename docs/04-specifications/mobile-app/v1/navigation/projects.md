# Projets - Navigation Adaptative par Niveau

> **💡 RÉFÉRENCE** : Voir [../../mobile-conventions/03-conventions-patterns.md](../../mobile-conventions/03-conventions-patterns.md) pour les patterns complets d'utilisation des composants Screen et les conventions de hooks.

## 🎯 Objectif

Interface de découverte des projets qui s'adapte au niveau d'engagement utilisateur : exploration libre pour les Explorateurs, suivi personnalisé pour les Protecteurs, allocation flexible pour les Ambassadeurs.

## 🎨 Design & Layout

### 🆓 Explorateur (Gratuit) - Vue Découverte

```text
┌─────────────────────────┐
│ 🔍 [Recherche]    🔔 ⚙️ │
│                         │
│ 🌟 Découvrez les projets│
│ ┌─────┐ ┌─────┐ ┌─────┐ │
│ │🐝   │ │🌳   │ │🏔️   │ │
│ │Ruch │ │Oliv │ │Mont │ │
│ └─────┘ └─────┘ └─────┘ │
│                         │
│ 💫 Projets recommandés  │
│ ┌───────────────────────┐ │
│ │ 🐝 Ruches HABEEBEE    │ │
│ │ Dès 50€ • Belgique    │ │
│ │ [👀 Découvrir]        │ │
│ └───────────────────────┘ │
│ ┌───────────────────────┐ │
│ │ 🌳 Oliviers ILANGA    │ │
│ │ Dès 80€ • Madagascar  │ │
│ │ [👀 Découvrir]        │ │
│ └───────────────────────┘ │
│                         │
│ ••••• Navigation ••••• │
└─────────────────────────┘
```

### 🐝 Protecteur - Vue Mes Projets

```text
┌─────────────────────────┐
│ 🔍 [Recherche]    🔔 ⚙️ │
│                         │
│ 🏠 Mes projets (2)      │
│ ┌───────────────────────┐ │
│ │ 🐝 Ma ruche #A1247    │ │
│ │ HABEEBEE • Active     │ │
│ │ [📸 Nouvelles photos] │ │
│ │ [65 points restants]  │ │
│ └───────────────────────┘ │
│ ┌───────────────────────┐ │
│ │ 🌳 Mon olivier #IL092 │ │
│ │ ILANGA • Croissance   │ │
│ │ [📝 Update mensuel]   │ │
│ │ [105 points restants] │ │
│ └───────────────────────┘ │
│                         │
│ ➕ Adopter nouveau projet│
│ [Voir tous les projets] │
│                         │
│ ••••• Navigation ••••• │
└─────────────────────────┘
```

### 👑 Ambassadeur - Vue Allocation

```text
┌─────────────────────────┐
│ 🔍 [Recherche]    🔔 ⚙️ │
│                         │
│ 💎 Mon impact (525pts)  │
│ ┌───────────────────────┐ │
│ │ 📊 Répartition actuelle││
│ │ 🐝 Ruches: 40%        │ │
│ │ 🌳 Oliviers: 35%      │ │
│ │ 🏔️ Montagne: 25%      │ │
│ │ [⚙️ Modifier répart.] │ │
│ └───────────────────────┘ │
│                         │
│ 🎯 Projets soutenus (8) │
│ ┌───────────────────────┐ │
│ │ 🐝 HABEEBEE • 150pts  │ │
│ │ 🌳 ILANGA • 120pts    │ │
│ │ [Voir tout]           │ │
│ └───────────────────────┘ │
│                         │
│ ••••• Navigation ••••• │
└─────────────────────────┘
```

### Design System

- **Header** : Search bar + notifications + settings
- **Category Chips** : Horizontal scrollable (ruches, oliviers, miel)
- **Project Cards** : Full width, shadow-sm, rounded-lg
- **Quick Filters** : Floating chips (Près de vous, Nouveaux, Populaires)
- **Load More** : Infinite scroll with skeleton loading

## 📱 Composants UI

### Search Header

```typescript
interface SearchHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onNotificationPress: () => void
  onSettingsPress: () => void
  notificationCount?: number
}
```

### Category Filter

```typescript
interface CategoryFilterProps {
  categories: {
    id: string
    label: string
    icon: string
    count: number
  }[]
  selectedCategory?: string
  onCategorySelect: (categoryId: string) => void
}
```

### Project Card

```typescript
interface ProjectCardProps {
  project: {
    id: string
    title: string
    subtitle: string
    image: string
    price: number
    duration: number
    rating: number
    reviewCount: number
    location: {
      city: string
      distance?: number
    }
    tags: string[]
    availability: 'available' | 'limited' | 'sold_out'
    featured: boolean
  }
  onPress: (projectId: string) => void
  onFavoritePress: (projectId: string) => void
  isFavorite: boolean
}
```

### Filter System

```typescript
interface FilterProps {
  filters: {
    priceRange: { min: number; max: number }
    duration: { min: number; max: number }
    location: { maxDistance: number }
    rating: { minimum: number }
    availability: 'all' | 'available' | 'limited'
    sortBy: 'newest' | 'popular' | 'price_asc' | 'price_desc' | 'distance'
  }
  onFiltersChange: (filters: FilterProps['filters']) => void
  onReset: () => void
}
```

## 🔄 États & Interactions

### États de Chargement

#### Initial Load

```typescript
interface ProjectsLoadingState {
  projects: 'loading' | 'loaded' | 'empty' | 'error'
  categories: 'loading' | 'loaded' | 'error'
  search: 'idle' | 'searching' | 'results' | 'no_results'
  location: 'requesting' | 'granted' | 'denied' | 'unavailable'
}
```

#### Infinite Scroll

- **Page Loading** : Skeleton cards à la fin de liste
- **Load More** : Automatic trigger at 80% scroll
- **End Reached** : Message "Tous les projets affichés"

#### Search States

1. **Empty State** : Suggestions populaires
2. **Searching** : Loading indicator dans search bar
3. **Results** : Liste filtrée avec nombre de résultats
4. **No Results** : Suggestions alternatives + clear filters

### Interactions Avancées

#### Pull-to-Refresh

```typescript
const refreshBehavior = {
  trigger: 'pull_down',
  refreshData: ['projects', 'categories', 'location'],
  animation: 'spinner',
  hapticFeedback: true
}
```

#### Swipe Actions

```typescript
// Swipe sur project card
const swipeActions = {
  left: {
    action: 'favorite',
    icon: 'heart',
    color: 'red',
    haptic: 'medium'
  },
  right: {
    action: 'share',
    icon: 'share',
    color: 'blue',
    haptic: 'light'
  }
}
```

#### Long Press

- **Project Card** : Quick preview modal
- **Category Chip** : Filter submenu
- **Search Bar** : Voice search option

### Animation & Feedback

```typescript
const animations = {
  cardEntry: {
    type: 'slideInUp',
    stagger: 100,
    duration: 300
  },
  favoritePress: {
    type: 'heartBeat',
    duration: 400,
    haptic: 'success'
  },
  filterApply: {
    type: 'fadeInOut',
    duration: 200
  }
}
```

## 📡 API & Données

### Projects Discovery Endpoint

```typescript
GET /api/projects/discover
Query Parameters:
- page: number
- limit: number (default: 20)
- category?: string
- search?: string
- priceMin?: number
- priceMax?: number
- location?: { lat: number, lon: number, radius: number }
- sortBy?: 'newest' | 'popular' | 'price' | 'distance'

interface ProjectsResponse {
  projects: ProjectSummary[]
  pagination: {
    currentPage: number
    totalPages: number
    totalCount: number
    hasMore: boolean
  }
  filters: {
    availableCategories: Category[]
    priceRange: { min: number; max: number }
    locationCities: string[]
  }
}
```

### Search Endpoint

```typescript
GET /api/projects/search
Query Parameters:
- q: string (search query)
- suggest?: boolean

interface SearchResponse {
  results: ProjectSummary[]
  suggestions: {
    query: string
    count: number
  }[]
  facets: {
    categories: { name: string; count: number }[]
    priceRanges: { range: string; count: number }[]
    locations: { city: string; count: number }[]
  }
}
```

### Favorites Management

```typescript
POST /api/projects/favorites
{ projectId: string }

DELETE /api/projects/favorites/{projectId}

GET /api/projects/favorites
Response: { projectIds: string[] }
```

### Real-time Updates

```typescript
// WebSocket pour updates projets
interface ProjectUpdate {
  type: 'availability_changed' | 'price_updated' | 'new_project'
  projectId: string
  data: {
    availability?: 'available' | 'limited' | 'sold_out'
    price?: number
    featured?: boolean
  }
}
```

## ✅ Validations

### Search Validation

```typescript
interface SearchValidation {
  query: {
    minLength: 2
    maxLength: 100
    allowedChars: /^[a-zA-Z0-9\s\-éèàçù]+$/
  }
  filters: {
    priceRange: { min: 50, max: 10000 }
    distance: { max: 500 } // km
    rating: { min: 1, max: 5 }
  }
}
```

### Business Rules

#### Project Availability

```typescript
const availabilityRules = {
  available: { color: 'green', message: 'Disponible' },
  limited: { color: 'orange', message: 'Places limitées', urgent: true },
  sold_out: { color: 'gray', message: 'Complet', disabled: true }
}
```

#### Distance Calculation

- **Location Permission** : Demander au premier usage
- **Fallback** : Code postal si GPS refusé
- **Precision** : Arrondi au km le plus proche

## 🚨 Gestion d'Erreurs

### Network Errors

```typescript
const errorHandling = {
  loadingFailed: {
    message: "Impossible de charger les projets",
    action: "retry",
    fallback: "show_cached_data"
  },
  searchFailed: {
    message: "Recherche temporairement indisponible", 
    action: "retry_search",
    fallback: "show_recent_searches"
  },
  locationFailed: {
    message: "Localisation indisponible",
    action: "manual_location_entry",
    fallback: "show_all_projects"
  }
}
```

### Empty States

#### No Projects

```typescript
const emptyStates = {
  noProjects: {
    illustration: 'empty_projects',
    title: "Aucun projet disponible",
    subtitle: "De nouveaux projets arrivent bientôt !",
    action: "notify_when_available"
  },
  noSearchResults: {
    illustration: 'search_empty',
    title: "Aucun résultat trouvé",
    subtitle: "Essayez d'autres mots-clés",
    action: "clear_filters"
  },
  noLocation: {
    illustration: 'location_disabled',
    title: "Localisation désactivée",
    subtitle: "Activez la géolocalisation pour voir les projets près de chez vous",
    action: "enable_location"
  }
}
```

## 🔗 Navigation

### Internal Navigation

#### From Projects List

```typescript
const navigationRoutes = {
  'ProjectDetail': {
    route: 'ProjectDetail',
    params: { projectId: string },
    animation: 'slideInRight'
  },
  'ProjectFilters': {
    route: 'ProjectFilters',
    presentation: 'modal',
    animation: 'slideInUp'
  },
  'Search': {
    route: 'ProjectSearch',
    presentation: 'fullScreenModal'
  }
}
```

#### Tab Navigation

- **Current Tab** : Projects (highlighted)
- **Quick Switch** : Double tap pour scroll to top
- **Badge** : Nouveaux projets count

### Deep Links

```typescript
const projectsDeepLinks = {
  'makethechange://projects': 'ProjectsScreen',
  'makethechange://projects/search?q=ruches': 'ProjectsScreen + SearchState',
  'makethechange://projects/category/beekeeping': 'ProjectsScreen + CategoryFilter',
  'makethechange://projects/near-me': 'ProjectsScreen + LocationFilter'
}
```

### State Persistence

```typescript
interface ProjectsNavState {
  lastSearchQuery: string
  activeFilters: FilterState
  scrollPosition: number
  favoriteProjects: string[]
  viewHistory: string[]
}
```

## 📝 Tests Utilisateur

### User Journey Tests

#### Discovery Flow

1. **First Visit** : User understands project types
2. **Search Usage** : User finds specific projects
3. **Filter Application** : User narrows results effectively
4. **Project Selection** : User navigates to details

#### Location-based Discovery

1. **Permission Grant** : User allows location access
2. **Local Results** : User sees nearby projects
3. **Distance Understanding** : User interprets distance info

### A/B Tests

#### Card Layout Variants

- **Variant A** : Horizontal layout (image left, info right)
- **Variant B** : Vertical layout (image top, info bottom)
- **Variant C** : Grid layout (2 columns)
- **Métrique** : Click-through rate to details

#### Search Behavior

- **Variant A** : Search bar always visible
- **Variant B** : Search via dedicated button
- **Métrique** : Search adoption rate

### Performance Tests

```typescript
interface PerformanceMetrics {
  listScrollPerformance: number    // Target: 60fps
  searchResponseTime: number       // Target: <300ms
  imageLoadingTime: number         // Target: <2s
  infiniteScrollLatency: number    // Target: <500ms
}
```

## 💾 Stockage Local

### Cache Strategy

```typescript
interface ProjectsCache {
  projects: {
    data: ProjectSummary[]
    pagination: PaginationState
    lastFetch: number
    ttl: number // 15 minutes
  }
  categories: {
    data: Category[]
    lastFetch: number
    ttl: number // 1 hour
  }
  searches: {
    recentQueries: string[]
    popularSuggestions: string[]
    maxHistory: 10
  }
  favorites: {
    projectIds: string[]
    lastSync: number
  }
}
```

### Offline Support

```typescript
interface OfflineCapabilities {
  viewCachedProjects: boolean
  searchCachedProjects: boolean
  addToFavorites: boolean        // Sync when online
  viewProjectDetails: boolean    // If cached
  makeInvestment: false          // Requires connection
}
```

### Analytics Events

```typescript
const projectsEvents = {
  'projects_viewed': {
    timestamp: number,
    source: 'tab_switch' | 'deep_link',
    cached_data: boolean
  },
  'project_searched': {
    query: string,
    filters_applied: boolean,
    results_count: number,
    timestamp: number
  },
  'project_card_tapped': {
    project_id: string,
    position_in_list: number,
    search_query?: string,
    category?: string,
    timestamp: number
  },
  'filter_applied': {
    filter_type: string,
    filter_value: any,
    results_before: number,
    results_after: number,
    timestamp: number
  },
  'favorite_toggled': {
    project_id: string,
    action: 'added' | 'removed',
    timestamp: number
  }
}
```

## 🔧 Optimisations Techniques

### Performance

- **Image optimization** : WebP, progressive loading, blur placeholder
- **List virtualization** : RecyclerListView pour grandes listes
- **Search debouncing** : 300ms delay pour éviter spam API
- **Infinite scroll** : Prefetch next page à 80% scroll

### Memory Management

```typescript
const memoryOptimizations = {
  imageCache: {
    maxSize: '50MB',
    evictionPolicy: 'LRU'
  },
  listItems: {
    recycling: true,
    maxCachedItems: 50
  },
  searchHistory: {
    maxEntries: 20,
    autoCleanup: true
  }
}
```
