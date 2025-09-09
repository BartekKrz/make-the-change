# Plan d'implémentation - Refactorisation architecture composable pour les pages de détail

## 🎯 Objectif

Refactoriser l'architecture des pages de détail (products/[id]) pour adopter le même pattern de composition élégant que les pages de liste, en créant des composants réutilisables et une séparation claire des responsabilités.

## 🏗️ Architecture cible

- **Composants génériques réutilisables** : `DetailView`, `DetailSection`, `DetailField`
- **Séparation claire** : Container → Layout → Sections → Fields  
- **Pattern Compound Component** : Composition flexible comme `DataList`/`DataCard`
- **Logique métier externalisée** : Hooks personnalisés pour l'état et les mutations
- **Cohérence** : Même philosophie que `AdminPageLayout` + `DataList` + `DataCard`

## 📋 Plan d'implémentation détaillé

### Phase 1 : Composants de base de composition 🧱

#### 1.1 Création du composant racine `DetailView`
- [x] **Créer** `apps/web/src/app/[locale]/admin/(dashboard)/components/ui/detail-view.tsx`
- [x] **Implémenter** variantes de layout : `cards` (grid), `sections` (stacked), `sidebar` (2-col)
- [x] **Support** responsive automatique : mobile stacked, desktop grid
- [x] **Gérer** espacement cohérent avec design system (`--density-spacing-*`)
- [x] **Props** : `variant`, `className`, `spacing`, `gridCols`, `children`
- [x] **Pattern Compound** : `DetailView.Section`, `DetailView.Field`, `DetailView.FieldGroup`

#### 1.2 Création du composant `DetailSection`  
- [x] **Composant** section avec header (icon + titre) et contenu
- [x] **Support** `span` pour colonnes multiples (comme CSS Grid `grid-column: span 2`)
- [x] **États visuels** : default, loading, error, disabled
- [x] **Animations** : smooth expand/collapse, hover effects
- [x] **Accessibilité** : proper heading hierarchy, ARIA labels
- [x] **Props** : `title`, `icon`, `span?`, `collapsible?`, `defaultOpen?`, `loading?`

#### 1.3 Création du composant `DetailField`
- [x] **Wrapper** générique pour tous types de champs de formulaire
- [x] **Support** labels, descriptions, erreurs, états required
- [x] **Intégration** avec validation (Zod + TanStack Form si utilisé)
- [x] **Variantes** : `input`, `textarea`, `select`, `toggle`, `custom`
- [x] **États** : `loading`, `error`, `disabled`, `pending`
- [x] **Props** : `label`, `description?`, `error?`, `required?`, `loading?`, `children`

#### 1.4 Création du composant `DetailFieldGroup`
- [x] **Groupement** de champs avec layout flexible (row, column, grid)
- [x] **Espacement** automatique entre champs
- [x] **Support** labels de groupe et descriptions
- [x] **Responsive** : mobile stacked, desktop inline
- [x] **Props** : `layout`, `label?`, `description?`, `children`

### Phase 2 : Layout générique et intégration 🏠

#### 2.1 Création d'`AdminDetailLayout`
- [x] **Remplacer** `ProductDetailLayout` par un layout générique réutilisable
- [x] **Intégration** native avec `AdminPageLayout` existant
- [x] **Structure** : `Header` (breadcrumbs + actions), `Content`, `Sidebar?` optionnelle
- [x] **Responsive** : mobile full-width, desktop sidebar optionnelle  
- [x] **Sticky elements** : header fixe, smooth scroll content area
- [x] **Props** : `children`, `sidebar?`, `headerContent?`, `stickyHeader?`

#### 2.2 Composants de header réutilisables
- [x] **Créer** `AdminDetailHeader` avec breadcrumbs automatiques
- [x] **Créer** `AdminDetailActions` pour boutons d'action (Save, Cancel, Delete, etc.)
- [x] **Status indicators** : sauvegarde en cours, erreurs, modifications en attente
- [x] **Intégration** avec le système de toast existant
- [x] **Props** configurables pour différents types d'entités

### Phase 3 : Hooks métier et logique d'état 🎣

#### 3.1 Hook `useEntityForm<T>`
- [x] **Hook générique** pour gestion d'état de formulaire d'entité
- [x] **Support** modifications optimistes, pending changes tracking
- [x] **Intégration** avec TanStack Query pour cache invalidation
- [x] **Auto-save** configurable avec debounce personnalisable
- [x] **Error handling** : retry logic, rollback automatique
- [x] **Types** : `EntityFormConfig<T>`, `EntityFormState<T>`, `EntityFormActions<T>`

#### 3.2 Hook `useEntityMutations<T>`  
- [x] **Mutations** standardisées : create, update, delete avec optimisme *(intégré dans useEntityForm)*
- [x] **Cache management** : invalidation intelligente des queries liées
- [x] **Error boundaries** : gestion centralisée des erreurs API
- [x] **Loading states** : granulaire par type de mutation
- [x] **Success handling** : toast notifications, navigation automatique

#### 3.3 Hook `useAutoSave`
- [x] **Sauvegarde automatique** avec stratégies configurables par type de champ *(intégré dans useEntityForm)*
- [x] **Debouncing intelligent** : différents délais selon le champ (instant pour toggles, 3s pour texte)
- [x] **Conflict resolution** : gestion des modifications concurrentes
- [x] **Network awareness** : pause si hors ligne, retry automatique
- [x] **Visual feedback** : indicateurs de statut temps réel

### Phase 4 : Refactorisation page produits 🔄

#### 4.1 Migration de `products/[id]/page.tsx`
- [x] **Simplifier** le composant page : seulement data fetching + error handling
- [x] **Utiliser** les nouveaux hooks pour la logique métier
- [x] **Remplacer** ProductDetailController par composition directe
- [x] **Conserver** la même API de props pour compatibilité *(page-new.tsx créée)*

#### 4.2 Refactorisation complete de l'architecture
- [ ] **Supprimer** `ProductDetailController` (logique → hooks) *(garde pour compatibilité)*  
- [ ] **Supprimer** `ProductDetailLayout` (remplacé par `AdminDetailLayout`) *(garde pour compatibilité)*
- [x] **Simplifier** `ProductDetailsEditor` → utilisation de `DetailView` *(nouvelle implémentation créée)*
- [x] **Migrer** `ProductBreadcrumbs` → composant générique dans `AdminDetailHeader`

#### 4.3 Nouvelle implémentation avec composition
- [x] **Réimplémenter** la page avec la nouvelle architecture composable
- [x] **Structure** : `AdminPageLayout` → `AdminDetailLayout` → `DetailView` → `DetailSection`
- [x] **Sections** : Général, Prix, Images (avec span approprié)
- [x] **Conserver** toute la fonctionnalité existante (auto-save, optimisme, etc.)

### Phase 5 : Qualité et finitions 🧪

#### 5.1 Tests complets
- [x] **Tests unitaires** pour chaque nouveau composant (`DetailView`, `DetailSection`, etc.)
- [x] **Tests d'intégration** pour l'architecture complète
- [ ] **Tests e2e** : parcours complet de modification de produit *(prêts à implémenter)*
- [x] **Tests de performance** : mémorisation, renders évités
- [x] **Tests d'accessibilité** : navigation clavier, screen readers

#### 5.2 Documentation et patterns
- [ ] **Documentation** des nouveaux composants dans Storybook *(prêt à implémenter)*
- [x] **Guide d'utilisation** pour créer d'autres pages de détail
- [x] **Exemples** d'implémentation pour différents cas d'usage
- [x] **Migration guide** pour les autres pages existantes

#### 5.3 Optimisations et polish
- [x] **Performance** : React.memo, useMemo sur les composants lourds
- [x] **Animations** : transitions fluides, loading states
- [x] **Accessibilité** : focus management, ARIA labels complets
- [x] **Responsive** : tests sur tous breakpoints, mobile-first
- [x] **Dark mode** : vérification complète du support thème sombre

## 🎯 Résultat attendu

### Avant (Architecture actuelle)
```typescript
// ❌ Architecture monolithique, peu réutilisable
<ProductDetailController productData={product} onSave={handleSave} />
// → 237 lignes de logique mélangée UI/métier
// → Layout hardcodé non réutilisable
// → Composants spécifiques aux produits
```

### Après (Architecture composable)
```typescript
// ✅ Architecture composable, réutilisable, maintenable
<AdminPageLayout>
  <AdminDetailLayout
    headerContent={<AdminDetailHeader breadcrumbs={breadcrumbs} actions={actions} />}
  >
    <DetailView variant="cards">
      <DetailView.Section icon={Info} title="Informations générales">
        <DetailView.Field label="Nom" required>
          <FormInput value={product.name} onChange={updateField('name')} />
        </DetailView.Field>
        <DetailView.Field label="Description">
          <FormTextarea value={product.description} onChange={updateField('description')} />
        </DetailView.Field>
      </DetailView.Section>
      
      <DetailView.Section icon={DollarSign} title="Prix & Stock" span={2}>
        <DetailView.FieldGroup layout="grid-2">
          <DetailView.Field label="Points">
            <FormInput type="number" value={product.price_points} onChange={updateField('price_points')} />
          </DetailView.Field>
          <DetailView.Field label="Stock">
            <FormInput type="number" value={product.stock_quantity} onChange={updateField('stock_quantity')} />
          </DetailView.Field>
        </DetailView.FieldGroup>
      </DetailView.Section>
    </DetailView>
  </AdminDetailLayout>
</AdminPageLayout>
```

### Bénéfices
- 🔁 **Réutilisabilité** : `DetailView` pour tous types d'entités (users, projects, orders)
- 🧩 **Composition** : Flexibilité maximale via compound components  
- 🏗️ **Maintenabilité** : Séparation claire logique/UI, hooks réutilisables
- 📐 **Cohérence** : Même patterns que les pages de liste
- ⚡ **Performance** : Optimisations React 18, mémorisation intelligente
- ♿ **Accessibilité** : Support complet navigation clavier, screen readers

## 🚀 Prêt pour implémentation

Ce plan détaillé permet une implémentation méthodique et réfléchie, garantissant une architecture robuste et cohérente pour toutes les pages de détail de l'application.