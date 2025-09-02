# 🚀 Guide d'Intégration Frontend - Supabase Storage Setup

## Vue d'ensemble

Le système de stockage Supabase a été configuré et est **prêt pour l'intégration frontend**. Voici ce qui a été mis en place :

---

## 🪣 Buckets Supabase Storage Configurés

### ✅ Buckets Créés
```sql
-- Ces buckets ont été créés via scripts/create-buckets-only.sql
- projects    (public) - Images des projets biodiversité
- products    (public) - Images des produits e-commerce
- producers   (public) - Images des producteurs
- users       (public) - Avatars et médias utilisateurs
- categories  (public) - Images des catégories
```

### ✅ Politiques RLS Configurées
```typescript
// Lecture publique pour tous les buckets
POLICY "Public read" ON storage.objects FOR SELECT

// Écriture selon le contexte :
- projects/products/producers/categories : admin seulement (service_role)
- users : propriétaire seulement (auth.uid())
```

---

## 📚 APIs tRPC Disponibles pour le Frontend

### 🔧 Gestion des Images

#### `images.generateUploadUrl`
```typescript
// Génère URL signée pour upload direct
const result = await trpc.images.generateUploadUrl.mutate({
  bucket: 'projects',           // 'projects' | 'products' | 'producers' | 'users' | 'categories'
  fileName: 'image.jpg',        // nom du fichier
  folder: 'main',              // optionnel, dossier dans l'entité
  contentType: 'image/jpeg',   // type MIME
  entityId: 'project-uuid'     // ID de l'entité parente
})

// Retourne :
{
  uploadUrl: "https://xxx.supabase.co/storage/v1/upload/...",
  filePath: "project-uuid/main/image.jpg",
  publicUrl: "https://xxx.supabase.co/storage/v1/object/public/projects/..."
}
```

#### `images.deleteImage`
```typescript
// Supprime une image
await trpc.images.deleteImage.mutate({
  bucket: 'projects',
  filePath: 'project-uuid/main/image.jpg'
})
```

#### `images.updateEntityImages`
```typescript
// Met à jour les images d'une entité dans la DB
await trpc.images.updateEntityImages.mutate({
  entityType: 'project', // 'project' | 'product' | 'producer' | 'user_profile' | 'category'
  entityId: 'project-uuid',
  images: [
    'https://xxx.supabase.co/storage/v1/object/public/projects/project-uuid/main/image1.jpg',
    'https://xxx.supabase.co/storage/v1/object/public/projects/project-uuid/main/image2.jpg'
  ]
})
```

#### `images.listImages`
```typescript
// Liste les images d'un bucket/dossier
const { images } = await trpc.images.listImages.query({
  bucket: 'projects',
  folder: 'project-uuid', // optionnel
  limit: 50
})

// Retourne :
{
  images: [
    {
      name: 'image1.jpg',
      size: 245760,
      lastModified: '2024-01-01T10:00:00Z',
      publicUrl: 'https://xxx.supabase.co/storage/v1/object/public/projects/...'
    }
  ]
}
```

---

## 🎨 Composants Frontend Disponibles

### ✅ ImageUpload Component
```typescript
// Utilisation basique
<ImageUpload
  entityId="project-uuid"
  bucket="projects"
  folder="main"                    // optionnel
  maxFiles={5}
  currentImages={currentImages}    // string[]
  onImagesChange={setImages}       // callback avec URLs
  multiple={true}
  acceptedTypes={['image/jpeg', 'image/jpg', 'image/png', 'image/webp']}
/>

// Props disponibles :
- entityId: string (requis)       // ID de l'entité
- bucket: string (requis)         // nom du bucket
- folder?: string                 // sous-dossier optionnel
- maxFiles?: number (5)           // nombre max d'images
- currentImages?: string[]        // images existantes
- onImagesChange: (urls: string[]) => void // callback
- className?: string             // classes CSS
- multiple?: boolean (true)      // upload multiple
- acceptedTypes?: string[]       // types acceptés
```

### ✅ Hook useImageUpload
```typescript
import { useImageUpload } from '@/lib/upload'

const MyComponent = () => {
  const { uploadImage, uploadMultiple, deleteImage } = useImageUpload()

  const handleUpload = async (file: File) => {
    const result = await uploadImage(file, 'project-uuid', {
      bucket: 'projects',
      folder: 'main',
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 0.85
    })

    if (result.success) {
      console.log('Upload réussi:', result.url)
    } else {
      console.error('Erreur:', result.error)
    }
  }

  const handleDelete = async (bucket: string, filePath: string) => {
    await deleteImage(bucket, filePath)
  }
}
```

---

## 🔧 Service d'Upload (lib/upload.ts)

### ✅ Fonctions Principales

#### `ImageUploadService.uploadImage()`
```typescript
// Upload avec optimisation automatique
const result = await ImageUploadService.uploadImage(
  file,           // File object
  entityId,       // string
  {
    bucket: 'projects',
    folder: 'main',           // optionnel
    maxWidth: 1920,           // redimensionnement
    maxHeight: 1080,
    quality: 0.85,           // compression JPEG
    fileName: 'custom.jpg'    // optionnel
  }
)

// Retourne :
{
  success: true,
  url: "https://xxx.supabase.co/storage/v1/object/public/projects/...",
  publicUrl: "...",
  fileName: "image.jpg",
  path: "project-uuid/main/image.jpg"
}
```

#### `ImageUploadService.uploadMultipleImages()`
```typescript
// Upload multiple simultané
const results = await ImageUploadService.uploadMultipleImages(
  files,        // File[]
  entityId,     // string
  options       // UploadOptions
)
```

#### `ImageUploadService.deleteImage()`
```typescript
// Suppression
const result = await ImageUploadService.deleteImage(
  'projects',                           // bucket
  'project-uuid/main/image.jpg'         // filePath
)
```

### ✅ Optimisation Automatique
```typescript
// Paramètres d'optimisation par bucket
const optimizations = {
  projects:   { width: 1920, height: 1080, quality: 0.85 },
  products:   { width: 1200, height: 1200, quality: 0.85 },
  producers:  { width: 1920, height: 1080, quality: 0.85 },
  users:      { width: 150,  height: 150,  quality: 0.85 },
  categories: { width: 800,  height: 600,  quality: 0.85 }
}
```

---

## 🎯 Helpers Utilitaires

### ✅ Génération d'URLs Optimisées
```typescript
import {
  getProjectImageUrl,
  getProductImageUrl,
  getUserAvatarUrl
} from '@/lib/upload'

// Images de projet avec transformation
const projectImage = getProjectImageUrl(
  'project-uuid',
  'image.jpg',
  'medium'  // 'thumbnail' | 'medium' | 'large'
)
// → https://xxx.supabase.co/storage/v1/render/image/public/projects/project-uuid/image.jpg?width=800&height=600&quality=85&format=webp

// Avatar utilisateur
const avatarUrl = getUserAvatarUrl('user-uuid', 150)
// → https://xxx.supabase.co/storage/v1/render/image/public/users/avatars/user-uuid.jpg?width=150&height=150&quality=85&format=webp
```

### ✅ Transformations Disponibles
```typescript
// Formats supportés
type ImageFormat = 'webp' | 'jpeg' | 'png'

// Tailles prédéfinies
const sizes = {
  thumbnail: { width: 300, height: 200, quality: 75 },
  medium:    { width: 800, height: 600, quality: 85 },
  large:     { width: 1920, height: 1080, quality: 90 }
}

// Transformation personnalisée
ImageUploadService.getOptimizedImageUrl(
  'projects',
  'project-uuid/image.jpg',
  {
    width: 600,
    height: 400,
    quality: 80,
    format: 'webp'
  }
)
```

---

## 📁 Structure des Fichiers Stockés

### ✅ Organisation par Entité
```
📁 projects/
  📁 {projectId}/
    📁 main/           # Images principales
      ├── image1.webp
      ├── image2.webp
    📁 updates/        # Images des mises à jour
      ├── update1.webp

📁 products/
  📁 {productId}/
    📁 gallery/        # Galerie produit
      ├── product1.webp

📁 users/
  📁 {userId}/
    📁 avatars/        # Avatars utilisateur
      ├── avatar.webp

📁 producers/
  📁 {producerId}/
    📁 profile/        # Photos du producteur
      ├── logo.webp
      ├── farm.webp
```

---

## 🔐 Sécurité & Permissions

### ✅ Accès par Rôle
```typescript
// Lecture : Toujours publique pour tous les buckets
// Les images sont accessibles via URLs publiques

// Écriture : Selon le contexte
- projects/products/producers/categories : Uniquement admin (service_role)
- users : Uniquement le propriétaire (auth.uid())
```

### ✅ Validation des Fichiers
```typescript
// Validation automatique
- Taille max : 10MB par fichier
- Types acceptés : JPEG, JPG, PNG, WEBP
- Redimensionnement automatique selon le bucket
- Compression JPEG/WebP optimisée
```

---

## 🚀 Exemples d'Intégration

### ✅ Upload dans un Formulaire Projet
```typescript
const CreateProjectForm = () => {
  const [projectImages, setProjectImages] = useState<string[]>([])

  return (
    <form>
      {/* Autres champs du formulaire */}

      <ImageUpload
        entityId={projectId}
        bucket="projects"
        folder="main"
        maxFiles={10}
        currentImages={projectImages}
        onImagesChange={setProjectImages}
      />

      <button type="submit">
        Créer le projet
      </button>
    </form>
  )
}
```

### ✅ Affichage d'Images Optimisées
```typescript
const ProjectCard = ({ project }) => {
  const imageUrl = getProjectImageUrl(
    project.id,
    project.images[0],
    'medium'
  )

  return (
    <div className="project-card">
      <img
        src={imageUrl}
        alt={project.name}
        loading="lazy"
        className="w-full h-48 object-cover"
      />
      <h3>{project.name}</h3>
    </div>
  )
}
```

### ✅ Gestion des Avatars Utilisateur
```typescript
const UserProfile = ({ user }) => {
  const avatarUrl = getUserAvatarUrl(user.id)

  return (
    <div className="user-profile">
      <img
        src={avatarUrl}
        alt={`${user.firstName} ${user.lastName}`}
        className="w-32 h-32 rounded-full"
      />
    </div>
  )
}
```

---

## ⚙️ Variables d'Environnement Requises

```bash
# Dans .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## 📊 Monitoring & Analytics

### ✅ Statistiques de Stockage
```typescript
// Via API tRPC
const stats = await trpc.images.getStorageStats.query()

// Retourne par bucket :
{
  bucketStats: [
    {
      bucket: 'projects',
      fileCount: 150,
      totalSize: 524288000,  // bytes
      totalSizeMB: 500       // MB
    }
  ]
}
```

---

## 🎯 Points d'Attention pour le Frontend

### ✅ Points Importants
1. **URLs Publiques** : Toutes les images sont accessibles publiquement
2. **Cache Automatique** : 1 an de cache sur les images optimisées
3. **Transformation** : Utilisez les helpers pour les tailles optimisées
4. **Validation** : Le composant gère automatiquement la validation
5. **Performance** : Images automatiquement optimisées et compressées

### ⚠️ Bonnes Pratiques
- Utilisez `getProjectImageUrl()`, `getProductImageUrl()`, etc. pour les URLs
- Préférez les formats WebP pour de meilleures performances
- Utilisez les tailles `thumbnail`, `medium`, `large` prédéfinies
- Gérez les erreurs d'upload dans vos composants
- Utilisez `loading="lazy"` pour les images hors viewport

---

## 🎉 Résumé pour l'Équipe Frontend

**Le système Supabase Storage est 100% opérationnel !**

### ✅ **Prêt à utiliser :**
- 5 buckets configurés avec politiques RLS
- Composant `ImageUpload` prêt à l'emploi
- APIs tRPC complètes pour gestion des images
- Helpers utilitaires pour URLs optimisées
- Optimisation automatique des images
- Cache et CDN configurés

### 🚀 **Prochaines étapes :**
1. Importer le composant `ImageUpload` dans vos formulaires
2. Utiliser les helpers `getProjectImageUrl()`, etc. pour l'affichage
3. Tester l'upload dans les pages admin
4. Intégrer dans les pages produits/projets

**C'est tout ! Le système est prêt pour l'intégration frontend.** 🎯

Avez-vous des questions sur l'intégration d'un composant spécifique ?
