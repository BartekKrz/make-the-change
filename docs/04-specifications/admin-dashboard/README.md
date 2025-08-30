# Admin Dashboard - Vue d'Ensemble

**OBJECTIF**: Interface administrative complète pour gérer projets, utilisateurs, produits et commandes selon la stratégie « Admin‑First ».

## Stratégie Admin‑First

L'admin dashboard permet de créer et gérer le contenu avant que les fonctionnalités de consommation mobile soient prêtes, éliminant les blocages de développement.

## Structure

- **MVP** (`/mvp/`) — Fonctionnalités essentielles Phase 1
- **V1** (`/v1/`) — Fonctionnalités avancées Phase 2

## Navigation Rapide

### MVP Critique
- [Spécifications complètes MVP](./mvp/README.md) — Vue d'ensemble
- [Projects CRUD](./mvp/projects/projects.md) — P0 URGENT
- [Products CRUD](./mvp/products/products.md) — P0 URGENT
- [Users Management](./mvp/users/users.md) — P1 IMPORTANT

### Architecture
- **Backend**: tRPC v11 (Edge) sur Vercel
- **Frontend**: Next.js 15.5 (App Router) avec shadcn/ui v2
- **Database**: Supabase avec RLS
- **Auth**: Supabase Auth v5

## Objectifs Métriques

- **Efficacité**: <10 min pour créer un projet
- **Performance**: <2 s pour une recherche complexe
- **Usabilité**: <30 min d'onboarding admin

---

Interface admin moderne et efficace pour gérer l'écosystème Make the CHANGE.

