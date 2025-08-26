# Catalogue Produits - Site E-commerce

## 🎯 Objectif
Permettre une exploration facile et efficace de toute la gamme de produits Make the CHANGE avec filtrage, tri et recherche avancée.

## 👤 Utilisateurs Cibles
- **Visiteurs anonymes** : Peuvent voir les produits, prix en points
- **Utilisateurs connectés** : Peuvent ajouter au panier et voir solde points
- **Tous personas** : Navigation et découverte produits

## 🎨 Design & Layout

### Structure de Page
```
[Header Global]
├── Page Header (Titre + Stats)
├── Layout 2 Colonnes:
│   ├── Sidebar Filtres (25%)
│   └── Zone Produits (75%)
│       ├── Barre Actions (Tri + Vue)
│       ├── Grille Produits
│       └── Pagination
└── [Footer Global]
```

### Page Header
```jsx
<div className="bg-slate-50 py-8">
  <div className="container mx-auto">
    <h1 className="text-3xl font-bold text-slate-900 mb-2">
      Toutes nos récompenses
    </h1>
    <p className="text-slate-600">
      {totalProducts} produits disponibles • Livraison gratuite
    </p>
  </div>
</div>
```

### Sidebar Filtres
**Composants shadcn/ui :**
- **Accordion** : Sections collapsibles pour filtres
- **Checkbox** : Sélection multiple catégories
- **Slider** : Range de prix en points
- **Button** : Reset filtres

```jsx
<aside className="w-64 p-6 bg-white border-r">
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-lg font-semibold">Filtres</h2>
    <Button variant="ghost" size="sm" onClick={resetFilters}>
      Réinitialiser
    </Button>
  </div>
  
  <Accordion type="multiple" defaultValue={["categories", "price"]}>
    <AccordionItem value="categories">
      <AccordionTrigger>Catégories</AccordionTrigger>
      <AccordionContent>
        <div className="space-y-2">
          {categories.map(category => (
            <label key={category.id} className="flex items-center space-x-2">
              <Checkbox 
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => toggleCategory(category.id)}
              />
              <span>{category.name} ({category.count})</span>
            </label>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
    
    <AccordionItem value="price">
      <AccordionTrigger>Prix en points</AccordionTrigger>
      <AccordionContent>
        <div className="px-2">
          <Slider
            value={[priceRange.min, priceRange.max]}
            onValueChange={setPriceRange}
            max={1000}
            step={10}
            className="mb-4"
          />
          <div className="flex justify-between text-sm text-slate-600">
            <span>{priceRange.min} pts</span>
            <span>{priceRange.max} pts</span>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
    
    <AccordionItem value="availability">
      <AccordionTrigger>Disponibilité</AccordionTrigger>
      <AccordionContent>
        <label className="flex items-center space-x-2">
          <Checkbox 
            checked={onlyAvailable}
            onCheckedChange={setOnlyAvailable}
          />
          <span>En stock uniquement</span>
        </label>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</aside>
```

### Barre d'Actions
```jsx
<div className="flex items-center justify-between mb-6">
  <div className="flex items-center space-x-4">
    <span className="text-sm text-slate-600">
      {filteredProducts.length} produits
    </span>
    {hasActiveFilters && (
      <Badge variant="secondary">Filtres actifs</Badge>
    )}
  </div>
  
  <div className="flex items-center space-x-4">
    <Select value={sortBy} onValueChange={setSortBy}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Trier par..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="name-asc">Nom A-Z</SelectItem>
        <SelectItem value="name-desc">Nom Z-A</SelectItem>
        <SelectItem value="price-asc">Prix croissant</SelectItem>
        <SelectItem value="price-desc">Prix décroissant</SelectItem>
        <SelectItem value="popularity">Plus populaires</SelectItem>
      </SelectContent>
    </Select>
    
    <div className="flex border rounded-md">
      <Button
        variant={viewMode === 'grid' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setViewMode('grid')}
      >
        <Grid3x3 className="w-4 h-4" />
      </Button>
      <Button
        variant={viewMode === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setViewMode('list')}
      >
        <List className="w-4 h-4" />
      </Button>
    </div>
  </div>
</div>
```

### Grille Produits
**Layouts :**
- **Grid Mode** : 3-4 colonnes selon écran
- **List Mode** : 1 colonne avec layout horizontal

```jsx
<div className={cn(
  "mb-8",
  viewMode === 'grid' 
    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    : "space-y-4"
)}>
  {products.map(product => (
    viewMode === 'grid' ? (
      <ProductCardGrid key={product.id} product={product} />
    ) : (
      <ProductCardList key={product.id} product={product} />
    )
  ))}
</div>

{products.length === 0 && (
  <div className="text-center py-12">
    <Package className="w-12 h-12 mx-auto text-slate-400 mb-4" />
    <h3 className="text-lg font-medium text-slate-900 mb-2">
      Aucun produit trouvé
    </h3>
    <p className="text-slate-600 mb-4">
      Essayez de modifier vos filtres ou votre recherche
    </p>
    <Button onClick={resetFilters}>Réinitialiser les filtres</Button>
  </div>
)}
```

## 🔧 Composants Requis

### Composants shadcn/ui
- `Accordion` avec `AccordionItem`, `AccordionTrigger`, `AccordionContent`
- `Checkbox` pour filtres multiples
- `Slider` pour range de prix
- `Select` avec `SelectTrigger`, `SelectContent`, `SelectItem`
- `Button` (variants: default, ghost, outline)
- `Badge` pour indicateurs état
- `Pagination` pour navigation pages

### Composants Custom
- `ProductCardGrid` : Vue carte avec image, nom, prix, badge stock
- `ProductCardList` : Vue liste avec image, infos, actions horizontales
- `FilterSection` : Section de filtre réutilisable
- `EmptyState` : État vide avec illustration et actions

## 📊 Données Requises

### API Calls
```typescript
const { data: products, isLoading } = trpc.products.getFiltered.useQuery({
  categories: selectedCategories,
  priceRange: { min: priceRange[0], max: priceRange[1] },
  onlyAvailable,
  sortBy,
  page: currentPage,
  limit: 12
});

const { data: categories } = trpc.products.getCategories.useQuery();
```

### Types TypeScript
```typescript
interface ProductFilters {
  categories: string[];
  priceRange: { min: number; max: number };
  onlyAvailable: boolean;
  sortBy: 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'popularity';
  page: number;
  limit: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
  pointsPrice: number;
  category: {
    id: string;
    name: string;
  };
  producer: {
    name: string;
    location: string;
  };
  isAvailable: boolean;
  stock: number;
  popularity: number;
}

interface ProductCategory {
  id: string;
  name: string;
  count: number;
  slug: string;
}
```

## 🔄 États & Interactions

### Gestion d'État (Zustand)
```typescript
interface CatalogState {
  filters: ProductFilters;
  viewMode: 'grid' | 'list';
  updateFilter: (key: keyof ProductFilters, value: any) => void;
  resetFilters: () => void;
  setViewMode: (mode: 'grid' | 'list') => void;
}
```

### Interactions Utilisateur
- **Filtre changé** → Update URL params + refetch produits
- **Tri changé** → Réorganisation immédiate + URL update
- **Vue changée** → Toggle layout + sauvegarde préférence
- **Produit cliqué** → Navigation vers `/produits/[id]`
- **Ajout panier** → Animation + update badge header

### URL State Management
```typescript
// URL: /produits?categories=miel,cosmetiques&price_min=50&price_max=300&sort=price-asc&view=grid

const updateURL = (filters: ProductFilters) => {
  const params = new URLSearchParams();
  if (filters.categories.length) params.set('categories', filters.categories.join(','));
  if (filters.priceRange.min > 0) params.set('price_min', filters.priceRange.min.toString());
  if (filters.priceRange.max < 1000) params.set('price_max', filters.priceRange.max.toString());
  if (filters.onlyAvailable) params.set('available', 'true');
  if (filters.sortBy !== 'popularity') params.set('sort', filters.sortBy);
  
  router.replace(`/produits?${params.toString()}`);
};
```

## 📱 Responsive Design

### Mobile (< 768px)
- **Filtres** : Drawer/Sheet overlay au lieu de sidebar
- **Grille** : 1-2 colonnes maximum
- **Actions** : Sticky header avec filtres icon
- **Vue** : Grid par défaut, pas de vue liste

### Tablet (768px-1024px)
- **Filtres** : Sidebar collapsible
- **Grille** : 2-3 colonnes
- **Actions** : Toutes visibles

### Desktop (> 1024px)
- **Layout complet** : Sidebar + grille 4 colonnes
- **Hover effects** : Preview image, actions rapides

## ♿ Accessibilité

### Navigation Clavier
- **Tab order** : Filtres → Actions → Produits → Pagination
- **Filtres** : Arrow keys dans accordions, space pour checkboxes
- **Grille** : Grid navigation avec arrow keys
- **Skip links** : Vers contenu principal, vers filtres

### Screen Readers
- **Live regions** : Annonce changements nombre produits
- **Labels** : Aria-labels pour tous contrôles
- **States** : Aria-expanded pour accordions

## 🧪 Tests & Validation

### Tests Unitaires
```typescript
describe('ProductCatalog', () => {
  it('filters products by category', async () => {
    render(<ProductCatalog />);
    await user.click(screen.getByLabelText('Miel'));
    await waitFor(() => {
      expect(screen.getAllByTestId('product-card')).toHaveLength(8);
    });
  });
  
  it('sorts products by price', async () => {
    render(<ProductCatalog />);
    await user.selectOptions(screen.getByLabelText('Trier par'), 'price-asc');
    const prices = screen.getAllByTestId('product-price').map(el => 
      parseInt(el.textContent?.match(/\d+/)?.[0] || '0')
    );
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });
});
```

### Tests Performance
- **Infinite scroll** : Chargement progressif si > 100 produits
- **Virtual scrolling** : Pour listes très longues (> 500 items)
- **Image lazy loading** : Toutes les images produits

## 📈 Métriques & Analytics

### Conversion Funnel
1. **Page Load** : Visiteurs sur catalogue
2. **Filter Usage** : % utilisant filtres
3. **Product View** : Clics vers détail produit
4. **Add to Cart** : Ajouts panier depuis catalogue

### User Behavior
- **Filter popularity** : Filtres les plus utilisés
- **Sort preferences** : Tri préféré par persona
- **View mode** : Grid vs List adoption
- **Search patterns** : Termes recherchés (si search ajoutée)

## 📝 Notes Techniques

### Performance Optimizations
```typescript
// Debounced filter updates
const debouncedUpdateFilters = useMemo(
  () => debounce(updateFilters, 300),
  [updateFilters]
);

// Virtual scrolling pour grandes listes
const { virtualItems, totalSize } = useVirtualizer({
  count: products.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => viewMode === 'grid' ? 320 : 120,
});
```

### Caching Strategy
- **Products** : Cache 5min avec revalidation
- **Categories** : Cache 1h, rarement changent
- **Filters state** : Persist dans localStorage
- **View preferences** : Save par utilisateur

---
*Spécification maintenue par : Product & Dev Team | Version : 1.0 | Dernière MAJ : 2025-01-XX*