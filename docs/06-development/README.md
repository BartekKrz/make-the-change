# 💻 Guides Développement

Cette section contient tous les guides pratiques pour le développement, setup d'environnement, standards de code et processus de développement.

## 📋 Contenu de cette Section

Guides pratiques pour développeurs couvrant setup, standards, testing et workflow de développement.

## 🗂️ Documents

| Document | Description | Status | Dernière MAJ |
|----------|-------------|--------|--------------|
| [setup-guide.md](./setup-guide.md) | Installation environnement complet | 📋 À créer | - |
| [development-workflow.md](./development-workflow.md) | Git flow, PR process, conventions | 📋 À créer | - |
| [coding-standards.md](./coding-standards.md) | Standards code TypeScript/React | 📋 À créer | - |
| [testing-strategy.md](./testing-strategy.md) | Tests unitaires, E2E, coverage | 📋 À créer | - |
| [deployment-guide.md](./deployment-guide.md) | Process déploiement environments | 📋 À créer | - |
| [troubleshooting.md](./troubleshooting.md) | Problèmes courants et solutions | 📋 À créer | - |

## 🚀 Quick Setup (Future)

Quand le projet sera implémenté, le setup sera :

```bash
# Clone repository
git clone https://github.com/make-the-change/platform.git
cd platform

# Install dependencies
pnpm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your config

# Start development
pnpm dev

# Run tests
pnpm test
```

## 🛠️ Stack Technique

### Development Tools
- **IDE** : VS Code + Extension pack
- **Package Manager** : pnpm v8+
- **Node.js** : v22 LTS
- **TypeScript** : v5.7+ strict mode

### Code Quality
- **Linting** : ESLint + @typescript-eslint
- **Formatting** : Prettier
- **Type Checking** : TypeScript strict
- **Git Hooks** : Husky + lint-staged

### Testing Stack
- **Unit Tests** : Vitest + @testing-library
- **E2E Tests** : Playwright
- **Coverage** : c8 (built into Vitest)
- **Mocking** : MSW (Mock Service Worker)

## 📝 Standards de Code

### Conventions Nommage
```typescript
// Files: kebab-case
user-service.ts
investment-calculator.ts

// Components: PascalCase  
UserProfile.tsx
InvestmentCard.tsx

// Functions: camelCase
calculatePoints()
getUserInvestments()

// Constants: SCREAMING_SNAKE_CASE
MAX_INVESTMENT_AMOUNT
DEFAULT_USER_LEVEL_MULTIPLIER
```

### Structure Projet
```
apps/
├── mobile/
│   ├── src/
│   │   ├── components/    # Composants réutilisables
│   │   ├── screens/      # Écrans de l'app
│   │   ├── services/     # Services API
│   │   ├── hooks/        # Custom hooks
│   │   └── utils/        # Utilitaires
├── web/
│   ├── src/
│   │   ├── routes/       # TanStack Router file-based routing
│   │   ├── components/   # Composants UI
│   │   ├── lib/          # Utilitaires & config
│   │   ├── server/       # Server functions
│   │   └── styles/       # Styles globaux
└── api/
    ├── src/
    │   ├── routers/      # tRPC routers
    │   ├── services/     # Business logic
    │   ├── db/           # Database & Prisma
    │   └── utils/        # Helper functions
```

## 🔄 Workflow Développement

### Git Flow
1. **Feature branch** : `git checkout -b feature/user-authentication`
2. **Development** : Code + tests + documentation
3. **Pre-commit** : Lint + format + type check
4. **Pull Request** : Code review + CI checks
5. **Merge** : Squash merge vers `main`
6. **Deploy** : Auto-deploy staging + manual production

### Conventional Commits
```bash
feat: add user authentication with Vercel Edge Functions
fix: resolve investment calculation edge case
docs: update API documentation for points system
refactor: simplify database query logic
test: add E2E tests for investment flow
```

## 🧪 Testing Strategy

### Test Pyramid
- **E2E** : Critical user journeys (5-10 tests)
- **Integration** : API routes + database (50+ tests)
- **Unit** : Business logic + utilities (200+ tests)

### Coverage Targets
- **Statements** : >90%
- **Branches** : >85%
- **Functions** : >90%
- **Lines** : >90%

## 🔗 Liens Connexes

- [🔧 03-Technical](../03-technical/) - Architecture et stack technique
- [📱 04-Specifications](../04-specifications/) - Spécifications d'implémentation
- [📅 07-Project-Management](../07-project-management/) - Planning développement
- [📦 05-Operations](../05-operations/) - DevOps et déploiement

## 📚 Ressources Utiles

### Documentation
- [Expo SDK 53](https://docs.expo.dev/) - Mobile development
- [Vercel Edge Functions](https://tanstack.com/start/latest/docs) - Web framework
- [tRPC v11](https://trpc.io/docs) - Type-safe APIs
- [Prisma v6](https://www.prisma.io/docs) - Database ORM

### Communities
- **Discord** : Expo, TanStack, tRPC communities
- **GitHub** : Framework repositories et discussions
- **Stack Overflow** : Questions techniques

---
*Section maintenue par : Dev Team | Dernière révision : 2025-01-XX*