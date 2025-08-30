# Plan d’étiquetage standardisé (Labels)

## A. Aires (exclusif, 1 minimum)
- `frontend-mobile` — App Expo/React Native
- `frontend-web` — App Next.js (Admin/E‑commerce/Public)
- `backend-api` — tRPC, webhooks, logique serveur
- `database` — Schéma, requêtes, migrations
- `devops` — CI/CD, Vercel, infra

## B. Domaines (0–3)
- `payments`, `ecommerce`, `analytics`, `security`, `integrations`, `gamification`, `loyalty`, `social-proof`, `automation`, `design-ux`

## C. Priorité (exactement 1)
- `P0` (critique), `P1` (élevée), `P2` (normale)

## D. Effort (exactement 1)
- `effort-quick` (≤3 j), `effort-medium` (4–7 j), `effort-complex` (1–2 sem), `effort-epic` (3–6 sem)

## E. Impact (optionnel)
- `impact-critical`, `impact-high`

## F. Statut (1)
- `ready`, `in-progress`, `blocked`, `needs-spec`, `needs-design`

## Règles
- Max 6 labels/issue. Toujours 1 Aire + 1 Priorité + 1 Effort.
- Les EPICs portent des labels haut niveau (Aire, Impact, effort-epic, `epic`). Le delivery passe par sous‑issues.
- Les PRs doivent reprendre les labels principaux de l’issue.

## Automatisation
- CI terminologie: `.github/workflows/lint-terms.yml` bloque les termes interdits (voir `docs/GLOSSARY.md`).
- Templates: `.github/ISSUE_TEMPLATE/*` et `.github/pull_request_template.md` pré‑étiquettent et imposent les checklists.

