# Détail Projet & Investissement - Site E-commerce

## 🎯 Objectif

Convaincre l'utilisateur d'investir dans un projet spécifique en présentant toutes les informations nécessaires et faciliter le processus d'investissement.

## 👤 Utilisateurs Cibles

- **Visiteurs anonymes** : Peuvent voir le projet, incités à s'inscrire pour investir
- **Utilisateurs connectés** : Peuvent investir directement
- **Focus conversion** : Transformation découverte → investissement

## 🎨 Design & Layout

### Structure de Page

```text
[Header Global]
├── Hero Section (Image + Quick Actions)
├── Layout 2 Colonnes:
│   ├── Contenu Principal (70%)
│   │   ├── Tabs (Description, Impact, Producteur, Mises à jour)
│   │   └── Section Commentaires/Avis
│   └── Sidebar Investissement (30%)
│       ├── Card Investissement
│       ├── Stats Projet
│       └── Projets Similaires
├── Modal d'Investissement (Stripe)
└── [Footer Global]
```

### Hero Section

```jsx
<div className="relative h-96 overflow-hidden">
  {/* Galerie d'images */}
  <div className="absolute inset-0">
    <Carousel className="h-full">
      <CarouselContent>
        {project.images.map((image, index) => (
          <CarouselItem key={index}>
            <img
              src={image.url}
              alt={`${project.name} - Image ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-4" />
      <CarouselNext className="right-4" />
    </Carousel>
  </div>
  
  {/* Overlay avec informations */}
  <div className="absolute inset-0 bg-black/40">
    <div className="container mx-auto px-4 h-full flex items-end">
      <div className="text-white pb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Badge variant={getStatusVariant(project.status)} className="bg-white/90 text-slate-900">
            {getStatusLabel(project.status)}
          </Badge>
          {project.is_featured && (
            <Badge variant="default" className="bg-yellow-500">
              <Star className="w-3 h-3 mr-1" />
              Coup de cœur
            </Badge>
          )}
        </div>
        <h1 className="text-4xl font-bold mb-2">{project.name}</h1>
        <p className="text-xl text-white/90 mb-4">{project.short_description}</p>
        <div className="flex items-center space-x-6">
          <div className="flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            <span>{project.location.region}, France</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            <span>{project.duration_months} mois</span>
          </div>
          <div className="flex items-center">
            <Leaf className="w-5 h-5 mr-2" />
            <span>{project.estimated_co2_offset}T CO₂</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

### Sidebar Investissement

```jsx
<div className="space-y-6">
  {/* Card Investissement Principal */}
  <Card className="sticky top-6">
    <CardContent className="p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          Soutenez ce projet
        </h3>
        <p className="text-slate-600 text-sm">
          Choisissez votre niveau de contribution
        </p>
      </div>
      
      {/* Progression financement */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-2xl font-bold text-slate-900">
            {project.funding_progress}%
          </span>
          <span className="text-sm text-slate-500">
            {project.days_remaining} jours restants
          </span>
        </div>
        <Progress value={project.funding_progress} className="h-3 mb-2" />
        <div className="flex justify-between text-sm text-slate-600">
          <span>€{project.current_funding.toLocaleString()}</span>
          <span>€{project.funding_goal.toLocaleString()}</span>
        </div>
      </div>
      
      {/* Options d'investissement */}
      <div className="space-y-3 mb-6">
        {investmentTiers.map((tier) => (
          <div
            key={tier.amount}
            className={cn(
              "border rounded-lg p-4 cursor-pointer transition-all",
              selectedTier === tier.amount
                ? "border-green-500 bg-green-50"
                : "border-slate-200 hover:border-slate-300"
            )}
            onClick={() => setSelectedTier(tier.amount)}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-slate-900">
                €{tier.amount}
              </span>
              <Badge variant="secondary">
                {tier.points} points
              </Badge>
            </div>
            <p className="text-sm text-slate-600">{tier.description}</p>
            {tier.benefits && (
              <ul className="text-xs text-slate-500 mt-2 space-y-1">
                {tier.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="w-3 h-3 mr-1 text-green-500" />
                    {benefit}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
      
      {/* Bouton d'investissement */}
      {isAuthenticated ? (
        <Button
          className="w-full text-lg py-6"
          onClick={handleInvestment}
          disabled={!selectedTier || project.status !== 'funding'}
        >
          <Heart className="w-5 h-5 mr-2" />
          Investir €{selectedTier}
        </Button>
      ) : (
        <div className="space-y-3">
          <Button className="w-full text-lg py-6" asChild>
            <Link href="/auth/register">
              <UserPlus className="w-5 h-5 mr-2" />
              S'inscrire pour investir
            </Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/auth/login">
              J'ai déjà un compte
            </Link>
          </Button>
        </div>
      )}
      
      {/* Informations complémentaires */}
      <div className="mt-6 pt-6 border-t space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Investisseurs</span>
          <span className="font-medium">{project.investors_count}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Collecté</span>
          <span className="font-medium">€{project.current_funding.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Objectif</span>
          <span className="font-medium">€{project.funding_goal.toLocaleString()}</span>
        </div>
      </div>
    </CardContent>
  </Card>
  
  {/* Producteur */}
  <Card>
    <CardContent className="p-6">
      <h4 className="font-semibold text-slate-900 mb-4">Le Producteur</h4>
      <div className="flex items-center space-x-4 mb-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={project.producer.avatar} />
          <AvatarFallback>{project.producer.name.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-slate-900">{project.producer.name}</p>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm text-slate-600 ml-1">
              {project.producer.rating}/5 ({project.producer.reviews_count} avis)
            </span>
          </div>
        </div>
      </div>
      <p className="text-sm text-slate-600 mb-4">
        {project.producer.bio}
      </p>
      <Button variant="outline" size="sm" className="w-full">
        <MessageSquare className="w-4 h-4 mr-2" />
        Contacter le producteur
      </Button>
    </CardContent>
  </Card>
  
  {/* Projets similaires */}
  <Card>
    <CardContent className="p-6">
      <h4 className="font-semibold text-slate-900 mb-4">Projets similaires</h4>
      <div className="space-y-4">
        {similarProjects.slice(0, 3).map((similarProject) => (
          <div key={similarProject.id} className="flex space-x-3">
            <img
              src={similarProject.images[0]?.url}
              alt={similarProject.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1 min-w-0">
              <h5 className="font-medium text-sm text-slate-900 line-clamp-1">
                {similarProject.name}
              </h5>
              <p className="text-xs text-slate-600 line-clamp-2">
                {similarProject.short_description}
              </p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-slate-500">
                  {similarProject.funding_progress}% financé
                </span>
                <Button size="xs" variant="ghost" asChild>
                  <Link href={`/projets/${similarProject.id}`}>
                    Voir
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
</div>
```

### Contenu Principal avec Tabs

```jsx
<Tabs defaultValue="description" className="space-y-6">
  <TabsList className="grid w-full grid-cols-4">
    <TabsTrigger value="description">Description</TabsTrigger>
    <TabsTrigger value="impact">Impact</TabsTrigger>
    <TabsTrigger value="producer">Producteur</TabsTrigger>
    <TabsTrigger value="updates">Mises à jour</TabsTrigger>
  </TabsList>

  <TabsContent value="description" className="space-y-6">
    <Card>
      <CardContent className="p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          À propos de ce projet
        </h2>
        <div className="prose prose-slate max-w-none">
          <ReactMarkdown>{project.description}</ReactMarkdown>
        </div>
        
        {/* Métriques clés */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-8 border-t">
          <div className="text-center">
            <TreePine className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-900">{project.trees_planted}</p>
            <p className="text-sm text-slate-600">Arbres plantés</p>
          </div>
          <div className="text-center">
            <Droplets className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-900">{project.water_saved}L</p>
            <p className="text-sm text-slate-600">Eau économisée</p>
          </div>
          <div className="text-center">
            <Leaf className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-900">{project.biodiversity_score}</p>
            <p className="text-sm text-slate-600">Score biodiversité</p>
          </div>
          <div className="text-center">
            <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-900">{project.jobs_created}</p>
            <p className="text-sm text-slate-600">Emplois créés</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </TabsContent>

  <TabsContent value="impact" className="space-y-6">
    <Card>
      <CardContent className="p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Impact Environnemental
        </h2>
        
        {/* Timeline impact */}
        <div className="space-y-6">
          {project.impact_timeline.map((phase, index) => (
            <div key={index} className="flex space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">{index + 1}</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 mb-1">
                  {phase.title}
                </h3>
                <p className="text-slate-600 text-sm mb-2">
                  {phase.description}
                </p>
                <div className="flex items-center text-xs text-slate-500">
                  <Calendar className="w-3 h-3 mr-1" />
                  {phase.timeline}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Graphique impact CO2 */}
        <div className="mt-8 pt-8 border-t">
          <h3 className="font-semibold text-slate-900 mb-4">
            Compensation CO₂ dans le temps
          </h3>
          <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
            {/* Intégration Chart.js ou Recharts */}
            <p className="text-slate-500">Graphique impact CO₂</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </TabsContent>

  <TabsContent value="producer" className="space-y-6">
    <Card>
      <CardContent className="p-8">
        <div className="flex items-center space-x-6 mb-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={project.producer.avatar} />
            <AvatarFallback className="text-2xl">
              {project.producer.name.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {project.producer.name}
            </h2>
            <p className="text-slate-600">{project.producer.title}</p>
            <div className="flex items-center mt-2">
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
              <span className="text-slate-600 ml-1">
                {project.producer.rating}/5 ({project.producer.reviews_count} avis)
              </span>
            </div>
          </div>
        </div>
        
        <div className="prose prose-slate max-w-none mb-6">
          <ReactMarkdown>{project.producer.description}</ReactMarkdown>
        </div>
        
        {/* Certifications */}
        <div className="mb-6">
          <h3 className="font-semibold text-slate-900 mb-3">Certifications</h3>
          <div className="flex flex-wrap gap-2">
            {project.producer.certifications.map((cert) => (
              <Badge key={cert} variant="secondary">
                {cert}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Autres projets */}
        <div>
          <h3 className="font-semibold text-slate-900 mb-3">
            Autres projets de {project.producer.name}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.producer.other_projects.map((otherProject) => (
              <Card key={otherProject.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex space-x-3">
                    <img
                      src={otherProject.images[0]?.url}
                      alt={otherProject.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm text-slate-900 line-clamp-1">
                        {otherProject.name}
                      </h4>
                      <p className="text-xs text-slate-600 line-clamp-2">
                        {otherProject.short_description}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge size="sm" variant={getStatusVariant(otherProject.status)}>
                          {getStatusLabel(otherProject.status)}
                        </Badge>
                        <Button size="xs" variant="outline" asChild>
                          <Link href={`/projets/${otherProject.id}`}>
                            Voir
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  </TabsContent>

  <TabsContent value="updates" className="space-y-6">
    <Card>
      <CardContent className="p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Mises à jour du projet
        </h2>
        
        {project.updates.length > 0 ? (
          <div className="space-y-6">
            {project.updates.map((update) => (
              <div key={update.id} className="border-l-4 border-green-500 pl-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-slate-900">
                    {update.title}
                  </h3>
                  <span className="text-sm text-slate-500">
                    {formatDate(update.created_at)}
                  </span>
                </div>
                <div className="prose prose-slate prose-sm max-w-none">
                  <ReactMarkdown>{update.content}</ReactMarkdown>
                </div>
                {update.images && update.images.length > 0 && (
                  <div className="flex space-x-3 mt-4">
                    {update.images.map((image, index) => (
                      <img
                        key={index}
                        src={image.url}
                        alt={`Mise à jour ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Aucune mise à jour
            </h3>
            <p className="text-slate-600">
              Le producteur n'a pas encore publié de mises à jour pour ce projet.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  </TabsContent>
</Tabs>
```

## 💳 Modal d'Investissement (Stripe)

```jsx
<Dialog open={showInvestmentModal} onOpenChange={setShowInvestmentModal}>
  <DialogContent className="max-w-md">
    <DialogHeader>
      <DialogTitle>Investir dans {project.name}</DialogTitle>
      <DialogDescription>
        Montant sélectionné: €{selectedTier}
      </DialogDescription>
    </DialogHeader>
    
    <div className="space-y-4">
      {/* Récapitulatif */}
      <div className="bg-slate-50 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-slate-600">Contribution</span>
          <span className="font-semibold">€{selectedTier}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-slate-600">Points reçus</span>
          <span className="font-semibold text-green-600">
            +{Math.floor(selectedTier * 0.8)} points
          </span>
        </div>
        <Separator className="my-2" />
        <div className="flex justify-between items-center">
          <span className="font-semibold">Total</span>
          <span className="font-bold text-lg">€{selectedTier}</span>
        </div>
      </div>
      
      {/* Stripe Elements */}
      <div id="stripe-payment-element" className="p-4 border rounded-lg">
        {/* Stripe Payment Element sera monté ici */}
      </div>
      
      <div className="flex space-x-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => setShowInvestmentModal(false)}
        >
          Annuler
        </Button>
        <Button
          className="flex-1"
          onClick={handlePayment}
          disabled={isProcessingPayment}
        >
          {isProcessingPayment ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Traitement...
            </>
          ) : (
            `Investir €${selectedTier}`
          )}
        </Button>
      </div>
    </div>
  </DialogContent>
</Dialog>
```

## 🔄 États & Interactions

### Gestion Investissement

```typescript
interface InvestmentTier {
  amount: number;
  points: number;
  description: string;
  benefits?: string[];
}

const investmentTiers: InvestmentTier[] = [
  {
    amount: 150,
    points: 120,
    description: "Contribution Découverte",
    benefits: ["120 points", "Accès produits partenaires", "Impact tracking"]
  },
  {
    amount: 300,
    points: 240,
    description: "Contribution Engagée",
    benefits: ["240 points", "Produits premium", "Mises à jour exclusives"]
  },
  {
    amount: 600,
    points: 480,
    description: "Contribution Expert",
    benefits: ["480 points", "Tous produits", "Visite du projet", "Support prioritaire"]
  }
];
```

### Flux de Paiement Stripe

```typescript
const handleInvestment = async () => {
  try {
    setIsProcessingPayment(true);
    
    // Création PaymentIntent
    const { client_secret } = await createPaymentIntent({
      amount: selectedTier * 100, // En centimes
      project_id: project.id,
      user_id: user.id
    });
    
    // Confirmation paiement Stripe
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      clientSecret: client_secret,
      confirmParams: {
        return_url: `${window.location.origin}/projets/${project.id}/confirmation`
      }
    });
    
    if (error) {
      toast.error(error.message);
    } else if (paymentIntent.status === 'succeeded') {
      // Succès - redirection automatique
      router.push(`/projets/${project.id}/confirmation`);
    }
  } catch (error) {
    toast.error('Erreur lors du paiement');
  } finally {
    setIsProcessingPayment(false);
  }
};
```

## 📡 API & Données

### Endpoints tRPC

```typescript
// Détail projet
ecommerce.projects.getById: {
  input: { id: string; user_id?: string };
  output: {
    project: ProjectDetails;
    similar_projects: Project[];
    user_investment?: UserInvestment;
  };
}

// Création PaymentIntent
ecommerce.investments.createPaymentIntent: {
  input: {
    project_id: string;
    amount: number;
    user_id: string;
  };
  output: {
    client_secret: string;
    payment_intent_id: string;
  };
}

// Confirmation investissement
ecommerce.investments.confirm: {
  input: {
    payment_intent_id: string;
    project_id: string;
  };
  output: {
    investment: Investment;
    points_earned: number;
    success: boolean;
  };
}
```

## ✅ Validations & Sécurité

### Validation Paiement

```typescript
// Vérification côté serveur
const validateInvestment = async (data: InvestmentData) => {
  // Vérifier que le projet accepte encore des investissements
  if (project.status !== 'funding') {
    throw new Error('Projet non disponible pour investissement');
  }
  
  // Vérifier les montants autorisés
  if (![150, 300, 600].includes(data.amount)) {
    throw new Error('Montant non autorisé');
  }
  
  // Vérifier que l'utilisateur existe
  const user = await getUser(data.user_id);
  if (!user) {
    throw new Error('Utilisateur non trouvé');
  }
  
  return true;
};
```

## 📝 Tests Utilisateur

### Scénarios Critiques

1. **Découverte complète** : Toutes infos projet visibles
2. **Processus d'investissement** : Fluide en <3 clics
3. **Paiement sécurisé** : Stripe intégré sans friction
4. **Confirmation claire** : Succès explicite
5. **Mobile optimisé** : Expérience tablette/mobile

### Métriques Success

- **Temps de chargement** : <2s
- **Taux conversion** : >12% visiteurs → investisseurs
- **Paiement success** : >98% réussis
- **Satisfaction** : >4.7/5
- **Mobile conversion** : >60% des investissements

---

**Stack Technique** : Vercel Edge Functions + Stripe + shadcn/ui + tRPC  
**Priorité** : 🔥 Critique - Cœur du business model  
**Estimation** : 12-15 jours développement + intégration Stripe
