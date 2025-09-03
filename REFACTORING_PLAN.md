
# Plan de Refactoring Détaillé : Module Produits

Ce document est la feuille de route stratégique pour le refactoring complet du dossier `apps/web/src/app/admin/(dashboard)/products/`. Chaque étape est conçue pour améliorer la qualité, la maintenabilité et la cohérence du code de manière incrémentale.

---

## Phase 1 : Nettoyage et Cohérence de Base

*Objectif : Éliminer le code mort, standardiser les pratiques de base et corriger les incohérences évidentes sans altérer la logique métier.*

- [ ] **1.1. Suppression des fichiers inutiles**
    - **Action** : Supprimer le fichier vide `apps/web/src/app/admin/(dashboard)/products/[id]/images/page.tsx`.
    - **Justification** : Simplifie l'arborescence du projet.

- [ ] **1.2. Suppression des logs de débogage**
    - **Action** : Effectuer une recherche globale de `console.log` dans tout le dossier `products/` et les supprimer.
    - **Justification** : Nettoie la sortie de la console en production et améliore la lisibilité du code.

- [ ] **1.3. Standardisation des notifications utilisateur**
    - **Action** : Dans `[id]/page.tsx`, remplacer `alert(...)` dans la fonction `onError` de la mutation par un appel à `useToast`.
    - **Code cible** :
        ```typescript
        // Remplacer :
        alert(`Erreur lors de la sauvegarde: ${error.message || 'Erreur inconnue'}`)

        // Par (après avoir importé et initialisé useToast) :
        toast({
          variant: 'destructive',
          title: 'Erreur de sauvegarde',
          description: error.message || 'Une erreur inconnue est survenue.',
        })
        ```
    - **Justification** : Assure une expérience utilisateur cohérente pour les notifications.

- [ ] **1.4. Simplification du code superflu**
    - **Action** : Dans `[id]/page.tsx`, simplifier l'initialisation de `productData`.
    - **Code cible** :
        ```typescript
        // Remplacer :
        const productData = useMemo(() => {
          return product || null
        }, [product])

        // Par :
        const productData = product || null;
        ```
    - **Justification** : `useMemo` est inutile ici et complexifie inutilement le code.

- [ ] **1.5. Création d'un composant `FormCheckbox`**
    - **Action** : Créer un composant `FormCheckbox` qui s'intègre avec le hook `useAppForm`, sur le modèle de `FormInput`.
    - **Action** : Remplacer les `<input type="checkbox">` standards dans `new/page.tsx` par ce nouveau composant.
    - **Justification** : Garantit une cohérence visuelle et fonctionnelle pour tous les champs de formulaire.

---

## Phase 2 : Typage Strict et Fiabilisation

*Objectif : Éliminer toutes les sources d'insécurité de type et renforcer la robustesse du code.*

- [ ] **2.1. Éradication du type `any`**
    - **Action** : Parcourir tous les fichiers et remplacer chaque usage de `any`.
    - **Cibles prioritaires** :
        - `[id]/page.tsx` -> `handleSave(patch: any)` doit devenir `handleSave(patch: Partial<ProductFormData>)`.
        - `page.tsx` -> `renderItem={(p: any) => ...}` doit utiliser le type inféré `(p: typeof productsData.items[number]) => ...`.
        - `[id]/components/product-detail-controller.tsx` -> Éviter `(productData as any)[key]` en utilisant un typage plus strict comme `key as keyof ProductFormData`.
        - `new/page.tsx` -> `catch (error: any)` doit devenir `catch (error: unknown)` avec une vérification `instanceof Error`.
    - **Justification** : Rétablit la sécurité de type de bout en bout, qui est l'un des avantages majeurs de TypeScript.

- [ ] **2.2. Fiabilisation de la logique de sauvegarde**
    - **Action** : Dans `[id]/components/product-detail-controller.tsx`, supprimer la logique de relance automatique dans la fonction `smartSave`.
    - **Code cible** :
        ```typescript
        // Supprimer ce bloc :
        setTimeout(() => {
          if (Object.keys(changes).length > 0) {
            console.log('🔄 Retrying save after error...');
            smartSave(changes, true);
          }
        }, 30000);
        ```
    - **Justification** : La relance automatique est une stratégie imprévisible pour l'utilisateur et peut masquer des problèmes sous-jacents. L'indicateur d'erreur est suffisant.

---

## Phase 3 : Refactoring Architectural et Structurel

*Objectif : Améliorer la structure du code en extrayant les composants, en clarifiant les responsabilités et en optimisant la logique.*

- [ ] **3.1. Extraction du composant `SaveStatusIndicator`**
    - **Action** : Créer un nouveau fichier `[id]/components/save-status-indicator.tsx`.
    - **Action** : Déplacer la logique et le JSX du `SaveStatusIndicator` (actuellement dans `product-compact-header.tsx`) dans ce nouveau fichier.
    - **Action** : **Ajouter la logique d'auto-disparition** à l'intérieur de ce nouveau composant avec `useEffect` et `setTimeout` lorsque `saveStatus.type === 'saved'`.
    - **Action** : Importer et utiliser ce composant dans `product-compact-header.tsx`.
    - **Justification** : Améliore la réutilisabilité, la lisibilité et l'encapsulation. Le composant gère désormais son propre état interne.

- [ ] **3.2. Extraction du composant `FilterModal`**
    - **Action** : Créer un nouveau fichier `components/product-filter-modal.tsx` (dans un dossier de composants partagé au niveau de `products`).
    - **Action** : Déplacer la logique et le JSX de `FilterModal` (actuellement dans `page.tsx`) dans ce nouveau fichier.
    - **Action** : Importer et utiliser ce composant dans `page.tsx`.
    - **Justification** : Allège le composant de la page principale et rend le `FilterModal` potentiellement réutilisable.

- [ ] **3.3. Simplification des callbacks de l'uploader d'images**
    - **Action** : Dans `product-details-editor.tsx`, revoir l'intégration de `ImageUploaderField`.
    - **Action** : S'assurer qu'un seul callback (`onImagesChange` ou un `onChange` standard) est utilisé pour remonter les changements, au lieu de la combinaison actuelle de `handleChange` et `onImagesChange` qui semble redondante.
    - **Justification** : Clarifie l'API du composant et supprime la confusion.

---

## Phase 4 : Optimisation du Flux de Données

*Objectif : Améliorer les performances et la fiabilité de la manière dont les données sont récupérées et affichées.*

- [ ] **4.1. Optimisation de la récupération des producteurs**
    - **Note** : Cette étape suppose une modification possible du backend.
    - **Action (Backend)** : Définir la nécessité de créer un nouvel endpoint tRPC : `admin.producers.list` qui retourne `Array<{ id: string, name: string }> `.
    - **Action (Frontend)** : Dans `page.tsx`, remplacer la logique de `useMemo` qui extrait les producteurs de la liste de produits par un appel direct à `trpc.admin.producers.list.useQuery()`.
    - **Justification** : Améliore drastiquement les performances en évitant de charger une grande liste de produits pour une petite liste de filtres.

- [ ] **4.2. Correction de la logique de pagination**
    - **Note** : Cette étape suppose une modification possible du backend.
    - **Action (Backend)** : Définir la nécessité pour l'endpoint `admin.products.list` de retourner un objet incluant le nombre total d'items : `{ items, nextCursor, totalCount }`.
    - **Action (Frontend)** : Dans `page.tsx`, passer `productsData.totalCount` à la prop `totalItems` du composant `AdminPagination`.
    - **Justification** : Corrige la pagination pour qu'elle reflète le nombre total de pages et pas seulement la page actuelle.
