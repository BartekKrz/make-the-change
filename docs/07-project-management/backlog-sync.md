# Backlog Sync (Issues ↔ Project v2)

Objectif: mettre à jour rapidement les issues pour refléter la documentation et les champs du Project v2 après un changement de specs.

## Pré-requis
- GitHub CLI (`gh`) connecté: `gh auth status`
- `jq` installé

## 1) Exporter les issues ouvertes

```sh
bash scripts/export_issues.sh
# -> backlog/issues-export.tsv
```

Utilisez ce TSV pour confronter avec la documentation (docs/02-product, docs/04-specifications, etc.).

## 2) Préparer les mises à jour d’issues (titre, labels, body, assignés)

- Remplir `backlog/updates.tsv` (TSV):
  - `number` (obligatoire)
  - `title` (optionnel)
  - `labels` (virgule, optionnel)
  - `assignees` (virgule, optionnel)
  - `body_file` (chemin .md optionnel)

```sh
bash scripts/bulk_update_issues.sh backlog/updates.tsv
```

## 3) Mettre à jour les champs du Project v2

- Remplir `backlog/project_fields.tsv` (TSV):
  - `number` (issue)
  - `status` (Backlog, Ready, In progress, In review, Done)
  - `priority` (P0, P1, P2)
  - `size` (XS, S, M, L, XL)
  - `iteration` (nom de l’iteration si configurée)

```sh
# Par défaut, PROJECT_NUMBER=3
PROJECT_NUMBER=3 bash scripts/update_project_fields.sh backlog/project_fields.tsv
```

Le script s’assure que l’issue est présente dans le Project et met à jour les champs.

## 4) Conseils d’alignement avec la documentation
- Faites une passe par EPIC → Stories → Tâches:
  1. Vérifiez les EPICs (labels: `epic`, effort-epic) et mettez `Status`/`Priority`.
  2. Mettez à jour les Stories pour coller aux specs (titres, critères d’acceptation via `body_file`).
  3. Vérifiez l’aire (exactement 1 entre `frontend-mobile`, `frontend-web`, `backend-api`, `database`, `devops`).
- Appliquez la règle de **≤ 6 labels** (voir `docs/07-project-management/labeling-standard.md`).
- Affectez un **assignee** pour toutes les P0/P1.
- Renseignez `Iteration` si vous suivez des sprints.

## 5) Vérifier
```sh
bash scripts/analyze_issues.sh  # si vous avez un token
# ou utilisez gh + queries existantes pour un spot-check
```

