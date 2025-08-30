# Tech Stack - Make the CHANGE

**Stack technique moderne 2025 optimisé pour plateforme "Make the CHANGE" - architecture évolutive bootstrap vers scale avec budget minimal.**

## 🚀 Architecture Évolutive 3-Phases

### PHASE 1 - Bootstrap Stack (0€ capital)

#### Mobile App MVP (Expo Go)
```yaml
Framework: Expo SDK 53 + React Native (Expo Go)
Development: Expo Go (gratuit, sans build nécessaire)
Language: TypeScript 5.9+ (strict mode)
Navigation: Expo Router v4 (file-based routing)
UI Framework: NativeWind v4 + Tailwind CSS v4
State Management: TanStack Query v5 + AsyncStorage
Authentication: Supabase Auth (gratuit)
Maps: react-native-maps (Google Maps gratuit tier)
```

#### Web Dashboard Minimal (Vercel Free)
```yaml
Framework: Next.js 15.4 App Router + React Server Components
Hosting: Vercel Hobby (gratuit 100GB bandwidth)
Language: TypeScript 5.9+ (strict mode)
UI Framework: shadcn/ui v2 + Tailwind CSS v4
Forms: TanStack Form (simple)
Payment: Stripe Elements v3 + Stripe Subscriptions (dual billing)
Billing: Stripe Customer Portal + Subscription management
Analytics: Vercel Analytics (gratuit)
```

#### Backend Bootstrap (Gratuit)
```yaml
API Framework: tRPC v11.5.0 (type-safe)
Runtime: Vercel Edge Functions (gratuit 100GB)
Database: Supabase Free Tier (500MB PostgreSQL)
Authentication: Supabase Auth (gratuit)
Billing: Stripe Subscriptions (monthly) + Payment Intents (annual)
Customer Portal: Stripe Customer Portal integration
Webhooks: Stripe webhooks pour subscription lifecycle (route handler en Node runtime, pas Edge)
Storage: Supabase Storage (1GB gratuit)
Cache: Browser cache + PostgreSQL views
Email: Resend gratuit (100 emails/jour)
```

### PHASE 2 - Growth Stack (145€/mois)

#### Mobile App Production
```yaml
Build System: EAS Build (Expo)
Distribution: App Store + Google Play
Performance: React Native optimizations
Offline: TanStack Query offline support
Push: Expo Push Notifications
Analytics: Expo Analytics + Custom tracking
```

#### Web Platform Enhanced
```yaml
Hosting: Vercel Pro (20€/mois)
Performance: Edge Functions scaling
CDN: Vercel Edge Network worldwide
Monitoring: Advanced error tracking
SEO: Next.js 15.1 App Router optimizations
```

#### Backend Production
```yaml
Database: Supabase Pro (25€/mois)
Storage: Vercel Blob (50€/mois)
Functions: Scaling serverless (50€/mois)
Cache: PostgreSQL + Edge caching
Queue: Background jobs via Vercel cron
Monitoring: Uptime + performance alerts
```

### PHASE 3 - Scale Stack (500-2000€/mois)

#### Enterprise Infrastructure
```yaml
Multi-region deployment
Advanced caching layers
Microservices architecture
Auto-scaling infrastructure
Enterprise security & compliance
Advanced monitoring & alerting
```

#### Development Stack
```yaml
Package Manager: pnpm v9+ (fastest, required)
Node Version: 22 LTS (latest stable)
TypeScript: 5.9+ (strict mode)
Database: PostgreSQL 15 (local + production)
Monorepo: Turborepo v2 (optimisation builds)
```

## 🎯 Justification Choix Technique Web

### Next.js 15.1 vs TanStack Start
**DÉCISION FINALE : Next.js 15.1**

#### Pourquoi Next.js 15.1 ?
```yaml
✅ Maturité: Framework stable, production-ready
✅ Écosystème: Vaste communauté, packages, ressources
✅ Expertise équipe: Connaissance approfondie du framework
✅ Vercel Integration: Optimisation native déploiement gratuit
✅ App Router: Routing avancé avec Server Components
✅ Performance: Turbopack, optimisations intégrées
✅ Documentation: Complète et maintenue
```

#### Pourquoi pas TanStack Start ?
```yaml
❌ Beta Status: Encore en développement (v1.0 pas sortie)
❌ Écosystème limité: Communauté et resources moins établies  
❌ Courbe d'apprentissage: Framework moins connu équipe
❌ Risque: Changements breaking potentiels en beta
❌ Support: Moins de ressources d'aide disponibles
```

**Cette décision élimine tout risque technique et assure une base solide pour le projet.**

## 🔧 Outils de Développement

### Code Quality
```yaml
Linting: ESLint v9 + @typescript-eslint
Formatting: Prettier v3
Type Checking: TypeScript strict mode
Git Hooks: Husky v9 + lint-staged
Pre-commit: Lint + format + type check
```

### Testing Stack
```yaml
Unit Tests: Vitest v2 (ultra-fast)
Component Tests: React Testing Library
E2E Tests: Playwright v1.45 (web) + Maestro (mobile)
Coverage: c8 (intégré dans Vitest)
Mocking: MSW (Mock Service Worker)
```

### Build & Deploy
```yaml
Build Tool: Turbo v2 (monorepo optimization)
Mobile Build: EAS Build (Expo)
Web Hosting: Vercel Pro
Database: Supabase Pro (production)
CDN: Vercel Edge Network
CI/CD: GitHub Actions
```

## 📱 Mobile Stack Détaillé

### Configuration Expo
```typescript
// app.config.ts
export default {
  expo: {
    name: "Make the CHANGE",
    slug: "make-the-change",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#4ade80"
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.makethechange.app"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#4ade80"
      },
      package: "com.makethechange.app"
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    plugins: [
      "expo-router",
      "expo-font",
      "expo-maps"
    ]
  }
};
```

### NativeWind Configuration
```javascript
// tailwind.config.js (mobile)
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#059669',    // Make the CHANGE green
        secondary: '#D97706',  // Honey amber
        background: '#ffffff',
        surface: '#f8fafc',
        text: '#1e293b',
        muted: '#64748b',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui'],
      },
    },
  },
  plugins: [],
};
```

## 🌐 Web Stack Détaillé

### Vercel Edge Functions Configuration
```typescript
// vercel.json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "functions": {
    "app/api/**/*.ts": {
      "runtime": "edge"
    }
  },
  "rewrites": [
    {
      "source": "/api/trpc/:path*",
      "destination": "/api/trpc/:path*"
    }
  ]
}
```

### Pattern Doré: RSC + TanStack Query + revalidateTag
```tsx
// app/projects/page.tsx (Server Component - RSC)
import { HydrationBoundary, dehydrate, QueryClient } from '@tanstack/react-query'
import { ProjectsClient } from '@/components/projects-client'
import { cookies, headers } from 'next/headers'
import { appRouter } from '@/server/routers/app'
import { createTRPCContext } from '@/server/trpc'

export const revalidate = 60
export const dynamic = 'force-static'
export const fetchCache = 'force-cache'

export default async function ProjectsPage() {
  // Préchargement via tRPC côté serveur (type-safe, pas d'overfetch)
  const ctx = await createTRPCContext({ cookies: cookies(), headers: headers() })
  const caller = appRouter.createCaller(ctx)
  const initial = await caller.projects.list({ q: '' })

  // Option Hydration (si vous prévoyez d'utiliser Query côté client)
  const qc = new QueryClient()
  await qc.prefetchQuery({ queryKey: ['projects', { q: '' }], queryFn: () => initial })
  const state = dehydrate(qc)

  return (
    <HydrationBoundary state={state}>
      <ProjectsClient initialData={initial} />
    </HydrationBoundary>
  )
}

// components/projects-client.tsx (Client Component)
'use client'
import { useQuery } from '@tanstack/react-query'
import { trpc } from '@/lib/trpc'

export function ProjectsClient({ initialData }: { initialData: any[] }) {
  const { data } = useQuery({
    queryKey: ['projects', { q: '' }],
    queryFn: () => trpc.projects.list.query({ q: '' }),
    initialData,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  })
  return <ProjectsList projects={data ?? []} />
}

// app/projects/actions.ts (Server Action) – Invalidation serveur Next
'use server'
import { revalidateTag } from 'next/cache'
import { appRouter } from '@/server/routers/app'
import { createTRPCContext } from '@/server/trpc'

export async function createProjectAction(input: any) {
  const ctx = await createTRPCContext()
  const caller = appRouter.createCaller(ctx)
  await caller.admin.projects.create(input)
  revalidateTag('projects') // Taguez aussi vos fetch RSC avec { tags: ['projects'] }
}

// Côté client après mutation via tRPC + Query
// queryClient.invalidateQueries({ queryKey: ['projects'] }) // garde le cache client cohérent
```

### shadcn/ui Configuration
```typescript
// components.json
{
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/styles/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

## 🗄️ Base de Données

### PostgreSQL 15 Configuration
```sql
-- Extensions requises
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Configuration optimisée pour performances
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';
ALTER SYSTEM SET pg_stat_statements.track = 'all';
ALTER SYSTEM SET max_connections = 100;
ALTER SYSTEM SET shared_buffers = '256MB';
```

### Cache Strategy (PostgreSQL Native)
```sql
-- Materialized views pour cache performances
CREATE MATERIALIZED VIEW user_investment_summary AS
SELECT 
  user_id,
  COUNT(*) as total_investments,
  SUM(amount_eur) as total_invested,
  SUM(points_generated) as total_points
FROM investments 
WHERE status = 'active'
GROUP BY user_id;

-- Index pour performances
CREATE INDEX idx_user_investment_summary_user ON user_investment_summary(user_id);

-- Refresh automatique (via cron job)
REFRESH MATERIALIZED VIEW user_investment_summary;
```

## 🔗 Intégrations Externes

### APIs Tierces
```yaml
Stripe: v2023-10-16 (payments + KYC)
Google Maps: v3 (géolocalisation)
Supabase: Latest (auth + database)
Vercel Blob: Latest (file storage)
SendGrid: v3 (emails transactionnels)
```

### Partner APIs
```yaml
HABEEBEE: API REST custom (production tracking)
ILANGA NATURE: Webhook integration (impact tracking)
PROMIEL: API REST custom (production data)
```

## ⚡ Performance Targets

### Mobile Performance
```yaml
Cold Start: <2s
Hot Navigation: <500ms
API Calls: <1s for queries
Image Loading: <2s for products
Bundle Size: <10MB
```

### Web Performance
```yaml
First Contentful Paint: <1.5s
Largest Contentful Paint: <2.5s
Time to Interactive: <3s
Cumulative Layout Shift: <0.1
API Response P95: <200ms
```

### Database Performance
```yaml
Simple Queries: <50ms
Complex Queries: <200ms
Concurrent Users: 1000+
Connection Pool: 20 max
```

## 🚀 Deployment Stack

### Infrastructure Évolutive (3 Phases)
```yaml
PHASE 1 - Bootstrap (0-5K€ MRR):
  Frontend: Vercel Hobby (Gratuit)
  API: Vercel Edge Functions (Gratuit jusqu'à 100GB)
  Database: Supabase Free Tier (Gratuit jusqu'à 500MB)
  Storage: Vercel Blob Store (Gratuit jusqu'à 1GB)
  Monitoring: Vercel Analytics (Gratuit)
  Total: 0€/mois

PHASE 2 - Growth (5-50K€ MRR):
  Frontend: Vercel Pro (20€/mois)
  API: Vercel Edge Functions scaling (50€/mois)
  Database: Supabase Pro (25€/mois)
  Storage: Vercel Blob Store (50€/mois)
  Monitoring: Vercel Analytics Pro (inclus)
  Total: 145€/mois

PHASE 3 - Scale (50K€+ MRR):
  Infrastructure: Enterprise solutions
  Total: 500-2000€/mois selon scale
```

### CI/CD Pipeline
```yaml
Source Control: GitHub
CI/CD: GitHub Actions
Environments: Development, Staging, Production
Testing: Vitest + Playwright automatique
Security: Snyk + GitHub Advanced Security
Performance: Lighthouse CI budgets
```

## 📚 Ressources & Documentation

### Documentation Officielle
- [Expo SDK 53](https://docs.expo.dev/versions/v53.0.0/)
- [Vercel Edge Functions](https://nextjs.org/docs)
- [tRPC v11.5.0](https://trpc.io/docs/v11)
- [TanStack Query v5](https://tanstack.com/query/latest)
- [Supabase](https://supabase.com/docs)

### Communautés
- [Expo Discord](https://discord.gg/expo)
- [TanStack Discord](https://discord.com/invite/WrRKjPJ)
- [tRPC Discord](https://discord.gg/KATT)

---

*Stack technique évolutif : démarre gratuit (0€ Phase 1), scale selon revenus (145€ Phase 2), architecture enterprise (500-2000€ Phase 3)*
