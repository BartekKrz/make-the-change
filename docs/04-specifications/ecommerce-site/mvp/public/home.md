# Page d'Accueil - Site E-commerce

## 🎯 Objectif
Capter l'attention, expliquer la proposition de valeur en 30 secondes et mettre en avant les produits phares de Make the CHANGE.

## 👤 Utilisateurs Cibles
- **Visiteurs anonymes** : Découverte de la marque et du concept
- **Utilisateurs connectés** : Accès rapide aux nouvelles fonctionnalités
- **Tous personas** : Point d'entrée principal vers l'écosystème

## 🎨 Design & Layout

### Structure de Page
```
[Header Global]
├── Section Héros (Hero)
├── Section Produits Phares  
├── Section Comment ça marche
├── Section Témoignages
└── [Footer Global]
```

### Section Héros (Hero)
**Composants shadcn/ui :**
- **Typography** : H1 avec classe `text-4xl font-bold text-center`
- **Buttons** : 2 boutons côte à côte (primaire + secondaire)
- **Background** : Image ou gradient nature

**Contenu :**
```jsx
<section className="hero bg-gradient-to-r from-emerald-50 to-green-100 py-16">
  <div className="container mx-auto text-center">
    <h1 className="text-4xl font-bold text-slate-900 mb-6">
      Les récompenses de la nature, méritées par votre impact.
    </h1>
    <div className="flex gap-4 justify-center">
      <Button size="lg" className="px-8">
        Découvrir les produits
      </Button>
      <Button variant="outline" size="lg" className="px-8">
        Comment ça marche ?
      </Button>
    </div>
  </div>
</section>
```

### Section Produits Phares
**Layout :** Grille responsive 2 colonnes (mobile) → 4 colonnes (desktop)

**Composants :**
- **Card** : ProductCard réutilisable avec image, titre, prix en points
- **Button** : "Voir tous les produits" centré en bas

```jsx
<section className="py-16">
  <div className="container mx-auto">
    <h2 className="text-3xl font-bold text-center mb-12">Nos Récompenses</h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
      {featuredProducts.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
    <div className="text-center">
      <Button variant="outline" size="lg">Voir tous les produits</Button>
    </div>
  </div>
</section>
```

### Section Comment ça marche
**Layout :** 3 colonnes avec icônes et descriptions

**Étapes :**
1. **Soutenez** : Investissez dans des projets biodiversité
2. **Recevez** : Gagnez des points selon votre impact  
3. **Profitez** : Échangez contre des produits premium

```jsx
<section className="py-16 bg-slate-50">
  <div className="container mx-auto">
    <h2 className="text-3xl font-bold text-center mb-12">Comment ça marche ?</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
      {steps.map((step, index) => (
        <div key={index} className="text-center">
          <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <step.icon className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
          <p className="text-slate-600">{step.description}</p>
        </div>
      ))}
    </div>
    <div className="text-center">
      <Button size="lg">Voir les projets à soutenir</Button>
    </div>
  </div>
</section>
```

### Section Témoignages
**Composant :** Carousel avec navigation automatique et manuelle

```jsx
<section className="py-16">
  <div className="container mx-auto">
    <h2 className="text-3xl font-bold text-center mb-12">Ce qu'ils en disent</h2>
    <Carousel className="max-w-4xl mx-auto">
      {testimonials.map(testimonial => (
        <TestimonialCard key={testimonial.id} testimonial={testimonial} />
      ))}
    </Carousel>
  </div>
</section>
```

## 🔧 Composants Requis

### Composants Existants (shadcn/ui)
- `Button` (variants: default, outline)
- `Card` avec `CardContent`, `CardHeader`
- `Carousel` avec navigation
- `Typography` (H1, H2, H3, p)

### Composants Custom
- `ProductCard` : Affichage produit avec image, nom, prix points
- `TestimonialCard` : Citation, nom, photo utilisateur
- `StepCard` : Icône, titre, description pour étapes

## 📊 Données Requises

### API Calls
```typescript
// Produits phares (4-6 produits populaires)
const { data: featuredProducts } = trpc.products.getFeatured.useQuery({ 
  limit: 6 
});

// Témoignages utilisateurs
const { data: testimonials } = trpc.testimonials.getPublic.useQuery({
  limit: 5
});
```

### Types TypeScript
```typescript
interface FeaturedProduct {
  id: string;
  name: string;
  image: string;
  pointsPrice: number;
  category: string;
  isAvailable: boolean;
}

interface Testimonial {
  id: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
    role?: string;
  };
  rating: number;
}
```

## 🔄 États & Interactions

### États de Chargement
- **Loading** : Skeleton pour produits et témoignages
- **Error** : Fallback avec message utilisateur
- **Empty** : État si aucun contenu disponible

### Interactions Clés
- **CTA Héros** → Navigation vers `/produits` ou modal explicative
- **Produit cliqué** → Navigation vers `/produits/[id]`
- **"Comment ça marche"** → Scroll vers section ou modal détaillée
- **"Voir projets"** → Navigation vers `/projets`

## 📱 Responsive Design

### Breakpoints
- **Mobile (< 768px)** : Layout vertical, grilles 1-2 colonnes
- **Tablet (768px-1024px)** : Grilles 2-3 colonnes, textes adaptés
- **Desktop (> 1024px)** : Layout complet 4 colonnes, full features

### Optimisations Mobile
- **Hero** : Texte réduit, boutons stack verticalement
- **Produits** : Grille 2 colonnes maximum
- **Étapes** : Stack vertical avec icônes plus petites
- **Carousel** : Touch gestures, dots navigation

## ♿ Accessibilité

### Standards WCAG 2.1 AA
- **Images** : Alt text descriptifs pour toutes les images
- **Contraste** : Minimum 4.5:1 pour le texte
- **Navigation** : Keyboard navigation pour carousel
- **Focus** : Indicateurs focus visibles sur tous les boutons

### Screen Readers
- **Headings** : Hiérarchie H1 → H2 → H3 respectée  
- **ARIA** : Labels pour carousel et navigation
- **Skip Links** : Navigation rapide vers contenu principal

## 🧪 Tests & Validation

### Tests Unitaires
```typescript
// __tests__/pages/home.test.tsx
describe('HomePage', () => {
  it('displays hero section with CTA buttons', () => {
    render(<HomePage />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /découvrir/i })).toBeInTheDocument();
  });
  
  it('loads and displays featured products', async () => {
    render(<HomePage />);
    await waitFor(() => {
      expect(screen.getAllByTestId('product-card')).toHaveLength(6);
    });
  });
});
```

### Tests E2E (Playwright)
```typescript
test('home page conversion flow', async ({ page }) => {
  await page.goto('/');
  await page.click('[data-testid="discover-products-btn"]');
  await expect(page).toHaveURL('/produits');
});
```

## 📈 Métriques & Analytics

### Conversion Tracking
- **Hero CTA** : Taux de clic sur boutons principaux
- **Product Discovery** : Clics produits phares → détail
- **Flow Completion** : Home → Produits → Panier

### Performance
- **LCP** : <2.5s pour hero section
- **CLS** : <0.1 pour stabilité layout
- **FID** : <100ms pour interactivité

## 📝 Notes Techniques

### SEO Optimizations
```tsx
// Métadonnées Next.js (metadata API)
export const metadata = {
  title: 'Make the CHANGE - Investissement Biodiversité',
  description: 'Les récompenses de la nature, méritées par votre impact. Investissez dans la biodiversité et échangez vos points contre des produits premium.',
  keywords: 'biodiversité, investissement, écologie, miel, produits naturels'
};
```

### Optimizations Performance
- **Images** : next/image (optimisation Vercel) avec lazy loading
- **Fonts** : Preload des fonts critiques
- **Critical CSS** : Inline CSS critique pour hero
- **Prefetch** : Links vers pages principales

---
*Spécification maintenue par : Product & Dev Team | Version : 1.0 | Dernière MAJ : 2025-01-XX*
