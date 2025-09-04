# 📋 Plan d'Implémentation : Ajout des Catégories sur la Page Produits

## 🔍 **Analyse Préliminaire**

### **État Actuel de la Page**
La page `/admin/products/page.tsx` présente une architecture solide :

- ✅ **Patterns établis** : Compound components (`AdminPageLayout`), filtres composables (`Filters.Selection`, `Filters.Toggle`)
- ✅ **État géré proprement** : useState multiples (approche validée), queryParams mémorisés
- ✅ **Performance optimisée** : Optimistic updates, debouncing, mutations tRPC
- ✅ **UI cohérente** : EmptyState, DataCard/DataList, patterns visuels constants

### **Données Disponibles (Post-Supabase)**
D'après l'audit Supabase, nous avons maintenant :

- **19 catégories** : 4 principales + 16 sous-catégories (structure hiérarchique)
- **Nouveaux champs produits** : `category_id`, `secondary_category_id`, `partner_source`, `origin_country`
- **3 partenaires** : 'ilanga-nature', 'habeebee', 'internal'

### **API tRPC Existante**
Analyse des endpoints disponibles :
- ✅ `admin.products.list` : Support `category_id` (ligne 726 dans routers.ts)
- ✅ `admin.products.producers` : Récupération des producteurs
- ❌ **Manquant** : `admin.categories.list` pour récupérer les catégories
- ❌ **Manquant** : Support pour `partner_source` dans les filtres

## 🎯 **Objectifs d'Implémentation**

### **Fonctionnalités à Ajouter**

1. **Filtres avancés** :
   - Filtre par catégorie principale
   - Filtre par sous-catégorie  
   - Filtre par partenaire (`partner_source`)
   - Filtre par pays d'origine (`origin_country`)

2. **Affichage enrichi** :
   - Catégories dans les cards/list items
   - Badges partenaires
   - Pays d'origine


## 📋 **Plan d'Implémentation Étape par Étape**

### **Phase 1 : Extension de l'API (Backend)**

#### **1.1 Ajout du Router Categories** ⏱️ 20min
**Fichier** : `packages/api/src/router/admin/categories.ts`

```typescript
export const categoriesRouter = createRouter({
  list: adminProcedure
    .input(z.object({
      activeOnly: z.boolean().default(true),
      parentId: z.string().uuid().optional(), // Pour hiérarchie
    }))
    .query(async ({ input }) => {
      let query = supabase
        .from('categories')
        .select('id, name, slug, parent_id, sort_order')
        .order('sort_order', { ascending: true });
      
      if (input.activeOnly) query = query.eq('is_active', true);
      if (input.parentId) query = query.eq('parent_id', input.parentId);
      
      const { data, error } = await query;
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
      return data;
    }),

  tree: adminProcedure
    .query(async () => {
      // Structure hiérarchique complète
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug, parent_id, sort_order')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      
      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
      
      // Transformer en arbre
      return buildCategoryTree(data);
    }),
});
```

#### **1.2 Extension du Router Products** ⏱️ 10min
**Fichier** : `packages/api/src/routers.ts` (ligne ~352)

```typescript
// Dans admin.products.list, ajouter ces filtres
.input(z.object({
  // ... filtres existants
  categoryId: z.string().uuid().optional(),
  partnerSource: z.enum(['ilanga-nature', 'habeebee', 'internal']).optional(),
  originCountry: z.string().optional(),
}))

// Dans la query, ajouter
if (input?.categoryId) q = q.or(`category_id.eq.${input.categoryId},secondary_category_id.eq.${input.categoryId}`);
if (input?.partnerSource) q = q.eq('partner_source', input.partnerSource);
if (input?.originCountry) q = q.eq('origin_country', input.originCountry);
```

#### **1.3 Inclusion Router Categories** ⏱️ 5min
**Fichier** : `packages/api/src/routers.ts` (ligne ~186)

```typescript
admin: createRouter({
  // ... existants
  categories: categoriesRouter,
}),
```

### **Phase 2 : Mise à Jour Frontend Types** ⏱️ 15min

#### **2.1 Extension ProductProps**
**Fichier** : `apps/web/src/app/admin/(dashboard)/products/page.tsx`

```typescript
type ProductProps = {
  product: any; // TODO: Typer proprement
  view: 'grid' | 'list';
  queryParams: {
    cursor?: string;
    search?: string;
    activeOnly?: boolean;
    producerId?: string;
    categoryId?: string;        // ✅ NOUVEAU
    partnerSource?: string;     // ✅ NOUVEAU  
    originCountry?: string;     // ✅ NOUVEAU
    limit: number;
  };
};
```

<!-- Ici si le type n'est pas utilisée à plusieurs endroit alors je préfère le déclarer là ou il est utilisée -->
#### **2.2 Types Categories**
**Fichier** : `apps/web/src/app/admin/(dashboard)/components/admin-layout/types.ts`

```typescript
export type Category = {
  id: string;
  name: string;
  slug: string;
  parent_id?: string;
  sort_order: number;
};

export type CategoryTree = Category & {
  children: CategoryTree[];
};
```

### **Phase 3 : Extension de l'État (State Management)** ⏱️ 10min

#### **3.1 Nouveaux États**
**Fichier** : `apps/web/src/app/admin/(dashboard)/products/page.tsx`

```typescript
const ProductsPage: FC = () => {
  // ... états existants
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>();
  const [selectedPartnerSource, setSelectedPartnerSource] = useState<string | undefined>();
  const [selectedOriginCountry, setSelectedOriginCountry] = useState<string | undefined>();

  // Mise à jour queryParams
  const queryParams = useMemo(() => ({
    cursor,
    search: debouncedSearch || undefined,
    activeOnly: activeOnly || undefined,
    producerId: selectedProducerId,
    categoryId: selectedCategoryId,           // ✅ NOUVEAU
    partnerSource: selectedPartnerSource,     // ✅ NOUVEAU
    originCountry: selectedOriginCountry,     // ✅ NOUVEAU
    limit: pageSize,
  }), [cursor, debouncedSearch, activeOnly, selectedProducerId, selectedCategoryId, selectedPartnerSource, selectedOriginCountry]);
```

### **Phase 4 : Extension UI Filtres** ⏱️ 25min

#### **4.1 Ajout Queries Categories**
**Fichier** : `apps/web/src/app/admin/(dashboard)/products/page.tsx`

```typescript
const { data: categories } = trpc.admin.categories.list.useQuery({ activeOnly: true });
const { data: categoryTree } = trpc.admin.categories.tree.useQuery();

// Extraire pays d'origine dynamiquement
const { data: countries } = trpc.admin.products.originCountries.useQuery(); // À créer
```

#### **4.2 Extension FilterModal**
**Fichier** : `apps/web/src/app/admin/(dashboard)/products/page.tsx` (ligne ~320)

```typescript
<FilterModal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)}>
  <Filters>
    <Filters.View view={view} onViewChange={setView} />
    
    {/* ✅ NOUVEAU : Filtre Catégories */}
    <Filters.Selection
      items={categories || []}
      selectedId={selectedCategoryId}
      onSelectionChange={setSelectedCategoryId}
      label="Catégorie"
      allLabel="Toutes les catégories"
    />
    
    {/* ✅ NOUVEAU : Filtre Partenaires */}
    <Filters.Selection
      items={[
        { id: 'ilanga-nature', name: 'Ilanga Nature (Madagascar)' },
        { id: 'habeebee', name: 'Habeebee (Belgique)' },
        { id: 'internal', name: 'Interne' }
      ]}
      selectedId={selectedPartnerSource}
      onSelectionChange={setSelectedPartnerSource}
      label="Partenaire"
      allLabel="Tous les partenaires"
    />
    
    {/* Filtres existants */}
    <Filters.Selection
      items={producers || []}
      selectedId={selectedProducerId}
      onSelectionChange={setSelectedProducerId}
      label="Producteur"
      allLabel="Tous les producteurs"
    />
    
    <Filters.Toggle
      checked={activeOnly}
      onCheckedChange={setActiveOnly}
      label="Afficher uniquement les éléments actifs"
    />
  </Filters>
</FilterModal>
```

#### **4.3 Extension Header Desktop**
**Fichier** : `apps/web/src/app/admin/(dashboard)/products/page.tsx` (ligne ~235)

```typescript
<div className="hidden md:flex items-center gap-3 flex-wrap mt-4">
  {/* Filtres Catégories */}
  <div className="flex items-center gap-2">
    <span className="text-sm text-muted-foreground">Catégorie:</span>
    <Button
      size="sm"
      variant={selectedCategoryId === undefined ? "default" : "outline"}
      onClick={() => setSelectedCategoryId(undefined)}
    >
      Toutes
    </Button>
    {categories?.filter(c => !c.parent_id)?.map((category) => (
      <Button
        key={category.id}
        size="sm"
        variant={selectedCategoryId === category.id ? "default" : "outline"}
        onClick={() => setSelectedCategoryId(category.id)}
      >
        {category.name}
      </Button>
    ))}
  </div>

  {/* Filtres Partenaires */}
  <div className="flex items-center gap-2">
    <span className="text-sm text-muted-foreground">Partenaire:</span>
    <Button
      size="sm"
      variant={selectedPartnerSource === undefined ? "default" : "outline"}
      onClick={() => setSelectedPartnerSource(undefined)}
    >
      Tous
    </Button>
    <Button
      size="sm"
      variant={selectedPartnerSource === 'ilanga-nature' ? "default" : "outline"}
      onClick={() => setSelectedPartnerSource('ilanga-nature')}
    >
      Ilanga Nature
    </Button>
    <Button
      size="sm"
      variant={selectedPartnerSource === 'habeebee' ? "default" : "outline"}
      onClick={() => setSelectedPartnerSource('habeebee')}
    >
      Habeebee
    </Button>
  </div>

  {/* Filtres existants... */}
</div>
```

### **Phase 5 : Extension de l'Affichage Produits** ⏱️ 30min

#### **5.1 Extension DataCard Grid**
**Fichier** : `apps/web/src/app/admin/(dashboard)/products/page.tsx` (ligne ~130)

```typescript
if (view === 'grid') {
  const mainImage = getMainProductImage(product.images);
  
  return (
    <DataCard href={`/admin/products/${product.id}`}>
      <DataCard.Header>
        <DataCard.Title icon={Package} image={mainImage} imageAlt={product.name} images={product.images}>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium">{product.name}</span>
            <Badge color={product.is_active ? 'green' : 'red'}>
              {product.is_active ? 'actif' : 'inactif'}
            </Badge>
            {product.featured && <Star className="w-4 h-4 text-yellow-500" />}
            
            {/* ✅ NOUVEAU : Badge Partenaire */}
            {product.partner_source && (
              <Badge variant="outline" color="blue">
                {product.partner_source === 'ilanga-nature' ? 'Madagascar' : 
                 product.partner_source === 'habeebee' ? 'Belgique' : 'Interne'}
              </Badge>
            )}
          </div>
        </DataCard.Title>
      </DataCard.Header>
      <DataCard.Content>
        <div className="flex items-center gap-4 flex-wrap text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            <Zap className="w-3.5 h-3.5" />
            <span>{product.price_points} pts</span>
          </div>
          <div className="flex items-center gap-3">
            <Box className="w-3.5 h-3.5" />
            <span>Stock: {product.stock_quantity ?? 0}</span>
          </div>
          
          {/* ✅ NOUVEAU : Catégorie */}
          {product.category_name && (
            <div className="flex items-center gap-3">
              <Package className="w-3.5 h-3.5" />
              <span>{product.category_name}</span>
            </div>
          )}
        </div>
      </DataCard.Content>
      <DataCard.Footer>
        {/* Actions existantes */}
        
      </DataCard.Footer>
    </DataCard>
  );
}
```

#### **5.2 Mise à Jour ProductListItem**
**Fichier** : `apps/web/src/app/admin/(dashboard)/components/products/product-list-item.tsx`

```typescript
type Product = {
  // ... champs existants
  category_name?: string;           // ✅ NOUVEAU
  secondary_category_name?: string; // ✅ NOUVEAU
  partner_source?: string;          // ✅ NOUVEAU
  origin_country?: string;          // ✅ NOUVEAU
}
```

#### **5.3 Extension ProductListMetadata**
**Fichier** : `apps/web/src/app/admin/(dashboard)/components/products/product-list-metadata.tsx`

```typescript
// Ajouter les nouvelles métadonnées dans l'affichage
{product.category_name && (
  <div className="flex items-center gap-2">
    <Package className="w-3.5 h-3.5" />
    <span>{product.category_name}</span>
  </div>
)}

{product.partner_source && (
  <div className="flex items-center gap-2">
    <Globe className="w-3.5 h-3.5" />
    <span>{getPartnerDisplayName(product.partner_source)}</span>
  </div>
)}
```

### **Phase 6 : Composants Auxiliaires** ⏱️ 20min

#### **6.1 CategorySelectButton**
**Fichier** : `apps/web/src/app/admin/(dashboard)/components/products/category-select-button.tsx`

```typescript
'use client';
import { useState } from 'react';
import { Button } from '../ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '../ui/dropdown-menu';

type CategorySelectButtonProps = {
  product: any;
  categories: Category[];
  onCategoryChange: (categoryId: string | null) => void;
};

export const CategorySelectButton = ({ product, categories, onCategoryChange }: CategorySelectButtonProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline" className="text-xs px-2 h-8">
          Catégorie
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onCategoryChange(null)}>
          Aucune catégorie
        </DropdownMenuItem>
        {categories.map((category) => (
          <DropdownMenuItem 
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
          >
            {category.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
```

<!-- Pas d'accord ! il faut faire en sorte que l'api retourne le nom du partenaire -->
#### **6.2 Helpers/Utils**
**Fichier** : `apps/web/src/app/admin/(dashboard)/utils/partner-helpers.ts`

```typescript
export const getPartnerDisplayName = (partnerSource: string): string => {
  switch (partnerSource) {
    case 'ilanga-nature': return 'Ilanga Nature (Madagascar)';
    case 'habeebee': return 'Habeebee (Belgique)';
    case 'internal': return 'Interne';
    default: return partnerSource;
  }
};
<!-- Pas d'accord ! il faut faire en sorte que l'api retourne le country et que sur base de celui-ci on décide du drapeau
export const getPartnerFlag = (partnerSource: string): string => {
  switch (partnerSource) {
    case 'ilanga-nature': return '🇲🇬';
    case 'habeebee': return '🇧🇪';
    case 'internal': return '🏠';
    default: return '';
  }
};
```

### **Phase 7 : Mise à Jour Reset Filters** ⏱️ 5min

#### **7.1 Extension resetFilters**
**Fichier** : `apps/web/src/app/admin/(dashboard)/products/page.tsx`

```typescript
const resetFilters = useCallback(() => {
  setSearch(''); 
  setActiveOnly(false); 
  setSelectedProducerId(undefined); 
  setSelectedCategoryId(undefined);      // ✅ NOUVEAU
  setSelectedPartnerSource(undefined);   // ✅ NOUVEAU
  setSelectedOriginCountry(undefined);   // ✅ NOUVEAU
  setCursor(undefined); 
  refetch();
}, [refetch]);
```

## ⏱️ **Estimation Temps Total : 2h 20min**

### **Répartition** :
- **Backend (API)** : 35min
- **Frontend (State)** : 25min  
- **UI/UX (Affichage)** : 75min
- **Utils/Helpers** : 25min

## 🧪 **Plan de Test**

### **Tests Fonctionnels**
1. ✅ Filtrage par catégorie principale
2. ✅ Filtrage par partenaire
3. ✅ Combinaison de filtres
4. ✅ Reset des filtres
5. ✅ Modification inline des catégories
6. ✅ Affichage cohérent grid/list

### **Tests de Performance**
1. ✅ Mémorisation des queryParams
2. ✅ Optimistic updates
3. ✅ Debouncing des mutations

## 🎯 **Résultat Attendu**

### **Fonctionnalités Finales**
- ✅ **Filtres complets** : Catégories, partenaires, pays, producteurs
- ✅ **Affichage enrichi** : Badges, métadonnées, informations partenaires
- ✅ **Mutations avancées** : Modification catégories inline
- ✅ **UX cohérente** : Respect des patterns existants
- ✅ **Performance optimisée** : Pas de régression

### **Évolutions Futures Préparées**
- 🔄 **Filtres hiérarchiques** : Catégories principales → sous-catégories
- 🔄 **Bulk actions** : Modification en lot des catégories
- 🔄 **Analytics** : Métriques par catégorie/partenaire
- 🔄 **Auto-catégorisation** : IA pour suggestion automatique

## 🚀 **Prêt pour l'Implémentation !**

Cette architecture respecte parfaitement les patterns existants tout en ajoutant la richesse des nouvelles données Supabase. L'implémentation sera **progressive**, **testable** et **maintenable**.

**Validation** : Chaque phase peut être testée indépendamment, permettant un déploiement en douceur sans casser l'existant. 🎯
