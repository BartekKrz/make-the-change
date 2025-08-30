# 🧪 Test-Driven Development Strategy

**Make the CHANGE - Stratégie TDD Pragmatique Phase 1 Bootstrap**

## 🎯 Vue d'Ensemble

Cette stratégie TDD est optimisée pour le développement rapide et fiable de la plateforme Make the CHANGE. Elle balance productivité immédiate et qualité long-terme avec une approche pragmatique en 3 niveaux de criticité.

### Objectifs
- **85%+ coverage** sur la logique critique (business, API, validations)
- **Déploiements sereins** dès la semaine 16
- **Onboarding rapide** nouveaux développeurs
- **ROI positif** sous 3 mois

## 📊 Stratégie 3 Niveaux

### 🔴 **NIVEAU CRITIQUE** (TDD Obligatoire)
**Coverage Target: 95%+**

#### Modules Concernés
- **Business Logic** : Calculs points, transitions statut, règles métier
- **API Routes** : tRPC endpoints, validations, authentification
- **Intégrations** : Stripe, webhooks partenaires, Supabase
- **Sécurité** : KYC, permissions, GDPR

#### Exemples Concrets
```typescript
// ✅ TDD OBLIGATOIRE
describe('ProjectStatusTransition', () => {
  it('should calculate correct points bonus for beehive investment', () => {
    // 50€ beehive → 65 points (30% bonus)
    expect(calculatePointsForInvestment('beehive', 50)).toBe(65)
  })
})

describe('KYCValidation', () => {
  it('should reject user under 18 years old', () => {
    const birthDate = new Date('2010-01-01')
    expect(validateKYCAge(birthDate)).toBe(false)
  })
})
```

#### Workflow TDD Strict
1. **RED** : Écrire test d'abord (comportement attendu)
2. **GREEN** : Code minimal pour passer le test
3. **REFACTOR** : Optimiser en gardant tests verts
4. **Répéter** pour chaque exigence

### 🟡 **NIVEAU IMPORTANT** (TDD Conditionnelle)
**Coverage Target: 80%+**

#### Modules Concernés
- **Composants avec logique** : Formulaires complexes, tables interactives
- **Hooks personnalisés** : useProjectFilters, usePointsBalance
- **Utils complexes** : Formatage, calculs d'affichage

#### Approche Hybride
- **TDD** si logique complexe ou critique
- **Tests après coup** si UI majoritaire
- **Refactoring** vers TDD si bugs récurrents

#### Exemples
```typescript
// 🟡 TDD CONDITIONNELLE
describe('useProjectFilters', () => {
  it('should filter active beehive projects in France', () => {
    // Test hook personnalisé avec logique
    const { result } = renderHook(() => 
      useProjectFilters({ type: 'beehive', country: 'France', status: 'active' })
    )
    expect(result.current.filteredProjects).toHaveLength(3)
  })
})
```

### 🟢 **NIVEAU STANDARD** (Tests Après Développement)
**Coverage Target: 60%+**

#### Modules Concernés
- **UI Pure** : Layouts, headers, navigation
- **Styling** : CSS, responsive, animations
- **Prototypes** : Features expérimentales

#### Approche
- **Développement rapide** sans tests initiaux
- **Tests d'intégration** une fois UI stabilisée
- **Visual regression** avec Chromatic/Playwright
- **E2E** pour parcours critiques

## 🛠️ Stack Technique

### Configuration Vitest Optimisée
```typescript
// jest.config.js
export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
    '!src/components/ui/**', // shadcn/ui components
  ],
  coverageThreshold: {
    global: {
      functions: 80,
      lines: 80,
      statements: 80,
    },
    // Stricter pour logique critique
    'src/lib/business/**': {
      functions: 95,
      lines: 95,
      statements: 95,
    },
    'src/server/api/**': {
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  testMatch: [
    '<rootDir>/test/**/*.test.{ts,tsx}',
    '<rootDir>/src/**/__tests__/**/*.{ts,tsx}',
  ],
}
```

### MSW pour Mocking API
```typescript
// test/mocks/handlers.ts
import { http, HttpResponse } from 'msw'

export const handlers = [
  // Mock tRPC endpoints
  http.post('/api/trpc/admin.projects.create', () => {
    return HttpResponse.json({
      result: {
        data: {
          id: 'proj_123',
          name: 'Test Beehive',
          status: 'active',
          points_generated: 65,
        }
      }
    })
  }),

  // Mock Stripe webhooks
  http.post('/api/webhooks/stripe', () => {
    return HttpResponse.json({ received: true })
  }),
]

// test/setup.ts
import { setupServer } from 'msw/node'
import { handlers } from './mocks/handlers'

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

### Structure Tests
```
test/
├── unit/                    # TDD Strict
│   ├── lib/
│   │   ├── business/        # Logique métier critique
│   │   ├── validations/     # Schémas Zod
│   │   └── utils/           # Fonctions utilitaires
│   └── server/
│       └── api/             # Routes tRPC
├── integration/             # Tests après développement
│   ├── components/          # Composants React
│   ├── app/                 # App Router Next.js
│   └── workflows/           # Parcours utilisateur
├── e2e/                     # Playwright (parcours critiques)
│   ├── admin-workflows.spec.ts
│   ├── project-creation.spec.ts
│   └── user-investment.spec.ts
└── mocks/                   # MSW handlers
    ├── handlers.ts
    ├── stripe.ts
    └── supabase.ts
```

## 📋 Mapping Modules Make the CHANGE

### 🏗️ Admin Dashboard - Projects CRUD
```yaml
TDD Obligatoire (🔴):
  - validateProjectData()
  - calculateFundingProgress() 
  - transitionProjectStatus()
  - generateTrackingIds()
  - API routes: projects.create, projects.update

TDD Conditionnel (🟡):
  - ProjectEditor components (formulaires)
  - useProjectFilters hook
  - Bulk actions logic

Standard (🟢):
  - UI layouts et navigation
  - File upload components
  - Map integration display
```

### 👥 User Management
```yaml
TDD Obligatoire (🔴):
  - KYC validation pipeline
  - Points calculations & expiry
  - User permissions & roles
  - GDPR data export
  - Stripe subscriptions handling

TDD Conditionnel (🟡):
  - User search & filtering
  - Bulk user actions
  - Support note management

Standard (🟢):
  - User detail panels
  - Table sorting UI
  - Export download interface
```

### 💰 E-commerce & Orders
```yaml
TDD Obligatoire (🔴):
  - Points checkout calculation
  - Inventory management
  - Order fulfillment logic
  - Commission calculations
  - Payment processing

TDD Conditionnel (🟡):
  - Product catalog filtering
  - Cart management
  - Order status updates

Standard (🟢):
  - Product display grids
  - Shopping cart UI
  - Order history interface
```

## 🚀 Planning Phase 1 Bootstrap

### Semaines 1-4 : TDD Foundation
```yaml
Semaine 1-2: Setup Infrastructure
  - Configuration Vitest + MSW + Playwright
  - Structure de tests
  - CI/CD avec coverage reporting
  - Documentation workflow TDD

Semaine 3-4: Business Logic Foundation
  - TDD: Core business models (User, Project, Investment)
  - TDD: Validation schemas (Zod)
  - TDD: Points calculation engine
  - TDD: Status transition workflows
```

### Semaines 5-8 : Projects CRUD (TDD Critique)
```yaml
Semaine 5: Core Business Logic
  - TDD: Project creation workflow
  - TDD: Funding calculations
  - TDD: Status transitions
  - TDD: Partner integrations

Semaine 6: API Routes
  - TDD: tRPC project endpoints
  - TDD: Validation middleware  
  - TDD: Error handling
  - Tests après: UI components

Semaine 7-8: Integration & Polish
  - TDD: Webhook handlers
  - E2E: Critical project workflows
  - Tests après: Admin interface
  - Performance optimization
```

### Semaines 9-12 : Users Management
```yaml
Semaine 9-10: Critical User Logic
  - TDD: KYC validation engine
  - TDD: User permissions system
  - TDD: Points balance management
  - TDD: GDPR compliance tools

Semaine 11-12: User Interface
  - TDD conditionnel: Complex user workflows
  - Tests après: User management UI
  - E2E: User administration flows
  - Integration avec Stripe
```

### Semaines 13-16 : E-commerce & Polish
```yaml
Semaine 13-14: Commerce Logic
  - TDD: Checkout calculation engine
  - TDD: Inventory management
  - TDD: Order fulfillment
  - TDD: Commission calculations

Semaine 15-16: Final Integration
  - E2E: Complete user journeys
  - Performance optimization
  - Security audit
  - Production deployment prep
```

## 📈 Métriques & KPIs

### Coverage Targets
```yaml
Global: 85%+
Business Logic: 95%+
API Routes: 90%+
Components: 75%+
Utils: 90%+
```

### Qualité Metrics
```yaml
Bug Detection: 90%+ avant production
Regression Prevention: 95%+
Deployment Confidence: 100%
New Developer Onboarding: <2 jours
```

### Performance Tests
```yaml
Unit Tests: <5s total execution
Integration Tests: <30s
E2E Critical Path: <3min
CI/CD Pipeline: <10min
```

## 🎯 Exemples Concrets

### Exemple 1 : Calcul Points Investment (TDD Strict)
```typescript
// 1. RED - Test first
describe('Points Calculator', () => {
  it('should calculate correct points for beehive investment', () => {
    const investment = {
      type: 'beehive',
      amount_eur: 50,
      bonus_percentage: 30
    }
    
    const result = calculateInvestmentPoints(investment)
    
    expect(result.base_points).toBe(50)
    expect(result.bonus_points).toBe(15)
    expect(result.total_points).toBe(65)
  })

  it('should handle olive tree investment correctly', () => {
    const investment = {
      type: 'olive_tree', 
      amount_eur: 80,
      bonus_percentage: 40
    }
    
    const result = calculateInvestmentPoints(investment)
    expect(result.total_points).toBe(112) // 80 + 32
  })
})

// 2. GREEN - Minimal implementation
export function calculateInvestmentPoints(investment: Investment): PointsCalculation {
  const base_points = investment.amount_eur
  const bonus_points = Math.floor(base_points * (investment.bonus_percentage / 100))
  
  return {
    base_points,
    bonus_points,
    total_points: base_points + bonus_points
  }
}

// 3. REFACTOR - Optimize later
export function calculateInvestmentPoints(investment: Investment): PointsCalculation {
  // Add validation, error handling, logging, etc.
  if (investment.amount_eur <= 0) {
    throw new Error('Invalid investment amount')
  }
  
  // Business logic remains tested and unchanged
  const base_points = investment.amount_eur
  const bonus_points = Math.floor(base_points * (investment.bonus_percentage / 100))
  
  return {
    base_points,
    bonus_points,
    total_points: base_points + bonus_points,
    calculated_at: new Date()
  }
}
```

### Exemple 2 : Project Status Transition (TDD Strict)
```typescript
// Test des règles métier complexes
describe('Project Status Workflow', () => {
  it('should allow transition from draft to active when conditions are met', () => {
    const project = createTestProject({
      status: 'draft',
      name: 'Test Beehive',
      target_amount: 1000,
      partner_approved: true,
      media_uploaded: true
    })
    
    const result = transitionProjectStatus(project, 'active')
    
    expect(result.success).toBe(true)
    expect(result.new_status).toBe('active')
    expect(result.published_at).toBeDefined()
  })

  it('should reject transition if partner not approved', () => {
    const project = createTestProject({
      status: 'draft',
      partner_approved: false
    })
    
    const result = transitionProjectStatus(project, 'active')
    
    expect(result.success).toBe(false)
    expect(result.error).toBe('PARTNER_APPROVAL_REQUIRED')
  })
})
```

### Exemple 3 : Component Testing (Après Développement)
```typescript
// Test composant une fois UI stabilisée
describe('ProjectCard Component', () => {
  it('should display funding progress correctly', () => {
    const project = {
      name: 'Test Beehive',
      current_funding: 750,
      target_funding: 1000,
      supporters_count: 15
    }
    
    render(<ProjectCard project={project} />)
    
    expect(screen.getByText('75%')).toBeInTheDocument()
    expect(screen.getByText('15 protecteurs')).toBeInTheDocument()
    expect(screen.getByText('€750 / €1,000')).toBeInTheDocument()
  })
})
```

## 🔧 Commandes de Développement

### Scripts Package.json
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:unit": "jest --testPathPattern=unit",
    "test:integration": "jest --testPathPattern=integration", 
    "test:e2e": "playwright test",
    "test:ci": "jest --ci --coverage --watchAll=false"
  }
}
```

### Workflow TDD Quotidien
```bash
# 1. Démarrer en mode TDD
pnpm test:watch

# 2. Écrire test (RED)
# 3. Coder implémentation (GREEN)  
# 4. Refactorer (REFACTOR)
# 5. Répéter

# Vérifier coverage périodiquement
pnpm test:coverage

# Tests E2E avant push
pnpm test:e2e
```

## 🚨 Points d'Attention

### Pièges à Éviter
- **Over-testing** : Ne pas tester les détails d'implémentation
- **UI fragile** : Éviter TDD sur UI en mouvement rapide
- **Mocks complexes** : Préférer données réelles quand possible
- **Coverage vanity** : Viser qualité > pourcentage

### Signaux d'Alarme
- Tests qui cassent souvent (UI trop testée)
- Coverage élevé mais bugs en production (mauvaise qualité tests)
- Développement ralenti >50% (TDD sur mauvaises zones)
- Équipe résistante (formation insuffisante)

## 🎓 Formation Équipe

### Ressources Recommandées
- **TDD by Example** (Kent Beck) - Fondamentaux
- **Testing Library Docs** - Bonnes pratiques React
- **MSW Documentation** - API mocking moderne
- **Make the CHANGE TDD Examples** - Exemples projet spécifiques

### Pair Programming
- **TDD Kata** en binôme sur logique business
- **Code Review** focus sur qualité tests
- **Mob Programming** sur modules critiques

---

**Dernière mise à jour** : Phase 1 Bootstrap  
**Prochaine révision** : Phase 2 Growth (après semaine 16)

Cette stratégie TDD garantit une base solide pour Make the CHANGE tout en maintenant la vélocité de développement nécessaire au succès du bootstrap.
