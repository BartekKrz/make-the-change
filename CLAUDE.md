# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Make the CHANGE** is a revolutionary biodiversity support platform with a hybrid engagement model. The platform offers 3 progressive levels: free exploration, specific project investments (€50-150), and premium subscriptions (€200-350). Users invest in specific biodiversity projects (beehives, olive trees) and receive points for premium sustainable products via commission-based partnerships.

This repository contains comprehensive documentation for the platform but **no actual implementation code yet**. The project is currently in the **Ready for Implementation** phase with all technical decisions finalized.

## Architecture & Tech Stack

### Core Technology Decisions
- **Frontend Mobile**: Expo SDK 53 with React Native, NativeWind v4, TypeScript 5.7+
- **Frontend Web**: Vercel Edge Functions with React, shadcn/ui v2, Tailwind CSS v4  
- **Backend**: tRPC v11 on Vercel Edge Functions (serverless Node.js)
- **Database**: Supabase (PostgreSQL 15) with native caching via materialized views
- **State Management**: TanStack Query v5 across all platforms
- **Monorepo**: Turborepo v2 with pnpm workspaces
- **Auth**: Supabase Auth v5 integration

### Project Structure (Future Implementation)
```
apps/
├── mobile/          # Expo React Native app
├── web/            # Vercel Edge Functions dashboard + e-commerce  
└── api/            # tRPC backend services
packages/
├── shared/         # Shared utilities & types
├── ui/             # Shared UI components
├── database/       # Database schema & migrations
└── config/         # Shared configuration
```

## Development Commands

**Note**: Since no code is implemented yet, these are the planned commands:

```bash
# Setup (when implemented)
pnpm install              # Install dependencies
pnpm dev                  # Start all apps in development
pnpm build               # Build all applications
pnpm test                # Run all tests
pnpm lint                # Lint all packages
pnpm typecheck          # TypeScript checking

# Mobile specific (utilisateurs finaux)
pnpm mobile:dev         # Start Expo development server
pnpm mobile:ios         # Run on iOS simulator
pnpm mobile:android     # Run on Android emulator

# Partner app specific (NOUVEAU - App native partenaires)
pnpm partner-app:dev    # Start Expo partner app dev server
pnpm partner-app:ios    # Run partner app on iOS simulator
pnpm partner-app:android # Run partner app on Android emulator

# Web specific  
pnpm web:dev           # Start Vercel Edge Functions dev server
pnpm web:build         # Build web application

# Database
pnpm db:migrate        # Run database migrations
pnpm db:seed           # Seed development data
pnpm db:studio         # Open database studio
```

## Core Business Logic - Hybrid Engagement Model

### 3-Level Progressive System
- **Level 1 - Explorateur (Free)**: App exploration, project discovery, normal pricing
- **Level 2 - Protecteur (Investments)**: Specific project investments (€50 beehive, €80 olive tree, €150 family plot)
- **Level 3 - Ambassadeur (Subscriptions)**: Premium subscriptions (€200-350/an) with flexible allocation

### Investment & Points System
- **Investment Tiers**: €50 beehive (65 points), €80 olive tree (105 points), €150 plot (210 points)
- **Subscription Tiers**: €200 Ambassadeur (280 points), €350 Ambassadeur Premium (525 points)
- **Points Generation**: 30-50% bonus value over investment/subscription amount
- **Points Expiry**: 18 months after generation
- **Partners**: Commission-based dropshipping (HABEEBEE, ILANGA NATURE, PROMIEL)

### Key Features to Implement
1. **Mobile App** (Expo): Free exploration, project investments, user dashboard, points redemption, adaptive UI by user level
2. **Partner App** (NOUVEAU - Expo): Native app pour partenaires avec upload photos/vidéos, gestion projets, updates terrain
3. **Admin Dashboard** (Vercel Edge Functions): Investment management, partner management, user analytics, project tracking, modération updates partenaires
4. **E-commerce Site** (Vercel Edge Functions): Product catalog hybride (micro-stock + dropshipping), points-based checkout, user accounts

## Database Schema

Key entities to implement:
- `users` - User accounts with user_level (explorateur/protecteur/ambassadeur) and points balance
- `investments` - Individual project investments with specific tracking (beehive_id, olive_tree_id, etc.)
- `subscriptions` - Premium subscriptions (ambassadeur tiers) with flexible project allocation
- `projects` - Specific biodiversity projects (beehives, olive trees) with real-time updates
- `partners` - Partner producers with commission rates and product catalog
- `partner_users` - NOUVEAU: Comptes utilisateurs app partenaires (Owner, Staff roles)
- `project_updates` - NOUVEAU: Updates partenaires (photos, vidéos, notes) avec modération
- `points_transactions` - Points system with expiry tracking and source (investment/subscription)
- `products` - E-commerce catalog with points pricing from partners (stock vs dropshipping)
- `inventory` - NOUVEAU: Gestion micro-stock héros (2-3 SKUs) avec seuils réassort
- `orders` - Points-based order system avec fulfillment hybride (stock MTC + dropshipping partenaires)
- `shipments` - NOUVEAU: Tracking expéditions hybrides (micro-hub MTC + partenaires)

## Code Quality Standards

- **TypeScript**: Strict mode required across all packages
- **Testing**: Vitest for unit tests, Playwright for E2E testing
- **Linting**: ESLint + Prettier with strict configuration
- **Git Hooks**: Husky + lint-staged for pre-commit checks
- **Coverage**: Minimum 80% test coverage, 100% for critical paths (auth, payments)

## Important Documentation

### Business Context
- `/docs/README.md` - Complete project overview and navigation
- Root analysis files (STRATEGIE-3-PHASES-FINANCEMENT.md, PHASE-1-BOOTSTRAP-DETAILLEE.md) - Economic model details
- `/docs/01-strategy/user-personas.md` - Target user profiles

### Technical Implementation
- `/docs/03-technical/architecture-overview.md` - Detailed technical architecture
- `/docs/03-technical/tech-stack.md` - Complete technology stack specifications
- `/docs/03-technical/database-schema.md` - Database design and relationships

### Implementation Specifications
- `/docs/04-specifications/mobile-app/` - Mobile app detailed specifications
- `/docs/04-specifications/admin-dashboard/` - Admin panel specifications
- `/docs/04-specifications/ecommerce-site/` - E-commerce site specifications

### Development Guidelines
- `/docs/06-development/README.md` - Development workflow and standards
- `/docs/09-architecture-decisions/0001-choix-monorepo-stack-technique.md` - Key technical decisions

## Performance & Security Requirements

### Performance Targets
- **Mobile**: Cold start <2s, navigation <500ms, API calls <1s
- **Web**: FCP <1.5s, LCP <2.5s, TTI <3s, CLS <0.1
- **API**: P95 response time <200ms, P99 <500ms
- **Database**: Simple queries <50ms, complex queries <200ms

### Security Requirements
- **KYC**: Stripe Identity integration with tiered verification
- **Data Protection**: GDPR compliance, data retention policies
- **API Security**: Rate limiting, input validation, CORS configuration
- **Authentication**: Secure session management, password policies

## Partner Integrations

### Key Partners (Commission-Based Dropshipping)
- **HABEEBEE** (habeebee.be) - 150 beekeepers in Belgium (20% commission confirmed)
- **ILANGA NATURE** - Madagascar olive groves with social impact (future products 2027+)
- **PROMIEL** (promiel.lu) - 20 beekeepers in Luxembourg (partnership planned)

### External APIs to Integrate
- **Stripe**: Payments and KYC verification
- **Google Maps**: Project location and mapping
- **SendGrid**: Transactional emails
- **Partner APIs**: Production tracking and impact metrics

## Development Workflow

When implementation begins:

1. **Setup**: Use Turborepo v2 monorepo with pnpm workspaces
2. **Branching**: Feature branches from `main`, squash merge on approval
3. **Testing**: Unit tests required for all business logic, E2E for critical paths
4. **Deployment**: Auto-deploy to staging, manual production releases
5. **Monitoring**: Vercel Analytics, error tracking, performance monitoring

## Current Status

- **Phase**: Ready for Implementation (362/370 expert decisions finalized)
- **Next Steps**: Monorepo setup, authentication system, core mobile app
- **Timeline**: 4-month MVP development plan documented in `/docs/07-project-management/sprint-planning.md`
- **Budget**: €0/month MVP Phase 1 Bootstrap scaling to €145/month Phase 2 Growth infrastructure

## Key Reminders

- This is a **documentation-only repository** - no implementation exists yet
- All technical decisions are finalized and documented
- Follow the exact tech stack specified (Expo SDK 53, Vercel Edge Functions, tRPC v11, etc.)
- Prioritize type safety with TypeScript strict mode across all packages
- Implement robust error handling and user feedback systems
- Focus on performance from day one with the specified targets
- Security and compliance are critical due to financial transactions

For questions about business logic or requirements, refer to the comprehensive documentation in `/docs/`. For Phase 1 Bootstrap implementation guidance, follow `/docs/03-technical/tech-stack.md` (Phase 1 section) and simplified MVP specifications in `/docs/04-specifications/`.

**IMPORTANT PHASE 1 CONSTRAINTS:**

- Start with Phase 1 Bootstrap model (€30-150 subscriptions, commission-based)
- Use minimal tech stack (Supabase Free, Expo Go, no EAS Build)
- Focus on essential MVP features only (auth, catalog, points, checkout)
- Avoid premature optimization for Phase 2-3 features