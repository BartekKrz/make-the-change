# Configuration Supabase Storage - Make the CHANGE

## Vue d'ensemble

Le projet **Make the CHANGE** utilise Supabase Storage pour la gestion complète des médias avec un système sophistiqué d'optimisation automatique et de gestion multi-buckets.

---

## 🪣 Buckets Configurés

### Buckets Principaux

#### 1. **`projects`** - Images des Projets Biodiversité
**Usage**: Photos des projets (ruches, oliviers, vignes, forêts)
- **Types de fichiers**: JPEG, JPG, PNG, WEBP
- **Taille max**: 10MB par image
- **Optimisation**: 1920x1080px, qualité 85%
- **Structure**: `{projectId}/{folder}/{filename}`
- **Politiques**: Lecture publique, écriture admin seulement

#### 2. **`products`** - Images des Produits E-commerce
**Usage**: Photos des produits (miel, huile d'olive, vins)
- **Types de fichiers**: JPEG, JPG, PNG, WEBP
- **Taille max**: 10MB par image
- **Optimisation**: 1200x1200px, qualité 85%
- **Structure**: `{productId}/{folder}/{filename}`
- **Politiques**: Lecture publique, écriture admin seulement

#### 3. **`producers`** - Images des Producteurs
**Usage**: Photos des producteurs et de leurs installations
- **Types de fichiers**: JPEG, JPG, PNG, WEBP
- **Taille max**: 10MB par image
- **Optimisation**: 1920x1080px, qualité 85%
- **Structure**: `{producerId}/{folder}/{filename}`
- **Politiques**: Lecture publique, écriture admin seulement

#### 4. **`users`** - Avatars et Médias Utilisateurs
**Usage**: Photos de profil, avatars utilisateurs
- **Types de fichiers**: JPEG, JPG, PNG, WEBP
- **Taille max**: 10MB par image
- **Optimisation**: 150x150px (avatars), qualité 85%
- **Structure**: `{userId}/avatars/{filename}` ou `{userId}/{folder}/{filename}`
- **Politiques**: Lecture publique, écriture propriétaire seulement

#### 5. **`categories`** - Images des Catégories
**Usage**: Images représentatives des catégories de produits
- **Types de fichiers**: JPEG, JPG, PNG, WEBP
- **Taille max**: 10MB par image
- **Optimisation**: 800x600px, qualité 85%
- **Structure**: `{categoryId}/{folder}/{filename}`
- **Politiques**: Lecture publique, écriture admin seulement

---

## ⚙️ Configuration Technique

### Client Supabase Storage

```typescript
// Configuration dans lib/upload.ts
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
```

### Variables d'environnement requises

```bash
# Dans .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## 🖼️ Système d'Upload

### Composant Principal: `ImageUpload`

```typescript
// Utilisation basique
<ImageUpload
  entityId="project-uuid"
  bucket="projects"
  folder="main"
  maxFiles={5}
  currentImages={currentImages}
  onImagesChange={setImages}
  multiple={true}
  acceptedTypes={['image/jpeg', 'image/jpg', 'image/png', 'image/webp']}
/>
```

### Service d'Upload: `ImageUploadService`

#### Fonctions principales

```typescript
// Upload simple
await ImageUploadService.uploadImage(file, entityId, {
  bucket: 'projects',
  folder: 'main',
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 0.85
})

// Upload multiple
await ImageUploadService.uploadMultipleImages(files, entityId, options)

// Suppression
await ImageUploadService.deleteImage(bucket, filePath)

// URL optimisée
ImageUploadService.getOptimizedImageUrl(bucket, filePath, {
  width: 800,
  height: 600,
  quality: 85,
  format: 'webp'
})
```

---

## 🔧 Optimisation Automatique

### Paramètres d'optimisation par bucket

| Bucket | Largeur Max | Hauteur Max | Qualité | Format |
|--------|-------------|-------------|---------|---------|
| projects | 1920px | 1080px | 85% | WebP/JPEG |
| products | 1200px | 1200px | 85% | WebP/JPEG |
| producers | 1920px | 1080px | 85% | WebP/JPEG |
| users | 150px | 150px | 85% | WebP/JPEG |
| categories | 800px | 600px | 85% | WebP/JPEG |

### Transformations disponibles

```typescript
// Formats supportés
type ImageFormat = 'webp' | 'jpeg' | 'png'

// Tailles prédéfinies
const sizes = {
  thumbnail: { width: 300, height: 200, quality: 75, format: 'webp' },
  medium: { width: 800, height: 600, quality: 85, format: 'webp' },
  large: { width: 1920, height: 1080, quality: 90, format: 'webp' }
}
```

---

## 🗂️ Structure des Fichiers

### Organisation par entité

```
📁 projects/
  📁 {projectId}/
    📁 main/
      ├── image1.webp
      ├── image2.webp
    📁 updates/
      ├── update1.webp
      ├── update2.webp

📁 products/
  📁 {productId}/
    📁 gallery/
      ├── product1.webp
      ├── product2.webp

📁 users/
  📁 {userId}/
    📁 avatars/
      ├── avatar.webp
    📁 uploads/
      ├── custom-image.webp

📁 producers/
  📁 {producerId}/
    📁 profile/
      ├── logo.webp
      ├── farm.webp

📁 categories/
  📁 {categoryId}/
    📁 banner/
      ├── category-image.webp
```

---

## 🔗 APIs tRPC

### Endpoints disponibles

#### `images.generateUploadUrl`
```typescript
// Génère URL signée pour upload direct
const result = await trpc.images.generateUploadUrl.mutate({
  bucket: 'projects',
  fileName: 'image.jpg',
  folder: 'main',
  contentType: 'image/jpeg',
  entityId: 'project-uuid'
})
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
// Met à jour les images d'une entité
await trpc.images.updateEntityImages.mutate({
  entityType: 'project',
  entityId: 'project-uuid',
  images: ['url1', 'url2', 'url3']
})
```

#### `images.listImages`
```typescript
// Liste les images d'un bucket/dossier
const { images } = await trpc.images.listImages.query({
  bucket: 'projects',
  folder: 'project-uuid',
  limit: 50
})
```

#### `images.getStorageStats`
```typescript
// Statistiques de stockage
const { bucketStats } = await trpc.images.getStorageStats.query()
// Retourne: [{ bucket, fileCount, totalSizeMB }]
```

---

## 🛡️ Politiques de Sécurité (RLS)

### Configuration RLS par bucket

```sql
-- Lecture publique pour tous les buckets
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id IN ('projects', 'products', 'producers', 'users', 'categories'))

-- Écriture admin seulement
CREATE POLICY "Admin write access" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id IN ('projects', 'products', 'producers', 'categories')
  AND auth.role() = 'service_role'
)

-- Écriture propriétaire pour users
CREATE POLICY "User write access" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'users'
  AND auth.uid()::text = (storage.foldername(name))[1]
)
```

---

## 🎯 Helpers Utilitaires

### Génération d'URLs optimisées

```typescript
// Images de projet
export const getProjectImageUrl = (projectId: string, imageName: string, size?: 'thumbnail' | 'medium' | 'large') => {
  return ImageUploadService.getOptimizedImageUrl(
    'projects',
    `${projectId}/${imageName}`,
    size ? transformations[size] : undefined
  )
}

// Images de produit
export const getProductImageUrl = (productId: string, imageName: string, size?: 'thumbnail' | 'medium' | 'large') => {
  return ImageUploadService.getOptimizedImageUrl(
    'products',
    `${productId}/${imageName}`,
    size ? transformations[size] : undefined
  )
}

// Avatar utilisateur
export const getUserAvatarUrl = (userId: string, size: number = 150) => {
  return ImageUploadService.getOptimizedImageUrl(
    'users',
    `avatars/${userId}.jpg`,
    { width: size, height: size, quality: 85, format: 'webp' }
  )
}
```

### Hook React personnalisé

```typescript
export const useImageUpload = () => {
  const uploadImage = async (file: File, entityId: string, options: UploadOptions) => {
    return ImageUploadService.uploadImage(file, entityId, options)
  }

  const uploadMultiple = async (files: File[], entityId: string, options: UploadOptions) => {
    return ImageUploadService.uploadMultipleImages(files, entityId, options)
  }

  const deleteImage = async (bucket: string, filePath: string) => {
    return ImageUploadService.deleteImage(bucket, filePath)
  }

  return { uploadImage, uploadMultiple, deleteImage }
}
```

---

## 📊 Monitoring & Analytics

### Métriques de stockage

```typescript
// Via API tRPC
const stats = await trpc.images.getStorageStats.query()

// Structure de réponse
{
  bucketStats: [
    {
      bucket: 'projects',
      fileCount: 150,
      totalSize: 524288000, // bytes
      totalSizeMB: 500 // MB
    },
    // ... autres buckets
  ]
}
```

### Cache et Performance

```typescript
// Configuration du cache
const uploadOptions = {
  cacheControl: '31536000', // 1 an pour les images statiques
  upsert: true // Permet l'écrasement
}

// URLs publiques optimisées
const publicUrl = supabase.storage
  .from(bucket)
  .getPublicUrl(filePath, {
    transform: {
      width: 800,
      height: 600,
      quality: 85,
      format: 'webp'
    }
  })
```

---

## 🚀 Configuration Supabase - 2 Méthodes

### Méthode 1: Via Interface Web (Recommandée)

#### Étape 1: Créer les buckets manuellement
1. Aller dans **Supabase Dashboard → Storage**
2. Cliquer **"Create bucket"** et créer:
   - `projects` (public)
   - `products` (public)
   - `producers` (public)
   - `users` (public)
   - `categories` (public)

#### Étape 2: Configurer les politiques RLS
Pour chaque bucket, aller dans **Policies** et créer:

**Pour Projects/Products/Producers/Categories:**
```sql
-- Lecture publique
CREATE POLICY "Public read" ON storage.objects
FOR SELECT USING (bucket_id = 'projects'); -- remplacer par le nom du bucket

-- Écriture admin
CREATE POLICY "Admin write" ON storage.objects
FOR ALL USING (auth.role() = 'service_role');
```

**Pour Users (politique spéciale):**
```sql
-- Lecture publique
CREATE POLICY "Public read" ON storage.objects
FOR SELECT USING (bucket_id = 'users');

-- Écriture propriétaire
CREATE POLICY "Owner access" ON storage.objects
FOR ALL USING (
  auth.uid()::text = (string_to_array(name, '/'))[1]
);
```

### Méthode 2: Via Scripts Automatisés

#### Étape 1: Créer les buckets
```bash
# Exécuter dans Supabase SQL Editor (UNE PAR UNE)
cat scripts/create-buckets-only.sql
```

#### Étape 2: Configurer les politiques
```bash
# Via Supabase CLI (si installé)
supabase db reset
supabase db push

# Ou exécuter manuellement les politiques dans SQL Editor
cat scripts/storage-policies.sql
```

### Étape 3: Variables d'environnement
```bash
# Dans .env.local
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
SUPABASE_SERVICE_ROLE_KEY=votre_service_key
```

### Étape 4: Test de l'upload
- Utiliser le composant `ImageUpload` dans une page admin
- Vérifier que les images s'uploadent correctement
- Tester les transformations d'images

---

## 🔧 Maintenance & Optimisation

### Tâches régulières

1. **Nettoyage des fichiers orphelins**:
   ```sql
   -- Identifier les images non référencées dans la DB
   SELECT * FROM storage.objects
   WHERE bucket_id = 'projects'
   AND name NOT IN (
     SELECT unnest(images) FROM projects WHERE images IS NOT NULL
   )
   ```

2. **Optimisation du stockage**:
   - Utiliser les transformations pour réduire la taille
   - Compresser automatiquement les nouvelles images
   - Archiver les anciennes images peu consultées

3. **Monitoring de l'utilisation**:
   - Suivre la croissance du stockage
   - Alertes sur dépassement de quotas
   - Audit des uploads par utilisateur

---

## 🐛 Dépannage

### Problèmes courants

1. **Upload échoue**:
   - Vérifier les variables d'environnement
   - Contrôler les permissions du bucket
   - Vérifier la taille du fichier (max 10MB)

2. **Images ne s'affichent pas**:
   - Vérifier l'URL publique
   - Contrôler les politiques RLS
   - Tester la transformation demandée

3. **Performance lente**:
   - Utiliser les transformations optimisées
   - Activer le cache CDN
   - Optimiser la taille des images source

---

*Documentation créée le: $(date)*
*Projet: Make the CHANGE*
*Version: v1.0 - Configuration Supabase Storage*
