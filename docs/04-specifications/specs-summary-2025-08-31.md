# Specs Summary — Admin, E‑commerce Web, Mobile (2025‑08‑31)

> Consolidation des spécifications existantes (lire les docs sources pour le détail UI/UX). Ceci sert de carte "quoi implémenter" et "dans quel ordre".

## Admin Dashboard — MVP (Semaines 1‑16)
- Auth admin (roles/permissions, session SSR): docs/04-specifications/admin-dashboard/mvp/auth/auth.md:1
- Projets (CRUD, statuts, partenaires, KPIs): docs/04-specifications/admin-dashboard/mvp/projects/projects.md:1
- Produits (catalogue points, tiers min, images, featured): docs/04-specifications/admin-dashboard/mvp/products/products.md:1
- Commandes (statuts, fulfillment, export): docs/04-specifications/admin-dashboard/mvp/orders/orders.md:1
- Utilisateurs (KYC, points, niveaux, historiques): docs/04-specifications/admin-dashboard/mvp/users/README.md:1

API tRPC (prefix `admin.*`)
- admin.auth.login, admin.auth.me
- admin.projects.(list|create|update|archive)
- admin.products.(list|create|update|uploadImage|feature|inventoryAdjust)
- admin.orders.(list|detail|update_status|add_note|export)
- admin.users.(list|detail|adjust_points)

## E‑commerce Web — MVP (Phase 2/3)
- Catalogue: liste/filtre/tri + page produit (points affichés): docs/04-specifications/ecommerce-site/mvp/README.md:1
- Panier: quote points, mise à jour quantités, persistance locale: docs/04-specifications/ecommerce-site/mvp/README.md:184
- Checkout: paiement points OU Stripe modal (Payment Intents): docs/04-specifications/ecommerce-site/mvp/README.md:185
- Compte: solde points, commandes, investissements, activité: docs/04-specifications/ecommerce-site/mvp/account/dashboard.md:5

API tRPC (prefix `ecommerce.*`)
- products.(list|bySlug|search|related)
- pricing.quote({ items[] })
- orders.(create|confirmPoints|createPaymentIntent|byId)
- points.(balance|history)
- investments.(createAdoption, listByUser)

## Mobile App (Expo) — MVP (Semaines 9‑12)
- Auth Supabase (persist session), Dashboard adaptatif: docs/04-specifications/mobile-app/mvp/README.md:1
- Parcours projet → conversion (investment/adoption): docs/04-specifications/mobile-app/mvp/flows/project-detail.md:1
- Tunnel paiement Stripe (PaymentSheet): docs/04-specifications/mobile-app/mvp/flows/payment-tunnel.md:1
- Récompenses/Points (catalogue, solde, historique): docs/04-specifications/mobile-app/mvp/navigation/rewards.md:1

API Consommée (mêmes endpoints tRPC que web)
- products.*, pricing.quote, orders.*, points.*, investments.*
- Auth header `Authorization: Bearer <token>` (context déjà en place)

## App Terrain (Ruches) — Alpha
- Upload photos ruches (Storage, RLS) + métadonnées (projet, date, coordonnées)
- Update statut ruche (health, production, interventions)
- Modération admin côté dashboard

API à ajouter
- field.hives.(updateStatus|uploadPhotoSignedUrl)
- admin.field.(approvePhoto|rejectPhoto)

## Cross‑Cutting
- Points: 1pt = 1€, `points_transactions` (earn/spend), solde `users.points_balance` cohérent après chaque mutation.
- Stock: `inventory` + `stock_movements` (reserve/release), triggers SQL pour cohérence.
- Paiements: Stripe Webhooks → ordre confirmé, points crédités, email de confirmation.
- Sécurité: RLS + service role côté serveur, validation Zod systématique.

## Backlog initial des endpoints (packages/api)
1) products: list/bySlug/search
2) pricing: quote
3) orders: create/confirmPoints/createPaymentIntent/byId
4) points: balance/history
5) investments: createAdoption/listByUser
6) admin.orders: list/detail/update_status/export
7) admin.products: list/create/update/inventoryAdjust

## Références clés
- docs/NAVIGATION-INDEX.md:1
- docs/03-technical/database-schema.md:1
- docs/04-specifications/admin-dashboard/mvp/README.md:1
- docs/04-specifications/ecommerce-site/mvp/README.md:1
- docs/04-specifications/mobile-app/mvp/README.md:1
