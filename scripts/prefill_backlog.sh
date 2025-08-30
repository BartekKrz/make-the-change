#!/usr/bin/env bash
set -euo pipefail

# Prefill backlog TSVs based on current issues and labels.
# - backlog/updates.tsv (with remove_labels suggestions to enforce single Area)
# - backlog/project_fields.tsv (with Status / Priority / Size suggestions)

need() { command -v "$1" >/dev/null 2>&1 || { echo "Missing $1" >&2; exit 1; }; }
need gh
need jq

repo=$(git config --get remote.origin.url | sed -E 's#^git@github.com:(.*)\.git$#\1#; s#^https?://github.com/##; s#\.git$##')
[ -n "$repo" ] || { echo "Cannot detect repo" >&2; exit 1; }
mkdir -p backlog

# Fetch open issues with labels & assignees
read -r -d '' GQL <<'EOF'
query($q:String!) {
  search(query: $q, type: ISSUE, first: 100) {
    nodes {
      __typename
      ... on Issue {
        number
        title
        labels(first: 100) { nodes { name } }
        assignees(first: 10) { nodes { login } }
      }
    }
  }
}
EOF

json=$(gh api graphql -f query="$GQL" -F q="repo:$repo is:issue is:open")

# Precedence for Area labels (keep first if multiple present)
areas_order='["frontend-web","backend-api","database","frontend-mobile","devops"]'

# Build updates.tsv with remove_labels suggestions and P0 auto-assignee if empty
{
  echo -e "number\ttitle\tlabels\tassignees\tbody_file\tremove_labels\tremove_assignees"
  echo "$json" | jq -r --argjson order "$areas_order" '
    .data.search.nodes[] | . as $i |
    ($i.labels.nodes | map(.name)) as $labs |
    ($i.assignees.nodes | map(.login)) as $ass |
    # area detection
    ($labs | map(select(.=="frontend-web" or .=="backend-api" or .=="database" or .=="frontend-mobile" or .=="devops"))) as $areas |
    # choose primary area per precedence
    ([$order[] | select( . as $x | $areas | index($x) )][0]) as $primary |
    ($areas - [ $primary ]) as $extra_areas |
    # priority present?
    (if ($labs | index("P0")) then "P0" else if ($labs | index("P1")) then "P1" else if ($labs | index("P2")) then "P2" else null end) as $prio |
    # assignee suggestion: if P0 and none, suggest BartekKrz
    (if ($prio=="P0" and ($ass|length)==0) then "BartekKrz" else "" end) as $ass_suggest |
    [
      $i.number,
      $i.title,
      "",                 # add-labels (leave empty by default)
      $ass_suggest,
      "",                 # body_file
      ($extra_areas | join(",")),
      ""                  # remove_assignees
    ] | @tsv'
} > backlog/updates.tsv

# Build project_fields.tsv with Status/Priority/Size suggestions
{
  echo -e "number\tstatus\tpriority\tsize\titeration"
  echo "$json" | jq -r '
    .data.search.nodes[] | . as $i |
    ($i.labels.nodes | map(.name)) as $labs |
    ($i.assignees.nodes | map(.login)) as $ass |
    # status mapping heuristic
    (if ($labs | index("status-deployed-staging") or ($labs | index("status-testing"))) then "In review"
     elif ($labs | index("status-blocked") or ($labs | index("status-needs-info"))) then "Backlog"
     elif (($ass|length)>0) then "In progress"
     else "Backlog" end) as $status |
    # priority mapping
    (if ($labs | index("P0")) then "P0" else if ($labs | index("P1")) then "P1" else if ($labs | index("P2")) then "P2" else "" end) as $priority |
    # size from effort labels
    (if ($labs | index("effort-epic")) then "XL"
     elif ($labs | index("effort-complex")) then "L"
     elif ($labs | index("effort-standard")) then "M"
     elif ($labs | index("effort-quick-win")) then "S"
     else "" end) as $size |
    [ $i.number, $status, $priority, $size, "" ] | @tsv'
} > backlog/project_fields.tsv

echo "Prefilled: backlog/updates.tsv and backlog/project_fields.tsv"
