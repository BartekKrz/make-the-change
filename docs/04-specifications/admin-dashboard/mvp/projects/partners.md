# 🤝 Gestion des Partenaires

**Administration complète des partenaires producteurs avec KPIs, commissions, et portail collaboratif.**

## 🎯 Objectif

Gérer l'écosystème des partenaires producteurs (HABEEBEE, ILANGA NATURE, PROMIEL) : onboarding, suivi performance, commissions, catalogue produits, et relation commerciale.

## 👤 Utilisateurs Cibles

- **Partnership Manager** : Gestion relations + négociations
- **Accounting** : Commissions, paiements, facturations
- **Operations** : Coordination livraisons + qualité
- **Partners** : Accès portail dédié

## 🎨 Design & Layout

### Page Tableau de Bord Partenaires

```text
┌─────────────────────────────────────────────────────────────┐
│ Partenaires | 3 actifs                   [+ Nouveau]        │
├─────────────────────────────────────────────────────────────┤
│ 📊 KPIs Globaux                                             │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────┐ │
│ │💰 CA Mensuel │ │📦 Commandes  │ │🎯 Satisfaction│ │⏰ Délais│ │
│ │€24,680       │ │347 traitées  │ │4.7/5 ⭐      │ │2.3 jours│ │
│ │+12% vs M-1   │ │+5% vs M-1    │ │+0.2 vs M-1   │ │-0.5j   │ │
│ └──────────────┘ └──────────────┘ └──────────────┘ └────────┘ │
├─────────────────────────────────────────────────────────────┤
│ 🔍 [Recherche] [Statut ▼] [Région ▼] [Performance ▼]       │
├─────────────────────────────────────────────────────────────┤
│ Liste Partenaires                                           │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 🐝 HABEEBEE                                      [Edit] │ │
│ │ Miel & Produits Ruche • Provence • Premium             │ │
│ │ 📈 €18,450/mois • 234 commandes • 4.8⭐ • ✅ Actif     │ │
│ │ 📦 42 produits • Commission: 25% • Paiement: NET15     │ │
│ │ [Produits][Analytics][Commissions][Messages]           │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 🌿 ILANGA NATURE                                 [Edit] │ │
│ │ Cosmétiques Naturels • Bio • Standard                  │ │
│ │ 📈 €5,120/mois • 98 commandes • 4.6⭐ • ✅ Actif       │ │
│ │ 📦 28 produits • Commission: 20% • Paiement: NET30     │ │
│ │ [Produits][Analytics][Commissions][Messages]           │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Modal Détails Partenaire

```text
┌─────────────────────────────────────────────────────────────┐
│ HABEEBEE - Partenaire Premium                          [✕] │
├─────────────────────────────────────────────────────────────┤
│ Tabs: [Informations][Produits][Analytics][Financier][QR]    │
├─────────────────────────────────────────────────────────────┤
│ 📋 Informations Générales                                   │
│ ┌─────────────────┐ Nom: [HABEEBEE________________]         │
│ │ [Logo Upload]   │ Email: [contact@habeebee.fr___]         │
│ │ 📷 150x150     │ Téléphone: [+33 4 XX XX XX XX]          │
│ └─────────────────┘ Site web: [www.habeebee.fr____]         │
│                                                             │
│ 📍 Adresse & Livraison                                     │
│ Adresse: [123 Route des Lavandes, 84000 Avignon___]        │
│ SIRET: [12345678901234] TVA: [FR12345678901____]            │
│ Région: [Provence-Alpes-Côte d'Azur ▼]                     │
│                                                             │
│ 🤝 Commercial                                              │
│ Tier: [Premium ▼] Commission: [25___]%                     │
│ Conditions paiement: [NET15 ▼]                             │
│ Gestionnaire: [Marie Dubois ▼]                             │
│                                                             │
│ 📊 Certifications                                          │
│ [✓] Bio Agriculture   [✓] Qualité France                   │
│ [✓] Commerce Équitable   [ ] Vegan Certified               │
│                                                             │
│ [Sauvegarder] [Voir portail](./portal.md) [Contacter]                   │
└─────────────────────────────────────────────────────────────┘
```

## 📱 Composants UI

### KPIs Dashboard Header

```tsx
<div className="grid grid-cols-4 gap-6 mb-8">
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">CA Mensuel</p>
          <p className="text-2xl font-bold">€{totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-green-600 flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" />
            +{revenueGrowth}% vs mois précédent
          </p>
        </div>
        <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
          <Euro className="h-6 w-6 text-green-600" />
        </div>
      </div>
    </CardContent>
  </Card>

  <Card>
    <CardContent className="p-6">
      <div className="flex items-center">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">Commandes</p>
          <p className="text-2xl font-bold">{totalOrders}</p>
          <p className="text-xs text-blue-600 flex items-center">
            <Package className="h-3 w-3 mr-1" />
            {completedOrders} complétées
          </p>
        </div>
        <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <ShoppingCart className="h-6 w-6 text-blue-600" />
        </div>
      </div>
    </CardContent>
  </Card>

  <Card>
    <CardContent className="p-6">
      <div className="flex items-center">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">Satisfaction</p>
          <p className="text-2xl font-bold flex items-center">
            {averageRating}/5
            <Star className="h-5 w-5 text-yellow-500 ml-1 fill-current" />
          </p>
          <p className="text-xs text-green-600 flex items-center">
            <ThumbsUp className="h-3 w-3 mr-1" />
            +0.2 vs mois précédent
          </p>
        </div>
        <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
          <Heart className="h-6 w-6 text-yellow-600" />
        </div>
      </div>
    </CardContent>
  </Card>

  <Card>
    <CardContent className="p-6">
      <div className="flex items-center">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">Délai Moyen</p>
          <p className="text-2xl font-bold">{averageDeliveryTime} jours</p>
          <p className="text-xs text-green-600 flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            -0.5j amélioration
          </p>
        </div>
        <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
          <Truck className="h-6 w-6 text-purple-600" />
        </div>
      </div>
    </CardContent>
  </Card>
</div>
```

### Card Partenaire

```tsx
<Card className="hover:shadow-lg transition-shadow">
  <CardContent className="p-6">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center space-x-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={partner.logo} alt={partner.name} />
          <AvatarFallback>{partner.name.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            {partner.name}
            <Badge variant={partner.tier === 'premium' ? 'default' : 'secondary'}>
              {partner.tier}
            </Badge>
          </h3>
          <p className="text-sm text-muted-foreground">
            {partner.category} • {partner.region}
          </p>
          <div className="flex items-center mt-1">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="text-sm ml-1">{partner.rating}/5</span>
            <span className="mx-2">•</span>
            <Badge variant={partner.status === 'active' ? 'success' : 'secondary'}>
              {partner.status}
            </Badge>
          </div>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => editPartner(partner.id)}>
            <Edit className="mr-2 h-4 w-4" />
            Modifier
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => viewPortal(partner.id)}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Voir portail
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => sendMessage(partner.id)}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Envoyer message
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => generateReport(partner.id)}>
            <FileText className="mr-2 h-4 w-4" />
            Rapport performance
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <div className="grid grid-cols-2 gap-4 mb-4">
      <div className="text-center p-3 bg-green-50 rounded-lg">
        <p className="text-sm text-muted-foreground">CA Mensuel</p>
        <p className="text-lg font-semibold text-green-700">
          €{partner.monthly_revenue.toLocaleString()}
        </p>
      </div>
      <div className="text-center p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-muted-foreground">Commandes</p>
        <p className="text-lg font-semibold text-blue-700">
          {partner.orders_count}
        </p>
      </div>
    </div>

    <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
      <span>{partner.products_count} produits</span>
      <span>Commission: {partner.commission_rate}%</span>
      <span>Paiement: {partner.payment_terms}</span>
    </div>

    <div className="flex gap-2">
      <Button variant="outline" size="sm" className="flex-1" onClick={() => viewProducts(partner.id)}>
        <Package className="h-4 w-4 mr-2" />
        Produits
      </Button>
      <Button variant="outline" size="sm" className="flex-1" onClick={() => viewAnalytics(partner.id)}>
        <BarChart className="h-4 w-4 mr-2" />
        Analytics
      </Button>
      <Button variant="outline" size="sm" className="flex-1" onClick={() => viewCommissions(partner.id)}>
        <DollarSign className="h-4 w-4 mr-2" />
        Commissions
      </Button>
    </div>
  </CardContent>
</Card>
```

### Formulaire Partenaire

```tsx
<Form {...partnerForm}>
  <form onSubmit={partnerForm.handleSubmit(onSubmit)} className="space-y-6">
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="general">Général</TabsTrigger>
        <TabsTrigger value="commercial">Commercial</TabsTrigger>
        <TabsTrigger value="logistics">Logistique</TabsTrigger>
        <TabsTrigger value="quality">Qualité</TabsTrigger>
        <TabsTrigger value="portal">Portail</TabsTrigger>
      </TabsList>

      <TabsContent value="general" className="space-y-4">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <FormField
              control={partnerForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du partenaire</FormLabel>
                  <FormControl>
                    <Input placeholder="HABEEBEE" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={partnerForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email principal</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="contact@partenaire.fr" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={partnerForm.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catégorie</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="apiculture">🐝 Apiculture</SelectItem>
                      <SelectItem value="cosmetics">🧴 Cosmétiques</SelectItem>
                      <SelectItem value="food">🥘 Alimentaire</SelectItem>
                      <SelectItem value="crafts">🎨 Artisanat</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <div>
              <FormLabel>Logo partenaire</FormLabel>
              <div className="mt-2">
                <ImageUpload
                  value={partnerLogo}
                  onChange={setPartnerLogo}
                  maxImages={1}
                  aspect="square"
                />
              </div>
            </div>

            <FormField
              control={partnerForm.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Région</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="provence">Provence-Alpes-Côte d'Azur</SelectItem>
                      <SelectItem value="occitanie">Occitanie</SelectItem>
                      <SelectItem value="auvergne">Auvergne-Rhône-Alpes</SelectItem>
                      <SelectItem value="nouvelle_aquitaine">Nouvelle-Aquitaine</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="commercial" className="space-y-4">
        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={partnerForm.control}
            name="tier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tier Partenaire</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="standard">Standard (20% commission)</SelectItem>
                    <SelectItem value="premium">Premium (25% commission)</SelectItem>
                    <SelectItem value="exclusive">Exclusif (30% commission)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={partnerForm.control}
            name="commission_rate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Taux Commission (%)</FormLabel>
                <FormControl>
                  <Input type="number" min="10" max="40" {...field} />
                </FormControl>
                <FormDescription>
                  Basé sur le prix de vente final
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={partnerForm.control}
            name="payment_terms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Conditions Paiement</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="net7">NET 7 (7 jours)</SelectItem>
                    <SelectItem value="net15">NET 15 (15 jours)</SelectItem>
                    <SelectItem value="net30">NET 30 (30 jours)</SelectItem>
                    <SelectItem value="net45">NET 45 (45 jours)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={partnerForm.control}
            name="account_manager"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gestionnaire Compte</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Assigner" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="marie">Marie Dubois</SelectItem>
                    <SelectItem value="jean">Jean Martin</SelectItem>
                    <SelectItem value="sophie">Sophie Laurent</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </TabsContent>

      <TabsContent value="quality" className="space-y-4">
        <div>
          <FormLabel className="text-base font-medium">Certifications</FormLabel>
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div className="flex items-center space-x-2">
              <Checkbox id="bio" />
              <label htmlFor="bio" className="text-sm">Bio Agriculture</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="fair_trade" />
              <label htmlFor="fair_trade" className="text-sm">Commerce Équitable</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="quality_france" />
              <label htmlFor="quality_france" className="text-sm">Qualité France</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="vegan" />
              <label htmlFor="vegan" className="text-sm">Vegan Certified</label>
            </div>
          </div>
        </div>

        <FormField
          control={partnerForm.control}
          name="quality_score"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Score Qualité Initial</FormLabel>
              <FormControl>
                <Slider
                  min={1}
                  max={5}
                  step={0.1}
                  value={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                />
              </FormControl>
              <FormDescription>
                Score qualité initial: {field.value}/5
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </TabsContent>
    </Tabs>

    <DialogFooter>
      <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
        Annuler
      </Button>
      <Button type="submit">
        {isEditing ? 'Mettre à jour' : 'Créer partenaire'}
      </Button>
    </DialogFooter>
  </form>
</Form>
```

## 🔄 États & Interactions

### États Partenaire

```typescript
type PartnerStatus = 
  | 'pending'      // En attente validation
  | 'active'       // Actif et opérationnel
  | 'suspended'    // Suspendu temporairement
  | 'terminated';  // Partenariat terminé

type PartnerTier = 
  | 'standard'     // 20% commission
  | 'premium'      // 25% commission
  | 'exclusive';   // 30% commission
```

### Calculs Automatiques

```typescript
// Commission automatique par tier
const getCommissionRate = (tier: PartnerTier): number => {
  const rates = {
    'standard': 0.20,
    'premium': 0.25,
    'exclusive': 0.30
  };
  return rates[tier];
};

// Score de performance global
const calculatePerformanceScore = (partner: Partner) => {
  const qualityWeight = 0.3;
  const deliveryWeight = 0.25;
  const satisfactionWeight = 0.25;
  const salesWeight = 0.2;
  
  return (
    partner.quality_score * qualityWeight +
    partner.delivery_score * deliveryWeight +
    partner.satisfaction_score * satisfactionWeight +
    partner.sales_score * salesWeight
  );
};
```

## 📡 API & Données

### Routes tRPC

```typescript
// CRUD Partenaires
admin.partners.list: {
  input: {
    page: number;
    limit: number;
    search?: string;
    status?: PartnerStatus;
    tier?: PartnerTier;
    region?: string;
  };
  output: {
    partners: Partner[];
    total: number;
    kpis: PartnerKPIs;
  };
}

admin.partners.create: {
  input: CreatePartnerInput;
  output: { partner: Partner; portal_credentials: PortalCredentials };
}

// Analytics partenaire
admin.partners.analytics: {
  input: { partner_id: string; date_range?: [Date, Date] };
  output: {
    revenue_trend: Array<{ date: Date; revenue: number }>;
    order_metrics: OrderMetrics;
    product_performance: ProductPerformance[];
    quality_scores: QualityScores;
  };
}

// Commissions
admin.partners.commissions: {
  input: { partner_id: string; period: string };
  output: {
    commission_total: number;
    commission_details: CommissionDetail[];
    payment_status: PaymentStatus;
  };
}
```

### Modèles de Données

```typescript
interface Partner {
  id: string;
  name: string;
  email: string;
  logo_url?: string;
  category: string;
  region: string;
  tier: PartnerTier;
  status: PartnerStatus;
  commission_rate: number;
  payment_terms: string;
  account_manager_id: string;
  
  // Scores performance
  quality_score: number;
  delivery_score: number;
  satisfaction_score: number;
  overall_score: number;
  
  // Métriques business
  monthly_revenue: number;
  orders_count: number;
  products_count: number;
  rating: number;
  
  // Certifications
  certifications: string[];
  
  // Informations légales
  siret?: string;
  vat_number?: string;
  address?: string;
  
  created_at: Date;
  updated_at: Date;
}

interface CommissionDetail {
  id: string;
  partner_id: string;
  order_id: string;
  product_name: string;
  sale_amount: number;
  commission_rate: number;
  commission_amount: number;
  status: 'pending' | 'paid' | 'disputed';
  created_at: Date;
}

interface PartnerPortalAccess {
  partner_id: string;
  username: string;
  last_login?: Date;
  permissions: string[];
  is_active: boolean;
}
```

## ✅ Validations

### Contraintes Business

- **Commission minimum** : 15% pour tous tiers
- **Commission maximum** : 40% pour exclusifs
- **Score qualité minimum** : 3.0/5 pour activation
- **Délai paiement maximum** : NET 45

### Permissions

- **Partnership Manager** : CRUD complet + négociations
- **Accounting** : Commissions + paiements
- **Admin** : Toutes actions
- **Support** : Lecture + communication

## 🚨 Gestion d'Erreurs

### Scenarios Problématiques

```typescript
const partnerErrors = {
  COMMISSION_TOO_LOW: "Commission en dessous du minimum autorisé",
  SIRET_INVALID: "SIRET invalide ou déjà utilisé",
  QUALITY_SCORE_LOW: "Score qualité insuffisant pour activation",
  PORTAL_ACCESS_FAILED: "Impossible de créer accès portail"
};
```

## 📝 Tests Utilisateur

### Scénarios Critiques

1. **Onboarding partenaire** : Processus complet <10min
2. **Calcul commissions** : Précision 100%
3. **Analytics performance** : Temps réel
4. **Communication** : Messages instantanés
5. **Portail accès** : Login fluide

### Performance

- **Liste partenaires** : <800ms
- **Analytics génération** : <3s
- **Commission calcul** : <1s
- **Export rapport** : <5s

---

**Stack Technique** : React Hook Form + Chart.js + tRPC + PostgreSQL  
**Priorité** : 🔥 Critique - Cœur relation partenaires  
**Estimation** : 10-14 jours développement + portail partenaire
