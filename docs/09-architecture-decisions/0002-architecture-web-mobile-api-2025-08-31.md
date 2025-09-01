# ADR-0002 — Architecture Web/Mobile/API unifiée (2025-08-31)

## Contexte
- Migration Next.js 15.5 (App Router, Turbopack) avec Server Actions.
- Auth/DB/Storage via Supabase (SSR `@supabase/ssr`, JWT mobile).
- Besoins: Admin Dashboard web, site e‑commerce web, app mobile Expo (e‑commerce), app terrain (photos/status ruches).
- Objectif: unifier l’API pour web + mobile, réduire la dette et les doublons.

## Décision
- API unique tRPC servie par Next Route Handlers (`/app/api/trpc`) — pas d’Express.
- Colocation des route handlers côté web; routers partagés dans `packages/api`.
- Garder React Query + `@trpc/react-query` pour les données; utiliser Server Actions uniquement pour les formulaires web simples (login, actions admin nécessitant redirect/cookies).
- Supabase pour auth (cookies SSR web, JWT mobile), DB PostgreSQL (RLS), Storage (photos terrain), Realtime.
- Stripe pour paiements (e‑commerce, abonnements), webhooks en Next Route Handlers.

## Mise en œuvre réalisée
- Consolidation tRPC:
  - `packages/api`: `appRouter`, `auth`, `users`, `createTRPCContext` (vérif JWT Supabase).
  - `apps/web/src/app/api/trpc/[trpc]/route.ts` importe depuis `@make-the-change/api`.
  - Suppression `apps/api` (Express) et des doublons `apps/web/src/lib/trpc-server.ts` / `trpc-context.ts`.
- Login admin: remplacement TanStack Form → `<form action={formAction}>` + `useActionState`.
- Devtools React Query chargés uniquement en dev (dynamic import, `ssr:false`).

## Modèle Données (extraits clés)
- E‑commerce (points): `products` (`price_points`, hybrid stock/dropship), `orders`/`order_items`, `inventory` (héros micro‑stock), `points_transactions` (audit complet), `subscriptions` (Ambassadeur), `investments` (adoption ruche/olivier/parcelle).
- 1 point = 1€ de valeur produit; transactions positives (earn) / négatives (spend) avec `balance_after` et références (order/subscription/investment).

## Sécurité
- RLS: accès par `user_id = auth.uid()` pour `orders`, `investments`, `points_transactions` en lecture; écritures par service role côté serveur.
- Webhooks Stripe protégés par secret; validations strictes Zod côté routers/Server Actions.

## Patterns d’implémentation
- Web UI:
  - Formulaires simples: Server Actions + Zod + `useActionState`.
  - Données list/CRUD: tRPC + React Query.
- Mobile (Expo): `@trpc/client` + React Query, header `Authorization: Bearer <token>`; upload direct Storage (signed URL si besoin).
- Admin: pages protégées (middleware), CRUD projets/produits, gestion stock, commandes, points (type `adjustment_admin`).

## Alternatives considérées
- Express dédié → rejeté (complexité déploiement, duplication de routers, pas nécessaire avec Route Handlers Next).
- 100% Server Actions pour data → rejeté pour mobile (Web‑only, pas de transport universel).

## Impacts
- Réduction dette (un seul router partagé), onboarding plus simple, types end‑to‑end.
- Tests unitaires mis à jour pour référencer `@make-the-change/api`.

## Suivi
- Étendre routers `products`, `orders`, `investments` (+ Stripe PI + webhook) dans `packages/api`.
- Pages e‑commerce web (catalog/product/cart/checkout) consommant ces endpoints.

## Références
- docs/NAVIGATION-INDEX.md:1
- docs/03-technical/database-schema.md:1
- docs/04-specifications/ecommerce-site/mvp/README.md:1
- docs/04-specifications/admin-dashboard/mvp/README.md:1
- docs/04-specifications/mobile-app/mvp/README.md:1
