# 📦 Gestion des Produits

**CRUD complet pour le catalogue produits avec gestion stock, prix points, et intégration partenaires.**

## 🎯 Objectif

Gérer le catalogue complet des produits e-commerce : création, édition, pricing en points, gestion stock, et coordination avec les partenaires producteurs.

## 👤 Utilisateurs Cibles

- **Gestionnaires catalogue** : CRUD produits et pricing
- **Équipe stock** : Gestion inventaire et réapprovisionnement
- **Partenaires** : HABEEBEE, ILANGA NATURE (mise à jour produits)
- **Marketing** : Descriptions, images, promotions

## 🎨 Design & Layout

### Page Catalogue Produits
```text
┌─────────────────────────────────────────────────────────────┐
│ Catalogue | 247 produits                     [+ Nouveau]    │
├─────────────────────────────────────────────────────────────┤
│ 🔍 [Recherche] [Catégorie ▼] [Partenaire ▼] [Stock ▼] [🏷️] │
├─────────────────────────────────────────────────────────────┤
│ Grid/Liste Toggle    [⊞ Grid] [☰ Liste]    [📊 Analytics]   │
├─────────────────────────────────────────────────────────────┤
│ Cards Grid Produits                                         │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │
│ │ 🍯 Miel Lavande │ │ 🧼 Savon Bio    │ │ 🫒 Huile Olive  │ │
│ │ [📷 Image]      │ │ [📷 Image]      │ │ [📷 Image]      │ │
│ │ 80 pts • Stock: │ │ 45 pts • Stock: │ │ 120 pts • ⚠️   │ │
│ │ 42 unités      │ │ 156 unités     │ │ Stock: 3       │ │
│ │ HABEEBEE       │ │ HABEEBEE       │ │ ILANGA NATURE  │ │
│ │ [Voir][Edit]   │ │ [Voir][Edit]   │ │ [Voir][Edit]   │ │
│ └─────────────────┘ └─────────────────┘ └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Modal Création/Édition Produit
```text
┌─────────────────────────────────────────────────────────────┐
│ Nouveau Produit                                        [✕]  │
├─────────────────────────────────────────────────────────────┤
│ 📋 Informations Générales                                   │
│ Nom: [Miel de Lavande Bio 250g__________________]           │
│ Catégorie: [Miels ▼]  Partenaire: [HABEEBEE ▼]             │
│ SKU: [MLV250______]  Statut: [Actif ▼]                     │
│                                                             │
│ 💰 Pricing Points                                           │
│ Prix: [80____] points  Prix Euro équivalent: €68           │
│ Marge: [35%] Coût partenaire: €44.20                       │
│                                                             │
│ 📦 Stock & Logistique                                       │
│ Stock initial: [100___] Seuil alerte: [10___]              │
│ Poids: [250g] Dimensions: [8x8x12 cm]                      │
│                                                             │
│ 📝 Description                                              │
│ Description courte:                                         │
│ [Miel de lavande artisanal récolté en Provence___]         │
│                                                             │
│ Description détaillée:                                      │
│ [Rich text editor avec formatting_____________]             │
│                                                             │
│ 🖼️ Médias                                                   │
│ [📷 Upload Images] [Galerie: 0/10 images]                  │
│ Image principale: [Pas d'image sélectionnée]               │
│                                                             │
│ 🏷️ Métadonnées                                              │
│ Tags: [bio, provence, artisanal]                           │
│ Origine: [France, Provence]                                │
│ Ingrédients: [Miel de lavande 100%]                        │
│                                                             │
│ [Annuler] [Sauvegarder brouillon] [Publier]                │
└─────────────────────────────────────────────────────────────┘
```

## 📱 Composants UI

### Header Catalogue avec Métriques
```tsx
<div className="mb-6">
  <div className="flex justify-between items-center mb-4">
    <div>
      <h1 className="text-3xl font-bold">Catalogue Produits</h1>
      <p className="text-muted-foreground">
        {totalProducts} produits • {activeProducts} actifs • {lowStockCount} stocks faibles
      </p>
    </div>
    <div className="flex gap-2">
      <Button variant="outline" onClick={bulkImport}>
        <Upload className="h-4 w-4 mr-2" />
        Import CSV
      </Button>
      <Button variant="outline" onClick={exportCatalog}>
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
      <Button onClick={createProduct}>
        <Plus className="h-4 w-4 mr-2" />
        Nouveau Produit
      </Button>
    </div>
  </div>
  
  {/* Alertes stock */}
  {lowStockCount > 0 && (
    <Alert variant="warning" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Alertes Stock</AlertTitle>
      <AlertDescription>
        {lowStockCount} produits ont un stock faible
        <Button size="sm" variant="outline" className="ml-2" onClick={viewLowStock}>
          Voir détails
        </Button>
      </AlertDescription>
    </Alert>
  )}
</div>
```

### Filtres et Vue Toggle
```tsx
<div className="flex justify-between items-center mb-6">
  <div className="flex gap-4">
    <Input
      placeholder="Rechercher produits..."
      value={searchQuery}
      onChange={setSearchQuery}
      className="max-w-md"
    />
    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
      <SelectTrigger className="w-40">
        <SelectValue placeholder="Catégorie" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Toutes</SelectItem>
        <SelectItem value="honey">🍯 Miels</SelectItem>
        <SelectItem value="cosmetics">🧴 Cosmétiques</SelectItem>
        <SelectItem value="oils">🫒 Huiles</SelectItem>
        <SelectItem value="gift_sets">🎁 Coffrets</SelectItem>
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
    <Select value={stockFilter} onValueChange={setStockFilter}>
      <SelectTrigger className="w-32">
        <SelectValue placeholder="Stock" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Tous</SelectItem>
        <SelectItem value="in_stock">En stock</SelectItem>
        <SelectItem value="low_stock">Stock faible</SelectItem>
        <SelectItem value="out_of_stock">Rupture</SelectItem>
      </SelectContent>
    </Select>
  </div>
  
  <div className="flex gap-2">
    <ToggleGroup type="single" value={viewMode} onValueChange={setViewMode}>
      <ToggleGroupItem value="grid">
        <Grid3X3 className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="list">
        <List className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
    <Button variant="outline" size="sm" onClick={openAnalytics}>
      <BarChart className="h-4 w-4 mr-2" />
      Analytics
    </Button>
  </div>
</div>
```

### Card Produit (Vue Grid)
```tsx
<Card className="group hover:shadow-lg transition-shadow">
  <CardContent className="p-4">
    <div className="aspect-square mb-3 relative overflow-hidden rounded-lg bg-gray-100">
      {product.images.length > 0 ? (
        <img
          src={product.images[0].url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Package className="h-12 w-12 text-gray-400" />
        </div>
      )}
      
      {/* Badges */}
      <div className="absolute top-2 right-2 space-y-1">
        {product.stock_quantity <= product.low_stock_threshold && (
          <Badge variant="destructive" className="text-xs">
            Stock faible
          </Badge>
        )}
        {product.is_featured && (
          <Badge variant="default" className="text-xs">
            Vedette
          </Badge>
        )}
      </div>
    </div>
    
    <div className="space-y-2">
      <div>
        <h3 className="font-medium line-clamp-2">{product.name}</h3>
        <p className="text-sm text-muted-foreground">{product.partner.name}</p>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold">{product.price_points} pts</span>
        <span className="text-sm text-muted-foreground">
          ≈ €{(product.price_points * 0.85).toFixed(2)}
        </span>
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <span className={`${
          product.stock_quantity <= product.low_stock_threshold 
            ? 'text-red-600' 
            : 'text-green-600'
        }`}>
          Stock: {product.stock_quantity}
        </span>
        <Badge variant={product.status === 'active' ? 'success' : 'secondary'}>
          {product.status}
        </Badge>
      </div>
    </div>
  </CardContent>
  
  <CardFooter className="p-4 pt-0 flex gap-2">
    <Button variant="outline" size="sm" className="flex-1" onClick={() => viewProduct(product.id)}>
      <Eye className="h-4 w-4 mr-2" />
      Voir
    </Button>
    <Button variant="outline" size="sm" className="flex-1" onClick={() => editProduct(product.id)}>
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
        <DropdownMenuItem onClick={() => duplicateProduct(product.id)}>
          <Copy className="mr-2 h-4 w-4" />
          Dupliquer
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => updateStock(product.id)}>
          <Package className="mr-2 h-4 w-4" />
          Ajuster stock
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => viewAnalytics(product.id)}>
          <BarChart className="mr-2 h-4 w-4" />
          Analytics
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => archiveProduct(product.id)}
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
<Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>
        {isEditing ? 'Modifier Produit' : 'Nouveau Produit'}
      </DialogTitle>
    </DialogHeader>
    
    <Form {...productForm}>
      <form onSubmit={productForm.handleSubmit(onSubmit)} className="space-y-6">
        {/* Informations générales */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <FormField
              control={productForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du produit</FormLabel>
                  <FormControl>
                    <Input placeholder="Miel de Lavande Bio 250g" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={productForm.control}
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
                        <SelectItem value="honey">🍯 Miels</SelectItem>
                        <SelectItem value="cosmetics">🧴 Cosmétiques</SelectItem>
                        <SelectItem value="oils">🫒 Huiles</SelectItem>
                        <SelectItem value="gift_sets">🎁 Coffrets</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={productForm.control}
                name="partner_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Partenaire</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
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
          
          <div className="space-y-4">
            <FormField
              control={productForm.control}
              name="price_points"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prix (points)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="80" {...field} />
                  </FormControl>
                  <FormDescription>
                    Équivalent: €{(field.value * 0.85 || 0).toFixed(2)}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={productForm.control}
                name="stock_quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock initial</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={productForm.control}
                name="low_stock_threshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seuil alerte</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-4">
          <FormField
            control={productForm.control}
            name="short_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description courte</FormLabel>
                <FormControl>
                  <Input placeholder="Description pour listing produit" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={productForm.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description détaillée</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Description complète du produit..."
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Images */}
        <div>
          <FormLabel>Images produit</FormLabel>
          <div className="mt-2">
            <ImageUpload
              value={productImages}
              onChange={setProductImages}
              maxImages={10}
              accept="image/*"
            />
          </div>
        </div>

        {/* Actions */}
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setShowProductDialog(false)}>
            Annuler
          </Button>
          <Button type="button" variant="outline" onClick={saveDraft}>
            Sauvegarder brouillon
          </Button>
          <Button type="submit">
            {isEditing ? 'Mettre à jour' : 'Créer produit'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  </DialogContent>
</Dialog>
```

## 🔄 États & Interactions

### États Produit
```typescript
type ProductStatus = 
  | 'draft'      // Brouillon en cours
  | 'active'     // Disponible à la vente
  | 'inactive'   // Temporairement indisponible
  | 'archived';  // Archivé définitivement

type StockStatus = 
  | 'in_stock'     // Stock normal
  | 'low_stock'    // Stock faible (≤ seuil)
  | 'out_of_stock' // Rupture (= 0)
  | 'discontinued'; // Produit arrêté
```

### Calculs Automatiques
```typescript
// Prix euro équivalent (pour information)
const calculateEuroEquivalent = (points: number) => {
  return points * 0.85; // 1 point = €0.85 en valeur produit
};

// Marge calcul
const calculateMargin = (pricePoints: number, costPrice: number) => {
  const euroPrice = calculateEuroEquivalent(pricePoints);
  return ((euroPrice - costPrice) / euroPrice) * 100;
};

// Stock status automatique
const getStockStatus = (quantity: number, threshold: number): StockStatus => {
  if (quantity === 0) return 'out_of_stock';
  if (quantity <= threshold) return 'low_stock';
  return 'in_stock';
};
```

## 📡 API & Données

### Routes tRPC
```typescript
// CRUD Produits
admin.products.list: {
  input: {
    page: number;
    limit: number;
    search?: string;
    category?: string;
    partner_id?: string;
    status?: ProductStatus;
    stock_status?: StockStatus;
  };
  output: {
    products: Product[];
    total: number;
    categories: Category[];
    stock_alerts: StockAlert[];
  };
}

admin.products.create: {
  input: CreateProductInput;
  output: { product: Product; success: boolean };
}

admin.products.update: {
  input: { id: string; data: UpdateProductInput };
  output: { product: Product; success: boolean };
}

// Gestion stock
admin.products.update_stock: {
  input: { 
    id: string; 
    quantity: number; 
    reason: string;
    type: 'restock' | 'adjustment' | 'sold';
  };
  output: { success: boolean; new_quantity: number };
}

admin.products.stock_alerts: {
  output: {
    alerts: Array<{
      product: Product;
      current_stock: number;
      threshold: number;
      days_until_stockout: number;
    }>;
  };
}

// Analytics
admin.products.analytics: {
  input: { product_id?: string; date_range?: [Date, Date] };
  output: {
    sales_data: Array<{ date: Date; quantity: number; points: number }>;
    top_products: Array<{ product: Product; sales_count: number }>;
    conversion_rates: Array<{ product: Product; view_to_purchase: number }>;
  };
}
```

### Modèles de Données
```typescript
interface Product {
  id: string;
  name: string;
  short_description: string;
  description: string;
  sku: string;
  category: ProductCategory;
  partner: Partner;
  price_points: number;
  status: ProductStatus;
  stock_quantity: number;
  low_stock_threshold: number;
  stock_status: StockStatus;
  images: ProductImage[];
  tags: string[];
  weight?: number;
  dimensions?: string;
  ingredients?: string;
  origin?: string;
  is_featured: boolean;
  created_at: Date;
  updated_at: Date;
}

interface ProductImage {
  id: string;
  url: string;
  alt_text: string;
  is_primary: boolean;
  sort_order: number;
}

interface StockMovement {
  id: string;
  product_id: string;
  type: 'restock' | 'sale' | 'adjustment' | 'return';
  quantity_change: number;
  quantity_before: number;
  quantity_after: number;
  reason: string;
  admin_id?: string;
  created_at: Date;
}
```

## ✅ Validations

### Contraintes Business
- **Prix minimum** : 10 points par produit
- **Prix maximum** : 1000 points par produit
- **Stock initial** : 1-10,000 unités
- **Images** : 1-10 images, 5MB max chacune
- **SKU unique** : Par partenaire

### Permissions
- **Catalog Manager** : CRUD produits + stock
- **Partner** : Update ses produits + stock
- **Admin** : Toutes actions + pricing
- **Support** : Lecture seule + ajustements stock

### Validation Pricing
```typescript
const validateProductPricing = (product: Product) => {
  const euroEquivalent = product.price_points * 0.85;
  const partnerCost = product.partner.cost_price || 0;
  const margin = ((euroEquivalent - partnerCost) / euroEquivalent) * 100;
  
  if (margin < 20) {
    throw new Error('Marge insuffisante (minimum 20%)');
  }
  
  if (product.price_points < 10 || product.price_points > 1000) {
    throw new Error('Prix hors limites autorisées');
  }
};
```

## 🚨 Gestion d'Erreurs

### Scenarios Problématiques
```typescript
const productErrors = {
  STOCK_NEGATIVE: "Le stock ne peut pas être négatif",
  DUPLICATE_SKU: "SKU déjà utilisé par ce partenaire",
  INVALID_PRICING: "Prix points invalide",
  IMAGE_UPLOAD_FAILED: "Échec upload image",
  PARTNER_MISMATCH: "Produit non associé à ce partenaire"
};
```

### Auto-corrections
- **Stock négatif** : Bloqué à 0 avec alerte
- **Images manquantes** : Placeholder automatique
- **Prix incohérent** : Suggestion automatique

## 📝 Tests Utilisateur

### Scénarios Critiques
1. **Création produit** : Workflow complet <3min
2. **Upload images** : Batch upload fluide
3. **Ajustement stock** : Mass update rapide
4. **Recherche/filtrage** : Résultats instantanés
5. **Analytics** : Génération rapports <5s

### Performance
- **Liste produits** : <1s pour 500 produits
- **Image upload** : <10s par image
- **Stock update** : <2s response
- **Search** : <300ms results

---

**Stack Technique** : React Hook Form + Vercel Blob Store + TanStack Query  
**Priorité** : 🔥 Critique - Cœur catalogue e-commerce  
**Estimation** : 8-12 jours développement + intégration images
