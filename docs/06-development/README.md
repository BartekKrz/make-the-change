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
| [tdd-strategy.md](./tdd-strategy.md) | Stratégie TDD pragmatique 3 niveaux | ✅ Terminé | 2025-01-XX |
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
- **Unit/Integration** : Vitest + Testing Library + MSW
- **E2E Tests** : Playwright
- **Coverage** : c8 (intégré à Vitest)

## 🤖 Snippets IA dorés (guides d’implémentation)

- RSC + Hydratation Query:
  - Récupère les données côté serveur via `appRouter.createCaller(ctx)` (pas d’HTTP, types 100%).
  - Préhydrate TanStack Query avec `dehydrate(qc)` et passe `initialData` aux `useQuery` côté client.
  - Pour les listes publiques, utilise `revalidate`/`tags` côté Next.

- Mutations tRPC + invalidations:
  - Côté client: `useMutation` + `queryClient.invalidateQueries(['key'])` (optimistic si besoin).
  - Côté serveur: après mutation via Server Action, appelle `revalidateTag('key')` si la page RSC est cachée.

- Conventions clés Query:
  - Préfixe stable: `['resource', { filters… }]`.
  - Pas d’objets non‑sérialisables dans les clés.
  - Définis `staleTime` raisonnable (p.ex. 60s pour listes publiques).

- Accès DB Edge‑safe:
  - Utilise `@supabase/supabase-js` (HTTP) avec header `Authorization` pour RLS.
  - Évite Prisma/clients TCP en Edge.

- Sécurité/Auth:
  - Crée un contexte tRPC avec `cookies()/headers()`.
  - `protectedProcedure` vérifie la session Supabase avant tout accès.

Ces patterns maximisent la cohérence web/mobile (tRPC + TanStack Query) et facilitent l’assistance IA (snippets stables et réutilisables).

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
│   │   ├── app/          # Next.js App Router
│   │   ├── components/   # Composants UI
│   │   ├── lib/          # Utilitaires & config
│   │   ├── server/       # Server functions
│   │   └── styles/       # Styles globaux
└── api/
    ├── src/
    │   ├── routers/      # tRPC routers
    │   ├── services/     # Business logic
    │   ├── db/           # Database (Supabase utils & SQL)
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
 feat: add user authentication with Next.js (App Router)
fix: resolve investment calculation edge case
docs: update API documentation for points system
refactor: simplify database query logic
test: add E2E tests for investment flow
```

## 🧪 Testing Strategy

**📖 Voir la stratégie complète : [TDD Strategy](./tdd-strategy.md)**

### Approche 3 Niveaux
- **🔴 Critique (TDD Obligatoire)** : Business logic, API, sécurité - Coverage 95%+
- **🟡 Important (TDD Conditionnel)** : Composants complexes, hooks - Coverage 80%+
- **🟢 Standard (Tests Après)** : UI pure, layouts - Coverage 60%+

### Stack Technique
- **Unit/Integration** : Vitest + Testing Library + MSW
- **E2E** : Playwright sur parcours critiques
- **Mocking** : MSW pour isolation API

## 🔗 Liens Connexes

- [🔧 03-Technical](../03-technical/) - Architecture et stack technique
- [📱 04-Specifications](../04-specifications/) - Spécifications d'implémentation
- [📅 07-Project-Management](../07-project-management/) - Planning développement
- [📦 05-Operations](../05-operations/) - DevOps et déploiement

## 📚 Ressources Utiles

### Documentation
- [Expo SDK 53](https://docs.expo.dev/) - Mobile development
- [Next.js (App Router)](https://nextjs.org/docs) - Web framework
- [tRPC v11](https://trpc.io/docs) - Type-safe APIs
- [Supabase](https://supabase.com/docs) - Database/Auth/Storage

### Communities
- **Discord** : Expo, TanStack, tRPC communities
- **GitHub** : Framework repositories et discussions
- **Stack Overflow** : Questions techniques

---
*Section maintenue par : Dev Team | Dernière révision : 2025-01-XX*
