# 🌱 Gestion des Projets

**CRUD complet pour les projets d'investissement avec géolocalisation, tracking production, et gestion des partenaires.**

## 🎯 Objectif

Créer, modifier et gérer les projets d'investissement (ruches et oliviers) avec suivi de la production, géolocalisation précise, et intégration partenaires.

## 👤 Utilisateurs Cibles

- **Gestionnaires de projets** : Création et suivi des projets
- **Partenaires** : HABEEBEE, ILANGA NATURE (accès limité)
- **Administrateurs** : Supervision et validation
- **Support** : Assistance et résolution problèmes

## 🎨 Design & Layout

### Page Liste Projets
```text
┌─────────────────────────────────────────────────────────────┐
│ Projets | 47 actifs                    [+ Nouveau Projet]   │
├─────────────────────────────────────────────────────────────┤
│ 🔍 [Recherche] [Type ▼] [Statut ▼] [Partenaire ▼] [🗺️]    │
├─────────────────────────────────────────────────────────────┤
│ Cards Grid / Liste                                          │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │
│ │ 🐝 Ruches Bio   │ │ 🫒 Oliviers     │ │ 🐝 Ruches       │ │
│ │ Belgique        │ │ Madagascar      │ │ Luxembourg      │ │
│ │ €12,450/€15,000 │ │ €8,200/€10,000  │ │ €5,600/€8,000   │ │
│ │ 83% • 45 inv.   │ │ 82% • 27 inv.   │ │ 70% • 18 inv.   │ │
│ │ [Voir] [Edit]   │ │ [Voir] [Edit]   │ │ [Voir] [Edit]   │ │
│ └─────────────────┘ └─────────────────┘ └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Modal Création/Édition Projet
```text
┌─────────────────────────────────────────────────────────────┐
│ Nouveau Projet d'Investissement                        [✕]  │
├─────────────────────────────────────────────────────────────┤
│ 📋 Informations Générales                                   │
│ Nom: [Ruches Bio Ardennes 2025_________________]            │
│ Type: [Ruches ▼]  Partenaire: [HABEEBEE ▼]                 │
│ Objectif: [€15,000______] Début: [2025-01-15]              │
│                                                             │
│ 📍 Localisation                                             │
│ Adresse: [Rue des Abeilles, 6900 Marche-en-Famenne]        │
│ Coordonnées: [50.2274, 5.3442] [📍 Sélectionner]          │
│ [🗺️ Carte Interactive]                                      │
│                                                             │
│ 📝 Description                                              │
│ [Textarea riche pour description complète_____________]     │
│                                                             │
│ 🖼️ Médias                                                   │
│ [📷 Upload Images] [🎥 Upload Vidéos]                       │
│                                                             │
│ 🎯 Rewards & Production                                     │
│ Points par €: [0.8_] Production estimée: [150kg/an]        │
│ Durée projet: [12 mois] ROI estimé: [12%]                  │
│ Multiplicateur Saisonnier: [1.0] (0.9-1.3)                 │
│                                                             │
│ [Annuler] [Sauvegarder comme brouillon] [Publier]          │
└─────────────────────────────────────────────────────────────┘
```

## 📱 Composants UI

### Header avec Actions
```tsx
<div className="flex justify-between items-center mb-6">
  <div>
    <h1 className="text-3xl font-bold">Projets</h1>
    <p className="text-muted-foreground">
      {activeProjects} projets actifs • {totalInvested} investis
    </p>
  </div>
  <div className="flex gap-2">
    <Button variant="outline" onClick={toggleMapView}>
      <Map className="h-4 w-4 mr-2" />
      Vue carte
    </Button>
    <Button onClick={createProject}>
      <Plus className="h-4 w-4 mr-2" />
      Nouveau Projet
    </Button>
  </div>
</div>
```

### Filtres et Recherche
```tsx
<div className="flex gap-4 mb-6">
  <Input
    placeholder="Rechercher projets..."
    value={searchQuery}
    onChange={setSearchQuery}
    className="max-w-md"
  />
  <Select value={typeFilter} onValueChange={setTypeFilter}>
    <SelectTrigger className="w-32">
      <SelectValue placeholder="Type" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">Tous</SelectItem>
      <SelectItem value="beehive">Ruches</SelectItem>
      <SelectItem value="olive">Oliviers</SelectItem>
    </SelectContent>
  </Select>
  <Select value={statusFilter} onValueChange={setStatusFilter}>
    <SelectTrigger className="w-32">
      <SelectValue placeholder="Statut" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">Tous</SelectItem>
      <SelectItem value="active">Actifs</SelectItem>
      <SelectItem value="completed">Terminés</SelectItem>
      <SelectItem value="draft">Brouillons</SelectItem>
    </SelectContent>
  </Select>
  <Select value={partnerFilter} onValueChange={setPartnerFilter}>
    <SelectTrigger className="w-40">
      <SelectValue placeholder="Partenaire" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">Tous</SelectItem>
      <SelectItem value="habeebee">HABEEBEE</SelectItem>
      <SelectItem value="ilanga">ILANGA NATURE</SelectItem>
      <SelectItem value="promiel">PROMIEL</SelectItem>
    </SelectContent>
  </Select>
</div>
```

### Card Projet
```tsx
<Card className="hover:shadow-lg transition-shadow">
  <CardHeader>
    <div className="flex justify-between items-start">
      <div>
        <CardTitle className="flex items-center">
          {project.type === 'beehive' ? '🐝' : '🫒'} {project.name}
        </CardTitle>
        <CardDescription>
          {project.partner.name} • {project.location.country}
        </CardDescription>
      </div>
      <Badge variant={project.status === 'active' ? 'success' : 'secondary'}>
        {project.status}
      </Badge>
    </div>
  </CardHeader>
  
  <CardContent>
    {/* Progress de financement */}
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>€{project.current_amount}</span>
        <span>€{project.target_amount}</span>
      </div>
      <Progress value={project.progress_percentage} className="h-2" />
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{project.progress_percentage}% financé</span>
        <span>{project.investor_count} investisseurs</span>
      </div>
    </div>
    
    {/* Métriques clés */}
    <div className="grid grid-cols-2 gap-4 mt-4">
      <div>
        <div className="text-sm text-muted-foreground">Production estimée</div>
        <div className="font-medium">{project.estimated_production}</div>
      </div>
      <div>
        <div className="text-sm text-muted-foreground">ROI estimé</div>
        <div className="font-medium">{project.estimated_roi}%</div>
      </div>
    </div>
  </CardContent>
  
  <CardFooter className="gap-2">
    <Button variant="outline" size="sm" onClick={() => viewProject(project.id)}>
      <Eye className="h-4 w-4 mr-2" />
      Voir
    </Button>
    <Button variant="outline" size="sm" onClick={() => editProject(project.id)}>
      <Edit className="h-4 w-4 mr-2" />
      Modifier
    </Button>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => duplicateProject(project.id)}>
          <Copy className="mr-2 h-4 w-4" />
          Dupliquer
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => viewAnalytics(project.id)}>
          <BarChart className="mr-2 h-4 w-4" />
          Analytics
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => archiveProject(project.id)}
          className="text-destructive"
        >
          <Archive className="mr-2 h-4 w-4" />
          Archiver
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </CardFooter>
</Card>
```

### Formulaire Création/Édition
```tsx
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
    {/* Informations générales */}
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Informations générales</h3>
      
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nom du projet</FormLabel>
            <FormControl>
              <Input placeholder="Ruches Bio Ardennes 2025" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="beehive">🐝 Ruches</SelectItem>
                  <SelectItem value="olive">🫒 Oliviers</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="partner_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Partenaire</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner partenaire" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="habeebee">HABEEBEE</SelectItem>
                  <SelectItem value="ilanga">ILANGA NATURE</SelectItem>
                  <SelectItem value="promiel">PROMIEL</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>

    {/* Localisation */}
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Localisation</h3>
      
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Adresse</FormLabel>
            <FormControl>
              <Input placeholder="Adresse complète du projet" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="latitude"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Latitude</FormLabel>
              <FormControl>
                <Input type="number" step="any" placeholder="50.2274" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="longitude"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Longitude</FormLabel>
              <FormControl>
                <Input type="number" step="any" placeholder="5.3442" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      {/* Carte interactive pour sélection */}
      <div className="h-64 rounded-lg border">
        <MapPicker
          position={[form.watch('latitude'), form.watch('longitude')]}
          onPositionChange={(lat, lng) => {
            form.setValue('latitude', lat);
            form.setValue('longitude', lng);
          }}
        />
      </div>
    </div>

    {/* Actions */}
    <div className="flex gap-2">
      <Button type="button" variant="outline" onClick={onCancel}>
        Annuler
      </Button>
      <Button type="button" variant="outline" onClick={saveDraft}>
        Sauvegarder brouillon
      </Button>
      <Button type="submit">
        {isEditing ? 'Mettre à jour' : 'Créer projet'}
      </Button>
    </div>
  </form>
</Form>
```

## 🔄 États & Interactions

### États du Projet
```typescript
type ProjectStatus = 
  | 'draft'      // Brouillon en cours de création
  | 'active'     // Ouvert aux investissements
  | 'completed'  // Objectif atteint
  | 'expired'    // Délai dépassé
  | 'cancelled'  // Annulé par admin
  | 'archived';  // Archivé après completion

type ProjectType = 'beehive' | 'olive';
```

### Workflow Création
```text
1. Brouillon → Validation admin
2. Active → Ouvert investissements
3. Completed → Objectif atteint
4. Production → Suivi rendements
5. Archived → Fin de cycle
```

### Validation Formulaire
```typescript
const projectSchema = z.object({
  name: z.string().min(5).max(100),
  type: z.enum(['beehive', 'olive']),
  partner_id: z.string().uuid(),
  target_amount: z.number().min(1000).max(50000),
  description: z.string().min(100),
  address: z.string().min(10),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  estimated_production: z.string(),
  estimated_roi: z.number().min(0).max(50),
  duration_months: z.number().min(6).max(24),
  images: z.array(z.string().url()).max(10)
});
```

## 📡 API & Données

### Routes tRPC
```typescript
// CRUD Projets
admin.projects.list: {
  input: {
    page: number;
    limit: number;
    search?: string;
    type?: ProjectType;
    status?: ProjectStatus;
    partner_id?: string;
  };
  output: {
    projects: Project[];
    total: number;
    stats: ProjectStats;
  };
}

admin.projects.create: {
  input: CreateProjectInput;
  output: { project: Project; success: boolean };
}

admin.projects.update: {
  input: { id: string; data: UpdateProjectInput };
  output: { project: Project; success: boolean };
}

admin.projects.detail: {
  input: { id: string };
  output: {
    project: ProjectDetail;
    investments: Investment[];
    production_data: ProductionData[];
    analytics: ProjectAnalytics;
  };
}

// Actions spéciales
admin.projects.duplicate: {
  input: { id: string; name: string };
  output: { project: Project; success: boolean };
}

admin.projects.change_status: {
  input: { id: string; status: ProjectStatus; reason?: string };
  output: { success: boolean };
}
```

### Modèles de Données
```typescript
interface Project {
  id: string;
  name: string;
  description: string;
  type: ProjectType;
  status: ProjectStatus;
  partner: Partner;
  target_amount: number;
  current_amount: number;
  progress_percentage: number;
  investor_count: number;
  location: {
    address: string;
    latitude: number;
    longitude: number;
    country: string;
    region: string;
  };
  estimated_production: string;
  estimated_roi: number;
  duration_months: number;
  images: string[];
  videos?: string[];
  created_at: Date;
  start_date?: Date;
  end_date?: Date;
}

interface ProjectDetail extends Project {
  investments: Investment[];
  production_updates: ProductionUpdate[];
  analytics: {
    daily_investments: Array<{ date: Date; amount: number; count: number }>;
    investor_demographics: any;
    conversion_rates: any;
  };
  partner_data: {
    contact_person: string;
    phone: string;
    email: string;
    commission_rate: number;
  };
}
```

## ✅ Validations

### Contraintes Business
- **Objectif minimum** : €1,000 par projet
- **Objectif maximum** : €50,000 par projet
- **Durée** : 6-24 mois maximum
- **Géolocalisation** : Coordonnées GPS obligatoires
- **Partenaire** : Obligatoire et validé

### Permissions
- **Manager** : CRUD projets + changement statut
- **Admin** : Toutes actions + archivage
- **Partner** : Lecture seule ses projets + updates production

### Validation Géographique
```typescript
// Zones autorisées par partenaire
const authorizedRegions = {
  habeebee: ['Belgium', 'Luxembourg'],
  ilanga: ['Madagascar'],
  promiel: ['Luxembourg']
};
```

## 🚨 Gestion d'Erreurs

### Validation Géolocalisation
- **Coordonnées invalides** : Validation côté serveur
- **Zone non autorisée** : Vérification partenaire/région
- **Adresse incohérente** : Géocodage inverse

### Gestion Fichiers
- **Upload failed** : Retry automatique
- **Taille excessive** : Compression auto
- **Format non supporté** : Conversion auto

## 🔗 Navigation

### Liens Contextuels
```typescript
const projectActions = {
  viewInvestments: `/admin/investments?project_id=${projectId}`,
  viewProduction: `/admin/production?project_id=${projectId}`,
  viewAnalytics: `/admin/analytics/projects/${projectId}`,
  editProject: `/admin/projects/${projectId}/edit`,
  viewOnMap: `/admin/projects/map?highlight=${projectId}`
};
```

## 📝 Tests Utilisateur

### Scénarios Critiques
1. **Création projet** : Workflow complet <5min
2. **Upload médias** : Images/vidéos <30s
3. **Géolocalisation** : Sélection carte précise
4. **Validation** : Erreurs claires et actionnables
5. **Duplication** : Copie et modification rapide

### Performance
- **Liste projets** : <1s pour 100 projets
- **Création/édition** : <2s sauvegarde
- **Upload image** : <10s par image
- **Carte interactive** : <3s chargement

## 💾 Stockage Local

### Draft Auto-save
```typescript
interface ProjectDraft {
  formData: Partial<CreateProjectInput>;
  lastSaved: Date;
  version: number;
}
```

### Filtres et Vues
```typescript
interface ProjectViewPrefs {
  viewMode: 'grid' | 'list' | 'map';
  defaultFilters: ProjectFilters;
  sortBy: 'name' | 'created_at' | 'progress' | 'target_amount';
  itemsPerPage: number;
}
```

---

**Stack Technique** : React Hook Form + Zod + Google Maps API + Vercel Blob Store  
**Priorité** : 🔥 Critique - Cœur du business model  
**Estimation** : 8-12 jours développement + intégration maps
