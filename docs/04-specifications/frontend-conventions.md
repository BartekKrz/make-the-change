# Frontend Conventions – Make the CHANGE

Uniformiser les spécifications frontend avec le backend pour un contrat clair et sans adaptateurs.

## Nommage
- Utiliser camelCase partout côté frontend (composants, contrats, interfaces).
  - Exemples: `pointsBalance`, `fundingProgress`, `postalCode`, `eurEquivalent`.
- Le schéma SQL reste en snake_case; la couche serveur mappe vers camelCase DTO.

## Namespaces tRPC
- Préférer les routers backend tels que définis:
  - `investments.list` (au lieu de `ecommerce.investments.getUserInvestments`)
  - `analytics.export` (pour exports, rapport = 'investments'/'points'/...)
  - `orders.cart.get/create/byId/list`, `products.list/bySlug`, `projects.list/bySlug/nearby`
  - Partenaires: `partners.app.*` (login/me/projects/createUpdate/uploadMedia/myUpdates)

## Auth
- Endpoints:
  - `auth.register` (input inclut `marketingConsent`)
  - `auth.login`
  - `auth.resetPassword` (envoi email)
  - `auth.confirmPasswordReset` (confirmation via token)
- `birthDate` collectée côté UI → enregistrée via `users.update` (profil), pas dans `auth.register`.

## Statuts Projets
- Statuts alignés backend: `'active' | 'funded' | 'closed' | 'suspended'`.
- L'état "draft" est un état d'édition UI, pas un statut backend.

## Fulfillment
- Terme standard: `'dropship'` (pas `dropshipping`).
- Propriété: `fulfillment: 'stock' | 'dropship'`.

## DTOs
- S’appuyer sur `docs/03-technical/schemas/response-models.md` pour les shapes officielles.

---
Ces conventions guident la mise à jour des spécs UI pour rester strictement cohérentes avec l’API.
