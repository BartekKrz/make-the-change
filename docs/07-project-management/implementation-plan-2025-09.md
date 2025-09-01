# Plan d’Implémentation — Web, Admin, Mobile (sept. 2025)

## Objectifs
- V1 Admin (gestion projets/produits/commandes, ajustements points).
- MVP e‑commerce web (catalogue → checkout Stripe/points → commandes → points).
- Base mobile Expo (catalogue, auth, achat, consultation points).

## Périmètre technique
- API: tRPC via Next Route Handlers (routers dans `packages/api`).
- Auth: Supabase (SSR cookies web, JWT mobile), RLS.
- Paiements: Stripe (Payment Intents, Customer Portal abonnements), webhooks Next.
- Stock: hybrid stock/dropship (héros micro‑stock gérés chez MTC).

## Phasage (6–8 semaines)

### Semaine 1 — Fondations + Auth
- Finaliser consolidation API (`packages/api`), tests smoke.
- Auth web (admin login Server Actions) + middleware admin.
- Supabase RLS policies (lecture user‑scoped) — checklist.

### Semaine 2 — Produits & Catalogue
- Router `products` (list/bySlug/search/filters/tiers, featured).
- Pages web: liste produits, détail produit (affichage points, disponibilité, images).
- Seed minimal produits (HABEEBEE/ILANGA) en dev.

### Semaine 3 — Panier & Pricing
- Router `pricing.quote(items)` (subtotal/total points, taxes si besoin).
- Panier web: add/remove/update, persistance locale, recalcul quote.
- UX mobile: hooks React Query équivalents.

### Semaine 4 — Checkout Points & Stripe
- Router `orders.create`, `orders.confirm` (POINTS), `orders.createPaymentIntent` (Stripe).
- Server Action web pour checkout points (redirection confirm).
- Route webhook Stripe: transition order, award points (`points_transactions`).

### Semaine 5 — Profil & Historique
- Router `points.balance`, `points.history (cursor)`.
- Dashboard compte web: solde points, historisation, commandes récentes.
- Admin: liste commandes + statuts.

### Semaine 6 — Admin Produits & Stock
- Admin produits (CRUD, images, featured, tiers min), gestion inventaire héros.
- Stock movements (réservations lors création commande, libération annulation).
- Exports CSV basiques.

### Semaine 7 — Investissements (Adoptions)
- Router `investments.createAdoption` (+ calcul points), liaison order.
- Page projet web (ruche/olivier) avec CTA adoption → checkout.
- Points earned (earned_purchase) + détails projet dans compte.

### Semaine 8 — Mobile Base (Expo)
- Expo app: auth Supabase, liste produits, détail, init checkout (Stripe PaymentSheet), consultation points.
- Upload Storage (prototype terrain: photo ruche + meta), sécurisation bucket.

## Incréments qualité
- Tests unitaires (routers, calculs points), E2E (checkout happy‑path), monitoring basique.
- Observabilité: logs tRPC onError, métriques simples (to‑be).

## Risques & mitigations
- Paiements: sandbox Stripe + webhooks en dev → retries & idempotency keys.
- Stock: race conditions → transactions SQL / `quantity_reserved` + triggers.
- Mobile: CORS & auth → header Bearer, CORS route `/api/trpc` whitelist.

## Livrables
- Routers `products`, `orders`, `investments`, `points` dans `packages/api`.
- Pages web (catalog/product/cart/checkout/account) + admin (produits/commandes).
- Webhooks Stripe, allocations points, historique points.
- Base Expo RN (auth, liste, achat, points).
