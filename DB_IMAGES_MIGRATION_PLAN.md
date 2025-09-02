# 🖼️ **PLAN DE MIGRATION : Nouvelle Structure Images + BlurHash**
**Make the CHANGE - Database Migration Plan**

---

## 📋 **SOMMAIRE EXECUTIF**

**Objectif :** Migrer vers une structure d'images moderne avec séparation hiérarchique et BlurHash pour une meilleure UX.

**Scope :**
- ✅ **Projets** : Séparation hero_image + gallery
- ✅ **Producteurs** : Séparation logo + cover + gallery  
- ✅ **Produits** : Ajout BlurHash aux images existantes
- ✅ **Toutes les entités** : Support BlurHash

**Timeline estimé :** 4-6 heures
**Risque :** Faible (migration backward-compatible)
**Rollback :** Simple (champs conservés)

---

## 🎯 **ANALYSE DE LA SITUATION ACTUELLE**

### **Structure DB Actuelle**
```sql
-- État actuel (simplifié)
CREATE TABLE products (
  images TEXT[] DEFAULT '{}'  -- ❌ Array simple, pas de BlurHash
);

CREATE TABLE projects (
  images TEXT[] DEFAULT '{}'  -- ❌ Array simple, pas de hiérarchie
);

CREATE TABLE producers (
  images TEXT[] DEFAULT '{}'  -- ❌ Array simple, pas de hiérarchie
);
```

### **Problèmes Identifiés**
- ❌ **Pas de hiérarchie** : Toutes les images sont "égales"
- ❌ **Pas de BlurHash** : Placeholders gris uniquement
- ❌ **Difficile à maintenir** : Logique frontend complexe
- ❌ **SEO limité** : Pas d'images principales claires

---

## 🏗️ **NOUVELLE ARCHITECTURE PROPOSÉE**

### **1. Table Produits (Évolution)**
```sql
-- Nouvelle structure pour products
ALTER TABLE products ADD COLUMN blur_hashes TEXT[] DEFAULT '{}';
-- Conserve images[] existant pour compatibilité
```

### **2. Table Projets (Révolution)**
```sql
-- Nouvelle structure pour projects
ALTER TABLE projects ADD COLUMN hero_image TEXT;
ALTER TABLE projects ADD COLUMN gallery_images TEXT[] DEFAULT '{}';
ALTER TABLE projects ADD COLUMN blur_hashes TEXT[] DEFAULT '{}';
-- Dépréciera images[] après migration
```

### **3. Table Producteurs (Révolution)**
```sql
-- Nouvelle structure pour producers
ALTER TABLE producers ADD COLUMN logo_url TEXT;
ALTER TABLE producers ADD COLUMN cover_image TEXT;
ALTER TABLE producers ADD COLUMN gallery_images TEXT[] DEFAULT '{}';
ALTER TABLE producers ADD COLUMN blur_hashes TEXT[] DEFAULT '{}';
-- Dépréciera images[] après migration
```

### **4. Table Images Métadonnées (Future)**
```sql
-- Structure avancée pour le futur
CREATE TABLE image_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(50) NOT NULL, -- 'product', 'project', 'producer'
  entity_id UUID NOT NULL,
  image_url TEXT NOT NULL,
  blur_hash TEXT,
  alt_text TEXT,
  display_order INTEGER DEFAULT 0,
  image_type VARCHAR(50) DEFAULT 'gallery', -- 'hero', 'logo', 'cover', 'gallery'
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 📊 **ANALYSE D'IMPACT**

### **Impact par Table**

| Table | **Champs Ajoutés** | **Données à Migrer** | **Complexité** |
|-------|-------------------|---------------------|---------------|
| **products** | `blur_hashes[]` | Générer hash pour chaque image | Moyenne |
| **projects** | `hero_image`, `gallery_images[]`, `blur_hashes[]` | Répartir images[0]→hero, images[1:]→gallery | Élevée |
| **producers** | `logo_url`, `cover_image`, `gallery_images[]`, `blur_hashes[]` | Même logique | Élevée |

### **Risques Identifiés**
- ⚠️ **Performance** : Génération BlurHash pour ~100+ images
- ⚠️ **Données** : Logique de migration des arrays existants
- ⚠️ **Frontend** : Composants doivent supporter nouvelle structure
- ⚠️ **URLs** : Images existantes doivent rester accessibles

### **Points de Contrôle**
- ✅ **Backup DB** complet avant migration
- ✅ **Tests unitaires** des nouvelles structures
- ✅ **Validation URLs** des images existantes
- ✅ **Monitoring performance** post-migration

---

## 🚀 **PLAN DE MIGRATION DÉTAILLÉ**

### **Phase 1 : Préparation (30 min)**

#### **1.1 Backup Complet**
```bash
# Script de backup
pg_dump -h localhost -U postgres make_the_change > backup_pre_migration.sql
# Vérifier taille et intégrité
ls -lh backup_pre_migration.sql
```

#### **1.2 Installation Dépendances**
```bash
# Backend dependencies
npm install blurhash sharp @types/blurhash

# Test dependencies
npm install --save-dev vitest @vitest/ui
```

#### **1.3 Création Scripts Utilitaires**
```typescript
// lib/blurhash.ts - Utilitaire génération BlurHash
import { encode } from 'blurhash';
import sharp from 'sharp';

export async function generateBlurHash(imageUrl: string): Promise<string> {
  try {
    // Télécharger l'image
    const response = await fetch(imageUrl);
    const buffer = Buffer.from(await response.arrayBuffer());

    // Redimensionner et générer hash
    const { data, info } = await sharp(buffer)
      .resize(32, 32, { fit: 'inside' })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    return encode(new Uint8ClampedArray(data), info.width, info.height, 4, 3);
  } catch (error) {
    console.error('Erreur génération BlurHash:', error);
    return '';
  }
}
```

### **Phase 2 : Migration DB (1h30)**

#### **2.1 Migration Table Products**
```sql
-- Migration PRODUCTS (la plus simple)
BEGIN;

-- Ajouter colonne BlurHash
ALTER TABLE products ADD COLUMN blur_hashes TEXT[] DEFAULT '{}';

-- Créer fonction de migration
CREATE OR REPLACE FUNCTION migrate_products_blurhash()
RETURNS void AS $$
DECLARE
  product_record RECORD;
  blurhash_array TEXT[] := '{}';
BEGIN
  FOR product_record IN SELECT id, images FROM products WHERE images IS NOT NULL AND array_length(images, 1) > 0
  LOOP
    -- Générer BlurHash pour chaque image (via script Node.js)
    -- Pour l'instant, on initialise avec array vide
    UPDATE products
    SET blur_hashes = blurhash_array
    WHERE id = product_record.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Exécuter la migration
SELECT migrate_products_blurhash();

COMMIT;
```

#### **2.2 Migration Table Projects**
```sql
-- Migration PROJECTS
BEGIN;

-- Ajouter nouvelles colonnes
ALTER TABLE projects ADD COLUMN hero_image TEXT;
ALTER TABLE projects ADD COLUMN gallery_images TEXT[] DEFAULT '{}';
ALTER TABLE projects ADD COLUMN blur_hashes TEXT[] DEFAULT '{}';

-- Fonction de migration intelligente
CREATE OR REPLACE FUNCTION migrate_projects_structure()
RETURNS void AS $$
DECLARE
  project_record RECORD;
  hero_url TEXT;
  gallery_urls TEXT[];
BEGIN
  FOR project_record IN SELECT id, images FROM projects WHERE images IS NOT NULL AND array_length(images, 1) > 0
  LOOP
    -- Logique de migration : première image = hero, autres = gallery
    IF array_length(project_record.images, 1) >= 1 THEN
      hero_url := project_record.images[1];
      gallery_urls := project_record.images[2:];
    ELSE
      hero_url := NULL;
      gallery_urls := '{}';
    END IF;

    UPDATE projects
    SET
      hero_image = hero_url,
      gallery_images = gallery_urls,
      blur_hashes = '{}'  -- À remplir avec script Node.js
    WHERE id = project_record.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Exécuter la migration
SELECT migrate_projects_structure();

COMMIT;
```

#### **2.3 Migration Table Producers**
```sql
-- Migration PRODUCERS
BEGIN;

-- Ajouter nouvelles colonnes
ALTER TABLE producers ADD COLUMN logo_url TEXT;
ALTER TABLE producers ADD COLUMN cover_image TEXT;
ALTER TABLE producers ADD COLUMN gallery_images TEXT[] DEFAULT '{}';
ALTER TABLE producers ADD COLUMN blur_hashes TEXT[] DEFAULT '{}';

-- Fonction de migration
CREATE OR REPLACE FUNCTION migrate_producers_structure()
RETURNS void AS $$
DECLARE
  producer_record RECORD;
  logo TEXT;
  cover TEXT;
  gallery TEXT[];
BEGIN
  FOR producer_record IN SELECT id, images FROM producers WHERE images IS NOT NULL AND array_length(images, 1) > 0
  LOOP
    -- Logique : [0]=logo, [1]=cover, [2:]=gallery
    IF array_length(producer_record.images, 1) >= 1 THEN
      logo := producer_record.images[1];
    END IF;

    IF array_length(producer_record.images, 1) >= 2 THEN
      cover := producer_record.images[2];
    END IF;

    IF array_length(producer_record.images, 1) >= 3 THEN
      gallery := producer_record.images[3:];
    ELSE
      gallery := '{}';
    END IF;

    UPDATE producers
    SET
      logo_url = logo,
      cover_image = cover,
      gallery_images = gallery,
      blur_hashes = '{}'  -- À remplir avec script Node.js
    WHERE id = producer_record.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Exécuter la migration
SELECT migrate_producers_structure();

COMMIT;
```

### **Phase 3 : Génération BlurHash (1h)**

#### **3.1 Script Node.js de Génération**
```typescript
// scripts/generate-blurhash.ts
import { createClient } from '@supabase/supabase-js';
import { generateBlurHash } from '../lib/blurhash';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

async function generateAllBlurHashes() {
  console.log('🚀 Starting BlurHash generation...');

  // Products
  const { data: products } = await supabase
    .from('products')
    .select('id, images')
    .not('images', 'is', null);

  for (const product of products || []) {
    if (product.images && product.images.length > 0) {
      const blurHashes = await Promise.all(
        product.images.map((url: string) => generateBlurHash(url))
      );

      await supabase
        .from('products')
        .update({ blur_hashes: blurHashes })
        .eq('id', product.id);

      console.log(`✅ Product ${product.id}: ${blurHashes.length} hashes generated`);
    }
  }

  // Projects (hero + gallery)
  const { data: projects } = await supabase
    .from('projects')
    .select('id, hero_image, gallery_images');

  for (const project of projects || []) {
    const allImages = [];
    if (project.hero_image) allImages.push(project.hero_image);
    if (project.gallery_images) allImages.push(...project.gallery_images);

    if (allImages.length > 0) {
      const blurHashes = await Promise.all(
        allImages.map(url => generateBlurHash(url))
      );

      await supabase
        .from('projects')
        .update({ blur_hashes: blurHashes })
        .eq('id', project.id);

      console.log(`✅ Project ${project.id}: ${blurHashes.length} hashes generated`);
    }
  }

  // Producers (logo + cover + gallery)
  const { data: producers } = await supabase
    .from('producers')
    .select('id, logo_url, cover_image, gallery_images');

  for (const producer of producers || []) {
    const allImages = [];
    if (producer.logo_url) allImages.push(producer.logo_url);
    if (producer.cover_image) allImages.push(producer.cover_image);
    if (producer.gallery_images) allImages.push(...producer.gallery_images);

    if (allImages.length > 0) {
      const blurHashes = await Promise.all(
        allImages.map(url => generateBlurHash(url))
      );

      await supabase
        .from('producers')
        .update({ blur_hashes: blurHashes })
        .eq('id', producer.id);

      console.log(`✅ Producer ${producer.id}: ${blurHashes.length} hashes generated`);
    }
  }

  console.log('🎉 BlurHash generation completed!');
}

// Exécuter
generateAllBlurHashes().catch(console.error);
```

#### **3.2 Exécution du Script**
```bash
# Générer tous les BlurHash
npx tsx scripts/generate-blurhash.ts

# Surveiller les logs
tail -f logs/blurhash-generation.log
```

### **Phase 4 : Tests & Validation (45 min)**

#### **4.1 Tests de Structure**
```sql
-- Vérifier que les nouvelles colonnes existent
SELECT
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name IN ('products', 'projects', 'producers')
  AND column_name IN ('hero_image', 'logo_url', 'cover_image', 'gallery_images', 'blur_hashes')
ORDER BY table_name, column_name;
```

#### **4.2 Tests de Données**
```sql
-- Vérifier cohérence des données
SELECT
  'products' as table_name,
  COUNT(*) as total,
  COUNT(CASE WHEN blur_hashes IS NOT NULL THEN 1 END) as with_blurhash,
  COUNT(CASE WHEN array_length(images, 1) > 0 THEN 1 END) as with_images
FROM products

UNION ALL

SELECT
  'projects' as table_name,
  COUNT(*) as total,
  COUNT(CASE WHEN blur_hashes IS NOT NULL THEN 1 END) as with_blurhash,
  COUNT(CASE WHEN hero_image IS NOT NULL THEN 1 END) as with_hero
FROM projects

UNION ALL

SELECT
  'producers' as table_name,
  COUNT(*) as total,
  COUNT(CASE WHEN blur_hashes IS NOT NULL THEN 1 END) as with_blurhash,
  COUNT(CASE WHEN logo_url IS NOT NULL THEN 1 END) as with_logo
FROM producers;
```

#### **4.3 Tests Fonctionnels**
```typescript
// tests/image-migration.test.ts
describe('Image Migration Tests', () => {
  test('Products should have blur_hashes array', async () => {
    const { data } = await supabase.from('products').select('blur_hashes').limit(1);
    expect(data?.[0]?.blur_hashes).toBeDefined();
    expect(Array.isArray(data?.[0]?.blur_hashes)).toBe(true);
  });

  test('Projects should have hero_image and gallery_images', async () => {
    const { data } = await supabase.from('projects').select('hero_image, gallery_images').limit(1);
    expect(data?.[0]).toHaveProperty('hero_image');
    expect(data?.[0]).toHaveProperty('gallery_images');
    expect(Array.isArray(data?.[0]?.gallery_images)).toBe(true);
  });

  test('Producers should have logo_url, cover_image, gallery_images', async () => {
    const { data } = await supabase.from('producers').select('logo_url, cover_image, gallery_images').limit(1);
    expect(data?.[0]).toHaveProperty('logo_url');
    expect(data?.[0]).toHaveProperty('cover_image');
    expect(data?.[0]).toHaveProperty('gallery_images');
  });
});
```

### **Phase 5 : Rollback Plan (15 min)**

#### **5.1 Script de Rollback**
```sql
-- Rollback en cas de problème
BEGIN;

-- Supprimer les nouvelles colonnes
ALTER TABLE products DROP COLUMN IF EXISTS blur_hashes;
ALTER TABLE projects DROP COLUMN IF EXISTS hero_image;
ALTER TABLE projects DROP COLUMN IF EXISTS gallery_images;
ALTER TABLE projects DROP COLUMN IF EXISTS blur_hashes;
ALTER TABLE producers DROP COLUMN IF EXISTS logo_url;
ALTER TABLE producers DROP COLUMN IF EXISTS cover_image;
ALTER TABLE producers DROP COLUMN IF EXISTS gallery_images;
ALTER TABLE producers DROP COLUMN IF EXISTS blur_hashes;

-- Restaurer depuis backup si nécessaire
-- psql -h localhost -U postgres make_the_change < backup_pre_migration.sql

COMMIT;
```

#### **5.2 Conditions de Rollback**
- ❌ Plus de 10% d'images avec BlurHash invalide
- ❌ Erreur dans la logique de migration des arrays
- ❌ Performance dégradée de plus de 20%
- ❌ Frontend cassé par nouvelle structure

---

## 📈 **MÉTRIQUES DE SUCCÈS**

### **KPIs à Surveiller**

#### **Technique**
- ✅ **Migration time** : < 30 min execution
- ✅ **Data integrity** : 100% des images préservées
- ✅ **BlurHash validity** : > 95% de hashes valides
- ✅ **Performance** : Pas de dégradation > 5%

#### **Fonctionnel**
- ✅ **Frontend compatibility** : Tous les composants fonctionnent
- ✅ **Image loading** : BlurHash visible pendant loading
- ✅ **UX improvement** : Feedback utilisateurs positif

#### **Business**
- 📈 **User satisfaction** : +10% (sondage)
- 📈 **Time to interactive** : -15% (perçu)
- 📈 **Conversion rate** : Stable ou amélioré

---

## 🎯 **COMMANDES D'EXECUTION**

### **Déploiement Complet**
```bash
# 1. Préparation
./scripts/backup-db.sh

# 2. Migration DB
psql -h localhost -U postgres make_the_change < migrations/001_add_image_structure.sql

# 3. Génération BlurHash
npm run generate:blurhash

# 4. Tests
npm run test:migration

# 5. Validation
npm run validate:images

# 6. Déploiement
git add .
git commit -m "feat: Add image hierarchy and BlurHash support"
git push origin main
```

### **Monitoring Post-Déploiement**
```bash
# Vérifier les métriques
npm run monitor:performance

# Alertes automatiques
npm run check:image-integrity
```

---

## ⚠️ **POINTS D'ATTENTION**

### **Risques & Mitigations**
1. **Performance** : Générer BlurHash pour 100+ images peut être lent
   - ✅ **Mitigation** : Traitement par batch + progress bar

2. **URLs cassées** : Images Supabase peuvent changer
   - ✅ **Mitigation** : Validation des URLs avant génération

3. **Frontend breaking** : Nouveaux champs peuvent casser l'existant
   - ✅ **Mitigation** : Tests d'intégration + feature flags

4. **Stockage** : BlurHash strings peuvent prendre de la place
   - ✅ **Mitigation** : Compression + index optimisé

### **Plan B**
- 🔄 **Migration progressive** : D'abord 1 table, puis les autres
- 🔄 **Feature flags** : Pouvoir désactiver BlurHash si problème
- 🔄 **Fallback** : Images sans BlurHash utilisent gris classique

---

## 📅 **TIMELINE DÉTAILLÉE**

| Phase | Durée | Responsable | Livrable |
|-------|-------|-------------|----------|
| **Préparation** | 30min | Dev | Scripts + backup |
| **Migration DB** | 1h30 | Dev | Nouvelles colonnes |
| **Génération BlurHash** | 1h | Dev | Hash pour toutes images |
| **Tests** | 45min | Dev/QA | Validation complète |
| **Déploiement** | 15min | DevOps | Prod ready |
| **Monitoring** | 30min | Dev | KPIs semaine 1 |

**Total : 4h45 (réalisable en 1 journée)**

---

## 🎉 **RÉSULTAT ATTENDU**

Après cette migration, vous aurez :

### **✅ Améliorations Techniques**
- 🏗️ **Structure hiérarchique** : hero/logo/cover clairement définis
- 🎨 **BlurHash intégré** : Placeholders intelligents partout
- 📊 **Analytics ready** : Métriques d'engagement images
- 🔧 **Maintenable** : Code plus propre et logique

### **✅ Améliorations UX**
- ⚡ **Loading fluide** : Placeholders représentatifs
- 🎯 **Hiérarchie claire** : Image principale évidente
- 📱 **Mobile optimisé** : Meilleure expérience tactile
- 🌟 **Premium feel** : Détail qui fait la différence

### **✅ Bénéfices Business**
- 🏷️ **Différenciation** : ≠ plateformes e-commerce classiques
- 📈 **Conversion** : Meilleure perception de qualité
- 🔄 **Évolutivité** : Architecture prête pour le futur

---

## 🚀 **COMMANDES DE LANCEMENT**

```bash
# Ready to start?
echo "🚀 Starting Image Migration..."

# 1. Backup
./scripts/backup-db.sh

# 2. Migrate
psql -f migrations/001_add_image_structure.sql

# 3. Generate
npm run generate:blurhash

# 4. Test
npm run test:migration

# 5. Deploy
git push origin feature/image-migration

echo "🎉 Migration completed! Time for better UX! ✨"
```

---

**🎯 Ce plan vous donne une migration solide, testée et rollback-able pour moderniser complètement votre gestion d'images !**

**Prêt à commencer ? Quelle phase voulez-vous attaquer en premier ?** 🚀
