# Types TypeScript avec Supabase (2025)

## 🎯 Approche Moderne Recommandée

Ce projet utilise la **génération automatique de types** depuis Supabase, qui est la **meilleure pratique en 2025**.

## ✅ Avantages

- **Synchronisation automatique** avec le schéma de base de données
- **Aucune maintenance manuelle** des types
- **Type safety complet** entre DB et application
- **Zéro décalage** entre les migrations et les types

## 🔄 Utilisation

### Génération des types

```bash
# Génération manuelle
npm run types:generate

# Ou directement via Supabase CLI
supabase gen types typescript --project-id ebmjxinsyyjwshnynwwu > packages/api/src/types/supabase.ts
```

### Dans le code

```typescript
import type { ProductWithRelations } from '@make-the-change/api/types';

// Les types sont automatiquement synchronisés avec votre DB
const products: ProductWithRelations[] = await getProducts();
```

## 🚀 Workflow Recommandé

1. **Migrations DB** → Supabase Dashboard ou CLI
2. **Génération types** → `npm run types:generate`
3. **Développement** → Types à jour automatiquement

## 🔧 Configuration

- **Types générés** : `packages/api/src/types/supabase.ts`
- **Types métier** : `packages/api/src/types/database.ts`
- **Script** : `scripts/generate-types.sh`

## 📚 Alternatives 2025

### 1. Supabase Generated Types ⭐️ (Choisi)
- **Pros** : Automatique, maintenu, robuste
- **Cons** : Nécessite Supabase CLI

### 2. Drizzle ORM
- **Pros** : Type-safe queries, migrations
- **Cons** : Plus complexe, changement d'architecture

### 3. Prisma
- **Pros** : Excellent écosystème
- **Cons** : Layer supplémentaire, moins de flexibilité

### 4. Types manuels
- **Pros** : Contrôle total
- **Cons** : Maintenance manuelle, erreurs possibles

## ⚡ Performance

Les types générés n'impactent pas les performances runtime car ils sont **compile-time only**.

## 🔄 CI/CD

Pour automatiser en CI/CD :

```yaml
- name: Generate Supabase Types
  run: |
    npm install -g supabase
    supabase gen types typescript --project-id ${{ secrets.SUPABASE_PROJECT_ID }} > packages/api/src/types/supabase.ts
```
