# Détail du Projet à Soutenir

## 🎯 Objectif

Présenter de manière détaillée un projet (ruche, oliveraie) avec toutes les informations sur son impact, son producteur et son histoire, afin de donner envie aux utilisateurs de l'explorer gratuitement ou d'investir pour le soutenir concrètement.

## 🎨 Design & Layout

### Structure Visuelle

```text
┌─────────────────────────┐
│ [←] 🐝 Rucher Bio    ⭐♡ │
│                         │
│ ┌───────────────────────┐ │
│ │     [Image Hero]      │ │
│ │   📸 📸 📸 📸 📸    │ │
│ └───────────────────────┘ │
│                         │
│ Rucher Bio d'Alsace     │
│ ⭐⭐⭐⭐⭐ (4.8/5)      │
│ 📍 Strasbourg           │
│                         │
│ ┌─────┬─────┬─────┬─────┐ │
│ │ 15  │ 89  │🌿Bio│🇫🇷 │ │
│ │Ruch │Memb.│Cert │FR │ │
│ └─────┴─────┴─────┴─────┘ │
│                         │
│ 📄 Description          │
│ Ce rucher familial...   │
│                         │
│ 🧑‍🌾 Apiculteur          │
│ ┌─────────────────────────┐│
│ │ [Photo] Jean Martin   ⭐││
│ │ Apiculteur depuis 20 ans││
│ │ 🏅 Expert certifié     ││
│ └─────────────────────────┘│
│                         │
│ 📊 Impact du Projet     │
│ [Graphique d'impact]    │
│                         │
│ 💬 Avis (127)           │
│ [Liste des avis]        │
│                         │
│ [INVESTIR 50€ → 65 PTS] │
│                         │
│ ••••• Navigation ••••• │
└─────────────────────────┘
```

### Design System

- **Hero Image** : Carousel d'images avec indicators
- **Key Metrics** : Cards avec icônes et valeurs d'impact
- **Producer Profile** : Card avec photo, credentials, rating
- **Impact Section** : Graphiques et chiffres clés sur l'impact environnemental
- **Reviews Section** : Expandable list avec filtering
- **CTA Button** : Fixed bottom, adapté au niveau utilisateur (Explorateur/Protecteur/Ambassadeur)

## 📱 Composants UI

### Project Header

```typescript
interface ProjectHeaderProps {
  project: {
    id: string
    title: string
    rating: number
    reviewCount: number
    location: {
      city: string
      region: string
    }
    category: 'beekeeping' | 'olive_growing' | 'honey_production'
  }
  onBack: () => void
  onShare: () => void
  onFavorite: () => void
  isFavorite: boolean
}
```

### Image Gallery

```typescript
interface ImageGalleryProps {
  images: {
    id: string
    url: string
    caption?: string
    type: 'hero' | 'facility' | 'product' | 'certificate'
  }[]
  onImagePress: (imageIndex: number) => void
  onImageModalOpen: () => void
}
```

### Key Metrics Grid

```typescript
interface MetricsGridProps {
  metrics: {
    impact: {
      co2_compensated: number // in tons
      trees_planted: number
    }
    capacity: {
      units: number
      unitType: 'hives' | 'trees' | 'plants'
    }
    supporters: {
      count: number
    }
    certifications: {
      bio: boolean
      fair_trade: boolean
      local: boolean
    }
  }
}
```

### Producer Profile

```typescript
interface ProducerProfileProps {
  producer: {
    id: string
    firstName: string
    lastName: string
    avatar?: string
    experience: number
    specialties: string[]
    certifications: {
      name: string
      issuer: string
      validUntil: Date
    }[]
    rating: number
    projectsCount: number
    bio: string
  }
  onViewProfile: (producerId: string) => void
  onContact: (producerId: string) => void
}
```

### Reviews Section

```typescript
interface ReviewsSectionProps {
  reviews: {
    id: string
    user: {
      firstName: string
      avatar?: string
    }
    rating: number
    comment: string
    date: Date
    verified: boolean
    helpful: number
    images?: string[]
  }[]
  averageRating: number
  totalReviews: number
  ratingDistribution: { [stars: number]: number }
  onViewAllReviews: () => void
  onReviewHelpful: (reviewId: string) => void
}
```

## 🔄 États & Interactions

### États de Chargement

#### Project Data Loading

```typescript
interface ProjectLoadingState {
  projectDetails: 'loading' | 'loaded' | 'error'
  producerProfile: 'loading' | 'loaded' | 'error'
  reviews: 'loading' | 'loaded' | 'empty' | 'error'
  images: 'loading' | 'loaded' | 'error'
}
```

### Interactions Avancées

#### Image Gallery Interactions

```typescript
const imageGalleryBehavior = {
  tap: {
    action: 'open_fullscreen',
    animation: 'zoomIn'
  },
  pinchToZoom: {
    enabled: true,
    maxScale: 3.0,
    minScale: 1.0
  },
  swipeGestures: {
    horizontal: 'change_image',
    vertical: 'close_gallery'
  }
}
```

#### Investment Button States - Modèle Hybride

```typescript
const investmentButtonStates = {
  // Pour utilisateur Explorateur (gratuit) - Point d'entrée
  explorer_available: {
    text: "Investir 50€ → 65 points (30% bonus)",
    subtitle: "Devenez Protecteur de ce projet",
    color: 'primary',
    enabled: true,
    badge: "Accès gratuit"
  },
  explorer_multiple_options: {
    text: "Choisir mon investissement",
    options: ["1 ruche - 50€", "3 ruches - 130€", "5 ruches - 200€"],
    color: 'primary',
    enabled: true
  },
  // Pour utilisateur Protecteur (déjà investi dans ce projet)
  protector_already_invested: {
    text: "Projet soutenu ✓",
    subtitle: "Voir mes updates personnalisées",
    color: 'success',
    enabled: true, // Accès aux updates spécifiques
    action: 'view_my_investment'
  },
  // Pour utilisateur Protecteur (peut investir dans d'autres projets)
  protector_new_project: {
    text: "Investir dans ce projet",
    subtitle: "Ajouter à mon portfolio",
    color: 'primary',
    enabled: true
  },
  // Pour utilisateur Ambassadeur (allocation flexible)
  ambassador_available: {
    text: "Allouer mes points à ce projet",
    subtitle: "Soutien flexible via abonnement",
    color: 'premium',
    enabled: true,
    badge: "Ambassadeur"
  },
  loading: {
    text: "Vérification...",
    color: 'primary',
    enabled: false,
    spinner: true
  }
}
```

### Scroll Behaviors

#### Parallax Effects

```typescript
const parallaxConfig = {
  heroImage: {
    scrollFactor: 0.5,
    fadeOut: true
  },
  header: {
    stickyBehavior: 'fade_in',
    threshold: 200
  }
}
```

#### Lazy Loading

```typescript
const lazyLoadingConfig = {
  images: {
    placeholder: 'blur',
    preloadNext: 2,
    quality: 'auto'
  },
  reviews: {
    initialLoad: 3,
    loadMore: 5,
    infiniteScroll: true
  }
}
```

## 📡 API & Données

### Project Detail Endpoint

```typescript
GET /api/projects/{projectId}
Authorization: Bearer {accessToken} // Optional

interface ProjectDetailResponse {
  project: {
    id: string
    title: string
    description: string
    category: string
    location: LocationInfo
    images: ProjectImage[]
    metrics: ProjectMetrics
    features: string[]
    certifications: Certification[]
  }
  producer: ProducerProfile
  reviews: {
    items: Review[]
    summary: ReviewSummary
    pagination: PaginationInfo
  }
  similarProjects: ProjectSummary[]
  // Information sur le niveau utilisateur, si connecté
  user_info?: {
    user_level: 'explorateur' | 'protecteur' | 'ambassadeur'
    has_invested_in_project: boolean
    available_points?: number
  }
}
```

### Reviews & Ratings

```typescript
GET /api/projects/{projectId}/reviews
Query Parameters:
- page: number
- limit: number
- sort: 'newest' | 'oldest' | 'highest_rated' | 'most_helpful'
- verified_only?: boolean

POST /api/projects/{projectId}/reviews
{
  rating: number
  comment: string
  images?: File[]
}
```

## ✅ Validations

### Business Rules

- Un utilisateur **Explorateur** (gratuit) peut naviguer librement et voir tous les projets
- Pour **investir**, l'utilisateur doit être connecté et passer au niveau **Protecteur**
- Le bouton d'action s'adapte au niveau utilisateur : investissement ou exploration

## 🚨 Gestion d'Erreurs

### Data Loading Errors

```typescript
const dataErrors = {
  projectLoadFailed: {
    message: "Impossible de charger les détails du projet",
    fallback: "show_basic_info",
    action: "retry_load"
  },
  imagesLoadFailed: {
    message: "Erreur lors du chargement des images",
    fallback: "show_placeholder",
    action: "retry_images"
  },
  reviewsLoadFailed: {
    message: "Impossible de charger les avis",
    fallback: "hide_reviews_section",
    action: "retry_reviews"
  }
}
```

## 🔗 Navigation

### Navigation Flow

#### From Project Detail

```typescript
const navigationRoutes = {
  'InvestmentFlow': {
    route: 'InvestmentFlow',
    params: { project_id: string, investment_type: 'ruche' | 'olivier' | 'parcelle_familiale' },
    presentation: 'modal'
  },
  'SubscriptionUpgrade': {
    route: 'SubscriptionFlow', 
    params: { suggested_level: 'protecteur' | 'ambassadeur' },
    presentation: 'modal'
  },
  'ProducerProfile': {
    route: 'ProducerProfile',
    params: { producerId: string },
    animation: 'slideInRight'
  },
  'ReviewsAll': {
    route: 'ReviewsAll',
    params: { projectId: string },
    animation: 'slideInRight'
  },
  'ImageGallery': {
    route: 'ImageGallery',
    params: { images: ProjectImage[], initialIndex: number },
    presentation: 'fullScreenModal'
  }
}
```

### Deep Links

```typescript
const projectDetailDeepLinks = {
  'makethechange://project/:id': 'ProjectDetailScreen',
  'makethechange://project/:id/invest': 'ProjectDetailScreen + InvestmentModal',
  'makethechange://project/:id/subscribe': 'ProjectDetailScreen + SubscriptionModal',
  'makethechange://project/:id/reviews': 'ProjectDetailScreen + ReviewsModal',
  'makethechange://project/:id/producer': 'ProducerProfileScreen'
}
```

## 📝 Tests Utilisateur

### Decision Making Tests

#### Information Comprehension

1. **Project Understanding** : User grasps project concept
2. **Impact Comprehension** : User understands the environmental and social impact.
3. **Trust Building** : User trusts the producer and the project's viability.

### A/B Tests

#### CTA Button Wording

- **Variant A** : "Investir 50€ → 65 points"
- **Variant B** : "Soutenir cette ruche" 
- **Variant C** : "Commencer mon impact"
- **Métrique** : Taux de clic vers le tunnel d'investissement.

### Conversion Funnel

```typescript
interface ConversionMetrics {
  projectViewToInvestmentFlow: number // Target: >8% (plus précis que souscription)
  explorerToProtectorConversion: number // Target: >5%
}
```

## 💾 Stockage Local

### Project Details Cache

```typescript
interface ProjectDetailsCache {
  projectData: {
    [projectId: string]: {
      data: ProjectDetail
      lastFetch: number
      ttl: number // 1 hour
    }
  }
  images: {
    [imageUrl: string]: {
      localPath: string
      downloadDate: number
      size: number
    }
  }
}
```

### User Interaction Tracking

```typescript
interface InteractionTracking {
  viewHistory: {
    projectId: string
    viewedAt: Date
    timeSpent: number
    sectionsViewed: string[]
  }[]
  favorites: {
    projectId: string
    addedAt: Date
  }[]
}
```

### Analytics Events

```typescript
const projectDetailEvents = {
  'project_detail_viewed': {
    project_id: string,
    source: 'list' | 'search' | 'recommendation' | 'deep_link',
    timestamp: number
  },
  'producer_profile_viewed': {
    project_id: string,
    producer_id: string,
    timestamp: number
  },
  'investment_initiated': {
    project_id: string,
    investment_type: 'ruche' | 'olivier' | 'parcelle_familiale',
    amount: number,
    user_level: 'explorateur' | 'protecteur' | 'ambassadeur',
    source: 'project_detail_cta',
    timestamp: number
  },
  'reviews_viewed': {
    project_id: string,
    reviews_count: number,
    average_rating: number,
    timestamp: number
  },
  'image_gallery_opened': {
    project_id: string,
    image_index: number,
    total_images: number,
    timestamp: number
  }
}
```