# Technical Architecture - Make the CHANGE

**Stack technique moderne 2025 pour plateforme "Marketplace Premium Bootstrap" écologique scalable et évolutive 3-phases.**

## 🚀 Stack Technique Final (2025)

### Mobile Application (Expo SDK 53)
```typescript
MOBILE STACK DÉCISIF:
Framework: Expo SDK 53 + React Native
Language: TypeScript 5.9+ (strict mode)
Server State: TanStack Query v5 (data fetching & offline caching)
Navigation: Expo Router v4 (file-based routing)
UI Framework: NativeWind v4 + Tailwind CSS v4
Local Storage: AsyncStorage (cache + persistence)
Maps: react-native-maps + Google Maps API
Auth: Supabase Auth v5 (universal authentication)

JUSTIFICATION DES CHOIX:
✅ TanStack Query v5: Server state + cache automatique optimal
✅ NativeWind v4: Utilise Tailwind CSS natif (performance)
✅ Expo Router v4: Navigation moderne file-based
✅ AsyncStorage: Cache local simple et performant
```

### Web Dashboard & E-commerce (Next.js 15.1 + Vercel)
```typescript
WEB STACK DÉCISIF:
Framework: Next.js 15.1 + React Server Components
Hosting: Vercel (Edge + Node runtimes)
Language: TypeScript 5.9+ (strict mode)
Server State: TanStack Query v5 (cohérence stack mobile)
UI Framework: shadcn/ui v2 + Tailwind CSS v4
Forms: React Hook Form (simple et performant)
Charts: recharts (pour analytics)
Tables: @tanstack/react-table v8
Payment: Stripe Elements v3 + Stripe Subscriptions (dual billing)
Billing Portal: Stripe Customer Portal (subscription management)
Analytics: Vercel Analytics + Google Analytics 4

AVANTAGES NEXT.JS 15.5:
✅ App Router mature avec Server Components
✅ API Routes intégrées avec type safety
✅ Cohérence écosystème TanStack Query côté client
✅ SSR + ISR + streaming intégré natif
✅ Performance optimisée avec Turbopack
✅ Déploiement Vercel optimisé et gratuit Phase 1
```

### Backend & Infrastructure
```typescript
BACKEND STACK MVP:
Runtime: Vercel Edge (tRPC) + Node (webhooks Stripe) + TypeScript 5.9+
API Framework: tRPC v11.5.0 (type-safe end-to-end)
Database: Supabase Free Tier (PostgreSQL 15 + native cache)
Cache: PostgreSQL materialized views (pas de Redis externe)
Auth: Supabase Auth (intégré)
Billing: Stripe Subscriptions + Payment Intents (dual model)
Customer Portal: Stripe Billing Portal integration
Queue: Traitement synchrone (pas de BullMQ)
File Storage: Vercel Blob Store (1GB gratuit)
Monitoring: Vercel Analytics gratuit

 JUSTIFICATION MVP + DUAL BILLING:
✅ tRPC v11: Type safety end-to-end + optimisation automatique
✅ Supabase Free: PostgreSQL géré + auth intégré
✅ Vercel (Edge + Node): Serverless + coût zéro
✅ Stripe Subscriptions: Monthly recurring payments native
✅ Stripe Payment Intents: Annual one-time payments
✅ Customer Portal: Self-service billing management
✅ PostgreSQL natif: Cache via materialized views + dual billing tracking
 ⚠️ Stripe Webhooks: utiliser un route handler en Node runtime (pas Edge) pour la vérification de signature Stripe
```

## 🏗️ Architecture Système

### High-Level Architecture Hybride
```mermaid
graph TD
    A[Mobile App - Expo] --> B[API Gateway - tRPC]
    C[Dashboard - Next.js (Vercel)] --> B
    D[E-commerce - Next.js (Vercel)] --> B
    E[Partner App - React Native] --> B
    B --> F[Backend Services Hybrides]
    F --> G[PostgreSQL 15 + Native Cache]
    F --> H[Micro-Hub Fulfillment]
    H --> I[Stock Management - 2-3 SKUs]
    H --> J[Shipping Integration]
    F --> K[External APIs]
    K --> L[Maps API]
    K --> M[Stripe API]
    K --> N[Partner APIs HABEEBEE/ILANGA]
    K --> O[Dropshipping APIs]
    F --> P[Background Jobs - Hybrid Processing]
    F --> Q[File Storage - Vercel Blob Store]
```

### Core Services Architecture
```typescript
// Services à implémenter (évolutifs par phases)
interface CoreServices {
  auth: AuthService;           // Supabase Auth v5 integration
  userLevel: UserLevelService; // Gestion des niveaux (Explorateur, Protecteur, Ambassadeur)
  investment: InvestmentService; // Gestion des investissements unitaires (ruches, oliviers)
  subscription: SubscriptionService; // Gestion abonnements Ambassadeur
  partners: PartnerService;    // Gestion partenaires + commissions + app native
  points: PointsService;       // Système de points + expiry
  inventory: InventoryService; // NOUVEAU: Gestion micro-stock héros (2-3 SKUs)
  fulfillment: FulfillmentService; // NOUVEAU: Fulfillment hybride (stock MTC + dropship)
  ecommerce: ECommerceService; // Catalogue hybride + commandes stock+dropship
  notification: NotificationService; // Push + email + SMS (Phase 2)
  geolocation: GeoService;     // Cartes + localisation (Phase 2+)
  analytics: AnalyticsService; // Métriques business + KPIs hybrides
  payment: PaymentService;     // Stripe pour investissements et abonnements
}

// NOUVEAUX SERVICES HYBRIDES - Phase 1

interface InventoryService {
  // Gestion micro-stock héros (2-3 SKUs)
  getStockLevels(): Promise<StockLevel[]>;
  updateStock(productId: string, quantity: number): Promise<void>;
  checkReorderThresholds(): Promise<ReorderAlert[]>;
  calculateRotationMetrics(): Promise<RotationMetrics>;
  generateStockReport(): Promise<StockReport>;
}

interface FulfillmentService {
  // Fulfillment hybride : stock MTC + dropshipping
  processOrder(order: Order): Promise<FulfillmentRoute>;
  routeToMicroHub(orderItems: OrderItem[]): Promise<ShippingLabel>;
  routeToPartner(orderItems: OrderItem[], partnerId: string): Promise<PartnerShipment>;
  trackHybridDelivery(orderId: string): Promise<TrackingInfo>;
  calculateShippingCosts(items: OrderItem[], destination: Address): Promise<ShippingCost>;
}

interface PartnerAppService {
  // App native partenaires - gestion updates projets
  authenticatePartner(credentials: PartnerCredentials): Promise<PartnerSession>;
  createProjectUpdate(update: ProjectUpdateInput): Promise<ProjectUpdate>;
  uploadMedia(files: File[], projectId: string): Promise<MediaUpload[]>;
  moderateUpdate(updateId: string, status: 'approved' | 'rejected'): Promise<void>;
  getPartnerProjects(partnerId: string): Promise<Project[]>;
  updateProjectStatus(projectId: string, status: ProjectStatus): Promise<void>;
}
```

## 🗄️ Database Schema (PostgreSQL 15)

Le schéma de la base de données a été déplacé vers un document dédié pour plus de clarté. Voir [Database Schema](./database-schema.md) pour la version la plus à jour.

## 🔧 Development Tools & Environment

### Development Stack (Latest 2025)
```bash
# Environment Requirements
Package Manager: pnpm v9+ (fastest, required)
Node Version: 22 LTS (latest stable)
TypeScript: 5.7+ (latest features)
Database: PostgreSQL 15 (local + production)

# Code Quality Tools
Linting: ESLint v9 + Prettier v3 + Husky v9
Testing: Vitest v2 (ultra fast) + React Testing Library
E2E Testing: Playwright v1.45 (web) + Maestro (mobile)
Build Tool: Turbo v2 (monorepo optimization)

# Monitoring & Analytics
Error Tracking: Vercel Analytics
Performance: Vercel Analytics v2
Database: PostgreSQL built-in monitoring
Uptime: Custom health checks
```

### Monorepo Structure (Turborepo v2)
```typescript
// Project structure optimisée hybride
/
├── apps/
│   ├── mobile/          # Expo React Native app (utilisateurs finaux)
│   │   ├── src/
│   │   │   ├── app/     # Expo Router v4
│   │   │   ├── components/
│   │   │   ├── hooks/   # TanStack Query hooks
│   │   │   ├── services/
│   │   │   └── utils/
│   │   ├── app.config.ts
│   │   └── package.json
│   │
│   ├── partner-app/     # NOUVEAU: Expo React Native app (partenaires)
│   │   ├── src/
│   │   │   ├── app/     # Expo Router v4 (login, projects, updates)
│   │   │   ├── components/
│   │   │   ├── hooks/   # Partner-specific hooks
│   │   │   ├── services/ # Media upload, offline sync
│   │   │   └── utils/
│   │   ├── app.config.ts
│   │   └── package.json
│   │
│   ├── web/             # Next.js 15.1 (App Router) dashboard + e-commerce
│   │   ├── src/
│   │   │   ├── app/     # Next.js App Router
│   │   │   ├── components/
│   │   │   ├── hooks/   # TanStack Query hooks
│   │   │   ├── lib/
│   │   │   └── server/  # Server functions + hybrid fulfillment
│   │   ├── app.config.ts
│   │   └── package.json
│   │
│   └── api/             # tRPC backend hybride
│       ├── src/
│       │   ├── routes/  # tRPC routers + partner app + inventory
│       │   ├── services/ # Hybrid fulfillment + stock management
│       │   ├── utils/
│       │   └── db/      # Database utils / SQL migrations (Supabase)
│       └── package.json
│
├── packages/
│   ├── shared/          # Shared utilities & types
│   ├── ui/              # Shared UI components  
│   ├── database/        # Supabase SQL migrations
│   └── config/          # Shared config (ESLint, TS, etc.)
│
├── tools/               # Build tools & scripts
├── docs/                # Documentation
└── package.json         # Root package.json
```

## 📱 Mobile Architecture (NativeWind + TanStack Query)

### Expo App Structure
```typescript
// apps/mobile/src/ structure optimisée
src/
├── app/                 # Expo Router v4 (file-based)
│   ├── (tabs)/         # Bottom navigation  
│   │   ├── index.tsx   # Dashboard/Home
│   │   ├── projects.tsx # Project discovery
│   │   ├── portfolio.tsx # User investments
│   │   └── shop.tsx    # E-commerce
│   ├── auth/           # Authentication flows
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── onboarding.tsx
│   ├── investment/     # Investment screens
│   │   ├── [id].tsx    # Project detail
│   │   └── confirm.tsx # Investment confirmation
│   └── profile/        # User management
│       ├── index.tsx
│       ├── settings.tsx
│       └── points.tsx
│
├── components/         # Reusable UI (NativeWind styled)
│   ├── ui/            # Base components
│   ├── forms/         # Form components
│   ├── maps/          # Map components
│   └── charts/        # Analytics components
│
├── hooks/             # TanStack Query hooks
│   ├── useInvestments.ts
│   ├── usePoints.ts
│   ├── useProducts.ts
│   ├── useProjects.ts
│   └── useAuth.ts
│
├── services/          # tRPC client integration
│   ├── api.ts         # tRPC client setup
│   ├── auth.ts        # Auth service
│   └── storage.ts     # AsyncStorage utilities
│
├── utils/             # Business logic & helpers
│   ├── calculations.ts # Investment calculations
│   ├── formatters.ts  # Data formatting
│   └── constants.ts   # App constants
│
├── storage/           # AsyncStorage utilities
│   ├── cache.ts       # Query cache persistence
│   └── preferences.ts # User preferences
│
├── styles/            # NativeWind + Tailwind config
│   └── tailwind.config.js
│
└── types/             # TypeScript definitions
    ├── api.ts         # API types
    ├── navigation.ts  # Navigation types
    └── user.ts        # User types

// Exemple TanStack Query hook optimisé
export function useInvestments() {
  return useQuery({
    queryKey: ['investments'],
    queryFn: () => trpc.investments.list.query(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
}
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
        primary: '#4ade80',    // Make the CHANGE green
        secondary: '#fbbf24',  // Honey yellow
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

## 🌐 Web Architecture (Next.js 15.1 + shadcn/ui)

### Next.js 15.1 App Structure  
```typescript
// apps/web/src/ structure optimisée
src/
├── app/                # Next.js 15.1 App Router
│   ├── (auth)/        # Auth group
│   │   ├── login/
│   │   ├── register/
│   │   └── layout.tsx
│   ├── dashboard/     # User dashboard
│   │   ├── page.tsx   # Overview
│   │   ├── investments/
│   │   ├── portfolio/
│   │   └── analytics/
│   ├── shop/          # E-commerce
│   │   ├── page.tsx   # Product catalog
│   │   ├── category/[slug]/
│   │   ├── product/[id]/
│   │   └── cart/
│   ├── admin/         # Admin panel
│   │   ├── projects/
│   │   ├── users/
│   │   ├── orders/
│   │   └── analytics/
│   ├── api/           # tRPC API routes
│   │   └── trpc/
│   │       └── [trpc]/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/        # shadcn/ui + custom components
│   ├── ui/           # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── [autres shadcn components]
│   ├── forms/        # Form components
│   │   ├── investment-form.tsx
│   │   ├── profile-form.tsx
│   │   └── checkout-form.tsx
│   ├── charts/       # Analytics charts (recharts)
│   │   ├── investment-chart.tsx
│   │   ├── points-chart.tsx
│   │   └── performance-chart.tsx
│   ├── maps/         # Map components
│   │   └── project-map.tsx
│   └── layout/       # Layout components
│       ├── header.tsx
│       ├── sidebar.tsx
│       └── footer.tsx
│
├── hooks/            # TanStack Query + custom hooks
│   ├── use-investments.ts
│   ├── use-points.ts
│   ├── use-products.ts
│   └── use-analytics.ts
│
├── lib/              # Utilities & tRPC setup
│   ├── trpc.ts       # tRPC client
│   ├── auth.ts       # Supabase Auth config
│   ├── db.ts         # Database connection
│   ├── utils.ts      # Utility functions
│   └── validations.ts # Zod schemas
│
├── styles/           # Tailwind CSS + globals
│   └── globals.css
│
└── types/            # TypeScript definitions
    ├── api.ts
    ├── auth.ts
    └── database.ts
```

## 🔗 API Architecture (tRPC v11)

### tRPC Router Structure
```typescript
// apps/api/src/routes/ structure
export const appRouter = router({
  // Authentication & User Management
  auth: router({
    register: publicProcedure.input(registerSchema).mutation(registerUser),
    login: publicProcedure.input(loginSchema).mutation(loginUser),
    logout: protectedProcedure.mutation(logoutUser),
    profile: protectedProcedure.query(getProfile),
    updateProfile: protectedProcedure.input(updateProfileSchema).mutation(updateProfile),
    deleteAccount: protectedProcedure.mutation(deleteAccount),
  }),

  // Projects & Investments  
  projects: router({
    list: publicProcedure.input(projectFiltersSchema).query(getProjects),
    byId: publicProcedure.input(z.string().uuid()).query(getProject),
    nearby: publicProcedure.input(locationSchema).query(getNearbyProjects),
    invest: protectedProcedure.input(investmentSchema).mutation(createInvestment),
    myInvestments: protectedProcedure.query(getUserInvestments),
    analytics: protectedProcedure.input(analyticsFiltersSchema).query(getInvestmentAnalytics),
  }),

  // Points System
  points: router({
    balance: protectedProcedure.query(getPointsBalance),
    history: protectedProcedure.input(paginationSchema).query(getPointsHistory),
    projection: protectedProcedure.query(getPointsProjection), // Future earnings
    expiring: protectedProcedure.query(getExpiringPoints), // Points expiring soon
  }),

  // E-commerce
  products: router({
    list: publicProcedure.input(productFiltersSchema).query(getProducts),
    byId: publicProcedure.input(z.string().uuid()).query(getProduct),
    categories: publicProcedure.query(getCategories),
    search: publicProcedure.input(searchSchema).query(searchProducts),
    recommendations: protectedProcedure.query(getRecommendedProducts),
  }),

  orders: router({
    create: protectedProcedure.input(createOrderSchema).mutation(createOrder),
    list: protectedProcedure.input(paginationSchema).query(getUserOrders),
    byId: protectedProcedure.input(z.string().uuid()).query(getOrder),
    cancel: protectedProcedure.input(z.string().uuid()).mutation(cancelOrder),
  }),

  // Analytics & Reporting
  analytics: router({
    dashboard: protectedProcedure.query(getDashboardAnalytics),
    investments: protectedProcedure.input(analyticsFiltersSchema).query(getInvestmentAnalytics),
    points: protectedProcedure.input(analyticsFiltersSchema).query(getPointsAnalytics),
    impact: protectedProcedure.query(getImpactMetrics),
  }),

  // Admin routes (role-protected)
  admin: router({
    users: adminProcedure.input(paginationSchema).query(getUsers),
    projects: adminProcedure.input(paginationSchema).query(getAllProjects),
    orders: adminProcedure.input(paginationSchema).query(getAllOrders),
    analytics: adminProcedure.query(getAdminAnalytics),
    settings: adminProcedure.query(getSettings),
  }),
});

export type AppRouter = typeof appRouter;
```

## 🔗 **API DESIGN COMPLET**

### **Design Principles tRPC**
```yaml
TYPE SAFETY:
- Types partagés automatiquement client/serveur
- Auto-completion IntelliSense complet IDE
- Runtime validation Zod schemas
- Zero API documentation drift

ERROR HANDLING:
- Erreurs typées avec codes standardisés
- Messages d'erreur localisés
- Retry logic automatique TanStack Query
- Fallback graceful sur échecs réseau

CACHING STRATEGY:
- Intégration TanStack Query native
- Invalidation sélective queries
- Optimistic updates mutations
- Background refetch intelligent
```

### **Router Auth - Authentification Complète**
```typescript
export const authRouter = router({
  // Inscription utilisateur
  register: publicProcedure
    .input(z.object({
      email: z.string().email("Email invalide"),
      password: z.string().min(8, "Minimum 8 caractères"),
      firstName: z.string().min(2, "Prénom requis"),
      lastName: z.string().min(2, "Nom requis"),
      acceptTerms: z.boolean().refine(val => val === true, {
        message: "Acceptation CGU obligatoire"
      })
    }))
    .output(z.object({
      user: UserSchema,
      session: SessionSchema,
      message: z.string()
    }))
    .mutation(async ({ input, ctx }) => {
      // Hash password, create user, send welcome email
      return registerUserService(input);
    }),

  // Connexion utilisateur  
  login: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string().min(1, "Mot de passe requis")
    }))
    .mutation(async ({ input }) => {
      return loginUserService(input);
    }),

  // Vérification email
  verifyEmail: publicProcedure
    .input(z.object({
      token: z.string().uuid()
    }))
    .mutation(async ({ input }) => {
      return verifyEmailService(input.token);
    }),

  // Reset password
  resetPassword: publicProcedure
    .input(z.object({
      email: z.string().email()
    }))
    .mutation(async ({ input }) => {
      return resetPasswordService(input.email);
    })
});
```

### **Router Investments - Core Business Logic**
```typescript
export const investmentsRouter = router({
  // Créer investissement
  create: protectedProcedure
    .input(z.object({
      projectId: z.string().uuid(),
      investmentType: z.string(), // 'ruche', 'olivier', etc.
      amount: z.number().int(), // 50, 80, 130, etc.
      paymentMethodId: z.string() // Stripe payment method
    }))
    .mutation(async ({ input, ctx }) => {
      // Validate project availability, process payment, create investment, generate points
      return createInvestmentService(input, ctx.user);
    }),

  // Liste investissements utilisateur
  myInvestments: protectedProcedure
    .input(z.object({
      status: z.enum(['active', 'completed', 'cancelled']).optional(),
      page: z.number().int().min(1).default(1),
      limit: z.number().int().min(1).max(50).default(20)
    }))
    .query(async ({ input, ctx }) => {
      return getUserInvestmentsService(ctx.user.id, input);
    }),

  // Détail investissement
  byId: protectedProcedure
    .input(z.string().uuid())
    .query(async ({ input, ctx }) => {
      return getInvestmentDetailsService(input, ctx.user.id);
    }),

  // Analytics investissement
  analytics: protectedProcedure
    .input(z.object({
      timeRange: z.enum(['7d', '30d', '90d', '1y']).default('30d'),
      metrics: z.array(z.enum(['roi', 'points', 'impact'])).default(['roi', 'points'])
    }))
    .query(async ({ input, ctx }) => {
      return getInvestmentAnalyticsService(ctx.user.id, input);
    })
});
```

### **Error Handling Standards**
```typescript
// Custom Error Types
export class BusinessError extends TRPCError {
  constructor(code: 'INSUFFICIENT_FUNDS' | 'PROJECT_FULL' | 'KYC_REQUIRED', message: string) {
    super({ code: 'BAD_REQUEST', message, cause: code });
  }
}

// Error Mappings
const errorMap: Record<string, string> = {
  'INSUFFICIENT_FUNDS': 'Fonds insuffisants pour cet investissement',
  'PROJECT_FULL': 'Ce projet a atteint son objectif de financement',
  'KYC_REQUIRED': 'Vérification d\'identité requise pour ce montant',
  'PAYMENT_FAILED': 'Le paiement a échoué, veuillez réessayer'
};

// Usage in procedures
.mutation(async ({ input, ctx }) => {
  try {
    return await businessLogic(input);
  } catch (error) {
    if (error instanceof BusinessError) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: errorMap[error.cause] || error.message
      });
    }
    throw error;
  }
})
```

## ⚡ **STRATÉGIE PERFORMANCE COMPLÈTE**

### **Cibles Performance Production**
```yaml
MOBILE APP (EXPO):
- Cold Start: <2s (P95) - Premier lancement
- Hot Navigation: <500ms (P95) - Navigation entre écrans  
- API Calls: <1s (P95) - Appels tRPC avec cache
- Bundle Size: <10MB - Optimisation assets
- Memory Usage: <200MB - Gestion mémoire native

WEB DASHBOARD:
- First Contentful Paint: <1.5s - Contenu visible
- Largest Contentful Paint: <2.5s - Element principal  
- Time to Interactive: <3s - Application utilisable
- Cumulative Layout Shift: <0.1 - Stabilité visuelle
- First Input Delay: <100ms - Réactivité interactions

API BACKEND (tRPC):
- Response Time P95: <200ms - 95% des requêtes
- Response Time P99: <500ms - 99% des requêtes
- Throughput: 1000+ RPS - Requêtes par seconde
- Error Rate: <0.1% - Disponibilité élevée
- Uptime: >99.9% - SLA production

DATABASE (POSTGRESQL):
- Query Time P95: <50ms - Requêtes simples
- Complex Queries: <200ms - Requêtes analytics
- Connection Pool: 20 max - Optimisation ressources
- Cache Hit Rate: >90% - Materialized views
```

### **Optimisations Frontend**

#### **Mobile (React Native + Expo)**
```typescript
PERFORMANCE MOBILE:
- Bundle Splitting: Metro bundle split par route
- Code Splitting: Dynamic imports screens non-critiques
- Image Optimization: WebP + lazy loading + caching
- Memory Management: useCallback/useMemo stratégiques
- Native Optimizations: Hermes engine, fast refresh

CACHING MOBILE:
- AsyncStorage: Cache TanStack Query persistant
- Image Caching: expo-image avec cache automatique
- API Caching: 5min stale time, 10min cache time
- Offline Support: Cache fallback connexion limitée

BUNDLE OPTIMIZATION:
// expo.json optimizations
{
  "expo": {
    "optimization": {
      "treeShaking": true,
      "minify": true
    },
    "plugins": [
      ["expo-font", { "fonts": ["Inter.ttf"] }],
      "expo-router"
    ]
  }
}
```

#### **Web (Next.js + React)**
```typescript
PERFORMANCE WEB:
- SSR/SSG: Pages statiques pré-générées
- Code Splitting: Dynamic imports + React.lazy
- Image Optimization: Vercel Image avec next/image
- CSS Optimization: Tailwind purge + critical CSS
- Edge Caching: Vercel Edge Network global

CACHING WEB:
// TanStack Query optimizations
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5min fresh
      cacheTime: 30 * 60 * 1000,     // 30min cache
      retry: 2,
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always'
    }
  }
});

VERCEL OPTIMIZATIONS:
// vercel.json
{
  "functions": {
    "app/api/**/*.ts": {
      "runtime": "edge"
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

#### **Intégration tRPC avec Next.js: createCaller (RSC) vs HTTP**
```ts
// RSC (Server Component) – Data fetching côté serveur avec tRPC sans HTTP
import { cookies, headers } from 'next/headers'
import { appRouter } from '@/server/routers/app'
import { createTRPCContext } from '@/server/trpc'

export async function loadProjectsServer() {
  const ctx = await createTRPCContext({ cookies: cookies(), headers: headers() })
  const caller = appRouter.createCaller(ctx)
  return caller.projects.list({ q: '' })
}

// HTTP (client/browser) – via @trpc/react-query + TanStack Query
// Avantages: cache client, invalidations, optimistic updates, offline
// Utiliser pour l'interactif post-hydratation.

// Mutation pattern – côté client
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { trpc } from '@/lib/trpc'

export function useCreateProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: any) => trpc.admin.projects.create.mutate(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

// Invalidation côté serveur (si pages RSC taguées)
// Dans une Server Action après mutation, appelez revalidateTag('projects').
```

### **Optimisations Backend**

#### **Database Performance (PostgreSQL)**
```sql
-- Indexes critiques performance
CREATE INDEX CONCURRENTLY idx_investments_user_status 
ON investments(user_id, status) 
WHERE status = 'active';

CREATE INDEX CONCURRENTLY idx_points_user_expires 
ON points_transactions(user_id, expires_at) 
WHERE expires_at > NOW();

CREATE INDEX CONCURRENTLY idx_projects_location_status 
ON projects USING GIST(location) 
WHERE status = 'active';

-- Materialized Views pour analytics
CREATE MATERIALIZED VIEW user_stats AS
SELECT 
  user_id,
  SUM(amount_eur) as total_invested,
  SUM(points_generated) as total_points,
  COUNT(*) as investment_count,
  MAX(created_at) as last_investment
FROM investments 
WHERE status = 'active'
GROUP BY user_id;

-- Refresh automatique (via cron job)
REFRESH MATERIALIZED VIEW CONCURRENTLY user_stats;
```

#### **tRPC Optimizations (Edge-safe avec Supabase)**
```typescript
// Client Supabase (HTTP, compatible Edge). En pratique, créez le client
// dans le contexte tRPC avec le token utilisateur pour profiter des RLS.
import { createClient } from '@supabase/supabase-js'

export function createSupabaseForUser(accessToken?: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { persistSession: false },
      global: { headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {} }
    }
  );
}

// Requête optimisée (colonnes nécessaires, tri, limite)
export async function getUserInvestmentsOptimized(db: ReturnType<typeof createSupabaseForUser>, userId: string) {
  const { data, error } = await db
    .from('investments')
    .select(`
      id, project_id, amount_eur, points_generated, created_at,
      project:projects(name, location),
      producer:producers(name)
    `)
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) throw error;
  return data;
}

// Côté Next.js (pages publiques), utilisez le cache RSC (`fetch` + revalidate/tags).
// Côté client, utilisez TanStack Query et l'hydratation pour éviter les double-fetchs.
```

### **Monitoring & Alerting**
```yaml
VERCEL ANALYTICS:
- Core Web Vitals: Tracking automatique
- Real User Monitoring: Performance réelle users
- Error Tracking: Errors + stack traces
- Geographic Performance: Latence par région

DATABASE MONITORING:
- Query Performance: Slow queries identification
- Connection Pool: Usage et saturation
- Index Usage: Effectiveness des indexes
- Lock Contention: Blocages et deadlocks

ALERTS CONFIGURATION:
- P95 Response Time > 500ms: Alert équipe dev
- Error Rate > 1%: Escalation immédiate  
- Database Connections > 80%: Scale alert
- Memory Usage > 80%: Resource alert
```

## ⚡ Performance & Optimization

### TanStack Query Configuration
```typescript
// Optimisation cache global (mobile + web)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,    // 5 minutes
      cacheTime: 10 * 60 * 1000,   // 10 minutes
      retry: 2,
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
    },
    mutations: {
      retry: 1,
    },
  },
});
```

---

## 🔒 DÉCISIONS TECHNIQUES & SÉCURITÉ FINALISÉES

### 🛡️ **Gestion des Secrets & Variables d'Environnement**

#### Configuration Sécurisée Vercel
- **Plateforme** : Variables d'environnement natives Vercel
- **Environnements** : Development, Preview, Production isolés
- **Rotation** : Secrets sensibles rotés trimestriellement
- **Accès** : Restricted team access avec audit logs

**Rationale** : C'est la solution native, sécurisée et la plus simple à mettre en œuvre pour notre hébergeur. L'utilisation d'un service tiers n'est pas nécessaire pour le MVP.

#### Variables d'Environnement Structure
```typescript
// .env structure sécurisée
DATABASE_URL=postgresql://...
STRIPE_SECRET_KEY=sk_...
STRIPE_PUBLISHABLE_KEY=pk_...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=...
GOOGLE_MAPS_API_KEY=...
SENDGRID_API_KEY=...
WEBHOOK_SECRET=...
```

### 🗄️ **Stratégie de Sauvegarde Base de Données**

#### Point-in-Time Recovery (PITR) Supabase
- **Service** : Fonctionnalités PITR intégrées Supabase
- **Rétention** : 7 jours de backups automatiques
- **Fréquence** : Continuous backup (toutes les 2 minutes)
- **Recovery** : Point-in-time restore à la seconde près
- **Testing** : Recovery tests mensuels automatisés

**Rationale** : On s'appuie sur une solution managée, robuste et éprouvée, ce qui est la meilleure pratique pour assurer l'intégrité des données sans réinventer la roue.

#### Backup Strategy Complémentaire
```yaml
Backup Schedule:
  - Daily: Full database dump (retained 30 days)
  - Weekly: Complete system backup (retained 12 weeks)  
  - Monthly: Long-term archive (retained 12 months)
  
Monitoring:
  - Backup success/failure alerts
  - Storage usage monitoring
  - Recovery time objective (RTO): <1 hour
  - Recovery point objective (RPO): <5 minutes
```

### 🆔 **KYC (Know Your Customer) Implementation**

#### Stripe Identity Integration
- **Service Provider** : Stripe Identity (cohérent avec écosystème paiement)
- **Intégration** : SDK Stripe Identity + webhook processing
- **Storage** : Metadata stocké, documents chez Stripe (compliance)

#### KYC Levels & Thresholds
```typescript
// KYC implementation structure
interface KYCLevels {
  BASIC: {
    threshold: 0;           // €0-99
    verification: 'email'; // Email verification only
    limits: {
      investment: 100;      // €100 max
      withdrawal: 50;       // €50 max
    };
  };
  
  LIGHT: {
    threshold: 100;         // €100-999
    verification: {
      identity: true;       // Name, address verification
      documents: false;     // No ID documents required
    };
    limits: {
      investment: 1000;     // €1000 max
      withdrawal: 500;      // €500 max
    };
  };
  
  COMPLETE: {
    threshold: 1000;        // €1000+
    verification: {
      identity: true;       // Full identity verification
      documents: true;      // Official ID (passport, national ID)
      address: true;        // Proof of address
    };
    limits: {
      investment: 'unlimited';
      withdrawal: 'unlimited';
    };
  };
}
```

#### KYC Process Flow
```typescript
// KYC verification workflow
const kycWorkflow = {
  trigger: 'investment_amount_threshold',
  steps: [
    {
      level: 'LIGHT',
      verification: ['name', 'address', 'date_of_birth'],
      duration: '< 5 minutes',
      automation: 'full'
    },
    {
      level: 'COMPLETE', 
      verification: ['identity_document', 'selfie', 'address_proof'],
      duration: '< 24 hours',
      automation: 'ai_assisted_human_review'
    }
  ],
  compliance: ['EU_AMLD5', 'PSD2', 'GDPR'],
  data_retention: '5_years_post_relationship'
};
```

**Rationale** : Utiliser Stripe Identity est cohérent avec l'écosystème de paiement déjà en place, ce qui simplifie l'intégration et la maintenance.

### ♿ **Accessibilité & Conformité WCAG**

#### WCAG 2.1 Level AA Implementation
- **Standard** : Web Content Accessibility Guidelines 2.1, Level AA
- **Scope** : Application mobile ET dashboard web
- **Testing** : Automated testing + manual audits
- **Tools** : axe-core, Lighthouse, screen readers testing

**Rationale** : L'accessibilité n'est pas une option. En prendre la décision dès le début assure que le produit sera utilisable par le plus grand nombre et que les bonnes pratiques seront intégrées au fil du développement.

#### Accessibility Implementation Strategy
```typescript
// Accessibility requirements per platform
const accessibilityRequirements = {
  mobile: {
    screenReader: ['VoiceOver', 'TalkBack'],
    navigation: 'keyboard_navigation_support',
    contrast: 'AA_minimum_4.5_1',
    touchTargets: 'minimum_44px',
    textScaling: 'up_to_200_percent',
    testing: ['automated_axe', 'manual_screenreader']
  },
  
  web: {
    screenReader: ['NVDA', 'JAWS', 'VoiceOver'],
    keyboard: 'full_keyboard_navigation',
    focus: 'visible_focus_indicators',
    semantics: 'proper_heading_structure',
    forms: 'clear_labels_and_errors',
    testing: ['lighthouse_audit', 'axe_devtools', 'manual_testing']
  }
};
```

### 🔐 **Security Headers & API Protection**

#### Security Implementation
```typescript
// Security headers configuration
const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
};

// API Rate limiting
const rateLimits = {
  auth: '5 requests per minute',
  general: '100 requests per minute',
  payments: '10 requests per minute',
  admin: '200 requests per minute'
};
```

## ⚡ Performance & Optimization

// AsyncStorage persistence (mobile)
import { persistQueryClient } from '@tanstack/react-query-persist-client-core';
import AsyncStorage from '@react-native-async-storage/async-storage';

persistQueryClient({
  queryClient,
  persister: createAsyncStoragePersister({
    storage: AsyncStorage,
  }),
});
```

### Performance Targets
```yaml
MOBILE PERFORMANCE:
- Cold start: <2s
- Hot navigation: <500ms
- API calls: <1s for queries
- Image loading: <2s for products

WEB PERFORMANCE:
- First Contentful Paint: <1.5s
- Largest Contentful Paint: <2.5s
- Time to Interactive: <3s
- Cumulative Layout Shift: <0.1

API PERFORMANCE:
- Response time P95: <200ms
- Response time P99: <500ms
- Database queries: <50ms simple, <200ms complex
- Background jobs: <30s processing
```

## 🚀 Deployment & Infrastructure

### **Deployment Stack Final (DÉCISIONS EXPERTES)**
```yaml
INFRASTRUCTURE FINALISÉE:
- Frontend: Vercel (Next.js optimisé)
- API: Vercel Edge (tRPC optimisé)
- Database: Supabase (PostgreSQL + auth intégré)
- Cache: PostgreSQL materialized views (€0/mois natif)
- Storage: Vercel Blob Store (50€/mois images/assets)

MOBILE DEPLOYMENT:
- Build: EAS Build (Expo)
- Distribution: App Store + Google Play Store
- Updates: EAS Update (OTA updates)
- Beta: TestFlight + Play Internal Testing

WEB DEPLOYMENT:
- Hosting: Vercel Pro (20€/mois)
- Domain: Custom domain + SSL automatique
- CDN: Vercel Edge Network global
- Analytics: Vercel Analytics + Google Analytics 4

BACKEND DEPLOYMENT:
- API: Vercel Edge (€0 MVP, scaling pay-as-you-go)
- Database: Supabase Free Tier (€0 MVP, évolutif Pro 25€/mois)
- Cache: PostgreSQL materialized views (natif)
- Files: Vercel Blob Store (€0 MVP, 1GB gratuit)
- Monitoring: Vercel Analytics (inclus)

BUDGET INFRASTRUCTURE: €0/mois MVP → ~100€/mois échelle
- Scaling: +100€/mois par 1000 utilisateurs actifs
```

### **CI/CD Pipeline Final (DÉCISIONS EXPERTES)**
```yaml
GITHUB ACTIONS OBLIGATOIRES:
- Tests: Vitest (unit) + Playwright (E2E)
- Lint: ESLint + Prettier obligatoire
- TypeScript: Zero errors strict mode
- Security: Snyk + GitHub scanning
- Performance: Lighthouse CI budgets

PIPELINE STRUCTURE:
- Tests automatiques sur PR
- Deploy automatique: main→staging  
- Deploy manuel: staging→production
- Rollback: One-click via Vercel

COVERAGE EXIGENCES:
- 80% couverture minimum tests
- 100% API critique (auth, payment)
- E2E sur parcours utilisateur critiques
- Performance budgets stricts

ENVIRONMENTS:
- Development: Local development
- Staging: Pre-production testing automatique
- Production: Manual deployment avec review

MONITORING POST-DEPLOY:
- Health checks automatiques
- Performance regression alerts
- Error rate monitoring
- User impact tracking
```

## 📊 Implementation Roadmap

### Phase 1: Bootstrap Foundation (Months 1-4)
```yaml
MONTH 1: Infrastructure
- Monorepo setup (Turborepo v2)
- Database schema + migrations (subscriptions focus)
- Authentication (Supabase Auth v5)
- Basic API structure (tRPC v11)

MONTH 2: Core Mobile App
- Expo app foundation
- Navigation (Expo Router v4)
- Authentication screens
- Subscription tiers + Stripe integration

MONTH 3: Web Dashboard
- Next.js (App Router) app setup sur Vercel
- Admin panel foundation
- Partner management
- Subscription management

MONTH 4: E-commerce Marketplace
- Product catalog from partners
- Shopping cart (points-based)
- Order system + dropshipping
- Basic commission tracking
```

### Phase 2: Enhancement (Months 5-8)
```yaml
ADVANCED FEATURES:
- Real-time notifications
- Advanced analytics + reporting
- Gamification system
- Performance optimizations

BUSINESS LOGIC:
- Points economy refinement
- Production tracking integration
- Partner API integrations
- Customer support tools
```

### Phase 3: Scale (Months 9-12)
```yaml
SCALING FEATURES:
- International expansion
- Multi-language support
- Advanced personalization
- IoT integration (future)

OPTIMIZATION:
- Performance monitoring
- Security hardening
- Compliance automation
- Business intelligence
```

---

*Architecture technique moderne, performante et maintenable pour 2025. Stack validé et optimisé pour scalabilité.*
