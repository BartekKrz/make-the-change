# 🎨 **FRONTEND INTEGRATION : Nouvelle Architecture Images + BlurHash**

**Make the CHANGE - Guide d'intégration Frontend**
**Date :** Septembre 2025
**Auteur :** Agent DB Migration

---

## 📋 **SOMMAIRE EXECUTIF**

### **🎯 Objectif**
Mettre à jour le frontend pour exploiter la nouvelle architecture d'images avec hiérarchie visuelle et BlurHash pour une meilleure UX.

### **🔄 Changements DB Effectués**
- ✅ **Producers** : `logo_url` + `cover_image` + `gallery_images[]` + `blur_hashes[]`
- ✅ **Projects** : `hero_image` + `gallery_images[]` + `blur_hashes[]`
- ✅ **Products** : `blur_hashes[]` ajouté aux `images[]` existants

### **🚀 Impact Frontend**
- **Performance** : Placeholders intelligents avec BlurHash
- **UX** : Hiérarchie visuelle claire (hero, logo, cover)
- **Maintenance** : Code plus organisé et réutilisable

---

## 🗄️ **NOUVELLES STRUCTURES DE DONNÉES**

### **🏭 Producers - Nouvelle Structure**
```typescript
interface Producer {
  // Ancien système (toujours présent pour compatibilité)
  images: string[]; // ❌ À éviter, utiliser la nouvelle structure

  // Nouveau système (à utiliser)
  logo_url: string;        // 🖼️ Image principale du producteur
  cover_image: string;     // 🏞️ Bannière/cover du producteur
  gallery_images: string[]; // 🖼️ Galerie complémentaire (max 3-5 images)
  blur_hashes: Array<{     // 🎨 Placeholders intelligents
    url: string;
    blurhash: string;
    type: 'logo' | 'cover' | 'gallery';
  }>;
}
```

### **🏗️ Projects - Nouvelle Structure**
```typescript
interface Project {
  // Ancien système (toujours présent)
  images: string[]; // ❌ À éviter

  // Nouveau système (à utiliser)
  hero_image: string;      // 🖼️ Image principale du projet
  gallery_images: string[]; // 🖼️ Galerie du projet (max 3-5 images)
  blur_hashes: Array<{     // 🎨 Placeholders intelligents
    url: string;
    blurhash: string;
    type: 'hero' | 'gallery';
  }>;
}
```

### **🛒 Products - Structure Mise à Jour**
```typescript
interface Product {
  // Système existant (mis à jour)
  images: string[];        // ✅ Toujours utilisé
  blur_hashes: Array<{     // 🆕 NOUVEAU : Placeholders intelligents
    url: string;
    blurhash: string;
    type: 'product';
  }>;
}
```

---

## 🎨 **IMPLEMENTATION BLURHASH FRONTEND**

### **1. Installation Dépendances**
```bash
npm install react-blurhash blurhash
# ou
yarn add react-blurhash blurhash
```

### **2. Composant BlurHashImage**
```tsx
// components/ui/BlurHashImage.tsx
import { Blurhash } from 'react-blurhash';
import { useState } from 'react';

interface BlurHashImageProps {
  src: string;
  blurHash: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export function BlurHashImage({
  src,
  blurHash,
  alt,
  className = '',
  width = 400,
  height = 300
}: BlurHashImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {/* Placeholder BlurHash */}
      {!imageLoaded && (
        <Blurhash
          hash={blurHash}
          width={width}
          height={height}
          resolutionX={32}
          resolutionY={32}
          punch={1}
          className="absolute inset-0 rounded-lg"
        />
      )}

      {/* Image réelle */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`absolute inset-0 object-cover rounded-lg transition-opacity duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageLoaded(true)} // Fallback si erreur
      />
    </div>
  );
}
```

### **3. Hook useImageWithBlurHash**
```tsx
// hooks/useImageWithBlurHash.ts
import { useMemo } from 'react';

interface BlurHashData {
  url: string;
  blurhash: string;
  type: string;
}

export function useImageWithBlurHash(
  blurHashes: BlurHashData[],
  imageUrl: string,
  type: string
) {
  return useMemo(() => {
    const blurHashData = blurHashes.find(
      (bh) => bh.url === imageUrl && bh.type === type
    );
    return {
      src: imageUrl,
      blurHash: blurHashData?.blurhash || '',
      hasBlurHash: !!blurHashData
    };
  }, [blurHashes, imageUrl, type]);
}
```

---

## 🔄 **MISES À JOUR REQUISES PAR COMPOSANT**

### **1. ProducerCard / ProducerProfile**
```tsx
// AVANT (ancien système)
function ProducerCard({ producer }: { producer: Producer }) {
  return (
    <div>
      <img src={producer.images[0]} alt={producer.name} /> {/* ❌ Non hiérarchisé */}
    </div>
  );
}

// APRÈS (nouveau système)
function ProducerCard({ producer }: { producer: Producer }) {
  const { src: logoSrc, blurHash: logoBlurHash, hasBlurHash: hasLogoBlur } =
    useImageWithBlurHash(producer.blur_hashes, producer.logo_url, 'logo');

  const { src: coverSrc, blurHash: coverBlurHash, hasBlurHash: hasCoverBlur } =
    useImageWithBlurHash(producer.blur_hashes, producer.cover_image, 'cover');

  return (
    <div>
      {/* Logo principal avec BlurHash */}
      <BlurHashImage
        src={logoSrc}
        blurHash={logoBlurHash}
        alt={`${producer.name} logo`}
        className="w-16 h-16 rounded-full"
      />

      {/* Cover image avec BlurHash */}
      <BlurHashImage
        src={coverSrc}
        blurHash={coverBlurHash}
        alt={`${producer.name} cover`}
        className="w-full h-48"
      />

      {/* Galerie (3 premières images) */}
      <div className="grid grid-cols-3 gap-2">
        {producer.gallery_images.slice(0, 3).map((imageUrl, index) => {
          const { src, blurHash, hasBlurHash } = useImageWithBlurHash(
            producer.blur_hashes,
            imageUrl,
            'gallery'
          );

          return (
            <BlurHashImage
              key={index}
              src={src}
              blurHash={blurHash}
              alt={`${producer.name} gallery ${index + 1}`}
              className="w-full h-24"
            />
          );
        })}
      </div>
    </div>
  );
}
```

### **2. ProjectCard / ProjectDetail**
```tsx
// AVANT
function ProjectCard({ project }: { project: Project }) {
  return (
    <div>
      <img src={project.images[0]} alt={project.name} /> {/* ❌ Non hiérarchisé */}
    </div>
  );
}

// APRÈS
function ProjectCard({ project }: { project: Project }) {
  const { src: heroSrc, blurHash: heroBlurHash, hasBlurHash: hasHeroBlur } =
    useImageWithBlurHash(project.blur_hashes, project.hero_image, 'hero');

  return (
    <div>
      {/* Hero image principale */}
      <BlurHashImage
        src={heroSrc}
        blurHash={heroBlurHash}
        alt={`${project.name} hero`}
        className="w-full h-64"
      />

      {/* Galerie du projet */}
      <div className="grid grid-cols-4 gap-2 mt-4">
        {project.gallery_images.map((imageUrl, index) => {
          const { src, blurHash, hasBlurHash } = useImageWithBlurHash(
            project.blur_hashes,
            imageUrl,
            'gallery'
          );

          return (
            <BlurHashImage
              key={index}
              src={src}
              blurHash={blurHash}
              alt={`${project.name} gallery ${index + 1}`}
              className="w-full h-24"
            />
          );
        })}
      </div>
    </div>
  );
}
```

### **3. ProductCard / ProductGallery**
```tsx
// AVANT
function ProductCard({ product }: { product: Product }) {
  return (
    <div>
      <img src={product.images[0]} alt={product.name} />
    </div>
  );
}

// APRÈS (avec BlurHash)
function ProductCard({ product }: { product: Product }) {
  // Image principale avec BlurHash
  const primaryImage = product.images[0];
  const { src, blurHash, hasBlurHash } = useImageWithBlurHash(
    product.blur_hashes,
    primaryImage,
    'product'
  );

  return (
    <div>
      <BlurHashImage
        src={src}
        blurHash={blurHash}
        alt={product.name}
        className="w-full h-48"
      />

      {/* Galerie des autres images */}
      <div className="flex gap-2 mt-2 overflow-x-auto">
        {product.images.slice(1, 4).map((imageUrl, index) => {
          const { src: thumbSrc, blurHash: thumbBlurHash } = useImageWithBlurHash(
            product.blur_hashes,
            imageUrl,
            'product'
          );

          return (
            <BlurHashImage
              key={index}
              src={thumbSrc}
              blurHash={thumbBlurHash}
              alt={`${product.name} view ${index + 2}`}
              className="w-20 h-20 flex-shrink-0"
            />
          );
        })}
      </div>
    </div>
  );
}
```

---

## 🔧 **MISES À JOUR TECHNIQUES REQUISES**

### **1. Types TypeScript**
```typescript
// types/database.ts - Ajouter ces interfaces
export interface BlurHashData {
  url: string;
  blurhash: string;
  type: 'logo' | 'cover' | 'gallery' | 'hero' | 'product';
}

export interface Producer {
  // ... autres champs
  logo_url?: string;
  cover_image?: string;
  gallery_images: string[];
  blur_hashes: BlurHashData[];
}

export interface Project {
  // ... autres champs
  hero_image?: string;
  gallery_images: string[];
  blur_hashes: BlurHashData[];
}

export interface Product {
  // ... autres champs
  images: string[];
  blur_hashes: BlurHashData[];
}
```

### **2. Queries GraphQL/Database**
```typescript
// Mettre à jour vos queries pour récupérer les nouveaux champs
const GET_PRODUCER = gql`
  query GetProducer($id: ID!) {
    producer(id: $id) {
      id
      name
      logo_url
      cover_image
      gallery_images
      blur_hashes
    }
  }
`;

const GET_PROJECT = gql`
  query GetProject($id: ID!) {
    project(id: $id) {
      id
      name
      hero_image
      gallery_images
      blur_hashes
    }
  }
`;
```

### **3. API Routes (si utilisé)**
```typescript
// Mettre à jour vos API routes pour retourner les nouveaux champs
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const producer = await db.producer.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      name: true,
      logo_url: true,
      cover_image: true,
      gallery_images: true,
      blur_hashes: true,
    },
  });

  return Response.json(producer);
}
```

---

## 🧪 **TESTING & VALIDATION**

### **1. Tests Visuels**
- ✅ **BlurHash apparait** pendant le chargement des images
- ✅ **Transition smooth** entre BlurHash et image réelle
- ✅ **Fallback gracieux** si BlurHash manquant
- ✅ **Performance** : pas de layout shift

### **2. Tests Fonctionnels**
```typescript
// tests/components/BlurHashImage.test.tsx
describe('BlurHashImage', () => {
  it('shows BlurHash placeholder initially', () => {
    render(<BlurHashImage src="test.jpg" blurHash="valid-hash" alt="test" />);
    expect(screen.getByRole('img')).toHaveAttribute('src', expect.stringContaining('blur'));
  });

  it('transitions to real image on load', async () => {
    render(<BlurHashImage src="test.jpg" blurHash="valid-hash" alt="test" />);
    const img = screen.getByRole('img');
    fireEvent.load(img);
    await waitFor(() => {
      expect(img).toHaveAttribute('src', 'test.jpg');
    });
  });
});
```

### **3. Performance Monitoring**
```typescript
// hooks/usePerformanceTracking.ts
export function useImageLoadPerformance() {
  const [metrics, setMetrics] = useState({
    blurHashTime: 0,
    imageLoadTime: 0,
    totalTime: 0,
  });

  // Track performance metrics
  return metrics;
}
```

---

## 📈 **BÉNÉFICES ATTENDUS**

### **🎯 UX Improvements**
- **Loading Experience** : Placeholders intelligents vs gris uni
- **Perceived Performance** : Sentiment de rapidité accru
- **Visual Hierarchy** : Images principales mises en valeur
- **Professional Look** : Aspect plus moderne et soigné

### **⚡ Performance Gains**
- **Reduced Layout Shift** : Dimensions pré-calculées
- **Better Caching** : BlurHash en cache local
- **Progressive Loading** : Image s'affiche progressivement
- **Bandwidth Optimization** : Placeholder léger avant image lourde

### **🛠️ Developer Experience**
- **Type Safety** : Types TypeScript complets
- **Reusable Components** : Composants modulaires
- **Easy Maintenance** : Logique centralisée
- **Consistent UX** : Patterns uniformes

---

## 🚀 **PLAN DE DÉPLOIEMENT**

### **Phase 1 : Composants Core (Priorité 1)**
- ✅ Créer `BlurHashImage` component
- ✅ Créer `useImageWithBlurHash` hook
- ✅ Mettre à jour les types TypeScript

### **Phase 2 : Pages Producers (Priorité 2)**
- ✅ Mettre à jour `ProducerCard`
- ✅ Mettre à jour `ProducerProfile`
- ✅ Mettre à jour `ProducerList`

### **Phase 3 : Pages Projects (Priorité 3)**
- ✅ Mettre à jour `ProjectCard`
- ✅ Mettre à jour `ProjectDetail`
- ✅ Mettre à jour `ProjectGallery`

### **Phase 4 : Pages Products (Priorité 4)**
- ✅ Mettre à jour `ProductCard`
- ✅ Mettre à jour `ProductGallery`
- ✅ Mettre à jour `ProductDetail`

### **Phase 5 : Optimisations (Priorité 5)**
- ✅ Performance monitoring
- ✅ Tests automatisés
- ✅ Documentation développeur

---

## ❓ **QUESTIONS FRÉQUENTES**

### **Q: Que faire si un BlurHash est manquant ?**
**R:** Le composant `BlurHashImage` gère automatiquement le fallback vers un placeholder gris.

### **Q: Comment migrer progressivement ?**
**R:** Utilisez les anciennes propriétés `images[]` comme fallback pendant la migration.

### **Q: Impact sur les performances ?**
**R:** Négligeable - les BlurHash sont très légers (~20-30 bytes chacun).

### **Q: Compatible mobile ?**
**R:** Oui, `react-blurhash` est optimisé pour mobile et utilise WebGL/Canvas.

---

## 📞 **SUPPORT & CONTACTS**

**En cas de questions :**
- 📧 **Agent DB :** Pour questions sur le schéma DB
- 📧 **Équipe Frontend :** Pour questions d'implémentation
- 📧 **Designer UX :** Pour questions d'expérience utilisateur

**Documentation liée :**
- 🔗 `DB_IMAGES_MIGRATION_PLAN.md` - Plan de migration DB
- 🔗 `generate-blurhash-sql.sql` - Script de génération BlurHash
- 🔗 Composants existants d'upload d'images

---

## ✅ **CHECKLIST DE VALIDATION**

- [ ] `BlurHashImage` component créé et testé
- [ ] `useImageWithBlurHash` hook implémenté
- [ ] Types TypeScript mis à jour
- [ ] ProducerCard utilise `logo_url` + `cover_image`
- [ ] ProjectCard utilise `hero_image`
- [ ] ProductCard utilise BlurHash pour `images[]`
- [ ] Tests automatisés ajoutés
- [ ] Performance monitoring en place
- [ ] Documentation mise à jour

**Statut :** 🟡 **Prêt pour implémentation**

---
*Document généré automatiquement suite à la migration DB - Make the CHANGE*
