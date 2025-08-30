# 🏗️ Admin Dashboard - Gestion Projets MVP

**📍 PRIORITÉ: ⭐️⭐️⭐️ CRITIQUE** | **🗓️ SEMAINES 5-8** | **🎯 ADMIN-FIRST**

## 🎯 Objectifs

Interface administrative pour créer, gérer et modérer les projets de biodiversité. Permet à l'équipe de créer du contenu explorable par les utilisateurs mobiles dès la semaine 6.

## 📋 Vue d'Ensemble - CRUD Projets

### Types de Projets Supportés
```yaml
Types de Projets:
  beehive:
    label: "Ruche"
    price_eur: 50
    points_generated: 65
    bonus_percentage: 30%
    duration: "12 mois"
    partner: "HABEEBEE"
    
  olive_tree:
    label: "Olivier"  
    price_eur: 80
    points_generated: 112
    bonus_percentage: 40%
    duration: "24 mois"
    partner: "ILANGA NATURE"
    
  vineyard:
    label: "Parcelle Familiale"
    price_eur: 150
    points_generated: 225
    bonus_percentage: 50%
    duration: "18 mois"
    partner: "Multi-partenaires"
```

## 🖼️ Interface Utilisateur

### 1. Liste des Projets
```typescript
interface ProjectsListView {
  filters: {
    type: 'all' | 'beehive' | 'olive_tree' | 'vineyard'
    status: 'all' | 'active' | 'funding' | 'funded' | 'completed'
    partner: string[]
    dateRange: DateRange
  }
  
  columns: {
    thumbnail: string          // Photo miniature
    name: string              // Nom du projet
    type: ProjectType         // Type avec badge coloré
    partner: string           // Partenaire producteur
    location: string          // Ville, Pays
    funding: {
      current: number         // Financement actuel
      target: number          // Objectif financement
      supporters: number      // Nombre de protecteurs
    }
    status: ProjectStatus     // Statut avec badge
    createdAt: Date         // Date création
    actions: ActionButtons   // Éditer, Voir, Supprimer
  }
  
  bulk_actions: {
    change_status: (ids: string[], status: ProjectStatus) => void
    export_data: (ids: string[]) => void
    delete_projects: (ids: string[]) => void
  }
}
```

### 2. Création/Édition de Projet
```typescript
interface ProjectEditor {
  // Section 1: Informations de Base
  basic_info: {
    name: string              // Nom du projet (requis)
    type: ProjectType         // Type de projet (requis)
    slug: string              // URL slug (auto-généré)
    short_description: string // Description courte (requis, 160 chars max)
    long_description: string  // Description détaillée (requis, markdown supporté)
    status: ProjectStatus     // Statut (active, funded, closed, suspended)
  }
  
  // Section 2: Localisation
  location: {
    coordinates: [number, number] // Lat/Lng (requis)
    address: {
      street?: string
      city: string           // Requis
      postalCode?: string
      country: string        // Requis
    }
    map_display: boolean     // Afficher sur carte publique
  }
  
  // Section 3: Partenaire & Production
  partner_info: {
    partner_id: string       // Référence partenaire (requis)
    producer_name: string    // Nom du producteur
    producer_bio?: string    // Bio du producteur
    certifications: string[] // Labels/certifications
    contact_email?: string   // Contact direct (si autorisé)
  }
  
  // Section 4: Financement
  funding: {
    target_amount: number    // Objectif financement (requis)
    funding_deadline?: Date  // Date limite financement
    min_supporters?: number  // Minimum de supporters requis
    max_supporters?: number  // Maximum de supporters autorisés
  }
  
  // Section 5: Production & Impact
  production: {
    expected_yield?: string   // Production attendue
    harvest_season?: string   // Saison de récolte
    quality_metrics?: string  // Métriques qualité
    biodiversity_impact: string // Impact biodiversité (requis)
  }
  
  // Section 6: Médias
  media: {
    hero_image: string       // Image principale (requis)
    gallery: string[]        // Galerie photos (3-10 images)
    video_url?: string       // Vidéo de présentation
    documents?: string[]     // Documents techniques/certifications
  }
  
  // Section 7: Planification
  timeline: {
    project_start: Date      // Date début projet
    milestones: ProjectMilestone[] // Jalons importants
    completion_date?: Date   // Date fin prévue
  }
  
  // Section 8: Configuration Avancée
  advanced: {
    featured: boolean        // Projet mis en avant
    private: boolean         // Projet privé (groupe fermé)
    allow_updates: boolean   // Autoriser updates partenaires
    seo_meta: {
      title?: string
      description?: string
      keywords?: string[]
    }
  }
}

interface ProjectMilestone {
  id: string
  name: string
  description?: string
  target_date: Date
  status: 'pending' | 'completed' | 'delayed'
  completion_date?: Date
}
```

## 🔧 Fonctionnalités Critiques

### 1. Validation & Contrôles
```yaml
Validations Obligatoires:
  - name: Non vide, unique par partenaire
  - type: Dans la liste autorisée
  - location.coordinates: Coordonnées GPS valides
  - location.city & country: Requis
  - partner_id: Partenaire existant et actif
  - target_amount: > 0 et cohérent avec le type
  - hero_image: URL image valide
  - biodiversity_impact: Description impact requis (min 50 chars)

Contrôles Business:
  - Les prix par type sont fixes (50€/80€/150€)
  - Les bonus points sont fixes (30%/40%/50%)
  - Un partenaire ne peut pas avoir 2 projets identiques actifs simultanément
  - Les coordonnées doivent être dans la zone du partenaire
```

### 2. Workflows d'État
```typescript
type ProjectStatus = 'active' | 'funded' | 'closed' | 'suspended'

interface StatusWorkflow {
  allowed_transitions: {
    active: ['funded', 'suspended', 'closed']
    funded: ['closed', 'suspended']
    suspended: ['active', 'closed']
    closed: []
  }
  
  transition_triggers: {
    active_to_funded: {
      conditions: ['target_funding_reached', 'min_supporters_met']
      actions: ['notify_supporters', 'start_production_workflow', 'generate_tracking_ids']
    }
    funded_to_closed: {
      conditions: ['production_completed', 'final_impact_report']
      actions: ['notify_supporters', 'archive_project', 'generate_certificates']
    }
  }
}
```

### 3. Intégrations Partenaires
```typescript
interface PartnerIntegration {
  // Création automatique d'IDs de suivi
  generate_tracking_ids: (project_id: string, supporters_count: number) => {
    beehive_ids?: string[]      // IDs ruches individuelles
    tree_ids?: string[]         // IDs oliviers géolocalisés  
    plot_ids?: string[]         // IDs parcelles délimitées
  }
  
  // Synchronisation données partenaires
  sync_partner_data: {
    production_updates: boolean  // Sync auto updates production
    quality_metrics: boolean     // Sync métriques qualité
    certifications: boolean      // Sync nouveaux labels
  }
  
  // API externe partenaires
  webhook_endpoints: {
    project_funded: string       // Notifier partenaire du financement
    production_start: string     // Démarrer production
    update_received: string      // Nouveau update partenaire reçu
  }
}
```

## 📊 Analytics & Monitoring

### Métriques Projets
```typescript
interface ProjectMetrics {
  funding_analytics: {
    conversion_rate: number      // % visiteurs → supporters
    avg_time_to_fund: number     // Temps moyen pour financer
    supporter_retention: number  // % supporters qui re-investissent
    geographic_distribution: GeographicData[]
  }
  
  engagement_metrics: {
    page_views: number
    unique_visitors: number  
    social_shares: number
    update_engagement: number    // Engagement updates partenaires
  }
  
  production_tracking: {
    milestones_on_time: number   // % jalons respectés
    quality_score: number        // Score qualité production
    supporter_satisfaction: number // Score satisfaction supporters
  }
}
```

## 🚨 Gestion d'Urgence

### Actions Critiques
```yaml
Situations d'Urgence:
  partner_issue:
    triggers: ["Partner contact lost", "Production problem", "Quality issue"]  
    actions: ["Pause new investments", "Notify existing supporters", "Activate backup plan"]
    
  funding_failure:
    triggers: ["Deadline missed", "Min supporters not met", "Partner cancellation"]
    actions: ["Refund all supporters", "Convert to points", "Propose alternative projects"]
    
  production_delay:
    triggers: ["Milestone delayed >30 days", "Force majeure", "Regulatory issue"]
    actions: ["Update supporters", "Extend timeline", "Offer compensation"]

Backup & Recovery:
  - Auto-backup avant chaque changement de statut
  - Historique complet des modifications
  - Rollback possible sur 30 jours
  - Export données pour migration d'urgence
```

## 🔗 Intégration Mobile

### APIs Générées
```typescript
// tRPC endpoints auto-générés
interface ProjectsAPI {
  // Public (consommé par mobile)
  getPublicProjects: () => PublicProject[]
  getProjectDetails: (slug: string) => ProjectDetails
  getProjectUpdates: (project_id: string) => ProjectUpdate[]
  
  // Admin uniquement  
  createProject: (data: ProjectEditor) => Project
  updateProject: (id: string, data: Partial<ProjectEditor>) => Project
  deleteProject: (id: string) => boolean
  changeProjectStatus: (id: string, status: ProjectStatus) => Project
  
  // Analytics
  getProjectMetrics: (id: string, timeRange: DateRange) => ProjectMetrics
  exportProjectData: (ids: string[], format: 'csv' | 'json') => ExportResult
}

interface PublicProject {
  // Version publique (filtrée pour mobile)
  id: string
  slug: string
  name: string
  type: ProjectType
  short_description: string
  hero_image: string
  location: {
    city: string
    country: string
    coordinates: [number, number]
  }
  partner: {
    name: string
    avatar?: string
  }
  funding: {
    current_amount: number
    target_amount: number  
    supporters_count: number
    progress_percentage: number
  }
  investment_options: {
    price_eur: number
    points_generated: number
    bonus_percentage: number
  }
  status: 'active' | 'funded' | 'closed'
  createdAt: string
}
```

## ✅ Critères de Validation MVP

### Tests d'Acceptation
```yaml
Fonctionnalités Core:
  ✓ Créer un projet beehive complet en <10min
  ✓ Modifier les informations sans casser les liens mobiles  
  ✓ Passer un projet de draft → active → funded
  ✓ Générer automatiquement les IDs de suivi à la validation
  ✓ Exporter données projets pour reporting partenaires
  
Performance:
  ✓ Liste 100+ projets en <2s
  ✓ Recherche/filtrage en <1s
  ✓ Upload images <30s pour 10Mo
  ✓ Sauvegarde auto toutes les 30s
  
Intégration:
  ✓ Projet créé → visible mobile dans 1min
  ✓ Changement statut → webhook partenaire envoyé
  ✓ Analytics mises à jour en temps réel
  ✓ Export CSV compatible avec outils partenaires
```

## 🎨 Design System

### Statuts Visuels
```css
.project-status {
  draft: #94a3b8 (gris)
  active: #22c55e (vert) 
  funded: #3b82f6 (bleu)
  completed: #8b5cf6 (violet)
  cancelled: #ef4444 (rouge)
}

.project-types {
  beehive: #f59e0b (ambre) + 🐝
  olive_tree: #84cc16 (lime) + 🫒  
  vineyard: #8b5cf6 (violet) + 🍇
}

.funding-progress {
  0-30%: #ef4444 (rouge - démarrage)
  31-70%: #f59e0b (ambre - progression) 
  71-99%: #3b82f6 (bleu - proche objectif)
  100%: #22c55e (vert - financé)
}
```

---

**🎯 RÉSULTAT ATTENDU**: Interface admin permettant de créer et gérer les projets de biodiversité avec génération automatique des APIs mobiles, workflow de validation robuste, et analytics intégrées.
