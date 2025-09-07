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

### Core Technologies (Implemented)
- **Web App:** Next.js 15.5 (App Router) + Radix UI + Tailwind CSS v4 + TanStack Query v5
- **Backend API:** tRPC v11.0.0 + TypeScript 5.9+ (strict mode)
- **Database & Auth:** Supabase (PostgreSQL + Auth)
- **Hosting:** Vercel (Edge + Node runtimes)
- **State Management:** TanStack Query v5 + TanStack Form v1.19
- **Testing:** Vitest + Playwright + React Testing Library + MSW
- **Package Manager:** pnpm v9.15.0 (required)

### Technologies (Planned)
- **Mobile Apps:** Expo SDK 53 + React Native + NativeWind v4
- **UI Package:** shadcn/ui v2 components

### Project Structure
```
/
├── apps/
│   └── web/            # Next.js 15.5 (Admin + E-commerce) - IMPLEMENTED
├── packages/
│   ├── api/            # tRPC v11 routers & context - IMPLEMENTED
│   └── shared/         # Shared utilities & types - IMPLEMENTED
├── docs/              # Comprehensive documentation
├── scripts/           # Development & GitHub management scripts
├── supabase/          # Supabase configuration
└── public/            # Static assets
```

**Current Implementation Status:**
- ✅ **Web App (Next.js 15.5):** Fully implemented with admin dashboard, e-commerce features
- ✅ **API Package (tRPC v11):** Implemented with routers and context
- ✅ **Shared Package:** Types and utilities implemented
- ⏳ **Mobile Apps:** Not yet implemented
- ⏳ **UI Package:** Not yet implemented

## Common Development Commands

```bash
# Install dependencies
pnpm install

# Development
pnpm dev                # Start all apps in development (currently web only)
pnpm dev --filter=@make-the-change/web  # Web app only

# Building
pnpm build             # Build all apps
pnpm build --filter=@make-the-change/web # Build web app only

# Testing (Web App)
pnpm test --filter=@make-the-change/web        # All tests (Vitest + Playwright)
pnpm test:unit --filter=@make-the-change/web   # Unit tests only
pnpm test:integration --filter=@make-the-change/web # Integration tests
pnpm test:e2e --filter=@make-the-change/web    # E2E tests (Playwright)
pnpm test:watch --filter=@make-the-change/web  # Watch mode
pnpm test:ui --filter=@make-the-change/web     # Vitest UI
pnpm test:coverage --filter=@make-the-change/web # Coverage report

# TDD Development (Web App)
pnpm tdd:setup --filter=@make-the-change/web   # Setup TDD environment
pnpm tdd:seed --filter=@make-the-change/web    # Seed test data
pnpm test:tdd --filter=@make-the-change/web    # Run specific TDD test
pnpm test:tdd:watch --filter=@make-the-change/web # TDD watch mode

# Code Quality
pnpm lint              # ESLint all projects
pnpm type-check        # TypeScript checking
pnpm format            # Prettier formatting

# Database & Types
pnpm types:generate    # Generate database types from Supabase
```

## Development Workflow

### Working with the Web App
The main development happens in `apps/web/` which is a Next.js 15.5 application:

```bash
# Navigate to web app
cd apps/web

# Start development server
pnpm dev

# Run tests in watch mode during development
pnpm test:watch

# Run specific test suites
pnpm test:unit        # Unit tests only
pnpm test:integration # Integration tests only
pnpm test:e2e        # Playwright E2E tests

# Debug E2E tests
pnpm test:e2e:debug  # Opens Playwright inspector
pnpm test:e2e:ui     # Opens Playwright UI mode
```

### TDD Workflow (Implemented)
The project includes custom TDD scripts for efficient test-driven development:

```bash
# Setup TDD environment (from web app directory)
pnpm tdd:setup       # Initialize TDD environment
pnpm tdd:seed        # Seed test database with data
pnpm test:tdd        # Run specific TDD test suite
pnpm tdd:clean       # Clean up test environment
pnpm tdd:reset       # Reset TDD environment
```

### Package Development
When working with shared packages:

```bash
# API package (tRPC routers)
cd packages/api
pnpm dev            # Watch mode for TypeScript compilation
pnpm type-check     # Type checking

# Shared package (utilities & types)
cd packages/shared
pnpm dev            # Watch mode for TypeScript compilation
```

## Key Architecture Patterns

### tRPC + TanStack Query Integration (Implemented)
- **Server-side (RSC):** Use `appRouter.createCaller(ctx)` for type-safe server data fetching
- **Client-side:** Use `@trpc/react-query` with TanStack Query for caching and mutations
- **API Package Structure:** Routers and context are in `packages/api/src/`
- **Type Safety:** Full end-to-end type safety from database to UI

### Database Access (Supabase)
- Use `@supabase/supabase-js` v2.48.0 HTTP client (Edge-compatible)
- SSR support via `@supabase/ssr` for Next.js
- Leverage Row Level Security (RLS) for data isolation
- Database types generation via `pnpm types:generate`

### Form Management (TanStack Form)
- Use `@tanstack/react-form` v1.19.3 with Zod validation
- Form adapter: `@tanstack/zod-form-adapter` for type-safe validation
- Integrated with tRPC for mutations

### Testing Architecture (Implemented)
- **Unit Tests:** Vitest with React Testing Library
- **E2E Tests:** Playwright with UI mode support
- **API Mocking:** MSW (Mock Service Worker) for consistent API simulation
- **TDD Workflow:** Custom scripts for Test-Driven Development

### Performance Optimization
- **Web:** Next.js 15.5 with Turbo mode, SSR/SSG, code splitting
- **Bundle Analysis:** `pnpm build:analyze` for bundle size optimization
- **Edge Compatibility:** Supabase HTTP client for Edge runtime compatibility

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

**Tools (Implemented):**
- **Unit/Integration:** Vitest v2.1.8 + React Testing Library + MSW v2.6.5
- **E2E:** Playwright v1.49.1 with UI mode and debugging support
- **Coverage:** Vitest coverage with v8 provider
- **API Mocking:** MSW for consistent API simulation across test environments

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
- **Phase 1 (MVP):** ~€0/month (free tiers) - CURRENT
- **Phase 2 (Growth):** ~€145/month (Vercel Pro + Supabase Pro)
- **Phase 3 (Scale):** €500-2000/month depending on usage

## Important Notes

- **Package Manager:** Always use `pnpm` - other package managers will cause issues
- **Node Version:** Use Node.js ≥20.0.0 for compatibility (as defined in package.json)
- **Database:** Development uses Supabase, production uses Supabase Pro
- **Deployment:** Web app deploys to Vercel with Edge runtime support
- **Environment Variables:** Use `.env.local` for development (see `.env.example`)
- **Monorepo:** Use Turborepo v2.3.3 for task orchestration and caching

### Current Implementation Focus
- **Primary Platform:** Web application (admin dashboard + e-commerce)
- **Admin Features:** Subscription management, partner management, analytics
- **E-commerce:** Product catalog, shopping cart, investment tracking
- **Architecture:** Full-stack TypeScript with end-to-end type safety
- **Testing:** Comprehensive test suite with unit, integration, and E2E tests

### Development Best Practices
- Always run `pnpm type-check` before committing
- Use TDD workflow for new features (especially business logic)
- Test API endpoints with MSW mocking
- Follow the existing code patterns in `apps/web/src/`
- Leverage shared types from `packages/api` and `packages/shared`

When implementing features, always consider the hybrid business model and multi-platform architecture. Prioritize type safety and performance across all platforms.