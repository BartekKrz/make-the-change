# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Make the CHANGE is a revolutionary biodiversity platform with a hybrid 3-level model:
- **Level 1 - Explorateur:** Free exploration of projects
- **Level 2 - Protecteur:** €50-150 investments in specific projects
- **Level 3 - Ambassadeur:** €180-320 subscriptions with flexible allocation

The platform includes mobile app, admin dashboard, e-commerce site, and partner management.

## Architecture & Tech Stack

This is a **monorepo** managed by **Turborepo v2** and **pnpm workspaces**.

### Core Technologies
- **Mobile App:** Expo SDK 53 + React Native + NativeWind v4 + TanStack Query v5
- **Web Apps:** Next.js 15.1 (App Router) + shadcn/ui v2 + Tailwind CSS v4 + TanStack Query v5
- **Backend API:** tRPC v11.5.0 + TypeScript 5.9+ (strict mode)
- **Database & Auth:** Supabase (PostgreSQL 15 + Auth)
- **Hosting:** Vercel (Edge + Node runtimes)
- **State Management:** TanStack Query v5 (unified across platforms)
- **Package Manager:** pnpm v9+ (required)

### Project Structure
```
/
├── apps/
│   ├── mobile/          # Expo React Native app (users)
│   ├── partner-app/     # Expo React Native app (partners)
│   ├── web/            # Next.js 15.1 (Admin + E-commerce)
│   └── api/            # tRPC backend
├── packages/
│   ├── shared/         # Shared utilities & types
│   ├── ui/            # Shared UI components
│   ├── database/      # Supabase migrations
│   └── config/        # Shared config
├── docs/              # Comprehensive documentation
└── scripts/           # Development & GitHub management scripts
```

## Common Development Commands

**Note: This is currently a documentation-only repository. When code is implemented:**

```bash
# Install dependencies
pnpm install

# Development
pnpm dev                # Start all apps in development
pnpm dev:mobile         # Mobile app only
pnpm dev:web           # Web dashboard only
pnpm dev:api           # API server only

# Building
pnpm build             # Build all apps
pnpm build:mobile      # Build mobile app
pnpm build:web         # Build web apps

# Testing
pnpm test              # Run all tests (Vitest + Playwright)
pnpm test:unit         # Unit tests only (Vitest)
pnpm test:e2e          # E2E tests only (Playwright)
pnpm test:mobile       # Mobile tests (Maestro)

# Code Quality
pnpm lint              # ESLint all projects
pnpm lint:fix          # Fix linting issues
pnpm type-check        # TypeScript checking
pnpm format            # Prettier formatting

# Database
pnpm db:generate       # Generate database types
pnpm db:migrate        # Run migrations
pnpm db:seed           # Seed development data
```

## Key Architecture Patterns

### tRPC + TanStack Query Integration
- **Server-side (RSC):** Use `appRouter.createCaller(ctx)` for type-safe server data fetching
- **Client-side:** Use `@trpc/react-query` with TanStack Query for caching and mutations
- **Hydration:** Prefetch server data and hydrate client queries using `dehydrate()`

### Database Access (Supabase)
- Use `@supabase/supabase-js` HTTP client (Edge-compatible)
- Leverage Row Level Security (RLS) for data isolation
- Use materialized views for analytics and caching
- Avoid TCP-based database clients in Edge runtime

### Performance Optimization
- **Mobile:** Bundle splitting, image optimization, offline support via TanStack Query
- **Web:** SSR/SSG, code splitting, Vercel Edge Network caching
- **API:** Edge Functions for low latency, PostgreSQL query optimization

## Development Standards

### TypeScript
- Strict mode enabled across all projects
- Shared types in `packages/shared`
- API types auto-generated from tRPC routers

### Code Style
- **Files:** kebab-case (`user-service.ts`)
- **Components:** PascalCase (`UserProfile.tsx`)
- **Functions:** camelCase (`calculatePoints()`)
- **Constants:** SCREAMING_SNAKE_CASE (`MAX_INVESTMENT_AMOUNT`)

### Git Workflow
1. Feature branches: `feature/feature-name`
2. Conventional commits: `feat:`, `fix:`, `docs:`, etc.
3. Pre-commit hooks: lint + format + type check
4. Squash merge to `main`

## Testing Strategy

Three-tier approach:
- **🔴 Critical (95%+ coverage):** Business logic, API endpoints, auth, payments
- **🟡 Important (80%+ coverage):** Complex components, custom hooks
- **🟢 Standard (60%+ coverage):** UI components, layouts

**Tools:**
- **Unit/Integration:** Vitest + React Testing Library + MSW
- **E2E:** Playwright (web) + Maestro (mobile)
- **API Mocking:** MSW for consistent API simulation

## Documentation Structure

The `docs/` folder contains comprehensive documentation:
- **01-strategy/**: Business model, user personas, KPIs
- **02-product/**: Design system, UX research, roadmap
- **03-technical/**: Architecture, database schema, tech stack
- **04-specifications/**: Detailed specs for mobile, web, and admin apps
- **05-operations/**: Business processes, partner management
- **06-development/**: Setup guides, coding standards, TDD strategy
- **07-project-management/**: Sprint planning, risk analysis

Key entry points:
- `docs/README.md`: Main documentation index
- `docs/GETTING-STARTED.md`: Quick start guide
- `docs/03-technical/architecture-overview.md`: Technical architecture
- `docs/03-technical/tech-stack.md`: Complete technology stack

## Business Context

### Core Features
- **Investment System:** Users invest in specific beehives/olive trees (€50-150)
- **Subscription Model:** Premium tier with flexible project allocation (€180-320)
- **Points Economy:** Bonus points (30-50%) for premium product purchases
- **Partner Integration:** HABEEBEE (Belgium), ILANGA NATURE (Madagascar), PROMIEL (Luxembourg)
- **E-commerce:** Hybrid fulfillment (micro-stock + dropshipping)

### Key User Levels
- **Explorateur:** Free tier with project exploration
- **Protecteur:** Investment-based engagement
- **Ambassadeur:** Subscription-based with maximum benefits

## Security & Compliance

- **Authentication:** Supabase Auth with RLS
- **KYC:** Stripe Identity integration (€100+ threshold)
- **GDPR:** Full compliance with data protection
- **Payments:** Stripe for both investments and subscriptions
- **Security Headers:** CSP, HSTS, CSRF protection

## Deployment

### Environments
- **Development:** Local development with Docker PostgreSQL
- **Staging:** Vercel preview deployments
- **Production:** Vercel Pro + Supabase Pro

### Infrastructure Costs
- **Phase 1 (MVP):** ~€0/month (free tiers)
- **Phase 2 (Growth):** ~€145/month (Vercel Pro + Supabase Pro)
- **Phase 3 (Scale):** €500-2000/month depending on usage

## Important Notes

- **Package Manager:** Always use `pnpm` - other package managers will cause issues
- **Node Version:** Use Node.js 22 LTS for compatibility
- **Database:** Local development uses Docker PostgreSQL, production uses Supabase
- **Deployment:** Web apps deploy to Vercel, mobile uses EAS Build
- **Environment Variables:** Managed through Vercel dashboard with proper isolation

When implementing features, always consider the hybrid business model and multi-platform architecture. Prioritize type safety and performance across all platforms.