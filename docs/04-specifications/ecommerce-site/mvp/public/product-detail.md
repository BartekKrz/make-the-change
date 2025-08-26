# Détail Produit - Site E-commerce

## 🎯 Objectif
Fournir toutes les informations nécessaires pour convaincre l'utilisateur d'acquérir le produit avec ses points, en mettant l'accent sur la qualité et l'origine.

## 👤 Utilisateurs Cibles
- **Visiteurs anonymes** : Consultation, peuvent voir le prix mais pas acheter
- **Utilisateurs connectés** : Achat avec points, ajout panier, historique
- **Tous personas** : Découverte producteur et traçabilité

## 🎨 Design & Layout

### Structure de Page
```
[Header Global]
├── Breadcrumb Navigation
├── Layout 2 Colonnes:
│   ├── Zone Média (50%)
│   │   ├── Galerie Images Principale
│   │   └── Galerie Miniatures
│   └── Zone Informations (50%)
│       ├── Header Produit
│       ├── Prix et Disponibilité  
│       ├── Actions (Panier/Favoris)
│       └── Informations Rapides
├── Tabs Détaillées
│   ├── Tab "Description"
│   ├── Tab "Le Producteur"  
│   └── Tab "Avis"
├── Section "Produits Similaires"
└── [Footer Global]
```

### Breadcrumb
```jsx
<nav className="py-4 bg-slate-50">
  <div className="container mx-auto">
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Accueil</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/produits">Produits</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href={`/produits?categories=${product.category.slug}`}>
            {product.category.name}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{product.name}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  </div>
</nav>
```

### Zone Média
**Composants :**
- **Galerie principale** : Image grande taille avec zoom
- **Miniatures** : Navigation entre images
- **Badges** : Bio, Local, Nouveauté

```jsx
<div className="space-y-4">
  <div className="aspect-square relative bg-slate-100 rounded-lg overflow-hidden">
    <Image
      src={product.images[activeImageIndex]}
      alt={product.name}
      fill
      className="object-cover cursor-zoom-in"
      onClick={openZoomModal}
    />
    
    {product.badges.map(badge => (
      <Badge 
        key={badge} 
        className="absolute top-4 left-4 bg-emerald-500"
      >
        {badge}
      </Badge>
    ))}
  </div>
  
  <div className="flex space-x-2 overflow-x-auto">
    {product.images.map((image, index) => (
      <button
        key={index}
        className={cn(
          "flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2",
          activeImageIndex === index ? "border-emerald-500" : "border-slate-200"
        )}
        onClick={() => setActiveImageIndex(index)}
      >
        <Image src={image} alt="" width={80} height={80} className="object-cover" />
      </button>
    ))}
  </div>
</div>
```

### Zone Informations
```jsx
<div className="space-y-6">
  {/* Header Produit */}
  <div>
    <div className="flex items-center space-x-2 mb-2">
      <Badge variant="secondary">{product.category.name}</Badge>
      {product.isNew && <Badge className="bg-orange-500">Nouveau</Badge>}
    </div>
    <h1 className="text-3xl font-bold text-slate-900 mb-2">
      {product.name}
    </h1>
    <p className="text-slate-600">Par {product.producer.name}</p>
  </div>

  {/* Prix et Stock */}
  <div className="p-4 bg-slate-50 rounded-lg">
    <div className="flex items-baseline space-x-2 mb-2">
      <span className="text-2xl font-bold text-emerald-600">
        {product.pointsPrice}
      </span>
      <span className="text-lg text-slate-600">points</span>
      {product.originalPrice && (
        <span className="text-sm text-slate-400 line-through ml-4">
          {product.originalPrice}€
        </span>
      )}
    </div>
    
    <div className="flex items-center space-x-2">
      <div className={cn(
        "w-2 h-2 rounded-full",
        product.stock > 10 ? "bg-green-500" : 
        product.stock > 0 ? "bg-yellow-500" : "bg-red-500"
      )} />
      <span className="text-sm text-slate-600">
        {product.stock > 10 ? "En stock" :
         product.stock > 0 ? `Plus que ${product.stock} disponible(s)` :
         "Rupture de stock"}
      </span>
    </div>
  </div>

  {/* Actions */}
  <div className="space-y-3">
    {user ? (
      <>
        <div className="flex items-center space-x-2 text-sm text-slate-600 mb-2">
          <Wallet className="w-4 h-4" />
          <span>Votre solde : {user.pointsBalance} points</span>
        </div>
        
        <div className="flex space-x-3">
          <Button
            size="lg"
            className="flex-1"
            disabled={!product.isAvailable || product.stock === 0 || user.pointsBalance < product.pointsPrice}
            onClick={addToCart}
          >
            {product.stock === 0 ? "Rupture de stock" :
             user.pointsBalance < product.pointsPrice ? "Points insuffisants" :
             "Ajouter au panier"}
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={toggleWishlist}
          >
            <Heart className={cn("w-4 h-4", isInWishlist && "fill-current text-red-500")} />
          </Button>
        </div>
        
        {user.pointsBalance < product.pointsPrice && (
          <div className="p-3 bg-blue-50 rounded-lg text-sm">
            <div className="flex items-start space-x-2">
              <Info className="w-4 h-4 text-blue-500 mt-0.5" />
              <div>
                <p className="text-blue-800 font-medium">Points insuffisants</p>
                <p className="text-blue-700">
                  Il vous manque {product.pointsPrice - user.pointsBalance} points. 
                  <Button variant="link" className="p-0 h-auto text-blue-600">
                    Découvrir les projets à soutenir
                  </Button>
                </p>
              </div>
            </div>
          </div>
        )}
      </>
    ) : (
      <div className="space-y-3">
        <Button size="lg" className="w-full" disabled>
          Connectez-vous pour acheter
        </Button>
        <div className="text-center">
          <Button variant="link">Se connecter</Button>
          <span className="text-slate-400 mx-2">ou</span>
          <Button variant="link">Créer un compte</Button>
        </div>
      </div>
    )}
  </div>

  {/* Informations Rapides */}
  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
    <div className="flex items-center space-x-2 text-sm">
      <Truck className="w-4 h-4 text-slate-400" />
      <span>Livraison gratuite</span>
    </div>
    <div className="flex items-center space-x-2 text-sm">
      <Shield className="w-4 h-4 text-slate-400" />
      <span>Qualité garantie</span>
    </div>
    <div className="flex items-center space-x-2 text-sm">
      <Leaf className="w-4 h-4 text-slate-400" />
      <span>100% naturel</span>
    </div>
    <div className="flex items-center space-x-2 text-sm">
      <MapPin className="w-4 h-4 text-slate-400" />
      <span>{product.producer.location}</span>
    </div>
  </div>
</div>
```

### Tabs Détaillées
```jsx
<div className="mt-16">
  <Tabs defaultValue="description" className="w-full">
    <TabsList className="grid w-full grid-cols-3">
      <TabsTrigger value="description">Description</TabsTrigger>
      <TabsTrigger value="producer">Le Producteur</TabsTrigger>
      <TabsTrigger value="reviews">Avis ({product.reviewsCount})</TabsTrigger>
    </TabsList>
    
    <TabsContent value="description" className="mt-8">
      <div className="prose max-w-none">
        <p className="text-lg text-slate-700 mb-6">{product.description}</p>
        
        <h3>Caractéristiques</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {product.characteristics.map((char, index) => (
            <li key={index} className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-500" />
              <span>{char}</span>
            </li>
          ))}
        </ul>
        
        <h3>Conseils d'utilisation</h3>
        <p>{product.usageInstructions}</p>
      </div>
    </TabsContent>
    
    <TabsContent value="producer" className="mt-8">
      <ProducerInfo producer={product.producer} />
    </TabsContent>
    
    <TabsContent value="reviews" className="mt-8">
      <ProductReviews productId={product.id} />
    </TabsContent>
  </Tabs>
</div>
```

## 🔧 Composants Requis

### Composants shadcn/ui
- `Breadcrumb` avec `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`
- `Badge` (variants: default, secondary, destructive)
- `Button` (variants: default, outline, ghost, link)
- `Tabs` avec `TabsList`, `TabsTrigger`, `TabsContent`
- `Dialog` pour zoom image

### Composants Custom
- `ImageGallery` : Galerie avec zoom et navigation
- `ProducerInfo` : Fiche producteur avec photo, bio, localisation
- `ProductReviews` : Liste avis avec notation et pagination
- `RelatedProducts` : Carousel produits similaires
- `ShareProduct` : Boutons partage réseaux sociaux

## 📊 Données Requises

### API Calls
```typescript
const { data: product, isLoading } = trpc.products.getById.useQuery({ 
  id: productId 
});

const { data: relatedProducts } = trpc.products.getRelated.useQuery({
  productId,
  limit: 4
});

const { data: reviews } = trpc.reviews.getByProduct.useQuery({
  productId,
  page: 1,
  limit: 10
});
```

### Types TypeScript
```typescript
interface ProductDetail {
  id: string;
  name: string;
  description: string;
  images: string[];
  pointsPrice: number;
  originalPrice?: number;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  producer: {
    id: string;
    name: string;
    bio: string;
    location: string;
    avatar?: string;
    certifications: string[];
  };
  characteristics: string[];
  usageInstructions: string;
  stock: number;
  isAvailable: boolean;
  isNew: boolean;
  badges: string[];
  reviewsCount: number;
  averageRating: number;
}
```

## 🔄 États & Interactions

### Actions Principales
- **Ajouter au panier** → Animation + update badge header + toast confirmation
- **Zoom image** → Modal plein écran avec navigation
- **Partage** → Modal avec options réseaux sociaux
- **Favoris** → Toggle + sauvegarde + animation coeur

### Gestion Stock Temps Réel
```typescript
// WebSocket ou polling pour stock en temps réel
const { data: stockStatus } = trpc.products.getStock.useQuery(
  { productId },
  { 
    refetchInterval: 30000, // 30s
    enabled: product?.stock < 10 // Plus fréquent si stock bas
  }
);

useEffect(() => {
  if (stockStatus?.stock === 0 && product?.stock > 0) {
    toast.warning("Ce produit vient de passer en rupture de stock");
  }
}, [stockStatus?.stock, product?.stock]);
```

### Navigation Clavier
- **Tab** : Navigation logique entre éléments interactifs
- **Arrow Keys** : Navigation galerie images  
- **Enter/Space** : Activation boutons et liens
- **Escape** : Fermeture modals

## 📱 Responsive Design

### Mobile (< 768px)
- **Layout vertical** : Média au-dessus, infos en-dessous
- **Galerie** : Swipe horizontal pour images
- **Actions** : Boutons full-width, sticky bottom
- **Tabs** : Scroll horizontal si nécessaire

### Tablet (768px-1024px)
- **Layout 2 colonnes** avec proportions ajustées (60/40)
- **Galerie** : Miniatures verticales
- **Navigation** : Touch-friendly

### Desktop (> 1024px)
- **Layout complet** : 50/50 avec hover effects
- **Zoom** : Hover image pour zoom en place
- **Actions** : Tous visibles, shortcuts clavier

## ♿ Accessibilité

### Images et Média
- **Alt text** : Descriptions détaillées pour toutes les images
- **Zoom** : Alternative textuelle pour contenu zoomé
- **Galerie** : Navigation clavier avec arrow keys

### Interactions
- **Focus management** : Focus logique sur ajout panier
- **Live regions** : Annonce changements stock/prix
- **Keyboard shortcuts** : A (ajouter panier), F (favoris)

## 🧪 Tests & Validation

### Tests Unitaires
```typescript
describe('ProductDetail', () => {
  it('shows add to cart button for logged users with sufficient points', () => {
    const mockUser = { pointsBalance: 500 };
    const mockProduct = { pointsPrice: 200, stock: 10 };
    
    render(<ProductDetail product={mockProduct} user={mockUser} />);
    
    expect(screen.getByRole('button', { name: /ajouter au panier/i }))
      .toBeEnabled();
  });
  
  it('disables add to cart for insufficient points', () => {
    const mockUser = { pointsBalance: 100 };
    const mockProduct = { pointsPrice: 200, stock: 10 };
    
    render(<ProductDetail product={mockProduct} user={mockUser} />);
    
    expect(screen.getByRole('button', { name: /points insuffisants/i }))
      .toBeDisabled();
  });
});
```

### Tests E2E
```typescript
test('complete add to cart flow', async ({ page }) => {
  await page.goto('/produits/miel-acacia-bio');
  await page.click('[data-testid="add-to-cart-btn"]');
  await expect(page.locator('[data-testid="cart-badge"]')).toContainText('1');
  await expect(page.locator('[data-testid="toast"]')).toBeVisible();
});
```

## 📈 Métriques & Analytics

### Conversion Tracking
- **Page Views** : Vues page produit
- **Add to Cart Rate** : % ajout panier par vue
- **Purchase Rate** : % achat final
- **Bounce Rate** : % sortie sans interaction

### Engagement
- **Image Gallery Usage** : Navigation entre images
- **Tab Usage** : Préférence description vs producteur vs avis
- **Zoom Usage** : Utilisation fonction zoom
- **Share Rate** : Partages réseaux sociaux

## 📝 Notes Techniques

### Performance Optimizations
```typescript
// Lazy loading pour images gallery
const ImageWithLazyLoading = dynamic(() => import('@/components/ui/image'), {
  loading: () => <Skeleton className="aspect-square" />
});

// Prefetch related products
useEffect(() => {
  if (product?.category) {
    router.prefetch(`/produits?categories=${product.category.slug}`);
  }
}, [product?.category, router]);
```

### SEO Optimizations
```tsx
// Rich snippets pour produits
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: product.name,
  description: product.description,
  image: product.images,
  offers: {
    "@type": "Offer",
    priceCurrency: "PTS",
    price: product.pointsPrice,
    availability: product.stock > 0 ? "InStock" : "OutOfStock"
  },
  brand: {
    "@type": "Organization",
    name: product.producer.name
  }
};
```

---
*Spécification maintenue par : Product & Dev Team | Version : 1.0 | Dernière MAJ : 2025-01-XX*