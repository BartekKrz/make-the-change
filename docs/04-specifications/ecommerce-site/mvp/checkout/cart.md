# Panier - Site E-commerce

## 🎯 Objectif
Permettre à l'utilisateur de revoir sa sélection de produits, ajuster les quantités et procéder au tunnel de commande avec ses points.

## 👤 Utilisateurs Cibles
- **Utilisateurs connectés uniquement** : Page protégée par authentification
- **Tous personas** : Interface claire pour révision commande
- **Focus Marc & Amélie** : Validation détaillée avant achat

## 🎨 Design & Layout

### Structure de Page
```
[Header Global]
├── Page Header
├── Layout 2 Colonnes (Desktop) / Vertical (Mobile):
│   ├── Zone Panier (70%)
│   │   ├── Liste Articles
│   │   └── Actions Bulk
│   └── Récapitulatif (30%)
│       ├── Résumé Commande
│       ├── Solde Points
│       └── Actions Checkout
└── [Footer Global]
```

### Page Header
```jsx
<div className="bg-slate-50 py-8">
  <div className="container mx-auto">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Mon Panier</h1>
        <p className="text-slate-600 mt-1">
          {cartItems.length} article{cartItems.length > 1 ? 's' : ''} sélectionné{cartItems.length > 1 ? 's' : ''}
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <Badge variant="secondary" className="px-3 py-1">
          <Wallet className="w-4 h-4 mr-2" />
          {user.pointsBalance} points disponibles
        </Badge>
      </div>
    </div>
  </div>
</div>
```

### Zone Panier - État Vide
```jsx
{cartItems.length === 0 ? (
  <div className="text-center py-16">
    <ShoppingBag className="w-16 h-16 mx-auto text-slate-300 mb-6" />
    <h2 className="text-2xl font-semibold text-slate-900 mb-4">
      Votre panier est vide
    </h2>
    <p className="text-slate-600 mb-8 max-w-md mx-auto">
      Découvrez nos produits naturels et artisanaux sélectionnés par nos partenaires producteurs.
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Button size="lg" asChild>
        <Link href="/produits">Découvrir les produits</Link>
      </Button>
      <Button variant="outline" size="lg" asChild>
        <Link href="/projets">Soutenir un projet</Link>
      </Button>
    </div>
  </div>
) : (
  // ... Contenu panier
)}
```

### Liste Articles - Carte Produit
```jsx
<div className="space-y-4">
  {cartItems.map(item => (
    <Card key={item.id} className="p-6">
      <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
        {/* Image Produit */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 bg-slate-100 rounded-lg overflow-hidden">
            <Image
              src={item.product.images[0]}
              alt={item.product.name}
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Informations Produit */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-slate-900 truncate">
                <Link 
                  href={`/produits/${item.product.id}`}
                  className="hover:text-emerald-600 transition-colors"
                >
                  {item.product.name}
                </Link>
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Par {item.product.producer.name}
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="secondary" className="text-xs">
                  {item.product.category.name}
                </Badge>
                {item.product.stock < 10 && (
                  <Badge variant="destructive" className="text-xs">
                    Stock limité: {item.product.stock}
                  </Badge>
                )}
              </div>
            </div>

            {/* Actions Item */}
            <div className="flex items-center space-x-2 ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleWishlist(item.product.id)}
                className="p-2"
              >
                <Heart className={cn(
                  "w-4 h-4",
                  isInWishlist(item.product.id) && "fill-current text-red-500"
                )} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFromCart(item.id)}
                className="p-2 text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Prix et Quantité */}
        <div className="flex items-center justify-between md:justify-end space-x-4 md:space-x-8">
          {/* Contrôles Quantité */}
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              className="w-8 h-8 p-0"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <Minus className="w-3 h-3" />
            </Button>
            
            <Input
              type="number"
              value={item.quantity}
              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
              className="w-16 text-center"
              min="1"
              max={item.product.stock}
            />
            
            <Button
              variant="outline"
              size="sm"
              className="w-8 h-8 p-0"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              disabled={item.quantity >= item.product.stock}
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>

          {/* Prix */}
          <div className="text-right">
            <div className="font-semibold text-slate-900">
              {item.product.pointsPrice * item.quantity} points
            </div>
            <div className="text-sm text-slate-500">
              {item.product.pointsPrice} pts × {item.quantity}
            </div>
          </div>
        </div>
      </div>
    </Card>
  ))}
</div>
```

### Actions Bulk
```jsx
<div className="flex items-center justify-between py-4 border-t">
  <div className="flex items-center space-x-4">
    <Checkbox
      checked={allSelected}
      onCheckedChange={toggleSelectAll}
      className="border-2"
    />
    <span className="text-sm text-slate-600">
      Sélectionner tout ({cartItems.length})
    </span>
  </div>
  
  <div className="flex items-center space-x-4">
    <Button
      variant="ghost"
      size="sm"
      onClick={moveSelectedToWishlist}
      disabled={selectedItems.length === 0}
    >
      <Heart className="w-4 h-4 mr-2" />
      Mettre en favoris
    </Button>
    <Button
      variant="ghost"
      size="sm"
      onClick={removeSelectedItems}
      disabled={selectedItems.length === 0}
      className="text-red-600 hover:text-red-700"
    >
      <Trash2 className="w-4 h-4 mr-2" />
      Supprimer la sélection
    </Button>
  </div>
</div>
```

### Récapitulatif Commande
```jsx
<Card className="p-6 sticky top-6">
  <h2 className="text-lg font-semibold mb-6">Récapitulatif</h2>
  
  {/* Détail Prix */}
  <div className="space-y-3 mb-6">
    <div className="flex justify-between text-sm">
      <span>Sous-total ({totalItems} articles)</span>
      <span>{subtotalPoints} points</span>
    </div>
    
    <div className="flex justify-between text-sm text-emerald-600">
      <span>Livraison</span>
      <span>Offerte</span>
    </div>
    
    {/* La réduction fidélité est une feature V1, retirée du MVP pour alignement roadmap
    {loyaltyDiscount > 0 && (
      <div className="flex justify-between text-sm text-emerald-600">
        <span className="flex items-center">
          <Crown className="w-4 h-4 mr-1" />
          Réduction fidélité
        </span>
        <span>-{loyaltyDiscount} points</span>
      </div>
    )}
    */}
    
    <Separator className="my-4" />
    
    <div className="flex justify-between font-semibold text-lg">
      <span>Total</span>
      <span className="text-emerald-600">{totalPoints} points</span>
    </div>
  </div>

  {/* Solde Points */}
  <div className="mb-6 p-4 bg-slate-50 rounded-lg">
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm font-medium">Solde disponible</span>
      <span className="font-semibold">{user.pointsBalance} points</span>
    </div>
    
    <div className="w-full bg-slate-200 rounded-full h-2">
      <div 
        className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
        style={{ 
          width: `${Math.min((totalPoints / user.pointsBalance) * 100, 100)}%` 
        }}
      />
    </div>
    
    <div className="flex justify-between text-xs text-slate-600 mt-1">
      <span>Utilisé: {totalPoints}</span>
      <span>Restant: {Math.max(user.pointsBalance - totalPoints, 0)}</span>
    </div>
  </div>

  {/* Messages d'État */}
  {totalPoints > user.pointsBalance ? (
    <Alert className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Points insuffisants</AlertTitle>
      <AlertDescription>
        Il vous manque {totalPoints - user.pointsBalance} points.
        <Button variant="link" className="p-0 h-auto ml-1">
          Découvrir les projets à soutenir
        </Button>
      </AlertDescription>
    </Alert>
  ) : hasStockIssues ? (
    <Alert variant="destructive" className="mb-6">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Problème de stock</AlertTitle>
      <AlertDescription>
        Certains articles ont un stock limité. Vérifiez les quantités.
      </AlertDescription>
    </Alert>
  ) : (
    <Alert className="mb-6 border-emerald-200 bg-emerald-50">
      <Check className="h-4 w-4 text-emerald-600" />
      <AlertTitle className="text-emerald-800">Prêt à commander</AlertTitle>
      <AlertDescription className="text-emerald-700">
        Tous les articles sont disponibles.
      </AlertDescription>
    </Alert>
  )}

  {/* Boutons Action */}
  <div className="space-y-3">
    <Button
      size="lg"
      className="w-full"
      disabled={cartItems.length === 0 || totalPoints > user.pointsBalance || hasStockIssues}
      onClick={proceedToCheckout}
    >
      {totalPoints > user.pointsBalance 
        ? "Points insuffisants"
        : hasStockIssues 
        ? "Vérifier le stock"
        : "Valider et passer à la livraison"
      }
    </Button>
    
    <Button variant="outline" size="lg" className="w-full" asChild>
      <Link href="/produits">Continuer mes achats</Link>
    </Button>
  </div>

  {/* Sécurité & Garanties */}
  <div className="mt-6 pt-6 border-t">
    <div className="flex items-center justify-center space-x-6 text-xs text-slate-500">
      <div className="flex items-center space-x-1">
        <Shield className="w-3 h-3" />
        <span>Sécurisé</span>
      </div>
      <div className="flex items-center space-x-1">
        <Truck className="w-3 h-3" />
        <span>Livraison gratuite</span>
      </div>
      <div className="flex items-center space-x-1">
        <RotateCcw className="w-3 h-3" />
        <span>Satisfait ou remboursé</span>
      </div>
    </div>
  </div>
</Card>
```

## 🔧 Composants Requis

### Composants shadcn/ui
- `Card` avec `CardContent`, `CardHeader`
- `Button` (variants: default, outline, ghost, link)
- `Input` pour quantités
- `Checkbox` pour sélection multiple
- `Badge` (variants: default, secondary, destructive)
- `Alert` avec `AlertTitle`, `AlertDescription`
- `Separator` pour dividers
- `Dialog` pour confirmations

### Composants Custom
- `CartItem` : Ligne produit avec contrôles quantité
- `PriceBreakdown` : Détail calcul prix avec réductions
- `PointsIndicator` : Barre progression solde points
- `StockWarning` : Alertes stock limité
- `EmptyCart` : État vide avec actions

## 📊 Données Requises

### API Calls
```typescript
const { data: cartItems, refetch } = trpc.cart.getItems.useQuery();

const { data: user } = trpc.auth.getCurrentUser.useQuery();

const updateQuantityMutation = trpc.cart.updateQuantity.useMutation({
  onSuccess: () => refetch()
});

const removeItemMutation = trpc.cart.removeItem.useMutation({
  onSuccess: () => refetch()
});
```

### Types TypeScript
```typescript
interface CartItem {
  id: string;
  quantity: number;
  addedAt: Date;
  product: {
    id: string;
    name: string;
    images: string[];
    pointsPrice: number;
    stock: number;
    category: {
      name: string;
    };
    producer: {
      name: string;
    };
  };
}

interface CartSummary {
  subtotalPoints: number;
  loyaltyDiscount: number;
  totalPoints: number;
  totalItems: number;
  canCheckout: boolean;
  issues: CartIssue[];
}
```

## 🔄 États & Interactions

### Actions Cart
```typescript
const cartActions = {
  updateQuantity: (itemId: string, quantity: number) => {
    if (quantity < 1) return removeItem(itemId);
    updateQuantityMutation.mutate({ itemId, quantity });
  },
  
  removeItem: (itemId: string) => {
    removeItemMutation.mutate({ itemId });
    toast.success("Produit retiré du panier");
  },
  
  clearCart: () => {
    if (confirm("Vider complètement le panier ?")) {
      clearCartMutation.mutate();
    }
  }
};
```

### Validation Temps Réel
```typescript
useEffect(() => {
  // Vérification stock en temps réel
  const checkStock = async () => {
    const stockIssues = await Promise.all(
      cartItems.map(async (item) => {
        const current = await trpc.products.getStock.fetch({ id: item.product.id });
        return {
          itemId: item.id,
          requested: item.quantity,
          available: current.stock,
          hasIssue: item.quantity > current.stock
        };
      })
    );
    
    setStockValidation(stockIssues);
  };
  
  if (cartItems.length > 0) {
    checkStock();
  }
}, [cartItems]);
```

## 📱 Responsive Design

### Mobile (< 768px)
- **Layout vertical** : Panier puis récapitulatif
- **Carte produit** : Image au-dessus, infos empilées
- **Quantité** : Contrôles plus grands (touch-friendly)
- **Actions** : Boutons full-width

### Tablet (768px-1024px)
- **Layout semi-adapté** : 65/35 au lieu de 70/30
- **Cartes** : Layout horizontal maintenu
- **Sticky sidebar** : Récapitulatif reste visible

### Desktop (> 1024px)
- **Layout complet** : 2 colonnes optimales
- **Hover effects** : Sur actions et liens
- **Keyboard shortcuts** : Del (supprimer), +/- (quantité)

## ♿ Accessibilité

### Navigation
- **Tab order** : Logique haut en bas, gauche à droite
- **Skip links** : Vers récapitulatif, vers actions
- **Focus trapping** : Dans modals de confirmation

### Screen Readers
- **Live regions** : Annonce changements quantité/prix
- **Labels** : Aria-labels pour contrôles quantité
- **States** : Aria-disabled pour boutons inactifs

## 🧪 Tests & Validation

### Tests Unitaires
```typescript
describe('Cart', () => {
  it('updates total when quantity changes', async () => {
    const { user } = render(<Cart />);
    
    const quantityInput = screen.getByDisplayValue('2');
    await user.clear(quantityInput);
    await user.type(quantityInput, '3');
    
    expect(screen.getByText(/450 points/)).toBeInTheDocument();
  });
  
  it('shows warning for insufficient points', () => {
    const mockUser = { pointsBalance: 100 };
    render(<Cart user={mockUser} />);
    
    expect(screen.getByText(/points insuffisants/i)).toBeInTheDocument();
  });
});
```

### Tests E2E
```typescript
test('complete cart to checkout flow', async ({ page }) => {
  await page.goto('/panier');
  await page.fill('[data-testid="quantity-input"]', '1');
  await page.click('[data-testid="checkout-btn"]');
  await expect(page).toHaveURL('/checkout');
});
```

## 📈 Métriques & Analytics

### Abandonment Tracking
- **Cart Abandonment Rate** : % paniers non complétés
- **Exit Points** : Où les utilisateurs quittent
- **Time in Cart** : Durée avant décision
- **Quantity Changes** : Modifications avant checkout

### Optimization Metrics
- **Points Sufficiency** : % users avec points suffisants
- **Stock Issues** : Fréquence problèmes stock
- **Bulk Actions Usage** : Utilisation sélection multiple

---
*Spécification maintenue par : Product & Dev Team | Version : 1.0 | Dernière MAJ : 2025-01-XX*